import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "userFilter"
})

export class UserFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => ((row.userName ? row.userName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.email ? row.email.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.designation ? row.designation.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.departmentIdName ? row.departmentIdName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.phoneNo ? row.phoneNo.toString().toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.activeFlag === 'Y' ? 'Active' : 'In-Active').toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.roleName ? row.roleName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.locationName ? row.locationName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)));
        }
        return array;
    }
}
