import { Component } from '@angular/core';

/*
  Generated class for the ErrorModal component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'error-modal',
  templateUrl: 'build/components/error-modal/error.modal.html'
})
export class ErrorModal {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }
}
