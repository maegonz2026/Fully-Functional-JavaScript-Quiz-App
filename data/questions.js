const questions = [
  // ==========================================
  // EASY QUESTIONS — IDs 1–70
  // ==========================================

  {
    id: "1",
    question: "Which keyword is used to declare a variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    answer: "const",
    explanation: "const creates a variable binding that cannot be reassigned."
  },
  {
    id: "2",
    question: "Which symbol is used for strict equality in JavaScript?",
    options: ["=", "==", "===", "!="],
    answer: "===",
    explanation: "=== compares both value and type without type coercion."
  },
  {
    id: "3",
    question: "Which method adds an item to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
    explanation: "push() adds one or more elements to the end of an array."
  },
  {
    id: "4",
    question: "Which method removes the last item from an array?",
    options: ["shift()", "pop()", "slice()", "remove()"],
    answer: "pop()",
    explanation: "pop() removes and returns the last element of an array."
  },
  {
    id: "5",
    question: "Which method removes the first item from an array?",
    options: ["pop()", "shift()", "delete()", "remove()"],
    answer: "shift()",
    explanation: "shift() removes and returns the first element."
  },
  {
    id: "6",
    question: "Which method adds an item to the beginning of an array?",
    options: ["push()", "append()", "unshift()", "prepend()"],
    answer: "unshift()",
    explanation: "unshift() adds one or more elements to the beginning."
  },
  {
    id: "7",
    question: "Which data type represents true or false?",
    options: ["String", "Boolean", "Number", "Object"],
    answer: "Boolean",
    explanation: "Boolean values are either true or false."
  },
  {
    id: "8",
    question: "Which operator is used for logical AND?",
    options: ["||", "&&", "!", "&"],
    answer: "&&",
    explanation: "The && operator represents logical AND."
  },
  {
    id: "9",
    question: "Which operator is used for logical OR?",
    options: ["&&", "||", "!", "??"],
    answer: "||",
    explanation: "The || operator represents logical OR."
  },
  {
    id: "10",
    question: "Which keyword is used to define a function?",
    options: ["function", "def", "func", "method"],
    answer: "function",
    explanation: "The function keyword is used to declare a traditional function."
  },
  {
    id: "11",
    question: "What does typeof return?",
    options: ["The variable value", "The data type", "The variable name", "The memory address"],
    answer: "The data type",
    explanation: "typeof returns a string describing the type of a value."
  },
  {
    id: "12",
    question: "Which value represents the absence of an assigned value?",
    options: ["undefined", "empty", "void", "none"],
    answer: "undefined",
    explanation: "A declared variable that has not been assigned a value is undefined."
  },
  {
    id: "13",
    question: "Which value represents an intentional empty value?",
    options: ["undefined", "null", "empty", "false"],
    answer: "null",
    explanation: "null is commonly used to represent an intentional absence of a value."
  },
  {
    id: "14",
    question: "Which method creates a new array by transforming every element?",
    options: ["filter()", "map()", "find()", "reduce()"],
    answer: "map()",
    explanation: "map() creates a new array containing the results of a callback."
  },
  {
    id: "15",
    question: "Which method returns only elements that pass a condition?",
    options: ["map()", "filter()", "reduce()", "forEach()"],
    answer: "filter()",
    explanation: "filter() creates a new array containing elements that satisfy a condition."
  },
  {
    id: "16",
    question: "Which method executes a function for each array element?",
    options: ["forEach()", "each()", "loop()", "iterate()"],
    answer: "forEach()",
    explanation: "forEach() executes a callback once for each array element."
  },
  {
    id: "17",
    question: "Which syntax creates an arrow function?",
    options: ["function => {}", "() => {}", "func() {}", "-> {}"],
    answer: "() => {}",
    explanation: "The arrow function syntax uses =>."
  },
  {
    id: "18",
    question: "What allows a function to access variables from its surrounding scope?",
    options: ["Closure", "Scope", "Return", "This"],
    answer: "Closure",
    explanation: "A closure allows a function to retain access to variables from its surrounding lexical environment."
  },
  {
    id: "19",
    question: "Which statement stops a loop immediately?",
    options: ["stop", "break", "exit", "end"],
    answer: "break",
    explanation: "break immediately terminates the current loop."
  },
  {
    id: "20",
    question: "Which statement skips the current loop iteration?",
    options: ["skip", "continue", "next", "pass"],
    answer: "continue",
    explanation: "continue skips the rest of the current iteration."
  },
  {
    id: "21",
    question: "Which object stores key-value pairs?",
    options: ["Array", "Object", "String", "Boolean"],
    answer: "Object",
    explanation: "JavaScript objects commonly store data as key-value pairs."
  },
  {
    id: "22",
    question: "How do you access the name property of user?",
    options: ["user:name", "user.name", "user->name", "user/name"],
    answer: "user.name",
    explanation: "Dot notation accesses an object's property."
  },
  {
    id: "23",
    question: "Which keyword refers to the current object context?",
    options: ["self", "current", "this", "object"],
    answer: "this",
    explanation: "this refers to a context-dependent object determined by how a function is called."
  },
  {
    id: "24",
    question: "Which method converts JSON text into a JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
    answer: "JSON.parse()",
    explanation: "JSON.parse() converts valid JSON text into a JavaScript value."
  },
  {
    id: "25",
    question: "Which method converts a JavaScript value into JSON text?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.text()"],
    answer: "JSON.stringify()",
    explanation: "JSON.stringify() converts a JavaScript value into JSON text."
  },
  {
    id: "26",
    question: "Which keyword returns a value from a function?",
    options: ["send", "return", "output", "give"],
    answer: "return",
    explanation: "return ends a function and can provide a value to the caller."
  },
  {
    id: "27",
    question: "Which keyword is commonly used to handle asynchronous operations?",
    options: ["async", "wait", "later", "defer"],
    answer: "async",
    explanation: "async marks a function as asynchronous and allows await inside it."
  },
  {
    id: "28",
    question: "Which keyword pauses an async function until a Promise settles?",
    options: ["pause", "wait", "await", "hold"],
    answer: "await",
    explanation: "await pauses execution of an async function until the Promise settles."
  },
  {
    id: "29",
    question: "What does a Promise represent?",
    options: ["A future asynchronous result", "A CSS rule", "An array", "A loop"],
    answer: "A future asynchronous result",
    explanation: "A Promise represents the eventual completion or failure of an asynchronous operation."
  },
  {
    id: "30",
    question: "Which method finds the first array element matching a condition?",
    options: ["find()", "search()", "first()", "match()"],
    answer: "find()",
    explanation: "find() returns the first element that satisfies the provided function."
  },
  {
    id: "31",
    question: "Which method checks whether an array includes a value?",
    options: ["contains()", "has()", "includes()", "exists()"],
    answer: "includes()",
    explanation: "includes() returns true when the array contains the specified value."
  },
  {
    id: "32",
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "var", "fixed"],
    answer: "let",
    explanation: "let declares a block-scoped variable that can be reassigned."
  },
  {
    id: "33",
    question: "What is NaN?",
    options: ["Not a Number", "New Array Name", "Null and Null", "Negative Array Number"],
    answer: "Not a Number",
    explanation: "NaN is a special numeric value representing an invalid or unrepresentable number result."
  },
  {
    id: "34",
    question: "Which method reduces an array to a single value?",
    options: ["reduce()", "combine()", "joinAll()", "compress()"],
    answer: "reduce()",
    explanation: "reduce() processes array elements to produce a single accumulated result."
  },
  {
    id: "35",
    question: "Which syntax is used for a template literal?",
    options: ["'Hello'", "\"Hello\"", "`Hello`", "(Hello)"],
    answer: "`Hello`",
    explanation: "Template literals use backticks and can contain embedded expressions."
  },
  {
    id: "36",
    question: "Which operator returns the remainder of a division?",
    options: ["%", "/", "*", "**"],
    answer: "%",
    explanation: "The remainder operator % returns the remainder after division."
  },
  {
    id: "37",
    question: "Which method converts a string to uppercase?",
    options: ["toUpperCase()", "upper()", "capitalize()", "toCapital()"],
    answer: "toUpperCase()",
    explanation: "toUpperCase() returns a new string with uppercase characters."
  },
  {
    id: "38",
    question: "Which method removes whitespace from both ends of a string?",
    options: ["clean()", "trim()", "strip()", "removeSpace()"],
    answer: "trim()",
    explanation: "trim() removes whitespace from the beginning and end of a string."
  },
  {
    id: "39",
    question: "Which property returns the number of elements in an array?",
    options: ["size", "count", "length", "total"],
    answer: "length",
    explanation: "The length property returns the number of elements in an array."
  },
  {
    id: "40",
    question: "Which loop runs while a condition is true?",
    options: ["if", "while", "switch", "case"],
    answer: "while",
    explanation: "A while loop repeats as long as its condition evaluates to true."
  },
  {
    id: "41",
    question: "Which statement is used to make decisions based on a condition?",
    options: ["if", "for", "break", "import"],
    answer: "if",
    explanation: "An if statement executes code when its condition is true."
  },
  {
    id: "42",
    question: "Which keyword provides an alternative branch after an if statement?",
    options: ["otherwise", "else", "default", "then"],
    answer: "else",
    explanation: "else executes when the preceding if condition is false."
  },
  {
    id: "43",
    question: "Which method joins array elements into a string?",
    options: ["join()", "merge()", "concatAll()", "combine()"],
    answer: "join()",
    explanation: "join() combines array elements into a string using a separator."
  },
  {
    id: "44",
    question: "Which method returns a portion of a string?",
    options: ["slice()", "remove()", "cut()", "split()"],
    answer: "slice()",
    explanation: "slice() extracts part of a string without changing the original."
  },
  {
    id: "45",
    question: "Which method splits a string into an array?",
    options: ["divide()", "split()", "separate()", "break()"],
    answer: "split()",
    explanation: "split() divides a string into an array using a specified separator."
  },
  {
    id: "46",
    question: "Which function displays a message in the browser console?",
    options: ["console.log()", "print()", "display()", "show()"],
    answer: "console.log()",
    explanation: "console.log() writes information to the browser or runtime console."
  },
  {
    id: "47",
    question: "Which function converts a string into an integer?",
    options: ["parseInt()", "parseString()", "toInteger()", "NumberText()"],
    answer: "parseInt()",
    explanation: "parseInt() parses a string and returns an integer when possible."
  },
  {
    id: "48",
    question: "Which function converts a value into a number?",
    options: ["String()", "Boolean()", "Number()", "Object()"],
    answer: "Number()",
    explanation: "Number() converts a value to a number when possible."
  },
  {
    id: "49",
    question: "Which operator increments a number by one?",
    options: ["--", "++", "+=", "**"],
    answer: "++",
    explanation: "The increment operator ++ increases a numeric value by one."
  },
  {
    id: "50",
    question: "Which operator decrements a number by one?",
    options: ["++", "--", "-=", "%"],
    answer: "--",
    explanation: "The decrement operator -- decreases a numeric value by one."
  },
  {
    id: "51",
    question: "Which value represents a failed or false condition?",
    options: ["true", "false", "null", "undefined"],
    answer: "false",
    explanation: "false is the Boolean value representing a false condition."
  },
  {
    id: "52",
    question: "Which operator checks whether two values are not equal?",
    options: ["==", "===", "!=", "=>"],
    answer: "!=",
    explanation: "!= checks inequality and may perform type coercion."
  },
  {
    id: "53",
    question: "Which operator checks strict inequality?",
    options: ["!==", "!=", "===", "<>"],
    answer: "!==",
    explanation: "!== checks that values or their types are different."
  },
  {
    id: "54",
    question: "Which built-in object provides mathematical functions?",
    options: ["Math", "Number", "Calc", "Formula"],
    answer: "Math",
    explanation: "The Math object provides built-in mathematical constants and functions."
  },
  {
    id: "55",
    question: "Which method rounds a number to the nearest integer?",
    options: ["Math.floor()", "Math.ceil()", "Math.round()", "Math.trunc()"],
    answer: "Math.round()",
    explanation: "Math.round() rounds a number to the nearest integer."
  },
  {
    id: "56",
    question: "Which method rounds a number downward?",
    options: ["Math.ceil()", "Math.floor()", "Math.round()", "Math.max()"],
    answer: "Math.floor()",
    explanation: "Math.floor() returns the greatest integer less than or equal to a number."
  },
  {
    id: "57",
    question: "Which method rounds a number upward?",
    options: ["Math.floor()", "Math.ceil()", "Math.round()", "Math.min()"],
    answer: "Math.ceil()",
    explanation: "Math.ceil() returns the smallest integer greater than or equal to a number."
  },
  {
    id: "58",
    question: "Which array method combines two or more arrays?",
    options: ["concat()", "join()", "pushAll()", "merge()"],
    answer: "concat()",
    explanation: "concat() returns a new array combining the original array with other values or arrays."
  },
  {
    id: "59",
    question: "Which method returns the index of a value in an array?",
    options: ["find()", "indexOf()", "position()", "locate()"],
    answer: "indexOf()",
    explanation: "indexOf() returns the first index of a matching element or -1."
  },
  {
    id: "60",
    question: "Which keyword creates a class in JavaScript?",
    options: ["object", "class", "struct", "prototype"],
    answer: "class",
    explanation: "The class keyword defines a class in JavaScript."
  },
  {
    id: "61",
    question: "Which method is called when a new class instance is created?",
    options: ["create()", "init()", "constructor()", "start()"],
    answer: "constructor()",
    explanation: "The constructor method initializes a new class instance."
  },
  {
    id: "62",
    question: "Which keyword creates an instance of a class?",
    options: ["make", "new", "instance", "create"],
    answer: "new",
    explanation: "The new operator creates an instance of a constructor or class."
  },
  {
    id: "63",
    question: "Which keyword is used to inherit from another class?",
    options: ["inherits", "extends", "implements", "superclass"],
    answer: "extends",
    explanation: "extends creates a class that inherits from another class."
  },
  {
    id: "64",
    question: "Which keyword calls a parent class constructor?",
    options: ["parent", "base", "super", "this"],
    answer: "super",
    explanation: "super() calls the constructor of the parent class."
  },
  {
    id: "65",
    question: "Which array method checks whether at least one element passes a test?",
    options: ["every()", "some()", "filter()", "findIndex()"],
    answer: "some()",
    explanation: "some() returns true if at least one element passes the test."
  },
  {
    id: "66",
    question: "Which array method checks whether all elements pass a test?",
    options: ["some()", "every()", "filter()", "find()"],
    answer: "every()",
    explanation: "every() returns true only when all elements pass the test."
  },
  {
    id: "67",
    question: "Which method creates a shallow copy of an array?",
    options: ["slice()", "delete()", "remove()", "pop()"],
    answer: "slice()",
    explanation: "slice() can create a shallow copy when called without arguments."
  },
  {
    id: "68",
    question: "Which operator provides a default value when the left side is null or undefined?",
    options: ["||", "??", "&&", "!="],
    answer: "??",
    explanation: "The nullish coalescing operator returns the right side only for null or undefined."
  },
  {
    id: "69",
    question: "Which syntax safely accesses a property that may not exist?",
    options: ["user?.name", "user!.name", "user::name", "user??name"],
    answer: "user?.name",
    explanation: "Optional chaining returns undefined instead of throwing when the reference is nullish."
  },
  {
    id: "70",
    question: "Which method converts a date object into a readable date string?",
    options: ["toString()", "toDate()", "dateFormat()", "convertDate()"],
    answer: "toString()",
    explanation: "Date objects inherit toString(), which returns a string representation of the date."
  },

  // ==========================================
  // MEDIUM QUESTIONS — IDs 71–140
  // ==========================================

  {
    id: "71",
    question: "What is the result of typeof null?",
    options: ["null", "undefined", "object", "boolean"],
    answer: "object",
    explanation: "typeof null returns object due to a historical JavaScript behavior."
  },
  {
    id: "72",
    question: "What is the result of [] == false?",
    options: ["true", "false", "undefined", "TypeError"],
    answer: "true",
    explanation: "Loose equality converts the empty array and false to compatible primitive values."
  },
  {
    id: "73",
    question: "What is the result of Boolean('false')?",
    options: ["false", "true", "undefined", "null"],
    answer: "true",
    explanation: "A non-empty string is truthy, even when its text is false."
  },
  {
    id: "74",
    question: "What is the result of Number('10')?",
    options: ["'10'", "10", "NaN", "undefined"],
    answer: "10",
    explanation: "Number() converts the numeric string into the number 10."
  },
  {
    id: "75",
    question: "What does Array.isArray([]) return?",
    options: ["true", "false", "undefined", "object"],
    answer: "true",
    explanation: "Array.isArray() checks whether a value is an array."
  },
  {
    id: "76",
    question: "Which method returns a new array with duplicate values removed when combined with Set?",
    options: ["Array.from(new Set(arr))", "arr.unique()", "arr.removeDuplicates()", "Set.clear(arr)"],
    answer: "Array.from(new Set(arr))",
    explanation: "Set stores unique values, and Array.from() converts it back into an array."
  },
  {
    id: "77",
    question: "What does the spread operator do when used with an array?",
    options: ["Deletes elements", "Expands iterable elements", "Sorts the array", "Freezes the array"],
    answer: "Expands iterable elements",
    explanation: "The spread syntax expands iterable elements into individual values."
  },
  {
    id: "78",
    question: "Which syntax uses array destructuring?",
    options: ["const [a, b] = arr", "const {a, b} = arr", "const a, b = arr", "const arr(a, b)"],
    answer: "const [a, b] = arr",
    explanation: "Array destructuring assigns array elements to variables by position."
  },
  {
    id: "79",
    question: "Which syntax uses object destructuring?",
    options: ["const [name] = user", "const {name} = user", "const name = user[]", "const user(name)"],
    answer: "const {name} = user",
    explanation: "Object destructuring extracts properties into variables."
  },
  {
    id: "80",
    question: "What does the rest parameter collect?",
    options: ["The first argument", "Remaining arguments into an array", "Only string arguments", "Function errors"],
    answer: "Remaining arguments into an array",
    explanation: "A rest parameter collects remaining function arguments into an array."
  },
  {
    id: "81",
    question: "Which method returns a new array sorted according to a comparison function?",
    options: ["sort()", "order()", "arrange()", "rank()"],
    answer: "sort()",
    explanation: "sort() sorts an array in place and can use a comparison function."
  },
  {
    id: "82",
    question: "What does [3, 1, 2].sort((a, b) => a - b) produce?",
    options: ["[3, 2, 1]", "[1, 2, 3]", "[2, 1, 3]", "[3, 1, 2]"],
    answer: "[1, 2, 3]",
    explanation: "Subtracting a from b in the comparison sorts numbers in ascending order."
  },
  {
    id: "83",
    question: "What does findIndex() return when no element matches?",
    options: ["null", "undefined", "-1", "0"],
    answer: "-1",
    explanation: "findIndex() returns -1 when no element satisfies the callback."
  },
  {
    id: "84",
    question: "Which method can flatten nested arrays by one level?",
    options: ["flat()", "reduce()", "join()", "spread()"],
    answer: "flat()",
    explanation: "flat() creates a new array with nested arrays flattened to the requested depth."
  },
  {
    id: "85",
    question: "What is the default flattening depth of flat()?",
    options: ["0", "1", "2", "Infinity"],
    answer: "1",
    explanation: "flat() uses a depth of one when no depth argument is provided."
  },
  {
    id: "86",
    question: "Which method creates a new array from an array-like or iterable value?",
    options: ["Array.from()", "Array.make()", "Array.create()", "Array.copy()"],
    answer: "Array.from()",
    explanation: "Array.from() creates a new shallow-copied array from an iterable or array-like object."
  },
  {
    id: "87",
    question: "What does Object.keys(obj) return?",
    options: ["Object values", "An array of own enumerable property names", "All prototypes", "A JSON string"],
    answer: "An array of own enumerable property names",
    explanation: "Object.keys() returns an array of an object's own enumerable string-keyed properties."
  },
  {
    id: "88",
    question: "What does Object.values(obj) return?",
    options: ["Property values", "Property names", "Property descriptors", "The prototype"],
    answer: "Property values",
    explanation: "Object.values() returns an array of an object's own enumerable property values."
  },
  {
    id: "89",
    question: "Which method returns key-value pairs from an object?",
    options: ["Object.keys()", "Object.entries()", "Object.values()", "Object.pairs()"],
    answer: "Object.entries()",
    explanation: "Object.entries() returns an array of key-value pairs."
  },
  {
    id: "90",
    question: "Which method prevents new properties from being added to an object?",
    options: ["Object.freeze()", "Object.preventExtensions()", "Object.seal()", "Object.lock()"],
    answer: "Object.preventExtensions()",
    explanation: "Object.preventExtensions() prevents new properties from being added."
  },
  {
    id: "91",
    question: "What does Object.freeze() prevent?",
    options: ["Only reading properties", "Adding, removing, or changing own data properties", "Calling methods", "Creating variables"],
    answer: "Adding, removing, or changing own data properties",
    explanation: "Object.freeze() makes an object non-extensible and its own data properties non-writable and non-configurable."
  },
  {
    id: "92",
    question: "Which method checks whether an object owns a property?",
    options: ["hasOwnProperty()", "containsProperty()", "includes()", "owns()"],
    answer: "hasOwnProperty()",
    explanation: "hasOwnProperty() checks whether a property belongs directly to the object."
  },
  {
    id: "93",
    question: "What is the purpose of Object.create()?",
    options: ["Create an object with a specified prototype", "Delete an object", "Freeze an array", "Convert an object to JSON"],
    answer: "Create an object with a specified prototype",
    explanation: "Object.create() creates a new object using the supplied prototype object."
  },
  {
    id: "94",
    question: "What is a prototype in JavaScript?",
    options: ["A CSS selector", "An object used for inheritance", "A variable type", "A loop structure"],
    answer: "An object used for inheritance",
    explanation: "Objects can inherit properties and methods through their prototype chain."
  },
  {
    id: "95",
    question: "Which keyword declares a class method that belongs to the class itself?",
    options: ["static", "private", "global", "shared"],
    answer: "static",
    explanation: "Static methods belong to the class rather than individual instances."
  },
  {
    id: "96",
    question: "What does instanceof check?",
    options: ["Whether a value is a string", "Whether an object is in a constructor's prototype chain", "Whether a value is null", "Whether two values are equal"],
    answer: "Whether an object is in a constructor's prototype chain",
    explanation: "instanceof tests whether a constructor's prototype appears in an object's prototype chain."
  },
  {
    id: "97",
    question: "Which block handles an exception thrown inside a try block?",
    options: ["catch", "finally", "throw", "case"],
    answer: "catch",
    explanation: "catch receives and handles an exception thrown from the associated try block."
  },
  {
    id: "98",
    question: "When does a finally block execute?",
    options: ["Only when there is an error", "Only when there is no error", "After try/catch regardless of outcome", "Only after return"],
    answer: "After try/catch regardless of outcome",
    explanation: "finally normally runs after try and catch, whether an exception occurred or not."
  },
  {
    id: "99",
    question: "Which keyword manually throws an exception?",
    options: ["throw", "error", "catch", "raise"],
    answer: "throw",
    explanation: "throw raises an exception that can be handled by a catch block."
  },
  {
    id: "100",
    question: "What does Promise.all() do?",
    options: ["Waits for all promises to fulfill or one to reject", "Runs only the first promise", "Ignores rejected promises", "Converts promises to callbacks"],
    answer: "Waits for all promises to fulfill or one to reject",
    explanation: "Promise.all() fulfills when all inputs fulfill and rejects when an input rejects."
  },
  {
    id: "101",
    question: "What does Promise.race() return?",
    options: ["The slowest settled promise", "The first settled promise's outcome", "All results in an array", "Only fulfilled promises"],
    answer: "The first settled promise's outcome",
    explanation: "Promise.race() settles with the outcome of the first input promise to settle."
  },
  {
    id: "102",
    question: "What does Promise.allSettled() provide?",
    options: ["Only successful values", "The outcomes of all promises", "Only the first result", "A single Boolean"],
    answer: "The outcomes of all promises",
    explanation: "Promise.allSettled() waits for every promise and reports each fulfillment or rejection."
  },
  {
    id: "103",
    question: "Which method handles a rejected Promise?",
    options: ["then()", "catch()", "finally()", "resolve()"],
    answer: "catch()",
    explanation: "catch() registers a rejection handler for a Promise."
  },
  {
    id: "104",
    question: "What does async make a function return?",
    options: ["A string", "A Promise", "An array", "A callback"],
    answer: "A Promise",
    explanation: "An async function always returns a Promise."
  },
  {
    id: "105",
    question: "What happens when an async function throws an error?",
    options: ["It returns a rejected Promise", "It stops JavaScript permanently", "It returns null", "It automatically retries"],
    answer: "It returns a rejected Promise",
    explanation: "An uncaught error inside an async function causes its returned Promise to reject."
  },
  {
    id: "106",
    question: "Which API schedules a callback after a specified delay?",
    options: ["setTimeout()", "setInterval()", "requestAnimationFrame()", "queueMicrotask()"],
    answer: "setTimeout()",
    explanation: "setTimeout() schedules a callback to run after at least the specified delay."
  },
  {
    id: "107",
    question: "Which API repeatedly executes a callback at a time interval?",
    options: ["setTimeout()", "setInterval()", "clearTimeout()", "Promise.resolve()"],
    answer: "setInterval()",
    explanation: "setInterval() repeatedly schedules a callback at the specified interval."
  },
  {
    id: "108",
    question: "Which function cancels an interval?",
    options: ["clearInterval()", "clearTimeout()", "stopInterval()", "cancelPromise()"],
    answer: "clearInterval()",
    explanation: "clearInterval() cancels a previously established interval."
  },
  {
    id: "109",
    question: "Which function cancels a timeout?",
    options: ["clearInterval()", "clearTimeout()", "stopTimeout()", "cancelDelay()"],
    answer: "clearTimeout()",
    explanation: "clearTimeout() cancels a timeout that has not yet executed."
  },
  {
    id: "110",
    question: "What is event bubbling?",
    options: ["An event moving from an ancestor to descendants", "An event moving from target toward ancestors", "An event being deleted", "An event running twice automatically"],
    answer: "An event moving from target toward ancestors",
    explanation: "During bubbling, an event propagates from its target through its ancestors."
  },
  {
    id: "111",
    question: "Which method prevents an event's default browser action?",
    options: ["stopPropagation()", "preventDefault()", "stopDefault()", "cancelBubble()"],
    answer: "preventDefault()",
    explanation: "preventDefault() prevents the browser's default action for a cancelable event."
  },
  {
    id: "112",
    question: "Which method stops an event from propagating further?",
    options: ["preventDefault()", "stopPropagation()", "stopEvent()", "cancelDefault()"],
    answer: "stopPropagation()",
    explanation: "stopPropagation() prevents the event from continuing through the propagation path."
  },
  {
    id: "113",
    question: "What is event delegation?",
    options: ["Attaching one handler to a parent for descendant events", "Creating a new event for every click", "Removing all event listeners", "Delaying an event"],
    answer: "Attaching one handler to a parent for descendant events",
    explanation: "Event delegation uses bubbling to handle events from multiple child elements through a parent."
  },
  {
    id: "114",
    question: "Which property identifies the element that triggered an event?",
    options: ["event.target", "event.parent", "event.sourceCode", "event.origin"],
    answer: "event.target",
    explanation: "event.target references the element on which the event originally occurred."
  },
  {
    id: "115",
    question: "Which method attaches an event listener?",
    options: ["addEventListener()", "attachEventNow()", "onEvent()", "listen()"],
    answer: "addEventListener()",
    explanation: "addEventListener() registers a function to run when an event occurs."
  },
  {
    id: "116",
    question: "Which method removes an event listener?",
    options: ["deleteEventListener()", "removeEventListener()", "clearListener()", "detach()"],
    answer: "removeEventListener()",
    explanation: "removeEventListener() removes a previously registered listener with matching arguments."
  },
  {
    id: "117",
    question: "What does JSON.stringify() do with a function-valued object property?",
    options: ["Converts it to source text", "Omits the property", "Converts it to null", "Throws an error"],
    answer: "Omits the property",
    explanation: "Function-valued properties are omitted when serializing ordinary objects with JSON.stringify()."
  },
  {
    id: "118",
    question: "Which storage API persists string data in the browser across sessions?",
    options: ["sessionStorage", "localStorage", "window.name", "history"],
    answer: "localStorage",
    explanation: "localStorage stores string key-value data that generally persists across browser sessions."
  },
  {
    id: "119",
    question: "Which storage API is cleared when a browser tab session ends?",
    options: ["localStorage", "sessionStorage", "IndexedDB", "Cache API"],
    answer: "sessionStorage",
    explanation: "sessionStorage is scoped to a page session and is cleared when that session ends."
  },
  {
    id: "120",
    question: "What does the fetch() function return?",
    options: ["A Promise", "A plain object immediately", "A string", "An HTML element"],
    answer: "A Promise",
    explanation: "fetch() returns a Promise that resolves to a Response object."
  },
  {
    id: "121",
    question: "Which Response method parses a JSON response body?",
    options: ["response.json()", "response.parse()", "response.textJSON()", "response.object()"],
    answer: "response.json()",
    explanation: "response.json() reads the response body and parses it as JSON."
  },
  {
    id: "122",
    question: "Does fetch() reject automatically for HTTP 404 responses?",
    options: ["Yes, always", "No, not for HTTP error status alone", "Only on Chrome", "Only when JSON is returned"],
    answer: "No, not for HTTP error status alone",
    explanation: "fetch() usually fulfills for HTTP error statuses, so check response.ok or response.status."
  },
  {
    id: "123",
    question: "Which property indicates whether a fetch response status is in the successful range?",
    options: ["response.ok", "response.success", "response.valid", "response.done"],
    answer: "response.ok",
    explanation: "response.ok is true for HTTP status codes from 200 through 299."
  },
  {
    id: "124",
    question: "Which keyword imports a named export?",
    options: ["import", "require", "include", "using"],
    answer: "import",
    explanation: "The import statement brings exported bindings into an ES module."
  },
  {
    id: "125",
    question: "Which keyword exports a default value from a module?",
    options: ["export default", "module default", "default export", "return default"],
    answer: "export default",
    explanation: "export default declares the module's default export."
  },
  {
    id: "126",
    question: "Can an ES module have more than one default export?",
    options: ["Yes", "No", "Only with classes", "Only with functions"],
    answer: "No",
    explanation: "A module can have only one default export."
  },
  {
    id: "127",
    question: "What does strict mode help prevent?",
    options: ["All runtime errors", "Certain unsafe or error-prone JavaScript behaviors", "All asynchronous code", "Object creation"],
    answer: "Certain unsafe or error-prone JavaScript behaviors",
    explanation: "Strict mode changes some JavaScript semantics to catch common mistakes and unsafe actions."
  },
  {
    id: "128",
    question: "Which directive enables strict mode in a script or function?",
    options: ["'use strict';", "'strict';", "'enable strict';", "'javascript strict';"],
    answer: "'use strict';",
    explanation: "The 'use strict' directive enables strict mode in its applicable scope."
  },
  {
    id: "129",
    question: "What is hoisting?",
    options: ["Moving code physically to another file", "Declarations being processed before execution", "Sorting functions alphabetically", "Running all functions immediately"],
    answer: "Declarations being processed before execution",
    explanation: "Hoisting describes how declarations are processed before code execution within their scope."
  },
  {
    id: "130",
    question: "Which declaration is initialized with undefined during its hoisting behavior?",
    options: ["let", "const", "var", "class"],
    answer: "var",
    explanation: "var declarations are initialized to undefined when their scope is entered."
  },
  {
    id: "131",
    question: "What is the temporal dead zone?",
    options: ["A delay before a Promise resolves", "The period before let or const initialization", "A timeout for functions", "An inactive event listener"],
    answer: "The period before let or const initialization",
    explanation: "Accessing let or const bindings before initialization causes a ReferenceError."
  },
  {
    id: "132",
    question: "What is lexical scope?",
    options: ["Scope determined by where code is written", "Scope determined by the last function call", "Global-only scope", "Scope limited to arrays"],
    answer: "Scope determined by where code is written",
    explanation: "Lexical scope is determined by the source-code structure and nesting of functions and blocks."
  },
  {
    id: "133",
    question: "What does a closure retain access to?",
    options: ["Only global variables", "Its outer lexical environment", "Only function parameters", "The browser history"],
    answer: "Its outer lexical environment",
    explanation: "A closure retains access to variables from the lexical environment where it was created."
  },
  {
    id: "134",
    question: "What does bind() return?",
    options: ["A new function with a bound this value", "A Promise", "An array", "The original function's result"],
    answer: "A new function with a bound this value",
    explanation: "bind() creates a new function with a specified this value and optionally preset arguments."
  },
  {
    id: "135",
    question: "What does call() do?",
    options: ["Invokes a function with a specified this value and arguments", "Creates a Promise", "Copies a function", "Pauses execution"],
    answer: "Invokes a function with a specified this value and arguments",
    explanation: "call() invokes a function immediately with a specified this value and individual arguments."
  },
  {
    id: "136",
    question: "What does apply() use to pass function arguments?",
    options: ["An array or array-like object", "A string only", "A callback only", "A class instance"],
    answer: "An array or array-like object",
    explanation: "apply() invokes a function with arguments supplied as an array or array-like object."
  },
  {
    id: "137",
    question: "What does the unary plus operator do?",
    options: ["Converts an operand to a number", "Adds one to a number", "Converts a value to a string", "Checks equality"],
    answer: "Converts an operand to a number",
    explanation: "The unary plus operator attempts to convert its operand to a number."
  },
  {
    id: "138",
    question: "What does the expression 0 || 5 evaluate to?",
    options: ["0", "5", "true", "undefined"],
    answer: "5",
    explanation: "The logical OR operator returns the right operand when the left operand is falsy."
  },
  {
    id: "139",
    question: "What does the expression 0 ?? 5 evaluate to?",
    options: ["0", "5", "null", "undefined"],
    answer: "0",
    explanation: "Zero is not nullish, so the nullish coalescing operator returns zero."
  },
  {
    id: "140",
    question: "What is the result of typeof function() {}?",
    options: ["object", "function", "undefined", "method"],
    answer: "function",
    explanation: "typeof returns the string function for callable function objects."
  },

  // ==========================================
  // HARD QUESTIONS — IDs 141–200
  // ==========================================

  {
    id: "141",
    question: "What is the output of [1, 2, 3].map(x => x * 2)?",
    options: ["[1, 2, 3]", "[2, 4, 6]", "[3, 4, 5]", "12"],
    answer: "[2, 4, 6]",
    explanation: "map() applies the callback to each element and returns a new array."
  },
  {
    id: "142",
    question: "What is the output of [1, 2, 3].filter(x => x > 1)?",
    options: ["[1]", "[2, 3]", "[1, 2]", "[3]"],
    answer: "[2, 3]",
    explanation: "filter() keeps elements for which the callback returns true."
  },
  {
    id: "143",
    question: "What is the result of [1, 2, 3].reduce((sum, n) => sum + n, 0)?",
    options: ["3", "5", "6", "123"],
    answer: "6",
    explanation: "reduce() accumulates the values 1, 2, and 3 starting from zero."
  },
  {
    id: "144",
    question: "What does [...new Set([1, 1, 2, 3, 3])] produce?",
    options: ["[1, 1, 2, 3, 3]", "[1, 2, 3]", "[3, 2, 1]", "[1, 2, 3, 3]"],
    answer: "[1, 2, 3]",
    explanation: "Set stores unique values and preserves their insertion order."
  },
  {
    id: "145",
    question: "What is the result of 0.1 + 0.2 === 0.3?",
    options: ["true", "false", "undefined", "TypeError"],
    answer: "false",
    explanation: "Binary floating-point representation can make 0.1 + 0.2 slightly different from 0.3."
  },
  {
    id: "146",
    question: "Which method creates a shallow copy of an object?",
    options: ["Object.assign({}, obj)", "Object.freeze(obj)", "Object.seal(obj)", "Object.keys(obj)"],
    answer: "Object.assign({}, obj)",
    explanation: "Object.assign() copies enumerable own properties into the target object."
  },
  {
    id: "147",
    question: "What does the structuredClone() function provide?",
    options: ["A deep clone of supported values", "A shallow array copy only", "A JSON string", "A frozen object"],
    answer: "A deep clone of supported values",
    explanation: "structuredClone() creates a deep copy of supported structured-cloneable values."
  },
  {
    id: "148",
    question: "What is a shallow copy?",
    options: ["A copy that duplicates nested objects recursively", "A copy that retains references to nested objects", "A copy that removes all properties", "A copy that cannot be modified"],
    answer: "A copy that retains references to nested objects",
    explanation: "A shallow copy duplicates only the outer structure, leaving nested object references shared."
  },
  {
    id: "149",
    question: "What is the prototype of an object created with Object.create(null)?",
    options: ["Object.prototype", "null", "Array.prototype", "Function.prototype"],
    answer: "null",
    explanation: "Object.create(null) creates an object with no prototype."
  },
  {
    id: "150",
    question: "What does Object.getPrototypeOf(obj) return?",
    options: ["The object's prototype", "The object's constructor name", "The object's keys", "The object's memory location"],
    answer: "The object's prototype",
    explanation: "Object.getPrototypeOf() returns the prototype of the specified object."
  },
  {
    id: "151",
    question: "Which property is used to define a getter in an object literal?",
    options: ["get", "read", "fetch", "value"],
    answer: "get",
    explanation: "The get syntax defines an accessor property that runs when the property is read."
  },
  {
    id: "152",
    question: "Which property is used to define a setter in an object literal?",
    options: ["set", "write", "assign", "update"],
    answer: "set",
    explanation: "The set syntax defines an accessor property that runs when the property is assigned."
  },
  {
    id: "153",
    question: "What does Object.defineProperty() allow you to configure?",
    options: ["Property descriptors", "Only object prototypes", "Only array lengths", "Function execution order"],
    answer: "Property descriptors",
    explanation: "Object.defineProperty() defines or modifies a property using descriptor settings."
  },
  {
    id: "154",
    question: "Which descriptor controls whether a property can be reassigned?",
    options: ["enumerable", "writable", "configurable", "prototype"],
    answer: "writable",
    explanation: "The writable descriptor determines whether a data property's value can be changed."
  },
  {
    id: "155",
    question: "Which descriptor controls whether a property appears in Object.keys()?",
    options: ["writable", "configurable", "enumerable", "visible"],
    answer: "enumerable",
    explanation: "Object.keys() includes an object's own enumerable string-keyed properties."
  },
  {
    id: "156",
    question: "What does a generator function return when called?",
    options: ["A Promise", "An iterator object", "A regular array", "A Boolean"],
    answer: "An iterator object",
    explanation: "Calling a generator function returns an iterator that controls execution with next()."
  },
  {
    id: "157",
    question: "Which keyword pauses a generator function?",
    options: ["await", "yield", "pause", "break"],
    answer: "yield",
    explanation: "yield pauses a generator and produces a value to its iterator."
  },
  {
    id: "158",
    question: "What does iterator.next() commonly return?",
    options: ["A string", "An object with value and done", "A Promise only", "An array of arguments"],
    answer: "An object with value and done",
    explanation: "An iterator's next() method returns an object containing value and done."
  },
  {
    id: "159",
    question: "What does Symbol() create?",
    options: ["A unique primitive value", "A normal string", "An array", "A class instance"],
    answer: "A unique primitive value",
    explanation: "Each Symbol() call creates a unique symbol primitive."
  },
  {
    id: "160",
    question: "Which built-in symbol is used to customize object iteration?",
    options: ["Symbol.iterator", "Symbol.loop", "Symbol.each", "Symbol.next"],
    answer: "Symbol.iterator",
    explanation: "Symbol.iterator defines the default iterator method for an object."
  },
  {
    id: "161",
    question: "What is the purpose of WeakMap?",
    options: ["Store key-value pairs with object keys held weakly", "Sort object properties", "Store only strings", "Freeze objects"],
    answer: "Store key-value pairs with object keys held weakly",
    explanation: "WeakMap keys must be objects or non-registered symbols and are weakly held."
  },
  {
    id: "162",
    question: "Which collection stores unique object references and supports weak references?",
    options: ["Set", "WeakSet", "Map", "Array"],
    answer: "WeakSet",
    explanation: "WeakSet stores objects weakly and does not prevent them from being garbage-collected."
  },
  {
    id: "163",
    question: "Can a WeakMap be iterated with for...of?",
    options: ["Yes", "No", "Only when empty", "Only with strings"],
    answer: "No",
    explanation: "WeakMap is not iterable because its keys are weakly held."
  },
  {
    id: "164",
    question: "What does Map preserve about its entries?",
    options: ["Insertion order", "Alphabetical order", "Numeric order only", "Random order"],
    answer: "Insertion order",
    explanation: "Map iterates entries in the order they were inserted."
  },
  {
    id: "165",
    question: "Which Map method checks whether a key exists?",
    options: ["includes()", "has()", "contains()", "find()"],
    answer: "has()",
    explanation: "Map.has() returns true if the map contains the specified key."
  },
  {
    id: "166",
    question: "What is the output of Promise.resolve(5).then(x => x * 2)?",
    options: ["5", "10", "undefined", "A rejected Promise"],
    answer: "10",
    explanation: "The fulfillment handler receives 5 and returns 10."
  },
  {
    id: "167",
    question: "What happens when a Promise handler returns another Promise?",
    options: ["The chain adopts its eventual state", "The chain immediately rejects", "The Promise is ignored", "A syntax error occurs"],
    answer: "The chain adopts its eventual state",
    explanation: "Promise chaining assimilates the returned Promise and waits for its settlement."
  },
  {
    id: "168",
    question: "Which queue is used for Promise reaction callbacks?",
    options: ["Task queue", "Microtask queue", "Render queue", "Network queue"],
    answer: "Microtask queue",
    explanation: "Promise reactions are scheduled as microtasks."
  },
  {
    id: "169",
    question: "Which callback generally runs first after the current synchronous code finishes?",
    options: ["A Promise then() callback", "A setTimeout(..., 0) callback", "A long-running interval", "A later network request"],
    answer: "A Promise then() callback",
    explanation: "Promise reactions run as microtasks before the next task is processed."
  },
  {
    id: "170",
    question: "What does queueMicrotask() schedule?",
    options: ["A microtask", "A new browser tab", "A repeating timer", "A network request"],
    answer: "A microtask",
    explanation: "queueMicrotask() schedules a callback in the microtask queue."
  },
  {
    id: "171",
    question: "What does AbortController provide?",
    options: ["A way to signal cancellation", "A way to retry every request", "A JSON parser", "A Promise cache"],
    answer: "A way to signal cancellation",
    explanation: "AbortController creates an AbortSignal that APIs such as fetch can use to support cancellation."
  },
  {
    id: "172",
    question: "Which method signals an AbortController to cancel an operation?",
    options: ["controller.stop()", "controller.abort()", "controller.cancel()", "controller.end()"],
    answer: "controller.abort()",
    explanation: "abort() signals the associated AbortSignal to notify supported operations."
  },
  {
    id: "173",
    question: "What does Promise.any() fulfill with?",
    options: ["The first fulfilled result", "The first rejected result", "All results", "The last result"],
    answer: "The first fulfilled result",
    explanation: "Promise.any() fulfills as soon as one input fulfills and rejects if all inputs reject."
  },
  {
    id: "174",
    question: "What error does Promise.any() reject with if every input rejects?",
    options: ["TypeError", "AggregateError", "RangeError", "SyntaxError"],
    answer: "AggregateError",
    explanation: "Promise.any() rejects with AggregateError when all input promises reject."
  },
  {
    id: "175",
    question: "What is the purpose of the event loop?",
    options: ["Coordinate execution of tasks and asynchronous callbacks", "Compile JavaScript into CSS", "Create object prototypes", "Sort arrays"],
    answer: "Coordinate execution of tasks and asynchronous callbacks",
    explanation: "The event loop coordinates the call stack with queued tasks and microtasks."
  },
  {
    id: "176",
    question: "What is the call stack responsible for?",
    options: ["Tracking active function execution", "Storing all browser files", "Sorting asynchronous tasks", "Managing CSS styles"],
    answer: "Tracking active function execution",
    explanation: "The call stack tracks function calls and their execution contexts."
  },
  {
    id: "177",
    question: "What is recursion?",
    options: ["A function calling itself", "A loop that never ends", "A class extending itself", "A variable referencing null"],
    answer: "A function calling itself",
    explanation: "Recursion occurs when a function invokes itself directly or indirectly."
  },
  {
    id: "178",
    question: "What is a base case in recursion?",
    options: ["The condition that stops recursive calls", "The first variable declared", "The largest possible input", "A global function"],
    answer: "The condition that stops recursive calls",
    explanation: "A base case prevents recursion from continuing indefinitely."
  },
  {
    id: "179",
    question: "What is memoization?",
    options: ["Caching function results for repeated inputs", "Deleting unused variables", "Converting functions to classes", "Sorting function arguments"],
    answer: "Caching function results for repeated inputs",
    explanation: "Memoization stores previous results so repeated calculations can be avoided."
  },
  {
    id: "180",
    question: "Which algorithmic complexity describes a single pass through n elements?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: "O(n)",
    explanation: "A single pass performs work proportional to the number of elements."
  },
  {
    id: "181",
    question: "What is the average lookup complexity of a Map by key?",
    options: ["O(n²)", "O(n)", "O(1)", "O(log n)"],
    answer: "O(1)",
    explanation: "Map key lookup is generally expected to be constant time on average."
  },
  {
    id: "182",
    question: "Which array method mutates the original array by removing elements?",
    options: ["slice()", "splice()", "map()", "filter()"],
    answer: "splice()",
    explanation: "splice() changes the original array by removing, replacing, or adding elements."
  },
  {
    id: "183",
    question: "Which method returns a new array without changing the original array?",
    options: ["splice()", "sort()", "filter()", "reverse()"],
    answer: "filter()",
    explanation: "filter() returns a new array containing elements that pass its test."
  },
  {
    id: "184",
    question: "What does Object.is(NaN, NaN) return?",
    options: ["true", "false", "undefined", "NaN"],
    answer: "true",
    explanation: "Object.is() treats NaN as equal to NaN."
  },
  {
    id: "185",
    question: "What does Object.is(+0, -0) return?",
    options: ["true", "false", "null", "TypeError"],
    answer: "false",
    explanation: "Object.is() distinguishes positive zero from negative zero."
  },
  {
    id: "186",
    question: "Which method tests whether a string matches a regular expression?",
    options: ["test()", "matchAll()", "replace()", "split()"],
    answer: "test()",
    explanation: "RegExp.prototype.test() returns a Boolean indicating whether a match was found."
  },
  {
    id: "187",
    question: "Which regular expression flag makes matching case-insensitive?",
    options: ["g", "i", "m", "s"],
    answer: "i",
    explanation: "The i flag enables case-insensitive regular expression matching."
  },
  {
    id: "188",
    question: "Which regular expression flag enables global matching?",
    options: ["i", "m", "g", "u"],
    answer: "g",
    explanation: "The g flag enables global matching rather than stopping after the first match."
  },
  {
    id: "189",
    question: "What does the regular expression \\d match?",
    options: ["A digit", "A whitespace character", "A letter", "A punctuation mark"],
    answer: "A digit",
    explanation: "\\d matches a decimal digit from 0 through 9 in standard JavaScript regular expressions."
  },
  {
    id: "190",
    question: "What does the regular expression \\s match?",
    options: ["A digit", "Whitespace", "A word character", "A line of code"],
    answer: "Whitespace",
    explanation: "\\s matches whitespace characters such as spaces, tabs, and line terminators."
  },
  {
    id: "191",
    question: "What does the regular expression ^ represent?",
    options: ["End of input", "Start of input or line", "Any digit", "A word boundary"],
    answer: "Start of input or line",
    explanation: "^ matches the beginning of input, or a line when multiline mode is enabled."
  },
  {
    id: "192",
    question: "What does the regular expression $ represent?",
    options: ["Start of input", "End of input or line", "A digit", "A whitespace character"],
    answer: "End of input or line",
    explanation: "$ matches the end of input, or a line when multiline mode is enabled."
  },
  {
    id: "193",
    question: "Which API converts a JavaScript value to a locale-sensitive string?",
    options: ["toLocaleString()", "toLocal()", "localeConvert()", "formatString()"],
    answer: "toLocaleString()",
    explanation: "toLocaleString() returns a string using locale-sensitive formatting."
  },
  {
    id: "194",
    question: "Which built-in object represents a date and time?",
    options: ["Calendar", "Date", "Time", "Clock"],
    answer: "Date",
    explanation: "The Date object represents a specific instant in time."
  },
  {
    id: "195",
    question: "What does Date.now() return?",
    options: ["A formatted date string", "Milliseconds since the Unix epoch", "Seconds since 2000", "The current timezone name"],
    answer: "Milliseconds since the Unix epoch",
    explanation: "Date.now() returns the number of milliseconds elapsed since January 1, 1970 UTC."
  },
  {
    id: "196",
    question: "Which method returns the UTC year of a Date object?",
    options: ["getFullYear()", "getUTCFullYear()", "getYearUTC()", "toUTCYear()"],
    answer: "getUTCFullYear()",
    explanation: "getUTCFullYear() returns the year according to Coordinated Universal Time."
  },
  {
    id: "197",
    question: "Which API can format numbers according to a locale?",
    options: ["Intl.NumberFormat", "Number.Locale", "Math.Format", "String.Number"],
    answer: "Intl.NumberFormat",
    explanation: "Intl.NumberFormat provides locale-sensitive number formatting."
  },
  {
    id: "198",
    question: "Which API can compare strings according to language-sensitive sorting rules?",
    options: ["Intl.Collator", "String.Sorter", "Array.Locale", "Intl.Comparator"],
    answer: "Intl.Collator",
    explanation: "Intl.Collator provides language-sensitive string comparison."
  },
  {
    id: "199",
    question: "What does import() return?",
    options: ["A Promise for a module namespace object", "A synchronous object", "A class constructor", "A string"],
    answer: "A Promise for a module namespace object",
    explanation: "Dynamic import() asynchronously loads a module and returns a Promise."
  },
  {
    id: "200",
    question: "What is tree shaking in JavaScript bundling?",
    options: ["Removing unused code from a bundle", "Sorting objects in memory", "Compressing images", "Converting arrays to trees"],
    answer: "Removing unused code from a bundle",
    explanation: "Tree shaking eliminates unused exports and code during the build process when supported."
  },

  // ==========================================
  // EXPERT QUESTIONS — IDs 201–250
  // ==========================================

  {
    id: "201",
    question: "What is the result of Object.prototype.toString.call([])?",
    options: ["[object Array]", "[object Object]", "[object List]", "[object Function]"],
    answer: "[object Array]",
    explanation: "The built-in object tag for an array is [object Array]."
  },
  {
    id: "202",
    question: "What is the result of Object.prototype.toString.call(null)?",
    options: ["[object Null]", "[object Object]", "[object Undefined]", "null"],
    answer: "[object Null]",
    explanation: "Object.prototype.toString.call() identifies null with the tag [object Null]."
  },
  {
    id: "203",
    question: "What does Reflect.ownKeys(obj) return?",
    options: ["Only enumerable string keys", "All own string and symbol keys", "Only inherited keys", "Only symbol keys"],
    answer: "All own string and symbol keys",
    explanation: "Reflect.ownKeys() returns every own property key, including non-enumerable and symbol keys."
  },
  {
    id: "204",
    question: "Which API intercepts fundamental operations performed on an object?",
    options: ["Proxy", "Reflect only", "WeakMap", "Symbol"],
    answer: "Proxy",
    explanation: "Proxy creates an object that can intercept operations through handler traps."
  },
  {
    id: "205",
    question: "Which Proxy trap intercepts property access?",
    options: ["get", "set", "apply", "construct"],
    answer: "get",
    explanation: "The get trap intercepts reading a property from the proxied target."
  },
  {
    id: "206",
    question: "Which Proxy trap intercepts property assignment?",
    options: ["get", "set", "has", "deleteProperty"],
    answer: "set",
    explanation: "The set trap intercepts attempts to assign a property value."
  },
  {
    id: "207",
    question: "Which Proxy trap intercepts the in operator?",
    options: ["has", "get", "ownKeys", "defineProperty"],
    answer: "has",
    explanation: "The has trap intercepts property existence checks using the in operator."
  },
  {
    id: "208",
    question: "Which Proxy trap intercepts function calls?",
    options: ["apply", "construct", "get", "set"],
    answer: "apply",
    explanation: "The apply trap intercepts calls to a proxied callable function."
  },
  {
    id: "209",
    question: "Which Proxy trap intercepts object construction with new?",
    options: ["apply", "construct", "getPrototypeOf", "has"],
    answer: "construct",
    explanation: "The construct trap intercepts operations performed with the new operator."
  },
  {
    id: "210",
    question: "What is the purpose of Reflect?",
    options: ["Provide methods for interceptable JavaScript operations", "Create browser windows", "Replace the event loop", "Compile JavaScript"],
    answer: "Provide methods for interceptable JavaScript operations",
    explanation: "Reflect provides methods corresponding to many fundamental object operations."
  },
  {
    id: "211",
    question: "What does Reflect.set() return?",
    options: ["A Boolean indicating whether assignment succeeded", "The assigned object", "A Promise", "The property name"],
    answer: "A Boolean indicating whether assignment succeeded",
    explanation: "Reflect.set() returns true when the property assignment succeeds."
  },
  {
    id: "212",
    question: "What is the purpose of Symbol.for()?",
    options: ["Create or retrieve a globally registered symbol", "Create a private class field", "Convert a symbol to a string", "Freeze a symbol"],
    answer: "Create or retrieve a globally registered symbol",
    explanation: "Symbol.for() uses the global symbol registry to retrieve or create a symbol by key."
  },
  {
    id: "213",
    question: "What does Symbol.keyFor() return?",
    options: ["The key of a globally registered symbol", "The description of every symbol", "The symbol's memory address", "The symbol's prototype"],
    answer: "The key of a globally registered symbol",
    explanation: "Symbol.keyFor() returns the registry key for a globally registered symbol."
  },
  {
    id: "214",
    question: "What is the purpose of Symbol.toPrimitive?",
    options: ["Customize an object's primitive conversion", "Make an object iterable", "Create a private property", "Prevent type coercion"],
    answer: "Customize an object's primitive conversion",
    explanation: "Symbol.toPrimitive defines a method that controls an object's conversion to a primitive value."
  },
  {
    id: "215",
    question: "Which symbol is used to customize the behavior of the + operator during primitive conversion?",
    options: ["Symbol.iterator", "Symbol.toPrimitive", "Symbol.species", "Symbol.hasInstance"],
    answer: "Symbol.toPrimitive",
    explanation: "Symbol.toPrimitive can customize how an object converts to a primitive for operations such as addition."
  },
  {
    id: "216",
    question: "What does Symbol.hasInstance customize?",
    options: ["The behavior of instanceof", "Array iteration", "String conversion", "Object serialization"],
    answer: "The behavior of instanceof",
    explanation: "Symbol.hasInstance can customize the behavior of the instanceof operator."
  },
  {
    id: "217",
    question: "What does Symbol.species influence?",
    options: ["The constructor used by certain derived objects", "Object property visibility", "Promise rejection handling", "Function scope"],
    answer: "The constructor used by certain derived objects",
    explanation: "Symbol.species allows subclasses to specify which constructor is used by certain built-in methods."
  },
  {
    id: "218",
    question: "What is a tagged template literal?",
    options: ["A template literal processed by a function", "A template literal with HTML tags only", "A string with a label", "A template that cannot contain expressions"],
    answer: "A template literal processed by a function",
    explanation: "A tag function receives the template's string segments and interpolated values as arguments."
  },
  {
    id: "219",
    question: "What does the tag function receive as its first argument?",
    options: ["An array of string segments", "The final string only", "The first interpolation value", "A Promise"],
    answer: "An array of string segments",
    explanation: "A tagged template function receives an array of literal string segments as its first argument."
  },
  {
    id: "220",
    question: "What is the purpose of import.meta?",
    options: ["Provide metadata about the current module", "Import every module automatically", "Access the global object", "Export a default function"],
    answer: "Provide metadata about the current module",
    explanation: "import.meta exposes host-provided metadata about the current ES module."
  },
  {
    id: "221",
    question: "What does top-level await allow in supported modules?",
    options: ["Using await outside an async function", "Using await inside every script", "Blocking the entire operating system", "Skipping Promise creation"],
    answer: "Using await outside an async function",
    explanation: "Top-level await allows await expressions directly within supported ES modules."
  },
  {
    id: "222",
    question: "What happens when a module uses top-level await?",
    options: ["Module evaluation waits for the awaited result", "The module becomes synchronous", "All imports are removed", "The browser stops rendering permanently"],
    answer: "Module evaluation waits for the awaited result",
    explanation: "A module containing top-level await is asynchronously evaluated until the awaited operation settles."
  },
  {
    id: "223",
    question: "What is a live binding in ES modules?",
    options: ["An imported binding reflects updates to the exported binding", "An imported value is always copied once", "A binding that cannot be reassigned by its exporter", "A global variable"],
    answer: "An imported binding reflects updates to the exported binding",
    explanation: "ES module imports are live read-only views of exported bindings."
  },
  {
    id: "224",
    question: "Can an importing module directly reassign an imported binding?",
    options: ["Yes", "No", "Only for default imports", "Only in strict mode"],
    answer: "No",
    explanation: "Imported bindings are read-only in the importing module."
  },
  {
    id: "225",
    question: "What is the main purpose of WeakRef?",
    options: ["Hold a weak reference to an object", "Prevent garbage collection", "Deep clone an object", "Make an object immutable"],
    answer: "Hold a weak reference to an object",
    explanation: "WeakRef allows a reference to an object without keeping that object alive solely because of the reference."
  },
  {
    id: "226",
    question: "What does FinalizationRegistry allow developers to register?",
    options: ["A cleanup callback for an object after it is garbage-collected", "A function that prevents garbage collection", "A Promise rejection handler", "A property setter"],
    answer: "A cleanup callback for an object after it is garbage-collected",
    explanation: "FinalizationRegistry registers cleanup callbacks that may run after an object is reclaimed."
  },
  {
    id: "227",
    question: "Why should FinalizationRegistry callbacks not be relied upon for essential program logic?",
    options: ["Their execution timing is not guaranteed", "They always run immediately", "They cannot access JavaScript", "They run only in strict mode"],
    answer: "Their execution timing is not guaranteed",
    explanation: "Garbage collection and finalization timing are controlled by the runtime and are not guaranteed."
  },
  {
    id: "228",
    question: "What is tail recursion?",
    options: ["Recursion where the recursive call is the final operation", "Recursion that uses arrays", "Recursion without a base case", "A function calling two functions"],
    answer: "Recursion where the recursive call is the final operation",
    explanation: "In tail recursion, the recursive call is the final action performed by the function."
  },
  {
    id: "229",
    question: "Does every JavaScript engine guarantee tail-call optimization?",
    options: ["Yes", "No", "Only in Node.js", "Only in strict mode in every engine"],
    answer: "No",
    explanation: "Tail-call optimization is not universally implemented across JavaScript engines."
  },
  {
    id: "230",
    question: "What is the main purpose of a debounce function?",
    options: ["Delay execution until calls stop for a specified period", "Execute a function at a fixed interval", "Run a function only once ever", "Execute every call immediately"],
    answer: "Delay execution until calls stop for a specified period",
    explanation: "Debouncing delays execution until a specified quiet period has passed after the latest call."
  },
  {
    id: "231",
    question: "What is the main purpose of a throttle function?",
    options: ["Limit how often a function can execute", "Wait until all calls stop", "Convert a function to a Promise", "Cancel every function call"],
    answer: "Limit how often a function can execute",
    explanation: "Throttling limits the execution frequency of a function over time."
  },
  {
    id: "232",
    question: "Which technique is commonly used to avoid repeatedly recalculating expensive results?",
    options: ["Memoization", "Event bubbling", "Hoisting", "Destructuring"],
    answer: "Memoization",
    explanation: "Memoization caches results so repeated inputs can reuse previous calculations."
  },
  {
    id: "233",
    question: "What is referential transparency?",
    options: ["An expression can be replaced by its value without changing program behavior", "A variable always refers to an object", "A function always modifies its input", "A reference can never be reassigned"],
    answer: "An expression can be replaced by its value without changing program behavior",
    explanation: "Referential transparency is a property of expressions whose value can safely replace the expression."
  },
  {
    id: "234",
    question: "What is a pure function?",
    options: ["A function with no side effects and the same output for the same inputs", "A function that uses no parameters", "A function that always returns true", "A function that modifies global state"],
    answer: "A function with no side effects and the same output for the same inputs",
    explanation: "A pure function consistently returns the same output for the same inputs and does not cause observable side effects."
  },
  {
    id: "235",
    question: "Which programming concept means an object cannot be changed after creation?",
    options: ["Immutability", "Inheritance", "Polymorphism", "Encapsulation"],
    answer: "Immutability",
    explanation: "Immutability means data is not modified after it has been created."
  },
  {
    id: "236",
    question: "What does Object.freeze() do to nested objects?",
    options: ["It freezes them recursively", "It does not automatically freeze nested objects", "It deletes them", "It converts them to strings"],
    answer: "It does not automatically freeze nested objects",
    explanation: "Object.freeze() is shallow, so nested objects remain mutable unless frozen separately."
  },
  {
    id: "237",
    question: "What is the difference between null and undefined?",
    options: ["They are always identical", "null is intentional absence; undefined commonly means not assigned", "undefined is always an object", "null is a function"],
    answer: "null is intentional absence; undefined commonly means not assigned",
    explanation: "null is often used to express an intentional empty value, while undefined commonly indicates a missing or unassigned value."
  },
  {
    id: "238",
    question: "What is the result of NaN === NaN?",
    options: ["true", "false", "undefined", "NaN"],
    answer: "false",
    explanation: "NaN is unequal to every value, including itself, under strict equality."
  },
  {
    id: "239",
    question: "Which method reliably checks whether a value is NaN?",
    options: ["Number.isNaN()", "isNumber()", "typeofNaN()", "Object.isNaN()"],
    answer: "Number.isNaN()",
    explanation: "Number.isNaN() checks whether a value is exactly the numeric NaN value without coercion."
  },
  {
    id: "240",
    question: "What does Number.isFinite('10') return?",
    options: ["true", "false", "10", "NaN"],
    answer: "false",
    explanation: "Number.isFinite() does not coerce strings, so the string '10' is not a finite number."
  },
  {
    id: "241",
    question: "What is the purpose of BigInt?",
    options: ["Represent integers larger than Number's safe integer range", "Represent decimal fractions exactly", "Replace all Number values", "Store binary files"],
    answer: "Represent integers larger than Number's safe integer range",
    explanation: "BigInt represents integers of arbitrary precision within implementation limits."
  },
  {
    id: "242",
    question: "Can a BigInt be directly mixed with a Number in arithmetic?",
    options: ["Yes, always", "No, not without explicit conversion", "Only with multiplication", "Only in strict mode"],
    answer: "No, not without explicit conversion",
    explanation: "Arithmetic between BigInt and Number values generally requires explicit conversion."
  },
  {
    id: "243",
    question: "What does 5n represent in JavaScript?",
    options: ["A BigInt value", "A Number value", "A string", "A binary value"],
    answer: "A BigInt value",
    explanation: "The n suffix creates a BigInt literal."
  },
  {
    id: "244",
    question: "What is the purpose of Atomics in JavaScript?",
    options: ["Provide atomic operations on shared memory", "Create atomic CSS styles", "Manage DOM events", "Serialize objects"],
    answer: "Provide atomic operations on shared memory",
    explanation: "Atomics provides operations for safely coordinating access to shared memory."
  },
  {
    id: "245",
    question: "Which object enables shared memory between supported JavaScript execution contexts?",
    options: ["SharedArrayBuffer", "ArrayBuffer only", "WeakMap", "DataView"],
    answer: "SharedArrayBuffer",
    explanation: "SharedArrayBuffer provides memory that can be shared between supported execution contexts."
  },
  {
    id: "246",
    question: "What is the purpose of DataView?",
    options: ["Read and write multiple numeric types in an ArrayBuffer", "Sort arrays", "Create a DOM table", "Store object prototypes"],
    answer: "Read and write multiple numeric types in an ArrayBuffer",
    explanation: "DataView provides low-level access to binary data in an ArrayBuffer."
  },
  {
    id: "247",
    question: "What is a typed array designed to represent?",
    options: ["A view over binary data with a specific numeric type", "An array containing only objects", "A list of functions", "A collection of DOM nodes"],
    answer: "A view over binary data with a specific numeric type",
    explanation: "Typed arrays provide array-like views over binary data using specific numeric element types."
  },
  {
    id: "248",
    question: "What does ArrayBuffer represent?",
    options: ["A fixed-length raw binary data buffer", "A dynamically growing string", "A collection of promises", "A JavaScript class prototype"],
    answer: "A fixed-length raw binary data buffer",
    explanation: "ArrayBuffer represents a fixed-length block of raw binary data."
  },
  {
    id: "249",
    question: "What is the purpose of Web Workers?",
    options: ["Run JavaScript in background threads separate from the main UI thread", "Replace HTML elements", "Automatically optimize CSS", "Store browser passwords"],
    answer: "Run JavaScript in background threads separate from the main UI thread",
    explanation: "Web Workers allow scripts to run in background threads without directly manipulating the DOM."
  },
  {
    id: "250",
    question: "How do messages commonly pass between a Web Worker and the main thread?",
    options: ["postMessage()", "console.log()", "localStorage()", "document.write()"],
    answer: "postMessage()",
    explanation: "postMessage() sends messages between a worker and its owning context."
  }
];

export default questions;
