import { Contrato } from './../models/contrato.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Organizacao } from '../models/organizacao.model';
import { OrganizacaoService } from '../organizacao.service';
import { Manual, ManualService } from '../../manual';
import { ResponseWrapper } from '../../shared';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { DatatableClickEvent } from '@basis/angular-components';
import { environment } from '../../../environments/environment';
import { PageNotificationService } from '../../shared/page-notification.service';
import { UploadService } from '../../upload/upload.service';
import { FileUpload } from 'primeng/primeng';
import { ValidacaoUtil } from '../../util/validacao.util';
import { Upload } from '../../upload/upload.model';
import { ManualContrato } from '../models/ManualContrato.model';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-organizacao-form',
    templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;

    organizacao: Organizacao;
    isSaving;
    manualInvalido;
    numeroContratoInvalido;
    isEdit;
    validaNumeroContrato;
    validaManual;
    validaDataInicio;
    validaDataFinal;
    validaDiasGarantia: boolean;
    showDialogContrato = false;
    cnpjValido: boolean;
    manuais: Manual[];
    uploadUrl = environment.apiUrl + '/upload';
    mostrarDialogCadastroContrato = false;
    mostrarDialogEdicaoContrato = false;
    logo: File;
    newLogo: File;
    invalidFields: Array<string> = [];
    imageUrl: any;
    upload: Upload;
    alterouLogo: boolean;
    manuaisAdicionados: ManualContrato[] = [];
    novoManual: Manual;
    inicioVigencia;
    fimVigencia;
    manualInicioVigencia: Date;
    manualFimVigencia: Date;
    garantia: Number;
    ativo;
    manualAtivo: boolean;
    manualContrato: ManualContrato = new ManualContrato();
    indiceManual: number;
    manuaisEdt: SelectItem[] = [];
    manualEdt: Manual;

    selectedManualContrato: ManualContrato;
    selectedLine: Contrato;
    contrato: Contrato = new Contrato();

    @ViewChild('fileInput') fileInput: FileUpload;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private organizacaoService: OrganizacaoService,
        private manualService: ManualService,
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

    translateMessage(message: string
        , callback: (translatedMessage: string, id?: number) => void
        , id?: number) {
        this.translate.get(message).subscribe((translatedMessage: string) => {
            callback.call(this, translatedMessage, id);
        });
    }

    /**
     *
     * */
    ngOnInit() {
        this.isEdit = false;
        this.cnpjValido = false;
        this.isSaving = false;
        this.manualService.findDropdown().subscribe((manuais: SelectItem[]) => {
            this.manuais = manuais.map(manual => new Manual(manual.value, manual.label));
        });
        this.routeSub = this.route.params.subscribe(params => {
            this.organizacao = new Organizacao();
            if (params['id']) {

                this.organizacaoService.find(params['id']).subscribe(organizacao => {
                    this.organizacao = organizacao;
                    if (this.organizacao.logoId != undefined && this.organizacao.logoId != null)
                        this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
                            this.logo = response.logo;
                        });
                    // this.getFile();
                });
            }
        });
        this.organizacao.ativo = true;
    }

    abrirDialog() {
        this.mostrarDialogCadastroContrato = true;
        this.contrato = new Contrato();
        this.manualContrato = new ManualContrato();
        this.contrato.ativo = true;
    }

    abrirEditar() {
        this.mostrarDialogCadastroContrato = true;
        this.contrato = this.selectedLine;
    }

    confirmDelete() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirContrato')} '${this.selectedLine.numeroContrato}'
            ${this.getLabel('Cadastros.Organizacao.Mensagens.msgETodasAsSuasFuncionalidades')}`,
            accept: () => {
                this.organizacao.deleteContrato(this.selectedLine);
                this.selectedLine = new Contrato();
            }
        });
    }

    fecharDialog(contratoForm: FormControl) {
        this.mostrarDialogCadastroContrato = false;
        this.contrato = new Contrato();
        this.manualContrato = new ManualContrato();
        contratoForm.reset();
    }

    editManual() {
        this.manualContrato = this.selectedManualContrato.clone();
    }

    deleteManual() {
        this.contrato.deleteManualContrato(this.selectedManualContrato);
        this.selectedManualContrato = new ManualContrato();
    }

    /**
     *
     * */
    validarManual() {
        this.manualInvalido = false;
        this.numeroContratoInvalido = false;
    }

    validarDataInicio() {
        if (!this.contrato.dataInicioValida()) {
            this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
            // document.getElementById('login').setAttribute('style', 'border-color: red;');
        }
    }


    private doFecharDialogCadastroContrato() {
        this.mostrarDialogCadastroContrato = false;
        this.contrato = new Contrato();
    }

    validaCamposContrato(contrato: Contrato): boolean {
        if (contrato.numeroContrato === null || contrato.numeroContrato === undefined) {
            this.numeroContratoInvalido = true;
            this.translateMessage('Favor preencher o número do contrato', this.addErrorMessage);
            return false;
        }
        if ((contrato.manualContrato === null || contrato.manualContrato === undefined)
            || (contrato.manualContrato.length <= 0)) {
            this.manualInvalido = true;
            this.translateMessage('Deve haver ao menos um manual', this.addErrorMessage);
            return false;
        }
        if (!(contrato.dataInicioValida()) && (contrato.dataInicioVigencia != null
            || contrato.dataInicioVigencia !== undefined)
            && (contrato.dataFimVigencia != null || contrato.dataFimVigencia !== undefined)) {
            this.translateMessage('A data de início da vigência não pode ser posterior à data de término da vigência!', this.addErrorMessage);
            return false;
        }
        if (contrato.dataInicioVigencia === null || contrato.dataInicioVigencia === undefined) {
            this.translateMessage('Preencher data de início da vigência', this.addErrorMessage);
            return false;
        }
        if (contrato.dataFimVigencia === null || contrato.dataFimVigencia === undefined) {
            this.translateMessage('Preencher data de fim da vigência', this.addErrorMessage);
            return false;
        }
        if (contrato.diasDeGarantia === null || contrato.diasDeGarantia === undefined) {
            this.translateMessage('Preencher Dias de Garantia!', this.addErrorMessage);
            return false;
        }

        return true;
    }

    addErrorMessage(translatedMessage: string) {
        this.pageNotificationService.addErrorMsg(translatedMessage);
    }

    adicionarContrato(contratoForm: FormControl) {
        const contratoTemp = this.contrato.clone();
        if (this.validaCamposContrato(contratoTemp)) {
            this.organizacao.persistContrato(contratoTemp);
            this.doFecharDialogCadastroContrato();
            this.contrato = new Contrato();
            contratoForm.reset();
        }
    }

    validaDadosManual(manualContratoTemp: ManualContrato) {
        if (manualContratoTemp.ativo === undefined || manualContratoTemp.ativo === null) {
            this.translateMessage('Cadastros.Contratos.Mensagens.ManualAtivo', this.addErrorMessage);
            return false;
        }
        if (manualContratoTemp.dataFimVigencia === undefined || manualContratoTemp.dataFimVigencia === null) {
            this.translateMessage('Cadastros.Contratos.Mensagens.DataFimVigencia', this.addErrorMessage);
            return false;
        }
        if (manualContratoTemp.dataInicioVigencia === undefined || manualContratoTemp.dataInicioVigencia === null) {
            this.translateMessage('Cadastros.Contratos.Mensagens.DataInicioVigencia', this.addErrorMessage);
            return false;
        }

        if (manualContratoTemp.dataInicioVigencia.getTime() > manualContratoTemp.dataFimVigencia.getTime()) {
            this.translateMessage('Cadastros.Contratos.Mensagens.InicioVigenciaNaoPosteriorFinalVigencia', this.addErrorMessage);
            return false;
        }

        if (manualContratoTemp.manual === undefined || manualContratoTemp.manual === null) {
            this.translateMessage('Cadastros.Contratos.Mensagens.SelecioneManual', this.addErrorMessage);
            return false;
        }
        return true;
    }

    adicionarManual(form: FormControl) {
        if (this.validaDadosManual(this.manualContrato)) {
            if (this.manualContrato.artificialId) {
                const manualContratoTemp = this.manualContrato.clone();
                this.contrato.updateManualContrato(manualContratoTemp);
            } else {
                const manualContratoTemp = this.buildManualContrato(this.manualContrato);
                this.contrato.addManualContrato(manualContratoTemp);
            }
            this.manualContrato = new ManualContrato();
            form.reset();
        }
    }

    buildManualContrato(manualContrato: ManualContrato): ManualContrato {
        let manualContratoCopy = new ManualContrato(
            null,
            null,
            manualContrato.manual,
            null,
            manualContrato.dataInicioVigencia,
            manualContrato.dataFimVigencia,
            manualContrato.ativo);
        return manualContratoCopy;
    }

    abrirDialogEditarContrato() {
        this.mostrarDialogEdicaoContrato = true;
    }

    /**
     *
     * */
    fecharDialogEditarContrato() {
        this.contrato = new Contrato();
        this.mostrarDialogEdicaoContrato = false;
    }

    /**
     *
     * */
    editarContrato() {
        if (!this.manualContrato.id === undefined
            && (this.manualContrato.manual !== undefined && this.manualContrato.manual !== null)
        ) {
            this.contrato.addManualContrato(this.manualContrato.clone());
        } else if (this.manualContrato.manual !== undefined && this.manualContrato.manual !== null) {
            this.contrato.updateManualContrato(this.manualContrato);
        }
        if (this.validaCamposContrato(this.contrato)) {
            this.manualContrato = new ManualContrato();
            this.organizacao.updateContrato(this.contrato);
            this.fecharDialogEditarContrato();
            this.contrato.diasDeGarantia = undefined;
        }
    }

    comfirmarExcluirManual() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirManual')} ${this.manualContrato.manual.nome}'
        ?`,
            accept: () => {
                this.contrato.deleteManualContrato(this.manualContrato);
                this.manualContrato = new ManualContrato();
            }
        });
    }

    comfirmarExcluirManualNovo() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirManual')} ${this.manualContrato.manual.nome}'
        ?`,
            accept: () => {
                this.contrato.deleteManualContrato(this.manualContrato);
                this.manualContrato = new ManualContrato();
            }
        });
    }

    /**
     *
     * */
    save(form) {
        this.cnpjValido = false;
        if (!this.organizacao.nome) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNomeObrigatorio'));
            return;
        }

        if (!this.organizacao.sigla) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoSiglaObrigatorio'));
            return;
        }

        this.isSaving = true;
        if (!this.organizacao.cnpj) {
            this.cnpjValido = true;
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoCNPJObrigatorio'));
            return;
        }

        if (this.organizacao.cnpj !== ' ') {
            if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
                this.cnpjValido = true;
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCNPJInvalido'));
                return;
            }
        }

        if (this.organizacao.contracts.length === 0 || this.organizacao.contracts === undefined) {
            document.getElementById('tabela-contrato').setAttribute('style', 'border: 1px dotted red;');
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgPeloMenosUmContratoObrigatorioPorOrganizacao'));
            return;
        }

        this.organizacaoService.dropDown().subscribe(response => {
            const todasOrganizacoes = response;
            if (!this.checkIfOrganizacaoAlreadyExists(todasOrganizacoes.json)
                && !this.checkIfCnpjAlreadyExists(todasOrganizacoes.json)) {

                if (this.organizacao.id !== undefined) {
                    this.editar();
                } else {
                    this.novo();
                }
            }
        });
    }

    mudouLogo(imagem: File): boolean {
        this.alterouLogo = this.logo != imagem;
        return this.alterouLogo;
    }

    editar() {
        this.organizacaoService.find(this.organizacao.id).subscribe(response => {
            if (this.alterouLogo) {
                this.uploadService.uploadLogo(this.newLogo).subscribe((response: any) => {
                    this.organizacao.logoId = response.id;
                    this.logo = response.logo;
                    this.isEdit = true;
                    this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
                });

                this.uploadService.saveFile(this.newLogo).subscribe(response => {
                });
            } else {
                this.isEdit = true;
                this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
            }
        });
    }

    novo() {
        if (this.newLogo !== undefined && this.newLogo != null) {
            this.uploadService.uploadLogo(this.newLogo).subscribe((response: any) => {
                this.organizacao.logoId = response.id;
                this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
            });
        } else {
            this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
        }
    }

    checkIfOrganizacaoAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        if (organizacoesRegistradas) {
            organizacoesRegistradas.forEach(each => {
                if (each.nome.toUpperCase() === this.organizacao.nome.toUpperCase() && each.id !== this.organizacao.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteUmaOrganizacaoRegistradaComEsteNome'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    checkIfCnpjAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        if (organizacoesRegistradas) {
            organizacoesRegistradas.forEach(each => {
                if (each.cnpj === this.organizacao.cnpj && each.id !== this.organizacao.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    /**
     * Método responsável por recuperar as organizações pelo id.
     * */
    private recupeprarOrganizacoes(id: number): Observable<Organizacao> {
        return this.organizacaoService.find(id);
    }

    /**
     *
     * */
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

    /**
     *
     * */
    private subscribeToSaveResponse(result: Observable<any>) {
        result.subscribe((res: Organizacao) => {
            this.isSaving = false;
            this.router.navigate(['/organizacao']);

            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
        }, (error: Response) => {
            this.isSaving = false;
            if (error.status === 400) {
                const errorType: string = error.headers.toJSON()['x-abacoapp-error'][0];

                switch (errorType) {
                    case 'error.orgNomeInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNomePossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioNoFinalOuMaisDeUmEspacoEntrePalavras'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgCnpjInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoCNPJPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgSiglaInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoSiglaPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgNumOcorInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNumeroDaOcorrenciaPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.organizacaoexists': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoCadastradaComMesmoNome'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.cnpjexists': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoCadastradaComMesmoCNPJ'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.beggindateGTenddate': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgInicioVigenciaNaoPodeSerPosteriorFinalVigencia'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                }
                let invalidFieldNamesString = '';
                const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCamposInvalidos') + invalidFieldNamesString);
            }
        });
    }

    /**
     *
     * */
    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    /**
     *Método de upload de foto
     * */
    fileUpload(event: any) {
        const imagem = event.files[0];
        if (this.mudouLogo(imagem)) {
            this.newLogo = imagem;
        }
    }

    /**
     *
     * */


    /**
     *
     * */
    getFileInfo() {
        return this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {
            return response;
        });
    }

    fecharContrato(editForm1) {
        this.contrato = new Contrato();
        this.showDialogContrato = false;
        this.validaNumeroContrato = false;
        this.validaManual = false;
        this.validaDataInicio = false;
        this.validaDataFinal = false;
        this.validaDiasGarantia = false;
    }
}
