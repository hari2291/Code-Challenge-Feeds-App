
/*
    This file contains all the factory services for the application
 */

//Factory service to fetch the questions data from the API

app.factory('questionsAPIService',function($http){
	let questionsURL = "https://api.myjson.com/bins/dck5b";

	return {
		fetchAPIData : function(){
			return $http.get(questionsURL);
			}
		}
});

//Service to fetch the answers data from the API

app.factory('answersAPIService',function($http){
    let answersURL = "https://api.myjson.com/bins/hildr";

    return {
        fetchAPIData : function(){
            return $http.get(answersURL);
        }
    }
});

/*
    Service that is used to modify the fetched data, in the format that can be easily used to render the views.
    Format for questions data -> {q-1:{Text:"",lastUpdatedTime:""...},q-2:{Text:"",lastUpdatedTime:""...}}
    Format for answers data -> {q-1:{a-1:{Text:"",lastUpdatedTime:""...},a-2:{Text:"",lastUpdatedTime:""...}},
    q-2:{a-1:{Text:"",lastUpdatedTime:""...},a-2:{Text:"",lastUpdatedTime:""...}...}
    The factory also converts some information, such as date and time to javascript objects so that the data can be sorted easily.
 */

app.factory('dataSetupService',function(){
    let monthToNumberMap = new Map([['Jan',0],['Feb',1],['Mar',2],['Apr',3],['May',4],['Jun',5],['Jul',6],['Aug',7],['Sep',8],['Oct',9],['Nov',10],['Dec',11]]);
    let modelData = null;
    let questionAnswerMapObj = {};
    let answersLength = 0;

    return {
        //This function sets up initial data for the views, once raw data is extracted from the services
        setupData : function(questionsData,answersData){
            answersLength = answersData.length;
            answersData.forEach(function(answerItem){
                modelData = {
                    questions : {},
                    answers : {}
                };
                let splitDateString = answerItem.created_at.split(" ");
                let [date,time] = splitDateString;
                date = date.split("/");
                time = time.split(":");
                answerItem.createdDateTime = new Date(parseInt('20'+date[2]),monthToNumberMap.get(date[1]),parseInt(date[0]),parseInt(time[0]),parseInt(time[1]));
                answerItem.created_at = date[1]+' '+date[0]+', 20'+date[2];
                answerItem.upvotes = answerItem.upvotes || 0;
                answerItem.downvotes = answerItem.downvotes || 0;
                answerItem.Answer = answerItem.Answer.replace(/<{1}[^<>]{1,}>{1}/g," ");
                if((answerItem.created_by instanceof Object) && (answerItem.created_by.Name == '')){
                    answerItem.created_by.Name = 'Anonymous';
                }
                else if((!answerItem.created_by) || (answerItem.created_by === 'Anonymous')){
                    answerItem.created_by = {};
                    answerItem.created_by.Name = 'Anonymous';
                }
                answerItem.activeVote = "";
            });

            answersData.sort(function(answerItem1,answerItem2){
                return (answerItem1.createdDateTime - answerItem2.createdDateTime);
            });

            answersData.forEach(function(answerItem){
                if(!questionAnswerMapObj[answerItem['Question-Id']]){
                    let answerObj = {};
                    answerObj[answerItem['Id']] = answerItem;
                    questionAnswerMapObj[answerItem['Question-Id']] = answerObj;
                }
                else{
                    questionAnswerMapObj[answerItem['Question-Id']][answerItem['Id']] = answerItem;
                }

            });

            questionsData.forEach(function(questionItem){
                let questionMapObj = questionItem;
                let questionObj = questionAnswerMapObj[questionItem['Id']];
                if(questionObj){
                    questionMapObj.lastUpdatedTime = questionObj[[Object.keys(questionObj)[0]]].createdDateTime;
                    questionMapObj.lastUpdatedOn = questionObj[[Object.keys(questionObj)[0]]].created_at;
                }
                else{
                    questionMapObj.lastUpdatedTime = null;
                    questionMapObj.lastUpdatedOn = null;
                }
                questionMapObj.upvotes = questionItem.upvotes || 0;
                questionMapObj.downvotes = questionItem.downvotes || 0;
                questionMapObj.Text = questionMapObj.Text.replace(/<{1}[^<>]{1,}>{1}/g," ");
                questionMapObj.activeVote = "";
                modelData.questions[questionItem['Id']] = questionMapObj;
            });
            modelData.answers = questionAnswerMapObj;
            return modelData;
        },

        getLoadedData: function(){
            return modelData;
        },

        getQuestion: function(id){
            return modelData.questions[id];
        },

        getAnswers: function(questionId){
            return modelData.answers[questionId];
        },

        saveData: function(data) {
            modelData = data;
        },

        monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

        updateQuestionData: function(question){
            modelData.questions[question.Id] = question;
        },

        //Function used to add a new answer entry

        addNewAnswer: function(newAnswer,questionId){
            let newAnswerId = 'A-'+(++answersLength);
            newAnswer.Id = newAnswerId;
            if(!modelData.answers[questionId])
                modelData.answers[questionId] = {};
            modelData.answers[questionId][newAnswerId] = newAnswer;
            return newAnswer;
        },

        updateQuestionDateTime: function(questionId,updatedDateTime){
            modelData.questions[questionId].lastUpdatedTime = updatedDateTime;
            modelData.questions[questionId].lastUpdatedOn = this.monthNames[updatedDateTime.getMonth()]+' '+updatedDateTime.getDate()+', '+updatedDateTime.getFullYear();
        }

    }
});

