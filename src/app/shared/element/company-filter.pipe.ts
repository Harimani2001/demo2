import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "companyFilter"
} )

export class CompanyFilterPipe implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.organizationName.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.organizationEmail.toLowerCase().indexOf( query.toLowerCase() ) > -1));
        }
        return array;
    }

}
