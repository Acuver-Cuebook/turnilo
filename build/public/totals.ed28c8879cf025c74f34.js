(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{772:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return i}));var r=t(0),n=t.n(r),s=t(677),l=t(25),u=t(676),m=function(e){var a=e.datum,t=e.series;return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"measure-value measure-value--previous"},t.formatValue(a,l.b.PREVIOUS)),n.a.createElement("div",{className:"measure-delta-value"},n.a.createElement(u.a,{previousValue:t.selectValue(a,l.b.PREVIOUS),currentValue:t.selectValue(a,l.b.CURRENT),lowerIsBetter:t.measure.lowerIsBetter,formatter:t.formatter()})))},c=function(e){var a=e.showPrevious,t=e.datum,r=e.series;return n.a.createElement("div",{className:"total"},n.a.createElement("div",{className:"measure-name",title:r.title()},r.title()),n.a.createElement("div",{className:"measure-value"},r.formatValue(t,l.b.CURRENT)),a&&n.a.createElement(m,{series:r,datum:t}))},o=function(e){var a=e.essence,t=e.data,r=a.getConcreteSeries().toArray(),s=t.data[0];return n.a.createElement("div",{className:"total-container"},r.map((function(e){return n.a.createElement(c,{key:e.reactKey(),series:e,datum:s,showPrevious:a.hasComparison()})})))};function i(e){return n.a.createElement(n.a.Fragment,null,n.a.createElement(s.b,e),n.a.createElement(s.a,Object.assign({},e,{chartComponent:o})))}}}]);
//# sourceMappingURL=totals.ed28c8879cf025c74f34.js.map