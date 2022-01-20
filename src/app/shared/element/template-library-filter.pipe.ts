import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "TemplateLibraryFilterPipe"
} )

export class TemplateLibraryFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.projectName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.projectType.toLowerCase().indexOf( query.toLowerCase() ) > -1|| row.equipment.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }
}
