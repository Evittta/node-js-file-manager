import { promises as fs, createReadStream, createWriteStream } from 'fs';
import { finished, pipeline } from 'stream/promises'
import path from 'path';

const cat = async pathToFile => {
  const stream = createReadStream(pathToFile, 'utf-8');

  stream.on('data', chunk => console.log(chunk));

  await finished(stream);
}

const add = async fileName => {  
  const pathToFile = path.join(process.cwd(), fileName);
  
  await fs.writeFile(pathToFile, '');
}

const mkdir = async directoryName => {  
  const pathToFolder = path.join(process.cwd(), directoryName);
  
  await fs.mkdir(pathToFolder);
}

const rn = async (pathToFile, newFileName) => await fs.rename(pathToFile, newFileName);

const cp = async (pathToFile, pathToNewDirectory) => {
  const parsedPathToFile = path.isAbsolute(pathToFile) ? pathToFile : path.join(process.cwd(), pathToFile);
  const parsedPathToWriteFile = path.join(pathToNewDirectory, path.parse(pathToFile).base);

  const readableStream = createReadStream(parsedPathToFile);
  const writableStream = createWriteStream(parsedPathToWriteFile);

  await pipeline(readableStream, writableStream);
}

const move = async (pathToFile, pathToNewDirectory) => {
  const parsedPathToFile = path.isAbsolute(pathToFile) ? pathToFile : path.join(process.cwd(), pathToFile);
  const parsedPathToWriteFile = path.join(pathToNewDirectory, path.parse(pathToFile).base);

  const readableStream = createReadStream(parsedPathToFile);
  const writableStream = createWriteStream(parsedPathToWriteFile);

  await pipeline(readableStream, writableStream);
  await fs.unlink(parsedPathToFile);
}

const rm = async pathToFile => await fs.unlink(pathToFile);

export default {
  cat,
  add,
  mkdir,
  rn,
  cp,
  move,
  rm,
}
