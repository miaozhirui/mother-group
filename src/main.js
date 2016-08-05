 import 'angular-ui-router';
 import 'angular-touch';

 //公共的样式
 import './css/common.less';

 import 'babel-polyfill';

 var app = angular.module('app', ['ui.router', 'ngTouch']);

 //加载指令组件
 require('./js/directive/component')(app);

 //加载服务
 require('./js/service/utils')(app);

 // 获取web端请求的令牌
 require('./js/service/webToken')(app);

 //配置路由
 app.config(require('./js/router'));
 
 // 应用初始化
 app.run(require('./js/init'));

