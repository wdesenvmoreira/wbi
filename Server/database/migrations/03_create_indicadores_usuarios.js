const Knex =  require('knex')

//Criação da tabela. 
exports.up = async function (knex) {
   return await knex.schema
            .createTable('indicadores_usuarios', table => {
                table.increments('id').primary()
                table.integer('id_usuario').notNullable()
                .references('id')
				.inTable('usuarios')
                table.integer('id_indicador').notNullable()
                .references('id')
                .inTable('indicadores')
                table.boolean('incluir')
                table.boolean('editar')
                table.boolean('excluir')
                   
            })
            
}

//deletar a tabela. Desfaz o metodo UP.
exports.down =  async function (knex){
    return await knex.schema
            .dropTable('indicadores_usuarios')
}

