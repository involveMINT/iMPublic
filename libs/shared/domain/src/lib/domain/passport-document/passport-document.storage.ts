export interface PassportDocumentFilePathParts {
  root: string;
  cmId: string;
  /** Includes extension. */
  filename: string;
}

export function generatePassportDocumentFilePath({ root, cmId, filename }: PassportDocumentFilePathParts) {
  return `${root}/${cmId}/${filename}`;
}

export function parsePassportDocumentFilePath(path: string): PassportDocumentFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    cmId: parts[1],
    filename: parts[2],
  };
}
