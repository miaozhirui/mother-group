require('babel-polyfill');


module.exports = (app) => {

    app.factory('utils', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {

        return {
            // 提示信息
            tipInfo(opt) {
                var hasTipInfo = document.querySelector('.tip-info-wrapper');
                hasTipInfo || createTipInfo();

                function createTipInfo() {
                    var content = opt.content || '',
                        data = opt.data || null,
                        time = opt.time || 2,
                        callback = opt.callback || function() {},
                        div = document.createElement('div');

                    div.classList.add('tip-info-wrapper');
                    div.innerHTML = content;
                    document.body.appendChild(div);
                    setTimeout(function() {
                        div.parentNode.removeChild(div);
                        callback(data);
                    }, time * 1000);
                }
            },

            showLoading() {
                var div = document.createElement('div');
                div.id = 'loading';
                document.body.appendChild(div);
            },

            hideLoading() {
                var ele = document.getElementById('loading');

                ele && document.body.removeChild(ele);
            },

            //网络请求
            fetch(opt) {

                // 显示等待的提示框
                var defer = $q.defer();
                var self = this;

                //当状态码不是0的时候，是否提示错误信息
                var errorTip = typeof opt.errorTip === 'undefined' ? true : false;

                //是否有加载提示
                var loadingTip = typeof opt.loadingTip === "undefined" ? true : false;

                loadingTip && this.showLoading();

                var params = {
                    method: 'GET',
                    url: opt.url || ''
                }

                var data = !!$rootScope.queryPublicParams ? Object.assign({}, $rootScope.queryPublicParams, opt.data) : opt.data;

                if (opt.type && opt.type.toLowerCase() == 'post')   {

                    params.data = data;
                    params.method = 'POST';
                } else {
                    params.params = data;
                }


                $http(params)
                    .then(function(ngData) {
                        loadingTip && self.hideLoading();

                        var data = ngData.data;
                        //状态码为1的情况就是，前端请求成功了
                        if (data.code === 1) {

                            defer.resolve(data);

                            //其他状态码一律任务是错误的情况
                        } else {

                            var errorCode = require('../errorCode/code');

                            if (errorCode[data.code]) {
                                //公共错误码的各种回调
                                errorCode[data.code].callback(data, self);

                            } else {

                                defer.reject(data);

                                errorTip && self.tipInfo({ content: data.message || '监控到系统异常' });
                            }

                        }

                    }, function(error) {

                        loadingTip && self.hideLoading();

                        var finalError = JSON.stringify(error) === '{}' ? { error: error.toString() } : error;

                        finalError.status == -1 ? self.tipInfo({ content: '网络连接超时...' }) : alert(JSON.stringify(finalError, null, 2));

                    })

                return defer.promise;
            },

            // 判断是否是微信
            isWeiXin() {
                var ua = navigator.userAgent.toLowerCase();

                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                }
                return false;
            },

            // 获得微信签名认证
            getWxJsSign(callback) {
                var self = this,
                    url = location.href.split('#')[0],

                    currentUrl = encodeURIComponent(url),
                    wxSign = null;

                var promise = this.fetch({
                    url: '/common.php?a=Index&m=getJsSign&url=' + currentUrl
                })

                promise.then(function(data) {

                    var mySign = data.content;

                    var wxSign = {
                        // debug: true,
                        appId: mySign.appId,
                        nonceStr: mySign.nonceStr, // 必填，生成签名的随机串
                        timestamp: mySign.timestamp, // 必填，生成签名的时间戳
                        signature: mySign.signature, // 必填，签名
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'openLocation',
                            'getLocation',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'hideOptionMenu',
                            'getNetworkType',
                            'hideMenuItems',
                            'closeWindow',
                        ]
                    }

                    wx.config(wxSign);

                    wx.ready(function() {
                        callback();
                    })

                }, function(data) {

                    self.tipInfo({
                        content: data.message || '监测到系统异常,请稍后再试'
                    });
                })
            },

            //微信支付接口
            wxPay(opt) {

                var defer = $q.defer();
                var self = this;
                var promise = this.fetch({
                    url: opt.url,
                    data: opt.data
                })

                promise.then(function(data) {
                    var content = data.content;

                    self.getWxJsSign(function() {
                        wx.chooseWXPay({
                            timestamp: content.timeStamp,
                            nonceStr: content.nonceStr,
                            package: content.package,
                            signType: content.signType,
                            paySign: content.paySign,
                            success: function(res) {

                                defer.resolve(res);
                            },
                            cancel: function() {

                                defer.reject()
                            }
                        })
                    })

                })

                return defer.promise;
            },

            //微信分享
            wxShare(opt) {

                var title = opt.title || '默认的标题',
                    desc = opt.content || '默认的描述页面',
                    link = opt.link || '没传地址',
                    imgUrl = opt.imgUrl || '',
                    success = opt.success,
                    cancel = opt.cancel;


                this.getWxJsSign(function() {

                    // 分享给朋友
                    wx.onMenuShareAppMessage({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success: function() {

                            success && success();
                        },
                        cancel: function() {

                            success && success();
                        }
                    });

                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: title,
                        link: link,
                        imgUrl: imgUrl,
                        success: function() {

                            success && success();
                        },
                        cancel: function() {

                            cancel && cancel();
                        }
                    });

                    // 分享给qq好友
                    wx.onMenuShareQQ({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success: function() {

                            success && success();
                        },
                        cancel: function() {

                            cancel && cancel();
                        }
                    });
                })
            },

            initTalkingData(appId, versionName, versionId) {

                var fileref = document.createElement('script');

                fileref.setAttribute("src", 'http://sdk.talkingdata.com/app/h5/v1?appid=' + appId + '&vn=' + versionName + '&vc=' + versionId);
                document.getElementsByTagName("head")[0].appendChild(fileref);

            },

            addEvent() {

                var arrs = Array.prototype.slice.call(arguments);

                setTimeout(function() {

                    try {

                        TDAPP.onEvent.apply(TDAPP, arrs);
                    } catch (e) {

                        console.log(e);
                    }

                }, 1000);
            },

            downLoadApp() {

                var ua = navigator.userAgent.toLowerCase();

                if(/weibo/.test(ua)) {
                    
                    var div = document.createElement('div');

                    div.classList.add('browser-open');

                    div.innerHTML = '<div class="content"><p>请在浏览器中打开</p><span class="icon"></span></div>';

                    document.querySelector('body').appendChild(div);

                    return;
                }

                if (/android/.test(ua)) {

                    location.href = 'http://url.cn/27iH1qM';
                } else {
                    location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zitengfang.patient';
                }
            },

            appShare({title = '', content = '', url = '', imgUrl = '', shareTip = '' }, fn = "social_share") {

                var opt = {
                    Title: title,
                    Content: content,
                    Url: url,
                    ImgUrl: imgUrl,
                    ShareTip: shareTip
                }

                this.jsToNative(fn, JSON.stringify(opt));
            },

            // 和原生通信
            jsToNative(fn, opt) {
                var iframe = document.createElement('iframe');
                iframe.src = "_" + fn + "://" + encodeURIComponent(opt);
                iframe.style.display = "none";
                document.body.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            },

        }
    }])

    app.factory('Paging', ['$q', 'utils', function($q, utils) {

        var Paging = function(opt) {
            this.items = [];
            this.busy = false;
            this.url = opt.url;
            this.data = opt.data;
            this.p = opt.data.p;
            this.isHasMoreData = true;
            this.nowPage = 0;
            this.totalPages = 0;

        }

        Paging.prototype.nextPage = function() {

            if (!this.isHasMoreData) return;

            if (this.busy) return;
            this.busy = true;

            var url = this.url || '';
            var data = this.data;
            data.p = this.p++;


            var promise = utils.fetch({

                url: url,
                data: data,
                loadingTip: false
            });

            promise.then(function(data) {

                this.busy = false;
                var content = data.content.data;
                var nowPage = data.content.nowPage;
                var totalPages = data.content.totalPages;
                this.nowPage = nowPage;
                this.totalPages = totalPages;

                if (nowPage >= totalPages) {

                    this.isHasMoreData = false;
                }

                for (var i = 0; i < content.length; i++) {

                    this.items.push(content[i]);
                }

            }.bind(this))

        }

        return Paging;
    }])

}
