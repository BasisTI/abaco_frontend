import { FormsModule } from '@angular/forms';
import { AbacoButtonsModule } from './../abaco-buttons/abaco-buttons.module';
import { routes } from './../app.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES } from '@angular/router';
import { TipoComponent } from './tipo.component';
import { TipoRoute } from './tipo.route';
import { InputTextModule, DataTableModule, ButtonModule } from 'primeng/primeng';
import { TipoFormComponent } from './tipo-form/tipo-form.component';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    RouterModule.forRoot(TipoRoute),
    DataTableModule,
    AbacoButtonsModule
  ],
  declarations: [
    TipoComponent,
    TipoFormComponent
  ]
})
export class TipoModule { }
