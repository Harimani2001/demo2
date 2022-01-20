import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dyanmicFormFilter"
})

export class DynamicFilterPipe implements PipeTransform {

    transform(array: any[], query: string, fromDate?: any, toDate?: any,publishedToggle?:any): any {
        if (query) {
            array = _.filter(array, row => ((row.reportNumber &&row.reportNumber.toLowerCase().indexOf( query.toLowerCase() ) > -1 )||
                row.dynamicFormCode.toLowerCase().indexOf(query.toLowerCase()) > -1 || row.status.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.createdByName.toLowerCase().indexOf(query.toLowerCase()) > -1 || row.updatedByName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.equipmentName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.templateName && row.templateName.toLowerCase().indexOf(query.toLowerCase()) > -1)));
        }
        // if (toDate && fromDate && fromDate.jsdate && toDate.jsdate) {
        //     toDate.jsdate.setHours(23,59,59);
        //     array = _.filter(array, row => (fromDate.jsdate.getTime() <= new Date(row.updatedTime).getTime()) && (toDate.jsdate.getTime() >= new Date(row.updatedTime).getTime()));
        // }
        array =  (publishedToggle) ? _.filter(array, row =>(row.status.toLowerCase()==='completed')) : _.filter(array, row =>(row.status.toLowerCase()!= 'completed'))
        return array;
    }

  

}