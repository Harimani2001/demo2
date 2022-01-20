import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "ursAndSpecificationFilter"
})

export class UrsAndSpecificationFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            array = _.filter(array, row => (
                (row.code ? (row.code.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                (row.description ? (row.description.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                (row.status ? (row.status.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                row.childList.filter(r => (
                    (r.code ? (r.code.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                    (r.description ? (r.description.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                    (r.status ? (r.status.toLowerCase().indexOf(query.toLowerCase()) > -1) : false))).length > 0)
            );
            array = JSON.parse(JSON.stringify(array));
            array.forEach(data => {
                if (data.childList && data.childList.length > 0) {
                    data.childList = data.childList.filter(r => (
                        (r.code ? (r.code.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                        (r.description ? (r.description.toLowerCase().indexOf(query.toLowerCase()) > -1) : false) ||
                        (r.status ? (r.status.toLowerCase().indexOf(query.toLowerCase()) > -1) : false)))
                }
            })
        }
        return array;
    }
}