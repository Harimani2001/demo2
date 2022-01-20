import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "dynamicTemplateFilterPipe"
} )

export class DynamicTemplateFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (
             ('TEMPLATE-00' + row['masterDynamicTemplateDTO'].id).toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].templateName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].fileName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].departmentName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].templateOwnerName.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             (row['masterDynamicTemplateDTO'].remainingDays!=""?((row['masterDynamicTemplateDTO'].remainingDays+' Days').toLowerCase().indexOf( query.toLowerCase() ) > -1):false)||
             row['masterDynamicTemplateDTO'].version.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].effectiveDate.toLowerCase().indexOf( query.toLowerCase() ) > -1 ||
             row['masterDynamicTemplateDTO'].nextReviewDate.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}

