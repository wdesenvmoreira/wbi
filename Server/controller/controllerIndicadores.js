const knex = require('../database/connection') // Onde connection é o arquivo de conexão dentro da pasta database
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const localStrategy = require('passport-local').Strategy 
const passport = require('passport')

const findAll = async() =>{
    
    try {
        return await knex('indicadores').select('id', 'nome', 'titulo', 'dados', 'chartType', 'width', 'height', 'options')
    } catch (error) {
        return error
    }
    
} 

// Pesquisa usuario por  sua id. 
const findById = async(id) =>{
    try {
           const registro = knex('indicadores')
                            .where('id', id)
                            .select('id', 'usuario', 'edicao')
                            .first()     
            return registro
    } catch (error) {
        return error
    }
      
   
}

// Irá verificar se o usuario existe através da id do usuario ou do nome do usuário. 
// Caso digite um valor que seja inteiro a pesquisa será por id utilizando a função findByUsuario senão a pesquisa será por nome de ususario . 
const findByUsuario = async(usuario) => {
    console.log('findByIndicadores')
    if(usuario / 1 || usuario == 0){
        console.log('busca por inteiro')
        let user = []
        user.push(await findById(usuario))
        return user
         
    }else{
        try {
            usuario = usuario.trim()
            return await knex('indicadores')
            .where('usuario', 'like', `%${usuario}%`)
        
        } catch (error) {
            return error
        }
    }
}


// Irá verificar se o usuario existe através da id do usuario ou do nome do usuário. 
// Caso digite um valor que seja inteiro a pesquisa será por id utilizando a função findByUsuario senão a pesquisa será por nome de ususario . 
const verificarIndicador = async(indicador) => {
    console.log('usuario em verifricarusuario: ', indicador)
    try {
         const verificacao = await knex('indicadores')
        .where('nome', 'like', `%${indicador}%`)
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

   const indicadorExiste = await verificarIndicador(novosdados.indicadorExiste)
    if (!usuarioExiste) {
        try {
            const salt = bcrypt.genSaltSync()
            novosdados.senha = bcrypt.hashSync(novosdados.senha, salt)
            console.log('senha hash: ', novosdados.senha)   
            const ids = await knex('usuarios').insert({
            ...novosdados
        }) 
        // return ids ? true : false
        return ids
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
    if(id != 1){
        try {
        return await knex('usuarios')
                        .where({ id })
                        .del()
        } catch (error) {
            return error
        }
    }else{
        return {"msg":'Este Usuario não pode ser excluido!'}
    }
    

}

const acessar = async(usuario, senha) => {
    console.log('usuario no acessar: ', usuario)
    passport.use(new localStrategy({usernameField:'usuario'}, {passwordField:'senha'}, (usuario, senha, done) => {
        console.log('usuario no passport: ', usuario)
       verificarIndicador(usuario).then((usuario) => {
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
module.exports = { findAll, findById, create, deletar, update, findByUsuario, acessar, verificarIndicador}