import {Readable, Writable} from "stream";
import input from "../input";
import output from "../output";
import * as fs from "fs";

/**
 * @param readable Readable stream or path to input file
 * @param writable Writable stream or path to output file
 */
export default function io(readable: Readable | string, writable: Writable | string) {
  let inputResource: Readable;
  let outputResource: Writable;

  inputResource = typeof readable === 'string' ? fs.createReadStream(readable) : readable;
  outputResource = typeof writable === 'string' ? fs.createWriteStream(writable) : writable;

  return {
    input: input(inputResource),
    output: output(outputResource)
  }
}
