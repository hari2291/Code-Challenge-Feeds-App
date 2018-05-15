
/*
    Component to display the answers to an individual question.
 */

app.component('answerSection',{
    bindings: {
        question: '<',
        answers: '<',
        questionsDataFromApi:'<',
        answersDataFromApi: '<'
    },
    controller: function($stateParams,dataSetupService){

        let vm = this;

        vm.$onInit = () => {

            //If the page is loaded freshly, the data is fetched from the API. Otherwise, the data is being loaded from the service

            if(vm.questionsDataFromApi && vm.answersDataFromApi){
                vm.modelData = dataSetupService.setupData(vm.questionsDataFromApi,vm.answersDataFromApi);
                vm.question = vm.modelData.questions[$stateParams.questionId];
                vm.questionText = vm.question.Text;
                vm.answers = dataSetupService.getAnswers($stateParams.questionId);
            }
            else{
                vm.questionText = vm.question.Text;
            }
            vm.answers = vm.answers ? vm.answers : {};
        };

        vm.upVote = (id) => {
            updateVotes(id, 'upvotes', 'downvotes');
        };

        vm.downVote = (id) => {
            updateVotes(id, 'downvotes', 'upvotes');
        };

        //Function updateVotes will update the votes once the user clicks on the thumb icons

        let updateVotes = (id,activeCategory,inactiveCategory) => {
            if(vm.question.activeVote == ''){
                vm.question.activeVote = activeCategory;
                vm.question[activeCategory] = (parseInt(vm.question[activeCategory]) + 1).toString();
            }
            else if(vm.question.activeVote == inactiveCategory){
                vm.question.activeVote = activeCategory;
                vm.question[activeCategory] = (parseInt(vm.question[activeCategory]) + 1).toString();
                vm.question[inactiveCategory] = (parseInt(vm.question[inactiveCategory]) == 0) ? '0' : (parseInt(vm.question[inactiveCategory])-1).toString();
            }
            else{
                vm.question[activeCategory] = (parseInt(vm.question[activeCategory]) == 0) ? '0' : (parseInt(vm.question[activeCategory])-1).toString();
                vm.question.activeVote = '';
            }
        };

        //Function to add new answer in the detail page

        vm.addNewAnswer = () =>{
            let newAnswer = new addedAnswer(vm.addAnswerForm.answer,vm.addAnswerForm.firstName,vm.addAnswerForm.lastName,vm.addAnswerForm.avatar);
            vm.latestAnswer = dataSetupService.addNewAnswer(newAnswer,$stateParams.questionId);
            vm.answers[vm.latestAnswer.Id] = vm.latestAnswer;
            dataSetupService.updateQuestionDateTime($stateParams.questionId,vm.latestAnswer.createdDateTime);
        };

        //Creation of the new answer object ans assignment of properties

        let addedAnswer = function(answer,firstName,lastName,avatar){
            this.Answer = answer;
            this.created_by = {};
            this.created_by.Name = firstName;
            this.created_by.Surname = lastName;
            this.created_by.Avatar = avatar;
            this['Question-Id'] = $stateParams.questionId;
            this.upvotes = '0';
            this.downvotes = '0';
            this.createdDateTime = new Date();
            let month = dataSetupService.monthNames[this.createdDateTime.getMonth()];
            this.created_at = month+' '+this.createdDateTime.getDate()+', '+this.createdDateTime.getFullYear();
        };

        //The $onDestroy method saves the changed data, by utilizing the datasetupService factory

        vm.$onDestroy = () => {
            dataSetupService.updateQuestionData(vm.question);
        }
    },
    templateUrl: '/components/answer-section/answer-section.html',
    controllerAs: 'vm'
});