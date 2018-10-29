export class Response<Tdata> {
    // Error messages are handled in the front end based on the statuscode.
    // The error property is preserved in case some responses may need more detailed
    // explanation of the statuscode.
    public error : any;
    public statuscode : number;
    public data : Tdata;

    public constructor(data : Tdata, statuscode? : number, error? : any){
        this.data = data;
        this.statuscode = statuscode ? statuscode : 0;
        this.error = error ? error : {};
    }
}