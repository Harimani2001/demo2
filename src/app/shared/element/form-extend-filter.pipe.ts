import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "formExtendFilter"
})

export class FormExtendFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.documentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
              row.updatedByName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }
}