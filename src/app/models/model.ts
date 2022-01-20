import { AmdDependency } from "typescript";

export class CommonModel {
  loginUserId: any;
  baseURL: string = document.location.origin;
  Url: any;
  organizationOfLoginUser: number;
  date: string;
  categoryName: String;
  priorityName: String;
  currentCommonLevel: any;
  projectSetupProjectId: any;
  projectSetupconstantName: any;
  globalProjectId: number;
  globalProjectName: string;
  roleId: number;
  type: string;
  value: String;
  dataType: String;
  workFlowDocs: Array<String> = new Array();
  isDefault: string;
  organizationName: string;
  levels: Number[];
  jsonExtraData: string;
  flag = false;
  projectVersionId: any;
  projectVersionName: any;
  uploadedFile: any;
  videoFileId: any;
  navigationPreviousEnds: boolean = false;
  navigationNextEnds: boolean = false;
  fileName: any;
  workFlowCompletionFlag = false;
  downloadDocType;
  documentPreviewFlag = false;
  approvedButtonFlag;
  reportNumber;
  userRemarks: any;
  locationId: any;
  workflowAccess;
  creatorId;
  displayCreatedTime;
  displayUpdatedTime;
  documentPrimaryKey;
}

export class NavMasterDto {
  // documentStatusPermission: boolean;
  dMSpermission: boolean;
  auditTrailPermission: boolean;
  formsPermission: boolean;
  templatesPermission: boolean;
  equipmentPermission: boolean;
}

export class FieldError {
  error: boolean;
}

export class SpecificationMasterDTO extends CommonModel {
  id: number = 0;
  spTypeValue: string;
  spTypeKey: string;
  spDescription: string;
  published: boolean;
  workflowCompletionFlag: string = "N";
  spUrsIds: any[] = new Array();
  spFileName: string;
  spFilePath: string;
  spCode: string;
}

export class VendorMaster {
  id: number;
  code: string;
  name: string;
  address: string;
  email: string;
  website: string;
  phoneNumber: string;
  activeFlag: string;
  projectId: any;
  remarks: string;
}

export class User extends CommonModel {
  id: number = 0;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  designation: string;
  active: string;
  organizationId: number;
  email: string;
  phoneNo: string;
  role: any = "";
  dob: string;
  dobTemp: DobDate;
  address: string;
  createdBy: number;
  updatedBy: number;
  locationId: any = "";
  departmentId: any = "";
  manager = [];
  managerId: any = "";
  managerName: any;
  hodFlag: any;
  sig: any;
  activeFlag: any;
  emailValMsg: any;
  phoneValMsg: any;
  userNameValMsg: any;
  loginType = "Application user";
  userExistsInWorkflow: boolean;
}

export class BatchCreation extends CommonModel {
  id: any;
  productName: any;
  batchNumber: any;
  batchQuantity: any;
  equipmentId: any;
  equipmentNames: any;
  status: any;
}

export class JsonResponse extends CommonModel {
  status: string;
  msg: string;
  sessionId;
  string;
  result: string;
  userName: string;
  role: string;
}

export class UserRegister extends CommonModel {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export class Roles {
  code: string;
  value: string;
  activeFlag: boolean;
  constructor(code: string, value: string) {
    this.code = code;
    this.value = value;
  }
}

export class DobDate {
  year: number;
  month: number
  day: number;
  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
  getFormattedJsonDate(dobDate: DobDate): string {
    return "";
  }
}

export class LookUpCategory extends CommonModel {
  id: number;
  name: string;
  description: string;
  lastUpdatedTime?: any;
  createdTime?: any;
  createdBy: number;
}

export class LookUpItem extends CommonModel {
  id: number;
  categoryId: number;
  key: string;
  value: string;
  displayOrder: string;
  activeFlag: string;
  createdTime: string;
  lastUpdatedTime: string;
  createdBy: number;
}

export class masterModuleDto {
  id: any;
  selected: boolean;
  childAvailable: boolean;
  permissionConstantName: any;
  permissionConstant: any;
  childModuleList: masterModuleDto[] = new Array<masterModuleDto>();
}

export class OrganizationDetails extends CommonModel {
  id: number;
  organizationName: string;
  organizationLicense: number;
  organizationEmail: string;
  country: string;
  state: string;
  street: string;
  pincode: number;
  district: string;
  createdBy: number;
  lastUpdatedBy: number;
  termsAndConditions: string;
  organizationLicenseUsed: string;
  comapnyLicenseValidTill: any;
  selectedModules: Array<String> = new Array();
  formCount: any;
  orgModule: any;
  timeZone: string = "";
  dateFormat: string = "";
  equipmentCount: any;
  kbdefault: boolean;
  kbCopied: boolean;
  kbUpdate: boolean;
  kbUpdateAvailable: boolean;
  emailTemplateDefault: boolean;
  emailTemplateCopied: boolean;
  emailTemplateUpdateAvailable: boolean;
  emailTemplateUpdate: boolean;
  emailRuleDefault: boolean;
  emailRuleCopied: boolean;
  emailRuleUpdateAvailable: boolean;
  emailRuleUpdate: boolean;
  projectCount: any;
  activeUserSessions: number;
  locationName: any;
  locationCode: any;
  storageSpace:number=50;
  periodicDuration:number=1;
  installationPlan:string="";
  buildStatus:boolean;
}

export class CodeValue extends CommonModel {
  code: string;
  value: string;
}

export class dropDownDto {
  key: string;
  value: string;
  mappingId: string;
  mappingFlag: boolean;
}

export class Vendor extends CommonModel {
  id: number;
  vendorName: string;
  emailId: string;
  phoneNo: string;
  address: string;
  createdBy: number;
  createdTime: any;
  lastUpdatedBy: number;
  deleteFlag: any;
  organizationId: number;
  organizationName: string;
}

export class DocumentListModel extends CommonModel {
  id: any;
  documentName: string;
}

export class CustomPdfSettingModel extends CommonModel {
  id: any;
  docType: any = "";
  singleDocument: boolean;
  workFlow: boolean;
  filePath: any;
  mappingId: any;
  password: any = "";
  watermark: any = "";
  documentNumber: any = "";
  selectedFileName: any;
  documentVariable: any[] = new Array();
  workFlowVariables: String[] = new Array();
  projectSetupVariables: String[] = new Array();
  vsrVariables: String[] = new Array();
  equipmentVariables: String[] = new Array();
  batchVariables: String[] = new Array();
  selectedDocumentVariable: String[] = new Array();
  selectedWorkFlowVariables: String[] = new Array();
  selectedFreezeHistoryVariables: String[] = new Array();
  formVariable: any;
  formId: any
  extendedForm: string = "";
  equipmentExtendedForm: string = "";
  batchExtendedForm: string = "";
  fileName: string = "";
  customExcelValidateList: CustomExcelValidateDTO[] = new Array<CustomExcelValidateDTO>();
  sheetNames: dropDownDto[] = new Array<dropDownDto>();
  freezeHistory;
  linkedForm: any = new Array<any[]>();
  selectedLinkedFormVariable: any = new Array<any[]>();
  prefix = "";
  suffix = "";
  sequenceNumberLimit = 0;
  useInBulkApprovalFlag = true;
  customisedFileName: string = "";
  cleanRoomVariables: String[] = new Array();
}

export class Candidate extends CommonModel {
  templateName: string;
  experienceDetails: string;
  qualification: string;
  jobLocation: string;
  salaryRange: string;
  jobDescription: string;
  jobType: string;
  vendorId: string = "";
  id: number;
  technicalKeyword: string;
}

export class DmsExcelExportDto {
  docType: string;
  mappingId: number;
  projectDocPdfIds: Array<number> = new Array();
  selectedFileName: Array<string> = new Array();
}

export class CSVTemplate {
  id: number = 0;
  csvTemplateName: string = "";
  docType: string;
  csvTemplateDto: csvTemplateModel[] = new Array<csvTemplateModel>();
}

export class csvTemplateModel {
  label: string;
  name: string;
  category: string;
  constructor(label, name, category) {
    this.label = label;
    this.name = name;
    this.category = category;
  }
}

export class Configuration extends CommonModel {
  id: number;
  title: string;
  endPointURL: string;
  parameters: string;
  keys: string;
  methodType: string = "";
  format: string = "";
  createdBy: number;
  lastUpdatedBy: number;
  isActive: boolean = true;
  apiConfiurationTitle: String;
  documentDisplayOrder: number = 0;
}

export class ProjectSetup extends CommonModel {
  id: number = 0;
  projectName: string;
  projectCode: string = '';
  introduction: string;
  purposeAndScope: string;
  description: string;
  location: any = '';
  selectedLocations: MultiSelectDropDownDTO[] = new Array<MultiSelectDropDownDTO>();
  departments: any[] = new Array();
  departmentName: string;
  createdById: number;
  createdBy: String = "";
  createdTime: String = "";
  updatedBy: String = "";
  updatedById: number;
  updatedTime;
  activeFlag: boolean = true;
  createProjectUsingWizard: boolean = false;
  createProjectWizardId: number;
  deleteFlag: boolean = false;
  defaultFlag: boolean = false;
  publishedFlag: boolean = false;
  startDate: any;
  endDate: any;
  changeControlForms: any[] = new Array();
  customCCFEnable = true;
  customCCFValue;
  systemDescription: ProjectSetupSystemDescriptionDTO = new ProjectSetupSystemDescriptionDTO();
  selectedDocumnts: any;
  systemOwnerName: any;
  systemOwnerId: number = 0;
  businessOwner: any[] = new Array();
  ftpSize: any;
  vsrCreated: boolean = false;
  vsrNextReviewDate: any;
  editable: boolean = false;
  validationStatus: any;
  systemStatus: any;
  releaseDate: any;
  selectedDepartments: MultiSelectDropDownDTO[] = new Array<MultiSelectDropDownDTO>();
  selectedBusinessOwner: MultiSelectDropDownDTO[] = new Array<MultiSelectDropDownDTO>();
  projectType: any;
  editOnlyName: boolean;
  templateLibraryFilePath:any;
}

export class MultiSelectDropDownDTO {
  id: number;
  itemName: string;
  displayOrder: number;
}

export class ProjectSetupSystemDescriptionDTO {
  id: number = 0;
  projectSetup: number;
  equipment: number;
  equipmentName: string;
  equipmentNo: string = "";
  equipmentMake: string = "";
  type: string;
  softwareName: string;
  softwareVersion: string;
  use: string;
  gxpCriticality: string;
  erApplicability: string;
  esApplicability: string;
  validationStatus: string;
  typeOfSystem: string;
  validationStrategy: string;
  acceptanceCriteria: string;
  urlChecklist: any[] = new Array();
  userRemarks: string;
  gxpForm
  gxpFormId = 0;
  canDisableGxPForm = false;
  gampId = 0;
  gampCategory;
  checklist: CheckListEquipmentDTO[] = new Array();
  supplierName: any;
  hostingType: any;
  checklistCount = 0;
}

export class flowMasterDto extends CommonModel {
  documentNumber: any;
  documentConstantName: any;
  projectId: any;
  url: any;
  freezeFlag: Boolean;
  freezeComments: String;
  settings: any;
  flowId: Number;
  levelId: Number;
  levelOrder: Number;
  documentFlows: any[] = new Array();
  flowNotificationDto: any;
  documentName;
  projectName;
  exists;
  documentCurrentFlowId;
  documentDisplayOrder;
  saveType: string;
  userPermissionsList: any;
  allUserApproval: boolean = false;
}

export class flowNotificationDto {
  userId: number;
  userName: string;
  notification: Boolean = false;
  email: Boolean = false;
  followUp: Boolean = false;
  roleIdOfUser: number;
  roleName: string;
  displayOrder: number;
  deptIdOfUser: any;
  deptName: any;
  locationIdOfdept: any;
  locationName: any;
}

export class Schedular extends CommonModel {
  name: string;
  apiConfigurationId: number;
  id: number;
  searchTerms: string;
  emailId: any;
  frequency: string = "";
  day: string = "";
  reportFormat: string = "";
  numberOfItems: string = "";
  optionalSubject: string;
  active: boolean = true;
  newRecordsFlag: boolean = false;
  createdBy: number;
  lastUpdatedBy: number;
  schedularStartDate: any;
  dynamicForm: Number[] = new Array<Number>();
}

export class Constants extends CommonModel {
  public APPROVE: string = '3';
  public DECLINE: string = '4';
  public PENDING: string = '1';
  public IN_PROGRESS: string = '2';
  public ICSR: string = 'ICSR- 1 day';
}

export class NavigationDTO extends CommonModel {
  navigateFlag: any = false;
  navigateIdValue: any;
  navigateType: any;
  navigateReviewId: any;
  status: any;
}

export class Urs extends CommonModel {
  ursName: string;
  ursCode: string;
  description: String;
  projectSetupId: any;
  projectSetupName: String;
  priority: Number = 0;
  category: Number = 0;
  id: number = 0;
  testCaseTypes: TestCaseTypeDTO[] = new Array();
  specData: any[] = new Array();
  checklist: CheckListEquipmentDTO[] = new Array();
  testingRequired: boolean = false;
  potentialRisk: String = "";
  implementationMethod: String = "";
  testingMethod: String = "";
  complianceRequirements: any[] = new Array();
}
export class DeviceMaster extends CommonModel {
  id: any;
  orgId: any;
  type: any;
  deviceMCid: any;
  deviceIPaddress: any;
  deviceOS: any;
  assetId: any;
  filePath: any;
  purchaseDate: any;
  selectedFile: any;
  activeFlage: any;
  uploadedFile: any;
  fileName: any = "";
  userId: any;
  fileExtention: any;
}
export class TestCaseModel extends CommonModel {
  id: number = 0;
  projectId: any;
  projectName: string;
  description: string = '';
  environment: string;
  ursListData: any[];
  expectedResult: string;
  actualResult: string;
  status: string = "";
  attachment: string;
  testCaseType: string;
  createdBy: number;
  testCaseCode: string;
  files: any[];
  documentStatusId: number;
  documentStatus: number;
  publishedflag: boolean;
  executionFlag: boolean;
  isDFAvalible: any;
  checklist: CheckListTestCaseDTO[] = new Array();
  fileList: FileDTO[] = new Array();
  businessImpact: any;
  specificationIds: any[];
  riskIds: any[];
  masterFlag = false;
  canExecute = true;
  constantName;
  urlChecklist: any[] = new Array();
  ursIds: any[];
  acceptanceCriteria: any;
  preRequisites: any;
  imagesCount:any;
}

export class FileDTO {
  id: any;
  fileName: any;
  filePath: any;
  displayTime = new Date();
}
export class ModulePermissionDto {
  moduleName: string;
  permissionConstantId: string;
  url: string;
}

export class CheckListDTO {
  id: any;
  checklistName: any;
  completedFlag: any;
  loginUserId: any;
  loginUserName: any;
  updatedTime: any;
  status: any;
  remarks: any;
  files: any[] = new Array();
  displayOrder: any = 0;
}

export class CheckListTestCaseDTO {
  id: any;
  checklistName: any;
  status: any;
  remarks: any;
  completedFlag: any;
  loginUserId: any;
  loginUserName: any;
  displayOrder: any;
  updatedTime: any;
  files: any[] = new Array();
  expectedResult: any;
}

export class CheckListEquipmentDTO {
  id: any;
  checklistName: any;
  completedFlag: any;
  displayOrder: any;
  loginUserId: any;
  loginUserName: any;
  updatedTime: any;
  completed: boolean = false;
  focusFlag: boolean = false;;
}

export class AuditTrail extends CommonModel {
  loginUserName: String;
  event: String;
  ipAddress: String;
  createdTime: any;
  systemRemarks: String;
  userRemarks: String;
  browser: String;
  fromDate: String;
  toDate: String;
  selectedLocation: any = "";
  selectedProject: any = "";
  selectedDocument: any;
  selectedUser: number;
}

export class EmailHistoryDTO extends CommonModel {
  id: Number;
  organisationId: Number;
  projectName: any;
  projectId: any;
  versionId: any;
  versionName: any;
  templateId: any;
  templateName: any;
  documentType: any;
  documentName: any;
  fromDate: any;
  toDate: any;
  sendBy: any;
  sendByUser: any;
  status: any;
  event: any;
  systemRemarks: any;
  documentCode: any;
  createdTime: any;
}

export class Priority extends CommonModel {
  id: number = 0;
  priorityCode: String;
  priorityName: String;
  deleteFlag: boolean = false;
  priorityColor: any;
}

export class Category extends CommonModel {
  id: number;
  categoryName: any;
  deleteFlag: boolean = false;
}

export class multipleSelectDropDownValue {
  displayOrder: string;
  value: string;
}

export class Department extends CommonModel {
  id: number = 0;
  departmentName: string;
  departmentCode: string;
  organizationName: string;
  location: any = '';
}

export class ImgList {
  imgPath: string;
  visible: boolean;
}

export class RiskAssessment extends CommonModel {
  id: number = 0;
  riskFactor: string;
  ursList: any[];
  riskScenario: string;
  probableCauseOfRisk: string;
  proposedMitigation: string;
  probabilityOfOccurance: number;
  severity: number;
  riskclass: number;
  detectability: number;
  priority: number;
  rpn: number;
  critical: number;
  publishedflag: any;
  assessmentCode: string;
  specificationIds: any[];
  failTestCaseId: number;
  failTestCaseCode: string;

  residualFlag: boolean = false;
  residualProbability: number;
  residualDetetablity: number;
  residualServerity: number;
  residualRpn: number;
  residualPriority: number;
  residualCritical: number;
  residualConclusion: string;
}

export class RiskAssessmenttemplate extends CommonModel {
  id: number;
  titledata: string;
  bodydata: string;

}

export class RolePermissionSave {
  roleId: number;
  category: string;
  loginID: number
  permissions: RolePermissions[];
  userRemarks: string;
}

export class RolePermissions {
  id: number;
  permissionTitle: string;
  permissionId: number;
  createButtonFlag: boolean;
  updateButtonFlag: boolean;
  deleteButtonFlag: boolean;
  viewButtonFlag: boolean;
  workFlowButtonFlag: boolean;
  importButtonFlag: boolean;
  exportButtonFlag: boolean;
  publishButtonFlag: boolean;
  permissionValue: any
  groupCategoryId: any
  userId: any;
  projectId: any;
  userName: any;
  roleName: any;
}

export class Permission {
  id: number;
  permissionTitle: string;
  permissionConstantName: string;
  category: string;
  createdBy: number;
  lastUpdatedBy: number;
  deleteFlag: string;
}

export class Rolemodal extends CommonModel {
  roleName: string;
}

export class DocStatusList extends CommonModel {
  id: any;
  code: string;
  name: string;
  status: string;
  type: string;
  createdBy: string;
  lastUpdatedTime: string;
  reviewdBy: string;
  reviewdDate: string;
  approvedBy: string;
  approvedDate: string;
}

export class MasterControlFlagList extends CommonModel {
  isDepartment: boolean = false;
  isRiskAssessment: boolean = false;
  isRiskAssessmentTemplate: boolean = false;
  isOrganization: boolean = false;
  isProjectSetup: boolean = false;
  isURS: boolean = false;
  isIQTC: boolean = false;
  isPQTC: boolean = false;
  isOQTC: boolean = false;
  isUserManagement: boolean = false;
  isCategory: boolean = false;
  isPriority: boolean = false;
  isProjectSetUp: boolean = false;
  isLookUp: boolean = false;
}

export class pdfPrefencesList extends CommonModel {
  isURS: boolean = false;
  isIQTC: boolean = false;
  isPQTC: boolean = false;
  isOQTC: boolean = false;
  isProjectSetUp: boolean = false;
  isRiskAssessment: boolean = false;
  isRiskAssessmentTemplate: boolean = false;
  isVendorValidation: boolean = false;
}

export class SelectStyles {
  selectedColor: string;
  selectedSize: string;
  selectedFontStyle: string;
  selectedDocType: string;
  selectedProject: String;
  createdUser: String;
  selectedFeild: String;
}

export class VendorValidationDTO extends CommonModel {
  id: Number = 0;
  vendorCode: string;
  documentName: string;
  fileName: string = "";
  filePath: string = "";
  createdBy: string = "";
  updatedBy: string = "";
  publishedflag: boolean = false;
}

export class CssDTO extends CommonModel {
  id: number;
  documentType: string;
  fontFamily: string = "TIMES_ROMAN";
  pdfPassword: string;
  pdfWaterMark: string
  pdfDocStatusWaterMark: string
  headerConfiguration: HeaderOrFooterDTO;
  footerConfiguration: HeaderOrFooterDTO;
  mainPageConfiguration: HeaderOrFooterDTO;
  documentNumber: any;
  form: boolean;
  formMappingId: any;
  tabName: string = "";
  pdfCompressionType: string;
  copyConfigIds: any;
  borderFlag: boolean = false;
  tocFlag: boolean = false;
  selectedColumns: any[];
  approvalHistoryColumns: any[];
  revisionHistoryColumns: any[];
  preApprovalHistoryColumns: any[];
}

export class HeaderOrFooterDTO {
  id = Date.now();
  type: string;
  fontFamily: string = "TIMES_ROMAN"
  fontSize: number = 12;
  fontColor: string = '#000000';
  fontStyle: string = "normal";
  borderFlag: boolean = false;
  childs: HeaderOrFooterChildDTO[] = new Array();
}

export class HeaderOrFooterChildDTO {
  id = Date.now();
  position: string = "left";
  type: string = "text";
  image;
  text = "";
  alignment: string = "left";
  order: number;
  reqVariableName: boolean = true;
}

export class PDFChapterDTO extends CommonModel {
  id = 0;
  type = "";
  chapterName = '';
  chapterContent = '';
  activeFlag = true;
  createdByName
  updatedByName
  projectId: any;
}

export class DocumentFieldsDto {
  field: string
  activeFlag: boolean;
}

export class CssMenu {
  permissionTitle: string;
  permissionValue: string;
}

export class AdvancedSearch {
  selectedDocument: string = "";
  searchData: string = "";
}

export class DynamicTemplateDto extends CommonModel {
  id: number = 0;
  usersByCreatedBy: number;
  usersByApprovedBy: number;
  usersByReviewedBy: number;
  usersByLastUpdatedBy: number;
  tittle: string;
  body: string;
  projectId: number;
  templateCode: string = "";
  documentStatus: number = 1;
  published: string = "";
  formName: string;
  permissionId: number;
  organizationId: number;
  createFlag: boolean;
  updateFlag: boolean;
}

export class MasterEnailSetupDto extends CommonModel {
  id: number = 0;
  orgId: any;
  port: number;
  host: string;
  userName: string;
  password: string;
  createdBy: any;
  createdTime: any;
  updatedBy: any;
  updatedTime: any;
  sslEnable: boolean;
  toAddress: any;
}

export class EmailTemplateConfigDTO extends CommonModel {
  id: number = 0;
  orgId: any;
  ruleId: any;
  templateName: string;
  sampleTemplate: string;
  createdBy: any;
  createdTime: any;
  updatedBy: any;
  updatedTime: any;
  activeFlag: boolean;
  deleteFlag: boolean;
}

export class RevisionDto {
  id: number;
  organizationId: number;
  versionName: string;
  documentType: string;
  documentId: number;
  usersByCreatedBy: number;
  createdTime: string;
}

export class Projectplan extends CommonModel {
  userList
  id: number = 0;
  globalProjectId: any;
  startDate;
  endDate;
  actualStartDate;
  actualEndDate;
  updatedById;
  createdById;
  updatedByName: string;
  createdByName: string;
  createdTime;
  lastUpdatedTime;
  documentConstantName: string = "";
  documentName: string;
  displayStartDate;
  displayEndDate;
  displayActualStartDate;
  displayActualEndDate;
  deleteFlag: boolean;
  publishFlag: boolean;
}

export class DiscrepancyForm extends CommonModel {
  id: any;
  projectName: string;
  projectId: string;
  protocolNo: any;
  discrepancyDescription: string;
  actionTaken: string;
  requestRaised: boolean = false;
  requestNo: string;
  resultForAction: string;
  createdBy: string;
  documentType: any;
  documentCode: string;
  dfStatus: any;
  testCaseId: any;
  testCaseName: any;
  imageBase64: any;
  createdTime: any;
  deleteFlag: any;
  publishFlag: any;
  executionFlag: any;
  checklist: CheckListDTO[] = new Array();
  fileList: any[] = new Array();
  investigation: string;
  rootCause: string;
  createNewVersion: boolean = true;
  category: any;
  urlChecklist: any[] = new Array();
  solution;
  discrepancyComments;
  reTestFlag: boolean = false;
}

export class MasterDynamicForm extends CommonModel {
  id: number = 0;
  templateName: string = "";
  formStructure: string;
  deleteFlag: boolean;
  createdBy: any;
  createdtime: any;
  updatedBy: any;
  updatedTime: any;
  activeFlag = true;
  multipleEntryFlag = true;
  permissionConstant;
  workFlowLevels: any = new Array();
  equipmentIds: any;
  publishedFlag: any;
  prefix: string = "";
  suffix: string = "";
  departments: any[] = new Array();
  effectiveDate: any;
  nextReviewDate: any;
  version: any;
  departmentName: string;
  templateOwnerId: number = 0;
  templateOwnerName: string;
  formType: string = "Project Specific";
  qrCodeFlag = false;
  projectFlag = false;
  equipmentFlag = false;
  cleanRoomFlag = false;
  productOrBatchFlag = false;
}

export class FormEquipmentMapping extends CommonModel {
  id: any = 0;
  equipmentIds: any;
  formId: any;
  stages: any;
  mappingId: any;
  mappingFlag;
  createdBy: any;
  createdTime: any;
  updatedBy: any;
  updatedTime: any;
}

export class TestCaseTypeDTO {
  display: String;
  value: String;
  selectedFlag: boolean;
  testCaseDescription: String;
}

export class NotificationDTO {
  message: String;
  id: number;
  notifiedUser: any[] = new Array();
}

export class EquipmentUserMapping extends CommonModel {
  id: any;
  userIds: any;
  templateId: any;
  equipmentId: any;
}

export class DynamicFormDTO extends CommonModel {
  id: number = 0;
  templateName: string = "";
  formData: string;
  deleteFlag: boolean;
  createdBy: any;
  createdtime: any;
  updatedBy: any;
  updatedTime: any;
  permissionConstant: any;
  dynamicFormCode: any = "";
  projectId: any;
  masterDynamicFormId: any;
  publishedflag: boolean;
  createdByName: string = "";
  updatedByName: string = "";
  status: string = "";
  equipmentNames: string = "";
  equipmentId: any = "0";
  equipmentName: string = "";
  batchId: any = "0";
  batchName: string = "";
  productName: string = "";
  equipmentStatusId: any = "0";
  ccfId: number = 0;
  formDataList = new Array();
  formMappingId: any;
  isMapping: any;
  documentPreviewFlag: any;
  downloadDocType: any;
  currentCommonLevel: any;
  workflowAccess: any;
  multipleEntry = false;
  excelPreviewFlag: any;
  previewFileExtention: any;
  workflowEsignCompletionFlag: any = "N";
  masterDataLinkIds: any[] = new Array();
  masterLinkIds: any[] = new Array();
  reasonForEdit: string;
  displayCreatedTime: any;
  displayUpdatedTime: any;
  parameters: any;
  apiConfigDataFlag: boolean;
  apiBackgroundJob: boolean;
  apiRawDataFilePath: string;
  documentSpecifiedConstant: string;
  qrCodeFlag = false;
  projectEnabledFlag = false;
  equipmentFlag = false;
  cleanRoomFlag = false;
  productOrBatchFlag = false;
  cleanRoomId: any;
  projectDropDownId: any
}

export class VsrDTO extends CommonModel {
  id: number = 0;
  publishedFlag: boolean;
  projectId: any;
  freezeFlag: boolean;
  deleteFlag: boolean;
  createdBy: any;
  createdTime: any;
  lastUpdatedBy: any;
  lastUpdatedTime: any;
  objectiveAndPurpose: string;
  scope: string;
  validationSummary: string;
  validationDeliverable: string;
  riskAssessment: string;
  summaryOfDeviations: string;
  observationAndRecommendation: string;
  userAcceptance: string;
  validationExpiryDate: any;
  releaseDate:any;
  validationSummaryChildDto: any[];
  validationDate: any;
  changeControlForms: any[] = new Array();
  customCCFEnable = true;
  customCCFValue;
  urlChecklist: any[] = new Array();
  periodicReviewFlag: boolean = false;
  newVersionRequiredFlag: boolean = false;
}

export class WorkFlowLevelDTO extends CommonModel {
  id: number;
  workFlowLevelName: string = "";
  activeFlag: string;
}

export class ProjectWorkFlowLevels {
  documentId: any;
  workFlowLevels: Number[];
}

export class WorkFlowUsersDTO {
  id: any;
  projectSetup: any;
  userIds: Number[];
  workFlowLevels: any;
  documentList: any;
  activeFlag: string;
}

export class MasterDynamicWorkFlowConfigDTO extends CommonModel {
  id: number = 0;
  masterId = 0;
  workFlowLevelId = 0;
  users: number[];
  activeFlag = true;
  createdBy;
  updatedBy;
  createdTime;
  updateTime;
}

export class FormExtendToDocumentDTO extends CommonModel {
  id: number = 0;
  projectId;
  documentConstant: number = 0;
  jsonStructure = "[]";
  activeFlag = true;
  createdBy;
  updatedBy;
  createdTime;
  updateTime;
  formExtend = false;
}

export class MasterDynamicTemplate extends CommonModel {
  id: number = 0;
  templateName: string = "";
  fileName: string = "";
  filePath: string = "";
  createdBy: any;
  createdtime: any;
  updatedBy: any;
  updatedTime: any;
  activeFlag = true;
  permissionConstant;
  workFlowLevels: any = new Array();
  publishedflag: boolean;
  prefix: string = "";
  suffix: string = "";
  departments: any[] = new Array();
  effectiveDate: any;
  nextReviewDate: any;
  version: any;
  departmentName: string;
  templateOwnerId: number = 0;
  templateOwnerName: string;
}

export class DynamicTemplateDTO extends CommonModel {
  id: number = 0;
  templateName: string = "";
  fileName: string = "";
  filePath: string = "";
  deleteFlag: boolean;
  createdBy: any;
  createdtime: any;
  updatedBy: any;
  updatedTime: any;
  permissionConstant: any;
  dynamicTemplateCode: any;
  projectId: any;
  masterDynamicTemplateId: any;
  publishedflag: boolean;
  displayCreatedTime: any;
  displayUpdatedTime: any;
  createdByName: any;
  lastUpdatedByName: any;
  status: any;
}

export class esign {
  userId: Number;
  globalProjectId: Number;
  Comments: String;
  documentName: String;
  username: String;
  password: String;
  session: Number;
  versionName: String;
  documentCode: Number;
  uniqueCode: Number;
}

export class LDAPMasterData {
  id: number = 0;
  type = 'localAD';
  hostName;
  clientUserName;
  clientPassword;
  tenantId;
  clientId;
  clientSecretID;
  activeFlag = true;
}

export class KnowledgeBaseCategory extends CommonModel {
  id: number;
  category: string;
  displayorder: any;
  activeFlag: string;
  icon: string;
  selectedImageName: string;
}

export class KnowledgeBaseSubCategory extends CommonModel {
  id: number;
  categoryId: number;
  subCategoryName: string;
  displayorder: string;
  activeFlag: string;
}

export class KnowledgeBaseContent extends CommonModel {
  id: number;
  subCategoryId: number;
  content: string;
  categoryId: number;
  categoryName: string;
  subCategoryName: string;
  modulesList: string[] = new Array();
  modulesNames: string[] = new Array();
  fileName: any;
}

export class Location extends CommonModel {
  id: number = 0;
  code: string;
  name: string;
  active: string;
  updatedTime: string;
  stepList: any
}

export class Equipment extends CommonModel {
  id: number;
  locationId: number;
  code: string;
  name: string;
  active: string;
  manufacturer: string;
  dateOfPurchase: any;
  updatedTime: string;
  soldBy: any;
  model: any;
  totalCapacity: any;
  usageCapacity: any;
  iqCompletionDate: any;
  oqCompletionDate: any;
  selectedFile: any;
  selectedFileName: any
  sequence: string;
  checklist: CheckListEquipmentDTO[] = new Array();
  category: any;
  departments: any[] = new Array();
  departmentName: string;
  systemOwner: any[] = new Array();
  systemOwnerName: string;
  description: string;
  component: string;
  qualificationStatus: any;
  gxpRelevence: any;
  releaseDate: any;
  periodicReview: any;
}

export class EquipmentDashboardDetails extends CommonModel {
  id: any;
  equipmentName: any;
  createdBy: any;
  batchName: any;
  currentStatus: any;
  lastStatus: any;
  remainingDueDays: any;
  equipmentId: any = "";
  equipmentImage: any;
  productName: any;
  createdTime: any;
  statusDescription: any;
  dueDate: any;
}

export class freezeModule {
  Id: Number;
  orderId: Number;
  comment: String;
  commentsHistory: any[];
  documentName: String;
  flag: boolean;
  id: Number;
  parentId: Number;
  projectId: Number;
}

export class Facility extends CommonModel {
  id: number;
  locationId: number;
  equipmentId: any;
  name: string;
  active: string;
  updatedTime: string;
}

export class defaultTemplateDto {
  id: Number;
  projectId: Number;
  templatefor: String;
  templateId: Number;
  orgId: any;
  userId: Number;
}

export class Shift extends CommonModel {
  id: number = 0;
  name: number;
  startTime: any;
  endTime: string;
  active: string;
}

export class ComplianceAssessment extends CommonModel {
  id: number = 0;
  category: string;
  reference: string;
  description: string;
  status: string;
}

export class FormReports extends CommonModel {
  formId: string = "";
  status: string = "";
  startDate: any;
  endDate: any;
  equipmentId: string = "";
  shiftId: string = "";
  batchId: string = "";
  mappingId: number;
}

export class StepperClass {
  code: String;
  constantName: String;
  documentIdentity: Number;
  publishedFlag = false;
  lastupdatedTime: String;
  selectedProject: Number;
  creatorId: Number;
  documentIds: any[];
  displayCreatedTime: any;
  displayUpdatedTime: any;
  documentTitle: any;
  createdBy: any;
  updatedBy: any;
  testRunName: any;
  userRemarks: string;
  draftFlag;
}

export class EquipmentStatus extends CommonModel {
  id: number;
  batchId: any;
  equipmentId: any;
  frequency: any;
  templateId: any;
  status: any;
  updatedTime: string;
  nextScheduleDate: any;
  taskDescription: any;
  dynamicFormsList: dropDownDto[] = new Array<dropDownDto>();
}

export class ExpressionDTO {
  id: string;
  operandOneId: string;
  operator: string;
  operandTwoId: string;
  finalResultId: string;
  operandTwoConstant: string;
}

export class ReferenceDTO {
  id: string;
  columnId: string = "";
  referenceId: any[] = new Array();
  referenceType: string = "";
  inBetween: string = "";
  enableInBetween: boolean = false;
}

export class ConditionDTO {
  id: string /** index of the array */
  name: string
  type: string /** range ,compare , condition */
  operandOneId: string /** to which we need to implement */
  //type=> range
  rangeValue?: string; /**To give the range value +- 4 */
  //
  //type=> compare string 
  operator?: string; /**  (Equal To OR Not Equal To)*/
  operandTwoId?: string;
  defaultValue: string;   /**  (Else part Value)*/
  caseSensitive?: boolean
  //
  //type => condition
  conditionChild?: ConditionChildDTO[] // condition Child DTO
  //
  constantValue?: string;
  resultOperandId: string; /**  output need to set to */
  outPutValue: string;   /** output value */
  color: string = '#ffffff'; /** color to be implemented */
  defaultColor: string = '#ffff00';
}

export class ConditionChildDTO {
  id: string = "0";
  lowerLimitCondition: string;  /* (Dropdown to select)*/
  lowerLimitValue: string;  /* (Constant value / Variable in the form)*/
  lowerConstantValue: string;
  upperLimitCondition: string;  /* (Dropdown to select)*/
  upperLimitValue: string;  /* (Constant value / Variable in the form)*/
  upperConstantValue: string;
  outPutValue: string
  color: string = '#ffffff';
}

export class testmail {
  templateId: Number;
  loggedInUser: Number;
  userModalList: any[] = new Array();
}
// tslint:disable-next-line: class-name
export class templateBuilder extends CommonModel {
  id: Number;
  templateName: String;
  templateContent: String;
  createdTime: String;
  updatedTime: String;
  createdUser: Number;
  updatedUser: Number;
  activeFlag: Boolean;
  deleteFlag: boolean;
  templateInUse: boolean;
}

export class CalendarEventDTO extends CommonModel {
  id: number = 0;
  start: any;
  end: any;
  status: any;
  title: string;
  holidayFlag: string;
  equipmentId: any;
  frequency: any;
  color: CalendarColorDTO = new CalendarColorDTO();
}

export class CalendarColorDTO {
  primary: string;
  secondary: string;
}

export class WeekDaysDTO extends CommonModel {
  id: Number;
  weekdayId: Number;
  weekday: string;
  weekdayCode: Number;
  selectedFlag: boolean;
}

export class EmailRule extends CommonModel {
  id: number = 0;
  orgId: number;
  ruleName: string;
  projectId: number;
  projectName: string;
  documentId: number;
  documentName: string;
  documentStatusId: number;
  documentStatus: string;
  roleId: number;
  roleName: string;
  activeFlag: boolean = true;
  deleteFlag: boolean;
  createdTime: string;
  createdBy: number;
  updatedTime: string;
  updatedBy: number;
  conditionList: Condition[] = new Array<Condition>();
}

export class Condition {
  actionType: string;
  userIds: any[] = new Array();
  frequency: string;
  templateId: any = 0
  constructor(actionType: string, userIds: any[], frequency: string) {
    this.actionType = actionType;
    this.userIds = userIds;
    this.frequency = frequency;
  }
}

export class FormMappingDTO extends CommonModel {
  id = 0;
  name = "";
  masterFormId = 0;
  mappingList: FormMappingChildList[] = new Array<FormMappingChildList>();
  activeFlag: boolean = true;
  deleteFlag: boolean;
  createdTime: string;
  createdBy: number;
  updatedTime: string;
  updatedBy: number;
}

export class FormMappingChildList {
  formId: Number = 0;
  order: Number = 0;
  constructor(formId: Number, order: Number) {
    this.formId = formId;
    this.order = order;
  }
}

export class WorkflowDocumentStatusDTO extends CommonModel {
  documentType: any;
  documentCode: any;
  documentId: any;
  approvedFlag: Boolean;
  currentLevel: any;
  multiDynamicForm: any;
  multiDynamicUniqueId: any;
  noProjectRequiredFlag: Boolean;
  session: any;
  groupedItems: any = new Map<Number, String>();
  docName: any;
  actionType: Number;
  comments: any;
  currentUser: any;
  publishFlag: any;
  workflowAccess: any;
  levelName: any;
  creatorId: Number;
  displayCreatedTime: any;
  displayUpdatedTime: any;
  documentTitle: any;
  createdBy: any;
  updatedBy: any;
  actionTypeName: any;
  testRunName: any = '';
}

export class DateFormatDTO {
  orgId: any;
  userId: any;
  dateFormat: any;
  timeZoneId: any;
  newDateFormat: boolean;
  ftpFileSize: any;
  datePattern: any
}

export class ChangeControlForm extends CommonModel {
  id: any;
  selectedUsers: any;
  editSelectedUsers: any;
  selectedDept: any;
  cfftype: string;
  name: string;
  description: string;
  selectPriorityId: number;
  reason: string;
  impactassessment: string;
  assessment: string;
  regulatorynotificationFlag: boolean;
  status: string;
  dynamicFormFlag: boolean;
  formId: any;
  mappingId: any;
  completedFlag: string;
  ccfCode: string;
  dynamicFormsList: dropDownDto[] = new Array<dropDownDto>();
}

export class TaskTimerTrackingDTO {
  id: any;
  projectTaskId: any;
  startTimer: string;
  endTimer: string;
  activeFlag: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export class ProjectTaskDTO extends CommonModel {
  id: any;
  selectedUsers: any;
  selectedUserNames: any;
  taskTitle: any;
  priority: any;
  status: any;
  startTimerFlag: any;
  endTimerFlag: any;
  dueDate: any;
  remaingDays: any;
  convertedDueDate: any;
  systemGenerated: boolean = false;
  description: any;
  remainderFlag: any;
  frequency: any;
  completedFlag: any;
  deleteFlag: any;
  updatedTime: any;
  selectedDocumentTypes: any;
  selectedDocumentTypeNames: any;
  selectedDocumentIds: any;
  taskCategory: string;
  taskCode: any;
  equipmentId: any;
  isManualEntry: string
  documents: ProjectTaskDocuments[] = new Array<ProjectTaskDocuments>();
  files: FileDTO[] = new Array<FileDTO>();
  levelUserList: any;
  checklist: CheckListEquipmentDTO[] = new Array();
  documentConstant: any;
}

export class DocumentDropdownDTO {
  key: any;
  value: any;
  documentType: any;
}

export class ProjectTaskDocuments {
  documentType: any;
  documentName: any;
  selectedDocumentIds: ProjectTaskDocumentsIdDTO[] = new Array<ProjectTaskDocumentsIdDTO>();
}

export class ProjectTaskDocumentsIdDTO {
  documentId: any;
  documentCode: any;
  url: any;
}

export class TaskBoardDTO {
  name: any;
  count: any;
  list: ProjectTaskDTO[] = new Array<ProjectTaskDTO>();
}

export class TaskTimeSheetDTO {
  fromDate: string;
  toDate: string;
  projectId: number;
  documentCode: string;
  documentName: string;
  userName: string;
  documentWiseDuration: number;
  documentWiseDurationInString: string;
  userWiseDuration: number;
  userWiseDurationInString: string;
  timeSheetList: TaskTimeSheetDTO[] = new Array<TaskTimeSheetDTO>();
}

export class UserPrincipalDTO {
  id: any;
  name: any = "";
  username: any;
  email: any;
  roleId: any;
  roleName: any;
  orgId: any;
  projectId: any;
  versionId: any;
  projectName: any;
  versionName: any;
  adminFlag
  disableModel: any;
  defaultProjectId: any;
  currentProjectLocationId: any;
  defaultProjectLocationId: any;
  newUser: any;
  projectStatus: string;
}

export class CustomExcelValidateDTO {
  id: any;
  referenceId: any;
  variableType: any;
  sheetNo: any;
  rowNo: any;
}

export class FileUploadForDoc extends CommonModel {
  id: any;
  documentName: any;
  documentId: any;
  name: any;
  url: any;
  filePath: any;
  documentUniqCode: any;
  lastModifiedDate: any = "";
}

export class UserShortcutsDTO {
  id: any;
  userDocuments: any;
  userApprovalCount: any;
  tasks: any;
  equipments: any;
  testCases: any;
  modulesList: any[] = new Array();
  selectedModules: any[] = new Array();
  allTask: any;
  summary: any;
}

export class TaskFilterDto {
  formDate: string;
  toDate: string;
  projectIds: any[] = new Array();
}

export class TaskReportDTO {
  id: any;
  projectName: string;
  category: string;
  title: string;
  status: string;
  priority: string;
  userName: string = "";
  dueDate: string = "";
  createdDate: string = "";
  updatedDate: string = "";
  resolutionDate: string = "";
  timeDuration: string = "";
  documentCode: string = "";
  documentId: any[] = new Array();
  documentType: string = "";
  equipmentName: string = "";
  equipmentId: any[] = new Array();
  selectedUsers: any[] = new Array();
  completedFlag: boolean;
  remaingDay: string;
}

export class DocumentForumDTO {
  id: number;
  comments: string;
  replyId: number;
  documentType: any;
  itemId: any;
  documentId: any;
  selectedUsersList: any[];
  documentTitle: any;
  documentCode: any;
  selectedDocumentList: dropDownDto[];
  referenceId: any;
}

export class FlowFormGroupSettingsDTO {
  id: number;
  masterFormMappingId: number;
  projectId: number;
  commonApprovalFlag: boolean = false;
  workflowSequenceFlag: boolean = false;
  defaultProjectForCreator: boolean = true;
  defaultProjectWorkflowUsers: boolean = true;
  autoLock: boolean = true;
}

export class FormLinkForMasterDTO {
  id;
  documentType;
  documentName;
  linkedMasterForm = new Array<string>();
  linkedMasterFormNames;
  linkedMFWithProject = new Array<any>();
}

export class ApiConfigurationDTO {
  id: number;
  projectId: number;
  projectName: string;
  documentType: string;
  documentName: string;
  endpointUrl: string;
  apiKey: string;
  userName: string;
  password: string;
  frequency: string;
  active: boolean;
  deleteFlag: boolean;
  updatedTime: string;
  backgroundJob: boolean;
  parameters: APIParametersDTO[] = new Array();
  rawDataColumns: APICheckListDTO[] = new Array();
  mappingFormData: any[] = new Array();
  testAPIAuditRequired: boolean = false;
  rawDataFileType: any;
  mappingId: any;
}

export class APIParametersDTO {
  id: any;
  paramaterName: any;
  dataType: any;
  value: any;
}

export class APICheckListDTO {
  name: any;
  form: any;
  displayOrder: any;
}

export class DocumentSummaryDTO {
  documentCategory: string;
  documentType: string;
  documentName: string;
  documentNumber: string;
  lastUpdatedBy: string;
  lastUpdatedTime: string;
  documentUrl: string;
  freezeFlag: boolean = false;
  freezeFlagIcon: boolean = false;
  actualStartDate: string;
  actualEndDate: string;
  expectedStartDate: string;
  expectedEndDate: string;
  displayOrder: number = 0;
  projectPlan: any;

  /*Document Count For A Project Of Particular Version*/
  draft: number = 0;
  published: number = 0;
  inProgress: number = 0;
  completed: number = 0;
  /* test case count */
  testCaseCount = new Array();
  formGroupConstants: any[] = new Array();
  commonWorkFlow: any;
}
export class TestCaseSummaryDTO {
  id: number = 0;
  docType: string = "";
  testApproach: string = "";
  conclusion: string = "";
}

export class ExternalApprovalList {
  documentId: number;
  name: string;
  email: string;
  remarks: string;
  validity: any;
}

export class TestRunDTO extends CommonModel {
  id: number = 0;
  testCaseType: string;
  testRunType: string;
  testRunName: string = '';
  testRunDescription: string = '';
  users: any[] = new Array();
  targetDate;
  activeFlag = true;
  documentSequence = false;
  preApprovalFlag: boolean;
  publishFlag: boolean;
  createdBy;
  updatedBy;
  updatedTime;
  createdTime;
  buttonDisable = false;
}

export class AdhocTestCase extends CommonModel {
  id: number;
  projectId: any;
  projectName: string;
  description: string;
  testingType: string = "";
  environment: string = "";
  ursListData: any[];
  expectedResult: string;
  status: string = "";
  createdBy: number;
  testCaseCode: string;
  isDFAvalible: any;
  businessImpact: any;
  specificationIds: any[];
  riskIds: any[];
  checklist: CheckListTestCaseDTO[] = new Array();
  files: any[] = new Array();
  urlChecklist: any[] = new Array();
  imagesCount:any;
}

export class MatrixDTO {
  id: number;
  matrixSize: string
  projectId: number;
  type: any;
  min: any;
  max: any;
  flag: boolean;
}

export class ExternalApprovalDTO {
  name: string;
  email: string
  validity: number;
  remarks: any;
  documentType: any;
  documentIds: any;
  levelId: any;
}


export class ExternalApprovalCommentsDTO {
  referenceId: any;
  comments: any;
  approvalFlag: any;
  signImage: any;
}

export class EsignExternalApprovalCommentsDTO {
  referenceId: any;
  comments: any;
  approvalFlag: any;
  signImage: any;
  transactionId:any;
  sign:any;
  organizationName:any;
}

export class DocumentNumberingDTO extends CommonModel {
  id: number = 0;
  specific: string = 'organization'
  prefix: string = '';
  suffix: string = '';
  serialNumberLength: number = 3;
  serialNumberStartForm: number = 1;
  autoReset = false;
  versionPrefix = "V";
  versionStartFrom = "1";
}

export class ProjectUserPermissionsDTO {
  userIds: any;
  projectId: any;
  permissionConstant: any;
  mappingFlag: any;
}

export class DocumentSpecificFlowLevelDTO {
  id: any;
  levelId: any;
  optionId: any;
  userIds: any;
  levelOrder: any;
  documentConstantName: any;
  masterFormId: any;
  documentId: any;
  documentcode: any;
}

export class GXPModel {
  id: number = 0;
  projectId;
  sectionFirst: string;
  sectionSecond: string;
  sectionThree: string;
  sectionFour: string = 'NA';
  sectionFive: string;
  gdprConclusion: string;
  matrixId;
  criticalLevelId;
  sectionFirstList;
  sectionSecondList;
  sectionThreeList;
  sectionFourList;
  sectionFiveList;
  sectionSixList;
  section1Remarks: string;
	section2Remarks: string;
	section3Remarks: string;
	section4Remarks: string;
	section5Remarks: string;
	section6Remarks: string;
}
export class ImportUrsDataDTO {
  ursId: any;
  specList: any;
  riskList: any;
  testCasesList: any;
}

export class ProjectStatusDTO {
  projectId: any;
  validationStatus: any;
  systemStatus: any;
  comments: any;
}

export class TestCaseCountDTO {
  testCaseCount: number = 0;
  passCount: number = 0;
  failCount: number = 0;
  inProgressCount: number = 0;
  dfCount: number = 0;
  testRunCount: number = 0;
}

export class Page {
  // The number of elements in the page
  size: number = 0;
  // The total number of elements
  totalElements: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // The current page number
  pageNumber: number = 0;
}

export class FormulaDTO {
  id: string = "0"/** index of the array */
  name: string
  type: string = '';
  toBePlaced: string = '';
  operator: string = 'sss';
}

export class CleanRoomInfo extends CommonModel {
  id: number = 0;
  cleanRoomCode: any;
  locationId: any;
  locationName: any;
  departments: any[] = new Array();
  departmentName: any;
  project: any[] = new Array();
  projectId: any;
  projectName: any;
  classification: any;
  roomNo: any;
  roomName: any;
  roomOrientation: any;
  building: any;
  floor: any;
  validationStatus: any = "Initiated";
  equipments: any[] = new Array();
  sampleSpecTableData: SpecificationTableDataDTO[] = new Array<SpecificationTableDataDTO>();
  specificationInfo: CleanRoomSpecificationDTO = new CleanRoomSpecificationDTO();
}

export class CleanRoomSpecificationDTO extends CommonModel {
  id: number = 0;
  cleanRoomId: number;
  length: number;
  width: number;
  height: number;
  totalArea: any;
  newOrUpdatedRecord: boolean = true;
  specificationTableData: SpecificationTableDataDTO[] = new Array<SpecificationTableDataDTO>();
  specificationTableInfo: SpecificationUpdatedTableDTO[] = new Array<SpecificationUpdatedTableDTO>();
}

export class SpecificationTableDataDTO {
  id: number = 0;
  specificationId: number;
  category: any = "";
  subCategory: any = "";
  field: any = "";
  value: any = "";
  obeservation: any = "";
  order: number = 0;
  lastUpdatedTime: any = "";
}

export class SpecificationUpdatedTableDTO {
  id: number = 0;
  specificationId: number;
  category: any = "";
  subCategoryList: SpecificationSubCatTableDTO[] = new Array<SpecificationSubCatTableDTO>();
}

export class SpecificationSubCatTableDTO {
  id : number = 0;
  subCategory: any ="";
  order: number = 0;
  specificationTableSubData: SpecificationTableSubDataDTO[] = new Array<SpecificationTableSubDataDTO>();
}

export class SpecificationTableSubDataDTO {
  id: number = 0;
  field: any = "";
  value: any = "";
  observation: any = "";
  order: number = 0;
  updatedBy: any = "";
  updatedDate: any = "";
}

export class CleanRoomStatusDTO {
  validationStatus: any;
  comments: any;
}

export class ProcessValidationDTO {
  id: number = 0;
  shiftId: any;
  shiftName: any;
  equipmentId: any;
  equipmentName: any;
  product: any;
  batch: any;
  weightJson: any;
  noOfSamples: number;
}

export class TemplateLibraryDTO{
  id: number = 0;
  view:any; 
  userId:any;
  projectName:string='';
  equipment:string='';
  software:string='';
  createdName:string='';
  orgsInfo:any;
  orgsList:any;
  isActive:any;
  projectType:any;
  attachmentName: string = "";
  attachmentPath: string = "";
  bannerName: string = "";
  bannerImage:any;
  approverComments:any;
  activeFlag:boolean=true;
}

export class SystemReleaseDTO extends CommonModel {
  id: number = 0;
  systemName: string = "";
  systemId: string = "";
  systemVersion: string = "";
  ccNo: string = "";
  ursNo: string = "";
  validationPlan: string = "";
  conclusion: string = "";
  releaseDate: any;
  publishFlag: boolean = false;
  workflowFlag: boolean = false;
  listDto: SystemCheckListDTO[] = new Array<SystemCheckListDTO>();
}

export class SystemCheckListDTO {
  id: number = 0;
	activity: String = "";
	status: string  = 'N';
  orderBy: number = 0;
	remarks: string = "";
}