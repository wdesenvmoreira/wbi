const ctrlUsuarios = require('../controller/controllerUsuarios')
const passport = require('passport')

const rotaUsuario = (app) =>{
    app.get('/usuarios', (req,res)=>{
        console.log('req.local: ', req.local)
        console.log('req.session: ', req.session)
        res.render('Usuarios/usuarios')
    })
    app.get('/usuarios/todos', async(req, res) => {
        const busca = await ctrlUsuarios.findAll()	
        res.json(busca)
    })

    app.get('/usuarios/:id',async(req, res) => {
        const busca = await ctrlUsuarios.findById(req.params.id)
        res.json(busca)
    })

    app.get('/usuarios/usuario/:user', async(req, res) => {
        console.log('user: ',req.params.user)
        let usuario = await ctrlUsuarios.verificarUsuario(req.params.user)
        console.log('usuario por nome? ', usuario)

        res.json(usuario)
    })

    app.post('/usuarios/incluir', async(req, res) => {

        const incluir = await ctrlUsuarios.create(req.body)

        if(incluir == 'Duplicado'){
            res.send('Usuário já cadastrado.')
        }else{
            res.json({"inclusão":incluir})
        }
        
    })

    app.delete('/usuarios/delete/:id',async(req, res) => {
        const deletar = await ctrlUsuarios.deletar(req.params.id)
        if(deletar){          
           res.json(deletar) 
        }else{
            res.send('Registro não deletado. ')
        }
        
    })

    app.post('/usuarios/alterar/:id', async(req, res)=>{
        let alterar = await ctrlUsuarios.update(req.params.id, req.body)
        if(alterar){
            res.json(alterar)
        }else{
            res.send('Registro não alterado. ')
        }
   })
  
//    app.post('/usuarios/acessar',async(req, res, next)=>{
//        console.log('antes do passsport')
//    await passport.authenticate('local', { 
//                                     successFlash : "Hey, Welcome back",
//                                     successRedirect: '/usuarios/todos',
//                                     failureRedirect: '/',
//                                     failureFlash: false ,
//                                 session:true}
                                    
//                                 )
//    }
   
//  )
app.post('/usuarios/acessar', 
passport.authenticate('local', { failureRedirect: '/' }),
function(req, res) {
  res.redirect('/principal');
});
}


module.exports = rotaUsuario