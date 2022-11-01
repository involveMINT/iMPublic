export interface ExchangePartnerLogoFilePathParts {
  root: string;
  /** Is the EP Id. Includes extension. */
  filename: string;
}

export interface ExchangePartnerImageFilePathParts {
  root: string;
  epId: string;
  filename: string;
}

export function generateExchangePartnerLogoFilePath({ root, filename }: ExchangePartnerLogoFilePathParts) {
  return `${root}/${filename}`;
}

export function parseExchangePartnerLogoFilePath(path: string): ExchangePartnerLogoFilePathParts {
  const parts = path.split('/');
  return {
    root: parts[0],
    filename: parts[1],
  };
}

export function generateExchangePartnerImageFilePath({
  root,
  epId,
  filename,
}: ExchangePartnerImageFilePathParts) {
  return `${root}/${epId}/${filename}`;
}
