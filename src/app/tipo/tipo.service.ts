import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Tipo } from './tipo-model/tipo.model';

@Injectable()
export class TipoService {

  constructor(private http: Http) { }

  findAll(tipo: Tipo): Observable<Tipo> {
    return null;
  }
}
