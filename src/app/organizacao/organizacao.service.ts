import { HttpClient } from '@angular/common/http';
import { Contrato } from './models/contrato.model';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { DataTable } from 'primeng/primeng';

import { Organizacao } from './models/organizacao.model';
import { ResponseWrapper, JSONable } from '../shared';

import { OrganizacaoFilter } from './models/OrganizacaoFilter';

import { RequestUtil } from '../util/requestUtil';

@Injectable()
export class OrganizacaoService {

  resourceUrl = environment.apiUrl + '/organizacao'

  constructor( private http: HttpClient) { }

  save(organizacao: Organizacao) {
    return this.http.post(this.resourceUrl, this.convertToJSON(organizacao));
  }

  find(id: number): Observable<Organizacao> {
    return this.http.get(`${this.resourceUrl}/${id}`).map(organizacao => Organizacao.prototype.copyFromJSON(organizacao));
  }

  getPage(filtro: OrganizacaoFilter, datatable: DataTable): Observable<any> {
    const options = { params: RequestUtil.getRequestParams(datatable) };
    return this.http.post(`${this.resourceUrl}/page`, filtro, options);
  }

  /**
 * Função que retorna dados do usuário logado somente com as organizações ativas
 */
  dropDownActiveLoggedUser(): Observable<Organizacao[]> {
    return this.http.get(`${this.resourceUrl}/dropdown-users`).map((res: Response) => {
      return this.convertResponseToResponseWrapper(res);
    });
  }

  dropDown(): Observable<Organizacao[]> {
    return this.http.get(`${this.resourceUrl}/dropdown`)
      .map((res: Response) => this.convertResponseToResponseWrapper(res));
  }

  dropDownActive(): Observable<Organizacao[]> {
    return this.http.get(`${this.resourceUrl}/dropdown/active`)
      .map((res: Response) => this.convertResponseToResponseWrapper(res));
  }

  searchActiveOrganizations(): Observable<Organizacao[]> {
    return this.http.get(this.resourceUrl + '/ativas')
      .map((res: Response) => this.convertResponseToResponseWrapper(res));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  findAllContratosByOrganization(id: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.resourceUrl}/${id}/contratos`);
  }

  private convertResponseToResponseWrapper(res): Organizacao[] {
    const result: Organizacao[] = [];
    for (let i = 0; i < res.length; i++) {
      result.push(this.convertFromJSON(res[i]));
    }
    return result;
  }

  private convertFromJSON(json: any): Organizacao {
    const entity: JSONable<Organizacao> = new Organizacao();
    return entity.copyFromJSON(json);
  }

  private convertToJSON(organizacao: Organizacao): Organizacao {
    return organizacao.toJSONState();
  }
}
