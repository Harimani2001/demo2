import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "CalendarPipe"
} )

export class CalendarPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.title.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.createdBy.toLowerCase().indexOf( query.toLowerCase() ) > -1|| row.equipmentDto.equipmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ));
        }
        return array;
    }

}
