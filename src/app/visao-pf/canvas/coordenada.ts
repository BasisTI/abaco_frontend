export class Coordenada{
    public id: string
    public xmin:number
    public xmax: number
    public ymin: number
    public ymax:number

    setCoordenadas(xmin, ymin, xmax, ymax ){
        this.xmin=parseInt(xmin)
        this.ymin=parseInt(ymin)
        this.xmax=parseInt(xmax)
        this.ymax=parseInt(ymax)
    }
}
