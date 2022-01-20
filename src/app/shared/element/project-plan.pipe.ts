import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "projectPlan"
} )

export class projectPlan implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.documentName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
