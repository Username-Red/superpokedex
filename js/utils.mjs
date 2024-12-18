//function to take an optional object and a template and insert the objects as HTML into the DOM
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  //if there is a callback...call it and pass data
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// function to dynamically load the header and footer into a page
export async function loadHeaderFooter(callback) {
  const headerTemplate = await loadTemplate("partials/header.html");
  const headerElement = document.querySelector("#main-header");
  const footerTemplate = await loadTemplate("partials/footer.html");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  if (callback) {
    callback();
    if (window.location.pathname == "/index.html") {
      search();
    }
    
  }
}

function capitalize(word) {
  let titleWord = word.charAt(0).toUpperCase() + word.slice(1);
  return titleWord;
}

function getPokemon(pokemon) {
  var apiurl = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
  return apiurl
}

export function giveSprite(pkmn) {
  // Start with lugia
  const pkmnurl = getPokemon(pkmn)

  // fetch the url
  fetch(pkmnurl)

  // open the url and convert it to json
  .then((response) => {
      return response.json()
  })


  .then((data) => {
      // Set variables for the fetched image, type and name respectively
      var pokeimage = data.sprites.front_default;
      var poketype = capitalize(data.types[0].type["name"]);
      var pokename = capitalize(data.name);
      
      document.querySelector(".pkmn-img").src = pokeimage;
      document.querySelector(".name").textContent = `${pokename}`
      document.querySelector(".type").textContent = `${poketype}`

  })

}



async function giveSpriteForTeam(pokemonName, imgElement) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon data");
    }

    const data = await response.json();
    imgElement.src = data.sprites.front_default; 
    imgElement.alt = pokemonName; 
  } catch (error) {
    console.error(`Error fetching sprite for ${pokemonName}:`, error.message);
    imgElement.src = ""; 
    imgElement.alt = "Sprite not available";
  }
}


export async function getDesc(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
  .then(response => response.json())
  .then(data => {

    const pokedexEntry = data.flavor_text_entries.find(entry => entry.language.name === 'en');
    // console.log(pokedexEntry.flavor_text);
    document.querySelector(".description").textContent = pokedexEntry.flavor_text;
  });
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min); 
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandom() {
  const randomNum = getRandomIntInclusive(800, 1025);
  giveSprite(randomNum);
  getDesc(randomNum)
}

export function encounterBtn() {
  const encounter = document.querySelector(".encounter-btn");
  encounter.addEventListener("click", generateRandom);
  console.log("Encountered");

}

export function initializeLists() {
  if (!localStorage.getItem("team")) {
    localStorage.setItem("team", JSON.stringify([])); 
  }
  if (!localStorage.getItem("box")) {
    localStorage.setItem("box", JSON.stringify([])); 
  }
}

function addPokemon(name) {
  const team = JSON.parse(localStorage.getItem("team")) || [];
  const box = JSON.parse(localStorage.getItem("box")) || [];

  if (team.length < 6) {
    team.push(name);
    localStorage.setItem("team", JSON.stringify(team));
    console.log(`${name} added to the team!`);
  } 
  else if (team.length >= 6) {
    box.push(name);
    localStorage.setItem("box", JSON.stringify(box)); 
    console.log(`${name} added to the Box!`);
  } else {
    console.log("Some horriffic error has occured");
  }
  
}

export function capture() {
 //select pokemon from pokedex
  const pkmnName = document.querySelector(".name").textContent;
 // when button is clicked, add pokemon to localstorage list of "owned pokemon"
  addPokemon(pkmnName);
}

export function captureBtn() {
  const capBtn = document.querySelector(".capture-btn");
  capBtn.addEventListener("click", capture);
}

export function search() {
  // get the search name from localStorage
  const searchPkmn = localStorage.getItem("search-name");
  giveSprite(searchPkmn);
  getDesc(searchPkmn);
  
}

export function searchbarActivate() {
  // find the search bar
  const searchBar = document.querySelector(".searchBar");
  
  // make sure the search bar is there before continuing to avoid errors
  if (!searchBar) {
    console.error("Search bar element not found!");
    return;
  }

  // add an event listener for when the enter button is pushed
  searchBar.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      // set data to local storage in case you're on the wrong page
      const searchName = searchBar.value;
      localStorage.setItem("search-name", searchName);
      // check if you're on the right page
      if (window.location.pathname != "./index.html") {
        // if you're on the wrong page move to the right page
        window.location.href = "./index.html"
      }
      // or just execute search if you're already there
      else if (window.location.pathname == "/index.html") {
        search();
      }
      
    }
  });
}

export function populateTeam() {
  const teamList = document.querySelectorAll(".team-box .sprite"); 
  
   const teamPokemon = JSON.parse(localStorage.getItem("team")) || [];

  teamList.forEach((pokemonImg, index) => {
    if (index < teamPokemon.length) {
      giveSpriteForTeam(teamPokemon[index], pokemonImg); 
    }
  });
}

async function giveSpriteForBox(pokemonName, container) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon data");
    }

    const data = await response.json();


    const imgElement = document.createElement("img");
    imgElement.src = data.sprites.front_default; 
    imgElement.alt = pokemonName; 
    imgElement.classList.add("sprite"); 

    
    container.appendChild(imgElement);
  } catch (error) {
    console.error(`Error fetching sprite for ${pokemonName}:`, error.message);
  }
}

export function populateBox() {
  const boxContainer = document.querySelector(".pokebox");

  if (!boxContainer) {
    console.error("Pokebox container not found!");
    return;
  }

  boxContainer.innerHTML = "";

  const boxPokemon = JSON.parse(localStorage.getItem("box")) || [];

  boxPokemon.forEach((pokemonName) => {
    giveSpriteForBox(pokemonName, boxContainer);
  });
}

export async function getStats() {
  const types = [];
  let totalHp = 0; 
  let totalAtk = 0;
  let totalSpAtk = 0;
  let totalDef = 0;
  let totalSpDef = 0;
  let totalSpeed = 0;
  // Retrieve and parse the Pokémon team from localStorage
  const pkmnList = JSON.parse(localStorage.getItem("team")) || [];

  // Loop through each Pokémon in the team
  for (const item of pkmnList) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${item}`);
      }
      const data = await response.json();

      // Extract type names and add to the types array
      types.push(...data.types.map(typeInfo => typeInfo.type.name));

      // Add the Pokémon's HP to the total
      totalHp += data.stats.find(stat => stat.stat.name === "hp").base_stat;
      totalAtk += data.stats.find(stat => stat.stat.name === "attack").base_stat;
      totalSpAtk += data.stats.find(stat => stat.stat.name === "special-attack").base_stat;
      totalDef += data.stats.find(stat => stat.stat.name === "defense").base_stat;
      totalSpDef += data.stats.find(stat => stat.stat.name === "special-defense").base_stat;
      totalSpeed += data.stats.find(stat => stat.stat.name === "speed").base_stat;
    } catch (error) {
      console.error(`Error fetching data for ${item}:`, error.message);
    }
  }

  // Update the text content of the <p> tag with the class "types"
  const typesElement = document.querySelector(".types");
  if (typesElement) {
    typesElement.textContent = `Types: ${types.join(", ")}`;
  } else {
    console.error("No element with class 'types' found!");
  }

  // Update the text content of the <p> tag with the class "hp"
  const hpElement = document.querySelector(".hp");
  if (hpElement) {
    hpElement.textContent = `Total HP: ${totalHp}`;
  } else {
    console.error("No element with class 'hp' found!");
  }

  const atkElement = document.querySelector(".atk");
  if (atkElement) {
    atkElement.textContent = `Total ATK: ${totalAtk}`;
  } else {
    console.error("No element with class 'atk' found!");
  }

  const spAtkElement = document.querySelector(".spatk");
  if (spAtkElement) {
    spAtkElement.textContent = `Total Special ATK: ${totalSpAtk}`;
  } else {
    console.error("No element with class 'spatk' found!");
  }

  const defElement = document.querySelector(".def");
  if (defElement) {
    defElement.textContent = `Total Def: ${totalDef}`;
  } else {
    console.error("No element with class 'def' found!");
  }

  const spDefElement = document.querySelector(".spdef");
  if (spDefElement) {
    spDefElement.textContent = `Total Special Def: ${totalSpDef}`;
  } else {
    console.error("No element with class 'spdef' found!");
  }

  const speedElement = document.querySelector(".speed");
  if (speedElement) {
    speedElement.textContent = `Total Speed: ${totalSpeed}`;
  } else {
    console.error("No element with class 'speed' found!");
  }
}

export function movePkmn(pkmnListBox) {
  const pkmnList = document.querySelector(pkmnListBox);
  // loop through each pokemon in the team and add an event listener to each
  for (const child of pkmnList.children) {
    const releaseBtn = document.createElement("button");
    const moveBtn = document.createElement("button");
    releaseBtn.className = "release-btn"
    moveBtn.className = "move-btn"
    releaseBtn.textContent = "X"
    moveBtn.textContent = "Move"
    child.appendChild(releaseBtn);
    child.appendChild(moveBtn);
    moveToBox();
    moveBtn.addEventListener("click", () => {
      let pkmnName = child.querySelector(".sprite").alt;
      if (pkmnName != null && pkmnName != "##") {
        console.log(pkmnName);
        moveToBox(pkmnName);
        window.location.reload();
      }
      
    })

    releaseBtn.addEventListener("click", () => {
      let pkmnName = child.querySelector(".sprite").alt;
      if (pkmnName != null && pkmnName != "##") {
        removePokemon(pkmnName);
        window.location.reload();
      }
      
    })
  }

  // if its on the box page, second button should be "move to team"
  // if its on the team page, it should be "move to box"

  // when a button is pressed, take the pokemon name from its alt attribute, 

  // add it to the other list, 
  // and then delete it from the original
}

function removePokemon(pkmnName) {
  let teamList = JSON.parse(localStorage.getItem("team")) || [];
 
  console.log(pkmnName);
  
  const updatedTeamList = teamList.filter((name) => name != pkmnName);

  localStorage.setItem("team", JSON.stringify(updatedTeamList));
  
  teamList = JSON.parse(localStorage.getItem("team")) || [];
 
  console.log(teamList);
}

function moveToBox(pkmnName) {
  if (pkmnName != null && pkmnName != "##") {
    let teamList = JSON.parse(localStorage.getItem("team")) || [];
    let boxList = JSON.parse(localStorage.getItem("box")) || [];
    console.log(pkmnName);
    boxList.push(pkmnName);
    const updatedTeamList = teamList.filter((name) => name != pkmnName);
    const updatedBoxList = boxList;

    localStorage.setItem("team", JSON.stringify(updatedTeamList));
    localStorage.setItem("box", JSON.stringify(updatedBoxList));

    teamList = JSON.parse(localStorage.getItem("team")) || [];
    boxList = JSON.parse(localStorage.getItem("box")) || [];
    console.log(teamList);
    console.log(boxList);
  }
  
  
}

export function changeTitle(titleClass) {
  // Find the team name element
  const title = document.querySelector(titleClass);
  const titleInput = document.querySelector(".invisible"); 

  // When the team name is clicked, show the input box
  title.addEventListener("click", () => { 
    title.className = "invisible"
    titleInput.className = "title-input"
    titleInput.value = title.textContent.trim(); 
    titleInput.focus(); 
  });

  // When Enter is pressed, update the title and hide the input
  titleInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      localStorage.setItem("teamname", titleInput.value)
      title.textContent = localStorage.getItem("teamname"); 
      titleInput.className = "invisible"
      title.className = "team-name" 
    }
  });


  titleInput.addEventListener("blur", () => {
    titleInput.className = "invisible"
    title.className = "team-name" 
  });
}

export function initTeamname(titleName) {
  if (localStorage.getItem("teamname") != null) {
    document.querySelector(titleName).textContent = localStorage.getItem("teamname");
  }
  else {
    document.querySelector(titleName).textContent = "Team2"
  }
}


