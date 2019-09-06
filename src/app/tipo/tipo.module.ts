import { AbacoButtonsModule } from './../abaco-buttons/abaco-buttons.module';
import { routes } from './../app.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES } from '@angular/router';
import { TipoComponent } from './tipo.component';
import { TipoRoute } from './tipo.route';
import { InputTextModule, DataTableModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    RouterModule.forRoot(TipoRoute),
    DataTableModule,
    AbacoButtonsModule
  ],
  declarations: [
    TipoComponent
  ]
})
export class TipoModule { }
