import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {HttpCallerService} from "../../providers/http-caller.service";
import {AuthService} from "../../providers/auth.service";
import {ClassCodePage} from "../class-code/class-code.page";
import {HomePage} from "../home/home.page";
import {Subscription} from "rxjs";

@Component({
  templateUrl: 'build/pages/loading/loading.page.html'
})
export class LoadingPage implements OnInit, OnDestroy{

  private lockStatus: Subscription;

  constructor(
      private nav: NavController,
      private httpCaller: HttpCallerService,
      private auth: AuthService
  ) {

  }

  ngOnInit() {
    if (!this.auth.authenticated()){
      // console.log('JWT not found, loading lock');
      this.auth.showLock();
      this.syncLock()
    } else {
      // console.log('user already has token, skipping lock');
      this.initializeValues();
    }
  };

  ngOnDestroy() {
    if (this.lockStatus) {
      this.lockStatus.unsubscribe();
    }

  }

  syncLock() {
    this.lockStatus = this.auth.getLockStatus()
        .subscribe(
            (authResult) => {
              // console.log('lock has been manually authenticated');
              this.auth.hideLock();
              this.auth.setToken(authResult);
              this.initializeValues();
            }
        )
  };

  initializeValues() {
    // console.log('attempting to init values');
    this.httpCaller.initStatusOnLogin()
        .subscribe(
            () => {
              this.nav.setRoot(HomePage);
              // console.log('going home');
            },
            (error) => this.askForClassCode()
        );
  };

  askForClassCode() {
    this.nav.push(ClassCodePage)
  }

}
