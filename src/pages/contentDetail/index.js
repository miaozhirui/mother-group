import './index.less';

module.exports = ['$scope', '$state', '$stateParams', 'utils', 'question', function($scope, $state, $stateParams, utils, question) {

	utils.addEvent('宝妈成长记内容详情页', '内容详情页到达');

	$scope.isShowFinishBtn = $stateParams.isFinished ? false: true;
	
	$scope.question = question;
	
	$scope.finishStudy = () => {

		utils.addEvent('宝妈成长记内容详情页', '点击学习完成按钮');

		$state.go('resultPage', {dailyQuestionId: question.dailyQuestionId});
	}
}]