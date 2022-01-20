import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { IQTCService } from '../iqtc/iqtc.service';
import { Helper } from './../../shared/helper';

@Component({
  selector: 'app-screen-shot',
  templateUrl: './screen-shot.component.html',
  styleUrls: ['./screen-shot.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ScreenShotComponent implements OnInit {

  imageURL:any;
  testCaseCode:any;
  id:any;
  spinnerFlag = false;
  isDf:any;
  @ViewChild('modalViewer') modalOverflow:any;
  @Output() valueChange = new EventEmitter();

  constructor(public service: IQTCService, public helper: Helper) { }

  ngOnInit() {
  }

  reload(){
    this.valueChange.emit('true');
  }

  screenShot(testCaseCode,id,isDf){
    this.testCaseCode = testCaseCode;
    this.id = id;
    this.isDf = isDf;
    this.modalOverflow.show();
  }

  uploadImage(){
    this.spinnerFlag = true;
    this.service.saveScreenShotImage(this.imageURL, this.testCaseCode, this.id, this.isDf).subscribe(jsonResp => {
        if (jsonResp.result === "success") {
            status = "success";
            swal({
                title:'Upload Successfully!',
                text:' Image has been uploaded.',
                type:'success',
                timer:this.helper.swalTimer,
                showConfirmButton:false
            });
            this.spinnerFlag = false;
            this.modalOverflow.hide();
            this.reload();
        }else{
            swal({
                title:'Upload Failed!',
                text:' Image has not been uploaded. Try again!',
                type:'error',
                timer:this.helper.swalTimer,
                showConfirmButton:false
            }

            );
            this.spinnerFlag = false;
        }
    });
}

}
