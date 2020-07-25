const ctrlUW = require('../controller/controllerUsuarioWbi')

const rotasUW = (app)=>{

    app.get('/uw/:id',async(req, res)=>{
        let retorno = await ctrlUW.listaWbiUsuario(req.params)
        res.json(retorno)
    })
}

module.exports = rotasUW