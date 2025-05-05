import { EOL, cpus, userInfo, homedir } from 'os';
import { printInvalidInputMsg } from '../utils/utils.js';

export const operatingSystem = command => {
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

    default:
      printInvalidInputMsg();
  }
}
