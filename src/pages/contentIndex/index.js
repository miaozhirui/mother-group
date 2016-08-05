
import './index.less';

module.exports = ['$scope', '$state', 'utils', 'question', function($scope, $state, utils, question) {

	utils.addEvent('宝妈成长记学习内容首页', '学习内容首页到达');
	
	$scope.question = question;

	$scope.toContentDetail = () => {

		utils.addEvent('宝妈成长记学习内容首页', '点击进入学习按钮');

		$state.go('contentDetail');
	}

	$scope.reStudyContent = () => {

		utils.addEvent('宝妈成长记学习内容首页', '点击重选内容范围按钮');

		$state.go('studyType', {reSelect: true});
	}
}]