const ctrlUsuarios = require('../controller/controllerUsuarios')
const ctrlUW = require('../controller/controllerUsuarioWbi')
const passport = require('passport')

const rotaUsuario = (app) =>{
    app.get('/usuarios', (req,res)=>{
        console.log('req.local: ', req.local)
        console.log('req.session: ', req.session)
        res.render('Usuarios/usuarios')
    })
    app.get('/usuarios/todos/', async(req, res) => {
        const busca = await ctrlUsuarios.findAll()	
        res.json(busca)
    })

    app.get('/usuarios/:id/',async(req, res) => {
        console.log('req.params.id: ',req.params.id)
        const busca = await ctrlUsuarios.findById(req.params.id)
        res.json(busca)
    })

    app.get('/usuarios/usuario/:user', async(req, res) => {
        console.log('user: ',req.params.user)
        let usuario = await ctrlUsuarios.verificarUsuario(req.params.user)
        console.log('usuario por nome? ', usuario)

        res.json(usuario)
    })
    app.get('/usuariosapi/:user', async(req, res) => {
        let usuario 
        
        if(req.params.user == 'todos'){
             usuario = await ctrlUsuarios.findAll(req.params.user)
        }else{
             usuario = await ctrlUsuarios.findByUsuario(req.params.user)
             
        }
        res.json(usuario)
    })

    app.post('/usuarios/incluir', async(req, res) => {
        //req.body.edicao=='Sim'?req.body.edicao=true:req.body.edicao=false
        console.log('req.body: ', req.body)
        const usuario = { ...req.body}
        console.log('usuario depois: ',usuario)
        const incluir = await ctrlUsuarios.create(usuario)

            console.log('retorno incluir: ',incluir)
            res.json(incluir)
        
        
    })



    app.delete('/usuarios/delete/:id',async(req, res) => {
        const deletar = await ctrlUsuarios.deletar(req.params.id)
        if(deletar==1){          
           res.json(deletar) 
        }else{
            res.json(deletar.msg)
        }
        
    })

//     app.post('/usuarios/alterar/:id', async(req, res)=>{
//         let alterar = await ctrlUsuarios.update(req.params.id, req.body)
//         if(alterar){
//             res.json(alterar)
//         }else{
//             res.send('Registro não alterado. ')
//         }
//    })
  
app.post('/usuarios/alterar', async(req, res)=>{
    console.log('req.body altearar: ', req.body)
    let alterar = await ctrlUsuarios.update(req.body.id, req.body)
    if(alterar){
        res.json(alterar)
    }else{
        res.send('Registro não alterado. ')
    }
})

   app.post('/usuarios/acessar',
    passport.authenticate('local', { 
                                        successFlash : "Hey, Welcome back",
                                        successRedirect: '/usuarios/todos',
                                        failureRedirect: '/',
                                        failureFlash: false ,
                                     }),(req, res)=>{
                                         res.locals.user = req.user
                                         console.log('dentro do req local user: ', res.locals.user)
                                         //console.log('dentro do res: ', res)
                                         
                                    res.render('login')
                                }
                                    
                        
   
   
    )


}




module.exports = rotaUsuario