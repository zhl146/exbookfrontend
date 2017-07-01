import {
  Component,
  Input,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import {DataStoreService} from "../../providers/data-store.service";
import {HttpCallerService} from "../../providers/http-caller.service";
import {NavController, AlertController, ModalController} from "ionic-angular/index";
import {QuestCompleteModal} from "../../components/quest-complete-modal/quest-complete.modal";
import {Subscription} from "rxjs";
import {AppFeedback, AppAnswer} from "../../interfaces/question.interface";
import {TimerService} from "./timer.service";
import {AppUser} from "../../interfaces/user.interface";
import {HomePage} from "../home/home.page";
import {OptionService} from "../../providers/option.service";
import {AppMenu} from "../../components/menu/menu";
import {isUndefined} from "ionic-angular/util/util";
import {MathJaxDirective} from "./mathjax.directive";
import {Rewards} from "../../components/rewards/rewards";

@Component({
  templateUrl: 'build/pages/question/question.page.html',
  providers: [TimerService, AlertController, ModalController],
  directives: [MathJaxDirective],
  animations: [
    trigger('answerState', [
      state('inactive', style({
        height : 0
      })),
      state('active',   style({
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ]),
    trigger('answerOut', [
      state('active', style({
        height : 0
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('answerOut', [
      state('active', style({
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
  ]
})
export class QuestionPage {

  // -----------------------------------------------------------
  // PRIVATE VARS
  // -----------------------------------------------------------

  // user information
  private userInfo: AppUser;
  private userSubscription: Subscription;

  // question prompt text
  private questionPrompt: string;
  // question answer choices
  private questionAnswers: AppAnswer[];

  // keeps track of the user's currently selected answer
  private clickedAnswer: number;

  // feedback
  private questionFeedback: AppFeedback;
  private feedbackSubscription: Subscription;
  private correctAnswer: number;
  private incorrectAnswer: number;
  private pleaseWait: boolean;
  private showingFeedback: boolean;
  private nextButton: boolean;
  private questComplete: boolean;

  // timer
  private time_left;
  private timerSubscription: Subscription;
  private is_timed: boolean;

  // geolocation
  private userLatitude;
  private userLongitude;

  private spinnerActive: boolean = false;

  // -----------------------------------------------------------
  // CONSTRUCTOR
  // -----------------------------------------------------------
  constructor(
    private dataService: DataStoreService,
    private httpCaller: HttpCallerService,
    private nav: NavController,
    private timerService: TimerService,
    private alertController: AlertController,
    private modalController: ModalController,
    private optionService: OptionService
  ) {};

  // -----------------------------------------------------------
  // LIFECYCLE HOOKS
  // -----------------------------------------------------------

  ngOnInit() {
    // console.log('questions component init');
    this.subscribeUser();
    this.subscribeFeedback();
    this.subscribeTimer();
    this.getCurrentLocation();
    this.initializeTimer();
    this.displayNewQuestion();
  };

  ngOnDestroy() {
    // console.log('questions component destroyed');
    this.dropSubscriptions();
  };

  // -----------------------------------------------------------
  // METHODS
  // -----------------------------------------------------------

  // -----------------------------------------------------------
  // GEOLOCATION
  // -----------------------------------------------------------

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition( (location) => {
      this.userLatitude = (isUndefined(location.coords.latitude) ? 0: location.coords.latitude);
      this.userLongitude = (isUndefined(location.coords.longitude) ? 0: location.coords.longitude);
      // console.log("Your latitude is: " + this.userLatitude);
      // console.log(" Your longitude is : " + this.userLongitude);
    });
  };

  // -----------------------------------------------------------
  // QUESTION LOGIC
  // -----------------------------------------------------------

  displayNewQuestion() {
    this.questionPrompt = this.dataService.getQuestionPrompt();
    this.questionAnswers = this.dataService.getQuestionAnswers();
    if (this.is_timed) {
      this.timerService.startTimer();
    }
  };

  onAnswerClick(answer_index) {
    if (this.clickedAnswer === answer_index) {
      this.pleaseWait = true;
      this.submitAnswer(answer_index);
    } else {
      this.clickedAnswer = answer_index;
    }
  };

  submitAnswer(final_answer) {
    this.timerService.stopTimer();
    this.spinnerActive = true;

    this.httpCaller.submitQuestion(final_answer, this.userLatitude, this.userLongitude)
      .subscribe(
        () => {
          if (this.is_timed) {
            this.timerService.resetTimer();
          }
          this.spinnerActive = false;

          this.giveFeedback();
          setTimeout(() => {
            this.checkQuestCompletion();
            if (!this.questComplete) {
              this.nextButton = true;
            }
          }, this.optionService.feedback_time);
        },
        (error) => {
          this.spinnerActive = false;
          this.showErrorAlert(error);
        }
      );
  };

  nextQuestion(){
    this.clearFeedback();
    this.displayNewQuestion();
    this.nextButton = false;
  }

  // -----------------------------------------------------------
  // QUESTION FEEDBACK
  // -----------------------------------------------------------

  // using the server response, lights up the correct answer with an animation
  giveFeedback() {
    // console.log('giving feedback');
    this.showingFeedback = true;
    this.clickedAnswer = null;
    if (!this.questionFeedback.is_correct) {
      this.incorrectAnswer = this.questionFeedback.user_answer;
    }
    this.correctAnswer = this.questionFeedback.correct_answer;
    // for (var i = this.questionAnswers.length -1; i >= 0 ; i--){
    //   if (this.questionAnswers[i].index != this.correctAnswer && this.questionAnswers[i].index != this.incorrectAnswer){
    //     this.questionAnswers.splice(i, 1);
    //   }
    // }
  };

  clearFeedback() {
    // console.log('clearing feedback');
    this.correctAnswer = null;
    this.incorrectAnswer = null;
    this.showingFeedback = false;
    this.pleaseWait = false;
  };

  getFeedbackStyle(answer_index) {
    let style = [];
    if (answer_index === this.correctAnswer) {
      style.push('glow-green');
      style.push('animated');
      style.push('pulse');
    }
    else if (answer_index === this.incorrectAnswer) {
      style.push('glow-red');
    }
    else if (answer_index === this.clickedAnswer) {
      style.push('glow-blue');
    }
    // else if (answer_index != this.clickedAnswer && answer_index != this.correctAnswer && this.showingFeedback) {
    //   style.push('collapse');
    // }
    return style;
  };

  getAnswerState(answer_index) {
    if (answer_index != this.incorrectAnswer && answer_index != this.correctAnswer && this.showingFeedback) {
      return 'inactive'
    }
    else {
      return 'active'
    }
  }

  // -----------------------------------------------------------
  // QUEST COMPLETION
  // -----------------------------------------------------------

  checkQuestCompletion() {
    this.questComplete = this.dataService.getQuestStatus();
  };

  showQuestCompleteModal() {
    let modal = this.modalController.create(QuestCompleteModal,
      {
        animation: 'slide-in-right'
      });
    modal.present();
  }

  // -----------------------------------------------------------
  // ERROR ALERT
  // -----------------------------------------------------------

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
                )
          }
        }
      ]
    });
    alert.present();
  }

  // -----------------------------------------------------------
  // USER BUTTON ACTIONS
  // -----------------------------------------------------------

  showMenu() {
    let menu = this.modalController.create(AppMenu);
    menu.present();
  };

  showGoHomeAlert() {
    let alert = this.alertController.create({
      title: 'Go Home?',
      message: 'This will wipe your current progress. Are you sure you want to go home?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.httpCaller.dropQuest()
              .subscribe(
                () => this.nav.setRoot(HomePage)
              );
          }
        }
      ]
    });
    alert.present();
  };

  showRewards() {
    let modal = this.modalController.create(Rewards);
    modal.present();
  }


  // -----------------------------------------------------------
  // SUBSCRIBE TO DATA SERVICE CHANGES
  // -----------------------------------------------------------

  subscribeUser() {
    this.userSubscription = this.dataService.getAppUser()
      .subscribe(
        (value) => {
          this.userInfo = value;
        }
      );
  };

  subscribeFeedback() {
    this.feedbackSubscription = this.dataService.getQuestionFeedback()
      .subscribe(
        (value) => {
          this.questionFeedback = value;
          // console.log('feedback updated');
        }
      );
  };

  subscribeTimer() {
    this.timerSubscription = this.timerService.getTimer()
      .subscribe(
        (time_left) => {
          this.time_left = time_left;
          if (this.time_left <= 0) {
            this.submitAnswer(null);
          }
        }
      );
  };

  dropSubscriptions() {
    this.feedbackSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  initializeTimer() {
    let time_limit = this.dataService.getTimeLimit();
    this.is_timed = (time_limit > 0);

    if (this.is_timed) {
      this.timerService.initTimer(time_limit);
    }
    else{
      this.time_left = 100
    }

  }

}
