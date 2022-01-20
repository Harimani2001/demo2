import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { dropDownDto } from '../../models/model';
import { Helper } from '../../shared/helper';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { PdfChapterComponent } from '../pdf-chapter/pdf-chapter.component';
import { PdfPreferencesDefaultPdfComponent } from '../pdf-preferences-default-pdf/pdf-preferences-default-pdf.component';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { ActivatedRoute } from '@angular/router';
import { ImportChapterComponent } from '../import-chapter/import-chapter.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.css',],
})
export class TableOfContentComponent implements OnInit {
  @Input('document') document: boolean;
  @Input('isDocChapter') isDocChapter: boolean;
  @Input('docId') docId: any;
  @ViewChild('pdfChapter') pdfChapter: PdfChapterComponent;
  @ViewChild('pdfPreferences') pdfPreferences: PdfPreferencesDefaultPdfComponent;
  @ViewChild('tocTab') tab: any;
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  modal: Permissions = new Permissions('', false);
  spinnerFlag: boolean = false;
  public documentList: dropDownDto[] = new Array<dropDownDto>();
  documentId: any = 0;
  showTabs: boolean = false;
  currentTab = 'tab-1';
  @ViewChild('forumView') forumView: any;
  documentForumModal: boolean = false;
  commentsDocumentsList: any[] = new Array();
  @ViewChild('importChapter') importChapter:ImportChapterComponent;
  isTemplateImported:boolean=false;
  constructor(private adminComponent: AdminComponent, private route: ActivatedRoute,
    private lookUpService: LookUpService, public helper: Helper, public config: ConfigService ,public datePipe: DatePipe) {
    this.route.queryParams.subscribe(query => {
      if (query.docId)
        this.documentId = query.docId;
    });
  }

  ngOnInit() {
    this.getDocumentList();
    this.adminComponent.setUpModuleForHelpContent("200");
    this.config.loadPermissionsBasedOnModule("200").subscribe(resp => {
      this.modal = resp;
    });
    if (this.documentId) {
      this.onDocumentChange();
      const interval = setInterval(() => {
        if (this.tab) {
          this.tab.activeId = 'tab-2';
          this.currentTab = 'tab-2';
          clearInterval(interval);
        }
      }, 100)
    }
  }

  getDocumentList() {
    this.lookUpService.loadDocumentForTableOfContentOnPermissions().subscribe(resp => {
      this.documentList = resp;
    })
  }

  onDocumentChange() {
    this.showTabs = true;
    const interval = setInterval(() => {
      this.currentTab=this.tab.activeId
      if ((this.pdfChapter && this.currentTab == 'tab-1') || (this.pdfPreferences && (this.currentTab == 'tab-2'))) {
        this.onChangeTab(this.currentTab);
        clearInterval(interval);
      }
      this.config.loadDocumentForumCodes(this.documentId).subscribe(resp => {
        this.commentsDocumentsList = resp;
      });
      this.config.HTTPGetAPI("pdfSetting/isTemplateImported/"+this.documentId).subscribe(resp => {
        this.isTemplateImported = resp.result;
      });
    }, 100)
  }

  onChangeTab(tab: any) {
    this.spinnerFlag = true;
    this.currentTab = tab;
    switch (this.currentTab) {
      case 'tab-2':
        if (this.pdfPreferences) {
          this.pdfPreferences.onDocumentChange(this.documentId);
        }
        break;
      default:
        const interval = setInterval(() => {
          if (this.pdfChapter) {
            this.pdfChapter.docId = this.documentId;
            this.pdfChapter.loadProjectDocChapters();
            clearInterval(interval);
          }
        }, 100);
    }
    this.spinnerFlag = false;
  }

  verify(documentType, documentCode, documentId) {
    this.formVerification.openMyModal(documentType, documentCode, documentId);
  }

  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
    this.forumView.setPermissionConstant(this.documentId, this.commentsDocumentsList);
  }

  closeDocumentForum() {
    this.documentForumModal = false;
  }
  onClickUpload(){
    this.importChapter.showModalView(this.documentId);
  }
  onCloseImportChapterModal(){
    this.onDocumentChange();
  }
  onClickDownload() {
    this.config.downloadFileGetAPI("common/downloadDocxForPublishedItems/" + this.documentId).subscribe(res => {
      if (res) {
        var blob: Blob = this.b64toBlob(res._body, 'application/docx');
        let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
        date = date.replace(":", "-");
        this.spinnerFlag = false;
        let name = this.documentList.filter(f => f.key == this.documentId)[0].value + "_" + date + ".docx";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, name);
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.spinnerFlag = false;
        }
      }
    });
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
