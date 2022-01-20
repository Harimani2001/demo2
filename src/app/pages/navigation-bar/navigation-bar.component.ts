import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../shared/config.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  @Input() id :any;
  @Input() total :any;
  @Input() current :any;
  @Input() freeznext :any;
  @Input() freezprevious :any;
  @Input() docType :any;
  @Input() routeBack :any;
  @Output() resultValue = new EventEmitter();
  spinnerFlag :boolean = false;

  constructor(public service: ConfigService) { }

  ngOnInit() {
  }


  setData(data){

    this.id= data.result;
    this.resultValue.emit(data);
  }

  onclickLast() {
    if (!this.freeznext) {
        this.spinnerFlag = true;
        this.service.getLastData(this.id,this.docType).subscribe(jsonResp => {
          this.setData(jsonResp);
        },
            err => {
            }
        );
    }
}

onclickFirst() {
    if (!this.freezprevious) {
        this.spinnerFlag = true;
        this.service.getFirstData(this.id,this.docType).subscribe(jsonResp => {
          this.setData(jsonResp);
        },
            err => {
            }
        );
    }
}

onclickPrevious() {
    if (!this.freezprevious) {
        this.spinnerFlag = true;
        this.service.getPreviousData(this.id,this.docType).subscribe(jsonResp => {
          this.setData(jsonResp);
        },
            err => {
            }
        );
    }
}

onclickNext() {
    if (!this.freeznext) {
        this.spinnerFlag = true;
        this.service.getNextData(this.id,this.docType).subscribe(jsonResp => {
          this.setData(jsonResp);
        },
            err => {
            }
        );
    }
}

}
