import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityModule, VersionTagModule } from '@nuvem/angular-base';
import { BreadcrumbModule, ErrorStackModule, MenuModule, PageNotificationModule, BlockUiModule } from '@nuvem/primeng-components';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AbacoButtonsModule } from './components/abaco-buttons/abaco-buttons.module';
import { DiarioErrosComponent } from './components/diario-erros/diario-erros.component';
import { AppFooterComponent } from './components/footer/app.footer.component';
import { AppInlineProfileComponent } from './components/profile/app.profile.component';
import { AppRightpanelComponent } from './components/rightpanel/app.rightpanel.component';
import { AppTopbarComponent } from './components/topbar/app.topbar.component';
import { ContratoModule } from './contrato/contrato.module';
import { EsforcoFaseModule } from './esforco-fase';
import { FaseModule } from './fase/fase.module';
import { IndexadorModule } from './indexador/indexador.module';
import { ManualModule } from './manual/manual.module';
import { OrganizacaoModule } from './organizacao/organizacao.module';
import { SharedModule } from './shared/shared.module';
import { UploadService } from './upload/upload.service';
import { FuncionalidadeModule } from './funcionalidade/funcionalidade.module';
import { ModuloModule } from './modulo/modulo.module';
import { SistemaModule } from './sistema/sistema.module';
import { UserModule } from './user/user.module';
import { TipoEquipeModule } from './tipo-equipe/tipo-equipe.module';
import { AnaliseModule } from './analise/analise.module';
import { FuncaoDadosModule } from './funcao-dados/funcao-dados.module';
import { FuncaoTransacaoModule } from './funcao-transacao/funcao-transacao.module';
import { BaselineModule } from './baseline/baseline.module';
import { SenhaModule } from './senha/senha.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RouterModule } from '@angular/router';
import { LoginModule } from './login/login.module';
import { PesquisarFuncaoTransacaoModule } from './pesquisar-ft/pesquisar-ft.module';
import { StatusModule } from './status/status.module';
import { VisaoPfComponent } from './visao-pf/visao-pf.component';
import { CanvasComponent} from './visao-pf/canvas/canvas.component';
import { VisaoPfEditComponentComponent } from './visao-pf-edit-component/visao-pf-edit-component.component'
import { TooltipDirective } from './visao-pf/tooltip.directive'

import { NomenclaturaModule } from './nomenclatura/nomenclatura.module';
import { DivergenciaModule } from './divergencia/divergencia.module';
import {FieldsetModule} from 'primeng/fieldset';
import { VisaPfDeteccaoComponentesComponent } from './visa-pf-deteccao-componentes/visa-pf-deteccao-componentes.component';

@NgModule({
    declarations: [
        AppComponent,
        AppTopbarComponent,
        AppFooterComponent,
        AppRightpanelComponent,
        AppInlineProfileComponent,
        DiarioErrosComponent,
        VisaoPfComponent,
        CanvasComponent,
        VisaoPfEditComponentComponent,
        TooltipDirective,
        VisaPfDeteccaoComponentesComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        PageNotificationModule,
        BreadcrumbModule,
        ErrorStackModule,
        VersionTagModule,
        SecurityModule.forRoot(environment.auth),
        MenuModule,
        FaseModule,
        IndexadorModule,
        AbacoButtonsModule,
        ManualModule,
        EsforcoFaseModule,
        OrganizacaoModule,
        ContratoModule,
        FuncionalidadeModule,
        SistemaModule,
        ModuloModule,
        FuncionalidadeModule,
        TipoEquipeModule,
        UserModule,
        AnaliseModule,
        FuncaoDadosModule,
        FuncaoTransacaoModule,
        BaselineModule,
        SenhaModule,
        LoginModule,
        DashboardModule,
        PesquisarFuncaoTransacaoModule,
        BlockUiModule,
        StatusModule,
        NomenclaturaModule,
        DivergenciaModule,
        FieldsetModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        UploadService,
    ],
    bootstrap: [AppComponent],
    exports: [ RouterModule]
})
export class AppModule { }
