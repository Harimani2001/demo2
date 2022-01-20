import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "RiskFilterPipe"
})

export class RiskFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.assessmentCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.riskFactor.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
            row.probabilityOfOccuranceName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.probabilityOfOccurance.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.severity.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.severityName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || 
            row.detectability.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.detectabilityName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || 
            row.rpn==Number(query) || row.critical==Number(query) || row.priorityName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.status.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }
        return array;
    }
}