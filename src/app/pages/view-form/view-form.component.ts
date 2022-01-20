import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit{
  flagSpinner=false;
  @Input() inputField:any[];
  @Output() createTask:EventEmitter<any>=new EventEmitter();
  @ViewChild('squeezebox') squeezebox;
  dynamicJsonTableView=new Array();
  public masterFormDataList = new Array();
  @ViewChild('ShowImageModal') showImageModal: any;
  configOfCkEditior={
    removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,find,selection,spellchecker,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,list,indent,blocks,align,bidi,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,ShowBlocks,About',
    readOnly:true
  }
  imageurl:any="";
constructor( private adminComponent: AdminComponent,private commonService:CommonFileFTPService,private domSanitizer: DomSanitizer,private service:DynamicFormService) {
    
   }
  ngOnInit(): void {
    this.addTableOnMasterFormSelection();
  }

   downloadFileOrView(fileName,filePath,viewFlag,id) {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const parts = fileName.split('.');
    if(viewFlag && imageExtensions.includes(parts[parts.length-1].toLowerCase())){
      this.flagSpinner=true;
      this.commonService.loadFile(filePath).subscribe(resp => {
        const STRING_CHAR = String.fromCharCode.apply(null, resp);
        let base64String = btoa(STRING_CHAR);
        this.imageurl = this.domSanitizer.bypassSecurityTrustUrl("data:image/jpg;base64, " + base64String);
        this.flagSpinner=false;
        this.showImageModal.show();
      }, err => {
        this.flagSpinner=false;
    });
    }else{
      this.adminComponent.downloadOrViewFile(fileName,filePath,viewFlag);
    }
  }
  addTableOnMasterFormSelection() {
    if (this.inputField[0].masterLinkIds) {
      this.service.loadFormDataOfMasterFormDataIdsForView(this.inputField[0].masterDataLinkIds).subscribe(resp => {
        this.masterFormDataList = resp;
        this.dynamicJsonTableView = new Array();
        this.inputField[0].masterLinkIds.forEach(id => {
          let rowData = resp.filter(json => json.masterId == id);
          if (rowData.length > 0)
            this.dynamicJsonTableView.push({
              master: id,
              tableData: {
                rows: rowData.map(json => json.jsonData),
                columns: this.createColumns(JSON.parse(rowData[0].column))
              },
              masterName: rowData[0].masterName,
              filterQuery: ''
            })
        })
      });
    }
  }

  createColumns(jsonArray: any[]): any[] {
    let columns = new Array();
    columns.push("Select");
    columns.push("Id");
    columns.push("Code");
    jsonArray.forEach(json => {
      if (json.type != 'table' && json.type != 'textarea')
        columns.push(json.label);
    });
    return columns;
  }

  clickCreateTask(input){
    this.createTask.emit(input);
    setTimeout(()=>{
      this.clickCheck();
    },600);
  }
  clickCheck() {
    if (this.squeezebox)
      this.squeezebox.items.toArray().forEach(function (i) {
        if (i.collapsed) {
          i.applyToggle(false);
        }
      });
  }
}  