import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-documents-report',
  templateUrl: './documents-report.component.html',
  styleUrls: ['./documents-report.component.css']
})
export class DocumentsReportComponent implements OnInit {

  constructor(private comp: AdminComponent) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("193");
  }

}
