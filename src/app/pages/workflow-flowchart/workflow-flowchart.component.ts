import { Component, OnInit, Input } from '@angular/core';
import { CommonModel } from '../../models/model';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';

@Component({
  selector: 'app-workflow-flowchart',
  templateUrl: './workflow-flowchart.component.html',
  styleUrls: ['./workflow-flowchart.component.css']
})
export class WorkflowFlowchartComponent implements OnInit {
  @Input() public workFlowChartData = null;
  constructor(private workFlowConfigurationService: WorkflowConfigurationService) { }

  ngOnInit() {
  }
  
  loadAllDataForDocumentForProject(projectId: any, documentConstant: any) {
    const modal: CommonModel = new CommonModel();
    modal.projectSetupconstantName = documentConstant;
    modal.projectSetupProjectId = projectId;
    this.workFlowConfigurationService.loadAllWorkFlowSettingDataForDocumentForProject(modal).subscribe(resp => {
      this.workFlowChartData = resp.result
    })
  }

}