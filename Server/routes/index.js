const rotasUsuarios = require('./rotasUsuario')
const rotasUW = require('./rotasUsuario_Wbi')
const rotasWBI = require('./rotasWBI')
const rotasAuth = require('./routerAuth')
const rotasLogout = require('./rotasLogout')
const rotasPrincipal = require('./rotasPrincipal')

const jwt = require('jsonwebtoken');
const jwtSecret = 'secreta'



const rotas = (app) =>{
    
    app.get('/', (req, res)=>{
        res.render('login', {message:''})
    }) 
    rotasLogout(app)
    rotasAuth(app)

   rotasPrincipal(app)
   rotasWBI(app)
   rotasUsuarios(app)
   rotasUW(app)

}

module.exports = rotas