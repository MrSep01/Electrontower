
/*! Electron Towers — Ionization Removal Fix (ns before (n-1)d)
 *  Drop-in patch: ensures cations remove electrons from highest n first (within same n, higher ℓ first).
 *  Works with Study/Game, ghosting, legalPlacement, and exceptions toggle.
 *  Load AFTER the main app scripts (and after exceptions add-on if present).
 */
(function(){
  function onReady(fn){ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  function subInfo(sub){
    var n = parseInt(sub[0],10);
    var ltr = sub[1];
    var lmap = {s:0,p:1,d:2,f:3};
    var orbitals = {s:1,p:3,d:5,f:7}[ltr] || 1;
    return { n:n, letter:ltr, l:lmap[ltr], orbitals:orbitals, capacity: (orbitals*2) };
  }
  function cap(sub){ return subInfo(sub).capacity; }

  function neutralFill(totalE, useExceptions, Z){
    var ORDER = window.ORDER || ["1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"];
    var counts = {}; for (var i=0;i<ORDER.length;i++){ counts[ORDER[i]] = 0; }
    var left = Math.max(0, totalE|0);
    for (var oi=0; oi<ORDER.length && left>0; oi++){
      var sub = ORDER[oi], add = Math.min(left, cap(sub));
      counts[sub] = add; left -= add;
    }
    if (useExceptions && window.EXCEPTIONS && window.EXCEPTIONS[Z]){
      var ex = window.EXCEPTIONS[Z], s = ex.s, d = ex.d;
      counts[s] = counts[s]||0; counts[d] = counts[d]||0;
      // Move from s→d until d reaches target or s hits s_final
      while (counts[d] < ex.d_target && counts[s] > ex.s_final){
        counts[d] += 1; counts[s] -= 1;
      }
    }
    return counts;
  }

  function removeForCation(counts, q){
    var ORDER = Object.keys(counts);
    function key(sub){ var si=subInfo(sub); return si.n*10 + si.l; } // higher n wins; within same n, higher l wins (p>s, d>p, f>d)
    while (q > 0){
      var best = null, bestKey = -1;
      for (var i=0;i<ORDER.length;i++){
        var sub = ORDER[i], c = counts[sub]||0;
        if (c <= 0) continue;
        var k = key(sub);
        if (k > bestKey){ bestKey = k; best = sub; }
      }
      if (!best) break; // nothing to remove
      counts[best] -= 1;
      q -= 1;
    }
    return counts;
  }

  function computeTarget(Z, ion, useExceptions){
    Z = (Z|0); ion = (ion|0);
    if (ion <= 0){
      // Neutral or anion: fill to Z - ion (e.g., ion -2 => Z+2). Do NOT apply neutral exceptions for anions by default.
      var totalE = Z - ion; // subtract negative adds
      return neutralFill(totalE, /*useExceptions*/ ion===0 && !!useExceptions, Z);
    } else {
      // Cations: fill neutral (respect exceptions if enabled), then remove from highest n first
      var base = neutralFill(Z, !!useExceptions, Z);
      return removeForCation(base, ion);
    }
  }

  function totalPlacedIn(sub){
    var b = window.state && window.state.building && window.state.building[sub];
    if (!b) return 0;
    var s=0; for (var i=0;i<b.length;i++){ s += (b[i] && b[i].length) ? b[i].length : 0; }
    return s;
  }

  function recomputeTargetsAndRefresh(){
    if (!window.state) return;
    var Z = window.state.targetZ||1;
    var ion = window.state.ionCharge||0;
    var useEx = !!(window.state && window.state.exceptionsEnabled);
    window.TARGET_COUNTS = computeTarget(Z, ion, useEx);
    // Re-plan ghost & info
    if (typeof window.refreshAufbauFocus === 'function') window.refreshAufbauFocus();
    if (typeof window.planStudyGhost === 'function') window.planStudyGhost();
  }

  onReady(function(){
    // Compute initial target
    recomputeTargetsAndRefresh();

    // Patch hasVacancy to respect TARGET_COUNTS
    if (typeof window.hasVacancy === 'function' && !window._hasVacancy_orig){
      window._hasVacancy_orig = window.hasVacancy;
      window.hasVacancy = function(sub){
        var target = (window.TARGET_COUNTS && (window.TARGET_COUNTS[sub] != null)) ? window.TARGET_COUNTS[sub] : cap(sub);
        var placed = totalPlacedIn(sub);
        return placed < target;
      };
    }

    // Patch legalPlacement to block overfilling a subshell beyond ion target (unless Sandbox)
    if (typeof window.legalPlacement === 'function' && !window._legalPlacement_orig2){
      window._legalPlacement_orig2 = window.legalPlacement;
      window.legalPlacement = function(wing, index, spin){
        var res = window._legalPlacement_orig2(wing, index, spin);
        if (res && res.ok === false) return res;
        // Additional ion-target constraint
        var sandboxOn = false;
        try { var sb = document.getElementById('sandboxToggle'); sandboxOn = !!(sb && sb.checked); } catch(e){}
        var targetCounts = window.TARGET_COUNTS || {};
        var tHere = (targetCounts[wing] != null) ? targetCounts[wing] : cap(wing);
        var currentInSub = totalPlacedIn(wing);
        if (currentInSub >= tHere && !sandboxOn){
          return { ok:false, rule:"Ionization", msg:"Target occupancy reached here for current ion; choose the next subshell." };
        }
        return { ok:true };
      };
    }

    // Hook element/ion changes to recompute targets
    function safe(id, type, fn){
      var el = document.getElementById(id); if (el && !el._ionfix){
        el.addEventListener(type, function(){ setTimeout(recomputeTargetsAndRefresh, 0); });
        el._ionfix = true;
      }
    }
    // Ion +/− buttons
    safe('ionMinus','click',recomputeTargetsAndRefresh);
    safe('ionPlus','click',recomputeTargetsAndRefresh);
    // Mode switches and game resets can rebuild state
    safe('modeStudy','click',recomputeTargetsAndRefresh);
    safe('modeGame','click',recomputeTargetsAndRefresh);
    safe('resetBtn','click',recomputeTargetsAndRefresh);
    safe('newGameBtn','click',recomputeTargetsAndRefresh);
    // Exceptions toggles (both study/game versions if present)
    ['exceptionsToggleGame','exceptionsToggleStudy'].forEach(function(id){ safe(id,'change',recomputeTargetsAndRefresh); });

    // Recompute when changing element (tile click)
    document.addEventListener('click', function(e){
      var t = e.target.closest ? e.target.closest('.ptile') : null;
      if (t && t.dataset && t.dataset.z){ setTimeout(recomputeTargetsAndRefresh, 0); }
    }, true);

    // Expose for debugging
    window._ionfix_computeTarget = computeTarget;
  });
})();
