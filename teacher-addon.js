
/*! Electron Towers — Teacher View Add‑on (Phase B)
 *  Drop‑in script: injects Teacher View drawer + instrumentation without modifying app code.
 *  Requirements: Load this AFTER the main app <script>.
 */
(function(){
  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function el(tag, attrs){ var e = document.createElement(tag); if (attrs){ for (var k in attrs){ if (k==='text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); } } return e; }
  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return ''; } }
  function uid(){ return 'run_' + Math.random().toString(36).slice(2,8) + '_' + Date.now().toString(36); }
  function dl(filename, text){
    var a = el('a'); a.href = URL.createObjectURL(new Blob([text], {type:'text/plain'}));
    a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  function toCSV(rows){
    function esc(s){ s = String(s==null?'':s); if (s.search(/[",\n]/)>=0) return '"' + s.replace(/"/g,'""') + '"'; return s; }
    var out = []; for (var i=0;i<rows.length;i++){ out.push(rows[i].map(esc).join(',')); } return out.join('\n');
  }

  // Inject styles
  var style = el('style'); style.textContent = [
    " .teacher-drawer{position:fixed;top:0;right:-420px;width:420px;max-width:92vw;height:100%;background:#1a0a35;border-left:3px solid var(--unit-border);box-shadow:-8px 0 24px rgba(0,0,0,.45);z-index:5000;display:flex;flex-direction:column;transition:right .25s ease}",
    " .teacher-drawer.open{right:0} .teacher-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:2px solid var(--unit-border);background:#240a49}",
    " .teacher-head h3{margin:0;font-size:18px} .teacher-tabs{display:flex;gap:8px;padding:10px;border-bottom:2px solid var(--unit-border)}",
    " .teacher-tab{background:#240a49;color:#fff;border:2px solid var(--unit-border);border-radius:10px;padding:8px 12px;cursor:pointer;font-weight:800}",
    " .teacher-tab.active{background:var(--kahoot-green)} .teacher-body{padding:12px;overflow:auto;flex:1;display:none} .teacher-body.active{display:block}",
    " .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0} .input{padding:8px;border:2px solid var(--unit-border);border-radius:8px;background:#12072a;color:#fff}",
    " .badge-k{display:inline-block;padding:2px 6px;border-radius:8px;font-size:12px;background:#19043a;border:2px solid #8c5cff;color:#fff;margin-right:6px}",
    " .table-min{width:100%;border-collapse:collapse} .table-min th,.table-min td{border-bottom:1px solid #3e2a7a;padding:6px 8px;font-size:12px;text-align:left}",
    " .kpi{font-size:28px;font-weight:900;color:#ffe882} .lock-note{color:#ffe882;font-weight:800}"
  ].join("");
  document.head.appendChild(style);

  // Drawer markup
  var drawer = document.createElement('aside');
  drawer.id = "teacherDrawer"; drawer.className = "teacher-drawer"; drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = '\
    <div class="teacher-head">\
      <h3>Teacher View</h3>\
      <div class="row">\
        <label class="lbl">Nickname</label><input id="tNick" class="input" placeholder="e.g., Ms. A • Period 2" style="min-width:160px"/>\
        <label class="lbl">Class Code</label><input id="tCode" class="input" placeholder="e.g., 2B" style="width:90px"/>\
        <button id="tClose" class="btn ghost">✕</button>\
      </div>\
    </div>\
    <div class="teacher-tabs">\
      <button id="tTabProjector" class="teacher-tab active">Projector</button>\
      <button id="tTabRubric" class="teacher-tab">Rubric</button>\
      <button id="tTabResults" class="teacher-tab">Results</button>\
    </div>\
    <div id="tPanelProjector" class="teacher-body active" role="region" aria-label="Projector">\
      <div class="row"><span class="lbl">Current Element:</span><span id="tElem" class="kpi">—</span></div>\
      <div class="row"><span class="lbl">Mode:</span><span id="tMode" class="badge-k">study</span><span class="lbl">Exceptions:</span><span id="tExc" class="badge-k">OFF</span></div>\
      <div class="row"><span class="lbl">Timer:</span><span id="tTimer" class="kpi">00:00</span><button id="tRandom" class="btn">Random element</button></div>\
      <div class="row"><label class="toggle small"><input id="tLock" type="checkbox"/> Lock UI</label><span class="lock-note">Locks mode, element, exceptions, hints, ion & game controls.</span></div>\
      <div class="row"><button id="tStartRound" class="btn primary">Start Round</button><button id="tEndRound" class="btn">End Round</button></div>\
    </div>\
    <div id="tPanelRubric" class="teacher-body" role="region" aria-label="Rubric">\
      <p class="mini">Auto checks update at the end of each attempt.</p>\
      <ul id="tRubricList">\
        <li><span class="badge-k" id="rComplete">❌</span> Completed with correct electron count</li>\
        <li><span class="badge-k" id="rAufbau">❌</span> No Aufbau violations</li>\
        <li><span class="badge-k" id="rPauli">❌</span> No Pauli violations</li>\
        <li><span class="badge-k" id="rHund">❌</span> Hund’s rule respected</li>\
        <li><span class="badge-k" id="rEx">❌</span> Exceptions used correctly (if applicable)</li>\
      </ul>\
    </div>\
    <div id="tPanelResults" class="teacher-body" role="region" aria-label="Results">\
      <div class="row">\
        <button id="tExportCSV" class="btn">Export CSV</button>\
        <button id="tExportJSON" class="btn">Export JSON</button>\
        <button id="tClear" class="btn ghost">Clear log</button>\
      </div>\
      <table class="table-min">\
        <thead><tr><th>Time</th><th>Nick</th><th>Mode</th><th>Elem</th><th>Ion</th><th>Exc</th><th>Moves</th><th>Score</th><th>Done</th><th>Viol(A/H/P)</th></tr></thead>\
        <tbody id="tRows"></tbody>\
      </table>\
    </div>';
  document.body.appendChild(drawer);

  // Add header button next to Help
  var right = document.querySelector('.app-header .right') || document.querySelector('.app-header');
  var btn = el('button',{id:'teacherBtn'}); btn.className='btn'; btn.textContent='Teacher View';
  if (right) right.insertBefore(btn, right.firstChild);

  var TEACH = window.TEACH = {
    logKey: 'etowers:teacher:v1',
    lockUI: false, attempts: [], current: null, nick: '', code: '',
    load: function(){ try{ var raw = localStorage.getItem(this.logKey); if (raw){ var obj=JSON.parse(raw); this.attempts=obj.attempts||[]; this.nick=obj.nick||''; this.code=obj.code||''; } }catch(e){} var n=document.getElementById('tNick'), c=document.getElementById('tCode'); if(n) n.value=this.nick||''; if(c) c.value=this.code||''; this.renderRows(); },
    save: function(){ try{ localStorage.setItem(this.logKey, JSON.stringify({attempts:this.attempts,nick:this.nick,code:this.code})); }catch(e){} },
    startAttempt: function(kind){ if (this.current) this.endAttempt(false); var Z=(window.state&&window.state.targetZ)||1; this.current={ id:uid(), tsStart:Date.now(), tsEnd:null, iso: nowISO(), nick:this.nick||'', code:this.code||'', mode:(window.state&&window.state.mode)||kind||'study', Z:Z, elem:(typeof sym==='function'?sym(Z):''), ion:(window.state&&window.state.ionCharge)||0, exc:!!(window.state&&window.state.exceptionsEnabled), moves:0, score:(window.state&&window.state.score)||0, violations:{Aufbau:0,Hund:0,Pauli:0}, completed:false, timeSec:0, configFull:'', configNoble:'' }; },
    onNewGame: function(){ this.startAttempt('game'); this.updateProjector(); },
    onPlace: function(){ if (!this.current) this.startAttempt(window.state&&window.state.mode||'study'); this.current.moves+=1; this.updateProjector(); },
    onViolation: function(rule){ if (!this.current) this.startAttempt(window.state&&window.state.mode||'study'); if (this.current.violations[rule]!=null) this.current.violations[rule]+=1; this.updateRubricBadges(); },
    onMaybeComplete: function(){ try{ if (!window.electronsNeeded||!window.placedCount) return; var need=electronsNeeded(), have=placedCount(); if (need>0 && have===need){ this.endAttempt(true); } }catch(e){} },
    endAttempt: function(mark){ if(!this.current) return; this.current.tsEnd=Date.now(); this.current.timeSec=Math.max(0,Math.round((this.current.tsEnd-this.current.tsStart)/1000)); this.current.completed=!!mark; this.current.score=(window.state&&window.state.score)||this.current.score; var spec=document.getElementById('spectro'); if(spec){ this.current.configFull=spec.innerText||spec.textContent||''; } var noble=document.getElementById('noble'); if(noble){ this.current.configNoble=noble.innerText||noble.textContent||''; } this.attempts.push(this.current); this.current=null; this.save(); this.renderRows(); this.updateRubricBadges(); },
    clear: function(){ this.attempts=[]; this.save(); this.renderRows(); },
    renderRows: function(){ var tb=document.getElementById('tRows'); if(!tb) return; tb.innerHTML=''; for(var i=0;i<this.attempts.length;i++){ var a=this.attempts[i]; var tr=el('tr'); function td(t){var d=el('td'); d.textContent=t; return d;} tr.appendChild(td(new Date(a.tsStart).toLocaleTimeString())); tr.appendChild(td(a.nick||'')); tr.appendChild(td(a.mode)); tr.appendChild(td(a.elem+' ('+a.Z+')')); tr.appendChild(td(String(a.ion))); tr.appendChild(td(a.exc?'ON':'OFF')); tr.appendChild(td(String(a.moves))); tr.appendChild(td(String(a.score))); tr.appendChild(td(a.completed?'Yes':'No')); var v=a.violations||{Aufbau:0,Hund:0,Pauli:0}; tr.appendChild(td(v.Aufbau+'/'+v.Hund+'/'+v.Pauli)); tb.appendChild(tr);} },
    exportCSV: function(){ var rows=[['timestamp','runId','nick','code','mode','Z','elem','ion','exceptions','moves','score','timeSec','completed','viol_Aufbau','viol_Hund','viol_Pauli','config_full','config_noble']]; for (var i=0;i<this.attempts.length;i++){ var a=this.attempts[i], v=a.violations||{Aufbau:0,Hund:0,Pauli:0}; rows.push([a.iso,a.id,a.nick||'',a.code||'',a.mode,a.Z,a.elem,a.ion,a.exc?'1':'0',a.moves,a.score,a.timeSec,a.completed?'1':'0',v.Aufbau,v.Hund,v.Pauli,a.configFull||'',a.configNoble||'']); } dl('electron_towers_results.csv', toCSV(rows)); },
    exportJSON: function(){ dl('electron_towers_results.json', JSON.stringify({attempts:this.attempts}, null, 2)); },
    updateProjector: function(){ if(!window.state) return; var Z=window.state.targetZ||1; var gt=document.getElementById('timer'); document.getElementById('tElem').textContent=(typeof sym==='function'?sym(Z):'?')+' (Z='+Z+')'; document.getElementById('tMode').textContent=window.state.mode||'study'; document.getElementById('tExc').textContent=(window.state.exceptionsEnabled?'ON':'OFF'); document.getElementById('tTimer').textContent = gt ? (gt.textContent||gt.innerText||'00:00') : '00:00'; },
    updateRubricBadges: function(){ var last=this.attempts[this.attempts.length-1]; var r={complete:false,aufbau:false,pauli:false,hund:false,exc:false}; if(last){ r.complete=!!last.completed; r.aufbau=(last.violations && last.violations.Aufbau===0); r.pauli=(last.violations && last.violations.Pauli===0); r.hund=(last.violations && last.violations.Hund===0); var needExc=!!(window.EXCEPTIONS && window.EXCEPTIONS[last.Z]); r.exc = needExc ? !!last.configFull && /3d\^5|3d\^10|4d\^10|5d\^10/.test(last.configFull) : true; } function setB(id,ok){ var e=document.getElementById(id); if(e) e.textContent = ok?'✅':'❌'; } setB('rComplete',r.complete); setB('rAufbau',r.aufbau); setB('rPauli',r.pauli); setB('rHund',r.hund); setB('rEx',r.exc); }
  };

  function openDrawer(){ var d=document.getElementById('teacherDrawer'); d.classList.add('open'); d.setAttribute('aria-hidden','false'); TEACH.updateProjector(); }
  function closeDrawer(){ var d=document.getElementById('teacherDrawer'); d.classList.remove('open'); d.setAttribute('aria-hidden','true'); }
  function setTab(name){ ['Projector','Rubric','Results'].forEach(function(n){ var b=document.getElementById('tTab'+n), p=document.getElementById('tPanel'+n); if(b) b.classList.toggle('active', n===name); if(p) p.classList.toggle('active', n===name); }); }

  function patch(){
    if (window.placeElectronInto && !window._placeElectronInto_orig){
      window._placeElectronInto_orig = window.placeElectronInto;
      window.placeElectronInto = function(wing, idx, spin){ window._placeElectronInto_orig(wing, idx, spin); try{ TEACH.onPlace(wing, idx, spin); TEACH.onMaybeComplete(); }catch(e){} };
    }
    if (window.newGame && !window._newGame_orig){
      window._newGame_orig = window.newGame;
      window.newGame = function(){ window._newGame_orig(); try{ TEACH.onNewGame(); }catch(e){} };
    }
    if (window.legalPlacement && !window._legalPlacement_orig){
      window._legalPlacement_orig = window.legalPlacement;
      window.legalPlacement = function(wing, idx, spin){ var res = window._legalPlacement_orig(wing, idx, spin); if (res && res.ok===false){ try{ TEACH.onViolation(res.rule||''); }catch(e){} } return res; };
    }
  }

  function onDocClick(e){
    if (!TEACH.lockUI) return;
    var sel = ['#modeStudy','#modeGame','.ptile','#exceptionsToggleGame','#exceptionsToggleStudy','#hintToggle','#ionMinus','#ionPlus','#newGameBtn','#resetBtn'];
    for (var i=0;i<sel.length;i++){
      if (e.target.closest && e.target.closest(sel[i])){ e.preventDefault(); e.stopPropagation(); if (typeof toast==='function') toast('Locked by Teacher View'); return; }
    }
  }

  function bind(){
    document.getElementById('teacherBtn').addEventListener('click', openDrawer);
    document.getElementById('tClose').addEventListener('click', closeDrawer);
    document.getElementById('tTabProjector').addEventListener('click', function(){ setTab('Projector'); });
    document.getElementById('tTabRubric').addEventListener('click', function(){ setTab('Rubric'); });
    document.getElementById('tTabResults').addEventListener('click', function(){ setTab('Results'); });
    document.getElementById('tNick').addEventListener('input', function(e){ TEACH.nick = e.target.value; TEACH.save(); });
    document.getElementById('tCode').addEventListener('input', function(e){ TEACH.code = e.target.value; TEACH.save(); });
    document.getElementById('tExportCSV').addEventListener('click', function(){ TEACH.exportCSV(); });
    document.getElementById('tExportJSON').addEventListener('click', function(){ TEACH.exportJSON(); });
    document.getElementById('tClear').addEventListener('click', function(){ if (confirm('Clear all attempts?')) TEACH.clear(); });
    document.getElementById('tRandom').addEventListener('click', function(){ try{ var tiles = Array.from(document.querySelectorAll('.ptile')); if (!tiles.length) return; tiles[Math.floor(Math.random()*tiles.length)].click(); TEACH.updateProjector(); }catch(e){} });
    document.getElementById('tLock').addEventListener('change', function(e){ TEACH.lockUI = !!e.target.checked; });
    document.getElementById('tStartRound').addEventListener('click', function(){ try{ if (window.state && window.state.mode!=='game'){ document.getElementById('modeGame').click(); } document.getElementById('newGameBtn').click(); TEACH.updateProjector(); }catch(e){} });
    document.getElementById('tEndRound').addEventListener('click', function(){ TEACH.endAttempt(false); });
    document.addEventListener('click', onDocClick, true);
    setInterval(function(){ TEACH.updateProjector(); }, 1000);
  }

  function boot(){ patch(); bind(); TEACH.load(); }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
