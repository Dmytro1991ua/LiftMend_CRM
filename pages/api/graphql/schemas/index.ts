import path from 'path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

import './schemas/query.graphql';
import './schemas/mutation.graphql';
import './schemas/calendarEvent.graphql';
import './schemas/elevatorRecord.graphql';
import './schemas/pagination.graphql';
import './schemas/repairJob.graphql';
import './schemas/scalar.graphql';
import './schemas/technicianRecord.graphql';
import './schemas/user.graphql';
import './schemas/dashboard.graphql';

const SCHEMAS_FOLDER_PATH = 'pages/api/graphql/schemas';
const FILE_EXTENSION = '**/*.graphql';

const generateMergedTypeDefs = () => {
  const folderPath = path.join(process.cwd(), SCHEMAS_FOLDER_PATH);

  const schemaFiles = loadFilesSync(path.join(folderPath, FILE_EXTENSION));

  return mergeTypeDefs(schemaFiles);
};

export default generateMergedTypeDefs();
