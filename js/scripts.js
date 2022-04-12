let pokemonRepository = (function () {
	// Array of Pokemon data to display in the application
	let pokemonList = [
		{
			name: 'Ivysaur',
			height: 1,
			types: ['grass', 'poison']
		},
		{
			name: 'Ekans',
			height: 2,
			types: ['poison']
		},
		{
			name: 'Fearow',
			height: 1.2,
			types: ['flying', 'normal']
		}
	];

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
			const requiredPokemonKeys = { name: '', height: '', types: '' };

			// returns true if all the keys exists by using the `every` array method couple with the in operator.
			if (Object.keys(newPokemon).every((element) => element in requiredPokemonKeys)) {
				pokemonList.push(newPokemon);
			} else {
				console.error('Incorrect keys in newPokemon');
			}
		}
	}

	// set variable of the HTML element to add Pokemon data to
	const pokemonUL = document.querySelector('.pokemon-list');

	// Function to add a button within a li tag to the ul element
	function addListItem(pokemon) {
		// create the li and button elements
		let pokemonLI = document.createElement('li');
		let pokemonButton = document.createElement('button');

		// set up the button event listener, text and class
		pokemonButton.addEventListener('click', () => {
			showDetails(pokemon);
		});
		pokemonButton.innerText = pokemon.name;
		pokemonButton.classList.add('pokemon-button');

		// add the created elements to the ul
		pokemonLI.appendChild(pokemonButton);
		pokemonUL.appendChild(pokemonLI);
	}

	function showDetails(pokemon) {
		console.log(pokemon.name);
	}

	//Function to find a Pokemon in the app
	function find(pokemonToFind) {
		let searchResult = pokemonList.filter((pokemon) => pokemon.name === pokemonToFind);
		return JSON.stringify(searchResult);
	}

	return {
		getAll,
		add,
		find,
		addListItem,
		showDetails
	};
})();

// set up the Gloom Pokemon
let Gloom = {
	name: 'Gloom',
	height: 0.8,
	types: ['grass', 'poison']
};

// add the Gloom Pokemon
pokemonRepository.add(Gloom);

// Find Ekans in the app
console.log(pokemonRepository.find('Ekans'));

// Loop through the Pokemon Object Array and for each pokemon Object > add a LI with a button to UL
pokemonRepository.getAll().forEach((pokemon) => {
	pokemonRepository.addListItem(pokemon);
});
