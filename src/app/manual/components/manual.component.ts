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

    translateMessage(message: string, callback: (translatedMessage: string, ...args: any[]) => void, ...args: any[]) {
        this.translate.get(message).subscribe((translatedMessage: string) => {
            callback(translatedMessage, args);
        });
    }

    translateMultiple(messages: string[], callback: (messages: string[], ...agrs: object[]) => void) {
        Observable.forkJoin(
            messages.map(message => this.translate.stream(message))
        ).subscribe(messages => callback(messages))
    }

    public ngOnInit() {
        this.obterManuais();
    }

    susbcribeSelectRow(data): any {
        this.selectedLine = data;
    }

    subscrbeUnselectRow() {
        this.selectedLine = new Manual();
    }

    abrirEditar() {
        this.router.navigate(['/manual', this.selectedLine.id, 'edit']);
    }

    abrirVisualizar() {
        this.router.navigate(['/manual', this.selectedLine.id])
    }

    public fecharDialogClonar() {
        this.mostrarDialogClonar = false;
        this.nomeDoManualClonado = '';
    }

    public clonar() {
        if (this.nomeDoManualClonado !== undefined) {
            this.nomeValido = false;
            const manualClonado: Manual = this.selectedLine.clone();
            manualClonado.id = undefined;
            manualClonado.nome = this.nomeDoManualClonado;
            if (manualClonado.esforcoFases) {
                manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
            }
            if (manualClonado.fatoresAjuste) {
                manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);
            }

            this.manualService.save(manualClonado)
                .finally(() => this.blockUI.stop())
                .subscribe((manualSalvo: any) => {
                    this.translateMultiple(['Cadastros.Manual.Mensagens.msgManual',
                    'Cadastros.Manual.Mensagens.msgClonadoPartirDoManual',
                    'Cadastros.Manual.Mensagens.msgComSucesso'], manualSalvo);
                });
        } else {
            this.nomeValido = true;
        }
    }

    showSaveSuccessMsg(messages: string[], manual: Manual) {
        this.pageNotificationService.addSuccessMsg(
            `${messages.pop()} ${manual.nome} ${messages.pop()} ${this.selectedLine.nome} ${messages.pop()}`);
        this.fecharDialogClonar();
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
