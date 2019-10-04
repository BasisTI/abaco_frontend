import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FileUpload, SelectItem } from 'primeng/primeng';
import { Manual, ManualService } from '../../manual';
import { PageNotificationService } from '../../shared/page-notification.service';
import { Upload } from '../../upload/upload.model';
import { UploadService } from '../../upload/upload.service';
import { ValidacaoUtil } from '../../util/validacao.util';
import { ManualContrato } from '../models/ManualContrato.model';
import { Organizacao } from '../models/organizacao.model';
import { OrganizacaoService } from '../organizacao.service';
import { Contrato } from './../models/contrato.model';
import { translateMessage, translateMultiple } from '../../util/translateUtils';


@Component({
    selector: 'jhi-organizacao-form',
    templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit {

    organizacao: Organizacao = new Organizacao;
    manuais: Manual[] = [];
    mostrarDialogCadastroContrato = false;
    logo: File;
    upload: Upload;
    manualContrato: ManualContrato = new ManualContrato();
    selectedManualContrato: ManualContrato;
    selectedLine: Contrato = new Contrato;
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
        translateMultiple.call(this,
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
            translateMessage.call(this, 'Favor preencher o número do contrato', this.addErrorMessage);
            return false;
        }
        if ((contrato.manuaisContrato === null || contrato.manuaisContrato === undefined)
            || (contrato.manuaisContrato.length <= 0)) {
            translateMessage.call(this, 'Deve haver ao menos um manual', this.addErrorMessage);
            return false;
        }
        if (!(contrato.dataInicioValida()) && (contrato.dataInicioVigencia != null
            || contrato.dataInicioVigencia !== undefined)
            && (contrato.dataFimVigencia != null || contrato.dataFimVigencia !== undefined)) {
            translateMessage.call(this, 'A data de início da vigência não pode ser posterior à data de término da vigência!', this.addErrorMessage);
            return false;
        }
        if (contrato.dataInicioVigencia === null || contrato.dataInicioVigencia === undefined) {
            translateMessage.call(this, 'Preencher data de início da vigência', this.addErrorMessage);
            return false;
        }
        if (contrato.dataFimVigencia === null || contrato.dataFimVigencia === undefined) {
            translateMessage.call(this, 'Preencher data de fim da vigência', this.addErrorMessage);
            return false;
        }
        if (contrato.diasDeGarantia === null || contrato.diasDeGarantia === undefined) {
            translateMessage.call(this, 'Preencher Dias de Garantia!', this.addErrorMessage);
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
            translateMessage.call(this, 'Cadastros.Contratos.Mensagens.ManualAtivo', this.addErrorMessage);
            return false;
        }
        if (manualContratoTemp.dataFimVigencia === undefined || manualContratoTemp.dataFimVigencia === null) {
            translateMessage.call(this, 'Cadastros.Contratos.Mensagens.DataFimVigencia', this.addErrorMessage);
            return false;
        }
        if (manualContratoTemp.dataInicioVigencia === undefined || manualContratoTemp.dataInicioVigencia === null) {
            translateMessage.call(this, 'Cadastros.Contratos.Mensagens.DataInicioVigencia', this.addErrorMessage);
            return false;
        }

        if (manualContratoTemp.dataInicioVigencia.getTime() > manualContratoTemp.dataFimVigencia.getTime()) {
            translateMessage.call(this, 'Cadastros.Contratos.Mensagens.InicioVigenciaNaoPosteriorFinalVigencia', this.addErrorMessage);
            return false;
        }

        if (manualContratoTemp.manual === undefined || manualContratoTemp.manual === null) {
            translateMessage.call(this, 'Cadastros.Contratos.Mensagens.SelecioneManual', this.addErrorMessage);
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

    save(form: FormGroup) {
        if (this.validarCamposOrganização(form)) {
            if (this.persistir()) {
                form.reset();
            }
        }
    }

    private validarCamposOrganização(form: FormGroup): boolean {
        Object.keys(form.controls).forEach(field => form.get(field).markAsTouched({ onlySelf: true }) );

        let validArrays = true;

        validArrays = Object.keys(this.organizacao).some(propName => {
            const prop = this.organizacao[propName];
            if (prop instanceof Array && !prop.length) {
                return true;
            } 
        });

        return form.valid && !validArrays;

    }

    persistir(): boolean {
        translateMessage.call(this, 'Cadastros.Organizacao.Mensagens.msgSalvandoOrganizacao', this.blockUiStart);
        if (this.logo) {
            this.uploadService.uploadLogo(this.logo).subscribe((response: any) => {
                this.organizacao.logoId = response.id;
                this.logo = response.logo;
                this.saveOrganizacao();
                return true;
            });
        } else {
            this.saveOrganizacao();
            return true;
        }

        return false;
    }

    private saveOrganizacao() {
        this.organizacaoService.save(this.organizacao)
            .finally(() => this.blockUI.stop())
            .subscribe(() => {
                this.router.navigate(['/organizacao']);
                this.pageNotificationService.addCreateMsg();
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
                    translateMessage.call(this, 'Cadastros.Organizacao.Mensagens.msgJaExisteUmaOrganizacaoRegistradaComEsteNome', this.addErrorMessage);
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
                    translateMessage.call(this, 'Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ', this.addErrorMessage);
                }
            });
        }
        return isAlreadyRegistered;
    }

    fileUpload(event: any) {
        this.logo = event.files[0];
    }
}
