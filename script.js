/*
1. Importa JSON das cores dos tipos - OK
2. Puxar JSON do pokemon solicitado
3. Editar as informações da div a partir das informações recebidas
4. Colocar na tela
5. Editar posição a partir da adição de mais divs
*/

import colorType from "./colorType.json" with { type: "json"};

async function buscarPokemon() {
  try{
    const pokemonName = document.getElementById("pokeInput").value.toLowerCase();
    const resposta1 = await fetch(`https://pokeapi.deno.dev/pokemon/${pokemonName}`);
    const resposta2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if(!resposta1.ok){
      throw new Error ("Pokémon não encontado na primeira API");
    }
    if(!resposta2.ok){
      throw new Error ("Pokémon não encontado na segunda API")
    }

    const dadosGerais = await resposta1.json();
    const alturaEPeso = await resposta2.json();
    const container = document.getElementById("mainArea");

    const card = document.createElement("div"); //Cria um elemento div na constante card
    card.classList.add("card"); //adiciona a classe card nessa div

    const tipoPrincipal = dadosGerais.types[0]; //No caso do pokémon ter dois tipos ele puxa só o primeiro para atribuir a cor do card
    const cor = colorType[tipoPrincipal];
    card.style.backgroundColor = cor;

    card.innerHTML = `
    <h3 id="pokeName">${dadosGerais.name}</h3>
    <div class="cardContent">
      <img src="${dadosGerais.imageUrl}" id="pokeImage">
      <div class="pokeInfo">
        <p>Vida: ${dadosGerais.stats.HP}</p>
        <p>Tipo: ${dadosGerais.types.join(", ")}</p> 
        <p>Altura: ${alturaEPeso.height / 10} metros</p>
        <p>Peso: ${alturaEPeso.weight / 10} kg</p>
      </div>
    </div>`
    // o .join(", ") é usado para unir todos os elementos de um array em uma string

    container.prepend(card); //o .prepend insere elementos no inicio do elemento-pai, tornando-o o primeiro filho

    } catch (erro){
    console.error(erro);
  }
}

document.getElementById("mostrarCard").addEventListener("click", buscarPokemon);