import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { PDFViewerModule } from '../pdf-viewer/pdf-viewer.module';


@Component({
  selector: 'file-view',
  encapsulation:ViewEncapsulation.None,
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],

})
export class FileViewComponent implements OnInit {
  fileName;
  pdfSrc;
  showModal: boolean=false;
  height:any="600px";
  permissionConstant: string ='';
  fileDownloadspinnerFlag:boolean=false;
  constructor(private commonService: CommonFileFTPService,public configService: ConfigService,public helper: Helper) { }

  ngOnInit() {
  }

  downloadFileOrView(fileName: string, filePath: string, viewFlag: boolean, fileViewTitle?):Promise<boolean> {
    return new Promise<boolean>(resolve=>{
      if (viewFlag){//show modal ob view
        this.showModal=true;
      }
    this.fileDownloadspinnerFlag=true;
    this.commonService.loadFile(filePath).subscribe(resp => {
      this.fileDownloadspinnerFlag=false;
      const contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
      const blob: Blob = new Blob([resp], { type: contentType });
      this.createIframeBlob(viewFlag, fileName, blob, contentType,filePath).then(resp=>{
        resolve(resp);
      });
    }, err => {
        swal({
          title: 'Error', type: 'info', timer: 2000, showConfirmButton: false,
          text: 'No such file found'
        });
      this.showModal=false;
      resolve(false);
    });
    });
    
  }

  previewByBlob(fileNameWithExtention: string, blobResponse: any, viewFlag: boolean, fileViewTitle?) {
    if (viewFlag)//show modal ob view
      this.showModal=true;
      this.permissionConstant=fileViewTitle;//fileViewTitle is using for audit trail in dms pdf download
    const contentType = this.commonService.getContentType(fileNameWithExtention.split(".")[fileNameWithExtention.split(".").length - 1]);
    const blob: Blob = new Blob([blobResponse], { type: contentType });
    this.createIframeBlob(viewFlag, fileNameWithExtention, blob, contentType);
  }
  public previewOrDownloadByBase64(fileName: string, base64String: string, viewFlag: boolean, fileViewTitle?: string) {
    if (viewFlag)//show modal ob view
      this.showModal=true;
    const contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
    var response: any[] = this.b64toBlob(base64String)
    const blob: Blob = new Blob(response, { type: contentType });
    this.createIframeBlob(viewFlag, fileName, blob, contentType);
  }

  private createIframeBlob(viewFlag, fileName:string, blob, contentType,filePath?:string) {
    return new Promise<boolean>(resolve=>{
      if (viewFlag) {
          resolve(true);
      if (contentType.toLowerCase().match("video/mp4") || contentType.toLowerCase().match("video/webm")) {
        //veiwing video without scolling
        this.createIFrame(URL.createObjectURL(blob),fileName,'450px');
      } else if (fileName.toLowerCase().includes(".xls")) {
        this.commonService.convertExcelToPDF(filePath).subscribe(resp => {
          const contentType = this.commonService.getContentType("pdf");
          const blob: Blob = new Blob([resp], { type: contentType });
          this.createIFrame(URL.createObjectURL(blob),
          fileName.replace(fileName.split(".")[fileName.split(".").length - 1],"pdf"));
        }, err => {
            swal({
              title: 'Unable To View', type: 'info', timer: 2000, showConfirmButton: false,
              text: 'Please download'
            });
            this.showModal=false;
        });
      } else if(contentType.toLowerCase().match("pdf")){
         this.createIFrame(URL.createObjectURL(blob),fileName);
      }else{
        if(fileName.toLocaleLowerCase().includes(".mht")){
          this.showModal=false;
          this.download(blob,fileName);
        }else{
          this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
            this.createIFrame(URL.createObjectURL(respBlob),
            fileName.replace(fileName.split(".")[fileName.split(".").length - 1],"pdf"));
          }).catch(()=>{
            swal({
              title: 'Unable To View', type: 'info', timer: 2000, showConfirmButton: false,
              text: 'Please download'
            });
            this.showModal=false;
          });
        }
      }
      
    } else {
      this.download(blob,fileName).then(()=>{
        resolve(true);
      }).catch(()=>{
        resolve(false);
      });
    }
  });
  }

  private download(blob, fileName): Promise<void> {
    return new Promise<void>(resolve => {
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
          resolve();
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve();
        }
      } catch (error) {
        resolve();
      }
    })
  }

  private createIFrame(blob_url: string,fileName:string ,height?: string) {
    this.height=height ? height : (window.innerHeight - 100)+"px"
    this.fileName=fileName;
    this.pdfSrc="";
    if(fileName.includes(".pdf")){
      this.pdfSrc=blob_url;
    }else{
      var iframe;
      var elementExists = document.getElementById('iframeView');
      if (!elementExists)
        iframe = document.createElement('embed');
      else
        iframe = elementExists;
      iframe.setAttribute('id', 'iframeView')
      iframe.setAttribute("height",this.height);
      iframe.setAttribute("width", "100%");
      iframe.src = blob_url + '#zoom=113&pagemode=thumbs';
      const find = document.querySelector('#fileUploadId');
      find.setAttribute('class', 'well well-lg row');
      find.appendChild(iframe);
    }
   

   
    // this.fileViewerModal.spinnerHide();

  }

  private closeFileView() {
    var elementExists = document.getElementById('iframeView');
    if (elementExists) {
      elementExists.remove();
      const find = document.querySelector('#fileUploadId');
      find.removeAttribute('class')
    }
 //   this.fileViewerModal.hide();
    this.pdfSrc='';
    this.showModal=false;
  }

  private b64toBlob(b64Data) {
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
    return byteArrays;
  }
  close(){
    this.showModal=false;
    this.closeFileView();
  }

  loadAudit(event){
    if(event){
      this.configService.HTTPPostAPI( {"constantName": this.permissionConstant, "type": "DMS"}, 'common/pdfDownloadAudit').subscribe(response => {}); 
    }
  }
  
}
