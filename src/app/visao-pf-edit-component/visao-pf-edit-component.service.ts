
import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class VisaoPfEditComponenteService{


    constructor(private http: HttpClient) {
    }

    getTela(id:string){
        return this.http.get(`/visaopf/tela/${id}`)
    }
    getTiposComponent(){
        return this.http.get("/visaopf/componente/tipos")
    }
}
