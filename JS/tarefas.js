let nomeUsuarioReference = document.querySelector("#nomeUsuario");
let idUsuario;
let emailUsuario;
let tarefasPendentesReference = document.querySelector(".tarefas-pendentes")
let tarefasFinalizadasReference = document.querySelector(".tarefas-terminadas")
let finalizarSessaoReference = document.querySelector("#closeApp")
let criarTarefaReference = document.querySelector("#criaTarefa")
let inputTarefaReference = document.querySelector("#novaTarefa")
let notDoneReference = document.querySelector(".not-done");
let refreshReference = document.querySelector(".refresh");


function acessoNaoAutorizado() {
    localStorage.removeItem("jwt")
    location.href = "index.html"
}


let requestConfiguration = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("jwt")
    }
}

fetch("https://ctd-todo-api.herokuapp.com/v1/users/getMe", requestConfiguration).then(function (response) {

    if (response.ok) {

    } else {
        if (response.status === 401) {
            return acessoNaoAutorizado()
        }
    }
    response.json().then(function (data) {
        //console.log(data)
        let nomeCompleto = data.lastName;
        nomeUsuarioReference.innerHTML = nomeCompleto;
        idUsuario = data.id;
        emailUsuario = data.email;
    })
}
)


function getTasks() {
    fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", requestConfiguration).then(function (response) {
        response.json().then(function (data) {
            //console.log(data)
            renderTasks(data)
        })
    })
}
getTasks()

function logOutUser() {
    Swal.fire({
        title: 'Deslogar',
        text: "Quer realmente deslogar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deslogar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                localStorage.removeItem("jwt"),
                location.href = "index.html"
            )
        }
    })
}


finalizarSessaoReference.addEventListener("click", function (event) {
    event.preventDefault()

    logOutUser()
})

criarTarefaReference.addEventListener("click", function (event) {
    event.preventDefault()

    let task = {
        description: inputTarefaReference.value,
        completed: false
    }

    let requestConfigurationPost = {

        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("jwt")
        },
        method: "POST",
        body: JSON.stringify(task)

    }

    fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", requestConfigurationPost).then(function (response) {
        response.json().then(function (tasks) {
            console.log("Success:", task);
            location.reload()
        })
    })
});

let configuracaoPutAutorizado = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("jwt")
    },
    method: "PUT",
    body: JSON.stringify({
        completed: true
    })
}

let configuracaoalterarStatus = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("jwt")
    },
    method: "PUT",
    body: JSON.stringify({
        completed: false
    })
}

function alterarStatus(id) {

    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, configuracaoalterarStatus).then(function (response) {
        if (response.ok) {
            setTimeout(100)
            getTasks()
            //console.log(response)
        }
    })
}


function updateTask(id) {

    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, configuracaoPutAutorizado).then(function (response) {
        if (response.ok) {
            setTimeout(100)
            getTasks()
            //console.log(response)
        }
    })
}

let configuracaoDeleteAutorizado = {
    headers: {
        "Authorization": localStorage.getItem('jwt')
    },
    method: "DELETE",
}

function deleteTask(id) {

    Swal.fire({
        title: 'Quer realmente excluir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, Deletar!'

    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, configuracaoDeleteAutorizado).then(function (response) {
                if (response.ok) {
                    getTasks()
                    //console.log(response)
                }
            })
            Swal.fire(
                'Excluido!',
                'Tarefa excluida com sucesso!',
                'success')
        }
    })
}

function renderTasks(tasks) {

    tarefasPendentesReference.innerHTML = '';
    tarefasFinalizadasReference.innerHTML = '';

    for (task of tasks) {

        let dataF = Date.parse(task.createdAt)
        let dataCerta = new Date(dataF)
        let dataFormatada = dataCerta.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

        if (task.completed == false) {
            tarefasPendentesReference.innerHTML += `    
                    <div>
                        <li class="tarefa">
                            <div class="not-done" onclick="updateTask(${task.id})"></div>
                            <div class="descricao">
                                <p class="nome">${task.description}</p>
                                <p class="timestamp">Criada em: ${dataFormatada}</p>
                            </div>
                                <img onclick="deleteTask(${task.id})" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABfUlEQVRoge2YoU4DQRCG/7mro+Wuvjg8JCXhHRC8BAmmtRCqQEIguIoqPMEhEPAKfQECDgvljuLIDYYmFO56O+zS5ch8ZsU/sztf9tYcoCiK4hNyuVl/d3gAxv6sGmY+6p6s7bk605mAyfATXEoYCVye3W8gywYAWi4ONeCBQdubW8tXZYWB0XbzHR4AWgQemBSaCcx3+AlLJkWmAn8W0SPu7wz5twb5TOe4bTxX5W9ABXxTeYGaTfNo9II0fUW0uIC42fiWJckYABBH9dy8qFeC1Q0kyRhZluH5Y9CvGTODmQvzol4JVgLMPLXmZWV5Xiah8m9ABXyjAr5RAd+ogG9UwDcq4BsV8I0K+MZKgIim1rysLM/LJFgJxFEdQUCIonpuRkQgKs6LeiVY/ZWIm43CPwqzMpPcFOkNpNYnlpNIimUCjBtR/U9gvpaUiwQ4C3sAHkUDSfYHPaFGPUmPSKB7unobvIUrIJzD7eeUgvmCQl7vHLbvHO6rKP+ed2yBftABMd1OAAAAAElFTkSuQmCC" />
                        </li>
                    </div>`
        } else {

            let dataF = Date.parse(task.createdAt)
            let dataCerta = new Date(dataF)
            let dataFormatada = dataCerta.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

            tarefasFinalizadasReference.innerHTML += `    
            <div>
            <li class="tarefa">
                <div class="done" onclick="updateTask(${task.id})"></div>
                <div class="descricao">
                    <p class="nome">${task.description}</p>
                    <p class="timestamp">Criada em: ${dataFormatada}</p>
                </div>
                <img onclick="alterarStatus(${task.id})" src="./assets/refresh.png" width="40em" height="40em"/>
                <img onclick="deleteTask(${task.id})" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABfUlEQVRoge2YoU4DQRCG/7mro+Wuvjg8JCXhHRC8BAmmtRCqQEIguIoqPMEhEPAKfQECDgvljuLIDYYmFO56O+zS5ch8ZsU/sztf9tYcoCiK4hNyuVl/d3gAxv6sGmY+6p6s7bk605mAyfATXEoYCVye3W8gywYAWi4ONeCBQdubW8tXZYWB0XbzHR4AWgQemBSaCcx3+AlLJkWmAn8W0SPu7wz5twb5TOe4bTxX5W9ABXxTeYGaTfNo9II0fUW0uIC42fiWJckYABBH9dy8qFeC1Q0kyRhZluH5Y9CvGTODmQvzol4JVgLMPLXmZWV5Xiah8m9ABXyjAr5RAd+ogG9UwDcq4BsV8I0K+MZKgIim1rysLM/LJFgJxFEdQUCIonpuRkQgKs6LeiVY/ZWIm43CPwqzMpPcFOkNpNYnlpNIimUCjBtR/U9gvpaUiwQ4C3sAHkUDSfYHPaFGPUmPSKB7unobvIUrIJzD7eeUgvmCQl7vHLbvHO6rKP+ed2yBftABMd1OAAAAAElFTkSuQmCC" />
            </li>
        </div>`
        }
    }
}