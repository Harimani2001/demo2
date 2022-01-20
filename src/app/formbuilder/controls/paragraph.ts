import {control} from '../control';
import utils from '../utils';
/**
 * Text input class
 * Output a <input type="text" ... /> form element
 */
export default class controlParagraph extends control {


  static get definition() : any {
    return {
      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        newline: 'New Line'
      },
    };
  }

    /**
   * build a paragraph DOM element
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    let {type, ...attrs} = this.config;
    // some types use an element of a different name
    let typeMap = {
      'paragraph': 'p',
      'header': this.subtype,
      'newline':'hr',
      'section':'section'
    };
    if (typeMap[type]) {
      type = typeMap[type];
    }
    return {
      field: this.markup(type, utils.parsedHtml(this.label), attrs),
      layout: 'noLabel'
    };
  }
}

// register the following controls
control.register(['header','newline','section'], controlParagraph);
//control.register(['p', 'address', 'blockquote', 'canvas', 'output'], controlParagraph, 'paragraph');
control.register(['h1', 'h2', 'h3'], controlParagraph, 'header');
