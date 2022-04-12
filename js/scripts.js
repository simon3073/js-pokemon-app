let pokemonRepository = (function () {
	// Set up an empty array for the Pokemon Fetch
	let pokemonList = [];
	let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=10';

	// set variable of the HTML element to add Pokemon data to
	const pokemonUL = document.querySelector('.pokemon-list');

	// set variable of loader element
	let loaderEl = document.querySelector('.loader-container');

	// Pokemon FETCH API
	function loadList() {
		showLoader();
		return fetch(apiURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
				hideLoader();
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	function loadDetails(item) {
		showLoader();
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.imageURL = details.sprites.front_default;
				item.height = details.height;
				item.types = details.types;
				hideLoader();
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	function showLoader() {
		loaderEl.classList.toggle('hide');
	}

	function hideLoader() {
		loaderEl.classList.toggle('hide');
	}

	// Return all the Pokemon data
	function getAll() {
		return pokemonList;
	}

	// Function to adds a new Pokemon
	function add(newPokemon) {
		// Check if passed Pokemon is a Pokemon Object >> If not log it in the console
		if (typeof newPokemon !== 'object') console.log('Cannot add pokemon as its not a pokemon!');
		else {
			// validation object to check against.
			const requiredPokemonKeys = { name: '', detailsUrl: '' };

			// returns true if all the keys exists by using the `every` array method couple with the in operator.
			if (Object.keys(newPokemon).every((element) => element in requiredPokemonKeys)) {
				pokemonList.push(newPokemon);
			} else {
				console.error('Incorrect keys in newPokemon');
			}
		}
	}

	// Function to add a button within a li tag to the ul element
	function addListItem(pokemon) {
		// create the li and button elements
		let pokemonLI = document.createElement('li');
		let pokemonButton = document.createElement('button');

		// set up the button event listener, text and class
		pokemonBtnClick(pokemonButton, pokemon);
		pokemonButton.innerText = pokemon.name;
		pokemonButton.classList.add('pokemon-button');

		// add the created elements to the ul
		pokemonLI.appendChild(pokemonButton);
		pokemonUL.appendChild(pokemonLI);
	}

	function pokemonBtnClick(pokemonButton, pokemonObj) {
		pokemonButton.addEventListener('click', () => {
			showDetails(pokemonObj);
		});
	}

	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			console.log(pokemon);
		});
	}

	//Function to find a Pokemon in the app
	function find(pokemonToFind) {
		let searchResult = pokemonList.filter((pokemon) => pokemon.name === pokemonToFind);
		return JSON.stringify(searchResult);
	}

	return {
		getAll,
		addListItem,
		loadList,
		loadDetails
	};
})();

// Find Ekans in the app
//console.log(pokemonRepository.find('Ekans'));

// Call the FETCH API function - use a prom
pokemonRepository.loadList().then(function () {
	// once the data is loaded - populate the UL
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});
