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
			// Check if the correct Pokemon properties exist [name, height, and types]
			if (newPokemon.hasOwnProperty('name') && newPokemon.hasOwnProperty('height') && newPokemon.hasOwnProperty('types')) {
				// If they do add it to the app
				pokemonList.push(newPokemon);
			} else {
				// If not, log that its missing properties
				console.log('Cannot add pokemon as its missing some properties');
			}
		}
	}

	//Function to find a Pokemon in the app
	function find(pokemonToFind) {
		let searchResult = pokemonList.filter((pokemon) => pokemon.name === pokemonToFind);
		return JSON.stringify(searchResult);
	}

	return {
		getAll,
		add,
		find
	};
})();

// set variable of the HTML element to add Pokemon data to
const pokemonDiv = document.getElementById('output');

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

// Loop through the Pokemon Object Array and add output to the websites DOM
pokemonRepository.getAll().forEach((pokemon) => {
	pokemonDiv.innerHTML += `<b>${pokemon.name} (Height: ${pokemon.height})</b>`;
	// If pokemon height above 1.8 - add a special message
	if (pokemon.height > 1.8) pokemonDiv.innerHTML += ` <i>${pokemon.name} is a big Pokemon!</i>`;
	pokemonDiv.innerHTML += `<br>`;
});
