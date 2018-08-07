import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { Contrato, ContratoService } from '../contrato';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { DatatableClickEvent } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { PageNotificationService } from '../shared/page-notification.service';
import { UploadService } from '../upload/upload.service';
import {FileUpload} from 'primeng/primeng';
import {NgxMaskModule} from 'ngx-mask';
import { ValidacaoUtil } from '../util/validacao.util'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-organizacao-form',
  templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;

  contratos: Contrato[] = [];
  organizacao: Organizacao;
  isSaving; manualInvalido: boolean;
  cnpjValido: boolean;
  manuais: Manual[];
  uploadUrl = environment.apiUrl + '/upload';
  mostrarDialogCadastroContrato = false;
  mostrarDialogEdicaoContrato = false;
  novoContrato: Contrato = new Contrato();
  logo: File;
  contratoEmEdicao: Contrato = new Contrato();
  invalidFields: Array<string> = [];
  imageUrl: any;

  @ViewChild('fileInput') fileInput: FileUpload;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private manualService: ManualService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private uploadService: UploadService
  ) { }

  /**
   *
   * */
  ngOnInit() {
    this.cnpjValido = false;
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.organizacao = new Organizacao();
      if (params['id']) {
        this.organizacaoService.find(params['id']).subscribe(organizacao => {
          this.organizacao = organizacao;
          this.getFile();
        });
      }
    });
    this.organizacao.ativo = true;
  }

  /**
   *
   * */
  abrirDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = true;
    this.novoContrato.ativo = true;
  }

  /**
   *
   * */
  fecharDialogCadastroContrato() {
    this.doFecharDialogCadastroContrato();
  }

  /**
   *
   * */
  validarManual() {
    this.manualInvalido = false;
  }

  /**
   *
   * */
  private doFecharDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = false;
    this.novoContrato = new Contrato();
  }

  /**
   *
   * */
  adicionarContrato() {
    if (this.novoContrato.manual === null || this.novoContrato.manual === undefined){
      this.manualInvalido = true;
      this.pageNotificationService.addErrorMsg("Selecione um manual");
      return
    }
    this.organizacao.addContrato(this.novoContrato);
    this.doFecharDialogCadastroContrato();
  }

  /**
   *
   * */
  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.contratoEmEdicao = event.selection.clone();
        this.abrirDialogEditarContrato();
        break;
      case 'delete':
        this.contratoEmEdicao = event.selection.clone();
        this.confirmDeleteContrato();
    }
  }

  /**
   *
   * */
  abrirDialogEditarContrato() {
    this.mostrarDialogEdicaoContrato = true;
  }

  /**
   *
   * */
  fecharDialogEditarContrato() {
    this.contratoEmEdicao = new Contrato();
    this.mostrarDialogEdicaoContrato = false;
  }

  /**
   *
   * */
  editarContrato() {
    this.organizacao.updateContrato(this.contratoEmEdicao);
    this.fecharDialogEditarContrato();
  }

  /**
   *
   * */
  confirmDeleteContrato() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o contrato '${this.contratoEmEdicao.numeroContrato}'
        e todas as suas funcionalidades?`,
      accept: () => {
        this.organizacao.deleteContrato(this.contratoEmEdicao);
        this.contratoEmEdicao = new Contrato();
      }
    });
  }

  /**
   *
   * */
  save(form) {
    this.cnpjValido = false;
    if (!form.valid) {
      this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
      return;
    }

    this.isSaving = true;
    if (this.organizacao.cnpj !== undefined && this.organizacao.cnpj !== ' ' && this.organizacao.cnpj !== null){
      if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
        this.cnpjValido = true;
        this.pageNotificationService.addErrorMsg('CNPJ inválido');
        return;
      }
    }
    if (this.organizacao.id !== undefined) {
      this.organizacaoService.find(this.organizacao.id).subscribe(response => {

        if (this.logo !== undefined) {
          this.uploadService.uploadFile(this.logo).subscribe(response => {
            this.organizacao.logoId = JSON.parse(response['_body']).id;
            this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
          });
        } else {
            this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
        }
      });
    } else {
        if (this.checkRequiredFields()) {
          if (this.organizacao.logoId !== undefined){
            this.uploadService.uploadFile(this.logo).subscribe(response => {
              this.organizacao.logoId = JSON.parse(response['_body']).id;
              this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
              });
          } else {
            this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
          }
        } else {
          this.pageNotificationService.addErrorMsg(this.getInvalidFieldsString() + ' é um Campo obrigatório.');
        }
    }
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
  private checkRequiredFields(): boolean {
      let isFieldsValid = false;

    if (this.organizacao.nome === null || this.organizacao.nome === undefined || this.organizacao.nome === '') {
      this.invalidFields.push('Nome');
      isFieldsValid = (this.invalidFields.length === 0);
    } else {
      isFieldsValid = true;
    }
      return isFieldsValid;
  }

  /**
   *
   * */
  private getInvalidFieldsString(): string {
    let invalidFieldsString = '';
    this.invalidFields.forEach(invalidField => {
      if (invalidField === this.invalidFields[this.invalidFields.length - 1]) {
        invalidFieldsString = invalidFieldsString + invalidField;
      } else {
        invalidFieldsString = invalidFieldsString + invalidField + ', ';
      }
    });

    return invalidFieldsString;
  }

  /**
   *
   * */
  private subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: Organizacao) => {
      this.isSaving = false;
      this.router.navigate(['/organizacao']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;

      switch (error.status) {
        case 400: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['_body']).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
        }
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
   *
   * */
  fileUpload(event: any) {
    this.logo = event.files[0];
  }

  /**
   *
   * */
  getFile() {
    this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {

      let fileInfo;
      this.uploadService.getFileInfo(this.organizacao.logoId).subscribe(response => {
        fileInfo = response;

        this.fileInput.files.push(new File([response['_body']], fileInfo['originalName']));
      });
    });
  }

  /**
   *
   * */
  getFileInfo() {
    return this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {
      return response;
    });
  }
}
