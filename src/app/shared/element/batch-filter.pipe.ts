import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: "BatchPipeFilter"
} )

export class BatchPipeFilter implements PipeTransform {

    transform( array: any[], query: string ): any {
        if ( query ) {
            return _.filter( array, row => (row.productName.toLowerCase().indexOf( query.toLowerCase() ) > -1 
            || row.equipmentNames.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.status.toLowerCase().indexOf( query.toLowerCase() ) > -1 
            || row.batchNumber.toLowerCase().indexOf( query.toLowerCase() ) > -1
            || row.batchQuantity===Number(query)));
        }
        return array;
    }
    
}
