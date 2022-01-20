import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "PriorityFilterPipe"
} )

export class PriorityFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.priorityCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.priorityName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
