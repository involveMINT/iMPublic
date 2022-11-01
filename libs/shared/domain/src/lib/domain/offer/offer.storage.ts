export interface OfferImageFilePathParts {
  root: string;
  offerId: string;
  /** Includes extension. */
  filename: string;
}

export function generateOfferImageFilePath({ root, offerId, filename }: OfferImageFilePathParts) {
  return `${root}/${offerId}/${filename}`;
}

export function parseOfferImageFilePath(path: string): OfferImageFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    offerId: parts[1],
    filename: parts[2],
  };
}
