const knex = require('../database/connection')



const listaWbiUsuario = async(id) => {
    return await knex.select('indicadores_usuarios.id','usuario', 'id_indicador', 'incluir', 'editar', 'excluir', 'nome', 'titulo').from('indicadores')
        .leftJoin('indicadores_usuarios', 'indicadores.id', 'indicadores_usuarios.id_indicador')
       // .innerJoin('usuarios', 'usuarios.id','=','indicadores_usarios.id_usuario' )
        .leftJoin('usuarios', 'usuarios.id', 'indicadores_usuarios.id_usuario')
        //.leftJoin('usuarios', 'usuarios.id', 'indicadores_usuarios.id_usuario')
        .where('usuarios.id',id)

}

const alterar = async(id, dados) => {   
    try {
        return await knex('indicadores_usuarios')
                .where({ id })
                .update({...dados})
    } catch (error) {
        return error
    }
}

module.exports={ listaWbiUsuario, alterar}                   