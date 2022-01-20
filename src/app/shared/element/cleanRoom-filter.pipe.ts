import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "CleanRoomFilter"
})

export class CleanRoomFilter implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => (row.cleanRoomCode.toLowerCase().indexOf(query.toLowerCase()) > -1
                || row.roomName.toLowerCase().indexOf(query.toLowerCase()) > -1
                || (row.roomNo ? row.roomNo.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.classification ? row.classification.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.building ? row.building.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.floor ? row.floor.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)
                || (row.workflowStatus ? row.workflowStatus.toLowerCase().indexOf(query.toLowerCase()) > -1 : false)));
        }
        return array;
    }

}

