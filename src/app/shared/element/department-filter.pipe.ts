import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "DepartmentFilterPipe"
})

export class DepartmentFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.departmentName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.departmentCode.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (null != row.locationName ? (row.locationName.toLowerCase().indexOf(query.toLowerCase()) > -1) : false)));
        }
        return array;
    }

}
