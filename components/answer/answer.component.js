
/*
    Component to display an answer
 */

app.component('answer',{
    bindings: {
        answerObj: '='
    },
    controller: function(){

        let vm = this;
    },
    templateUrl: '/components/answer/answer.html',
    controllerAs: 'vm'
});