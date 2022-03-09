import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private handler: HttpBackend, private http: HttpClient) {
  }
  public toQueryString(object: Object) {
    return "?".concat(Object.keys(object).map(e => `${encodeURIComponent(e)}=${encodeURIComponent(object[e])}`).join("&"));
  }

}
