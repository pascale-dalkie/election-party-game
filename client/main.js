import angular from 'angular';
import angularMeteor from 'angular-meteor';
import leaderboard from '../imports/components/leaderboard/leaderboard';
import advanceVotingGames from '../imports/components/advanceVotingGames/advanceVotingGames';
import ballots from '../imports/components/ballots/ballots';

angular.module('election-party-game', [
  angularMeteor,
  leaderboard.name,
  advanceVotingGames.name,
  ballots.name
]);
