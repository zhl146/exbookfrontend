import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs/Rx';
import {DataStoreService} from './data-store.service';
import {ServerResponse} from '../interfaces/response.interface';

@Injectable()
export class HttpCallerService {

  constructor(
    private httpService: HttpWrapperService,
    private dataService: DataStoreService
  ) {}

  initStatusOnLogin() {
    return new Observable(observer => {
      this.httpService.getStatus()
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('Failed to obtain user information.'),
          () => observer.complete()
        );
    });
  };

  getQuestOptions() {
    return new Observable(observer => {
      this.httpService.getQuest()
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('Failed to get quest options.'),
          () => observer.complete()
        );
    });
  };

  createAccount(class_code) {
    return new Observable(observer => {
      this.httpService.createAccount(class_code)
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('Invalid class code. Please try again.'),
          () => observer.complete()
        );
    });
  };

  startQuest(
    chapter_index: number,
    number_of_questions: number,
    is_timed: boolean,
    cumulative: boolean,
    question_type: number,
    is_daily: boolean
  ) {
    return new Observable(observer => {
      this.httpService.startQuest(
        chapter_index,
        number_of_questions,
        is_timed,
        cumulative,
        question_type,
        is_daily
      )
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('Invalid quest options. Please try again.'),
          () => observer.complete()
        );
    });
  };

  resumeQuest() {
    return new Observable(observer => {
      this.httpService.resumeQuest()
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('Unable to resume quest.'),
          () => observer.complete()
        );
    });
  };

  submitQuestion(user_answer, lat, lon) {
    return new Observable(observer => {
      this.httpService.submitQuestion(user_answer, lat, lon)
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('There was an issue with your answer submission.'),
          () => observer.complete()
        );
    });
  };

  dropQuest() {
    return new Observable(observer => {
      this.httpService.dropQuest()
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('There was a problem dropping your current quest.'),
          () => observer.complete()
        );
    });
  };

  getRewards() {
    return new Observable(observer => {
      this.httpService.getRewards()
        .subscribe(
          (server_response) => observer.next(server_response['rewards']),
          (server_response) => observer.error('There was a problem requesting rewards.'),
          () => observer.complete()
        );
    });
  };

  getDailyStatus() {
    return new Observable(observer => {
      this.httpService.getDailyStatus()
        .subscribe(
          (server_response) => observer.next(server_response['daily_status']),
          (server_response) => observer.error('There was a problem requesting your current status.'),
          () => observer.complete()
        );
    });
  };

  signAgreement(agreement_choice) {
    return new Observable(observer => {
      this.httpService.signAgreement(agreement_choice)
        .subscribe(
          (server_response) => observer.next(this.updateDataService(server_response)),
          (server_response) => observer.error('There was a problem requesting your current status.'),
          () => observer.complete()
        );
    });
  };

  updateDataService(server_response: ServerResponse): boolean {
    if (server_response['user']) {
      this.dataService.setAppUser(server_response.user);
    }
    if (server_response['question']) {
      this.dataService.setQuestionAnswers(server_response.question['answers']);
      this.dataService.setQuestionPrompt(server_response.question['prompt']);
    }
    if (server_response['feedback']) {
      this.dataService.setQuestionFeedback(server_response['feedback']);
    }
    if (server_response['quest_options']) {
      this.dataService.setQuestOptions(server_response.quest_options);
    }
    if (server_response['daily_status']) {
      this.dataService.setDailyStatus(server_response.daily_status);
    }
    if (server_response['rewards']) {
      this.dataService.setAvailableRewards(server_response.rewards);
    }
    if (server_response['user_performance']) {
      this.dataService.setUserPerformance(server_response.user_performance);
    }
    return true;
  }

}

