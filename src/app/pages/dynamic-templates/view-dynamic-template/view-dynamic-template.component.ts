import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DynamicTemplateDto, RevisionDto } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { DocStatusService } from '../../document-status/document-status.service';
import { DynamicTemplateService } from '../dynamic-template.service';


@Component({
  selector: 'app-view-dynamic-template',
  templateUrl: './view-dynamic-template.component.html',
  styleUrls: ['./view-dynamic-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewDynamicTemplateComponent implements OnInit {
  @ViewChild('myTable') table: any;
  public sortOrder = 'desc';
  public filterQuery = '';
  public data: any;
  viewIndividualDataFlag:boolean=false;
  permissionData:any;
  modal:Permissions=new Permissions(this.helper.DYNAMIC_TEMPLATE_VALUE,false);
  dynamicTemplateModel: DynamicTemplateDto = new DynamicTemplateDto();
  spinnerFlag:boolean=true;
  oldDocumentContents:string;
  newDocumentContents:string;
  outputHtml:any
 revisionModel:RevisionDto=new RevisionDto();
 revisionList:any;
 viewRevisionDataFlag:boolean=false;
 dropDownOne:any;
 dropDownTwo:any;
 updatedDate1:any;
 updatedDate2:any;
 user1:any;
 user2:any;
 dropDownOneId:any;
 dropDownTwoId:any;
 dropDownFlag:boolean=false;
 hideFlag:boolean=false;
 dropDownOneVersion:any;
 dropDownTwoVersion:any;
 public currentDocType:any;
 public currentDocStatus:any;
 public currentCreatedBy:any;
 public currentModifiedDate:any;
 statusLog:any;
 modalSpinner:boolean=false;
  constructor(public configService:ConfigService,public helper:Helper,public dynamicTemplateService:DynamicTemplateService,public docStatusService:DocStatusService ) { 
    this.configService.loadPermissionsBasedOnModule(this.helper.DYNAMIC_TEMPLATE_VALUE).subscribe(resp=>{
      this.modal=resp
    });
  
  }
  ngOnInit() {
    this.dynamicTemplateService.loadDynamicformTemplateData().subscribe(resp=>{
      this.data=resp.result;
      
      this.spinnerFlag=false;
    });
    this.spinnerFlag=false;
  }
  viewRowDetails(rowId) {
    this.dynamicTemplateService.loadDynamicTemplateDataBasedOnId(rowId).subscribe(response => {
      this.dynamicTemplateModel = response.result;
      this.viewIndividualDataFlag = true;
    });
 
  }
//    test(){
//      
//   this.oldDocumentContents = 'beep boop';
//   this.newDocumentContents = 'beep boob blah',
  
//   this.diff = jsdiff.diff(this.oldDocumentContents, this.newDocumentContents);
//  this.display=document.getElementById('display'),
//   this.fragment = document.createDocumentFragment();

// this.diff.forEach(function(part){
// // green for additions, red for deletions
// // grey for common parts
// this.color = part.added ? 'green' :
//   part.removed ? 'red' : 'grey';
// this.span = document.createElement('span');
// this.span.style.color = this.color;
// this.span.appendChild(document
//   .createTextNode(part.value));
//   this.fragment.appendChild(this.span);
// });

// this.display.appendChild(this.fragment);

// }

highlight(newDocumentContents, oldDocumentContents){ 
  //   var newText = newDocumentContents;
  //   var oldText = oldDocumentContents;
  //   ("oldText",oldText)   
  //  
  //   var text = "";
  //   var text1="";
  //   var spanOpen = false;
  //   var spanOpen1 = false;
  //   newDocumentContents.split("").forEach(function(value, index){
	// 			if (value != oldText.charAt(index)){   
  //           text += !spanOpen ? "<span class='high'>" : "";
  //           text += value;
  //           spanOpen = true;
  //       } else {   
  //              
  //           text += spanOpen ? "</span>" : "";
  //           text += value;
  //           spanOpen = false;  
  //       }	
  //   });
  //   this.outputHtml=text;
  //     (this.outputHtml)


  //   oldDocumentContents.split("").forEach(function(value, index){
  //     if (value != newText.charAt(index)){   
  //         text1 += !spanOpen1 ? "<span class='highlight'>" : "";
  //         text1 += value;
  //         spanOpen1 = true;
  //     } else {   
  //            
  //         text1 += spanOpen1 ? "</span>" : "";
  //         text1 += value;
  //         spanOpen1 = false;  
  //     }	
  // });
  //   this.outputHtml1=text1;
  //     (this.outputHtml1)

  // const diff = require('rich-text-diff')
  //let temp=diff(oldDocumentContents, newDocumentContents);
  //this.outputHtml=temp;

  // var Diff = require('text-diff');
  // var diff = new Diff(); // options may be passed to constructor; see below
  // var textDiff = diff.main(oldDocumentContents, newDocumentContents); // produces diff array
  // this.outputHtml=diff.prettyHtml(textDiff);
}
// test(){

// require('colors');
// let jsdiff = require('diff');

// var one = 'beep boop';
// var other = 'beep boob blah';

// var diff = jsdiff.diffChars(one, other);

// diff.forEach(function(part){
//   // green for additions, red for deletions
//   // grey for common parts
//   var color = part.added ? 'green' :
//     part.removed ? 'red' : 'grey';
//   process.stderr.write(part.value[color]);
// });

//   ();
// }


// test(){
//   let color='';
//   let span=null;
//   var text="";
// const diff = jsdiff.diffChars(this.oldDocumentContents, this.newDocumentContents);
//  
// let display = document.getElementById('display'),
//  fragment = document.createDocumentFragment();
//   ("hello",diff);

// diff.forEach(function(part){
// // green for additions, red for deletions
// // grey for common parts
// color = part.added ? 'green' : part.removed ? 'red' : 'grey';

// text +="<span style='color:"+color+"'>" ;
// text +=part.value;
// text +="</span>";
//   //         text1 += value;

//   ("inside loop",text);
// });
//   ("outside loop",text);
// }

viewRevisionDetails(row){
  let dto=new RevisionDto();
  dto.documentId=row.id;
  dto.documentType=row.permissionId;
  this.dynamicTemplateService.loadAllRevisionData(dto).subscribe(jsonResp=>{
    this.revisionList=jsonResp.result;
    });
  this.viewRevisionDataFlag=true;
  this.updatedDate1=this.revisionList[this.revisionList.length-2].createdTime;
  this.updatedDate2=this.revisionList[this.revisionList.length-1].createdTime;
  this.user1=this.revisionList[this.revisionList.length-2].usersByCreatedBy
  this.user2=this.revisionList[this.revisionList.length-2].usersByCreatedBy
  this.dropDownOne=this.revisionList.length-2;
  this.dropDownTwo=this.revisionList.length-1;
  this.newDocumentContents=this.revisionList[this.revisionList.length-1].changes;
  this.oldDocumentContents=this.revisionList[this.revisionList.length-2].changes;
  this.highlight(this.newDocumentContents,this.oldDocumentContents);
}
onChangeOfDropDownOne(dropdownData){
  this.validateDropDown();
  this.dropDownOneId=dropdownData;
  this.dropDownOneVersion=this.revisionList[dropdownData].versionName;
  this.oldDocumentContents=this.revisionList[dropdownData].changes;
  this.updatedDate1=this.revisionList[dropdownData].createdTime;
  this.user1=this.revisionList[this.revisionList.length-2].usersByCreatedBy
  this.highlight(this.newDocumentContents,this.oldDocumentContents);
}
onChangeOfDropDownTwo(dropdownData){
  this.validateDropDown();
  this.dropDownTwoId=dropdownData;
  this.dropDownTwoVersion=this.revisionList[dropdownData].versionName;
  this.newDocumentContents=this.revisionList[dropdownData].changes;
  this.updatedDate2=this.revisionList[dropdownData].createdTime;
  this.user2=this.revisionList[this.revisionList.length-2].usersByCreatedBy
  this.highlight(this.newDocumentContents,this.oldDocumentContents);
}

validateDropDown(){
  if(this.dropDownOneId>this.dropDownTwoId)
  this.dropDownFlag=false;
  else if(this.dropDownOneId>this.dropDownTwoId)
  this.dropDownFlag=true;
  if(this.dropDownOneId==this.dropDownTwoId)
  this.hideFlag=true;
}

toggleExpandRow(row){
  this.table.rowDetail.toggleExpandRow(row);
}

loadDocumentCommentLog(row){
  this.modalSpinner=true;
  this.configService.loadDocumentCommentLog(row.id,"dynamic").subscribe(result=>{
    this.currentDocType="Other Template";
    this.currentDocStatus=row.commonDocumentStatus;
    this.currentCreatedBy=row.createdBy;
    this.currentModifiedDate=row.updatedTime;
    if(result.list!=null){
      this.statusLog=result.list;
    }
    this.modalSpinner=false;
  });
}
}
