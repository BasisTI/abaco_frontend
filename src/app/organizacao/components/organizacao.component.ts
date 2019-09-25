import { Page } from './../../util/page';
import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PageNotificationService } from '../../shared/page-notification.service';
import {
  OrganizacaoFilter,
  Organizacao,
  OrganizacaoService
} from '../';

@Component({
  selector: 'jhi-organizacao',
  templateUrl: './organizacao.component.html'
})
export class OrganizacaoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) dataTable: DataTable;

  selectedLine: Organizacao = new Organizacao();

  filtro: OrganizacaoFilter = new OrganizacaoFilter();

  organizacoes: Page<Organizacao> = new Page<Organizacao>();

  constructor(
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private translate: TranslateService
  ) { }

  translateMessage(message: string, callback: (translatedMessage: string, id?: number) => void, id?: number) {
    this.translate.get(message).subscribe((translatedMessage: string) => {
      callback.call(this, translatedMessage, id);
    });
  }

  public ngOnInit() {
    this.obterOrganizacoes();
  }

  obterOrganizacoes() {
    this.organizacaoService.getPage(this.filtro, this.dataTable)
      .finally(() => this.blockUI.stop())
      .subscribe(organizacoes => this.organizacoes = organizacoes);
  }

  susbcribeSelectRow(data): any {
    this.selectedLine = data;
  }

  subscrbeUnselectRow() {
    this.selectedLine = null;
  }

  abrirEditar() {
    this.router.navigate(['/organizacao', this.selectedLine.id, 'edit']);
  }

  abrirVisualizar() {
    this.router.navigate(['/organizacao', this.selectedLine.id])
  }

  limparPesquisa() {
    this.filtro = new OrganizacaoFilter();
    this.obterOrganizacoes();
  }

  confirmDelete(id: number) {
    this.translateMessage('Global.Mensagens.CertezaExcluirRegistro', this.configureMessage, id);
  }

  configureMessage(translatedMessage: string, id: number) {
    this.confirmationService.confirm({
      message: translatedMessage,
      accept: () => {
        this.translateMessage('Global.Mensagens.EXCLUINDO_REGISTRO', this.startBlockUI);
        this.organizacaoService.delete(id)
          .finally(() => this.blockUI.stop())
          .subscribe(() => {
            this.translateMessage('Global.Mensagens.RegistroExcluidoComSucesso', this.showSuccessMsg);
            this.obterOrganizacoes();
          });
      }
    });
  }

  startBlockUI(translatedMessage: string) {
    this.blockUI.start(translatedMessage);
  }

  showSuccessMsg(translatedMessage: string) {
    this.pageNotificationService.addSuccessMsg(translatedMessage);
  }

}
