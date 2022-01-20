import { Component, OnInit, Input } from '@angular/core';
import { Helper } from '../../shared/helper';
import { GobalTraceabilitymatrixService } from './gobal-traceability-matrix.service';

@Component({
  selector: 'app-gobal-traceability-matrix',
  templateUrl: './gobal-traceability-matrix.component.html',
  styleUrls: ['./gobal-traceability-matrix.component.css']
})
export class GobalTraceabilityMatrixComponent implements OnInit {
  spinnerFlag: boolean = false;
  public traceabilityData:any[]= new Array();
  @Input() public testCaseId:string;
  filterData: any=[];
  constructor(private gobaltraceservice:GobalTraceabilitymatrixService, public helper: Helper) { }

  ngOnInit(){
    this.spinnerFlag = true;
    this.gobaltraceservice.getTraceDetailData(this.testCaseId).subscribe(resp =>{
      this.spinnerFlag = false;
      resp.forEach(element => {
        this.filterData=[];
        element.ursInfo.sort((a,b)=>b.documentCode.localeCompare(a.documentCode));
        for (var key in element.riskInfo) {
        let data = { 'name': key, 'dto': element.riskInfo[key]}
        this.filterData.push(data);
        }
        this.filterData.sort((a,b)=>b.name.localeCompare(a.name))
        element.riskInfo=this.filterData;
      });
      this.traceabilityData = resp;
   },(err)=>{
      this.spinnerFlag = false;
   });
 }
}
