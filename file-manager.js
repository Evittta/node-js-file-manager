import { createInterface } from 'readline';
import Archivation from './helpers/archivation.js';
import Navigation from './helpers/navigation.js';
import FileOperations from './helpers/file-operations.js';
import { operatingSystem as OperatingSystem } from './helpers/operating-system.js';
import { hash as HashCalculation } from './helpers/hash-calculation.js';
import { username, exitHandler, printWorkingDirectory, printInvalidInputMsg } from './utils/utils.js';

console.log(`Welcome to the File Manager, ${username}!`);
printWorkingDirectory();

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
    const [ command, ...args ] = input.split(' ');
    const [ firstArg, secondArg ] = args;

    switch (command) {
      case 'up':
        Navigation.up()
        break;

      case 'cd':
        firstArg ? Navigation.cd(firstArg) : printInvalidInputMsg();
        break;

      case 'ls':
        await Navigation.ls();
        break;

      case 'cat':
        firstArg ? FileOperations.cat(firstArg) : printInvalidInputMsg();
        break;

      case 'add':
        firstArg ? FileOperations.add(firstArg) : printInvalidInputMsg();
        break;
      
      case 'mkdir':
        firstArg ? FileOperations.mkdir(firstArg) : printInvalidInputMsg();
        break;

      case 'rn':
        firstArg && secondArg ? FileOperations.rn(firstArg, secondArg) : printInvalidInputMsg();
        break;

      case 'cp':
        firstArg && secondArg ? FileOperations.cp(firstArg, secondArg) : printInvalidInputMsg();
        break;

      case 'move':
        firstArg && secondArg ? FileOperations.move(firstArg, secondArg) : printInvalidInputMsg();     
        break;

      case 'rm':
        firstArg ? FileOperations.rm(firstArg) : printInvalidInputMsg();
        break;

      case 'os':
        firstArg ? OperatingSystem(firstArg) : printInvalidInputMsg();
        break;
      
      case 'hash':
        firstArg ? HashCalculation(firstArg) : printInvalidInputMsg();
        break;

      case 'compress':
        firstArg && secondArg ? Archivation.compress(firstArg, secondArg) : printInvalidInputMsg();
        break;

      case 'decompress':
        firstArg && secondArg ? Archivation.decompress(firstArg, secondArg) : printInvalidInputMsg();
        break;

      default:
        printInvalidInputMsg();
    }

  } catch {
    console.log('Operation failed');
  }

  printWorkingDirectory();
  rl.setPrompt('Enter your command: ');
  rl.prompt();
});

rl.on('SIGINT', exitHandler);
