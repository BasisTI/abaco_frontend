import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSuccessComponent } from '@nuvem/angular-base';
import { DiarioErrosComponent } from './components/diario-erros/diario-erros.component';
import { IndexadorComponent } from './indexador/indexador.component';
import { LoginComponent } from './login';
import {VisaoPfComponent} from './visao-pf/visao-pf.component';
import { VisaoPfEditComponentComponent } from './visao-pf-edit-component/visao-pf-edit-component.component';
import { VisaPfDeteccaoComponentesComponent } from './visa-pf-deteccao-componentes/visa-pf-deteccao-componentes.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'diario-erros', component: DiarioErrosComponent, data: { breadcrumb: 'Diário de Erros'} },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: 'indexador', component: IndexadorComponent, data: { breadcrumb: 'Reindexar'} },
  { path: 'login', component: LoginComponent},
  { path: 'visaopf', pathMatch: 'full',  component: VisaoPfComponent },
  { path: 'visaopf/edit/:idAnalise/:idCenario/:idTela', component: VisaoPfEditComponentComponent },
  { path: 'visaopf/contagem/:idAnalise/:idCenario', pathMatch: 'full', component: VisaoPfComponent },
  { path: 'visaopf/deteccomponentes', component: VisaPfDeteccaoComponentesComponent },
  { path: 'visaopf/deteccomponentes/:idTela', component: VisaPfDeteccaoComponentesComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
