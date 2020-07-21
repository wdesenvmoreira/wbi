//REalizando login
//Arquivo config/auth.js 
const LocalStrategy = require('passport-local').Strategy 
const bcrypt = require('bcryptjs')
const crtlUsuario = require('../controller/controllerUsuarios')



module.exports= function(passport){
    
    passport.use(new LocalStrategy({
            usernameField: 'usuario',
            passwordField: 'senha'
        },
      (usuario, senha, done)=> {
           crtlUsuario.verificarUsuario(usuario).then((user) => {
               console.log('user da verificação usuario: ', user)
               if(!user){
                   return done(null, false, {message: "Usuario inexistente. "})
               }
               
               bcrypt.compare(senha, user.senha, (erro, batem) => {
                   if(batem){
                       console.log('senha batem: ', batem)
                       console.log('user.senha: ', user.senha)
                       return done(null, user)
                   }else{
                       console.log('não batem: ', batem)
                       return done(null, false, {message: "Senha não encontrada. "})
                   }
               })
           })
        
        }
    ))

    passport.serializeUser((usuario, done) => {
        console.log('serealizeuser', usuario)
        done(null, usuario.id)
    })
    passport.deserializeUser(async(id, done) => {
        console.log('deserializeuser',id)
        await crtlUsuario.findById(id, (err, user) => {
            done(err, user)
        })
    })
}