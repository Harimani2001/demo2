import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../../shared/config.service';
import { AddProjectsetupComponent } from '../add-projectsetup/add-projectsetup.component';
import { projectsetupService } from '../projectsetup.service';
import { dropDownDto, ProjectSetup } from '../../../models/model';
import { Helper } from '../../../shared/helper';
import { TemplatelibraryService } from '../../templatelibrary/templatelibrary.service';

@Component({
  selector: 'app-create-project-wizard',
  templateUrl: './create-project-wizard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./create-project-wizard.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class CreateProjectWizardComponent implements OnInit {
  @ViewChild('projectForWizard') projectSetup: AddProjectsetupComponent;
  projectList: any[] = new Array();
  spinnerFlag: boolean = false;
  documents: any[] = new Array();
  selectedDocumentList: dropDownDto[] = new Array();
  project = [];
  dropdownSettings = {
    singleSelection: true,
    text: "Select",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  category: String = 'projectWizard';
  currentUser: any;
  templateLibList = [];
  templateLib = [];

  constructor(public service: projectsetupService, public configService: ConfigService, private helper: Helper,
    private templatelibraryService: TemplatelibraryService) { }

  ngOnInit() {
    this.loadCurrentUserDetails();
    this.loadProjects();
  }

  loadCurrentUserDetails() {
    this.configService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
    });
  }

  loadProjects() {
    this.configService.loadProject().subscribe(response => {
      this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
    });
  }

  onChangeProject(projectId: any) {
    this.documents = new Array();
    this.projectSetup.loadProjectForWizard(projectId[0].id);
    this.configService.loadAllDocumentsForProject(projectId[0].id).subscribe(response => {
      let docmentsMap = new Map<string, dropDownDto[]>();
      docmentsMap = <any>response;
      if (docmentsMap['Document'])
        this.documents.push({ "name": "Documents", "list": docmentsMap['Document'] });
      if (docmentsMap['Form'])
        this.documents.push({ "name": "Forms", "list": docmentsMap['Form'] });
      if (docmentsMap['Form_Group'])
        this.documents.push({ "name": "Form Group", "list": docmentsMap['Form_Group'] });
      if (docmentsMap['Template'])
        this.documents.push({ "name": "Templates", "list": docmentsMap['Template'] });
    });
  }

  onClosePopup() {
    this.selectedDocumentList = [];
    this.documents.forEach(element => {
      this.selectedDocumentList = this.selectedDocumentList.concat(element.list.filter(data => data.check));
    });
    this.projectSetup.setProjectWizardSelectedDocs(this.selectedDocumentList);
  }

  addData(row, docItemList, docName) {
    if (docName === 'Documents') {
      switch (docItemList[row].key) {
        case this.helper.SP_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
            });
          break;
        case this.helper.IQTC_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
              if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
                d.check = true
            });
          break;
        case this.helper.OQTC_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
              if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
                d.check = true
            });
          break;
        case this.helper.PQTC_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
              if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
                d.check = true
            });
          break;
        case this.helper.IOQTC_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
              if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
                d.check = true
            });
          break;
        case this.helper.OPQTC_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
              if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
                d.check = true
            });
          break;
        case this.helper.RISK_ASSESSMENT_VALUE:
          if (!docItemList[row].check)
            docItemList.forEach(d => {
              if (d.key === this.helper.URS_VALUE)
                d.check = true
              if (d.key === this.helper.SP_VALUE)
                d.check = true
            });
          break;
      }
      if (docItemList[row].key === this.helper.URS_VALUE) {
        if (docItemList[row].check) {
          docItemList.forEach(d => {
            switch (d.key) {
              case this.helper.SP_VALUE:
                d.check = false;
                break;
              case this.helper.IQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OQTC_VALUE:
                d.check = false;
                break;
              case this.helper.PQTC_VALUE:
                d.check = false;
                break;
              case this.helper.IOQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OPQTC_VALUE:
                d.check = false;
                break;
              case this.helper.RISK_ASSESSMENT_VALUE:
                d.check = false;
                break;
            }
          });
        }
      }
      if (docItemList[row].key === this.helper.SP_VALUE) {
        if (docItemList[row].check) {
          docItemList.forEach(d => {
            switch (d.key) {
              case this.helper.IQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OQTC_VALUE:
                d.check = false;
                break;
              case this.helper.PQTC_VALUE:
                d.check = false;
                break;
              case this.helper.IOQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OPQTC_VALUE:
                d.check = false;
                break;
              case this.helper.RISK_ASSESSMENT_VALUE:
                d.check = false;
                break;
            }
          });
        }
      }
      if (docItemList[row].key === this.helper.RISK_ASSESSMENT_VALUE) {
        if (docItemList[row].check) {
          docItemList.forEach(d => {
            switch (d.key) {
              case this.helper.IQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OQTC_VALUE:
                d.check = false;
                break;
              case this.helper.PQTC_VALUE:
                d.check = false;
                break;
              case this.helper.IOQTC_VALUE:
                d.check = false;
                break;
              case this.helper.OPQTC_VALUE:
                d.check = false;
                break;
            }
          });
        }
      }
    }
  }

  onChangeCategory(category: any) {
    if (category && category === "templateLibrary") {
      this.templatelibraryService.loadAllTemplateLibraryForOrg(this.currentUser.orgName).subscribe(jsonResp => {
        if (jsonResp.result) {
          this.templateLibList = jsonResp.list.map(m => ({ id: +m.key, itemName: m.value }));
        }
      });
    }
  }

  onChangeTemplateLib(templateLib: any) {
    if (templateLib && templateLib.length > 0) {
      this.spinnerFlag = true;
      this.templatelibraryService.getTemplateLibraryFilePath(templateLib[0].id).subscribe(jsonResp => {
        if (jsonResp.result) {
          this.projectSetup.loadProjectForTemplateLibrary(jsonResp.filePath).then(resp => {
            this.spinnerFlag = false;
          }, error => {
            this.spinnerFlag = false;
          })
        }
      }, error => {
        this.spinnerFlag = false;
      })
    } else {
      this.projectSetup.modal = new ProjectSetup();
      this.projectSetup.startDate = "";
      this.projectSetup.endDate = "";
    }
  }

}
