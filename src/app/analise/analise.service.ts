import { Injectable } from '@angular/core';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Analise , AnaliseShareEquipe} from './';
import {ResponseWrapper, createRequestOption, JhiDateUtils, PageNotificationService} from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { loginRoute } from '../login';
import { Observable } from 'rxjs';
import { RequestMethod, ResponseContentType } from '@angular/http';

@Injectable()
export class AnaliseService {

  resourceUrl = environment.apiUrl + '/analises';

  relatoriosUrl = environment.apiUrl + '/relatorioPdfBrowser';

  findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

  findCompartilhadaByAnaliseUrl = environment.apiUrl + '/compartilhada';

  relatorioAnaliseUrl = environment.apiUrl + '/relatorioPdfArquivo';

  relatoriosDetalhadoUrl = environment.apiUrl + '/downloadPdfDetalhadoBrowser';

  searchUrl = environment.apiUrl + '/_search/analises';

  relatoriosBaselineUrl = environment.apiUrl + '/downloadPdfBaselineBrowser';

  @BlockUI() blockUI: NgBlockUI;

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService) {}

  /**
   *
   */
  public create(analise: Analise): Observable<Analise> {
    this.blockUI.start('Criando análise...');
    const copy = this.convert(analise);
    return this.http.post(this.resourceUrl, copy).map((res: any) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return jsonResponse;
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   * atualizaAnalise
   */
  public atualizaAnalise(analise: Analise) {
    this.update(analise)
        .subscribe((res) => {
      console.log(res);
    });
  }


  /**
   *
   */
  public update(analise: Analise): Observable<Analise> {
    this.blockUI.start('Atualizando análise...');
    const copy = this.convert(analise);
    return this.http.put(this.resourceUrl, copy).map((res: ResponseWrapper) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
        console.log(error);
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   *
   */
  public block(analise: Analise): Observable<Analise> {
    this.blockUI.start('Bloqueando/Desbloqueando análise...');
    const copy = analise;
    return this.http.put(`${this.resourceUrl}/${copy.id}/block`, copy).map((res: ResponseWrapper) => {
      this.blockUI.stop();
      return null;
    }).catch((error: any) => {
        switch (error.status) {
          case 400: {
            if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
                this.pageNotificationService.addErrorMsg('Somente administradores podem bloquear/desbloquear análises!');
            }
            break;
          }
          case 403: {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            break;
          }
        }
        return Observable.throw(new Error(error.status));
    });
  }



  /**
   *
   */
  public gerarRelatorioPdfArquivo(id: number) {
    window.open(`${this.relatorioAnaliseUrl}/${id}`);
  }

  /**
   *
   */
  public geraRelatorioPdfBrowser(id: number): Observable<string> {
    this.blockUI.start('GERANDO RELATORIO...');
    this.http.get(`${this.relatoriosUrl}/${id}`, {
    method: RequestMethod.Get,
    responseType: ResponseContentType.Blob,
  }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], {type: mediaType});
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.pdf';
        anchor.href = fileURL;
        window.open(fileURL, '_blank', '');
        this.blockUI.stop();
        return null;
      });
      return null;
  }

    /**
   *
   */
  public geraRelatorioPdfDetalhadoBrowser(id: number): Observable<string> {
    this.blockUI.start('GERANDO RELATORIO...');
    this.http.get(`${this.relatoriosDetalhadoUrl}/${id}`, {
    method: RequestMethod.Get,
    responseType: ResponseContentType.Blob,
  }).catch((error: any) => {
    if (error.status === 500) {
        this.pageNotificationService.addErrorMsg('Erro ao gerar relatório, verifique se a análise possui FDs/FTs cadastradas');
        this.blockUI.stop();
        return Observable.throw(new Error(error.status));
    }
}).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], {type: mediaType});
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.pdf';
        anchor.href = fileURL;
        window.open(fileURL, '_blank', '');
        this.blockUI.stop();
        return null;
      });
      return null;
  }

  /**
   *
   */
  public geraBaselinePdfBrowser(): Observable<string> {
    this.blockUI.start('GERANDO RELATORIO...');
    this.http.get(`${this.relatoriosBaselineUrl}`, {
    method: RequestMethod.Get,
    responseType: ResponseContentType.Blob,
  }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], {type: mediaType});
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.pdf';
        anchor.href = fileURL;
        window.open(fileURL, '_blank', '');
        this.blockUI.stop();
        return null;
      });
      return null;
  }

  /**
   *
   */
  public find(id: number): Observable<Analise> {
    this.blockUI.start('Procurando análise...');
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: ResponseWrapper) => {
      const jsonResponse = res.json();
      const analiseJson = this.convertItemFromServer(jsonResponse);
      analiseJson.createdBy = jsonResponse.createdBy;
      this.blockUI.stop();
      return analiseJson;
    });
  }

  findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
    const url = `${this.findByOrganizacaoUrl}/${orgId}`;
    return this.http.get(url)
      .map((res: ResponseWrapper) => this.convertResponse(res.json()));
  }

  /** Encontra todas as análises referentes às equipes do usuário.
   *
   * @param idUsuario Id do usuário que está fazendo a requisição
   */
  findAnalisesUsuario(idUsuario: number): Observable<Analise[]> {
    this.blockUI.start('Filtrando análises...');
    const url = `${this.resourceUrl}/user/${idUsuario}`;
    return this.http.get(url)
      .map(
        (res: ResponseWrapper) => this.convertJsonToAnalise(res.json),
        (error) => this.tratarErro(error.toString(), idUsuario)
      );
  }

  tratarErro(erro: string, id: number) {}
  /**
   *
   */
  public query(req?: any): Observable<ResponseWrapper> {
    this.blockUI.start('Aguenta um cadinho aí...');
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
    .map((res: ResponseWrapper) => this.convertResponse(res.json())).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        });
  }

  /**
   *
   */
  public delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   *
   */
  private convertResponse(res: ResponseWrapper): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    this.blockUI.stop();
    return new ResponseWrapper(res.headers, result, res.status);
  }

  /**
   * Convert a returned JSON object to Analise.
   */
  private convertItemFromServer(json: any): Analise {
    return new Analise().copyFromJSON(json);
  }

  convertJsonToAnalise (res: ResponseWrapper): Analise[] {
    const jsonResponse = res.json();
    let result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    this.blockUI.stop();
    return result;
  }
  /**
   * Convert a Analise to a JSON which can be sent to the server.
   */
  private convert(analise: Analise): Analise {
    return analise.toJSONState();
  }

  // PARTE RESPONSÁVEL PELO "COMPARTILHAR"

   /** Encontra todas as equipes que têm acesso àquela análise
   *
   *
   */
  findAllCompartilhadaByAnalise(analiseId: number): Observable<ResponseWrapper> {
    this.blockUI.start('Buscando análises...');
    const url = `${this.findCompartilhadaByAnaliseUrl}/${analiseId}`;
    return this.http.get(url)
      .map((res: ResponseWrapper) => this.convertResponse(res.json()));
  }

   /** Salva as equipes que têm acesso àquela análise
   *
   *
   */
  salvarCompartilhar(listaCompartilhada: Array<AnaliseShareEquipe>) {
    this.blockUI.start('Compartilhando análise...');
    return this.http.post(`${this.resourceUrl}/compartilhar`, listaCompartilhada).map((res: ResponseWrapper) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return jsonResponse;
    });
  }

   /** Deletas as equipes que têm acesso àquela análise
   *
   *
   */
  deletarCompartilhar(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/compartilhar/delete/${id}`).catch((error: any) => {
      if (error.status === 403) {
          this.pageNotificationService.addErrorMsg('Você não possui permissão!');
          return Observable.throw(new Error(error.status));
      }
    });
  }

   /**Atualiza um compartilhamento para "Somente visualizar ou Editar"
   *
   *
   */
  atualizarCompartilhar(compartilhada) {
    this.blockUI.start('Atualizando compartilhamento...');
    const copy = compartilhada;
    return this.http.put(`${this.resourceUrl}/compartilhar/viewonly/${copy.id}`, copy).map((res: ResponseWrapper) => {
      this.blockUI.stop();
      return null;
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }
}
