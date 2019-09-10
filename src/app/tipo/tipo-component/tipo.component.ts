import { TipoFilter } from './../tipo-model/tipo.filter';
import { Component, ViewChild } from '@angular/core';
import { TipoService } from '../tipo.service';
import { Tipo } from '../tipo-model/tipo.model';
import { DataTable } from 'primeng/primeng';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent {

  @ViewChild(DataTable) dataTable: DataTable;
  filtro: TipoFilter = new TipoFilter();
  tipo: Tipo = new Tipo();

  constructor(private tipoService: TipoService) {}

  obterTipos(){
    this.tipoService.getPage(this.filtro,this.dataTable)
    .subscribe(tipo => this.tipo = tipo);
  }
}
