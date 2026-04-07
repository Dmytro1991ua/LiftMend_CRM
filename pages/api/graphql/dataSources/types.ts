export type GraphQLUploadFile = {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
};
