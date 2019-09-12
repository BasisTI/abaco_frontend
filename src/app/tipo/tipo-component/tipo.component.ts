import { TipoFilter } from './../tipo-model/tipo.filter';
import { Component, ViewChild, OnInit } from '@angular/core';
import { TipoService } from '../tipo.service';
import { Tipo } from '../tipo-model/tipo.model';
import { DataTable } from 'primeng/primeng';
import { Page } from '../../util/page';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
})
export class TipoComponent implements OnInit{

  @ViewChild(DataTable) dataTable: DataTable;
  filtro: TipoFilter;
  tipos: Page<Tipo>;

  constructor(private tipoService: TipoService) {
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
  ngOnInit() {
    this.obterTipos();
  }
}