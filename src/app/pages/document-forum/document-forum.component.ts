import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from "lodash";
import { DocumentForumDTO, dropDownDto, UserPrincipalDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DocumentForumService } from './document-forum.service';
@Component({
  selector: 'app-document-forum',
  templateUrl: './document-forum.component.html',
  styleUrls: ['./document-forum.component.css'],
})
export class DocumentForumComponent implements OnInit {
  @ViewChild('commentField')
  commentField: any;
  @ViewChild('replyCommentField')
  replyCommentField: any;
  @Input() constant: any = null;
  @Input() itemId: any = 0;
  @Input() id: any = null;
  @Input() isDocumentWorkFlow: any = false;
  @Input() isModalSlide: any = true;
  @Input() documentList: any;
  @Input() chapter: any;
  @Input() isExterApproval: boolean = false;
  @Input() exterApprovalReferenceId: String = "";
  list: any[] = new Array();
  documentType: any;
  documentId: any;
  documentTitle: any;
  documentCode: any;
  comments: string = "";
  replyComments: string;
  spinnerFlag: boolean = false;
  isReply: boolean = false;
  public subscription: any = [];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  pageNo: number = 0;
  currentUserBadge: string = "";
  isLastPage: boolean = false;
  usersList: any[] = new Array();
  suggestions: any[] = [];
  copyOfAllSuggestion: any[] = [];
  suggestionCharacter = '';
  show: boolean;
  commentForm: FormControl = new FormControl();
  replyCommentsForm: FormControl = new FormControl();
  selectedFormId: any;
  groupingFlg = false;
  isShowCheckedItems: boolean = false;
  checkedItemsCount: number = 0;
  hideButtonText: string = "Show checked items";
  constructor(public helper: Helper, private service: DocumentForumService, public configService: ConfigService) { }

  ngOnInit() {
    if (!this.helper.isEmpty(localStorage.getItem("DocumentSpecificFormId")))
      this.selectedFormId = localStorage.getItem("DocumentSpecificFormId");
    this.suggestions = new Array();
    if (!this.isExterApproval) {
      this.configService.loadCurrentUserDetails().subscribe(res => {
        this.currentUser = res;
        let name = this.currentUser.name.split(" ");
        this.currentUserBadge = name[0].charAt(0).toUpperCase() + name[1].charAt(0).toUpperCase();
        if (null != this.constant) {
          this.documentType = this.constant;
          this.documentId = 0
          this.loadUsers(this.currentUser.projectId, this.documentType);
        }
        if (null != this.id)
          this.documentId = this.id;
        else
          this.documentId = 0;

        this.subscription.push(this.helper.steppermodel.subscribe(data => {
          if (data !== 'no data') {
            this.suggestions = new Array();
            this.documentType = (<any>data).constantName;
            this.documentId = (<any>data).documentIdentity;
            this.documentTitle = (<any>data).documentTitle;
            this.documentCode = (<any>data).code;
            this.list = new Array();
            this.loadUsers(this.currentUser.projectId, this.documentType);
          }
        }));
          this.onClickViewAll();
      });
    } else {
      this.service.loadExternalApprovalDetails(this.exterApprovalReferenceId).subscribe(res => {
        this.currentUserBadge = res.loginFullName.charAt(0).toUpperCase();
        this.currentUser.versionId = res.projectVersionId;
        this.documentType = this.constant;
        this.documentId = 0;
        this.service.getAllUsersForProjectAndDocumentType(res.globalProjectId, this.documentType).subscribe(res => {
          this.usersList = res.map(u => ({ id: u.id, value: u.userNameForFlow, type: 'user' }));
        });
          this.onClickViewAll();
      });
    }
  }

  strickComment(id: any) {
    this.spinnerFlag = true;
    this.service.strickComment(id, this.isExterApproval).subscribe(res => {
      this.spinnerFlag = false;
    });
  }
  loadUsers(projectId: any, documentType: any) {
    if (documentType === this.helper.VENDOR_VALIDATION_VALUE)
      this.selectedFormId = this.documentId;
    this.service.loadAllUsersForProjectAndDocumentType(projectId, documentType, this.selectedFormId).subscribe(res => {
      this.usersList = res.map(u => ({ id: u.id, value: u.userNameForFlow, type: 'user' }));
    });
  }
  onClickViewAll() {
    this.loadAll();
  }

  onCancel(item) {
    item.editIndividualFlag = false;
    this.list = new Array();
    this.loadAll();
  }
  loadAllForDocumentStatus(documentType) {
    return new Promise<any>(resolve => {
      try {
        this.documentType = documentType;
        this.pageNo = 0;
        this.documentId = 0;
        this.list = new Array();
        this.loadUsers(this.currentUser.projectId, this.documentType);
      } catch (error) {
        resolve('');
      }
      resolve('')
    })
  }
  loadCommentsForOtherModule() {
    this.list = new Array();
    this.commentForm.reset();
    this.replyCommentsForm.reset();
    this.loadAll();
  }
  loadCommentsForFormsWithData(documentType, documentList) {
    this.documentType = documentType;
    this.documentList = documentList;
    this.loadUsers(this.currentUser.projectId, this.documentType);
  }
  loadCommentsForForms(documentType) {
    this.documentType = documentType;
  }
  onClickShowAll() {
    this.isShowCheckedItems = !this.isShowCheckedItems;
    this.hideButtonText = this.isShowCheckedItems ? 'Hide checked items' : 'Show checked items(' + this.checkedItemsCount + ')';
    this.pageNo = 0;
    this.loadAll();
    this.list = new Array();
  }

  loadAll() {
    this.isLastPage = false;
    this.spinnerFlag = true;
    this.service.loadDocumentForum(this.documentType, this.itemId, this.documentId, this.pageNo, this.currentUser.versionId, this.isExterApproval, this.groupingFlg, this.isShowCheckedItems).subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.list = this.list.concat(response.result);
        this.isLastPage = response.isLastPage;
        this.checkedItemsCount = response.checkedItemsCount;
        this.hideButtonText = this.isShowCheckedItems ? 'Hide checked items' : 'Show checked items(' + this.checkedItemsCount + ')';
      }
    }, error => { this.spinnerFlag = false });
  }

  groupAndUnGroup(groupingFlg) {
    this.isLastPage = false;
    this.spinnerFlag = true;
    this.groupingFlg = groupingFlg;
    this.service.loadDocumentForum(this.documentType, this.itemId, this.documentId, this.pageNo, this.currentUser.versionId, this.isExterApproval, this.groupingFlg, this.isShowCheckedItems).subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.list = response.result;
        this.isLastPage = response.isLastPage;
        this.checkedItemsCount = response.checkedItemsCount;
        this.hideButtonText = this.isShowCheckedItems ? 'Hide checked items' : 'Show checked items(' + this.checkedItemsCount + ')';
      }
    }, error => { this.spinnerFlag = false });
  }

  onClickMore() {
    this.pageNo = this.pageNo + 1;
    this.loadAll();
  }

  searchSuggestions(query: string): any {
    setTimeout(() => {
      if (!query) {
        this.suggestions = new Array();
        return;
      }
      let split = query.split(this.suggestionCharacter);
      query = split[split.length - 1].trim();
      this.suggestions = this.copyOfAllSuggestion.filter(r => r.value.toLowerCase().includes(query.toLowerCase()));
    }, 100);
  }

  onSubmit() {
    if (this.comments) {
      const data: DocumentForumDTO = new DocumentForumDTO();
      const selectedDocumentList: dropDownDto[] = new Array();
      const selecteduserIds = new Array();
      let listOfComments = this.comments.split(" ");
      let userList = this.usersList ? this.usersList.map(u => u.value) : [];
      let documentList = this.documentList ? this.documentList.map(u => u.value) : [];
      let section = this.chapter ? this.chapter.map(u => u.value) : [];
      this.comments = "";
      listOfComments.forEach(e => {
        if (e.includes("@")) {
          if (userList.includes(e.replace("@", ''))) {
            this.comments += ` <b class="text-primary">` + e + "</b>";
          } else {
            this.comments += e;
          }
        } else if (e.includes("#")) {
          if (documentList.includes(e.replace("#", ''))) {
            this.comments += ` <b class="text-primary">` + e + "</b>";
          } else {
            this.comments += e;
          }
        } else if (e.includes("*")) {
          if (section.includes(e.replace("*", ''))) {
            this.comments += ` <b class="text-primary">` + e + "</b>";
          } else {
            this.comments += e;
          }
        } else {
          this.comments += " " + e;
        }

        if (e.includes("@")) {
          let element = this.usersList.filter(d => d.value == e.replace('@', ''));
          if (element.length > 0) {
            selecteduserIds.push(element[0].id);
          }
        }

        if (e.includes("#")) {
          let element = this.documentList.filter(d => d.value == e.replace('#', ''));
          if (element.length > 0) {
            const dropDown: dropDownDto = new dropDownDto();
            dropDown.key = element[0].id;
            dropDown.value = element[0].value;
            selectedDocumentList.push(dropDown);
          }
        }
      });
      data.comments = this.comments;
      data.documentId = this.documentId;
      data.documentType = this.documentType;
      data.itemId = this.itemId;
      data.documentTitle = this.documentTitle;
      data.documentCode = this.documentCode;
      data.selectedUsersList = selecteduserIds;
      data.selectedDocumentList = selectedDocumentList;
      data.referenceId = this.exterApprovalReferenceId;
      this.save(data);
    }
  }

  onReplySubmit(item: any, newComments) {
    if (newComments) {
      let listOfComments = newComments.split(" ");
      const selectedDocumentList: dropDownDto[] = new Array();
      const selecteduserIds = new Array();
      this.replyComments = "";
      let userList = this.usersList ? this.usersList.map(u => u.value) : [];
      let documentList = this.documentList ? this.documentList.map(u => u.value) : [];
      let section = this.chapter ? this.chapter.map(u => u.value) : [];
      listOfComments.forEach(e => {
        if (e.includes("@")) {
          if (userList.includes(e.replace("@", ''))) {
            this.replyComments += ` <b class="text-primary">` + e + "</b>";
          } else {
            this.replyComments += e;
          }
        } else if (e.includes("#")) {
          if (documentList.includes(e.replace("#", ''))) {
            this.replyComments += `<b class="text-primary">` + e + "</b>";
          } else {
            this.replyComments += e;
          }
        } else if (e.includes("*")) {
          if (section.includes(e.replace("*", ''))) {
            this.replyComments += ` <b class="text-primary">` + e + "</b>";
          } else {
            this.replyComments += e;
          }
        } else {
          this.replyComments += " " + e;
        }
        if (e.includes("@")) {
          let element = this.usersList.filter(d => d.value == e.replace('@', ''));
          if (element.length > 0) {
            selecteduserIds.push(element[0].id);
          }
        }

        if (e.includes("#")) {
          let element = this.documentList.filter(d => d.value == e.replace('#', ''));
          if (element.length > 0) {
            const dropDown: dropDownDto = new dropDownDto();
            dropDown.key = element[0].id;
            dropDown.value = element[0].value;
            selectedDocumentList.push(dropDown);
          }
        }
      });
      const data: DocumentForumDTO = new DocumentForumDTO();
      if (item.editIndividualFlag) {
        data.id = item.id;
        data.replyId = 0;
      } else if (item.replyFlag) {
        data.replyId = item.id;
        data.id = 0;
      }
      data.comments = this.replyComments;
      data.documentId = this.documentId;
      data.documentType = this.documentType;
      data.itemId = this.itemId;
      data.documentTitle = this.documentTitle;
      data.documentCode = this.documentCode;
      data.selectedDocumentList = selectedDocumentList;
      data.selectedUsersList = selecteduserIds;
      data.referenceId = this.exterApprovalReferenceId;
      this.save(data);
    }
  }
  save(data: any) {
    this.spinnerFlag = true;
    this.service.createDocumentForum(data, this.isExterApproval).subscribe(jsonResp => {
      this.pageNo = 0;
      this.list = [];
      this.loadAll();
      this.comments = "";
      this.replyComments = "";
      this.commentForm.reset();
      this.replyCommentsForm.reset();
      this.spinnerFlag = false;
    },
      err => {
        this.spinnerFlag = false
      }
    );
  }
  onClickLike(item: any) {
    item.userLikeFlag = !item.userLikeFlag;
    this.spinnerFlag = true;
    item.referenceId = this.exterApprovalReferenceId;
    this.service.saveuserLikes(item).subscribe(jsonResp => {
      this.pageNo = 0;
      this.list = [];
      this.loadAll();
      this.spinnerFlag = false;
    },
      err => {
        this.spinnerFlag = false
      }
    );
  }
  onCLickReply(item: any) {
    this.replyComments = "";
    this.replyCommentsForm.setValue('');
    this.list.map(data => {
      data.replyFlag = false;
      data.editIndividualFlag = false;
    });
    item.replyFlag = true;
  }
  onClickOutClose(item) {
    setTimeout(() => {
      item.replyFlag = false;
      item.editIndividualFlag = false;
    }, 500)

  }
  test() {
  }
  onClickEdit(item: any) {
    this.replyComments = "";
    item.editIndividualFlag = true;
    let comment = item.comments;
    comment = comment.replaceAll("</b>", "");
    this.replyComments = comment = comment.replaceAll("<b class=\"text-primary\">", "");
    this.replyCommentsForm.setValue(this.replyComments.trim());
  }

  suggest(event, flag) {
    this.isReply = flag;
    let inputChar = String.fromCharCode(event.charCode);
    switch (inputChar) {
      case '@':
        this.suggestions = JSON.parse(JSON.stringify(this.usersList));
        this.suggestionCharacter = inputChar;
        break;
      case '#':
        if (this.documentList) {
          this.suggestions = JSON.parse(JSON.stringify(this.documentList));
        } else {
          this.suggestions = new Array();
        }
        this.suggestionCharacter = inputChar;
        break;
      case '*':
        this.suggestionCharacter = inputChar;
        if (this.chapter) {
          this.suggestions = JSON.parse(JSON.stringify(this.chapter));
        } else {
          this.suggestions = new Array();
        }

        break;
      case ' ':
        this.suggestions = new Array();
        break;
      default:
        break;
    }
    if (this.suggestionCharacter) {
      this.show = true;
      this.copyOfAllSuggestion = JSON.parse(JSON.stringify(this.suggestions));
    }

  }

  replySelectSuggestion(s) {
    this.suggestions = this.copyOfAllSuggestion;
    this.isReply = true;
    this.replyComments = this.replyCommentsForm.value;
    this.replyComments = this.replyComments.substring(0, this.replyComments.lastIndexOf(this.getAnnotation(s.type)));
    this.replyComments = this.replyComments.concat("" + this.getAnnotation(s.type) + s.value);
    this.replyCommentsForm.patchValue(this.replyComments);
    this.show = false;
    if (this.replyCommentField)
      this.replyCommentField.nativeElement.focus();
  }

  selectSuggestion(s) {
    this.suggestions = this.copyOfAllSuggestion;
    this.isReply = false;
    this.comments = this.commentForm.value;
    this.comments = this.comments.substring(0, this.comments.lastIndexOf(this.getAnnotation(s.type)));
    this.comments = this.comments.concat(" " + this.getAnnotation(s.type) + s.value);
    this.commentForm.patchValue(this.comments);
    this.show = false;
    this.commentField.nativeElement.focus();
  }

  onClickOut() {
    if (this.commentForm.value) {
      this.comments = this.commentForm.value;
    }
  }

  onClickDelete(item) {
    var obj = this;
    obj.service.deleteDocumentForum(item).subscribe(jsonResp => {
      obj.pageNo = 0;
      obj.list = [];
      this.loadAll();
    });
  }

  getAnnotation(s) {
    switch (s) {
      case 'code':
        return '#';
      case 'chapter':
        return '*';
      case 'user':
        return '@';
    }
  }

  search(array: any[], query) {

    if (query) {
      let split = query.split('*');
      query = split[split.length - 1].trim();
      return _.filter(array, row => (row.value.toLowerCase().indexOf(query.toLowerCase()) > -1));
    }
    return array;
  }

  checkBackSpace(event) {
    var key = event.keyCode || event.charCode;
    if (key == 8 || key == 46)
      this.suggestions = new Array();
  }
}
