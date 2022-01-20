import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "auditTrailFilter"
})

export class AuditTrailFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.loginUserName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.event.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
                row.projectName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||   row.displayOrder.toLowerCase().indexOf( query.toLowerCase() ) > -1 || 
                row.uniqueDocCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 );
        }
        return array;
    }
}