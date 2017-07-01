import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class TimerService {

  private time_limit: number;
  private time_left: number;
  private timerFunction;
  private timer;
  private updateInterval = 1000;

  constructor() {
    this.timer = new Subject(null);
  }

  initTimer(time_limit) {
    this.time_limit = time_limit;
    this.time_left = this.time_limit;
    // console.log('Timer initialized. Time limit: ' + this.time_limit);
  }

  resetTimer() {
    this.time_left = this.time_limit;
    // console.log('Timer reset.');
  }

  startTimer() {
    // console.log('Starting timer.');
    if (this.time_limit !== 0) {
      this.timerFunction = setInterval(
        () => {
          this.timer.next(this.time_left / this.time_limit * 100);
          this.time_left = this.time_left - this.updateInterval / 1000;
        }, this.updateInterval);
    }
  }

  stopTimer() {
    clearInterval(this.timerFunction);
  }

  getTimer() {
    return this.timer.asObservable();
  }

}
