import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { OrganizationDetails } from '../../models/model';

@Component({
    selector: 'app-org-profile',
    templateUrl: './org-profile.component.html',
    styleUrls: ['./org-profile.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class OrgProfileComponent implements OnInit {
    organization:OrganizationDetails;
    modulesViewFlag:boolean=false;
    statisticsViewFlag:boolean=false;
    modulesList:any;
    chartList:any=new Array();
    spinnerFlag:boolean=false;
    constructor(public helper:Helper,public configService:ConfigService) { }

    ngOnInit() {
        this.spinnerFlag=true;
        this.configService.loadCurrentUserDetails().subscribe(res =>{
            this.configService.HTTPPostAPI(res.orgId,"organization/loadOrganizationDetailsById").subscribe(resp =>{
                this.organization=resp;
                this.spinnerFlag=false;
            })
        });
    }
    loadModules(){
        this.spinnerFlag=true;
        this.configService.HTTPGetAPI("organization/loadOrganizationModules/"+this.organization.id).subscribe(resp =>{
            this.modulesList=resp;
            this.spinnerFlag=false;
        });
    }

    loadStatistics(){
        this.chartList=[];
        this.spinnerFlag=true;
        this.configService.HTTPGetAPI("organization/loadOrganizationStatistics/"+this.organization.id).subscribe(resp =>{
           if(+resp.totalP > 0){
            let data={
                title:"Projects("+resp.createdP+"/"+resp.totalP+")",
                data:{
                    chartType: 'PieChart',
                    dataTable: [
                      ['Total', 'Used'],
                      ['Total',  +resp.totalP],
                      ['Used',  resp.createdP],
                    
                    ]
                }
              }
              this.chartList.push(data);
           }
           if(+resp.totalU > 0){
            let data={
                title:"Users("+resp.createdU+"/"+resp.totalU+")",
                data:{
                    chartType: 'PieChart',
                    dataTable: [
                      ['Total', 'Used'],
                      ['Total',  +resp.totalU],
                      ['Used',  resp.createdU],
                    
                    ]
                }
              }
              this.chartList.push(data);
           }
           if(+resp.totalF > 0){
            let data={
                title:"Forms("+resp.createdF+"/"+resp.totalF+")",
                data:{
                    chartType: 'PieChart',
                    dataTable: [
                      ['Total', 'Used'],
                      ['Total',  +resp.totalF],
                      ['Used',  resp.createdF],
                    
                    ]
                }
              }
              this.chartList.push(data);
           }
           if(+resp.totalE > 0){
            let data={
                title:"Equipments("+resp.createdE+"/"+resp.totalE+")",
                data:{
                    chartType: 'PieChart',
                    dataTable: [
                      ['Total', 'Used'],
                      ['Total',  +resp.totalE],
                      ['Used',  resp.createdE],
                    
                    ]
                }
              }
              this.chartList.push(data);
           }
           if(+resp.totalS > 0){
            let data={
                title:"Storage("+resp.createdS+"/"+resp.totalS+")",
                data:{
                    chartType: 'PieChart',
                    dataTable: [
                      ['Total', 'Used'],
                      ['Total',  resp.totalS],
                      ['Used',  +resp.createdS.split("")[0]],
                    ]
                }
              }
              this.chartList.push(data);
           }
           console.log(this.chartList);
           this.spinnerFlag=false;
        });
    }
}