/*
Feito:
1. Importa JSON das cores dos tipos
2. Puxar JSON do pokemon solicitado
3. Editar as informações da div a partir das informações recebidas
4. Colocar na tela
5. Editar posição a partir da adição de mais divs
6. limitar a 9 cards não repetidos
7. Impedir duplicados
8. Implementar botão de deleteAll
9. Implementar tradução de tipos (inglês => port)
10. Implementação de melhor interface mobile
A fazer: 

11. Ajustar interface e animações
*/

import colorType from "../data/colorType.json" with { type: "json"};
import typeTranslation from "../data/typeTranslation.json" with { type: "json"};

const pokemonsAtivos = new Set(); //cria um conjunto vazio (tem que ser fora para não ser zerado sempre que chamar um novo)

async function buscarPokemon() {
  try{
    const pokemonName = document.getElementById("pokeInput").value.toLowerCase();


    // verifica se está duplicado
    if (pokemonsAtivos.has(pokemonName)){
      alert("Esse pokémon já está na lista!");
      return;
    }

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
    const container = document.getElementById("cardsContainer");
    pokemonsAtivos.add(pokemonName); //adiciona o nome do pokemon na lista daqueles na página

    const card = document.createElement("div"); //cria um elemento div na constante card

    card.classList.add("card"); //adiciona a classe card nessa div

    const tipoPrincipal = dadosGerais.types[0]; //No caso do pokémon ter dois tipos ele puxa só o primeiro para atribuir a cor do card
    const cor = colorType[tipoPrincipal];
    card.style.backgroundColor = cor;

    //Tradução do tipo
    const tiposTraduzidos = dadosGerais.types.map(tipo => {
      return typeTranslation[tipo] || tipo;
    })

    card.innerHTML = `
      <div class="cardHeader">
        <h3 class="pokeName">${dadosGerais.name}</h3>
        <button class="btnCloseTab">X</button>
      </div>
      <div class="cardContent">
        <img src="${dadosGerais.imageUrl}" id="pokeImage">
        <div class="pokeInfo">
          <p>Vida: ${dadosGerais.stats.HP}</p>
          <p>Tipo: ${tiposTraduzidos.join(", ")}</p> 
          <p>Altura: ${alturaEPeso.height / 10} metro(s)</p>
          <p>Peso: ${alturaEPeso.weight / 10} kg</p>
        </div>
      </div>`
    // o .join(", ") é usado para unir todos os elementos de um array em uma string
    
    //Botões de delete
    const btnClose = card.querySelector(".btnCloseTab")
    btnClose.addEventListener("click", () =>{
      pokemonsAtivos.delete(pokemonName); //deleta o nome da lista
      card.remove();
    });

    const btnCloseAll = document.getElementById("btnCloseAll");
    btnCloseAll.addEventListener("click", () => {
      container.innerHTML = "";
      pokemonsAtivos.clear();
    });

     container.prepend(card); //o .prepend insere elementos no inicio do elemento-pai, tornando-o o primeiro filho

    //Limite de 9 cards
    if(container.children.length >= 9){
      const ultimoCard = container.lastElementChild;
      const nomeRemovido = ultimoCard.querySelector(".pokeName").textContent.toLowerCase();

      pokemonsAtivos.delete(nomeRemovido);
      ultimoCard.remove();
    }
    
    } catch (erro){
    console.error(erro);
  }
}

document.getElementById("mostrarCard").addEventListener("click", buscarPokemon);