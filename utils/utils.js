const usernameArg = process.argv.find(arg => arg.startsWith('--username='));

export const username = usernameArg ? usernameArg.split('=')[1] : 'Username';

export const exitHandler = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);

  process.exit(0);
}

export const printWorkingDirectory = () => console.log(`You are currently in ${process.cwd()}`);

export const printInvalidInputMsg = () => console.log('Invalid input');
