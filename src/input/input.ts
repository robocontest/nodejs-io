import {Readable} from "stream";
import InputInterface from "./InputInterface";
import {Buffer} from 'buffer';

const CHAR_SLASH_R = 13;
const CHAR_SLASH_N = 10;
const CHAR_SPACE = 32;

export class Input implements InputInterface {
  private input: Readable;

  private _chunk: Buffer;
  private _chunkOffset = 0;

  constructor(input: Readable) {
    this.input = input;
    this._chunk = Buffer.alloc(0)

    this.input.on('pause', () => {
      // console.log('PAUSED')
    })

    this.input.on('resume', () => {
      // console.log('resume')
    })

    this.input.on('close', () => {
      // console.log('close')
    })

    this.input.on('end', () => {
      // console.log('end')
    })

    this.input.on('data', (chunk: Buffer) => {
      // console.log('NEW DATA', chunk.length)
    })
  }

  async start() {
    return new Promise((resolve => {
      this.input.on('readable', resolve)
    }))
  }

  readNumber(): number {
    let readChunk = [];
    let pos = 0;
    let found = false;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._readChunk();
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if ((this._chunk[i] >= 48 && this._chunk[i] <= 57) || this._chunk[i] === 46) {
            readChunk[pos++] = this._chunk[i];
            found = true;
          } else {
            this._chunkOffset = i + 1;

            if (found)
              break main;
          }
        }
      }

    return parseFloat(Buffer.from(readChunk).toString('utf8'));
  }

  read(): string {
    let readChunk = [];
    let pos = 0;
    let foundWord = false;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._readChunk();
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (this._chunk[i] === CHAR_SLASH_R || this._chunk[i] === CHAR_SLASH_N || this._chunk[i] === CHAR_SPACE) {
            this._chunkOffset = i;

            if (foundWord)
              break main;
          } else {
            foundWord = true;
            readChunk[pos++] = this._chunk[i];
          }
        }
      }

    return Buffer.from(readChunk).toString('utf8');
  }

  readLine(): string {
    let readChunk = [];
    let pos = 0;

    main:
      while (true) {
        if (this._chunkOffset + 1 >= this._chunk.length) {
          this._readChunk();
        }

        if (this._chunk === null)
          break;

        for (let i = this._chunkOffset; i < this._chunk.length; i++) {
          if (this._chunk[i] === CHAR_SLASH_R) {
            this._chunkOffset = i + 2;

            break main;
          } else if (this._chunk[i] === CHAR_SLASH_N) {
            this._chunkOffset = i + 1;

            break main;
          } else {
            readChunk[pos++] = this._chunk[i];
          }
        }
      }

    return Buffer.from(readChunk).toString('utf8');
  }

  private _readChunk() {
    this._chunk = this.input.read();
    this._chunkOffset = 0;
  }
}

function input(input: Readable): Input {
  return new Input(input)
}

module.exports = input;

export default input;
