import { Component, OnInit, ViewEncapsulation} from '@angular/core'

@Component({
  selector: 'app-document-approval-status',
  templateUrl: './document-approval-status.component.html',
  styleUrls: ['./document-approval-status.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentApprovalStatusComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}
