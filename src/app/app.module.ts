import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClickOutsideModule } from 'ng-click-outside';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { DndModule } from 'ng2-dnd';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../app/layout/auth/AuthGuardService';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AdminComponent } from './layout/admin/admin.component';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layout/admin/title/title.component';
import { AuthComponent } from './layout/auth/auth.component';
import { AuthenticationService } from './pages/authentication/authentication.service';
import { CategoryService } from './pages/category/category.service';
import { CommonFileFTPService } from './pages/common-file-ftp.service';
import { DateFormatSettingsService } from './pages/date-format-settings/date-format-settings.service';
import { GobalTaskCreationModule } from './pages/gobal-task-creation/gobal-task-creation.module';
import { HomeModule } from './pages/home/home.module';
import { KnowledgeBaseService } from './pages/knowledge-base/knowledge-base.service';
import { LocationService } from './pages/location/location.service';
import { LookUpService } from './pages/LookUpCategory/lookup.service';
import { MainMenuModule } from './pages/mainmenu/mainmenu.module';
import { MasterDynamicTemplateComponent } from './pages/master-dynamic-template/master-dynamic-template.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { OfflineUiComponent } from './pages/offline-ui/offline-ui.component';
import { priorityService } from './pages/priority/priority.service';
import { TaskCreationModule } from './pages/task-creation/task-creation.module';
import { WorkFlowDynamicTemplateComponent } from './pages/work-flow-dynamic-template/work-flow-dynamic-template.component';
import { ConfigService } from './shared/config.service';
import { Helper } from './shared/helper';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
    NotificationComponent,
    WorkFlowDynamicTemplateComponent,
    MasterDynamicTemplateComponent,
    OfflineUiComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    DndModule.forRoot(),
    ClickOutsideModule,
    SharedModule,
    FormsModule,
    HttpModule,
    QuillEditorModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    UiSwitchModule,
    SelectModule,
    CKEditorModule,
    HomeModule,
    MainMenuModule,
    TaskCreationModule,
    GobalTaskCreationModule,
    BrowserModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true
    },
    Helper,
    AuthGuardService,
    ConfigService,
    CategoryService,
    priorityService,
    LookUpService,
    AuthenticationService,
    CommonFileFTPService,
    KnowledgeBaseService,
    DateFormatSettingsService,
    LocationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initApp() {
  return () => {
    return new Promise((resolve) => {
      let currentUrl = window.location.href;
      let params = currentUrl.split('?');
      if (params.length > 1) {
        let urls = params[1].split('=');
        if (urls.length > 1) {
          let url = urls[1];
          localStorage.setItem("redirectReference", url);
        }
      }
      resolve();
    });
  };
}