import { AuthGuard } from '@basis/angular-components';
import { Routes } from '@angular/router';
import { TipoComponent } from './tipo-component/tipo.component';
import { TipoFormComponent } from './tipo-form/tipo-form.component';
import { TipoVisualizarComponent } from './tipo-visualizar/tipo-visualizar.component';

export const TipoRoute: Routes = [
    { path: 'tipo',component: TipoComponent,canActivate: [AuthGuard] },
    { path: 'tipo/new',component: TipoFormComponent,canActivate: [AuthGuard]},
    { path: 'tipo/:id',component: TipoVisualizarComponent,canActivate: [AuthGuard]},
    { path: 'tipo/:id/edit',component: TipoFormComponent,canActivate: [AuthGuard]}
]