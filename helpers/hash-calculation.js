import { createReadStream } from 'fs';
import { finished } from 'stream/promises'
import { createHash } from 'crypto';
import path from 'path';

export const hash = async pathToFile => {
  const filePath = path.isAbsolute(pathToFile) ? pathToFile : path.join(process.cwd(), pathToFile);

  const hash = createHash('sha256');
  const stream = createReadStream(filePath);

  stream.on('data', chunk => hash.update(chunk));

  stream.on('end', () => console.log(hash.digest('hex')));

  await finished(stream);
}
