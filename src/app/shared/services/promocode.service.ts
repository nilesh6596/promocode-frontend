import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/shared/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class PromocodeService {

  constructor(
    private restService: RestService,
    private formBuilder: FormBuilder
  ) {}

  initPromocodeFilterForm(): FormGroup {
    return this.formBuilder.group({
      promocodeName: [''],
      promocodeStatus: [''],
    });
  }
  
  initPromocodeForm(): FormGroup {
    return this.formBuilder.group({
      promocodeName: [''],
      promocodeDiscount: [''],
      promocodeStatus: [''],
      promocodeType: [''],
      promocodeStartDate: [''],
      promocodeEndDate: [''],
    });
  }

  fetchAllPromocodeAPIFn(data: any): Observable<any> {
    return this.restService.post(`getAll`, data);
  }
  
  addPromocodeAPIFn(data: any): Observable<any> {
    return this.restService.post(`add`, data);
  }
  
  updatePromocodeAPIFn(data: any): Observable<any> {
    return this.restService.put(`update`, data);
  }
  
  deletePromocodeAPIFn(promocodeId: number): Observable<any> {
    return this.restService.delete(`delete/${promocodeId}`);
  }
}
