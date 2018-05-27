"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Games", [
      {
        title: "Super Mario Bros.",
        developer: "Nintendo EAD",
        publisher: "Nintendo",
        platform: "Nintendo Entertainment System",
        releaseDate: "1985-09-13",
        description:
          "Super Mario Bros. is a fantasy platformer created by Shigeru Miyamoto, and published by Nintendo. The game was released in 1985 for the Nintendo Entertainment System. Super Mario Bros. has gone on to be considered by many to be one of the best platformers ever created. The Guinness World Records Gamer’s Edition, a record keeping organization, declared Super Mario Bros. for the NES as the best selling video game of all time with more than 40 million copies sold worldwide."
      },
      {
        title: "Mario & Luigi: Superstar Saga + Bowser's Minions",
        developer: "AlphaDream Corporation, Ltd.",
        publisher: "Nintendo",
        platform: "Nintendo 3DS",
        releaseDate: "2017-10-06",
        description:
          "A remake of the original Mario & Luigi RPG with an additional, parallel side-story."
      },
      {
        title: "Mario Kart 8 Deluxe",
        developer: "Nintendo EAD",
        publisher: "Nintendo",
        platform: "Nintendo Switch",
        releaseDate: "2017-04-28",
        description:
          "Mario Kart 8 introduces gravity-based track design with vertical surfaces and upside down roads for the usual band of racers to drive on via magnetic wheels. Another new feature is Mario Kart TV which automatically creates a highlight reel of each race for users to share with their friends on Miiverse or YouTube. The Community features introduced in Mario Kart 7 make a return, letting players set up tournaments and group races with an expanded set of custom rules. Up to 12 players are able to compete in the game's online mode, including two local players using the same console. There is also local support for up to four player splitscreen races."
      },
      {
        title: "God of War",
        developer: "SIE Santa Monica Studio",
        publisher: "Sony Interactive Entertainment America",
        platform: "PlayStation 4",
        releaseDate: "2018-04-20",
        description:
          "God of War is an action-adventure game developed by the Santa Monica division of Sony Computer Entertainment. It is the first in the series to be released on PlayStation 4 with a release on April 20, 2018. The game serves as a soft reboot and takes place in Norse mythology as apposed to the Greek mythology of the previous games."
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Games", null, {});
  }
};
