import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
    name: "testRunFilter"
})

export class TestRunFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.testRunName.toLowerCase().indexOf( query.toLowerCase() ) > -1)
                || row.targetDate.toLowerCase().indexOf( query.toLowerCase() ) > -1
                || row.users.filter(u=>u.itemName.toLowerCase().indexOf( query.toLowerCase() ) > -1).length>0);

                
        }
        return array;
    }
}