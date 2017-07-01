import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, ModalController, LoadingController} from 'ionic-angular';
import {DataStoreService} from '../../providers/data-store.service';
import {HttpCallerService} from '../../providers/http-caller.service';
import {QuestionPage} from '../question/question.page';
import {QuestPage} from '../quest/quest.page';
import {AppMenu} from "../../components/menu/menu";
import {ResearchAgreement} from "../../components/research-agreement/research-agreement";
import {Rewards} from "../../components/rewards/rewards";

@Component({
  templateUrl: 'build/pages/home/home.page.html'
})
export class HomePage implements OnInit {

  // -----------------------------------------------------------
  // VARIABLE DECLARATION
  // -----------------------------------------------------------

  // holds view data
  private daily_status;
  private user_info;

  // loading overlay component
  private loading;

  // -----------------------------------------------------------
  // CONSTRUCTOR
  // -----------------------------------------------------------

  constructor(
    private nav: NavController,
    private dataService: DataStoreService,
    private httpCaller: HttpCallerService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {}

  // -----------------------------------------------------------
  // COMPONENT LIFECYCLE
  // -----------------------------------------------------------

  ngOnInit() {
    console.log('home page is initializing');

    this.syncDataService();
    if (this.checkIfUnsigned()) {
      this.checkIfResume();
    }
  };

  // -----------------------------------------------------------
  // SYNC DATA
  // -----------------------------------------------------------

  syncDataService() {
    this.user_info = this.dataService.getUserInfo();
    console.log('user info loaded');
    this.daily_status = this.dataService.getDailyStatus();
  }

  // -----------------------------------------------------------
  // USER BUTTON ACTIONS
  // -----------------------------------------------------------

  startDaily() {
    this.loading = this.loadingController.create({
      content: "Please wait..."
    });

    this.loading.present();
    this.httpCaller.startQuest(null, null, null, null, null, true)
      .subscribe(
        () => {
          this.loading.dismiss()
            .then(
              () => this.nav.setRoot(QuestionPage)
          )
        }
      );
  };

  startPractice() {
    this.nav.push(QuestPage);
  }

  showMenu() {
    let menu = this.modalController.create(AppMenu,
      {
        animation: 'slide-in-right'
      }
    );
    menu.present();
  }

  showRewards() {
    let modal = this.modalController.create(Rewards);
    modal.present();
  }

  // -----------------------------------------------------------
  // CHECK IF USER HAS OPTION TO CONTINUE
  // -----------------------------------------------------------

  checkIfResume() {
    let should_resume = this.dataService.getResumeOption();
    if (should_resume) {
      this.showResumeQuestAlert();
    }
  };

  showResumeQuestAlert() {
    let resume_quest = this.alertController.create({
      title: 'Resume?',
      message: 'It looks like you didn\'t finish last time, would you like to resume or start over?',
      buttons: [
        {
          text: 'Start Over',
          handler: () => {
            this.httpCaller.dropQuest()
              .subscribe(
                () =>  this.nav.setRoot(HomePage)
              );
          }
        },
        {
          text: 'Resume',
          handler: () => {
            this.httpCaller.resumeQuest()
              .subscribe(() => {}, () => {},
                () => this.nav.push(QuestionPage)
              );
          }
        }
      ]
    });
    resume_quest.present();
  };

  // -----------------------------------------------------------
  // CHECK IF USER NEEDS TO SIGN RESEARCH AGREEMENT
  // -----------------------------------------------------------

  checkIfUnsigned() {
    if (this.researchAgreementUnsigned()) {
      // console.log('showing research agreement');
      this.showResearchAgreement();
      return false;
    }
    return true;
  }

  researchAgreementUnsigned() {
    // console.log(this.user_info.research_agreement_status);
    if (this.user_info.research_agreement_status != null) {
      return false;
    }
    else
      return true;
  }

  showResearchAgreement() {
    let research_agreement = this.modalController.create(ResearchAgreement);
    research_agreement.present();
  }
}
