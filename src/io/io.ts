import {Readable, Writable} from "stream";
import input from "../input";
import output from "../output";

export default function io(readable: Readable, writable: Writable) {
  return {
    input: input(readable),
    output: output(writable)
  }
}
