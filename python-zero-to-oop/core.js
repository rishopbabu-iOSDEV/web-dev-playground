'use strict';
// Helpers, Python engine, step-through viewer and the code editor component.

function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  kids.flat(Infinity).forEach(c => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c))); });
  return e;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- progress (kept only in this browser; the page works without it) ----
const Progress = {
  done: new Set(),
  load() { try { (JSON.parse(localStorage.getItem('pyzero-done') || '[]')).forEach(x => this.done.add(x)); } catch (e) { } },
  mark(id) { this.done.add(id); try { localStorage.setItem('pyzero-done', JSON.stringify([...this.done])); } catch (e) { } },
  has(id) { return this.done.has(id); },
};

// ---- Python engine (Pyodide) ----
const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const ENGINE = (() => {
  let api = null, state = 'loading';
  const listeners = [];
  const set = s => { state = s; listeners.forEach(f => f(s)); };
  const ready = (async () => {
    try {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = PYODIDE_BASE + 'pyodide.js'; s.onload = res; s.onerror = () => rej(new Error('Could not load the Python engine'));
        document.head.append(s);
      });
      const py = await loadPyodide({ indexURL: PYODIDE_BASE });
      py.runPython(window.HARNESS_PY);
      api = { go: py.globals.get('_go'), check: py.globals.get('_check'), peek: py.globals.get('_peek') };
      set('ready');
    } catch (e) { console.error(e); set('failed'); }
  })();
  const need = async () => { await ready; if (!api) throw new Error('The Python engine could not start. Check your internet connection and reload the page.'); return api; };
  return {
    ready,
    get state() { return state; },
    onState(f) { listeners.push(f); f(state); },
    async run(code, stdin) { const a = await need(); await sleep(0); return JSON.parse(a.go(code, stdin || '', 'run', true)); },
    async trace(code, stdin) { const a = await need(); await sleep(0); return JSON.parse(a.go(code, stdin || '', 'trace', true)); },
    async check(code, problem) { const a = await need(); await sleep(0); return JSON.parse(a.check(code, JSON.stringify({ cases: problem.cases, setup: problem.setup, checks: problem.checks }))).results; },
    async peek(expr) { const a = await need(); return JSON.parse(a.peek(expr)); },
  };
})();

// ---- value drawings used by the step viewer ----
function short(v) {
  if (!v) return '';
  switch (v.k) {
    case 'val': return v.v;
    case 'func': return v.v + '()';
    case 'class': return 'class ' + v.v;
    case 'module': return 'module ' + v.v;
    case 'seq': { const b = v.t === 'list' ? ['[', ']'] : v.t === 'tuple' ? ['(', ')'] : ['{', '}']; return b[0] + v.items.map(short).join(', ') + (v.more ? ', ...' : '') + b[1]; }
    case 'dict': return '{' + v.items.map(p => short(p[0]) + ': ' + short(p[1])).join(', ') + (v.more ? ', ...' : '') + '}';
    case 'obj': return v.cls + ' object #' + v.id;
  }
  return '';
}
function valEl(v) {
  switch (v.k) {
    case 'val': return h('span', { class: 'val t-' + v.t }, v.v);
    case 'func': return h('span', { class: 'chip fn' }, 'function ' + v.v);
    case 'class': return h('span', { class: 'chip cls' }, 'class ' + v.v);
    case 'module': return h('span', { class: 'chip mod' }, 'module ' + v.v);
    case 'seq': return h('span', { class: 'seq' },
      v.items.map((x, i) => h('span', { class: 'cell' }, h('i', null, v.t === 'set' ? '' : i), valEl(x))),
      v.more ? h('span', { class: 'cell more' }, '+' + v.more) : null);
    case 'dict': return h('span', { class: 'dictv' }, v.items.map(p => h('span', { class: 'kv' }, valEl(p[0]), h('b', null, '→'), valEl(p[1]))), v.more ? h('span', { class: 'more' }, '+' + v.more + ' more') : null);
    case 'obj': return h('span', { class: 'objv' }, h('span', { class: 'objhead' }, v.cls, h('small', null, ' #' + v.id)),
      v.attrs.length ? v.attrs.map(a => h('span', { class: 'attr' }, h('em', null, a[0]), valEl(a[1]))) : h('span', { class: 'attr' }, h('em', null, '(no data yet)')));
  }
  return h('span', null, '?');
}
function typeTag(v) { return v.k === 'val' ? v.t : v.k === 'seq' ? v.t : v.k === 'dict' ? 'dict' : v.k === 'obj' ? 'object' : v.k; }
function varBox(name, v, changed) {
  return h('div', { class: 'var' + (changed ? ' changed' : '') }, h('div', { class: 'vname' }, name), h('div', { class: 'vval' }, valEl(v)), h('div', { class: 'vtype' }, typeTag(v)));
}

// ---- step-through viewer ----
function Stepper(code, data, onClose) {
  const steps = data.steps;
  const lines = code.replace(/\s+$/, '').split('\n');
  let i = 0, timer = null;
  const codeBox = h('div', { class: 'st-code', role: 'list' }, lines.map((t, n) => h('div', { class: 'st-line', role: 'listitem', 'data-n': n + 1 }, h('span', { class: 'ln' }, n + 1), h('code', null, t || ' '))));
  const stackEl = h('div', { class: 'st-stack' });
  const gEl = h('div', { class: 'st-vars' });
  const lEl = h('div', { class: 'st-vars' });
  const lHead = h('h5', null, '');
  const outEl = h('pre', { class: 'st-out' });
  const note = h('div', { class: 'st-note', 'aria-live': 'polite' });
  const count = h('span', { class: 'st-count' });
  const speed = h('select', { 'aria-label': 'Playback speed' }, h('option', { value: '1400' }, 'Slow'), h('option', { value: '800', selected: true }, 'Normal'), h('option', { value: '350' }, 'Fast'));
  const bPrev = h('button', { class: 'btn ghost', onclick: () => go(i - 1), 'aria-label': 'Previous step' }, '◀ Back');
  const bNext = h('button', { class: 'btn', onclick: () => go(i + 1), 'aria-label': 'Next step' }, 'Next ▶');
  const bPlay = h('button', { class: 'btn ghost', onclick: () => (timer ? stop() : play()) }, 'Auto-play');
  const bReset = h('button', { class: 'btn ghost', onclick: () => { stop(); go(0); } }, 'Restart');
  const bClose = h('button', { class: 'btn ghost', onclick: () => { stop(); onClose(); } }, 'Close');
  const root = h('div', { class: 'stepper' },
    h('div', { class: 'st-top' }, h('strong', null, 'Step through'), count, h('span', { class: 'sp' }), bReset, bPrev, bNext, bPlay, speed, bClose),
    h('div', { class: 'st-grid' }, codeBox,
      h('div', { class: 'st-mem' }, stackEl, h('h5', null, 'Variables (the boxes)'), gEl, lHead, lEl, h('h5', null, 'Output so far'), outEl)),
    note);

  const prevMap = { g: new Map(), l: new Map() };
  function diffText(a, b) {
    if (!a) return 'The program is about to start.';
    const bits = [];
    const cmp = (an, bn, scope) => {
      const am = new Map((an || []).map(x => [x[0], JSON.stringify(x[1])])), av = new Map((an || []).map(x => [x[0], x[1]]));
      (bn || []).forEach(x => {
        const s = JSON.stringify(x[1]);
        if (!am.has(x[0])) { if (x[1].k !== 'func' && x[1].k !== 'class' && x[1].k !== 'module') bits.push(`<b>${esc(x[0])}</b> was created: ${esc(short(x[1]))}`); else bits.push(`<b>${esc(x[0])}</b> was defined`); }
        else if (am.get(x[0]) !== s) bits.push(`<b>${esc(x[0])}</b> changed from ${esc(short(av.get(x[0])))} to ${esc(short(x[1]))}`);
      });
    };
    if (a.stack.length < b.stack.length) bits.push(`entered <b>${esc(b.stack[b.stack.length - 1])}()</b>`);
    else if (a.stack.length > b.stack.length) bits.push(`left <b>${esc(a.stack[a.stack.length - 1])}()</b> and went back to the caller`);
    if (a.stack.length === b.stack.length) { cmp(a.l, b.l); }
    cmp(a.g, b.g);
    if (b.out.length > a.out.length && b.out.startsWith(a.out)) bits.push('printed <code>' + esc(b.out.slice(a.out.length).replace(/\n$/, '')) + '</code>');
    return bits.length ? 'Last line: ' + bits.join('; ') + '.' : (a.ev === 'line' ? 'Last line ran. Nothing visible changed.' : '');
  }
  function renderVars(el, list, prev, same) {
    el.innerHTML = '';
    if (!list || !list.length) { el.append(h('span', { class: 'empty' }, 'nothing yet')); return new Map(); }
    const m = new Map();
    list.forEach(([n, v]) => {
      const s = JSON.stringify(v); m.set(n, s);
      el.append(varBox(n, v, same && (!prev.has(n) || prev.get(n) !== s)));
    });
    return m;
  }
  function go(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    const s = steps[i], p = i > 0 ? steps[i - 1] : null;
    codeBox.querySelectorAll('.st-line.on,.st-line.bad').forEach(x => x.classList.remove('on', 'bad'));
    if (s.line) { const ln = codeBox.querySelector(`.st-line[data-n="${s.line}"]`); if (ln) { ln.classList.add(s.ev === 'exception' ? 'bad' : 'on'); ln.scrollIntoView({ block: 'nearest' }); } }
    stackEl.innerHTML = '';
    stackEl.append(h('span', { class: 'lbl' }, 'Where Python is:'), s.stack.map((f, k) => h('span', { class: 'frame' + (k === s.stack.length - 1 ? ' cur' : '') }, f === '<module>' ? 'main program' : f + '()')));
    const sameScope = p && p.stack.length === s.stack.length;
    prevMap.g = renderVars(gEl, s.g, prevMap.g, !!p);
    if (s.l) { lHead.textContent = `Inside ${s.stack[s.stack.length - 1]}()`; lHead.style.display = ''; lEl.style.display = ''; prevMap.l = renderVars(lEl, s.l, sameScope ? prevMap.l : new Map(), !!sameScope); }
    else { lHead.style.display = 'none'; lEl.style.display = 'none'; prevMap.l = new Map(); }
    outEl.textContent = s.out || '(nothing printed yet)';
    let msg = diffText(p, s);
    if (s.ev === 'return') msg += ` <b>${esc(s.stack[s.stack.length - 1])}()</b> is about to return <code>${esc(s.note)}</code>.`;
    if (s.ev === 'exception') msg = `<span class="badtxt">Error: ${esc(s.note)}</span> Python stops here unless a try / except catches it.`;
    if (s.ev === 'end') msg += ' <b>The program is finished.</b>' + (data.trunc ? ' (Stopped after 400 steps to keep things quick.)' : '');
    else if (s.ev === 'line') msg += ` <span class="nextl">Next to run: line ${s.line}.</span>`;
    note.innerHTML = msg;
    count.textContent = `step ${i + 1} of ${steps.length}`;
    bPrev.disabled = i === 0; bNext.disabled = i === steps.length - 1;
    if (i === steps.length - 1) stop();
  }
  function play() { bPlay.textContent = 'Pause'; if (i >= steps.length - 1) go(0); timer = setInterval(() => go(i + 1), +speed.value); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } bPlay.textContent = 'Auto-play'; }
  speed.addEventListener('change', () => { if (timer) { stop(); play(); } });
  go(0);
  return root;
}

// ---- editor + run + step-through + optional checking ----
function Playground(o) {
  const examples = o.examples && o.examples.length > 1 ? o.examples : null;
  let current = o.examples && o.examples.length ? o.examples[0] : { code: o.code || '', stdin: '' };
  const ta = h('textarea', { class: 'code', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', 'aria-label': o.label || 'Python code' });
  const stdin = h('textarea', { class: 'stdin', rows: '2', spellcheck: 'false', placeholder: 'One answer per line, in the order input() asks for them', 'aria-label': 'Inputs for input()' });
  const stdinWrap = h('label', { class: 'stdin-wrap' }, h('span', null, 'Inputs for input()'), stdin);
  const out = h('div', { class: 'out-wrap' });
  const stepHost = h('div');
  const results = h('div', { class: 'results' });
  const extra = h('div', { class: 'extra' });
  let busy = false;

  function size() { ta.rows = Math.min(24, Math.max(4, ta.value.split('\n').length + 1)); stdinWrap.style.display = /input\s*\(/.test(ta.value) ? '' : 'none'; }
  function load(ex) { ta.value = ex.code; stdin.value = ex.stdin || ''; out.innerHTML = ''; stepHost.innerHTML = ''; results.innerHTML = ''; size(); }
  function insert(text) { ta.focus(); if (!document.execCommand('insertText', false, text)) { const s = ta.selectionStart; ta.setRangeText(text, s, ta.selectionEnd, 'end'); } }
  ta.addEventListener('input', size);
  ta.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); insert('    '); }
    else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
    else if (e.key === 'Enter' && !e.shiftKey && ta.selectionStart === ta.selectionEnd) {
      const before = ta.value.slice(0, ta.selectionStart), ln = before.slice(before.lastIndexOf('\n') + 1);
      let ind = (ln.match(/^ */) || [''])[0]; if (/:\s*$/.test(ln)) ind += '    ';
      e.preventDefault(); insert('\n' + ind);
    }
  });

  function showRun(r) {
    out.innerHTML = '';
    const box = h('div', { class: 'out' }, h('div', { class: 'out-h' }, 'Output'), h('pre', null, r.out || (r.err ? '' : '(no output. Use print() to show something.)')));
    out.append(box);
    if (r.err) {
      const e = r.err;
      out.append(h('div', { class: 'err', role: 'alert' }, h('strong', null, `${e.type}${e.line ? ' on line ' + e.line : ''}`), h('div', { class: 'em' }, e.msg), e.hint ? h('div', { class: 'tip' }, 'Tip: ' + e.hint) : null));
    }
  }
  async function guard(fn) {
    if (busy) return; busy = true;
    const status = h('div', { class: 'pending' }, ENGINE.state === 'ready' ? 'Running...' : 'Waiting for Python to finish loading (first visit only)...');
    out.innerHTML = ''; out.append(status);
    try { await fn(); } catch (e) { out.innerHTML = ''; out.append(h('div', { class: 'err', role: 'alert' }, h('strong', null, 'Python is not available'), h('div', { class: 'em' }, e.message))); }
    busy = false;
  }
  const run = () => guard(async () => { stepHost.innerHTML = ''; showRun(await ENGINE.run(ta.value, stdin.value)); });
  const step = () => guard(async () => {
    const d = await ENGINE.trace(ta.value, stdin.value);
    out.innerHTML = ''; stepHost.innerHTML = '';
    if (!d.steps.length) { showRun(d); return; }
    stepHost.append(Stepper(ta.value, d, () => { stepHost.innerHTML = ''; }));
    if (d.err && d.err.type === 'SyntaxError') showRun(d);
    stepHost.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
  });

  const bar = h('div', { class: 'bar' },
    h('button', { class: 'btn', onclick: run, title: 'Ctrl or Cmd + Enter' }, '▶ Run'),
    h('button', { class: 'btn ghost', onclick: step }, 'Step through'),
    h('button', { class: 'btn ghost', onclick: () => load(current) }, 'Reset'),
    h('span', { class: 'sp' }));

  if (o.problem) {
    const P = o.problem;
    const hint = h('div', { class: 'hintbox', hidden: true }, h('b', null, 'Hint: '), P.hint);
    const sol = h('div', { class: 'hintbox', hidden: true }, h('b', null, 'One possible solution'), h('pre', null, P.solution));
    const bCheck = h('button', { class: 'btn accent', onclick: () => guard(async () => {
      stepHost.innerHTML = ''; out.innerHTML = '';
      const res = await ENGINE.check(ta.value, P);
      results.innerHTML = '';
      const ok = res.every(r => r.ok);
      results.append(h('div', { class: 'verdict ' + (ok ? 'pass' : 'fail') }, ok ? `All ${res.length} checks passed. Well done!` : `${res.filter(r => r.ok).length} of ${res.length} checks passed. Keep going.`));
      res.forEach(r => results.append(h('div', { class: 'chk ' + (r.ok ? 'ok' : 'no') }, h('span', { class: 'mark' }, r.ok ? '✓' : '✗'), h('div', null, r.m, r.detail ? h('pre', null, r.detail) : null))));
      if (ok) { Progress.mark(P.id); o.onDone && o.onDone(); }
    }) }, 'Check my answer');
    bar.append(bCheck,
      h('button', { class: 'btn ghost', onclick: () => { hint.hidden = !hint.hidden; } }, 'Hint'),
      h('button', { class: 'btn ghost', onclick: () => { if (sol.hidden && !confirm_ok()) return; sol.hidden = !sol.hidden; } }, 'Solution'));
    extra.append(hint, sol);
    current = { code: P.starter, stdin: '' };
  }
  function confirm_ok() { return true; }

  const tabs = examples ? h('div', { class: 'tabs', role: 'tablist' }, examples.map((ex, k) => h('button', { class: 'tab' + (k === 0 ? ' on' : ''), role: 'tab', onclick: ev => { current = ex; load(ex); tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('on')); ev.currentTarget.classList.add('on'); } }, ex.title))) : null;
  const root = h('div', { class: 'pg' }, tabs, ta, stdinWrap, bar, extra, out, stepHost, results);
  load(current);
  return root;
}
