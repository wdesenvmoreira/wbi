const ctrlWBI = require('../controller/controllerWBI')
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

    app.post('/wbi/incluir', async(req, res) => {
        //req.body.edicao=='Sim'?req.body.edicao=true:req.body.edicao=false
        console.log('req.body: ', req.body)
        const wbi = { ...req.body}
        console.log('WBI depois: ',wbi)
        const incluir = await ctrlWBI.create(wbi)

            console.log('retorno incluir: ',wbi)
            res.json(incluir)
        
        
    })


}

module.exports = rotasWBI