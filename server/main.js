import { Meteor } from 'meteor/meteor';
import '../imports/api/candidates.js';
import '../imports/api/advanceVotingGames.js';
import { ElectoralGame } from '../imports/api/electoralGame.js';
import { Ballots } from '../imports/api/ballots.js';

Meteor.startup(() => {
  // code to run on server at startup
  var game = ElectoralGame.findOne();
  if (!game){
    ElectoralGame.insert({
      electoralSeats: 0,
      percentTaken: 0
    });
  }

  var ballotOne = Ballots.findOne( {name: "ballotOne"} );
  if (!ballotOne){
    Ballots.insert({
      name: "ballotOne",
      percentAvailable: 0,
      totalVotes: 0
    });
  }

  var ballotTwo = Ballots.findOne( {name: "ballotTwo"} );
  if (!ballotTwo){
    Ballots.insert({
      name: "ballotTwo",
      percentAvailable: 0,
      totalVotes: 0
    });
  }

});
