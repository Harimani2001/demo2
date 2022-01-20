import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "ModulePermissionFilter"
} )

export class ModulePermissionFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.moduleName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}