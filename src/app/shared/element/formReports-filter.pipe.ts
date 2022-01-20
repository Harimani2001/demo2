import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "FormReportsFilterPipe"
} )

export class FormReportsFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.dynamicFormCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1
             || row.createdByName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.updatedByName.toLowerCase().indexOf( query.toLowerCase() ) > -1
             || row.equipmentNames.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
