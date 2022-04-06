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

const pokemonDiv = document.getElementById('output');

// Loop through the Pokemon Object Array and add output to the websites DOM
for (let i = 0; i < pokemonList.length; i++) {
	pokemonDiv.innerHTML += `<b>${pokemonList[i].name} (Height: ${pokemonList[i].height})</b>`;
	// If pokemon height above 1.8 - add a special message
	if (pokemonList[i].height > 1.8) pokemonDiv.innerHTML += ` <i>${pokemonList[i].name} is a big Pokemon!</i>`;
	pokemonDiv.innerHTML += `<br>`;
}
