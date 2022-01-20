import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "LogUserFilterPipe"
} )

export class LogUserFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.equipmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.userNames.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.templateName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}

