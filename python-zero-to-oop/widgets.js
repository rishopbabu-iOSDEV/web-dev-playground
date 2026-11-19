'use strict';
// One small interactive animation per concept. Each takes a container element.
const WIDGETS = {};
const btn = (label, fn, cls) => h('button', { class: 'btn ' + (cls || 'ghost'), onclick: fn }, label);
const pyRepr = v => typeof v === 'string' ? `'${v}'` : Number.isInteger(v) ? String(v) : String(v);
function parsePy(s) { s = s.trim(); if (/^-?\d+$/.test(s)) return { v: parseInt(s, 10), t: 'int' }; if (/^-?\d*\.\d+$/.test(s)) return { v: parseFloat(s), t: 'float' }; return { v: s, t: 'str' }; }
const fmtNum = (v, t) => (t === 'float' && Number.isInteger(v)) ? v.toFixed(1) : String(v);

// ---- Type detective ----
WIDGETS.types = el => {
  const samples = ['5', '5.0', '"5"', 'True', '5 + 2', '"5" + "5"', '"5" * 3', '10 / 4', '10 // 4', '10 % 4', '5 > 3', '[1, 2, 3]', '"5" + 5'];
  const meaning = { int: 'a whole number', float: 'a decimal number', str: 'text', bool: 'True or False', list: 'an ordered list', tuple: 'a fixed list', dict: 'a dictionary', NoneType: 'nothing at all', set: 'a bag of unique values' };
  const input = h('input', { class: 'w-input mono', value: '"5" + "5"', spellcheck: 'false', 'aria-label': 'A Python expression to try' });
  const res = h('div', { class: 'ty-res', 'aria-live': 'polite' });
  async function ask() {
    res.innerHTML = '<span class="pending">Asking Python...</span>';
    let r; try { r = await ENGINE.peek(input.value); } catch (e) { res.innerHTML = ''; res.append(h('div', { class: 'err' }, e.message)); return; }
    res.innerHTML = '';
    const card = h('div', { class: 'ty-card pop ' + (r.ok ? '' : 'bad') });
    if (r.ok) card.append(h('code', { class: 'ty-expr' }, input.value.trim()), h('span', { class: 'ty-arrow' }, 'gives'), h('span', { class: 'ty-val' }, r.repr), h('span', { class: 'badge t-' + r.type }, r.type), h('span', { class: 'ty-mean' }, meaning[r.type] || 'an object'));
    else card.append(h('strong', null, r.err), r.hint ? h('div', { class: 'tip' }, 'Tip: ' + r.hint) : null);
    res.append(card);
  }
  input.addEventListener('keydown', e => { if (e.key === 'Enter') ask(); });
  el.append(h('div', { class: 'w-row' }, input, btn('What is it?', ask, 'accent')),
    h('div', { class: 'chips' }, samples.map(s => h('button', { class: 'chip-btn', onclick: () => { input.value = s; ask(); } }, s))), res);
  ENGINE.ready.then(ask);
};

// ---- Slicer ----
WIDGETS.slice = el => {
  const word = h('input', { class: 'w-input mono', value: 'PYTHON', maxlength: '12', 'aria-label': 'Word to slice' });
  const a = h('input', { type: 'range', min: '-12', max: '12', value: '0', 'aria-label': 'start' });
  const b = h('input', { type: 'range', min: '-12', max: '12', value: '3', 'aria-label': 'end' });
  const lbl = h('div', { class: 'sl-code mono' });
  const row = h('div', { class: 'sl-row' });
  function draw() {
    const w = word.value || ' ', n = w.length; a.min = b.min = -n; a.max = b.max = n;
    let s = +a.value, e = +b.value;
    const norm = x => x < 0 ? Math.max(n + x, 0) : Math.min(x, n);
    const i = norm(s), j = norm(e);
    row.innerHTML = '';
    [...w].forEach((c, k) => row.append(h('div', { class: 'sl-cell' + (k >= i && k < j ? ' on' : '') }, h('small', null, k), h('b', null, c === ' ' ? '␣' : c), h('small', { class: 'neg' }, k - n))));
    const res = i < j ? w.slice(i, j) : '';
    lbl.innerHTML = `word[<b>${s}</b>:<b>${e}</b>] gives <span class="sl-res">'${esc(res)}'</span>${res === '' ? ' <em>(empty: start is not before end)</em>' : ''}`;
  }
  [word, a, b].forEach(x => x.addEventListener('input', draw));
  el.append(h('div', { class: 'w-row' }, h('label', null, 'Word ', word)), row,
    h('div', { class: 'sl-ctl' }, h('label', null, 'start ', a), h('label', null, 'end ', b)), lbl,
    h('p', { class: 'w-note' }, 'Top numbers count from the front. Grey numbers below count from the back. The slice includes start and stops just before end.'));
  draw();
};

// ---- Decision fork ----
WIDGETS.fork = el => {
  const rules = [{ code: 'if temp >= 30:', f: t => t >= 30, r: 'print("Wear light clothes")' }, { code: 'elif temp >= 20:', f: t => t >= 20, r: 'print("A T-shirt is fine")' }, { code: 'else:', f: () => true, r: 'print("Take a jacket")' }];
  const slider = h('input', { type: 'range', min: '0', max: '45', value: '32', 'aria-label': 'Temperature in degrees' });
  const label = h('div', { class: 'fk-temp mono' });
  const rows = rules.map(r => h('div', { class: 'frow' }, h('code', null, r.code), h('span', { class: 'fstat' }), h('code', { class: 'fres' }, '    ' + r.r)));
  let token = 0;
  async function update() {
    const my = ++token, t = +slider.value; label.innerHTML = `temp = <b>${t}</b>`;
    rows.forEach(r => { r.className = 'frow'; r.querySelector('.fstat').textContent = ''; });
    let taken = false;
    for (let k = 0; k < rows.length; k++) {
      if (my !== token) return;
      const row = rows[k], st = row.querySelector('.fstat');
      if (taken) { row.classList.add('skip'); st.textContent = 'never checked'; continue; }
      row.classList.add('checking'); st.textContent = 'checking...';
      if (!reduceMotion()) await sleep(280);
      if (my !== token) return;
      row.classList.remove('checking');
      const ok = rules[k].f(t), last = k === rules.length - 1;
      row.classList.add(ok ? 'yes' : 'no');
      st.textContent = ok ? (last ? 'nothing else matched, so this runs' : 'True, so this runs') : 'False, move on';
      if (ok) taken = true;
    }
  }
  slider.addEventListener('input', update);
  el.append(h('div', { class: 'fk-ctl' }, h('span', null, 'Slide the temperature'), slider, label), h('div', { class: 'fork' }, rows),
    h('p', { class: 'w-note' }, 'Python walks down the signs. The first True sign wins. The rest are never even looked at.'));
  update();
};

// ---- Loop conveyor ----
WIDGETS.loop = el => {
  const input = h('input', { class: 'w-input mono', value: '3, 1, 4, 1, 5', 'aria-label': 'Numbers for the loop, separated by commas' });
  const codeLines = ['total = 0', 'for n in numbers:', '    total = total + n', 'print(total)'];
  const codeEl = h('div', { class: 'lp-code mono' }, codeLines.map(t => h('div', { class: 'lp-line' }, t || ' ')));
  const belt = h('div', { class: 'belt' });
  const nBox = h('div', { class: 'var' }), tBox = h('div', { class: 'var' });
  const msg = h('div', { class: 'lp-msg', 'aria-live': 'polite' });
  let frames = [], at = -1, timer = null;
  function build() {
    stop();
    const nums = input.value.split(',').map(s => parseFloat(s)).filter(x => !isNaN(x)).slice(0, 8);
    if (!nums.length) nums.push(1);
    frames = [{ line: 0, i: -1, n: null, total: 0, m: 'First, a box called total is created and starts at 0.' }];
    let acc = 0;
    nums.forEach((x, i) => {
      frames.push({ line: 1, i, n: x, total: acc, m: `Round ${i + 1} of ${nums.length}: n takes the next item, which is ${x}.` });
      frames.push({ line: 2, i, n: x, total: acc + x, m: `${acc} + ${x} = ${acc + x}. The total box is updated.` });
      acc += x;
    });
    frames.push({ line: 3, i: nums.length, n: null, total: acc, m: 'No items left, so the loop ends and print() shows the total.' });
    frames._nums = nums; at = -1; next();
  }
  function box(b, name, val, changed) { b.className = 'var' + (changed ? ' changed' : ''); b.innerHTML = `<div class="vname">${name}</div><div class="vval"><span class="val">${val === null ? '?' : val}</span></div>`; }
  function next() {
    at = at >= frames.length - 1 ? 0 : at + 1;
    const f = frames[at], prev = frames[at - 1];
    [...codeEl.children].forEach((c, k) => c.classList.toggle('on', k === f.line));
    belt.innerHTML = '';
    frames._nums.forEach((x, i) => belt.append(h('div', { class: 'item' + (i < f.i || (i === f.i && f.line === 2) ? ' done' : '') + (i === f.i ? ' cur' : '') }, x, i === f.i ? h('span', { class: 'ptr' }, '▼') : null)));
    box(nBox, 'n', f.n, !prev || prev.n !== f.n); box(tBox, 'total', f.total, !prev || prev.total !== f.total);
    msg.textContent = f.m;
    if (at === frames.length - 1) stop();
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } if (playB) playB.textContent = 'Play'; }
  const playB = btn('Play', () => { if (timer) { stop(); return; } if (at >= frames.length - 1) { at = -1; } playB.textContent = 'Pause'; next(); timer = setInterval(next, reduceMotion() ? 400 : 900); }, 'accent');
  input.addEventListener('change', build);
  el.append(h('div', { class: 'w-row' }, h('label', null, 'numbers = ', input), btn('Update', build)),
    h('div', { class: 'lp-grid' }, codeEl, h('div', null, belt, h('div', { class: 'lp-vars' }, nBox, tBox))),
    h('div', { class: 'w-row' }, playB, btn('Step', () => { stop(); next(); }), btn('Restart', build)), msg);
  build();
};

// ---- List shelf ----
WIDGETS.shelf = el => {
  let list = ['apple', 'banana', 'cherry'], flash = -1, line = 'fruits = ["apple", "banana", "cherry"]', note = '', pick = -1;
  const input = h('input', { class: 'w-input mono', value: 'mango', maxlength: '10', 'aria-label': 'Item to use' });
  const shelf = h('div', { class: 'shelf' }), info = h('div', { class: 'sh-info', 'aria-live': 'polite' });
  const val = () => (input.value.trim() || 'x');
  function draw() {
    shelf.innerHTML = '';
    if (!list.length) shelf.append(h('div', { class: 'slot empty' }, 'empty list []'));
    list.forEach((x, i) => shelf.append(h('button', { class: 'slot' + (i === flash ? ' new' : '') + (i === pick ? ' pick' : ''), onclick: () => { pick = i; flash = -1; line = `fruits[${i}]`; note = `gives '${x}'. Same slot is also fruits[${i - list.length}].`; draw(); } }, h('small', null, i), h('b', null, x), h('small', { class: 'neg' }, i - list.length))));
    info.innerHTML = `<code>${esc(line)}</code>${note ? ' <span>' + esc(note) + '</span>' : ''}<div class="sh-now">fruits is now <code>[${list.map(x => "'" + esc(x) + "'").join(', ')}]</code> and len(fruits) is <b>${list.length}</b></div>`;
  }
  function act(fn, l, n) { pick = -1; flash = -1; note = n || ''; fn(); line = l; draw(); }
  const full = () => list.length >= 8;
  el.append(h('div', { class: 'w-row' }, h('label', null, 'item ', input)),
    h('div', { class: 'w-row wrap' },
      btn('append(item)', () => full() ? 0 : act(() => { list.push(val()); flash = list.length - 1; }, `fruits.append("${val()}")`, 'adds to the end')),
      btn('insert(0, item)', () => full() ? 0 : act(() => { list.unshift(val()); flash = 0; }, `fruits.insert(0, "${val()}")`, 'adds at the front, everything else shifts along')),
      btn('pop()', () => { if (!list.length) return act(() => { }, 'fruits.pop()', 'IndexError: pop from empty list'); const x = list[list.length - 1]; act(() => { list.pop(); }, 'fruits.pop()', `removed and returned '${x}'`); }),
      btn('remove(item)', () => { const i = list.indexOf(val()); act(() => { if (i >= 0) list.splice(i, 1); }, `fruits.remove("${val()}")`, i >= 0 ? 'removed the first match' : 'ValueError: that item is not in the list'); }),
      btn('sort()', () => act(() => list.sort(), 'fruits.sort()', 'A to Z order')),
      btn('reverse()', () => act(() => list.reverse(), 'fruits.reverse()', 'back to front')),
      btn('Reset', () => { list = ['apple', 'banana', 'cherry']; act(() => { }, 'fruits = ["apple", "banana", "cherry"]', ''); })),
    shelf, info, h('p', { class: 'w-note' }, 'Click any slot to read it by its number. Small grey numbers are the negative positions, counted from the end.'));
  draw();
};

// ---- Dictionary lookup ----
WIDGETS.dict = el => {
  const data = { Asha: '98765', Ravi: '91234', Meera: '90909' };
  let hit = null, miss = false, line = 'contacts = {"Asha": "98765", "Ravi": "91234", "Meera": "90909"}', result = '', bad = false;
  const key = h('input', { class: 'w-input mono', value: 'Ravi', maxlength: '10', 'aria-label': 'Key' });
  const value = h('input', { class: 'w-input mono', value: '90000', maxlength: '10', 'aria-label': 'Value' });
  const book = h('div', { class: 'book' }), info = h('div', { class: 'dc-info', 'aria-live': 'polite' });
  const k = () => key.value.trim();
  function draw() {
    book.innerHTML = '';
    Object.keys(data).forEach(n => book.append(h('div', { class: 'entry' + (n === hit ? ' hit' : '') }, h('span', { class: 'ek' }, n), h('span', { class: 'ea' }, '→'), h('span', { class: 'ev' }, data[n]))));
    if (!Object.keys(data).length) book.append(h('div', { class: 'entry' }, 'empty dictionary {}'));
    info.innerHTML = `<code>${esc(line)}</code><div class="dc-res ${bad ? 'bad' : ''}">${esc(result)}</div>`;
  }
  const look = (get) => { hit = null; if (k() in data) { hit = k(); line = get ? `contacts.get("${k()}")` : `contacts["${k()}"]`; result = `gives '${data[k()]}'`; bad = false; } else { line = get ? `contacts.get("${k()}")` : `contacts["${k()}"]`; result = get ? 'gives None (no crash)' : `KeyError: '${k()}'`; bad = !get; } draw(); };
  el.append(h('div', { class: 'w-row wrap' }, h('label', null, 'key ', key), h('label', null, 'value ', value)),
    h('div', { class: 'w-row wrap' },
      btn('contacts[key]', () => look(false)), btn('contacts.get(key)', () => look(true)),
      btn('contacts[key] = value', () => { hit = k(); data[k()] = value.value.trim(); line = `contacts["${k()}"] = "${value.value.trim()}"`; result = k() in data ? 'added or updated' : ''; bad = false; draw(); }, 'accent'),
      btn('del contacts[key]', () => { if (k() in data) { delete data[k()]; line = `del contacts["${k()}"]`; result = 'removed'; bad = false; } else { line = `del contacts["${k()}"]`; result = `KeyError: '${k()}'`; bad = true; } hit = null; draw(); })),
    book, info, h('p', { class: 'w-note' }, 'Try a name that is not there, first with [ ] and then with .get().'));
  draw();
};

// ---- Function machine ----
WIDGETS.machine = el => {
  const defs = {
    double: { params: ['n'], code: 'def double(n):\n    return n * 2', run: ([a]) => { const p = parsePy(a); return p.t === 'str' ? { v: `'${p.v + p.v}'` } : { v: fmtNum(p.v * 2, p.t) }; } },
    square: { params: ['n'], code: 'def square(n):\n    return n ** 2', run: ([a]) => { const p = parsePy(a); return p.t === 'str' ? { err: "TypeError: unsupported operand type(s) for ** or pow(): 'str' and 'int'" } : { v: fmtNum(p.v ** 2, p.t) }; } },
    greet: { params: ['name'], code: 'def greet(name):\n    return "Hello, " + name + "!"', run: ([a]) => ({ v: `'Hello, ${a}!'` }) },
    add: { params: ['a', 'b'], code: 'def add(a, b):\n    return a + b', run: ([a, b]) => { const x = parsePy(a), y = parsePy(b); if (x.t === 'str' && y.t === 'str') return { v: `'${x.v + y.v}'` }; if (x.t !== 'str' && y.t !== 'str') return { v: fmtNum(x.v + y.v, x.t === 'float' || y.t === 'float' ? 'float' : 'int') }; return { err: 'TypeError: you cannot add a number and text' }; } },
    shout: { params: ['name'], code: 'def shout(name):\n    print(name.upper() + "!")\n    # no return line', run: ([a]) => ({ v: 'None', printed: a.toUpperCase() + '!' }) },
  };
  const sel = h('select', { 'aria-label': 'Choose a function' }, Object.keys(defs).map(k => h('option', { value: k }, k + '(' + defs[k].params.join(', ') + ')')));
  const in1 = h('input', { class: 'w-input mono', value: '21', 'aria-label': 'First input' }), in2 = h('input', { class: 'w-input mono', value: '4', 'aria-label': 'Second input' });
  const codeEl = h('pre', { class: 'mc-code mono' }), callEl = h('div', { class: 'mc-call mono' });
  const tokIn = h('div', { class: 'tok' }), tokOut = h('div', { class: 'tok' }), gear = h('div', { class: 'gear', 'aria-hidden': 'true' });
  const machine = h('div', { class: 'machine' }, gear, h('b', { class: 'mname' }));
  const printed = h('div', { class: 'mc-print', hidden: true });
  const stage = h('div', { class: 'mc-stage' }, h('div', { class: 'slot-in' }, h('small', null, 'goes in'), tokIn), machine, h('div', { class: 'slot-out' }, h('small', null, 'comes out'), tokOut));
  function setup() {
    const d = defs[sel.value]; in2.style.display = d.params.length > 1 ? '' : 'none';
    in1.value = sel.value === 'greet' || sel.value === 'shout' ? 'Asha' : sel.value === 'add' ? '3' : '21'; in2.value = '4';
    codeEl.textContent = d.code; machine.querySelector('.mname').textContent = sel.value; tokIn.className = 'tok'; tokOut.className = 'tok'; printed.hidden = true; callEl.textContent = '';
  }
  async function feed() {
    const d = defs[sel.value], args = d.params.length > 1 ? [in1.value, in2.value] : [in1.value];
    const shown = args.map(a => { const p = parsePy(a); return sel.value === 'greet' || sel.value === 'shout' ? `"${a}"` : p.t === 'str' ? `"${a}"` : a; });
    callEl.textContent = `result = ${sel.value}(${shown.join(', ')})`;
    tokIn.textContent = args.join(', '); tokIn.className = 'tok'; tokOut.className = 'tok'; printed.hidden = true; void tokIn.offsetWidth;
    const r = d.run(args), fast = reduceMotion();
    tokIn.classList.add('show'); await sleep(fast ? 0 : 450);
    tokIn.classList.add('enter'); await sleep(fast ? 0 : 500);
    machine.classList.add('run'); await sleep(fast ? 0 : 700); machine.classList.remove('run');
    if (r.printed) { printed.hidden = false; printed.textContent = 'print() showed: ' + r.printed; }
    tokOut.textContent = r.err || r.v; tokOut.className = 'tok show' + (r.err ? ' bad' : '') + (r.v === 'None' ? ' none' : '');
  }
  sel.addEventListener('change', setup);
  el.append(h('div', { class: 'w-row wrap' }, h('label', null, 'machine ', sel), h('label', null, 'input ', in1), in2, btn('Feed it in', feed, 'accent')),
    h('div', { class: 'mc-grid' }, codeEl, h('div', null, callEl, stage, printed)),
    h('p', { class: 'w-note' }, 'Try double("ab"), square("ab"), add(3, "x"), and shout. Shout prints but gives back None because it has no return.'));
  setup();
};

// ---- Blueprint workshop ----
WIDGETS.blueprint = el => {
  const objs = [], lines = ['class Dog:', '    def __init__(self, name, age, colour):', '        self.name = name', '        self.age = age', '        self.colour = colour', ''];
  const name = h('input', { class: 'w-input', value: 'Bruno', maxlength: '10', 'aria-label': 'name' }), age = h('input', { class: 'w-input', type: 'number', value: '3', min: '0', max: '30', 'aria-label': 'age' }), colour = h('input', { class: 'w-input', value: 'brown', maxlength: '10', 'aria-label': 'colour' });
  const yard = h('div', { class: 'yard' }), prog = h('pre', { class: 'bp-code mono' });
  let n = 0;
  function draw(newest) {
    yard.innerHTML = '';
    if (!objs.length) yard.append(h('div', { class: 'yard-empty' }, 'No objects yet. Fill in the blueprint and press Make a Dog.'));
    objs.forEach((o, i) => yard.append(h('div', { class: 'ocard' + (i === newest ? ' stamp' : '') }, h('div', { class: 'ohead' }, o.v, h('small', null, ' = Dog object')), h('div', { class: 'orow' }, h('em', null, 'name'), o.name), h('div', { class: 'orow' }, h('em', null, 'age'), h('span', { class: 'agev' }, o.age)), h('div', { class: 'orow' }, h('em', null, 'colour'), o.colour),
      btn('birthday: ' + o.v + '.age += 1', () => { o.age++; lines.push(`${o.v}.age += 1`); draw(); }))));
    prog.textContent = lines.join('\n');
  }
  function make() {
    if (objs.length >= 6) return; n++;
    const o = { v: 'dog' + n, name: name.value || 'Rex', age: +age.value || 0, colour: colour.value || 'grey' }; objs.push(o);
    lines.push(`${o.v} = Dog("${o.name}", ${o.age}, "${o.colour}")`); draw(objs.length - 1);
  }
  el.append(h('div', { class: 'bp-grid' },
    h('div', { class: 'blueprint' }, h('div', { class: 'bp-title' }, 'class Dog', h('small', null, 'the blueprint')), h('label', null, 'name', name), h('label', null, 'age', age), h('label', null, 'colour', colour), btn('Make a Dog', make, 'accent')),
    h('div', null, yard)), prog,
    h('div', { class: 'w-row' }, btn('Clear', () => { objs.length = 0; n = 0; lines.length = 6; draw(); })),
    h('p', { class: 'w-note' }, 'One blueprint, many objects. Press a birthday button and see that only that dog changes.'));
  draw();
};

// ---- Phones: methods and self ----
WIDGETS.phones = el => {
  const ph = { asha: { owner: 'Asha', battery: 50 }, ravi: { owner: 'Ravi', battery: 50 } };
  const logEl = h('div', { class: 'ph-log', 'aria-live': 'polite' }, 'Press a button.');
  const cards = {};
  function card(k) {
    const p = ph[k], fill = h('div', { class: 'fill' }), pct = h('b', null), selfTag = h('span', { class: 'selftag' }, 'self');
    const root = h('div', { class: 'phone' }, h('div', { class: 'ph-name' }, k, selfTag), h('div', { class: 'battery' }, fill), pct,
      h('div', { class: 'w-row wrap' }, btn(`${k}.use(30)`, () => call(k, 'use', 30)), btn(`${k}.charge(20)`, () => call(k, 'charge', 20))));
    cards[k] = { root, fill, pct, selfTag }; paint(k); return root;
  }
  function paint(k) { const p = ph[k], c = cards[k]; c.fill.style.width = p.battery + '%'; c.fill.className = 'fill' + (p.battery <= 20 ? ' low' : ''); c.pct.textContent = p.battery + '%'; }
  async function call(k, m, x) {
    const p = ph[k]; p.battery = m === 'use' ? Math.max(0, p.battery - x) : Math.min(100, p.battery + x);
    Object.values(cards).forEach(c => c.root.classList.remove('active')); cards[k].root.classList.add('active'); paint(k);
    logEl.innerHTML = `<code>${k}.${m}(${x})</code> runs the method with <b>self = ${k}</b>, so only ${p.owner}'s battery changes. It is now <b>${p.battery}%</b>.`;
  }
  el.append(h('div', { class: 'ph-grid' }, card('asha'), card('ravi')), logEl,
    h('pre', { class: 'bp-code mono' }, 'def use(self, minutes):\n    self.battery = max(0, self.battery - minutes)'),
    h('p', { class: 'w-note' }, 'The highlighted phone is the one self points to.'));
};

// ---- Inheritance tree: method lookup ----
WIDGETS.tree = el => {
  const C = {
    Animal: { parent: null, m: { eat: 'eats some food', sleep: 'sleeps. Zzz', speak: 'makes a sound' } },
    Dog: { parent: 'Animal', m: { speak: 'says Woof!', fetch: 'fetches the ball' } },
    Cat: { parent: 'Animal', m: { speak: 'says Meow!', climb: 'climbs a tree' } },
    Puppy: { parent: 'Dog', m: { play: 'plays with a toy' } },
  };
  const objs = { 'rex = Dog()': 'Dog', 'tom = Cat()': 'Cat', 'bit = Puppy()': 'Puppy' };
  const allM = ['eat', 'sleep', 'speak', 'fetch', 'climb', 'play'];
  const nodes = {};
  Object.keys(C).forEach(k => { nodes[k] = h('div', { class: 'tnode', 'data-c': k }, h('b', null, k + (C[k].parent ? `(${C[k].parent})` : '')), h('ul', null, Object.keys(C[k].m).map(m => h('li', { 'data-m': m }, m + '()')))); });
  const objSel = h('select', { 'aria-label': 'Object' }, Object.keys(objs).map(o => h('option', null, o)));
  const mSel = h('select', { 'aria-label': 'Method' }, allM.map(m => h('option', null, m)));
  const res = h('div', { class: 'tr-res', 'aria-live': 'polite' }); let tok = 0;
  async function call() {
    const my = ++tok, who = objSel.value.split(' ')[0], cls = objs[objSel.value], m = mSel.value;
    Object.values(nodes).forEach(n => { n.className = 'tnode'; });
    res.textContent = `Calling ${who}.${m}() ...`;
    let c = cls, found = null;
    while (c) {
      nodes[c].classList.add('checking'); if (!reduceMotion()) await sleep(650); if (my !== tok) return;
      nodes[c].classList.remove('checking');
      if (C[c].m[m]) { nodes[c].classList.add('hit'); found = c; break; }
      nodes[c].classList.add('miss'); c = C[c].parent;
    }
    res.innerHTML = found ? `Found <b>${m}()</b> in <b>${found}</b>. ${who} ${esc(C[found].m[m])}.` : `<span class="badtxt">AttributeError: '${cls}' object has no attribute '${m}'</span>. Python checked ${cls} and every parent above it.`;
  }
  el.append(h('div', { class: 'w-row wrap' }, objSel, mSel, btn('Call it', call, 'accent')),
    h('div', { class: 'tree' }, h('div', { class: 't-top' }, nodes.Animal), h('div', { class: 't-mid' }, h('div', { class: 't-col' }, nodes.Dog, h('div', { class: 'arrow' }, 'extends'), nodes.Puppy), h('div', { class: 't-col' }, nodes.Cat))),
    res, h('p', { class: 'w-note' }, 'Try rex.eat(), rex.speak(), tom.fetch() and bit.speak(). Each box lists only the methods written inside it.'));
};

// ---- Vault: encapsulation ----
WIDGETS.vault = el => {
  let rules = true, bal = 100;
  const balEl = h('div', { class: 'vt-bal' }), msg = h('div', { class: 'vt-msg', 'aria-live': 'polite' }), safe = h('div', { class: 'safe' }, balEl);
  const code = h('pre', { class: 'bp-code mono' });
  const modeBtn = h('button', { class: 'btn ghost', 'aria-pressed': 'true' });
  function paint(text, bad) {
    balEl.textContent = bal; safe.classList.toggle('neg', bal < 0); modeBtn.textContent = rules ? 'Rules in the methods: ON' : 'Rules in the methods: OFF'; modeBtn.setAttribute('aria-pressed', rules);
    code.textContent = rules ? 'def withdraw(self, amount):\n    if amount <= 0 or amount > self._balance:\n        return "Refused"\n    self._balance -= amount\n\ndef deposit(self, amount):\n    if amount <= 0:\n        return "Refused"\n    self._balance += amount'
      : 'def withdraw(self, amount):\n    self._balance -= amount      # no checks\n\ndef deposit(self, amount):\n    self._balance += amount      # no checks';
    if (text !== undefined) { msg.className = 'vt-msg' + (bad ? ' bad' : ' good'); msg.textContent = text; if (bad) { safe.classList.remove('shake'); void safe.offsetWidth; safe.classList.add('shake'); } }
  }
  function withdraw(x) { if (rules && (x <= 0 || x > bal)) return paint(`withdraw(${x}) refused: that is not allowed.`, true); bal -= x; paint(`withdraw(${x}) done.` + (bal < 0 ? ' The balance is negative. Nothing stopped this!' : ''), bal < 0); }
  function deposit(x) { if (rules && x <= 0) return paint(`deposit(${x}) refused: deposits must be above zero.`, true); bal += x; paint(`deposit(${x}) done.` + (x < 0 ? ' A "deposit" just took money out!' : ''), x < 0); }
  modeBtn.addEventListener('click', () => { rules = !rules; bal = 100; paint('Balance reset to 100.'); });
  el.append(h('div', { class: 'w-row wrap' }, modeBtn),
    h('div', { class: 'vt-grid' }, h('div', null, h('div', { class: 'vt-lbl' }, 'balance inside the object'), safe, msg), code),
    h('div', { class: 'w-row wrap' }, btn('withdraw(30)', () => withdraw(30)), btn('withdraw(500)', () => withdraw(500)), btn('deposit(50)', () => deposit(50)), btn('deposit(-100)', () => deposit(-100))),
    h('p', { class: 'w-note' }, 'Switch the rules off and press withdraw(500). Same object, no protection.'));
  paint();
};

// ---- Remote: polymorphism ----
WIDGETS.remote = el => {
  const kinds = { Dog: 'Woof', Cat: 'Meow', Cow: 'Moo', Duck: 'Quack', Robot: 'Beep boop' };
  let list = ['Dog', 'Cat', 'Cow'], tok = 0;
  const row = h('div', { class: 'rm-row' }), lineEl = h('pre', { class: 'bp-code mono' });
  function draw() {
    row.innerHTML = ''; list.forEach((k, i) => row.append(h('div', { class: 'rm-item', 'data-i': i }, h('div', { class: 'avatar' }, k[0]), h('b', null, k), h('div', { class: 'bubble' }))));
    lineEl.textContent = `animals = [${list.map(k => k + '()').join(', ')}]\nfor animal in animals:\n    print(animal.speak())`;
  }
  async function press() {
    const my = ++tok; draw();
    for (let i = 0; i < list.length; i++) { if (my !== tok) return; const it = row.children[i]; it.classList.add('go'); it.querySelector('.bubble').textContent = kinds[list[i]] + '!'; if (!reduceMotion()) await sleep(550); }
  }
  const add = k => btn('Add ' + k, () => { if (list.length < 5) { list.push(k); draw(); } });
  el.append(h('div', { class: 'w-row wrap' }, btn('▶ animal.speak() for everyone', press, 'accent'), add('Duck'), add('Robot'), btn('Reset', () => { list = ['Dog', 'Cat', 'Cow']; draw(); })),
    row, lineEl, h('p', { class: 'w-note' }, 'Add a Duck. The loop below never changes, yet the new animal answers in its own way.'));
  draw();
};
