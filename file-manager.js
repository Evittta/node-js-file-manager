import { promises as fs, createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { EOL, cpus, userInfo, homedir } from 'os';
import { finished, pipeline } from 'stream/promises'
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Username';

const exitHandler = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);

  process.exit(0);
}

const printCWD = () => console.log(`You are currently in ${process.cwd()}`);

const goUp = () => process.chdir('..');

const changeDirectory = pathToDirectory => process.chdir(pathToDirectory);

const showFolderContentList = async () => {
  const list = await fs.readdir(__dirname, { withFileTypes: true });
  const types = {
    directory: 'directory',
    file: 'file',
  };

  const formattedList = list.map(el => ({ Name: el.name, Type: el.isDirectory() ? types.directory : types.file }))
    .sort((a, b) => {
      if (a.Type !== b.Type) {
        return a.Type === types.directory ? -1 : 1;
      }

      return a.Name.localeCompare(b.Name);
    });

  console.table(formattedList);
}

const cat = async pathToFile => {
  const stream = createReadStream(pathToFile, 'utf-8');

  stream.on('data', chunk => console.log(chunk));

  await finished(stream);
}

const add = async fileName => {  
  const pathToFile = path.join(__dirname, fileName);
  
  await fs.writeFile(pathToFile, '');
}

const mkdir = async directoryName => {  
  const pathToFolder = path.join(__dirname, directoryName);
  
  await fs.mkdir(pathToFolder);
}

const rn = async (pathToFile, newFileName) => await fs.rename(pathToFile, newFileName);

const cp = async (pathToFile, pathToNewDirectory) => {
  const parsedPathToFile = path.isAbsolute(pathToFile) ? pathToFile : path.join(__dirname, pathToFile);
  const parsedPathToWriteFile = path.join(pathToNewDirectory, path.parse(pathToFile).base);

  const readableStream = createReadStream(parsedPathToFile);
  const writableStream = createWriteStream(parsedPathToWriteFile);

  await pipeline(readableStream, writableStream);
}

const move = async (pathToFile, pathToNewDirectory) => {
  const parsedPathToFile = path.isAbsolute(pathToFile) ? pathToFile : path.join(__dirname, pathToFile);
  const parsedPathToWriteFile = path.join(pathToNewDirectory, path.parse(pathToFile).base);

  const readableStream = createReadStream(parsedPathToFile);
  const writableStream = createWriteStream(parsedPathToWriteFile);

  await pipeline(readableStream, writableStream);
  await fs.unlink(parsedPathToFile);
}

const osLibrary = command => {
  switch (command) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;

    case '--cpus':
      const cpusData = cpus();

      console.log(`Overall amount of CPUS ${cpusData.length}`);

      cpusData.forEach(({ model, speed }) => console.log(`${model} - ${speed / 1000}GHz`));
      break;

    case '--homedir':
      console.log(homedir());
      break;

    case '--username':
      console.log(userInfo().username);
      break;

    case '--architecture':
      console.log(process.arch);
      break;
  }
}

const rm = async pathToFile => await fs.unlink(pathToFile);

const hash = async pathToFile => {
  const filePath = path.isAbsolute(pathToFile) ? pathToFile : path.join(__dirname, pathToFile);

  const hash = createHash('sha256');
  const stream = createReadStream(filePath);

  stream.on('data', chunk => hash.update(chunk));

  stream.on('end', () => console.log(hash.digest('hex')));

  await finished(stream);
}

const compress = async (pathToFile, pathToDestination) => {
  const readableStream = createReadStream(pathToFile);
  const writableStream = createWriteStream(pathToDestination);
  const compressStream = createBrotliCompress();  
  
  const stream = readableStream.pipe(compressStream).pipe(writableStream);

  await finished(stream);
}

const decompress = async (pathToFile, pathToDestination) => {
  const readableStream = createReadStream(pathToFile);
  const writableStream = createWriteStream(pathToDestination);
  const decompressStream = createBrotliDecompress();  
  
  const stream = readableStream.pipe(decompressStream).pipe(writableStream);

  await finished(stream);
}

console.log(`Welcome to the File Manager, ${username}!`);
printCWD();

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.setPrompt('Enter your command:');
rl.prompt();

rl.on('line', async line => {
  const input = line.trim();

  if (input === '.exit') {
    exitHandler();

    return;
  }

  try {
    const [command, ...args] = input.split(' ');

    switch (command) {
      case 'up':
        goUp();
        break;

      case 'cd':
        if (!args[0]) {
          console.log('Invalid input');
        } else {
          changeDirectory(args[0])
        }
        break;

      case 'ls':
        await showFolderContentList();
        break;

      case 'cat':
        if (!args[0]) {
          console.log('Invalid input');
        } else {
          await cat(args[0])
        }
        break;

      case 'add':
        if (!args[0]) {
          console.log('Invalid input');
        } else {
          await add(args[0])
        }
        break;
      
      case 'mkdir':
        !args[0] ? console.log('Invalid input') : await mkdir(args[0])
        break;

      case 'rn':
        !args[0] || !args[1] ? console.log('Invalid input') : await rn(args[0], args[1])
        break;

      case 'cp':
        !args[0] || !args[1] ? console.log('Invalid input') : await cp(args[0], args[1])
        break;

      case 'move':
        !args[0] || !args[1] ? console.log('Invalid input') : await move(args[0], args[1])
        break;

      case 'rm':
        !args[0] ? console.log('Invalid input') : await rm(args[0])
        break;

      case 'os':
        !args[0] ? console.log('Invalid input') : osLibrary(args[0])
        break;
      
      case 'hash':
        !args[0] ? console.log('Invalid input') : await hash(args[0])
        break;

      case 'compress':
        !args[0] || !args[1] ? console.log('Invalid input') : await compress(args[0], args[1])
        break;

      case 'decompress':
        !args[0] || !args[1] ? console.log('Invalid input') : await decompress(args[0], args[1])
        break;

      default:
        console.log('Invalid input');
    }
  } catch {
    console.log('Operation failed');
  }

  printCWD();
  rl.setPrompt('Enter your command: ');
  rl.prompt();
});

rl.on('SIGINT', exitHandler);
