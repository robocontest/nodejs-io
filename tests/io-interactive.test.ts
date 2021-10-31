// Manual test, input to console

import input from "../src/input";

let IO = input(process.stdin);

IO.start().then(async () => {
  console.log(await IO.read());
  console.log(await IO.readLine());
  console.log(await IO.readNumber());
})
