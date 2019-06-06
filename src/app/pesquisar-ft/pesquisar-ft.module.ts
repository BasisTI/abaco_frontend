import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { BotoesExportacaoModule } from './../botoes-exportacao/botoes-exportacao.module';
import {
  ButtonModule,
  InputTextModule,
  SpinnerModule,
  CalendarModule,
  DropdownModule,
  RadioButtonModule,
  ConfirmDialogModule,
  DialogModule
} from 'primeng/primeng';

import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { PesquisarFtComponent } from './pesquisar-ft.component';
import { DatatableModule } from '@basis/angular-components';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const rotas: Routes = [
  {
    path: 'analise/:id/edit/searchft',
    component: PesquisarFtComponent
  }
];
@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    BotoesExportacaoModule,
    AbacoButtonsModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DatatableModule,
    DialogModule,
    MemoryDataTableModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    PesquisarFtComponent
  ],
  exports: [
    PesquisarFtComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PesquisarFuncaoTransacaoModule {

};

