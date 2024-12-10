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
  min = Math.ceil(min); // Ensure min is rounded up
  max = Math.floor(max); // Ensure max is rounded down
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
    localStorage.setItem("team", JSON.stringify([])); // Team starts empty
  }
  if (!localStorage.getItem("box")) {
    localStorage.setItem("box", JSON.stringify([])); // Box starts empty
  }
}

function addPokemon(name) {
  const team = JSON.parse(localStorage.getItem("team")) || [];
  const box = JSON.parse(localStorage.getItem("box")) || [];

  if (team.length < 6) {
    team.push(name);
    localStorage.setItem("team", JSON.stringify(team)); // Save the updated team
    console.log(`${name} added to the team!`);
  } 
  else if (team.length >= 6) {
    box.push(name);
    localStorage.setItem("box", JSON.stringify(box)); // Save the updated team
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
  const searchBar = document.querySelector(".searchBar");
  const searchPkmn = searchBar.value.trim()
  giveSprite(searchPkmn);
  getDesc(searchPkmn);
}

export function searchbarActivate() {
  const searchBar = document.querySelector(".searchBar");
  
  if (!searchBar) {
    console.error("Search bar element not found!");
    return;
  }

  searchBar.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      window.location.href = "/index.html"
      search(searchBar); // Pass the searchBar element to the search function
    }
  });
}