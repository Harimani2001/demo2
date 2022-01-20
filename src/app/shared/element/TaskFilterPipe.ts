import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "TaskFilterPipe"
} )

export class TaskFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => ( row.taskTitle.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
            row.priority.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.selectedUserNames.toLowerCase().indexOf( query.toLowerCase() ) > -1||
            row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1 ));
        }
        return array;
    }

}
