import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { DMSService } from '../dms/dms.service';

@Component({
  selector: 'app-sftp',
  templateUrl: './sftp.component.html',
  styleUrls: ['./sftp.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `:host >>> .md-tabs >>> .nav-item {
      background-color: #fff;
      width: calc(100% / 7);
      text-align: center;
    }`]
})

export class SftpComponent implements OnInit {
  @ViewChild('modelInfo') modelInfo: any;
  @ViewChild('tree') tree: any;
  spinnerFlag: boolean = false;
  nodes: any[] = new Array();
  infoData: any;
  isNodesThere: boolean = false;
  ftpFolderSize: any;
  ftpFileSize: any;
  showSearch: boolean = false;

  constructor(public configService: ConfigService, private adminComponent: AdminComponent, public helper: Helper,
    public dMSService: DMSService, private injector: Injector) {
  }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("211");
    this.loadSftpFolderStructure();
    this.loadApplicationFileSize();
  }

  loadSftpFolderStructure() {
    this.spinnerFlag = true;
    this.configService.HTTPGetAPI("common/getSftpFolderStructure").subscribe(res => {
      this.nodes = res.list;
      if (this.nodes.length > 0)
        this.isNodesThere = true;
      else
        this.isNodesThere = false;
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false });
  }

  downloadFileOrView(node) {
    if (this.helper.isEmpty(node.children)) {
      var admin = this.injector.get(AdminComponent);
      admin.downloadOrViewFile(node.name, node.filePath, true);
    }
  }

  loadApplicationFileSize() {
    this.adminComponent.loadCurrentUserDetails().then(jsonResp => {
      if (!this.helper.isEmpty(jsonResp)) {
        this.dMSService.applicationFileSize("/IVAL/" + jsonResp.orgId + "/").subscribe(data => {
          if (!this.helper.isEmpty(data)) {
            this.ftpFolderSize = data.ftpSize;
          }
        });
      }
    })
  }

  loadDocumentCommentLog(row: any) {
    this.infoData = "";
    this.spinnerFlag = true;
    this.dMSService.applicationFileSize(row.filePath).subscribe(resp => {
      this.infoData = row;
      this.infoData.ftpFileSize = resp.ftpSize;
      this.spinnerFlag = false;
      this.modelInfo.show();
    });
  }

  onChangeSearch() {
    this.showSearch = !this.showSearch
    if (this.showSearch) {
      setTimeout(() => {
        $('#search').focus();
      }, 200);
    }
  }

}
