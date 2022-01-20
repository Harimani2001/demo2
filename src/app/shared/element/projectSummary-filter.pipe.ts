import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "ProjectSummaryFilterPipe"
})

export class ProjectSummaryFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.category.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.documentCode.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
                row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||   row.updatedByName.toLowerCase().indexOf( query.toLowerCase() ) > -1 );
        }
        return array;
    }
}