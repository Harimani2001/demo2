import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "workFlowFilter"
} )

export class WorkFlowFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if (query) {
            return _.filter(array, row => (row['masterDynamicFormDTO'].templateName.toLowerCase().indexOf(query.toLowerCase()) > -1) || (("FORM-00" + row['masterDynamicFormDTO'].id).toLowerCase().indexOf(("FORM-00" + query).toLowerCase()) > -1)
                || (("" + row['masterDynamicFormDTO'].id).indexOf("" + query) > -1
                    || (("" + row['masterDynamicFormDTO'].remainingDays).indexOf("" + query) > -1)
                    || row['masterDynamicFormDTO'].departmentName && row['masterDynamicFormDTO'].departmentName.toLowerCase().indexOf(query.toLowerCase()) > -1
                    || row['masterDynamicFormDTO'].templateOwnerName && row['masterDynamicFormDTO'].templateOwnerName.toLowerCase().indexOf(query.toLowerCase()) > -1
                    || row['masterDynamicFormDTO'].version && row['masterDynamicFormDTO'].version.toLowerCase().indexOf(query.toLowerCase()) > -1
                    || row['masterDynamicFormDTO'].effectiveDate && row['masterDynamicFormDTO'].effectiveDate.toLowerCase().indexOf(query.toLowerCase()) > -1
                    || row['masterDynamicFormDTO'].nextReviewDate && row['masterDynamicFormDTO'].nextReviewDate.toLowerCase().indexOf(query.toLowerCase()) > -1)
                    || row['masterDynamicFormDTO'].formType && row['masterDynamicFormDTO'].formType.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }

        
        return array;
    }

}
