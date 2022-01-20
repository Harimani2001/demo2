import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "CategoryFilterPipe"
} )

export class CategoryFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.categoryName.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
