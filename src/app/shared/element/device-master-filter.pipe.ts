import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "DeviceMasterFilterPipe"
} )

export class DeviceMasterFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.assetId.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.deviceIPaddress.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.deviceOS.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.deviceMCid.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.purchaseDate ? (row.purchaseDate.toLowerCase().indexOf( query.toLowerCase() ) > -1) : false ||
            (row.activeFlage?"Active":"In-Active").toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
