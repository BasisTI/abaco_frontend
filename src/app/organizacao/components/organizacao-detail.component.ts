import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organizacao } from '../models/organizacao.model';
import { OrganizacaoService } from '../organizacao.service';
import { UploadService } from '../../upload/upload.service';

@Component({
  selector: 'jhi-organizacao-detail',
  templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit {

  organizacao: Organizacao;
  logo: File;

  constructor(
    private organizacaoService: OrganizacaoService,
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.organizacaoService.find(id).subscribe(organizacao => {
      this.organizacao = organizacao;
      if (this.organizacao.logoId != undefined && this.organizacao.logoId != null)
        this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
          this.logo = response.logo;
        });
    });
  }

}
