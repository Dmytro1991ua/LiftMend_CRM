import fs from 'fs';
import path from 'path';

import { mergeTypeDefs } from '@graphql-tools/merge';

const SCHEMAS_FOLDER_PATH = 'pages/api/graphql/schemas';
const FILE_EXTENSION = /\.graphql$/;
// Priority schema files to load first
const PRIORITY_SCHEMAS = ['query.graphql', 'mutation.graphql'];

// Reads schema file content if it exists
const readSchemaFile = (filePath: string): string | null => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  return null;
};

const generateMergedTypeDefs = () => {
  // Resolve the correct path using process.cwd() for reliability
  const folderPath = path.join(process.cwd(), SCHEMAS_FOLDER_PATH);

  // Combine priority schemas and other GraphQL files from the folder
  const allSchemas = [...PRIORITY_SCHEMAS, ...fs.readdirSync(folderPath)];

  const schemaFiles = allSchemas.reduce((acc, file) => {
    // Only process files that match .graphql extension or are in PRIORITY_SCHEMAS
    if (FILE_EXTENSION.test(file) || PRIORITY_SCHEMAS.includes(file)) {
      const content = readSchemaFile(path.join(folderPath, file));

      if (content) acc.add(content);
    }

    return acc;
  }, new Set<string>());

  return mergeTypeDefs(Array.from(schemaFiles));
};

export default generateMergedTypeDefs();
