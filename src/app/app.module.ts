import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    //TODO: remove apiKey
    AgmCoreModule.forRoot({
      apiKey: 'YOUR KEY',
      libraries: ['places', 'drawing', 'geometry'],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
