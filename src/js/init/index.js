module.exports = ['$rootScope', 'utils', 'webToken', function($rootScope, utils, webToken) {

    // 埋点事件
    if (TEST) {//测试环境

        utils.initTalkingData('9F41CCF6A49321DF3AD74D2617FB1873', '产品类测试环境', '1.0');
    }

    if (RELEASE) {//正式环境

        utils.initTalkingData('2A548C5751082D1DB68E7544F5E39731', '产品类正式环境', '1.0');
    }

    // 设置全局请求的认证参数
    $rootScope.queryPublicParams = webToken;


}]
