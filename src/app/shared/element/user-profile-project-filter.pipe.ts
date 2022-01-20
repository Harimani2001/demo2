import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "userProfileProjectFilter"
} )

export class userProfileProjectFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ((row.projectCode && row.projectCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 )||
             row.projectName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.locationName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.startDate.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row.endDate.toLowerCase().indexOf( query.toLowerCase() ) > -1
            ));
        }
        return array;
    }

}
