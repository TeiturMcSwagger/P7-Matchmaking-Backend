export class Response<Tdata> {
    public statuscode : number;
    public error : string;
    public data : Tdata;
    public constructor(data : Tdata, statuscode? : number, error? : string){
        this.data = data;
        this.statuscode = statuscode ? statuscode : 0;
        this.error = error ? error : "";
    }
}