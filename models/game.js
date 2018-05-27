'use strict';
module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define('Game', {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    developer: DataTypes.STRING,
    publisher: DataTypes.STRING,
    platform: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    description: DataTypes.TEXT
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};