//FUNCTIONS

//initialization
function loadImg(img) {
  $("#msCanvas").css({
    "background-image": "url('img/" + img.url + "')"
  });
  $("#msCanvas").attr({
    "width": img.size[0] + "px",
    "height": img.size[1] + "px"
  });
}

// displaying zones
function dspZones() {
  clear = false;

    drawPolygons(jZones);
 

  $("#hideZones").css({
    "display": "block"
  });
  $("#dspZones").css({
    "display": "none"
  });
}


function hideZones()
{
     var c=document.getElementById("msCanvas");
  var ctx=c.getContext("2d");
    clear=true;
   ctx.clearRect(0,0,c.width, c.height); 
    $("#hideZones").css({"display":"none"});
     $("#dspZones").css({"display":"block"});
}
    
function drawPolygon(zone) {
  var c = document.getElementById("msCanvas");
  var ctx = c.getContext("2d");
  //    console.log(clear);
  if (clear == true) {
    ctx.clearRect(0, 0, c.width, c.height);
  }


  console.log("drawing");
  console.log(zone);


  // ctx.fillStyle=zone.color;
  ctx.fillStyle = "rgba(0,0,0,0.8)";

  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalCompositeOperation = "destination-out";
  // ctx.globalAlpha=0.3;

  ctx.beginPath();
  ctx.moveTo(zone.points[0].x, zone.points[0].y);

  for (var p = 1; p < zone.points.length; p++) {
    //console.log(p);
    ctx.lineTo(zone.points[p].x, zone.points[p].y);
  }

  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";
}

function drawPolygons(zones)
        {
          var c=document.getElementById("msCanvas");
          var ctx=c.getContext("2d");
        //    console.log(clear);
            if(clear==true)
                {
                 ctx.clearRect(0,0,c.width, c.height); 
                }
       
         console.log("drawing");
            console.log(zones);
        
            
    // ctx.fillStyle=zone.color;
            ctx.fillStyle="rgba(0,0,0,0.7)";
            
    ctx.fillRect(0,0,c.width, c.height); 
    ctx.globalCompositeOperation="destination-out";
    // ctx.globalAlpha=0.3;
          
        zones.forEach(function(zone){
            ctx.beginPath();
            ctx.moveTo(zone.points[0].x,zone.points[0].y);
            
            for(var p=1;p<zone.points.length;p++)
            {
                 //console.log(p);
                ctx.lineTo(zone.points[p].x, zone.points[p].y);
            }
            
            ctx.closePath();
            ctx.fill(); 
            
        });    
          
            
         ctx.globalCompositeOperation="source-over";   
        }  

//detecting user interation

function locatePolygon(mouse) {
  var c = document.getElementById("msCanvas");
  var ctx = c.getContext("2d");
  var rZone;
  jZones.forEach(function(zone, zid) {

    var points = zone.points;
    console.log("click");

    ctx.beginPath();
    ctx.moveTo(parseInt(points[0].x), parseInt(points[0].y));

    //console.log(zone.WORD["#text"]+"="+points[0].x+":"+ points[0].y);

    for (p = 1; p < points.length; p++) {
      //  console.log(zone);
      ctx.lineTo(parseInt(points[p].x), parseInt(points[p].y));

      //console.log(points[p].x+":"+ points[p].y);
    }

    ctx.closePath();

    if (ctx.isPointInPath(mouse.offsetX, mouse.offsetY)) {
      rZone = zone;


    }

  });
console.log(rZone);
    $("zone-info").attr({"seezone":rZone});
  return rZone;


}

//zooming and scrolling

function zoomChng(zChng) {
  // console.log(zChng);
  zm += parseFloat(zChng);

  $("#msCanvas").css({
    "transform": "scale(" + zm + "," + zm + ")"
  });

  //  console.log(zm);
   // console.log( parseInt($("#msCanvas").attr("width"))*zm);
    
var nw=1651*zm;    
 var nh=2514*zm;  
    
   // console.log(nw + "--" + nh);
    
 $("#msWrapper").css({"width":nw,"height":nh});
    

}

function moveScreen(xy, ox, oy) {
  console.log(xy.x + "//" + xy.y);


    var x=Math.max(0,(xy.x*zm)-ox);
    var y=Math.max(0,(xy.y*zm)-oy);


  console.log(x + "-ss-" + y);

  document.getElementById("manuscript").scrollTop = y;
  document.getElementById("manuscript").scrollLeft = x;


}

    


function findCorner(points)
{
   var mx=10000;
    var my=10000;
    
    var tx=0;
    var ty=0;
    
    points.forEach(function(pt){
       if(pt.x<mx)
           {
               mx=pt.x;
           }
        
         if(pt.y<my)
           {
               my=pt.y;
           }
           
        if(pt.x>tx)
           {
               tx=pt.x;
           }
        
         if(pt.y>ty)
           {
               ty=pt.y;
           }
    });
    
    return {mx:mx, my:my, tx:tx, ty:ty};
}

function focusOn(zone){
    console.log("zooming in");
    drawPolygon(zone);
    zm=parseFloat(1);
    
    
    var xtr=findCorner(zone.points);
    
    var sx=xtr.tx-xtr.mx;
    var sy=xtr.ty-xtr.my;
    
    var vw=parseInt($("#manuscript").css("width"));
    var vh=parseInt($("#manuscript").css("height"));
    
    var ox=(vw-sx)/2;
    var oy=(vh-sy)/2;
    
    var nzm=vw/6/sx;
    
    zoomChng(nzm);
    moveScreen({x:xtr.mx,y:xtr.my},ox,oy);
    drawPolygon(zone);                        
                };

function focusOut(){
    zm=parseFloat(1);
    zoomChng(0);
 document.getElementById("manuscript").scrollTop = 0;
  document.getElementById("manuscript").scrollLeft = 0;
                            
                };
 



