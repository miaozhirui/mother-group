import './index.less';

module.exports = ['$rootScope', '$scope', '$state', '$stateParams', 'utils', 'studyResult', function($rootScope, $scope, $state, $stateParams ,utils, studyResult) {


    utils.addEvent("宝妈成长记学习结果页", "学习结果页到达");

    $scope.studyResult = studyResult;

    $scope.toRank = () => {

        utils.addEvent('宝妈成长记学习结果页', '点击排行榜按钮');

        $state.go('rankList');
    }

    $scope.toContentDetail = () => {

        utils.addEvent('宝妈成长记学习结果页', '点击再次查看今日学习内容');

        $state.go('contentDetail', { isFinished: true, dailyQuestionId: $stateParams.dailyQuestionId })
    }


    $scope.shareResult = () => {

        utils.addEvent('宝妈成长记学习结果页', '点击分享按钮');

        var dailyQuestionId = $stateParams.dailyQuestionId;

        var promise = utils.fetch({

            data: { dailyQuestionId },
            url: '/app.php?a=DailyQuestion&m=getDailyQuestionShare'
        })

        promise.then((data) => {

            var data = data.content;
            var token = $rootScope.queryPublicParams;
            var pureUrl = `${location.href.split('#')[0]}#/landPage`;

            var url = `${pureUrl}?uid=${token.uid}&dailyQuestionId=${dailyQuestionId}&secretKey=${data.secretKey}`;
           
           
            return url;

        })

        .then((url) => {

            utils.appShare({

                title: '跟着嘟嘟医生学育儿，周围宝妈都夸我最懂宝宝',
                content: '妈妈课堂，名医问诊，母婴工具，百万妈妈都在这里啦',
                url: url,
                imgUrl: 'http://webdudutest.ziseyiliao.com/ios/spa/mother_grow/build/imgs/new_logo.png'
            });
        })
    }


}]
