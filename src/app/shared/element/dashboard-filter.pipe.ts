import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "DashboardFilterPipe"
})

export class DashboardFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.docName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ));
        }
        return array;
    }
}