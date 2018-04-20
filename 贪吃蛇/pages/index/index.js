//手指按下的坐标
var startX = 0;
var startY = 0;
//手指在canvous上移动的坐标
var moveX = 0;
var moveY = 0;
//移动位置跟开始位置的差值
var X = 0;
var Y = 0;
//蛇头的对象
var snakeHead = {
   x : 0,
   y : 0,
   color:"#ff0000",
   w:20,
   h:20
}
//身体对象（数组）
var snakeBodys = [];
//食物对象（数组）
var foods = [];
//窗口的宽高
var windowWidth = 0;
var windowHeight = 0;
//用于确定是否删除
var collideBol = true;
//手指的方向
var direction = "null";
//初始时将蛇头移动的方向
var snakeDirection = "right"
Page({
    data: {

    },
    canvasStart:function(e){
    startX = e.touches[0].x;
    startY = e.touches[0].y;
    },
    canvasMove:function(e){
     moveX = e.touches[0].x;
     moveY = e.touches[0].y;
     X = moveX - startX; 
     Y = moveY - startY;
     //行走方向判定
     if(Math.abs(X) > Math.abs(Y) && X > 0){
        direction = "right";
     } else if (Math.abs(X) > Math.abs(Y) && X < 0){
       direction = "left";
     } else if (Math.abs(X) < Math.abs(Y) && Y > 0){
       direction = "bottom";
     } else if (Math.abs(X) < Math.abs(Y) && Y < 0){
       direction = "top";
     }
    },
    canvasEnd:function(){
     //鼠标抬起时的最后方向，设为蛇头要移动的方向
      snakeDirection = direction;
    },
    onReady:function(){
      //获取画布的上下文
      var context = wx.createContext();
      //帧数
      var frameNum = 0;

      //绘制蛇头/身函数
      function draw(object){
        //蛇头颜色
        context.setFillStyle(object.color);
        //开始路径
        context.beginPath();
        context.rect(object.x, object.y, object.w, object.h);
        context.closePath();
        //设置填充
        context.fill();
      }
      //碰撞函数
      function collide(obj1,obj2){
        var l1 = obj1.x;
        var r1 = l1+obj1.w;
        var t1 = obj1.y;
        var b1 = t1+obj1.h;

        var l2 = obj2.x;
        var r2 = l2+obj2.w;
        var t2 = obj2.y;
        var b2 = t2+obj2.y;
        //碰撞判断
        if(r1>l2 && l1<r2 && b1>t2 && t1<b2){
          return true;
        }else{
          return false;
        }
      }
      
      function animate(){
        frameNum++;
        if(frameNum % 20 ==0){
          //向蛇身体数组添加一个蛇头的上一个位置（身体对象）
          snakeBodys.push({
            x: snakeHead.x,
            y: snakeHead.y,
            w: 20,
            h: 20,
            color: "#00ff00"
          });
          //设置身体长度为4节
          if (snakeBodys.length > 4) {
            //移除不用的身体
            if(collideBol){
              snakeBodys.shift();
            }else{
              collideBol=true;
            }
           
          }
          switch (snakeDirection) {
            case "left":
              snakeHead.x -= snakeHead.w;
              break;
            case "right":
              snakeHead.x += snakeHead.w;
              break;
            case "bottom":
              snakeHead.y += snakeHead.h;
              break;
            case "top":
              snakeHead.y -= snakeHead.h;
              break;
          }
        }
        //开始绘制蛇头
       draw(snakeHead);
        //绘制蛇身
        for(var i=0;i<snakeBodys.length;i++){
          var snakeBody = snakeBodys[i];
         draw(snakeBody);
        }
        //绘制食物
        for(var i=0;i<foods.length;i++){
          var foodObj = foods[i];
          draw(foodObj) ;
          if(collide(snakeHead,foodObj)){
            console.log("撞上了")
            collideBol=false;
            foodObj.reset();
          }else{

          }
        }
        wx.drawCanvas({
           canvasId:"snakCanvas",
           actions:context.getActions()
        })
        requestAnimationFrame(animate);
      }
      //产生随机数
      function rand(min,max){
        return parseInt(Math.random() * (max - min))+min;
      }
      //构造食物对象
      function Food() {
        //构造食物的范围
        this.x = rand(0,windowWidth);
        this.y = rand(0,windowHeight);
        //食物的宽
        var w =rand(10,20);
        this.w=w;
        this.h=w;
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) +")";
        //碰撞后食物位置重置方法
        this.reset = function(){
          this.x = rand(0, windowWidth);
          this.y = rand(0, windowHeight);
          this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
        }
      }

      wx.getSystemInfo({
        success: function(res) {
          windowWidth = res.windowWidth;
          windowHeight = res.windowHeight;
          for(var i=0; i<20; i++){
            var foodObj = new Food();
            foods.push(foodObj);
          }

          animate();
        },
      })
     
     
    }
});
