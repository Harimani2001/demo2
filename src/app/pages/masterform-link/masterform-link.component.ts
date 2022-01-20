import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { dropDownDto, FormLinkForMasterDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { IOption } from 'ng-select';
import { resolve } from 'url';
import { async } from '@angular/core/testing';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-masterform-link',
  templateUrl: './masterform-link.component.html',
  styleUrls: ['./masterform-link.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class MasterformLinkComponent implements OnInit {
  public documentList: dropDownDto[] = new Array<dropDownDto>();
  public dto: FormLinkForMasterDTO;
  public masterFormList = new Array();
  public linkSpinnerFlag = false;
  public submitted = false;
  public simpleOption:any= new Array();
  constructor(private configService: ConfigService, private service: DynamicFormService, private router: Router) { }

  
  ngOnInit() {
    this.dto = new FormLinkForMasterDTO();
    this.linkSpinnerFlag = true;
    this.configService.loadDocBasedOnProject().subscribe(resp => {
      let array = new Array();
      this.documentList = resp.filter(doc => doc.mappingId != "Document" && doc.mappingId != "Template" && doc.mappingId != "0" && doc.mappingId != "Discrepancy_Form");
      array = this.documentList.map(option => ({ value: +option.key, label: option.value }));
      this.configService.HTTPPostAPI("", 'admin/loadFormForMainMenu').subscribe(rep => {
        array.push(...rep.map(option => ({ value: +option['constant'], label: option['title'] })));
        this.simpleOption = array;
      }, err => this.simpleOption = array);

    });
  
    this.service.loadMasterFormForDropDown().subscribe(resp => {
      this.masterFormList = resp;
      this.linkSpinnerFlag = false;
    })

  }

  /**
   * 
   * @param documentType => Form Type
   */
  loadLinkedMasterForm(documentType) {
    this.linkSpinnerFlag = true;
    this.submitted = false;
    this.service.loadLinkedMasterForm(documentType).subscribe(resp => {
      this.dto = resp;
      this.dto.documentType = documentType;
      this.linkSpinnerFlag = false;
    });
  }

  /**
   * 
   * @param valid => validate the form 
   */
  save(valid) {
    this.submitted = true;
    this.linkSpinnerFlag = true;
    if (valid) {
      this.dto.documentName = this.documentList.filter(d => d.key == this.dto.documentType)[0].value;
      this.dto.linkedMasterFormNames = this.masterFormList
        .filter(d => this.dto.linkedMasterForm.indexOf(d.value) != -1)
        .map(d => d.label)
        .sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .join(",");
      this.service.saveLinkedMasterForm(this.dto).subscribe((resp: Response) => {
        this.linkSpinnerFlag = false;
        if (resp.status == 200) {
          swal({
            title: (this.dto.id != 0 ? 'Updated' : 'Saved') + ' Successfully!',
            text: ' Record has been ' + (this.dto.id != 0 ? 'Updated.' : 'Saved.'),
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              this.loadLinkedMasterForm(this.dto.documentType);
            }
          });
        } else {
          swal({
            title: 'Error in ' + (this.dto.id != 0 ? 'Updating!' : 'Saving!'),
            text: ' Record has not been ' + (this.dto.id != 0 ? 'Updated' : 'Saved'),
            type: 'error', timer: 2000
          });
        }
      }, err => {
        this.linkSpinnerFlag = false
        swal({
          title: 'Error in ' + (this.dto.id != 0 ? 'Updating!' : 'Saving!'),
          text: ' Record has not been ' + (this.dto.id != 0 ? 'Updated' : 'Saved'),
          type: 'error', timer: 2000
        });
      });
    } else {
      this.linkSpinnerFlag = false;
      return;
    }

  }

  cancel() {
    this.router.navigate(['/MainMenu']);
  }

   linkedMFWithProjectJsonCreation(ids:any[],list:Array<IOption>){
    this.dto.linkedMFWithProject=new Array();
    let selectedList=list.filter(option=>ids.indexOf(option.value)!=-1)
     for (let index = 0; index < selectedList.length; index++) {
      const ele = selectedList[index];
      let json = {
        'linkedFormName': ele.label, 'linkedFormId': ele.value,
        'project': new Array<string>()
      }
       this.loadProjectListWhereDocumentExists(ele['constant']).then(resp => {
         json['projectList'] = resp;
       })
       this.dto.linkedMFWithProject.push(json);
     }
    
  }

  loadProjectListWhereDocumentExists(documentType): any {
    return new Promise<any[]>(resolve => {
      this.configService.HTTPPostAPI(documentType, 'workflowConfiguration/loadProjectListWhereDocumentExists').subscribe(resp => {
        resolve(resp);
      }, err => {
        resolve(new Array());
      });
    });
  }
}
