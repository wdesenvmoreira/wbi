const rotasUsuarios = require('./rotasUsuario')
const rotasUW = require('./rotasUsuario_Wbi')
const rotasWBI = require('./rotasWBI')

const rotas = (app) =>{

    app.get('/',(req, res) => {
        res.render('login')
    })

    
    app.get('/principal',(req, res) => {
        res.render('menuInicial')
    })

   rotasUsuarios(app)
   rotasUW(app)
   rotasWBI(app)


}

module.exports = rotas