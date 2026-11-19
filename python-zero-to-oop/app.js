'use strict';
// Navigation, pages and routing.
Progress.load();
const nav = document.getElementById('nav'), main = document.getElementById('main'), menuBtn = document.getElementById('menu-btn');
const lessons = window.LESSONS;
lessons.forEach(L => L.practice.forEach((p, i) => { p.id = L.id + '-' + i; }));
let current = 'home';

ENGINE.onState(s => {
  const e = document.getElementById('engine');
  e.className = 'engine ' + s;
  e.querySelector('span').textContent = s === 'ready' ? 'Python is ready' : s === 'failed' ? 'Python could not load' : 'Python is loading';
});

function lessonCount(L) { return L.practice.filter(p => Progress.has(p.id)).length; }
function renderNav() {
  nav.innerHTML = '';
  const link = (id, text, extra) => h('a', { href: '#l-' + id, class: id === current ? 'on' : '' }, h('span', null, text), extra || null);
  nav.append(link('home', 'Start here'), link('playground', 'Free playground'));
  let part = null, n = 0;
  lessons.forEach(L => {
    n++;
    if (L.part !== part) { part = L.part; nav.append(h('div', { class: 'part' }, part)); }
    const c = lessonCount(L), t = L.practice.length;
    nav.append(link(L.id, `${n}. ${L.title}`, h('small', { class: c === t ? 'full' : '' }, c === t ? 'done' : `${c}/${t}`)));
  });
}
menuBtn.addEventListener('click', () => { const o = document.body.classList.toggle('nav-open'); menuBtn.setAttribute('aria-expanded', o); });
nav.addEventListener('click', e => { if (e.target.closest('a')) { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); } });

function lessonNav(idx) {
  const prev = lessons[idx - 1], next = lessons[idx + 1];
  return h('div', { class: 'pn' },
    prev ? h('a', { class: 'btn ghost', href: '#l-' + prev.id }, '◀ ' + prev.title) : h('a', { class: 'btn ghost', href: '#l-home' }, '◀ Start here'),
    next ? h('a', { class: 'btn accent', href: '#l-' + next.id }, next.title + ' ▶') : h('a', { class: 'btn accent', href: '#l-playground' }, 'Free playground ▶'));
}

function homePage() {
  const parts = [];
  lessons.forEach((L, i) => { let g = parts.find(p => p.name === L.part); if (!g) parts.push(g = { name: L.part, items: [] }); g.items.push([L, i + 1]); });
  return h('article', { class: 'page home' },
    h('p', { class: 'kicker' }, 'A hands-on course in plain language'),
    h('h1', null, 'Python, from your first line to objects'),
    h('p', { class: 'lead' }, 'Fifteen short lessons. Each one explains an idea with an everyday comparison, shows it moving, lets you run real Python, and ends with practice problems that check your answers.'),
    h('div', { class: 'how' },
      [['Read', 'One idea at a time, with a real-life comparison.'], ['Watch', 'Animations and a step-through viewer show what happens inside.'], ['Run', 'Edit any example and press Run. You cannot break anything.'], ['Practice', 'Problems with instant checks, hints and solutions.']]
        .map(([t, d], i) => h('div', { class: 'how-i' }, h('span', { class: 'num' }, i + 1), h('b', null, t), h('p', null, d)))),
    h('div', { class: 'cta' }, h('a', { class: 'btn accent big', href: '#l-' + lessons[0].id }, 'Start lesson 1'), h('a', { class: 'btn ghost big', href: '#l-playground' }, 'Open the free playground')),
    h('h2', null, 'The path'),
    parts.map(g => h('section', { class: 'path-part' }, h('h3', null, g.name), h('ol', null, g.items.map(([L, n]) => h('li', { value: n }, h('a', { href: '#l-' + L.id }, L.title), h('span', null, L.line)))))),
    h('div', { class: 'callout' }, h('b', null, 'Tips for using the editor. '), 'Press Tab to indent, Ctrl or Cmd + Enter to run. When your program uses input(), a box for the answers appears under the editor. The first run waits a few seconds while Python loads in your browser. After that it is instant. Your progress ticks are saved in this browser only.'));
}

function widgetBlock(L) {
  if (!L.widget) return null;
  const titles = { types: 'Type detective', slice: 'Text slicer', fork: 'The fork in the road', loop: 'The conveyor belt', shelf: 'The shelf', dict: 'The contact book', machine: 'The function machine', blueprint: 'Blueprint workshop', phones: 'Two phones, one blueprint', tree: 'Who has the method?', vault: 'The vault', remote: 'The remote control' };
  const host = h('div', { class: 'widget-body' });
  const box = h('section', { class: 'widget', 'aria-label': titles[L.widget] }, h('div', { class: 'w-head' }, h('span', null, 'Try the animation'), h('b', null, titles[L.widget])), host);
  WIDGETS[L.widget](host);
  return box;
}

function lessonPage(L, idx) {
  const probs = L.practice.map((p, i) => {
    const sec = h('section', { class: 'prob', id: 'p-' + p.id });
    const badge = h('span', { class: 'done-badge' + (Progress.has(p.id) ? ' on' : '') }, 'Solved');
    sec.append(h('div', { class: 'prob-h' }, h('span', { class: 'pn-n' }, 'Practice ' + (i + 1)), h('h4', null, p.title), badge), h('p', { class: 'prompt', html: p.prompt }),
      Playground({ problem: p, label: 'Your answer: ' + p.title, onDone: () => { badge.classList.add('on'); renderNav(); } }));
    return sec;
  });
  return h('article', { class: 'page' },
    h('p', { class: 'kicker' }, `${L.part} · Lesson ${idx + 1} of ${lessons.length}`),
    h('h1', null, L.title),
    h('p', { class: 'lead' }, L.line),
    h('div', { class: 'analogy' }, h('span', null, 'Think of it like this'), h('p', { html: L.analogy })),
    h('div', { class: 'prose', html: L.body }),
    widgetBlock(L),
    h('h2', null, 'Run it yourself'),
    h('p', { class: 'sub' }, 'Change anything and press Run. Use Step through to watch the program think, one line at a time.'),
    Playground({ examples: L.examples, label: 'Example code' }),
    h('div', { class: 'remember' }, h('h3', null, 'Remember'), h('ul', null, L.remember.map(r => h('li', null, r)))),
    h('h2', null, 'Practice'),
    h('p', { class: 'sub' }, 'Write your answer in the editor and press Check my answer. The hint and solution are there if you get stuck.'),
    probs, lessonNav(idx));
}

function playgroundPage() {
  const ex = [
    { title: 'Scratchpad', code: '# Try anything here\nname = "Python"\nprint("I am learning", name)\n' },
    { title: 'Loop', code: 'for i in range(1, 6):\n    print(i, "squared is", i * i)\n' },
    { title: 'Mini class', code: 'class Pet:\n    def __init__(self, name):\n        self.name = name\n        self.happy = False\n\n    def play(self):\n        self.happy = True\n        return self.name + " is happy now"\n\nmy_pet = Pet("Bruno")\nprint(my_pet.play())\nprint(my_pet.happy)\n' },
    { title: 'Ask and answer', stdin: '7', code: 'n = int(input("Pick a number: "))\nif n % 2 == 0:\n    print(n, "is even")\nelse:\n    print(n, "is odd")\n' },
  ];
  return h('article', { class: 'page' }, h('p', { class: 'kicker' }, 'No rules here'), h('h1', null, 'Free playground'),
    h('p', { class: 'lead' }, 'A blank page to experiment on. Pick a starter or write your own, then Run it or Step through it.'),
    Playground({ examples: ex, label: 'Playground code' }));
}

function route() {
  const id = (location.hash.match(/^#l-([a-z]+)$/) || [])[1] || 'home';
  current = id; main.innerHTML = '';
  const idx = lessons.findIndex(L => L.id === id);
  if (id === 'home') main.append(homePage());
  else if (id === 'playground') main.append(playgroundPage());
  else if (idx >= 0) main.append(lessonPage(lessons[idx], idx));
  else { current = 'home'; main.append(homePage()); }
  renderNav(); window.scrollTo(0, 0); main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route);
route();
