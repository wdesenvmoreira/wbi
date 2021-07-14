const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const rotas = require('./routes')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
var cookieParser = require('cookie-parser');
// require('./config/auth')(passport)
// require('./autent')(passport)

// const loginRouter = require('./routes/routerLogin');

const app = express()
const port = 5412
//Iniciando a sessão. 


app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};

app.use(session({
    secret: 'palavrasecreta',
    resave: false, 
    saveUninitialized: false,
    cookie: {maxAge: 3 * 60 * 1000}

}))

//Configurando o connect-flash
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


rotas(app);
// app.use(bodyParser({extended: true }))
// app.use(bodyParser.json())





//Criando variais global para mensagens
// app.use((req, res) => {
//     res.locals.success_msg =  req.flash("success_msg")
//     res.locals.error_msg =  req.flash("error_msg")
//     res.locals.error =  req.flash('error')
//     res.locals.user =  req.user || null
    
// })







// app.use('/sign', loginRouter);

app.use(allowCrossDomain);
app.use(cors({ credentials: true }));




app.listen(port, () => {
    console.log(`Iniciado servidor na porta: ${port} appserver`);
});




