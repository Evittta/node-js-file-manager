import { promises as fs } from 'fs';

const up = () => process.chdir('..');

const cd = pathToDirectory => process.chdir(pathToDirectory);

const ls = async () => {
  const list = await fs.readdir(process.cwd(), { withFileTypes: true });
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

export default {
  up,
  cd,
  ls
}
