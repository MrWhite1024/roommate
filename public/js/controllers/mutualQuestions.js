angular.module('rm.mutualQuestions.controller', [])
.controller('MutualQuestionsController', ['$scope', '$http', 'roommateInit', 'mutualQuestions',
  function ($scope, $http, roommateInit, mutualQuestions) {

  var setMutualQuestions = function(rmVars){
    $scope.rmQuestions = _.sortBy(mutualQuestions.rm(rmVars), function(question){
      return question.questionId;
    });
    $scope.userQuestions = _.sortBy(mutualQuestions.user(rmVars), function(question) {
      return question.questionId;
    });
    var rmI = mutualQuestions.rmIndex(rmVars);
    $http.post('/api/getQuestions/fromUser', rmVars.mutualRoommateInfo[rmI].questionIds)
    .success(function(qaText, status, headers, config) {
      $scope.qaText = _.sortBy(qaText, function(question) {
        return question._id;
      });
      // console.log($scope.qaText);
    }).error(function(err) {
      if(err) throw err;
    });
  };

  if(Object.keys(roommateInit.vars).length === 0) {
    var promise = roommateInit.init();
    promise.then(function(roommateInfo) {
      setMutualQuestions(roommateInit.vars);
    }, function(reason) {
      console.log('Failed ', reason);
    }, function(update) {
      console.log('Got notification ', update);
    });
  } else {
    // console.log(roommateInit.vars);
    setMutualQuestions(roommateInit.vars);
  }

}]);