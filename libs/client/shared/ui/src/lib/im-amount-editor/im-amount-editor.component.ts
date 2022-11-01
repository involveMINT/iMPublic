import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';

export type ImAmountEditorColor = 'green' | 'orange' | 'purple';

interface ColorInput {
  color?: ImAmountEditorColor;
}

interface Transactional extends ColorInput {
  mode: 'transaction';
  amount: number;
  remainingBalance: number;
}

interface PricePicker extends ColorInput {
  mode: 'pricePicker';
  amount: number;
}

interface BudgetSetter extends ColorInput {
  mode: 'budgetSetter';
  amount: number;
}

export type ImAmountEditorModalInput = Transactional | PricePicker | BudgetSetter;

interface State {
  mode: ImAmountEditorModalInput['mode'];
  amount: number;
  remainingBalance: number;
  afterAmount: number;
  overspendOrZero: boolean;
}

@Component({
  selector: 'im-amount-editor',
  templateUrl: './im-amount-editor.component.html',
  styleUrls: ['./im-amount-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImAmountEditorComponent extends StatefulComponent<State> implements OnChanges, OnInit {
  @Input() mode: ImAmountEditorModalInput['mode'] = 'pricePicker';
  @Input() amount = 0;
  @Input() remainingBalance = 0;
  @Input() color?: ColorInput['color'];

  @Output() action = new EventEmitter<number | undefined>();

  readonly maxCreditTransactionAmount = ImConfig.maxCreditTransactionAmount;

  constructor() {
    super({
      mode: 'pricePicker',
      remainingBalance: 0,
      amount: 0,
      afterAmount: 0,
      overspendOrZero: true,
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.updateState({
      mode: this.mode,
      amount: this.amount ?? 0,
      remainingBalance: this.remainingBalance ?? 0,
      afterAmount: this.remainingBalance ?? 0,
    });
    this.checkDisable();
  }

  setVal(val: string): void {
    const amount = Number(`${this.state.amount}${val}`); // add least significant digit
    if (amount > this.maxCreditTransactionAmount) return;
    this.updateState({
      afterAmount: this.state.remainingBalance - amount,
      amount,
    });
    this.checkDisable();
  }

  delete(): void {
    const amount = Math.floor(this.state.amount / 10); // remove least significant digit
    this.updateState({
      afterAmount: this.state.remainingBalance - amount,
      amount,
    });
    this.checkDisable();
  }

  checkDisable() {
    switch (this.state.mode) {
      case 'transaction':
        this.updateState({
          overspendOrZero: this.state.remainingBalance - this.state.amount < 0 || this.state.amount <= 0,
        });
        break;
      case 'pricePicker':
        this.updateState({ overspendOrZero: this.state.amount <= 0 });
        break;
    }
  }
}
