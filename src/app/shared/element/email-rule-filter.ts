import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "emailRuleFilter"
})

export class EmailRuleFilter implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.ruleName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.projectName.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
                row.documentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 );
        }
        return array;
    }
}