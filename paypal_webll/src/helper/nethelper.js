// let dsbridge = require('dsbridge');
import dsbridge from './swbridge';

var hmac = require('crypto-js/hmac-sha256');

var nethelper = {
    ROUTES: {
        follow: 'friendships/create/<%= id %>/',
        unfollow: 'friendships/destroy/<%= id %>/',
        expose: 'qe/expose/',
        login: 'accounts/login/',
        logout: 'accounts/logout/',
        setAccountPrivate: 'accounts/set_private/',
        setAccountPublic: 'accounts/set_public/',
        editAccount: 'accounts/edit_profile/',
        currentAccount: 'accounts/current_user/?edit=true',
        comment: 'media/<%= id %>/comment/',
        commentDelete: 'media/<%= id %>/comment/<%= commentId %>/delete/',
        commentBulkDelete: 'media/<%= id %>/comment/bulk_delete/',
        like: 'media/<%= id %>/like/',
        unlike: 'media/<%= id %>/unlike/',
        registrationCreate: 'accounts/create/',
        registrationCreateValidated: 'accounts/create_validated/',
        registrationSMSCode: 'accounts/send_signup_sms_code/',
        registrationValidateSMSCode: 'accounts/validate_signup_sms_code/',
        checkEmail: 'users/check_email/',
        checkUsername: 'users/check_username/',
        usernameSuggestions: 'accounts/username_suggestions/',
        uploadPhoto: 'upload/photo/',
        uploadVideo: 'upload/video/',
        friendshipShow: 'friendships/show/<%= id %>/',
        friendshipShowMany: 'friendships/show_many/',
        friendshipPending: 'friendships/pending/',
        friendshipPendingApprove: 'friendships/approve/<%= id %>/',
        userInfo: 'users/<%= id %>/info/',
        userFeed: 'feed/user/<%= id %>/?<%= maxId ? ("max_id=" + maxId + "&") : "" %>rank_token=<%= rankToken %>',
        timelineFeed: 'feed/timeline/?<%= maxId ? ("max_id=" + maxId + "&") : "" %>rank_token=<%= rankToken %>&ranked_content=true',
        tagFeed: 'feed/tag/<%= encodeURI(tag) %>/?<%= maxId ? ("max_id=" + maxId + "&") : "" %>rank_token=<%= rankToken %>',
        selfLikedFeed: 'feed/liked/<%= maxId ? ("?max_id=" + maxId) : "" %>',
        locationFeed: 'feed/location/<%= id %>/?<%= maxId ? ("max_id=" + maxId + "&") : "" %>rank_token=<%= rankToken %>',
        followingFeed: 'friendships/<%= id %>/following/?<%= maxId ? ("max_id=" + maxId + "&") : "" %>rank_token=<%= rankToken %>',
        followersFeed: 'friendships/<%= id %>/followers/<%= maxId ? ("?max_id=" + maxId) : "" %>',
        savedFeed: 'feed/saved/<%= maxId ? ("?max_id=" + maxId) : "" %>',

        topSearch: 'fbsearch/topsearch/?rank_token=<%= rankToken %>&query=<%= encodeURIComponent(query) %>&context=blended&timezone_offset=10800',
        accountsSearch: 'users/search/?is_typehead=true&q=<%= encodeURIComponent(query) %>&rank_token=<%= rankToken %>',
        hashtagsSearch: 'tags/search/?count=50&q=<%= encodeURIComponent(query) %>&rank_token=<%= rankToken %>',
        hashtagsInfo: 'tags/<%= encodeURI(tag) %>/info',
        hashtagsRelated: 'tags/<%= encodeURI(tag) %>/related/?visited=<%= encodeURIComponent(visited) %>&related_types=<%= encodeURIComponent(related_types) %>',
        locationsSearch: 'fbsearch/places/?count=50&query=<%= encodeURIComponent(query) %>&rank_token=<%= rankToken %>',
        changeProfilePicture: 'accounts/change_profile_picture/',
        mediaConfigure: 'media/configure/',
        mediaConfigureStory: 'media/configure_to_reel/',
        videoConfigure: 'media/configure/?video=1',
        mediaConfigureSidecar: 'media/configure_sidecar/',
        mediaInfo: 'media/<%= mediaId %>/info/',
        mediaLikes: 'media/<%= mediaId %>/likers/',
        mediaComments: 'media/<%= mediaId %>/comments/<%= maxId ? ("?max_id=" + maxId) : "" %>',
        mediaDeletePhoto: 'media/<%= mediaId %>/delete/?media_type=PHOTO',
        mediaEdit: 'media/<%= mediaId %>/edit_media/',
        qeSync: 'qe/sync/',
        discoverAyml: 'discover/ayml/',
        inbox: 'direct_v2/inbox/<%= cursor ? ("?cursor=" + cursor) : "" %>',
        inboxPending: 'direct_v2/pending_inbox/<%= maxId ? ("?max_id=" + maxId) : "" %>',
        threads: 'direct_v2/threads/?user_ids=<% JSON.stringify(threads) %>',
        threadsShow: 'direct_v2/threads/<%= threadId %>/<%= cursor ? ("?cursor=" + cursor) : "" %>',
        threadsSeen: 'direct_v2/threads/<%= threadId %>/items/<%= itemId %>/seen/',
        threadsApprove: 'direct_v2/threads/<%= threadId %>/approve/',
        threadsHide: 'direct_v2/threads/<%= threadId %>/hide/',
        threadsBrodcastText: 'direct_v2/threads/broadcast/text/',
        threadsBrodcastLink: 'direct_v2/threads/broadcast/link/',
        threadsBrodcastShare: 'direct_v2/threads/broadcast/media_share/?media_type=photo',
        threadsBrodcastProfile: 'direct_v2/threads/broadcast/profile/',
        threadsBrodcastHashtag: 'direct_v2/threads/broadcast/hashtag/',
        threadsBrodcastPhoto: 'direct_v2/threads/broadcast/configure_photo/',
        threadsApproveAll: 'direct_v2/threads/approve_all/',
        threadsRecentRecipients: 'direct_share/recent_recipients/',
        autocompleteUserList: 'friendships/autocomplete_user_list/?version=2&followinfo=True',
        megaphoneLog: 'megaphone/log/',
        block: 'friendships/block/<%= id %>/',
        unblock: 'friendships/unblock/<%= id %>/',
        save: 'media/<%= id %>/save/',
        unsave: 'media/<%= id %>/unsave/',
        userStory: 'feed/reels_media/',
        storyTray: 'feed/reels_tray/'
    },


    WEB_ROUTES: {
        challengeReset: 'challenge/reset/',
        challenge: 'challenge/',
        userInfo: '<%= id %>/'
    },



    HOSTNAME: 'https://i.instagram.com',
    WEB_HOSTNAME: 'https://www.instagram.com',


    generateUUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toLowerCase();
    },

    initcsrftoken: 'changelater',//'2435840e7eb34784eac33b2b391818eb',
    uuid: 'changelater',//'4cf0f1b2-6cf0-41cb-9cc6-f489c77eeb8b',
    deviceid: 'changelater',//'4cf0f1b2-6cf0-41cb-9cc6-f489c77eeb8b',
    packagename: 'changelater',//'com.js.memotag',
    appname: 'changelater',//'memotag',
    appversion: '3',//'changelater',

    useAxios: false,
    fakeServer: false,

    UA: "Instagram 56.0.0.10.75 (iPhone7,2; iPhone OS 11_0_1; en_CN; en-CN; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+",
    PRIVATE_KEY: {
        SIG_KEY: '5007c64faf0d64ec1fa6e36375db6a01decad92562957d44a3005b79e46700ac',
        SIG_VERSION: '5',
        // APP_VERSION: '27.0.0.7.97'
    },

    TEST_KEY: '4f8732eb9ba7d1c8e8897a75d6474d4eb3f5279137431b2aafb7323232abe178',


    signurl: "https://massdelete.cleanig.info",
    // signurl: "https://i.hashfun.tk",
    oururl: "http://massdelete.cleanig.info",
    // oururl: "http://i.hashfun.tk",
    OUR_KEY: 'a3c8fb21c7340792a02d7d6967d2c04c4c66a7fecc1b157bca1faad882c7bc6a',

    oursign: function (jsonstr) {
        let signed = hmac(jsonstr, this.OUR_KEY);
        return signed.toString();
    },

    IIsign(jsonstr) {
        let signed = hmac(jsonstr, this.fakeServer? this.TEST_KEY: this.PRIVATE_KEY.SIG_KEY);
        return signed.toString();
    },
};

nethelper.header= {
        "content-type": "application/json",
        "appname": 'testit',
        "appversion": '3',
        "signature": "decidelater",
        "language": "needfix",
        "devicemodel": "needfix",
        "timezone": "needfix",
        "platform": "needfix",
        "networktype": "needfix",
        "deviceId": "needfix",
        "timestamp": "needfix",
    };

// alert('start');

nethelper.HOST= nethelper.fakeServer? 'http://croatia.followertrack.com': nethelper.HOSTNAME;
nethelper.uuid = nethelper.generateUUID();
nethelper.deviceid = nethelper.uuid;
nethelper.initcsrftoken = 'missing';
if (!nethelper.useAxios) {
    nethelper.header.packagename = dsbridge.call('bundleId','1');
    nethelper.header.appname = dsbridge.call('name','1').toLowerCase();
    nethelper.header.appversion = dsbridge.call('version','1');
    nethelper.header.language = dsbridge.call('language','1');
    nethelper.header.devicemodel = dsbridge.call('deviceMode','1');
    nethelper.header.timezone = dsbridge.call('timeZone','1');
    nethelper.header.platform = dsbridge.call('platform','1');
    nethelper.header.networktype = dsbridge.call('networkType','1');
    nethelper.header.deviceId = dsbridge.call('deviceId','1');

    nethelper.appname = nethelper.header.appname;
    nethelper.appversion = nethelper.header.appversion;
    nethelper.deviceid = nethelper.uuid = nethelper.header.deviceId;
    nethelper.packagename = nethelper.header.packagename;
    console.log(nethelper.appname)
}

console.log('nethelper dev useAxios:'+nethelper.useAxios+' fakeserver:'+nethelper.fakeServer);
export default nethelper;
