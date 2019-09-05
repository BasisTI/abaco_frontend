import { AuthGuard } from '@basis/angular-components';
import { Routes } from '@angular/router';
import { TipoComponent } from './tipo.component';

export const TipoRoute: Routes = [
    { path: 'tipo',component: TipoComponent,canActivate: [AuthGuard] }
]