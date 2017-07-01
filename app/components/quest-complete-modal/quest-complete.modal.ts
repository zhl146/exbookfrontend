import {Component, OnInit} from '@angular/core';
import {NavController} from "ionic-angular/index";
import {DataStoreService} from "../../providers/data-store.service";
import {HomePage} from "../../pages/home/home.page";

@Component({
  selector: 'quest-complete-modal',
  templateUrl: 'build/components/quest-complete-modal/quest-complete.modal.html'
})
export class QuestCompleteModal implements OnInit{

  private user_performance;

  constructor(
    private dataService: DataStoreService,
    private nav: NavController
  ) {}

  ngOnInit(){
    this.user_performance = this.dataService.getUserPerformance();
  }

  goHome(){
    this.nav.setRoot(HomePage)
  }

}
