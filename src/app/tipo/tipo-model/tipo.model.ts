import { BaseEntity } from './../../shared/base-entity';

export class Tipo implements BaseEntity{
    
    constructor( public id?:number, public nome?:string, public artificialId?:number){}
}