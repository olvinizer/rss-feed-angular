import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login.component';
import {FeedComponent} from './components/feed.component';
import {RegisterComponent} from './components/register.component';
import {HttpClientModule} from '@angular/common/http';
import {fakeBackendProvider} from './helpers/backend';
import {ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from './components/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
