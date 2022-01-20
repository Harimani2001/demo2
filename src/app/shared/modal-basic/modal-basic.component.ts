import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-modal-basic',
  templateUrl: './modal-basic.component.html',
  styleUrls: ['./modal-basic.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalBasicComponent implements OnInit {
  @Input() dialogClass: string;
  @Input() hideHeader = false;
  @Input() hideFooter = false;
  @Input() headerStyle = false;
  public visible = false;
  public visibleAnimate = false;
  @Input() hideClickOutSide= false;
  public govalMainSpinnerFlag =false;
  constructor() {}

  ngOnInit() {

  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    setTimeout(() => {
      $('#documentApprovalComment').focus();
    }, 1000);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      if(this.hideClickOutSide)
      this.hide(); //should not hide if clicked out side also
    }
  }

  public spinnerShow(){
    if(!this.govalMainSpinnerFlag)
      this.govalMainSpinnerFlag=true;
  }

  public spinnerHide(){
    if(this.govalMainSpinnerFlag)
    this.govalMainSpinnerFlag=false;
}
}
