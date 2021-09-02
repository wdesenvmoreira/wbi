const Knex =  require('knex')

//Inserindo itens na tabela 
exports.seed = async function (knex) {
   return await knex('indicadores').insert([
	   {nome: 'Nome Indicador', titulo:'titulo Indicador', dados: 'select * from usuario', width:'400', height:'300', chartType:'LineChart', options:'{{intervals:{style:"sticks"}, legend:"none"}}' }
   ])
           
            
}