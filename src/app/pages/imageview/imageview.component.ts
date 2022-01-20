import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-imageview',
  templateUrl: './imageview.component.html',
  styleUrls: ['./imageview.component.css']
})
export class ImageviewComponent implements OnInit {

  @ViewChild('modalImageViewer') modalOverflow:any;
  @Output() closingView = new EventEmitter();
  imageURL:any;

  constructor() { }

  ngOnInit() {
    
  }

  openView(url){
    this.imageURL = url;
    this.modalOverflow.show();
  }

  closeView(){
    this.modalOverflow.hide();
    this.closingView.emit('true');
  }

}
