import { Component, OnInit, ElementRef } from '@angular/core';
import { DashBoardService } from '../dashboard/dashboard.service';
import { NgbDateStruct } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { Projectplan } from '../../models/model';
import swal from 'sweetalert2';
import { projectPlanService } from './projectplan.service';
import { Helper } from '../../shared/helper';


@Component({
  selector: 'app-projectplan',
  
  templateUrl: './projectplan.component.html',
  styleUrls: ['./projectplan.component.css']
})
export class ProjectplanComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    
  }
}
