import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { SettingsModel } from 'src/app/models/settings.model';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Output() settingsChange = new EventEmitter<string>();
  @Output() enabledOnChange = new EventEmitter<boolean>();
  @ViewChild('boxElement') boxElement: ElementRef;

  public settingsModel: SettingsModel;
  public detailsMode: boolean;
  public sortOptions = this.settingsService.sortOptions;

  @Input() set settings(value: string) {
    if(!value) {
      return;
    }
    this.settingsModel = JSON.parse(value);
  }
  get settings(): SettingsModel {
    return this.settingsModel;
  }

  @Input() enabled: boolean;

  constructor(
    public settingsService: SettingsService,
    private renderer: Renderer2
  ) {}

  onChangeDestination(value: string): void {
    this.settingsModel.destination = value;
  }

  onClickSearchDestinations() {
    this.settings.destination = this.settingsModel.destination;
    sessionStorage.setItem("settingsDate", JSON.stringify(this.settings));
    this.settingsService.updateQueryString(this.settings);
    location.reload();
  }

  onChangeDirection(value: boolean): void {
    this.settings.direction = value;
    this.setSettings();
  }

  onChangeDetailsMode(value: boolean): void {
    this.settings.detailsMode = value;
    this.setSettings();
  }

  onChangeSortSelect(option: string): void {
    this.settings.sort = option;
    this.setSettings();
  }

  onClickOutside() {
    if(this.boxElement) {
      this.renderer.setAttribute(this.boxElement.nativeElement, 'class', 'settings__box--close');
    }
    setTimeout( () => {
      this.enabledOnChange.emit(false);
    }, 1000)
  }

  private setSettings(): void {
    const settingsJSON = JSON.stringify(this.settings);
    sessionStorage.setItem("settingsDate", JSON.stringify(this.settings));
    this.settingsChange.emit(settingsJSON);
  }
}
