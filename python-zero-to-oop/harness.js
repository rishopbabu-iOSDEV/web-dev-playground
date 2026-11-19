// Python-side helpers, loaded into Pyodide once. Runs learner code, traces it line by line, and checks practice answers.
window.HARNESS_PY = String.raw`
import sys, io, json, types, builtins, re

class _Stop(BaseException):
    pass

_HINTS = {
    'SyntaxError': "Python could not read this line. Look for a missing quote, bracket, or colon (:).",
    'IndentationError': "Lines inside an if, for, def or class must be pushed in by the same number of spaces (use 4).",
    'NameError': "Python has never heard of that name. Check the spelling, and make sure you created it on an earlier line.",
    'TypeError': "Those things do not mix, like adding a number to text. Check what kind of value each one is.",
    'ZeroDivisionError': "Dividing by zero is not allowed, in maths or in Python.",
    'IndexError': "That position does not exist. Lists start counting at 0, so the last position is len(list) - 1.",
    'KeyError': "That key is not in the dictionary. Check the spelling, or use .get().",
    'ValueError': "The value is the right kind of thing but makes no sense here, like int('abc').",
    'AttributeError': "That object has no such attribute or method. Check the spelling and what kind of object it is.",
    'EOFError': "input() ran out of values. Type your answers in the Inputs box, one per line.",
    'TimeoutError': "This program ran for too long. Is there a loop that never stops?",
    'RecursionError': "A function kept calling itself without stopping.",
}

def _friendly(e):
    line = None
    if isinstance(e, SyntaxError):
        line = e.lineno
        msg = e.msg
    else:
        msg = str(e)
        tb = e.__traceback__
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == '<learner>':
                line = tb.tb_lineno
            tb = tb.tb_next
    hint = None
    for c in type(e).__mro__:
        if c.__name__ in _HINTS:
            hint = _HINTS[c.__name__]
            break
    if isinstance(e, TimeoutError):
        msg = 'the program ran too long'
    return {'type': type(e).__name__, 'msg': msg, 'line': line, 'hint': hint}

def _exec(code, stdin_text='', mode='run', echo=True):
    steps = []
    st = {'n': 0, 'trunc': False, 'exc': None}
    ids = {}
    buf = io.StringIO()
    feed = iter(stdin_text.rstrip('\n').split('\n')) if stdin_text.strip('\n') != '' else iter(())

    def fake_input(prompt=''):
        if echo:
            sys.stdout.write(str(prompt))
        try:
            val = next(feed)
        except StopIteration:
            raise EOFError('input() ran out of values')
        if echo:
            sys.stdout.write(val + '\n')
        return val

    def ser(v, d=0):
        t = type(v)
        if v is None:
            return {'k': 'val', 't': 'None', 'v': 'None'}
        if t in (bool, int, float, complex):
            return {'k': 'val', 't': t.__name__, 'v': repr(v)}
        if isinstance(v, str):
            return {'k': 'val', 't': 'str', 'v': repr(v)[:80]}
        if isinstance(v, (types.FunctionType, types.BuiltinFunctionType, types.MethodType)):
            return {'k': 'func', 'v': getattr(v, '__name__', 'function')}
        if isinstance(v, type):
            return {'k': 'class', 'v': v.__name__}
        if isinstance(v, types.ModuleType):
            return {'k': 'module', 'v': v.__name__}
        if d > 3:
            return {'k': 'val', 't': t.__name__, 'v': '...'}
        if isinstance(v, (list, tuple, set, frozenset)):
            items = list(v)
            return {'k': 'seq', 't': t.__name__, 'items': [ser(x, d + 1) for x in items[:14]], 'more': max(0, len(items) - 14)}
        if isinstance(v, dict):
            items = list(v.items())
            return {'k': 'dict', 'items': [[ser(a, d + 1), ser(b, d + 1)] for a, b in items[:14]], 'more': max(0, len(items) - 14)}
        if hasattr(v, '__dict__') and not isinstance(v, range):
            key = id(v)
            if key not in ids:
                ids[key] = len(ids) + 1
            return {'k': 'obj', 'cls': t.__name__, 'id': ids[key], 'attrs': [[a, ser(b, d + 1)] for a, b in list(vars(v).items())[:14]]}
        return {'k': 'val', 't': t.__name__, 'v': repr(v)[:60]}

    def vars_of(ns):
        out = []
        for k, v in list(ns.items()):
            if k.startswith('__'):
                continue
            out.append([k, ser(v)])
        return out

    MAXSTEPS = 400
    MAXLINES = 400000

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<learner>':
            return None
        if event == 'call':
            return tracer
        if event == 'line':
            st['n'] += 1
            if st['n'] > MAXLINES:
                raise TimeoutError('too long')
        if mode != 'trace' or event not in ('line', 'return', 'exception'):
            return tracer
        is_mod = frame.f_code.co_name == '<module>'
        ev = event
        note = None
        if event == 'return':
            ev = 'end' if is_mod else 'return'
            if not is_mod:
                note = repr(arg)[:60]
        elif event == 'exception':
            exc = arg[1]
            if st['exc'] is exc:
                return tracer
            st['exc'] = exc
            note = type(exc).__name__ + ': ' + str(exc)
        if len(steps) >= MAXSTEPS:
            st['trunc'] = True
            raise _Stop()
        stack = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == '<learner>':
                stack.append(f.f_code.co_name)
            f = f.f_back
        stack.reverse()
        steps.append({
            'line': None if ev == 'end' else frame.f_lineno,
            'ev': ev, 'note': note, 'stack': stack,
            'g': vars_of(frame.f_globals),
            'l': None if is_mod else vars_of(frame.f_locals),
            'out': buf.getvalue()[-3000:],
        })
        return tracer

    old_out, old_in = sys.stdout, builtins.input
    sys.stdout = buf
    builtins.input = fake_input
    err = None
    ns = {'__name__': '__main__'}
    try:
        try:
            compiled = compile(code, '<learner>', 'exec')
        except SyntaxError as e:
            err = _friendly(e)
            compiled = None
        if compiled is not None:
            sys.settrace(tracer)
            try:
                exec(compiled, ns)
            finally:
                sys.settrace(None)
    except _Stop:
        pass
    except BaseException as e:
        err = _friendly(e)
    finally:
        sys.stdout = old_out
        builtins.input = old_in
    if mode == 'trace' and err and err['type'] != 'SyntaxError' and steps:
        steps.append({'line': err['line'], 'ev': 'exception', 'note': err['type'] + ': ' + err['msg'], 'stack': steps[-1]['stack'],
                      'g': steps[-1]['g'], 'l': steps[-1]['l'], 'out': buf.getvalue()[-3000:]})
    res = {'out': buf.getvalue()[:20000], 'err': err, 'trunc': st['trunc']}
    return res, ns, steps

def _go(code, stdin_text='', mode='run', echo=True):
    res, ns, steps = _exec(code, stdin_text, mode, echo)
    if mode == 'trace':
        res['steps'] = steps
    return json.dumps(res)

def _guarded(fn, limit=300000):
    n = [0]
    def tr(frame, event, arg):
        if frame.f_code.co_filename != '<learner>':
            return None
        if event == 'line':
            n[0] += 1
            if n[0] > limit:
                raise TimeoutError('too long')
        return tr
    sys.settrace(tr)
    try:
        return fn()
    finally:
        sys.settrace(None)

def _norm(s):
    return '\n'.join(x.rstrip() for x in s.strip().split('\n'))

def _check(code, problem_json):
    p = json.loads(problem_json)
    results = []
    for c in p.get('cases', []):
        r, ns, _ = _exec(code, c.get('stdin', ''), 'run', False)
        label = c.get('m') or 'Prints the right output'
        if r['err']:
            e = r['err']
            results.append({'ok': False, 'm': label, 'detail': e['type'] + ': ' + e['msg'] + (' (line ' + str(e['line']) + ')' if e['line'] else '')})
            continue
        got, exp = _norm(r['out']), _norm(c['out'])
        ok = got == exp
        results.append({'ok': ok, 'm': label, 'detail': None if ok else 'Expected:\n' + exp + '\n\nYour code printed:\n' + (got if got else '(nothing)')})
    if p.get('checks'):
        r, ns, _ = _exec(code, '', 'run', False)
        if r['err']:
            e = r['err']
            results.append({'ok': False, 'm': 'Your code runs without errors', 'detail': e['type'] + ': ' + e['msg'] + (' (line ' + str(e['line']) + ')' if e['line'] else '')})
        else:
            setup_err = None
            if p.get('setup'):
                try:
                    _guarded(lambda: exec(compile(p['setup'], '<setup>', 'exec'), ns))
                except BaseException as e:
                    setup_err = type(e).__name__ + ': ' + str(e)
            for expr, m in p['checks']:
                if setup_err:
                    results.append({'ok': False, 'm': m, 'detail': setup_err})
                    continue
                try:
                    ok = bool(_guarded(lambda: eval(expr, ns)))
                    results.append({'ok': ok, 'm': m, 'detail': None})
                except BaseException as e:
                    results.append({'ok': False, 'm': m, 'detail': type(e).__name__ + ': ' + str(e)})
    return json.dumps({'results': results})

def _peek(expr):
    expr = expr.strip()
    if not expr:
        return json.dumps({'ok': False, 'err': 'Type something to try.'})
    if len(expr) > 80 or expr.count('**') > 1 or re.search(r'\d{7,}', expr):
        return json.dumps({'ok': False, 'err': 'Keep it small, please.'})
    try:
        v = eval(expr, {'__name__': 'peek'})
        return json.dumps({'ok': True, 'repr': repr(v)[:200], 'type': type(v).__name__})
    except BaseException as e:
        f = _friendly(e)
        return json.dumps({'ok': False, 'err': f['type'] + ': ' + f['msg'], 'hint': f['hint']})
`;
if (typeof module !== 'undefined') module.exports = window.HARNESS_PY;
