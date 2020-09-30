import { Component,OnInit } from '@angular/core'
import { ActivatedRoute} from '@angular/router'
import {VisaoPfEditComponenteService} from './visao-pf-edit-component.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-visao-pf-edit-component',
    templateUrl: './visao-pf-edit-component.component.html',
    styleUrls: ['./visao-pf-edit-component.component.css']
})

export class VisaoPfEditComponentComponent implements OnInit {

    idCenario:string
    idAnalise:string
    idTela:string
    tela:any
    tiposComponents: Array<any>

    constructor(private activedRoute: ActivatedRoute, private service:VisaoPfEditComponenteService, private router: Router ) { }

    ngOnInit() {
        this.idTela = this.activedRoute.snapshot.paramMap.get('idTela')
        this.idCenario = this.activedRoute.snapshot.paramMap.get('idCenario')
        this.idAnalise = this.activedRoute.snapshot.paramMap.get('idAnalise')

        if(this.idTela){
            this.tela = this.service.getTela(this.idTela).subscribe( resp => {
                this.tela = resp
            })
        }
        this.getTipos()
    }

    voltarCenario(){
        this.router.navigate([`visaopf/contagem/${this.idAnalise}/${this.idCenario}`])
    }

    getTipos(){
        this.service.getTiposComponent().subscribe( (resp:any) => {
            const tipos = new Array<any>()
            for(let x=0; x< resp.length; x+=1){
                tipos.push( {label: resp[x].toLowerCase(), value: resp[x].toLowerCase()} )
            }
            this.tiposComponents = tipos
        })
    }

}
