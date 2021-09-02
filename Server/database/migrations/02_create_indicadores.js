const Knex =  require('knex')

//Criação da tabela. 
exports.up = async function (knex) {
   return await knex.schema
            .createTable('indicadores', table => {
                table.increments('id').primary()
                table.string('nome').notNullable();
                table.string('titulo').notNullable();   
                table.string('dados').notNullable();   
                table.string('width').notNullable();
                table.string('height').notNullable();
                table.string('chartType').notNullable();
                table.string('options').notNullable();
            })
            
}

//deletar a tabela. Desfaz o metodo UP.
exports.down =  async function (knex){
    return await knex.schema
            .dropTable('indicadores')
}

