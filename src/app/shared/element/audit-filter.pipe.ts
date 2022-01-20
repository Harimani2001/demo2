import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "auditFilter"
})

export class AuditFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.documentCode.toLowerCase().indexOf( query.toLowerCase() ) > -1)
                || row.testCaseName.toLowerCase().indexOf(query.toLowerCase())>-1 || row.dfStatus.toLowerCase().indexOf( query.toLowerCase() ) > -1);
        }
        return array;
    }
}