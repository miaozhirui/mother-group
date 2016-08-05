import './index.less';

module.exports = ['$scope', '$state', 'utils', 'courseType', function($scope, $state, utils, courseType) {

    utils.addEvent('宝妈成长记内容选择页面', '内容选择页面到达');

    $scope.courseType = courseType;
    $scope.studyId;

    $scope.selectCourse = (e, item) => {

        angular.element(document.querySelectorAll('.course')).removeClass('selected');

        angular.element(e.currentTarget).addClass('selected');

        $scope.studyId = item.id;

    }

    $scope.finishSelect = () => {

        utils.addEvent('宝妈成长记内容选择页面', '点击完成按钮');

        if (!$scope.studyId) {

            return;
        }

        var promise = utils.fetch({

            data: {
                
                studyType: $scope.studyId
            },
            url: '/app.php?a=DailyQuestion&m=setDailyQuestionType'
        })

        promise
        
        .then(function(data) {

            $state.go('contentIndex');
        })
    }
}]
