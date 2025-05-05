import { EOL, cpus, userInfo, homedir } from 'os';
import { printInvalidInputMsg } from '../utils/utils.js';

const osCommandMap = new Map([
  ['--EOL', () => console.log(JSON.stringify(EOL))],

  ['--cpus', () => {
    const cpusData = cpus();

    console.log(`Overall amount of CPUS ${cpusData.length}`);

    cpusData.forEach(({ model, speed }) =>
      console.log(`${model} - ${speed / 1000}GHz`)
    );
  }],

  ['--homedir', () => console.log(homedir())],

  ['--username', () => console.log(userInfo().username)],

  ['--architecture', () => console.log(process.arch)]
]);

export const operatingSystem = command => {
  const handler = osCommandMap.get(command);
  
  if (handler) {
    handler();

    return;
  }

  printInvalidInputMsg();
}
