import {Writable} from "stream";
import {Buffer} from "buffer";

export class Output {
  private writable: Writable;

  constructor(writable: Writable) {
    this.writable = writable;
  }

  write(contents: any) {
    if (typeof contents === 'string' || contents instanceof String) {
      this.writable.write(contents)
    } else if (contents instanceof Buffer) {
      this.writable.write(contents.toString())
    } else if (typeof contents === 'number' || contents instanceof Number) {
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
