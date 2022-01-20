import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Helper } from './../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
import { FileUploader } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { IMyDpOptions } from 'mydatepicker/dist';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import 'chart.js';
import 'chartjs-plugin-annotation';
import { ShiftService } from '../shift/shift.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ProcessValidationDTO } from '../../models/model';
import swal from 'sweetalert2';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { ProcessValidationService } from './process-validation.service';
type AOA = any[][];

@Component({
  selector: 'app-process-validation',
  templateUrl: './process-validation.component.html',
  styleUrls: ['./process-validation.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ProcessvalidationComponent implements OnInit {
  constructor(public helper: Helper, public configService: ConfigService, public shiftService: ShiftService,
    public equipmentService: EquipmentService, private dateFormatSettingsService: DateFormatSettingsService,
    private processValidationService: ProcessValidationService) { }

  @ViewChild('processValTab') tab: any;
  @ViewChild('processValForm') processValForm: any;
  @ViewChild('date1') date1: any;
  @ViewChild('date2') date2: any;
  spinnerFlag: boolean = false;
  activeTabId: any;
  permissionModal: Permissions = new Permissions(this.helper.STATISTICAL_PROCESS_CONTROL, false);
  processValidation: ProcessValidationDTO = new ProcessValidationDTO();
  shiftList = [];
  equipmentList = [];
  productList = [];
  batchList = [];
  public uploader: FileUploader = new FileUploader({
    url: 'URL_For_Upload',
    isHTML5: true
  });
  submitted: boolean = false;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };
  startDate: any;
  endDate: any;
  shift: any = "";
  equipment: any = "";
  product: any = "";
  batch: any = "";

  iscolumnadded: boolean = false;
  tableHead = new Array<String>();
  sdvControlLimits = 3;
  samplesize = 5;

  centerplusone: Number = 0.4768;
  centerplustwo: Number = 0.4778;
  centerminusone: Number = 0.4748;
  centerminustwo: Number = 0.4738;

  con1: boolean = false;
  con2: boolean = false;
  con3: boolean = false;
  con4: boolean = false;
  con5: boolean = false;
  con6: boolean = false;
  con7: boolean = false;

  chartdata: Array<{}> = [];
  xbarData: Array<{ xbar: string, center: string, xBarLcl: string, xBarUcl: string }> = [];
  rbarData: Array<{ xbar: string, center: string, rBarLcl: string, rBarUcl: string }> = [];
  chartdatadummy: any;
  weighttotarr: number[] = [];
  samplerangetotarr: number[] = [];
  sampleavgtotarr: number[] = [];
  data: AOA = [[1, 2], [3, 4]];
  xchartweightdata = [];
  controlchartweightdata = [];
  public controlChartData: ChartDataSets[] = [
    {
      data: [], label: 'Weight',
      fill: true,
      borderColor: 'black'
    },
    {
      data: [], label: 'Weight LSL',
      fill: true,
      borderColor: '#00FFFF'
    },
    {
      data: [], label: 'Weight USL',
      fill: true,
      borderColor: 'yellow'
    },
    {
      data: [], label: 'Weight Mean',
      fill: true,
      borderColor: '#e0205a'
    },
  ];
  public lineChartLabels: string[] = [""];
  public lineChartOptionsxbar: (ChartOptions & { annotation: any }) = {
    responsive: true,
    title: {
      display: true,
      text: 'X Bar Chart'
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: "black"
        },
        stacked: true,
        ticks: {
          autoSkip: true,
        }
      },
      ], yAxes: [{
        id: 'y-axis-0', type: 'linear', position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Frequency',
          fontColor: 'blue',
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: "#222",
        font: {
          size: 20,
        },
      },
      labels: {
        fontColor: ['green', 'white', 'red'],
        precision: 2,
        arc: true,
      }
    },
    annotation: {
      drawTime: 'afterDatasetsDraw',
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['yellow'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['#e0205a'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['#00FFFF'],
          borderWidth: 4,
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
    },
  ];
  public lineChartType = 'line';
  public lineChartDataxbar: ChartDataSets[] = [
    {
      data: [], label: 'Weight',
      fill: true,
      borderColor: 'black'
    },
    {
      data: [], label: 'Weight USL',
      fill: true,
      borderColor: 'yellow'
    },
    {
      data: [], label: 'Weight LSL',
      fill: true,
      borderColor: '#00FFFF'
    },
    {
      data: [], label: 'Mean',
      fill: true,
      borderColor: '#e0205a'
    },
  ];
  rchartweightdata = [];
  rBar: number = 0.0000;
  public rbarlineChartLabels: string[] = [""];
  public rbarlineChartOptionsxbar: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'R Bar Chart'
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: "black"
        },
        stacked: true,
        ticks: {
          autoSkip: true,
        }
      },
      ], yAxes: [{
        id: 'y-axis-0', type: 'linear', position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'R BAR',
          fontColor: 'blue',
        },
        ticks: {
          autoSkip: true,
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: "#222",
        font: {
          size: 20,
        },
      },
      labels: {
        fontColor: ['green', 'white', 'red'],
        precision: 2,
        arc: true,
      }
    },
    annotation: {
      drawTime: 'afterDatasetsDraw',
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0080,
          borderColor: ['yellow'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: this.rBar,
          borderColor: ['#e0205a'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['#00FFFF'],
          borderWidth: 4,
        },
      ],
    },
  };

  public rbarlineChartColors: Color[] = [
    {
      borderColor: 'black',
    },
  ];
  public rbarlineChartType = 'line';
  public rbarlineChartData: ChartDataSets[] = [
    {
      data: [], label: 'Weight',
      fill: true,
      borderColor: 'black'
    },
    {
      data: [], label: 'Weight USL',
      fill: true,
      borderColor: 'yellow'
    },
    {
      data: [], label: 'Weight LSL',
      fill: true,
      borderColor: '#00FFFF'
    },
    {
      data: [], label: 'Mean',
      fill: true,
      borderColor: '#e0205a'
    },
  ];
  public lineChartOptionscontrolinter: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend: { position: 'right' },
    title: {
      display: true,
      text: 'Control Interpretation Chart'
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: "black"
        },
        stacked: true,
        ticks: {
          autoSkip: true,
        }
      },
      ], yAxes: [{
        id: 'y-axis-0', type: 'linear', position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Frequency',
          fontColor: 'blue',
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: "#222",
        font: {
          size: 20,
        },
      },
      labels: {
        fontColor: ['green', 'white', 'red'],
        precision: 2,
        arc: true,
      }
    },
    annotation: {
      drawTime: 'afterDatasetsDraw',
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['yellow'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['#e0205a'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['#00FFFF'],
          borderWidth: 4,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['black'],
          borderWidth: 2,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['black'],
          borderWidth: 2,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['black'],
          borderWidth: 2,
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0.0000,
          borderColor: ['black'],
          borderWidth: 2,
        },
      ],
    },
  };

  sdvRoundOff: number = 0.0000;
  sdvvalue: number = 0.0000;
  cpValue: number = 0.0000;
  cpuValue: number = 0.0000;
  cpkValue: number = 0.0000;
  cplValue: number = 0.0000;
  xBar: number = 0.0000;
  lslValue: number = 0.4750;
  uslValue: number = 0.4800;
  lsl = this.lslValue.toFixed(4);
  usl = this.uslValue.toFixed(4);
  sigmaXBar: number = 0.0000;

  condition1: string = "Any occurrence of a point outside of the either control limits: UCL or LCL";
  condition2: string = "Two out of three points in Zone A on the same side of the center line";
  condition3: string = "Four out of five points in Zone B or beyond on the same side of the center line";
  condition4: string = "Nine consecutive points on the same side of the center line";
  condition5: string = "Six consecutive points increasing or decreasing";
  condition6: string = "Fourteen consecutive points alternating up and down";
  condition7: string = "Fifteen consecutive points in either Zone C (above or below the center line)";

  ngOnInit() {
    this.configService.loadPermissionsBasedOnModule(this.helper.STATISTICAL_PROCESS_CONTROL).subscribe(result => {
      this.permissionModal = result;
    });
    this.loadOrgDateFormatAndTime();
    this.loadAllShifts();
    this.loadAllEquipments();
    this.loadAllBatchData();
    this.samplerangetotarr = [];
    this.sigmaXBar = 0.0000;
    this.controlchartweightdata = [];
    this.controlChartData = [
      {
        data: this.controlchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
    ];

    this.lineChartDataxbar = [
      {
        data: this.xchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
    ];
    //xbar chart
    this.lineChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    this.xchartweightdata = [];
    this.lineChartDataxbar = [
      {
        data: this.xchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
    ];

    this.lineChartOptionsxbar = {
      responsive: true,
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'X Bar Chart'
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: "black"
          },
          stacked: true,
          ticks: {
            autoSkip: true,
          }
        },
        ], yAxes: [{
          id: 'y-axis-0', type: 'linear', position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'X BAR',
            fontColor: 'blue',
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: "#222",
          font: {
            size: 20,
          },
        },
        labels: {
          fontColor: ['green', 'white', 'red'],
          precision: 2,
          arc: true,
        }
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.uslValue,
            borderColor: ['yellow'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.xBar,
            borderColor: ['#e0205a'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.lslValue,
            borderColor: ['#00FFFF'],
            borderWidth: 4,
          },
        ],
      },
    };

    //rBar chart
    this.rbarlineChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    this.rchartweightdata = [];
    this.rbarlineChartData = [
      {
        data: this.rchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
    ];

    this.rbarlineChartOptionsxbar = {
      responsive: true,
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'R Bar Chart'
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: "black"
          },
          stacked: true,
          ticks: {
            autoSkip: true,
          }
        },
        ], yAxes: [{
          id: 'y-axis-0', type: 'linear', position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'R BAR',
            fontColor: 'blue',
          },
          ticks: {
            autoSkip: true,
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: "#222",
          font: {
            size: 20,
          },
        },
        labels: {
          fontColor: ['green', 'white', 'red'],
          precision: 2,
          arc: true,
        }
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0.0078,
            borderColor: ['yellow'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0.0040,
            borderColor: ['#e0205a'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0.000,
            borderColor: ['#00FFFF'],
            borderWidth: 4,
          },
        ],
      },
    };
  }

  ngAfterViewInit(): void {
    this.configService.getUserPreference(this.helper.STATISTICAL_PROCESS_CONTROL).subscribe(resp => {
      if (resp.result)
        this.tab.activeId = resp.result;
    });
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        let today = new Date();
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.startDate = { date: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() } };
        this.endDate = { date: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() } };
        this.date1.setOptions();
        this.date2.setOptions();
      }
    });
  }

  loadAllShifts() {
    this.shiftService.loadAllActiveShifts().subscribe(jsonResp => {
      if (jsonResp.result) {
        this.shiftList = jsonResp.result;
      }
      if (jsonResp.currentShift) {
        this.shift = jsonResp.currentShift.id;
      }
    });
  }

  loadAllEquipments() {
    this.equipmentService.loadAllActiveEquipment().subscribe(jsonResp => {
      if (jsonResp.result) {
        this.equipmentList = jsonResp.result;
      }
    });
  }

  loadAllBatchData() {
    this.configService.HTTPGetAPI('batchCreation/loadAllProductAndBatch').subscribe(jsonResp => {
      if (jsonResp) {
        this.productList = jsonResp.product;
        this.batchList = jsonResp.batch;
      }
    })
  }

  extractFile(evt) {
    this.spinnerFlag = true;
    this.chartdatadummy = [];
    try {
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        this.data.forEach(element => {
          var obj: { [k: string]: any } = {};
          for (let i = 0; i < element.length; i++) {
            var j = i + 1;
            obj['w' + j] = element[i];
          }
          this.chartdatadummy.push(obj);
        });
        this.chartdatadummy.splice(0, 1);
      };
      reader.readAsBinaryString(target.files[0]);
      this.spinnerFlag = false;
    }
    catch (e) {
      this.spinnerFlag = false;
      console.log('error', e);
    }
  }

  tabChange(tabId) {
    this.submitted = false;
    this.configService.saveUserPreference(this.helper.STATISTICAL_PROCESS_CONTROL, tabId).subscribe(res => { });
    this.activeTabId = tabId;
  }

  sampleFileDownload() {
    this.spinnerFlag = true;
    this.configService.HTTPPostAPI(new ProcessValidationDTO(), 'processValidation/sampleExcel').subscribe(resp => {
      var blob: Blob = this.helper.b64toBlob(resp.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'sampleStatisticalProcessControlFile.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sampleStatisticalProcessControlFile.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    this.shift = "";
    this.equipment = "";
    this.product = "";
    this.batch = "";
    if (this.processValForm.valid && this.chartdatadummy && this.chartdatadummy.length > 0) {
      this.spinnerFlag = true;
      this.processValidation.shiftName = this.shiftList.filter(f => f.id === +this.processValidation.shiftId).map(m => m.name)[0];
      this.processValidation.equipmentName = this.equipmentList.filter(f => f.id === +this.processValidation.equipmentId).map(m => m.name)[0];
      this.processValidation.noOfSamples = this.chartdatadummy.length;
      this.processValidation.weightJson = JSON.stringify(this.chartdatadummy);
      this.configService.HTTPPostAPI(this.processValidation, 'processValidation/save').subscribe(resp => {
        if (resp.result) {
          swal({
            title: 'Success',
            text: 'Saved successfully',
            type: 'success',
            timer: 2000, showConfirmButton: false
          })
          this.processValidation = resp.result;
          this.shift = +this.processValidation.shiftId;
          this.equipment = +this.processValidation.equipmentId;
          this.product = this.processValidation.product;
          this.batch = this.processValidation.batch;
          this.chartdatadummy = JSON.parse(this.processValidation.weightJson);
          this.dataload();
        } else {
          swal({
            title: 'Error',
            text: 'Error in saving Statistical Process Control',
            type: 'error',
            timer: 2000, showConfirmButton: false
          })
        }
        this.submitted = false;
        this.spinnerFlag = false;
      }, err => {
        this.spinnerFlag = false;
      });
    } else if (!this.chartdatadummy) {
      swal({
        title: '',
        type: 'warning',
        text: 'Please upload valid file',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      });
    }
  }

  openBtnClicked() {
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
    if (!this.date2.showSelector)
      this.date2.openBtnClicked();
  }

  onChangeStartDate(date: any) {
    this.startDate = date;
  }

  onChangeEndDate(date: any) {
    this.endDate = date;
  }

  loadProcessValidation(shift, equipment, product, batch) {
    if (shift && equipment && product && batch) {
      this.chartdatadummy = [];
      this.configService.HTTPGetAPI('processValidation/loadProcessValidation/' + shift + '/' + equipment + '/' + product + '/' + batch).subscribe(jsonResp => {
        if (jsonResp.result) {
          this.processValidation = jsonResp.result;
          this.chartdatadummy = JSON.parse(this.processValidation.weightJson);
          this.dataload();
        }
      });
    }
  }

  pdfdownload() {
    this.spinnerFlag = true;
    let jsonObject = {
      'shiftName': this.shiftList.filter(f => f.id === +this.shift).map(m => m.name)[0],
      'equipmentName': this.equipmentList.filter(f => f.id === +this.equipment).map(m => m.name)[0],
      'product': this.product,
      'batch': this.batch,
      'usl': this.usl,
      'lsl': this.lsl,
      'xBar': this.xBar,
      'sigmaXBar': this.sigmaXBar,
      'rBar': this.rBar,
      'sdvRoundOff': this.sdvRoundOff,
      'sdvControlLimits': this.sdvControlLimits,
      'cpValue': this.cpValue,
      'cplValue': this.cplValue,
      'cpuValue': this.cpuValue,
      'cpkValue': this.cpkValue,
      'chartdata': this.chartdata,
      'xbarData': this.xbarData,
      'rbarData': this.rbarData
    }
    this.processValidationService.generateSpcPdf(jsonObject).subscribe(resp => {
      var blob: Blob = this.b64toBlob(resp._body, 'application/pdf');
      let name = "Statistical_Process_Control_" + new Date().toLocaleDateString(); +".pdf";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  dataload() {
    this.weighttotarr = [];
    this.chartdata = [];
    this.samplerangetotarr = [];
    this.sampleavgtotarr = [];
    this.tableHead = [];
    this.iscolumnadded = false;
    this.spinnerFlag = true;
    this.chartdatadummy.forEach(element => {
      let samplesiz: number = 0;
      var temparr: number[] = [];
      let weightsum: number = 0.0000;
      for (let meal of Object.values(element)) {
        if (!this.helper.isEmpty(meal) && meal != 'NaN') {
          if (this.samplesize >= samplesiz) {
            temparr.push(Number(meal));
            samplesiz = samplesiz + 1;
          }
        }
      }
      if (temparr.length > 0) {
        var maxval = this.getArrayMax(temparr);
        var minval = this.getArrayMin(temparr);
        temparr.forEach(ele => {
          weightsum = weightsum + ele;
          this.weighttotarr.push(ele);
        });
        let avg = Number(Number(weightsum) / Number(this.samplesize)).toFixed(4);
        let samplerange = Number(Number(maxval) - Number(minval)).toFixed(4);
        if ((!this.helper.isEmpty(avg) && avg != 'NaN') && (!this.helper.isEmpty(samplerange) && samplerange != 'NaN')) {
          this.sampleavgtotarr.push(Number(avg));
          this.samplerangetotarr.push(Number(samplerange));
        }
        var obj: { [k: string]: any } = {};
        for (let i = 0; i < temparr.length; i++) {
          var j = i + 1;
          obj['W' + j] = '' + temparr[i].toFixed(4);
          if (!this.iscolumnadded) {
            this.tableHead.push('W' + j);
          }
        }
        if (!this.iscolumnadded) {
          this.tableHead.push('SampleAverage');
        }
        obj.count = this.samplesize;
        obj.SampleAverage = '' + avg;
        obj.SampleRange = '' + samplerange;
        if (!this.iscolumnadded) {
          this.tableHead.push('SampleRange');
        }
        this.iscolumnadded = true;
        this.chartdata.push(obj);
      }
    });
    this.calculatexbar(this.chartdata);
    this.refershXBar(this.chartdata);
    this.calculaterbar(this.chartdata);
    this.calculatecontrolinterpertation();
    this.sdvvalue = this.calculatestanddev(this.weighttotarr);
    this.sdvRoundOff = Number(this.sdvvalue.toFixed(4));
    let xx = this.sdvRoundOff / Math.sqrt(this.samplesize);
    this.sigmaXBar = Number(this.preciseRound(xx, 4));
    let rBar = this.calculateaverage(this.samplerangetotarr);
    this.rBar = Number(this.preciseRound(rBar, 4));
    this.refreshRBar(this.chartdata);
    this.cpcpkcalculation();
    this.spinnerFlag = false;
  }

  preciseRound(value, decPlaces) {
    let val = Math.round(value * Math.pow(10, decPlaces)) / Math.pow(10, decPlaces);
    return val;
  }

  calculatexbar(data: any) {
    var total = 0.0000;
    var sampleavg = "";
    data.forEach(ele => {
      total = Number(total) + Number(ele.SampleAverage);
    });
    var avg = total / data.length;
    var finalavg = avg.toFixed(4);
    this.xBar = Number(finalavg);
    this.xbarData = [];
    data.forEach(ele => {
      sampleavg = ele.SampleAverage;
      let xdata = { xbar: sampleavg, center: finalavg, xBarLcl: this.lsl, xBarUcl: this.usl };
      this.xbarData.push(xdata);
    });
  }

  refershXBar(data: any) {
    this.xchartweightdata = [];
    data.forEach(ele => {
      this.xchartweightdata.push(Number(ele.SampleAverage));
    });
    this.lineChartDataxbar = [
      {
        data: this.xchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
    ];
    this.lineChartOptionsxbar = {
      responsive: true,
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'X Bar Chart'
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: "black"
          },
          stacked: true,
          ticks: {
            autoSkip: true,
          }
        },
        ], yAxes: [{
          id: 'y-axis-0', type: 'linear', position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'X BAR',
            fontColor: 'blue',
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: "#222",
          font: {
            size: 20,
          },
        },
        labels: {
          fontColor: ['green', 'white', 'red'],
          precision: 2,
          arc: true,
        }
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.uslValue,
            borderColor: ['yellow'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.xBar,
            borderColor: ['#e0205a'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.lslValue,
            borderColor: ['#00FFFF'],
            borderWidth: 4,
          },
        ],
      },
    };
    setTimeout(() => {
      this.lineChartDataxbar = [... this.lineChartDataxbar];
    }, 3000);
  }

  calculaterbar(data: any) {
    var total = 0.0000;
    var sampleavg = "";
    data.forEach(ele => {
      total = Number(total) + Number(ele.SampleRange);
    });
    var avg = total / data.length;
    var finalavg = avg.toFixed(4);
    this.rbarData = [];
    data.forEach(ele => {
      sampleavg = ele.SampleAverage;
      let xdata = { xbar: sampleavg, center: finalavg, rBarUcl: "0.0082", rBarLcl: "0.0000" };
      this.rbarData.push(xdata);
    });
  }

  calculatecontrolinterpertation() {
    var usv = this.uslValue - this.xBar;
    var lsv = this.xBar - this.lslValue;
    var udiff = Number(usv / 3).toFixed(4);
    var ldiff = Number(lsv / 3).toFixed(4);
    this.centerplusone = Number(Number(this.xBar + Number(udiff)).toFixed(4));
    this.centerplustwo = Number(Number(this.xBar + Number(udiff) + Number(udiff)).toFixed(4));
    this.centerminusone = Number(Number(this.xBar - Number(ldiff)).toFixed(4));
    this.centerminustwo = Number(Number(this.xBar - (Number(ldiff) + Number(ldiff))).toFixed(4));
    this.refershControlchart();
    if (this.xbarData.length == 0 || this.xbarData == null || this.xbarData === null) {
      return;
    } else {
      let con2pre: boolean = false;
      let con2curr: boolean = false;
      let i: number = 0;
      let con3i: number = 0;
      let con4i: number = 0;
      let arr = [];
      let arr6 = [];
      let arr7 = [];

      this.con1 = false;
      this.con2 = false;
      this.con3 = false;
      this.con4 = false;
      this.con5 = false;
      this.con6 = false;
      this.con7 = false;

      this.xbarData.forEach(ele => {
        //Any occurrence of a point outside of the either control limits: UCL or LCL
        if (!this.con1) {
          if (this.uslValue < Number(ele.xbar)) {
            this.con1 = true;
          }
          if (this.lslValue > Number(ele.xbar)) {
            this.con1 = true;
          }
        }
        //Two out of three points in Zone A on the same side of the center line
        if (!this.con2) {
          if (this.centerminustwo > Number(ele.xbar)) {
            con2pre = con2curr;
            con2curr = true;
          }
          if (con2curr && con2pre) {
            this.con2 = true;
          }
        }
        //Four out of five points in Zone B or beyond on the same side of the center line
        if (!this.con3) {
          if (this.centerminusone > Number(ele.xbar)) {
            i = i + 1;
            if (i == 5) { this.con3 == true; }
          }
          else {
            if (con3i == 0) {
              con3i = 1;
            }
            else {
              i = 0;
            }
          }
          if (i == 4 && con3i == 1) {
            this.con3 = true;
          }
          else if (i == 5) {
            this.con3 = true;
          }
        }
        //Nine consecutive points on the same side of the center line
        if (!this.con4) {
          if (this.xBar > Number(ele.xbar)) {
            con4i = con4i + 1;
            if (con4i == 14 || con4i > 14) {
              this.con4 = true;
            }
          }
          else {
            con4i = 0;
          }
        }
        //Six consecutive points increasing or decreasing
        if (!this.con5) {
          arr.push(Number(ele.xbar));
          if (arr.length > 5) {
            var rslt = this.checkType(arr);
          }
          if (arr.length == 6 || arr.length > 6) {
            arr.splice(0, 1);
          }
          if (rslt) {
            this.con5 = true;
          }
          else {
            this.con5 = false;
          }
        }
        //Fourteen consecutive points alternating up and down
        if (!this.con6) {
          arr6.push(Number(ele.xbar));
          if (arr6.length > 13) {
            var rslt6 = this.Condition6(arr6);
          }
          if (arr6.length == 14 || arr6.length > 14) {
            arr6.splice(0, 1);
          }
          if (rslt6) {
            this.con6 = true;
          }
          else {
            this.con6 = false;
          }
        }
        //Fifteen consecutive points in either Zone C (above or below the center line)
        if (!this.con7) {
          arr7.push(Number(ele.xbar));
          if (arr7.length > 14) {
            var rslt7 = this.Condition7(arr7);
          }
          if (arr7.length == 15 || arr7.length > 14) {
            arr7.splice(0, 1);
          }
          if (rslt7) {
            this.con7 = true;
          }
          else {
            this.con7 = false;
          }
        }
      });
    }
  }

  calculatestanddev(data) {
    if (!data || data.length === 0) {
      return 0;
    } else {
      var me = data.reduce(function (a, b) {
        return Number(a) + Number(b);
      }) / data.length;
      let getstd = Math.sqrt(data.reduce(function (sq, n) {
        return sq + Math.pow(n - me, 2);
      }, 0) / (data.length - 1));
      return getstd;
    }
  }

  calculateaverage(data) {
    if (!data || data.length === 0) { return 0; }
    else {
      var avg = data.reduce(function (a, b) {
        return Number(a) + Number(b);
      }) / data.length;
      return avg;
    }
  }

  refreshRBar(data: any) {
    this.rchartweightdata = [];
    data.forEach(ele => {
      this.rchartweightdata.push(Number(ele.SampleRange));
    });
    this.rbarlineChartData = [
      {
        data: this.rchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
    ];
    this.rbarlineChartOptionsxbar = {
      responsive: true,
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'R Bar Chart'
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: "black"
          },
          stacked: true,
          ticks: {
            autoSkip: true,
          }
        },
        ], yAxes: [{
          id: 'y-axis-0', type: 'linear', position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'R BAR',
            fontColor: 'blue',
          },
          ticks: {
            autoSkip: true,
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: "#222",
          font: {
            size: 20,
          },
        },
        labels: {
          fontColor: ['green', 'white', 'red'],
          precision: 2,
          arc: true,
        }
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0.0080,
            borderColor: ['yellow'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.rBar,
            borderColor: ['#e0205a'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0.0000,
            borderColor: ['#00FFFF'],
            borderWidth: 4,
          },
        ],
      },
    };
    setTimeout(() => {
      this.rbarlineChartData = [... this.rbarlineChartData];
    }, 3000);
  }

  cpcpkcalculation() {
    let sdvRoundOff = this.sdvvalue.toFixed(4);
    this.cpValue = (this.uslValue - this.lslValue) / (6 * Number(sdvRoundOff));
    this.cpValue = Number((parseFloat(String(this.cpValue))).toFixed(2));
    this.cplValue = (this.xBar - this.lslValue) / (3 * Number(sdvRoundOff));
    this.cplValue = Number((parseFloat(String(this.cplValue))).toFixed(2));
    this.cpuValue = (this.uslValue - this.xBar) / (3 * Number(sdvRoundOff));
    this.cpuValue = Number((parseFloat(String(this.cpuValue))).toFixed(2));
    this.cpkValue = this.cplValue;
    if (this.cpuValue > this.cplValue) {
      this.cpkValue = this.cplValue;
    }
    else {
      this.cpkValue = this.cpuValue;
    }
  }

  refershControlchart() {
    this.controlchartweightdata = [];
    this.controlchartweightdata = this.xchartweightdata;
    this.controlChartData = [
      {
        data: this.controlchartweightdata, label: 'Samples',
        fill: false,
        borderColor: 'black'
      },
      {
        data: [], label: 'Weight LSL',
        fill: true,
        borderColor: '#00FFFF'
      },
      {
        data: [], label: 'Weight USL',
        fill: true,
        borderColor: 'yellow'
      },
      {
        data: [], label: 'Weight Mean',
        fill: true,
        borderColor: '#e0205a'
      },
    ];
    this.lineChartOptionscontrolinter = {
      responsive: true,
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'Control Interpretation Chart'
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: "black"
          },
          stacked: true,
          ticks: {
            autoSkip: true,
          }
        },
        ], yAxes: [{
          id: 'y-axis-0', type: 'linear', position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Frequency',
            fontColor: 'blue',
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: "#222",
          font: {
            size: 20,
          },
        },
        labels: {
          fontColor: ['green', 'white', 'red'],
          precision: 2,
          arc: true,
        }
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.uslValue,
            borderColor: ['yellow'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.lslValue,
            borderColor: ['#00FFFF'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.centerminustwo,
            borderColor: ['black'],
            borderWidth: 2,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.centerminusone,
            borderColor: ['black'],
            borderWidth: 2,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.xBar,
            borderColor: ['#e0205a'],
            borderWidth: 4,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.centerplusone,
            borderColor: ['black'],
            borderWidth: 2,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.centerplustwo,
            borderColor: ['black'],
            borderWidth: 2,
          },
        ],
      },
    };
    setTimeout(() => {
      this.controlChartData = [... this.controlChartData];
    }, 3000);
  }

  Condition7(arr) {
    let count: number = 0;
    let result: boolean = true;
    arr.forEach(val => {
      if (this.centerplusone > Number(val) && this.centerminusone < Number(val)) {
        { result = true; count = count + 1; }
      }
      else {
        { result = false; }
      }
    });
    if (count == 15) {
      return true;
    } else {
      return false;
    }
  }

  Condition6(arr) {
    let prevalue: number = 0.0000;
    let up: number = 0;
    let down: number = 0;
    let count: number = 0;
    let result: boolean = true;
    arr.forEach(val => {
      if (count != 0) {
        if (prevalue > Number(val)) {
          if (up == 1) { result = false; }
          up = 1;
          down = 0;
        }
        else {
          if (down == 1) { result = false; }
          down = 1;
          up = 0;
        }
      }
      prevalue = Number(val);
      count = count + 1;
    });
    if (result) { return true; }
    else { return false; }
  }

  checkType(arr) {
    let prevalue: number = 0.0000;
    let plus: number = 0;
    let minus: number = 0;
    let count: number = 0;
    arr.forEach(val => {
      if (count != 0) {
        if (prevalue > Number(val)) {
          minus = minus + 1;
        }
        else { plus = plus + 1; }
      }
      prevalue = Number(val);
      count = count + 1;
    });
    if (minus == 5 || plus == 5) {
      return true;
    } else {
      return false;
    }
  }

  getArrayMax(array) {
    return Math.max.apply(null, array);
  }

  getArrayMin(array) {
    return Math.min.apply(null, array);
  }

}