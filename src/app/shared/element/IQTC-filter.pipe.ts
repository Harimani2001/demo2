import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "IqtcPipeFilter"
} )

export class IqtcPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if (query) {
            return _.filter(array, row => ((row.status ? row.status.toLowerCase().indexOf(query.toLowerCase()) > -1 : false) ||
             row.testCaseCode.toLowerCase().indexOf(query.toLowerCase()) > -1 || (row.testRunName &&  row.testRunName.toLowerCase().indexOf( query.toLowerCase() ) > -1)||
             row.description.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.approvedStatus && row.approvedStatus.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                 (row.status ? (row.status === (query.toLowerCase().trim() === "norun" ? "" : query.toLowerCase())) : false)
                 || (row.environment &&  row.environment.toLowerCase().indexOf( query.toLowerCase() ) > -1)
                 || (row.acceptanceCriteria &&  row.acceptanceCriteria.toLowerCase().indexOf( query.toLowerCase() ) > -1)
                 || (row.expectedResult &&  row.expectedResult.toLowerCase().indexOf( query.toLowerCase() ) > -1)
                || row.status && (row.status != "" ? (row.status.toLowerCase().indexOf(query.toLowerCase()) > -1) : ("no run".indexOf(query.toLowerCase()) > -1)));
        }
        return array;
    }

}
