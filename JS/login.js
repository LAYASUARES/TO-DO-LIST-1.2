//Usarei o Fetch que é uma API do JS baseada em promises, que funciona para tratarmos requisições HTTP, e consiguimos transformar a resposta dele em um json, usando o metodo Json
//Função que é chamada quando o nosso window carregar
const init = function () {
     //Validações do email 
     const validacaoEmail = function (event) {
          const input = event.currentTarget;
          const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          const testEmail = regex.test(input.value);

          if (!testEmail) {
               botaoSubmit.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               botaoSubmit.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     //Validações da Senha
     const validacaoSenha = function (event) {
          const input = event.currentTarget;

          if (input.value.length < 8) {
               botaoSubmit.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               botaoSubmit.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     //Seleciono meus elementos
     let inputEmail = document.getElementById("inputEmail");
     let inputPassword = document.getElementById("inputPassword");
     let botaoSubmit = document.querySelector('button[type="submit"]'); //Duvida nesta linha porque n deu certo o querySelector só na minha class

     //Validações
     inputEmail.addEventListener("input", validacaoEmail);
     inputPassword.addEventListener("input", validacaoSenha);

     //Salvar os dados do JWT no LocalStorage 
     const salvarDados = function (type) {
          localStorage.setItem("jwt", type);
          location.href = "tarefas.html"//Direciona para proxima página
     }


     //Interação e Sistema pra erro
     const errorSistema = function () {
          botaoSubmit.setAttribute('disabled', true);
          //alert("Por favor, indique um e-mail e Senha valido ou Crie um agora"); 

          Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'E-mail ou senha incorreta!',
               timer: 4000
          })
     }


     //API
     if (botaoSubmit) {
          botaoSubmit.addEventListener("click", function (event) {
               event.preventDefault();

               fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users/login", {//Sendo um post significa que precisamos enviar alguma coisa a nossa api
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         email: inputEmail.value,
                         password: inputPassword.value
                    })
               }).then(function (response) {//este é o metodo que usamos para passar uma função de callback que será chamada somente quando a promise do fetch for resolvida com sucesso

                    if (response.status == 400 || response.status == 404 || response.status == 500) {
                         return errorSistema();
                    } else {
                         return response.json();
                    }

               }).then(function (data) {
                    salvarDados(data.jwt)
               }).catch(function () {
                    errorSistema();
               })
          })
     }
}
window.onload = init;



