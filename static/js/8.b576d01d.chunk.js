(this.webpackJsonphotm=this.webpackJsonphotm||[]).push([[8],{295:function(e,t,a){"use strict";var n=a(31);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(0)),o=(0,n(a(39)).default)(r.default.createElement("path",{d:"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"}),"KeyboardArrowRight");t.default=o},296:function(e,t,a){"use strict";var n=a(31);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(0)),o=(0,n(a(39)).default)(r.default.createElement("path",{d:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"}),"KeyboardArrowLeft");t.default=o},369:function(e,t,a){"use strict";var n=a(31);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(0)),o=(0,n(a(39)).default)(r.default.createElement("path",{d:"M21.94 4.88c-.18-.53-.69-.88-1.26-.88H19.6l-.31-.97C19.15 2.43 18.61 2 18 2s-1.15.43-1.29 1.04L16.4 4h-1.07c-.57 0-1.08.35-1.26.88-.19.56.04 1.17.56 1.48l.87.52-.4 1.24c-.23.58-.04 1.25.45 1.62.23.17.51.26.78.26.31 0 .61-.11.86-.32l.81-.7.81.7c.25.21.55.32.86.32.27 0 .55-.09.78-.26.5-.37.68-1.04.45-1.62l-.39-1.24.87-.52c.51-.31.74-.92.56-1.48zM18 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM13.49 10.51c-.43-.43-.94-.73-1.49-.93V8h-1v1.38c-.11-.01-.23-.03-.34-.03-1.02 0-2.05.39-2.83 1.17-.16.16-.3.34-.43.53L6 10.52c-1.56-.55-3.28.27-3.83 1.82-.27.75-.23 1.57.12 2.29.23.48.58.87 1 1.16-.38 1.35-.06 2.85 1 3.91s2.57 1.38 3.91 1c.29.42.68.77 1.16 1 .42.2.85.3 1.29.3.34 0 .68-.06 1.01-.17 1.56-.55 2.38-2.27 1.82-3.85l-.52-1.37c.18-.13.36-.27.53-.43.87-.87 1.24-2.04 1.14-3.17H16v-1h-1.59c-.19-.55-.49-1.06-.92-1.5zm-8.82 3.78c-.25-.09-.45-.27-.57-.51s-.13-.51-.04-.76c.19-.52.76-.79 1.26-.61l3.16 1.19c-1.15.6-2.63 1.11-3.81.69zm6.32 5.65c-.25.09-.52.08-.76-.04-.24-.11-.42-.32-.51-.57-.42-1.18.09-2.65.7-3.8l1.18 3.13c.18.52-.09 1.1-.61 1.28zm1.21-5.34l-.61-1.61c0-.01-.01-.02-.02-.03l-.06-.12c-.02-.04-.04-.07-.07-.11l-.09-.09-.09-.09c-.03-.03-.07-.05-.11-.07-.04-.02-.07-.05-.12-.06-.01 0-.02-.01-.03-.02l-1.6-.6c.36-.29.79-.46 1.26-.46.53 0 1.04.21 1.41.59.73.73.77 1.88.13 2.67z"}),"EmojiNature");t.default=o},476:function(e,t,a){"use strict";var n=a(1),r=a(34),o=a(2),i=a(0),c=a.n(i),l=(a(4),a(3)),s=a(5),u=a(153),d=a(7),m=a(10),f=a(33),b=c.a.forwardRef((function(e,t){var a=e.classes,r=e.className,i=e.color,s=void 0===i?"primary":i,u=e.value,m=e.valueBuffer,b=e.variant,p=void 0===b?"indeterminate":b,g=Object(o.a)(e,["classes","className","color","value","valueBuffer","variant"]),v=Object(f.a)(),h={},E={bar1:{},bar2:{}};if("determinate"===p||"buffer"===p)if(void 0!==u){h["aria-valuenow"]=Math.round(u);var k=u-100;"rtl"===v.direction&&(k=-k),E.bar1.transform="translateX(".concat(k,"%)")}else 0;if("buffer"===p)if(void 0!==m){var y=(m||0)-100;"rtl"===v.direction&&(y=-y),E.bar2.transform="translateX(".concat(y,"%)")}else 0;return c.a.createElement("div",Object(n.a)({className:Object(l.default)(a.root,a["color".concat(Object(d.a)(s))],r,{determinate:a.determinate,indeterminate:a.indeterminate,buffer:a.buffer,query:a.query}[p]),role:"progressbar"},h,{ref:t},g),"buffer"===p?c.a.createElement("div",{className:Object(l.default)(a.dashed,a["dashedColor".concat(Object(d.a)(s))])}):null,c.a.createElement("div",{className:Object(l.default)(a.bar,a["barColor".concat(Object(d.a)(s))],("indeterminate"===p||"query"===p)&&a.bar1Indeterminate,{determinate:a.bar1Determinate,buffer:a.bar1Buffer}[p]),style:E.bar1}),"determinate"===p?null:c.a.createElement("div",{className:Object(l.default)(a.bar,("indeterminate"===p||"query"===p)&&a.bar2Indeterminate,"buffer"===p?[a["color".concat(Object(d.a)(s))],a.bar2Buffer]:a["barColor".concat(Object(d.a)(s))]),style:E.bar2}))})),p=Object(s.a)((function(e){var t=function(t){return"light"===e.palette.type?Object(m.e)(t,.62):Object(m.a)(t,.5)},a=t(e.palette.primary.main),n=t(e.palette.secondary.main);return{root:{position:"relative",overflow:"hidden",height:4},colorPrimary:{backgroundColor:a},colorSecondary:{backgroundColor:n},determinate:{},indeterminate:{},buffer:{backgroundColor:"transparent"},query:{transform:"rotate(180deg)"},dashed:{position:"absolute",marginTop:0,height:"100%",width:"100%",animation:"$buffer 3s infinite linear"},dashedColorPrimary:{backgroundImage:"radial-gradient(".concat(a," 0%, ").concat(a," 16%, transparent 42%)"),backgroundSize:"10px 10px",backgroundPosition:"0px -23px"},dashedColorSecondary:{backgroundImage:"radial-gradient(".concat(n," 0%, ").concat(n," 16%, transparent 42%)"),backgroundSize:"10px 10px",backgroundPosition:"0px -23px"},bar:{width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left"},barColorPrimary:{backgroundColor:e.palette.primary.main},barColorSecondary:{backgroundColor:e.palette.secondary.main},bar1Indeterminate:{width:"auto",animation:"$indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite"},bar1Determinate:{transition:"transform .".concat(4,"s linear")},bar1Buffer:{zIndex:1,transition:"transform .".concat(4,"s linear")},bar2Indeterminate:{width:"auto",animation:"$indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite"},bar2Buffer:{transition:"transform .".concat(4,"s linear")},"@keyframes indeterminate1":{"0%":{left:"-35%",right:"100%"},"60%":{left:"100%",right:"-90%"},"100%":{left:"100%",right:"-90%"}},"@keyframes indeterminate2":{"0%":{left:"-200%",right:"100%"},"60%":{left:"107%",right:"-8%"},"100%":{left:"107%",right:"-8%"}},"@keyframes buffer":{"0%":{opacity:1,backgroundPosition:"0px -23px"},"50%":{opacity:0,backgroundPosition:"0px -23px"},"100%":{opacity:1,backgroundPosition:"-200px -23px"}}}}),{name:"MuiLinearProgress"})(b),g=c.a.forwardRef((function(e,t){var a=e.activeStep,i=void 0===a?0:a,s=e.backButton,m=e.classes,f=e.className,b=e.LinearProgressProps,g=e.nextButton,v=e.position,h=void 0===v?"bottom":v,E=e.steps,k=e.variant,y=void 0===k?"dots":k,j=Object(o.a)(e,["activeStep","backButton","classes","className","LinearProgressProps","nextButton","position","steps","variant"]);return c.a.createElement(u.a,Object(n.a)({square:!0,elevation:0,className:Object(l.default)(m.root,m["position".concat(Object(d.a)(h))],f),ref:t},j),s,"text"===y&&c.a.createElement(c.a.Fragment,null,i+1," / ",E),"dots"===y&&c.a.createElement("div",{className:m.dots},Object(r.a)(new Array(E)).map((function(e,t){return c.a.createElement("div",{key:t,className:Object(l.default)(m.dot,t===i&&m.dotActive)})}))),"progress"===y&&c.a.createElement(p,Object(n.a)({className:m.progress,variant:"determinate",value:Math.ceil(i/(E-1)*100)},b)),g)}));t.a=Object(s.a)((function(e){return{root:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",background:e.palette.background.default,padding:8},positionBottom:{position:"fixed",bottom:0,left:0,right:0,zIndex:e.zIndex.mobileStepper},positionTop:{position:"fixed",top:0,left:0,right:0,zIndex:e.zIndex.mobileStepper},positionStatic:{},dots:{display:"flex",flexDirection:"row"},dot:{backgroundColor:e.palette.action.disabled,borderRadius:"50%",width:8,height:8,margin:"0 2px"},dotActive:{backgroundColor:e.palette.primary.main},progress:{width:"50%"}}}),{name:"MuiMobileStepper"})(g)},493:function(e,t,a){"use strict";a.r(t);var n=a(32),r=a(8),o=a(6),i=a(0),c=a.n(i),l=a(54),s=a(18),u=a(78),d=a.n(u),m=a(299),f=a(30),b=a(29),p=a(359),g=a(153),v=a(476),h=a(83),E=a(296),k=a.n(E),y=a(295),j=a.n(y),O=a(369),x=a.n(O),S=a(207),B=a(89),C=Object(b.a)((function(e){return{paper:{padding:e.spacing(3),color:e.palette.text.secondary,background:"linear-gradient(#f0e8e8, #e0d8d8)",marginBottom:10},flex:{display:"flex",marginTop:10},grow:{flexGrow:1},progress:{display:"flex",justifyContent:"center",padding:40}}}));function w(e){var t=e.event,a=C(),n=0;return c.a.createElement(g.a,{className:a.paper,elevation:6},c.a.createElement(f.a,{variant:"h6",align:"center",color:"textPrimary"},d()(t.start).format("dddd, YYYY/MM/DD")),c.a.createElement(f.a,{variant:"h6",align:"center",color:"textPrimary",gutterBottom:!0},"".concat(d()(t.start).format("LT")," \u2013 ").concat(d()(t.end).format("LT"))),c.a.createElement("div",null,c.a.createElement(m.f,null),c.a.createElement("span",null,t.address)),c.a.createElement("div",null,c.a.createElement(m.h,null),c.a.createElement("span",null,"".concat(t.client.name," ")),c.a.createElement(m.g,null),c.a.createElement("span",null,"".concat(t.client.phone," ")),t.organic?c.a.createElement(x.a,{color:"primary"}):null),c.a.createElement("div",null,c.a.createElement("br",null),c.a.createElement(m.e,null),c.a.createElement("span",null,"".concat(t.total," ")),c.a.createElement(m.i,null),c.a.createElement("span",null,t.artists.map((function(e){return e.name})).join(", ")),c.a.createElement("ul",null,t.serviceItems.map((function(e){return c.a.createElement("li",{key:n++},e)})))))}var P=function(e){var t=e.events,a=e.eventsFetched,n=e.changeBookingStage,r=e.setManageState,l=e.loadBooking,u=e.saveBooking,d=e.activeStep,m=e.setActiveStep,b=C(),g=Object(i.useContext)(B.a).bookingsData.data,E=Object(i.useState)(0),y=Object(o.a)(E,2),O=y[0],x=y[1];Object(i.useEffect)((function(){x(t.length)}),[a,t.length]);return c.a.createElement(p.a,{maxWidth:"sm",style:{paddingTop:20,paddingBottom:20}},!a&&c.a.createElement("div",{className:b.progress},c.a.createElement(S.a,{color:"primary"})),a&&c.a.createElement(c.a.Fragment,null,t.length>0?c.a.createElement(c.a.Fragment,null,c.a.createElement(w,{event:t[d]}),c.a.createElement(v.a,{steps:O,position:"static",variant:"text",activeStep:d,nextButton:c.a.createElement(h.a,{size:"small",onClick:function(){m((function(e){return e+1}))},disabled:d===O-1},"Next event",c.a.createElement(j.a,null)),backButton:c.a.createElement(h.a,{size:"small",onClick:function(){m((function(e){return e-1}))},disabled:0===d},c.a.createElement(k.a,null),"Prev event")}),c.a.createElement("div",{className:b.flex},c.a.createElement(h.a,{variant:"text",color:"primary",size:"large",onClick:function(){l(Object(s.a)({},g[t[d].id],{client:t[d].client})),n(0),r("Edit")}},"Edit"),c.a.createElement("div",{className:b.grow}),c.a.createElement(h.a,{variant:"text",color:"primary",size:"large",onClick:function(){var e=t[d].id,a=g[e];l(Object(s.a)({},a,{client:t[d].client})),u(Object(s.a)({},a,{paid_type:"balance",paid_amount:a.total_amount-a.paid_amount})),n(2),r("Checkout")}},"Checkout"))):c.a.createElement(f.a,{variant:"h6",align:"center",color:"textPrimary"},"No booking found")))},z=Object(n.b)(null,(function(e){return{loadBooking:function(t){return e(Object(r.F)(t))},saveBooking:function(t){return e(Object(r.H)(t))}}}))(P),N=a(475),M=Object(l.f)((function(e){var t=e.events,a=e.eventsFetched,n=e.setActivateBookings,r=e.bookingStage,l=e.changeBookingStage,s=e.services,u=e.bookingValue,d=e.depositPayable,m=e.artists,f=Object(i.useState)("Default"),b=Object(o.a)(f,2),p=b[0],g=b[1],v=Object(i.useState)(0),h=Object(o.a)(v,2),E=h[0],k=h[1];return Object(i.useEffect)((function(){return n(!0),function(){n(!1)}}),[]),c.a.createElement(c.a.Fragment,null,"Default"===p?c.a.createElement(z,{events:t,eventsFetched:a,changeBookingStage:l,setManageState:g,activeStep:E,setActiveStep:k}):null,"Edit"===p||"Checkout"===p?c.a.createElement(N.default,{bookingStage:r,changeBookingStage:l,services:s,bookingValue:u,depositPayable:d,artists:m,newBooking:!1,manageState:p,setManageState:g}):null)}));t.default=Object(n.b)(null,(function(e){return{setActivateBookings:function(t){return e(Object(r.J)(t))}}}))(M)}}]);
//# sourceMappingURL=8.b576d01d.chunk.js.map