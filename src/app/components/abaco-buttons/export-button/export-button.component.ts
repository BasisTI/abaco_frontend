import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ExportacaoUtilService } from './export-button.service';

@Component({
    selector: 'app-export-button',
    templateUrl: './export-button.component.html',
    styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent {

    @Input() resourceName: string;

    @Input() filter: any;

    tiposExportacao = [
        {
            label: 'PDF', icon: '', command: () => {
                this.exportar(ExportacaoUtilService.PDF);
            }
        },
        {
            label: 'EXCEL', icon: '', command: () => {
                this.exportar(ExportacaoUtilService.EXCEL);
            }
        },
        {
            label: 'IMPRIMIR', icon: '', command: () => {
                this.imprimir(ExportacaoUtilService.PDF);
            }
        },
    ];

    constructor( 
        private http: HttpClient,
    ) { }

    exportar(tipoRelatorio: string) {

        // this.exibirBlockUi(GeneralConstants.generate_report);
        // ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
        //     .subscribe((res: Blob) => {
        //         const file = new Blob([res], { type: tipoRelatorio });
        //         const url = URL.createObjectURL(file);
        //         ExportacaoUtil.download(url, this.resourceName + ExportacaoUtilService.getExtension(tipoRelatorio));
        //     });
    }

    imprimir(tipoRelatorio: string) {

        // this.exibirBlockUi(GeneralConstants.generate_report);
        // ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
        // .subscribe( downloadUrl =>  ExportacaoUtil.imprimir(downloadUrl)) ;
    }

    exibirBlockUi(menssagem: string) {
    }

}