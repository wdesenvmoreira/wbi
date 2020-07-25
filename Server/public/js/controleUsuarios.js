async function buscarUsuarios(busca){
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
    
        dados = await axios.get(`http://localhost:5412/usuariosapi/${busca}`)
        .then(response => {
           
            return response.data
        })
        .catch(error => {
            console.log(error)
            return error            
        })
    
        return dados
}

async function preencherTabelaUsuarios(busca){
    const tabelaUsuarios = document.getElementById('tabelaUsuarios')
    const corpoTabela = document.getElementById('corpoTabela')
    let dados = await buscarUsuarios(busca)
    console.log('dados: ', dados)
    
    dados.forEach(usuario => {
        const tr = document.createElement('tr')
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
                        <td><a onclick="deletarUsuario(${usuario.id})"><i class="material-icons prefix">delete</i></a></td>`
                    
        corpoTabela.appendChild(tr)
        document.getElementById(`edicaoUsuario${usuario.id}`).checked = usuario.edicao
    })
    tabelaUsuarios.style.display = 'block'
}



function limpartabela(){
    let tbody = document.getElementById('corpoTabela')
    while (tbody.childElementCount >0) {
        tbody.removeChild(tbody.children[0])
    }
    //document.getElementById('tabelaUsuarios').style.display = 'none'
}

document.getElementById("pesquisaUsuarios").addEventListener("input", ()=>{
    limpartabela()
    preencherTabelaUsuarios(document.getElementById("pesquisaUsuarios").value)
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
                retorno = await axios.post(`http://localhost:5412/usuarios/incluir`,{usuario,senha,edicao})
                console.log('retorno: ', retorno.data)
                if(retorno.data!='Duplicado'){
                    M.toast({html: `<span class='blue red-4' >Registro ${retorno.data[0]} incluído com sucesso</span>`, classes: 'rounded'});
                    limpartabela()
                    preencherTabelaUsuarios(retorno.data[0])
                   
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
    let retorno = await axios.delete(`http://localhost:5412/usuarios/delete/${id}`)
    .then(response => response.data)
    .catch((error) => {
      throw error.response.data
    })
    if(retorno==1){
        M.toast({html: `<span class='blue red-4' >Registro ${id} deletado com sucesso</span>`, classes: 'rounded'});
        limpartabela()
        preencherTabelaUsuarios()
    }
    
}

async function alterarUsuario(id){
    let edicao = document.getElementById(`edicaoUsuario${id}`).checked
    console.log('edição antes: ', edicao)
    
    let usuarios ={
        id: id,
        edicao: edicao
    }
    console.log('id: ', id)
    console.log('edicao: ', edicao)
    console.log('alteração usuarios: ', usuarios)
     let retorno = await axios.post(`http://localhost:5412/usuarios/alterar`, usuarios)
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



