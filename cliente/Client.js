const { Socket } = require('net')
var colors = require('colors');
const readline = require('readline').createInterface({
    input:process.stdin,
    output:process.stdout
})

const port = 7000

const host = "192.168.89.91"
const client = new Socket() 

client.connect(port, host)

client.setDefaultEncoding("utf-8")

client.on('data', (data) => {
    if(data == "Finalizar"){
        console.error("El usuario ya existe! favor de iniciar secion con otro nombre de usuario".red)
        process.exit(0)
    }else{
        console.log(data.toString().trim())
    }
    
})

client.on('connect', () => {
    console.log('Has iniciado la sesión'.cyan)
    readline.question("Ingresa tú nombre de usuario: ", (user) =>{
        client.write(user)
    })

    readline.on("line", (line) =>{
        console.log("----------------------------".green)
        client.write(line.yellow)
    })

})

client.on('error',(err)=>{
    console.log("Ha ocurrido un error con el servidor".red)
})

client.on('close',()=>{
    console.log('Has abandonado la sesión'.rainbow)
    process.exit(0)
})
