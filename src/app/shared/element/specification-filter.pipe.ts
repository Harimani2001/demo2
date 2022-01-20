import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "specificationFilter"
})

export class SpecificationFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return _.filter( array, row => (row.spCode.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.spTypeValue.toLowerCase().indexOf( query.toLowerCase() ) > -1) ||
                    row.spDescription.toLowerCase().indexOf( query.toLowerCase() ) > -1 || row.ursNames.toLowerCase().indexOf( query.toLowerCase() ) > -1);
        }
        return array;
    }
}