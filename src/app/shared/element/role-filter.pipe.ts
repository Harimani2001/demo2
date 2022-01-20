import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "RoleFilterPipe"
})

export class RoleFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.roleName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (''+row.id).toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.activeFlag ? 'Active' : 'In-Active').toLowerCase().indexOf(query.toLowerCase()) > -1));
        }
        return array;
    }

}
