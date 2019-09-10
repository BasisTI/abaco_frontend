import { TipoFilter } from './tipo-model/tipo.filter';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Tipo } from './tipo-model/tipo.model';
import { environment } from '../../environments/environment';
import { DataTable } from 'primeng/primeng';
import { RequestUtil } from '../util/requestUtil'
@Injectable()
export class TipoService {

  private url: String;

  constructor(private http: Http) {
    this.url = `${environment.apiUrl}/tipo`;
  }

  find(id: number): Observable<Tipo> {
    return this.http.get(`${this.url}/${id}`)
      .map(response => response.json());
  }

  getPage(filtro :TipoFilter, dataTable: DataTable): Observable<any>{
    const optionsParam = {
      params: RequestUtil.getRequestParams(dataTable)
    }
    return this.http.post(`${this.url}/page`, filtro, optionsParam);
  }

  create(tipo: Tipo): Observable<Response> {
    return this.http.post(`${this.url}`, tipo);
  }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
