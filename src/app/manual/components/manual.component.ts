import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { Manual } from '../model/manual.model';
import { ManualService } from '../manual.service';
import { PageNotificationService } from '../../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManualFilter } from '../model/ManualFilter';
import { Observable } from 'rxjs';
import { Page } from '../../util/page';

@Component({
    selector: 'jhi-manual',
    templateUrl: './manual.component.html'
})
export class ManualComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild(DataTable) dataTable: DataTable;

    selectedLine: Manual = new Manual();
    filtro: ManualFilter = new ManualFilter();
    manuais: Page<Manual> = new Page<Manual>();
    nomeDoManualClonado: string = '';
    mostrarDialogClonar = false;
    nomeValido: boolean = false;

    constructor(
        private router: Router,
        private manualService: ManualService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) { }

    translateMessage(message: string, callback: (translatedMessage: string, id?: number) => void, id?: number) {
        this.translate.get(message).subscribe((translatedMessage: string) => {
            callback.call(this, translatedMessage, id);
        });
    }

    translateMultiple(messages: string[], names: string[], callback: (messages: string[], names: string[]) => void) {
        // result é um array de observables contendo todos os observers das menssagens traduzidas
        const result = messages.map(message => this.translate.get(message));
        // forkJoin retornar um observable com o resultado de todas as traduções em uma unica chamada
        // o metodo call no callback é para manter o contexto na função de callback, para não utilizar o contexto de dentro da lib do RxJs
        Observable.forkJoin(result).subscribe(messages => callback.call(this, messages, names));
    }

    public ngOnInit() {
        this.obterManuais();
    }

    susbcribeSelectRow(data): any {
        this.selectedLine = data;
    }

    subscrbeUnselectRow() {
        this.selectedLine = null;
    }

    abrirEditar() {
        this.router.navigate(['/manual', this.selectedLine.id, 'edit']);
    }

    abrirVisualizar() {
        this.router.navigate(['/manual', this.selectedLine.id])
    }

    clone() {
        this.mostrarDialogClonar = true;
    }

    public fecharDialogClonar() {
        this.mostrarDialogClonar = false;
        this.dataTable.selection = null;
        this.selectedLine = null;
        this.nomeDoManualClonado = null;
    }

    public clonar() {
        if (this.nomeDoManualClonado) {
            this.nomeValido = false;
            const manualClonado: Manual = Manual.prototype.copyFromJSON(this.selectedLine);
            manualClonado.id = null;
            const nomeAntigo = manualClonado.nome;
            manualClonado.nome = this.nomeDoManualClonado;
            if (manualClonado.esforcoFases) {
                manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
            }
            if (manualClonado.fatoresAjuste) {
                manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);
            }

            this.translateMessage('Cadastros.Manual.Mensagens.Clonando_Manual', this.startBlockUI);
            this.manualService.save(manualClonado)
                .finally(() => this.blockUI.stop())
                .subscribe(() => {
                    this.translateMultiple(['Cadastros.Manual.Mensagens.msgManual',
                        'Cadastros.Manual.Mensagens.msgClonadoPartirDoManual',
                        'Cadastros.Manual.Mensagens.msgComSucesso'], [manualClonado.nome, nomeAntigo], this.showCloneSuccessMsg);
                    this.obterManuais();
                });
            this.fecharDialogClonar();
        } else {
            this.nomeValido = true;
        }
    }

    // Este método cria a menssagem de sucesso de clonagem com traduções
    showCloneSuccessMsg(messages: string[], names: string[]) {
        this.pageNotificationService.addSuccessMsg(
            `${messages.shift()} ${names.shift()} ${messages.shift()} ${names.shift()} ${messages.shift()}`);
    }

    public limparPesquisa() {
        this.filtro = new ManualFilter();
        this.obterManuais();
    }

    public confirmDelete(id: number) {
        this.translateMessage('Global.Mensagens.CertezaExcluirRegistro', this.configureMessage, id);
    }

    configureMessage(translatedMessage: string, id: number) {
        this.confirmationService.confirm({
            message: translatedMessage,
            accept: () => {
                this.translateMessage('Global.Mensagens.EXCLUINDO_REGISTRO', this.startBlockUI);
                this.manualService.delete(id)
                    .finally(() => this.blockUI.stop())
                    .subscribe(() => {
                        this.translateMessage('Global.Mensagens.RegistroExcluidoComSucesso', this.showSuccessMsg);
                        this.obterManuais();
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

    obterManuais() {
        this.manualService.getPage(this.filtro, this.dataTable)
            .finally(() => this.blockUI.stop())
            .subscribe(manuais => this.manuais = manuais);
    }
}
