import { Contrato } from './../models/contrato.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Organizacao } from '../models/organizacao.model';
import { OrganizacaoService } from '../organizacao.service';
import { Manual, ManualService } from '../../manual';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { PageNotificationService } from '../../shared/page-notification.service';
import { UploadService } from '../../upload/upload.service';
import { FileUpload } from 'primeng/primeng';
import { ValidacaoUtil } from '../../util/validacao.util';
import { Upload } from '../../upload/upload.model';
import { ManualContrato } from '../models/ManualContrato.model';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
    selector: 'jhi-organizacao-form',
    templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit {

    organizacao: Organizacao = new Organizacao;
    manuais: Manual[];
    mostrarDialogCadastroContrato = false;
    logo: File;
    upload: Upload;
    manualContrato: ManualContrato = new ManualContrato();
    selectedManualContrato: ManualContrato;
    selectedLine: Contrato;
    contrato: Contrato = new Contrato();

    @BlockUI() blockUI: NgBlockUI;
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

    translateMessage(message: string
        , callback: (translatedMessage: string, id?: number) => void
        , id?: number) {
        this.translate.get(message).subscribe((translatedMessage: string) => {
            callback.call(this, translatedMessage, id);
        });
    }

    translateMultiple(messages: string[], callback: (translatedMessages: string[]) => void) {
        const result = messages.map(message => this.translate.get(message));
        Observable.forkJoin(result).subscribe(messages => callback.call(this, messages));
    }

    ngOnInit() {
        this.manualService.findDropdown().subscribe((manuais: SelectItem[]) => {
            this.manuais = manuais.map(manual => new Manual(manual.value, manual.label));
        });
        this.route.params.subscribe(params => {

            if (params['id']) {
                this.organizacaoService.find(params['id']).subscribe(organizacao => {
                    this.organizacao = organizacao;

                    if (this.organizacao.logoId) {
                        this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
                            this.logo = response.logo;
                        });
                    }

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
        this.translateMultiple(
            ['Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirContrato', 'Cadastros.Organizacao.Mensagens.msgETodasAsSuasFuncionalidades']
            , this.comfirmDeleteMessage);
    }

    comfirmDeleteMessage(translatedMessages: string[]) {
        this.confirmationService.confirm({
            message: `${translatedMessages.pop()} '${this.selectedLine.numeroContrato}' ${translatedMessages.pop()}`,
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

    private doFecharDialogCadastroContrato() {
        this.mostrarDialogCadastroContrato = false;
        this.contrato = new Contrato();
    }

    validaCamposContrato(contrato: Contrato): boolean {
        if (contrato.numeroContrato === null || contrato.numeroContrato === undefined) {
            this.translateMessage('Favor preencher o número do contrato', this.addErrorMessage);
            return false;
        }
        if ((contrato.manuaisContrato === null || contrato.manuaisContrato === undefined)
            || (contrato.manuaisContrato.length <= 0)) {
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
            manualContrato.dataInicioVigencia,
            manualContrato.dataFimVigencia,
            manualContrato.ativo);
        return manualContratoCopy;
    }

    save(form: FormControl) {
        if (this.validarCamposOrganização()) {
            this.persistir();
            form.reset();
        }
    }

    private validarCamposOrganização(): boolean {
        if (!this.organizacao.nome) {
            this.translateMessage('Cadastros.Organizacao.Mensagens.msgCampoNomeObrigatorio', this.addErrorMessage);
            return false;
        }

        if (!this.organizacao.sigla) {
            this.translateMessage('Cadastros.Organizacao.Mensagens.msgCampoSiglaObrigatorio', this.addErrorMessage);
            return false;
        }

        if (!this.organizacao.cnpj) {
            this.translateMessage('Cadastros.Organizacao.Mensagens.msgCampoCNPJObrigatorio', this.addErrorMessage);
            return false;
        }

        if (this.organizacao.cnpj !== ' ') {
            if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
                this.translateMessage('Cadastros.Organizacao.Mensagens.msgCNPJInvalido', this.addErrorMessage);
                return false
            }
        }

        if (this.organizacao.contratos.length === 0 || this.organizacao.contratos === undefined) {
            this.translateMessage('Cadastros.Organizacao.Mensagens.msgPeloMenosUmContratoObrigatorioPorOrganizacao', this.addErrorMessage);
            return false;
        }
        return true;
    }

    persistir() {
        this.translateMessage('Cadastros.Organizacao.Mensagens.msgSalvandoOrganizacao', this.blockUiStart);
        if (this.logo) {
            this.uploadService.uploadLogo(this.logo).subscribe((response: any) => {
                this.organizacao.logoId = response.id;
                this.logo = response.logo;
                this.saveOrganizacao();
            });
        } else {
            this.saveOrganizacao();
        }

    }

    private saveOrganizacao() {
        this.organizacaoService.save(this.organizacao)
        .finally(() => this.blockUI.stop())
        .subscribe(() => {
            this.router.navigate(['/organizacao']);
        });
    }

    blockUiStart(translatedMessage: string) {
        this.blockUI.start(translatedMessage);
    }

    checkIfOrganizacaoAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        if (organizacoesRegistradas) {
            organizacoesRegistradas.forEach(each => {
                if (each.nome.toUpperCase() === this.organizacao.nome.toUpperCase() && each.id !== this.organizacao.id) {
                    isAlreadyRegistered = true;
                    this.translateMessage('Cadastros.Organizacao.Mensagens.msgJaExisteUmaOrganizacaoRegistradaComEsteNome', this.addErrorMessage);
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
                    this.translateMessage('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ', this.addErrorMessage);
                }
            });
        }
        return isAlreadyRegistered;
    }

    fileUpload(event: any) {
        this.logo = event.files[0];
    }
}
