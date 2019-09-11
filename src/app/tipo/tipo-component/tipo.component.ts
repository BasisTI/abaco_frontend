import { TipoFilter } from './../tipo-model/tipo.filter';
import { Component, ViewChild, OnInit } from '@angular/core';
import { TipoService } from '../tipo.service';
import { Tipo } from '../tipo-model/tipo.model';
import { DataTable } from 'primeng/primeng';
import { Page } from '../../util/page';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent implements OnInit{

  @ViewChild(DataTable) dataTable: DataTable;
  filtro: TipoFilter = new TipoFilter();
  tipos: Page<Tipo> = new Page<Tipo>();

  constructor(private tipoService: TipoService) {}

  obterTipos(){
    this.tipoService.getPage(this.filtro,this.dataTable)
    .subscribe( response => {
      this.tipos = response; 
    });
  }

  ngOnInit() {
    this.obterTipos();
  }
}