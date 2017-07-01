import { Component } from '@angular/core';
import {ViewController, NavController, AlertController} from 'ionic-angular/index';
import {HttpCallerService} from '../../providers/http-caller.service';
import {HomePage} from '../home/home.page';
import {LoadingPage} from "../loading/loading.page";
import {AuthService} from "../../providers/auth.service";

@Component({
  templateUrl: 'build/pages/class-code/class-code.page.html'
})
export class ClassCodePage {

  constructor(
    private viewCtrl: ViewController,
    private httpCaller: HttpCallerService,
    private nav: NavController,
    private alertController: AlertController,
    private auth: AuthService
  ) {}

  submitCode(class_code) {
    this.httpCaller.createAccount(class_code)
      .subscribe(() => {},
        (error) => this.showInvalidClassCodeAlert(),
        () => {
          this.viewCtrl.dismiss()
            .then( () =>
            this.nav.setRoot(HomePage)
          );
        }
      );
  };

  showInvalidClassCodeAlert() {
    let alert = this.alertController.create({
      title: 'Invalid Code',
      subTitle: 'You have entered an invalid class code, please try again or contact your professor.',
      buttons: ['OK']
    });
    alert.present();
  };

  close() {
    this.auth.logout();
    this.nav.setRoot(LoadingPage);
  };


}
