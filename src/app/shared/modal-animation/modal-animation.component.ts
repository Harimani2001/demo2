import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-modal-animation',
  templateUrl: './modal-animation.component.html',
  styleUrls: ['./modal-animation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalAnimationComponent implements OnInit {

  @Input() modalClass: string;
  @Input() contentClass: string;
  @Input() modalID: string;
  @Input() backDrop = false;
  @Input() hideClickOutSide= false;
  public animationSpinnerFlag =false;
  constructor() { }

  ngOnInit() {

  }

  close(event) {
    if(this.hideClickOutSide)
    document.querySelector('#' + event).classList.remove('md-show');
  }

  public spinnerShow(){
    if(!this.animationSpinnerFlag)
      this.animationSpinnerFlag=true;
  }

  public spinnerHide(){
    if(this.animationSpinnerFlag)
    this.animationSpinnerFlag=false;
}
}
