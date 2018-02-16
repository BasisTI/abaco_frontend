import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';

import * as _ from 'lodash';
import { FuncaoTransacao, TipoFuncaoTransacao } from '../../funcao-transacao';

export class CalculadoraTestData {

  private static readonly MAX_DER_DADOS = 201;
  private static readonly MAX_TR = 21;

  static criaFatorAjusteUnitario2PF(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'unitario';
    fa.fator = 2.0;
    fa.tipoAjuste = TipoFatorAjuste.UNITARIO;
    return fa;
  }

  static criaFatorAjustePercentual50(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'percentual';
    fa.fator = 0.5;
    fa.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
    return fa;
  }

  static criaFuncaoDadosALI(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.ALI);
  }

  static criaFuncaoDados(tipo: TipoFuncaoDados): FuncaoDados {
    const func = new FuncaoDados();
    func.tipo = tipo;
    func.der = '5';
    func.rlr = '5';
    return func;
  }

  // TODO overload do typescript?
  static criaFuncaoDadosComValores(tipo: TipoFuncaoDados, der: number, rlr: number): FuncaoDados {
    const func = new FuncaoDados();
    func.tipo = tipo;
    func.der = der.toString();
    func.rlr = rlr.toString();
    return func;
  }

  static criaFuncaoDadosAIE(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.AIE);
  }

  static criaFuncaoTransacaoEE(): FuncaoTransacao {
    return this.criaFuncaoTransacao(TipoFuncaoTransacao.EE, 5, 5);
  }

  static criaFuncaoTransacao(tipo: TipoFuncaoTransacao, der: number, ftr: number): FuncaoTransacao {
    const func = new FuncaoTransacao();
    func.tipo = tipo;
    func.der = der.toString();
    func.ftr = ftr.toString();
    return func;
  }

  // TODO criaXXsComplexidadeXXX() provavelmente logica em comum com testes de complexidadeFuncional
  static criaALIsComplexidadeBaixa(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeBaixa(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeBaixa(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, 51);
    const valoresRlr: number[] = _.range(1, 6);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeBaixaDados,
      valoresDer, valoresRlr
    );
  }

  private static criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
    tipo: TipoFuncaoDados, funcaoDentroDoIntervalo: (der: number, rlr: number) => boolean,
    valoresDer: number[], valoresRlr: number[]): FuncaoDados[] {

    const funcoesDados: FuncaoDados[] = [];
    const fatorAjustePercentual: FatorAjuste = this.criaFatorAjustePercentual50();

    valoresDer.forEach(der => {
      valoresRlr.forEach(rlr => {
        if (funcaoDentroDoIntervalo(der, rlr)) {
          const funcao = this.criaFuncaoDadosComValores(tipo, der, rlr);
          funcao.fatorAjuste = fatorAjustePercentual;
          funcoesDados.push(funcao);
        }
      });
    });

    return funcoesDados;
  }

  private static valoresDentroDeComplexidadeBaixaDados(der: number, rlr: number) {
    return der < 20 || (der > 20 && rlr === 1);
  }

  static criaALIsComplexidadeMedia(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeMedia(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeMedia(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(1, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeMediaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeMediaDados(der: number, rlr: number): boolean {
    return (der < 20 && rlr > 5) ||
      ((der > 20 && der <= 50) && (rlr >= 2 && rlr <= 5)) ||
      (der > 50 && rlr === 1);
  }

  static criaALIsComplexidadeAlta(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeAlta(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeAlta(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(20, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(2, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeAltaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeAltaDados(der: number, rlr: number): boolean {
    return ((der >= 20 && der <= 50) && rlr > 5) ||
      // TODO avaliar se quebra para somente rlr >= 2
      // decisão não tão imediata se decidir reutilizar 'linhas' e 'colunas'
      der > 50 && ((rlr >= 2 && rlr <= 5) || (rlr > 5));
  }

  static criaAIEsComplexidadeBaixa(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeBaixa(TipoFuncaoDados.AIE);
  }

  static criaAIEsComplexidadeMedia(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeMedia(TipoFuncaoDados.AIE);
  }

  static criaAIEsComplexidadeAlta(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeAlta(TipoFuncaoDados.AIE);
  }

}
