import { Component } from '@angular/core';
import {NavController, ModalController, LoadingController, AlertController} from 'ionic-angular';
import {DataStoreService} from "../../providers/data-store.service";
import {QuestionPage} from "../question/question.page";
import {HttpCallerService} from "../../providers/http-caller.service";
import {AppMenu} from "../../components/menu/menu";
import {HomePage} from "../home/home.page";

@Component({
  templateUrl: 'build/pages/quest/quest.page.html',
  providers: [ModalController, AlertController]
})
export class QuestPage {

  // initial values
  private number_of_questions: number;
  private chapter_index: number;
  private isCumulative: boolean;
  private isTimed: boolean;
  private questionType: number;

  private userName: string;

  private quest_options;

  private loading;

  constructor(
    private dataService:DataStoreService,
    private httpCaller: HttpCallerService,
    private nav:NavController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // console.log('Initializing quest component');

    this.initVariables();
    this.syncDataService();

    this.loading = this.loadingController.create({
      content: "Please wait..."
    });

  }

  // -----------------------------------------------------------
  // BUTTON ACTIONS
  // -----------------------------------------------------------

  showMenu() {
    let menu = this.modalController.create(AppMenu);
    menu.present();
  }

  submitQuest() {
    this.loading.present();

    this.httpCaller.startQuest(
      Number(this.chapter_index),
      Number(this.number_of_questions),
      Boolean(this.isTimed),
      Boolean(this.isCumulative),
      Number(this.questionType),
      false
    )
      .subscribe(
        () => {
          // console.log('I am going to navigate to question now.');
          this.loading.dismiss()
            .then( () => this.nav.setRoot(QuestionPage) )
        },
        (error) => {
          this.loading.dismiss()
            .then(
              () => this.showErrorAlert(error)
            );
        }
      );
  }

  toggleCumulative() {
    this.isCumulative = !this.isCumulative;
  }

  toggleTimed(){
    this.isTimed = !this.isTimed;
  }

  initVariables() {
    this.number_of_questions = 25;
    this.chapter_index = 1;
    this.isCumulative = false;
    this.isTimed = false;
    this.questionType = 2;
  }

  syncDataService() {
    this.quest_options = this.dataService.getQuestOptions();
    this.userName = this.dataService.getUserName();
  }

  showErrorAlert(message) {
    let alert = this.alertController.create({
      title: 'Error',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss()
              .then(
                () => this.nav.setRoot(HomePage)
              );
          }
        }
      ]
    });
    alert.present();
  }

}
