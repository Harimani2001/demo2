import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "CCFPipe"
} )

export class CCFPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ( row.deptName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.userNames.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.priorityName.toLowerCase().indexOf( query.toLowerCase() ) > -1||
            row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1 ));
        }
        return array;
    }

}
