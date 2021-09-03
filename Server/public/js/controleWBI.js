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
    
        dados = await axios.get(`http://localhost:5412/wbi/${busca}`)
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
                            <a onclick="setarWBIAlterar(${wbi.id})" data-toggle="modal" data-target="#modalEditar">
                                <i class="material-icons prefix">apps</i> 
                            </a>
                        </td>
                        <td >
                        <a onclick="lista(${wbi.id})" data-toggle="modal" data-target="#modalWBIUsuario">
                        <i class="small material-icons">insert_chart</i>
                        </a>
                    </td>
                        <td><a onclick="deletarWBI(${wbi.id})"><i class="material-icons prefix">delete</i></a></td>`
                    
        corpoTabela.appendChild(tr)
        
    })
    tabelaWBI.style.display = 'block'
}


async function  setarWBIAlterar(id){
    let divMsg  = document.getElementById('divMsg')
    divMsg.innerText=""
    let formEdicaoWBI = document.getElementById('formEdicaoWBI')
    formEdicaoWBI.reset() 

    let dadosbusca = await buscarWBI(id)
    let dados = dadosbusca[0]
    
    formEdicaoWBI.id.value = id
    formEdicaoWBI.nome.value = dados.nome
    formEdicaoWBI.titulo.value = dados.titulo
    formEdicaoWBI.width.value = dados.width
    formEdicaoWBI.height.value = dados.height
    formEdicaoWBI.dados.value = dados.dados
    formEdicaoWBI.options.value = dados.options
    formEdicaoWBI.chartType.value = dados.chartType



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
    let retorno = await axios.delete(`http://localhost:5412/wbi/delete/${id}`)
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


async function alteracaoWBI(){
      let formEdicaoWBI = document.getElementById('formEdicaoWBI')
      let id      = formEdicaoWBI.id.value
      let nome    = formEdicaoWBI.nome.value 
      let titulo  = formEdicaoWBI.titulo.value 
      let width   = formEdicaoWBI.width.value 
      let height  = formEdicaoWBI.height.value 
      let dados   = formEdicaoWBI.dados.value 
      let options = formEdicaoWBI.options.value 
      let chartType = formEdicaoWBI.chartType.value 
    
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

   
     let retorno = await axios.post(`http://localhost:5412/wbi/alterar`, wbi)
     .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    console.log('retorno da alteração: ', retorno)
    if(retorno==1){
        
        // document.getElementById(`edicaoUsuario${id}`).checked=edicao
        M.toast({html: `<span class='blue red-4' >Registro ${id} Alterado com sucesso</span>`, classes: 'rounded'});
        
        
        
        $('#modalEditar').modal('hide')
        limpartabela()
        preencherTabela(id)
         
    }else{
        M.toast({html: `<span class='red dark-4 text-blue text-blue-dark-4' >Erro ao Alterar o Registro ${id}. Verifique </span>`, classes: 'rounded'});
       // limpartabela()
       // preencherTabelaUsuarios(id)
    }
    
}

async function lista (id){

    console.log('lista',id)

    const ListaUsuarios = document.getElementById('ListaUsuarios')
    
    
    sairPainelUW()

    while (ListaUsuarios.childElementCount >0) {
        ListaUsuarios.removeChild(ListaUsuarios.children[0])
    }

    let retorno = await axios.get(`http://localhost:5412/uwind/${id}`)
    .then(response => response.data)
    .catch( (error)=> {
        throw error.response.data
    })
    console.log('retorno: ', retorno);
  
    if(retorno.length > 0){
         
        retorno.forEach(uw => {
            const p = document.createElement('p')
            console.log('usuario:', uw.usuario,'checkd:', uw.checkd)
            let ckd =''
             if(uw.checkd ){ckd = 'checked'}
            p.innerHTML = `
                            <label>
                                <input id=${uw.id_usuario} type="checkbox" class="filled-in" ${ckd} />
                                <span>${uw.usuario}</span>
                            </label>
                            
                        `
                        ListaUsuarios.appendChild(p)
        })
        
    }else{
        M.toast({html: `<span class='purple darken-4 text-blue-dark-4' >Não há WBI para esse usuario. </span>`,  classes: 'rounded'});
    }
}
async function listarWBIUsuarios(id){console.log('listarWBIUsuarios')
    const ListaUsuarios = document.getElementById('ListaUsuarios')
    
    
    sairPainelUW()

    while (ListaUsuarios.childElementCount >0) {
        ListaUsuarios.removeChild(ListaUsuarios.children[0])
    }

    let retorno = await axios.get(`http://localhost:5412/uwind/${id}`)
    // .then(response => response.data)
    // .catch( (error)=> {
    //     throw error.response.data
    // })
    console.log('retorno: ', retorno);
  
    if(retorno.length > 0){
         
        retorno.forEach(uw => {
            const p = document.createElement('p')
            console.log('usuario:', uw.usuario,'checkd:', uw.checkd)
            p.innerHTML = `
                            <label>
                                <input id=${uw.id} type="checkbox" class="filled-in" checked="${uw.checkd}" />
                                <span>${uw.usuario}</span>
                            </label>
                            
                        `
                        ListaUsuarios.appendChild(p)
        })
        
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

function listarWBIUsuarios(){

}

