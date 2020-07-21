const Knex =  require('knex')

//Inserindo itens na tabela 
exports.seed = async function (knex) {
   return await knex('indicadores_usuarios').insert([
	   {id_usuario: 1, id_indicador:1, incluir: true, editar: true, excluir: true }
   ])
           
            
}