import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {
  @ViewChild('inputText') inputText: ElementRef;
  @Input() label: string;
  @Input() placeholder: string;
  @Output() textChange = new EventEmitter<string>();
  @Input() set text (value: string | undefined) {
    if(!value) {
      return;
    }
    this.showClearIcon = true;
    this.textValue = value;
  }
  get text() {
    return this.textValue;
  }

  public showClearIcon: boolean;
  public textValue: string;

  public onChangeValue(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    this.showClearIcon = value !== '';
    this.textChange.emit(value);
  }

  public onClickClearText() {
      this.inputText.nativeElement.value = '';
      this.showClearIcon = false;
  }

}
