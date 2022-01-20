import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-view-testcase-file-list',
  templateUrl: './view-testcase-file-list.component.html',
  styleUrls: ['./view-testcase-file-list.component.css']
})
export class ViewTestcaseFileListComponent implements OnInit {

  isImage:boolean = false;
  fileList:any=[];
  @ViewChild('modalFileViewer') modal: any;
  @ViewChild('modalFileViewerVideo')videoModel :any;

  constructor(private adminComponent: AdminComponent) { }

  ngOnInit() {
  }

  viewImage(fileList,isImage){
    this.isImage = isImage;
    this.fileList = fileList;
    this.modal.show();
  }

  viewVideo(fileList,isImage){
    this.isImage = isImage;
    this.fileList = fileList;
    this.videoModel.show();
  }

  viewTestCaseFile(id, isImage) {
    this.adminComponent.spinnerFlag = true;
    this.adminComponent.configService.HTTPPostAPI('', 'testCase/loadImageOrVideoList/' + (isImage ? 'image' : 'video') + '/' + id).subscribe(resp => {
      this.fileList = resp.list;
      this.adminComponent.spinnerFlag = false;
      this.isImage = isImage;
      if (isImage) {
        this.modal.show();
      } else {
        this.videoModel.show();
      }
    }, err => this.adminComponent.spinnerFlag = false);
  }

  onclickViewImageOrVideo(path){
    if(this.isImage)
      this.adminComponent.downloadOrViewFile('dummyImage.png',path,true,'ScreenShot Image');
    else
      this.adminComponent.downloadOrViewFile('dummyVideo.webm',path,true,'Recorded Video');
  }

}
