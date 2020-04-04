// Usando o EXPRESS para criar e configurar o servidor
const express = require('express')
const server = express()

const db = require('./db')

// const ideas = [

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//         title: "Cursos de programação",
//         category: "Estudos",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//         title: "Exercícios",
//         category: "Saúde",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//         title: "Meditação",
//         category: "Mentalidade",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//         title: "Karaokê",
//         category: "Diversão em familia",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729038.svg",
//         title: "Pinturas",
//         category: "Criatividades",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729048.svg",
//         title: "Recortes",
//         category: "Criatividades",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//         url: "https://www.github.com/Ias4g"
//     }
// ]

// Configurando arquivos estáticos como styles, scripts e images
server.use(express.static("public"))

// Configurando o NUNJUCKS
const nunjucks = require('nunjucks')
    nunjucks.configure("views", {
        express: server,
        noCache: true
    })


// Criando uma rota raiz '/'
server.get("/", function(req, res){
    db.all(`SELECT* FROM ideas`, function(err, rows){
        if (err) return console.log(err)

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
    db.all(`SELECT* FROM ideas`, function(err, rows){
        if (err) return console.log(err)
        const reversedIdeas = [...rows].reverse()
        return res.render('ideias.html', { ideas: reversedIdeas })
    })
})

// Colocando server para rodar na porta 3000
server.listen(3000)