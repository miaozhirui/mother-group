module.exports = (duduApp) => {

    //吉祥物学习内容
    duduApp.directive('animalContent', function() {

        return {
            restrict: 'E',
            replace: true,
            template: require('./tpl/animalContent.html'),
            scope: {
                data: "=question",
                isShowAnswer: '='
            }

        }
    })

    // 用户学习状态
    duduApp.directive('userStudyState', function() {

        return {
            restrict: 'E',
            replace: true,
            template: require('./tpl/userStudyState.html'),
            scope: {

                result: "=",
                toRank: "&",
                isShowRank: "="
            },
            link: function(scope) {

                scope.handleClickRank = () => {

                    scope.toRank();
                }
            }
            
        }
    })
}
