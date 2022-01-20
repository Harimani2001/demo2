import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.css']
})
export class VideoViewerComponent implements OnInit {

@ViewChild('modalVideoViewer') modalOverflow:any;
@Output() closeVideo = new EventEmitter();
videoURL:any;

  constructor() { }

  ngOnInit() {
  }
  
  openView(url){
    this.videoURL = url;
    var iframeTag= <any> document.getElementById("videoViewerId");
    iframeTag.src=this.videoURL;
    this.modalOverflow.show();
  }

  closeView(){
    this.modalOverflow.hide();
    this.closeVideo.emit('true');
  }

}
