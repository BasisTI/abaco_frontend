import { FuncaoTransacao } from './../funcao-transacao/funcao-transacao.model';
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {ResponseWrapper, createRequestOption, JhiDateUtils} from '../shared';
import {FuncaoDados} from '.';
import {Analise} from '../analise/analise.model';
import {tap} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {BaselineSintetico} from '../baseline/baseline-sintetico.model';

@Injectable()
export class FuncaoDadosService {

    sistemaResourceUrl = environment.apiUrl + '/funcao-dados';

    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';

    constructor(private http: HttpService) {
    }

    findAllNamesBySistemaId(sistemaId: number): Observable<string[]> {
        const url = `${this.sistemaResourceUrl}/${sistemaId}/funcao-dados`;
        return this.http.get(url)
            .map((res: Response) => res.json().map(json => json.nome));
    }

    recuperarFuncaoDadosPorIdNome(id: number, nome: string): Observable<FuncaoDados> {
        const url = `${this.sistemaResourceUrl}/${id}/funcao-dados-versionavel/${nome}`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    public getFuncaoDadosAnalise(id: number): Observable<ResponseWrapper> {
        const url = `${this.sistemaResourceUrl}/analise/${id}`;
        return this.http.get(url).map((res: Response) => {
            return this.convertResponseFuncaoDados(res);
        });
    }

    getFuncaoDadosBaseline(id: number): Observable<FuncaoDados> {
        console.log(this.sistemaResourceUrl);
        return this.http.get(`${this.sistemaResourceUrl}/${id}`).map((res: Response) => {
            const resposta = this.convertJsonToSintetico(res.json());
            return resposta;
        });
    }

    getFuncaoTransacaoBaseline(id: number): Observable<FuncaoTransacao> {
        return this.http.get(`${this.funcaoTransacaoResourceUrl}/${id}`).map((res: Response) => {
            const resposta = this.convertJsonToSinteticoTransacao(res.json());
            return resposta;
        });
    }

  
    private convertJsonToSintetico(json: any): FuncaoDados {
        const entity: FuncaoDados = FuncaoDados.convertJsonToObject(json);
        return entity;
    }

    private convertJsonToSinteticoTransacao(json: any): FuncaoTransacao {
        const entity: FuncaoTransacao = FuncaoTransacao.convertTransacaoJsonToObject(json);
        return entity;
    }

    public delete(id: number): Observable<Response> {
        return this.http.delete(`${this.sistemaResourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItem(json: any): FuncaoDados {
        
        return FuncaoDados.convertJsonToObject(json);
    }

    private convertResponseFuncaoDados(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }


}
