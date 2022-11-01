import { IonicModule, ModalController } from '@ionic/angular';
import { createHostFactory, Spectator } from '@ngneat/spectator/jest';
import { ImAmountEditorComponent } from './im-amount-editor.component';

describe.skip('ImAmountEditorComponent', () => {
  let spectator: Spectator<ImAmountEditorComponent>;
  const createHostComponent = createHostFactory({
    component: ImAmountEditorComponent,
    imports: [IonicModule],
    providers: [ModalController],
  });

  it('should create', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    expect(spectator.component).toBeTruthy();
  });

  it('should default to zero starting amount', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    expect(spectator.query('.sending')).toHaveText('0.00');
  });

  it('should show starting amount', () => {
    spectator = createHostComponent(`<im-amount-editor [amount]="1"></im-amount-editor>`);
    expect(spectator.query('.sending')).toHaveText('0.01');

    spectator.component.amount = 10;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.10');

    spectator.component.amount = 39249;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('392.49');
  });

  it('should expect 1 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[0]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.01');
  });

  it('should expect 2 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[1]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.02');
  });

  it('should expect 3 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[2]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.03');
  });

  it('should expect 4 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[3]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.04');
  });

  it('should expect 5 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[4]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.05');
  });

  it('should expect 6 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[5]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.06');
  });

  it('should expect 7 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[6]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.07');
  });

  it('should expect 8 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[7]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.08');
  });

  it('should expect 9 button to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[8]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.09');
  });

  it('should expect 0 button and backspace to work', () => {
    spectator = createHostComponent(`<im-amount-editor></im-amount-editor>`);
    const buttons = spectator.queryAll('.number-pad ion-button');

    spectator.click(buttons[1]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.02');

    spectator.click(buttons[10]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.20');

    spectator.click(buttons[11]);
    spectator.detectComponentChanges();
    expect(spectator.query('.sending')).toHaveText('0.02');
  });

  it('should expect transaction mode to work', () => {
    spectator = createHostComponent(
      `<im-amount-editor [mode]="'transaction'" [remainingBalance]="0"></im-amount-editor>`
    );
    let buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeTruthy();

    spectator.component.remainingBalance = 10;
    spectator.component.amount = 0;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeTruthy();

    spectator.component.remainingBalance = 10;
    spectator.component.amount = 9;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeFalsy();

    spectator.component.remainingBalance = 10;
    spectator.component.amount = 9;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeFalsy();

    spectator.component.remainingBalance = 10;
    spectator.component.amount = 10;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeFalsy();

    spectator.component.remainingBalance = 10;
    spectator.component.amount = 11;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    buttons = spectator.queryAll('.buttons ion-button') as HTMLButtonElement[];
    expect(buttons[1].disabled).toBeTruthy();
  });
});
