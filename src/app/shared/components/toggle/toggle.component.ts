import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})

export class ToggleComponent implements OnInit {
  public cssModifier: string;

  @Input() toggle: boolean;
  @Output() toggleChange = new EventEmitter<boolean>();
  
  ngOnInit(): void {
    this.setCssModifier();
  }
  
  onToggle(): void {
    this.toggle = !this.toggle;
    this.toggleChange.emit(this.toggle);
    this.setCssModifier();
  }

  setCssModifier(): void {
    this.cssModifier = this.toggle ? 'on' : 'off';
  }

}
