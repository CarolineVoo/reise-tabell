import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { Location } from '@angular/common';
import { AppComponent } from './app.component';
import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';
import { SettingsComponent } from './destination-overview/settings/settings.component';
import { DestinationTableDetailsComponent } from './destination-overview/destination-table-details/destination-table-details.component';
import { DestinationTableInfoComponent } from './destination-overview/destination-table-info/destination-table-info.component';
import { DestinationsService } from './services/destinations.service';
import { SettingsService } from './services/settings.service';
import { ToggleComponent } from './shared/components/toggle/toggle.component';
import { SelectComponent } from './shared/components/select/select.component';


@NgModule({
  declarations: [
    AppComponent,
    DestinationOverviewComponent,
    SettingsComponent,
    DestinationTableDetailsComponent,
    DestinationTableInfoComponent,
    ToggleComponent,
    SelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [DestinationsService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
