import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "UnscriptedPipeFilter"
} )

export class UnscriptedPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if (query) {
            return _.filter(array, row => ((row.status ? row.status.toLowerCase().indexOf(query.toLowerCase()) > -1 : false) ||
             row.testCaseCode.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
             (row.expectedResult &&  row.expectedResult.toLowerCase().indexOf( query.toLowerCase() ) > -1)||
             row.description.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.businessImpact && row.businessImpact.toLowerCase().indexOf(query.toLowerCase()) > -1) );
        }
        return array;
    }

}
