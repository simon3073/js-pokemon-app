let pokemonRepository = (function () {
	// Set up an empty array for the Pokemon Fetch using the dataLength variable
	let pokemonList = [];
	let dataLength = 10;

	// Assign Pokemon Fetch URL to a variable;
	let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=' + dataLength;

	// set variable of the HTML element to add Pokemon data to
	const pokemonUL = document.querySelector('.pokemon-list');

	// set variable of loader element
	let loaderEl = document.querySelector('.loader-container');

	// set a variable for the modal container
	let modalContainer = document.querySelector('#modal-container');

	// Pokemon FETCH API
	function loadList() {
		toggleLoader();
		return fetch(apiURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item, i) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
				toggleLoader();
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	function loadDetails(item) {
		toggleLoader();
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.imageURL = details.sprites.front_default;
				item.height = details.height;
				item.types = details.types;
				toggleLoader();
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	function toggleLoader() {
		pokemonUL.classList.toggle('hide');
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

	function showModal(pokemon) {
		// get the position of the pokemon loaded so we can use it to load buttons and navigate
		let pokemonPos = pokemonList
			.map((i) => {
				return i.name;
			})
			.indexOf(pokemon.name);

		modalContainer.innerHTML = '';

		// Add inner modal div
		let modal = document.createElement('div');
		modal.classList.add('modal');

		// add modal close button
		let modalCloseBtn = document.createElement('button');
		modalCloseBtn.classList.add('modal-close');
		modalCloseBtn.innerText = 'CLOSE';
		modalCloseBtn.addEventListener('click', hideModal);

		// Add modal header and content
		let modalHeading = document.createElement('h1');
		// Capitalise first letter of header
		let pokemonCapName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
		modalHeading.innerText = pokemonCapName;

		// Add image and height
		let modalPokemonSprite = document.createElement('img');
		modalPokemonSprite.setAttribute('src', pokemon.imageURL);

		let modalContent = document.createElement('p');
		modalContent.innerText = `${pokemonCapName} is ${pokemon.height}m tall`;

		let modalPokemonTypes = document.createElement('p');
		modalPokemonTypes.classList.add('types');

		// loop through pokemon types
		pokemon.types.forEach((p, index) => {
			if (index < 1) modalPokemonTypes.innerText = 'Types are: '; // Add text if first loop
			let pokemonTypeText = index < 1 ? p.type.name : `, ${p.type.name}`; // Add a comma if not the first loop
			modalPokemonTypes.innerText += pokemonTypeText;
		});

		// Add all the created elements
		modalContainer.appendChild(modal);
		modal.appendChild(modalCloseBtn);
		modal.appendChild(modalHeading);
		modal.appendChild(modalPokemonSprite);
		modal.appendChild(modalContent);
		modal.appendChild(modalPokemonTypes);

		let navBtnDiv = document.createElement('div');
		navBtnDiv.classList.add('nav-btn-container');
		modal.appendChild(navBtnDiv);

		// Load Previous and Next pokemon buttons
		if (pokemonPos > 0) {
			let prevPokemonBtn = document.createElement('button');
			prevPokemonBtn.classList.add('navbutton');
			prevPokemonBtn.innerText = '<<';
			prevPokemonBtn.addEventListener('click', () => {
				navigatePokemons(pokemonPos - 1);
			});
			navBtnDiv.appendChild(prevPokemonBtn);
		}

		if (pokemonPos < dataLength - 1) {
			let nextPokemonBtn = document.createElement('button');
			nextPokemonBtn.classList.add('navbutton');
			nextPokemonBtn.innerText = '>>';
			nextPokemonBtn.addEventListener('click', () => {
				navigatePokemons(pokemonPos + 1);
			});
			navBtnDiv.appendChild(nextPokemonBtn);
		}

		modalContainer.classList.add('is-visible');
		modalContainer.addEventListener('click', ({ target }) => {
			if (target === modalContainer) hideModal();
		});
	}

	function hideModal() {
		modalContainer.classList.remove('is-visible');
	}

	function navigatePokemons(newPokemonIndex) {
		showDetails(pokemonList[newPokemonIndex]);
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
			showModal(pokemon);
		});
	}

	//Function to find a Pokemon in the app
	function findPokemon(pokemonToFind) {
		// Change search term to lower case for search
		let pokemonSearchTerm = pokemonToFind.toLowerCase();
		let searchResult = pokemonList.find((pokemon) => pokemon.name === pokemonSearchTerm);

		// return name or no-result message
		return searchResult !== undefined ? searchResult.name : 'Sorry no result on your search';
	}

	return {
		getAll,
		addListItem,
		loadList,
		loadDetails,
		hideModal,
		findPokemon
	};
})();

// Call the FETCH API function - use a prom
pokemonRepository.loadList().then(function () {
	// once the data is loaded - populate the UL
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});

window.addEventListener('keydown', (e) => {
	let modalContainer = document.querySelector('#modal-container');
	if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
		pokemonRepository.hideModal();
	}
});
