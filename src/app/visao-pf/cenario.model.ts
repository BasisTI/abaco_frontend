import {Tela} from './tela.model'

export class Cenario{
    public id: string
    public analise:any
    public nome:string
    public telas: Array<Tela> = []
    public telasResult: Array<any>
    public itenContagem: Array<any>
}
