import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OptionsModel } from 'src/app/models/options.model';

@Component({
  selector: 'select-box',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Output() selectChange = new EventEmitter<string>();
  @Input() select: string;
  @Input() options: Array<OptionsModel>;

  public onChangeSelect(option: string) {
    if(!option) {
      return;
    }
    this.selectChange.emit(option);
  }
}
