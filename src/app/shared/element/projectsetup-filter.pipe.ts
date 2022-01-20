import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "projectsetupFilter"
} )

export class ProjectsetupFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if (query) {
            return _.filter(array, row => ((row.projectCode && row.projectCode.toLowerCase().indexOf(query.toLowerCase()) > -1 )||
                row.projectName.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                (row.systemOwnerName != null ? (row.systemOwnerName.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                (row.locationName != null ? (row.locationName.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                (row.startDate && row.startDate.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                (row.endDate && row.endDate.toLowerCase().indexOf(query.toLowerCase()) > -1)
            ));
        }
        return array;
    }

}
