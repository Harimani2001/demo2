import * as _ from "lodash";
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mapFilter'})
export class MapFilterPipe implements PipeTransform {
    transform(map: Map<any, any>): any[] {
        let ret = [];
let updatedMap: Map<any, any> = new Map<any, any>();
updatedMap=map;

Object.keys(updatedMap).forEach((key: any)  => {
            ret.push({
                key: key,
                value: updatedMap[key]
            });
        });

        return ret;
    }
}
