import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
    private url = 'api/analysis';

    constructor(private restService: RestService, private commonService: CommonService) { }

    public getAnalysis(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
}
