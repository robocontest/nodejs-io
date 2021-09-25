import {streamToString, stringToSteam} from "../src/helpers";
import input from "../src/input";
import output from "../src/output";
import {PassThrough} from "stream";

require('chai').should()

describe('Test IO', function () {
  it('should read strings', async function () {
    let stdin = stringToSteam('Hello world\nHello           12345')

    let IO = input(stdin)

    await IO.start()

    IO.read().should.be.eq('Hello')
    IO.read().should.be.eq('world')
    IO.read().should.be.eq('Hello')
    IO.read().should.be.eq('12345')
  });

  it('should read string lines', async function () {
    let stdin = stringToSteam('Hello world\nHello   \n 12345')

    let IO = input(stdin)

    await IO.start()

    IO.readLine().should.be.eq('Hello world')
    IO.readLine().should.be.eq('Hello   ')
    IO.readLine().should.be.eq(' 12345')
  });

  it('should read number', async function () {
    let stdin = stringToSteam(' 123 \n -456   \n 123.45 1')

    let IO = input(stdin)

    await IO.start()

    IO.readNumber().should.be.eq(123)
    IO.readNumber().should.be.eq(-456)
    IO.readNumber().should.be.eq(123.45)
    IO.readNumber().should.be.eq(1)
  });

  it('should test output', async function () {
    let out = new PassThrough()
    let writer = output(out)

    writer.writeLn(123);
    writer.write('123');
    writer.close();

    (await streamToString(out)).should.be.eq('123\n123')
  });
});
