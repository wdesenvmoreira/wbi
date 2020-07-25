const rotasUsuarios = require('./rotasUsuario')
const rotasUW = require('./rotasUsuario_Wbi')

const rotas = (app) =>{

    app.get('/',(req, res) => {
        res.render('home')
    })

    
    app.get('/principal',(req, res) => {
        res.render('menuInicial')
    })

   rotasUsuarios(app)
   rotasUW(app)


}

module.exports = rotas