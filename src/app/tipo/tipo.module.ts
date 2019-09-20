import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TipoService } from './tipo.service';
import { FormsModule } from '@angular/forms';
import { AbacoButtonsModule } from './../abaco-buttons/abaco-buttons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoComponent } from './tipo-component/tipo.component';
import { InputTextModule, DataTableModule, ButtonModule, ConfirmDialogModule } from 'primeng/primeng';
import { TipoFormComponent } from './tipo-form/tipo-form.component';
import { TipoRoute } from './tipo.route';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TipoMessagesComponent } from './tipo-messages/tipo-messages.component';
import { TipoVisualizarComponent } from './tipo-visualizar/tipo-visualizar.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    RouterModule.forRoot(TipoRoute),
    DataTableModule,
    AbacoButtonsModule,
    ConfirmDialogModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    TipoComponent,
    TipoFormComponent,
    TipoMessagesComponent,
    TipoVisualizarComponent
  ],
  providers: [
    TipoService
  ]
})
export class TipoModule { }
