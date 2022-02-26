import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  baseUrl = environment.apiUrl;
  private httpClientWithOutInterceptor: HttpClient;
  constructor(private handler: HttpBackend, private http: HttpClient) {
    this.httpClientWithOutInterceptor = new HttpClient(handler);
  }

  public patch<T>(relativeUrl: string, data: any = null): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${relativeUrl}`, data)
      .pipe(catchError(this.handleError<T>('error')));
  }

  public get<T>(
    relativeUrl: string,
    params: { [param: string]: string | string[] } = {}
  ): Observable<T> {
    const loggedInUser = this.getUserData() as any;
    return this.http.get<T>(`${this.baseUrl}${relativeUrl}`, {
      ...params,
      headers: { authorization: loggedInUser ? loggedInUser.token : '' }
    });
  }

  public getUsername<T>(
    relativeUrl: string = 'api/users/get-users',
    params: { [param: string]: string | string[] } = {}
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${'api/users/get-users'}`, {
      params
    });
  }

  public post<T>(relativeUrl: string, data: any = null): Observable<T> {
    const loggedInUser = this.getUserData() as any;
    return this.http
      .post<T>(`${this.baseUrl}${relativeUrl}`, data, {
        headers: { 'authorization': loggedInUser ? loggedInUser.token : '' }
      })
      .pipe(catchError(this.handleError<T>('error')));
  }

  public postWithoutInterceptor<T>(
    relativeUrl: string,
    data: any = null
  ): Observable<T> {
    return this.httpClientWithOutInterceptor
      .post<T>(`${this.baseUrl}${relativeUrl}`, data)
      .pipe(catchError(this.handleError<T>('error')));
  }

  public put<T>(relativeUrl: string, data: any = null): Observable<T> {
    const loggedInUser = this.getUserData() as any;
    return this.http
      .put<T>(`${this.baseUrl}${relativeUrl}`, data, {
        headers: { authorization: loggedInUser ? loggedInUser.token : '' }
      })
      .pipe(catchError(this.handleError<T>('error')));
  }

  public delete<T>(relativeUrl: string): Observable<T> {
    const loggedInUser = this.getUserData() as any;
    return this.http
      .delete<T>(`${this.baseUrl}${relativeUrl}`, {
        headers: { authorization: loggedInUser ? loggedInUser.token : '' }
      })
      .pipe(catchError(this.handleError<T>('error')));
  }

  public uploadFile<T>(relativeUrl: string, data: any = null) {
    const headers = new HttpHeaders().append(
      'Content-Disposition',
      'multipart/form-data'
    );

    return this.http
      .post<T>(`${this.baseUrl}${relativeUrl}`, data, { headers })
      .pipe(catchError(this.handleError<T>('error')));
  }

  public postWithErrors<T>(
    relativeUrl: string,
    data: any = null
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${relativeUrl}`, data);
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const resp = result || error.error;
      return throwError(resp as T);
    };
  }

  getUserData() {
    return JSON.parse(window.localStorage.getItem('user'));
  }
}
