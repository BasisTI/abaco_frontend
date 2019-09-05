import { routes } from './../app.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ROUTES } from '@angular/router';
import { TipoComponent } from './tipo.component';
import { TipoRoute } from './tipo.route';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(TipoRoute)
  ],
  declarations: [
    TipoComponent
  ]
})
export class TipoModule { }
