// Converts a readable stream into a Buffer by accumulating data chunks.
export const convertStreamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      // Convert each Buffer to a Uint8Array using its underlying ArrayBuffer
      const uint8Chunks = chunks.map((chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));

      resolve(Buffer.concat(uint8Chunks));
    });
  });
};
