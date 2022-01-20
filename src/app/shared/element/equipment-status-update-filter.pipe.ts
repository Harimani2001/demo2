import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "EquipmentStatusPipeFilter"
} )

export class EquipmentStatusPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.equipmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.batchName.toLowerCase().indexOf( query.toLowerCase() ) > -1|| row.statusDesc.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.taskDescription.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
