async function buscarPokemon() {
  try{
    const resposta = await fetch('https://pokeapi.deno.dev/pokemon/mewtwo');
    const dados = await resposta.json();
    console.log(dados);

    const imagem = document.getElementById("pokeImage");
    imagem.src = dados.imageUrl;
  } catch (erro){
    console.error(erro);
  }
  
}



buscarPokemon();