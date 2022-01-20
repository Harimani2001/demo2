import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core'
import { AdminComponent } from '../../layout/admin/admin.component';
import { StepperClass } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Component({
  selector: 'app-draft-pdf',
  templateUrl: './draft-pdf.component.html',
  styleUrls: ['./draft-pdf.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DraftPdfComponent implements OnInit {
  spinnerFlag: boolean = false;
  @Input() permissionConstant: string = "";
  @Input() draftIds: any;
  fileName;
  pdfSrc;
  showModal: boolean=false;
  height:any="600px";
  constructor(public configService: ConfigService, public helper: Helper,private adminComp: AdminComponent) { }

  ngOnInit() {
    this.pdfpreview();
  }

  pdfpreview() {
    this.spinnerFlag = true;
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.permissionConstant;
    stepperModule.documentIds = this.draftIds;
    stepperModule.draftFlag=true;
    this.configService.HTTPPostAPI(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
      var responseBolb: any[] = this.b64toBlob(response.pdf)
      const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
      this.createIframeBlob(true, "Draft Level PDF.pdf", blob, "application/pdf");
    })

  }
  private createIframeBlob(viewFlag, fileName:string, blob, contentType,filePath?:string) {
    return new Promise<boolean>(resolve=>{
      if (viewFlag) {
        this.showModal=true;
          resolve(true);
     if(contentType.toLowerCase().match("pdf")){
         this.createIFrame(URL.createObjectURL(blob),fileName);
      }
      }
  });
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
    this.spinnerFlag = false;
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

  private closeFileView() {
    var elementExists = document.getElementById('iframeView');
    if (elementExists) {
      elementExists.remove();
      const find = document.querySelector('#fileUploadId');
      find.removeAttribute('class')
    }
    this.showModal=false;
  }

  loadAudit(event){
    if(event){
      this.configService.HTTPPostAPI({"constantName": this.permissionConstant, "type": "Draft"}, 'common/pdfDownloadAudit').subscribe(response => {}); 
    }
  }

}