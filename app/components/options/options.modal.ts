import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
import {OptionService} from "../../providers/option.service";

@Component({
  selector: 'options-modal',
  templateUrl: 'build/components/options/options.modal.html'
})
export class OptionsModal {

  constructor(
    private viewController: ViewController

  ) {}

  dismiss(){
    this.viewController.dismiss();
  }

}
