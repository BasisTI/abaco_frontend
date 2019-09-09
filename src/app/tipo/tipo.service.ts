import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Tipo } from './tipo-model/tipo.model';
import { environment } from '../../environments/environment';

@Injectable()
export class TipoService {

  url: String;

  constructor(private http: Http) { 
    this.url = `${environment.apiUrl}/tipo`;
  }

  find(tipo: Tipo): Observable<Tipo> {
    return null;
  }
}
