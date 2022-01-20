import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-urlchecklist',
  templateUrl: './urlchecklist.component.html',
  styleUrls: ['./urlchecklist.component.css']
})
export class UrlchecklistComponent implements OnInit {
  @Input('checkList') public checkList: any[];
  checkListView: any[] = new Array();
  validForm = true;
  submittedCheckList = false;
  spinnerFlag: boolean = false;
  isAnyFieldEdited:boolean=false;
  constructor() { }

  ngOnInit(): void {
    if(this.checkList.length==0)
    this.addUrlCheckList(this.checkList);
  }

  addUrlCheckList(list: any[]) {
    this.submittedCheckList = false;
    let json = {
      formFlag: false,
      title: '',
      url: '',
      documentType: new Array(),
      formId: new Array(),
      formList: new Array()
    }
    if (this.validateList(list)) {
        list.push(json);
        setTimeout(() => {
          $('#titleid-' + (list.length - 1)).focus();
        }, 600);
    }
  }

  delete(list: any[], index: number) {
    list.splice(index, 1);
    this.validateList(list);
  }

  validateList(list: any[]): boolean {
   this.reset();
    if (list) {
      for (let index = 0; index < list.length; index++) {
        let dto = list[index];
          if (!dto.title || !dto.url) {
            this.validForm = false;
            return;
          }
      }
    }
    return this.validForm;
  }

  reset(){
    this.validForm=true;
  }

  removeChecklist(list: any[]){
    list=list.filter(dto=>dto.title && dto.url);
    return list;
   }
   onEditAnyData(){
    this.isAnyFieldEdited=true;
  }
}
