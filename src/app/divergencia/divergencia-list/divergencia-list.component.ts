import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUiService } from '@nuvem/angular-base';
import { DatatableClickEvent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, LazyLoadEvent } from 'primeng';
import { Table as DataTable } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Analise, SearchGroup } from 'src/app/analise';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Sistema, SistemaService } from 'src/app/sistema';
import { StatusService } from 'src/app/status';
import { Status } from 'src/app/status/status.model';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { User } from 'src/app/user';
import { Divergencia } from '../divergencia.model';
import { DivergenciaService } from '../divergencia.service';

@Component({
    selector: 'app-divergencia-list',
    templateUrl: './divergencia-list.component.html',
    providers: [ ConfirmationService]
})
export class DivergenciaListComponent implements OnInit {


    @ViewChild(DataTable, { static: true }) datatable: DataTable;

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    datasource: Analise[];
    event: LazyLoadEvent;
    lstDivergence;
    selectedDivergence;
    totalRecords;

    cols: any[];

    loading: boolean;


    allColumnsTable = [
        {field: 'organizacao.nome',  header: 'Organização'},
        {field: 'identificadorAnalise',  header: 'Identificador da Validação'},
        {field: 'sistema.nome',  header: 'Sistema'},
        {field: 'metodoContagem',  header: 'Metodo Contagem'},
        {field: 'pfTotal',  header: 'PF total'},
        {field: 'adjustPFTotal',  header: 'PF Ajustado'},
        {field: 'dataCriacaoOrdemServico',  header: 'Data de criação'},
        {field: 'status',  header: 'Status'},
    ];

    customOptions: Object = {};

    userAnaliseUrl: string = this.analiseService.resourceUrl;

    analiseSelecionada: any = new Divergencia();
    analiseTableSelecionada: Divergencia = new Divergencia();
    searchDivergence: SearchGroup = new SearchGroup();
    nomeSistemas: Array<Sistema>;
    usuariosOptions: User[] = [];
    organizations: Array<Organizacao>;
    teams: TipoEquipe[];
    equipeShare;
    analiseTemp: Divergencia = new Divergencia();
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    tipoEquipesToClone: TipoEquipe[] = [];
    query: String;
    usuarios: String[] = [];
    lstStatus: Status[] = [];
    lstStatusActive: Status[] = [];
    idDivergenceStatus: number;
    public statusToChange?: Status;
    public equipeToClone?: TipoEquipe;

    translateSusbscriptions: Subscription[] = [];

    metsContagens = [
        {label: 'Detalhada', value: 'DETALHADA'},
        {label: 'Indicativa', value: 'INDICATIVA'},
        {label: 'Estimada', value: 'ESTIMADA'}
    ];
    blocked;
    inicial: boolean;
    showDialogAnaliseCloneTipoEquipe = false;
    showDialogAnaliseBlock = false;
    mostrarDialog = false;
    enableTable: Boolean = false;
    notLoadFilterTable = false;
    analisesList: any[] = [];
    isLoadFilter = true;
    showDialogDivergenceBlock = false;

    constructor(
        private router: Router,
        private sistemaService: SistemaService,
        private analiseService: DivergenciaService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private equipeService: TipoEquipeService,
        private blockUiService: BlockUiService,
        private statusService: StatusService,
        private confirmationService: ConfirmationService,
        private divergenciaService: DivergenciaService,
    ) {
    }

    public ngOnInit() {
        this.estadoInicial();
        this.datatable.onLazyLoad.subscribe((event: LazyLoadEvent) => this.loadDirvenceLazy(event));
        this.datatable.lazy = true;

    }

    getLabel(label) {
        return label;
    }

    estadoInicial() {
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.recuperarStatus();
        this.inicial = false;
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res;
        });
    }


    recuperarOrganizacoes() {
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response;
            this.customOptions['organizacao.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    recuperarSistema() {
        this.sistemaService.dropDown().subscribe(response => {
            this.nomeSistemas = response;
            this.customOptions['sistema.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }


    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response;
            this.tipoEquipesToClone = response;
            const emptyTeam = new TipoEquipe();
            this.tipoEquipesToClone.unshift(emptyTeam);
        });
    }

    recuperarStatus() {
        this.statusService.list().subscribe(response => {
            this.lstStatus = response;
            const emptyStatus = new Status();
            this.lstStatus.unshift(emptyStatus);
        });
        this.statusService.listActive().subscribe(response => {
            this.lstStatusActive = response;
        });
    }


    public editDivergence(analiseDivergence: Analise) {
        if (!analiseDivergence) {
            return;
        }
        if (analiseDivergence.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMessage('Você não pode editar uma análise bloqueada!');
            return;
        }
        this.router.navigate(['/divergencia', analiseDivergence.id, 'edit']);
    }

    public confirmDeleteDivergence(divergence: Analise) {
        if (!divergence) {
            this.pageNotificationService.addErrorMessage('Nenhuma Validação foi selecionada.');
            return;
        } else {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja excluir o registro ').concat(divergence.identificadorAnalise).concat(' ?'),
                accept: () => {
                    this.blockUiService.show();
                    this.divergenciaService.delete(divergence.id).subscribe(() => {
                        this.pageNotificationService.addDeleteMsg(divergence.identificadorAnalise);
                        this.blockUiService.hide();
                        this. performSearch();
                    });
                }
            });
        }
    }

    public confirmBlockDivegence(divergence: Analise){
        
        this.changeStatus(divergence.id)
    }

    public changeUrl() {
        let querySearch = '&isDivergence=true';
        querySearch = querySearch.concat((this.searchDivergence.identificadorAnalise) ?
            `&identificador=*${this.searchDivergence.identificadorAnalise}*` : '');
        querySearch = querySearch.concat((this.searchDivergence.sistema && this.searchDivergence.sistema.id) ?
            `&sistema=${this.searchDivergence.sistema.id}` : '');
        querySearch = querySearch.concat((this.searchDivergence.organizacao && this.searchDivergence.organizacao.id) ?
            `&organizacao=${this.searchDivergence.organizacao.id}` : '');
        return querySearch;
    }
    public limparPesquisa() {
        this.searchDivergence = new SearchGroup();
        sessionStorage.setItem('searchDivergence', JSON.stringify(this.searchDivergence));
        this.event.first = 0;
        this.loadDirvenceLazy(this.event);
    }


    public performSearch() {
        this.enableTable = true ;
        sessionStorage.setItem('searchDivergence', JSON.stringify(this.searchDivergence));
        this.event.first = 0;
        this.loadDirvenceLazy(this.event);
    }

    public desabilitarBotaoRelatorio(): boolean {
        return !this.datatable;
    }

    loadDirvenceLazy(event: LazyLoadEvent) {
        this.blockUiService.show();
        this.event = event;
        this.analiseService.search(event, event.rows, false, this.changeUrl()).subscribe(response => {
            this.lstDivergence = response.body;
            this.datatable.totalRecords = parseInt(response.headers.get('x-total-count'), 10);
            this.blockUiService.hide();
        });
    }
    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.editDivergence(this.selectedDivergence);
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.editDivergence(this.selectedDivergence);
        }
    }
    public datatableClick(event: DatatableClickEvent) {
        
        if (!event.selection) {
            return;
        } else if (event.selection.length === 1) {
            event.selection = event.selection[0];
        } else if ( event.selection.length > 1 && event.button !== 'generateDivergence') {
            this.pageNotificationService.addErrorMessage('Selecione somente uma Análise para essa ação.');
            return ;
        } else if (event.selection.length > 2) {
            this.pageNotificationService.addErrorMessage('Selecione somente duas Análises para gerar a Validação.');
            return ;
        }
    }
    public changeStatus(id: number) {
        this.statusToChange = undefined;
        this.idDivergenceStatus = id;
        this.showDialogDivergenceBlock = true;
    }
    

    public divergenceBlock(){
        if(this.idDivergenceStatus && this.statusToChange){
            this.divergenciaService.changeStatusDivergence(this.idDivergenceStatus, this.statusToChange).subscribe(data => {
                this.statusService = undefined;
                this.idDivergenceStatus = undefined;
                this.showDialogDivergenceBlock = false;
                this.datatable._filter();
                this.pageNotificationService.addSuccessMessage('O status da análise '+ data.identificadorAnalise + ' foi alterado.');
            },
            err => this.pageNotificationService.addErrorMessage('Não foi possível alterar o status da Análise.'));
        }
        else {
            this.pageNotificationService.addErrorMessage('Selecione um Status para continuar.');

        }

    }

}
