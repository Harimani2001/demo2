import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { DMSService } from './dms.service';
import swal from 'sweetalert2';
import { DmsExcelExportDto } from '../../models/model';
import { ProjectSummaryService } from '../project-summary/project-summary.service';
import { ConfigService } from '../../shared/config.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class DmsComponent implements OnInit {
  modalSpinner: boolean = false;
  nodes: any[] = new Array();
  public vendorDocuments: any;
  pdfSrc: Uint8Array;
  zoom: any = 1;
  originalSize: boolean = true;
  showAll: boolean = true;
  pdfPage: any;
  totalNumberOfPdfPages: any;
  statusLog: any;
  infoData: any;
  infoForms: any;
  isNodesThere: boolean = false;
  ftpFolderSize: any;
  @ViewChild('pdfaddEventmodal') pdfaddEventmodal: TemplateRef<any>;
  @ViewChild('modalOverflow') infoCard: any;
  @ViewChild('tree') tree: any;
  spinnerFlag: boolean = false;
  ftpFilePaths: Array<String> = new Array();
  ftpFileNames: Array<String> = new Array();
  documentTypes: Array<String> = new Array();
  documentIds: Array<number> = new Array();
  dmsExcelmodal: DmsExcelExportDto = new DmsExcelExportDto();
  selectedDocument: string = "";
  enableCsv: boolean = false;
  showExpansion: boolean = false

  dmsFileList: any[] = new Array();
  fileList: any[] = new Array();
  documentList = [];
  document = [];
  versionList = [];
  version = [];
  documentDropDownSettings = {
    singleSelection: false,
    text: "Select Document",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  versionDropDownSettings = {
    singleSelection: true,
    text: "Select Version",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  showSearch: boolean = false;
  filterQuery = '';

  constructor(private ngmodal: NgbModal, private adminComponent: AdminComponent, public dMSService: DMSService, public helper: Helper,
    private permissionService: ConfigService, public projectSummaryService: ProjectSummaryService, private configService: ConfigService) {
  }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("136");
    this.loadVersion();
    this.loadApplicationFileSize();
  }

  loadVersion() {
    this.spinnerFlag = true;
    this.projectSummaryService.loadProjectVersions(0).subscribe(jsonResp => {
      this.versionList = jsonResp.result.map(m => ({ id: m.id, itemName: m.versionName }));
      this.version = jsonResp.result.filter(f => f.activeFlag === 'Y').map(m => ({ id: m.id, itemName: m.versionName }));
      this.loadDmsFolderStructure().then(() => {
        this.spinnerFlag = false;
      });
    }, err => {
      this.spinnerFlag = false;
    });
  }

  loadDmsFolderStructure(): Promise<void> {
    return new Promise<void>(resolve => {
      this.configService.HTTPGetAPI("common/getDmsFolderStructure").subscribe(resp => {
        resp.list.forEach(item1 => {
          item1.children.forEach(item2 => {
            if (item2.children.length == 0) {
              let el = item2;
              if (el.customPdfEnabled) {
                el.name = item1.name + ' ' + el.name;
              }
              this.dmsFileList = [...this.dmsFileList, el];
            } else {
              item2.children.forEach(item3 => {
                let el = item3;
                if (el.customPdfEnabled) {
                  el.name = item1.name + ' ' + el.name;
                }
                this.dmsFileList = [...this.dmsFileList, el];
              });
            }
          });
        });
        this.documentList = this.dmsFileList.filter(f => !this.helper.isEmpty(f.versionId)).map(m => ({ id: +m.documentType, itemName: m.name }));
        this.document = this.dmsFileList.filter(f => !this.helper.isEmpty(f.versionId)).map(m => ({ id: +m.documentType, itemName: m.name }));
        let docList = this.document.map(m => m.id);
        let verList = this.version.map(m => m.id);
        this.fileList = this.dmsFileList.filter(f => docList.includes(+f.documentType) && verList.includes(f.versionId));
        this.fileList.push(...this.dmsFileList.filter(f => this.helper.Inventory_Report_Value === f.documentType));
        this.fileList = this.enableDMSButton(this.fileList);
        resolve();
      }, err => {
        resolve();
      });
    });
  }

  loadApplicationFileSize() {
    this.adminComponent.loadCurrentUserDetails().then(jsonResp => {
      if (!this.helper.isEmpty(jsonResp)) {
        this.dMSService.applicationFileSize("/IVAL/" + jsonResp.orgId + "/" + jsonResp.projectName + "/").subscribe(data => {
          if (data != '' && data != null) {
            this.ftpFolderSize = data.ftpSize;
          }
        });
      }
    })
  }

  fetchFileFromFtp(data) {
    if (!this.helper.isEmpty(data.filePath)) {
      this.spinnerFlag = true;
      this.dMSService.loadDMSFileFromFTP(data.name, data.filePath, data.documentType).subscribe(resp => {
        this.spinnerFlag = false;
        this.adminComponent.previewByBlob(data.name, resp, true, data.documentType);
      }, er => this.spinnerFlag = false);
    }
  }

  addPdfEvent() {
    this.ngmodal.open(this.pdfaddEventmodal, { size: 'lg' });
  }

  zoomInPDF(i: any) {
    this.originalSize = true;
    if (i < 1.30) {
      this.zoom = i + 0.05;
    }
  }

  zoomOutPDF(i: any) {
    this.originalSize = true;
    if (i != 1) {
      this.zoom = i - 0.05;
    }
  }

  callBackFn(event: any) {
    this.totalNumberOfPdfPages = event.pdfInfo.numPages;
  }

  gotoPage(page: any) {
    this.pdfPage = 1;
    let presentPage = this.pdfPage;
    if (page <= this.totalNumberOfPdfPages) {
      this.showAll = false;
      this.pdfPage = page;
    } else {
      this.pdfPage = presentPage;
    }
  }

  onChangePdf(document: any) {
    this.pdfSrc = this.convertBase64DataToBinary(document.fileContent);
  }

  convertBase64DataToBinary(base64: any) {
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  loadDocumentCommentLog(row: any) {
    this.infoData = "";
    this.spinnerFlag = true;
    this.dMSService.loadDocumentCommentLog(row).subscribe(result => {
      if (result.list != null) {
        this.statusLog = result.list;
      }
      this.infoData = result.data;
      this.infoData.ftpFileSize = result.fileSize;
      this.infoData.fileName = row.name;
      this.spinnerFlag = false;
      this.infoCard.show();
    });
  }

  onCickForMergePdf(event: any, data: any) {
    if (event.srcElement.checked) {
      this.ftpFilePaths.push(data.filePath);
      this.dmsExcelmodal.selectedFileName.push(data.name);
      this.documentTypes.push(data.documentType);
      this.selectedDocument = data.documentType;
      this.checkCustomeSettings(data.documentType, data.id);
    } else {
      this.ftpFilePaths = this.ftpFilePaths.filter(f => f != data.filePath);
      this.dmsExcelmodal.selectedFileName = this.dmsExcelmodal.selectedFileName.filter(f => f != data.name);
      this.documentTypes = this.documentTypes.filter(d => d != data.documentType);
      this.selectedDocument = data.documentType;
      this.checkCustomeSettings("", data.id);
    }
  }

  checkCustomeSettings(documentType: string, docId: number) {
    this.spinnerFlag = true;
    if (documentType != '') {
      let data = { "docType": documentType, "pdfDocSettingsId": docId }
      this.dMSService.checkCsvSettings(data).subscribe(result => {
        this.spinnerFlag = false;
        this.enableCsv = result.value;
        this.dmsExcelmodal.mappingId = result.mappingId;
        if (this.enableCsv === true) {
          this.dmsExcelmodal.projectDocPdfIds.push(docId);
        }
      });
    } else {
      let index: number = this.dmsExcelmodal.projectDocPdfIds.indexOf(docId);
      if (index !== -1) {
        this.dmsExcelmodal.projectDocPdfIds.splice(index, 1);
      }
      if (this.dmsExcelmodal.projectDocPdfIds.length == 0) {
        this.enableCsv = false;
      }
      this.spinnerFlag = false;
    }
  }
  /**
 * Method for CSV Export
 */
  downloadExcel() {
    this.dmsExcelmodal.docType = this.selectedDocument;
    this.spinnerFlag = true;
    this.dMSService.excelExport(this.dmsExcelmodal).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      } else {
        this.spinnerFlag = false;
        swal({
          title: '400',
          text: 'Oops, something went wrong ,try again..',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        })
      }
    }, (err) => {
      this.spinnerFlag = false;
      swal({
        title: '400',
        text: 'Oops, something went wrong ,try again..',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      })
    });
  }

  mergePfs() {
    if (this.ftpFilePaths.length != 0) {
      this.spinnerFlag = true;
      this.dMSService.downloadMergePdf(this.ftpFilePaths).subscribe(res => {
        this.spinnerFlag = false;
        if (res != null)
          this.adminComponent.previewByBlob("dms-merge-pdfs.pdf", res, false);
        else {
          swal({
            title: 'Files not merged properly',
            text: 'Oops, something went wrong ,files not merged properly, please try again..',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      }, (err) => {
        this.spinnerFlag = false;
        swal({
          title: '400',
          text: 'Oops, something went wrong ,try again..',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        })
      });
    } else {
      swal({
        title: 'warning',
        text: 'Please select at least one file',
        type: 'warning',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      })
    }
  }

  onChangeSearch() {
    this.showSearch = !this.showSearch
    if (this.showSearch) {
      setTimeout(() => {
        $('#search').focus();
      }, 200);
    }
  }

  filterDms(document, version) {
    this.fileList = [];
    if (document.length > 0 && version.length > 0) {
      let docList = document.map(m => m.id);
      let verList = version.map(m => m.id);
      this.fileList = this.dmsFileList.filter(f => docList.includes(+f.documentType) && verList.includes(f.versionId));
    }
  }

  enableDMSButton(data: any) {
    data.forEach(item1 =>{
      this.dMSService.enableDMSCertificate({"versionId":item1.versionId, "documentType":item1.documentType}).subscribe(res => {
        item1.certificateButton = res;
      });
    });
    return data;
  }

  downloadCertificate(data) {
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPIFile("common/downloadSummaryCertificate",{"versionId":data.versionId, "documentType":data.documentType}).subscribe(res => {
      if(res != null) {
      let file = new Blob([res], { type: 'application/pdf' });            
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href        = fileURL; 
      a.target      = '_blank';
      a.download    = data.name.replace(".pdf","")+'_certificate.pdf';
      document.body.appendChild(a);
      a.click();  
      this.spinnerFlag=false;
    } else {
      console.log("not working")
      this.spinnerFlag=false
    }
    })
  }

}
