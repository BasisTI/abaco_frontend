import { Router, ActivatedRoute } from '@angular/router';
import { TipoService } from './../tipo.service';
import { Component, OnInit } from '@angular/core';
import { Tipo } from '../tipo-model/tipo.model';
import { PageNotificationService } from '@basis/angular-components';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-form',
  templateUrl: './tipo-form.component.html',
})
export class TipoFormComponent implements OnInit {
  
  tipo: Tipo = new Tipo();
  
  constructor(private tipoService: TipoService, 
    private router: Router,
    private pageNotificationService: PageNotificationService,         
    private route: ActivatedRoute, private translate: TranslateService
    ) { }

   
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
          this.tipoService.findById(params['id']).subscribe(tipo => this.tipo = tipo);
      }
  });
  }

  private showTranslatedMessage(label) {
    this.translate.get(label).subscribe((translatedMessage: string) => {
        this.pageNotificationService.addErrorMessage(translatedMessage);
    });
  }

  submit(form){
    
    if (!form.valid) {
       this.showTranslatedMessage('Global.Mensagens.FavorPreencherCampoObrigatorio');
    }
    if(this.tipo.id === undefined){
      this.tipoService.create(this.tipo).subscribe(() => {
        this.pageNotificationService.addCreateMsg();
        this.router.navigate(['/tipo']);
      }); 
    }else{
      this.tipoService.update(this.tipo).subscribe(() => {
        this.pageNotificationService.addUpdateMsg();
        this.router.navigate(['/tipo']);
      });
    }
  }
}
