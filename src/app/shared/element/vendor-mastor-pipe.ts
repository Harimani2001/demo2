import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "VendorMasterFilterPipe"
} )

export class VendorMasterFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.code.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.name.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.email.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || (row.website!=null ? (row.website.toLowerCase().indexOf( query.toLowerCase() ) > -1) : false)
            || (row.projectNames!=null ? (row.projectNames.toLowerCase().indexOf( query.toLowerCase() ) > -1) : false)
            || row.userName.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.displayUpdatedTime.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
