import { FuncaoResumivel, Complexidade } from 'src/app/analise-shared';
import { Impacto } from 'src/app/analise-shared/impacto-enum';
import { Modulo } from 'src/app/modulo';
import { BaseEntity } from '../shared';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';
import { Funcionalidade } from '../funcionalidade';
import { FatorAjuste } from '../fator-ajuste';
import { Der } from '../der/der.model';
import { Rlr } from '../rlr/rlr.model';
import { DerTextParser, ParseResult } from '../analise-shared/der-text/der-text-parser';
import { DerChipConverter } from '../analise-shared/der-chips/der-chip-converter';
import { CommentFuncaoDados } from './comment-funcado-dados.model';

export enum TipoFuncaoDados {
    'ALI' = 'ALI',
    'AIE' = 'AIE',
    'INM' = 'INM'
}

enum StatusFunction {
    DIVERGENTE = 'DIVERGENTE',
    EXCLUIDO = 'EXCLUIDO',
    VALIDADO = 'VALIDADO',
  }

export class Editor {
    constructor(public label?: string,
                public placeholder?: string,
                public formControlName?: string
    ) {
    }
}

export class FuncaoDados implements FuncaoResumivel, BaseEntity, FuncaoAnalise{

    detStr: string;
    retStr: string;

    constructor(
        public id?: number,
        public artificialId?: number,
        public tipo?: TipoFuncaoDados,
        public complexidade?: Complexidade,
        public pf?: number,
        public analise?: BaseEntity,
        public funcionalidades?: BaseEntity[],
        public funcionalidade?: Funcionalidade,
        public fatorAjuste?: FatorAjuste,
        public alr?: BaseEntity,
        public name?: string,
        public sustantation?: string,
        public der?: string,
        public rlr?: string,
        public grossPF?: number,
        public derValues?: string[],
        public rlrValues?: string[],
        public ders?: Der[],
        public rlrs?: Rlr[],
        public impacto?: Impacto,
        public quantidade: number = 0,
        public modulo?: Modulo,
        public statusFuncao?: StatusFunction,
        public lstDivergenceComments?: CommentFuncaoDados[],
    ) {
        if (!pf) {
            this.pf = 0;
        }
        if (!grossPF) {
            this.grossPF = 0;
        }
    }

    static convertJsonToObject(json: any) {
        const sintetico = Object.create(FuncaoDados.prototype);
        return Object.assign(sintetico, json, {
            created: new Date(json.created)
        });

    }

    static tipos(): string[] {
        return Object.keys(TipoFuncaoDados).map(k => TipoFuncaoDados[k as any]);
    }

    tipoAsString(): string {
        return this.tipo.toString();
    }

    toJSONState(): FuncaoDados {
        const copy: FuncaoDados = Object.assign({}, this);
        copy.derValues = DerTextParser.parse(this.der).textos;
        copy.rlrValues = DerTextParser.parse(this.rlr).textos;
        copy.detStr = copy.der;
        copy.retStr = copy.rlr;

        copy.funcionalidade = Funcionalidade.toNonCircularJson(copy.funcionalidade);

        if (this.ders !== undefined && this.rlrs) {
            copy.ders = this.ders.map(der => der.toJSONState());
            copy.rlrs = this.rlrs.map(rlr => rlr.toJSONState());
        }


        return copy;
    }

    comparar(funcaoDados: FuncaoDados): boolean {
        return funcaoDados.name === this.name &&
            funcaoDados.funcionalidade.id === this.funcionalidade.id &&
            funcaoDados.funcionalidade.modulo.id === this.funcionalidade.modulo.id;
    }

    copyFromJSON(json: any): FuncaoDados {
        return new FuncaoDadosCopyFromJSON(json).copy();
    }

    derValue(): number {
        if (this.ders && this.ders.length > 0) {
            return DerChipConverter.valor(this.ders);
        } else if (!this.der) {
            return 0;
        }
        return DerTextParser.parse(this.der).total();
    }

    rlrValue(): number {
        if (this.rlrs && this.rlrs.length > 0) {
            return DerChipConverter.valor(this.rlrs);
        } else if (!this.rlr) {
            return 0;
        }
        return DerTextParser.parse(this.rlr).total();
    }


    clone(): FuncaoDados {
        return new FuncaoDados(this.id, this.artificialId, this.tipo, this.complexidade,
            this.pf, this.analise, this.funcionalidades, this.funcionalidade,
            this.fatorAjuste, this.alr, this.name, this.sustantation, this.der, this.rlr,
            this.grossPF, this.derValues, this.rlrValues, this.ders, this.rlrs, this.impacto,
            this.quantidade, this.modulo, this.statusFuncao, this.lstDivergenceComments);
    }

}

class FuncaoDadosCopyFromJSON {

    private _json: any;

    private _funcaoDados;
    FuncaoDados;

    constructor(json: any) {
        this._json = json;
        this._funcaoDados = new FuncaoDados();
    }

    public copy(): FuncaoDados {
        this.converteValoresTriviais();
        this.converteBaseEntities();
        this.converteFuncionalidade();
        this.converteFatorAjuste();
        this.converteTextos();
        this.converteDers();
        this.converteRlrs();
        return this._funcaoDados;
    }

    private converteValoresTriviais() {
        this._funcaoDados.id = this._json.id;
        this._funcaoDados.tipo = this._json.tipo;
        this._funcaoDados.complexidade = this._json.complexidade;
        this._funcaoDados.pf = this._json.pf;
        this._funcaoDados.name = this._json.name;
        this._funcaoDados.sustantation = this._json.sustantation;
        this._funcaoDados.grossPF = this._json.grossPF;
        this._funcaoDados.impacto = this._json.impacto;
        this._funcaoDados.quantidade = this._json.quantidade;
        this._funcaoDados.statusFuncao = this._json.statusFuncao;
        this._funcaoDados.lstDivergenceComments = this._json.lstDivergenceComments;

    }

    private converteBaseEntities() {
        this._funcaoDados.analise = this._json.analise;
        this._funcaoDados.funcionalidades = this._json.funcionalidades;
        this._funcaoDados.alr = this._json.alr;
    }

    private converteFuncionalidade() {
        this._funcaoDados.funcionalidade = Funcionalidade.fromJSON(this._json.funcionalidade);
    }

    private converteFatorAjuste() {
        if (this._json.fatorAjuste) {
            this._funcaoDados.fatorAjuste = new FatorAjuste().copyFromJSON(this._json.fatorAjuste);
        }
    }

    // TODO como converter quando vier DER / RLR entidade persistida no banco?
    private converteTextos() {
        this._funcaoDados.der = this._json.detStr;
        this._funcaoDados.rlr = this._json.retStr;

        this._funcaoDados.derValues = this.converteTexto(this._json.detStr);
        this._funcaoDados.rlrValues = this.converteTexto(this._json.retStr);
    }

    private converteTexto(texto: any): string[] {
        const parseResult: ParseResult = DerTextParser.parse(texto);
        // TODO acho que essa logica esta sendo feita em mais de um lugar
        if (parseResult.isTipoNumerico()) {
            return [parseResult.numero.toString()];
        } else {
            return parseResult.textos;
        }
    }

    private converteDers() {
        if (this._json.ders) {
            this._funcaoDados.ders = this._json.ders.map(
                der => new Der().copyFromJSON(der)
            );
        }
    }

    private converteRlrs() {
        if (this._json.rlrs) {
            this._funcaoDados.rlrs = this._json.rlrs.map(
                rlr => new Rlr().copyFromJSON(rlr)
            );
        }
    }

}

