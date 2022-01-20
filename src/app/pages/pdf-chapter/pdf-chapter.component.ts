import { AdminComponent } from './../../layout/admin/admin.component';
import { ConfigService } from './../../shared/config.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Permissions } from '../../shared/config';
import swal from 'sweetalert2';
import { PDFChapterDTO } from '../../models/model';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { Helper } from '../../shared/helper';

@Component({
  selector: 'app-pdf-chapter',
  templateUrl: './pdf-chapter.component.html',
  styleUrls: ['./pdf-chapter.component.css']
})
export class PdfChapterComponent implements OnInit {
  @ViewChild('pdfChapterTable') table: any;
  @Input('isDocChapter') isDocChapter: boolean;
  @Input('docId') docId:any;
  @ViewChild('bulkAddChapterModal') bulkAddChapterModal;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  pdfChapterModal = new PDFChapterDTO();
  chapterList = new Array();
  permissionModal = new Permissions("", false);
  viewFlag = true;
  submitted = false;
  isDuplicateChapter:boolean=false;
  oldChapterName: string;
  count=1;
  validationMessage='';
  fileValidationMessage='';
  bulkChapterList:PDFChapterDTO[]=new Array<PDFChapterDTO>();
  enableImportButton=false;
  public editor;
  editorSwap: boolean = false;
  constructor(public helper: Helper,public configService: ConfigService, private adminComponent: AdminComponent) {
  }

  ngOnInit(): void {
    
    this.loadAllChapter();
    this.adminComponent.setUpModuleForHelpContent("153");
    this.configService.loadPermissionsBasedOnModule("153").subscribe(resp => {
      this.permissionModal = resp;
    });
  }

  loadAllChapter(){
    if(this.isDocChapter)
    this.loadProjectDocChapters();
  else
    this.loadChapters();
  }
  saveAndGoto(formValid) {
    this.fileValidationMessage='';
    this.adminComponent.spinnerFlag = true;
    this.submitted = true;
    if (!formValid || (this.pdfChapterModal.type == 'file'&& this.file.validateFileUpload())){
      if((this.pdfChapterModal.type == 'file'&& this.file.validateFileUpload())){
        this.fileValidationMessage="Please upload the .docx or .pdf file"
      }
      this.adminComponent.spinnerFlag = false;
      return;
    } else {
      if(this.isDocChapter)
      this.pdfChapterModal.projectId = this.adminComponent.currentUser.projectId;
      this.pdfChapterModal.categoryName = this.docId;
      this.configService.HTTPPostAPI(this.pdfChapterModal, 'pdfSetting/savePDFChapterOfOrg').subscribe(resp => {
        this.adminComponent.spinnerFlag = false;
        if(this.pdfChapterModal.type == 'file'){
          this.file.uploadFileList(resp, "153").then(re => {
            this.swalMessage(resp);
          });
        }else{
          this.swalMessage(resp);
        }
        
      });
    }
  }


   swalMessage(resp){
    if (resp) {
      swal({
        title: 'Saved Successfully!',
        text: 'Details has been saved.',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
    }
    this.loadAllChapter();
   }
  addChapter(){
    this.adminComponent.spinnerFlag = true;
    this.pdfChapterModal = new PDFChapterDTO();
    this.viewFlag = false;
    this.adminComponent.spinnerFlag = false;
    this.submitted=false;
    this.validationMessage = "";
    this.fileValidationMessage='';
    this.isDuplicateChapter=false;
  }

  checkChapterEntry(chapterName):Promise<any> {
   return new Promise<boolean>(resolve=>{
     setTimeout(() => {
       this.adminComponent.spinnerFlag = true;
       this.configService.HTTPPostAPI(chapterName,
         'pdfSetting/isChapterExists/' + (this.isDocChapter ? this.docId : "ALL") + '/' + this.pdfChapterModal.id)
         .subscribe(resp => {
           this.adminComponent.spinnerFlag = false;
           this.isDuplicateChapter = resp;
           resolve(resp);
         }, err => { this.adminComponent.spinnerFlag = false; resolve(true)});
     }, 600);
   })
    
  }
  edit(row: any) {
    this.adminComponent.spinnerFlag = true;
    this.pdfChapterModal = row;
    this.oldChapterName = this.pdfChapterModal.chapterName;
    if (this.pdfChapterModal && this.pdfChapterModal.chapterContent && this.pdfChapterModal.chapterContent.search(/<*>/i) !== -1)
      this.editorSwap = true;
    this.viewFlag = false;
    this.adminComponent.spinnerFlag = false;
    this.submitted=false;
    this.validationMessage = "";
    this.fileValidationMessage='';
    this.onChange();
  }

  onChange(){
    if (this.pdfChapterModal.type == 'file') {
      let interval = setInterval(() => {
        if (this.file) {
          this.file.loadFileListForEdit(this.pdfChapterModal.id, '');
          clearInterval(interval);
        }
      }, 600);
    }
   
  }

  cancel(){
    this.pdfChapterModal.chapterName = this.oldChapterName;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  loadChapters() {
    this.adminComponent.spinnerFlag = true;
    this.chapterList = new Array();
    this.configService.HTTPPostAPI('', 'pdfSetting/loadPDFChapterOfOrg').subscribe(resp => {
      this.chapterList = resp;
      this.adminComponent.spinnerFlag = false;
      this.viewFlag=true;
    });
  }

  loadProjectDocChapters(){
    this.adminComponent.spinnerFlag = true;
    this.chapterList = new Array();
    this.configService.HTTPPostAPI(this.docId, 'pdfSetting/loadPDFChapterForDocument').subscribe(resp => {
      this.chapterList = resp;
      this.adminComponent.spinnerFlag = false;
      this.viewFlag=true;
    });
  }

  bulkAddChapter() {
    this.bulkAddChapterModal.show();
    this.validationMessage = "";
    this.fileValidationMessage='';
  }

  sampleDownload(){
    this.bulkAddChapterModal.spinnerShow();
    this.configService.HTTPPostAPIFile('pdfSetting/sampleDocFileForPdfChapter',this.count).subscribe(resp => {
      this.adminComponent.previewByBlob("Sample_Download.docx",resp,false);
      this.bulkAddChapterModal.spinnerHide();
    });
  }

  extractFile(event) {
    this.validationMessage = "";
    this.bulkChapterList=new Array();
    this.enableImportButton=false;
    if (event.target.files[0].name.match('.docx')) {
      this.bulkAddChapterModal.spinnerShow();
      const formData: FormData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      this.configService.HTTPPostAPI(formData, 'pdfSetting/extractFileForPdfChapter').subscribe(resp => {
        event.target.value = '';
        if(resp.message){
          this.validationMessage = resp.message;
        }
        if(resp.list){
          this.bulkChapterList=resp.list;
          this.bulkChapterList.forEach(element => {
            if(element.chapterName)
            this.checkChapterEntry(element.chapterName).then(resp=>{
               (<any> element).chapterNameExists=resp;
            })
          });
          
          this.enableImportButton=this.bulkChapterList.filter(d => !d.chapterContent || !d.chapterName).length > 0;
        }
        
        this.bulkAddChapterModal.spinnerHide();
      });
    } else {
      this.validationMessage = "Please upload .docx file";
    }
  }

  check(element){
    this.checkChapterEntry(element.chapterName).then(resp=>{
      (<any> element).chapterNameExists=resp;
   })
  }
  closeBulkAddChapter() {
    this.bulkAddChapterModal.hide();
    this.bulkChapterList=new Array();
    this.count=1;
    this.validationMessage='';
    this.enableImportButton=false;
    this.loadAllChapter();

  }

  saveBulkChapter() {
    this.enableImportButton=false;
    if (this.bulkChapterList.filter(d => !d.chapterContent || !d.chapterName || (<any> d).chapterNameExists).length > 0) {
      this.enableImportButton=true;
      return;
    } else {
      this.bulkChapterList.forEach(e => {
        if(this.docId){
         delete (<any> e).chapterNameExists;
          e.categoryName = this.docId;
          e.projectId = this.adminComponent.currentUser.projectId;
        }
      });
      this.bulkAddChapterModal.spinnerShow();
      this.configService.HTTPPostAPI(this.bulkChapterList, 'pdfSetting/bulkSaveOfPDFChapter').subscribe(resp => {
            if(resp.result=='success'){
                swal({
                  title: 'Bulk Uploaded Successfully!',
                  text: 'Details has been saved.',
                  type: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                  onClose:()=>{
                    this.bulkAddChapterModal.spinnerHide();
                    this.closeBulkAddChapter();
                  }
                });
              } else {
                swal({
                  title: 'Error',
                  text: 'oops something went wrong',
                  type: 'error',
                  timer: 2000,
                  showConfirmButton: false
                })
              }
      });
    }
  }
  /**
   * 
   * @param quill => Quill editor input
   */
  onEditorCreated(quill) {
    this.editor = quill;
  }
  openSuccessCancelSwal(dataObj) {
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          dataObj.userRemarks = "Comments : " + value;
          this.deleteChapter(dataObj);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
        }
      });
  }
  deleteChapter(dataObj) {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPI(dataObj,"pdfSetting/deletePDFChapter").subscribe((resp) => {
      this.adminComponent.spinnerFlag = false;
      if (resp.result === 'success') {
        swal({
          title: 'Deleted!', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          text: dataObj.chapterName + ' record has been deleted',
          onClose: () => {
            this.loadAllChapter();
          }
        });
      } else {
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: dataObj.ursCode + ' record has not been deleted'
        });
      }
    }, (err) => {
      this.adminComponent.spinnerFlag = false;
      swal({
        title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: dataObj.ursCode + ' record has not been deleted'
      });
    });
  }
}
