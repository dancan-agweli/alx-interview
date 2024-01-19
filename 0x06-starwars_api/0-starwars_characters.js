const axios = require('axios');

const getMovieCharacters = async (movieId) => {
  try {
    // Fetch movie data from SWAPI
    const movieResponse = await axios.get(`https://swapi.dev/api/films/${movieId}/`);
    const movieData = movieResponse.data;

    if (!movieData || movieData.detail === 'Not found') {
      console.log(`Movie with ID ${movieId} not found.`);
      return;
    }

    const charactersUrls = movieData.characters;

    // Fetch character names from SWAPI
    const characterNames = await Promise.all(
      charactersUrls.map(async (characterUrl) => {
        const characterResponse = await axios.get(characterUrl);
        return characterResponse.data.name;
      })
    );

    return characterNames;
  } catch (error) {
    console.error(`Error fetching data from SWAPI: ${error.message}`);
  }
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 1 || isNaN(args[0])) {
    console.log('Usage: node 0-starwars_characters.js <movie_id>');
    process.exit(1);
  }

  const movieId = parseInt(args[0], 10);

  const characterNames = await getMovieCharacters(movieId);

  if (characterNames) {
    console.log(`Characters in Star Wars Episode ${movieId}:`);
    characterNames.forEach((characterName) => {
      console.log(characterName);
    });
  }
};

main();

