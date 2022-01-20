export class TestCaseType {
  IQTC: string = "1";
  OQTC: string = "2";
  PQTC: string = "3";
  IOQTC: string = "4";
  OPQTC: string = "5";
}

export class eSignErrorTypes {
  commentsValidation = "please enter comments";
  usernameValidation = "email is empty";
  passwordValidaiton = "password is empty";
  authenticationValidation = "authentication Failed";
  IncorrectUsernameOrEmail = "email or username is incorrect";
}

export class departmentErrorTypes {
  validationMessage = "Department is Already Present";
  departmentNamePatternValidation = "Department name should not have any special chars";
  departmentNameValidation = "Department Name is required";
  departmentCodeValidation = "Department Code is required";
  locationValidation = "Please select Location";
}

export class projectPlanSetupErrorTypes {
  validationMessage = "Project with this name already exist.";
  patternValidation = "Project name should not start with special characters";
  projectNameValidation = "Please enter project name";
  projectCodePatternValidation = "Project code should not start with number,it could not have any special chars";
  projectCodeValidation = "Please enter project code";
  departmentNameValidation = "Please select department";
  gampValidation = "Please select GAMP category";
  locationValidation = "Please select Location";
}

export class facilityErrorTypes {
  facilityNameValidation = "Facility Name already Exists";
  facilityNameRequiredValidation = "Facility Name is Required";
  locationValidation = "Location is Required";
  equipmentValidation = "Equipment is Required";
}

export class externalApprovalErrorTypes {
  nameValidation = "Name is Required";
  emailValidation = "Email is Required";
  emailPatternValidation = "Invalid Email";
  validityValidation = "Validity is Required";
  remarksValidation = "Remarks is Required";
}

export class vendorMasterErrorMes {
  code = "Code is Required";
  name = "Name is Required";
  email = "Email is Required";
  emailValidation = "Invalid email address";
  number = "Please enter a valid Mobile number";
}

export class riskAssessment {
  riskFactorNameCanNotBeBlank = "Risk Factor can't be blank";
  riskScenarioCanNotBeBlank = "Risk Scenario can't be blank";
  ursNameCanNotBeBlank = "URS Name can't be blank";
  probabilityOfOccuranceCanNotBeBlank = "Probability Of Occurance can't be blank";
  severityCanNotBeBlank = "Severity can't be blank";
  detectabilityCanNotBeBlank = "Detectability can't be blank";

}

export class locationValidationMsg {
  locationNameAlreadyExists = "Location Name already Exists";
  locationNameIsRequired = "Location Name is required";
  locationCodeIsRequired = "Location Code is required";

}

export class shiftErrorTypes {
  nameValidation = "Shift Name is Required";
  nameRequiredValidation = "Name is Required";
  starttimeValidation = "Start time is Required";
  endtimeValidation = "End time is Required";
}

export class complianceAssessmentErrorTypes {
  categoryValidation = "Category Name is Required";
  referenceValidation = "Reference is Required";
  descriptionValidation = " Description is Required";
}

export class equipmentErrorTypes {
  equipmentNameValidation = "Equipment Name already Exists";
  equipmentNameRequiredValidation = "Equipment Name is required";
  equipmentCodeRequiredValidation = "Equipment Code is required";
  qualificationStatusRequiredValidation = "Please select Qualification Status";
  locationIdRequiredValidation = "Please select Location";
}

export class batchCreationErrorTypes {
  productNameValidation = "Please enter product name";
  batchNumberValidation = "Please enter batch number";
  equipmentValidation = "Please select equipment";
}

export class addUserErrorTypes {
  mobileNumberPatternValidation = "Please enter a valid Mobile number";
  mobileNumberValidation = "Mobile Number can't be blank";
  emailNumberPatternValidation = "Please enter a valid Email Id";
  designationPatternValidation = "Designation not start with number,it could not have any special chars";
  lastNamePatternValidation = "Last name should not start with number,it could not have any special chars";
  lastNameValidation = "Last Name can't be blank";
  firstNamePatternValidation = "First name should not start with number,it could not have any special chars";
  firstNameValidation = "First Name can't be blank";
  userNamePatternValidation = "User name should not start with number,it could not have any special chars";
  userNameValidation = "User Name can't be blank";
  userPatternValidationMessage = "Alphanumeric of size 8 to 15 characters allowed";
  userNameLengthValidation = "Minimum 8 characters needed";
  responcibilityPatternValidation = "Responcibilities not start with number,it could not have any special chars"
}

export class masterDataSetUpTemplates {
  templateNameCanNotBeBlank = "Please Enter Template Name";
  fileUploadCanNotBeBlank = "Please Upload File";
  levelsForWorkFlowCanNotBeBlank = "Please Select Level";
  pleaseSelectTheLevel = "Please Select Level";
  pleaseSelectAtleastOneRole = "Please Select Role";
  pleaseSelectAtleastOneUser = " Please Select User";
  dynamicTemplateWithThisNameAlreadyExist = "Template with this name already exist.";
}

export class constantValues {
  vsr: string = "137";
}

export class periodicReviewErrorTypes {
  reviewDateValidation = "Review Date is required";
}

export class ApiConfigurationErrorTypes {
  endPointRequiredValidation = "End point URL is Required";
  apiKeyRequiredValidation = "API key is Required";
  projectRequiredValidation = "Project is Required";
  documentRequiredValidation = "Document is Required";
}

export class EsignAgreementMessege {
  agreementMessage = "By selecting the 'I Accept' button, you are signing this document electronically. You agree your electronic signature is the legal equivalent of your manual signature on this document";
}