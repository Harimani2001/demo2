import { Injectable } from "@angular/core";

@Injectable()
export class PermissionCategory{
   map:Map<string,string[]> = new Map<string,string[]>()

 permissionSet() : Map<string,string[]>{

//general
this.map.set("102",['Y','Y','Y','Y','Y','Y','Y','Y']);//audittrail 1
this.map.set("91",['Y','Y','Y','Y','Y','Y','Y','Y']);//MAIN menu 2
this.map.set("101",['Y','Y','Y','Y','Y','Y','Y','Y']);//dashboard 3
this.map.set("136",['Y','Y','Y','Y','Y','Y','Y','Y']);//dms 4
this.map.set("155",['Y','Y','Y','Y','Y','Y','Y','Y']);//view knowledge base 5

//user access
this.map.set("112",['Y','N','N','N','Y','Y','Y','Y']);//usermanagemant 1
this.map.set("125",['Y','Y','Y','Y','Y','Y','Y','Y']);//roles Management 2

//equipment
this.map.set("163",['N','N','N','N','Y','Y','Y','Y']);//batch creation 1
this.map.set("176",['N','N','N','N','Y','Y','Y','Y']);//device master 2
this.map.set("178",['Y','Y','Y','Y','Y','Y','Y','Y']);//equipment dashboard 3
this.map.set("170",['Y','Y','Y','Y','Y','Y','Y','Y']);//info 4
this.map.set("168",['Y','N','N','N','Y','Y','Y','Y']);//log mapping 5
this.map.set("164",['N','Y','Y','Y','Y','Y','Y','Y']);//old equipment dashboard 6
this.map.set("162",['Y','Y','Y','Y','Y','N','Y','Y']);//register 7
this.map.set("166",['Y','N','N','N','Y','N','Y','Y']);//status update 8
this.map.set("165",['Y','N','N','N','Y','N','Y','Y']);//summary 9
this.map.set("175",['Y','N','N','N','Y','Y','Y','Y']);//user mapping 10

//master data setup
this.map.set("104",['Y','N','N','N','Y','Y','Y','Y']);//category 1
this.map.set("191",['N','N','N','N','Y','N','N','N']);//change control form 2
this.map.set("103",['Y','N','N','N','Y','Y','Y','Y']);//department 3
this.map.set("141",['N','N','N','N','Y','Y','Y','Y']);//equipment master 4
this.map.set("142",['Y','N','N','N','Y','Y','Y','Y']);//facility 5
this.map.set("139",['N','N','N','N','N','N','N','Y']);//forms 6
this.map.set("140",['Y','N','N','N','Y','Y','Y','Y']);//location 7
this.map.set("105",['Y','N','N','N','Y','Y','Y','Y']);//priority 8
this.map.set("143",['Y','N','N','N','Y','Y','Y','Y']);//shift 9
this.map.set("138",['N','N','N','N','Y','N','N','Y']);//templates 10
this.map.set("154",['Y','N','N','Y','Y','Y','Y','Y']);//workflow level 12
this.map.set("199",['Y','N','N','N','Y','Y','Y','Y']);//Vendor Master 13
this.map.set("219",['N','N','N','N','Y','Y','N','N']);//Cleanroom
this.map.set("220",['Y','N','N','N','Y','Y','Y','Y']);//Statistical Process Control
this.map.set("235",['Y','N','N','N','Y','Y','N','N']);//System Release Certificate

//validation
this.map.set("135",['Y','Y','Y','Y','Y','Y','Y','Y']);//bulk upload 1
this.map.set("134",['Y','Y','Y','Y','Y','Y','Y','Y']);//discrepancy form 2
this.map.set("181",['Y','Y','Y','Y','Y','Y','Y','Y']);//document approval status 3
this.map.set("180",['Y','Y','Y','Y','Y','Y','Y','Y']);//document summanry 4
this.map.set("108",['N','N','N','N','Y','N','N','N']);//iqtc 5
this.map.set("109",['N','N','N','N','Y','N','N','N']);//pqtc 6
this.map.set("110",['N','N','N','N','Y','N','N','N']);//oqtc 7
this.map.set("192",['N','N','N','N','N','N','Y','Y']);//periodic review 8
this.map.set("116",['Y','N','Y','Y','Y','Y','Y','Y']);//project plan 9
this.map.set("100",['N','N','N','Y','Y','Y','N','N']);//project setup 10
this.map.set("167",['Y','Y','Y','Y','Y','Y','Y','Y']);//project summary 11
this.map.set("113",['N','N','N','N','Y','N','N','N']);//riskassessment 12
this.map.set("150",['Y','Y','Y','Y','Y','Y','Y','Y']);//testcase creation 13
this.map.set("129",['Y','Y','Y','Y','Y','Y','N','N']);//traceability matrix 14
this.map.set("107",['N','N','N','N','Y','N','N','N']);//urs 15  
this.map.set("128",['N','N','N','N','Y','N','N','N']);//vendor document 16
this.map.set("137",['Y','N','N','Y','Y','N','N','N']);//vsr 17
this.map.set("201",['N','N','N','N','Y','Y','N','N']);//ad-hoc testing 18
this.map.set("200",['N','N','N','N','Y','N','N','N']);//specification 19 
this.map.set("206",['Y','N','Y','Y','Y','N','Y','Y']);//User Acceptance 20
this.map.set("207",['N','N','N','N','Y','N','N','N']);//ioqtc 21
this.map.set("208",['N','N','N','N','Y','N','N','N']);//opqtc 22

//settings
this.map.set("106",['Y','N','N','N','Y','Y','Y','Y']);//document numbering
this.map.set("196",['Y','N','N','N','Y','Y','Y','Y']);//api configuration 1
this.map.set("179",['Y','N','N','Y','Y','Y','Y','Y']);//calender view 2
this.map.set("189",['Y','Y','N','Y','Y','Y','Y','Y']);//date format setting 3
this.map.set("188",['Y','Y','Y','Y','Y','Y','Y','Y']);//email logs 4
this.map.set("174",['N','N','N','N','Y','Y','Y','Y']);//email rule 5  
this.map.set("173",['Y','N','Y','N','Y','Y','Y','Y']);//holiday scheduler 6
this.map.set("160",['Y','N','N','N','Y','Y','Y','Y']);//knowledgebase setup 7
this.map.set("161",['Y','N','N','N','Y','Y','Y','Y']);//knowledgebase setup 7
this.map.set("157",['N','N','N','N','Y','Y','Y','Y']);//ldap 8
this.map.set("127",['N','N','N','N','Y','Y','Y','Y']);//master control 9
this.map.set("195",['Y','Y','Y','Y','Y','Y','Y','Y']);//mytask 10
this.map.set("153",['Y','N','N','Y','Y','Y','Y','Y']);//pdf setting 11
this.map.set("193",['Y','Y','Y','Y','Y','Y','Y','Y']);//reports 12
this.map.set("171",['Y','N','N','Y','Y','Y','Y','Y']);//smtp master setup 13
this.map.set("190",['N','N','N','N','Y','Y','Y','Y']);//tasks 14
this.map.set("194",['Y','Y','Y','Y','Y','N','Y','Y']);//taskreports 15
this.map.set("177",['Y','N','N','N','Y','Y','Y','Y']);//template builder 16
this.map.set("197",['Y','Y','Y','Y','Y','Y','Y','Y']);//timeline graph 17
this.map.set("222",['Y','N','N','N','Y','Y','Y','Y']);//master work flow setup 18
this.map.set("211",['Y','Y','Y','Y','Y','Y','Y','Y']);//sftp 19
this.map.set("203",['N','Y','Y','Y','Y','N','Y','Y']);//inventory report
this.map.set("204",['Y','Y','Y','Y','Y','Y','Y','Y']);//draft pdf
this.map.set("217",['Y','Y','Y','Y','Y','Y','Y','Y']);//timeSheet report
this.map.set("218",['Y','Y','Y','Y','Y','Y','Y','Y']);//task statistics
this.map.set("223",['Y','N','N','N','Y','Y','Y','Y']);//Change Control
this.map.set("205",['Y','Y','Y','Y','Y','Y','Y','Y']);//Requirement Summary
this.map.set("202",['Y','M','M','Y','Y','Y','Y','Y']);//table of content
this.map.set("225",['Y','N','N','N','Y','Y','Y','Y']);//Esign Workflow
this.map.set("231",['Y','N','N','N','Y','Y','Y','Y']);//Compliance Assessment
this.map.set("233",['Y','N','N','Y','Y','N','N','N']);//Compliance Report

  //  this.map.set("111",['Y','Y','Y','Y','Y','Y','Y','Y']);//lookup
  //  this.map.set("126",['Y','Y','Y','Y','Y','Y','Y','Y']);//Docment Status
  //  this.map.set("131",['Y','Y','Y','Y','Y','Y','Y','Y']);//testing data
  //  this.map.set("133",['Y','Y','Y','Y','Y','Y','Y','Y']);//master dynamic template
  //  this.map.set("160",['Y','Y','Y','Y','Y','Y','Y','Y']);//knowledgebase
  //  this.map.set("169",['Y','N','N','N','Y','Y','Y','Y']);//email template config

  return this.map;
 }
 
}