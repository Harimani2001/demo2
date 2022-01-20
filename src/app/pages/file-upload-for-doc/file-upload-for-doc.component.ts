import { Component, ElementRef, Input, OnInit, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { FileUploadForDoc, MasterDynamicTemplate, UserPrincipalDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { FileUploadForDocService } from './file-upload-for-doc.service';

@Component({
  selector: 'app-file-upload-for-doc',
  templateUrl: './file-upload-for-doc.component.html',
  styleUrls: ['./file-upload-for-doc.component.css']
})

export class FileUploadForDocComponent implements OnInit {
  @Input() multiple: boolean;
  @Input() onlyView: boolean;
  @Input() documentId: any;
  @Input() update: boolean;
  @Input() documentCode: any;
  @Input() uniqueCodeForAudit: any;
  @Input() accept: any;
  @Input() dfFile: boolean;
  @Input() download: boolean;
  @Output() onfileUpload = new EventEmitter<any>();
  @Output() onTCFileChange = new EventEmitter<any>();
  @Output() onTCFileDelete = new EventEmitter<any>();
  @ViewChild('fileuploaddiv') myInputVariable: ElementRef;
  fileList: any[] = new Array();
  deleteFileList: any[] = new Array();
  public count: number = 0;
  public newFileLength: number = 0;
  public sizeOfProgressBar: number = 0;
  fileName: String = '';
  formData: FileUploadForDoc = new FileUploadForDoc();
  fileValidationMessage: any = "";
  videoURL: any;
  isVideo: boolean = false;
  singleFileUploadFlag: Boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
  public fileUploadspinnerFlag = false;
  docID: any;
  docUniqCode: any;
  isAnyFieldEdited: boolean = false;
  deletedFileId:any;
  constructor(public fileUploadForDocService: FileUploadForDocService, public helper: Helper, public iqtcServices: IQTCService,
    public commonService: CommonFileFTPService, public permissionService: ConfigService, private injector: Injector) {
  }

  ngOnInit() {
    if (!this.accept) {
      this.accept = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.png,.jpeg";
    }
    this.clearFileList();
    this.permissionService.loadCurrentUserDetails().subscribe(jsonResp => {
      this.currentUser = jsonResp;
    });
  }

  loadFilesOnOrgIdAndPermissions(permisionConstName) {
    this.fileUploadForDocService.loadFilesBasedOnOrgId(permisionConstName).subscribe(jsonResp => {
      if (jsonResp.result.length > 0) {
        this.fileList = jsonResp.result
      }
    });
  }

  onFileChange(event, single?: boolean) {
    this.isAnyFieldEdited = true;
    this.fileUploadspinnerFlag = true;
    this.newFileLength = event.target.files.length;
    if (event.target.files.length != 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        const date = Date.now();
        this.permissionService.getCurrentDate(date).subscribe(res => {
          const contentType = this.commonService.getContentType(event.target.files[index].name.split(".")[event.target.files[index].name.split(".").length - 1]);
          if (this.fileList.filter(data => data.name == event.target.files[index].name).length == 0 && !contentType.match(".zip")) {
            this.permissionService.checkIsValidFileSize(event.target.files[index].size).subscribe(fileRes => {
              if (this.helper.KNOWLEDGEBASE == this.documentCode) {
                event.target.files[index].displayDate = res;
                if (single) {
                  this.deleteFileList = JSON.parse(JSON.stringify(this.fileList));
                  this.fileList = new Array();
                  this.fileList.push(event.target.files[index]);
                } else {
                  this.fileList.push(event.target.files[index]);
                }
                this.fileUploadspinnerFlag = false;
              } else {
                if (fileRes) {
                  event.target.files[index].displayDate = res;
                  if (single) {
                    this.deleteFileList = JSON.parse(JSON.stringify(this.fileList));
                    this.fileList = new Array();
                    this.fileList.push(event.target.files[index]);
                  } else {
                    this.fileList.push(event.target.files[index]);
                  }
                  this.fileUploadspinnerFlag = false;
                } else {
                  this.helper.fileSizeWarning(event.target.files[index].name);
                  this.fileUploadspinnerFlag = false;
                  this.reset();
                }
              }
            let newFiles= this.fileList.filter(f => !f.id);
              if(this.newFileLength === newFiles.length)
                this.onTCFileChange.emit(newFiles);
            });
          } else {
            this.fileUploadspinnerFlag = false;
          }
        }, error => { this.fileUploadspinnerFlag = false; });
      }
    } else {
      this.fileUploadspinnerFlag = false;
    }
  }

  onFileUpload(event) {
    this.fileUploadspinnerFlag = true;
    this.newFileLength = event.target.files.length
    const filePath = 'IVAL/' + this.currentUser.orgId + '/' + this.currentUser.projectName + '/' + this.currentUser.versionName + '/' + this.documentCode + '/Attachments/';
    if (event.target.files.length != 0) {
      let totalFiles = event.target.files.length;
      for (let index = 0; index < totalFiles; index++) {
        const contentType = this.commonService.getContentType(event.target.files[index].name.split(".")[event.target.files[index].name.split(".").length - 1]);
        if (this.fileList.filter(data => data.name == event.target.files[index].name).length == 0 && !contentType.match(".zip")) {
          this.permissionService.checkIsValidFileSize(event.target.files[index].size).subscribe(fileRes => {
            if (fileRes) {
              let file = event.target.files[index];
              let fileName = file.name;
              const formData: FormData = new FormData();
              formData.append('file', file, fileName);
              formData.append('filePath', filePath);
              formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
              this.commonService.singleFileUpload(formData).subscribe(resp => {
                let date = Date.now();
                this.permissionService.getCurrentDate(date).subscribe(res => {
                  var json = { filePath: resp.path, name: fileName, date: date, displayDate: res };
                  this.fileUploadspinnerFlag = false;
                  this.fileList.push(json);
                  this.onfileUpload.emit(json);
                }, error => { this.fileUploadspinnerFlag = false; });
              }, error => {
                this.fileUploadspinnerFlag = false;
              })
            } else {
              this.helper.fileSizeWarning(event.target.files[index].name);
              this.fileUploadspinnerFlag = false;
              this.reset();
            }
          });
        } else {
          this.fileUploadspinnerFlag = false;
        }
      }
    } else {
      this.fileUploadspinnerFlag = false;
    }
  }

  clearFileList() {
    this.fileList = new Array();
  }

  /**
   * @returns true=> for file is empty
   */
  validateFileUpload(): boolean {
    return this.fileList.length == 0;
  }

  uploadFileList(dto, documentName, code?): Promise<boolean> {
    this.docID = dto.id;
    if (code != undefined)
      this.uniqueCodeForAudit = code;
    this.count = 0;
    this.fileUploadspinnerFlag = true;
    return new Promise<boolean>(resolve => {
      let fileNames = "";
      if (this.update && this.deleteFileList.length != 0) {
        for (let index = 0; index < this.deleteFileList.length; index++) {
          this.deleteFileList[index].documentPrimaryKey = dto.id;
          this.fileUploadForDocService.deleteFile(this.deleteFileList[index]).subscribe(jsonResp => {
          });
        }
        this.deleteFileList = new Array();
      }
      const fileDataList = this.fileList.filter(event => event.id === undefined);
      if (fileDataList.length > 0) {
        this.sizeOfProgressBar = 100 / fileDataList.length;
        for (let index = 0; index < fileDataList.length; index++) {
          const form: FormData = new FormData();
          const file = fileDataList[index];
          this.formData.documentName = documentName;
          this.formData.documentId = dto.id;
          this.formData.name = file.name;
          this.formData.url = '';
          form.append('file', fileDataList[index]);
          this.fileUploadForDocService.saveFileUploadForDoc(form, this.formData).subscribe(jsonResp => {
            if (jsonResp.result === "success") {
              this.count += 1;
              if (this.count === fileDataList.length) {
                fileNames = fileDataList.map(f => f.name).toString();
                this.iqtcServices.auditForMultipleFile(this.uniqueCodeForAudit, fileNames, this.documentCode, dto.id).subscribe(resp => { });
                this.loadFileListForEdit(this.docID, this.docUniqCode);
                resolve(true);
              }
            }
          })
        }
      } else {
        resolve(false);
        this.fileUploadspinnerFlag = false;
      }
    });
  }

  uploadFileListWithPath(dto, documentName, code?): Promise<void> {
    if (code != undefined)
      this.uniqueCodeForAudit = code;
    this.count = 0;
    this.fileUploadspinnerFlag = true;
    return new Promise<void>(resolve => {
      let fileNames = "";
      if (this.update && this.deleteFileList.length != 0) {
        for (let index = 0; index < this.deleteFileList.length; index++) {
          this.deleteFileList[index].documentPrimaryKey = dto.id;
          this.fileUploadForDocService.deleteFile(this.deleteFileList[index]).subscribe(jsonResp => {
          });
        }
        this.deleteFileList = new Array();
      }
      const fileDataList = this.fileList.filter(event => event.id === undefined);
      if (fileDataList.length > 0) {
        this.sizeOfProgressBar = 100 / fileDataList.length;
        for (let index = 0; index < fileDataList.length; index++) {
          this.formData.documentName = documentName;
          this.formData.documentId = dto.id;
          this.formData.name = fileDataList[index].name;
          this.formData.filePath = fileDataList[index].filePath;
          this.formData.url = '';
          this.permissionService.HTTPPostAPI(this.formData, "fileUploadForDoc/saveFileUploadForDocWithPAth").subscribe(jsonResp => {
            if (jsonResp.result === "success") {
              this.count += 1;
              if (this.count === fileDataList.length) {
                fileNames = fileDataList.map(f => f.name).toString();
                this.iqtcServices.auditForMultipleFile(this.uniqueCodeForAudit, fileNames, this.documentCode, dto.id).subscribe(resp => { });
                this.loadFileListForEdit(this.docID, this.docUniqCode);
                resolve();
              }
            }
          })
        }
      } else {
        resolve();
        this.fileUploadspinnerFlag = false;
      }
    }).then((result) => {

    }).catch((err) => {
      this.fileUploadspinnerFlag = false;
    });
  }

  downloadFileOrView(filePath, viewFlag, fileName) {
    var admin = this.injector.get(AdminComponent);
    admin.downloadOrViewFile(fileName, filePath, viewFlag);
    if (!viewFlag)
      this.iqtcServices.auditForMultipleFileDownload(this.uniqueCodeForAudit, fileName, this.documentCode, this.docID).subscribe(resp => { });
  }

  deleteUploadedFile(fileList, index, id) {
    fileList.splice(index, 1);
  }

  loadFileListForEdit(documentId, uniqCode): Promise<boolean> {
    this.count = 0;
    this.fileUploadspinnerFlag = true;
    return new Promise<boolean>(resolve => {
      this.fileUploadspinnerFlag = true;
      this.docID = documentId;
      this.docUniqCode = uniqCode;
      this.fileUploadForDocService.loadFilesBasedOnOrgId({ "documentId": documentId, "documentType": this.documentCode }).subscribe(jsonResp => {
        if (jsonResp.result.length > 0) {
          this.fileList = new Array();
          this.fileList = jsonResp.result;
          this.fileList.sort((a, b) => b.displayDate.localeCompare(a.displayDate));
          this.fileUploadspinnerFlag = false;
          resolve(true);
        } else {
          this.fileList = new Array();
          this.fileUploadspinnerFlag = false;
          resolve(false);
        }
      }, error => {
        this.fileUploadspinnerFlag = false;
        resolve(false);
      })
    });
  }

  deleteUploadedFileForDoc(id, filePath, name) {
    if (id !== undefined) {
      let data = new FileUploadForDoc();
      data.id = id;
      data.filePath = filePath;
      data.documentUniqCode = this.docUniqCode;
      data.documentName = this.documentCode;
      data.name = name;
      this.deleteFileList.push(data);
      let d = this.fileList.filter(s =>
        s.id != id
      );
      this.fileList = d;
      this.onTCFileDelete.emit(data);
    }
    this.reset()
    this.fileList = this.fileList.filter(item => item.name !== name);
  }

  reset() {
    this.myInputVariable.nativeElement.value = "";
  }

  setfileForDF(fileList) {
    for (let index = 0; index < fileList.length; index++) {
      this.fileList.push(fileList[index]);
    }
  }

}
