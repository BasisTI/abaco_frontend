import { HttpClient } from '@angular/common/http';
import { TipoFilter } from './tipo-model/tipo.filter';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DataTable } from 'primeng/primeng';
import { RequestUtil } from '../util/requestUtil'
import { Tipo } from './tipo-model/tipo.model';

@Injectable()
export class TipoService {

  private url: String;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/tipo`;
  }

  create(tipo: Tipo): Observable<Tipo>{
    return this.http.post(`${this.url}`,tipo);
  }

  getPage(filtro :TipoFilter, dataTable: DataTable): Observable<any>{
    const optionsParam = {
      params: RequestUtil.getRequestParams(dataTable)
    }
    return this.http.post(`${this.url}/page`, filtro, optionsParam);
  }

  findById(id: number): Observable<Tipo>{
    return this.http.get(`${this.url}/${id}`);
  }

  delete(id: number): Observable<Tipo>{
    return this.http.delete(`${this.url}/${id}`);
  }
}
