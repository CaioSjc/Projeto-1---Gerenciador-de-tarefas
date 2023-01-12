const modal = document.getElementById("modal")
const closeButton = document.getElementById("closeButton")

function openModal() {
  modal.style.display = "block"
}

function closeModal() {
  modal.style.display = "none"
  location.reload()
}

closeButton.addEventListener("click", closeModal,)

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal()
  }
})

const passandoTarefa = (tarefas) => {
    const tarefaContent = document.getElementById('tarefas')
    tarefaContent.innerHTML = ''
  
    tarefas.forEach((tarefa) => {
      let classe = "concluida" 
        if (tarefa.status==="Em Processo") {
        classe="emProcesso"
        }else if (tarefa.status==="Stopped") {
        classe="stopped"
        }
      tarefaContent.innerHTML = tarefaContent.innerHTML + `
              <tr>
              <td>${tarefa.ordemNumerica}</td>
              <td data-title="Descrição" style = "max-width:80px" class="quebraLinha" >${tarefa.descrição}</td>
              <td data-title="Data de Entrega">${tarefa.data}</td>
              <td data-title="Status" class="${classe}" >${tarefa.status}</td>
              <td data-title="Ação" class="containerAcao"><button onclick="apagarTarefa(${tarefa.id})" class="buttonsLixeira"><img href="lixeira.svg"/></button><button onclick="editarTarefa(${tarefa.id})" class="buttonsEditar"><i class="fa-sharp fa-solid fa-pencil fa-flip" style="color: #F8B04E; font-size: 24px;"></i></button>
              <div id="item-${tarefa.id}">
              <div>
              <button onclick="expandir(${tarefa.id})" class="buttonExpandir">
              <i class="fa-regular fa-square-caret-down fa-flip" style="--fa-flip-x: 1; --fa-flip-y: 0; font-size: 26px; color: #8d8d8d;"></i>
              </button>
              </div>
              <div id="resposta" class="descricao none">
              <label class="labelAnota">Anotações <br> da <br> tarefa:</label>
              <br> 
              <textarea id="anotacao-${tarefa.id}" name="anota" class="inputAnota" >${tarefa. anota ? tarefa.anota: ''} </textarea>
              <button onclick="saveAnotacao(${tarefa.id})" class="salvarAnotacao">Salvar <br> Anotação <br> <img class="tick" src="tick-1.svg"/></button>
              </div>
              </div>
              </td>
              </tr>
      `
    })
  }

const getTarefas = async () => {  
  const apiResponse = await fetch("http://localhost:3000/Tarefas")
  const tarefas = await apiResponse.json()
  passandoTarefa(tarefas)
}

const saveTarefa = async (tarefa) => {
  await fetch("http://localhost:3000/Tarefas", {
      method: "POST",
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "ordemNumerica": tarefa.ordemNumerica,
          "descrição": tarefa.descrição,
          "data": tarefa.data,
          "status": tarefa.status,
      })
  });    
}

const addTarefa = async (tarefa) => { 
  if (!savEditTarefa) {
    await saveTarefa(tarefa)
  } else {await updateTarefa(savEditTarefa.id,tarefa)
  }
closeModal()
}
  
const form = document.getElementById('subscribe');

  if(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const ordemNumerica = form.elements ['ordemNumerica'].value
      const descrição = form.elements['descrição'].value
      const data = form.elements['data'].value
      const status = form.elements['status'].value
  
      addTarefa({ ordemNumerica, descrição, data, status })  
    })
  }

let savEditTarefa = null

const editarTarefa = async (id) => {
    savEditTarefa = await getEditar(id)
    document.getElementById('ordemNumerica').value = savEditTarefa.ordemNumerica
    document.getElementById('descrição').value = savEditTarefa.descrição
    document.getElementById('data').value = savEditTarefa.data
    document.getElementById('status').value = savEditTarefa.status
    openModal()
}

const getEditar = async (id) => {  
  const apiResponse = await fetch(`http://localhost:3000/Tarefas/${id}`)
  let mudarTarefa = await apiResponse.json()
  return mudarTarefa
}


const updateTarefa = async (id, tarefa ) => {
  await fetch(`http://localhost:3000/Tarefas/${id}`, {
      method: "PUT",
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(tarefa)
  })
}

//Apaga tarefa do json.
const apagarTarefa = async (id) => {
  await fetch(`http://localhost:3000/Tarefas/${id}`, {
      method: 'DELETE'
  })
  getTarefas()
}

//Habilita botão de salvar somente após todos os campos de input serem preenchidos.
function habilitButton() {
   const ordemNumerica = document.querySelector('#ordemNumerica').value;
   const descrição = document.querySelector('#descrição').value;
   const data = document.querySelector('#data').value;
   const status = document.querySelector('#status').value;

   if (ordemNumerica && descrição && data && status) {
    document.querySelector('#salvar').disabled = false;
    return
   }
   document.querySelector('#salvar').disabled = true;
}

//Muda a classe ao clicar no botão.
const checkbox = document.getElementById('checkbox')

function saveDark() {
  document.body.classList.toggle('dark')
}

checkbox.addEventListener('change', () => {
 saveDark();

 localStorage.removeItem('dark');

 if(document.body.classList.contains('dark')) { 
  localStorage.setItem('dark', 1);
  }
})

//resgata a preferencia escolhida do tema do usuario
function recarregaTema() {
  const darkmod = localStorage.getItem('dark')

  if(darkmod) {
    saveDark();
  }
}
recarregaTema();

//expande conteúdo do botão ao clicar no botão.
function expandir(itemId) {
  const divItem = document.getElementById(`item-${itemId}`)
  const descricao = divItem.querySelector('.descricao')

  if (descricao.classList.contains('none')) {
      descricao.classList.remove('none')
      descricao.classList.add('block')
      window.scrollBy(0, 150, window.innerHeight)

  } else if (descricao.classList.contains('block')) {
      descricao.classList.remove('block')
      descricao.classList.add('none')

  }
}

async function  saveAnotacao (itemId) {
  const anota  = document.getElementById(`anotacao-${itemId}`).value
  const buscarAnotacao = await getEditar(itemId)
  updateTarefa(itemId, {anota, ...buscarAnotacao});
  setTimeout(function() {
    window.location.reload(1);
  }, 3000); //  3 segundos
}

document.getElementById("lupa").addEventListener("click", pesquisar);

function pesquisar(){
  let coluna = "1";
  let filtrar, tabela, tr, td, th, i;
  
  filtrar = document.getElementById("buscar");
  filtrar = filtrar.value.toUpperCase();

  tabela = document.getElementById("tab");
  tr = tabela.getElementsByTagName("tr");
  th = tabela.getElementsByTagName("th");

  for (i = 0; i < tr.length; i++) {

    td = tr[i].getElementsByTagName("td") [coluna];

    if (td){

    if (td.innerHTML.toUpperCase().indexOf(filtrar) > -1){

      tr[i].style.display = "";

    }else{

      tr[i].style.display = "none";
    }
    }
  }
}