import { HttpClient } from '@angular/common/http';
import { Contrato } from './models/contrato.model';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import { Organizacao } from './models/organizacao.model';
import {ResponseWrapper, JSONable, PageNotificationService} from '../shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class OrganizacaoService {

  resourceUrl = environment.apiUrl + '/organizacao'

  constructor(
    private http: HttpClient,
    private pageNotificationService: PageNotificationService,
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  save(organizacao: Organizacao) {
    return this.http.post(this.resourceUrl, this.convertToJSON(organizacao));
  }

  find(id: number): Observable<Organizacao> {
    return this.http.get(`${this.resourceUrl}/${id}`).map(organizacao => Organizacao.prototype.copyFromJSON(organizacao));
  }

    /**
   * Função que retorna dados do usuário logado somente com as organizações ativas
   */
  dropDownActiveLoggedUser(): Observable<ResponseWrapper> {
    return this.http.get(this.resourceUrl + '/active-user').map((res: Response) => {
      return this.convertResponseToResponseWrapper(res);
    });
  }

  dropDown(): Observable<ResponseWrapper> {
      return this.http.get(this.resourceUrl + '/drop-down')
          .map((res: Response) => this.convertResponseToResponseWrapper(res)).catch((error: any) => {
              if (error.status === 403) {
                  this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                  return Observable.throw(new Error(error.status));
              }
          });
  }

  dropDownActive(): Observable<ResponseWrapper> {
    return this.http.get(this.resourceUrl + '/drop-down/active')
        .map((res: Response) => this.convertResponseToResponseWrapper(res)).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
}

    searchActiveOrganizations(req?: any): Observable<ResponseWrapper> {
        return this.http.get(this.resourceUrl + '/ativas')
            .map((res: Response) => this.convertResponseToResponseWrapper(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            });
    }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
            return Observable.throw(new Error(error.status));
        }
    });
  }

  findAllContratosByOrganization(id: number): Observable<Contrato[]> {
    return null;
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
    const entity: JSONable<Organizacao> = new Organizacao();
    return entity.copyFromJSON(json);
  }

  private convertToJSON(organizacao: Organizacao): Organizacao {
    return organizacao.toJSONState();
  }
}
