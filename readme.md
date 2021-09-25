## Nodejs IO package for Robocontest.uz

### Usage:

```js
let io = require('@robocontest/io');

const {input, output} = io(process.stdin, process.stdout)

input.start().then(() => {
  let a = input.readNumber()
  let b = input.readNumber()

  output.write(a + b)
  output.close();
})
```

```js
const fs = require('fs');
let io = require('@robocontest/io');

const {input, output} = io(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output.txt')
)

input.start().then(() => {
  let a = input.readNumber()
  let b = input.readNumber()

  output.write(a + b)
  output.close();
})
```
