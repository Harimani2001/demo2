import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { IQTCService } from '../iqtc/iqtc.service';
import { Helper } from './../../shared/helper';

@Component({
  selector: 'app-screen-recording',
  templateUrl: './screen-recording.component.html',
  styleUrls: ['./screen-recording.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ScreenRecordingComponent implements OnInit {

  spinnerFlag:boolean = false;
  rowData:any; 
  dfId:any;
  iqId:any;
  url:any;
  videoFile:any;
  documentName:any;
  @Output() videoRecordingClose = new EventEmitter();
  @ViewChild('modalSmall') modalSmall:any; 
  @ViewChild('modalVideo') videoModal:any;

  constructor(public service: IQTCService,public helper: Helper) { }

  ngOnInit() {
  }

  // openVideoRecording(row, dfId, url) {
  //   this.rowData = row;
  //   this.dfId = dfId;
  //   if(dfId===null){
  //     this.iqId = this.rowData.id;
  //     this.documentName = this.rowData.testCaseCode;
  //   }else{
  //     this.iqId = null;
  //     this.documentName = "discrepancy_form";
  //   }
  //   this.url = url

  //   const s = this.renderer2.createElement('script');
  //   s.type = 'text/javascript';
  //   s.src = './../../../assets/js/recorder.js';
  //   s.text = ``;
  //   this.renderer2.appendChild(this._document.body, s);
    
  //   this.modalSmall.show();
  // }

  // uploadFile() {
  //   this.spinnerFlag = true;
  //   this.videoFile = fileTOTypeScript;
  //   this.service.saveRecordedVideo(this.videoFile, this.documentName, this.iqId, this.dfId).subscribe(jsonResp => {
  //     if (jsonResp.result === "success") {
  //       this.closeView();
  //       status = "success";
  //       swal({
  //         title: 'Upload Successfully!',
  //         text: ' Video has been uploaded.',
  //         type: 'success',
  //         timer: this.helper.swalTimer,
  //         showConfirmButton: false,
  //         onClose: () => {
  //         }
  //       });
  //       // this.videoRecordingClose.emit({ row: this.rowData, url: this.url });
  //       this.spinnerFlag = false;
  //     } else {
  //       swal({
  //         title: 'Upload Failed!',
  //         text: ' Video has not been uploaded. Try again!',
  //         type: 'error',
  //         timer: this.helper.swalTimer,
  //         showConfirmButton: false
  //       });
  //       this.spinnerFlag = false;
  //     }
  //   });
  // }

  // closeView(){
  //   this.videoFile = null;
  // }
}
