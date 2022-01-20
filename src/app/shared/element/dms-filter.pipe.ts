import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "DmsFilterPipe"
})

export class DmsFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => ((row.name ? row.name.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.date ? row.date.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)));
        }
        return array;
    }

}

