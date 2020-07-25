const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const rotas = require('./routes')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('./config/auth')(passport)

const app = express()
const port = 5412
//Iniciando a sessão. 


app.use(session({
    secret: 'palavrasecreta',
    resave: true, 
    saveUninitialized: true,

}))

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//Configurando o connect-flash
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Criando variais global para mensagens
// app.use((req, res) => {
//     res.locals.success_msg =  req.flash("success_msg")
//     res.locals.error_msg =  req.flash("error_msg")
//     res.locals.error =  req.flash('error')
//     res.locals.user =  req.user || null
    
// })



app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000);

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};

app.use(allowCrossDomain);
app.use(cors({ credentials: true }));


rotas(app)
app.listen(port, () => {
    console.log(`Iniciado servidor na porta: ${port} appserver`);
});




