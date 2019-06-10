export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

export function setCookie (c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

export function clearCookie()
{
    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; "); // 将多cookie切割为多个名/值对

    for(var i=0;i <arrCookie.length;i++)
    { // 遍历cookie数组，处理每个cookie对
        var arr=arrCookie[i].split("=");
        if(arr.length>0){
            delCookie(arr[0]);
        }
    }
}
