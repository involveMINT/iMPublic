/**
 * Extracts a file from a file input event.
 */
export function parseOneFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;
  if (files.length > 1) throw new Error('Can only upload 1 file at a time.');

  const file = files.item(0);
  if (!file) throw new Error('File not found.');

  return file;
}
/**
 * Extracts a file from a file input event.
 * If the file is not an image, throw error.
 */
export function parseOneImageFile(event: Event) {
  const file = parseOneFile(event);

  if (!file) return;
  if (!file.type.match(/image\/*/)) throw new Error('File must be an image.');

  return file;
}

/**
 * Extracts multiple files from a file input event.
 */
export function parseMultipleFiles(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return [];

  const cpyFiles: File[] = [];
  for (let i = 0; i < files.length; i++) {
    const item = files.item(i);
    if (item) cpyFiles.push(item);
  }
  return cpyFiles;
}

/**
 * Extracts multiple image files from a file input event.
 * If any files are not images, throw error.
 */
export function parseMultipleImageFiles(event: Event) {
  const files = parseMultipleFiles(event);

  for (const file of files) if (!file.type.match(/image\/*/)) throw new Error('Files must be images.');

  return files;
}
