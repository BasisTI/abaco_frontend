import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Manual } from '../model/manual.model';
import { ManualService } from '../manual.service';
import { EsforcoFaseService } from '../../esforco-fase/esforco-fase.service';
import { EsforcoFase } from '../../esforco-fase/esforco-fase.model';
import { FaseService, Fase } from '../../fase';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FatorAjuste, TipoFatorAjuste } from '../model/fator-ajuste.model';
import { PageNotificationService } from '../../shared/page-notification.service';
import { UploadService } from '../../upload/upload.service';
import { FileUpload } from 'primeng/primeng';
import { SelectItem } from 'primeng/api';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jhi-manual-form',
    templateUrl: './manual-form.component.html',
})
export class ManualFormComponent implements OnInit, OnDestroy {
    manual: Manual;
    isSaving;
    isEdit; newUpload; validaTipoFase; validaNomeDeflator; validaTipoDeflator; validaDeflator: boolean;
    private routeSub: Subscription;
    arquivoManual: File;
    esforcoFases: Array<EsforcoFase>;
    showDialogEsforcoFase = false;
    showDialogFatorAjuste = false;
    fases: Fase[] = [];
    percentual: number;
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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private manualService: ManualService,
        private esforcoFaseService: EsforcoFaseService,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private uploadService: UploadService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    showTranslatedMessage(message: string, callback: (params: string) => void) {
        this.translate.get(message).subscribe(translated => callback(translated));
    }

    ngOnInit() {
        this.traduzirClassificacoes();
        this.newUpload = false;
        this.isSaving = false;
        this.routeSub = this.route.params.subscribe(params => {
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

    deleteEsforcoFase() {
        this.manual.deleteEsforcoFase(this.selectedEsforcoFase);
    }

    save() {
        if (!this.checkRequiredFields()) {
            this.showTranslatedMessage('Global.Mensagens.FavorPreencherCamposObrigatorios', this.pageNotificationService.addErrorMsg)
            return;
        }

        this.persist();
    }

    private persist() {
        const oldId = this.manual.arquivoManualId;
        // this.manual.esforcoFases.forEach(es => es.fase = es.fase['id']);
        if (this.checkRequiredFields()) {
            if (this.newUpload) {
                if (oldId) {
                    this.uploadService.deleteFile(oldId);
                }
                this.isEdit = true;
                this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
                    this.manual.arquivoManualId = response.id;
                    this.subscribeToSaveResponse(this.manualService.save(this.manual));
                });
            } else {
                this.subscribeToSaveResponse(this.manualService.save(this.manual));
            }
        } else {
            this.privateExibirMensagemCamposInvalidos(1);
        }
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
        this.invalidFields = [];

        if (!this.manual.valorVariacaoEstimada || this.manual.valorVariacaoEstimada === undefined) {
            this.pushRequiredField('Cadastros.Manual.ValorVariacaoEstimada', this.invalidFields);
        }

        if (!this.manual.valorVariacaoIndicativa || this.manual.valorVariacaoIndicativa === undefined) {
            this.pushRequiredField('Cadastros.Manual.ValorVariacaoIndicativa', this.invalidFields);
        }

        if (!this.manual.nome || this.manual.nome === undefined) {
            this.pushRequiredField('Cadastros.Manual.Nome', this.invalidFields);
        }

        if (!this.manual.parametroInclusao || this.manual.parametroInclusao === undefined) {
            this.pushRequiredField('Cadastros.Manual.Inclusao', this.invalidFields);
        }

        if (!this.manual.parametroAlteracao || this.manual.parametroAlteracao === undefined) {
            this.pushRequiredField('Cadastros.Manual.Alteracao', this.invalidFields);
        }

        if (!this.manual.parametroExclusao || this.manual.parametroExclusao === undefined) {
            this.pushRequiredField('Cadastros.Manual.Exclusao', this.invalidFields);
        }

        if (!this.manual.parametroConversao || this.manual.parametroConversao === undefined) {
            this.pushRequiredField('Cadastros.Manual.Conversao', this.invalidFields);
        }

        if (this.manual.esforcoFases.length === 0 || this.manual.esforcoFases === undefined) {
            this.pushRequiredField('Cadastros.Manual.EsforcoFases', this.invalidFields);
        }

        if (this.manual.fatoresAjuste.length === 0 || this.manual.fatoresAjuste === undefined) {
            this.pushRequiredField('Cadastros.Manual.Deflator', this.invalidFields);
        }

        return this.invalidFields.length === 0;
    }

    private pushRequiredField(field: string, invalidFields: string[]) {
        this.translate.get(field).subscribe(translated => invalidFields.push(translated));
    }

    privateExibirMensagemCamposInvalidos(codErro: number) {
        switch (codErro) {
            case 1:
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgCamposInvalidos') + this.getInvalidFieldsString());
                this.invalidFields = [];
                return;
            case 2:
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgCampoArquivoManualEstaInvalido'));
                return;
        }
    }

    private getInvalidFieldsString(): string {
        let invalidFieldsString = '';

        if (this.invalidFields) {
            this.invalidFields.forEach(invalidField => {
                if (invalidField === this.invalidFields[this.invalidFields.length - 1]) {
                    invalidFieldsString = invalidFieldsString + invalidField;
                } else {
                    invalidFieldsString = invalidFieldsString + invalidField + ', ';
                }
            });
        }

        return invalidFieldsString;
    }

    private subscribeToSaveResponse(result: Observable<Manual>) {
        result.subscribe((res: Manual) => {
            this.isSaving = false;
            this.router.navigate(['/manual']);
            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
        },
            (error: Response) => {
                this.isSaving = false;

                if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.manualexists') {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgJaExisteUmManualRegistradoComEsteNome'));
                    document.getElementById('nome_manual').setAttribute('style', 'border-color: red;');
                }
            });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
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

    deleteFatorAjuste() {
        this.manual.deleteFatoresAjuste(this.selectedFatorAjuste);
        this.selectedFatorAjuste = null;
    }

    isPercentualEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'PERCENTUAL') : (false);
    }

    isUnitaryEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'UNITARIO') : (false);
    }

    confirmDeletePhaseEffort() {
        this.confirmationService.confirm({
            message: this.getLabel('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirEsforcoPorFase')
                + this.fases.find(fase => fase == this.selectedEsforcoFase.fase)
                + '?',
            accept: () => {
                this.manual.deleteEsforcoFase(this.selectedEsforcoFase);
                this.pageNotificationService.addDeleteMsg();
                this.selectedEsforcoFase = new EsforcoFase();
            }
        });
    }

    confirmDeleteAdjustFactor() {
        this.confirmationService.confirm({
            message: this.getLabel('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirFatorAjuste') + this.fatorAjuste.nome + '?',
            accept: () => {
                this.manual.deleteFatoresAjuste(this.fatorAjuste);
                this.pageNotificationService.addDeleteMsg();
                this.fatorAjuste = new FatorAjuste();
            }
        });
    }

    openDialogPhaseEffort() {
        this.esforcoFase = new EsforcoFase();
        this.showDialogEsforcoFase = true;
    }

    editPhaseEffort() {
        if (this.verificaCamposEsforcoFase(this.selectedEsforcoFase)) {
            this.manual.updateEsforcoFases(this.selectedEsforcoFase);
            //            this.pageNotificationService.addUpdateMsg();
            this.selectedEsforcoFase = new EsforcoFase();
            this.showDialogFatorAjuste = false;
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    editAdjustFactor() {
        if (this.verificarCamposFatorAjuste(this.fatorAjuste)) {
            this.manual.updateFatoresAjuste(this.fatorAjuste);
            this.pageNotificationService.addUpdateMsg();
            this.closeDialogFatorAjuste();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    private verificaCamposEsforcoFase(esforcoFase: EsforcoFase): boolean {
        return (esforcoFase.fase || esforcoFase.esforco || esforcoFase.fase) ? true : false;
    }

    getPhaseEffortTotalPercentual() {
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
            this.pageNotificationService.addCreateMsg(this.getLabel('Cadastros.Manual.Mensagens.msgDeflatorIncluidoComSucesso'));
            form.reset();
            this.closeDialogFatorAjuste();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
        this.isEditFatorAjuste = false;
        this.fatorAjuste = new FatorAjuste();
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

    public habilitarDeflator(): boolean {
        if (this.fatorAjuste.tipoAjuste !== undefined) {
            return false;
        }
        if (this.fatorAjuste.tipoAjuste !== undefined) {
            return false;
        }
        return true;
    }

}
