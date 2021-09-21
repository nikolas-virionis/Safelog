let id = JSON.parse(sessionStorage.getItem('usuario')).id;
axios.post(`/usuario/perfil`,{
    id
}).then((resposta)=>{
    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
    nomeCompletoPerfil.innerHTML = resposta.data.resultado[0][0].nome;
    emailPerfil.innerHTML = resposta.data.resultado[0][0].email;
    responsavelPerfil.innerHTML = resposta.data.resultado[0][0].supervisor;
    empresaPerfil.innerHTML = resposta.data.resultado[0][0].empresa;
    nomeCompletoPerfil.innerHTML = resposta.data.resultado[0][0].nome;


    console.log(response)
}).catch(function (error) {
      console.error(`Erro na obtenção das publicações: ${error.message}`);
});


// fetch(`/usuario/perfil/${id}`)
//     .then((resposta) => {
//         if (resposta.ok) {
//             resposta.json().then(function (resposta) {
//                 console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
//                 nomeCompletoPerfil.innerHTML = resposta[0][0].nome;
//                 emailPerfil.innerHTML = resposta[0][0].email;
//                 responsavelPerfil.innerHTML = resposta[0][0].supervisor;
//                 empresaPerfil.innerHTML = resposta[0][0].empresa;
//                 nomeCompletoPerfil.innerHTML = resposta[0][0].nome;
//             });
//         } else {
//             console.error("Nenhum dado encontrado ou erro na API");
//             return;
//         }
//     })
//     .catch(function (error) {
//         console.error(`Erro na obtenção das publicações: ${error.message}`);
//     });
