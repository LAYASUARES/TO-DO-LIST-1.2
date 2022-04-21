const init = function () {

     //Validação do Nome e Apelido
     const validacaoNome = function (event) {
          const input = event.currentTarget;
          const regex = /[^a-zà-ú]/gi;
          const testNome = regex.test(input.value);//Validado para qualquer tamanho de um unico nome, não aceita números

          if (testNome || !inputNome) {
               submitButton.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               submitButton.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     //Validação do Apelido
     const ValidacaoApelido = function (event) {
          const input = event.currentTarget;
          const regex = /([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){25,30}/;
          const testApelido = regex.test(input.value);//Validado um caractere especial ou numero

          if (testApelido || !inputApelido) {
               submitButton.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               submitButton.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     //Validação do Email
     const validacaoEmail = function (event) {
          const input = event.currentTarget;
          const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          const testEmail = regex.test(input.value);

          if (!testEmail) {
               submitButton.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               submitButton.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     //Validação da Senha e Repetir Senha
     const validacaoSenha = function (event) {
          const input = event.currentTarget;

          if (input.value.length < 8 || input.value == "") {
               submitButton.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               submitButton.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     const validacaoSenha2 = function (event) {
          const input = event.currentTarget;

          if (inputPassword2.value !== inputPasswordRepeat.value) {
               submitButton.setAttribute('disabled', true);
               input.nextElementSibling.classList.add("error");
          } else {
               submitButton.removeAttribute('disabled');
               input.nextElementSibling.classList.remove("error");
          }
     }

     let inputNome = document.getElementById("inputNome");
     let inputApelido = document.getElementById("inputApelido");
     let inputEmail = document.getElementById("inputEmail");
     let inputPassword2 = document.getElementById("inputPassword2");
     let inputPasswordRepeat = document.getElementById("inputPasswordRepeat");
     let submitButton = document.querySelector('.botao-submit');

     //Validações
     inputNome.addEventListener("input", validacaoNome);
     inputApelido.addEventListener("input", ValidacaoApelido);
     inputEmail.addEventListener("input", validacaoEmail);
     inputPassword2.addEventListener("input", validacaoSenha);
     inputPasswordRepeat.addEventListener("input", validacaoSenha2);

     //Salvar os dados do JWT no LocalStorage 
     const IrPraProximaPagina = function (type) {
          localStorage.setItem("jwt", type);
          location.href = "index.html"//Direciona para proxima página
     }

     //API
     if (submitButton) {
          submitButton.addEventListener("click", function (event) {
               event.preventDefault();

               Swal.fire({//animação
                    icon: 'success',
                    title: 'Conta criada com sucesso!'
               })

               fetch("https://ctd-todo-api.herokuapp.com/v1/users", {//Sendo um post significa que precisamos enviar alguma coisa a nossa api
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         firstName: inputNome.value,
                         lastName: inputApelido.value,
                         email: inputEmail.value,
                         password: inputPassword2.value
                    })
               }).then(function (response) {//este é o metodo que usamos para passar uma função de callback que será chamada somente quando a promise do fetch for resolvida com sucesso
                    return response.json();
               }).then(function (data) {
                    setTimeout(8000)
                    IrPraProximaPagina(data.jwt)
               })
          })
     }
}
window.onload = init;
