import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "TraceabilityFilter"
} )

export class TraceabilityFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row =>(
                row.priority && row.priority.toLowerCase().indexOf( query.toLowerCase() ) > -1||
             row.ursName && row.ursName.toLowerCase().indexOf( query.toLowerCase() ) > -1||
             row.ursCode && row.ursCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.testingRequired && row.testingRequired.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.ursDescription && row.ursDescription.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.category.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.testingMethod && row.testingMethod.toLowerCase().indexOf( query.toLowerCase() ) > -1
             
        ));
        }
        return array;
    }
}
