async function buscarWBI(busca){
    let dados
    
    console.log('busca antes: ', busca)
    
   if(busca/1 || busca==0 && !busca.match(/^(\s)+$/) && busca !=''){
       console.log('é número')
       busca = busca
   }else{
   
        if(busca == '' || busca == undefined ||busca.match(/^(\s)+$/)){
            busca = 'todos'
        }
    }
    console.log('busca?depois> ', busca)
    
        dados = await axios.get(`http://localhost:5412/indicadoresapi/${busca}`)
        .then(response => {
           
            return response.data
        })
        .catch(error => {
            console.log(error)
            return error            
        })
    
        return dados
}

async function preencherTabela(busca){
    const tabelaWBI = document.getElementById('tabelaWBI')
    const corpoTabela = document.getElementById('corpoTabela')
    let dados = await buscarWBI(busca)
    console.log('dados: ',dados);
    sairPainelUW()

   await dados.forEach(wbi => {
        const tr = document.createElement(`tr`)
        tr.setAttribute('id',wbi.id)
        tr.innerHTML = `<td>${wbi.id}</td>
                        <td>${wbi.nome}</td>
                        <td>${wbi.titulo}</td>
                        <td>${wbi.dados}</td>
                        <td>${wbi.width}</td>
                        <td>${wbi.height}</td>
                        <td>${wbi.chartType}</td>
                        <td>${wbi.options}</td>
                         <td >
                            <a onclick="setarWBIAlterar(${wbi.id})" data-toggle="modal" data-target="#modalAlterar">
                                <i class="material-icons prefix">password</i> 
                            </a>
                        </td>
                       
                         <td onclick="listarUW(${wbi.id})"><a><i class="material-icons prefix">apps</i></a></td>
                        <td><a onclick="deletarWBI(${wbi.id})"><i class="material-icons prefix">delete</i></a></td>`
                    
        corpoTabela.appendChild(tr)
        
    })
    tabelaWBI.style.display = 'block'
}


function setarWBIlterar(id,wbi){
    let idAlterar = document.getElementById('idWBIAlterar')
    let wbiAlterar = document.getElementById('wbiAlterar')
    wbiAlterar.innerText = wbi
    idAlterar.value = id;
}

function limpartabela(){
    let tbody = document.getElementById('corpoTabela')
    while (tbody.childElementCount >0) {
        tbody.removeChild(tbody.children[0])
    }
    //document.getElementById('tabelawbis').style.display = 'none'
}

document.getElementById("pesquisaWBI").addEventListener("input", ()=>{
    limpartabela()
    preencherTabela(document.getElementById("pesquisaWBI").value)
});



let gravar = document.getElementById('gravar')

gravar.addEventListener('click',async(event)=>{console.log('gravando.')
    event.preventDefault()
    let nome = document.getElementById('nome').value
    let titulo   = document.getElementById('titulo').value
    let dados  = document.getElementById('dados').value
    let width = document.getElementById('width').value
    let height = document.getElementById('height').value
    let chartType = document.getElementById('chartType').value
    let options = document.getElementById('options').value
    
    let divMsg  = document.getElementById('divMsg')

    let retorno

    nome  = nome.trim()
    titulo = titulo.trim()
    dados = dados.trim()
    width = width.trim()
    height = height.trim()
    chartType = chartType.trim()
    options = options.trim()

    if(nome != '' && nome != undefined ){
        if(titulo != '' && titulo != undefined ){
                //document.getElementById('formwbi').submit()
                retorno = await axios.post(`http://localhost:5412/wbi/incluir`,{nome, titulo, dados, width, height, chartType, options})
                console.log('retorno: ', retorno.data)
                if(retorno.data!='Duplicado'){
                    M.toast({html: `<span class='blue red-4' >Registro ${retorno.data[0]} incluído com sucesso</span>`, classes: 'rounded'});
                    limpartabela()
                    preencherTabela(retorno.data[0])
                   
                    $('#modalIncluir').modal('hide')
                }else{
                    divMsg.innerText=`WBI ${nome} Já Cadastrado.`
                    M.toast({html: `<span class='blue red-dark-4' >WBI ${nome}, já esta cadastrado.</span>`, classes: 'rounded'});
                }
        }else{
            divMsg.innerText='Título deve ser informado.'
        }
    }else{
        divMsg.innerText='Nome deve ser informado.'
    }
})

function limparFormulario(){
    let divMsg  = document.getElementById('divMsg')
    divMsg.innerText=""
    document.getElementById('formWBI').reset() 
}

async function deletarWBI(id){
    let retorno = await axios.delete(`http://localhost:5412/indicadoresapi/delete/${id}`)
    .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno deletar: ', retorno)
    if(retorno==1){
        M.toast({html: `<span class='blue red-4' >Registro ${id} deletado com sucesso</span>`, classes: 'rounded'});
        limpartabela()
        preencherTabela()
    }else{
        M.toast({html: `<span class='blue red-4' >${retorno}</span>`, classes: 'rounded'});
    }
    
}

async function alterarWBI(id){
    
    let wbi ={
        id: id,
       nome: nome,
       titulo: titulo, 
       dados: dados,
       width : width,
       height : height,
       chartType: chartType,
       options : options
    }
    console.log('id: ', id)
    console.log('edicao: ', edicao)
    console.log('alteração wbis: ', wbi)
     let retorno = await axios.post(`http://localhost:5412/indicadoresapi/alterar`, wbi)
     .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno da alteração: ', retorno)
    if(retorno==1){
        // document.getElementById(`edicaoUsuario${id}`).checked=edicao
        M.toast({html: `<span class='blue red-4' >Registro ${id} Alterado com sucesso</span>`, classes: 'rounded'});
        // limpartabela()
        // preencherTabelaUsuarios(id)
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaUsuarios(id)
    }
    
}

async function alteracaoWBI(){

    let nome = document.getElementById('nome').value
    let titulo   = document.getElementById('titulo').value
    let dados  = document.getElementById('dados').value
    let width = document.getElementById('width').value
    let height = document.getElementById('height').value
    let chartType = document.getElementById('chartType').value
    let options = document.getElementById('options').value
    
    let wbi ={
        id: id,
       nome: nome,
       titulo: titulo, 
       dados: dados,
       width : width,
       height : height,
       chartType: chartType,
       options : options
    }

   
     let retorno = await axios.post(`http://localhost:5412/indicadoresapi/alterar`, wbi)
     .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno da alteração: ', retorno)
    if(retorno==1){
        // document.getElementById(`edicaoUsuario${id}`).checked=edicao
        M.toast({html: `<span class='blue red-4' >Registro ${id} Alterado com sucesso</span>`, classes: 'rounded'});
        // limpartabela()
        // preencherTabelaUsuarios(id)
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaUsuarios(id)
    }
    
}


async function listarUW(id){
    const conteudoUW = document.getElementById('conteudoUW')
    let corpoTabela = document.getElementById('corpoTabelaUW')
    
    sairPainelUW()

    while (corpoTabela.childElementCount >0) {
        corpoTabela.removeChild(corpoTabela.children[0])
    }

    const retorno = await axios.get(`http://localhost:5412/uw/${id}`)
    .then(response => response.data)
    .catch( (error)=> {
        throw error.response.data
    })

    if(retorno.length > 0){
        let cabecalhoUW = document.getElementById('cabecalhoUW')
        cabecalhoUW.innerText = retorno[0].usuario
        let tabelaUW =document.getElementById('tabelaUW') 

        
        
       

        retorno.forEach(uw => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                            <td>${uw.id_indicador}</td>
                            <td class="container">${uw.nome}</td>
                            <td class="container">${uw.titulo}</td>
                            <td>
                                <div class="switch">
                                    <label>
                                        Não
                                        <input id="incluirwbi${uw.id}" onclick="alterarUW(${uw.id},1)"  type="checkbox">
                                        <span class="lever"></span>
                                        Sim
                                    </label>
                                </div>
                             </td>
                             <td>
                             <div class="switch">
                                 <label>
                                     Não
                                     <input id="editarwbi${uw.id}" onclick="alterarUW(${uw.id},2)" type="checkbox">
                                     <span class="lever"></span>
                                     Sim
                                 </label>
                             </div>
                          </td>
                          <td>
                          <div class="switch">
                              <label>
                                  Não
                                  <input id="excluirwbi${uw.id}" onclick="alterarUW(${uw.id},3)" type="checkbox">
                                  <span class="lever"></span>
                                  Sim
                              </label>
                          </div>
                       </td>
                        `
                        
            corpoTabela.appendChild(tr)
            document.getElementById(`incluirwbi${uw.id}`).checked = uw.incluir
            document.getElementById(`editarwbi${uw.id}`).checked = uw.editar
            document.getElementById(`excluirwbi${uw.id}`).checked = uw.excluir
        })
        conteudoUW.style.display = 'block'
        tabelaUW.style.display = 'block'
    }else{
        M.toast({html: `<span class='purple darken-4 text-blue-dark-4' >Não há WBI para esse usuario. </span>`,  classes: 'rounded'});
    }
}

async function alterarUW(id, op){
    let uwbi = {
    }
    uwbi.id = id
  
    switch (op) {
        case 1:
           let incluir = document.getElementById(`incluirwbi${id}`).checked
           uwbi.incluir = incluir
            break;
        case 2:
            let editar = document.getElementById(`editarwbi${id}`).checked
           uwbi.editar = editar
        break;
        case 3:
            let excluir = document.getElementById(`excluirwbi${id}`).checked
            uwbi.excluir = excluir
                break;
        default:
            break;
    }
   

    
    // let usuarios ={
    //     id, incluir, editar, excluir
    // }

    console.log('id: ', id)
    console.log('wbi: ', uwbi)
     let retorno = await axios.put(`http://localhost:5412/uw/alterar`, uwbi)
     .then(response => response.data)
     .catch((error) => {
      throw error.response.data
    })
    console.log('retorno da alteração: ', retorno)
    if(retorno==1){
        // document.getElementById(`edicaoUsuario${id}`).checked=edicao
        M.toast({html: `<span class='blue red-4' >Registro ${id} Alterado com sucesso</span>`, classes: 'rounded'});
        // limpartabela()
        // preencherTabelaUsuarios(id)
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaUsuarios(id)
    }
    
}

function sairPainelUW(){
    let conteudoUW = document.getElementById('conteudoUW')
    let tabelaUW =document.getElementById('tabelaUW') 

    conteudoUW.style.display = 'none'
    tabelaUW.style.display = 'none'
}


