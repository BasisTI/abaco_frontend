import { AuthGuard } from '@basis/angular-components';
import { Routes } from '@angular/router';
import { TipoComponent } from './tipo-component/tipo.component';
import { TipoFormComponent } from './tipo-form/tipo-form.component';

export const TipoRoute: Routes = [
    { path: 'tipo',component: TipoComponent,canActivate: [AuthGuard] },
    { path: 'tipo/new',component: TipoFormComponent,canActivate: [AuthGuard]}
]