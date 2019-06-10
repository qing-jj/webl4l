// let dsbridge = require('dsbridge');
let axios = require('axios');
import nethelper from './nethelper';
import userheiper from './userhelper';
import dsbridge from './swbridge';

let baseurl = nethelper.HOST;
if (nethelper.useAxios) {
    // baseurl = '/insta'
}
var JSONbig = require('json-bigint');

let IIHelper = {
    header: {
        "X-IG-Connection-Type":"WiFi",
        "X-IG-Capabilities":"Fw==",
    },

    formData(body){
        let hamc_result = nethelper.IIsign(JSON.stringify(body));
        let sigurlFormate = hamc_result + '.' + JSON.stringify(body);
        let form_data = new FormData();
        if (nethelper.useAxios) {

            form_data.append("signed_body", sigurlFormate);
            form_data.append("ig_sig_key_version", nethelper.PRIVATE_KEY.SIG_VERSION);
            return form_data;
        }
        else{
            return {
                "signed_body": sigurlFormate,
                "ig_sig_key_version": nethelper.PRIVATE_KEY.SIG_VERSION,
            };
        }
    },

    sendRequest(setting,callback){
        try {
            if (nethelper.useAxios) {    //axios
                axios(setting).then((response) => {
                    if (response.data.status !== 'ok') {
                        callback(null, {errorMessage:response.data.data});
                    }
                    else{
                        callback(response, null);
                    }
                }, (error) => {
                    console.log(error);
                    callback(null, error);
                });
            } else {         //ios dsbridge
                if (setting.method === 'post') {
                    setting.method = 'form';
                }
                console.log(setting.method);
                dsbridge.call(setting.method, setting, function (resStr) {
                    let res = JSONbig.parse(resStr).data;
                    if (res == undefined) {
                        callback(null, {errorMessage:'Unknown error. Contact for support.'});
                    }
                    else if (res.status !== 'ok') {
                        let checkData = res.userinfo.response;
                        callback(null, {errorMessage: checkData.two_factor_required?checkData:checkData.message, error: res});
                    }
                    else {
                        callback({data:res}, null);
                    }
                });
            }
        } catch (e) {
            alert('Error:'+e);
        } finally {

        }
    },

    // getTieZiData(url) {
    //     let setting = {
    //         url: url,
    //         method: 'get',
    //         timeout: 30000
    //     };
    //     dsbridge.call(setting.method, setting, (resStr) => {
    //         let res = JSONbig.parse(resStr).data;
    //         console.log(res);
    //         if (res.graphql.shortcode_media) {
    //             let payload = {
    //                 tracking: res.graphql.shortcode_media.tracking_token,
    //                 targetpostid: res.graphql.shortcode_media.id + '_' + res.graphql.shortcode_media.owner.id,
    //                 targetuserid: res.graphql.shortcode_media.owner.id,
    //                 takenat: res.graphql.shortcode_media.taken_at_timestamp,
    //                 username: res.graphql.shortcode_media.owner.username,
    //                 duration: res.graphql.shortcode_media.video_duration
    //             };
    //             this.tijiaoviewdingdan(payload)
    //         }
    //     });
    // },

    // tijiaoviewdingdan(payload) {
    //     let timestamp = Date.parse(new Date());
    //     let logged_in_user = JSON.parse(localStorage.getItem("logged_in_user"));
    //     let json1time = timestamp/1000;
    //     let selfpk = logged_in_user.pk + '';
    //     const tojson1 = {
    //         "app_id": "124024574287414",
    //         "uid": "0",
    //         "time": json1time - 222.429996,
    //         "app_ver": "10.8.0 (49497378)",
    //         "device_id": nethelper.deviceid,
    //         "family_device_id": nethelper.uuid,
    //         "session_id": nethelper.uuid,
    //         "data": [
    //             {
    //                 "module": "app",
    //                 "name": "time_spent_bit_array",
    //                 "time": json1time - 222.429996,
    //                 "extra": {
    //                     "radio_type": "wifi-none",
    //                     "tos_persistent_uptime": 2119933,
    //                     "tos_array": [
    //                         37,
    //                         0
    //                     ],
    //                     "tos_seq": 1,
    //                     "tos_len": 6,
    //                     "tos_cum": 7,
    //                     "tos_uptime": json1time - 228,
    //                     "tos_time": json1time - 228.115884,
    //                     "pk": selfpk
    //                 }
    //             },
    //             {
    //                 "module": "app",
    //                 "name": "counters",
    //                 "time": json1time - 222.429921,
    //                 "extra": {
    //                     "pk": selfpk,
    //                     "radio_type": "wifi-none",
    //                     "analytics_log_size": 598
    //                 }
    //             },
    //             {
    //                 "module": "app",
    //                 "name": "websocket_did_fail",
    //                 "time": json1time - 159.444103,
    //                 "extra": {
    //                     "websocket_failure_code": 60,
    //                     "pk": selfpk,
    //                     "websocket_close_reason": "Operation timed out",
    //                     "radio_type": "wifi-none"
    //                 }
    //             },
    //             {
    //                 "module": "application",
    //                 "name": "background",
    //                 "time": json1time - 98.939841,
    //                 "extra": {
    //                     "total_active_time_ms": 2095748.158666538,
    //                     "init_to_now_ms": 2431617.855708348,
    //                     "pk": selfpk,
    //                     "active_to_background_ms": 726552.7866249904,
    //                     "radio_type": "wifi-none"
    //                 }
    //             },
    //             {
    //                 "module": "app",
    //                 "name": "app_performance",
    //                 "time": json1time - 98.910517,
    //                 "extra": {
    //                     "pk": selfpk,
    //                     "radio_type": "wifi-none",
    //                     "data_usage": [
    //                         {
    //                             "bytes_transmitted": 1966176,
    //                             "network_mode": "WiFi",
    //                             "bytes_received": 38976348
    //                         },
    //                         {
    //                             "bytes_transmitted": 181,
    //                             "network_mode": "Cellular",
    //                             "bytes_received": 133
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 "module": "application",
    //                 "name": "foreground_usable",
    //                 "time": json1time - 0.442064,
    //                 "extra": {
    //                     "radio_type": "wifi-none",
    //                     "device": "iPhone7,2",
    //                     "os": "9.2.1",
    //                     "total_background_time_ms": 348600.9363748599,
    //                     "init_to_now_ms": 2444613.978958456,
    //                     "foreground_to_active_ms": -233703.1263334211,
    //                     "pk": selfpk,
    //                     "foreground_to_usable_ms": 264.8649166803807
    //                 }
    //             },
    //             {
    //                 "module": "application",
    //                 "name": "push_notification_setting",
    //                 "time": json1time - 0.417573,
    //                 "extra": {
    //                     "badges": true,
    //                     "alerts": true,
    //                     "sounds": true,
    //                     "radio_type": "wifi-none",
    //                     "pk": selfpk,
    //                     "app_state": "foreground_usable",
    //                     "badge_number": 0,
    //                     "last_badge_number": 0,
    //                     "raw_setting": 7
    //                 }
    //             },
    //             {
    //                 "module": "profile",
    //                 "name": "app_state",
    //                 "time": json1time - 0.012597,
    //                 "extra": {
    //                     "pk": selfpk,
    //                     "state": "foreground",
    //                     "dest_module": "profile",
    //                     "radio_type": "wifi-none"
    //                 }
    //             }
    //         ],
    //         "log_type": "client_event",
    //         "seq": 1
    //     };

    //     let json2time = timestamp/1000;
    //     let tracking = payload.tracking;
    //     let duration = payload.duration;
    //     let targetpostid = payload.targetpostid;
    //     let takenat = payload.takenat;
    //     let username = payload.username;
    //     let targetuserid = payload.targetuserid;
    //     const tojson2 = {
    //         "app_id": "124024574287414",
    //         "uid": "0",
    //         "time": json2time + 1487230297.450021 - 1487230291.539672,
    //         "app_ver": "10.8.0 (49497378)",
    //         "device_id": nethelper.deviceid,
    //         "family_device_id": nethelper.uuid,
    //         "session_id": nethelper.uuid,
    //         "data": [{
    //             "module": "app",
    //             "name": "counters",
    //             "time": json2time + 1487230297.450021 - 1487230291.539672,
    //             "extra": {
    //                 "pk": selfpk,
    //                 "radio_type": "wifi-none",
    //                 "analytics_log_size": 730
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "video_should_start",
    //             "time": json2time + 1487230297.450021 - 1487230292.197304,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "a_pk": targetuserid,
    //                 "m_ts": takenat,
    //                 "a_i": "organic",
    //                 "m_pk": targetpostid,
    //                 "tracking_token": tracking,
    //                 "pk": selfpk
    //             }
    //         }, {
    //             "module": "app",
    //             "name": "content_loaded",
    //             "time": json2time + 1487230297.450021 - 1487230292.198284,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "content_width": 640,
    //                 "content_load_time": 0.03865316649898887,
    //                 "pk": selfpk,
    //                 "content_type": "photo"
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "video_started_playing",
    //             "time": json2time + 1487230297.450021 - 1487230292.288047,
    //             "extra": {
    //                 "start_delay": 89.6762500051409,
    //                 "playing_audio": false,
    //                 "m_ts": takenat,
    //                 "a_i": "organic",
    //                 "m_pk": targetpostid,
    //                 "recent_bandwidth": 132,
    //                 "device_muted": 1,
    //                 "tracking_token": tracking,
    //                 "system_volume": 0.9109312,
    //                 "a_pk": targetuserid,
    //                 "reason": "autoplay",
    //                 "audio_detected": false,
    //                 "pk": selfpk,
    //                 "video_width": 480,
    //                 "radio_type": "wifi-none"
    //             }
    //         }, {
    //             "module": "profile",
    //             "name": "navigation",
    //             "time": json2time + 1487230297.450021 - 1487230292.501155,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "view": "grid",
    //                 "username": username,
    //                 "user_id": targetuserid,
    //                 "source_module": "profile",
    //                 "nav_depth": 3,
    //                 "dest_module": "single_feed_profile",
    //                 "pk": selfpk
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "instagram_organic_sub_impression",
    //             "time": json2time + 1487230297.450021 - 1487230292.502633,
    //             "extra": {
    //                 "source_of_action": "single_feed_profile",
    //                 "m_t": 2,
    //                 "m_ix": 0,
    //                 "radio_type": "wifi-none",
    //                 "pk": selfpk,
    //                 "a_pk": targetuserid,
    //                 "m_pk": targetpostid,
    //                 "tracking_token": tracking,
    //                 "follow_status": "not_following"
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "video_displayed",
    //             "time": json2time + 1487230297.450021 - 1487230292.502772,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "m_ix": 0,
    //                 "a_pk": targetuserid,
    //                 "m_ts": takenat,
    //                 "m_pk": targetpostid,
    //                 "a_i": "organic",
    //                 "tracking_token": tracking,
    //                 "pk": selfpk
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "instagram_organic_time_spent",
    //             "time": json2time + 1487230297.450021 - 1487230296.749338,
    //             "extra": {
    //                 "source_of_action": "single_feed_profile",
    //                 "m_t": 2,
    //                 "m_ix": 0,
    //                 "radio_type": "wifi-none",
    //                 "pk": selfpk,
    //                 "a_pk": targetuserid,
    //                 "timespent": 4.245943009853363,
    //                 "m_pk": targetpostid,
    //                 "tracking_token": tracking,
    //                 "follow_status": "not_following"
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "instagram_organic_sub_viewed_impression",
    //             "time": json2time + 1487230297.450021 - 1487230296.749567,
    //             "extra": {
    //                 "source_of_action": "single_feed_profile",
    //                 "m_t": 2,
    //                 "m_ix": 0,
    //                 "radio_type": "wifi-none",
    //                 "pk": selfpk,
    //                 "a_pk": targetuserid,
    //                 "m_pk": targetpostid,
    //                 "tracking_token": tracking,
    //                 "follow_status": "not_following"
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "video_paused",
    //             "time": json2time + 1487230297.450021 - 1487230296.750152,
    //             "extra": {
    //                 "playing_audio": false,
    //                 "m_ts": takenat,
    //                 "timeAsPercent": 4.534887638 / duration,
    //                 "lsp": 0,
    //                 "a_i": "organic",
    //                 "m_pk": targetpostid,
    //                 "time": 4.534887638,
    //                 "device_muted": 1,
    //                 "tracking_token": tracking,
    //                 "system_volume": 0.9109312,
    //                 "a_pk": targetuserid,
    //                 "original_start_reason": "autoplay",
    //                 "audio_detected": false,
    //                 "reason": "scroll",
    //                 "duration": duration,
    //                 "pk": selfpk,
    //                 "radio_type": "wifi-none",
    //                 "loop_count": 1 + (4.534887638 / duration)
    //             }
    //         }, {
    //             "module": "profile",
    //             "name": "reel_tray_refresh",
    //             "time": json2time + 1487230297.450021 - 1487230296.753793,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "pk": selfpk,
    //                 "live_reel_count": 0,
    //                 "tray_session_id": 't3z5w5onw16wjihagl3qvophn2ovqlf',
    //                 "was_successful": true,
    //                 "muted_reel_count": 0,
    //                 "tray_refresh_type": "disk",
    //                 "viewed_reel_count": 0,
    //                 "new_reel_count": 1,
    //                 "tray_refresh_time": 0,
    //                 "has_my_reel": 0
    //             }
    //         }, {
    //             "module": "profile",
    //             "name": "reel_tray_impression",
    //             "time": json2time + 1487230297.450021 - 1487230296.754104,
    //             "extra": {
    //                 "radio_type": "wifi-none",
    //                 "tray_position": 0,
    //                 "live_reel_count": 0,
    //                 "tray_session_id": 't3z5w5onw16wjihagl3qvophn2ovqlf',
    //                 "muted_reel_count": 0,
    //                 "a_pk": targetuserid,
    //                 "pk": selfpk,
    //                 "has_my_reel": 0,
    //                 "viewed_reel_count": 0,
    //                 "new_reel_count": 1,
    //                 "is_new_reel": 1
    //             }
    //         }, {
    //             "module": "single_feed_profile",
    //             "name": "navigation",
    //             "time": json2time + 1487230297.450021 - 1487230297.143338,
    //             "extra": {
    //                 "dest_module": "profile",
    //                 "pk": selfpk,
    //                 "source_module": "single_feed_profile",
    //                 "nav_depth": 0,
    //                 "radio_type": "wifi-none"
    //             }
    //         }, {
    //             "module": "profile",
    //             "name": "app_state",
    //             "time": json2time + 1487230297.450021 - 1487230297.443204,
    //             "extra": {
    //                 "pk": selfpk,
    //                 "state": "background",
    //                 "source_module": "profile",
    //                 "radio_type": "wifi-none"
    //             }
    //         }],
    //         "log_type": "client_event",
    //         "seq": 0
    //     };
    //     let data = {"message": JSON.stringify(tojson1),
    //         "access_token": '124024574287414|84a456d620314b6e92a16d8ff1c792dc',
    //         "format": "json"};
    //     let setting1 = {
    //         url: 'https://graph.instagram.com/logging_client_events',
    //         method: 'post',
    //         data: data,
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //             'Proxy-Connection': 'keep-alive',
    //             'User-Agent': 'Instagram 10.8.0 (iPhone7,1; iPhone OS 9_3_1; zh_CN; zh-Hans-CN; scale=2.61; gamut=normal; 1080x1920) AppleWebKit/420+',
    //             'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
    //             'Accept-Encoding': 'gzip, deflate'
    //         },
    //         timeout: 30000
    //     };
    //     this.sendRequest(setting1, (res, err) => {
    //         if (err) {
    //             let checkData = res.userinfo.response;
    //             callback(null, {errorMessage: checkData.two_factor_required?checkData:checkData.message, error: res})
    //         } else {

    //         }
    //     });

    //     setTimeout(() => {
    //         let setting2 = {
    //             url: 'https://graph.instagram.com/logging_client_events',
    //             method: 'post',
    //             data: {
    //                 "message": JSON.stringify(tojson2),
    //                 "access_token": '124024574287414|84a456d620314b6e92a16d8ff1c792dc',
    //                 "format": "json"
    //             },
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //                 'Proxy-Connection': 'keep-alive',
    //                 'User-Agent': 'Instagram 10.8.0 (iPhone7,1; iPhone OS 9_3_1; zh_CN; zh-Hans-CN; scale=2.61; gamut=normal; 1080x1920) AppleWebKit/420+',
    //                 'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
    //                 'Accept-Encoding': 'gzip, deflate'
    //             },
    //             timeout: 30000
    //         };
    //         this.sendRequest(setting2, (response, error) => {
    //             if (error) {
    //                 let checkData2 = res.userinfo.response;
    //                 callback(null, {errorMessage: checkData2.two_factor_required?checkData2:checkData2.message, error: res})
    //             } else {
    //                 console.log(response);
    //             }
    //         })
    //     }, 2000)
    // },


    currentIIUser(callback) {    //登录
        let setting = {
            method: "get",
            url: baseurl+"/api/v1/accounts/current_user/?edit=false",
            headers: this.header,
        };

        this.sendRequest(setting,callback);
    },

    loginIIUser(dict, callback) {    //登录
        let setting = {
            method: "post",
            url: baseurl+"/api/v1/accounts/login/",
            headers: this.header,
            data:this.formData(dict)
        };

        this.sendRequest(setting,callback);
    },

    logoutIIUser(dict,callback){
        let setting = {
            method: "post",
            url: baseurl+"/api/v1/accounts/logout/",
            headers: this.header,
            data:this.formData(dict)
        };

        this.sendRequest(setting,callback);
    },

    IIUserZuoDingdan(user,dingdan,callback){
        if (nethelper.fakeServer) {
            callback(null,null);
        } else {
            if (dingdan.kind == 'like') {
                this.zanIIUserPost(`${dingdan.postId}_${dingdan.viUserId}`,user.vineUserId,callback);
            }
            else if (dingdan.kind == 'follow') {
                this.fenIIUser(`${dingdan.viUserId}`,user.vineUserId,callback);
            }
            else if (dingdan.kind == 'comment') {
                // this.pinglunIIUser(`${dingdan.viUserId}`,user.vineUserId,callback);
            }
            else if (dingdan.kind == 'loops') {
                // this.fenIIUser(`${dingdan.viUserId}`,user.vineUserId,callback);
            }
            else{
                callback(null,{errorMessage:'No defined action for order'});
            }
        }

    },

    zanIIUserPost(mediaId, uid,callback) {
        let dict = {
            "_uuid": nethelper.uuid,
            "_csrftoken": nethelper.initcsrftoken,
            "media_id": mediaId,
            "src":"profile",
            "_uid": uid
        };
        let setting = {
            method: 'post',
            url: `${baseurl}/api/v1/media/${mediaId}/like/?d=0&src=profile`,
            headers: this.header,
            data: this.formData(dict)
        };
        this.sendRequest(setting,callback);
    },

    fenIIUser(userId, uid,callback) {
        let dict = {
            "_csrftoken": nethelper.initcsrftoken,
            "user_id": userId,
            "_uid": uid
        };
        let setting = {
            method: 'post',
            url: `${baseurl}/api/v1/friendships/create/${userId}/`,
            headers: this.header,
            data: this.formData(dict)
        };
        this.sendRequest(setting,callback);
    },
    pinglunIIUser(userId, uid,callback){

    },

    selfIIinfo: function (id, callback) {
        let setting = {
            method: 'get',
            url: baseurl+'/api/v1/users/' + id + '/info/',
            headers: this.header
        };
        this.sendRequest(setting,callback);
    },

    selfIIpost: function (userId, callback) {
        let setting = {
            method: 'get',
            url: baseurl+'/api/v1/feed/user/' + userId + '/',
            headers: this.header
        };
        this.sendRequest(setting,callback);
    },

    selfIIpostMore(infodict, callback) {
        let setting = {
            method: 'get',
            url: baseurl+'/api/v1/feed/user/' + infodict.userId + '/?max_id=' + infodict.max_id,
            headers: this.header
        };
        this.sendRequest(setting,callback);
    },

    getPostThumbUrl (post) {
        let reg = /image_versions/;
        for (let key in post) {
            if (reg.test(key)) {
                if (post[key] instanceof Array) {
                    return post[key][0].url || "";
                }
                else if (post[key] instanceof Object) {
                    return post[key].candidates[0].url || "";

                }
            }
        }
    },

    getMediaComments(post,n,alreadyknow,newcomments,maxid=null,callback){
        let media_id = post['id'];
        // media_id = '1878127402301142696_247944034';
        let setting = {
            method: 'get',
            url: baseurl+`/api/v1/media/${media_id}/comments/`,
            headers: this.header
        };
        if (maxid){
            setting.url = baseurl+`/api/v1/media/${media_id}/comments/`+'?max_id='+maxid
        }
        this.sendRequest(setting,function (res,err) {
            if (err){
                alert(JSON.stringify(err));
                callback(null,{errorMessage:"Failed get comments"});
            }
            else{
                var stop = false;
                for (var c of res.data.comments){
                    if (alreadyknow.includes(c)) {
                        stop = true;
                    }
                    else{
                        newcomments.push(c);
                    }
                }
                // result = result.concat(res.data.comments);
                // alert(`get comments ${newcomments.length}`);
                if (res.data.has_more_comments && newcomments.length < n && !stop) {
                    return setTimeout(IIHelper.getMediaComments(post, n, alreadyknow, newcomments, JSON.parse(res.data.next_max_id).server_cursor,callback), 3000);[]

                }
                else{
                    callback(newcomments,null);
                }

            }
        });
    },

    deleteMediaComment(post,comment){
        let media_id = post['id'];
        let comment_id = comment['pk'];

        let setting = {
            method: 'post',
            url: baseurl+`/api/v1/media/${media_id}/comment/${comment_id}/delete/`,
            headers: this.header
        };
        this.sendRequest(setting,function (res,err) {

        });
    },

    checkPointGet (setting, callback) {
        console.log(setting);
        this.sendRequest(setting,callback);
    },
};

if (nethelper.useAxios){
    IIHelper.header['adfljdslfkskf'] = '123asd';
}
else{
    IIHelper.header['User-Agent'] = nethelper.UA;
}
console.log('iihelper');
export default IIHelper;
