const jwt = require('jsonwebtoken')
const jwtSecret = 'secreta'
const bcrypt = require('bcryptjs')
const crtlUsuario = require('../controller/controllerUsuarios')
const rotasAuth = (app) => {

    app.post('/API/login', async(req, res) =>{
        
        try {

            if(req.body.username.length === 0){
                res.render('login',{message:'Necessário informar um usuário.'})
            }
            else
            {
               if(req.body.password.length === 0){
                        res.render('login',{message:'Necessário informar a senha.'})
                    }else{
                        const user = await crtlUsuario.findUsuario(req.body.username);
                    
                        if(user.length === 0){
                            res.render('login',{message:'Usuário não existe.'})
                        }
                        else
                        {
                                const isValid = bcrypt.compareSync(req.body.password, user[0].senha)
                                console.log('isValid:' , isValid)
                            if(isValid){
                                const payload = {
                                id: user[0].id,
                                username: user[0].usuario,
                                edicao: user[0].edicao

                                }
                                jwt.sign(payload, jwtSecret, (err, token)=>{
                                    req.session.token = token;
                                    res.render('Acessou')
                                })
                                
                            }else
                                res.render('error',{success: false, message:'Problemas no acesso. '}) 
                        }
                    }
                    
            
             }
    
        } catch (error) {
             console.log(error);
             
        }
        
    })
    
}



module.exports = rotasAuth;