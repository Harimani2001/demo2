import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "combinedFilter"
})

export class CombinedFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.ursName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.categoryName.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
                    row.priorityName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.ursCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.status.toLowerCase().indexOf(query.toLowerCase())>-1 || row.revisionNumber.toLowerCase().indexOf( query.toLowerCase() ) > -1);
        }
        return array;
    }
}