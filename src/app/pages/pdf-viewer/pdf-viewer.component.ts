import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  PDFDocumentProxy, PDFProgressData,PDFSource
} from 'ng2-pdf-viewer';
@Component({
  selector: 'goval-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PDFViewerComponent implements OnInit {
  @ViewChild('PdfViewerComponent')
  private pdfComponent: any;
  @Input('src') pdfSrc: string | PDFSource | ArrayBuffer = '';
  @Input('fileName') fileName: string;
  @Output() onDownload = new EventEmitter<boolean>();
  @Input('hideButton') hideButton:boolean = false;
  height: any = "600px";
  heightOutline = '500px';
  error: any;
  pageString='1';
  page = 1;

  rotation = 0;
  zoom = 1.0;
  originalSize = true;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = true;
  pdfQuery = '';
  constructor() { }

  ngOnInit(): void {
    // (window as any).pdfWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';
    this.height = window.innerHeight+ 'px'
    this.heightOutline = window.innerHeight - 200 + 'px'
  }

  downloadPDFFromView(url, fileName) {
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.onDownload.emit(true);
  }

  setPageNumber(pageNumber) {
    setTimeout(() => {
      try {
        if (+pageNumber <= this.pdfComponent.pdfViewer._pages.length && +pageNumber > 1) {
          this.scrollToPage(+pageNumber);
        } else {
          this.pageString = '1';
          this.scrollToPage(+1);
        }
        this.page = +pageNumber;
      } catch (error) {
        this.pageString = '1';
        this.page = 1;
      }
    }, 1000);
  }
  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += +amount.toFixed(2);
   this.originalSize= false;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }
  /**
    * Get pdf information after it's loaded
    * @param pdf
    */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;

    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc = newSrc;
  }

  /**
 * Pdf loading progress callback
 * @param {PDFProgressData} progressData
 */
  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage(number) {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: number
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    
  }

  searchQueryChanged(newQuery: string) {
    setTimeout(() => {
      if (newQuery !== this.pdfQuery) {
        this.pdfQuery = newQuery;
        this.pdfComponent.pdfFindController.executeCommand('find', {
          query: this.pdfQuery,
          highlightAll: true
        });
      } else {
        this.pdfComponent.pdfFindController.executeCommand('findagain', {
          query: this.pdfQuery,
          highlightAll: true
        });
      }
    }, 600);
  }

  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
