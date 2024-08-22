> ❌ DEPRECATED in favour of [`Promise.withResolvers()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)

# 🕹️🤞 remote-promises

Create native [ES6 promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and resolve them externally.

![NPM Version Shield](https://img.shields.io/npm/v/remote-promises)
![NPM Size Shield](https://img.shields.io/bundlephobia/minzip/remote-promises?label=package%20size)

## Get Started

Ensure its installed as a dependency from your console:
```sh
npm i remote-promises
```

Then import the `RemotePromise` class before attempting the following examples
```javascript
import { RemotePromise } from 'remote-promises'
```

### Remotely Controlling the Promise

I guess this is why you're here – use `.resolve()` or `.reject()` to satisfy the promise.

When you do this, the `status` property changes from `"pending"` to either `"resolved"` or `"rejected"`.

```javascript
// Instantiate a new remote promise
const rp = new RemotePromise()

rp.resolve('some resolved value')
//- rp.reject(new Error("500: The whole system's blown!"))

rp.status // 'resolved'
```

### Awaiting a Remote Promise

`RemotePromise` can be used with the `await` keyword just like the native promises.

```javascript
const rp = new RemotePromise()
rp.resolve('any value')

// Use await in an asynchronous context
(async () => {
  console.log(await rp) // 'any value'
})()
```

But when `await` is used with a rejected promise, the rejection is thrown like an error and can be caught.

```javascript
const rp = new RemotePromise()

// Gotta catch 'em all!
(async () => {
  try {
    await rp
  } catch (reason) {
    console.log(reason) // 'pocket monsters'
  }
})()

rp.reject('pocket monsters')
```

### Using Then and Catch

If you're not a fan of the `async`/`await` style, then you can use `then`/`catch` as you normally would with promises. These can be chained too.

```javascript
const rp = new RemotePromise()

// then/catch can be called the promise is satisfied
rp.then(value => console.log('success', value))
rp.catch(reason => console.log('flop', reason)) // 'flop', 'fish'

// Satisfy the promise
rp.reject('fish')

// Cheeky little example involving chains
rp
  .catch(() => 'flip')
  .then(value => console.log(value)) // 'flip'
```

### Involving Types for TypeScript

As with the native promises, you're able to define an interface for a fulfilled promise value.

```typescript
// Define your structure
interface SomeStructure {
  status: 200
  result: string
}

// Create a new typed remote promise
const rp = new RemotePromise<SomeStructure>()

// Must resolve with an object according to the type
rp.resolve({
  status: 200,
  result: 'samosas'
})

// Start writing a callback...
rp.then(val => {
  // val is of type SomeStructure
})
```
