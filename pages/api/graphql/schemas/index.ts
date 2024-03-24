import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';

const SCHEMAS_FOLDER_PATH = 'pages/api/graphql/schemas';
const FILE_EXTENSION = '**/*.graphql';

const generateMergedTypeDefs = () => {
  const folderPath = path.join(process.cwd(), SCHEMAS_FOLDER_PATH);

  const schemaFiles = loadFilesSync(path.join(folderPath, FILE_EXTENSION));

  return mergeTypeDefs(schemaFiles);
};

export default generateMergedTypeDefs();
