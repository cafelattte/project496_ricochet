var round = 5; 
var user_list = new Vue({
  el:'.rightside',
    data:{
    user_surrender:true,
    user_warnings:1,
    user_nickname:'dalgomee0',
    user_answer:0,
    user_points:4,
    user_icon:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg"
  }
});
/*
 var leftside1 = new Vue({
   el:'#leftside1',
     data:{
     round:round,
     img1:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img2:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img3:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img4:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img5:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img6:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img7:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img8:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg"
     }
 });
 var leftside2 = new Vue({
   el:'#leftside2',
     data:{
     round:round,
     img9:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img10:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img11:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img12:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img13:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img14:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg",
     img15:"https://img1.daumcdn.net/thumb/R300x300/?fname=http%3A%2F%2Ft1.daumcdn.net%2Ffriends%2Fprod%2Fproduct%2FFRPBMZLFT0009_A_00.jpg",
     img16:"https://store-cf.pinkfong.com/__sized__/products/8809456150428/63/14/fe/b1ac428a94f2fde3c10a6368-crop-c0-5__0-5-600x600.jpg"
     }
 });
*/
var aa = new Vue({
  el:'#header',
  data:{
    round:round
  }
})
var minute=1;
var start=-1;
var stop=-1;
var end_time,w;

function surren_click(){
  alert("서렌 클릭했졍");
}
function submit_click(){
  alert("제출 클릭했졍");
}
function clock(){
  var now = new Date();
  var left_time = end_time.getTime() - now.getTime();
  if(left_time <= 0){
    Timer_refresh(0);
    clearInterval(w);
  }else{
    Timer_refresh(left_time);
  }
}
function n2(num){
  return num>10 ? num : "0" + num;
}
function Timer_refresh(milisec){
  var T_min = parseInt(Math.floor(milisec/60000)%60);
  var T_sec = parseInt(Math.floor(milisec/1000)%60);
  var T_milisec = parseInt(milisec%100);
  $('#time').html(n2(T_min)+" : "+n2(T_sec)+" : "+n2(T_milisec));
  if(milisec==0){
    alert("시간이 종료되었습니다.");
  }
}
$(document).ready(function(){
  if(start==0){
    end_time = new Date();
    end_time.setHours(end_time.getHours());
    end_time.setSeconds(end_time.getSeconds());
    end_time.setMinutes(end_time.getMinutes()+minute);
    w = setInterval(clock, 1);
  }
  if(stop==0){
    if(w!=null){
      Timer_refresh(0);
      clearInterval(w);
      w=null;
    }
  }
});
