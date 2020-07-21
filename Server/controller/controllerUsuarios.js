const knex = require('../database/connection') // Onde connection é o arquivo de conexão dentro da pasta database
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const localStrategy = require('passport-local').Strategy 
const passport = require('passport')

const findAll = async() =>{
    
    try {
        return await knex('usuarios').select('*')
    } catch (error) {
        return error
    }
    
} 

const findById = async(id) =>{
    try {
           const registro = knex('usuarios')
                            .where('id', id)
                            .first()     
            return registro
    } catch (error) {
        return error
    }
}

const findByUsuario = async(usuario) => {
    try {
        return knex('usuarios')
        .where('usuario', 'like', `%${usuario}%`)
      
    } catch (error) {
        return error
    }
}

const verificarUsuario = async(usuario) => {
    
    try {
         const verificacao = await knex('usuarios')
        .where('usuario', usuario)
        .first()  
        return verificacao
    } catch (error) {
        return error
    }
}

const verificaSenha = (usuario, senha) =>{
    let senhaHash = knex('usuarios').where({usuario}).select('senha')
    console.log('dentro do verificar senha a senha: ', senhaHash)
    return bcrypt.compareSync(senha, senhaHash)
}
const create = async(novosdados) => {   

   const usuarioExiste = await verificarUsuario(novosdados.usuario)
    if (!usuarioExiste) {
        try {
            const salt = bcrypt.genSaltSync()
            novosdados.senha = bcrypt.hashSync(novosdados.senha, salt)
            console.log('senha hash: ', novosdados.senha)   
            const ids = await knex('usuarios').insert({
            ...novosdados
        }) 
        return ids ? true : false
    } catch (error) {
        console.log('Error: ', error)
        return error
    }
   } else {
       return 'Duplicado'
   }
  
}

const update = async(id, dados) => {   
    try {
        return await knex('usuarios')
                .where({ id })
                .update({...dados})
    } catch (error) {
        return error
    }
}

const deletar = async(id) =>{

    try {
        return await knex('usuarios')
                        .where({ id })
                        .del()
    } catch (error) {
        return error
    }

}

const acessar = async(usuario, senha) => {
    console.log('usuario no acessar: ', usuario)
    passport.use(new localStrategy({usernameField:'usuario'}, {passwordField:'senha'}, (usuario, senha, done) => {
        console.log('usuario no passport: ', usuario)
       verificarUsuario(usuario).then((usuario) => {
           console.log('usuario no verificar: ', usuario)
               if(!usuario){
                   return done(null, false, {message: "Usuario não existe"})
               }
               bcrypt.compare(senha, usuario.senha, (erro, correto) => {
                   console.log('correto: ', correto)
                   if(correto){
                       return done(null, usuario)
                   }else{
                       return done(null, false, {message: "Senha incorreta"})
                   }
               })
           })
       }))
    //senhahasheada = (encodepassword, senha) => bcrypt.compareSync(senha, encodePassword)
}
module.exports = { findAll, findById, create, deletar, update, findByUsuario, acessar, verificarUsuario}