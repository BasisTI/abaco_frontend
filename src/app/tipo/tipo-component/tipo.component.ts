import { TipoFilter } from './../tipo-model/tipo.filter';
import { Component, ViewChild, OnInit } from '@angular/core';
import { TipoService } from '../tipo.service';
import { Tipo } from '../tipo-model/tipo.model';
import { DataTable } from 'primeng/primeng';
import { Page } from '../../util/page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
})
export class TipoComponent implements OnInit{

  @ViewChild(DataTable) dataTable: DataTable;
  filtro: TipoFilter;
  tipos: Page<Tipo>;
  tipoSelecionado: Tipo = new Tipo();

  constructor(private tipoService: TipoService, private route: Router) {
    this.filtro = new TipoFilter();
    this.tipos = new Page<Tipo>();
  }

  obterTipos(){
    this.tipoService.getPage(this.filtro,this.dataTable)
    .subscribe( response => {
      this.tipos = response; 
    });
  }

  limpaCampos(){
    this.filtro = new TipoFilter();
    this.obterTipos();
  }

  visualizarTipo(){
    console.log("Visualizar TIPO");
    this.route.navigate([`/tipo`, this.tipoSelecionado.id]);
  }
  
  linhaSelecionada(data){
    this.tipoSelecionado = data;
  }
  
  ngOnInit() {
    this.obterTipos();
  }
}