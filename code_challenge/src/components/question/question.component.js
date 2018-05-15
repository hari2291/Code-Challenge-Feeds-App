

app.component('question',{
    bindings: {
        questionObj: '=',
        onClickUpvote: '&',
        onClickDownvote: '&',
        linkableComponent: '<',
        questionIndex: '<'
    },
    controller: function(){

        let vm = this;
    },
    templateUrl: '/components/question/question.html',
    controllerAs: 'vm'
});