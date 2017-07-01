import { Component } from '@angular/core';
import {ViewController, NavController, AlertController} from "ionic-angular";
import {DataStoreService} from "../../providers/data-store.service";

@Component({
  selector: 'profile-modal',
  templateUrl: 'build/components/rewards/rewards.html'
})
export class Rewards {

  private rewards;
  private points: number = 0;

  constructor(
    private viewController: ViewController,
    private nav: NavController,
    private dataService: DataStoreService,
    private alertController: AlertController
  ) {}

  ngOnInit(){
    this.rewards = this.dataService.getAvailableRewards();
    this.points = this.dataService.getUserPoints();
  }

  dismiss() {
    this.viewController.dismiss();
  }

  openDetailAlert(name, detail){
    let alert = this.alertController.create({
      title: name,
      message: detail,
      buttons: ['OK']
    });
    alert.present();
  }


}
