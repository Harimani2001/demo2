import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "RoomSpecFilter"
})

export class RoomSpecFilter implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => ((row.category ? row.category.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.subCategory ? row.subCategory.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.field ? row.field.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.value ? row.value.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.obeservation ? row.obeservation.toLowerCase().indexOf(query.toLowerCase()) > -1 : false) ));
        }
        return array;
    }

}

