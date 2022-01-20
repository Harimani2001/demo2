import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "InventoryReportFilterPipe"
})

export class InventoryReportFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.projectName.toLowerCase().indexOf(query.toLowerCase()) > -1
                ||( row.projectCode && row.projectCode.toLowerCase().indexOf(query.toLowerCase()) > -1)
                || row.departmentName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.systemOwnerName != null ? row.systemOwnerName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.businessOwnerName != null ? row.businessOwnerName.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.introduction != null ? row.introduction.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.createdBy != null ? row.createdBy.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.purposeAndScope != null ? row.purposeAndScope.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.description != null ? row.description.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.startDate != null ? row.startDate.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.endDate != null ? row.endDate.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
            ));
        }
        return array;
    }

}

