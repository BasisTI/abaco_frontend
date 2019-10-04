import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Upload } from './upload.model';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  resources = {
    upload: environment.apiUrl + '/uploadFile',
    uploadLogo: environment.apiUrl + '/uploadLogo',
    getArquivoManual: environment.apiUrl + '/getFile',
    getFile: environment.apiUrl + '/getLogo',
    getFileInfo: environment.apiUrl + '/getLogo/info',
    saveFile: environment.apiUrl + '/saveFile'
  };

  uploadFile(file: File): Observable<any> {
    let body = new FormData();
    body.append('file', file)
    return this.http.post(this.resources.upload, body);
  }

  deleteFile(id: number): Observable<any>{
    return this.http.delete(environment.apiUrl + '/deleteFile/' + id);
  }

  uploadLogo(file: File): Observable<any> {
    let body = new FormData();
    body.append('file', file);
    return this.http.post(this.resources.uploadLogo, body);
  }

  saveFile(file: File): any {
    let body = new FormData();
    body.append('file', file);
    return this.http.post(this.resources.saveFile, body);
  }

  convertJsonToObject(json: any): Upload {
    const upload = Object.create(Upload.prototype);
    return Object.assign(upload, json, {
        created: new Date(json.created)
    });
}

  getFile(id: number): Observable<any> {
    return this.http.get(this.resources.getArquivoManual + '/' + id);
  }

  getFileInfo(id: number): Observable<any> {
    return this.http.get(this.resources.getFileInfo + "/" + id);
  }

  
  getLogo(id: number): Observable<any> {
    return this.http.get(this.resources.getFile + "/" + id);
  }

}
