import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { Contrato, ContratoService } from '../contrato';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-organizacao-form',
  templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {
  
  private routeSub: Subscription;

  contratos: Contrato[] = [];
  organizacao: Organizacao;
  isSaving: boolean;
  mostrarDialogCadastroContrato: boolean = false;
  manuais: Manual[];
  novoContrato: Contrato = new Contrato();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private manualService: ManualService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.organizacao = new Organizacao();
      if (params['id']) {
        this.organizacaoService.find(params['id']).subscribe(organizacao => this.organizacao = organizacao);
      }
    });
  }

  abrirDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = true;
  }

  fecharDialogCadastroContrato() {
    this.doFecharDialogCadastroContrato();
  }

  private doFecharDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = false;
    this.novoContrato = new Contrato();
  }

  adicionarContrato() {
    this.organizacao.addContrato(this.novoContrato);
    this.doFecharDialogCadastroContrato();
  }

  save() {
    this.isSaving = true;
    if (this.organizacao.id !== undefined) {
      this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
    } else {
      this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
    }
  }

  private subscribeToSaveResponse(result: Observable<Organizacao>) {
    result.subscribe((res: Organizacao) => {
      this.isSaving = false;
      this.router.navigate(['/organizacao']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}