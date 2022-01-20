import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Helper } from '../../shared/helper';

@Component({
    selector: 'app-urs-spec-risk-view',
    templateUrl: './urs-spec-risk-view.component.html',
    styleUrls: ['./urs-spec-risk-view.component.css'],
    
})
export class UrsSpecRiskViewComponent implements OnInit {

    @Input() public dataList: any;
    @Input('id')
    public id: any;
    @Input('backUrl')
    public backUrl: any;

    @Input('constant')
    public constant: any;
    constructor(public helper: Helper,private router:Router) { }

    ngOnInit() {

    }
    redirect(row) {
        let roleBack = this.id
        this.router.navigate([row.url],
            {
                queryParams: {
                    id: row.id,
                    status: this.backUrl,
                    roleBack: roleBack,
                    roleBackId: this.id
                },
                skipLocationChange: true
            });
    }

}
