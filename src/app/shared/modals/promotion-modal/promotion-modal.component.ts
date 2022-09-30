import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { PromocodeService } from '../../services/promocode.service';
import { StatusList, TypeList } from '../../utility/constant';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.scss']
})
export class PromotionModalComponent implements OnInit {

  promocodeForm: FormGroup;
  statusList: string[] = StatusList;
  typeList: string[] = TypeList;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isEdit = false;
  promocodeId = null;
  startDate = new Date();
  endDate = new Date();

  constructor(
    private authService: PromocodeService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public _dialogRef: MatDialogRef<PromotionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocodeForm = this.authService.initPromocodeForm();
    this.isEdit = this.data.isEdit;
    if (this.isEdit) {
      console.log(this.data)
      this.promocodeId = this.data.promocodeId;
      this.promocodeForm.controls.promocodeName.patchValue(this.data.promocodeName)
      this.promocodeForm.controls.promocodeDiscount.patchValue(this.data.promocodeDiscount)
      this.promocodeForm.controls.promocodeStatus.patchValue(this.data.promocodeStatus)
      this.promocodeForm.controls.promocodeType.patchValue(this.data.promocodeType)
      this.promocodeForm.controls.promocodeStartDate.patchValue(new Date(this.data.promocodeStartDate))
      this.promocodeForm.controls.promocodeEndDate.patchValue(new Date(this.data.promocodeEndDate))
      this.startDate = new Date(this.data.promocodeStartDate)
      this.endDate = new Date(this.data.promocodeStartDate)
    }
  }

  ngOnInit(): void {

    this.promocodeForm.controls.promocodeStartDate.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        tap(() => {
          if (new Date(this.promocodeForm.value.promocodeStartDate).getTime() > new Date(this.promocodeForm.value.promocodeEndDate).getTime() ? new Date(this.promocodeForm.value.promocodeEndDate) : new Date()) {
            this.promocodeForm.controls.promocodeEndDate.patchValue('');
          }
        })
      )
      .subscribe();
  }

  closeDialog() {
    this._dialogRef.close(false);
  }

  submitPromocodeData() {
    if (this.promocodeForm.invalid) {
      this.openSnackBar('Kindly enter all fields', true);
      return;
    }
    const promocodeData = {
      promocodeName: this.promocodeForm.value.promocodeName,
      promocodeDiscount: this.promocodeForm.value.promocodeDiscount,
      promocodeStatus: this.promocodeForm.value.promocodeStatus,
      promocodeType: this.promocodeForm.value.promocodeType,
      promocodeStartDate: this.promocodeForm.value.promocodeStartDate ? new Date(this.promocodeForm.value.promocodeStartDate).getTime() : null,
      promocodeEndDate: this.promocodeForm.value.promocodeEndDate ? new Date(this.promocodeForm.value.promocodeEndDate).getTime() : null,
    };
    if (this.isEdit) {
      promocodeData['promocodeId'] = this.promocodeId;
      promocodeData['oldPromocodeName'] = this.data.promocodeName || null;
      this.authService.updatePromocodeAPIFn(promocodeData).subscribe(
        (response) => {
          if (response && !response.response_error && response.data.length) {
            this.openSnackBar(response.status_message);
            this._dialogRef.close(true);
          } else if (response && response.response_error) {
            this.openSnackBar(response.status_message, true);
          }
        },
        (error) => {
          this.openSnackBar(error, true);
        }
      );
    } else {
      this.authService.addPromocodeAPIFn(promocodeData).subscribe(
        (response) => {
          if (response && !response.response_error && response.data.length) {
            this.openSnackBar(response.status_message);
            this._dialogRef.close(true);
          } else if (response && response.response_error) {
            this.openSnackBar(response.status_message, true);
          }
        },
        (error) => {
          this.openSnackBar(error, true);
        }
      );
    }
  }

  openSnackBar(msg, isError = false) {
    let panelClass = isError ? 'snackbar-error' : 'snackbar-success';
    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: isError ? undefined : 2000,
      panelClass: [panelClass]
    });
  }

}
