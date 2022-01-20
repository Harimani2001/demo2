import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "EquipmentFilterPipe"
})

export class EquipmentFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.code.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            row.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            row.qualificationStatus.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
            row.dateOfPurchase.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
            row.activeString.toLowerCase().indexOf(query.toLowerCase()) > -1));
        }
        return array;
    }

}
