import {Writable} from "stream";
import {Buffer} from "buffer";

export class Output {
  private writable: Writable;

  constructor(writable: Writable) {
    this.writable = writable;
  }

  write(contents: any) {
    if (contents instanceof String || contents instanceof Buffer || contents instanceof Uint8Array) {
      this.writable.write(contents)
    } else if (contents instanceof Number) {
      this.writable.write(contents.toString())
    } else {
      this.writable.write(contents.toString(), (err) => {
        // ignore
      })
    }
  }

  writeLn(contents: any) {
    this.write(contents)
    this.write('\n')
  }

  close() {
    this.writable.end()
  }
}

export default function output(writable: Writable): Output {
  return new Output(writable);
}
