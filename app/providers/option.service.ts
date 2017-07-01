import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class OptionService {

  public question_font_size: number;
  public feedback_time: number;

  constructor() {
    this.feedback_time = 3000;
    this.question_font_size = 12;
  }

}

