import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, take, timeout } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestService {

  baseUrl = environment.baseUrl;

  constructor(
    protected http: HttpClient,
    private router: Router,
  ) {}

  getAuthenticationOptions(options?: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return {
      headers,
      ...options,
    };
  }

  get<TOut>(url: string, options?: any): Observable<any> {
    const opt = this.getAuthenticationOptions(options);
    return this.http.get(`${this.baseUrl}/${url}`, opt).pipe(
      timeout(120000),
      catchError((err) => throwError(err))
    );
  }

  post<TOut>(url: string, data: any, options?: any): Observable<any> {
    const opt = this.getAuthenticationOptions(options);
    return this.http.post(`${this.baseUrl}/${url}`, data, opt).pipe(
      timeout(120000),
      catchError((err) => throwError(err))
    );
  }

  getDataById<TOut>(url: string, options?: any): Observable<any> {
    const opt = this.getAuthenticationOptions(options);
    return this.http.get(`${this.baseUrl}/${url}`, opt).pipe(
      timeout(120000),
      catchError((err) => throwError(err))
    );
  }

  put<TOut>(url: string, data: any, options?: any): Observable<any> {
    const opt = this.getAuthenticationOptions(options);
    return this.http.put(`${this.baseUrl}/${url}`, data, opt).pipe(
      timeout(120000),
      catchError((err) => throwError(err))
    );
  }

  delete<TOut>(url: string, options?: any): Observable<any> {
    const opt = this.getAuthenticationOptions(options);
    return this.http.delete(`${this.baseUrl}/${url}`, opt).pipe(
      timeout(120000),
      catchError((err) => throwError(err))
    );
  }

}
