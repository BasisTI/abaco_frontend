import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService } from '../shared';
import { FuncaoDados } from './funcao-dados.model';
import { Analise, ResumoFuncaoDados } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Modulo } from '../modulo/index';
import { Funcionalidade } from '../funcionalidade/index';
import { SelectItem } from 'primeng/primeng';
import { Calculadora } from '../analise-shared/calculadora';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit {

  currentFuncaoDados: FuncaoDados;
  resumo: ResumoFuncaoDados;

  fatoresAjuste: FatorAjuste[] = [];

  classificacoes: SelectItem[] = [
    { label: 'ALI', value: 'ALI' },
    { label: 'AIE', value: 'AIE' }
  ];

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
  ) { }

  ngOnInit() {
    this.currentFuncaoDados = new FuncaoDados();
  }

  get funcoesDados(): FuncaoDados[] {
    if (!this.analise.funcaoDados) {
      return [];
    }
    return this.analise.funcaoDados;
  }

  private get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  private set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  private get manual() {
    if (this.analiseSharedDataService.analise.contrato) {
      return this.analiseSharedDataService.analise.contrato.manual;
    }
    return undefined;
  }

  isContratoSelected(): boolean {
    // FIXME p-dropdown requer 2 clicks quando o [options] chama um método get()
    const isContratoSelected = this.analiseSharedDataService.isContratoSelected();
    if (isContratoSelected && this.fatoresAjuste.length === 0) {
      this.fatoresAjuste = this.manual.fatoresAjuste;
    }

    return isContratoSelected;
  }

  fatoresAjusteDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Valor de Ajuste';
    } else {
      return `Valor de Ajuste - Selecione um Contrato na aba 'Geral' para carregar os Valores de Ajuste`;
    }
  }

  moduloSelected(modulo: Modulo) {
  }

  funcionalidadeSelected(funcionalidade: Funcionalidade) {
    this.currentFuncaoDados.funcionalidade = funcionalidade;
  }

  adicionar() {
    const funcaoDadosCalculada = Calculadora.calcular(this.analise.tipoContagem,
      this.currentFuncaoDados);
    this.analise.addFuncaoDados(funcaoDadosCalculada);
    this.resumo = this.analise.generateResumoFuncaoDados();

    // Mantendo o mesmo conteudo a pedido do Leandro
    this.currentFuncaoDados = this.currentFuncaoDados.clone();
    this.currentFuncaoDados.artificialId = undefined;
  }

  resumoFuncaoDatosStringified(): string {
    return JSON.stringify(this.resumo);
  }
}
