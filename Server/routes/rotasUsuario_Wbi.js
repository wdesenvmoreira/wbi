const ctrlUW = require('../controller/controllerUsuarioWbi')

const rotasUW = (app)=>{

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