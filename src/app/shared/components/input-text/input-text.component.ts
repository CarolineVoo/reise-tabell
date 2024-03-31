import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {
  @ViewChild('inputText') inputText: ElementRef;
  
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string;
  @Input() label: string;
  @Input() placeholder: string;

  public showClearIcon: boolean;

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
