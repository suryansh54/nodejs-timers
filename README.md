# Node JS Timers

The Timers module in Node.js contains functions that execute code after a set period of time. Timers do not need to be imported via require(), since all the methods are available globally to emulate the browser JavaScript API. To fully understand when timer functions will be executed, it's a good idea to read up on the Node.js Event Loop.

- setTimeout()
- setImmediate()
- setInterval()
- process.nextTick()

### setTimeout()
setTimeout() can be used to schedule code execution after a designated amount of milliseconds. This function is similar to window.setTimeout() from the browser JavaScript API, however a string of code cannot be passed to be executed.

```javascript
function myFunc(arg) {
  console.log(`arg was => ${arg}`);
}

setTimeout(myFunc, 1500, 'funky');

// arg was => funky
```

### setImmediate()
setImmediate() will execute code at the end of the current event loop cycle. This code will execute after any I/O operations in the current event loop and before any timers scheduled for the next event loop. This code execution could be thought of as happening "right after this", meaning any code following the setImmediate() function call will execute before the setImmediate() function argument.

```javascript
console.log('before immediate');

setImmediate((arg) => {
  console.log(`executing immediate: ${arg}`);
}, 'so immediate');

console.log('after immediate');

// before immediate
// after immediate
// executing immediate: so immediate
```

### "Infinite Loop" Execution ~ setInterval()
If there is a block of code that should execute multiple times, setInterval() can be used to execute that code. setInterval() takes a function argument that will run an infinite number of times with a given millisecond delay as the second argument. Just like setTimeout(), additional arguments can be added beyond the delay, and these will be passed on to the function call. Also like setTimeout(), the delay cannot be guaranteed because of operations that may hold on to the event loop, and therefore should be treated as an approximate delay.

```javascript
function intervalFunc() {
  console.log('Cant stop me now!');
}

setInterval(intervalFunc, 1500);
```

### Clearing the Future
What can be done if a Timeout or Immediate object needs to be cancelled? setTimeout(), setImmediate(), and setInterval() return a timer object that can be used to reference the set Timeout or Immediate object. By passing said object into the respective clear function, execution of that object will be halted completely. The respective functions are clearTimeout(), clearImmediate(), and clearInterval(). See the example below for an example of each:

```javascript
const timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 1500);

const immediateObj = setImmediate(() => {
  console.log('immediately executing immediate');
});

const intervalObj = setInterval(() => {
  console.log('interviewing the interval');
}, 500);

clearTimeout(timeoutObj);
clearImmediate(immediateObj);
clearInterval(intervalObj);
```

### process.nextTick()

#### Why use process.nextTick()?
There are two main reasons:

- Allow users to handle errors, cleanup any then unneeded resources, or perhaps try the request again before the event loop continues.
- At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues.

#### What is the Event Loop?
- The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.
- Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed. We'll explain this in further detail later in this topic.

#### Event Loop Explained
When Node.js starts, it initializes the event loop, processes the provided input script (or drops into the REPL, which is not covered in this document) which may make async API calls, schedule timers, or call process.nextTick(), then begins processing the event loop.

```javascript
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```   

#### setImmediate() vs setTimeout()
setImmediate() and setTimeout() are similar, but behave in different ways depending on when they are called.

- setImmediate() is designed to execute a script once the current poll phase completes.
- setTimeout() schedules a script to be run after a minimum threshold in ms has elapsed.

```javascript
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});

/* $ node timeout_vs_immediate.js
timeout
immediate */

/* $ node timeout_vs_immediate.js
immediate
timeout */
```

#### process.nextTick() vs setImmediate()
We have two calls that are similar as far as users are concerned, but their names are confusing.

- process.nextTick() fires immediately on the same phase
- setImmediate() fires on the following iteration or 'tick' of the event loop

In essence, the names should be swapped. process.nextTick() fires more immediately than setImmediate(), but this is an artifact of the past which is unlikely to change. Making this switch would break a large percentage of the packages on npm. Every day more new modules are being added, which means every day we wait, more potential breakages occur. While they are confusing, the names themselves won't change.

We recommend developers use setImmediate() in all cases because it's easier to reason about (and it leads to code that's compatible with a wider variety of environments, like browser JS.)
