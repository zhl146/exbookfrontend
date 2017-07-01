import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class HttpWrapperService {

  private local: boolean = false;

  // server information
  private host_address: string;
  private host_port = '5000';
  private api_version = 'v1';

  // available REST endpoints
  private create_account = 'account/create';
  private get_status = 'status/get';
  private start_quest = 'quest/start';
  private resume_quest = 'quest/resume';
  private stop_quest = 'quest/drop';
  private submit_question = 'question/submit';
  private get_quest_options = 'quests/get';
  private get_rewards = 'rewards/get';
  private get_daily_status = 'daily/get';
  private sign_agreement = 'agreement/sign';

  constructor (private http: AuthHttp) {
    this.host_address = this.local ? 'localhost' : 'zhenlu.info';
  }

  createAddress(route) {
    return (
      this.local ?
        'http://' + this.host_address + ':' + this.host_port + '/api/' + this.api_version + '/' + route :
        'https://' + this.host_address + ':' + this.host_port + '/api/' + this.api_version + '/' + route
    );
  }

  // # TODO: add a message saying that the server may be busy
  // generic post request that maps the return object to json
  genericPost(route, outgoing_data): Observable<any> {
    // console.log('attempting to call out using ' + route);
    return this.http.post(this.createAddress(route), outgoing_data)
      .retryWhen((error) => error.delay(1000))
      .timeout(3000, new Error('delay exceeded'))
      .map(
        (response: Response) => response.json()
      )
      .catch(
        (error) => Observable.throw(error.json())
      );
  }


  // http POST requests
  // these all return observables and need to be subscribed to
  // in order to do anything

  getStatus(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.get_status, payload);
  }

  getDailyStatus(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.get_daily_status, payload);
  }

  getQuest(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.get_quest_options, payload);
  }

  startQuest(
    chapter_index,
    number_of_questions,
    is_timed,
    cumulative,
    question_type,
    is_daily
  ): Observable<any> {
    let payload = {
      'chapter_index': chapter_index,
      'number_of_questions': number_of_questions,
      'is_timed': is_timed,
      'cumulative': cumulative,
      'question_type': question_type,
      'is_daily': is_daily
    };
    return this.genericPost(this.start_quest, payload);
  }

  dropQuest(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.stop_quest, payload);
  }

  resumeQuest(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.resume_quest, payload);
  }

  submitQuestion(user_answer, lat, lon): Observable<any> {
    let payload = {
      'user_answer': user_answer,
      'latitude': lat,
      'longitude': lon
    };
    return this.genericPost(this.submit_question, payload);
  }

  createAccount(class_code): Observable<any> {
    let payload = {
      'class_code': class_code
    };
    return this.genericPost(this.create_account, payload);
  }

  getRewards(): Observable<any> {
    let payload = {
    };
    return this.genericPost(this.get_rewards, payload);
  }

  signAgreement(agreement_choice): Observable<any> {
    let payload = {
      'agreement_choice': agreement_choice
    };
    return this.genericPost(this.sign_agreement, payload)
  }

}


