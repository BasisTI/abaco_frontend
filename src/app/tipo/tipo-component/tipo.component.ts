import { Component, OnInit } from '@angular/core';
import { TipoService } from '../tipo.service';
@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent implements OnInit {

  constructor(private tipoService: TipoService) { }

  ngOnInit() {
  }

}
