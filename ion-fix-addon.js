
/*! Electron Towers — Ionization Removal Fix (ns before (n-1)d)
 *  Drop-in patch: ensures cations remove electrons from highest n first (within same n, higher ℓ first).
 *  Works with Study/Game, ghosting, legalPlacement, and exceptions toggle.
 *  Load AFTER the main app scripts (and after exceptions add-on if present).
 */
(function(){
  function onReady(fn){ 
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn); 
      } else { 
        fn(); 
      }
    } catch(e) {
      console.error('Ion fix addon ready error:', e);
    }
  }
  
  function subInfo(sub){
    try {
      var n = parseInt(sub[0],10);
      var ltr = sub[1];
      var lmap = {s:0,p:1,d:2,f:3};
      var orbitals = {s:1,p:3,d:5,f:7}[ltr] || 1;
      return { n:n, letter:ltr, l:lmap[ltr], orbitals:orbitals, capacity: (orbitals*2) };
    } catch(e) {
      console.error('Sub info error:', e);
      return { n:1, letter:'s', l:0, orbitals:1, capacity:2 };
    }
  }
  
  function cap(sub){ 
    try {
      return subInfo(sub).capacity; 
    } catch(e) {
      console.error('Capacity error:', e);
      return 2;
    }
  }

  function neutralFill(totalE, useExceptions, Z){
    try {
      var ORDER = window.ORDER || ["1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"];
      var counts = {}; 
      for (var i=0;i<ORDER.length;i++){ 
        counts[ORDER[i]] = 0; 
      }
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
    } catch(e) {
      console.error('Neutral fill error:', e);
      return {};
    }
  }

  function removeForCation(counts, q){
    try {
      var ORDER = Object.keys(counts);
      function key(sub){ 
        try {
          var si=subInfo(sub); 
          return si.n*10 + si.l; 
        } catch(e) {
          console.error('Key calculation error:', e);
          return 0;
        }
      } // higher n wins; within same n, higher l wins (p>s, d>p, f>d)
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
    } catch(e) {
      console.error('Remove for cation error:', e);
      return counts;
    }
  }

  function computeTarget(Z, ion, useExceptions){
    try {
      Z = (Z|0); ion = (ion|0);
      if (ion <= 0){
        // Neutral or anion: fill to Z - ion (e.g., ion -2 => Z+2). Do NOT apply neutral-exception hacks for anions by default.
        var totalE = Z - ion; // subtract negative adds
        return neutralFill(totalE, /*useExceptions*/ ion===0 && !!useExceptions, Z);
      } else {
        // Cations: fill neutral (respect exceptions if enabled), then remove from highest n first
        var base = neutralFill(Z, !!useExceptions, Z);
        return removeForCation(base, ion);
      }
    } catch(e) {
      console.error('Compute target error:', e);
      return {};
    }
  }

  function totalPlacedIn(sub){
    try {
      var b = window.state && window.state.building && window.state.building[sub];
      if (!b) return 0;
      var s=0; 
      for (var i=0;i<b.length;i++){ 
        s += (b[i] && b[i].length) ? b[i].length : 0; 
      }
      return s;
    } catch(e) {
      console.error('Total placed in error:', e);
      return 0;
    }
  }

  function recomputeTargetsAndRefresh(){
    try {
      if (!window.state) return;
      var Z = window.state.targetZ||1;
      var ion = window.state.ionCharge||0;
      var useEx = !!(window.state && window.state.exceptionsEnabled);
      window.TARGET_COUNTS = computeTarget(Z, ion, useEx);
      // Re-plan ghost & info
      if (typeof window.refreshAufbauFocus === 'function') {
        try {
          window.refreshAufbauFocus();
        } catch(e) {
          console.error('Refresh aufbau focus error:', e);
        }
      }
      if (typeof window.planStudyGhost === 'function') {
        try {
          window.planStudyGhost();
        } catch(e) {
          console.error('Plan study ghost error:', e);
        }
      }
    } catch(e) {
      console.error('Recompute targets error:', e);
    }
  }

  // Cleanup function to prevent memory leaks
  function cleanup() {
    try {
      // Remove event listeners if they were added
      if (window._ionfix_cleanup) {
        window._ionfix_cleanup();
      }
    } catch(e) {
      console.error('Ion fix cleanup error:', e);
    }
  }

  onReady(function(){
    try {
      // Compute initial target
      recomputeTargetsAndRefresh();

      // Patch hasVacancy to respect TARGET_COUNTS
      if (typeof window.hasVacancy === 'function' && !window._hasVacancy_orig){
        window._hasVacancy_orig = window.hasVacancy;
        window.hasVacancy = function(sub){
          try {
            var target = (window.TARGET_COUNTS && (window.TARGET_COUNTS[sub] != null)) ? window.TARGET_COUNTS[sub] : cap(sub);
            var placed = totalPlacedIn(sub);
            return placed < target;
          } catch(e) {
            console.error('Has vacancy patch error:', e);
            return false;
          }
        };
      }

      // Patch legalPlacement to block overfilling a subshell beyond ion target (unless Sandbox)
      if (typeof window.legalPlacement === 'function' && !window._legalPlacement_orig2){
        window._legalPlacement_orig2 = window.legalPlacement;
        window.legalPlacement = function(wing, index, spin){
          try {
            var res = window._legalPlacement_orig2(wing, index, spin);
            if (res && res.ok === false) return res;
            // Additional ion-target constraint
            var sandboxOn = false;
            try { 
              var sb = document.getElementById('sandboxToggle'); 
              sandboxOn = !!(sb && sb.checked); 
            } catch(e){
              console.warn('Sandbox check error:', e);
            }
            var targetCounts = window.TARGET_COUNTS || {};
            var tHere = (targetCounts[wing] != null) ? targetCounts[wing] : cap(wing);
            var currentInSub = totalPlacedIn(wing);
            if (currentInSub >= tHere && !sandboxOn){
              return { ok:false, rule:"Ionization", msg:"Target occupancy reached here for current ion; choose the next subshell." };
            }
            return { ok:true };
          } catch(e) {
            console.error('Legal placement patch error:', e);
            return { ok: false, rule: 'Error', msg: 'An error occurred during validation' };
          }
        };
      }

      // Hook element/ion changes to recompute targets
      var boundElements = [];
      
      function safe(id, type, fn){
        try {
          var el = document.getElementById(id); 
          if (el && !el._ionfix){
            var handler = function(){ 
              try {
                setTimeout(recomputeTargetsAndRefresh, 0); 
              } catch(e) {
                console.error('Event handler error:', e);
              }
            };
            el.addEventListener(type, handler);
            el._ionfix = true;
            boundElements.push({ element: el, type: type, handler: handler });
          }
        } catch(e) {
          console.error('Safe event binding error:', e);
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
      ['exceptionsToggleGame','exceptionsToggleStudy'].forEach(function(id){ 
        safe(id,'change',recomputeTargetsAndRefresh); 
      });

      // Recompute when changing element (tile click)
      var tileClickHandler = function(e){
        try {
          var t = e.target.closest ? e.target.closest('.ptile') : null;
          if (t && t.dataset && t.dataset.z){ 
            setTimeout(recomputeTargetsAndRefresh, 0); 
          } 
        } catch(e) {
          console.error('Tile click handler error:', e);
        }
      };
      
      document.addEventListener('click', tileClickHandler, true);
      boundElements.push({ element: document, type: 'click', handler: tileClickHandler, useCapture: true });

      // Store cleanup function for later use
      window._ionfix_cleanup = function() {
        try {
          boundElements.forEach(function(bound) {
            if (bound.element && bound.type && bound.handler) {
              bound.element.removeEventListener(bound.type, bound.handler, bound.useCapture);
            }
          });
          boundElements.length = 0;
        } catch(e) {
          console.error('Ion fix cleanup error:', e);
        }
      };

      // Expose for debugging
      window._ionfix_computeTarget = computeTarget;
      
    } catch(e) {
      console.error('Ion fix addon initialization error:', e);
    }
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
})();
