import path from 'path';
const rootPath = __dirname;

const config = {
  rootPath,
  db: 'mongodb://localhost/todoList',
  publicPath: path.join(rootPath, 'public'),
};

export default config;
