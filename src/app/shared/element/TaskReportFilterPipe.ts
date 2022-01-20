import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "TaskReportFilterPipe"
} )

export class TaskReportFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ( row.projectName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.category.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.userName.toLowerCase().indexOf( query.toLowerCase() ) > -1||
            row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.title.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.equipmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1  ||row.priority.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
