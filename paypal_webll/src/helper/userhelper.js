// let dsbridge = require('dsbridge');
let axios = require('axios');
import IIHelper from './IIHelper'
import nethelper from './nethelper'
import dsbridge from './swbridge'
var JSONbig = require('json-bigint');


let userhelper = {
    saveobj(key,obj){
        try {
            localStorage.setItem(key, JSON.stringify(obj));
          } catch (_) {
            // no-op Safari private mode
        }
    },
    getobj(key){
        let data = {};
        try {
          data = JSON.parse(localStorage.getItem(key));
        } catch (_) {
          // no-op Safari private mode
        }

        return data;
    },
    removeobj(key){
        try {
            localStorage.removeItem(key);
        } catch (_) {
        }
    },

    logined: false,

    _currentcoins: 0,
    get currentcoins(){
        return this._currentcoins;
    },
    set currentcoins(coins){
        this._currentcoins = coins;
    },


    _logged_in_user: null,
    get logged_in_user() {
        if (this._logged_in_user) {
            return this._logged_in_user;
        }
        else {
            return this.getobj('logged_in_user');
        }
    },
    set logged_in_user(user) {
        if (user == undefined || user == null) {
            this.removeobj('logged_in_user');
            this._logged_in_user = null;
            return ;
        }
        this.saveobj('logged_in_user', user);
        this._logged_in_user = user;
    },

    logoutUser(cb){
        let body = {
            "_uuid": nethelper.uuid,
            "device_id": nethelper.deviceid,
        };
        IIHelper.logoutIIUser(body,function (res,error) {
            if (!error){
                this.logged_in_user = null;
            }
            cb(res,error);
        }.bind(this));
    },

    _userconfig: null,
    get userconfig() {
        return this._userconfig;
    },
    set userconfig(config) {
        // this.setItem('userconfig',config);
        this._userconfig = config;
    },

    setLastinputUserName(jsonobj) {
        this.saveobj('lastinputUserName', jsonobj);
    },

    getLastinputUserName() {
        return this.getobj('lastinputUserName');
    },

    setLastCheckTimestamp(obj) {
        localStorage.setItem('lastCheckTimestamp', obj);
    },

    getLastCheckTimestamp() {
        return localStorage.getItem('lastCheckTimestamp');
    },

    setCheckDaily(obj) {
        this.saveobj('checkDaily', obj);
    },

    getCheckDaily() {
        return this.getobj('checkDaily');
    },

    getLoginUser: function () {
        return this.loginedUser;
    },
//
    postRequest(settings, callback) {
        try {
            if (nethelper.useAxios) {    //axios
                axios(settings).then((response) => {
                    if (response.data.status.status !== 200) {
                        callback(null, {errorMessage: response.data.status.statusMsg});
                    }
                    else {
                        let resStr = JSON.stringify(response.data);
                        let res = JSONbig.parse(resStr);

                        callback(response.data, null);
                    }
                }, (error) => {
                    console.log(error);
                    callback(null, {errorMessage: error});
                });
            } else {         //ios dsbridge
                settings.url = settings.url.replace('/our',nethelper.oururl);
                settings.data = JSON.stringify(settings.data);
                dsbridge.call(settings.method, settings, function (resStr) {
                    let res = JSONbig.parse(resStr).data;
                    if (res.status.status !== 200) {
                        callback(null, {errorMessage: res.status.statusMsg?res.status.statusMsg:JSON.stringify(res)});
                    }
                    else {
                        callback(res, null);
                    }
                });
            }
        } catch (e) {
            alert('Error:'+e);
        } finally {

        }

    },

///api
    login(dict, callback) {   //our 服务器数据
        console.log(dict);
        let body = {
            "_csrftoken": nethelper.initcsrftoken,
            "_uuid": nethelper.uuid,
            "device_id": nethelper.deviceid,
            "from_reg": false,
            "password": dict.password,
            "username": dict.username
        };

        IIHelper.loginIIUser(body, (res, error) => {
            if (error) {
                console.log(error)
                callback(null, error);
                return;
            }
            else {
                this.logged_in_user = res.data.logged_in_user;
                return this.directlogin(callback);
            }
        });
    },

    directlogin: function (callback) {
        let iiuser = this.logged_in_user;
        if (iiuser == null || iiuser === undefined) {
            callback(null, {errorMessage: 'no logged user'});
            return;
        }
        let data = {
            "user": {
                "mainUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
            },

                "currentUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "deviceId": nethelper.deviceid,
                "packageName": nethelper.packagename,
                "socialPlatform": "Instagram"
            }
        };

        let timestamp = Date.parse(new Date());
        if (iiuser.pk.toString().length >3) {
            timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        }

        let pp = `{url:${nethelper.signurl}/v2/user/login,postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();


        let settings = {
            url: "/our/v2/user/login",
            // url: 'http://i.hashfun.tk/login',
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };

        let context_loginhelper = this;

        this.postRequest(settings, (res, error) => {
            if (error) {
                console.log(error);
                callback(null, error);
            }
            else {
                context_loginhelper.logined = true;
                context_loginhelper.userconfig = res.data;
                context_loginhelper.currentcoins = res.data.coins;
                callback(res.data, null);
            }

        });
    },

//    NSString *url = [NSString stringWithFormat:@"https://baseurl/v2/user/%@/getBoard/%@/%@", loginUser.userId,type,[self hmac:[NSString stringWithFormat:@"%@%@", loginUser.userId, loginUser.password] withKey:key]];
    nadingdan: function (getBoard, callback) {
        let iiuser = this.logged_in_user;
        console.log(iiuser);
        let data = {
            "user": {
                "mainUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "currentUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "deviceId": nethelper.deviceid,
                "packageName": nethelper.packagename,
                "socialPlatform": "Instagram"
            }
        };
        let timestamp = Date.parse(new Date());
        if (iiuser.pk.toString().length >3) {
            timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        }
        let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/getBoard/" + getBoard + "/" + data.user.currentUser.sessionToken;
        let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();

        let settings = {
            url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/getBoard/" + getBoard + "/" + data.user.currentUser.sessionToken,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };
        this.postRequest(settings, callback);

    },


//NSString *url = [NSString stringWithFormat:@"https://baseurl/v2/user/%@/trackAction/%@/0/%@/%@/%@/%@",user.userId,user.sessionToken,[msg objectForKey:@"orderId"],type,[msg objectForKey:@"targetUserId"],[msg objectForKey:@"postId"]];

    zuodingdan: function (skipOrDo, dingdan, callback) {
        // console.log(dingdan);
        if (dingdan.postId == undefined || dingdan.postId == null) {
            dingdan.postId = 0;
        }

        let type = 0;
        switch (dingdan.kind) {
            case "like":
                type = 2;
                break;
            case "follow":
                type = 3;
                break;
            case "loops":
                type = 5;
                break;
            case "comment":
                type = 6;
                break;
            case "storyview":
                type = 7;
                break;
            default:
                type = 0;
        }
        let iiuser = this.logged_in_user;
        let data = {
            "user": {
                "mainUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "currentUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "deviceId": nethelper.deviceid,
                "packageName": nethelper.packagename,
                "socialPlatform": "Instagram"
            },
            order: dingdan,
            doornot: skipOrDo ? 1 : 0,
        };


        if (skipOrDo) {
            let timestamp = Date.parse(new Date());
            if (iiuser.pk.toString().length >3) {
                timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
            }
            let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/trackAction/" + data.user.currentUser.sessionToken + "/1/" + dingdan.orderId + "/" + type + "/" + dingdan.viUserId + "/" + dingdan.postId;
            let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
            let header = nethelper.header;
            header.signature = nethelper.oursign(pp);
            header.timestamp = timestamp.toString();

            let settings = {
                url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/trackAction/" + data.user.currentUser.sessionToken + "/1/" + dingdan.orderId + "/" + type + "/" + dingdan.viUserId + "/" + dingdan.postId,
                method: 'post',
                data: data,
                headers: header,
                timeout: 30000
            };
            this.postRequest(settings, callback);
        }
        else {
            IIHelper.IIUserZuoDingdan(data.user.currentUser, dingdan, function (res, error) {
                if (error) {
                    callback(null, error);
                } else {
                    let timestamp = Date.parse(new Date());
                    if (iiuser.pk.toString().length >3) {
                        timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
                    }
                    let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/trackAction/" + data.user.currentUser.sessionToken + "/0/" + dingdan.orderId + "/" + type + "/" + dingdan.viUserId + "/" + dingdan.postId;
                    let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
                    let header = nethelper.header;
                    header.signature = nethelper.oursign(pp);
                    header.timestamp = timestamp.toString();

                    let settings = {
                        url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/trackAction/" + data.user.currentUser.sessionToken + "/0/" + dingdan.orderId + "/" + type + "/" + dingdan.viUserId + "/" + dingdan.postId,
                        method: 'post',
                        data: data,
                        headers: header,
                    };
                    this.postRequest(settings, callback);
                }
            }.bind(this));
        }
    },

    fenPayloadTreasfer: function (payload) {
        let iiuser = this.logged_in_user;
        let user = {
            "mainUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "currentUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "deviceId": nethelper.deviceid,
            "packageName": nethelper.packagename,
            "socialPlatform": "Instagram"
        };

        let data = {   //订单
            good: payload.goods,
            order: {
                orderKind: 3,
                postId: 0,
                startAt: payload.user.follower_count,
                targetUserId: iiuser.pk,
                targetUsername: iiuser.username,
                targetUserAvatar: iiuser.profile_pic_url,
                videoLowURL: "",
                videoUrl: ""
            },
            user: user
        };
        return {iiuser, data};
    },

// NSString *url = [NSString stringWithFormat:@"https://baseurl/v2/user/%@/createOrder/%@/3/%@/0",user.userId,user.sessionToken,user.userId];
    tijiaofendingdan: function (payload, callback) {
        let {iiuser, data} = this.fenPayloadTreasfer(payload);
        let timestamp = Date.parse(new Date());
        if (iiuser.pk.toString().length >3) {
            timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        }
        let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/3/" + data.user.currentUser.vineUserId + "/0";
        let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();

        let settings = {
            url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/3/" + iiuser.pk + "/0",
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };
        this.postRequest(settings, callback);
    },

    zanPayloadTransfer: function (payload) {
        let iiuser = this.logged_in_user;
        let user = {
            "mainUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "currentUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "deviceId": nethelper.deviceid,
            "packageName": nethelper.packagename,
            "socialPlatform": "Instagram"
        };
        let data = {
            good: payload.goods,
            order: {
                orderKind: 2,
                postId: payload.post.pk,
                postTimestamp: payload.post.taken_at,
                startAt: payload.goods.goodsType === 2?payload.post.like_count:payload.post.view_count,
                targetUserId: iiuser.pk,
                targetUsername: iiuser.username,
                targetUserAvatar: iiuser.profile_pic_url,
                thumbnailUrl: IIHelper.getPostThumbUrl(payload.post),
                videoLowURL: IIHelper.getPostThumbUrl(payload.post),
                videoUrl: IIHelper.getPostThumbUrl(payload.post),
                trackingToken: payload.post.organic_tracking_token,
                targetPostCode: payload.post.code
            },
            user: user
        };
        return {iiuser, data};
    },

    //NSString *url = [NSString stringWithFormat:@"https://baseurl/v2/user/%@/createOrder/%@/2/%@/%@",user.userId,user.sessionToken,user.userId,[[dicData objectForKey:@"post"] objectForKey:@"pk"]];
    tijiaozandingdan(payload, callback) {

        let {iiuser, data} = this.zanPayloadTransfer(payload);
        let timestamp = Date.parse(new Date());
        if (iiuser.pk.toString().length >3) {
            timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        }
        let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/2/" + data.user.currentUser.vineUserId + "/" + payload.post.pk;
        let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();

        let settings = {
            url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/2/" + data.user.currentUser.vineUserId + "/" + payload.post.pk,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };
        console.log(data);
        console.log(url);
        this.postRequest(settings, callback);

    },
    pinglunpaloadTransform: function (payload) {
        let iiuser = this.logged_in_user;
        let user = {
            "mainUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "currentUser": {
                "vineUserId": iiuser.pk,
                "sessionToken": iiuser.pk,
                "firstLogin": "",
                "lastLogin": "",
                "vineUserName": iiuser.username
            },

            "deviceId": nethelper.deviceid,
            "packageName": nethelper.packagename,
            "socialPlatform": "Instagram"
        };
        let data = {
            good: payload.goods,
            order: {
                orderKind: 6,
                postId: payload.post.pk,
                postTimestamp: payload.post.taken_at,
                startAt: payload.post.comment_count,
                commentsList: payload.commentArray,
                targetUserId: iiuser.pk,
                targetUsername: iiuser.username,
                targetUserAvatar: iiuser.profile_pic_url,
                thumbnailUrl: IIHelper.getPostThumbUrl(payload.post),
                videoLowURL: IIHelper.getPostThumbUrl(payload.post),
                videoUrl: IIHelper.getPostThumbUrl(payload.post),
                trackingToken: payload.post.organic_tracking_token,
                targetPostCode: payload.post.code
            },
            user: user
        };
        return {iiuser, data};
    },

    tijiaopinglundingdan(payload, callback) {
        let {iiuser, data} = this.pinglunpaloadTransform(payload);
        console.log(payload.goods);
        let timestamp = Date.parse(new Date());
        if (iiuser.pk.toString().length >3) {
            timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        }
        let url = nethelper.signurl + "/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/6/" + data.user.currentUser.vineUserId + "/" + payload.post.pk;
        let pp = `{url:${url},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();

        let settings = {
            url: "/our/v2/user/" + data.user.currentUser.vineUserId + "/createOrder/" + data.user.currentUser.sessionToken + "/6/" + data.user.currentUser.vineUserId + "/" + payload.post.pk,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };
        this.postRequest(settings, callback);
    },



    userpass: function (callback) {
        if (nethelper.useAxios) {
            return callback(true);
        }

        let arr = dsbridge.call('cookies',nethelper.HOSTNAME);
        let ds_user_id=0;
        for (var i=0; i<arr.length;i++){
            if (arr[i].name.toLowerCase() === 'ds_user_id') {
                ds_user_id = arr[i].value;
            }
        }

        let data = {
            "userId": ds_user_id,
            "deviceId": nethelper.deviceid,
        };

        let timestamp = Date.parse(new Date());
        timestamp = parseInt(timestamp.toString().slice(0,-3));

        let pp = `{url:${nethelper.signurl}/v2/user/log,postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();


        let settings = {
            url: "/our/v2/user/log",
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };

        let context_loginhelper = this;

        this.postRequest(settings, (res, error) => {
            if (error) {
                callback(false);
            }
            else {
                if (res.data.code!=undefined && res.data.code == 200) {
                    callback(true);

                }
                else{
                    callback(false);
                }
            }

        });
    },

    verifyiap: function (productId,receipt,item,callback) {
        let iiuser = this.logged_in_user;
        if (iiuser == null || iiuser === undefined) {
            callback(null, {errorMessage: 'no logged user'});
            return;
        }
        let data = {
            "user": {
                "mainUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
            },

                "currentUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "deviceId": nethelper.deviceid,
                "packageName": nethelper.packagename,
                "socialPlatform": "Instagram"
            }
        };
        data.iap = {
            productId:productId,
            originalReceipt:receipt,
            packageName:nethelper.packageName,
        };
        data.good = item;

        let timestamp = Date.parse(new Date());
        timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));

        let pathcomponent = `/v2/user/${iiuser.pk}/iapConfirm/${data.user.currentUser.sessionToken}`;
        let pp = `{url:${nethelper.signurl}${pathcomponent},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        // alert(pp);
        console.log(pp);
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();


        let settings = {
            url: `/our${pathcomponent}`,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };

        let context_loginhelper = this;

        this.postRequest(settings, (res, error) => {
            if (error) {
                callback(null, error);
            }
            else {
                callback(res.data, null);
            }

        });
    },

    videoadsServer(coin, callback) {
        let iiuser = this.logged_in_user;
        let bodyData = {
            coins: coin,
            offerwallPlatform: 'supersonic',
            deviceId: nethelper.deviceid,
            platform: '0',
        }

        let timestamp = Date.parse(new Date());
        timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        let pathcomponent = `/v2/user/${iiuser.pk}/updateoffer/${iiuser.pk}`;
        let pp = `{url:${nethelper.signurl}${pathcomponent},postbody:${JSON.stringify(bodyData)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();

        let settings = {
            url: `/our${pathcomponent}`,
            method: 'post',
            data: bodyData,
            headers: header,
            timeout: 30000
        };

        this.postRequest(settings, (res, error) => {
            if (error) {
                callback(null, error);
            }
            else {
                callback(res.data, null);
            }
        });
    },

    getreward: function (rewarditem,callback) {
        let iiuser = this.logged_in_user;
        if (iiuser == null || iiuser === undefined) {
            callback(null, {errorMessage: 'no logged user'});
            return;
        }
        let data = {
            "user": {
                "mainUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "currentUser": {
                    "vineUserId": iiuser.pk,
                    "sessionToken": iiuser.pk,
                    "firstLogin": "",
                    "lastLogin": "",
                    "vineUserName": iiuser.username
                },

                "deviceId": nethelper.deviceid,
                "packageName": nethelper.packagename,
                "socialPlatform": "Instagram"
            }
        };

        data.reward = rewarditem;
        let timestamp = Date.parse(new Date());
        timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));

        let pathcomponent = `/v2/user/${iiuser.pk}/getReward/0/${rewarditem.rewardTypeId}/${data.user.currentUser.sessionToken}/${encodeURI(rewarditem.target.slice(0,rewarditem.target.indexOf(';')))}`;
        let pp = `{url:${nethelper.signurl}${pathcomponent},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        // alert(pp);
        console.log(pp);
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();


        let settings = {
            url: `/our${pathcomponent}`,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };

        let context_loginhelper = this;

        this.postRequest(settings, (res, error) => {
            if (error) {
                callback(null, error);
            }
            else {
                callback(res.data, null);
            }

        });
    },

    invitereward: function (code,callback) {
        let iiuser = this.logged_in_user;
        if (iiuser == null || iiuser === undefined) {
            callback(null, {errorMessage: 'no logged user'});
            return;
        }
        let data = {
            referCode: code,
            deviceId: nethelper.deviceid,
            avatar: '',
            viUserName: iiuser.username,
            viUserId: iiuser.pk,
            sessionToken: iiuser.pk,
            platform: "Instagram"
        };

        let timestamp = Date.parse(new Date());
        timestamp = parseInt(iiuser.pk.toString().slice(-3))|parseInt(timestamp.toString().slice(0,-3));
        let pathcomponent = `/v2/user/${code}/putinvitecode/${code}`;
        let pp = `{url:${nethelper.signurl}${pathcomponent},postbody:${JSON.stringify(data)},timestamp:${timestamp},appname:${nethelper.appname},appversion:${nethelper.appversion}}`;
        let header = nethelper.header;
        // alert(pp);
        console.log(pp);
        header.signature = nethelper.oursign(pp);
        header.timestamp = timestamp.toString();


        let settings = {
            url: `/our${pathcomponent}`,
            method: 'post',
            data: data,
            headers: header,
            timeout: 30000
        };

        let context_loginhelper = this;
        this.postRequest(settings, (res, error) => {
            if (error) {
                callback(null, error);
            }
            else {
                callback(res.data, null);
            }

        });
    },

    orderStatus(callback) {
        let userid = this.logged_in_user.pk;
        let header = nethelper.header;

        let setting = {
            method: 'get',
            url: '/our/v2/user/' + userid + '/queryOrderStatus/' + userid + '/2',
            headers: header
        };
        this.postRequest(setting, callback);
    },

    choosePhoneModel() {
        // iPhone X、iPhone XS
        let isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
        // iPhone XS Max
        let isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
        // iPhone XR
        let isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
        let appname = nethelper.appname;
        let quanping = false;
        let phoneX = false;
        console.log(appname);
        appname === "hashfun"?quanping = false : quanping = true;
        isIPhoneX || isIPhoneXSMax || isIPhoneXR ? phoneX = true : phoneX = false;
        return { quanping, phoneX }
    },
};

console.log('userhelper');

// userhelper.userpass(function(res){
//     if (res == true) {
//         dsbridge.call('message','NO');
//     }
//     else{
//         dsbridge.call('message','YES');
//     }
// })

export default userhelper;
