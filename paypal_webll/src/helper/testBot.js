import userhelper from './userhelper'
import IIHelper from "./IIHelper";

let testBot = {
    generateIIUser : function (userid) {
        return {userid:userid,
            username:userid.toString(),
            pk:userid,
            profile_pic_url:userid.toString()+'avatar'
        }
    },
    generateIIPost : function (userid) {
        return {
            pk:Number(`${userid}${userid}`),
            comment_count:3,
            like_count:2,
            view_count:1,
            follower_count:4,
            thumbnailUrl: `thumb${userid}${userid}`,
            videoLowURL: `low${userid}${userid}`,
            videoUrl: `url${userid}${userid}`,
            organic_tracking_token: `token${userid}${userid}`,
            code: `code${userid}${userid}`
        }
    },

}

function testuser(userid) {
    var fengood = {goodsId:"com.ty.vl.follower1",goodsAmount:10,goodsType:3};
    var likegood = {goodsId:"com.ty.vl.like1",goodsAmount:10,goodsType:2};
    var commentgood = {goodsId:"com.ty.vl.comment0",goodsAmount:10,goodsType:6};
    var viewgood = {goodsId:"com.ty.vl.loops0",goodsAmount:10,goodsType:5};


    userhelper.logged_in_user = testBot.generateIIUser(userid);
    console.log(userhelper.logged_in_user);
    userhelper.directlogin(function (res,err) {

        userhelper.tijiaozandingdan({post:testBot.generateIIPost(userid), goods:likegood},function (res,error) {
            console.log(error,res);
        });
        userhelper.tijiaozandingdan({post:testBot.generateIIPost(userid), goods:viewgood},function (res,error) {
            console.log(error,res);
        });
        userhelper.tijiaofendingdan({user:testBot.generateIIPost(userid), goods:fengood},function (res,error) {
            console.log(error,res);
        });
        userhelper.tijiaopinglundingdan({post:testBot.generateIIPost(userid), goods:commentgood, commentArray:[{content:`${userid} HH`,count:10}]},function (res,error) {
            console.log(error,res);
        });

        userhelper.nadingdan(0,function (res, err) {
            var list = res.data.boardList;
            console.log(list);
            list.forEach(function (item) {
                userhelper.zuodingdan(0, item, function (res, error) {
                    if (error) {
                        alert(error.errorMessage);
                        console.log(error);
                    } else {
                        let coins = res.data.coinsInAccount;
                        console.log('time to update coins:' + coins);
                    }
                });
            })
        });
        userhelper.nadingdan(1,function (res, err) {
            console.log(res, err);
            var list = res.data.boardList;
            console.log(list);
            list.forEach(function (item) {
                userhelper.zuodingdan(0, item, function (res, error) {
                    if (error) {
                        alert(error.errorMessage);
                        console.log(error);
                    } else {
                        let coins = res.data.coinsInAccount;
                        console.log('time to update coins:' + coins);
                    }
                });
            })
        });
        userhelper.nadingdan(6,function (res, err) {
            console.log(res, err);
            var list = res.data.boardList;

            list.forEach(function (item) {
                userhelper.zuodingdan(0, item, function (res, error) {
                    if (error) {
                        alert(error.errorMessage);
                        console.log(error);
                    } else {
                        let coins = res.data.coinsInAccount;
                        console.log('time to update coins:' + coins);
                    }
                });
            })
        })
    })

}

var starttest = function () {
    // for (let i=4;i<6;i++) {
    //
    //     setTimeout(function () {
    //         testuser(i);
    //     }, 1000)
    //
    // }
    let i =1;
    var timer = setInterval(function () {
        if (i>=61){
            clearInterval(timer)
        }
        testuser(i);
        i++;
        console.log(i)
    },3000);

};



export default starttest;
