// Usando o EXPRESS para criar e configurar o servidor
const express = require('express')
const server = express()

const db = require('./db')

// Configurando arquivos estáticos como styles, scripts e images
server.use(express.static("public"))

//Habilitando o usode req.body
server.use(express.urlencoded({ extended: true }))

// Configurando o NUNJUCKS
const nunjucks = require('nunjucks')
    nunjucks.configure("views", {
        express: server,
        noCache: true
    })


// Criando uma rota raiz '/'
server.get("/", function(req, res){
    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send('Erro ao tentar fazer a seleção no banco de dados - ' + err)
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for(let idea of reversedIdeas){
            if(lastIdeas.length < 2){
                lastIdeas.push(idea)
            }
        }

        return res.render('index.html', { ideas: lastIdeas })
    })
})

server.get("/ideias", function(req, res){
    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err){
            console.log(err)
            return res.send('Erro ao tentar fazer a seleção no banco de dados - ' + err)
        }
        const reversedIdeas = [...rows].reverse()
        return res.render('ideias.html', { ideas: reversedIdeas })
    })
})

server.post("/", function(req, res){
    //return res.send("dados recebidos pelo metodo POST")
    //Inserindo dados na tabela
    const query = `
        INSERT INTO ideas (
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err){
        if (err){
            console.log(err)
            return res.send('Erro ao tentar fazer a seleção no banco de dados - ' + err)
        }
        
        return res.redirect('/ideias')
    })
})

// Colocando server para rodar na porta 3000
server.listen(3000)