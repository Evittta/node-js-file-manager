import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises'

const compress = async (pathToFile, pathToDestination) => {
  await pipeline(
    createReadStream(pathToFile),
    createBrotliCompress(),
    createWriteStream(pathToDestination)
  );
}

const decompress = async (pathToFile, pathToDestination) => {
  await pipeline(
    createReadStream(pathToFile),
    createBrotliDecompress(),
    createWriteStream(pathToDestination)
  );
}

export default {
  compress,
  decompress,
}
