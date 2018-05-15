
/*
    Component to display the individual question and the associated answers.
 */

app.component('questionsList',{
    bindings: {
        questionsData: '<',
        answersData: '<',
        loadedAlready: '<'
    },
    controller: function(dataSetupService){

        let vm = this;

        vm.$onInit = () => {
            if(vm.loadedAlready){
                vm.modelData = {
                    questions: vm.questionsData,
                    answers: vm.answersData
                }
            }
            else{
                vm.modelData = dataSetupService.setupData(vm.questionsData,vm.answersData);

            }
            vm.questionMap = vm.modelData.questions;
        };

        vm.upVote = (id) => {
            updateVotes(id, 'upvotes', 'downvotes');
        };

        vm.downVote = (id) => {
            updateVotes(id, 'downvotes', 'upvotes');
        };

        let updateVotes = (id,activeCategory,inactiveCategory) => {
            if(vm.questionMap[id].activeVote == ''){
                vm.questionMap[id].activeVote = activeCategory;
                vm.questionMap[id][activeCategory] = (parseInt(vm.questionMap[id][activeCategory]) + 1).toString();
            }
            else if(vm.questionMap[id].activeVote == inactiveCategory){
                vm.questionMap[id].activeVote = activeCategory;
                vm.questionMap[id][activeCategory] = (parseInt(vm.questionMap[id][activeCategory]) + 1).toString();
                vm.questionMap[id][inactiveCategory] = (parseInt(vm.questionMap[id][inactiveCategory]) == 0) ? '0' : (parseInt(vm.questionMap[id][inactiveCategory])-1).toString();
            }
            else{
                vm.questionMap[id][activeCategory] = (parseInt(vm.questionMap[id][activeCategory]) == 0) ? '0' : (parseInt(vm.questionMap[id][activeCategory])-1).toString();
                vm.questionMap[id].activeVote = '';
            }
        };

        vm.$onDestroy = () => {
            dataSetupService.saveData(vm.modelData);
        }

    },
    templateUrl: '/components/questions-list/questions-list.html',
    controllerAs: 'vm'
});