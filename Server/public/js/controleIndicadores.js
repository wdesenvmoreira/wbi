async function buscarIndicadores(busca){
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

async function preencherTabelaIndicadores(busca){
    const tabelaIndicadores = document.getElementById('tabelaIndicadores')
    const corpoTabela = document.getElementById('corpoTabela')
    let dados = await buscarIndicadores(busca)

    sairPainelUW()

    dados.forEach(usuario => {
        const tr = document.createElement(`tr`)
        tr.setAttribute('id',usuario.id)
        tr.innerHTML = `<td>${usuario.id}</td>
                        <td>${usuario.usuario}</td>
                        <td>
                            <div class="switch">
                                <label>
                                    Não
                                    <input id="edicaoUsuario${usuario.id}" onclick="alterarUsuario(${usuario.id})"  type="checkbox">
                                    <span class="lever"></span>
                                    Sim
                                </label>
                            </div>
                         </td>
                         <td onclick="listarUW(${usuario.id})"><a><i class="material-icons prefix">apps</i></a></td>
                        <td><a onclick="deletarUsuario(${usuario.id})"><i class="material-icons prefix">delete</i></a></td>`
                    
        corpoTabela.appendChild(tr)
        document.getElementById(`edicaoUsuario${usuario.id}`).checked = usuario.edicao
    })
    tabelaIndicadores.style.display = 'block'
}



function limpartabela(){
    let tbody = document.getElementById('corpoTabela')
    while (tbody.childElementCount >0) {
        tbody.removeChild(tbody.children[0])
    }
    //document.getElementById('tabelaIndicadores').style.display = 'none'
}

document.getElementById("pesquisaIndicadores").addEventListener("input", ()=>{
    limpartabela()
    preencherTabelaIndicadores(document.getElementById("pesquisaIndicadores").value)
});



let gravar = document.getElementById('gravar')

gravar.addEventListener('click',async(event)=>{
    event.preventDefault()
    let usuario = document.getElementById('usuario').value
    let senha   = document.getElementById('senha').value
    let edicao  = document.getElementById('edicao').checked
    console.log('doc edição: ', document.getElementById('edicao').checked)
    console.log(' edição: ', edicao)
    let divMsg  = document.getElementById('divMsg')

    let retorno

    usuario =usuario.trim()
    senha = senha.trim()
    //edicao = edicao.trim()

    if(usuario != '' && usuario != undefined ){
        if(senha != '' && senha != undefined ){
                //document.getElementById('formUsuario').submit()
                retorno = await axios.post(`http://localhost:5412/indicadores/incluir`,{usuario,senha,edicao})
                console.log('retorno: ', retorno.data)
                if(retorno.data!='Duplicado'){
                    M.toast({html: `<span class='blue red-4' >Registro ${retorno.data[0]} incluído com sucesso</span>`, classes: 'rounded'});
                    limpartabela()
                    preencherTabelaIndicadores(retorno.data[0])
                   
                    $('#modalIncluir').modal('hide')
                }else{
                    divMsg.innerText=`Usuário ${usuario} Já Cadastrado.`
                    M.toast({html: `<span class='blue red-dark-4' >Usuário ${usuario}, já esta cadastrado.</span>`, classes: 'rounded'});
                }
        }else{
            divMsg.innerText='Senha deve ser informado.'
        }
    }else{
        divMsg.innerText='Usuário deve ser informado.'
    }
})

function limparFormulario(){
    let divMsg  = document.getElementById('divMsg')
    divMsg.innerText=""
    document.getElementById('formUsuario').reset() 
}

async function deletarUsuario(id){
    let retorno = await axios.delete(`http://localhost:5412/indicadores/delete/${id}`)
    .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno deletar: ', retorno)
    if(retorno==1){
        M.toast({html: `<span class='blue red-4' >Registro ${id} deletado com sucesso</span>`, classes: 'rounded'});
        limpartabela()
        preencherTabelaIndicadores()
    }else{
        M.toast({html: `<span class='blue red-4' >${retorno}</span>`, classes: 'rounded'});
    }
    
}

async function alterarUsuario(id){
    let edicao = document.getElementById(`edicaoUsuario${id}`).checked
    console.log('edição antes: ', edicao)
    
    let indicadores ={
        id: id,
        edicao: edicao
    }
    console.log('id: ', id)
    console.log('edicao: ', edicao)
    console.log('alteração Indicadores: ', indicadores)
     let retorno = await axios.post(`http://localhost:5412/indicadores/alterar`, indicadores)
     .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno da alteração: ', retorno)
    if(retorno==1){
        // document.getElementById(`edicaoUsuario${id}`).checked=edicao
        M.toast({html: `<span class='blue red-4' >Registro ${id} Alterado com sucesso</span>`, classes: 'rounded'});
        // limpartabela()
        // preencherTabelaIndicadores(id)
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaIndicadores(id)
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
   

    
    // let Indicadores ={
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
        // preencherTabelaIndicadores(id)
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaIndicadores(id)
    }
    
}

function sairPainelUW(){
    let conteudoUW = document.getElementById('conteudoUW')
    let tabelaUW =document.getElementById('tabelaUW') 

    conteudoUW.style.display = 'none'
    tabelaUW.style.display = 'none'
}


