/**
 * Text input class
 * Output a <input type="text" ... /> form element
 */

import {control} from "../control";

export default class controlText extends control {

  /**
   * class configuration
   */
  static get definition() : any {
    return {
      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        date: 'dateField',
        file: 'fileUpload',
        "datetime-local":'dateTimeField',
        time:'timeField'
      },
    };
  }

  /**
   * build a text DOM element, supporting other jquery text form-control's
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    return this.markup('input', null,this.config);
  }

}

// register this control for the following types & text subtypes
control.register(['text', 'file','number', 'date','datetime-local','time','hidden'], controlText);
control.register(['Text', 'Email', 'Mobile'], controlText, 'text');
