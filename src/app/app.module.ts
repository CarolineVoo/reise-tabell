import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';
import { ToggleComponent } from './shared/components/toggle/toggle.component';
import { SelectComponent } from './shared/components/select/select.component';
// import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';
// import { DestinationTableComponent } from './destination-overview/destination-table/destination-table.component';
// import { DestinationsService } from './services/destinations.service';
// import { DestinationTableInfoComponent } from './destination-overview/destination-table-info/destination-table-info.component';
// import { SettingsComponent } from './destination-overview/settings/settings.component';
// import { ToggleComponent } from './shared/components/toggle/toggle.component';
// import { SelectComponent } from './shared/components/select/select.component';

@NgModule({
  declarations: [
    AppComponent,
    DestinationOverviewComponent,
    ToggleComponent,
    SelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent,]
})
export class AppModule { }
