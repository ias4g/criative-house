// Usando o EXPRESS para criar e configurar o servidor
const express = require('express')
const server = express()

// Configurando arquivos estáticos como styles, scripts e images
server.use(express.static("public"))

// Configurando o NUNJUCKS
const nunjucks = require('nunjucks')
    nunjucks.configure("wiews", {
        
    })


// Criando uma rota raiz '/'
server.get("/", function(req, res){
    return res.sendFile(__dirname + '/index.html')
})

server.get("/ideias", function(req, res){
    return res.sendFile(__dirname + '/ideias.html')
})

// Colocando server para rodar na porta 3000
server.listen(3000)