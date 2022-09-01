import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ICdfActiveParams, ICdfCompany, ICdfEmail, ICdfMobile, ICdfParams, ICdfStatusActiveParams, ICdfToCustomersParams } from 'src/app/models/cdf';

@Injectable({ providedIn: 'root' })
export class CdfService {
    private url = 'api/cdf';
    private cdfToCustomersURL = 'api/cdf/cdfTOCustomersUpdate';
    private cdfChangeStatusURl = 'api/cdf/changeStatus';
    private changeCdfStatusURl = 'api/cdf/changeCdfStatus';
    private onCheckEmailURL = 'api/cdf/onCheckEmail';
    private onCheckCompanyURL = 'api/cdf/onCheckCompany';
    private onCheckMobileURL = 'api/cdf/onCheckMobile';


    constructor(private restService: RestService, private commonService: CommonService) { }

    public getCdf(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public addCdf(cdf: ICdfParams) {
        return this.restService.post(`${this.url}`, cdf);
    }
    public editCdf(cdf: ICdfParams) {
        return this.restService.put(`${this.url}`, cdf);
    }
    public removeCdf(id: string) {
        return this.restService.delete(`${this.url}?id=${id}`);
    }
    public changeStatus(cdf: ICdfActiveParams) {
        return this.restService.put(`${this.cdfChangeStatusURl}`, cdf);
    }
    public changeCdfStatus(cdfStatus: ICdfStatusActiveParams) {
        return this.restService.put(`${this.changeCdfStatusURl}`, cdfStatus);
    }
    public editCdfToCustomers(cdf: ICdfToCustomersParams) {
        return this.restService.put(`${this.cdfToCustomersURL}`, cdf);
    }
    public onCheckEmail(cdfEmail: ICdfEmail) {
        return this.restService.put(`${this.onCheckEmailURL}`, cdfEmail);
    }
    public onCheckCompany(cdfCompany: ICdfCompany) {
        return this.restService.put(`${this.onCheckCompanyURL}`, cdfCompany);
    }
    public onCheckMobile(cdfMobile: ICdfMobile) {
        return this.restService.put(`${this.onCheckMobileURL}`, cdfMobile);
    }
}
