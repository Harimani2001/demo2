import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "FacilityFilterPipe"
} )

export class FacilityFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ( row.name.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.locationName.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.equipmentNames.toLowerCase().indexOf( query.toLowerCase() ) > -1 || (row.active=="Y"?"Active":"In-Active").toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
