import { Component, OnInit, Input, ViewChild } from '@angular/core';
@Component({
  selector: 'app-individual-document-forum',
  templateUrl: './individual-document-forum.component.html',
  styleUrls: ['./individual-document-forum.component.css']
})
export class IndividualDocumentForumComponent implements OnInit {
  documentForumModal: boolean = false;
  @Input() constant: any = null;
  @Input() itemId: any = 0;
  @Input() documentList: any;
  @ViewChild('forumView') forumView: any;

  constructor() { }

  ngOnInit() {
  }

  showModalView() {
    this.documentForumModal = true;
    this.forumView.loadCommentsForOtherModule();
  }

  setPermissionConstant(documentType, documentList) {
    this.forumView.loadCommentsForFormsWithData(documentType, documentList);
  }

}
