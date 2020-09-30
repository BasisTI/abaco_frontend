import {Coordenada} from './coordenada'

export class Componente{
    public id: string
    public nome:string
    public descricao: string
    public tipo: string
    public score:number
    public color: string
    public coordenada=new Coordenada()
}
