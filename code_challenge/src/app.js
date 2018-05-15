
/* 
	Create the module and inject uiRouter dependency.
*/

var app = angular.module('feedsApp',['ngMaterial','ngMessages','ui.router']);

//States configuration of the application using UI Router

app.config(function($stateProvider,$locationProvider,$mdThemingProvider) {

	var home = {
        name: 'home',
        url: '/viewFeeds',
        controller: function ($state, dataSetupService) {
            if (dataSetupService.getLoadedData()) {
                $state.go('home.dataLoaded');
            }
            else {
                $state.go('home.dataNotLoaded');
            }
        }
    }

    //State to load the data freshly from the API, in case it is not present in the memory already
    var homeDataNotLoaded = {
	    name: 'home.dataNotLoaded',
        url: '',
        template : '<questions-list questions-data="$resolve.questionsData" answers-data="$resolve.answersData"></questions-list>',
        resolve : {
            questionsData : function(questionsAPIService){
            	return questionsAPIService.fetchAPIData()
					.then(function(response){
                    	return response.data.feed_questions;
                	});
            },
			answersData : function(answersAPIService){
                return answersAPIService.fetchAPIData()
                    .then(function(response){
                        return response.data.feed_answers;
                    });
			}
        }
    }

    var homeDataLoaded = {
        name: 'home.dataLoaded',
        url: '',
        template : '<questions-list questions-data="$resolve.questionsData" answers-data="$resolve.answersData" loaded-already="true"></questions-list>',
        resolve : {
            questionsData : function(dataSetupService){
                return dataSetupService.getLoadedData().questions;
            },
            answersData: function(dataSetupService){
                return dataSetupService.getLoadedData().answers;
            }
        }
    }

    var answersPage = {
        name: 'answerSection',
        url: '/viewFeeds/:questionId',
        controller: function ($state, dataSetupService) {
            if (dataSetupService.getLoadedData()) {
                $state.go('answerSection.preLoaded');
            }
            else {
                $state.go('answerSection.bookmarked');
            }
        }
    };

	//State to load the data freshly from the API, in case it is not present in the memory already
    var answersPageBookMarkable = {
        name: 'answerSection.bookmarked',
        url: '',
        template : '<answer-section questions-data-from-api="$resolve.questionsDataFromApi" answers-data-from-api="$resolve.answersDataFromApi"></answer-section>',
        resolve: {
            questionsDataFromApi: function(questionsAPIService){
                return questionsAPIService.fetchAPIData()
                    .then(function(response){
                        return response.data.feed_questions;
                    });
            },
            answersDataFromApi : function(answersAPIService){
                return answersAPIService.fetchAPIData()
                    .then(function(response){
                        return response.data.feed_answers;
                    });
            }
        }
    };

    var answersPagePreLoaded = {
        name: 'answerSection.preLoaded',
        url: '',
        template : '<answer-section question="$resolve.question" answers="$resolve.answers"></answer-section>',
        resolve: {
            question: function($stateParams,dataSetupService){
                return dataSetupService.getQuestion($stateParams.questionId);
            },
            answers: function($stateParams,dataSetupService){
                return dataSetupService.getAnswers($stateParams.questionId);
            }
        }
    };


    $stateProvider.state(home);
    $stateProvider.state(homeDataNotLoaded);
    $stateProvider.state(homeDataLoaded);
    $stateProvider.state(answersPagePreLoaded);
    $stateProvider.state(answersPageBookMarkable);
    $stateProvider.state(answersPage);
    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('feeds')
        .primaryPalette('red')
        .backgroundPalette('blue-grey')
        .accentPalette('deep-orange');
});



/*
	Custom filter to sort objects with objects as properties
 */

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

/*
    Directive to load default images if src is absent
 */

app.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                attrs.$set('src', attrs.onErrorSrc);
            });
        }
    }
});

