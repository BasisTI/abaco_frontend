import { Injectable } from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(private http: HttpClient) {
  }

  setComponenteTela(telaId:string, component:any){
    return this.http.put(`api/tela/${telaId}/componente`, component)
  }

  updateComponent(component:any){
    return this.http.put('api/componente', component, {responseType: 'text'})
  }

  deleteComponent(telaId:any, componentId:any){
    return this.http.delete(`api/tela/${telaId}/component/${componentId}`)
  }
}
