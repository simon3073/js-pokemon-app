let pokemonRepository = (function () {
	// Set up an empty array for the Pokemon Fetch using the dataLength variable
	let pokemonList = [];
	let dataLength = 150;

	// Assign Pokemon Fetch URL to a variable;
	let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=' + dataLength;

	// set up empty index variable for navigation and modal button set up
	let pokemonPos = null;

	// set variable of the HTML element to add Pokemon data to
	const pokemonDIV = document.querySelector('.pokemons');

	// set variable of loader element
	let loaderEl = document.querySelector('.loader');

	// Pokemon FETCH API
	function loadList() {
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

	// Hide and Unhide the loader and pokemon divs
	function toggleLoader() {
		// pokemonDIV.classList.toggle('hide');
		// loaderEl.classList.toggle('hide');
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

	function populateModal(pokemon) {
		// get the index position of the pokemon loaded so we can use it to load buttons and navigate
		pokemonPos = pokemonList
			.map((i) => {
				return i.name;
			})
			.indexOf(pokemon.name);

		// reset the modal
		$('#modalHeader').html('');
		$('.modal-body').html('');
		$('#prevPokeBtn').off();
		$('#nextPokeBtn').off();

		// Capitalise Pokemon Name
		let capPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

		// Load Pokemon Header, Image and Content
		$('#modalHeader').html(capPokemonName);
		$('.modal-body').append(`<img id="pokemon-image" src="${pokemon.imageURL}"/>`);
		$('.modal-body').append(`<p>${capPokemonName} is ${pokemon.height}m tall`);
		$('.modal-body').append('<p class="types"><p>');

		// loop through pokemon types
		pokemon.types.forEach((p, index) => {
			if (index < 1) $('.modal-body .types').html('Types are: '); // Add text if first loop
			let pokemonTypeText = index < 1 ? p.type.name : `, ${p.type.name}`; // Add a comma if not the first loop
			$('.modal-body .types').append(pokemonTypeText);
		});

		// Set up navigation buttons accessibility
		if (pokemonPos > 0) {
			$('#prevPokeBtn').removeAttr('disabled');
		} else {
			$('#prevPokeBtn').attr('disabled', true);
		}

		if (pokemonPos < dataLength - 1) {
			$('#nextPokeBtn').removeAttr('disabled');
		} else {
			$('#nextPokeBtn').attr('disabled', true);
		}
	}

	// Function to add a button to the DIV
	function addListItem(pokemon) {
		// create the button element
		let pokemonButton = document.createElement('button');

		// set up the button event listener, text and class
		pokemonButton.innerText = pokemon.name;
		pokemonButton.classList.add('btn', 'btn-primary', 'btn-lg', 'mb-1');
		pokemonButton.setAttribute('data-toggle', 'modal');
		pokemonButton.setAttribute('data-target', '#pokemonModal');

		// add the created elements to the ul
		pokemonDIV.appendChild(pokemonButton);
	}

	// Clear List -- for when we are searching
	function clearListItems() {
		$('.pokemons').empty();
	}

	//Function to find a Pokemon in the appList and then retrieve its individual values
	function findPokemon(pokemonToFind) {
		// Change search term to lower case for search
		let pokemonSearchTerm = pokemonToFind.toLowerCase();
		let searchResult = pokemonList.find((pokemon) => pokemon.name === pokemonSearchTerm);
		// return name or null
		return searchResult !== undefined ? searchResult : null;
	}

	function loadDetails(item) {
		// fetch extra details before a modal load
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.imageURL = details.sprites.front_default;
				item.height = details.height;
				item.types = details.types;
			})
			.catch(function (e) {
				console.error(e);
			});
	}

	// Return new the Pokemon data object based on modal nav btn click
	function getNavigatedPokemon(navBtn) {
		if (navBtn === 'nextPokeBtn') return pokemonList[pokemonPos + 1];
		else return pokemonList[pokemonPos - 1];
	}

	return {
		getAll,
		addListItem,
		clearListItems,
		loadList,
		findPokemon,
		loadDetails,
		populateModal,
		getNavigatedPokemon
	};
})();

// Call the FETCH API function - use a prom
pokemonRepository.loadList().then(function () {
	// once the data is loaded - populate the UL
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});

// On Modal load
$('#pokemonModal').on('show.bs.modal', ({ relatedTarget }) => {
	let pokemon = null;

	// Find pokemon term based on either the button clicked or search term entered
	if (relatedTarget) pokemon = pokemonRepository.findPokemon(relatedTarget.innerText);
	else pokemon = pokemonRepository.findPokemon($('#searchTerm').val());

	//Fetch details from the found pokemon obj
	pokemonRepository
		.loadDetails(pokemon)
		.then(() => {
			// Populate the Modal
			pokemonRepository.populateModal(pokemon);
		})
		.catch((e) => {
			console.error(e);
		});
});

// Event handler for Navbar search function
$('#searchTerm').on('input', () => {
	// Clear Pokemons
	pokemonRepository.clearListItems();

	// Use the search term and filter to leave array of applicable Pokemons -- then load
	let searchTerm = $('#searchTerm').val();
	let filteredSearch = pokemonRepository.getAll().filter((pokemon) => pokemon.name.indexOf(searchTerm) > -1);
	filteredSearch.forEach((pokemon) => pokemonRepository.addListItem(pokemon));
});

// Modal Pokemon Nav Buttons
$(document).on('click', '#prevPokeBtn, #nextPokeBtn', ({ target }) => {
	// pass getNavigatedPokemon the button id clicked to return previous or next pokemon
	pokemon = pokemonRepository.getNavigatedPokemon(target.id);

	//Fetch details from the found pokemon obj
	pokemonRepository
		.loadDetails(pokemon)
		.then(() => {
			// Populate the Modal
			pokemonRepository.populateModal(pokemon);
		})
		.catch((e) => {
			console.error(e);
		});
});
