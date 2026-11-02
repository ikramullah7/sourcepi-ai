const { TestEnvironment } = require('jest-environment-jsdom');
const { TextDecoder, TextEncoder } = require('node:util');
const {
  ReadableStream,
  TransformStream,
  WritableStream,
} = require('node:stream/web');

class FrontendTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    // Use Node's Web API constructors from outside Jest's jsdom sandbox.
    Object.assign(this.global, {
      Request,
      Response,
      Headers,
      AbortController,
      AbortSignal,
      TextDecoder,
      TextEncoder,
      ReadableStream,
      TransformStream,
      WritableStream,
    });

    // Preserve jsdom Blob/File interoperability with FileReader and FormData.
    const FileReader = this.global.FileReader;
    if (!this.global.Blob.prototype.arrayBuffer) {
      this.global.Blob.prototype.arrayBuffer = function () {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(this);
        });
      };
    }
  }
}

module.exports = FrontendTestEnvironment;
