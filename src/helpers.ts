import {PassThrough, Readable} from "stream";
import * as stream from "stream";

export function stringToSteam(string: String): PassThrough {
  const stdinStream = new stream.Readable();
  stdinStream.push(string);

  if (string && !string.endsWith('\n')) {
    stdinStream.push('\n');
  }

  stdinStream.push(null);

  const pass = new PassThrough();

  stdinStream.pipe(pass);

  return pass;
}

export function streamToString(readStream: Readable): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('error', reject);
    readStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}
