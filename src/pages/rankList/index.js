import './index.less';

module.exports = ['$scope', 'utils', 'rankingData',function($scope, utils, rankingData) {

	utils.addEvent("宝妈成长记排行榜页", "排行榜页到达");

	$scope.data = rankingData;	

	$scope.showRole = () => {

		$scope.isShowRole = !$scope.isShowRole;
	}
}]