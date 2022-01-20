import { Component, OnInit, ViewChild,EventEmitter,Output, Input, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
@Component({
  selector: 'app-compliance-assesment-modal',
  templateUrl: './compliance-assesment-modal.component.html',
  styleUrls: ['./compliance-assesment-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ComplianceAssesmentModalComponent implements OnInit {
  @ViewChild('complianceAssesmentModal') complianceAssesmentModal:ModalBasicComponent;
  @Output() onSubmit = new EventEmitter<any>();
  @Input() selectedList: any;
  isSave: boolean=false;
  complianceRequirements:any[]=new Array();
  spinnerFlag:boolean=false;
  ursId: any;
  constructor(public config: ConfigService,public helper:Helper) { }

  ngOnInit(): void {
    
  }
  viewModal(){
    this.loadComplianceRequirements();
    this.isSave=false;
    this.complianceAssesmentModal.show();
  }
  viewModalWithData(selectedList,ursId:any){
    this.isSave=true;
    this.selectedList=selectedList;
    this.ursId=ursId;
    this.loadComplianceRequirements();
    this.complianceAssesmentModal.show();
  }
  
  loadComplianceRequirements() {
    this.config.HTTPGetAPI("complianceAssessment/loadAllCompliancesForUrs").subscribe(response => {
      this.complianceRequirements = response.result;
      if(this.selectedList){
        this.complianceRequirements.forEach(e1 =>{
          this.selectedList.forEach(e2 => {
            if(e1.id === e2.id)
              e1.selected=true;
          });
        })
      }
    });
  }
  selectCompliance(row) {
    this.complianceRequirements.filter(f => f.id == row.id).forEach(data => {
      row.selected ? (data.selected = false) : (data.selected = true);
    })
  }

  onSubmitCR(){
    this.onSubmit.emit(this.complianceRequirements.filter(d => d.selected));
    this.complianceAssesmentModal.hide();
  }

  saveComplianceRequirements(){
    let selectedList=this.complianceRequirements.filter(d => d.selected).map(option => ({ id: option.id, itemName: option.category }));;
    this.spinnerFlag=true;
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          let userRemarks = "Comments : " + value;
          this.config.HTTPPostAPI(selectedList,"urs/saveComplianceRequirements/"+this.ursId+"/"+userRemarks).subscribe(response => {
            this.spinnerFlag=false;
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'Compliance Requirements Updated Successfully',
              onClose: () => {
                this.onSubmit.emit(selectedList);
                this.complianceAssesmentModal.hide();
              }
            });
          });
        } else {
          this.spinnerFlag=false;
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
        }
      }).catch(err=>{
        this.spinnerFlag=false;
      });
  }
}
