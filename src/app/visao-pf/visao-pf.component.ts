import { Component, OnInit } from '@angular/core'
import { Message } from 'primeng/api'
import {VisaoPfService} from './visao-pf.service'
import { ListaRetorno } from './lista-retorno.model'
import {Tela} from './tela.model'
import {Cenario} from './cenario.model'
import { switchMap,takeWhile } from 'rxjs/operators'
import { interval, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-visao-pf',
    templateUrl: './visao-pf.component.html',
    styleUrls: ['./visao-pf.component.scss']
})

export class VisaoPfComponent implements OnInit {

    msgs: Message[] = []
    tiposPrototipo: Array<any> = []
    analisesCadastradas: Array<any>
    cenario: Cenario

    showProcess:boolean
    atualizar:boolean
    processosContagem:any
    qtdFinalizados:number

    cols: any[]
    totalPontos: number

    itemSelected: ListaRetorno[]

    canvasWidth=1300
    canvasHeight=550
    proporcaoW: any
    proporcaoH: any
    tiposComponents: Array<any>

    dialogDetalhes:boolean
    telaSelect:any

    componentTooltip:any
    tooltip: HTMLElement

    constructor(private visaoPfService: VisaoPfService, private router: Router, private activedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.cenario = new Cenario()

        const cenarioId = this.activedRoute.snapshot.paramMap.get('idCenario')
        const analiseId = this.activedRoute.snapshot.paramMap.get('idAnalise')

        this.getAnalise(analiseId)

        if(cenarioId){
            this.getResultCenario(cenarioId)
            this.getProcessoContagem(cenarioId)
            this.showProcess = true
        }

        this.tiposPrototipo = [{ id:'1', tipo:'Listagem'}, { id:'2', tipo:'Cadastro'}]
        this.cols = [
            { field: 'nome', header: 'Processos elementares' },
            { field: 'DERs', header: 'TR/DER' },
            { field: 'ALRs', header: 'TR/ALR' },
            { field: 'tipoFuncaoTransacao', header: 'Tipo' },
            { field: 'complexidade', header: 'Complexidade' },
            { field: 'pontosFuncao', header: 'PF' }
        ]
    }

    getProcessoContagem(cenarioId){
        if(cenarioId){
            this.visaoPfService.getProcessoContagemByCenario(cenarioId).subscribe((res:any) => {
                let qtd=0
                this.processosContagem = res
                for(const processo of res){
                    if(processo.dataFim != undefined ){
                        qtd++
                        this.qtdFinalizados = Math.trunc( (qtd*100)/res.length )
                    }
                }
            })
        }
    }

    getResultCenario(cenarioId){
        if(cenarioId){
            this.visaoPfService.getCenario(cenarioId).subscribe((res:any) => {
                this.cenario.id = res.id
                this.cenario.nome = res.nome
                this.cenario.telasResult = this.sortTelas(res.telas)
                this.cenario.itenContagem = res.itenContagem
                this.totalPontos = res.totalPontos
            })
        }
    }

    getAnalise(analiseId){
        this.visaoPfService.getListAnalises().subscribe((result: any)  =>{
            this.analisesCadastradas = result
            if(analiseId != null && this.analisesCadastradas != undefined ){
                this.cenario.analise =  this.analisesCadastradas.find(x => x.id == analiseId);
            }
        })
    }

    showDetalhesImg(tela){
        this.dialogDetalhes = true;
        this.visaoPfService.getTela(tela.id).subscribe((resp:any) => this.telaSelect = resp)
    }

    getTipos(){
        this.visaoPfService.getTiposComponent().subscribe( (resp:any) => {
            const tipos = new Array<any>()
            for(let x=0; x< resp.length; x+=1){
                tipos.push( {label: resp[x], value: resp[x]} )
            }
            this.tiposComponents = tipos
        })
    }

    contar(){
        if(this.cenario.telas.length == 0){ this.showErrorMsg('É necessário imagens para a detecção de componentes!'); return}
        if(this.cenario.analise == undefined){this.showErrorMsg('É necessário informar a Análise!'); return}
        if(this.cenario.nome == undefined){this.showErrorMsg('É necessário informar o nome do Cenário!'); return}
        let invalido = this.cenario.telas.map( tela => tela['tipo']==undefined ).indexOf(true)
        if(invalido !== -1){this.showErrorMsg('É necessário informar o Tipo para cada imagem!'); return}

        if(invalido === -1){
            this.showSucessMsg('Enviando imagens para contagem...')
            this.visaoPfService.sendComponentDetection(this.cenario).subscribe(uuid =>{
                if(uuid){
                    this.showProcess = true
                    this.updateProcessos(uuid)
                }
            })
        }
    }

    updateProcessos(uuidProcesso){
        var qtd=0
        var qtdAux=0
        interval(2100).pipe(
            switchMap(() => from(this.visaoPfService.getProcessoContagem(uuidProcesso))),
            takeWhile(((response: any ) => {
                this.atualizar = false
                if(response){
                    this.showInfoMsg('Atualizando...')
                    this.processosContagem = response
                    qtd=0
                    for(const processo of response){
                        if((processo.dataFim == null) ){
                            this.atualizar = true
                        }else{
                            qtd++
                            if(processo.cenarioId && qtd > qtdAux ){
                                qtdAux = qtd
                                this.qtdFinalizados = Math.trunc( (qtd*100)/response.length )
                                this.cenario.id=processo.cenarioId
                                this.getResultCenario(this.cenario.id)
                            }
                        }
                    }
                    if(this.atualizar==false){
                        this.showSucessMsg('Contagem concluída.')
                    }
                    return this.atualizar
                }
            }))
        ).subscribe( (response:any) => {})
    }

    tooltipPosition(event, tela){
        this.proporcaoW = tela.width/this.canvasWidth
        this.proporcaoH = tela.height/this.canvasHeight
        console.log(this.proporcaoW, this.proporcaoH)
        this.componentTooltip = undefined
        var mouseImgPosition = this.getClickCanvasPosition(event)
        var component = this.findComponenteByPosition(tela, mouseImgPosition)
        this.componentTooltip = component
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
        clickPosition = [posX - canvasPos[0], posY - canvasPos[1]]
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
        if( position[0] >= component.coordenada.xmin/this.proporcaoW && position[0] <=  component.coordenada.xmax/this.proporcaoW && position[1] >= component.coordenada.ymin/this.proporcaoH && position[1] <=  component.coordenada.ymax/this.proporcaoH){
            return component
        }
        return undefined
    }

    sortTelas(telas){
        telas.sort(function(a,b) {
            if(a.originalImageName < b.originalImageName) return -1;
            if(a.originalImageName > b.originalImageName) return 1;
            return 0;
        });
        return telas
    }


    addTelaListagem(event):void{
        if(this.cenario.telas.length==0){
            var tela
            for(const file of event.files){
                tela = new Tela()
                tela.originalImageName=file.name
                tela.size= file.size
                tela.imagem = file
                this.cenario.telas.push(tela)
            }
        }else{
            var newtela
            for(const file of event.files){
                let index = this.cenario.telas.map( tela => tela['originalImageName']).indexOf(file.name)
                if(index === -1){
                    newtela = new Tela()
                    newtela.originalImageName=file.name
                    newtela.size= file.size
                    newtela.imagem = file
                    this.cenario.telas.push(newtela)
                }
            }
        }
    }

    editComponent(tela){
        this.router.navigate([`visaopf/edit/${this.cenario.analise.id}/${this.cenario.id}/${tela.id}`])
    }

    formatPctr(value):any{
        return (value*100).toFixed(2)+"%"
    }

    deleteFileListagem(event):void{
        let indexToRemove = this.cenario.telas.map( tela => tela['originalImageName']).indexOf(event.file.name)
        if(indexToRemove !== -1){
            this.cenario.telas.splice(indexToRemove, 1)
        }
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
