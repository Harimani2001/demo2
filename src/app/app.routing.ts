import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { AuthGuardService } from './layout/auth/AuthGuardService';
import { MasterDynamicTemplateComponent } from './pages/master-dynamic-template/master-dynamic-template.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { SupportComponent } from './pages/support/support.component';
import { WorkFlowDynamicTemplateComponent } from './pages/work-flow-dynamic-template/work-flow-dynamic-template.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'login',
        redirectTo: '/login',
      },
      {
        path: 'forgot-password',
        redirectTo: '/forgot-password',
      },
      {
        path: 'external/:id',
        redirectTo: '/external/:id',
      },
      {
        path: 'external-dynamicForm/:id',
        redirectTo: '/external-dynamicForm/:id',
      },
      {
        path: 'esign-external/:id',
        redirectTo: '/esign-external/:id',
      },
      {
        path: '404',
        loadChildren: './pages/error-page404/errot-page404.module#ErrorPage404Module'
      },
      {
        path: 'auditTrail',
        canActivate: [AuthGuardService],
        loadChildren: './pages/audit-trail/audit-trail.module#AuditTrailModule'
      },
      {
        path: 'organization',
        canActivate: [AuthGuardService],
        loadChildren: './pages/organization/organization.module#OrganizationModule'
      },
      {
        path: 'userMapping',
        canActivate: [AuthGuardService],
        loadChildren: './pages/user-mapping/user-mapping.module#UserEquipmentModule'
      },
      {
        path: 'workflowConfiguration',
        canActivate: [AuthGuardService],
        loadChildren: './pages/workflow-configuration/workflow-configuration.module#WorkflowConfigurationModule'
      }
      , {
        path: 'commonconfiguration',
        canActivate: [AuthGuardService],
        loadChildren: './pages/commonworkflowconfiguration/commonworkflowconfiguration.module#CommonWorkflowConfigurationModule'
      },
      {
        path: 'Project-setup',
        canActivate: [AuthGuardService],
        loadChildren: './pages/projectsetup/projectsetup.module#ProjectSetupModule'
      },
      {
        path: 'equipmentDetailDashboard',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment-wise-dashboard/equipment-wise-dashboard.module#EquipmentWiseDashboardModule'
      },
      {
        path: 'URS',
        canActivate: [AuthGuardService],
        loadChildren: './pages/urs/urs.module#URSModule'
      },
      {
        path: 'table-of-content',
        canActivate: [AuthGuardService],
        loadChildren: './pages/table-of-content/table-of-content.module#TableOfContentModule'
      },
      {
        path: 'Summary-Report',
        canActivate: [AuthGuardService],
        loadChildren: './pages/validation-summary-report/validation-summary.module#VSRModule'
      },
      {
        path: 'createForms',
        canActivate: [AuthGuardService],
        loadChildren: './pages/master-dynamic-forms/master-dynamic-forms.module#MasterDynamicFormsModule'
      },
      {
        path: 'deviceMaster',
        canActivate: [AuthGuardService],
        loadChildren: './pages/device-master/device-master.module#DeviceMasterModule'
      },
      {
        path: 'department',
        canActivate: [AuthGuardService],
        loadChildren: './pages/department/department.module#DepartmentModule'
      },
      {
        path: 'traceability',
        canActivate: [AuthGuardService],
        loadChildren: './pages/traceabilitymatrix/traceabilitymatrix.module#TraceModule'
      },
      {
        path: 'riskAssessment',
        canActivate: [AuthGuardService],
        loadChildren: './pages/risk-assessment/risk-assessment.module#RiskAssessmentModule'
      },
      {
        path: 'rolesManagement',
        canActivate: [AuthGuardService],
        loadChildren: './pages/role-management/role-mangement.module#RoleManagementModule'
      },
      {
        path: 'df',
        canActivate: [AuthGuardService],
        loadChildren: './pages/discrepancy-form/discrepancy-status.module#DiscrepancyFormModule'
      },
      {
        path: 'roles',
        canActivate: [AuthGuardService],
        loadChildren: './pages/roles/roles.module#RolesModule'
      },
      {
        path: 'add-riskAssessment',
        canActivate: [AuthGuardService],
        loadChildren: './pages/risk-assessment/add-risk-assessment/add-risk-assessment.module#AddRiskAssessmentModule'
      },
      {
        path: 'add-riskAssessment/:id',
        canActivate: [AuthGuardService],
        loadChildren: './pages/risk-assessment/add-risk-assessment/add-risk-assessment.module#AddRiskAssessmentModule'
      },
      {
        path: 'Priority',
        canActivate: [AuthGuardService],
        loadChildren: './pages/priority/priority.module#PriorityModule'
      },
      {
        path: 'category',
        canActivate: [AuthGuardService],
        loadChildren: './pages/category/category.module#CategoryModule'
      },
      {
        path: 'compliance-assessment',
        canActivate: [AuthGuardService],
        loadChildren: './pages/compliance-assessment/compliance-assessment.module#ComplianceAssessmentModule'
      },
      {
        path: 'knowledgeBase',
        canActivate: [AuthGuardService],
        loadChildren: './pages/knowledge-base/knowledge-base.module#KnowledgeBaseModule'
      },
      {
        path: 'ldap',
        canActivate: [AuthGuardService],
        loadChildren: './pages/LDAP/ldap.module#LDAPModule'
      },
      {
        path: 'look-up',
        canActivate: [AuthGuardService],
        loadChildren: './pages/LookUpCategory/lookup.module#LookUpModule'
      },
      {
        path: 'error-logs',
        canActivate: [AuthGuardService],
        loadChildren: './pages/error-logs/error-logs.module#ErrorLogsModule'
      },
      {
        path: 'userManagement',
        canActivate: [AuthGuardService],
        loadChildren: './pages/userManagement/user.module#UserModule'
      },
      {
        path: 'DocStatus',
        canActivate: [AuthGuardService],
        loadChildren: './pages/document-status/document-status.module#DocumentStatusModule'
      },
      {
        path: 'masterControl',
        canActivate: [AuthGuardService],
        loadChildren: './pages/master-control/master-control.module#MasterControlModule'
      },
      {
        path: 'pdfPreference',
        canActivate: [AuthGuardService],
        loadChildren: './pages/pdf-preferences/pdf-preferences.module#pdfPreferenceModule'
      },
      {
        path: 'vendor',
        canActivate: [AuthGuardService],
        loadChildren: './pages/vendor/vendor.module#VendorModule'
      },
      {
        path: 'templatelibrary',
        canActivate: [AuthGuardService],
        loadChildren: './pages/templatelibrary/templatelibrary.module#TemplatelibraryModule'
      },
      {
        path: 'esign',
        canActivate: [AuthGuardService],
        loadChildren: './pages/esign/esign.module#EsignModule'
      },
      {
        path: 'user',
        canActivate: [AuthGuardService],
        loadChildren: './pages/user/user.module#UserModule'
      },
      {
        path: 'dynamicTemplate',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dynamic-templates/dynamic-templates.module#DynamicTemplatesModule'
      },
      {
        path: 'MainMenu',
        canActivate: [AuthGuardService],
        loadChildren: './pages/mainmenu/mainmenu.module#MainMenuModule'
      },
      {
        path: 'home',
        canActivate: [AuthGuardService],
        loadChildren: './pages/home/home.module#HomeModule'
      },
      {
        path: 'projectplan',
        canActivate: [AuthGuardService],
        loadChildren: './pages/projectplan/projectplan.module#ProjectPlanModule'
      },
      {
        path: 'changePassword',
        canActivate: [AuthGuardService],
        loadChildren: './pages/authentication/changepassword/changePassword.module#ChangePasswordModule'
      }, {
        path: 'dynamicForm/:id',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dynamic-form/dynamic-form.module#DynamicFormModule'
      },
      {
        path: 'dynamicFormView/:id',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dynamic-form-view/dynamic-form-view.module#DynamicFormViewModule'
      }
      , {
        path: 'notification',
        canActivate: [AuthGuardService],
        component: NotificationComponent,
      },
      {
        path: 'search',
        canActivate: [AuthGuardService],
        loadChildren: './pages/advanced-search/advenced-search.module#AdvencedSearchModule'
      },
      {
        path: 'dms',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dms/dms.module#DmsModule'
      },
      {
        path: 'sftp',
        canActivate: [AuthGuardService],
        loadChildren: './pages/sftp/sftp.module#SftpModule'
      },
      {
        path: 'formEquipment',
        canActivate: [AuthGuardService],
        loadChildren: './pages/form-equipment/form-equipment.module#FormEquipmentModule'
      },
      {
        path: 'newDocumentStatus',
        canActivate: [AuthGuardService],
        loadChildren: './pages/doc-status/doc-status.module#DocStatusModule'
      },
      {
        path: 'bulkUpload',
        canActivate: [AuthGuardService],
        loadChildren: './pages/bulk-upload/bulk-upload.module#BulkUploadModule'
      }, {
        path: 'masterDynamicForm',
        canActivate: [AuthGuardService],
        loadChildren: './pages/master-dynamic-forms/master-dynamic-forms.module#MasterDynamicFormsModule'
      },
      {
        path: 'workFlowMasterDynamicForm',
        canActivate: [AuthGuardService],
        loadChildren: './pages/work-flow-dynamic-form/work-flow-dynamic-form.module#DynamicFormModule'
      },
      {
        path: 'newDynamicTemplate',
        canActivate: [AuthGuardService],
        loadChildren: './pages/dynamic-template/dynamic-template.module#DynamicTemplateModule'
      },
      {
        path: 'workFlowMasterDynamicTemplate',
        canActivate: [AuthGuardService],
        component: WorkFlowDynamicTemplateComponent
      },
      {
        path: 'masterDynamicTemplate',
        canActivate: [AuthGuardService],
        component: MasterDynamicTemplateComponent
      },
      {
        path: 'templates',
        canActivate: [AuthGuardService],
        loadChildren: './pages/templates/templates.module#TemplatesModule'
      },
      {
        path: 'equipment',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment/equipment.module#EquipmentModule'
      },
      {
        path: 'facility',
        canActivate: [AuthGuardService],
        loadChildren: './pages/facility/facility.module#FacilityModule'
      },
      {
        path: 'batch',
        canActivate: [AuthGuardService],
        loadChildren: './pages/batch-creation/batch-creation.module#BatchCreationModule'
      },
      {
        path: 'location',
        canActivate: [AuthGuardService],
        loadChildren: './pages/location/location.module#LocationModule'
      },
      {
        path: 'shift',
        canActivate: [AuthGuardService],
        loadChildren: './pages/shift/shift.module#ShiftModule'
      },
      {
        path: 'formReports',
        canActivate: [AuthGuardService],
        loadChildren: './pages/form-reports/form-reports.module#FormReportsModule'
      },
      {
        path: 'equipmentDashboard',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment-dashboard/equipment-dashboard.module#EquipmentDashboardModule'
      },
      {
        path: 'freeze',
        canActivate: [AuthGuardService],
        loadChildren: './pages/freezemodule/freezemodule.module#FreezeModule'
      },
      {
        path: 'templatebuilder',
        canActivate: [AuthGuardService],
        loadChildren: './pages/templatebuilder/templatebuilder.module#templateBuilderModule'
      },
      {
        path: 'equipmentStatus',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment-status/equipment-status.module#EquipmentStatusModule'
      },
      {
        path: 'smtpMasterSetup',
        canActivate: [AuthGuardService],
        loadChildren: './pages/smtp-setup-master/smtp-setup-master.module#SmtpSetupMasterModule'
      },
      {
        path: 'emaillogs',
        canActivate: [AuthGuardService],
        loadChildren: './pages/emaillogs/emaillogs.module#EmailLogsModule'
      },
      {
        path: 'emailTemplateConfig',
        canActivate: [AuthGuardService],
        loadChildren: './pages/email-template-config/email-template-config.module#EmailTemplateConfigModule'
      },
      {
        path: 'equipmentStatusUpdate',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment-status-update/equipment-status-update.module#EquipmentStatusUpdateModule'
      },
      {
        path: 'projectSummary',
        canActivate: [AuthGuardService],
        loadChildren: './pages/project-summary/project-summary.module#ProjectSummaryModule'
      },
      {
        path: 'requirementSummary',
        canActivate: [AuthGuardService],
        loadChildren: './pages/requirement-summary/requirement-summary.module#RequirementSummaryModule'
      },
      {
        path: 'calendarView',
        canActivate: [AuthGuardService],
        loadChildren: './pages/calender-view/calender-view.module#CalenderViewModule'
      },
      {
        path: 'emailRule',
        canActivate: [AuthGuardService],
        loadChildren: './pages/email-rule/email-rule.module#EmailRuleModule'
      },
      {
        path: 'documentsummary',
        canActivate: [AuthGuardService],
        loadChildren: './pages/documentsummary/documentsummary.module#DocumentsummaryModule'
      },
      {
        path: 'documentapprovalstatus',
        canActivate: [AuthGuardService],
        loadChildren: './pages/document-approval-status/document-approval-status.module#DocumentApprovalStatusModule'
      },
      {
        path: 'draftpdf',
        canActivate: [AuthGuardService],
        loadChildren: './pages/draft-pdf/draft-pdf.module#DraftPdfModule'
      },
      {
        path: 'newEquipmentDashboard/:id',
        canActivate: [AuthGuardService],
        loadChildren: './pages/new-equipmemt-dashboard/new-equipmemt-dashboard.module#NewEquipmemtDashboardModule'
      },
      {
        path: 'equipmentCalendarView',
        canActivate: [AuthGuardService],
        loadChildren: './pages/equipment-calendar-view/equipment-calendar-view.module#EquipmentCalenderViewModule'
      },
      {
        path: 'emaillogs',
        canActivate: [AuthGuardService],
        loadChildren: './pages/emaillogs/emaillogs.module#EmailLogsModule'
      },
      {
        path: 'dateFormatSettings',
        canActivate: [AuthGuardService],
        loadChildren: './pages/date-format-settings/date-format-settings.module#DateFormatSettingsModule'
      },
      {
        path: 'taskCreation',
        canActivate: [AuthGuardService],
        loadChildren: './pages/task-creation/task-creation.module#TaskCreationModule'
      },
      {
        path: 'ccf',
        canActivate: [AuthGuardService],
        loadChildren: './pages/change-control-form/change-control-form.module#CCFModule'
      },
      {
        path: 'matrix',
        canActivate: [AuthGuardService],
        loadChildren: './pages/gobal-traceability-matrix/gobal-traceability-matrix.module#GobalTraceModule'
      },
      {
        path: 'periodic-review',
        canActivate: [AuthGuardService],
        loadChildren: './pages/periodic-review/periodic-review.module#PeriodicReviewModule'
      },
      {
        path: 'documentsReport',
        canActivate: [AuthGuardService],
        loadChildren: './pages/documents-report/documents-report.module#ReportsModule'
      },
      {
        path: 'taskReport',
        canActivate: [AuthGuardService],
        loadChildren: './pages/task-report/task-report.module#TaskReportsModule'
      },
      {
        path: 'myTask',
        canActivate: [AuthGuardService],
        loadChildren: './pages/my-task/my-task.module#MyTaskModule'
      },
      {
        path: 'timeline-graph',
        canActivate: [AuthGuardService],
        loadChildren: './pages/timeline-graph/timeline-graph.module#TimelineGraphModule'
      },
      {
        path: 'timesheet-report',
        canActivate: [AuthGuardService],
        loadChildren: './pages/time-sheet-report/time-sheet-report.module#NewTimeSheetReportModule'
      },
      {
        path: 'task-statistics',
        canActivate: [AuthGuardService],
        loadChildren: './pages/task-statistics/task-statistics.module#TaskStatisticsModule'
      },
      {
        path: 'inventory-report',
        canActivate: [AuthGuardService],
        loadChildren: './pages/inventory-report/inventory-report.module#InventoryReportModule'
      },
      {
        path: 'compliance-report',
        canActivate: [AuthGuardService],
        loadChildren: './pages/compliance-report/compliance-report.module#ComplianceReportModule'
      },
      {
        path: 'vendor-master',
        canActivate: [AuthGuardService],
        loadChildren: './pages/vendor-master/vendor-master.module#vendorMasterModule'
      },
      {
        path: 'Clean-room',
        canActivate: [AuthGuardService],
        loadChildren: './pages/clean-room/clean-room.module#CleanRoomModule'
      },
      {
        path: 'statistical-process-control',
        canActivate: [AuthGuardService],
        loadChildren: './pages/process-validation/process-validation.module#ProcessValidationModule'
      },
      {
        path: 'electronic-signature',
        canActivate: [AuthGuardService],
        loadChildren: './pages/electronic-signature/electronic-signature.module#ElectronicSignatureModule'
      },
      {
        path: 'sp-master',
        canActivate: [AuthGuardService],
        loadChildren: './pages/specification-master/specification-master.module#SpecificationMasterModule'
      },
      {
        path: 'apiConfiguration',
        canActivate: [AuthGuardService],
        loadChildren: './pages/api-configuration/api-configuration.module#ApiConfigurationModule'
      },
      {
        path: 'Ad-hoc',
        canActivate: [AuthGuardService],
        loadChildren: './pages/unscripted-testcase/unscripted-testcase.module#UnscriptedModule'
      },
      {
        path: 'support',
        component: SupportComponent
      },
      {
        path: 'tc-creation',
        loadChildren: './pages/test-case-creation/test-case-creation.module#TestCreationModule'
      },
      {
        path: 'tc-creation/:type',
        loadChildren: './pages/test-case-creation/test-case-creation.module#TestCreationModule'
      },
      {
        path: 'tc-creation/:type/:id',
        loadChildren: './pages/test-case-creation/test-case-creation.module#TestCreationModule'
      },
      {
        path: 'tc-execution',
        loadChildren: './pages/test-case-execution/test-case-execution.module#TestCaseExecutionModule'
      },
      {
        path: 'tc-execution/:type',
        loadChildren: './pages/test-case-execution/test-case-execution.module#TestCaseExecutionModule'
      },
      {
        path: 'tc-execution/:type/:id',
        loadChildren: './pages/test-case-execution/test-case-execution.module#TestCaseExecutionModule'
      },
      {
        path: 'tc-add',
        loadChildren: './pages/test-case-edit/test-case-edit.module#TestCaseEditModule'
      },
      {
        path: 'tc-add/:type',
        loadChildren: './pages/test-case-edit/test-case-edit.module#TestCaseEditModule'
      },
      {
        path: 'tc-edit/:type/:id',
        loadChildren: './pages/test-case-edit/test-case-edit.module#TestCaseEditModule'
      },
      {
        path: 'userAcceptance',
        canActivate: [AuthGuardService],
        loadChildren: './pages/user-acceptance/user-acceptance.module#UserAcceptanceModule'
      },
      {
        path: 'document-numbering',
        canActivate: [AuthGuardService],
        loadChildren: './pages/document-numbering/document-numbering.module#DocumentNumberingModule'
      },
      {
        path: 'timesheet-report',
        canActivate: [AuthGuardService],
        loadChildren: './pages/time-sheet-report/time-sheet-report.module#NewTimeSheetReportModule'
      },
      {
        path: 'system-release-certificate',
        canActivate: [AuthGuardService],
        loadChildren: './pages/system-release-certificate/system-release-certificate.module#SystemCertificateModule'
      },
      {
        path: '**',
        redirectTo: "/404"
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: './pages/authentication/login/login.module#LoginModule'
      },
      {
        path: 'forgot-password',
        loadChildren: './pages/authentication/forgot/forgot.module#ForgotModule'
      },
      {
        path: 'external/:id',
        loadChildren: './pages/external-document-approval/external-document-approval.module#ExternalDocumentApprovalModule'
      },
      {
        path: 'external-dynamicForm/:id',
        loadChildren: './pages/external-dynamic-form/external-dynamic-form.module#ExternalDynamicFormModule'
      },
      {
        path: 'esign-external/:id',
        loadChildren: './pages/esign-external-document-approval/esign-external-document-approval.module#EsignExternalDocumentApprovalModule'
        
      }
    ]
  }
];