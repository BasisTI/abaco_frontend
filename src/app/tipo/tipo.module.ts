import { TipoService } from './tipo.service';
import { FormsModule } from '@angular/forms';
import { AbacoButtonsModule } from './../abaco-buttons/abaco-buttons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoComponent } from './tipo-component/tipo.component';
import { InputTextModule, DataTableModule, ButtonModule } from 'primeng/primeng';
import { TipoFormComponent } from './tipo-form/tipo-form.component';
import { TipoRoute } from './tipo.route';
@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    RouterModule.forRoot(TipoRoute),
    DataTableModule,
    AbacoButtonsModule,
  ],
  declarations: [
    TipoComponent,
    TipoFormComponent
  ],
  providers: [
    TipoService
  ]
})
export class TipoModule { }
