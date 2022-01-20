import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "TracebilityDetailFilterPipe"
} )

export class TracebilityDetailFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ( row.ursCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.priority.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.testRunName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.category.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.requirement.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
