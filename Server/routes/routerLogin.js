const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('./routerAuth')

router.get('/', (req, res)=>{
   res.render('login', {message:''})
})
router.get('/principal',(req, res) => {
    res.render('menuInicial')
})

router.get('/login',  (req, res, next) =>{
    if(req.query.fail)
        res.render('newlogin', {message: 'Usuario e/ou senha inválidos'});
        else
        res.render('newlogin', {message: 'Acessando'});
        
        next()
})

router.post('/', passport.authenticate('local', {
    successRedirect:'/menuprincipal',
    failureRedirect:'/newlogin?fail=true'
}))

module.exports = router;