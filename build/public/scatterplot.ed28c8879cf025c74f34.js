(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{672:function(e,t,a){"use strict";a.d(t,"d",(function(){return c})),a.d(t,"e",(function(){return i})),a.d(t,"a",(function(){return l})),a.d(t,"f",(function(){return o})),a.d(t,"b",(function(){return s})),a.d(t,"c",(function(){return u}));var r=a(24),n=a(11),c=function(e){return e.data[0]},i=function(e){return e[n.l]},l=function(e){return e.data},o=Object(r.c)(i,l),s=Object(r.c)(c,i),u=Object(r.c)(s,l)},675:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var r=a(0),n=a.n(r),c=a(8),i=function(e){var t=e.title,a=Object(c.a)(8*t.length,80,300);return n.a.createElement("div",{className:"title",style:{minWidth:a}},t)}},679:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var r=a(0),n=a.n(r),c=a(25),i=a(682),l=function(e){var t=e.series,a=e.datum;if(!e.showPrevious)return n.a.createElement(n.a.Fragment,null,t.formatValue(a));var r=t.selectValue(a),l=t.selectValue(a,c.b.PREVIOUS),o=t.formatter();return n.a.createElement(i.a,{lowerIsBetter:t.measure.lowerIsBetter,formatter:o,current:r,previous:l})}},681:function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"b",(function(){return s}));var r=a(0),n=a.n(r),c=a(122),i=a(675),l=a(237),o=function(e){var t=e.left,a=e.top,r=e.title,i=e.content;return n.a.createElement(c.a,{left:t,top:a+-10},n.a.createElement("div",{className:"segment-bubble"},n.a.createElement(s,{title:r,content:i}),n.a.createElement(l.a,{direction:"up"})))},s=function(e){var t=e.title,a=e.content;return n.a.createElement("div",{className:"segment-bubble-text"},n.a.createElement(i.a,{title:t}),a?n.a.createElement("div",{className:"content"},a):null)}},682:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var r=a(0),n=a.n(r),c=a(676),i=function(e){var t=e.lowerIsBetter,a=e.formatter,r=e.current,i=e.previous,l=a(r),o=a(i);return n.a.createElement(n.a.Fragment,null,n.a.createElement("strong",{className:"current-value"},l),n.a.createElement("span",{className:"previous-value"},o),n.a.createElement(c.a,{formatter:a,currentValue:r,previousValue:i,lowerIsBetter:t}))}},685:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var r=a(0),n=a.n(r),c=a(8);var i=function(e){var t=e.orientation,a=e.stage,r=e.ticks,i=e.scale;return n.a.createElement("g",{className:Object(c.b)("grid-lines",t),transform:a.getTransform()},r.map((function(e){var r=Object(c.k)(i(e)),l=function(e,t,a){switch(e){case"horizontal":return{x1:0,x2:a.width,y1:t,y2:t};case"vertical":return{x1:t,x2:t,y1:0,y2:a.height}}}(t,r,a);return n.a.createElement("line",Object.assign({key:String(e)},l))})))}},712:function(e,t,a){"use strict";a.d(t,"a",(function(){return f}));var r=a(3),n=a(4),c=a(2),i=a(6),l=a(7),o=a(1),s=a(0),u=a.n(s);function m(e,t){var a=e.top,r=e.left,n=e.stage,c=e.margin,i=void 0===c?10:c;if(!t)return{top:a+i,left:r+i};var l=n.y+n.height,o=n.x+n.width;return{top:t.bottom>l?a-i-t.height:t.top<n.y?a+t.height:a+i,left:t.right>o?r-i-t.width:t.left<n.x?r+t.width:r+i}}var f=function(e){Object(i.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,i=new Array(n),l=0;l<n;l++)i[l]=arguments[l];return e=t.call.apply(t,[this].concat(i)),Object(o.a)(Object(c.a)(e),"self",u.a.createRef()),Object(o.a)(Object(c.a)(e),"state",{}),e}return Object(n.a)(a,[{key:"componentDidMount",value:function(){this.setState({rect:this.self.current.getBoundingClientRect()})}},{key:"render",value:function(){var e=this.props.children;return u.a.createElement("div",{className:"tooltip-within-stage",style:m(this.props,this.state.rect),ref:this.self},e)}}]),a}(u.a.Component)},718:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var r=a(37),n=a(0),c=a.n(n),i=function(e){var t=e.title,a=e.width,n=void 0===a?100:a,i=e.height,l=void 0===i?200:i,o=e.formatter,s=e.colorScale,u=s.domain(),m=Object(r.a)(u,2),f=m[0],g=m[1];if(isNaN(f)||isNaN(g))return null;var h=l-10-5,d=s.range(),v=Object(r.a)(d,2),x=v[0],y=v[1];return c.a.createElement("div",{className:"color-legend"},c.a.createElement("div",{className:"color-legend-header"},t),c.a.createElement("div",{className:"color-legend-stripe"},c.a.createElement("svg",{className:"color-legend",width:"".concat(n,"px"),height:"".concat(l,"px")},c.a.createElement("defs",null,c.a.createElement("linearGradient",{id:"color-stripe",gradientTransform:"rotate(90)"},c.a.createElement("stop",{offset:"0%",stopColor:y}),c.a.createElement("stop",{offset:"10%",stopColor:y}),c.a.createElement("stop",{offset:"90%",stopColor:x}),c.a.createElement("stop",{offset:"100%",stopColor:x}))),c.a.createElement("g",{transform:"translate(".concat(5,", ").concat(10,")")},c.a.createElement("rect",{className:"color-legend-stripe",x:0,y:0,width:30,height:h,fill:"url(#color-stripe)"}),c.a.createElement("line",{className:"color-legend-stripe-axis",x1:.5,x2:.5,y1:0,y2:h}),c.a.createElement("g",{className:"color-upper-bound"},c.a.createElement("line",{className:"color-upper-bound-tick",x1:0,x2:35,y1:.5,y2:.5}),c.a.createElement("text",{className:"color-upper-bound-value",x:37,y:4},o(g))),c.a.createElement("g",{className:"color-lower-bound"},c.a.createElement("line",{className:"color-lower-bound-tick",x1:0,x2:35,y1:h+.5,y2:h+.5}),c.a.createElement("text",{className:"color-lower-bound-value",x:37,y:h+4},o(f)))))))}},771:function(e,t,a){"use strict";a.r(t),a.d(t,"Scatterplot",(function(){return J})),a.d(t,"default",(function(){return R}));var r=a(37),n=a(160),c=a(0),i=a.n(c),l=a(685),o=a(677),s=a(120),u=a(24),m=a(718),f=a(240),g=function(e){var t=e.xBinCount,a=e.yBinCount,r=e.xScale,n=e.yScale,c=e.stage,l=e.data,o=e.xSeries,g=e.ySeries,d=s.l().domain(r.domain()).range(Object(u.n)(0,t)),v=s.l().domain(n.domain()).range(Object(u.n)(0,a)),x=function(e){var t=e.xBinCount,a=e.yBinCount,r=e.xSeries,n=e.ySeries,c=e.xQuantile,i=e.yQuantile,l=e.data,o=Array.from({length:t},(function(){return Array.from({length:a},(function(){return 0}))}));return l.forEach((function(e){var t=c(r.selectValue(e)),a=i(n.selectValue(e));o[t][a]+=1})),o}({xBinCount:t,yBinCount:a,data:l,xQuantile:d,xSeries:o,yQuantile:v,ySeries:g}),y=[0,s.f(x,(function(e){return s.f(e)}))],E=s.k().domain(y).range(["#fff","#90b5d0"]);return i.a.createElement(i.a.Fragment,null,i.a.createElement(f.a,null,i.a.createElement(m.a,{title:"Count per summary bin",formatter:function(e){return e.toString(10)},colorScale:E})),i.a.createElement("g",{transform:c.getTransform(),className:"heatmap"},x.map((function(e,t){return e.map((function(e,a){return i.a.createElement(h,{key:"key-".concat(t,"-").concat(a),xScale:r,yScale:n,fillColor:E(e),xRange:d.invertExtent(t),yRange:v.invertExtent(a)})}))}))))};var h=function(e){var t=e.xRange,a=e.yRange,n=e.xScale,c=e.yScale,l=e.fillColor,o=Object(r.a)(t,2),s=o[0],u=o[1],m=Object(r.a)(a,2),f=m[0],g=m[1],h=n(s),d=n(u)-h,v=c(g),x=c(f)-v;return i.a.createElement("rect",{fill:l,x:h,width:d,y:v,height:x})},d=a(239),v=a(163),x=function(e){var t=e.datum,a=e.xScale,r=e.yScale,n=e.xSeries,c=e.ySeries,l=e.setHover,o=e.resetHover,s=Object(v.b)().customization.visualizationColors,u=n.selectValue(t),m=c.selectValue(t),f=s.main,g=Object(d.c)(s);return i.a.createElement(i.a.Fragment,null,i.a.createElement("circle",{cx:a(u),cy:r(m),r:3,className:"point",stroke:f,fill:g}),i.a.createElement("circle",{onMouseEnter:function(){return l(t)},onMouseLeave:function(){return o()},cx:a(u),cy:r(m),r:6,stroke:"none",fill:"transparent"}))},y=a(14),E=a(681),b=a(679),p=a(712),S=function(e){var t=e.datum,a=e.stage,r=e.xSeries,n=e.ySeries,c=e.xScale,l=e.yScale,o=e.split,s=e.timezone,u=e.showPrevious;if(!Object(y.o)(t))return null;var m=c(r.selectValue(t))+100,f=l(n.selectValue(t))+50;return i.a.createElement(p.a,{top:f,left:m,stage:a},i.a.createElement(E.b,{title:o.formatValue(t,s),content:i.a.createElement(i.a.Fragment,null,i.a.createElement("strong",{className:"series-title"},r.title()),i.a.createElement("br",null),i.a.createElement(b.a,{datum:t,showPrevious:u,series:r}),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("strong",{className:"series-title"},n.title()),i.a.createElement("br",null),i.a.createElement(b.a,{datum:t,showPrevious:u,series:n}))}))},w=a(32),k=a(672);function N(e,t,a){var n=t.getConcreteSeries().toArray(),c=Object(r.a)(n,2),i=c[0],l=c[1],o=Object(k.c)(e),u=O(o,i),m=O(o,l),f=function(e){var t=e.width/e.height;return t<=1?function(e){return w.a.fromJS({x:90,y:40,width:e.width-50-80,height:e.width-50-80})}(e):t>=2?function(e){return w.a.fromJS({x:90,y:40,width:e.height-50-80,height:e.height-50-80})}(e):function(e){return w.a.fromJS({x:90,y:40,width:e.width-50-80,height:e.height-50-80})}(e)}(a),g=s.k().domain(m).nice().range([f.height,0]),h=s.k().domain(u).nice().range([0,f.width]),d=h.ticks(10),v=g.ticks(10);return{xSeries:i,ySeries:l,xScale:h,yScale:g,xTicks:d,yTicks:v,plottingStage:f,scatterplotData:o}}function O(e,t){return function(e){var t=Object(r.a)(e,2),a=t[0],n=t[1];if(a!==n)return e;return[a-.05*a,n+.05*n]}(s.b(e,(function(e){return t.selectValue(e)})))}function j(e,t){return t>768?e:e.filter((function(e,t){return t%2==0}))}function C(e){return w.a.fromJS({x:90,y:e.height+40,width:e.width,height:50})}function V(e){return w.a.fromJS({x:40,y:40,width:50,height:e.height})}var B=a(8),z=function(e){var t=e.stage,a=e.ticks,r=e.scale,n=e.formatter,c=e.tickSize,l=c+16,o=Object(B.k)(0),s=a.map((function(e){var t=Object(B.k)(r(e));return i.a.createElement("line",{className:"tick",key:String(e),x1:t,y1:0,x2:t,y2:c})})),u=a.map((function(e){var t=r(e);return i.a.createElement("text",{className:"label axis-label-x",key:String(e),x:t,y:l},n(e))}));return i.a.createElement("g",{className:"axis axis-x",transform:t.getTransform()},s,u,i.a.createElement("line",{className:"border",y1:o,y2:o,x1:0,x2:t.width}))},T=function(e){var t=e.formatter,a=e.stage,r=e.tickSize,n=e.ticks,c=e.scale,l=Object(B.k)(a.width),o=n.map((function(e){var t=Object(B.k)(c(e));return i.a.createElement("line",{className:"tick",key:String(e),x1:a.width-r,y1:t,x2:a.width,y2:t})})),s=n.map((function(e){var a=c(e)+4;return i.a.createElement("text",{className:"label",key:String(e),x:0,y:a},t(e))}));return i.a.createElement("g",{className:"axis axis-y",transform:a.getTransform()},i.a.createElement("line",{className:"border",x1:l,y1:0,x2:l,y2:a.height}),o,s)},J=function(e){var t=e.data,a=e.essence,o=e.stage,s=Object(c.useState)(null),u=Object(r.a)(s,2),m=u[0],f=u[1],h=Object(n.a)(N),d=Object(c.useCallback)((function(e){return f(e)}),[f]),v=Object(c.useCallback)((function(){return f(null)}),[f]),y=a.splits.splits.first(),E=a.visualizationSettings.showSummary,b=h(t,a,o),p=b.xTicks,w=b.yTicks,k=b.xScale,O=b.yScale,B=b.xSeries,J=b.ySeries,R=b.plottingStage,F=b.scatterplotData,P=function(e,t){var a=e.width-(t.width+t.x);return{bottom:e.height-(t.height+t.y-55),right:a}}(o,R);return i.a.createElement("div",{className:"scatterplot-container",style:o.getWidthHeight()},i.a.createElement("span",{className:"axis-title axis-title-y",style:{top:10,left:10}},J.title()),i.a.createElement("span",{className:"axis-title axis-title-x",style:{bottom:P.bottom,right:P.right}},B.title()),i.a.createElement(S,{datum:m,stage:R,ySeries:J,xSeries:B,yScale:O,xScale:k,split:y,timezone:a.timezone,showPrevious:a.hasComparison()}),i.a.createElement("svg",{viewBox:o.getViewBox()},E&&i.a.createElement(g,{stage:R,data:F,xBinCount:p.length-1,yBinCount:w.length-1,xScale:k,xSeries:B,yScale:O,ySeries:J}),i.a.createElement(l.a,{orientation:"vertical",stage:R,ticks:p,scale:k}),i.a.createElement(l.a,{orientation:"horizontal",stage:R,ticks:w,scale:O}),i.a.createElement(z,{scale:k,stage:C(R),ticks:j(p,R.width),formatter:B.formatter(),tickSize:10}),i.a.createElement(T,{stage:V(R),ticks:j(w,R.height),tickSize:10,scale:O,formatter:J.formatter()}),i.a.createElement("g",{transform:R.getTransform()},F.map((function(e){return i.a.createElement(x,{key:"point-".concat(y.selectValue(e)),datum:e,xScale:k,yScale:O,xSeries:B,ySeries:J,setHover:d,resetHover:v})})))))};function R(e){return i.a.createElement(i.a.Fragment,null,i.a.createElement(o.b,e),i.a.createElement(o.a,Object.assign({},e,{chartComponent:J})))}}}]);
//# sourceMappingURL=scatterplot.ed28c8879cf025c74f34.js.map