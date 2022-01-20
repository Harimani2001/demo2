import { FileUploadForDocComponent } from './../../file-upload-for-doc/file-upload-for-doc.component';
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { Helper } from '../../../shared/helper';
import * as _ from "lodash";
import { CommonFileFTPService } from '../../common-file-ftp.service';
@Component({
  selector: 'app-view-knowledge-base',
  templateUrl: './view-knowledge-base.component.html',
  styleUrls: ['./view-knowledge-base.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewKnowledgeBaseComponent implements OnInit {


  @ViewChild('fileupload') private fileupload: FileUploadForDocComponent;

  data: any;
  searchData: any;
  content: string = "";
  contentHeading: string = "";
  searchString: string = "";
  videoURL: any;
  receivedId:any;
  isVideo: boolean = false;
  isPdf: boolean = false;
  isImage:boolean=false;
  spinnerFlag:boolean=false;
  isUpdate:boolean=false;
  Colors: Array<any> = ["#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0"];
  constructor(private knowledgeBaseService: KnowledgeBaseService, public helper: Helper, public commonFileFTPService: CommonFileFTPService) { }

  ngOnInit() {
    this.knowledgeBaseService.callAPI("knowledgebase/loadKnowledgeBase","").subscribe((resp) => {
      this.data = resp.list;
      this.searchData = resp.list;
    });
  }
  loadContent(subCategory: any) {
    this.isUpdate = true;
    this.content = subCategory.content;
    this.contentHeading = subCategory.subCategoryName;
    this.spinnerFlag=true;
    this.receivedId=subCategory.contentId;
    var timer = setInterval(() => {
      if (this.fileupload) {
        this.fileupload.loadFileListForEdit(this.receivedId, this.helper.KNOWLEDGEBASE).then((result) => {
          this.spinnerFlag = false;
        }).catch((err) => {
          this.spinnerFlag = false;
        });
        clearInterval(timer);
      }
    }, 1000);
      this.spinnerFlag=false;
  }
  getColors(index) {
    let num = this.getnumber(index);
    return this.Colors[num];
  }
  getnumber(data) {
    let i = data;
    if (i > this.Colors.length - 1) {
      i = i - this.Colors.length;
      if (i < this.Colors.length) {
        return i;
      }
      else {
        this.getnumber(i);
      }
    }
    else {
      return i;
    }
  }
  onSearch() {
    this.searchData = [];
    if (!this.helper.isEmpty(this.searchString)) {
      this.data.forEach(data => {
        data.subCategoryList.forEach(element => {
          if (element.subCategoryName.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1) {
            if(!this.searchData.includes(data)){
              this.searchData.push(data);
            }
            
          }
        });
      });
    } else {
      this.searchData = this.data;
    }
  }


}

