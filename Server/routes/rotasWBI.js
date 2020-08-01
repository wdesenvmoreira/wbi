const rotasUW = require("./rotasUsuario_Wbi")

const rotasWBI = (app) => {

    app.get('/wbi', (req, res) => {
        res.render('WBI/wbi')
    })


}

module.exports = rotasWBI