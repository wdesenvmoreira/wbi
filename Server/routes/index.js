const rotasUsuarios = require('./rotasUsuario')

const rotas = (app) =>{

    app.get('/',(req, res) => {
        res.render('home')
    })

    
    app.get('/principal',(req, res) => {
        res.render('menuInicial')
    })

   rotasUsuarios(app)


}

module.exports = rotas