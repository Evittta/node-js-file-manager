import { createInterface } from 'readline';
import Archiving from './helpers/archiving.js';
import Navigation from './helpers/navigation.js';
import FileOperations from './helpers/file-operations.js';
import { operatingSystem as OperatingSystem } from './helpers/operating-system.js';
import { hash as HashCalculation } from './helpers/hash-calculation.js';
import { username, exitHandler, printWorkingDirectory, printInvalidInputMsg } from './utils/utils.js';

console.log(`Welcome to the File Manager, ${username}!`);
printWorkingDirectory();

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.setPrompt('Enter your command: ');
rl.prompt();

rl.on('line', async line => {
  const input = line.trim();

  if (input === '.exit') {
    exitHandler();

    return;
  }

  try {
    const [ command, ...params ] = input.split(' ');
    const [ firstArg, secondArg ] = params;

    const commandMap = new Map([
      [ 'up', () => Navigation.up() ],
      [ 'cd', () => Navigation.cd(firstArg) ],
      [ 'ls', async () => await Navigation.ls() ],
      [ 'cat', async () => await FileOperations.cat(firstArg) ],
      [ 'add', async () => await FileOperations.add(firstArg) ],
      [ 'mkdir', async () => await FileOperations.mkdir(firstArg) ],
      [ 'rn', async () => await FileOperations.rn(firstArg, secondArg) ],
      [ 'cp', async () => await FileOperations.cp(firstArg, secondArg) ],
      [ 'move', async () => await FileOperations.move(firstArg, secondArg) ],
      [ 'rm', async () => await FileOperations.rm(firstArg) ],
      [ 'os', () => OperatingSystem(firstArg) ],
      [ 'hash', async () => await HashCalculation(firstArg) ],
      [ 'compress', async () => await Archiving.compress(firstArg, secondArg) ],
      [ 'decompress', async () => await Archiving.decompress(firstArg, secondArg) ],
    ]);

    const requiresArgs = new Map([
      [ 'cd', [firstArg] ],
      [ 'cat', [firstArg] ],
      [ 'add', [firstArg] ],
      [ 'mkdir', [firstArg] ],
      [ 'rn', [firstArg, secondArg] ],
      [ 'cp', [firstArg, secondArg] ],
      [ 'move', [firstArg, secondArg] ],
      [ 'rm', [firstArg] ],
      [ 'os', [firstArg] ],
      [ 'hash', [firstArg] ],
      [ 'compress', [firstArg, secondArg] ],
      [ 'decompress', [firstArg, secondArg] ],
    ]);
    

    const handler = commandMap.get(command);

    if (!handler) {
      printInvalidInputMsg();

      return;
    }

    const args = requiresArgs.get(command);
    const hasMissingArgs = args?.some(arg => !arg);

    if (hasMissingArgs) {
      printInvalidInputMsg();
    } else {
      await handler();
    }

  } catch {
    console.log('Operation failed');
  }

  printWorkingDirectory();
  rl.setPrompt('Enter your command: ');
  rl.prompt();
});

rl.on('SIGINT', exitHandler);
