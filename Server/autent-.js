const bcrypt = require('bcryptjs');
const crtlUsuario = require('./controller/controllerUsuarios')

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
   console.log('Acessando o autent.')
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done)=>{
        try {
            const user = crtlUsuario.findById(id);
            done(null, user);
        } catch (error) {
            console.log(error);
            return done(error, null);
        }
    })
console.log('passando aqui');
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async(username, password, done)=>{
        try {

            const user = await crtlUsuario.findUsuario(username);
            if(!user) return done(null, false);

            let senha = user[0].senha;
           await bcrypt.compare(password, user[0].senha);
            const isVAli = crtlUsuario.verificaSenha(username, password);
            console.log('isVali: ', isValid);
          const isValid = bcrypt.compare(password, senha, (erro, batem) => {
            if(batem){

                return true
            }else{
                return false
            }
        })
            isValid = senha === password
            if(!isValid) return done(null, false);
            return done(null, user);

        } catch (error) {
            console.log(error);
            done(error, false )
        }
    }));

}

