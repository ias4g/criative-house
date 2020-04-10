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

    const dt = new Date()

    const d = dt.getDate()
    const m = dt.getMonth()
    const yyyy = dt.getFullYear()

    const days = d < 10 ? `0${d}`:d
    const moths = m < 10 ? `0${m}`:m
    const fullDate = `${days}/${moths}/${yyyy}`

    //--------------------------------------------------------

    const hs = dt.getHours()
    const mm = dt.getMinutes()
    const ss = dt.getSeconds()

    const hours = hs < 10 ? `0${hs}`:hs
    const minutes = mm < 10 ? `0${mm}`:mm
    const seconds = ss < 10 ? `0${ss}`:ss
    const fullHours = `${hours}:${minutes}:${seconds}`

    const created = `${fullDate} às ${fullHours}`

    //Inserindo dados na tabela
    const query = `
        INSERT INTO ideas (
            image,
            title,
            category,
            description,
            link,
            createdAt
        ) VALUES (?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
        created
    ]

    db.run(query, values, function(err){
        if (err){
            console.log(err)
            return res.send('Erro ao tentar fazer a seleção no banco de dados - ' + err)
        }
        
        return res.redirect('/')
    })
})

// Colocando server para rodar na porta 3000
server.listen(3000)