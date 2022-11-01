export interface PoiImageFilePathParts {
  root: string;
  poiId: string;
  filename: string;
}

export function generatePoiImageFilePath({ root, poiId, filename }: PoiImageFilePathParts) {
  return `${root}/${poiId}/${filename}`;
}

export function parsePoiImageFilePath(path: string): PoiImageFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    poiId: parts[1],
    filename: parts[2],
  };
}
