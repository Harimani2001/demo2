import controlText from './text';

 export default class controlFineUploader extends controlText {

    private handler: any | string;
    private input: any;
    private wrapper: any;
    private fineTemplate: any;


  /**
   * Class configuration - return the icons & label related to this control
   * @return {Object} definition object
   */
  static get definition() {
    return {
      i18n: {
        default: 'Fine Uploader'
      }
    };
  }

  /**
   * configure the fineupload default settings & allow for controlConfig options
   */
  configure() {
    this.js = this.classConfig.js || '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.14.2/jquery.fine-uploader/jquery.fine-uploader.min.js';
    this.css = [
      this.classConfig.css || '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.14.2/jquery.fine-uploader/fine-uploader-gallery.min.css',
      {
        type: 'inline',
        id: 'fineuploader-inline',
        style: `
          .qq-uploader .qq-error-message {
            position: absolute;
            left: 20%;
            top: 20px;
            width: 60%;
            color: #a94442;
            background: #f2dede;
            border: solid 1px #ebccd1;
            padding: 15px;
            line-height: 1.5em;
            text-align: center;
            z-index: 99999;
          }
          .qq-uploader .qq-error-message span {
            display: inline-block;
            text-align: left;
          }`
      }
    ];
    this.handler = this.classConfig.handler || '/upload';
    ['js', 'css', 'handler'].forEach(key => delete this.classConfig[key]);

    // fineuploader template that needs to be defined for the UI
    let template = this.classConfig.template || `
      <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
        <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
        </div>
        <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
          <span class="qq-upload-drop-area-text-selector"></span>
        </div>
        <div class="qq-upload-button-selector qq-upload-button">
          <div>Upload a file</div>
        </div>
        <span class="qq-drop-processing-selector qq-drop-processing">
          <span>Processing dropped files...</span>
          <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
        </span>
        <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
          <li>
            <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
            <div class="qq-progress-bar-container-selector qq-progress-bar-container">
              <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
            </div>
            <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
            <div class="qq-thumbnail-wrapper">
              <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
            </div>
            <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
            <button type="button" class="qq-upload-retry-selector qq-upload-retry">
              <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
              Retry
            </button>
            <div class="qq-file-info">
              <div class="qq-file-name">
                <span class="qq-upload-file-selector qq-upload-file"></span>
                <span class="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
              </div>
              <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
              <span class="qq-upload-size-selector qq-upload-size"></span>
              <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
              </button>
              <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
              </button>
              <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
              </button>
            </div>
          </li>
        </ul>
        <dialog class="qq-alert-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <div class="qq-dialog-buttons">
            <button type="button" class="qq-cancel-button-selector">Close</button>
          </div>
        </dialog>
        <dialog class="qq-confirm-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <div class="qq-dialog-buttons">
            <button type="button" class="qq-cancel-button-selector">No</button>
            <button type="button" class="qq-ok-button-selector">Yes</button>
          </div>
        </dialog>
        <dialog class="qq-prompt-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <input type="text">
          <div class="qq-dialog-buttons">
            <button type="button" class="qq-cancel-button-selector">Cancel</button>
            <button type="button" class="qq-ok-button-selector">Ok</button>
          </div>
        </dialog>
      </div>`;
    this.fineTemplate = $('<div/>')
      .attr('id', 'qq-template')
      .html(template);
  }

  /**
   * build a div DOM element with id
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    this.input = this.markup('input', null, {type: 'hidden', name: this.config.name, id: this.config.name,label:this.config.label});
    this.wrapper = this.markup('div', '', {id: this.config.name + '-wrapper'});
    return [this.input, this.wrapper];
  }

  /**
   * onRender callback
   */
  onRender() {
    let wrapper = $(this.wrapper);
    let input = $(this.input);

   
    let config = $.extend(true, {
      request: {
        endpoint: this.handler
      },
      deleteFile: {
        enabled: true,
        endpoint: this.handler
      },
      chunking: {
        enabled: true,
        concurrent: {
          enabled: true
        },
        success: {
          endpoint: this.handler + (this.handler.indexOf('?') == -1 ? '?' : '&') + 'done'
        }
      },
      resume: {
        enabled: true
      },
      retry: {
        enableAuto: true,
        showButton: true
      },
      callbacks: {
        onError: (id, name, errorReason, xhrOrXdr) => {
          if (errorReason.slice(-1) != '.') {
            errorReason += '.';
          }
          let error = $('<div />')
            .addClass('qq-error-message')
            .html(`<span>Error processing upload: <b>${name}</b>.<br />Reason: ${errorReason}</span>`)
            .prependTo(wrapper.find('.qq-uploader'));
          setTimeout(() => {
            error.fadeOut(() => {
              error.remove();
            });
          }, 6000);
        },
        onStatusChange: (id, oldStatus, newStatus) => {
          let uploads = (<any>wrapper).fineUploader('getUploads');

          // retrieve an array of successfully uploaded filenames
          let successful = [];
          for (let upload of uploads) {
            if (upload.status != 'upload successful') {
              continue;
            }
            successful.push(upload.name);
          }
          input.val(successful.join(', '));
        }
      },
      template: this.fineTemplate
    }, this.classConfig);
      (<any>wrapper).fineUploader(config);
  }
}

controlText.register('file', controlText, 'file');
//controlText.register('fineuploader', controlFineUploader, 'file');