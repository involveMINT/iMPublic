export interface RequestImageFilePathParts {
  root: string;
  requestId: string;
  /** Includes extension. */
  filename: string;
}

export function generateRequestImageFilePath({ root, requestId, filename }: RequestImageFilePathParts) {
  return `${root}/${requestId}/${filename}`;
}

export function parseRequestImageFilePath(path: string): RequestImageFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    requestId: parts[1],
    filename: parts[2],
  };
}
