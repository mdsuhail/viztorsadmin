import { Injectable } from '@angular/core';
import { catchError, tap, map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  jsonData: any;
  worksheet: any;
  fileUploaded: File;
  storeData: any;

  constructor() { }

  export(tableId: string, fileName: string) {
    /* table id is passed over here */
    let element = document.getElementById(tableId);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    this.jsonData = XLSX.utils.sheet_to_json(ws, { raw: false });
    const filterJson = this.jsonData.map(({ Actions, ...rest }) => rest)
    this.exportAsExcelFile(filterJson, fileName);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, this.toExportFileName(excelFileName));
  }

  public toExportFileName(excelFileName: string): string {
    return `${excelFileName}_${new Date().getTime()}.xlsx`;
  }

}
