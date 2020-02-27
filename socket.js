const net = require('net');

class SocketIO{
    constructor (host,port){
        this.socket = net.createConnection(port, host);
        socket.setEncoding("utf-8")
        this.host=host
        this.port=port
    }
    async send(data){
        this.socket.write(data,err =>{
            console.log("向主机 "+this.host+":"+this.port+" 发送消息 "+data+" 时发生了异常情况： "+err);
        });
        return new Promise((resolve,reject)=>{
            this.socket.on("data",data=>{
                resolve(data)
            })
        })
    }

}