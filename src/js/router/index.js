module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    //加这这句话在自己公司的ios里面有个bug，目前不知道为什么，所以先去掉
    // $urlRouterProvider.otherwise('studyType');

    $stateProvider

    //选择分类页面
        .state('studyType', {

        url: '/studyType',
        template: require('../../pages/studyType/index.html'),
        controller: require('../../pages/studyType/index.js'),

        resolve: {
            courseType: ['$q', '$state', 'utils', ($q, $state, utils) => {

                var defer = $q.defer();

                var promise = utils.fetch({

                    url: '/app.php?a=DailyQuestion&m=getDailyQuestionStatus'
                })

                promise.then(function(data) {

                    var data = data.content;

                    defer.resolve(data.studyType);

                })

                return defer.promise;

            }]

        }
    })

    // 内容首页
    .state('contentIndex', {

        url: '/contentIndex',
        template: require('../../pages/contentIndex/index.html'),
        controller: require('../../pages/contentIndex/index.js'),
        resolve: {
            question: ['$q', 'utils', function($q, utils) {

                var defer = $q.defer();

                var promise = utils.fetch({
                   
                    url: '/app.php?a=DailyQuestion&m=getDailyQuestion'
                })

                promise.then(function(data) {

                    defer.resolve(data.content);
                })

                return defer.promise;
            }]
        }
    })

    // 内详情页面
    .state('contentDetail', {

        url: '/contentDetail?isFinished&dailyQuestionId',
        template: require('../../pages/contentDetail/index.html'),
        controller: require('../../pages/contentDetail/index.js'),
        resolve: {
            question: ['$q', '$stateParams', 'utils', function($q, $stateParams, utils) {

                var defer = $q.defer();

                var promise = utils.fetch({
                    
                    data: {
                        
                        dailyQuestionId: $stateParams.dailyQuestionId
                    },
                    url: '/app.php?a=DailyQuestion&m=getDailyQuestion'
                })

                promise.then(function(data) {

                    defer.resolve(data.content);

                })

                return defer.promise;
            }]
        }
    })

    // 结果页面
    .state('resultPage', {

        url: '/resultPage?dailyQuestionId',
        template: require('../../pages/resultPage/index.html'),
        controller: require('../../pages/resultPage/index.js'),
        resolve: {

            studyResult: ['$q', 'utils', function($q, utils) {

                var defer = $q.defer();

                var promise = utils.fetch({

                    url: '/app.php?a=DailyQuestion&m=getDailyQuestionResult'
                })

                promise.then(function(data) {

                    defer.resolve(data.content);
                })

                return defer.promise;
            }]
        }
    })

    // 排行榜页面
    .state('rankList', {

        url: '/rankList',
        template: require('../../pages/rankList/index.html'),
        controller: require('../../pages/rankList/index.js'),
        resolve: {

            rankingData: ['$q', 'utils', function($q, utils) {

                var defer = $q.defer();

                var promise = utils.fetch({

                    url: '/app.php?a=DailyQuestion&m=getDailyQuestionRank'
                })

                promise.then(function(data) {

                    defer.resolve(data.content);
                })

                return defer.promise;
            }]
        }
    })

    // 分享落地页面
    .state('landPage', {

        url: '/landPage?uid&dailyQuestionId&secretKey',
        template: require('../../pages/landPage/index.html'),
        controller: require('../../pages/landPage/index.js'),
        resolve: {

            landPageData: ['$q', '$stateParams', 'utils', function($q, $stateParams, utils) {

                var defer = $q.defer();

                var promise = utils.fetch({

                    data: {
                        uid: $stateParams.uid,
                        dailyQuestionId: $stateParams.dailyQuestionId,
                        secretKey: $stateParams.secretKey
                    },

                    url: '/share.php?a=Share&m=getDailyQuestionShare'
                })

                promise.then(function(data) {

                    defer.resolve(data.content);
                })

                return defer.promise;
            }]
        }
    })
}]
