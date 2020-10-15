import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './advanceVotingGames.html';
import { AdvanceVotingGames } from '../../api/advanceVotingGames.js';
import { Candidates } from '../../api/candidates.js';
import { ElectoralGame } from '../../api/electoralGame.js';

class AdvanceVotingGamesCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      candidates() {
        return Candidates.find({});
      },
      advanceVotingGames() {
        return AdvanceVotingGames.find({}, {
          sort: {
            createdAt: 1
          }
        });
      }
    })
  }

  addAdvanceVotingGame(newAdvanceVotingGame) {
    AdvanceVotingGames.insert({
      name: newAdvanceVotingGame,
      createdAt: new Date
    });

    this.newGame = '';
    // $scope.newCandidate.push({});
  }


  addCandidateToGame(candidateName, seatsWon, percentWon, advanceVotingGameName) {

    var gameToBeUpdated = AdvanceVotingGames.findOne( {name: advanceVotingGameName});

    seatsWon = seatsWon != null? seatsWon : 0;
    percentWon = percentWon != null? percentWon : 0;

    AdvanceVotingGames.update(
      { _id: gameToBeUpdated._id },
      { $push: { candidates: { name: candidateName, seatsWon: seatsWon, percentWon: percentWon } } }
    );

    var candidate = Candidates.findOne({name: candidateName});
    if (!candidate){
      Candidates.insert({
        name: candidateName,
        electoralSeats: seatsWon,
        percentOfVote: percentWon
      });
    } else {
      Candidates.update(
        { _id: candidate._id},
        { $inc: { electoralSeats: seatsWon, percentOfVote: percentWon } }
      );
    }
    var electoralGame = ElectoralGame.findOne();
    ElectoralGame.update(
      { _id: electoralGame._id },
      { $inc: { electoralSeats: seatsWon, percentTaken: percentWon } }
    );


    // TODO clear form fields

  }
}

export default angular.module('advanceVotingGames', [
  angularMeteor
])
  .component('advanceVotingGames', {
    templateUrl: 'imports/components/advanceVotingGames/advanceVotingGames.html',
    controller: ['$scope', AdvanceVotingGamesCtrl]
  });
