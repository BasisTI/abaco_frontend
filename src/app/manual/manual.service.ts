import { DataTable } from 'primeng/primeng';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Manual } from './model/manual.model';
import { ManualFilter } from './model/ManualFilter';
import { RequestUtil } from '../util/requestUtil';

@Injectable()
export class ManualService {

    resourceUrl = environment.apiUrl + '/manual';

    constructor( private http: HttpClient ) {}

    save(manual: Manual): Observable<any> {
        return this.http.post(this.resourceUrl, manual.toJSONState());
    }

    find(id: number): Observable<Manual> {
        return this.http.get(`${this.resourceUrl}/${id}`).map(manual => Manual.prototype.copyFromJSON(manual));
    }

    getPage(filtro: ManualFilter, datatable: DataTable): Observable<any> {
        const options = {params: RequestUtil.getRequestParams(datatable) };
        return this.http.post(`${this.resourceUrl}/page`, filtro, options);
    }

    findDropdown(): Observable<any> {
        return this.http.get(`${this.resourceUrl}/dropdown`);
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }
}
