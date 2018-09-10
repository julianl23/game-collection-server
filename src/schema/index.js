import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import resolvers from './resolvers';

const rootPath = path.resolve(__dirname, '../../');

const typeDefs = glob.sync(`${rootPath}/**/*.gql`).map(filePath => {
  return fs.readFileSync(path.resolve(rootPath, filePath)).toString();
});

export { typeDefs, resolvers };
