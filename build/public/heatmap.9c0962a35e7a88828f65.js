(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{483:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var r=a(0),n=a.n(r),l=a(3);const o=({title:e})=>{const t=Object(l.a)(8*e.length,80,300);return n.a.createElement("div",{className:"title",style:{minWidth:t}},e)}},487:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var r=a(0),n=a.n(r),l=a(19),o=a(490);const s=e=>{const{series:t,datum:a,showPrevious:r}=e;if(!r)return n.a.createElement(n.a.Fragment,null,t.formatValue(a));const s=t.selectValue(a),c=t.selectValue(a,l.b.PREVIOUS),i=t.formatter();return n.a.createElement(o.a,{lowerIsBetter:t.measure.lowerIsBetter,formatter:i,current:s,previous:c})}},488:function(e,t,a){"use strict";a.d(t,"a",(function(){return d}));var r=a(0),n=a.n(r),l=a(6),o=a(483),s=a(51),c=a(1),i=a(3),h=a(84),u=a(116),m=a(163);class p extends n.a.Component{constructor(...e){super(...e),Object(c.a)(this,"modalRef",void 0),Object(c.a)(this,"setModalRef",e=>{this.modalRef=e}),Object(c.a)(this,"onMouseDown",e=>{const t=e.target;Object(i.h)(t,this.modalRef)||this.props.onClose()})}render(){const{className:e,children:t,left:a,top:r}=this.props;return n.a.createElement(n.a.Fragment,null,n.a.createElement(u.a,{mouseDown:this.onMouseDown}),n.a.createElement(h.a,{left:a,top:r},n.a.createElement("div",{className:Object(i.b)("modal-bubble",e),ref:this.setModalRef},t,n.a.createElement(m.a,{direction:"up"}))))}}const d=({title:e,children:t,left:a,top:r,acceptHighlight:c,dropHighlight:i})=>n.a.createElement(p,{className:"highlight-modal",left:a,top:r,onClose:i},n.a.createElement(o.a,{title:e}),n.a.createElement("div",{className:"value"},t),n.a.createElement("div",{className:"actions"},n.a.createElement(s.a,{type:"primary",className:"accept mini",onClick:c,title:l.m.select}),n.a.createElement(s.a,{type:"secondary",className:"drop mini",onClick:i,title:l.m.cancel})))},489:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return i}));var r=a(0),n=a.n(r),l=a(84),o=a(483),s=a(163);const c=e=>{const{left:t,top:a,title:r,content:o}=e;return n.a.createElement(l.a,{left:t,top:a+-10},n.a.createElement("div",{className:"segment-bubble"},n.a.createElement(i,{title:r,content:o}),n.a.createElement(s.a,{direction:"up"})))},i=({title:e,content:t})=>n.a.createElement("div",{className:"segment-bubble-text"},n.a.createElement(o.a,{title:e}),t?n.a.createElement("div",{className:"content"},t):null)},490:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var r=a(0),n=a.n(r),l=a(484);const o=({lowerIsBetter:e,formatter:t,current:a,previous:r})=>{const o=t(a),s=t(r);return n.a.createElement(n.a.Fragment,null,n.a.createElement("strong",{className:"current-value"},o),n.a.createElement("span",{className:"previous-value"},s),n.a.createElement(l.a,{formatter:t,currentValue:a,previousValue:r,lowerIsBetter:e}))}},526:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var r=a(0),n=a.n(r);const l=({title:e,width:t=100,height:a=200,formatter:r,colorScale:l})=>{const[o,s]=l.domain();if(isNaN(o)||isNaN(s))return null;const c=a-10-5,[i,h]=l.range();return n.a.createElement("div",{className:"color-legend"},n.a.createElement("div",{className:"color-legend-header"},e),n.a.createElement("div",{className:"color-legend-stripe"},n.a.createElement("svg",{className:"color-legend",width:t+"px",height:a+"px"},n.a.createElement("defs",null,n.a.createElement("linearGradient",{id:"color-stripe",gradientTransform:"rotate(90)"},n.a.createElement("stop",{offset:"0%",stopColor:h}),n.a.createElement("stop",{offset:"10%",stopColor:h}),n.a.createElement("stop",{offset:"90%",stopColor:i}),n.a.createElement("stop",{offset:"100%",stopColor:i}))),n.a.createElement("g",{transform:"translate(5, 10)"},n.a.createElement("rect",{className:"color-legend-stripe",x:0,y:0,width:30,height:c,fill:"url(#color-stripe)"}),n.a.createElement("line",{className:"color-legend-stripe-axis",x1:.5,x2:.5,y1:0,y2:c}),n.a.createElement("g",{className:"color-upper-bound"},n.a.createElement("line",{className:"color-upper-bound-tick",x1:0,x2:35,y1:.5,y2:.5}),n.a.createElement("text",{className:"color-upper-bound-value",x:37,y:4},r(s))),n.a.createElement("g",{className:"color-lower-bound"},n.a.createElement("line",{className:"color-lower-bound-tick",x1:0,x2:35,y1:c+.5,y2:c+.5}),n.a.createElement("text",{className:"color-lower-bound-value",x:37,y:c+4},r(o)))))))}},576:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return Ee}));var r=a(1),n=a(112),l=a(0),o=a.n(l),s=a(191),c=a(6),i=a(10),h=a(14),u=a(15),m=a(83);const p=([e,t],[a,r])=>t<r?1:t>r?-1:0,d=(e,t)=>-p(e,t),f=([e,t,a],[r,n,l])=>-a.compare(l),g=([e,t,a],[r,n,l])=>a.compare(l),b=([e,t,a],[r,n,l])=>-a.compare(l),v=([e,t,a],[r,n,l])=>a.compare(l),E=(e,t,a)=>Object(m.d)(e[t],a),y=(e,t,a,r)=>{const n={},l={},o=(e=>{const t=e.sort;switch(e.type){case u.b.string:default:return t.direction===h.c.ascending?d:p;case u.b.time:return t.direction===h.c.ascending?g:f;case u.b.number:return t.direction===h.c.ascending?v:b}})(a),s=a.reference;for(const a of e.data){const e=a[c.l].data;for(const a of e){const e=a[t],o=E(a,s,r);void 0!==n[o]?n[o]+=e:(n[o]=e,l[o]=a[s])}}const m=Object.keys(n).map(e=>[e,n[e],l[e]]).sort(o).map(([e])=>e),y=e.data.map(e=>{const a=e[c.l].data.reduce((e,t)=>(e[E(t,s,r)]=t,e),{}),n=m.map(e=>{const r=a[e];return r?Object(i.a)(Object(i.a)({},r),{},{[t]:Number.isNaN(Number(r[t]))?0:r[t]}):{[s]:l[e],[t]:0}});return Object(i.a)(Object(i.a)({},e),{},{[c.l]:e[c.l].changeData(n)})});return e.changeData(y)};var w=a(485),N=a(115),x=a(4),S=a(526),O=a(166),j=a(167),H=a(3),L=a(8);const C=({width:e,height:t,essence:a})=>{const{dataCube:r,splits:{splits:n}}=a,l=n.get(0),s=n.get(1),c=l.getTitle(Object(L.d)(r.dimensions,l.reference)),i=s.getTitle(Object(L.d)(r.dimensions,s.reference));return o.a.createElement("div",{className:"heatmap-corner"},o.a.createElement("div",{className:"heatmap-corner-row-title"},o.a.createElement("span",{className:"heatmap-corner-overflow-label",style:{width:e-20+"px"}},c)),o.a.createElement("div",{className:"heatmap-corner-column-title",style:{left:e-20+7+"px"}},o.a.createElement("span",{className:"heatmap-corner-overflow-label",style:{width:t-20+"px"}},i)))},M=e=>{const{row:t,width:a,tileSize:r}=e,n=t*r;return o.a.createElement("div",{className:"heatmap-highlighter heatmap-highlighter-row",style:{top:n+"px",width:a+"px"}})},z=e=>{const{column:t,tileSize:a,height:r,tileGap:n}=e,l=t*a+n;return o.a.createElement("div",{className:"heatmap-highlighter heatmap-highlighter-column",style:{left:l+"px",height:r+"px"}})},k=e=>{const{position:{row:t,column:a},width:r,height:n,tileGap:l,tileSize:s}=e;return o.a.createElement(o.a.Fragment,null,t&&o.a.createElement(M,{row:t,width:r,tileSize:s}),a&&o.a.createElement(z,{column:a,tileGap:l,height:n,tileSize:s}))};var T=a(488);function I(e){const{position:{column:t},layout:a,stage:r,scroll:n}=e;return null!==t?t*ce+ie+a.left+20+r.x-n.left:r.x+Math.min(r.width/2,a.left+a.bodyWidth/2)}function P(e){const{position:{row:t},layout:a,stage:r,scroll:n}=e;return null!==t?t*ce+a.top+r.y-5-n.top:r.y+Math.min(r.height/2,a.top+a.bodyHeight/2)}const W=e=>{const{title:t,children:a,acceptHighlight:r,dropHighlight:n}=e;return o.a.createElement(T.a,{title:t,left:I(e),top:P(e),dropHighlight:n,acceptHighlight:r},a)},G=({tileGap:e,tileSize:t,hoverPosition:a})=>{const{column:r,row:n}=a,l={top:n*t+"px",left:r*t+e+"px"};return o.a.createElement("div",{className:"heatmap-hover-indicator",style:l})};var R=a(581),D=a(489),V=a(487);const F=e=>e&&e[c.l]&&e[c.l].data||[];function B(e,t){const a=F(e)[t];return a||null}function A(e,t){const{column:a,row:r}=t,n=e[r];return n?[n,B(n,a)]:[null,B(e[0],a)]}var q=a(18);function U(e,t,a){const{timezone:r,splits:{splits:n}}=a,l=A(t,e),o=n.toArray().map(e=>e.reference);return Object(q.s)(l,o).filter(([e])=>e).map(([e,t])=>Object(m.b)(e[t],r)).join(" - ")}const $=e=>{const{dataset:t,essence:a,scroll:r,position:{column:n,row:l,top:s,left:c}}=e,[,i]=A(t,{row:l,column:n});if(!i)return null;const h=a.getConcreteSeries().first();return o.a.createElement(R.a,{key:`${l}-${n}`,top:s-r.top,left:c-r.left},o.a.createElement(D.b,{title:U({row:l,column:n},t,a),content:o.a.createElement(V.a,{datum:i,showPrevious:a.hasComparison(),series:h})}))};class J extends o.a.Component{constructor(...e){super(...e),Object(r.a)(this,"container",o.a.createRef())}componentDidMount(){if(null===this.container.current)return;const{onMaxLabelSize:e=q.l}=this.props;e(Array.from(this.container.current.querySelectorAll(".heatmap-label")).reduce((e,t)=>Math.max(t.offsetWidth,e),0)+10)}render(){const{labels:e,orientation:t,hoveredLabel:a,highlightedLabel:r,labelSize:n}=this.props;return o.a.createElement("div",{ref:this.container,className:t+"-labels"},e.map((e,t)=>{const l=r===t,s=!l&&a===t;return o.a.createElement("span",{key:e,className:Object(H.b)("heatmap-label-wrapper",{"heatmap-label-hovered":s,"heatmap-label-highlight":l})},o.a.createElement("span",{className:"heatmap-label",style:n?{width:n}:void 0},o.a.createElement("span",{className:"heatmap-label-overflow-container"},e)))}))}}var _=a(582),K=a(169);function X(e,t){return Object.keys(e).every(a=>{return r=e[a],n=t[a],null===r?r===n:Object(K.a)(r)?r.equals(n):r===n;var r,n})}class Q extends o.a.PureComponent{render(){const{bins:e}=this.props;return e.map(e=>o.a.createElement("rect",{key:`heatmap-rect-${e.row}-${e.column}`,width:e.width,height:e.height,x:e.y,y:e.x,fill:e.color,fillOpacity:e.opacity}))}}const Y=e=>e[c.l].data;class Z extends o.a.Component{shouldComponentUpdate(e){return!X(this.props,e)}render(){const{series:e,colorScale:t,xScale:a,yScale:r,gap:n,tileSize:l,dataset:s}=this.props,[c]=r.range(),[,i]=a.range();return o.a.createElement("div",{className:"heatmap-rectangles-container"},o.a.createElement("svg",{width:i,height:c},o.a.createElement("rect",{x:0,y:0,width:i,height:c,fill:"#fff"}),o.a.createElement(_.a,{bins:Y,count:t=>e.selectValue(t),data:s,xScale:a,yScale:r,colorScale:t,binWidth:l,binHeight:l,gap:n},e=>e.map(e=>o.a.createElement(Q,{key:"heatmap-rect-row-"+e[0].column,bins:e})))))}}var ee=a(7),te=a(9);function ae(e,t,a,r){const n=e.reference,l=Object(L.d)(a.dimensions,n),o=Math.floor(t/ce);if(o>r.length-1)return null;return{value:r[o][n],dimension:l}}function re(e,t,a){const{dataCube:r,splits:{splits:n}}=t;return ae(n.get(0),e,r,a)}function ne(e,t,a){const{dataCube:r,splits:{splits:n}}=t;return ae(n.get(1),e,r,F(a[0]))}function le({value:e,dimension:{kind:t,name:a}}){switch(t){case"string":return new ee.h({reference:a,action:ee.g.IN,values:x.f.of(String(e))});case"boolean":return new ee.a({reference:a,values:x.f.of(e)});case"time":return new ee.c({reference:a,values:x.a.of(e)});case"number":return new ee.d({reference:a,values:x.a.of(e)})}}function oe(e,t,a){const r=function({x:e,y:t,part:a},r,n){switch(a){case"top-gutter":return[ne(e,r,n)];case"left-gutter":return[re(t,r,n)];case"body":return[re(t,r,n),ne(e,r,n)]}}(e,t,a);return r.every(te.o)?r.map(le):[]}function se(e,t){return e.findIndex(function(e){switch(e.type){case ee.b.BOOLEAN:return t=>t[e.reference]===e.values.first();case ee.b.NUMBER:return t=>e.values.first().equals(t[e.reference]);case ee.b.STRING:return t=>String(t[e.reference])===e.values.first();case ee.b.FIXED_TIME:return t=>e.values.first().equals(t[e.reference]);case ee.b.RELATIVE_TIME:throw new Error("Unsupported filter type for highlights")}}(t))}const ce=25,ie=2,he=100,ue=200,me=100,pe=150;function de(e,t,a){return e.map(e=>Object(m.b)(e[t],a))}class fe extends o.a.PureComponent{constructor(...e){super(...e),Object(r.a)(this,"state",{hoverPosition:null,leftLabelsWidth:0,topLabelsHeight:0,scrollLeft:0,scrollTop:0}),Object(r.a)(this,"saveHover",(e,t,a)=>{const{xScale:r,yScale:n}=this.props,l=function(e,t,a,r,n,{left:l,top:o}){if("body"!==n)return null;const s=a-l,c=r-o,i=e.range()[1],h=t.range()[0];if(s>i||c>h)return null;const u=Math.floor(e.invert(s));return{top:r,left:a,row:Math.floor(t.invert(c)),column:u}}(r,n,e,t,a,this.layout());this.setState({hoverPosition:l})}),Object(r.a)(this,"resetHover",()=>this.setState({hoverPosition:null})),Object(r.a)(this,"saveScroll",(e,t)=>this.setState({scrollLeft:t,scrollTop:e})),Object(r.a)(this,"saveLeftLabelWidth",e=>this.setState({leftLabelsWidth:Object(H.a)(e,he,ue)})),Object(r.a)(this,"saveTopLabelHeight",e=>this.setState({topLabelsHeight:Object(H.a)(e,me,pe)})),Object(r.a)(this,"handleHighlight",(e,t,a)=>{if(!function(e){return"body"===e||"top-gutter"===e||"left-gutter"===e}(a))return;const{saveHighlight:r,essence:n,dataset:l}=this.props,o=this.layout(),s=oe({x:e-o.left,y:t-o.top,part:a},n,l);s.length>0&&r(Object(x.a)(s))})}layout(){const{topLabelsHeight:e,leftLabelsWidth:t}=this.state,{dataset:a}=this.props;return function(e,t,a){const r=Object(H.a)(t,me,pe),n=Object(H.a)(a,he,ue);return{bodyHeight:e.length*ce,bodyWidth:F(e[0]).length*ce,top:r,left:n,right:0,bottom:0}}(a,e,t)}render(){const{stage:e,colorScale:t,xScale:a,yScale:r,dataset:n,essence:l,highlight:s,acceptHighlight:c,dropHighlight:i}=this.props,{scrollLeft:h,scrollTop:u,hoverPosition:m,topLabelsHeight:p}=this.state,d=l.getConcreteSeries().first(),{splits:{splits:f},timezone:g}=l,b=f.get(0),v=f.get(1),E=de(n,b.reference,g),y=de(F(n[0]),v.reference,g),w=function(e,t,a){if(!e)return null;const{splits:{splits:r}}=t,{clauses:n}=e,l=r.get(0),o=r.get(1).reference,s=l.reference,c=n.find(({reference:e})=>e===o),i=n.find(({reference:e})=>e===s),h=i?se(a,i):null;return{row:h,column:c?se(F(a[h||0]),c):null}}(s,l,n),N=this.layout();return o.a.createElement(o.a.Fragment,null,o.a.createElement(j.a,{onClick:this.handleHighlight,onMouseMove:this.saveHover,onMouseLeave:this.resetHover,onScroll:this.saveScroll,layout:N,topLeftCorner:o.a.createElement(C,{width:N.left,height:N.top,essence:l}),topGutter:o.a.createElement(J,{orientation:"top",labels:y,hoveredLabel:m?m.column:-1,highlightedLabel:w?w.column:-1,onMaxLabelSize:this.saveTopLabelHeight,labelSize:p}),leftGutter:o.a.createElement(J,{orientation:"left",labels:E,hoveredLabel:m?m.row:-1,highlightedLabel:w?w.row:-1,onMaxLabelSize:this.saveLeftLabelWidth}),body:o.a.createElement(o.a.Fragment,null,o.a.createElement(Z,{key:"heatmap",dataset:n,series:d,xScale:a,yScale:r,colorScale:t,tileSize:ce,gap:ie,leftLabelName:b.reference,topLabelName:v.reference}),w&&o.a.createElement(k,{position:w,height:N.bodyHeight,width:N.bodyWidth,tileSize:ce,tileGap:ie}),m&&o.a.createElement(G,{tileSize:ce,tileGap:ie,hoverPosition:m}))}),o.a.createElement(O.a,null,o.a.createElement(S.a,{title:d.title(),formatter:d.formatter(),colorScale:t})),w&&o.a.createElement(W,{title:U(w,n,l),position:w,stage:e,layout:N,scroll:{left:h,top:u},dropHighlight:i,acceptHighlight:c}),m&&o.a.createElement($,{scroll:{left:h,top:u},dataset:n,position:m,essence:l}))}}var ge=a(573),be=a(82);function ve(e,t,a,r){const n=be.f(e,e=>F(e).length)||0,l=e.length,o=n*t,s=l*t,c=Object(ge.a)({domain:[0,n],range:[0,o]}),i=Object(ge.a)({domain:[l,0],range:[s,0]}),h=function(e){return t=>e.selectValue(t)}(r),u=be.g(e,e=>be.g(F(e),h)),m=be.f(e,e=>be.f(F(e),h));return{x:c,y:i,color:Object(ge.a)({range:["#fff",a],domain:[Math.min(u,0),m]})}}function Ee(e){return o.a.createElement(o.a.Fragment,null,o.a.createElement(w.b,e),o.a.createElement(w.a,Object.assign({},e,{chartComponent:ye})))}class ye extends o.a.Component{constructor(...e){super(...e),Object(r.a)(this,"className",s.a.name),Object(r.a)(this,"context",void 0),Object(r.a)(this,"getScales",Object(n.a)(ve)),Object(r.a)(this,"prepareDataset",Object(n.a)((e,t,a,r)=>y(e.data[0][c.l],t.plywoodKey(),a,r),([e],[t])=>e===t))}render(){const{customization:{visualizationColors:e}}=this.context,{essence:t,stage:a,highlight:r,data:n,saveHighlight:l,acceptHighlight:s,dropHighlight:c}=this.props,{timezone:i,splits:{splits:h}}=t,u=t.getConcreteSeries().first(),m=h.get(1),p=this.prepareDataset(n,u,m,i),{x:d,y:f,color:g}=this.getScales(p.data,ce,e.main,u);return o.a.createElement("div",{className:"heatmap-container",style:{height:a.height}},o.a.createElement(fe,{stage:a,dataset:p.data,xScale:d,yScale:f,colorScale:g,saveHighlight:l,highlight:r,acceptHighlight:s,dropHighlight:c,essence:t}))}}Object(r.a)(ye,"contextType",N.a)}}]);
//# sourceMappingURL=heatmap.9c0962a35e7a88828f65.js.map