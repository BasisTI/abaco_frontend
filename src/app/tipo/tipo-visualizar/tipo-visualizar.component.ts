import { TipoService } from './../tipo.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Tipo } from '../tipo-model/tipo.model';

@Component({
  selector: 'app-tipo-visualizar',
  templateUrl: './tipo-visualizar.component.html'
})
export class TipoVisualizarComponent implements OnInit {

  public tipo: Tipo = new Tipo();

  constructor(private route: ActivatedRoute, private tipoService: TipoService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.findById(params['id']);
    });
  }

  findById(params){
    this.tipoService.findById(params).subscribe(tipo => {
      this.tipo = tipo;
      console.log(tipo);
    });
  }
}
