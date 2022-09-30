import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PromocodeService } from 'src/app/shared/services/promocode.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PromotionModalComponent } from 'src/app/shared/modals/promotion-modal/promotion-modal.component';
import { StatusList } from 'src/app/shared/utility/constant';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit, AfterViewInit {

  promocodeForm: FormGroup;
  displayedColumns: string[] = ['promocodeName', 'promocodeDiscount', 'promocodeStatus', 'promocodeType', 'promocodeStartDate', 'promocodeEndDate', 'actions'];
  dataSource = new MatTableDataSource([]);

  statusList: string[] = StatusList;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort

  pagiPayload: PagiElement = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    promocodeSearch: '',
    promocodeStatus: '',
    totalCount: 0,
  };

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  dialogRefs;

  constructor(
    private authService: PromocodeService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.promocodeForm = this.authService.initPromocodeFilterForm();
  }

  ngOnInit() {

    this.promocodeForm.controls.promocodeName.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        tap(() => {
          this.getServerData(this.pagiPayload);
        })
      )
      .subscribe();

    this.promocodeForm.controls.promocodeStatus.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.getServerData(this.pagiPayload);
        })
      )
      .subscribe();

    this.fethcAllPromocodeData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getServerData(event?: PageEvent) {
    this.pagiPayload.previousPageIndex = event?.previousPageIndex || 0;
    this.pagiPayload.pageIndex = event?.pageIndex || 0;
    this.pagiPayload.pageSize = event?.pageSize || 10;
    this.pagiPayload.length = event?.length || 100;
    this.pagiPayload.promocodeSearch = this.promocodeForm.value.promocodeName ? this.promocodeForm.value.promocodeName : '';
    this.pagiPayload.promocodeStatus = this.promocodeForm.value.promocodeStatus ? this.promocodeForm.value.promocodeStatus : '';
    this.fethcAllPromocodeData();
  }

  fethcAllPromocodeData(): void {
    this.authService.fetchAllPromocodeAPIFn(this.pagiPayload).subscribe(
      (response) => {
        if (response && !response.response_error && response.data.promocodeData && response.data.promocodeData.length) {
          this.createTable(response.data.promocodeData);
          this.pagiPayload.totalCount = response.data.totalCount;
          this.openSnackBar(response.status_message)
        } else {
          this.createTable([]);
          this.pagiPayload.totalCount = response.data.totalCount || 0;
          this.openSnackBar(response.status_message, true)
        }
      },
      (error) => {
        this.openSnackBar(error, true)
      }
    );
  }

  createTable(arr) {
    const tableArr = arr;
    this.dataSource = new MatTableDataSource(tableArr);
  }

  deletePromocodeData(promocodeData): void {
    this.authService.deletePromocodeAPIFn(promocodeData.promocodeId).subscribe(
      (response) => {
        if (response && !response.response_error) {
          this.openSnackBar(response.status_message);
          this.getServerData(this.pagiPayload);
        } else {
          this.openSnackBar(response.status_message, true)
        }
      },
      (error) => {
        this.openSnackBar(error, true)
      }
    );
  }

  changeStatus(event: Event) {
  }

  openPromotionDialog(promocodeData: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '640px';
    dialogConfig.width = '640px';
    dialogConfig.panelClass = 'promotion_class';
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      isEdit: promocodeData ? true : false,
      promocodeId: promocodeData ? promocodeData.promocodeId : null,
      promocodeDiscount: promocodeData ? promocodeData.promocodeDiscount : null,
      promocodeEndDate: promocodeData ? promocodeData.promocodeEndDate : null,
      promocodeName: promocodeData ? promocodeData.promocodeName : null,
      promocodeStartDate: promocodeData ? promocodeData.promocodeStartDate : null,
      promocodeStatus: promocodeData ? promocodeData.promocodeStatus : null,
      promocodeType: promocodeData ? promocodeData.promocodeType : null,
    };
    this.dialogRefs = this.dialog.open(
      PromotionModalComponent,
      dialogConfig
    );

    this.dialogRefs.afterClosed().subscribe(result => {
      if (result) {
        this.getServerData(this.pagiPayload);
      }
    });
  }

  resetFilter(): void {
    this.promocodeForm.reset();
    this.pagiPayload.promocodeSearch = '';
    this.pagiPayload.promocodeStatus = '';
    this.getServerData(this.pagiPayload);
  }

  openSnackBar(msg, isError = false) {
    let panelClass = isError ? 'snackbar-error' : 'snackbar-success';
    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: [panelClass]
    });
  }
}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface PagiElement {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
  totalCount: number;
  promocodeSearch: '';
  promocodeStatus: '';
}
