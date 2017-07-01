import { Component } from '@angular/core';
import {ViewController, NavController, AlertController, ModalController} from "ionic-angular";
import {LoadingPage} from "../../pages/loading/loading.page";
import {AuthService} from "../../providers/auth.service";
import {Rewards} from "../rewards/rewards";
import {OptionsModal} from "../options/options.modal";

@Component({
  selector: 'menu-modal',
  templateUrl: 'build/components/menu/menu.html'
})
export class AppMenu {

  constructor(
    private viewController: ViewController,
    private auth: AuthService,
    private nav: NavController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  dismiss() {
    this.viewController.dismiss();
  }

  logOut() {
    this.showLogoutAlert();
  };

  showRewards() {
    let modal = this.modalController.create(Rewards);
    modal.present();
  }

  showOptions() {
    let modal = this.modalController.create(OptionsModal);
    modal.present();
  };

  showLogoutAlert() {
    let alert = this.alertController.create({
      title: 'Log Out',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // console.log('cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            alert.dismiss()
              .then(
                () => {
                  this.auth.logout();
                  this.nav.setRoot(LoadingPage);
                }
              );

          }
        }
      ]
    });
    alert.present();
  }

}