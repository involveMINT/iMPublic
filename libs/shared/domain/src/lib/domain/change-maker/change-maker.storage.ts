export interface ChangeMakerProfileImageFilePathParts {
  root: string;
  /** Is the CM Id. Includes extension. */
  filename: string;
}

export function generateChangeMakerProfileImageFilePath({
  root,
  filename,
}: ChangeMakerProfileImageFilePathParts) {
  return `${root}/${filename}`;
}

export function parseChangeMakerProfileImageFilePath(path: string): ChangeMakerProfileImageFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    filename: parts[1],
  };
}
