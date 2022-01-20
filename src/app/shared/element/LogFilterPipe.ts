import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "LogFilterPipe"
} )

export class LogFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.stages.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.equipmentNames.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.formName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}

