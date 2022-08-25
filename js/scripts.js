let pokemonRepository = (function () {
	// Set up an empty arrays for the Pokemon Fetch using the dataLength variable
	const origPokemonList = []; // An array for the original fetch - to refer back to when using the search to narrow down
	let workingPokemonList = []; // and a working version
	const dataLength = 150;

	// Assign Pokemon Fetch URL to a variable;
	const apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=' + dataLength;

	// set up empty index variable for navigation and modal button set up
	let pokemonPos = null;

	// set variables of the HTML elements
	const pokemonDIV = document.querySelector('.pokemons');
	const modalHeader = document.querySelector('.modal-header button');
	const modalBody = document.querySelector('.modal-body');
	const modalPrevButton = document.querySelector('#prevPokeBtn');
	const modalNextButton = document.querySelector('#nextPokeBtn');

	// set variable of loader elements
	const loader = document.querySelector('.loader');
	const modalLoader = document.querySelector('.modal-loader-div');

	// Pokemon FETCH API
	const loadList = async () => {
		try {
			const response = await fetch(apiURL);
			const json = await response.json();
			json.results.forEach(function (item) {
				let pokemon = {
					name: item.name,
					detailsUrl: item.url
				};
				add(pokemon);
			});
			toggleLoader();
		} catch (error) {
			alert("Cannot load Pokemon's right now, try again later");
		}
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
		return origPokemonList;
	};

	// Function to adds a new Pokemon
	const add = (newPokemon) => {
		// Check if passed Pokemon is a Pokemon Object >> If not log it in the alert the user
		if (typeof newPokemon !== 'object') {
			alert("Error processing Pokemon's. Please try again later");
		} else {
			// validation object to check against.
			const requiredPokemonKeys = { name: '', detailsUrl: '' };

			// returns true if all the keys exists by using the `every` array method couple with the in operator.
			if (Object.keys(newPokemon).every((element) => element in requiredPokemonKeys)) {
				origPokemonList.push(newPokemon);
			} else {
				alert("Error processing Pokemon's. Please try again later");
			}
		}
		workingPokemonList = origPokemonList;
	};

	// Clear the modal before loading new data
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
		pokemonPos = workingPokemonList
			.map((i) => {
				return i.name;
			})
			.indexOf(pokemon.name);

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
		pokemonImg.addEventListener('load', () => {
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

		if (pokemonPos < workingPokemonList.length - 1) {
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
		pokemonButton.classList.add('btn', 'btn-primary', 'btn-lg', 'mb-1', 'ripple');
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
		let searchResult = workingPokemonList.find((pokemon) => pokemon.name === pokemonSearchTerm);
		// return name or null
		return searchResult !== undefined ? searchResult : null;
	};

	const loadDetails = async (item) => {
		// fetch extra details before a modal load
		let url = item.detailsUrl;
		try {
			const response = await fetch(url);
			const details = await response.json();
			item.imageURL = details.sprites.front_default;
			item.height = details.height;
			item.types = details.types;
			return item;
		} catch (error) {
			alert('Not able to retrieve details about this Pokemon right now');
		}
	};

	// Load new the Pokemon data object based on modal nav btn click
	const loadNavigatedPokemon = async ({ target }) => {
		let pokemonToLoad = null;
		// Clear the modal of content
		clearModal();
		toggleModalLoader();
		// Get the direction required
		if (target.id === 'nextPokeBtn') {
			pokemonToLoad = workingPokemonList[pokemonPos + 1];
		} else {
			pokemonToLoad = workingPokemonList[pokemonPos - 1];
		}

		// Then load the new Pokemon's data into the modal
		try {
			let updatedPokemon = await pokemonRepository.loadDetails(pokemonToLoad);
			populateModal(updatedPokemon);
		} catch (error) {
			alert('Not able to retrieve details about this Pokemon right now');
		}
	};

	// function to update the working List on a search
	const resetWorkingPokemonList = (filteredArr) => {
		workingPokemonList = filteredArr;
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
		resetWorkingPokemonList,
		clearModal
	};
})();

(async () => {
	// Fetch the api and load onto the page
	try {
		await pokemonRepository.loadList();
		pokemonRepository.getAll().forEach((pokemon) => {
			pokemonRepository.addListItem(pokemon);
		});
	} catch (error) {
		alert("Cannot load Pokemon's right now, try again later");
	}
})();

// On Modal load --> update the data
$('#pokemonModal').on('show.bs.modal', async ({ relatedTarget }) => {
	let pokemon = null;
	pokemon = pokemonRepository.findPokemon(relatedTarget.innerText);

	try {
		let updatedPokemon = await pokemonRepository.loadDetails(pokemon);
		pokemonRepository.populateModal(updatedPokemon);
	} catch (error) {
		alert('Not able to retrieve details about this Pokemon right now');
	}
});

// on Modal close - clear the modal
$('#pokemonModal').on('hidden.bs.modal', function () {
	pokemonRepository.clearModal();
	pokemonRepository.toggleModalLoader();
});

// Event handler for Navbar search function
document.querySelector('#searchTerm').addEventListener('input', () => {
	// Clear Pokemon's
	pokemonRepository.clearListItems();

	// Use the search term and filter to leave array of applicable Pokemon's -- then load
	const searchTerm = document.querySelector('#searchTerm').value;
	const filteredSearch = pokemonRepository.getAll().filter((pokemon) => pokemon.name.indexOf(searchTerm) > -1);
	filteredSearch.forEach((pokemon) => pokemonRepository.addListItem(pokemon));

	// update the working List so that the modal navigation only works through the searched list
	pokemonRepository.resetWorkingPokemonList(filteredSearch);
});
