const Knex =  require('knex')

//Inserindo itens na tabela 
exports.seed = async function (knex) {
   return await knex('indicadores').insert([
	   {nome: 'Nome Indicador', titulo:'titulo Indicador', dados: '[dados, 1, 2,]',  }
   ])
           
            
}