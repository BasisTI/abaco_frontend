import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Organizacao } from './organizacao.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class OrganizacaoService {

  resourceName = '/organizacaos';

  resourceUrl = environment.apiUrl + this.resourceName;

  searchUrl = environment.apiUrl + '/_search' + this.resourceName;

  constructor(private http: HttpService) {}

  create(organizacao: Organizacao): Observable<Organizacao> {
    const copy = this.convertToJSON(organizacao);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertFromJSON(jsonResponse);
    });
  }

  update(organizacao: Organizacao): Observable<Organizacao> {
    const copy = this.convertToJSON(organizacao);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertFromJSON(jsonResponse);
    });
  }

  find(id: number): Observable<Organizacao> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertFromJSON(jsonResponse);
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
      .map((res: Response) => this.convertResponseToResponseWrapper(res));
  }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  private convertResponseToResponseWrapper(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertFromJSON(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  private convertFromJSON(json: any): Organizacao {
    const entity: Organizacao = Object.assign(new Organizacao(), json);
    return entity;
  }

  private convertToJSON(organizacao: Organizacao): Organizacao {
    const copy: Organizacao = Object.assign({}, organizacao);
    return copy;
  }
}