export interface ServePartnerLogoFilePathParts {
  root: string;
  /** Is the EP Id. Includes extension. */
  filename: string;
}

export interface ServePartnerImageFilePathParts {
  root: string;
  spId: string;
  filename: string;
}

export function generateServePartnerLogoFilePath({ root, filename }: ServePartnerLogoFilePathParts) {
  return `${root}/${filename}`;
}

export function parseServePartnerLogoFilePath(path: string): ServePartnerLogoFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    filename: parts[1],
  };
}

export function generateServePartnerImageFilePath({ root, spId, filename }: ServePartnerImageFilePathParts) {
  return `${root}/${spId}/${filename}`;
}
