const ctrlUW = require('../controller/controllerUsuarioWbi')
const ctrlUsuarios = require('../controller/controllerUsuarios')


const rotasUW = (app)=>{

    // Verifica Se o WBI esta vinculado a algum usuário 
    app.get('/uwind/:id',async(req, res)=>{

        let usuarios = await ctrlUsuarios.listarUsuarios()
        let uwind = await ctrlUW.listarByInd(req.params.id)

        let retorno = []
        
            usuarios.forEach( user  => {

                if(uwind.length ===0){
                    retorno.push({
                        id_usuario: user.id, 
                        usuario: user.usuario,
                        checkd: false
                    })  
                }else{
                    uwind.forEach(w =>{
                   

                        if(user.id === w.id_usuario){
                            retorno.push({
                                id_usuario: user.id, 
                                usuario: user.usuario,
                                checkd: true
                                }) 
                            }else{
                                retorno.push({
                                    id_usuario: user.id, 
                                    usuario: user.usuario,
                                    checkd: false
                                })  
                                }  
                    })
                }
                
            
            });  
 
        
        
        res.json(retorno)
    })

    app.get('/uw/:id',async(req, res)=>{
        let retorno = await ctrlUW.listaWbiUsuario(req.params.id)
        res.json(retorno)
    })

    app.put('/uw/alterar',async(req, res)=>{
        let retorno = await ctrlUW.alterar(req.body.id, req.body)
        res.json(retorno)
    })
}

module.exports = rotasUW