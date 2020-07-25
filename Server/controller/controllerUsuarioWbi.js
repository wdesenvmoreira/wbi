const knex = require('../database/connection')



const listaWbiUsuario = async(id) => {
    return await knex.select('*').from('indicadores')
        .leftJoin('indicadores_usuarios', 'indicadores.id', 'indicadores_usuarios.id_indicador')
        .leftJoin('usuarios', 'usuarios.id', 'indicadores_usuarios.id_usuario')
        //.leftJoin('usuarios', 'usuarios.id', 'indicadores_usuarios.id_usuario')
        
       // .where('usuario.id',id)

}

module.exports={ listaWbiUsuario}                   