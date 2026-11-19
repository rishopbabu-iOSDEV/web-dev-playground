// Lesson content. Plain objects so the app and the test script read the same data.
// problem: {title, prompt, starter, hint, solution, cases:[{stdin,out,m}], setup, checks:[[pythonExpr, message]]}
window.LESSONS = [
{
  id: 'print', part: 'Part 1 · First steps', title: 'Talking to the computer',
  line: 'A program is a list of instructions. print() makes Python show something on the screen.',
  analogy: 'Python is a very literal assistant. It reads your instructions from top to bottom, one line at a time, and does exactly what you wrote, nothing more.',
  body: `
<p>Type the instruction, press <b>Run</b>, and the answer appears in the <b>Output</b> box. Words go inside quotes. Numbers do not need quotes.</p>
<p>A line that starts with <code>#</code> is a <b>comment</b>. Python ignores it. It is a note to humans, including future you.</p>
<p>Try the <b>Step through</b> button below. It runs your program slowly, one line at a time, and shows what Python is doing.</p>`,
  examples: [
    { title: 'Hello', code: `# My first program
print("Hello, world!")
print("I am learning Python")
print(2 + 3)
print("2 + 3")` },
    { title: 'Many things at once', code: `print("Total:", 25 + 75)
print("Python", "is", "fun")
print("Line one")
print()
print("Line three, after a blank line")` },
  ],
  widget: null,
  remember: ['print(...) shows things on screen.', 'Text goes in quotes: "like this". Numbers do not.', 'Python runs top to bottom, one line at a time.', '# starts a comment that Python ignores.'],
  practice: [
    { title: 'Say hello', prompt: 'Make Python print exactly <code>Hello, Python!</code>',
      starter: '# write your print line below\n', hint: 'Use print("...") and put the words between the quotes.',
      cases: [{ out: 'Hello, Python!', m: 'Prints Hello, Python!' }], solution: 'print("Hello, Python!")' },
    { title: 'Two lines', prompt: 'Print two lines. The first line is <code>Python is fun</code>. The second line is <code>and I can do it</code>.',
      starter: '', hint: 'Use two print() lines, one under the other.',
      cases: [{ out: 'Python is fun\nand I can do it', m: 'Prints the two lines in order' }], solution: 'print("Python is fun")\nprint("and I can do it")' },
    { title: 'Let Python do the maths', prompt: 'How many hours are in a year of 365 days? Make Python <b>calculate</b> 24 times 365 and print the answer. Do not type the answer yourself.',
      starter: '', hint: 'In Python, times is * . Write print(24 * 365) without quotes.',
      cases: [{ out: '8760', m: 'Prints 8760' }], solution: 'print(24 * 365)' },
  ],
},
{
  id: 'variables', part: 'Part 1 · First steps', title: 'Variables: labelled boxes',
  line: 'A variable is a name that remembers a value, so you can use it later.',
  analogy: 'Think of a box with a label on it. The label is the variable name. What is inside is the value. You can open the box and put something else in whenever you like.',
  body: `
<p><code>price = 50</code> means: put 50 in a box labelled <code>price</code>. The single <code>=</code> is not "equals" from maths. It means <b>store this</b>.</p>
<p>Names can use letters, digits and underscores, but cannot start with a digit. Use clear names such as <code>total_marks</code>, written in lower case with underscores.</p>
<p>Use <b>Step through</b> and watch the boxes appear on the right. A box flashes when its value changes.</p>
<p><code>input()</code> asks the person using your program to type something. What comes back is always <b>text</b>. In the playground, type the answers in the <b>Inputs</b> box that appears, one per line.</p>`,
  examples: [
    { title: 'Boxes', code: `price = 50
quantity = 3
total = price * quantity
print("Total:", total)

quantity = 5          # put a new value in the same box
total = price * quantity
print("New total:", total)` },
    { title: 'Swap', code: `a = 1
b = 2
a, b = b, a           # swap the contents of the two boxes
print(a, b)` },
    { title: 'Ask a question', stdin: 'Asha', code: `name = input("What is your name? ")
print("Nice to meet you,", name)` },
  ],
  widget: null,
  remember: ['name = value stores a value under a name.', 'Assigning again replaces the old value.', 'input() always gives back text.', 'Good names say what is inside: total_marks, not x.'],
  practice: [
    { title: 'Area', prompt: 'Create a variable called <code>area</code> that holds <code>length</code> times <code>width</code>.',
      starter: 'length = 8\nwidth = 5\n# create area below\n', hint: 'area = length * width',
      checks: [['area == 40', 'area is 40'], ['length == 8 and width == 5', 'length and width are still 8 and 5']], solution: 'length = 8\nwidth = 5\narea = length * width' },
    { title: 'Update a box', prompt: 'Start with <code>score = 10</code>. Add 5 to <code>score</code>, then double it. At the end <code>score</code> should hold 30.',
      starter: 'score = 10\n# add 5 to score\n# then double score\n', hint: 'score = score + 5, then score = score * 2. Order matters.',
      checks: [['score == 30', 'score ends at 30']], solution: 'score = 10\nscore = score + 5\nscore = score * 2' },
    { title: 'Greet someone', prompt: 'Ask for a name with <code>input()</code>, then print <code>Hello, </code> followed by the name and an exclamation mark. For Asha it should print <code>Hello, Asha!</code>',
      starter: 'name = input()\n', hint: 'Join text with +: "Hello, " + name + "!"',
      cases: [{ stdin: 'Asha', out: 'Hello, Asha!', m: 'Input Asha prints Hello, Asha!' }, { stdin: 'Ravi', out: 'Hello, Ravi!', m: 'Input Ravi prints Hello, Ravi!' }],
      solution: 'name = input()\nprint("Hello, " + name + "!")' },
  ],
},
{
  id: 'types', part: 'Part 1 · First steps', title: 'Numbers, text and True/False',
  line: 'Every value has a kind (a type). The kind decides what you can do with it.',
  analogy: 'A calculator is for numbers, a notebook is for words, and a light switch is only ever on or off. Python keeps these kinds apart so that "5" (text) and 5 (a number) behave differently.',
  body: `
<ul>
<li><code>int</code>: whole numbers, like <code>7</code> or <code>-3</code>.</li>
<li><code>float</code>: numbers with a decimal point, like <code>7.5</code>.</li>
<li><code>str</code>: text, like <code>"hello"</code>.</li>
<li><code>bool</code>: only <code>True</code> or <code>False</code>.</li>
</ul>
<p>Maths symbols: <code>+ - *</code> as usual. <code>/</code> divides and always gives a decimal. <code>//</code> gives how many whole times it fits. <code>%</code> gives the leftover. <code>**</code> is "to the power of".</p>
<p>Convert between kinds with <code>int("5")</code>, <code>float("2.5")</code> and <code>str(5)</code>. Use the Type Detective to see what Python thinks.</p>`,
  examples: [
    { title: 'Maths', code: `print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2)      # always a decimal
print(7 // 2)     # whole times 2 fits in 7
print(7 % 2)      # what is left over
print(2 ** 3)     # 2 x 2 x 2` },
    { title: 'Kinds', code: `print(type(7), type(7.0), type("7"), type(True))
age_text = "21"
age = int(age_text)       # text -> whole number
print(age + 1)
print(5 > 3, 5 == 6)` },
  ],
  widget: 'types',
  remember: ['int, float, str, bool are the basic kinds.', '/ gives a decimal, // gives whole parts, % gives the leftover.', '"5" + "5" is "55" (text glued), but 5 + 5 is 10.', 'int(), float(), str() convert between kinds.'],
  practice: [
    { title: 'Text to number', prompt: 'You are given <code>age_text = "21"</code>. Convert it to a whole number called <code>age</code>, then make <code>next_year</code> hold <code>age + 1</code>.',
      starter: 'age_text = "21"\n# make age from age_text\n# make next_year\n', hint: 'age = int(age_text)',
      checks: [['age == 21 and type(age) is int', 'age is the whole number 21'], ['next_year == 22', 'next_year is 22']], solution: 'age_text = "21"\nage = int(age_text)\nnext_year = age + 1' },
    { title: 'Hours and minutes', prompt: '<code>minutes = 135</code>. Work out how many whole <code>hours</code> that is, and how many minutes are <code>left</code> over.',
      starter: 'minutes = 135\n# hours = whole hours\n# left = minutes remaining\n', hint: '// gives whole parts and % gives the leftover. Use 60.',
      checks: [['hours == 2', 'hours is 2'], ['left == 15', 'left is 15']], solution: 'minutes = 135\nhours = minutes // 60\nleft = minutes % 60' },
    { title: 'Average of two', prompt: 'Read two whole numbers with <code>input()</code> and print their average. For 10 and 20 print <code>15.0</code>.',
      starter: 'a = int(input())\nb = int(input())\n# print the average of a and b\n', hint: 'Add them, then divide by 2 using /. Put the addition in brackets.',
      cases: [{ stdin: '10\n20', out: '15.0', m: '10 and 20 give 15.0' }, { stdin: '7\n8', out: '7.5', m: '7 and 8 give 7.5' }],
      solution: 'a = int(input())\nb = int(input())\nprint((a + b) / 2)' },
  ],
},
{
  id: 'text', part: 'Part 1 · First steps', title: 'Working with text',
  line: 'Text is a row of letters, each sitting in a numbered seat starting from 0.',
  analogy: 'Imagine the word as a row of seats in a cinema, numbered from 0. Picking one letter is picking one seat. Slicing is picking a block of seats.',
  body: `
<p>Glue text with <code>+</code>, repeat it with <code>*</code>, count letters with <code>len()</code>. Counting from the back uses negative numbers: <code>-1</code> is the last letter.</p>
<p><code>word[start:end]</code> takes the letters from <code>start</code> up to, but <b>not including</b>, <code>end</code>. Play with the slicer to see it.</p>
<p><b>f-strings</b> are the easiest way to mix text and values: put <code>f</code> before the quote and write variables inside <code>{ }</code>.</p>`,
  examples: [
    { title: 'Basics', code: `name = "Asha"
print("Hello, " + name)
print(f"Hello, {name}! Your name has {len(name)} letters.")
print(name.upper(), name.lower())
print("ha" * 3)` },
    { title: 'Seats and slices', code: `word = "PYTHON"
print(word[0], word[-1])      # first and last
print(word[0:3])              # seats 0, 1, 2
print(word[2:])               # from seat 2 to the end
print(word[::-1])             # backwards
print("  hello  ".strip())     # trim spaces
print("a-b-c".replace("-", " "))` },
  ],
  widget: 'slice',
  remember: ['len(text) counts the letters.', 'text[0] is the first letter, text[-1] the last.', 'text[a:b] stops just before b.', 'f"Hello {name}" mixes text and variables.', '.upper() .lower() .strip() .replace() are handy.'],
  practice: [
    { title: 'Full name', prompt: 'Join <code>first</code> and <code>last</code> with a space between them and store it in <code>full</code>.',
      starter: 'first = "Ada"\nlast = "Lovelace"\n# make full\n', hint: 'full = first + " " + last',
      checks: [['full == "Ada Lovelace"', 'full is "Ada Lovelace"']], solution: 'first = "Ada"\nlast = "Lovelace"\nfull = first + " " + last' },
    { title: 'Pieces of a word', prompt: 'For <code>word = "banana"</code> make <code>first_three</code> (the first 3 letters), <code>shout</code> (all capitals) and <code>last_letter</code>.',
      starter: 'word = "banana"\n', hint: 'word[:3], word.upper(), word[-1]',
      checks: [['first_three == "ban"', 'first_three is "ban"'], ['shout == "BANANA"', 'shout is "BANANA"'], ['last_letter == "a"', 'last_letter is "a"']],
      solution: 'word = "banana"\nfirst_three = word[:3]\nshout = word.upper()\nlast_letter = word[-1]' },
    { title: 'Price tag', prompt: 'With <code>item = "pen"</code> and <code>price = 12</code>, use an f-string to make <code>message</code> equal to <code>pen costs 12 rupees</code>.',
      starter: 'item = "pen"\nprice = 12\n', hint: 'message = f"{item} costs {price} rupees"',
      checks: [['message == "pen costs 12 rupees"', 'message is "pen costs 12 rupees"']], solution: 'item = "pen"\nprice = 12\nmessage = f"{item} costs {price} rupees"' },
  ],
},
{
  id: 'decisions', part: 'Part 2 · Making decisions and repeating', title: 'Decisions with if',
  line: 'if lets your program choose what to do, depending on whether something is true.',
  analogy: 'A fork in the road with signboards. Python checks the signs from top to bottom and takes the first road whose sign is true. After that it ignores the remaining signs.',
  body: `
<p>Compare with <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>. Join conditions with <code>and</code>, <code>or</code>, <code>not</code>.</p>
<p>The lines that belong to an <code>if</code> are <b>pushed in by 4 spaces</b>. That indentation is how Python knows which lines are inside. Do not forget the colon <code>:</code> at the end of the <code>if</code> line.</p>
<p>Slide the temperature below and watch which road Python takes.</p>`,
  examples: [
    { title: 'if / elif / else', code: `temp = 32
if temp >= 30:
    print("Wear light clothes")
elif temp >= 20:
    print("A T-shirt is fine")
else:
    print("Take a jacket")
print("Have a nice day")   # not indented: always runs` },
    { title: 'and / or', code: `age = 19
has_id = True
if age >= 18 and has_id:
    print("Entry allowed")
else:
    print("Entry denied")` },
  ],
  widget: 'fork',
  remember: ['== compares, = stores.', 'Indent 4 spaces under if / elif / else, and end those lines with a colon.', 'Only the first true branch runs.', 'and, or, not combine conditions.'],
  practice: [
    { title: 'Pass or fail', prompt: 'Read <code>marks</code>. Print <code>Pass</code> if marks are 40 or more, otherwise print <code>Fail</code>.',
      starter: 'marks = int(input())\n# print Pass or Fail\n', hint: 'if marks >= 40: ... else: ...',
      cases: [{ stdin: '72', out: 'Pass', m: '72 is Pass' }, { stdin: '40', out: 'Pass', m: '40 is Pass' }, { stdin: '39', out: 'Fail', m: '39 is Fail' }, { stdin: '0', out: 'Fail', m: '0 is Fail' }],
      solution: 'marks = int(input())\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")' },
    { title: 'Ticket price', prompt: 'Read an <code>age</code>. Under 5 prints <code>Free</code>. From 5 to 17 prints <code>Half</code>. 18 and above prints <code>Full</code>.',
      starter: 'age = int(input())\n', hint: 'Use if, elif and else. Check the smallest group first.',
      cases: [{ stdin: '3', out: 'Free', m: 'Age 3 is Free' }, { stdin: '5', out: 'Half', m: 'Age 5 is Half' }, { stdin: '17', out: 'Half', m: 'Age 17 is Half' }, { stdin: '18', out: 'Full', m: 'Age 18 is Full' }, { stdin: '70', out: 'Full', m: 'Age 70 is Full' }],
      solution: 'age = int(input())\nif age < 5:\n    print("Free")\nelif age < 18:\n    print("Half")\nelse:\n    print("Full")' },
    { title: 'Leap year (challenge)', prompt: 'Read a <code>year</code>. Print <code>Leap</code> if it is divisible by 4, except century years (divisible by 100) which must also be divisible by 400. Otherwise print <code>Not leap</code>.',
      starter: 'year = int(input())\n', hint: '(year % 4 == 0 and year % 100 != 0) or year % 400 == 0',
      cases: [{ stdin: '2024', out: 'Leap', m: '2024 is Leap' }, { stdin: '1900', out: 'Not leap', m: '1900 is Not leap' }, { stdin: '2000', out: 'Leap', m: '2000 is Leap' }, { stdin: '2023', out: 'Not leap', m: '2023 is Not leap' }],
      solution: 'year = int(input())\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print("Leap")\nelse:\n    print("Not leap")' },
  ],
},
{
  id: 'loops', part: 'Part 2 · Making decisions and repeating', title: 'Loops: repeating work',
  line: 'A loop repeats the same instructions, so you never copy and paste lines.',
  analogy: 'A factory conveyor belt. Items arrive one by one, and the same worker does the same job on each item. A for loop handles a known number of items. A while loop keeps going until a condition stops being true.',
  body: `
<p><code>for item in collection:</code> takes the items one at a time. <code>range(5)</code> makes the numbers 0, 1, 2, 3, 4. <code>range(1, 6)</code> makes 1 to 5.</p>
<p><code>while condition:</code> repeats as long as the condition is true. Make sure something inside the loop changes, or it will never end.</p>
<p><code>break</code> leaves the loop early. <code>continue</code> skips to the next item.</p>
<p>A very common pattern is the <b>accumulator</b>: start a variable at 0 and keep adding to it inside the loop. Watch it in the conveyor belt.</p>`,
  examples: [
    { title: 'for + accumulator', code: `total = 0
for n in [3, 1, 4, 1, 5]:
    total = total + n
print("Total:", total)` },
    { title: 'times table', code: `for i in range(1, 6):
    print(i, "x 7 =", i * 7)` },
    { title: 'while', code: `count = 3
while count > 0:
    print("Countdown:", count)
    count = count - 1
print("Liftoff!")` },
  ],
  widget: 'loop',
  remember: ['for repeats once per item.', 'range(1, 6) gives 1, 2, 3, 4, 5 (it stops before 6).', 'while repeats while its condition is true. Change something inside it.', 'Accumulator: total = 0, then total = total + n in the loop.'],
  practice: [
    { title: 'Count to five', prompt: 'Print the numbers 1 to 5, one per line.',
      starter: '', hint: 'for i in range(1, 6): print(i)',
      cases: [{ out: '1\n2\n3\n4\n5', m: 'Prints 1 to 5 on separate lines' }], solution: 'for i in range(1, 6):\n    print(i)' },
    { title: 'Add 1 to 100', prompt: 'Use a loop to add all the numbers from 1 to 100 into a variable called <code>total</code>.',
      starter: 'total = 0\n# loop and add\n', hint: 'for n in range(1, 101): total = total + n',
      checks: [['total == 5050', 'total is 5050']], solution: 'total = 0\nfor n in range(1, 101):\n    total = total + n' },
    { title: 'Countdown', prompt: 'Read a number <code>n</code>. Print n, n-1, ... down to 1, each on its own line, then print <code>Liftoff!</code>',
      starter: 'n = int(input())\n', hint: 'while n > 0: print(n), then reduce n by 1. Print Liftoff! after the loop.',
      cases: [{ stdin: '3', out: '3\n2\n1\nLiftoff!', m: '3 counts down and lifts off' }, { stdin: '1', out: '1\nLiftoff!', m: '1 counts down and lifts off' }],
      solution: 'n = int(input())\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("Liftoff!")' },
    { title: 'FizzBuzz (challenge)', prompt: 'For the numbers 1 to 15: print <code>Fizz</code> if divisible by 3, <code>Buzz</code> if divisible by 5, <code>FizzBuzz</code> if both, otherwise the number itself.',
      starter: '', hint: 'Check the "both" case first, using i % 15 == 0.',
      cases: [{ out: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', m: 'Prints the FizzBuzz sequence for 1 to 15' }],
      solution: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)' },
  ],
},
{
  id: 'lists', part: 'Part 3 · Collections and functions', title: 'Lists: ordered collections',
  line: 'A list keeps many values in order, each in its own numbered slot.',
  analogy: 'A shelf with numbered slots, starting from slot 0. You can add things to the end, remove things, look at any slot by its number, or walk along the whole shelf.',
  body: `
<p>Write a list with square brackets: <code>fruits = ["apple", "banana"]</code>. Get an item with <code>fruits[0]</code>. <code>fruits[-1]</code> is the last one.</p>
<p>Handy tools: <code>append(x)</code> adds to the end, <code>insert(i, x)</code> adds at a position, <code>pop()</code> removes and returns the last item, <code>remove(x)</code> removes a value, <code>sort()</code> puts things in order.</p>
<p>Also: <code>len(list)</code>, <code>sum(list)</code>, <code>max(list)</code>, <code>min(list)</code>, and <code>x in list</code> to test membership.</p>
<p>A <b>tuple</b> is a list that cannot change, written with round brackets: <code>point = (3, 4)</code>.</p>`,
  examples: [
    { title: 'Shelf', code: `fruits = ["apple", "banana", "cherry"]
print(fruits[0], fruits[-1])
fruits.append("mango")
fruits.remove("banana")
print(fruits, len(fruits))
for f in fruits:
    print("I like", f)` },
    { title: 'Numbers', code: `marks = [72, 45, 90, 33]
print(max(marks), min(marks))
print("Average:", sum(marks) / len(marks))
print(sorted(marks))
print(45 in marks)` },
  ],
  widget: 'shelf',
  remember: ['Slots start at 0. The last is -1.', 'append adds to the end, pop removes the last.', 'len, sum, max, min, sorted work on lists.', 'for item in my_list walks the whole list.'],
  practice: [
    { title: 'First, last, biggest', prompt: 'For <code>numbers</code> create <code>first</code>, <code>last</code> and <code>biggest</code>.',
      starter: 'numbers = [4, 8, 15, 16, 23, 42]\n', hint: 'numbers[0], numbers[-1], max(numbers)',
      checks: [['first == 4', 'first is 4'], ['last == 42', 'last is 42'], ['biggest == 42', 'biggest is 42']], solution: 'numbers = [4, 8, 15, 16, 23, 42]\nfirst = numbers[0]\nlast = numbers[-1]\nbiggest = max(numbers)' },
    { title: 'Squares', prompt: 'Build a list called <code>squares</code> holding 1, 4, 9, 16, 25 (the squares of 1 to 5) using a loop and <code>append</code>.',
      starter: 'squares = []\n', hint: 'for n in range(1, 6): squares.append(n * n)',
      checks: [['squares == [1, 4, 9, 16, 25]', 'squares is [1, 4, 9, 16, 25]']], solution: 'squares = []\nfor n in range(1, 6):\n    squares.append(n * n)' },
    { title: 'Count the evens', prompt: 'Count how many numbers in the list are even and store the count in <code>evens</code>.',
      starter: 'numbers = [3, 8, 12, 7, 10, 5, 6]\nevens = 0\n', hint: 'Loop over the list. A number is even when n % 2 == 0.',
      checks: [['evens == 4', 'evens is 4']], solution: 'numbers = [3, 8, 12, 7, 10, 5, 6]\nevens = 0\nfor n in numbers:\n    if n % 2 == 0:\n        evens = evens + 1' },
  ],
},
{
  id: 'dicts', part: 'Part 3 · Collections and functions', title: 'Dictionaries: look things up by name',
  line: 'A dictionary stores pairs: a key and its value. You look things up by key, not by position.',
  analogy: 'A phone contact book. You do not remember that Asha is the 17th entry. You search for "Asha" and get her number. The name is the key, the number is the value.',
  body: `
<p>Write one with curly brackets: <code>{"name": "Meera", "age": 19}</code>. Read with <code>d["name"]</code>, change or add with <code>d["age"] = 20</code>, delete with <code>del d["age"]</code>.</p>
<p>If the key does not exist, <code>d["x"]</code> raises a <b>KeyError</b>. <code>d.get("x")</code> returns <code>None</code> instead, or a default you choose: <code>d.get("x", 0)</code>.</p>
<p>Loop with <code>for key, value in d.items():</code>. A <b>set</b> is a bag of unique values: <code>{1, 2, 2, 3}</code> is just <code>{1, 2, 3}</code>.</p>`,
  examples: [
    { title: 'Contact card', code: `student = {"name": "Meera", "age": 19, "city": "Chennai"}
print(student["name"])
student["age"] = 20
student["course"] = "BBA"
print(student.get("phone", "not given"))
for key, value in student.items():
    print(key, "->", value)` },
    { title: 'Counting', code: `words = ["tea", "coffee", "tea", "tea", "coffee"]
count = {}
for w in words:
    count[w] = count.get(w, 0) + 1
print(count)
print(set(words))` },
  ],
  widget: 'dict',
  remember: ['Dictionaries map keys to values.', 'd[key] reads, d[key] = v adds or changes.', 'd.get(key, default) is the safe way to read.', 'for k, v in d.items() walks every pair.'],
  practice: [
    { title: 'Add an item', prompt: 'Add a new pair to <code>prices</code>: the key <code>"bag"</code> with value <code>450</code>.',
      starter: 'prices = {"pen": 10, "book": 120}\n', hint: 'prices["bag"] = 450',
      checks: [['prices == {"pen": 10, "book": 120, "bag": 450}', 'prices has pen, book and bag']], solution: 'prices = {"pen": 10, "book": 120}\nprices["bag"] = 450' },
    { title: 'Total of the values', prompt: 'Add up all the prices and store the sum in <code>total</code>.',
      starter: 'prices = {"pen": 10, "book": 120, "bag": 450}\ntotal = 0\n', hint: 'for item in prices: total = total + prices[item]  (or use .values())',
      checks: [['total == 580', 'total is 580']], solution: 'prices = {"pen": 10, "book": 120, "bag": 450}\ntotal = 0\nfor item in prices:\n    total = total + prices[item]' },
    { title: 'Count letters', prompt: 'Count how many times each letter appears in <code>"banana"</code> and store it in <code>counts</code>. It should be <code>{"b": 1, "a": 3, "n": 2}</code>.',
      starter: 'word = "banana"\ncounts = {}\n', hint: 'counts[letter] = counts.get(letter, 0) + 1',
      checks: [['counts == {"b": 1, "a": 3, "n": 2}', 'counts is {"b": 1, "a": 3, "n": 2}']], solution: 'word = "banana"\ncounts = {}\nfor letter in word:\n    counts[letter] = counts.get(letter, 0) + 1' },
  ],
},
{
  id: 'functions', part: 'Part 3 · Collections and functions', title: 'Functions: your own machines',
  line: 'A function is a named block of code you write once and use as many times as you like.',
  analogy: 'A juicer. You put fruit in, it does a fixed job, and juice comes out. You do not rebuild the juicer each morning. In Python, what goes in is the arguments, and what comes out is the return value.',
  body: `
<p>Define with <code>def</code>, a name, brackets with the inputs (<b>parameters</b>), a colon, then an indented body. <code>return</code> sends the answer back.</p>
<p><b>print vs return.</b> <code>print</code> shows something to a human. <code>return</code> hands a value back to the code that called the function. A function with no <code>return</code> gives back <code>None</code>. Try "shout" in the machine to see it.</p>
<p>Variables made inside a function live only inside it. You can give a parameter a <b>default</b>: <code>def area(length, width=1)</code>.</p>
<p>Python also ships with ready-made toolboxes called <b>modules</b>. <code>import math</code> gives you <code>math.sqrt()</code> and <code>math.pi</code>.</p>`,
  examples: [
    { title: 'First function', code: `def greet(name):
    return "Hello, " + name + "!"

message = greet("Asha")
print(message)
print(greet("Ravi"))` },
    { title: 'Defaults and modules', code: `import math

def area_of_rectangle(length, width=1):
    return length * width

print(area_of_rectangle(4, 5))
print(area_of_rectangle(4))
print(math.sqrt(49), math.pi)` },
  ],
  widget: 'machine',
  remember: ['def name(inputs): then an indented body.', 'return gives a value back. print only shows it.', 'No return means the function gives back None.', 'Write a function once, call it many times.'],
  practice: [
    { title: 'double', prompt: 'Write <code>double(n)</code> that returns <code>n</code> times 2.',
      starter: 'def double(n):\n    # your code here\n    pass\n', hint: 'return n * 2',
      checks: [['double(4) == 8', 'double(4) returns 8'], ['double(-3) == -6', 'double(-3) returns -6'], ['double(0) == 0', 'double(0) returns 0']], solution: 'def double(n):\n    return n * 2' },
    { title: 'is_even', prompt: 'Write <code>is_even(n)</code> that returns <code>True</code> for even numbers and <code>False</code> otherwise.',
      starter: 'def is_even(n):\n    pass\n', hint: 'return n % 2 == 0',
      checks: [['is_even(4) is True', 'is_even(4) is True'], ['is_even(7) is False', 'is_even(7) is False'], ['is_even(0) is True', 'is_even(0) is True']], solution: 'def is_even(n):\n    return n % 2 == 0' },
    { title: 'average', prompt: 'Write <code>average(numbers)</code> that returns the mean of a list of numbers.',
      starter: 'def average(numbers):\n    pass\n', hint: 'sum(numbers) / len(numbers)',
      checks: [['average([2, 4, 6]) == 4', 'average([2, 4, 6]) is 4'], ['average([10]) == 10', 'average([10]) is 10'], ['average([1, 2]) == 1.5', 'average([1, 2]) is 1.5']], solution: 'def average(numbers):\n    return sum(numbers) / len(numbers)' },
    { title: 'count_vowels (challenge)', prompt: 'Write <code>count_vowels(text)</code> that returns how many vowels (a, e, i, o, u, in any case) the text has.',
      starter: 'def count_vowels(text):\n    pass\n', hint: 'Loop over text.lower() and test letter in "aeiou".',
      checks: [['count_vowels("banana") == 3', 'count_vowels("banana") is 3'], ['count_vowels("sky") == 0', 'count_vowels("sky") is 0'], ['count_vowels("AEIOU") == 5', 'count_vowels("AEIOU") is 5']],
      solution: 'def count_vowels(text):\n    total = 0\n    for letter in text.lower():\n        if letter in "aeiou":\n            total = total + 1\n    return total' },
  ],
},
{
  id: 'errors', part: 'Part 3 · Collections and functions', title: 'When things go wrong',
  line: 'Everyone gets errors. Reading them is a skill, and try / except lets your program recover.',
  analogy: 'A safety net under a trapeze. If something goes wrong, the program lands softly in the except block instead of crashing to the floor.',
  body: `
<p>Three kinds of mistakes:</p>
<ul>
<li><b>Syntax error</b>: Python cannot even read your code (missing quote, colon, bracket).</li>
<li><b>Runtime error</b>: the code is readable but fails while running (<code>1 / 0</code>, a missing key).</li>
<li><b>Logic error</b>: no error message, but the answer is wrong. These are the hardest to find.</li>
</ul>
<p>Read the error from the <b>bottom</b>: the last line says what went wrong, and the line number says where. The playground adds a plain-English tip under each error.</p>
<p><code>try:</code> runs risky code. If an error of the named kind happens, Python jumps to <code>except</code>. Use <b>Step through</b> and see the jump.</p>`,
  examples: [
    { title: 'Catch it', code: `text = "abc"
try:
    number = int(text)
    print("Number is", number)
except ValueError:
    print("That was not a number!")
print("The program keeps running")` },
    { title: 'Safe divide', code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(safe_divide(10, 2))
print(safe_divide(1, 0))` },
    { title: 'See an error', expectError: true, code: `numbers = [1, 2, 3]
print(numbers[5])` },
  ],
  widget: null,
  remember: ['Read errors from the bottom up.', 'try / except catches an error and carries on.', 'Catch the specific error you expect, like ValueError.', 'Logic errors give no message. Print values to investigate.'],
  practice: [
    { title: 'Fix the typos', prompt: 'This program should print <code>Hello, Asha</code> but has two mistakes. Fix them.',
      starter: 'name = "Asha\nprint("Hello, " + nam)\n', hint: 'One string is missing its closing quote. One variable name is spelled wrongly.',
      cases: [{ out: 'Hello, Asha', m: 'Prints Hello, Asha' }], solution: 'name = "Asha"\nprint("Hello, " + name)' },
    { title: 'Find the logic bug', prompt: '<code>average</code> runs without errors but gives the wrong answer. Find and fix the bug.',
      starter: 'def average(numbers):\n    total = 0\n    for n in numbers:\n        total = total + n\n        return total / len(numbers)\n', hint: 'The return line is inside the loop, so the function leaves after the first number. Move it out by indenting less.',
      checks: [['average([2, 4, 6]) == 4', 'average([2, 4, 6]) is 4'], ['average([10]) == 10', 'average([10]) is 10']], solution: 'def average(numbers):\n    total = 0\n    for n in numbers:\n        total = total + n\n    return total / len(numbers)' },
    { title: 'to_number', prompt: 'Write <code>to_number(text)</code>. It returns the whole number inside the text, or <code>0</code> if the text is not a number.',
      starter: 'def to_number(text):\n    pass\n', hint: 'try: return int(text), and except ValueError: return 0',
      checks: [['to_number("12") == 12', 'to_number("12") is 12'], ['to_number("abc") == 0', 'to_number("abc") is 0'], ['to_number("") == 0', 'to_number("") is 0']],
      solution: 'def to_number(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0' },
    { title: 'safe_get', prompt: 'Write <code>safe_get(items, index)</code>. Return the item at that position, or <code>None</code> if the position does not exist.',
      starter: 'def safe_get(items, index):\n    pass\n', hint: 'Catch IndexError.',
      checks: [['safe_get([10, 20, 30], 1) == 20', 'safe_get([10, 20, 30], 1) is 20'], ['safe_get([10, 20, 30], 9) is None', 'safe_get([10, 20, 30], 9) is None'], ['safe_get([], 0) is None', 'safe_get([], 0) is None']],
      solution: 'def safe_get(items, index):\n    try:\n        return items[index]\n    except IndexError:\n        return None' },
  ],
},
{
  id: 'classes', part: 'Part 4 · Object-oriented programming', title: 'Classes and objects',
  line: 'A class is a blueprint. An object is one thing built from that blueprint.',
  analogy: 'An architect draws one blueprint and many houses are built from it. Each house has the same structure but its own paint colour and owner. The blueprint is the class. Each house is an object.',
  body: `
<p>So far, one person’s data was spread over separate variables. A class bundles <b>data</b> (called <b>attributes</b>) with the <b>actions</b> that go with it, so a "dog" is one thing, not three loose variables.</p>
<p><code>__init__</code> is the setup routine. It runs automatically every time you create an object. <code>self</code> means "this particular object being built".</p>
<p>Create objects by calling the class like a function: <code>bruno = Dog("Bruno", 3)</code>. Read an attribute with a dot: <code>bruno.name</code>. Every object keeps its <b>own</b> copy of the data.</p>
<p>Use the Blueprint Workshop to stamp out a few dogs, then <b>Step through</b> the example to see objects appear as cards.</p>`,
  examples: [
    { title: 'Dog class', code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

bruno = Dog("Bruno", 3)
luna = Dog("Luna", 5)
print(bruno.name, bruno.age)
luna.age = 6              # only Luna changes
print(luna.age, bruno.age)` },
  ],
  widget: 'blueprint',
  remember: ['class Name: defines a blueprint.', '__init__(self, ...) runs when an object is created.', 'self.x = value stores data inside the object.', 'Each object has its own attributes.'],
  practice: [
    { title: 'A Book class', prompt: 'Make a class <code>Book</code> whose <code>__init__</code> takes <code>title</code> and <code>author</code> and stores both.',
      starter: 'class Book:\n    pass\n', hint: 'def __init__(self, title, author): then self.title = title and self.author = author',
      checks: [['Book("Wings of Fire", "Kalam").title == "Wings of Fire"', 'Book("Wings of Fire", "Kalam").title works'], ['Book("Wings of Fire", "Kalam").author == "Kalam"', 'Book(...).author works']],
      solution: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author' },
    { title: 'A Rectangle class', prompt: 'Make a class <code>Rectangle</code> with <code>width</code> and <code>height</code> attributes. Then create an object called <code>r</code> that is 4 wide and 5 high.',
      starter: 'class Rectangle:\n    pass\n\n# create r below\n', hint: 'r = Rectangle(4, 5)',
      checks: [['r.width == 4 and r.height == 5', 'r is 4 wide and 5 high'], ['Rectangle(2, 3).height == 3', 'Rectangle(2, 3).height is 3']],
      solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\nr = Rectangle(4, 5)' },
    { title: 'Own data', prompt: 'Make a class <code>Student</code> with a <code>name</code> and an empty list <code>marks</code> created fresh for every student, so students never share marks.',
      starter: 'class Student:\n    pass\n', hint: 'Inside __init__ write self.marks = []',
      setup: 'a = Student("Asha")\nb = Student("Ravi")\na.marks.append(90)',
      checks: [['a.name == "Asha"', 'a.name is "Asha"'], ['a.marks == [90]', "Asha's marks are [90]"], ['b.marks == []', "Ravi's marks are still empty"]],
      solution: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        self.marks = []' },
  ],
},
{
  id: 'methods', part: 'Part 4 · Object-oriented programming', title: 'Methods and self',
  line: 'Methods are functions that belong to an object and work on that object’s own data.',
  analogy: 'Buttons on a phone. Pressing "charge" on your phone changes your battery, not mine. Inside a method, <code>self</code> is the phone whose button was pressed.',
  body: `
<p>A method is a function written inside a class. Its first parameter is always <code>self</code>. When you write <code>asha.use(30)</code>, Python quietly passes <code>asha</code> in as <code>self</code>.</p>
<p>Through <code>self</code> a method can read and change the object’s attributes: <code>self.battery = self.battery - 30</code>.</p>
<p>The special method <code>__str__</code> decides what <code>print(object)</code> shows.</p>
<p>Press buttons on the two phones and notice that each one only changes itself.</p>`,
  examples: [
    { title: 'Phone', code: `class Phone:
    def __init__(self, owner):
        self.owner = owner
        self.battery = 50

    def charge(self, amount):
        self.battery = min(100, self.battery + amount)

    def use(self, minutes):
        self.battery = max(0, self.battery - minutes)

    def __str__(self):
        return f"{self.owner}'s phone: {self.battery}%"

asha = Phone("Asha")
ravi = Phone("Ravi")
asha.use(20)
ravi.charge(30)
print(asha)
print(ravi)` },
  ],
  widget: 'phones',
  remember: ['A method is a def inside a class, with self first.', 'obj.method(x) passes obj in as self.', 'self.attribute reads or changes that object’s data.', '__str__ controls what print(obj) shows.'],
  practice: [
    { title: 'Counter', prompt: 'Make a <code>Counter</code> class. It starts with <code>count = 0</code>. <code>add()</code> increases count by 1. <code>reset()</code> sets it back to 0.',
      starter: 'class Counter:\n    pass\n', hint: 'Set self.count = 0 in __init__. add: self.count = self.count + 1.',
      setup: 'c1 = Counter()\nc1.add()\nc1.add()\nc2 = Counter()\nc2.add()\nn1 = c1.count\nn2 = c2.count\nc1.reset()',
      checks: [['n1 == 2', 'two add() calls give 2'], ['n2 == 1', 'a second counter keeps its own count'], ['c1.count == 0', 'reset() goes back to 0'], ['Counter().count == 0', 'a new Counter starts at 0']],
      solution: 'class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def add(self):\n        self.count = self.count + 1\n\n    def reset(self):\n        self.count = 0' },
    { title: 'Rectangle with actions', prompt: 'Give <code>Rectangle</code> two methods: <code>area()</code> and <code>perimeter()</code>, both returning numbers.',
      starter: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    # add area() and perimeter() here\n', hint: 'area is width * height. perimeter is 2 * (width + height).',
      checks: [['Rectangle(4, 5).area() == 20', 'Rectangle(4, 5).area() is 20'], ['Rectangle(4, 5).perimeter() == 18', 'Rectangle(4, 5).perimeter() is 18'], ['Rectangle(1, 1).area() == 1', 'Rectangle(1, 1).area() is 1']],
      solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def perimeter(self):\n        return 2 * (self.width + self.height)' },
    { title: 'Playlist', prompt: 'Make a <code>Playlist</code> class holding a list <code>songs</code>. Methods: <code>add_song(title)</code>, <code>count()</code> returns how many songs, <code>has(title)</code> returns True or False.',
      starter: 'class Playlist:\n    pass\n', hint: 'self.songs = [] in __init__. count returns len(self.songs). has returns title in self.songs.',
      setup: 'p = Playlist()\np.add_song("Kannazhaga")\np.add_song("Vaathi Coming")\nq = Playlist()',
      checks: [['p.count() == 2', 'two songs added gives count 2'], ['p.has("Kannazhaga") is True', 'has() finds an added song'], ['p.has("Unknown") is False', 'has() is False for a missing song'], ['q.count() == 0', 'a new playlist is empty']],
      solution: 'class Playlist:\n    def __init__(self):\n        self.songs = []\n\n    def add_song(self, title):\n        self.songs.append(title)\n\n    def count(self):\n        return len(self.songs)\n\n    def has(self, title):\n        return title in self.songs' },
  ],
},
{
  id: 'inheritance', part: 'Part 4 · Object-oriented programming', title: 'Inheritance: sharing with children',
  line: 'A child class gets everything its parent has for free, and can add or change things.',
  analogy: 'A family. A child inherits traits from the parent without anyone writing them again, yet can have a few of their own. A Dog is an Animal, so a Dog can do everything an Animal does, plus bark.',
  body: `
<p>Write the parent in brackets after the new class name: <code>class Dog(Animal):</code>. Now <code>Dog</code> already has every method of <code>Animal</code>.</p>
<p>If the child writes a method with the same name, the child’s version wins. This is called <b>overriding</b>.</p>
<p><code>super()</code> means "my parent". Use <code>super().__init__(name)</code> to run the parent’s setup, then add the extras.</p>
<p>When you call a method, Python looks in the object’s own class first, then climbs to the parent, then the grandparent. Watch that climb in the animation.</p>`,
  examples: [
    { title: 'Dog is an Animal', code: `class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        return self.name + " is eating"

    def speak(self):
        return self.name + " makes a sound"

class Dog(Animal):
    def speak(self):                 # override
        return self.name + " says Woof!"

    def fetch(self):                 # new
        return self.name + " fetches the ball"

d = Dog("Bruno")
print(d.eat())       # inherited
print(d.speak())     # Dog's own version
print(d.fetch())` },
    { title: 'super()', code: `class Person:
    def __init__(self, name):
        self.name = name

    def intro(self):
        return "Hi, I am " + self.name

class Teacher(Person):
    def __init__(self, name, subject):
        super().__init__(name)       # let Person do its part
        self.subject = subject

    def intro(self):
        return super().intro() + " and I teach " + self.subject

t = Teacher("Meera", "Python")
print(t.intro())` },
  ],
  widget: 'tree',
  remember: ['class Child(Parent): inherits everything.', 'Same method name in the child overrides the parent.', 'super() reaches the parent.', 'Python searches own class first, then parents upward.'],
  practice: [
    { title: 'Cat and Cow', prompt: 'Make <code>Cat</code> and <code>Cow</code> children of <code>Animal</code>. Each overrides <code>speak()</code> to return <code>"&lt;name&gt; says Meow"</code> and <code>"&lt;name&gt; says Moo"</code>.',
      starter: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def eat(self):\n        return self.name + " is eating"\n\n    def speak(self):\n        return self.name + " makes a sound"\n\n# write Cat and Cow below\n', hint: 'class Cat(Animal): then def speak(self): return self.name + " says Meow"',
      checks: [['Cat("Tom").speak() == "Tom says Meow"', 'Cat("Tom").speak() works'], ['Cow("Gauri").speak() == "Gauri says Moo"', 'Cow("Gauri").speak() works'], ['Cat("Tom").eat() == "Tom is eating"', 'Cat inherits eat()'], ['isinstance(Cow("G"), Animal)', 'a Cow is an Animal']],
      solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def eat(self):\n        return self.name + " is eating"\n\n    def speak(self):\n        return self.name + " makes a sound"\n\nclass Cat(Animal):\n    def speak(self):\n        return self.name + " says Meow"\n\nclass Cow(Animal):\n    def speak(self):\n        return self.name + " says Moo"' },
    { title: 'Car is a Vehicle', prompt: 'Make <code>Car</code> a child of <code>Vehicle</code>. Its <code>__init__(brand, doors)</code> calls the parent’s setup with <code>super()</code> and stores <code>doors</code>. Override <code>describe()</code> to return <code>"&lt;brand&gt; car with &lt;doors&gt; doors"</code>.',
      starter: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\n    def describe(self):\n        return self.brand + " vehicle"\n\n# write Car below\n', hint: 'super().__init__(brand) then self.doors = doors.',
      checks: [['Car("Tata", 4).brand == "Tata"', 'brand is stored by the parent'], ['Car("Tata", 4).doors == 4', 'doors is stored'], ['Car("Tata", 4).describe() == "Tata car with 4 doors"', 'describe() is overridden'], ['Vehicle("Hero").describe() == "Hero vehicle"', 'Vehicle itself is unchanged']],
      solution: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\n    def describe(self):\n        return self.brand + " vehicle"\n\nclass Car(Vehicle):\n    def __init__(self, brand, doors):\n        super().__init__(brand)\n        self.doors = doors\n\n    def describe(self):\n        return f"{self.brand} car with {self.doors} doors"' },
    { title: 'Extend the parent’s answer', prompt: '<code>Teacher</code> should be a child of <code>Person</code>. Its <code>intro()</code> returns the parent’s intro followed by <code>" and I teach "</code> and the subject. Use <code>super().intro()</code>.',
      starter: 'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def intro(self):\n        return "Hi, I am " + self.name\n\n# write Teacher(name, subject) below\n', hint: 'Teacher.__init__ calls super().__init__(name). intro returns super().intro() + " and I teach " + self.subject.',
      checks: [['Teacher("Meera", "Python").intro() == "Hi, I am Meera and I teach Python"', 'intro() builds on the parent'], ['Person("Ravi").intro() == "Hi, I am Ravi"', 'Person is unchanged']],
      solution: 'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def intro(self):\n        return "Hi, I am " + self.name\n\nclass Teacher(Person):\n    def __init__(self, name, subject):\n        super().__init__(name)\n        self.subject = subject\n\n    def intro(self):\n        return super().intro() + " and I teach " + self.subject' },
  ],
},
{
  id: 'encapsulation', part: 'Part 4 · Object-oriented programming', title: 'Encapsulation: protecting data',
  line: 'Keep an object’s data behind methods that enforce the rules.',
  analogy: 'A bank vault. You cannot reach in and take cash. You press buttons at the counter, and the bank checks the rules first: enough money? valid amount?',
  body: `
<p>If anyone can write <code>account.balance = -9999</code>, nothing stops nonsense. Instead, hide the data behind methods like <code>deposit()</code> and <code>withdraw()</code> that check the rules before changing anything.</p>
<p>Python has no locks. By <b>convention</b>, a name starting with an underscore, such as <code>self._balance</code>, means "internal: please use the methods". Names starting with two underscores, <code>self.__balance</code>, are renamed by Python to make accidental access harder.</p>
<p>Try the vault: with no rules the balance goes negative. With rules, the bad requests are rejected.</p>`,
  examples: [
    { title: 'BankAccount', code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance      # underscore: "use the methods"

    def deposit(self, amount):
        if amount <= 0:
            return "Deposit must be above zero"
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        if amount > self._balance:
            return "Not enough money"
        self._balance -= amount
        return self._balance

    def get_balance(self):
        return self._balance

acc = BankAccount("Asha", 100)
print(acc.deposit(50))
print(acc.withdraw(500))
print(acc.withdraw(30))
print(acc.get_balance())` },
  ],
  widget: 'vault',
  remember: ['Put the rules inside methods, not around the object.', '_name is a polite "internal, please do not touch".', 'Getter methods let others read data safely.', 'Validate input before changing data.'],
  practice: [
    { title: 'Safe account', prompt: 'Finish <code>deposit</code> and <code>withdraw</code>. Both return <code>True</code> if the money moved and <code>False</code> if the request was refused. Deposits must be above 0. Withdrawals must be above 0 and not more than the balance.',
      starter: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n\n    def get_balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n', hint: 'In each method: if the amount is not allowed, return False. Otherwise change self._balance and return True.',
      setup: 'acc = BankAccount("Asha", 100)\nr1 = acc.deposit(50)\nr2 = acc.deposit(-10)\nr3 = acc.withdraw(500)\nr4 = acc.withdraw(30)\nr5 = acc.withdraw(0)',
      checks: [['r1 is True', 'a valid deposit returns True'], ['r2 is False', 'a negative deposit is refused'], ['r3 is False', 'withdrawing more than the balance is refused'], ['r4 is True', 'a valid withdrawal returns True'], ['r5 is False', 'withdrawing 0 is refused'], ['acc.get_balance() == 120', 'the final balance is 120']],
      solution: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance\n\n    def get_balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            return False\n        self._balance += amount\n        return True\n\n    def withdraw(self, amount):\n        if amount <= 0 or amount > self._balance:\n            return False\n        self._balance -= amount\n        return True' },
    { title: 'Marks between 0 and 100', prompt: 'In <code>Student</code>, make <code>set_marks(value)</code> accept only values from 0 to 100. It returns <code>True</code> and stores the value, or returns <code>False</code> and changes nothing. <code>get_marks()</code> returns the stored marks.',
      starter: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        self._marks = 0\n\n    def get_marks(self):\n        return self._marks\n\n    def set_marks(self, value):\n        pass\n', hint: 'if 0 <= value <= 100: store it and return True. Otherwise return False.',
      setup: 's = Student("Ravi")\na = s.set_marks(80)\nb = s.set_marks(150)\nc = s.set_marks(-5)',
      checks: [['a is True', '80 is accepted'], ['b is False', '150 is refused'], ['c is False', '-5 is refused'], ['s.get_marks() == 80', 'marks stay at 80']],
      solution: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        self._marks = 0\n\n    def get_marks(self):\n        return self._marks\n\n    def set_marks(self, value):\n        if 0 <= value <= 100:\n            self._marks = value\n            return True\n        return False' },
    { title: 'Password rules', prompt: 'Make an <code>Account</code> class. <code>set_password(pw)</code> accepts only passwords with at least 6 characters (returns True/False). <code>check(pw)</code> returns True only if it matches the stored password. Store it in <code>self._password</code>, starting as an empty string.',
      starter: 'class Account:\n    pass\n', hint: 'In __init__: self._password = "". set_password: if len(pw) >= 6, store and return True, else False.',
      setup: 'a = Account()\nr1 = a.set_password("abc")\nr2 = a.set_password("secret123")\nr3 = a.check("secret123")\nr4 = a.check("wrong")',
      checks: [['r1 is False', 'a short password is refused'], ['r2 is True', 'a long enough password is accepted'], ['r3 is True', 'the right password matches'], ['r4 is False', 'a wrong password does not match']],
      solution: 'class Account:\n    def __init__(self):\n        self._password = ""\n\n    def set_password(self, pw):\n        if len(pw) >= 6:\n            self._password = pw\n            return True\n        return False\n\n    def check(self, pw):\n        return pw == self._password' },
  ],
},
{
  id: 'polymorphism', part: 'Part 4 · Object-oriented programming', title: 'Polymorphism and a mini project',
  line: 'Different objects can respond to the same method name in their own way.',
  analogy: 'A TV remote with one play button. Press it and the TV, the music system or the DVD player each does its own thing. You do not need to know which one it is. You just press play.',
  body: `
<p><b>Polymorphism</b> (many forms) means code can call <code>thing.speak()</code> without caring whether <code>thing</code> is a dog, a cat or a robot. Each object knows how to do its own version.</p>
<p>The payoff: add a brand new kind of object later and the existing loop keeps working untouched. Try adding animals to the list below without changing the loop.</p>
<p>You have already seen it in Python itself: <code>len()</code> works on text, lists and dictionaries, and <code>+</code> adds numbers but joins text.</p>
<p>You now have the four pillars of OOP: <b>classes</b> (blueprints), <b>inheritance</b> (sharing), <b>encapsulation</b> (protecting) and <b>polymorphism</b> (one name, many behaviours). The last practice problem is a small project that uses them together.</p>`,
  examples: [
    { title: 'One loop, many animals', code: `class Dog:
    def speak(self):
        return "Woof"

class Cat:
    def speak(self):
        return "Meow"

class Cow:
    def speak(self):
        return "Moo"

animals = [Dog(), Cat(), Cow()]
for animal in animals:
    print(animal.speak())` },
    { title: 'Built-ins do it too', code: `print(len("hello"), len([1, 2, 3]), len({"a": 1}))
print(3 + 4, "3" + "4", [1] + [2])` },
  ],
  widget: 'remote',
  remember: ['Same method name, different behaviour per class.', 'The caller does not need to know the exact class.', 'New classes plug in without changing old code.', 'Classes + inheritance + encapsulation + polymorphism = OOP.'],
  practice: [
    { title: 'Shapes', prompt: 'Make <code>Circle(radius)</code> and <code>Square(side)</code>, each with an <code>area()</code> method (use <code>math.pi</code>). Then write <code>total_area(shapes)</code> that adds up the areas of any list of shapes.',
      starter: 'import math\n\n# write Circle, Square and total_area below\n', hint: 'Circle area: math.pi * radius ** 2. total_area loops over shapes and calls shape.area() on each, without checking the kind.',
      setup: 'import math',
      checks: [['abs(Circle(5).area() - 78.5398) < 0.01', 'Circle(5).area() is about 78.54'], ['Square(4).area() == 16', 'Square(4).area() is 16'], ['total_area([Square(2), Square(3)]) == 13', 'total_area of two squares is 13'], ['abs(total_area([Square(1), Circle(1)]) - (1 + math.pi)) < 0.01', 'total_area works on a mix of shapes']],
      solution: 'import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side * self.side\n\ndef total_area(shapes):\n    total = 0\n    for shape in shapes:\n        total = total + shape.area()\n    return total' },
    { title: 'Ways to pay', prompt: 'Make <code>Cash</code> and <code>Card</code> classes, each with <code>pay(amount)</code>. Cash returns <code>"Paid 100 in cash"</code> and Card returns <code>"Paid 100 by card"</code> (using the amount). Then write <code>checkout(method, amount)</code> that works with either.',
      starter: '# write Cash, Card and checkout below\n', hint: 'checkout just returns method.pay(amount). It does not need to know which class it got.',
      checks: [['Cash().pay(100) == "Paid 100 in cash"', 'Cash().pay(100) works'], ['Card().pay(250) == "Paid 250 by card"', 'Card().pay(250) works'], ['checkout(Card(), 40) == "Paid 40 by card"', 'checkout works with a Card'], ['checkout(Cash(), 40) == "Paid 40 in cash"', 'checkout works with Cash']],
      solution: 'class Cash:\n    def pay(self, amount):\n        return f"Paid {amount} in cash"\n\nclass Card:\n    def pay(self, amount):\n        return f"Paid {amount} by card"\n\ndef checkout(method, amount):\n    return method.pay(amount)' },
    { title: 'Mini project: Library', prompt: 'Build a tiny library. <code>Book(title, author)</code> stores both and has <code>is_borrowed</code> starting as <code>False</code>. <code>Library()</code> keeps a list <code>books</code>, with <code>add(book)</code>; <code>borrow(title)</code> returns <code>True</code> and marks the book borrowed if a book with that title exists and is free, else <code>False</code>; <code>available()</code> returns the list of titles not currently borrowed.',
      starter: 'class Book:\n    pass\n\nclass Library:\n    pass\n', hint: 'Library.__init__ sets self.books = []. borrow loops through self.books looking for a matching title that is not borrowed.',
      setup: 'lib = Library()\nlib.add(Book("Wings of Fire", "Kalam"))\nlib.add(Book("Malgudi Days", "Narayan"))\nr1 = lib.borrow("Wings of Fire")\nr2 = lib.borrow("Wings of Fire")\nr3 = lib.borrow("Unknown")',
      checks: [['Book("A", "B").is_borrowed is False', 'a new Book is not borrowed'], ['r1 is True', 'borrowing a free book returns True'], ['r2 is False', 'borrowing it again returns False'], ['r3 is False', 'borrowing a missing title returns False'], ['lib.available() == ["Malgudi Days"]', 'available() lists only the free books']],
      solution: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.is_borrowed = False\n\nclass Library:\n    def __init__(self):\n        self.books = []\n\n    def add(self, book):\n        self.books.append(book)\n\n    def borrow(self, title):\n        for book in self.books:\n            if book.title == title and not book.is_borrowed:\n                book.is_borrowed = True\n                return True\n        return False\n\n    def available(self):\n        return [b.title for b in self.books if not b.is_borrowed]' },
  ],
},
];
if (typeof module !== 'undefined') module.exports = window.LESSONS;
