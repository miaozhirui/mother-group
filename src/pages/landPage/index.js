import './index.less';

module.exports = ['$scope', 'utils', 'landPageData', function($scope, utils, landPageData) {

	utils.addEvent('宝妈成长记分享落地页', '分享落地页面到达');

	$scope.data = landPageData;

	$scope.downLoadApp = () => {

		utils.addEvent('宝妈成长记分享落地页', '点击微信落地页中的下载嘟嘟按钮');
		
		utils.downLoadApp();
	}
}]