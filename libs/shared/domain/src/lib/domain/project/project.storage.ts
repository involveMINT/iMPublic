export interface ProjectImageFilePathParts {
  root: string;
  projectId: string;
  /** Includes extension. */
  filename: string;
}

export function generateProjectImageFilePath({ root, projectId, filename }: ProjectImageFilePathParts) {
  return `${root}/${projectId}/${filename}`;
}

export function parseProjectImageFilePath(path: string): ProjectImageFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    projectId: parts[1],
    filename: parts[2],
  };
}

export interface ProjectCustomWaiverPathParts {
  root: string;
  projectId: string;
  /** Includes extension. */
  filename: string;
}

export function generateProjectCustomWaiverFilePath({
  root,
  projectId,
  filename,
}: ProjectCustomWaiverPathParts) {
  return `${root}/${projectId}/${filename}`;
}

export function parseProjectCustomWaiverFilePath(path: string): ProjectCustomWaiverPathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    projectId: parts[1],
    filename: parts[2],
  };
}
