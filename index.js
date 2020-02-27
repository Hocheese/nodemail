const Buffer = require("buffer")
const dns=require('dns');
const net=require('net');
const Koa = require('koa2');
const koaBody = require('koa-body');
const Router = require('koa-router');

// const SocketIO=require('./socket')

const app = new Koa();
const router = new Router();

function mxdns(hostname){
    return new Promise((res,rej)=>{
        dns.resolveMx(hostname,(err,addr)=>{
            if(err){
                res(false)
            }else{
                res(addr)
            }
        })
    })
}

app.use(koaBody());
router.post('/send', async (ctx) => {
    let read = () => {
        return new Promise((resolve, reject) => {
            socket.on("data", (data) => {
                console.log(data);
                resolve(data);
            })
        })
    }
    let { mailto, smtpServer,usermail,password,subject,mailtext } = ctx.request.body
    //console.log(ctx.request.body)
    let user = mailto.split("@");
    let doname = await mxdns(user[1]);
    let host = smtpServer ? smtpServer : doname[0].exchange;
    subject = subject ? subject:"来自小青邮件发送器的邮件"


    let socket = net.createConnection(25, host)
    socket.setEncoding("utf-8")
    await read();
    socket.write("HELO " + smtpServer + " \r\n", "utf-8", (err) => {
        console.log("ERR:", err)
    })
    await read();
    socket.write("auth login \r\n", "utf-8", (err) => {
        console.log("ERR:", err)
    })
    await read();
    let username = (Buffer.Buffer.from(usermail,"utf-8")).toString("base64");
    console.log("认证用户名", username);
    socket.write(username+"\r\n", "utf-8", (err) => {
        console.log("ERR:", err)
        console.log("认证用户名失败", username);
    })
    await read();
    password = (Buffer.Buffer.from(password, "utf-8")).toString("base64");
    console.log("认证密码名", password);
    socket.write(password + "\r\n", "utf-8", (err) => {
        console.log("ERR:", err)
        console.log("认证密码失败", password);
    })
    await read();
    socket.write("MAIL FROM:<"+usermail + ">\r\n", "utf-8", (err) => {
        console.log("ERR:", err)
        // console.log("认证用户名失败", username);
    })
    await read();
    socket.write("RCPT TO:<" + mailto + ">\r\n", "utf-8", (err) => {
        console.log("ERR:", err)
        // console.log("认证用户名失败", username);
    })
    await read();
    socket.write("DATA\r\n", "utf-8", (err) => {
        console.log("ERR:", err)
        // console.log("认证用户名失败", username);
    })
    await read();
    let mail="";
    // let date=new Date();
    mail += ("date: " + new Date("Thu Feb 4 2020 20:20:54 GMT+0800").toUTCString()+"\r\n") ;
    mail += ("To:<" + mailto+">\r\n");
    mail += ("From:<" + usermail + ">\r\n");
    mail += ("Subject:<" + subject + ">\r\n");
    mail += ("MIME-Version:1.0\r\n");
    mail += ("Content-Type:text/html\r\n");
    mail += ("Content-Transfer-Encoding: base64\r\n");
    mail += ("\r\n");
    mail += ((Buffer.Buffer.from(mailtext, "utf-8")).toString("base64") +"\r\n.\r\n");

    socket.write(mail, "utf-8", (err) => {
        console.log("ERR:", err)
        // console.log("认证用户名失败", username);
    })
    await read();
    // socket.on("data",(data)=>{
    //     console.log(data);
    //     socket.write("HELO " + smtpServer+" \r\n","utf-8", (err) => {
    //         console.log("ERR:", err)
    //     })
    //     socket.on("data", (data) => {
    //         console.log(data);
    //         socket.write("auth login", "utf-8", (err) => {
    //             console.log("ERR:", err)
    //         })
    //         // socket.on("data", (data) => {
    //         //     console.log(data);
    //         // })
    //     })
    // })
    
    
    // let socket = new SocketIO(25, doname[0].exchange);
    // await socket.send("HELO");
    // socket.write("data",)
    ctx.response.body = doname[0].exchange
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);