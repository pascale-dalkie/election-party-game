import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './leaderboard.html';
import { Candidates } from '../../api/candidates.js';
import { ElectoralGame } from '../../api/electoralGame.js';

class LeaderboardCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    var voteSeats = 120;

    this.helpers({
      candidates() {
        return Candidates.find({});
      },
      voteSeats() {
        return voteSeats;
      },
      electoralSeats() {
        var electoralGame = ElectoralGame.findOne();
        if(electoralGame){
          return electoralGame.electoralSeats;
        }
      },
      percentLeft() {
        var electoralGame = ElectoralGame.findOne();
        if(electoralGame){
          return 100 - electoralGame.percentTaken;
        }
      }
    })
  }

  yeetTheWeak(percentTotal){
    var lowestCandidate = Candidates.findOne({ electoralSeats: { $lt: 1 }, percentOfVote: { $lt: 5} }, {
      sort: {
        percentOfVote: 1
      }
    });
    if(lowestCandidate){
      var newPercentTotal = percentTotal - lowestCandidate.percentOfVote;
      Candidates.remove(lowestCandidate._id);
      var candidates = Candidates.find({}, {
        sort: {
          percentOfVote: 1
        }
      });
      candidates.forEach(function(candidate){
        var candidateNewPercent = (100/newPercentTotal) * candidate.percentOfVote;
        Candidates.update(
          { _id: candidate._id},
          { name: candidate.name, electoralSeats: candidate.electoralSeats, percentOfVote: candidateNewPercent }
        );
      });
      this.yeetTheWeak(newPercentTotal);
    } else {
      return;
    }
  }

  finaliseVotes(){
    this.yeetTheWeak(100);
    var totalSeats = ElectoralGame.findOne().electoralSeats + this.voteSeats;
    var candidates = Candidates.find({}, {
      sort: {
        percentOfVote: 1
      }
    });
    candidates.forEach(function(candidate){
      var candidateSeats = parseInt((candidate.percentOfVote/100) * totalSeats);
      Candidates.update(
        { _id: candidate._id},
        { name: candidate.name, electoralSeats: candidate.electoralSeats, percentOfVote: candidate.percentOfVote, seats: candidateSeats }
      );
    });
  }

}

export default angular.module('leaderboard', [
  angularMeteor
])
  .component('leaderboard', {
    templateUrl: 'imports/components/leaderboard/leaderboard.html',
    controller: ['$scope', LeaderboardCtrl]
  });
