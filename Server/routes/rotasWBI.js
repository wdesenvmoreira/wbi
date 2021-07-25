const rotasUW = require("./rotasUsuario_Wbi")
const jwt = require('jsonwebtoken')
const jwtSecret = 'secreta'

const rotasWBI = (app) => {
    app.use(async(req, res, next)=>{
        const token = req.session.token;

        if(token){
            try {
                const payload = jwt.verify(token, jwtSecret)
                if(payload.edicao = 2){
                  next();  
                }else{
                    console.log('Não possui permissão para acessar esta pagina. Retornando para : ',req.headers.host+'\\'+req.path)
                   res.redirect(req.headers.host+'\\'+req.path);
                }
                
            } catch (error) {
                res.render('login',{message: 'Erro ao tentar verificar o token. '});
            }
        }else{
           
            res.render('login',{message: 'Realize o login. Não possui Token'})
        }
    });

    app.get('/wbi', (req, res) => {
        res.render('WBI/wbi')
    })


}

module.exports = rotasWBI