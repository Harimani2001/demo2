import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
    name: "textPipeFilter"
})

export class TextPipeLine implements PipeTransform {

    transform(array: any[], query: string): any {
        if ( query ) {
            return  _.filter( array, row => row.filter(element =>element.toLowerCase().indexOf( query.toLowerCase() ) > -1).length>0);
        }
        return array;
    }
}