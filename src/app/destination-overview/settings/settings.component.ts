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
  public destinationSearchList: Array<string>;

  @Input() set settings(value: string) {
    if(!value) {
      return;
    }
    this.settingsModel = JSON.parse(value);
    this.addDestinationSearchList(this.settingsModel.destination);
  }
  get settings(): SettingsModel {
    return this.settingsModel;
  }

  @Input() enabled: boolean;

  constructor(
    public settingsService: SettingsService,
    private renderer: Renderer2
  ) {}

  onChangeDestination(value: string, index: number): void { 
    this.destinationSearchList[index] = value;
  }

  trackByIndex(index: number, item: any) {
    return index;
}

  onClickSearchDestinations() {
    this.settings.destination = this.destinationSearchList.toString();
    sessionStorage.setItem("settingsDate", JSON.stringify(this.settings));
    this.settingsService.updateQueryString(this.settings);
    location.reload();
  }

  onChangeDirection(value: boolean): void {
    this.settings.direction = value;
    this.setSettings();
  }

  onChangeMergeRoutes(value: boolean): void {
    this.settings.mergeRoutes = value;
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

  onChangeEnableTbane(value: boolean): void {
    this.settings.enableTbane = value;
    this.setSettings();
  }

  onChangeEnableBuss(value: boolean): void {
    this.settings.enableBuss = value;
    this.setSettings();
  }

  onChangeEnableTrikk(value: boolean): void {
    this.settings.enableTrikk = value;
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

  private addDestinationSearchList(destinations: string): void {
    this.destinationSearchList = destinations.split(",");
  }

  public appendMoreInputs(): void {
    this.destinationSearchList.push('');
  }

  public removeInputs(index: number): void {
    this.destinationSearchList.splice(index, 1); 
  }
}
