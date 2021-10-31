## Nodejs IO package for Robocontest.uz

### Usage:

```js
let io = require('@robocontest/io');

const {input, output} = io(process.stdin, process.stdout);

input.start().then(async () => {
  let a = await input.readNumber();
  let b = await input.readNumber();

  output.write(a + b);
  output.close(); // close is mandatory if you want if streams correctly flushed to file
});
```

```js
let io = require('@robocontest/io');

const {input, output} = io('input.txt', 'output.txt');

input.start().then(async () => {
  let a = await input.readNumber();
  let b = await input.readNumber();

  output.write(a + b)
  output.close();
});

```
Shorter import
```js
const {input, output} = require('@robocontest/io')(process.stdin, process.stdout);

input.start().then(async () => {
  let a = await input.readNumber();
  let b = await input.readNumber();

  output.write(a + b);
  output.close();
});
```
