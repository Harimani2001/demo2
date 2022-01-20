import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "LocationFilterPipe"
})

export class LocationFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.code.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.name.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.active == "Y" ? "Active" : "In-Active").toLowerCase().indexOf(query.toLowerCase()) > -1));
        }
        return array;
    }

}

