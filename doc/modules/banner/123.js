(function(d){window.dekkoModule=function(a){var k={display:"none",width:"120px",height:"600px",background:"__DATAREPLACE__ no-repeat left top","-webkit-box-shadow":"0px 0px 10px rgba(50, 50, 50, 0.6)","-moz-box-shadow":"0px 0px 10px rgba(50, 50, 50, 0.6)","box-shadow":"0px 0px 10px rgba(50, 50, 50, 0.6)"},l={position:"relative",width:"100%",height:"100%"},m={width:"100%",height:"100%","text-decoration":"none",display:"block"},h={display:"none",width:"16px",height:"16px",position:"absolute",padding:"0px",
top:"2px",right:"2px",cursor:"pointer",color:"#fff",background:"none","z-index":"1px"},b,e,c,f,g=this;try{b=d("<div/>",{id:a.name+"-wrap",css:k}),e=d("<div/>",{css:l}),c=d("<div/>",{css:h,html:g.svg.close(h)}),f=d("<a/>",{href:a.item.url,target:"_blank",css:m}),e.appendTo(b),c.appendTo(e),f.appendTo(e),b.appendTo(a.append),b.delay(a.item.delay).fadeIn(a.item.effects.duration,a.item.effects.easing[0]),f.mouseover(function(){if(!1===c.is(":visible"))return c.delay(a.item.effects.duration).fadeIn(600)}),
c.click(function(){b.fadeOut(a.item.effects.duration/2,a.item.effects.easing[1],function(){g.setStore(a.closePoint,[!0,a.date.now()]);b.remove()})}),f.on("touchstart click",function(){return g.clickAdvert(a)})}catch(n){return console.error(n)}finally{return g.notice(a)}}})(jQuery);
