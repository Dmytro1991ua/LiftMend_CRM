import fs from 'fs';
import path from 'path';

import { mergeTypeDefs } from '@graphql-tools/merge';

const SCHEMAS_FOLDER_PATH = path.join(process.cwd(), 'pages/api/graphql/schemas');
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
  // Combine priority schemas and other GraphQL files from the folder
  const allSchemas = [...PRIORITY_SCHEMAS, ...fs.readdirSync(SCHEMAS_FOLDER_PATH)];

  const schemaFiles = allSchemas.reduce((acc, file) => {
    // Only process files that match .graphql extension or are in PRIORITY_SCHEMAS
    if (FILE_EXTENSION.test(file) || PRIORITY_SCHEMAS.includes(file)) {
      const content = readSchemaFile(path.join(SCHEMAS_FOLDER_PATH, file));

      if (content) acc.add(content);
    }

    console.log('Schema folder path:', SCHEMAS_FOLDER_PATH);
    console.log('Files found:', fs.readdirSync(SCHEMAS_FOLDER_PATH));

    return acc;
  }, new Set<string>());

  return mergeTypeDefs(Array.from(schemaFiles));
};

export default generateMergedTypeDefs();
