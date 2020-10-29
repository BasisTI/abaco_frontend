import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Visaopf } from './visao-pf.model'
import {VisaoPfService} from "../visao-pf/visao-pf.service"
import { switchMap,takeWhile } from 'rxjs/operators'
import { interval, from } from 'rxjs';
import { Message } from 'primeng/api'

@Component({
    selector: 'app-visa-pf-deteccao-componentes',
    templateUrl: './visa-pf-deteccao-componentes.component.html',
    styleUrls: ['./visa-pf-deteccao-componentes.component.scss']
})
export class VisaPfDeteccaoComponentesComponent implements OnInit {

    msgs: Message[] = []

    visaopf: Visaopf = new Visaopf();
    routeState:any
    data:any

    constructor(private activedRoute: ActivatedRoute, private router: Router, private visaoPfService: VisaoPfService) {

        if (this.router.getCurrentNavigation().extras.state) {
            this.routeState = this.router.getCurrentNavigation().extras.state;
        }
    }

    ngOnInit(): void {
        this.getTipos()

    }

    continuarContagem(){
        this.router.navigate([`analise/${this.routeState.idAnalise}/funcao-dados`], {
            state: {
                isEdit : this.routeState.isEdit,
                idAnalise : this.routeState.idAnalise,
                seletedFuncaoDados : this.routeState.seletedFuncaoDados,
                telaResult : JSON.stringify(this.visaopf.telaResult),
                dataUrl : JSON.stringify(this.visaopf.tela.dataUrl),
            }

        })
    }

    detectarComponentes(){

        if(this.visaopf.tela == undefined ){ this.showErrorMsg('É necessário imagens para a detecção de componentes!'); return}

        this.visaoPfService.sendComponentDetection(this.visaopf).subscribe(uuid =>{
            if(uuid){
                this.updateProcessos(uuid)
                this.visaopf.showProcess = false
            }
        })
    }

    updateProcessos(uuidProcesso){
        var qtd=0
        var qtdAux=0
        interval(2100).pipe(
            switchMap(() => from(this.visaoPfService.getProcessoContagem(uuidProcesso))),
            takeWhile(((response: any ) => {
                this.visaopf.atualizar = false
                if(response){
                    this.showInfoMsg('Atualizando...')
                    this.visaopf.processosContagem = response
                    qtd=0
                    for(const processo of response){
                        if((processo.dataFim == null) ){
                            this.visaopf.atualizar = true
                        }else{
                            qtd++
                            if(qtd > qtdAux ){
                                qtdAux = qtd
                                this.visaopf.qtdFinalizados = Math.trunc( (qtd*100)/response.length )
                                this.visaopf.uuidProcesso =processo.uuidProcesso
                                this.visaoPfService.getTelaByUuid(processo.uuidImagem).subscribe((res:any) => {
                                    this.visaopf.telaResult = res
                                })
                            }
                        }
                    }
                    if(this.visaopf.atualizar==false){
                        this.showSucessMsg('Contagem concluída.')
                    }
                    return this.visaopf.atualizar
                }
            }))
        ).subscribe( (response:any) => {})
    }


    tooltipPosition(event, tela){
        this.visaopf.proporcaoW = tela.width/this.visaopf.canvasWidth
        this.visaopf.proporcaoH = tela.height/this.visaopf.canvasHeight
        console.log(this.visaopf.proporcaoW, this.visaopf.proporcaoH)
        this.visaopf.componentTooltip = undefined
        var mouseImgPosition = this.getClickCanvasPosition(event)
        var component = this.findComponenteByPosition(tela, mouseImgPosition)
        this.visaopf.componentTooltip = component
    }

    getClickCanvasPosition(event):Array<number>{
        var clickPosition
        var posX = 0
        var posY = 0
        var canvasPos = this.getCanvasPos()
        if (event.pageX || event.pageY){
            posX = event.pageX
            posY = event.pageY
        } else if (event.clientX || event.clientY){
            posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
            posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
        }
        clickPosition = [posX - canvasPos[0] + 20 , posY - canvasPos[1] - 100]
        return clickPosition
    }

    getCanvasPos():Array<number>{
        return this.findPosition(document.getElementById("canvas"))
    }

    findPosition(oElement):Array<number>{
        var elementPosition
        if( typeof( oElement.offsetParent ) != "undefined" ){
            for( var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent ){
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            elementPosition = [ posX, posY ];
        }else {
            elementPosition = [ oElement.x, oElement.y ];
        }
        return elementPosition
    }


    findComponenteByPosition(tela, clickposition):any{
        return tela.componentes.filter(component => this.isClickInsideComponent(component, clickposition))[0]
    }

    isClickInsideComponent(component, position): any{
        if( position[0] >= component.coordenada.xmin/this.visaopf.proporcaoW && position[0] <=  component.coordenada.xmax/this.visaopf.proporcaoW && position[1] >= component.coordenada.ymin/this.visaopf.proporcaoH && position[1] <=  component.coordenada.ymax/this.visaopf.proporcaoH){
            return component
        }
        return undefined
    }

    addTela(event){

        let fileReader = new FileReader()
        fileReader.readAsDataURL(event.files[0])
        fileReader.onload = (reader:any) => {
            this.visaopf.tela.dataUrl = fileReader.result
        }

        this.visaopf.tela.imagem = event.files[0]
        this.visaopf.tela.originalImageName = event.files[0].name
        this.visaopf.tela.size = event.files[0].size
    }

    getTipos(){
        this.visaoPfService.getTiposComponent().subscribe( (resp:any) => {
            const tipos = new Array<any>()
            for(let x=0; x< resp.length; x+=1){
                tipos.push( {label: resp[x], value: resp[x].toLowerCase() } )
            }
            this.visaopf.tiposComponents = tipos
        })
    }



    showInfoMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'Info ', detail: msg })
    }

    showSucessMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'success', summary: 'Sucessso ', detail: msg })
    }

    showErrorMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'error', summary: 'Erro ', detail: msg })
    }


}
