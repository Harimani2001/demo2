import { Component, OnInit } from '@angular/core';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-timeline-graph',
  templateUrl: './timeline-graph.component.html',
  styleUrls: ['./timeline-graph.component.css']
})
export class TimelineGraphComponent implements OnInit {
  documentList: any[];
  spinner: boolean = false;
  constructor(public project: projectsetupService, private comp: AdminComponent) { }

  ngOnInit() {
    this.spinner = true;
    this.comp.setUpModuleForHelpContent("197");
    this.project.loadAllDocumentofproject().subscribe(result => {
      if (result.result == 'success') {
        this.documentList = result.projectApprovalsCount;
        this.spinner = false;
      }
    }, error => { this.spinner = false });
  }

}
