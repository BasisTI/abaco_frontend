import { TipoFilter } from './../tipo-model/tipo.filter';
import { Component, ViewChild, OnInit } from '@angular/core';
import { TipoService } from '../tipo.service';
import { Tipo } from '../tipo-model/tipo.model';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Page } from '../../util/page';
import { Router } from '@angular/router';
import { PageNotificationService } from '@basis/angular-components';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
})
export class TipoComponent implements OnInit {

  @ViewChild(DataTable) dataTable: DataTable;
  filtro: TipoFilter;
  tipos: Page<Tipo>;
  tipoSelecionado: Tipo = new Tipo();

  constructor(private tipoService: TipoService,
    private route: Router,
    private pageNotificationService: PageNotificationService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService) 
  {
    this.filtro = new TipoFilter();
    this.tipos = new Page<Tipo>();
  }

  obterTipos() {
    this.tipoService.getPage(this.filtro, this.dataTable)
      .subscribe(response => {
        this.tipos = response;
      });
  }

  limpaCampos() {
    this.filtro = new TipoFilter();
    this.obterTipos();
  }

  visualizarTipo() {
    this.route.navigate([`/tipo`, this.tipoSelecionado.id]);
  }

  linhaSelecionada(data) {
    this.tipoSelecionado = data;
  }

  abrirTelaEditarTipo() {
    this.route.navigate([`/tipo`, this.tipoSelecionado.id, `edit`]);
  }

  removerRegistro() {
    this.translate.get('Global.Mensagens.CertezaExcluirRegistro').subscribe((translatedMessage: string) => {
      this.confirmationService.confirm({
        message: translatedMessage,
        accept: () => {
          this.tipoService.delete(this.tipoSelecionado.id).subscribe(() => {
            this.pageNotificationService.addDeleteMsg();
            this.tipoSelecionado = null;
            this.obterTipos();
          });
        }
      });
    });
  }
  
  ngOnInit() {
    this.obterTipos();
  }
}