import { Routes } from '@angular/router';

import { OrganizacaoComponent } from './components/organizacao.component';
import { OrganizacaoDetailComponent } from './components/organizacao-detail.component';
import { OrganizacaoFormComponent } from './components/organizacao-form.component';

import { AuthGuard } from '@basis/angular-components';

export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/new',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent,
    canActivate: [AuthGuard]
  },
];
