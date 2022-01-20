import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "EquipmentCalendarPipe"
} )

export class EquipmentCalendarPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.equipmentDto.equipmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.title.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            (row.status!=null ? (row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1) : false) ||
            row.createdBy.toLowerCase().indexOf( query.toLowerCase() ) > -1||
            (row.end!=null ? (row.end.toLowerCase().indexOf( query.toLowerCase() ) > -1) : false)||
            (row.equipmentDto.remainingDays!=null ? ((''+row.equipmentDto.remainingDays).toLowerCase().indexOf( query.toLowerCase() ) > -1) : false)
            ));
        }
        return array;
    }

}
