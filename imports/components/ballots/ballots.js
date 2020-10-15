import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './ballots.html';
import { AdvanceVotingGames } from '../../api/advanceVotingGames.js';
import { Candidates } from '../../api/candidates.js';
import { ElectoralGame } from '../../api/electoralGame.js';
import { Ballots } from '../../api/ballots.js';

class BallotsCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    var showBallotOneCandidates = false;
    var showBallotTwoCandidates = false;

    this.helpers({
      candidates() {
        return Candidates.find({});
      },
      ballotOne() {
        var ballotOne = Ballots.findOne( {name: "ballotOne"} );
        if(ballotOne){
          if(ballotOne.totalVotes > 0) {
            this.showBallotOneCandidates = true;
          }
          this.ballotOnePercent = ballotOne.percentAvailable;
          this.ballotOneTotal = ballotOne.totalVotes;
          return ballotOne;
        }
      },
      ballotTwo() {
        var ballotTwo = Ballots.findOne( {name: "ballotTwo"} );
        if(ballotTwo){
          if(ballotTwo.totalVotes > 0) {
            this.showBallotTwoCandidates = true;
          }
          this.ballotTwoPercent = ballotTwo.percentAvailable;
          this.ballotTwoTotal = ballotTwo.totalVotes;
          return ballotTwo;
        }
      },
      showBallotOneCandidates() {
        return this.showBallotOneCandidates;
      },
      showBallotTwoCandidates() {
        return this.showBallotTwoCandidates;
      }
    })
  }

  updateBallotOne(percent, total) {
    var ballotOne = Ballots.findOne( {name: "ballotOne"} );
    Ballots.update(
      { _id: ballotOne._id},
      { name: "ballotOne", percentAvailable: percent, totalVotes: total }
    );
    this.showBallotOneCandidates = true;
    //TODO UI feedback its saved
  }

  updateBallotTwo(percent, total) {
    var ballotTwo = Ballots.findOne( {name: "ballotTwo"} );
    Ballots.update(
      { _id: ballotTwo._id},
      { name: "ballotTwo", percentAvailable: percent, totalVotes: total }
    );
    this.showBallotTwoCandidates = true;

    //TODO UI feedback its saved
  }

  addCandidateToBallotOne(candidateName, votesWon) {
    var ballotOne = Ballots.findOne( {name: "ballotOne"} );
    Ballots.update(
      { _id: ballotOne._id },
      { $push: { candidates: { name: candidateName, votesWon: votesWon } } }
    );
    this.addCandidateToBallot(candidateName, votesWon, ballotOne.totalVotes, ballotOne.percentAvailable);
    this.newCandidateOne = '';
  }

  addCandidateToBallotTwo(candidateName, votesWon) {
    var ballotTwo = Ballots.findOne( {name: "ballotTwo"} );
    Ballots.update(
      { _id: ballotTwo._id },
      { $push: { candidates: { name: candidateName, votesWon: votesWon } } }
    );
    this.addCandidateToBallot(candidateName, votesWon, ballotTwo.totalVotes, ballotTwo.percentAvailable);
    this.newCandidateTwo = '';
  }

  addCandidateToBallot(candidateName, votesWon, totalVotes, percentAvailable) {

    var percentWon = (votesWon/totalVotes) * percentAvailable;

    var candidate = Candidates.findOne({name: candidateName});
    if (!candidate){
      Candidates.insert({
        name: candidateName,
        electoralSeats: 0,
        percentOfVote: percentWon
      });
    } else {
      Candidates.update(
        { _id: candidate._id},
        { $inc: { percentOfVote: percentWon } }
      );
    }

    var electoralGame = ElectoralGame.findOne();
    var percentLeft = (100 - electoralGame.percentTaken) - percentWon;
    if (percentLeft < 0 ){
      percentWon = percentWon - percentLeft;
    }

    ElectoralGame.update(
      { _id: electoralGame._id },
      { $inc: { percentTaken: percentWon } }
    );


    // TODO clear form fields

  }
}

export default angular.module('ballots', [
  angularMeteor
])
  .component('ballots', {
    templateUrl: 'imports/components/ballots/ballots.html',
    controller: ['$scope', BallotsCtrl]
  });
