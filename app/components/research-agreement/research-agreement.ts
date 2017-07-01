import { Component } from '@angular/core';
import {HttpCallerService} from "../../providers/http-caller.service";
import {HomePage} from "../../pages/home/home.page";
import {NavController} from "ionic-angular";

@Component({
  selector: 'research-agreement',
  templateUrl: 'build/components/research-agreement/research-agreement.html'
})
export class ResearchAgreement {

  private agreement_choice: boolean = true;

  constructor(
    private httpCaller: HttpCallerService,
    private nav: NavController
  ) {}

  signAgreement() {
    navigator.geolocation.getCurrentPosition(
      () => {
        this.httpCaller.signAgreement(this.agreement_choice)
          .subscribe(
            () => this.nav.setRoot(HomePage)
          );
      });
  };

  toggleAgreement() {
    this.agreement_choice = !this.agreement_choice;
  };

}
