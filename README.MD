# Game Collection Server

## Installing

* Run `yarn` to install dependencies
* Install mongoDB (currently using v3.6.5) using homebrew (or your package manager of choice)
* Install elasticsearch (currently using v6.2.4) using homebrew (or your package manager of choice)
* Copy `.env` from `.env.example` and fill in the required credentials there
* Restore the database from a backup if possible, or run the three import scripts in `src/scripts` in this order: `importPlatforms -> importGameModes -> importGames -> indexGames`. Note: this requires an IGDB API key with access to expanded requests, and will likely require more than the free limit allows.

## Running

Start the server with `yarn start` and away we go!


