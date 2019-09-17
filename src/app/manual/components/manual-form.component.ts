import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Manual } from '../model/manual.model';
import { ManualService } from '../manual.service';
import { EsforcoFase } from '../../esforco-fase/esforco-fase.model';
import { FaseService, Fase } from '../../fase';
import { ConfirmationService } from 'primeng/primeng';
import { FatorAjuste, TipoFatorAjuste } from '../model/fator-ajuste.model';
import { PageNotificationService } from '../../shared/page-notification.service';
import { UploadService } from '../../upload/upload.service';
import { FileUpload } from 'primeng/primeng';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'jhi-manual-form',
    templateUrl: './manual-form.component.html',
})
export class ManualFormComponent implements OnInit {
    manual: Manual;
    isEdit; newUpload: boolean;
    arquivoManual: File;
    showDialogEsforcoFase = false;
    showDialogFatorAjuste = false;
    fases: Fase[] = [];
    esforcoFase: EsforcoFase = new EsforcoFase();
    selectedEsforcoFase: EsforcoFase;
    fatorAjuste: FatorAjuste = new FatorAjuste();
    selectedFatorAjuste: FatorAjuste;

    isEditFatorAjuste = false;

    tiposAjuste: Array<any> = [
        { label: 'Percentual', value: 'PERCENTUAL' },
        { label: 'Unitário', value: 'UNITARIO' }
    ];

    invalidFields: Array<string> = [];

    @ViewChild('fileInput') fileInput: FileUpload;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private manualService: ManualService,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private uploadService: UploadService,
        private translate: TranslateService
    ) {
    }

    translateMessage(message: string
        , callback: (translatedMessage: string, id?: number) => void
        , id?: number) {
        this.translate.get(message).subscribe((translatedMessage: string) => {
            callback.call(this, translatedMessage, id);
        });
    }

    ngOnInit() {
        this.traduzirClassificacoes();
        this.newUpload = false;
        this.route.params.subscribe(params => {
            this.manual = new Manual();
            this.manual.fatoresAjuste = [];
            this.manual.esforcoFases = [];
            if (params['id']) {
                this.manualService.find(params['id']).subscribe((manual: Manual) => {
                    this.manual = manual;
                    this.isEdit = true;
                    if (this.manual.arquivoManualId) {
                        this.getFile();
                    }
                });
            }
        });

        this.tipoFaseService.findDropdown().subscribe((fases) => this.fases = fases);
        this.manual.versaoCPM = 431;
    }

    editEsforcoFase() {
        this.esforcoFase = this.selectedEsforcoFase;
        this.showDialogEsforcoFase = true;
    }

    save() {
        if (!this.checkRequiredFields()) {
            this.translateMessage('Global.Mensagens.FavorPreencherCamposObrigatorios', this.addErrorMenssage)
            return;
        }

        this.persist();
    }

    private persist() {
        const oldId = this.manual.arquivoManualId;
        this.translateMessage('Cadastros.Manual.Mensagens.Criando_Manual', this.startBlockUI);
        if (this.newUpload) {
            if (oldId) {
                this.uploadService.deleteFile(oldId);
            }
            this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
                this.manual.arquivoManualId = response.id;
                this.manualService.save(this.manual)
                    .finally(() => this.blockUI.stop())
                    .subscribe(() => {
                        this.router.navigate(['/manual']);
                        this.pageNotificationService.addUpdateMsg();
                    });
            });
        } else {
            this.manualService.save(this.manual)
                .finally(() => this.blockUI.stop())
                .subscribe(() => {
                    this.router.navigate(['/manual']);
                    this.pageNotificationService.addCreateMsg()
                });
        }
    }

    startBlockUI(translatedMessage: string) {
        this.blockUI.start(translatedMessage);
    }

    traduzirClassificacoes() {
        this.translate.stream(['Cadastros.Manual.Percentual', 'Cadastros.Manual.Unitario']).subscribe((traducao) => {
            this.tiposAjuste = [
                { label: traducao['Cadastros.Manual.Percentual'], value: 'PERCENTUAL' },
                { label: traducao['Cadastros.Manual.Unitario'], value: 'UNITARIO' },
            ];
        })
    }

    private checkRequiredFields(): boolean {

        if (!this.manual.valorVariacaoEstimada || this.manual.valorVariacaoEstimada === undefined) {
            return false;
        }

        if (!this.manual.valorVariacaoIndicativa || this.manual.valorVariacaoIndicativa === undefined) {
            return false;
        }

        if (!this.manual.nome || this.manual.nome === undefined) {
            return false;
        }

        if (!this.manual.parametroInclusao || this.manual.parametroInclusao === undefined) {
            return false;
        }

        if (!this.manual.parametroAlteracao || this.manual.parametroAlteracao === undefined) {
            return false;
        }

        if (!this.manual.parametroExclusao || this.manual.parametroExclusao === undefined) {
            return false;
        }

        if (!this.manual.parametroConversao || this.manual.parametroConversao === undefined) {
            return false;
        }

        if (this.manual.esforcoFases.length === 0 || this.manual.esforcoFases === undefined) {
            return false;
        }

        if (this.manual.fatoresAjuste.length === 0 || this.manual.fatoresAjuste === undefined) {
            return false;
        }

        return true;
    }

    private addErrorMenssage(message: string) {
        this.pageNotificationService.addErrorMsg(message);
    }

    uploadFile(event: any) {
        this.arquivoManual = event.files[0];
        this.newUpload = true;
    }

    selectEsforcoFase(selectedLine) {
        this.selectedEsforcoFase = selectedLine;
    }

    unselectEsforcoFase() {
        this.selectedEsforcoFase = null;
    }

    selectFatorAjuste(selectedLine) {
        console.log(selectedLine);
    }

    editFatorAjuste() {
        this.fatorAjuste = this.selectedFatorAjuste;
        this.isEditFatorAjuste = true;
        this.showDialogFatorAjuste = true;
    }

    isPercentualEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'PERCENTUAL') : (false);
    }

    isUnitaryEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'UNITARIO') : (false);
    }

    deleteEsforcoFase() {
        this.translateMessage('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirEsforcoPorFase', this.confirmeMessageDeleteEsforcoFase);
    }

    confirmeMessageDeleteEsforcoFase(message: string) {
        const fase = this.fases.find(fase => fase.id == this.selectedEsforcoFase.fase.id);
        this.confirmationService.confirm({
            message: `${message} ${fase.nome}?`,
            accept: () => {
                this.manual.deleteEsforcoFase(this.selectedEsforcoFase);
                this.selectedEsforcoFase = null;
            }
        });
    }

    deleteFatorAjuste() {
        this.translateMessage('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirFatorAjuste', this.confirmMessageDeleteFatorAjuste);
    }

    confirmMessageDeleteFatorAjuste(translated: string) {
        this.confirmationService.confirm({
            message: `${translated} ${this.selectedFatorAjuste.nome}?`,
            accept: () => {
                this.manual.deleteFatoresAjuste(this.selectedFatorAjuste);
                this.selectedFatorAjuste = null;
            }
        });
    }

    openDialogEsforcoFase() {
        this.esforcoFase = new EsforcoFase();
        this.showDialogEsforcoFase = true;
    }

    closeDialogEsforcoFase() {
        this.esforcoFase = new EsforcoFase();
        this.showDialogEsforcoFase = false;
    }

    addEsforcoFase(form: FormControl) {
        const esforcoFase = this.esforcoFase.clone();
        if (this.verificaCamposEsforcoFase(esforcoFase)) {
            this.manual.persistEsforcoFase(esforcoFase);
            this.pageNotificationService.addCreateMsg();
            form.reset();
            this.closeDialogEsforcoFase();
        } else {
            this.translateMessage('Global.Mensagens.FavorPreencherCamposObrigatorios', this.addErrorMenssage)
        }
    }

    private verificaCamposEsforcoFase(esforcoFase: EsforcoFase): boolean {
        return (esforcoFase.fase || esforcoFase.esforco || esforcoFase.fase) ? true : false;
    }

    getEsforcoEsforcoFasePercentual() {
        let total = 0;
        if (this.manual.esforcoFases) {
            this.manual.esforcoFases.forEach(each => {
                (each.esforco !== undefined) ? (total = total + each.esforcoFormatado) : (total = total);
            });
        }

        return total + '%';
    }

    openDialogFatorAjuste() {
        this.fatorAjuste = new FatorAjuste();
        this.showDialogFatorAjuste = true;
    }

    closeDialogFatorAjuste() {
        this.fatorAjuste = new FatorAjuste();
        this.showDialogFatorAjuste = false;
    }

    addFatorAjuste(form: FormControl) {
        this.fatorAjuste.ativo = true;
        const fatorAjuste = this.fatorAjuste.clone();
        if (this.verificarCamposFatorAjuste(fatorAjuste)) {
            this.manual.persistFatoresAjuste(fatorAjuste);
            this.translateMessage('Cadastros.Manual.Mensagens.msgDeflatorIncluidoComSucesso', this.addCreateMessage);
            form.reset();
            this.closeDialogFatorAjuste();
        } else {
            this.translateMessage('Global.Mensagens.FavorPreencherCamposObrigatorios', this.addErrorMenssage)
        }
        this.isEditFatorAjuste = false;
        this.fatorAjuste = new FatorAjuste();
    }

    addCreateMessage(translated: string) {
        this.pageNotificationService.addCreateMsg(translated);
    }

    private verificarCamposFatorAjuste(fatorAjuste: FatorAjuste): boolean {
        return (fatorAjuste || fatorAjuste.nome || fatorAjuste.tipoAjuste || fatorAjuste.fator) ? true : false;
    }

    getFile() {
        this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {
            this.arquivoManual = response;
        });
    }

    getFileInfo() {
        return this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {
            return response;
        });
    }

    habilitarDeflator(): boolean {
        if (this.fatorAjuste.tipoAjuste !== undefined) {
            return false;
        }
        if (this.fatorAjuste.tipoAjuste !== undefined) {
            return false;
        }
        return true;
    }

}
