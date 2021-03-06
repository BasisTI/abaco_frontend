import { Calculadora } from '../calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../../analise/index';
import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { CalculadoraSpecHelper } from './calculadora-spec-helper';
import { CalculadoraTestData } from './calculadora-test-data';

const fatorAjusteUnitario2PF: FatorAjuste = CalculadoraTestData.criaFatorAjusteUnitario2PF();
const fatorAjustePercentual50: FatorAjuste = CalculadoraTestData.criaFatorAjustePercentual50();

describe('Calculadora de Função de Dados', () => {

  let metodoContagem: MetodoContagem;
  let funcaoDadosCalculada: FuncaoDados;

  it('deve lançar erro se não houver um fator de ajuste', () => {
    expect(() => {
      Calculadora.calcular('DETALHADA' as MetodoContagem, new FuncaoDados(), undefined);
    }).toThrowError();
  });

  describe('Método Contagem INDICATIVA', () => {

    beforeAll(() => metodoContagem = 'INDICATIVA' as MetodoContagem);

    describe('ALI', () => {

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(35)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(35)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(percentualSpecHelper, deveZerarDEReRLR);

    });

    function deveZerarDEReRLR() {
      it('deve "zerar" DER', () => {
        expect(funcaoDadosCalculada.der).toEqual('0');
      });

      it('deve "zerar" RLR', () => {
        expect(funcaoDadosCalculada.rlr).toEqual('0');
      });
    }

    describe('AIE', () => {

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(15)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(15)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(percentualSpecHelper, deveZerarDEReRLR);
    });
  });

  describe('Método Contagem ESTIMADA', () => {

    beforeAll(() => metodoContagem = 'ESTIMADA' as MetodoContagem);

    describe('ALI', () => {

      const ALI_ESTIMADA_PF_BRUTO = 7;

      // FATOR de ajuste unitário sempre vai ter Complexidade 'SEM'
      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(ALI_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(ALI_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.BAIXA);
      testesEmComum(percentualSpecHelper);

    });

    describe('AIE', () => {

      const AIE_ESTIMADA_PF_BRUTO = 5;

      // FATOR de ajuste unitário sempre vai ter Complexidade 'SEM'
      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(AIE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoDadosEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(AIE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.BAIXA);
      testesEmComum(percentualSpecHelper);

    });
  });

  describe('Método Contagem DETALHADA', () => {

    beforeAll(() => metodoContagem = 'DETALHADA' as MetodoContagem);

    describe('ALI', () => {
      describe('Complexidade BAIXA', () => {
        const ALI_BAIXA_PF_BRUTO = 7;
        it(`todos os casos devem ter PF Bruto '${ALI_BAIXA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaALIsComplexidadeBaixa(),
            ALI_BAIXA_PF_BRUTO);
        });
      });

      describe('Complexidade MEDIA', () => {
        const ALI_MEDIA_PF_BRUTO = 10;
        it(`todos os casos devem ter PF Bruto '${ALI_MEDIA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaALIsComplexidadeMedia(),
            ALI_MEDIA_PF_BRUTO);
        });
      });

      describe('Complexidade ALTA', () => {
        const ALI_ALTA_PF_BRUTO = 15;
        it(`todos os casos devem ter PF Bruto '${ALI_ALTA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaALIsComplexidadeAlta(),
            ALI_ALTA_PF_BRUTO);
        });
      });
    });

    describe('AIE', () => {

      describe('Complexidade BAIXA', () => {
        const AIE_BAIXA_PF_BRUTO = 5;
        it(`todos os casos devem ter PF Bruto '${AIE_BAIXA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaAIEsComplexidadeBaixa(),
            AIE_BAIXA_PF_BRUTO);
        });
      });

      describe('Complexidade MEDIA', () => {
        const AIE_MEDIA_PF_BRUTO = 7;
        it(`todos os casos devem ter PF Bruto '${AIE_MEDIA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaAIEsComplexidadeMedia(),
            AIE_MEDIA_PF_BRUTO);
        });
      });

      describe('Complexidade ALTA', () => {
        const AIE_ALTA_PF_BRUTO = 10;
        it(`todos os casos devem ter PF Bruto '${AIE_ALTA_PF_BRUTO}'`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaAIEsComplexidadeAlta(),
            AIE_ALTA_PF_BRUTO);
        });
      });
    });

    function verificaPfBrutoDetalhada(funcoes: FuncaoDados[], pfBrutoEsperado: number) {
      funcoes.forEach(funcao => {
        const funcaoCalculada: FuncaoDados =
          Calculadora.calcular(metodoContagem, funcao, null);
        expect(funcaoCalculada.grossPF).toEqual(pfBrutoEsperado);
      });
    }

  });

  function testesEmComum(specHelper: CalculadoraSpecHelper, ...fns: Function[]) {
    describe(`Fator de Ajuste ${specHelper.fatorAjusteLabel}`, () => {

      describe(specHelper.descricaoDaFuncao, () => {

        beforeEach(() => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, specHelper.funcaoDadosEntrada, undefined);
        });

        it(`deve ter PF bruto ${specHelper.pfBruto}`, () => {
          expect(funcaoDadosCalculada.grossPF).toEqual(specHelper.pfBruto);
        });

        it(`deve ter PF líquido ${specHelper.calculaPfLiquido()}`, () => {
          expect(funcaoDadosCalculada.pf).toEqual(specHelper.calculaPfLiquido());
        });

        it(`deve ter Complexidade ${specHelper.complexidade}`, () => {
          expect(funcaoDadosCalculada.complexidade).toEqual(specHelper.complexidade);
        });

        fns.forEach(fn => fn());

      });

    });
  }
});
