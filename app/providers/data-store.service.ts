import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/Rx';
import {AppUser} from '../interfaces/user.interface';
import {AppAnswer, AppFeedback, AppQuestOptions} from '../interfaces/question.interface';

@Injectable()
export class DataStoreService {

  constructor() {}

  // Create subjects for every data change that we want to subscribe to

  // for questions
  private questionAnswers = new BehaviorSubject(null);
  private questionPrompt = new BehaviorSubject(null);
  private questionFeedback = new BehaviorSubject(null);

  // for quests
  private questOptions = new BehaviorSubject(null);

  // for user info
  private appUser = new BehaviorSubject(null);

  // keeps track of how many dailies the user is allowed
  private dailyStatus = new BehaviorSubject(null);

  // keeps track of rewards
  private availableRewards = new BehaviorSubject(null);

  // keeps track of quest end stats
  private userPerformance = new BehaviorSubject(null);

  // getters

  getUserPerformance() {
    let performance = null;
    this.userPerformance.subscribe(
      (user_performance) => performance = user_performance
    );
    return performance;
  }

  getAvailableRewards() {
    let rewards = null;
    this.availableRewards.subscribe(
      (available_rewards) => rewards = available_rewards
    );
    return rewards;
  }

  getDailyStatus() {
    let status = null;
    this.dailyStatus.subscribe(
      (daily_status) => status = daily_status
    );
    return status;
  }

  getQuestionAnswers() {
    let answers = null;
    this.questionAnswers.subscribe(
      (question_answers) => answers = question_answers
    );
    return answers;
  }

  getQuestionPrompt() {
    let prompt = null;
    this.questionPrompt.subscribe(
      (question_prompt) => prompt = question_prompt
    );
    return prompt;
  }

  getQuestionFeedback() {
    return this.questionFeedback.asObservable();
  }

  getQuestOptions() {
    let options = null;
    this.questOptions.subscribe(
      (quest_options) => options = quest_options
    );
    return options;
  }

  getAppUser() {
    return this.appUser.asObservable();
  }

  getUserName() {
    let name = null;
    this.appUser.subscribe(
      (user) => name = user.first_name
    );
    return name;
  }

  getUserInfo() {
    let user_info = null;
    this.appUser.subscribe(
      (user) => user_info = user
    );
    return user_info;
  }

  getUserPoints() {
    let points = null;
    this.appUser.subscribe(
      (user) => points = user.total_points
    );
    return points;
  }

  getTimeLimit() {
    let time_limit = 0;
    this.appUser.subscribe(
      (user) =>  {
        if (user.is_timed) {
          time_limit = 20;
        }
      }
    );
    return time_limit;
  }

  getQuestStatus() {
    let isComplete = null;
    this.appUser.subscribe(
      (user) => isComplete = (user.number_of_questions == null)
    );
    return isComplete;
  }

  getResumeOption() {
    let resume = null;
    this.appUser.subscribe(
      (user) => {
        resume = (user.current_progress !== 0 &&  user.number_of_questions !== user.current_progress && user.number_of_questions != null);
      }
    );
    return resume;
  }

  // setters

  setQuestionAnswers(questionAnswers: AppAnswer[]): void {
    // console.log('setting question answers in data service');
    this.questionAnswers.next(questionAnswers);
  }

  setQuestionPrompt(questionPrompt: string): void {
    // console.log('setting question prompt in data service');
    this.questionPrompt.next(questionPrompt);
  }

  setQuestionFeedback(questionFeedback: AppFeedback): void {
    // console.log('setting question feedback in data service');
    this.questionFeedback.next(questionFeedback);
  }

  setQuestOptions(options: AppQuestOptions): void {
    this.questOptions.next(options);
  }

  setAppUser(user: AppUser): void {
    this.appUser.next(user);
  }

  setDailyStatus(daily_status): void {
    this.dailyStatus.next(daily_status);
  }

  setAvailableRewards(rewards): void {
    this.availableRewards.next(rewards);
  }

  setUserPerformance(performance): void {
    this.userPerformance.next(performance);
  }


}
