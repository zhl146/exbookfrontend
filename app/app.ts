import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {DataStoreService} from './providers/data-store.service';
import {HttpCallerService} from './providers/http-caller.service';
import {HttpWrapperService} from './providers/http-wrapper.service';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './providers/auth.service';
import {OptionService} from './providers/option.service';
import {LoadingPage} from './pages/loading/loading.page';

@Component({
  templateUrl: 'build/app.html'
})
export class AppCore {
  @ViewChild(Nav) nav: Nav;
  private rootPage: any;

  constructor(
    private platform: Platform,
    private auth: AuthService
  ) {
    this.rootPage = LoadingPage;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      // When the app starts up, there might be a valid
      // token in local storage. If there is, we should
      // schedule an initial token refresh for when the
      // token expires
      this.auth.startupTokenRefresh();
      this.hideSplashScreen();
    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }

}


ionicBootstrap(AppCore, [
  OptionService,
  DataStoreService,
  HttpCallerService,
  HttpWrapperService,
  AuthService,
  AuthHttp,
  { provide: AuthConfig, useValue:  new AuthConfig() }
]);

