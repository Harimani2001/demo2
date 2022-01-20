import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ToastyModule } from 'ng2-toasty';
import { DocStatusService } from '../pages/document-status/document-status.service';
import { FileUploadForDocComponent } from '../pages/file-upload-for-doc/file-upload-for-doc.component';
import { FileViewComponent } from '../pages/file-view/file-view.component';
import { IQTCService } from '../pages/iqtc/iqtc.service';
import { PDFViewerModule } from '../pages/pdf-viewer/pdf-viewer.module';
import { ScreenRecordingComponent } from '../pages/screen-recording/screen-recording.component';
import { SupportComponent } from '../pages/support/support.component';
import { AccordionDirective } from './accordion/accordion.directive';
import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { CardRefreshDirective } from './card/card-refresh.directive';
import { CardToggleDirective } from './card/card-toggle.directive';
import { CardComponent } from './card/card.component';
import { AuditFilterPipe } from './element/audit-filter.pipe';
import { AuditTrailFilterPipe } from './element/audit-trail-filter.pipe';
import { BatchPipeFilter } from './element/batch-filter.pipe';
import { CalendarPipeFilter } from './element/calendar-filter.pipe';
import { CategoryFilterPipe } from './element/category-filter.pipe';
import { CCFPipe } from './element/CCF.filter.pipe';
import { CombinedFilterPipe } from './element/combined-filter.pipe';
import { CompanyFilterPipe } from "./element/company-filter.pipe";
import { DashboardFilterPipe } from './element/dashboard-filter.pipe';
import { DataFilterPipe } from "./element/data-filter.pipe";
import { DepartmentFilterPipe } from './element/department-filter.pipe';
import { DeviceMasterFilterPipe } from './element/device-master-filter.pipe';
import { DynamicFilterPipe } from './element/dynamic-form-filter.pipe';
import { DynamicTemplateFilterPipe } from './element/dynamicTemplate-filter.pipe';
import { EmailRuleFilter } from './element/email-rule-filter';
import { EquipmentCalendarPipeFilter } from './element/equipment-calender-filter.pipe';
import { EquipmentFilterPipe } from './element/equipment-filter-pipe';
import { EquipmentStatusPipeFilter } from './element/equipment-status-update-filter.pipe';
import { FacilityFilterPipe } from './element/facility-filter-pipe';
import { FormExtendFilterPipe } from './element/form-extend-filter.pipe';
import { FormReportsFilterPipe } from './element/formReports-filter.pipe';
import { HtmlPipe } from './element/htmlFilter.pipe';
import { InventoryReportFilterPipe } from './element/inventory-report-filter.pipe';
import { IqtcPipeFilter } from './element/IQTC-filter.pipe';
import { LocationFilterPipe } from './element/location-filter-pipe';
import { LogFilterPipe } from './element/LogFilterPipe';
import { LogUserFilterPipe } from './element/LogUserFilterPipe';
import { LookUpFilterPipe } from './element/lookup-filter.pipe';
import { MapFilterPipe } from './element/map-filter.pipe';
import { ModulePermissionFilter } from './element/module-permission-filter.pipe';
import { ParentRemoveDirective } from './element/parent-remove.directive';
import { PriorityFilterPipe } from './element/priority-filter.pipe';
import { projectPlan } from './element/project-plan.pipe';
import { ProjectsetupFilterPipe } from "./element/projectsetup-filter.pipe";
import { ProjectSummaryFilterPipe } from './element/projectSummary-filter.pipe';
import { RiskFilterPipe } from './element/riskAssessment-filter.pipe';
import { RoleFilterPipe } from './element/role-filter.pipe';
import { RoleManagementPipeFilter } from './element/role-management-filter.pipe';
import { SearchMenuPipeFilter } from './element/SearchMenu-filter.pipe';
import { ShiftFilterPipe } from './element/ShiftFilterPipe';
import { SpecificationFilterPipe } from './element/specification-filter.pipe';
import { TaskFilterPipe } from './element/TaskFilterPipe';
import { TaskReportFilterPipe } from './element/TaskReportFilterPipe';
import { TestRunFilterPipe } from './element/test-run-filter.pipe';
import { TextPipeLine } from './element/text.pipe';
import { TraceabilityFilter } from './element/traceability-filter.pipe';
import { TracebilityDetailFilterPipe } from './element/tracebilitymatrixdetailFilterPipe';
import { UrsAndSpecificationFilterPipe } from './element/ursAndSpecification-filter.pipe';
import { UserFilterPipe } from './element/user-filter.pipe';
import { userProfileProjectFilterPipe } from './element/user-profile-project-filter.pipe';
import { VendorMasterFilterPipe } from './element/vendor-mastor-pipe';
import { VendorValidationFilterPipe } from './element/vendor-validation-filter.pipe';
import { WorkFlowFilterPipe } from './element/workFlowFilter';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { MenuItems } from './menu-items/menu-items';
import { ModalAnimationComponent } from './modal-animation/modal-animation.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { ScrollModule } from './scroll/scroll.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { UnscriptedPipeFilter } from './element/Unscripted-filter.pipe';
import { CleanRoomFilter } from './element/cleanRoom-filter.pipe';
import { RoomSpecFilter } from './element/roomSpec-filter.pipe';
import { DmsFilterPipe } from './element/dms-filter.pipe';
import { TemplateLibraryFilterPipe } from './element/template-library-filter.pipe';
import { ESignFilterPipe } from './element/esign-filter-pipe';
import { ComplianceAssessmentFilterPipe } from './element/complianceAssessment-filter.Pipe';

@NgModule({
  imports: [
    CommonModule,
    ScrollModule,
    NgbModule.forRoot(),
    FormsModule,
    PDFViewerModule,
    AngularMultiSelectModule,
    ToastyModule.forRoot(),
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    SpinnerComponent,
    CardComponent,
    ModalAnimationComponent,
    ModalBasicComponent,
    DataFilterPipe,
    HtmlPipe,
    ProjectsetupFilterPipe,
    userProfileProjectFilterPipe,
    CompanyFilterPipe,
    CombinedFilterPipe,
    PriorityFilterPipe,
    CategoryFilterPipe,
    IqtcPipeFilter,
    DepartmentFilterPipe,
    LookUpFilterPipe,
    VendorMasterFilterPipe,
    UserFilterPipe,
    VendorValidationFilterPipe,
    ESignFilterPipe,
    RoleFilterPipe,
    SearchMenuPipeFilter,
    DynamicTemplateFilterPipe,
    TraceabilityFilter,
    AuditFilterPipe,
    AuditTrailFilterPipe,
    EmailRuleFilter,
    TemplateLibraryFilterPipe,
    ParentRemoveDirective,
    projectPlan,
    DynamicFilterPipe,
    WorkFlowFilterPipe,
    LocationFilterPipe,
    LogFilterPipe,
    LogUserFilterPipe,
    EquipmentFilterPipe,
    FacilityFilterPipe,
    FormReportsFilterPipe,
    BatchPipeFilter,
    ProjectSummaryFilterPipe,
    FormExtendFilterPipe,
    DeviceMasterFilterPipe,
    MapFilterPipe,
    EquipmentStatusPipeFilter,
    RoleManagementPipeFilter,
    ModulePermissionFilter,
    EquipmentCalendarPipeFilter,
    TaskFilterPipe,
    TaskReportFilterPipe,
    TracebilityDetailFilterPipe,
    RiskFilterPipe,
    CalendarPipeFilter,
    DashboardFilterPipe,
    ScreenRecordingComponent,
    CCFPipe,
    SpecificationFilterPipe,
    UrsAndSpecificationFilterPipe,
    FileUploadForDocComponent,
    FileViewComponent,
    TextPipeLine,
    ShiftFilterPipe,
    ComplianceAssessmentFilterPipe,
    TestRunFilterPipe,
    SupportComponent,
    InventoryReportFilterPipe,
    UnscriptedPipeFilter,
    CleanRoomFilter,
    RoomSpecFilter,
    DmsFilterPipe
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    ScrollModule,
    NgbModule,
    SpinnerComponent,
    CardComponent,
    ModalAnimationComponent,
    ModalBasicComponent,
    DataFilterPipe,
    HtmlPipe,
    ProjectsetupFilterPipe,
    userProfileProjectFilterPipe,
    CompanyFilterPipe,
    VendorMasterFilterPipe,
    CombinedFilterPipe,
    PriorityFilterPipe,
    CategoryFilterPipe,
    IqtcPipeFilter,
    DepartmentFilterPipe,
    LookUpFilterPipe,
    UserFilterPipe,
    VendorValidationFilterPipe,
    ESignFilterPipe,
    TemplateLibraryFilterPipe,
    RoleFilterPipe,
    SearchMenuPipeFilter,
    DynamicTemplateFilterPipe,
    TraceabilityFilter,
    AuditFilterPipe,
    AuditTrailFilterPipe,
    EmailRuleFilter,
    projectPlan,
    DynamicFilterPipe,
    WorkFlowFilterPipe,
    LocationFilterPipe,
    LogFilterPipe,
    LogUserFilterPipe,
    EquipmentFilterPipe,
    FacilityFilterPipe,
    FormReportsFilterPipe,
    BatchPipeFilter,
    ProjectSummaryFilterPipe,
    FormExtendFilterPipe,
    DeviceMasterFilterPipe,
    MapFilterPipe,
    EquipmentStatusPipeFilter,
    RoleManagementPipeFilter,
    ModulePermissionFilter,
    EquipmentCalendarPipeFilter,
    TaskFilterPipe,
    TaskReportFilterPipe,
    TracebilityDetailFilterPipe,
    RiskFilterPipe,
    CalendarPipeFilter,
    DashboardFilterPipe,
    ScreenRecordingComponent,
    CCFPipe,
    SpecificationFilterPipe,
    UrsAndSpecificationFilterPipe,
    FileUploadForDocComponent,
    FileViewComponent,
    TextPipeLine,
    ShiftFilterPipe,
    ComplianceAssessmentFilterPipe,
    TestRunFilterPipe,
    SupportComponent,
    AngularMultiSelectModule,
    InventoryReportFilterPipe,
    ToastyModule,
    UnscriptedPipeFilter,
    CleanRoomFilter,
    RoomSpecFilter,
    DmsFilterPipe
  ],
  providers: [MenuItems, DocStatusService, IQTCService]
})
export class SharedModule { }