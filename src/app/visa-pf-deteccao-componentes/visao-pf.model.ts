export class Visaopf{
    showProcess:boolean = true
    atualizar:boolean
    processosContagem:any
    qtdFinalizados:number = 0
    tela: Tela = new Tela()
    telaResult:any
    uuidProcesso:any
    tiposComponents:Array<any>
    canvasWidth=1300
    canvasHeight=550
    proporcaoW: any
    proporcaoH: any
    componentTooltip:any
    tooltip: HTMLElement
}

export class Tela{
    public id: string
    public originalImageName:string
    public tipo:string
    public imagem: File
    public size:any
    public bucketName: any
    public dataUrl:any
}
