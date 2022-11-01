import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator/jest';
import { FileDropZoneDirective } from './file-drop-zone.directive';

describe.skip('FileDropZoneDirective ', () => {
  let spectator: SpectatorDirective<FileDropZoneDirective>;
  const createDirective = createDirectiveFactory(FileDropZoneDirective);

  it('should change create', () => {
    spectator = createDirective(`<div imFileDropZone>Testing FileDropZoneDirective</div>`);
    expect(spectator.directive).toBeTruthy();
  });
});
