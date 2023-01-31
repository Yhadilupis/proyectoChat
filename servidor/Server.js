const net = require('net') 
var colors = require('colors');

const server = net.createServer()

const port = 7000
const host ="192.168.0.5"
//const host = "192.168.89.91"

const users = []
const nombres = new Array();
const usuarios = new Map();

server.on('connection', (client) => {
    client.setDefaultEncoding("utf-8") 
    console.log(`Lista de usuarios conectados: `.blue)
    //console.log(`Usuario conectado -->   ${client.remoteAddress}`.blue) // client.remoteAddress = IP del cliente

    client.on('data', (data) => {
        let mensaje = data.toString().trim();
        if(!users.includes(client)){
            //console.log(nombres.includes(data))
            if(nombres.includes(mensaje)){
                console.log("El nombre de usuario ya existe".red)
                client.write("Finalizar")
            }else {
                nombres.push(mensaje)
                for(let element of nombres){
                        console.log(element)
                }
                //console.log("Ya guarde todo")
                users.push(client)
                usuarios.set(client, mensaje)
            }
        }else{

    
        
        const remitente = client.remoteAddress
        const nombre = usuarios.get(client)
    
        for(const user of usuarios.keys()){
            if(user != client){
                user.write(nombre + " : " + mensaje)
            }
        }
        console.log(nombre + " : "+ mensaje) // Imprimimos el mensaje en la consola del servidor
        }
    })


    client.on('error', (err) => {
        if (err.errno == -4077) {
            users.map((un_usuario) => {
                un_usuario.write(client.remoteAddress+" se ha desconectado del servidor".rainbow)
            })
            console.log(client.remoteAddress+" se ha desconectado del servidor".rainbow)
        } else {
            console.error(err)
        }
    })

    client.on('close', () => {
        users.map((un_usuario) => { // Le enviamos un mensaje a la lista de clientes diciendo que el usuario ha salido
            un_usuario.write(client.remoteAddress+" -> se ha salido del servidor".magenta)
        })
    })


    //client.setTimeout(10000)
    client.on('timeout', () => {
    console.log(client.remoteAddress+' usuario desconectado por inactividad'.yellow);
    client.end();
    })

})

/*evitamos que el programa crashee*/
server.on('error', (err) => {
    console.log(err)
})

server.listen(port, host, () => {
    console.log('Servidor escuchando en el puerto 7000'.green)
})