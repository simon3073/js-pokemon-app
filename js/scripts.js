let pokemonRepository = (function () {
	// Set up an empty array for the Pokemon Fetch using the dataLength variable
	const pokemonList = [];
	const dataLength = 150;

	// Assign Pokemon Fetch URL to a variable;
	const apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=' + dataLength;

	// set up empty index variable for navigation and modal button set up
	let pokemonPos = null;

	// set variables of the HTML elements
	const pokemonDIV = document.querySelector('.pokemons');
	const modalHeader = document.querySelector('.modal-header button');
	const modalBody = document.querySelector('.modal-body');
	const modalFooter = document.querySelector('.modal-footer');
	const modalPrevButton = document.querySelector('#prevPokeBtn');
	const modalNextButton = document.querySelector('#nextPokeBtn');

	// set variable of loader elements
	const loader = document.querySelector('.loader');
	const modalLoader = document.querySelector('.modal-loader-div');

	// Pokemon FETCH API
	const loadList = () => {
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
	};

	// Hide and Unhide the loader and pokemon divs
	const toggleLoader = () => {
		pokemonDIV.classList.toggle('hide');
		loader.classList.toggle('hide');
	};

	const toggleModalLoader = () => {
		modalLoader.classList.toggle('hide');
	};

	// Return all the Pokemon data
	const getAll = () => {
		return pokemonList;
	};

	// Function to adds a new Pokemon
	const add = (newPokemon) => {
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
	};

	const clearModal = () => {
		const modalTitle = document.querySelector('.modal-title');
		if (typeof modalTitle != 'undefined' && modalTitle != null) {
			modalTitle.parentNode.removeChild(modalTitle);
		}

		modalBody.innerHTML = '';
		modalNextButton.removeEventListener('click', loadNavigatedPokemon);
		modalPrevButton.removeEventListener('click', loadNavigatedPokemon);
	};

	const populateModal = (pokemon) => {
		// get the index position of the pokemon loaded so we can use it to load buttons and navigate
		pokemonPos = pokemonList
			.map((i) => {
				return i.name;
			})
			.indexOf(pokemon.name);

		clearModal();

		// Capitalise Pokemon Name
		const capPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

		// Load Pokemon Header
		const pokemonHeading = document.createElement('h5');
		pokemonHeading.classList.add('modal-title', 'w-100', 'text-center');
		pokemonHeading.setAttribute('id', 'modalHeader');
		pokemonHeading.setAttribute('alt', `You have loaded ${capPokemonName}">${capPokemonName}</h5>`);
		pokemonHeading.innerText = capPokemonName;
		modalHeader.before(pokemonHeading);

		// Load Pokemon Image
		const pokemonImg = document.createElement('img');
		pokemonImg.setAttribute('src', pokemon.imageURL);
		pokemonImg.setAttribute('id', 'pokemon-image');
		pokemonImg.setAttribute('alt', `The ${capPokemonName} Pokemon`);
		pokemonImg.addEventListener('load', (e) => {
			toggleModalLoader();
		});
		modalBody.appendChild(pokemonImg);

		// Load Pokemon Body
		const pokemonDetails = document.createElement('p');
		pokemonDetails.innerText = `${capPokemonName} is ${pokemon.height}m tall`;
		modalBody.appendChild(pokemonDetails);

		// loop through pokemon types
		const pokemonTypes = document.createElement('p');
		pokemon.types.forEach((p, index) => {
			// Add text if first loop
			pokemonTypes.classList.add('types');
			if (index < 1) {
				if (pokemon.types.length > 1) {
					pokemonTypes.innerText = 'Types are: ';
				} else {
					pokemonTypes.innerText = 'Type is: ';
				}
			}
			pokemonTypes.innerText += index < 1 ? p.type.name : `, ${p.type.name}`; // Add a comma if not the first loop
		});
		modalBody.appendChild(pokemonTypes);

		// Set up navigation buttons accessibility
		if (pokemonPos > 0) {
			modalPrevButton.removeAttribute('disabled');
			modalPrevButton.addEventListener('click', loadNavigatedPokemon);
		} else {
			modalPrevButton.setAttribute('disabled', true);
		}

		if (pokemonPos < dataLength - 1) {
			modalNextButton.removeAttribute('disabled');
			modalNextButton.addEventListener('click', loadNavigatedPokemon);
		} else {
			modalNextButton.setAttribute('disabled', true);
		}
	};

	// Function to add a button to the DIV
	const addListItem = (pokemon) => {
		// create the button element
		let pokemonButton = document.createElement('button');

		// set up the button event listener, text and class
		pokemonButton.innerText = pokemon.name;
		pokemonButton.classList.add('btn', 'btn-primary', 'btn-lg', 'mb-1');
		pokemonButton.setAttribute('data-toggle', 'modal');
		pokemonButton.setAttribute('data-target', '#pokemonModal');

		// add the created elements to the ul
		pokemonDIV.appendChild(pokemonButton);
	};

	// Clear List -- for when we are searching
	function clearListItems() {
		pokemonDIV.innerHTML = '';
	}

	//Function to find a Pokemon in the appList and then retrieve its individual values
	const findPokemon = (pokemonToFind) => {
		// Change search term to lower case for search
		let pokemonSearchTerm = pokemonToFind.toLowerCase();
		let searchResult = pokemonList.find((pokemon) => pokemon.name === pokemonSearchTerm);
		// return name or null
		return searchResult !== undefined ? searchResult : null;
	};

	const loadDetails = (item) => {
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
	};

	// Load new the Pokemon data object based on modal nav btn click
	const loadNavigatedPokemon = ({ target }) => {
		let pokemonToLoad = null;
		toggleModalLoader();
		// Get the direction required
		if (target.id === 'nextPokeBtn') {
			pokemonToLoad = pokemonList[pokemonPos + 1];
		} else {
			pokemonToLoad = pokemonList[pokemonPos - 1];
		}

		// Then load the new Pokemons data into the modal
		loadDetails(pokemonToLoad)
			.then(() => {
				// Populate the Modal
				populateModal(pokemonToLoad);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	return {
		getAll,
		addListItem,
		clearListItems,
		loadList,
		findPokemon,
		loadDetails,
		populateModal,
		toggleModalLoader,
		clearModal
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
	pokemon = pokemonRepository.findPokemon(relatedTarget.innerText);

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

$('#pokemonModal').on('hidden.bs.modal', function () {
	pokemonRepository.clearModal();
	pokemonRepository.toggleModalLoader();
});

// Event handler for Navbar search function
document.querySelector('#searchTerm').addEventListener('input', () => {
	// Clear Pokemon's
	pokemonRepository.clearListItems();

	// Use the search term and filter to leave array of applicable Pokemons -- then load
	const searchTerm = document.querySelector('#searchTerm').value;
	const filteredSearch = pokemonRepository.getAll().filter((pokemon) => pokemon.name.indexOf(searchTerm) > -1);
	filteredSearch.forEach((pokemon) => pokemonRepository.addListItem(pokemon));
});
