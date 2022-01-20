import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "lookUpFilter"
})

export class LookUpFilterPipe implements PipeTransform {
   
    transform(value: any, args?: string): any {

        

        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter(function(item){
           // return JSON.stringify(item).toLowerCase().includes(args);

           return  item.value && item.value.toLowerCase().includes(args) || item.key && item.key.toLowerCase().includes(args) || item.displayOrder && item.displayOrder.toLowerCase().includes(args);
        });
    }
}