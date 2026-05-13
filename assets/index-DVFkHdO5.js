var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,a)=>(a=n==null?{}:e(i(n)),c(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var ee=Array.isArray;function S(){}var C={H:null,A:null,T:null,S:null},te=Object.prototype.hasOwnProperty;function ne(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function re(e,t){return ne(e.type,t,e.props)}function w(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(S,S):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ce(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ce(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),ce(o,r,i,``,function(e){return e})):o!=null&&(w(o)&&(o=re(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=ce(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=ce(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ce(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function le(e,t,n){if(e==null)return e;var r=[],i=0;return ce(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ue(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var T=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},E={map:le,forEach:function(e,t,n){le(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return le(e,function(){t++}),t},toArray:function(e){return le(e,function(e){return e})||[]},only:function(e){if(!w(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=E,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!te.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return ne(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)te.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return ne(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=w,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ue}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(S,T)}catch(e){T(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.5`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,ee||(ee=!0,w());else{var t=n(l);t!==null&&oe(x,t.startTime-e)}}var ee=!1,S=-1,C=5,te=-1;function ne(){return g?!0:!(e.unstable_now()-te<C)}function re(){if(g=!1,ee){var t=e.unstable_now();te=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(S),S=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ne());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&oe(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?w():ee=!1}}}var w;if(typeof y==`function`)w=function(){y(re)};else if(typeof MessageChannel<`u`){var ie=new MessageChannel,ae=ie.port2;ie.port1.onmessage=re,w=function(){ae.postMessage(null)}}else w=function(){_(re,0)};function oe(t,n){S=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(S),S=-1):h=!0,oe(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,ee||(ee=!0,w()))),r},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.5`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),ee=Symbol.for(`react.consumer`),S=Symbol.for(`react.context`),C=Symbol.for(`react.forward_ref`),te=Symbol.for(`react.suspense`),ne=Symbol.for(`react.suspense_list`),re=Symbol.for(`react.memo`),w=Symbol.for(`react.lazy`),ie=Symbol.for(`react.activity`),ae=Symbol.for(`react.memo_cache_sentinel`),oe=Symbol.iterator;function se(e){return typeof e!=`object`||!e?null:(e=oe&&e[oe]||e[`@@iterator`],typeof e==`function`?e:null)}var ce=Symbol.for(`react.client.reference`);function le(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ce?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case te:return`Suspense`;case ne:return`SuspenseList`;case ie:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case S:return e.displayName||`Context`;case ee:return(e._context.displayName||`Context`)+`.Consumer`;case C:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case re:return t=e.displayName||null,t===null?le(e.type)||`Memo`:t;case w:t=e._payload,e=e._init;try{return le(e(t))}catch{}}return null}var ue=Array.isArray,T=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,E=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,de={pending:!1,data:null,method:null,action:null},fe=[],pe=-1;function me(e){return{current:e}}function D(e){0>pe||(e.current=fe[pe],fe[pe]=null,pe--)}function O(e,t){pe++,fe[pe]=e.current,e.current=t}var k=me(null),he=me(null),ge=me(null),_e=me(null);function ve(e,t){switch(O(ge,t),O(he,e),O(k,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}D(k),O(k,e)}function ye(){D(k),D(he),D(ge)}function be(e){e.memoizedState!==null&&O(_e,e);var t=k.current,n=Hd(t,e.type);t!==n&&(O(he,e),O(k,n))}function xe(e){he.current===e&&(D(k),D(he)),_e.current===e&&(D(_e),Qf._currentValue=de)}var Se,Ce;function we(e){if(Se===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Se=t&&t[1]||``,Ce=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Se+e+Ce}var Te=!1;function Ee(e,t){if(!e||Te)return``;Te=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,`props`,{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,`name`,{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Te=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?we(n):``}function De(e,t){switch(e.tag){case 26:case 27:case 5:return we(e.type);case 16:return we(`Lazy`);case 13:return e.child!==t&&t!==null?we(`Suspense Fallback`):we(`Suspense`);case 19:return we(`SuspenseList`);case 0:case 15:return Ee(e.type,!1);case 11:return Ee(e.type.render,!1);case 1:return Ee(e.type,!0);case 31:return we(`Activity`);default:return``}}function Oe(e){try{var t=``,n=null;do t+=De(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var ke=Object.prototype.hasOwnProperty,Ae=t.unstable_scheduleCallback,je=t.unstable_cancelCallback,Me=t.unstable_shouldYield,Ne=t.unstable_requestPaint,Pe=t.unstable_now,Fe=t.unstable_getCurrentPriorityLevel,Ie=t.unstable_ImmediatePriority,Le=t.unstable_UserBlockingPriority,Re=t.unstable_NormalPriority,ze=t.unstable_LowPriority,Be=t.unstable_IdlePriority,Ve=t.log,He=t.unstable_setDisableYieldValue,Ue=null,We=null;function Ge(e){if(typeof Ve==`function`&&He(e),We&&typeof We.setStrictMode==`function`)try{We.setStrictMode(Ue,e)}catch{}}var Ke=Math.clz32?Math.clz32:Ye,qe=Math.log,Je=Math.LN2;function Ye(e){return e>>>=0,e===0?32:31-(qe(e)/Je|0)|0}var Xe=256,Ze=262144,Qe=4194304;function $e(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function et(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=$e(n))):i=$e(o):i=$e(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=$e(n))):i=$e(o)):i=$e(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function tt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function nt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function rt(){var e=Qe;return Qe<<=1,!(Qe&62914560)&&(Qe=4194304),e}function it(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function at(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ot(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-Ke(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&st(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function st(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Ke(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function ct(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ke(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function lt(e,t){var n=t&-t;return n=n&42?1:ut(n),(n&(e.suspendedLanes|t))===0?n:0}function ut(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function dt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function ft(){var e=E.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function pt(e,t){var n=E.p;try{return E.p=e,t()}finally{E.p=n}}var mt=Math.random().toString(36).slice(2),ht=`__reactFiber$`+mt,gt=`__reactProps$`+mt,_t=`__reactContainer$`+mt,vt=`__reactEvents$`+mt,yt=`__reactListeners$`+mt,bt=`__reactHandles$`+mt,xt=`__reactResources$`+mt,St=`__reactMarker$`+mt;function Ct(e){delete e[ht],delete e[gt],delete e[vt],delete e[yt],delete e[bt]}function wt(e){var t=e[ht];if(t)return t;for(var n=e.parentNode;n;){if(t=n[_t]||n[ht]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[ht])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Tt(e){if(e=e[ht]||e[_t]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Et(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Dt(e){var t=e[xt];return t||=e[xt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function A(e){e[St]=!0}var Ot=new Set,kt={};function At(e,t){jt(e,t),jt(e+`Capture`,t)}function jt(e,t){for(kt[e]=t,e=0;e<t.length;e++)Ot.add(t[e])}var Mt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Nt={},Pt={};function Ft(e){return ke.call(Pt,e)?!0:ke.call(Nt,e)?!1:Mt.test(e)?Pt[e]=!0:(Nt[e]=!0,!1)}function It(e,t,n){if(Ft(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function Lt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Rt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function zt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Bt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Vt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ht(e){if(!e._valueTracker){var t=Bt(e)?`checked`:`value`;e._valueTracker=Vt(e,t,``+e[t])}}function Ut(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Bt(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function Wt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Gt=/[\n"\\]/g;function Kt(e){return e.replace(Gt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function qt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+zt(t)):e.value!==``+zt(t)&&(e.value=``+zt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Yt(e,o,zt(n)):Yt(e,o,zt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+zt(s):e.removeAttribute(`name`)}function Jt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ht(e);return}n=n==null?``:``+zt(n),t=t==null?n:``+zt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ht(e)}function Yt(e,t,n){t===`number`&&Wt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Xt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+zt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Zt(e,t,n){if(t!=null&&(t=``+zt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+zt(n)}function Qt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(ue(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=zt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ht(e)}function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var en=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function tn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||en.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function nn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&tn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&tn(e,o,t[o])}function rn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var an=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),on=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function sn(e){return on.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function cn(){}var ln=null;function un(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var dn=null,fn=null;function pn(e){var t=Tt(e);if(t&&(e=t.stateNode)){var n=e[gt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(qt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Kt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[gt]||null;if(!a)throw Error(i(90));qt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Ut(r)}break a;case`textarea`:Zt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Xt(e,!!n.multiple,t,!1)}}}var mn=!1;function hn(e,t,n){if(mn)return e(t,n);mn=!0;try{return e(t)}finally{if(mn=!1,(dn!==null||fn!==null)&&(bu(),dn&&(t=dn,e=fn,fn=dn=null,pn(t),e)))for(t=0;t<e.length;t++)pn(e[t])}}function gn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[gt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var _n=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),vn=!1;if(_n)try{var yn={};Object.defineProperty(yn,`passive`,{get:function(){vn=!0}}),window.addEventListener(`test`,yn,yn),window.removeEventListener(`test`,yn,yn)}catch{vn=!1}var bn=null,xn=null,Sn=null;function Cn(){if(Sn)return Sn;var e,t=xn,n=t.length,r,i=`value`in bn?bn.value:bn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Sn=i.slice(e,1<r?1-r:void 0)}function wn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Tn(){return!0}function En(){return!1}function Dn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Tn:En,this.isPropagationStopped=En,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Tn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Tn)},persist:function(){},isPersistent:Tn}),t}var On={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},kn=Dn(On),An=m({},On,{view:0,detail:0}),jn=Dn(An),Mn,Nn,Pn,Fn=m({},An,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Kn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Pn&&(Pn&&e.type===`mousemove`?(Mn=e.screenX-Pn.screenX,Nn=e.screenY-Pn.screenY):Nn=Mn=0,Pn=e),Mn)},movementY:function(e){return`movementY`in e?e.movementY:Nn}}),In=Dn(Fn),Ln=Dn(m({},Fn,{dataTransfer:0})),Rn=Dn(m({},An,{relatedTarget:0})),zn=Dn(m({},On,{animationName:0,elapsedTime:0,pseudoElement:0})),Bn=Dn(m({},On,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Vn=Dn(m({},On,{data:0})),Hn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Un={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Wn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Gn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Wn[e])?!!t[e]:!1}function Kn(){return Gn}var qn=Dn(m({},An,{key:function(e){if(e.key){var t=Hn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=wn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Un[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Kn,charCode:function(e){return e.type===`keypress`?wn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?wn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Jn=Dn(m({},Fn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Yn=Dn(m({},An,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Kn})),Xn=Dn(m({},On,{propertyName:0,elapsedTime:0,pseudoElement:0})),Zn=Dn(m({},Fn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Qn=Dn(m({},On,{newState:0,oldState:0})),$n=[9,13,27,32],er=_n&&`CompositionEvent`in window,tr=null;_n&&`documentMode`in document&&(tr=document.documentMode);var nr=_n&&`TextEvent`in window&&!tr,rr=_n&&(!er||tr&&8<tr&&11>=tr),ir=` `,ar=!1;function or(e,t){switch(e){case`keyup`:return $n.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function sr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var cr=!1;function lr(e,t){switch(e){case`compositionend`:return sr(t);case`keypress`:return t.which===32?(ar=!0,ir):null;case`textInput`:return e=t.data,e===ir&&ar?null:e;default:return null}}function ur(e,t){if(cr)return e===`compositionend`||!er&&or(e,t)?(e=Cn(),Sn=xn=bn=null,cr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return rr&&t.locale!==`ko`?null:t.data;default:return null}}var dr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!dr[e.type]:t===`textarea`}function pr(e,t,n,r){dn?fn?fn.push(r):fn=[r]:dn=r,t=Ed(t,`onChange`),0<t.length&&(n=new kn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var mr=null,hr=null;function gr(e){yd(e,0)}function _r(e){if(Ut(Et(e)))return e}function vr(e,t){if(e===`change`)return t}var yr=!1;if(_n){var br;if(_n){var xr=`oninput`in document;if(!xr){var Sr=document.createElement(`div`);Sr.setAttribute(`oninput`,`return;`),xr=typeof Sr.oninput==`function`}br=xr}else br=!1;yr=br&&(!document.documentMode||9<document.documentMode)}function Cr(){mr&&(mr.detachEvent(`onpropertychange`,wr),hr=mr=null)}function wr(e){if(e.propertyName===`value`&&_r(hr)){var t=[];pr(t,hr,e,un(e)),hn(gr,t)}}function Tr(e,t,n){e===`focusin`?(Cr(),mr=t,hr=n,mr.attachEvent(`onpropertychange`,wr)):e===`focusout`&&Cr()}function Er(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return _r(hr)}function Dr(e,t){if(e===`click`)return _r(t)}function Or(e,t){if(e===`input`||e===`change`)return _r(t)}function kr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Ar=typeof Object.is==`function`?Object.is:kr;function jr(e,t){if(Ar(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!ke.call(t,i)||!Ar(e[i],t[i]))return!1}return!0}function Mr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Nr(e,t){var n=Mr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Mr(n)}}function Pr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Pr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wt(e.document)}return t}function Ir(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Lr=_n&&`documentMode`in document&&11>=document.documentMode,Rr=null,zr=null,Br=null,Vr=!1;function Hr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Vr||Rr==null||Rr!==Wt(r)||(r=Rr,`selectionStart`in r&&Ir(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Br&&jr(Br,r)||(Br=r,r=Ed(zr,`onSelect`),0<r.length&&(t=new kn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Rr)))}function Ur(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Wr={animationend:Ur(`Animation`,`AnimationEnd`),animationiteration:Ur(`Animation`,`AnimationIteration`),animationstart:Ur(`Animation`,`AnimationStart`),transitionrun:Ur(`Transition`,`TransitionRun`),transitionstart:Ur(`Transition`,`TransitionStart`),transitioncancel:Ur(`Transition`,`TransitionCancel`),transitionend:Ur(`Transition`,`TransitionEnd`)},Gr={},Kr={};_n&&(Kr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Wr.animationend.animation,delete Wr.animationiteration.animation,delete Wr.animationstart.animation),`TransitionEvent`in window||delete Wr.transitionend.transition);function qr(e){if(Gr[e])return Gr[e];if(!Wr[e])return e;var t=Wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Kr)return Gr[e]=t[n];return e}var Jr=qr(`animationend`),Yr=qr(`animationiteration`),Xr=qr(`animationstart`),Zr=qr(`transitionrun`),Qr=qr(`transitionstart`),$r=qr(`transitioncancel`),ei=qr(`transitionend`),ti=new Map,ni=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ni.push(`scrollEnd`);function ri(e,t){ti.set(e,t),At(t,[e])}var ii=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ai=[],oi=0,si=0;function ci(){for(var e=oi,t=si=oi=0;t<e;){var n=ai[t];ai[t++]=null;var r=ai[t];ai[t++]=null;var i=ai[t];ai[t++]=null;var a=ai[t];if(ai[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&fi(n,i,a)}}function li(e,t,n,r){ai[oi++]=e,ai[oi++]=t,ai[oi++]=n,ai[oi++]=r,si|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function ui(e,t,n,r){return li(e,t,n,r),pi(e)}function di(e,t){return li(e,null,null,t),pi(e)}function fi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-Ke(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function pi(e){if(50<du)throw du=0,fu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var mi={};function hi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function gi(e,t,n,r){return new hi(e,t,n,r)}function _i(e){return e=e.prototype,!(!e||!e.isReactComponent)}function vi(e,t){var n=e.alternate;return n===null?(n=gi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function yi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function bi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)_i(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,k.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ie:return e=gi(31,n,t,a),e.elementType=ie,e.lanes=o,e;case y:return xi(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=gi(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case te:return e=gi(13,n,t,a),e.elementType=te,e.lanes=o,e;case ne:return e=gi(19,n,t,a),e.elementType=ne,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case S:s=10;break a;case ee:s=9;break a;case C:s=11;break a;case re:s=14;break a;case w:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=gi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function xi(e,t,n,r){return e=gi(7,e,r,t),e.lanes=n,e}function Si(e,t,n){return e=gi(6,e,null,t),e.lanes=n,e}function Ci(e){var t=gi(18,null,null,0);return t.stateNode=e,t}function wi(e,t,n){return t=gi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ti=new WeakMap;function Ei(e,t){if(typeof e==`object`&&e){var n=Ti.get(e);return n===void 0?(t={value:e,source:t,stack:Oe(t)},Ti.set(e,t),t):n}return{value:e,source:t,stack:Oe(t)}}var Di=[],Oi=0,ki=null,Ai=0,ji=[],Mi=0,Ni=null,Pi=1,Fi=``;function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ki,ki=e,Ai=t}function Li(e,t,n){ji[Mi++]=Pi,ji[Mi++]=Fi,ji[Mi++]=Ni,Ni=e;var r=Pi;e=Fi;var i=32-Ke(r)-1;r&=~(1<<i),n+=1;var a=32-Ke(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Pi=1<<32-Ke(t)+i|n<<i|r,Fi=a+e}else Pi=1<<a|n<<i|r,Fi=e}function Ri(e){e.return!==null&&(Ii(e,1),Li(e,1,0))}function zi(e){for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null;for(;e===Ni;)Ni=ji[--Mi],ji[Mi]=null,Fi=ji[--Mi],ji[Mi]=null,Pi=ji[--Mi],ji[Mi]=null}function Bi(e,t){ji[Mi++]=Pi,ji[Mi++]=Fi,ji[Mi++]=Ni,Pi=t.id,Fi=t.overflow,Ni=e}var Vi=null,j=null,M=!1,Hi=null,Ui=!1,Wi=Error(i(519));function Gi(e){throw Zi(Ei(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Wi}function Ki(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[ht]=e,t[gt]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Jt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),Qt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=cn),t=!0):t=!1,t||Gi(e,!0)}function qi(e){for(Vi=e.return;Vi;)switch(Vi.tag){case 5:case 31:case 13:Ui=!1;return;case 27:case 3:Ui=!0;return;default:Vi=Vi.return}}function Ji(e){if(e!==Vi)return!1;if(!M)return qi(e),M=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Ud(e.type,e.memoizedProps)),n=!n),n&&j&&Gi(e),qi(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));j=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));j=uf(e)}else t===27?(t=j,Zd(e.type)?(e=lf,lf=null,j=e):j=t):j=Vi?cf(e.stateNode.nextSibling):null;return!0}function Yi(){j=Vi=null,M=!1}function Xi(){var e=Hi;return e!==null&&(Zl===null?Zl=e:Zl.push.apply(Zl,e),Hi=null),e}function Zi(e){Hi===null?Hi=[e]:Hi.push(e)}var Qi=me(null),$i=null,ea=null;function ta(e,t,n){O(Qi,t._currentValue),t._currentValue=n}function na(e){e._currentValue=Qi.current,D(Qi)}function ra(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ia(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ra(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ra(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function aa(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Ar(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===_e.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&ia(t,e,n,r),t.flags|=262144}function oa(e){for(e=e.firstContext;e!==null;){if(!Ar(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function sa(e){$i=e,ea=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ca(e){return ua($i,e)}function la(e,t){return $i===null&&sa(e),ua(e,t)}function ua(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ea===null){if(e===null)throw Error(i(308));ea=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ea=ea.next=t;return n}var da=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},fa=t.unstable_scheduleCallback,pa=t.unstable_NormalPriority,N={$$typeof:S,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ma(){return{controller:new da,data:new Map,refCount:0}}function ha(e){e.refCount--,e.refCount===0&&fa(pa,function(){e.controller.abort()})}var ga=null,_a=0,va=0,ya=null;function ba(e,t){if(ga===null){var n=ga=[];_a=0,va=dd(),ya={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return _a++,t.then(xa,xa),t}function xa(){if(--_a===0&&ga!==null){ya!==null&&(ya.status=`fulfilled`);var e=ga;ga=null,va=0,ya=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Sa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ca=T.S;T.S=function(e,t){eu=Pe(),typeof t==`object`&&t&&typeof t.then==`function`&&ba(e,t),Ca!==null&&Ca(e,t)};var wa=me(null);function Ta(){var e=wa.current;return e===null?K.pooledCache:e}function Ea(e,t){t===null?O(wa,wa.current):O(wa,t.pool)}function Da(){var e=Ta();return e===null?null:{parent:N._currentValue,pool:e}}var Oa=Error(i(460)),ka=Error(i(474)),Aa=Error(i(542)),ja={then:function(){}};function Ma(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Na(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(cn,cn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,La(e),e;default:if(typeof t.status==`string`)t.then(cn,cn);else{if(e=K,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,La(e),e}throw Fa=t,Oa}}function Pa(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Fa=e,Oa):e}}var Fa=null;function Ia(){if(Fa===null)throw Error(i(459));var e=Fa;return Fa=null,e}function La(e){if(e===Oa||e===Aa)throw Error(i(483))}var Ra=null,za=0;function Ba(e){var t=za;return za+=1,Ra===null&&(Ra=[]),Na(Ra,e,t)}function Va(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Ha(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ua(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=vi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Si(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===w&&Pa(i)===t.type)?(t=a(t,n.props),Va(t,n),t.return=e,t):(t=bi(n.type,n.key,n.props,null,e.mode,r),Va(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=wi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=xi(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Si(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=bi(t.type,t.key,t.props,null,e.mode,n),Va(n,t),n.return=e,n;case v:return t=wi(t,e.mode,n),t.return=e,t;case w:return t=Pa(t),f(e,t,n)}if(ue(t)||se(t))return t=xi(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ba(t),n);if(t.$$typeof===S)return f(e,la(e,t),n);Ha(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case w:return n=Pa(n),p(e,t,n,r)}if(ue(n)||se(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ba(n),r);if(n.$$typeof===S)return p(e,t,la(e,n),r);Ha(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case w:return r=Pa(r),m(e,t,n,r,i)}if(ue(r)||se(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ba(r),i);if(r.$$typeof===S)return m(e,t,n,la(t,r),i);Ha(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),M&&Ii(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return M&&Ii(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),M&&Ii(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),M&&Ii(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return M&&Ii(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),M&&Ii(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===w&&Pa(l)===r.type){n(e,r.sibling),c=a(r,o.props),Va(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=xi(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=bi(o.type,o.key,o.props,null,e.mode,c),Va(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=wi(o,e.mode,c),c.return=e,e=c}return s(e);case w:return o=Pa(o),b(e,r,o,c)}if(ue(o))return h(e,r,o,c);if(se(o)){if(l=se(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ba(o),c);if(o.$$typeof===S)return b(e,r,la(e,o),c);Ha(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Si(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{za=0;var i=b(e,t,n,r);return Ra=null,i}catch(t){if(t===Oa||t===Aa)throw t;var a=gi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Wa=Ua(!0),Ga=Ua(!1),Ka=!1;function qa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ja(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ya(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,G&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=pi(e),fi(e,null,n),t}return li(e,r,t,n),pi(e)}function Za(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ct(e,n)}}function Qa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var $a=!1;function eo(){if($a){var e=ya;if(e!==null)throw e}}function to(e,t,n,r){$a=!1;var i=e.updateQueue;Ka=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(J&f)===f:(r&f)===f){f!==0&&f===va&&($a=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:Ka=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Gl|=o,e.lanes=o,e.memoizedState=d}}function no(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function ro(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)no(n[e],t)}var io=me(null),ao=me(0);function oo(e,t){e=Wl,O(ao,e),O(io,t),Wl=e|t.baseLanes}function so(){O(ao,Wl),O(io,io.current)}function co(){Wl=ao.current,D(io),D(ao)}var lo=me(null),uo=null;function fo(e){var t=e.alternate;O(P,P.current&1),O(lo,e),uo===null&&(t===null||io.current!==null||t.memoizedState!==null)&&(uo=e)}function po(e){O(P,P.current),O(lo,e),uo===null&&(uo=e)}function mo(e){e.tag===22?(O(P,P.current),O(lo,e),uo===null&&(uo=e)):ho(e)}function ho(){O(P,P.current),O(lo,lo.current)}function go(e){D(lo),uo===e&&(uo=null),D(P)}var P=me(0);function _o(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var vo=0,F=null,I=null,L=null,yo=!1,bo=!1,xo=!1,So=0,Co=0,wo=null,To=0;function R(){throw Error(i(321))}function Eo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ar(e[n],t[n]))return!1;return!0}function Do(e,t,n,r,i,a){return vo=a,F=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,T.H=e===null||e.memoizedState===null?Us:Ws,xo=!1,a=n(r,i),xo=!1,bo&&(a=ko(t,n,r,i)),Oo(e),a}function Oo(e){T.H=Hs;var t=I!==null&&I.next!==null;if(vo=0,L=I=F=null,yo=!1,Co=0,wo=null,t)throw Error(i(300));e===null||B||(e=e.dependencies,e!==null&&oa(e)&&(B=!0))}function ko(e,t,n,r){F=e;var a=0;do{if(bo&&(wo=null),Co=0,bo=!1,25<=a)throw Error(i(301));if(a+=1,L=I=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}T.H=Gs,o=t(n,r)}while(bo);return o}function Ao(){var e=T.H,t=e.useState()[0];return t=typeof t.then==`function`?Io(t):t,e=e.useState()[0],(I===null?null:I.memoizedState)!==e&&(F.flags|=1024),t}function jo(){var e=So!==0;return So=0,e}function Mo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function No(e){if(yo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}yo=!1}vo=0,L=I=F=null,bo=!1,Co=So=0,wo=null}function Po(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return L===null?F.memoizedState=L=e:L=L.next=e,L}function z(){if(I===null){var e=F.alternate;e=e===null?null:e.memoizedState}else e=I.next;var t=L===null?F.memoizedState:L.next;if(t!==null)L=t,I=e;else{if(e===null)throw F.alternate===null?Error(i(467)):Error(i(310));I=e,e={memoizedState:I.memoizedState,baseState:I.baseState,baseQueue:I.baseQueue,queue:I.queue,next:null},L===null?F.memoizedState=L=e:L=L.next=e}return L}function Fo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Io(e){var t=Co;return Co+=1,wo===null&&(wo=[]),e=Na(wo,e,t),t=F,(L===null?t.memoizedState:L.next)===null&&(t=t.alternate,T.H=t===null||t.memoizedState===null?Us:Ws),e}function Lo(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Io(e);if(e.$$typeof===S)return ca(e)}throw Error(i(438,String(e)))}function Ro(e){var t=null,n=F.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=F.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Fo(),F.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ae;return t.index++,n}function zo(e,t){return typeof t==`function`?t(e):t}function Bo(e){return Vo(z(),I,e)}function Vo(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(vo&f)===f:(J&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===va&&(d=!0);else if((vo&p)===p){u=u.next,p===va&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,F.lanes|=p,Gl|=p;f=u.action,xo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,F.lanes|=f,Gl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Ar(o,e.memoizedState)&&(B=!0,d&&(n=ya,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Ho(e){var t=z(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Ar(o,t.memoizedState)||(B=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Uo(e,t,n){var r=F,a=z(),o=M;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Ar((I||a).memoizedState,n);if(s&&(a.memoizedState=n,B=!0),a=a.queue,ms(Ko.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||L!==null&&L.memoizedState.tag&1){if(r.flags|=2048,ls(9,{destroy:void 0},Go.bind(null,r,a,n,t),null),K===null)throw Error(i(349));o||vo&127||Wo(r,t,n)}return n}function Wo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=F.updateQueue,t===null?(t=Fo(),F.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Go(e,t,n,r){t.value=n,t.getSnapshot=r,qo(t)&&Jo(e)}function Ko(e,t,n){return n(function(){qo(t)&&Jo(e)})}function qo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ar(e,n)}catch{return!0}}function Jo(e){var t=di(e,2);t!==null&&hu(t,e,2)}function Yo(e){var t=Po();if(typeof e==`function`){var n=e;if(e=n(),xo){Ge(!0);try{n()}finally{Ge(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:e},t}function Xo(e,t,n,r){return e.baseState=n,Vo(e,I,typeof r==`function`?r:zo)}function Zo(e,t,n,r,a){if(zs(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};T.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Qo(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Qo(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=T.T,o={};T.T=o;try{var s=n(i,r),c=T.S;c!==null&&c(o,s),$o(e,t,s)}catch(n){ts(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),T.T=a}}else try{a=n(i,r),$o(e,t,a)}catch(n){ts(e,t,n)}}function $o(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){es(e,t,n)},function(n){return ts(e,t,n)}):es(e,t,n)}function es(e,t,n){t.status=`fulfilled`,t.value=n,ns(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Qo(e,n)))}function ts(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,ns(t),t=t.next;while(t!==r)}e.action=null}function ns(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function rs(e,t){return t}function is(e,t){if(M){var n=K.formState;if(n!==null){a:{var r=F;if(M){if(j){b:{for(var i=j,a=Ui;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){j=cf(i.nextSibling),r=i.data===`F!`;break a}}Gi(r)}r=!1}r&&(t=n[0])}}return n=Po(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rs,lastRenderedState:t},n.queue=r,n=Is.bind(null,F,r),r.dispatch=n,r=Yo(!1),a=Rs.bind(null,F,!1,r.queue),r=Po(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Zo.bind(null,F,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function as(e){return os(z(),I,e)}function os(e,t,n){if(t=Vo(e,t,rs)[0],e=Bo(zo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Io(t)}catch(e){throw e===Oa?Aa:e}else r=t;t=z();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(F.flags|=2048,ls(9,{destroy:void 0},ss.bind(null,i,n),null)),[r,a,e]}function ss(e,t){e.action=t}function cs(e){var t=z(),n=I;if(n!==null)return os(t,n,e);z(),t=t.memoizedState,n=z();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ls(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=F.updateQueue,t===null&&(t=Fo(),F.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function us(){return z().memoizedState}function ds(e,t,n,r){var i=Po();F.flags|=e,i.memoizedState=ls(1|t,{destroy:void 0},n,r===void 0?null:r)}function fs(e,t,n,r){var i=z();r=r===void 0?null:r;var a=i.memoizedState.inst;I!==null&&r!==null&&Eo(r,I.memoizedState.deps)?i.memoizedState=ls(t,a,n,r):(F.flags|=e,i.memoizedState=ls(1|t,a,n,r))}function ps(e,t){ds(8390656,8,e,t)}function ms(e,t){fs(2048,8,e,t)}function hs(e){F.flags|=4;var t=F.updateQueue;if(t===null)t=Fo(),F.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function gs(e){var t=z().memoizedState;return hs({ref:t,nextImpl:e}),function(){if(G&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function _s(e,t){return fs(4,2,e,t)}function vs(e,t){return fs(4,4,e,t)}function ys(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function bs(e,t,n){n=n==null?null:n.concat([e]),fs(4,4,ys.bind(null,t,e),n)}function xs(){}function Ss(e,t){var n=z();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Eo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Cs(e,t){var n=z();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Eo(t,r[1]))return r[0];if(r=e(),xo){Ge(!0);try{e()}finally{Ge(!1)}}return n.memoizedState=[r,t],r}function ws(e,t,n){return n===void 0||vo&1073741824&&!(J&261930)?e.memoizedState=t:(e.memoizedState=n,e=mu(),F.lanes|=e,Gl|=e,n)}function Ts(e,t,n,r){return Ar(n,t)?n:io.current===null?!(vo&42)||vo&1073741824&&!(J&261930)?(B=!0,e.memoizedState=n):(e=mu(),F.lanes|=e,Gl|=e,t):(e=ws(e,n,r),Ar(e,t)||(B=!0),e)}function Es(e,t,n,r,i){var a=E.p;E.p=a!==0&&8>a?a:8;var o=T.T,s={};T.T=s,Rs(e,!1,t,n);try{var c=i(),l=T.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Ls(e,t,Sa(c,r),pu(e)):Ls(e,t,r,pu(e))}catch(n){Ls(e,t,{then:function(){},status:`rejected`,reason:n},pu())}finally{E.p=a,o!==null&&s.types!==null&&(o.types=s.types),T.T=o}}function Ds(){}function Os(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=ks(e).queue;Es(e,a,t,de,n===null?Ds:function(){return As(e),n(r)})}function ks(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:de,baseState:de,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:de},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:zo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function As(e){var t=ks(e);t.next===null&&(t=e.alternate.memoizedState),Ls(e,t.next.queue,{},pu())}function js(){return ca(Qf)}function Ms(){return z().memoizedState}function Ns(){return z().memoizedState}function Ps(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=pu();e=Ya(n);var r=Xa(t,e,n);r!==null&&(hu(r,t,n),Za(r,t,n)),t={cache:ma()},e.payload=t;return}t=t.return}}function Fs(e,t,n){var r=pu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},zs(e)?Bs(t,n):(n=ui(e,t,n,r),n!==null&&(hu(n,e,r),Vs(n,t,r)))}function Is(e,t,n){Ls(e,t,n,pu())}function Ls(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(zs(e))Bs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ar(s,o))return li(e,t,i,0),K===null&&ci(),!1}catch{}if(n=ui(e,t,i,r),n!==null)return hu(n,e,r),Vs(n,t,r),!0}return!1}function Rs(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},zs(e)){if(t)throw Error(i(479))}else t=ui(e,n,r,2),t!==null&&hu(t,e,2)}function zs(e){var t=e.alternate;return e===F||t!==null&&t===F}function Bs(e,t){bo=yo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Vs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ct(e,n)}}var Hs={readContext:ca,use:Lo,useCallback:R,useContext:R,useEffect:R,useImperativeHandle:R,useLayoutEffect:R,useInsertionEffect:R,useMemo:R,useReducer:R,useRef:R,useState:R,useDebugValue:R,useDeferredValue:R,useTransition:R,useSyncExternalStore:R,useId:R,useHostTransitionStatus:R,useFormState:R,useActionState:R,useOptimistic:R,useMemoCache:R,useCacheRefresh:R};Hs.useEffectEvent=R;var Us={readContext:ca,use:Lo,useCallback:function(e,t){return Po().memoizedState=[e,t===void 0?null:t],e},useContext:ca,useEffect:ps,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ds(4194308,4,ys.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ds(4194308,4,e,t)},useInsertionEffect:function(e,t){ds(4,2,e,t)},useMemo:function(e,t){var n=Po();t=t===void 0?null:t;var r=e();if(xo){Ge(!0);try{e()}finally{Ge(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Po();if(n!==void 0){var i=n(t);if(xo){Ge(!0);try{n(t)}finally{Ge(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Fs.bind(null,F,e),[r.memoizedState,e]},useRef:function(e){var t=Po();return e={current:e},t.memoizedState=e},useState:function(e){e=Yo(e);var t=e.queue,n=Is.bind(null,F,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:xs,useDeferredValue:function(e,t){return ws(Po(),e,t)},useTransition:function(){var e=Yo(!1);return e=Es.bind(null,F,e.queue,!0,!1),Po().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=F,a=Po();if(M){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),K===null)throw Error(i(349));J&127||Wo(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ps(Ko.bind(null,r,o,e),[e]),r.flags|=2048,ls(9,{destroy:void 0},Go.bind(null,r,o,n,t),null),n},useId:function(){var e=Po(),t=K.identifierPrefix;if(M){var n=Fi,r=Pi;n=(r&~(1<<32-Ke(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=So++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=To++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:js,useFormState:is,useActionState:is,useOptimistic:function(e){var t=Po();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Rs.bind(null,F,!0,n),n.dispatch=t,[e,t]},useMemoCache:Ro,useCacheRefresh:function(){return Po().memoizedState=Ps.bind(null,F)},useEffectEvent:function(e){var t=Po(),n={impl:e};return t.memoizedState=n,function(){if(G&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Ws={readContext:ca,use:Lo,useCallback:Ss,useContext:ca,useEffect:ms,useImperativeHandle:bs,useInsertionEffect:_s,useLayoutEffect:vs,useMemo:Cs,useReducer:Bo,useRef:us,useState:function(){return Bo(zo)},useDebugValue:xs,useDeferredValue:function(e,t){return Ts(z(),I.memoizedState,e,t)},useTransition:function(){var e=Bo(zo)[0],t=z().memoizedState;return[typeof e==`boolean`?e:Io(e),t]},useSyncExternalStore:Uo,useId:Ms,useHostTransitionStatus:js,useFormState:as,useActionState:as,useOptimistic:function(e,t){return Xo(z(),I,e,t)},useMemoCache:Ro,useCacheRefresh:Ns};Ws.useEffectEvent=gs;var Gs={readContext:ca,use:Lo,useCallback:Ss,useContext:ca,useEffect:ms,useImperativeHandle:bs,useInsertionEffect:_s,useLayoutEffect:vs,useMemo:Cs,useReducer:Ho,useRef:us,useState:function(){return Ho(zo)},useDebugValue:xs,useDeferredValue:function(e,t){var n=z();return I===null?ws(n,e,t):Ts(n,I.memoizedState,e,t)},useTransition:function(){var e=Ho(zo)[0],t=z().memoizedState;return[typeof e==`boolean`?e:Io(e),t]},useSyncExternalStore:Uo,useId:Ms,useHostTransitionStatus:js,useFormState:cs,useActionState:cs,useOptimistic:function(e,t){var n=z();return I===null?(n.baseState=e,[e,n.queue.dispatch]):Xo(n,I,e,t)},useMemoCache:Ro,useCacheRefresh:Ns};Gs.useEffectEvent=gs;function Ks(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var qs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ya(r);i.payload=t,n!=null&&(i.callback=n),t=Xa(e,i,r),t!==null&&(hu(t,e,r),Za(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ya(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Xa(e,i,r),t!==null&&(hu(t,e,r),Za(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pu(),r=Ya(n);r.tag=2,t!=null&&(r.callback=t),t=Xa(e,r,n),t!==null&&(hu(t,e,n),Za(t,e,n))}};function Js(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!jr(n,r)||!jr(i,a):!0}function Ys(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&qs.enqueueReplaceState(t,t.state,null)}function Xs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Zs(e){ii(e)}function Qs(e){console.error(e)}function $s(e){ii(e)}function ec(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function tc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function nc(e,t,n){return n=Ya(n),n.tag=3,n.payload={element:null},n.callback=function(){ec(e,t)},n}function rc(e){return e=Ya(e),e.tag=3,e}function ic(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){tc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){tc(t,n,r),typeof i!=`function`&&(ru===null?ru=new Set([this]):ru.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function ac(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&aa(t,n,a,!0),n=lo.current,n!==null){switch(n.tag){case 31:case 13:return uo===null?Du():n.alternate===null&&X===0&&(X=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===ja?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Gu(e,r,a)),!1;case 22:return n.flags|=65536,r===ja?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Gu(e,r,a)),!1}throw Error(i(435,n.tag))}return Gu(e,r,a),Du(),!1}if(M)return t=lo.current,t===null?(r!==Wi&&(t=Error(i(423),{cause:r}),Zi(Ei(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Ei(r,n),a=nc(e.stateNode,r,a),Qa(e,a),X!==4&&(X=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Wi&&(e=Error(i(422),{cause:r}),Zi(Ei(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Ei(o,n),Xl===null?Xl=[o]:Xl.push(o),X!==4&&(X=2),t===null)return!0;r=Ei(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=nc(n.stateNode,r,e),Qa(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(ru===null||!ru.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=rc(a),ic(a,e,n,r),Qa(n,a),!1}n=n.return}while(n!==null);return!1}var oc=Error(i(461)),B=!1;function sc(e,t,n,r){t.child=e===null?Ga(t,null,n,r):Wa(t,e.child,n,r)}function cc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return sa(t),r=Do(e,t,n,o,a,i),s=jo(),e!==null&&!B?(Mo(e,t,i),Mc(e,t,i)):(M&&s&&Ri(t),t.flags|=1,sc(e,t,r,i),t.child)}function lc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!_i(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,uc(e,t,a,r,i)):(e=bi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Nc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?jr:n,n(o,r)&&e.ref===t.ref)return Mc(e,t,i)}return t.flags|=1,e=vi(a,r),e.ref=t.ref,e.return=t,t.child=e}function uc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(jr(a,r)&&e.ref===t.ref)if(B=!1,t.pendingProps=r=a,Nc(e,i))e.flags&131072&&(B=!0);else return t.lanes=e.lanes,Mc(e,t,i)}return vc(e,t,n,r,i)}function dc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return pc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ea(t,a===null?null:a.cachePool),a===null?so():oo(t,a),mo(t);else return r=t.lanes=536870912,pc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ea(t,null),so(),ho(t)):(Ea(t,a.cachePool),oo(t,a),ho(t),t.memoizedState=null);return sc(e,t,i,n),t.child}function fc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function pc(e,t,n,r,i){var a=Ta();return a=a===null?null:{parent:N._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ea(t,null),so(),mo(t),e!==null&&aa(e,t,r,!0),t.childLanes=i,null}function mc(e,t){return t=Dc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function hc(e,t,n){return Wa(t,e.child,null,n),e=mc(t,t.pendingProps),e.flags|=2,go(t),t.memoizedState=null,e}function gc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(M){if(r.mode===`hidden`)return e=mc(t,r),t.lanes=536870912,fc(null,e);if(po(t),(e=j)?(e=rf(e,Ui),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ni===null?null:{id:Pi,overflow:Fi},retryLane:536870912,hydrationErrors:null},n=Ci(e),n.return=t,t.child=n,Vi=t,j=null)):e=null,e===null)throw Gi(t);return t.lanes=536870912,null}return mc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(po(t),a)if(t.flags&256)t.flags&=-257,t=hc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(B||aa(e,t,n,!1),a=(n&e.childLanes)!==0,B||a){if(r=K,r!==null&&(s=lt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,di(e,s),hu(r,e,s),oc;Du(),t=hc(e,t,n)}else e=o.treeContext,j=cf(s.nextSibling),Vi=t,M=!0,Hi=null,Ui=!1,e!==null&&Bi(t,e),t=mc(t,r),t.flags|=4096;return t}return e=vi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function _c(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function vc(e,t,n,r,i){return sa(t),n=Do(e,t,n,r,void 0,i),r=jo(),e!==null&&!B?(Mo(e,t,i),Mc(e,t,i)):(M&&r&&Ri(t),t.flags|=1,sc(e,t,n,i),t.child)}function yc(e,t,n,r,i,a){return sa(t),t.updateQueue=null,n=ko(t,r,n,i),Oo(e),r=jo(),e!==null&&!B?(Mo(e,t,a),Mc(e,t,a)):(M&&r&&Ri(t),t.flags|=1,sc(e,t,n,a),t.child)}function bc(e,t,n,r,i){if(sa(t),t.stateNode===null){var a=mi,o=n.contextType;typeof o==`object`&&o&&(a=ca(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=qs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},qa(t),o=n.contextType,a.context=typeof o==`object`&&o?ca(o):mi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Ks(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&qs.enqueueReplaceState(a,a.state,null),to(t,r,a,i),eo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Xs(n,s);a.props=c;var l=a.context,u=n.contextType;o=mi,typeof u==`object`&&u&&(o=ca(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Ys(t,a,r,o),Ka=!1;var f=t.memoizedState;a.state=f,to(t,r,a,i),eo(),l=t.memoizedState,s||f!==l||Ka?(typeof d==`function`&&(Ks(t,n,d,r),l=t.memoizedState),(c=Ka||Js(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ja(e,t),o=t.memoizedProps,u=Xs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=mi,typeof l==`object`&&l&&(c=ca(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Ys(t,a,r,c),Ka=!1,f=t.memoizedState,a.state=f,to(t,r,a,i),eo();var p=t.memoizedState;o!==d||f!==p||Ka||e!==null&&e.dependencies!==null&&oa(e.dependencies)?(typeof s==`function`&&(Ks(t,n,s,r),p=t.memoizedState),(u=Ka||Js(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&oa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,_c(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Wa(t,e.child,null,i),t.child=Wa(t,null,n,i)):sc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Mc(e,t,i),e}function xc(e,t,n,r){return Yi(),t.flags|=256,sc(e,t,n,r),t.child}var Sc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Cc(e){return{baseLanes:e,cachePool:Da()}}function wc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Jl),e}function Tc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(P.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(M){if(a?fo(t):ho(t),(e=j)?(e=rf(e,Ui),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ni===null?null:{id:Pi,overflow:Fi},retryLane:536870912,hydrationErrors:null},n=Ci(e),n.return=t,t.child=n,Vi=t,j=null)):e=null,e===null)throw Gi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(ho(t),a=t.mode,c=Dc({mode:`hidden`,children:c},a),r=xi(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Cc(n),r.childLanes=wc(e,s,n),t.memoizedState=Sc,fc(null,r)):(fo(t),Ec(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(fo(t),t.flags&=-257,t=Oc(e,t,n)):t.memoizedState===null?(ho(t),c=r.fallback,a=t.mode,r=Dc({mode:`visible`,children:r.children},a),c=xi(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Wa(t,e.child,null,n),r=t.child,r.memoizedState=Cc(n),r.childLanes=wc(e,s,n),t.memoizedState=Sc,t=fc(null,r)):(ho(t),t.child=e.child,t.flags|=128,t=null);else if(fo(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Zi({value:r,source:null,stack:null}),t=Oc(e,t,n)}else if(B||aa(e,t,n,!1),s=(n&e.childLanes)!==0,B||s){if(s=K,s!==null&&(r=lt(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,di(e,r),hu(s,e,r),oc;af(c)||Du(),t=Oc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,j=cf(c.nextSibling),Vi=t,M=!0,Hi=null,Ui=!1,e!==null&&Bi(t,e),t=Ec(t,r.children),t.flags|=4096);return t}return a?(ho(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=vi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=xi(c,a,n,null),c.flags|=2):c=vi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,fc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Cc(n):(a=c.cachePool,a===null?a=Da():(l=N._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=wc(e,s,n),t.memoizedState=Sc,fc(e.child,r)):(fo(t),n=e.child,e=n.sibling,n=vi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Ec(e,t){return t=Dc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Dc(e,t){return e=gi(22,e,null,t),e.lanes=0,e}function Oc(e,t,n){return Wa(t,e.child,null,n),e=Ec(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function kc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ra(e.return,t,n)}function Ac(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function jc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=P.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,O(P,o),sc(e,t,r,n),r=M?Ai:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&kc(e,n,t);else if(e.tag===19)kc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&_o(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Ac(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&_o(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Ac(t,!0,n,null,a,r);break;case`together`:Ac(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Mc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Gl|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(aa(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=vi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Nc(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&oa(e))):!0}function Pc(e,t,n){switch(t.tag){case 3:ve(t,t.stateNode.containerInfo),ta(t,N,e.memoizedState.cache),Yi();break;case 27:case 5:be(t);break;case 4:ve(t,t.stateNode.containerInfo);break;case 10:ta(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,po(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(fo(t),e=Mc(e,t,n),e===null?null:e.sibling):Tc(e,t,n):(fo(t),t.flags|=128,null);fo(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(aa(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return jc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),O(P,P.current),r)break;return null;case 22:return t.lanes=0,dc(e,t,n,t.pendingProps);case 24:ta(t,N,e.memoizedState.cache)}return Mc(e,t,n)}function Fc(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)B=!0;else{if(!Nc(e,n)&&!(t.flags&128))return B=!1,Pc(e,t,n);B=!!(e.flags&131072)}else B=!1,M&&t.flags&1048576&&Li(t,Ai,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Pa(t.elementType),t.type=e,typeof e==`function`)_i(e)?(r=Xs(e,r),t.tag=1,t=bc(null,t,e,r,n)):(t.tag=0,t=vc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===C){t.tag=11,t=cc(null,t,e,r,n);break a}else if(a===re){t.tag=14,t=lc(null,t,e,r,n);break a}}throw t=le(e)||e,Error(i(306,t,``))}}return t;case 0:return vc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Xs(r,t.pendingProps),bc(e,t,r,a,n);case 3:a:{if(ve(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Ja(e,t),to(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ta(t,N,r),r!==o.cache&&ia(t,[N],n,!0),eo(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=xc(e,t,r,n);break a}else if(r!==a){a=Ei(Error(i(424)),t),Zi(a),t=xc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(j=cf(e.firstChild),Vi=t,M=!0,Hi=null,Ui=!0,n=Ga(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Yi(),r===a){t=Mc(e,t,n);break a}sc(e,t,r,n)}t=t.child}return t;case 26:return _c(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:M||(n=t.type,e=t.pendingProps,r=Bd(ge.current).createElement(n),r[ht]=t,r[gt]=e,Pd(r,n,e),A(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return be(t),e===null&&M&&(r=t.stateNode=ff(t.type,t.pendingProps,ge.current),Vi=t,Ui=!0,a=j,Zd(t.type)?(lf=a,j=cf(r.firstChild)):j=a),sc(e,t,t.pendingProps.children,n),_c(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&M&&((a=r=j)&&(r=tf(r,t.type,t.pendingProps,Ui),r===null?a=!1:(t.stateNode=r,Vi=t,j=cf(r.firstChild),Ui=!1,a=!0)),a||Gi(t)),be(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Do(e,t,Ao,null,null,n),Qf._currentValue=a),_c(e,t),sc(e,t,r,n),t.child;case 6:return e===null&&M&&((e=n=j)&&(n=nf(n,t.pendingProps,Ui),n===null?e=!1:(t.stateNode=n,Vi=t,j=null,e=!0)),e||Gi(t)),null;case 13:return Tc(e,t,n);case 4:return ve(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Wa(t,null,r,n):sc(e,t,r,n),t.child;case 11:return cc(e,t,t.type,t.pendingProps,n);case 7:return sc(e,t,t.pendingProps,n),t.child;case 8:return sc(e,t,t.pendingProps.children,n),t.child;case 12:return sc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,ta(t,t.type,r.value),sc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,sa(t),a=ca(a),r=r(a),t.flags|=1,sc(e,t,r,n),t.child;case 14:return lc(e,t,t.type,t.pendingProps,n);case 15:return uc(e,t,t.type,t.pendingProps,n);case 19:return jc(e,t,n);case 31:return gc(e,t,n);case 22:return dc(e,t,n,t.pendingProps);case 24:return sa(t),r=ca(N),e===null?(a=Ta(),a===null&&(a=K,o=ma(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},qa(t),ta(t,N,a)):((e.lanes&n)!==0&&(Ja(e,t),to(t,null,null,n),eo()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,ta(t,N,r),r!==a.cache&&ia(t,[N],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ta(t,N,r))),sc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Ic(e){e.flags|=4}function Lc(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(wu())e.flags|=8192;else throw Fa=ja,ka}else e.flags&=-16777217}function Rc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(wu())e.flags|=8192;else throw Fa=ja,ka}function zc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:rt(),e.lanes|=t,Yl|=t)}function Bc(e,t){if(!M)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function V(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Vc(e,t,n){var r=t.pendingProps;switch(zi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return V(t),null;case 1:return V(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),na(N),ye(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Ji(t)?Ic(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Xi())),V(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Ic(t),o===null?(V(t),Lc(t,a,null,r,n)):(V(t),Rc(t,o))):o?o===e.memoizedState?(V(t),t.flags&=-16777217):(Ic(t),V(t),Rc(t,o)):(e=e.memoizedProps,e!==r&&Ic(t),V(t),Lc(t,a,e,r,n)),null;case 27:if(xe(t),n=ge.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return V(t),null}e=k.current,Ji(t)?Ki(t,e):(e=ff(a,r,n),t.stateNode=e,Ic(t))}return V(t),null;case 5:if(xe(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return V(t),null}if(o=k.current,Ji(t))Ki(t,o);else{var s=Bd(ge.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[ht]=t,o[gt]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Ic(t)}}return V(t),Lc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=ge.current,Ji(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=Vi,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[ht]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Gi(t,!0)}else e=Bd(e).createTextNode(r),e[ht]=t,t.stateNode=e}return V(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Ji(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[ht]=t}else Yi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),e=!1}else n=Xi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(go(t),t):(go(t),null);if(t.flags&128)throw Error(i(558))}return V(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Ji(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[ht]=t}else Yi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),a=!1}else a=Xi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(go(t),t):(go(t),null)}return go(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),zc(t,t.updateQueue),V(t),null);case 4:return ye(),e===null&&Sd(t.stateNode.containerInfo),V(t),null;case 10:return na(t.type),V(t),null;case 19:if(D(P),r=t.memoizedState,r===null)return V(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)Bc(r,!1);else{if(X!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=_o(e),o!==null){for(t.flags|=128,Bc(r,!1),e=o.updateQueue,t.updateQueue=e,zc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)yi(n,e),n=n.sibling;return O(P,P.current&1|2),M&&Ii(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Pe()>tu&&(t.flags|=128,a=!0,Bc(r,!1),t.lanes=4194304)}else{if(!a)if(e=_o(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,zc(t,e),Bc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!M)return V(t),null}else 2*Pe()-r.renderingStartTime>tu&&n!==536870912&&(t.flags|=128,a=!0,Bc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(V(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Pe(),e.sibling=null,n=P.current,O(P,a?n&1|2:n&1),M&&Ii(t,r.treeForkCount),e);case 22:case 23:return go(t),co(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(V(t),t.subtreeFlags&6&&(t.flags|=8192)):V(t),n=t.updateQueue,n!==null&&zc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&D(wa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),na(N),V(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Hc(e,t){switch(zi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return na(N),ye(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return xe(t),null;case 31:if(t.memoizedState!==null){if(go(t),t.alternate===null)throw Error(i(340));Yi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(go(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Yi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(P),null;case 4:return ye(),null;case 10:return na(t.type),null;case 22:case 23:return go(t),co(),e!==null&&D(wa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return na(N),null;case 25:return null;default:return null}}function Uc(e,t){switch(zi(t),t.tag){case 3:na(N),ye();break;case 26:case 27:case 5:xe(t);break;case 4:ye();break;case 31:t.memoizedState!==null&&go(t);break;case 13:go(t);break;case 19:D(P);break;case 10:na(t.type);break;case 22:case 23:go(t),co(),e!==null&&D(wa);break;case 24:na(N)}}function Wc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Gc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Kc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ro(t,n)}catch(t){Z(e,e.return,t)}}}function qc(e,t,n){n.props=Xs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Jc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Yc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}function Xc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Zc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[gt]=t}catch(t){Z(e,e.return,t)}}function Qc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function $c(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Qc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function el(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=cn));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(el(e,t,n),e=e.sibling;e!==null;)el(e,t,n),e=e.sibling}function tl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(tl(e,t,n),e=e.sibling;e!==null;)tl(e,t,n),e=e.sibling}function nl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[ht]=e,t[gt]=n}catch(t){Z(e,e.return,t)}}var rl=!1,H=!1,il=!1,al=typeof WeakSet==`function`?WeakSet:Set,U=null;function ol(e,t){if(e=e.containerInfo,Rd=sp,e=Fr(e),Ir(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,U=t;U!==null;)if(t=U,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,U=e;else for(;U!==null;){switch(t=U,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Xs(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Z(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,U=e;break}U=t.return}}function sl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:xl(e,n),r&4&&Wc(5,n);break;case 1:if(xl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Xs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}r&64&&Kc(n),r&512&&Jc(n,n.return);break;case 3:if(xl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ro(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&nl(n);case 26:case 5:xl(e,n),t===null&&r&4&&Xc(n),r&512&&Jc(n,n.return);break;case 12:xl(e,n);break;case 31:xl(e,n),r&4&&fl(e,n);break;case 13:xl(e,n),r&4&&pl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ju.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||rl,!r){t=t!==null&&t.memoizedState!==null||H,i=rl;var a=H;rl=r,(H=t)&&!a?Cl(e,n,(n.subtreeFlags&8772)!=0):xl(e,n),rl=i,H=a}break;case 30:break;default:xl(e,n)}}function cl(e){var t=e.alternate;t!==null&&(e.alternate=null,cl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Ct(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var W=null,ll=!1;function ul(e,t,n){for(n=n.child;n!==null;)dl(e,t,n),n=n.sibling}function dl(e,t,n){if(We&&typeof We.onCommitFiberUnmount==`function`)try{We.onCommitFiberUnmount(Ue,n)}catch{}switch(n.tag){case 26:H||Yc(n,t),ul(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:H||Yc(n,t);var r=W,i=ll;Zd(n.type)&&(W=n.stateNode,ll=!1),ul(e,t,n),pf(n.stateNode),W=r,ll=i;break;case 5:H||Yc(n,t);case 6:if(r=W,i=ll,W=null,ul(e,t,n),W=r,ll=i,W!==null)if(ll)try{(W.nodeType===9?W.body:W.nodeName===`HTML`?W.ownerDocument.body:W).removeChild(n.stateNode)}catch(e){Z(n,t,e)}else try{W.removeChild(n.stateNode)}catch(e){Z(n,t,e)}break;case 18:W!==null&&(ll?(e=W,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(W,n.stateNode));break;case 4:r=W,i=ll,W=n.stateNode.containerInfo,ll=!0,ul(e,t,n),W=r,ll=i;break;case 0:case 11:case 14:case 15:Gc(2,n,t),H||Gc(4,n,t),ul(e,t,n);break;case 1:H||(Yc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&qc(n,t,r)),ul(e,t,n);break;case 21:ul(e,t,n);break;case 22:H=(r=H)||n.memoizedState!==null,ul(e,t,n),H=r;break;default:ul(e,t,n)}}function fl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Z(t,t.return,e)}}}function pl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Z(t,t.return,e)}}function ml(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new al),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new al),t;default:throw Error(i(435,e.tag))}}function hl(e,t){var n=ml(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Yu.bind(null,e,t);t.then(r,r)}})}function gl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){W=c.stateNode,ll=!1;break a}break;case 5:W=c.stateNode,ll=!1;break a;case 3:case 4:W=c.stateNode.containerInfo,ll=!0;break a}c=c.return}if(W===null)throw Error(i(160));dl(o,s,a),W=null,ll=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)vl(t,e),t=t.sibling}var _l=null;function vl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:gl(t,e),yl(e),r&4&&(Gc(3,e,e.return),Wc(3,e),Gc(5,e,e.return));break;case 1:gl(t,e),yl(e),r&512&&(H||n===null||Yc(n,n.return)),r&64&&rl&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=_l;if(gl(t,e),yl(e),r&512&&(H||n===null||Yc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[St]||o[ht]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Pd(o,r,n),o[ht]=e,A(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[ht]=e,A(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&Zc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:gl(t,e),yl(e),r&512&&(H||n===null||Yc(n,n.return)),n!==null&&r&4&&Zc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(gl(t,e),yl(e),r&512&&(H||n===null||Yc(n,n.return)),e.flags&32){a=e.stateNode;try{$t(a,``)}catch(t){Z(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,Zc(e,a,n===null?a:n.memoizedProps)),r&1024&&(il=!0);break;case 6:if(gl(t,e),yl(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Z(e,e.return,t)}}break;case 3:if(Bf=null,a=_l,_l=gf(t.containerInfo),gl(t,e),_l=a,yl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Z(e,e.return,t)}il&&(il=!1,bl(e));break;case 4:r=_l,_l=gf(e.stateNode.containerInfo),gl(t,e),yl(e),_l=r;break;case 12:gl(t,e),yl(e);break;case 31:gl(t,e),yl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,hl(e,r)));break;case 13:gl(t,e),yl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&($l=Pe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,hl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=rl,d=H;if(rl=u||a,H=d||l,gl(t,e),H=d,rl=u,yl(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||rl||H||Sl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Z(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){Z(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){Z(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,hl(e,n))));break;case 19:gl(t,e),yl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,hl(e,r)));break;case 30:break;case 21:break;default:gl(t,e),yl(e)}}function yl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Qc(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;tl(e,$c(e),a);break;case 5:var o=n.stateNode;n.flags&32&&($t(o,``),n.flags&=-33),tl(e,$c(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;el(e,$c(e),s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function bl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;bl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function xl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)sl(e,t.alternate,t),t=t.sibling}function Sl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gc(4,t,t.return),Sl(t);break;case 1:Yc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&qc(t,t.return,n),Sl(t);break;case 27:pf(t.stateNode);case 26:case 5:Yc(t,t.return),Sl(t);break;case 22:t.memoizedState===null&&Sl(t);break;case 30:Sl(t);break;default:Sl(t)}e=e.sibling}}function Cl(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:Cl(i,a,n),Wc(4,a);break;case 1:if(Cl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)no(c[i],s)}catch(e){Z(r,r.return,e)}}n&&o&64&&Kc(a),Jc(a,a.return);break;case 27:nl(a);case 26:case 5:Cl(i,a,n),n&&r===null&&o&4&&Xc(a),Jc(a,a.return);break;case 12:Cl(i,a,n);break;case 31:Cl(i,a,n),n&&o&4&&fl(i,a);break;case 13:Cl(i,a,n),n&&o&4&&pl(i,a);break;case 22:a.memoizedState===null&&Cl(i,a,n),Jc(a,a.return);break;case 30:break;default:Cl(i,a,n)}t=t.sibling}}function wl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ha(n))}function Tl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ha(e))}function El(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Dl(e,t,n,r),t=t.sibling}function Dl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:El(e,t,n,r),i&2048&&Wc(9,t);break;case 1:El(e,t,n,r);break;case 3:El(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ha(e)));break;case 12:if(i&2048){El(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else El(e,t,n,r);break;case 31:El(e,t,n,r);break;case 13:El(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?El(e,t,n,r):(a._visibility|=2,Ol(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?El(e,t,n,r):kl(e,t),i&2048&&wl(o,t);break;case 24:El(e,t,n,r),i&2048&&Tl(t.alternate,t);break;default:El(e,t,n,r)}}function Ol(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Ol(a,o,s,c,i),Wc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Ol(a,o,s,c,i)):u._visibility&2?Ol(a,o,s,c,i):kl(a,o),i&&l&2048&&wl(o.alternate,o);break;case 24:Ol(a,o,s,c,i),i&&l&2048&&Tl(o.alternate,o);break;default:Ol(a,o,s,c,i)}t=t.sibling}}function kl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:kl(n,r),i&2048&&wl(r.alternate,r);break;case 24:kl(n,r),i&2048&&Tl(r.alternate,r);break;default:kl(n,r)}t=t.sibling}}var Al=8192;function jl(e,t,n){if(e.subtreeFlags&Al)for(e=e.child;e!==null;)Ml(e,t,n),e=e.sibling}function Ml(e,t,n){switch(e.tag){case 26:jl(e,t,n),e.flags&Al&&e.memoizedState!==null&&Gf(n,_l,e.memoizedState,e.memoizedProps);break;case 5:jl(e,t,n);break;case 3:case 4:var r=_l;_l=gf(e.stateNode.containerInfo),jl(e,t,n),_l=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Al,Al=16777216,jl(e,t,n),Al=r):jl(e,t,n));break;default:jl(e,t,n)}}function Nl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Pl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];U=r,Ll(r,e)}Nl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Fl(e),e=e.sibling}function Fl(e){switch(e.tag){case 0:case 11:case 15:Pl(e),e.flags&2048&&Gc(9,e,e.return);break;case 3:Pl(e);break;case 12:Pl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Il(e)):Pl(e);break;default:Pl(e)}}function Il(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];U=r,Ll(r,e)}Nl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gc(8,t,t.return),Il(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Il(t));break;default:Il(t)}e=e.sibling}}function Ll(e,t){for(;U!==null;){var n=U;switch(n.tag){case 0:case 11:case 15:Gc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ha(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,U=r;else a:for(n=e;U!==null;){r=U;var i=r.sibling,a=r.return;if(cl(r),r===n){U=null;break a}if(i!==null){i.return=a,U=i;break a}U=a}}}var Rl={getCacheForType:function(e){var t=ca(N),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ca(N).controller.signal}},zl=typeof WeakMap==`function`?WeakMap:Map,G=0,K=null,q=null,J=0,Y=0,Bl=null,Vl=!1,Hl=!1,Ul=!1,Wl=0,X=0,Gl=0,Kl=0,ql=0,Jl=0,Yl=0,Xl=null,Zl=null,Ql=!1,$l=0,eu=0,tu=1/0,nu=null,ru=null,iu=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,fu=null;function pu(){return G&2&&J!==0?J&-J:T.T===null?ft():dd()}function mu(){if(Jl===0)if(!(J&536870912)||M){var e=Ze;Ze<<=1,!(Ze&3932160)&&(Ze=262144),Jl=e}else Jl=536870912;return e=lo.current,e!==null&&(e.flags|=32),Jl}function hu(e,t,n){(e===K&&(Y===2||Y===9)||e.cancelPendingCommit!==null)&&(Su(e,0),yu(e,J,Jl,!1)),at(e,n),(!(G&2)||e!==K)&&(e===K&&(!(G&2)&&(Kl|=n),X===4&&yu(e,J,Jl,!1)),rd(e))}function gu(e,t,n){if(G&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||tt(e,t),a=r?Au(e,t):Ou(e,t,!0),o=r;do{if(a===0){Hl&&!r&&yu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!vu(n)){a=Ou(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=Xl;var l=c.current.memoizedState.isDehydrated;if(l&&(Su(c,s).flags|=256),s=Ou(c,s,!1),s!==2){if(Ul&&!l){c.errorRecoveryDisabledLanes|=o,Kl|=o,a=4;break a}o=Zl,Zl=a,o!==null&&(Zl===null?Zl=o:Zl.push.apply(Zl,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Su(e,0),yu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:yu(r,t,Jl,!Vl);break a;case 2:Zl=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=$l+300-Pe(),10<a)){if(yu(r,t,Jl,!Vl),et(r,0,!0)!==0)break a;su=t,r.timeoutHandle=Kd(_u.bind(null,r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Vl,o,`Throttled`,-0,0),a);break a}_u(r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Vl,o,null,-0,0)}}break}while(1);rd(e)}function _u(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},Ml(t,a,d);var m=(a&62914560)===a?$l-Pe():(a&4194048)===a?eu-Pe():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Lu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),yu(e,a,o,!l);return}}Lu(e,t,a,n,r,i,o,s,c)}function vu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Ar(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yu(e,t,n,r){t&=~ql,t&=~Kl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-Ke(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&st(e,n,t)}function bu(){return G&6?!0:(id(0,!1),!1)}function xu(){if(q!==null){if(Y===0)var e=q.return;else e=q,ea=$i=null,No(e),Ra=null,za=0,e=q;for(;e!==null;)Uc(e.alternate,e),e=e.return;q=null}}function Su(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,xu(),K=e,q=n=vi(e.current,null),J=t,Y=0,Bl=null,Vl=!1,Hl=tt(e,t),Ul=!1,Yl=Jl=ql=Kl=Gl=X=0,Zl=Xl=null,Ql=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-Ke(r),a=1<<i;t|=e[i],r&=~a}return Wl=t,ci(),n}function Cu(e,t){F=null,T.H=Hs,t===Oa||t===Aa?(t=Ia(),Y=3):t===ka?(t=Ia(),Y=4):Y=t===oc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Bl=t,q===null&&(X=1,ec(e,Ei(t,e.current)))}function wu(){var e=lo.current;return e===null?!0:(J&4194048)===J?uo===null:(J&62914560)===J||J&536870912?e===uo:!1}function Tu(){var e=T.H;return T.H=Hs,e===null?Hs:e}function Eu(){var e=T.A;return T.A=Rl,e}function Du(){X=4,Vl||(J&4194048)!==J&&lo.current!==null||(Hl=!0),!(Gl&134217727)&&!(Kl&134217727)||K===null||yu(K,J,Jl,!1)}function Ou(e,t,n){var r=G;G|=2;var i=Tu(),a=Eu();(K!==e||J!==t)&&(nu=null,Su(e,t)),t=!1;var o=X;a:do try{if(Y!==0&&q!==null){var s=q,c=Bl;switch(Y){case 8:xu(),o=6;break a;case 3:case 2:case 9:case 6:lo.current===null&&(t=!0);var l=Y;if(Y=0,Bl=null,Pu(e,s,c,l),n&&Hl){o=0;break a}break;default:l=Y,Y=0,Bl=null,Pu(e,s,c,l)}}ku(),o=X;break}catch(t){Cu(e,t)}while(1);return t&&e.shellSuspendCounter++,ea=$i=null,G=r,T.H=i,T.A=a,q===null&&(K=null,J=0,ci()),o}function ku(){for(;q!==null;)Mu(q)}function Au(e,t){var n=G;G|=2;var r=Tu(),a=Eu();K!==e||J!==t?(nu=null,tu=Pe()+500,Su(e,t)):Hl=tt(e,t);a:do try{if(Y!==0&&q!==null){t=q;var o=Bl;b:switch(Y){case 1:Y=0,Bl=null,Pu(e,t,o,1);break;case 2:case 9:if(Ma(o)){Y=0,Bl=null,Nu(t);break}t=function(){Y!==2&&Y!==9||K!==e||(Y=7),rd(e)},o.then(t,t);break a;case 3:Y=7;break a;case 4:Y=5;break a;case 7:Ma(o)?(Y=0,Bl=null,Nu(t)):(Y=0,Bl=null,Pu(e,t,o,7));break;case 5:var s=null;switch(q.tag){case 26:s=q.memoizedState;case 5:case 27:var c=q;if(s?Wf(s):c.stateNode.complete){Y=0,Bl=null;var l=c.sibling;if(l!==null)q=l;else{var u=c.return;u===null?q=null:(q=u,Fu(u))}break b}}Y=0,Bl=null,Pu(e,t,o,5);break;case 6:Y=0,Bl=null,Pu(e,t,o,6);break;case 8:xu(),X=6;break a;default:throw Error(i(462))}}ju();break}catch(t){Cu(e,t)}while(1);return ea=$i=null,T.H=r,T.A=a,G=n,q===null?(K=null,J=0,ci(),X):0}function ju(){for(;q!==null&&!Me();)Mu(q)}function Mu(e){var t=Fc(e.alternate,e,Wl);e.memoizedProps=e.pendingProps,t===null?Fu(e):q=t}function Nu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=yc(n,t,t.pendingProps,t.type,void 0,J);break;case 11:t=yc(n,t,t.pendingProps,t.type.render,t.ref,J);break;case 5:No(t);default:Uc(n,t),t=q=yi(t,Wl),t=Fc(n,t,Wl)}e.memoizedProps=e.pendingProps,t===null?Fu(e):q=t}function Pu(e,t,n,r){ea=$i=null,No(t),Ra=null,za=0;var i=t.return;try{if(ac(e,i,t,n,J)){X=1,ec(e,Ei(n,e.current)),q=null;return}}catch(t){if(i!==null)throw q=i,t;X=1,ec(e,Ei(n,e.current)),q=null;return}t.flags&32768?(M||r===1?e=!0:Hl||J&536870912?e=!1:(Vl=e=!0,(r===2||r===9||r===3||r===6)&&(r=lo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Iu(t,e)):Fu(t)}function Fu(e){var t=e;do{if(t.flags&32768){Iu(t,Vl);return}e=t.return;var n=Vc(t.alternate,t,Wl);if(n!==null){q=n;return}if(t=t.sibling,t!==null){q=t;return}q=t=e}while(t!==null);X===0&&(X=5)}function Iu(e,t){do{var n=Hc(e.alternate,e);if(n!==null){n.flags&=32767,q=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){q=e;return}q=e=n}while(e!==null);X=6,q=null}function Lu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Hu();while(iu!==0);if(G&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=si,ot(e,n,o,s,c,l),e===K&&(q=K=null,J=0),ou=t,au=e,su=n,cu=o,lu=a,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Xu(Re,function(){return Uu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=T.T,T.T=null,a=E.p,E.p=2,s=G,G|=4;try{ol(e,t,n)}finally{G=s,E.p=a,T.T=r}}iu=1,Ru(),zu(),Bu()}}function Ru(){if(iu===1){iu=0;var e=au,t=ou,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=G;G|=4;try{vl(t,e);var a=zd,o=Fr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Pr(s.ownerDocument.documentElement,s)){if(c!==null&&Ir(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Nr(s,h),v=Nr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{G=i,E.p=r,T.T=n}}e.current=t,iu=2}}function zu(){if(iu===2){iu=0;var e=au,t=ou,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=G;G|=4;try{sl(e,t.alternate,t)}finally{G=i,E.p=r,T.T=n}}iu=3}}function Bu(){if(iu===4||iu===3){iu=0,Ne();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?iu=5:(iu=0,ou=au=null,Vu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(ru=null),dt(n),t=t.stateNode,We&&typeof We.onCommitFiberRoot==`function`)try{We.onCommitFiberRoot(Ue,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=T.T,i=E.p,E.p=2,T.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{T.T=t,E.p=i}}su&3&&Hu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===fu?du++:(du=0,fu=e):du=0,id(0,!1)}}function Vu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ha(t)))}function Hu(){return Ru(),zu(),Bu(),Uu()}function Uu(){if(iu!==5)return!1;var e=au,t=cu;cu=0;var n=dt(su),r=T.T,a=E.p;try{E.p=32>n?32:n,T.T=null,n=lu,lu=null;var o=au,s=su;if(iu=0,ou=au=null,su=0,G&6)throw Error(i(331));var c=G;if(G|=4,Fl(o.current),Dl(o,o.current,s,n),G=c,id(0,!1),We&&typeof We.onPostCommitFiberRoot==`function`)try{We.onPostCommitFiberRoot(Ue,o)}catch{}return!0}finally{E.p=a,T.T=r,Vu(e,t)}}function Wu(e,t,n){t=Ei(n,t),t=nc(e.stateNode,t,2),e=Xa(e,t,2),e!==null&&(at(e,2),rd(e))}function Z(e,t,n){if(e.tag===3)Wu(e,e,n);else for(;t!==null;){if(t.tag===3){Wu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(ru===null||!ru.has(r))){e=Ei(n,e),n=rc(2),r=Xa(t,n,2),r!==null&&(ic(n,r,t,e),at(r,2),rd(r));break}}t=t.return}}function Gu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new zl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Ul=!0,i.add(n),e=Ku.bind(null,e,t,n),t.then(e,e))}function Ku(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,K===e&&(J&n)===n&&(X===4||X===3&&(J&62914560)===J&&300>Pe()-$l?!(G&2)&&Su(e,0):ql|=n,Yl===J&&(Yl=0)),rd(e)}function qu(e,t){t===0&&(t=rt()),e=di(e,t),e!==null&&(at(e,t),rd(e))}function Ju(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),qu(e,n)}function Yu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),qu(e,n)}function Xu(e,t){return Ae(e,t)}var Zu=null,Qu=null,$u=!1,ed=!1,td=!1,nd=0;function rd(e){e!==Qu&&e.next===null&&(Qu===null?Zu=Qu=e:Qu=Qu.next=e),ed=!0,$u||($u=!0,ud())}function id(e,t){if(!td&&ed){td=!0;do for(var n=!1,r=Zu;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-Ke(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=J,a=et(r,r===K?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||tt(r,a)||(n=!0,ld(r,a));r=r.next}while(n);td=!1}}function ad(){od()}function od(){ed=$u=!1;var e=0;nd!==0&&Gd()&&(e=nd);for(var t=Pe(),n=null,r=Zu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Zu=i:n.next=i,i===null&&(Qu=n)):(n=r,(e!==0||a&3)&&(ed=!0)),r=i}iu!==0&&iu!==5||id(e,!1),nd!==0&&(nd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-Ke(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=nt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=K,n=J,n=et(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(Y===2||Y===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&je(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||tt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&je(r),dt(n)){case 2:case 8:n=Le;break;case 32:n=Re;break;case 268435456:n=Be;break;default:n=Re}return r=cd.bind(null,e),n=Ae(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&je(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(iu!==0&&iu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Hu()&&e.callbackNode!==n)return null;var r=J;return r=et(e,e===K?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(gu(e,r,t),sd(e,Pe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Hu())return null;gu(e,t,!0)}function ud(){Yd(function(){G&6?Ae(Ie,ad):od()})}function dd(){if(nd===0){var e=va;e===0&&(e=Xe,Xe<<=1,!(Xe&261888)&&(Xe=256)),nd=e}return nd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:sn(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[gt]||null).action),o=r.submitter;o&&(t=(t=o[gt]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new kn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(nd!==0){var e=o?pd(i,o):new FormData(i);Os(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),Os(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<ni.length;hd++){var gd=ni[hd];ri(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}ri(Jr,`onAnimationEnd`),ri(Yr,`onAnimationIteration`),ri(Xr,`onAnimationStart`),ri(`dblclick`,`onDoubleClick`),ri(`focusin`,`onFocus`),ri(`focusout`,`onBlur`),ri(Zr,`onTransitionRun`),ri(Qr,`onTransitionStart`),ri($r,`onTransitionCancel`),ri(ei,`onTransitionEnd`),jt(`onMouseEnter`,[`mouseout`,`mouseover`]),jt(`onMouseLeave`,[`mouseout`,`mouseover`]),jt(`onPointerEnter`,[`pointerout`,`pointerover`]),jt(`onPointerLeave`,[`pointerout`,`pointerover`]),At(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),At(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),At(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),At(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ii(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ii(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[vt];n===void 0&&(n=t[vt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,Ot.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!vn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=wt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}hn(function(){var r=a,i=un(n),s=[];a:{var c=ti.get(e);if(c!==void 0){var l=kn,u=e;switch(e){case`keypress`:if(wn(n)===0)break a;case`keydown`:case`keyup`:l=qn;break;case`focusin`:u=`focus`,l=Rn;break;case`focusout`:u=`blur`,l=Rn;break;case`beforeblur`:case`afterblur`:l=Rn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=In;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Ln;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Yn;break;case Jr:case Yr:case Xr:l=zn;break;case ei:l=Xn;break;case`scroll`:case`scrollend`:l=jn;break;case`wheel`:l=Zn;break;case`copy`:case`cut`:case`paste`:l=Bn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Jn;break;case`toggle`:case`beforetoggle`:l=Qn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=gn(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==ln&&(u=n.relatedTarget||n.fromElement)&&(wt(u)||u[_t]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?wt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=In,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Jn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Et(l),h=u==null?c:Et(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,wt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Dd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Od(s,c,l,d,!1),u!==null&&f!==null&&Od(s,f,u,d,!0)}}a:{if(c=r?Et(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=vr;else if(fr(c))if(yr)v=Or;else{v=Er;var y=Tr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&rn(r.elementType)&&(v=vr):v=Dr;if(v&&=v(e,r)){pr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Yt(c,`number`,c.value)}switch(y=r?Et(r):window,e){case`focusin`:(fr(y)||y.contentEditable===`true`)&&(Rr=y,zr=r,Br=null);break;case`focusout`:Br=zr=Rr=null;break;case`mousedown`:Vr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Vr=!1,Hr(s,n,i);break;case`selectionchange`:if(Lr)break;case`keydown`:case`keyup`:Hr(s,n,i)}var b;if(er)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else cr?or(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(rr&&n.locale!==`ko`&&(cr||x!==`onCompositionStart`?x===`onCompositionEnd`&&cr&&(b=Cn()):(bn=i,xn=`value`in bn?bn.value:bn.textContent,cr=!0)),y=Ed(r,x),0<y.length&&(x=new Vn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=sr(n),b!==null&&(x.data=b)))),(b=nr?lr(e,n):ur(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Vn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),md(s,e,r,n,i)}yd(s,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=gn(e,n),i!=null&&r.unshift(Td(e,i,a)),i=gn(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=gn(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=gn(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&$t(e,``+r);break;case`className`:Lt(e,`class`,r);break;case`tabIndex`:Lt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Lt(e,n,r);break;case`style`:nn(e,r,o);break;case`data`:if(t!==`object`){Lt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=sn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),It(e,`popover`,r);break;case`xlinkActuate`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:It(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=an.get(n)||n,It(e,n,r))}}function Nd(e,t,n,r,a,o){switch(n){case`style`:nn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&$t(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!kt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[gt]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):It(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}Jt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Xt(e,!!r,n,!0):Xt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}Qt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(rn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}qt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Xt(e,!!n,n?[]:``,!1):Xt(e,!!n,t,!0)):Xt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}Zt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(rn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e===Wd?!1:(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[St]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),Ct(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[St])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Ct(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=E.d;E.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=bu();return e||t}function yf(e){var t=Tt(e);t!==null&&t.tag===5&&t.type===`form`?As(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=Kt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),A(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+Kt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Kt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Kt(n.imageSizes)+`"]`)):i+=`[href="`+Kt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),A(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Kt(r)+`"][href="`+Kt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),A(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Dt(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);A(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Dt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),A(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Dt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),A(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=ge.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Dt(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Dt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Dt(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+Kt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),A(t),e.head.appendChild(t))}function Pf(e){return`[src="`+Kt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Kt(n.href)+`"]`);if(r)return t.instance=r,A(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),A(r),Pd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,A(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),A(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,A(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),A(a),Pd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[St]||a[ht]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,A(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),A(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:S,Provider:null,Consumer:null,_currentValue:de,_currentValue2:de,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=it(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=it(0),this.hiddenUpdates=it(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=gi(3,null,null,t),e.current=a,a.stateNode=e,t=ma(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},qa(a),e}function tp(e){return e?(e=mi,e):mi}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ya(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Xa(e,r,t),n!==null&&(hu(n,e,t),Za(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=di(e,67108864);t!==null&&hu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=pu();t=ut(t);var n=di(e,t);n!==null&&hu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=2,up(e,t,n,r)}finally{E.p=a,T.T=i}}function lp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=8,up(e,t,n,r)}finally{E.p=a,T.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Tt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=$e(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Ke(o);s.entanglements[1]|=c,o&=~c}rd(a),!(G&6)&&(tu=Pe()+500,id(0,!1))}}break;case 31:case 13:s=di(a,2),s!==null&&hu(s,a,2),bu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=un(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=wt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Fe()){case Ie:return 2;case Le:return 8;case Re:case ze:return 32;case Be:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Tt(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=wt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,pt(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,pt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ln=r,n.target.dispatchEvent(r),ln=null}else return t=Tt(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Tt(n);a!==null&&(e.splice(t,3),t-=3,Os(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[gt]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[gt]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,pu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),bu(),t[_t]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=ft();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.5`)throw Error(i(527,Lp,`19.2.5`));E.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.5`,rendererPackageName:`react-dom`,currentDispatcherRef:T,reconcilerVersion:`19.2.5`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{Ue=zp.inject(Rp),We=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Zs,s=Qs,c=$s;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[_t]=t.current,Sd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=l(d()),y=_(),b=class{constructor(e){if(this.canvas=e,this.gl=e.getContext(`webgl`,{preserveDrawingBuffer:!0,alpha:!0}),!this.gl)throw Error(`WebGL not supported`);this.program=null,this.uniforms={},this.currentValues={u_opacity:1,u_uv_scale:[1,1],u_uv_rotation:0,u_uv_offset:[0,0]},this.startTime=Date.now(),this.initBuffers(),this.startLoop()}initBuffers(){let e=this.gl,t=new Float32Array([-1,-1,1,-1,-1,1,1,1]),n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),this.buffer=n,e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)}async setShader(e){this.gl;let t=`
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_is_spec;
      uniform float u_opacity;
    `;e.uniforms.forEach(e=>{e.type===`color`?t+=`uniform vec4 ${e.id};\n`:t+=`uniform float ${e.id};\n`}),t+=e.shader,t+=`
void main() { 
      vec4 res = generate();
      gl_FragColor = vec4(res.rgb, res.a * u_opacity); 
    }`;let n=this.createProgram(`
      attribute vec2 position;
      varying vec2 v_uv;
      uniform vec2 u_uv_scale;
      uniform float u_uv_rotation;
      uniform vec2 u_uv_offset;
      void main() {
        vec2 uv = position * 0.5 + 0.5;
        uv -= 0.5;
        float c = cos(u_uv_rotation);
        float s = sin(u_uv_rotation);
        uv = mat2(c, -s, s, c) * uv;
        uv /= u_uv_scale;
        uv += u_uv_offset;
        v_uv = uv + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,t);n&&(this.program=n,this.mapUniforms())}mapUniforms(){let e=this.gl;this.uniforms={};let t=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let n=0;n<t;n++){let t=e.getActiveUniform(this.program,n);this.uniforms[t.name]=e.getUniformLocation(this.program,t.name)}}startLoop(){let e=()=>{this.draw(),this.frameId=requestAnimationFrame(e)};this.frameId=requestAnimationFrame(e)}render(e={}){this.currentValues={...this.currentValues,...e}}draw(){if(!this.program)return;let e=this.gl;e.viewport(0,0,this.canvas.width,this.canvas.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(this.program),this.uniforms.u_resolution&&e.uniform2f(this.uniforms.u_resolution,this.canvas.width,this.canvas.height),this.uniforms.u_time&&e.uniform1f(this.uniforms.u_time,(Date.now()-this.startTime)/1e3),this.uniforms.u_opacity&&e.uniform1f(this.uniforms.u_opacity,this.currentValues.u_opacity),Object.entries(this.currentValues).forEach(([t,n])=>{let r=this.uniforms[t];!r||t===`u_opacity`||(Array.isArray(n)?n.length===4?e.uniform4fv(r,n):n.length===3?e.uniform3fv(r,n):n.length===2&&e.uniform2fv(r,n):e.uniform1f(r,n))});let t=e.getAttribLocation(this.program,`position`);e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.vertexAttribPointer(t,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t),e.drawArrays(e.TRIANGLE_STRIP,0,4)}stop(){this.frameId&&cancelAnimationFrame(this.frameId)}createProgram(e,t){let n=this.gl,r=this.loadShader(n.VERTEX_SHADER,e),i=this.loadShader(n.FRAGMENT_SHADER,t);if(!r||!i)return null;let a=n.createProgram();return n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),n.getProgramParameter(a,n.LINK_STATUS)?a:null}loadShader(e,t){let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:null}export(e,t,n){let r=this.canvas.width,i=this.canvas.height;this.canvas.width=e,this.canvas.height=t,this.currentValues={...this.currentValues,...n},this.draw();let a=this.canvas.toDataURL(`image/png`);return this.canvas.width=r,this.canvas.height=i,a}exportNormalMap(e,t,n,r=3){let i=this.canvas.width,a=this.canvas.height;this.canvas.width=e,this.canvas.height=t,this.currentValues={...this.currentValues,...n},this.draw();let o=document.createElement(`canvas`);o.width=e,o.height=t;let s=o.getContext(`2d`);s.drawImage(this.canvas,0,0);let c=s.getImageData(0,0,e,t).data,l=new Float32Array(e*t);for(let n=0;n<e*t;n++)l[n]=.299*c[n*4]/255+.587*c[n*4+1]/255+.114*c[n*4+2]/255;let u=document.createElement(`canvas`);u.width=e,u.height=t;let d=u.getContext(`2d`),f=d.createImageData(e,t),p=f.data,m=(n,r)=>l[Math.max(0,Math.min(t-1,r))*e+Math.max(0,Math.min(e-1,n))];for(let n=0;n<t;n++)for(let t=0;t<e;t++){let i=-m(t-1,n-1)+m(t+1,n-1)+-2*m(t-1,n)+2*m(t+1,n)+-m(t-1,n+1)+m(t+1,n+1),a=-m(t-1,n-1)+m(t-1,n+1)+-2*m(t,n-1)+2*m(t,n+1)+-m(t+1,n-1)+m(t+1,n+1),o=-i*r,s=-a*r,c=Math.sqrt(o*o+s*s+1),l=(n*e+t)*4;p[l]=Math.round((o/c*.5+.5)*255),p[l+1]=Math.round((s/c*.5+.5)*255),p[l+2]=Math.round((1/c*.5+.5)*255),p[l+3]=255}return d.putImageData(f,0,0),this.canvas.width=i,this.canvas.height=a,u.toDataURL(`image/png`)}},x=s({default:()=>ee}),ee={id:`acid_etch_artisan`,name:`Acid Etch`,category:`Industrial`,description:`High-contrast stylized chemical erosion patterns found in weathered metals.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Acid Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Etch Deep`,type:`color`,default:[.15,.12,.1,1]},{id:`u_secondary_color`,name:`Original Plane`,type:`color`,default:[.4,.4,.45,1]}]},S=s({default:()=>C}),C={id:`aero_riblets`,name:`Aerodynamic Riblets`,category:`Racing`,description:`Microscale V-groove riblets machined into aerodynamic surfaces to reduce turbulent drag — as used on F1 cars, aircraft, and high-performance bodywork.`,shader:`
    float hash_ar(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_ar(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_ar(i), hash_ar(i+vec2(1,0)), f.x),
                 mix(hash_ar(i+vec2(0,1)), hash_ar(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Rotate UV to riblet direction
      float ang = u_angle * 3.14159;
      float ca = cos(ang), sa = sin(ang);
      vec2 ruv = mat2(ca, -sa, sa, ca) * (uv - 0.5) + 0.5;

      // Primary riblet axis: V-groove profile along ruv.y, repeating along ruv.x
      float ribX = fract(ruv.x * u_density);

      // V-groove: triangle wave gives sharp valley, bright ridge
      // 0 at centre = deepest valley, 1 at edge = ridge
      float groove = abs(ribX - 0.5) * 2.0; // 0 = valley, 1 = ridge

      // Shadow in valley, specular on ridge
      float shadow = 1.0 - groove;                   // deep in valley
      float ridge  = smoothstep(0.72, 1.0, groove);  // highlight at peak

      // Secondary micro-groove for realism (every 4th riblet is slightly wider)
      float macroGroove = abs(fract(ruv.x * u_density / 4.0) - 0.5) * 2.0;
      float macroAccent = (1.0 - macroGroove) * 0.12;

      // Slight surface imperfection along the riblet length
      float imperfect = noise_ar(vec2(ruv.x * u_density * 0.5, ruv.y * 3.0)) * 0.04;

      // Light from top-left hitting the angled V faces
      float face = groove; // how much this face points toward light
      float diffuse = face * 0.7 + 0.3;

      // Compose
      vec3 base  = u_surface_color.rgb;
      vec3 col   = base * diffuse;
      col -= shadow * base * 0.35;          // darken valley
      col += vec3(ridge * u_sharpness * 0.35); // bright ridge line
      col -= vec3(macroAccent);              // deeper macro groove shadow
      col += vec3(imperfect);               // micro surface noise

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_surface_color`,name:`Surface Colour`,type:`color`,default:[.72,.72,.74,1]},{id:`u_density`,name:`Riblet Density`,type:`float`,default:120,min:20,max:400},{id:`u_angle`,name:`Direction`,type:`float`,default:0,min:-.5,max:.5},{id:`u_sharpness`,name:`Ridge Sharpness`,type:`float`,default:.7,min:.1,max:1}]},te=s({default:()=>ne}),ne={id:`alcantara_suede_artisan`,name:`Alcantara Suede`,category:`Racing`,description:`Soft, directional fiber nap mimicking professional racing steering wheels and seats.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 0.5);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fiber Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Fiber Base`,type:`color`,default:[.1,.1,.1,1]}]},re=s({default:()=>w}),w={id:`amethyst_natural`,name:`Amethyst Crystal`,category:`Natural`,description:`Amethyst crystal cluster cross-section with elongated Voronoi cells, anisotropic face shading, and lavender-to-violet color range.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Elongated Voronoi — stretch UV in Y to make crystals columnar
    vec3 voronoiElong(vec2 uv) {
      // Stretch vertically: crystals are taller than wide
      vec2 suv = vec2(uv.x, uv.y * 0.45);
      vec2 i   = floor(suv);
      vec2 f   = fract(suv);
      float minD1 = 8.0; float minD2 = 8.0;
      float cellID = 0.0;
      vec2 minPt = vec2(0.0);
      for (int y = -1; y <= 2; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          // Jitter point, tightly packed horizontally
          vec2 rnd = vec2(hash21(i + n), hash21(i + n + vec2(37.0, 71.0)));
          vec2 pt  = n + rnd * vec2(0.85, 0.92);
          float d  = length(f - pt);
          if (d < minD1) {
            minD2  = minD1;
            minD1  = d;
            cellID = hash21(i + n + 0.5);
            minPt  = pt;
          } else if (d < minD2) {
            minD2  = d;
          }
        }
      }
      return vec3(minD1, minD2, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec3 vor = voronoiElong(uv);

      float d1     = vor.x;
      float d2     = vor.y;
      float cellID = vor.z;

      // Crystal face: anisotropic shading — vary brightness with X position
      // within the cell (simulates light reflecting off a tilted face)
      float faceAngle = hash11(cellID) * 3.14159;
      // Directional light hitting at an angle across v_uv
      float lightDir  = cos(faceAngle) * v_uv.x + sin(faceAngle) * v_uv.y;
      float faceBright = 0.55 + 0.45 * (lightDir - floor(lightDir));

      // Depth-based color blend: deeper crystals are more saturated/dark
      float depth = hash11(cellID + 0.7);  // 0=shallow 1=deep
      vec3 crystalCol = mix(u_color_light.rgb, u_color_deep.rgb, depth);

      // Apply face brightness (anisotropic glint)
      crystalCol *= (0.7 + 0.3 * faceBright);

      // Internal facet line: second nearest distance creates face boundaries
      float facetEdge = d2 - d1;
      float edgeMask  = 1.0 - smoothstep(0.0, 0.04, facetEdge);
      crystalCol      = mix(crystalCol, u_color_deep.rgb * 0.3, edgeMask * 0.7);

      // Cell boundary — dark gap / matrix between crystals
      float boundary = 1.0 - smoothstep(0.02, 0.06, d1);
      vec3 matrixCol = u_color_deep.rgb * 0.15;
      vec3 col       = mix(crystalCol, matrixCol, boundary);

      // Top-end facet highlight: near v_uv.y == 0 the crystal tip catches light
      float tipGlow = (1.0 - v_uv.y) * hash11(cellID + 0.2) * 0.25;
      col += u_color_light.rgb * tipGlow * (1.0 - boundary);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Density`,type:`float`,min:2,max:12,default:6},{id:`u_color_light`,name:`Pale Amethyst`,type:`color`,default:[.78,.55,.9,1]},{id:`u_color_deep`,name:`Deep Violet`,type:`color`,default:[.32,.08,.55,1]}]},ie=s({default:()=>ae}),ae={id:`anodized_blue`,name:`Anodized Blue`,category:`Industrial`,description:`Anodized aluminum in deep cobalt/sapphire blue with subtle directional streaking from the anodizing bath.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Anodizing streaks run along the Y axis (dip direction)
      // Low-frequency X variation + high-frequency micro lines
      float streakLow  = noise(vec2(uv.x * u_streak, uv.y * 0.5));
      float streakHigh = noise(vec2(uv.x * u_streak * 8.0, uv.y * 1.5));
      float streak = streakLow * 0.7 + streakHigh * 0.3;

      // Dark vs light shade from u_shade
      // u_shade 0 = very dark navy, 1 = lighter sapphire
      vec3 darkBlue   = vec3(0.04, 0.07, 0.22);
      vec3 lightBlue  = vec3(0.14, 0.28, 0.62);
      vec3 baseColor  = mix(darkBlue, lightBlue, u_shade);

      // Streak modulates luminance slightly
      float streakMod = mix(0.85, 1.1, streak);
      vec3 col = baseColor * streakMod;

      // Interference / thin-film edge shimmer — slight violet/cyan highlight
      float shimmer = noise(vec2(uv.x * 30.0, uv.y * 5.0 + 1.5708));
      shimmer = pow(shimmer, 3.0) * 0.12;
      col += vec3(shimmer * 0.3, shimmer * 0.5, shimmer * 1.0);

      // Gloss band across the middle
      float gloss = exp(-pow((uv.y - 0.5) * 4.0, 2.0)) * 0.12;
      col += vec3(gloss * 0.4, gloss * 0.6, gloss);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak Frequency`,type:`float`,min:1,max:10,default:4}]},oe=s({default:()=>se}),se={id:`anodized_bronze`,name:`Anodized Bronze`,category:`Industrial`,description:`Anodized aluminum in a warm bronze/gold tone with micro-grain texture and subtle colour banding from bath imperfections.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro-grain along the extrusion direction (vertical streaks)
      float grain = noise(vec2(uv.x * u_grain * 120.0, uv.y * u_grain * 4.0));
      grain = grain * 0.5 + 0.5 * noise(vec2(uv.x * u_grain * 240.0, uv.y * u_grain * 2.0));

      // Anodizing bath colour bands — slow horizontal variation
      float band = fbm(vec2(uv.x * 2.0, uv.y * 0.3));
      band = smoothstep(0.3, 0.7, band) * 0.12;

      // Base bronze colour — warm amber/gold, shifted by u_tone
      // u_tone 0 = cooler (greenish bronze), 1 = warmer (gold)
      vec3 coolBronze = vec3(0.45, 0.35, 0.18);
      vec3 warmGold   = vec3(0.65, 0.50, 0.22);
      vec3 baseColor  = mix(coolBronze, warmGold, u_tone);

      // Slight surface lightness variation from grain
      float grainLight = mix(0.78, 1.08, grain);
      vec3 col = baseColor * grainLight;

      // Band overlay — slight orange-gold tinge
      col += vec3(0.12, 0.07, 0.0) * band;

      // Subtle gloss sheen — brightest at uv.y centre
      float sheen = pow(1.0 - abs(uv.y - 0.5) * 2.0, 3.0) * 0.18;
      col += vec3(sheen * 0.9, sheen * 0.7, sheen * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_tone`,name:`Tone`,type:`float`,min:0,max:1,default:.6},{id:`u_grain`,name:`Micro Grain`,type:`float`,min:.5,max:8,default:3}]},ce=s({default:()=>le}),le={id:`anodized_red`,name:`Anodized Red`,category:`Industrial`,description:`Red anodized aluminum in cherry/crimson with a smooth satin finish and subtle micro-streaks from the anodizing bath process.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Anodizing streaks along Y (dip direction)
      // Low-frequency large variation + high-frequency fine streaks
      float streakLow  = noise(vec2(uv.x * u_streak,        uv.y * 0.4));
      float streakHigh = noise(vec2(uv.x * u_streak * 7.5,  uv.y * 2.0));
      float streak = streakLow * 0.65 + streakHigh * 0.35;

      // u_shade 0 = very dark maroon, 1 = bright cherry
      vec3 darkRed   = vec3(0.22, 0.02, 0.02);
      vec3 brightRed = u_red_tone.rgb;
      vec3 baseColor = mix(darkRed, brightRed, u_shade);

      // Streak modulates lightness
      float streakMod = mix(0.82, 1.12, streak);
      vec3 col = baseColor * streakMod;

      // Thin-film interference shimmer — red anodize shows orange/pink shimmer at edges
      float shimmer = noise(vec2(uv.x * 28.0, uv.y * 4.5 + 0.9));
      shimmer = pow(shimmer, 3.5) * 0.10;
      // Orange-pink tint
      col += vec3(shimmer * 1.0, shimmer * 0.35, shimmer * 0.25);

      // Translucency depth — slightly darker band toward centre as dye pools
      float depth = fbm(vec2(uv.x * 1.5, uv.y * 0.8));
      float depthMod = mix(0.92, 1.0, depth);
      col *= depthMod;

      // Gloss band — soft specular across U
      float gloss = exp(-pow((uv.x - 0.5) * 4.5, 2.0)) * 0.10;
      col += vec3(gloss * 1.0, gloss * 0.5, gloss * 0.5);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak`,type:`float`,min:1,max:10,default:4},{id:`u_red_tone`,name:`Red Tone`,type:`color`,default:[.78,.06,.06,1]}]},ue=s({default:()=>T}),T={id:`anodized_titanium_artisan`,name:`Anodized Titanium`,category:`Industrial`,description:`Multi-colored prismatic heat distribution and electrochemical finish for high-performance components.`,shader:`
    vec4 generate() {
      float n = v_uv.x + v_uv.y;
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},E=s({default:()=>de}),de={id:`apex_curbing_artisan`,name:`Track Curbing`,category:`Racing`,description:`Classic circuit apex curbing with tire wear marks.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x));
      float wear = hash(v_uv * 10.0) * 0.2;
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= wear;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Curb Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[1,1,1,1]}]},fe=s({default:()=>pe}),pe={id:`argyle_knit_artisan`,name:`Argyle Knit`,category:`Abstract`,description:`Classic diamond-checkered textile pattern with structural crossing threads.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Zoom`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Primary Knit`,type:`color`,default:[.1,.2,.4,1]},{id:`u_secondary_color`,name:`Secondary Knit`,type:`color`,default:[.15,.25,.5,1]}]},me=s({default:()=>D}),D={id:`armco_barrier`,name:`Armco Barrier`,category:`Racing`,description:`Corrugated W-beam steel Armco safety barrier as found lining every racing circuit — with bolt holes, panel seams, and galvanized steel surface.`,shader:`
    float hash_ab(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_ab(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_ab(i), hash_ab(i+vec2(1,0)), f.x),
                 mix(hash_ab(i+vec2(0,1)), hash_ab(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- W-beam corrugation profile ----
      // The W cross-section creates two valleys and a central ridge
      // Repeat horizontally to tile the barrier face
      float beamY = uv.y * u_beam_scale;
      // W-profile: two sine waves create the W shape
      float wProfile = sin(beamY * 6.28318) * 0.5
                     + sin(beamY * 12.5664) * 0.25;
      wProfile = (wProfile + 0.75) / 1.5; // normalise 0-1

      // ---- Surface normal for lighting (derivate of W profile) ----
      float dwdy = cos(beamY * 6.28318) * 3.14159
                 + cos(beamY * 12.5664) * 3.14159;
      vec3 normal   = normalize(vec3(0.0, -dwdy * 0.3, 1.0));
      vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));

      // ---- Panel horizontal seams ----
      float panelX = fract(uv.x * u_panel_repeat);
      float seam   = smoothstep(0.008, 0.0, panelX) + smoothstep(0.992, 1.0, panelX);
      seam        += smoothstep(0.004, 0.0, abs(panelX - 0.5)) * 0.3; // faint mid-panel lap joint

      // ---- Bolt holes — two rows per panel ----
      float boltX = fract(panelX * 4.0);          // 4 bolts per half-panel
      float boltY = fract(uv.y * u_beam_scale * 2.0 + 0.5); // centred vertically
      float boltDist = length(vec2(boltX - 0.5, boltY - 0.5) * vec2(1.0, 0.6));
      float boltHole = smoothstep(0.18, 0.14, boltDist);      // darker = hole
      float boltRim  = smoothstep(0.22, 0.18, boltDist) * (1.0 - boltHole) * 0.4;

      // ---- Galvanized steel surface ----
      // Spangles: the crystalline pattern of hot-dip galvanizing
      float spangle = noise_ab(uv * 18.0) * 0.5 + noise_ab(uv * 5.0) * 0.5;
      float crystalEdge = smoothstep(0.45, 0.5, spangle) * 0.08;

      // Weathering/rust streaks
      float rust = max(0.0, noise_ab(uv * vec2(60.0, 3.0)) - 0.55) * u_weathering;
      vec3 rustCol = vec3(0.55, 0.28, 0.10);

      // ---- Compose ----
      vec3 steelBase = u_paint_color.rgb;
      vec3 col       = steelBase * (0.3 + diffuse * 0.7);

      // Spangle sheen on galvanized surface
      col += vec3(crystalEdge * (1.0 - rust));

      // Seams darker
      col *= 1.0 - seam * 0.4;

      // Bolt holes — dark recessed
      col *= 1.0 - boltHole * 0.75;
      col += vec3(boltRim);

      // Rust patches
      col = mix(col, rustCol * (0.4 + diffuse * 0.4), rust);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_paint_color`,name:`Steel Colour`,type:`color`,default:[.75,.77,.74,1]},{id:`u_beam_scale`,name:`Beam Scale`,type:`float`,default:3.5,min:1,max:8},{id:`u_panel_repeat`,name:`Panel Width`,type:`float`,default:2.5,min:1,max:6},{id:`u_weathering`,name:`Weathering`,type:`float`,default:.2,min:0,max:1}]},O=s({default:()=>k}),k={id:`asphalt_pro_artisan`,name:`Asphalt Pro`,category:`Racing`,description:`High-detail granular road surface noise found on professional track layouts.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Detail`,type:`float`,min:100,max:1e3,default:400},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.3,.3,.32,1]},{id:`u_secondary_color`,name:`Tar Base`,type:`color`,default:[.1,.1,.12,1]}]},he=s({default:()=>ge}),ge={id:`autumn_leaves_artisan`,name:`Fallen Leaves`,category:`Nature`,description:`Clumped organic leaf-like shapes mimicking a forest floor in autumn.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Leaf Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Maple Red`,type:`color`,default:[.8,.2,.1,1]},{id:`u_secondary_color`,name:`Damp Soil`,type:`color`,default:[.2,.1,.05,1]}]},_e=s({default:()=>ve}),ve={id:`banded_agate_artisan`,name:`Banded Agate`,category:`Geology`,description:`Concentric mineral rings and gemstone strata found in polished agate slices.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Band Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gemstone Top`,type:`color`,default:[.4,.2,.5,1]},{id:`u_secondary_color`,name:`Mineral Deep`,type:`color`,default:[.2,.1,.3,1]}]},ye=s({default:()=>be}),be={id:`barbed_wire_artisan`,name:`Barbed Wire`,category:`Industrial`,description:`Twisted metal strands and sharp interlocking barbs for security motifs.`,shader:`
    vec4 generate() {
      float wire = abs(sin(v_uv.y * 50.0 + v_uv.x * 10.0));
      float barb = step(0.95, fract(v_uv.x * 10.0)) * step(0.9, wire);
      float mask = smoothstep(0.1, 0.0, wire - 0.1) + barb;
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.1,0]}]},xe=s({default:()=>Se}),Se={id:`bird_plumage_artisan`,name:`Bird Plumage`,category:`Natural`,description:`Soft, overlapping organic feather vane shapes found in avian wings.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 0.8));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Feather Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Feather Vane`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Shaft`,type:`color`,default:[.05,.05,.05,1]}]},Ce=s({default:()=>we}),we={id:`bismuth_crystal_natural`,name:`Bismuth Crystal`,category:`Natural`,description:`Iridescent metallic bismuth hopper crystals with staircase terraced surfaces and rainbow oxide interference colors.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Hue to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    // Voronoi returning nearest distance and cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          vec2 pt = vec2(hash21(i + n), hash21(i + n + vec2(53.1, 97.3)));
          float d = length(f - n - pt);
          if (d < minDist) { minDist = d; cellID = hash21(i + n + 0.5); }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Hopper staircase: quantise UV into stepped terraces
      // Each Voronoi cell is a crystal; within that cell use Manhattan-distance
      // concentric squares to create stair steps inward
      vec2 vor     = voronoi(uv);
      float cellID = vor.y;
      float dist   = vor.x;

      // Staircase terrace level — more steps toward cell interior
      float terraceFreq  = 6.0 + hash11(cellID) * 4.0;
      float terraceLevel = floor(dist * terraceFreq) / terraceFreq;

      // Tilt / rotation of the crystal (45-deg multiples for cubic bismuth)
      float crystalAngle = floor(hash11(cellID + 0.3) * 4.0) * 1.5708;
      // Rotate local UV for anisotropy
      vec2 localUV = uv - floor(uv + 0.5);  // approx cell-relative
      float cosA = cos(crystalAngle); float sinA = sin(crystalAngle);
      vec2 rotUV = vec2(localUV.x * cosA - localUV.y * sinA,
                        localUV.x * sinA + localUV.y * cosA);

      // Iridescence hue from terrace level + cell identity
      // Each terrace gets a different oxide hue: pink→gold→teal→violet
      float hueBase = cellID + terraceLevel * 1.3 * u_iridescence;
      vec3 iriCol   = hue2rgb(hueBase);

      // Metallic base mixed with iridescence (metallic base stronger in brighter terraces)
      float metalFactor = 0.35 + terraceLevel * 0.4;
      vec3  col         = mix(iriCol, u_metal_base.rgb, metalFactor);

      // Edge darkening between terraces (step shadow)
      float stepEdge = smoothstep(0.0, 0.06, fract(dist * terraceFreq));
      col *= (0.55 + 0.45 * stepEdge);

      // Cell boundary — dark gap between crystals
      float boundary = 1.0 - smoothstep(0.04, 0.10, dist);
      col = mix(col, u_metal_base.rgb * 0.08, boundary);

      // Anisotropic glint along rotated axis
      float glint = abs(sin(rotUV.x * 18.0)) * 0.12;
      col += glint * iriCol * (1.0 - metalFactor);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Scale`,type:`float`,min:1,max:10,default:4},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:2,default:1.4},{id:`u_metal_base`,name:`Metal Base Color`,type:`color`,default:[.68,.62,.58,1]}]},Te=s({default:()=>Ee}),Ee={id:`blueprint_grid_tech`,name:`Blueprint Grid`,category:`Utility`,description:`Technical structural alignment grid.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale);
      float mask = step(0.98, max(g.x, g.y));
      return mix(vec4(0.02, 0.05, 0.15, 1.0), vec4(0.0, 0.8, 1.0, 1.0), mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Count`,type:`float`,min:5,max:100,default:20}]},De=s({default:()=>Oe}),Oe={id:`bone_pores_artisan`,name:`Bone Pores`,category:`Natural`,description:`Porous trabecular organic network found in skeletal sections.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.3, 0.4, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Porosity Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Bone White`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Pore Void`,type:`color`,default:[.1,.05,0,1]}]},ke=s({default:()=>Ae}),Ae={id:`braided_cord_artisan`,name:`Braided Cord`,category:`Industrial`,description:`Overlapping thick strands of woven tactical rope found in automotive and maritime gear.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Braid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Strand Top`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Seam Shadow`,type:`color`,default:[.05,.05,.1,1]}]},je=s({default:()=>Me}),Me={id:`brain_coral_pro`,name:`Brain Coral`,category:`Natural`,description:`Labyrinthine organic structure mimicking undersea brain coral.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv);
      float maze = abs(sin(n * 20.0 + uv.x * 2.0));
      float mask = smoothstep(0.4, 0.5, maze);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Folding Size`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[1,.8,.8,1]},{id:`u_secondary_color`,name:`Deep Crevice`,type:`color`,default:[.4,.1,.2,1]}]},Ne=s({default:()=>Pe}),Pe={id:`brake_dust_artisan`,name:`Brake Dust`,category:`Racing`,description:`Fine anisotropic dark grit and metallic shavings found on race-worn wheel rims.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Dust Fleck`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Base Rim`,type:`color`,default:[.3,.3,.32,1]}]},Fe=s({default:()=>Ie}),Ie={id:`brake_rotor_wear_artisan`,name:`Brake Rotor Wear`,category:`Racing`,description:`Circular friction streaks and heat scarring found on high-performance ceramic and steel rotors.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float streaks = hash(floor(d * u_scale));
      return mix(u_secondary_color, u_primary_color, streaks);
    }
  `,uniforms:[{id:`u_scale`,name:`Wear Density`,type:`float`,min:200,max:2e3,default:1e3},{id:`u_primary_color`,name:`Metal Body`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Scuff Mark`,type:`color`,default:[.5,.5,.55,1]}]},Le=s({default:()=>Re}),Re={id:`brake_rotors_artisan`,name:`Brake Rotors`,category:`Industrial`,description:`Concentric heat-etched metal grooves found on high-performance brake discs.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float r = length(uv);
      float mask = sin(r * 100.0 * (1.0 + u_intensity)) * 0.5 + 0.5;
      mask *= step(0.1, r) * step(r, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_intensity`,name:`Groove Density`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Etched Steel`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Burnish`,type:`color`,default:[.2,.2,.25,1]}]},ze=s({default:()=>Be}),Be={id:`brick_masonry_artisan`,name:`Classic Bricks`,category:`Industrial`,description:`Staggered rectangular masonry with structural mortar joints.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      
      vec2 gv = fract(uv);
      float mask = step(0.05, gv.x) * step(gv.x, 0.95) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Brick`,type:`color`,default:[.7,.2,.1,1]},{id:`u_secondary_color`,name:`Mortar`,type:`color`,default:[.4,.4,.4,1]}]},Ve=s({default:()=>He}),He={id:`brushed_aluminum_artisan`,name:`Brushed Metal`,category:`Industrial`,description:`High-frequency linear streaks mimicking professional metal brushing and finishing.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(vec2(v_uv.y * 1000.0, 0.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Grain`,type:`color`,default:[.8,.8,.82,1]},{id:`u_secondary_color`,name:`Base Metal`,type:`color`,default:[.6,.6,.65,1]}]},Ue=s({default:()=>We}),We={id:`brushed_gold`,name:`Brushed Gold`,category:`Industrial`,description:`Directional brushed gold metal with fine horizontal linear grain and a subtle specular sheen, as found on machined jewelry and trim.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // High-frequency grain running horizontally — sample noise at fixed X, vary Y
    float grainLine(vec2 uv, float freq) {
      float n1 = noise(vec2(0.5, uv.y * freq));
      float n2 = noise(vec2(0.5, uv.y * freq * 2.3 + 17.3));
      return n1 * 0.65 + n2 * 0.35;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Fine horizontal brushing scratches — vary frequency with u_grain
      float coarse = grainLine(uv, u_grain * 0.8);
      float fine   = grainLine(uv, u_grain * 3.5);
      float grain  = coarse * 0.6 + fine * 0.4;

      // Slight cross-grain variation so it doesn't look perfectly flat
      float crossVar = noise(vec2(uv.x * 6.0, uv.y * 1.5)) * 0.08;

      // Base colour from uniform, modulate brightness by grain
      float grainMod = mix(0.80, 1.18, grain) + crossVar;
      vec3 col = u_base_color.rgb * grainMod;

      // Specular band — a soft highlight stripe along U (v_uv.x centre)
      float specBand = exp(-pow((uv.x - 0.5) * 5.0, 2.0));
      specBand *= u_sheen * 0.35;
      // Gold specular is warm — add more red/green than blue
      col += vec3(specBand * 1.0, specBand * 0.88, specBand * 0.35);

      // Micro-glint — rare bright scratches catching light
      float glint = pow(noise(vec2(uv.x * 2.0, uv.y * u_grain * 5.0)), 8.0) * u_sheen * 0.5;
      col += vec3(glint, glint * 0.85, glint * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain Frequency`,type:`float`,min:10,max:150,default:60},{id:`u_base_color`,name:`Base Gold`,type:`color`,default:[.85,.68,.18,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.5}]},Ge=s({default:()=>Ke}),Ke={id:`bubblewrap`,name:`Bubble Wrap`,category:`Abstract`,description:`Air-filled plastic bubble wrap with hemispherical highlights, rim Fresnel, and clear film between bubbles.`,shader:`
    // Offset hexagonal grid â€” bubbles in a brick layout for efficiency
    vec2 bubbleCell(vec2 uv, out vec2 cellId) {
      // Brick offset: every other row shifts by 0.5
      float row = floor(uv.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x + xOffset, uv.y);
      cellId = floor(shifted);
      return fract(shifted) - 0.5;
    }

    // Sphere highlight from a single light source
    float sphereHighlight(vec2 p, float r, vec2 lightDir) {
      float dist = length(p);
      if (dist > r) return 0.0;
      // Reconstruct Z on sphere surface
      float z = sqrt(max(0.0, r * r - dist * dist));
      vec3 normal = normalize(vec3(p, z));
      vec3 light  = normalize(vec3(lightDir, 1.5));
      float diff = max(0.0, dot(normal, light));
      return diff;
    }

    // Fresnel-like rim (brightest at grazing angle â€” edge of bubble)
    float rimFresnel(vec2 p, float r) {
      float dist = length(p);
      float rim = dist / r;
      return pow(clamp(rim, 0.0, 1.0), 3.0);
    }

    vec4 generate() {
      float scale = u_bubble_size;
      vec2 uv = v_uv * scale;

      vec2 cellId;
      vec2 local = bubbleCell(uv, cellId);

      // Bubble radius (leave ~15% for film between bubbles)
      float bubbleR = 0.40;
      float dist    = length(local);

      // Inside or outside bubble
      float inside   = 1.0 - smoothstep(bubbleR - 0.01, bubbleR + 0.01, dist);

      // Film colour (clear plastic, faint yellowish)
      vec3 film = u_film_color.rgb;

      // Bubble tint from sky/environment
      vec3 tint = u_tint.rgb;

      // Diffuse shading of the hemisphere â€” light from top-left
      float diff = sphereHighlight(local, bubbleR, vec2(-0.3, 0.5));
      diff = pow(diff, 0.7);

      // Sharp specular glint at top of bubble
      vec2  specCenter = vec2(-0.10, 0.12) * bubbleR;
      float specDist   = length(local - specCenter);
      float specGlint  = smoothstep(0.08, 0.0, specDist) * 0.95;

      // Secondary smaller glint
      vec2  spec2 = vec2(0.12, -0.08) * bubbleR;
      float spec2d = length(local - spec2);
      float specGlint2 = smoothstep(0.04, 0.0, spec2d) * 0.4;

      // Fresnel rim brightening at bubble edge
      float rim = rimFresnel(local, bubbleR) * inside;
      vec3 rimCol = mix(tint, vec3(1.0), 0.5);

      // Shadow at base of bubble (contact shadow on film)
      float shadow = 1.0 - smoothstep(0.36, bubbleR + 0.04, dist) * 0.4;

      // Compose bubble colour
      vec3 bubbleCol = mix(tint * 0.55, tint, diff);
      bubbleCol += specGlint + specGlint2;
      bubbleCol  = mix(bubbleCol, rimCol, rim * 0.6);
      bubbleCol  = clamp(bubbleCol, 0.0, 1.0);

      // Film between bubbles â€” slight shadow where bubbles press down
      vec3 filmCol = film * shadow;

      vec3 col = mix(filmCol, bubbleCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_bubble_size`,type:`float`,default:14,min:4,max:30,name:`Bubble Scale`},{id:`u_film_color`,type:`color`,default:[.88,.9,.82,1],name:`Plastic Film`},{id:`u_tint`,type:`color`,default:[.75,.85,.92,1],name:`Bubble Tint`}]},qe=s({default:()=>Je}),Je={id:`burlap_sack_artisan`,name:`Burlap Sack`,category:`Abstract`,description:`Coarse, wide-gap organic woven fibers used in heavy storage bags.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float h = step(0.7, fract(uv.x)) + step(0.7, fract(uv.y));
      float mask = clamp(h, 0.0, 1.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fibre Size`,type:`float`,min:5,max:40,default:15},{id:`u_primary_color`,name:`Fibre`,type:`color`,default:[.6,.5,.35,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.15,.1,.05,1]}]},Ye=s({default:()=>Xe}),Xe={id:`butterfly_wing_artisan`,name:`Chitin Scale`,category:`Nature`,description:`Microscopic chitinous scales mimicking the vibrant iridescent patterns of exotic lepidoptera.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.1, f_uv.x) * step(f_uv.x, 0.9) * step(0.1, f_uv.y) * step(f_uv.y, 0.9);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (v_uv.x + v_uv.y + vec3(0, 0.33, 0.67)));
      return vec4(col * mask, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:20,max:200,default:80}]},Ze=s({default:()=>Qe}),Qe={id:`cactus_needles_artisan`,name:`Cactus Spine`,category:`Nature`,description:`Geometric star-cluster spines found on high-fidelity xerophytic vegetation.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      float angle = atan(gv.y, gv.x);
      float star = step(0.9, sin(angle * 8.0));
      float d = length(gv);
      float mask = star * step(d, 0.4) * step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Spine Clusters`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Sharp Needle`,type:`color`,default:[.9,.9,.8,1]},{id:`u_secondary_color`,name:`Cactus Base`,type:`color`,default:[.2,.4,.1,1]}]},$e=s({default:()=>et}),et={id:`candy_paint`,name:`Candy Paint`,category:`Racing`,description:`Deep glossy candy-coat automotive paint with a saturated translucent hue over a dark metallic base.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Convert hue [0-1] to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Dark metallic flake base — micro noise sparkle
      float flake = noise(uv * 400.0);
      float flake2 = noise(uv * 600.0 + 1.3);
      float baseMetallic = 0.06 + 0.09 * flake * flake2;

      vec3 baseColor = vec3(baseMetallic);

      // Candy coat colour — saturated HSL from u_hue
      vec3 candyRGB = hue2rgb(u_hue);
      // Saturate: push to vivid by mixing toward pure hue
      vec3 candy = mix(vec3(0.0), candyRGB, u_depth * 0.6);

      // Simulate viewing-angle gloss gradient — centre vs edges of UV
      float cx = v_uv.x - 0.5;
      float cy = v_uv.y - 0.5;
      float radial = 1.0 - clamp(sqrt(cx * cx + cy * cy) * 1.8, 0.0, 1.0);
      float gloss = pow(radial, 1.5) * 0.55 + 0.2;

      // Slow-moving sheen ripple to simulate environment reflection
      float sheen = noise(uv * 3.0 + 1.5708);
      sheen = smoothstep(0.35, 0.75, sheen) * 0.18;

      // Layer: base + candy over-coat + gloss highlight
      vec3 col = baseColor + candy * u_depth * gloss;
      col += vec3(sheen) * candyRGB * 0.5 + vec3(sheen * 0.3);

      // White specular peak at centre
      float specPeak = pow(gloss, 6.0) * 0.5;
      col += vec3(specPeak);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_hue`,name:`Hue`,type:`float`,min:0,max:1,default:.02},{id:`u_depth`,name:`Depth`,type:`float`,min:.5,max:3,default:1.5}]},tt=s({default:()=>nt}),nt={id:`canvas_rip_artisan`,name:`Canvas Rip`,category:`Abstract`,description:`Rough, crossing threads with a torn opening mimicking shredded heavy canvas.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = step(0.8, hash(floor(uv.xx * 2.0))) * step(0.8, hash(floor(uv.yy * 2.0)));
      float rip = step(0.5 + hash(v_uv * 5.0) * 0.2, v_uv.x);
      return mix(u_secondary_color, u_primary_color, lines * rip);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Thread`,type:`color`,default:[.9,.85,.8,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.1,0]}]},rt=s({default:()=>it}),it={id:`carpet_velour_artisan`,name:`Velour Carpet`,category:`Racing`,description:`Soft, deep pile industrial carpet found in premium grand touring interiors.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) + hash(v_uv * u_scale * 0.5) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Pile Density`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`絨毯 (Carpet Top)`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pile Base`,type:`color`,default:[.05,.05,.08,1]}]},at=s({default:()=>ot}),ot={id:`cast_iron`,name:`Cast Iron`,category:`Industrial`,description:`Raw cast iron with a coarse sand-mold grain, dark matte grey surface, and occasional small porosity dimples from casting.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0; a *= 0.5;
      }
      return v;
    }

    // Porosity dimple field — Worley-based sparse pits
    float porosity(vec2 uv, float scale) {
      vec2 scaled = uv * scale * 0.4;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          // Sparse: only create a pit where hash is above threshold
          float exists = step(0.78, hash(nc + vec2(3.7, 8.2)));
          vec2 jitter = vec2(hash(nc + vec2(1.1, 6.3)), hash(nc + vec2(9.4, 2.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.7;
          float d = length(scaled - pt);
          // Only count this cell's pit if it exists
          d = mix(1.0, d, exists);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Coarse sand-mold grain — multi-scale fbm
      float coarseGrain = fbm(uv * u_grain * 1.2);
      float fineGrain   = fbm(uv * u_grain * 4.5 + vec2(5.7, 2.3));
      float grain = coarseGrain * 0.65 + fineGrain * 0.35;

      // Surface roughness modulates lightness — cast iron is dark
      float roughMod = mix(1.0 - u_roughness * 0.25, 1.0 + u_roughness * 0.12, grain);
      vec3 col = u_base_color.rgb * roughMod;

      // Occasional graphite flakes — slight lighter flecks (cast iron microstructure)
      float flake = step(0.82, noise(uv * u_grain * 8.0)) * 0.06;
      col += vec3(flake);

      // Porosity dimples — small dark circular depressions
      float pit = porosity(uv, u_grain);
      float pitMask = smoothstep(0.12, 0.04, pit);
      // Inside a pit it's darker and slightly concave (shadow at bottom)
      col = mix(col, u_base_color.rgb * 0.45, pitMask * u_roughness * 0.8);

      // Very slight surface oxidation — faint reddish-grey on high points
      float oxideTint = max(0.0, grain - 0.55) * 0.08;
      col += vec3(oxideTint * 0.4, oxideTint * 0.2, oxideTint * 0.1);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain`,type:`float`,min:5,max:50,default:22},{id:`u_base_color`,name:`Iron Color`,type:`color`,default:[.28,.27,.26,1]},{id:`u_roughness`,name:`Roughness`,type:`float`,min:.3,max:2,default:1}]},st=s({default:()=>ct}),ct={id:`chain_mail_artisan`,name:`Chain Mail`,category:`Industrial`,description:`Interlocking metal ring structures used in protective armor and fencing.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(length(gv) - 0.35);
      float mask = smoothstep(0.05, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Wire Metal`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},lt=s({default:()=>ut}),ut={id:`chalkboard_dust_artisan`,name:`Chalk Dust`,category:`Abstract`,description:`Smudged powdery residue and chalk markings found on weathered racing boards.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n * 0.5);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chalk Mark`,type:`color`,default:[.9,.9,.9,1]},{id:`u_secondary_color`,name:`Slate Base`,type:`color`,default:[.1,.1,.12,1]}]},dt=s({default:()=>ft}),ft={id:`charcoal_sketch_artisan`,name:`Charcoal Sketch`,category:`Abstract`,description:`Cross-hatched noise lines mimicking hand-drawn charcoal or graphite sketches.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.9, hash(uv));
      mask += step(0.95, hash(uv.yx + 10.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Pencil Lead`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.92,1]}]},pt=s({default:()=>mt}),mt={id:`choc_chip_camo`,name:`Chocolate Chip Camo`,category:`Organic`,description:`Broad waves of base color overlaid with small, high-contrast pebbles to mimic a rocky desert floor.`,shader:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    
    // Returns distance and vector to closest point
    vec3 cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      vec2 closest_diff;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          if(dist < min_dist) {
            min_dist = dist;
            closest_diff = diff;
          }
        }
      }
      return vec3(min_dist, closest_diff);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Background waves
      float n1 = snoise(uv * 0.5);
      float n2 = snoise(uv * 0.8 + vec2(4.2));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      
      // Chocolate Chips (Pebbles with shadows)
      vec3 cell = cellular(uv * 3.0);
      float dist = cell.x;
      vec2 diff = cell.yz;
      
      // Shadow offset
      float shadow = length(diff - vec2(0.08, -0.08));
      
      if (dist < 0.12) {
        color = u_color_chip; // The white/light pebble
      } else if (shadow < 0.15) {
        color = u_color_shadow; // The black shadow
      }
      
      return color;
    }
  `,variants:[{name:`Desert Storm`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.6,.5,.35,1],u_color_2:[.45,.35,.25,1],u_color_chip:[.9,.85,.75,1],u_color_shadow:[.1,.08,.05,1]}},{name:`Mars Surface`,uniforms:{u_color_base:[.65,.3,.15,1],u_color_1:[.5,.2,.1,1],u_color_2:[.8,.45,.25,1],u_color_chip:[.95,.65,.4,1],u_color_shadow:[.15,.05,.02,1]}},{name:`Urban Rubble`,uniforms:{u_color_base:[.55,.55,.6,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_chip:[.85,.85,.9,1],u_color_shadow:[.1,.1,.15,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.05,.05,.06,1],u_color_chip:[.2,.2,.22,1],u_color_shadow:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base Sand`,type:`color`,default:[.75,.65,.5,1]},{id:`u_color_1`,name:`Wave 1`,type:`color`,default:[.6,.5,.35,1]},{id:`u_color_2`,name:`Wave 2`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_chip`,name:`Pebble Color`,type:`color`,default:[.9,.85,.75,1]},{id:`u_color_shadow`,name:`Shadow Color`,type:`color`,default:[.1,.08,.05,1]}]},ht=s({default:()=>gt}),gt={id:`chopped_carbon_artisan`,name:`Chopped Carbon`,category:`Industrial`,description:`Randomly oriented forged carbon fragments mimicking premium high-performance composites.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fragment Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Resin Deep`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Fiber Flake`,type:`color`,default:[.2,.2,.25,1]}]},_t=s({default:()=>vt}),vt={id:`chrome_mirror`,name:`Chrome Mirror`,category:`Industrial`,description:`Mirror-polished chrome finish with gradient reflection bands simulating sky, horizon, and ground environment.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro surface imperfection — tiny waviness distorting the reflection
      float micro = noise(uv * 180.0) * 0.004;
      float distY = uv.y + micro;

      // Reflection bands: map distorted Y through band_count sinusoidal zones
      // Simulates: sky (bright blue-white top), dark horizon, bright floor, dark undercarriage
      float bandPos = distY * u_band_count;
      float band = sin(bandPos * 3.14159);

      // Colour palette of reflected environment
      // bright sky white-blue, mid dark, lower warm floor highlight
      float t = fract(bandPos / 2.0);
      vec3 skyCol   = vec3(0.85, 0.92, 1.00);   // sky
      vec3 horizCol = vec3(0.05, 0.05, 0.06);   // dark horizon
      vec3 floorCol = vec3(0.75, 0.72, 0.65);   // warm ground
      vec3 envColor;
      if (t < 0.5) {
        envColor = mix(skyCol, horizCol, t * 2.0);
      } else {
        envColor = mix(horizCol, floorCol, (t - 0.5) * 2.0);
      }

      // Apply contrast
      float lum = dot(envColor, vec3(0.299, 0.587, 0.114));
      envColor = mix(vec3(lum), envColor, 1.0) * pow(lum + 0.001, 1.0 - u_contrast * 0.3);
      envColor = mix(vec3(0.5), envColor, u_contrast);

      // Chrome tint — very slightly blue-silver
      vec3 chromeTint = vec3(0.96, 0.97, 1.0);
      vec3 col = envColor * chromeTint;

      // Sharp specular hotspot at UV centre
      float dx = uv.x - 0.5; float dy = uv.y - 0.5;
      float spec = exp(-(dx * dx + dy * dy) * 40.0) * 0.6;
      col += vec3(spec);

      // Horizontal edge darkening (shadow of object edge)
      float edgeDark = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x);
      col *= mix(0.55, 1.0, edgeDark);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_contrast`,name:`Reflection Contrast`,type:`float`,min:.5,max:3,default:2},{id:`u_band_count`,name:`Band Count`,type:`float`,min:2,max:12,default:6}]},yt=s({default:()=>bt}),bt={id:`circuit_traces_pro`,name:`Circuit Traces`,category:`Technology`,description:`Pro-grade PCB layout with branching traces and circular nodes.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float n = hash(id);
      float mask = 0.0;
      
      // Horizontal traces
      if (n > 0.5) mask += step(0.45, gv.y) * step(gv.y, 0.55);
      // Vertical traces
      if (hash(id + 1.0) > 0.5) mask += step(0.45, gv.x) * step(gv.x, 0.55);
      
      // Nodes
      float d = length(gv - 0.5);
      if (n > 0.8) mask += smoothstep(0.2, 0.15, d);
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Logic Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Trace Color`,type:`color`,default:[0,.8,.4,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.02,.05,.02,1]}]},xt=s({default:()=>St}),St={id:`coral_reef_artisan`,name:`Coral Branch`,category:`Nature`,description:`Branching organic calcium structures mimicking underwater coral reef formations.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<4; i++) {
        float n = hash(floor(uv));
        d = min(d, length(fract(uv) - 0.5));
        uv *= 1.2;
        uv += n;
      }
      return mix(u_secondary_color, u_primary_color, smoothstep(0.2, 0.1, d));
    }
  `,uniforms:[{id:`u_scale`,name:`Reef Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Polyps`,type:`color`,default:[1,.5,.4,1]},{id:`u_secondary_color`,name:`Ocean Depth`,type:`color`,default:[0,.2,.4,1]}]},Ct=s({default:()=>wt}),wt={id:`corduroy_rib_artisan`,name:`Corduroy Rib`,category:`Abstract`,description:`Parallel fuzzy ridges of heavy fabric used in durable workwear.`,shader:`
    vec4 generate() {
      float rib = sin(v_uv.x * 100.0 * u_scale);
      float mask = smoothstep(-0.5, 0.5, rib);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:.8},{id:`u_primary_color`,name:`Rib Ridge`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Rib Valley`,type:`color`,default:[.15,.1,.05,1]}]},Tt=s({default:()=>Et}),Et={id:`corroded_aluminum`,name:`Corroded Aluminum`,category:`Industrial`,description:`Pitted and oxidized aluminum with dull grey-white aluminum oxide patches over a matte base, with small darker corrosion pits.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    // Worley-style pit distance — returns distance to nearest pit centre
    float pitDist(vec2 uv, float scale) {
      vec2 cell = floor(uv * scale);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(7.3, 2.9)), hash(nc + vec2(1.7, 9.1)));
          vec2 pt = (nc + 0.3 + 0.4 * jitter) / scale;
          float d = length(uv - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Large oxide patches — slow blob noise
      float oxidePatch = fbm(uv * u_scale * 0.5);
      oxidePatch = smoothstep(1.0 - u_corrosion, 1.0, oxidePatch);

      // Aluminum oxide is chalky white-grey
      vec3 oxideColor = vec3(0.82, 0.82, 0.80);

      // Base aluminum — dull, slightly specular
      vec3 base = u_base_color.rgb;
      // Low-amplitude surface variation
      float surfVar = noise(uv * u_scale * 4.0) * 0.06 - 0.03;
      base += vec3(surfVar);

      // Blend oxide patches over base
      vec3 col = mix(base, oxideColor, oxidePatch * 0.85);

      // Corrosion pits — small dark spots (Worley)
      float pit = pitDist(uv, u_scale * 1.5);
      float pitMask = smoothstep(0.04, 0.015, pit);
      // Pits are dark grey, slightly blue-grey (pit shadow)
      vec3 pitColor = vec3(0.22, 0.22, 0.20);
      col = mix(col, pitColor, pitMask * u_corrosion);

      // Fine surface grit noise — matte, not shiny
      float grit = noise(uv * u_scale * 12.0) * 0.04 - 0.02;
      col += vec3(grit);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_corrosion`,name:`Corrosion Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Scale`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Aluminum Base`,type:`color`,default:[.65,.65,.63,1]}]},Dt=s({default:()=>A}),A={id:`corrugated_steel_artisan`,name:`Corrugated Steel`,category:`Industrial`,description:`Wavy metal sheet textures used in industrial construction and containers.`,shader:`
    vec4 generate() {
      float wave = sin(v_uv.x * 30.0 * (1.0 + u_scale));
      float mask = smoothstep(-0.8, 0.8, wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Highlight`,type:`color`,default:[.7,.75,.8,1]},{id:`u_secondary_color`,name:`Recess`,type:`color`,default:[.15,.15,.2,1]}]},Ot=s({default:()=>kt}),kt={id:`crocodile_hide_artisan`,name:`Crocodile Hide`,category:`Natural`,description:`Large rectangular blocky scales with organic gap jitter found in reptilian leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.15,.1,.05,1]},{id:`u_secondary_color`,name:`Scale Gap`,type:`color`,default:[.05,.03,.01,1]}]},At=s({default:()=>jt}),jt={id:`cyber_grid_pro`,name:`Cyber Grid`,category:`Technology`,description:`Pro-grade data-matrix style grid with secondary interference lines.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale);
      float grid = step(0.95, max(g.x, g.y));
      
      // Static pulse based on position instead of time
      float pulse = sin(v_uv.y * 10.0) * 0.5 + 0.5;
      float mask = grid * pulse;
      
      vec2 g2 = fract(v_uv * u_scale * 4.0);
      mask += step(0.98, max(g2.x, g2.y)) * 0.3;
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Resolution`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[0,.6,1,1]},{id:`u_secondary_color`,name:`Base Void`,type:`color`,default:[.02,.02,.05,1]}]},Mt=s({default:()=>Nt}),Nt={id:`cyber_leather_artisan`,name:`Cyber Leather`,category:`Technology`,description:`Synthetic high-performance leather with integrated glowing micro-circuitry pores.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * 100.0;
      float mask = step(0.9, hash(floor(uv)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Circuit Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Synthetic Skin`,type:`color`,default:[.05,.05,.06,1]}]},Pt=s({default:()=>Ft}),Ft={id:`cyber_twill_artisan`,name:`Cyber Twill`,category:`Technology`,description:`Advanced glowing-edge carbon fiber weave for high-performance cybernetic components.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Glow Edge`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Carbon Body`,type:`color`,default:[.05,.05,.05,1]}]},It=s({default:()=>Lt}),Lt={id:`cyber_wiring_artisan`,name:`Cyber Bundle`,category:`Technology`,description:`Dense, tangled bundles of high-speed digital wiring and fiber-optic strands.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale + sin(v_uv.x * 5.0));
      float n = hash(vec2(y, y));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Wire Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Wire Signal`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Insulation`,type:`color`,default:[.1,.1,.1,1]}]},Rt=s({default:()=>zt}),zt={id:`damask_lace_artisan`,name:`Damask Lace`,category:`Abstract`,description:`Complex organic floral symmetry and decorative lace patterns.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float d = 0.0;
      for (int i=0; i<4; i++) {
        uv = abs(uv - 0.5) * 1.5;
        d += sin(uv.x * 10.0) * cos(uv.y * 10.0);
      }
      float mask = step(0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Lace High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Sheer Base`,type:`color`,default:[.1,.1,.1,1]}]},Bt=s({default:()=>Vt}),Vt={id:`damask_silk_artisan`,name:`Damask Silk`,category:`Abstract`,description:`Floral symmetrical weave with high-end fabric sheen found in luxury upholstery.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = length(uv - sin(uv.x * 5.0) * 0.1);
      float mask = smoothstep(0.4, 0.35, fract(d * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Silk Pattern`,type:`color`,default:[.8,.5,.2,1]},{id:`u_secondary_color`,name:`Base Satin`,type:`color`,default:[.4,.2,.1,1]}]},Ht=s({default:()=>Ut}),Ut={id:`data_matrix_artisan`,name:`Data Matrix`,category:`Technology`,description:`Stacked digital data blocks mimicking high-density computer storage and visualization.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.5, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Data Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Active Bit`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Zero Bit`,type:`color`,default:[0,.1,.05,1]}]},Wt=s({default:()=>Gt}),Gt={id:`demon_scales_artisan`,name:`Demon Scales`,category:`Natural`,description:`Overlapping pointed organic scales with depth found in mythical beast armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.3));
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Size`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Top`,type:`color`,default:[.3,0,0,1]},{id:`u_secondary_color`,name:`Under Scale`,type:`color`,default:[.1,0,0,1]}]},Kt=s({default:()=>qt}),qt={id:`denim_weave_artisan`,name:`Denim Fabric`,category:`Abstract`,description:`Iconic indigo-stained twill weave with micro-directional thread noise.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float twill = sin((uv.x + uv.y) * 20.0);
      float noise = hash(v_uv * 500.0) * 0.2;
      float mask = step(0.0, twill + noise);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Twill Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fade Blue`,type:`color`,default:[.3,.4,.6,1]},{id:`u_secondary_color`,name:`Indigo Deep`,type:`color`,default:[.1,.15,.3,1]}]},Jt=s({default:()=>Yt}),Yt={id:`desert_dunes_artisan`,name:`Sand Dunes`,category:`Nature`,description:`Wavy ripple-sand patterns mimicking windswept desert landscapes.`,shader:`
    vec4 generate() {
      float ripple = sin(v_uv.x * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Sunlit Sand`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Dune Shadow`,type:`color`,default:[.7,.5,.3,1]}]},Xt=s({default:()=>Zt}),Zt={id:`diamond_plate_pro`,name:`Diamond Plate`,category:`Industrial`,description:`Classic anti-slip safety metal floor texture.`,shader:`
    float diamond(vec2 p) {
      p = abs(p);
      return max(p.x * 2.5, p.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      if (mod(id.x + id.y, 2.0) > 0.5) uv.x += 0.5;
      
      vec2 gv = fract(uv) - 0.5;
      float d = diamond(gv);
      float mask = smoothstep(0.4, 0.35, d);
      
      // Metal highlights
      float highlight = smoothstep(0.3, 0.35, d) * 0.2;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb += highlight;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Diamond Face`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Plate Base`,type:`color`,default:[.4,.4,.42,1]}]},Qt=s({default:()=>$t}),$t={id:`diamond_quilt_artisan`,name:`Diamond Quilt`,category:`Abstract`,description:`Stitched padded fabric effect with soft surface shading for luxury upholstery.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = fract(uv);
      float d = length(gv - 0.5);
      float mask = smoothstep(0.5, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stitch Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Stitch Deep`,type:`color`,default:[.5,.5,.6,1]}]},en=s({default:()=>tn}),tn={id:`diamond_stitch_v2_artisan`,name:`Pro Diamond Stitch`,category:`Racing`,description:`Advanced padded upholstery with individual cross-stitching detail found in luxury GT cockpits.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Size`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Stitch Line`,type:`color`,default:[.4,0,0,1]}]},nn=s({default:()=>rn}),rn={id:`diatom_shells_artisan`,name:`Diatom Shells`,category:`Natural`,description:`Intricate microscopic silicate shells found in marine plankton formations.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float mask = sin(d * 10.0 + sin(angle * 8.0));
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Shell Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Silicate`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Marine Deep`,type:`color`,default:[0,.1,.2,1]}]},an=s({default:()=>on}),on={id:`diffraction_grating_artisan`,name:`Diffraction Grating`,category:`Experimental`,description:`Rainbow-like spectral interference bands mimicking light diffraction on surfaces.`,shader:`
    vec4 generate() {
      float d = sin(v_uv.x * 500.0 + v_uv.y * 50.0);
      vec3 rainbow = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + d * 3.14);
      return vec4(rainbow, 1.0);
    }
  `,uniforms:[]},sn=s({default:()=>cn}),cn={id:`digi_camo_urban`,name:`Urban Digi Camo`,category:`Racing`,description:`High-contrast city digital camouflage.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      vec4 color = u_color_base;
      if (n > 0.8) color = u_color_1;
      else if (n > 0.5) color = u_color_2;
      else if (n > 0.2) color = u_color_3;
      return color;
    }
  `,variants:[{name:`Urban (Default)`,uniforms:{u_color_base:[.5,.5,.5,1],u_color_1:[.1,.1,.1,1],u_color_2:[.3,.3,.3,1],u_color_3:[.7,.7,.7,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[0,0,0,1],u_color_2:[.04,.04,.05,1],u_color_3:[.12,.12,.14,1]}}],uniforms:[{id:`u_scale`,name:`Detail`,type:`float`,min:10,max:100,default:50},{id:`u_color_base`,name:`Base`,type:`color`,default:[.5,.5,.5,1]},{id:`u_color_1`,name:`Dark`,type:`color`,default:[.1,.1,.1,1]},{id:`u_color_2`,name:`Mid`,type:`color`,default:[.3,.3,.3,1]},{id:`u_color_3`,name:`Light`,type:`color`,default:[.7,.7,.7,1]}]},ln=s({default:()=>un}),un={id:`digital_camo_v2_artisan`,name:`Ghost Camo`,category:`Racing`,description:`Advanced multi-scale digital camouflage with low-visibility spectral patterns.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(floor(v_uv * 10.0)) + hash(floor(v_uv * 40.0)) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,variants:[{name:`Ghost (Default)`,uniforms:{u_primary_color:[.3,.3,.35,1],u_secondary_color:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.08,.08,.09,1],u_secondary_color:[0,0,0,1]}}],uniforms:[{id:`u_primary_color`,name:`Camo High`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Camo Deep`,type:`color`,default:[.1,.1,.12,1]}]},dn=s({default:()=>fn}),fn={id:`digital_glitch_pro`,name:`Digital Glitch`,category:`Abstract`,description:`Static pixel shift and signal interference simulation.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      // Removed time dependency from shift
      float shift = hash(y) * 0.2;
      float x = v_uv.x + shift;
      
      float mask = step(0.9, hash(floor(x * 10.0) + y));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Glitch Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Signal`,type:`color`,default:[0,1,.3,1]},{id:`u_secondary_color`,name:`Noise`,type:`color`,default:[.05,.05,.08,1]}]},pn=s({default:()=>mn}),mn={id:`door_panel_fabric_artisan`,name:`Panel Fabric`,category:`Racing`,description:`Coarse interior textile weave found in lightweight door cards and racing interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x * 2.0) * sin(uv.y * 2.0);
      float mask = smoothstep(-0.2, 0.2, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:50,max:300,default:150},{id:`u_primary_color`,name:`Fiber Grain`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Fabric Base`,type:`color`,default:[.15,.15,.2,1]}]},hn=s({default:()=>gn}),gn={id:`dragon_plate_artisan`,name:`Dragon Plate`,category:`Natural`,description:`Thick, overlapping pointed armor-like scales with depth found in mythical creature hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.4));
      float mask = smoothstep(0.5, 0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Size`,type:`float`,min:5,max:25,default:12},{id:`u_primary_color`,name:`Plate Top`,type:`color`,default:[.3,0,.1,1]},{id:`u_secondary_color`,name:`Under Rim`,type:`color`,default:[.1,0,0,1]}]},_n=s({default:()=>vn}),vn={id:`energy_shield_artisan`,name:`Phase Shield`,category:`Abstract`,description:`Hexagonal-linked energy barrier pattern with high-frequency interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shield Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Ion Glow`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Hardlight Base`,type:`color`,default:[0,.1,.2,1]}]},yn=s({default:()=>bn}),bn={id:`etched_brass_artisan`,name:`Etched Brass`,category:`Industrial`,description:`Victorian-style chemical etching and ornate brass panel patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 10.0;
      float lines = sin(uv.x) * sin(uv.y) + sin(uv.x * 2.0) * cos(uv.y * 2.0);
      float mask = step(0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brass High`,type:`color`,default:[.8,.6,.2,1]},{id:`u_secondary_color`,name:`Etched Deep`,type:`color`,default:[.4,.3,.1,1]}]},xn=s({default:()=>Sn}),Sn={id:`exhaust_heat_artisan`,name:`Exhaust Bluing`,category:`Industrial`,description:`Wavy prismatic heat seasoning found on high-temperature titanium and steel exhaust systems.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 5.0);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.2, 0.4)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},Cn=s({default:()=>wn}),wn={id:`expanded_grating_pro`,name:`Expanded Metal`,category:`Industrial`,description:`Heavy industrial walkway grating with diamond-slotted apertures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float d = abs(gv.x) + abs(gv.y);
      float mask = step(0.4, d);
      
      // Slit shadow
      float shadow = smoothstep(0.4, 0.45, d) * 0.3;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= shadow;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Mesh Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Steel Rib`,type:`color`,default:[.3,.3,.33,1]},{id:`u_secondary_color`,name:`Aperture`,type:`color`,default:[0,0,0,1]}]},Tn=s({default:()=>En}),En={id:`exposed_aggregate`,name:`Exposed Aggregate`,category:`Natural`,description:`Exposed aggregate concrete with embedded smooth pebbles in warm stone colors set in a dark cement matrix.`,shader:`
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand_ea(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1_ea(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float hash1b_ea(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
    }

    // Warm stone palette — 6 tones
    vec3 stone_palette(float idx) {
      // 0: mid grey, 1: warm beige, 2: cream, 3: warm brown, 4: terracotta, 5: cool grey
      if (idx < 0.5)       return vec3(0.56, 0.54, 0.52);   // mid grey
      else if (idx < 1.5)  return vec3(0.74, 0.68, 0.56);   // warm beige
      else if (idx < 2.5)  return vec3(0.86, 0.82, 0.72);   // cream
      else if (idx < 3.5)  return vec3(0.58, 0.44, 0.32);   // warm brown
      else if (idx < 4.5)  return vec3(0.68, 0.42, 0.30);   // terracotta
      else                 return vec3(0.62, 0.62, 0.66);   // cool grey
    }

    float smoothnoise_ea(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_ea(i);
      float b = hash1_ea(i + vec2(1.0, 0.0));
      float c = hash1_ea(i + vec2(0.0, 1.0));
      float d = hash1_ea(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_stone_size;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest cell and edge distance
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);
      vec2  m_local = vec2(0.0);   // local pos within cell (relative to site)

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          // Randomize stone site position — jitter 0.2–0.8 to avoid overlap issues
          vec2 rng  = 0.2 + 0.6 * voronoi_rand_ea(i_uv + neighbor);
          vec2 diff = neighbor + rng - f_uv;
          float d   = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
            m_local = diff;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance
      float edge_dist = m2_dist - m_dist;

      // Cement between stones
      float cement_mask = smoothstep(0.0, u_grout_width, edge_dist);

      // Stone color from palette
      float cell_hash = hash1_ea(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 stone_col = stone_palette(palette_idx);

      // Slight brightness variation within each stone (second hash axis)
      float stone_var = hash1b_ea(m_id + vec2(3.7, 9.2));
      stone_col *= mix(0.88, 1.08, stone_var);

      // Pebble rounding: stones are brighter at their center (curved surface catching light)
      // m_dist is distance from stone site — normalized by typical cell size ~0.5
      float center_t = clamp(m_dist * 2.0, 0.0, 1.0);
      float curvature = 1.0 - center_t * center_t * 0.18;
      stone_col *= curvature;

      // Micro-texture on stone surface
      float micro = smoothnoise_ea(v_uv * 80.0 + m_id * 13.7);
      stone_col += (micro - 0.5) * 0.04;

      // Cement color — slightly darker than supplied, recessed
      vec3 cement = u_cement_color.rgb * 0.85;
      // Micro-texture on cement
      float cement_micro = smoothnoise_ea(v_uv * 40.0 + vec2(5.3, 2.1));
      cement += (cement_micro - 0.5) * 0.025;

      // Blend stone and cement
      vec3 col = mix(cement, stone_col, cement_mask);

      // Edge shadow — recessed cement casts slight shadow on adjacent stone edge
      float edge_shadow = smoothstep(0.0, u_grout_width * 2.5, edge_dist);
      col *= mix(0.82, 1.0, edge_shadow);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_stone_size`,name:`Aggregate Density`,type:`float`,min:2,max:20,default:8},{id:`u_cement_color`,name:`Cement Color`,type:`color`,default:[.25,.24,.23,1]},{id:`u_grout_width`,name:`Cement Gap Width`,type:`float`,min:.02,max:.15,default:.06}]},Dn=s({default:()=>On}),On={id:`fiber_optic_bundle_artisan`,name:`Fiber Bundle`,category:`Technology`,description:`Glowing bundles of light-conducting strands found in high-speed data transmission systems.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float n = hash(vec2(y, y));
      float strand = step(0.1, fract(v_uv.x * 5.0 + n));
      return mix(u_secondary_color, u_primary_color, strand);
    }
  `,uniforms:[{id:`u_scale`,name:`Strand Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Optic Glow`,type:`color`,default:[.2,1,1,1]},{id:`u_secondary_color`,name:`Dark Cladding`,type:`color`,default:[0,.05,.1,1]}]},kn=s({default:()=>An}),An={id:`fingerprint_swirls_artisan`,name:`Fingerprint Swirls`,category:`Natural`,description:`Swirling organic ridge patterns mimicking human dermatoglyphics.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 5.0) * 2.0);
      float mask = sin(n * 20.0);
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Ridge Detail`,type:`float`,min:2,max:15,default:5},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.95,.9,.85,1]}]},jn=s({default:()=>Mn}),Mn={id:`fish_scales_artisan`,name:`Fish Scales`,category:`Natural`,description:`Round, thin overlapping semi-circles found in aquatic life and reflective armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Body`,type:`color`,default:[.4,.6,.7,.8]},{id:`u_secondary_color`,name:`Joint Shadow`,type:`color`,default:[.1,.2,.3,1]}]},Nn=s({default:()=>Pn}),Pn={id:`flecktarn_camo`,name:`Flecktarn Camo`,category:`Organic`,description:`A complex pattern consisting of small, densely packed spots and dots that create a disruptive, noisy texture.`,shader:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Cellular noise for dots
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          float dist = length(neighbor + point - f);
          min_dist = min(min_dist, dist);
        }
      }
      return min_dist;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Base organic blobs
      float base_noise = snoise(uv * 0.3);
      vec4 color = u_color_base;
      if (base_noise > 0.0) color = u_color_1;
      
      // Dots/Spots layered on top
      float spots1 = cellular(uv * 2.5);
      float spots2 = cellular(uv * 3.0 + vec2(10.0));
      float spots3 = cellular(uv * 3.5 + vec2(20.0));
      
      if (spots1 < 0.25) color = u_color_2;
      if (spots2 < 0.20) color = u_color_3;
      if (spots3 < 0.15) color = u_color_4;
      
      return color;
    }
  `,variants:[{name:`Flecktarn (Woodland)`,uniforms:{u_color_base:[.35,.4,.25,1],u_color_1:[.25,.3,.2,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1],u_color_4:[.1,.1,.1,1]}},{name:`Tropentarn (Desert)`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.5,.35,1],u_color_3:[.35,.25,.15,1],u_color_4:[.15,.15,.15,1]}},{name:`Urban Mottled`,uniforms:{u_color_base:[.6,.6,.65,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_3:[.2,.2,.25,1],u_color_4:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.08,.08,.08,1],u_color_3:[.05,.05,.05,1],u_color_4:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Spot Scale`,type:`float`,min:5,max:40,default:15},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.4,.25,1]},{id:`u_color_1`,name:`Blob Color`,type:`color`,default:[.25,.3,.2,1]},{id:`u_color_2`,name:`Spot 1`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_3`,name:`Spot 2`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_4`,name:`Spot 3`,type:`color`,default:[.1,.1,.1,1]}]},Fn=s({default:()=>In}),In={id:`fluid_marbling_pro`,name:`Fluid Marbling`,category:`Abstract`,description:`Organic static liquid flow with colorful mineral-like marbling.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offsets
      float n = noise(uv);
      float n2 = noise(uv * 2.0 - n);
      float mask = smoothstep(0.3, 0.7, n * 0.5 + n2 * 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Scale`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Mineral A`,type:`color`,default:[.4,.1,.8,1]},{id:`u_secondary_color`,name:`Mineral B`,type:`color`,default:[.1,.4,.5,1]}]},Ln=s({default:()=>Rn}),Rn={id:`forest_litter_artisan`,name:`Forest Litter`,category:`Natural`,description:`Dense organic debris and varying leaf shapes found on a forest floor.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float d = length(fract(uv) - 0.5);
      float mask = smoothstep(0.4, 0.1, d * (0.8 + n * 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Debris Density`,type:`float`,min:2,max:20,default:12},{id:`u_primary_color`,name:`Leaf Dust`,type:`color`,default:[.4,.3,.1,1]},{id:`u_secondary_color`,name:`Soil`,type:`color`,default:[.1,.08,.05,1]}]},zn=s({default:()=>Bn}),Bn={id:`forged_carbon`,name:`Forged Carbon`,category:`Organic`,description:`Randomized carbon shred pattern used in hypercars.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float fbm(vec2 p) {
      float f = 0.0;
      float a = 0.5;
      for(int i=0; i<6; i++) {
        f += a * abs(sin(p.x + sin(p.y)));
        p *= 2.0;
        a *= 0.5;
      }
      return f;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = fbm(uv * 3.0);
      float n2 = fbm(uv * 5.0 + n);
      float mask = mix(n, n2, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flake Size`,type:`float`,min:1,max:20,default:8},{id:`u_primary_color`,name:`High Carbon`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Base Carbon`,type:`color`,default:[.05,.05,.05,1]}]},Vn=s({default:()=>Hn}),Hn={id:`frost_crystals_artisan`,name:`Frost Crystals`,category:`Natural`,description:`Crystalline window-ice patterns and frost blooms found in extreme cold.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 10.0);
      float crystal = step(0.9, hash(v_uv * 20.0 + n));
      return mix(u_secondary_color, u_primary_color, crystal);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Frost`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Glass`,type:`color`,default:[.1,.2,.3,1]}]},Un=s({default:()=>Wn}),Wn={id:`frozen_lake_artisan`,name:`Ice Fractures`,category:`Nature`,description:`Angular ice cracks and crystalline fractures found in frozen lake and arctic simulation environments.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.02, 0.0, abs(m_dist - 0.1));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Ice Shard`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Deep Lake`,type:`color`,default:[0,.1,.2,1]}]},Gn=s({default:()=>Kn}),Kn={id:`fusion_panel_artisan`,name:`Fusion Plating`,category:`Technology`,description:`Complex geometric panel lines and "greebles" found on high-energy reactor housings.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.02, f_uv.x) * step(f_uv.x, 0.98) * step(0.02, f_uv.y) * step(f_uv.y, 0.98);
      float n = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask * n);
    }
  `,uniforms:[{id:`u_scale`,name:`Panel Detail`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Alloy Surface`,type:`color`,default:[.12,.12,.15,1]},{id:`u_secondary_color`,name:`Panel Joint`,type:`color`,default:[0,0,0,1]}]},qn=s({default:()=>Jn}),Jn={id:`galvanized_steel_artisan`,name:`Galvanized Steel`,category:`Industrial`,description:`Spangled crystalline industrial coating found in heavy-duty utility equipment.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      return mix(u_secondary_color, u_primary_color, m_point.x);
    }
  `,uniforms:[{id:`u_scale`,name:`Spangle Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Zinc High`,type:`color`,default:[.9,.9,.92,1]},{id:`u_secondary_color`,name:`Zinc Deep`,type:`color`,default:[.5,.5,.55,1]}]},Yn=s({default:()=>Xn}),Xn={id:`gauge_cluster_artisan`,name:`Gauge Finish`,category:`Racing`,description:`Concentric circular brushed finish found on high-end analog gauge clusters and trim panels.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * 1000.0);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brushed Rim`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Brushed Deep`,type:`color`,default:[.5,.5,.55,1]}]},Zn=s({default:()=>Qn}),Qn={id:`geometric_camo_ops`,name:`Geometric Camo (Ops)`,category:`Geometric`,description:`A modern, sharp geometric splinter camouflage designed for high-performance racing liveries with vibrant accent capabilities.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        vec2 g1 = floor(uv + vec2(uv.y * 0.5, 0.0));
        float h1 = hash(g1);
        
        vec2 g2 = floor(uv * 1.3 + vec2(0.0, uv.x * 0.5));
        float h2 = hash(g2 + vec2(11.0, 17.0));
        
        vec2 g3 = floor(uv * mat2(0.707, -0.707, 0.707, 0.707) * 1.7);
        float h3 = hash(g3 + vec2(23.0, 29.0));
        
        float val = fract(h1 + h2 + h3);
        
        vec4 col = u_color_base;
        if(val < 0.3) col = u_color_1;
        else if(val < 0.6) col = u_color_2;
        else if(val < 0.9) col = u_color_3;
        
        if (val > 0.98 - (u_accent_amount * 0.1)) {
             col = u_color_accent;
        }
        
        return col;
    }
  `,variants:[{name:`Woodland (Ops)`,uniforms:{u_color_base:[.22,.27,.2,1],u_color_1:[.15,.16,.15,1],u_color_2:[.05,.05,.05,1],u_color_3:[.35,.35,.35,1],u_color_accent:[.35,.28,.18,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.76,.69,.5,1],u_color_1:[.55,.47,.33,1],u_color_2:[.25,.28,.2,1],u_color_3:[.1,.1,.1,1],u_color_accent:[.6,.4,.1,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.9,.9,.92,1],u_color_1:[.6,.6,.65,1],u_color_2:[.15,.15,.18,1],u_color_3:[.3,.3,.35,1],u_color_accent:[.25,.28,.35,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[.03,.03,.04,1],u_color_2:[0,0,0,1],u_color_3:[.15,.15,.16,1],u_color_accent:[.05,.05,.06,1]}}],uniforms:[{id:`u_scale`,name:`Camo Scale`,type:`float`,min:1,max:50,default:12},{id:`u_color_base`,name:`Base Green`,type:`color`,default:[.22,.27,.2,1]},{id:`u_color_1`,name:`Dark Grey`,type:`color`,default:[.15,.16,.15,1]},{id:`u_color_2`,name:`Black`,type:`color`,default:[.05,.05,.05,1]},{id:`u_color_3`,name:`Light Grey`,type:`color`,default:[.35,.35,.35,1]},{id:`u_color_accent`,name:`Accent Line`,type:`color`,default:[.35,.28,.18,1]},{id:`u_accent_amount`,name:`Accent Amount`,type:`float`,min:0,max:1,default:.5}]},$n=s({default:()=>er}),er={id:`geometric_fracture_artisan`,name:`Shatter Shard`,category:`Abstract`,description:`Sharp angular procedural shards and crystalline fractures mimicking high-speed impact surfaces.`,shader:`
    vec2 rand(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, step(0.1, m_dist));
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fracture Edge`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Fracture Void`,type:`color`,default:[.1,.1,.2,1]}]},tr=s({default:()=>nr}),nr={id:`glacier_ice_artisan`,name:`Glacier Ice`,category:`Natural`,description:`Crackled crystalline planes with directional depth found in Arctic ice formations.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float crack = step(0.9, hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, (n + crack) * 0.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Shelf Scale`,type:`float`,min:1,max:20,default:5},{id:`u_primary_color`,name:`Clean Ice`,type:`color`,default:[.9,.95,1,.8]},{id:`u_secondary_color`,name:`Deep Freeze`,type:`color`,default:[.1,.3,.5,1]}]},rr=s({default:()=>ir}),ir={id:`glass_shards_artisan`,name:`Glass Shards`,category:`Abstract`,description:`Sharp, non-animated geometric fragmentation mimicking shattered glass.`,shader:`
    vec2 random2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, m_dist);
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Glass Highlight`,type:`color`,default:[.8,.9,1,.5]},{id:`u_secondary_color`,name:`Shard Depth`,type:`color`,default:[.1,.2,.4,.8]}]},ar=s({default:()=>or}),or={id:`glitch_interference_artisan`,name:`Signal Glitch`,category:`Abstract`,description:`Chaotic horizontal interference and data-stream glitch patterns.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float x = v_uv.x + hash(y);
      float mask = step(0.5, fract(x * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Signal Peak`,type:`color`,default:[0,1,0,1]},{id:`u_secondary_color`,name:`Static Floor`,type:`color`,default:[0,.05,0,1]}]},sr=s({default:()=>cr}),cr={id:`glitch_text_logic_artisan`,name:`Logic Glitch`,category:`Abstract`,description:`Abstract blocks of logic-like symbols and corrupted data stream visualizations.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * 40.0);
      float n = hash(uv);
      float mask = step(0.7, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Bit Glow`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Buffer Black`,type:`color`,default:[0,.01,0,1]}]},lr=s({default:()=>ur}),ur={id:`gold_leaf_artisan`,name:`Gold Leaf`,category:`Abstract`,description:`Irregular metallic foil noise and gold leaf textures for premium accents.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 100.0) * hash(v_uv * 10.0);
      float mask = smoothstep(0.1, 0.3, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Gilded`,type:`color`,default:[1,.8,.3,1]},{id:`u_secondary_color`,name:`Underneath`,type:`color`,default:[.2,.1,0,1]}]},dr=s({default:()=>fr}),fr={id:`gold_leaf_flake_artisan`,name:`Gold Flake`,category:`Abstract`,description:`Thin, irregular metallic foil fragments and gold leaf flakes mimicking luxurious textured finishes.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.95, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flake Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Gold Leaf`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Base Resin`,type:`color`,default:[.1,.1,.1,1]}]},pr=s({default:()=>mr}),mr={id:`gothic_filigree_artisan`,name:`Gothic Filigree`,category:`Abstract`,description:`Intricate iron-like symmetrical swirls and ornate architectural blackwork.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = sin(uv.x * 10.0 + sin(uv.y * 10.0));
      float mask = smoothstep(0.1, 0.0, abs(d - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Iron`,type:`color`,default:[.1,.1,.15,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.9,.85,.8,1]}]},hr=s({default:()=>gr}),gr={id:`granite_speckle_natural`,name:`Granite Speckle`,category:`Natural`,description:`Classic grey granite with randomly scattered feldspar, quartz, biotite mica, and hornblende mineral grains.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash12(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Voronoi-style nearest-point distance + cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2  neighbor = vec2(float(x), float(y));
          vec2  point    = vec2(hash21(i + neighbor), hash21(i + neighbor + vec2(53.1, 97.3)));
          float d        = length(f - neighbor - point);
          if (d < minDist) {
            minDist = d;
            cellID  = hash21(i + neighbor + vec2(7.3, 13.7));
          }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 vor = voronoi(uv);
      float dist   = vor.x;
      float cellID = vor.y;

      // Assign mineral type by cell ID ranges
      // 0.00–0.45 → feldspar/quartz (light)
      // 0.45–0.75 → matrix grey
      // 0.75–0.88 → biotite mica (dark flake)
      // 0.88–1.00 → hornblende (black)

      float grainSize = 0.3 + hash12(cellID) * 0.25;  // vary grain radius
      float inGrain   = 1.0 - smoothstep(grainSize * 0.5, grainSize, dist);

      vec3 matrixCol = mix(u_light_mineral.rgb * 0.55, u_dark_mineral.rgb * 4.0, 0.35);

      vec3 mineralCol;
      if (cellID < 0.45) {
        // Feldspar / quartz — light, slight warm cream tint
        float warmShift = hash12(cellID + 0.1) * 0.08;
        mineralCol = u_light_mineral.rgb + vec3(warmShift, warmShift * 0.6, -warmShift * 0.3);
      } else if (cellID < 0.75) {
        // Mid-grey matrix quartz
        float g = 0.42 + hash12(cellID + 0.5) * 0.18;
        mineralCol = vec3(g);
      } else if (cellID < 0.88) {
        // Biotite mica — dark brownish black with slight sheen
        mineralCol = mix(u_dark_mineral.rgb, vec3(0.18, 0.14, 0.10), hash12(cellID + 0.9));
      } else {
        // Hornblende — near black
        mineralCol = u_dark_mineral.rgb;
      }

      vec3 col = mix(matrixCol, mineralCol, inGrain);

      // Fine background speckle noise for matrix texture
      float micro = hash21(v_uv * u_scale * 6.0) * 0.06 - 0.03;
      col += micro;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:2,max:20,default:8},{id:`u_light_mineral`,name:`Light Mineral`,type:`color`,default:[.9,.88,.85,1]},{id:`u_dark_mineral`,name:`Dark Mineral`,type:`color`,default:[.08,.08,.09,1]}]},_r=s({default:()=>vr}),vr={id:`gravel_trap_artisan`,name:`Gravel Trap`,category:`Racing`,description:`Irregular sharp cellular noise mimicking track-side runoff gravel.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv * (0.5 + hash(floor(uv)) * 0.5));
      float mask = smoothstep(0.4, 0.3, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stone Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Gravel`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Dust`,type:`color`,default:[.3,.3,.32,1]}]},yr=s({default:()=>br}),br={id:`greek_key_artisan`,name:`Greek Key`,category:`Abstract`,description:`Classic ancient geometric meander border patterns found in historic architecture.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale);
      float mask = step(0.1, uv.x) * step(uv.x, 0.9) * step(0.1, uv.y) * step(uv.y, 0.9);
      mask -= step(0.3, uv.x) * step(uv.x, 0.7) * step(0.3, uv.y) * step(uv.y, 0.7);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Key Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Meander`,type:`color`,default:[.8,.7,.3,1]},{id:`u_secondary_color`,name:`Plinth`,type:`color`,default:[.1,.1,.1,1]}]},xr=s({default:()=>Sr}),Sr={id:`halftone_dots_artisan`,name:`CMYK Halftone`,category:`Abstract`,description:`Professional offset color dots and halftone patterns used in high-end graphic design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(d, 0.4);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Ink Dot`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[1,1,1,1]}]},Cr=s({default:()=>wr}),wr={id:`halftone_pop_artisan`,name:`Halftone Pop-Art`,category:`Abstract`,description:`Classic CMYK-style dot matrix textures found in pop-art and comic books.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float intensity = sin(v_uv.x * 5.0) * 0.5 + 0.5;
      float d = length(gv);
      float mask = smoothstep(intensity * 0.5, intensity * 0.45, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Paper Base`,type:`color`,default:[1,1,.95,1]}]},Tr=s({default:()=>Er}),Er={id:`hammered_copper_artisan`,name:`Hammered Copper`,category:`Industrial`,description:`Indented, concave specular surfaces found in artisanal hammered metalwork.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, 1.0 - m_dist);
    }
  `,uniforms:[{id:`u_scale`,name:`Dents`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rim Shine`,type:`color`,default:[.9,.6,.4,1]},{id:`u_secondary_color`,name:`Copper Deep`,type:`color`,default:[.4,.2,.1,1]}]},Dr=s({default:()=>Or}),Or={id:`harlequin_diamond`,name:`Harlequin Diamond`,category:`Geometric`,description:`Classic high-contrast diagonal diamond pattern.`,shader:`
    vec4 generate() {
      // Rotate 45 degrees
      float a = 0.785398;
      mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 uv = rot * (v_uv - 0.5) * u_scale;
      
      vec2 id = floor(uv);
      float mask = mod(id.x + id.y, 2.0);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:50,default:12},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[1,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[.1,.1,.1,1]}]},kr=s({default:()=>Ar}),Ar={id:`headliner_mesh_artisan`,name:`Headliner Mesh`,category:`Racing`,description:`Breathable ceiling textile with hexagonal micro-pores found in modern automotive interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pore Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Textile Surface`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.1,1]}]},jr=s({default:()=>Mr}),Mr={id:`heat_blued_titanium`,name:`Heat-Blued Titanium`,category:`Industrial`,description:`Titanium heat-oxidation colour bands — the characteristic silver → straw → gold → purple → blue gradient on exhaust systems and racing hardware.`,shader:`
    float hash_hbt(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_hbt(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_hbt(i), hash_hbt(i+vec2(1,0)), f.x),
                 mix(hash_hbt(i+vec2(0,1)), hash_hbt(i+vec2(1,1)), f.x), f.y);
    }

    // Cascade of mix() — GPU-friendly colour ramp, no branching
    vec3 titaniumRamp(float t) {
      vec3 c0 = vec3(0.78, 0.76, 0.74); // cool silver
      vec3 c1 = vec3(0.90, 0.80, 0.48); // straw
      vec3 c2 = vec3(0.84, 0.60, 0.18); // gold
      vec3 c3 = vec3(0.58, 0.28, 0.68); // purple
      vec3 c4 = vec3(0.22, 0.38, 0.82); // blue
      vec3 c5 = vec3(0.46, 0.54, 0.72); // grey-blue (very hot)
      float s = t * 5.0;
      vec3 col = mix(c0, c1, clamp(s,       0.0, 1.0));
      col      = mix(col, c2, clamp(s-1.0,  0.0, 1.0));
      col      = mix(col, c3, clamp(s-2.0,  0.0, 1.0));
      col      = mix(col, c4, clamp(s-3.0,  0.0, 1.0));
      col      = mix(col, c5, clamp(s-4.0,  0.0, 1.0));
      return col;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Primary heat gradient along chosen axis
      float primary = mix(uv.x, 1.0 - uv.y, u_direction);

      // Organic turbulence for natural heat-flow shape
      float turb = noise_hbt(uv * 2.8) * 0.3 + noise_hbt(uv * 6.5) * 0.12;
      turb /= 0.42;

      float t = clamp(primary * u_spread + (turb - 0.5) * 0.25 + u_heat_bias, 0.0, 1.0);

      vec3 col = titaniumRamp(t);

      // Directional brushed grain (fine horizontal lines like turned/polished titanium)
      float grainAxis = mix(uv.x, uv.y, u_direction);
      float grain = noise_hbt(vec2(grainAxis * 180.0, uv.y * 1.5)) * 0.045;
      col += vec3(grain);

      // Subtle specular sheen
      float sheen = pow(max(0.0, 1.0 - abs(primary - 0.5) * 2.5), 5.0) * 0.12;
      col += vec3(sheen);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_heat_bias`,name:`Heat Level`,type:`float`,default:.4,min:0,max:1},{id:`u_spread`,name:`Band Spread`,type:`float`,default:.85,min:.2,max:1.5},{id:`u_direction`,name:`Direction`,type:`float`,default:0,min:0,max:1}]},Nr=s({default:()=>Pr}),Pr={id:`herringbone_weave_pro`,name:`Herringbone`,category:`Geometric`,description:`Pro-grade chevron-style herringbone weave pattern.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.x), 2.0) == 0.0) uv.y += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.5, abs(gv.x - gv.y));
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:2,max:100,default:20},{id:`u_primary_color`,name:`Primary Weave`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Secondary Weave`,type:`color`,default:[.05,.05,.05,1]}]},Fr=s({default:()=>Ir}),Ir={id:`hex_basalt_natural`,name:`Hex Basalt`,category:`Natural`,description:`Hexagonal columnar basalt cross-sections like the Giants Causeway, with dark joints and per-column tonal variation.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    // Classic 3-check hex grid.
    // Returns (nearest hex center, distance to nearest edge)
    vec3 hexGrid(vec2 uv) {
      // Skewed axial coordinates
      vec2 q = vec2(uv.x - uv.y * 0.57735, uv.y * 1.1547);
      vec2 pi = floor(q);
      vec2 pf = fract(q);

      float v = mod(pi.x + pi.y, 3.0);

      float ca = step(1.0, v);
      float cb = step(2.0, v);

      vec2 ma = step(pf, pf.yx);  // for edge detection

      // Three candidate hex centres
      vec2 p0 = pi + vec2(0.0, 0.0);
      vec2 p1 = pi + vec2(1.0, 0.0);
      vec2 p2 = pi + vec2(0.0, 1.0);

      // Distance in original space
      float d0 = length(uv - (p0 * vec2(1.0, 0.8660) + p0.y * vec2(0.5, 0.0)));
      float d1 = length(uv - (p1 * vec2(1.0, 0.8660) + p1.y * vec2(0.5, 0.0)));
      float d2 = length(uv - (p2 * vec2(1.0, 0.8660) + p2.y * vec2(0.5, 0.0)));

      // Use a simpler, robust hex distance approach instead
      // Convert to axial hex, round to nearest hex, compute distance
      vec2 ax = vec2(uv.x * 1.1547, uv.y + uv.x * 0.57735);
      vec2 r  = floor(ax + 0.5);
      vec2 f2 = ax - r;
      // Correct rounding for hex
      float s = sign(f2.x + f2.y);
      float mx = s * max(abs(f2.x), abs(f2.y)) > 0.5 ? 1.0 : 0.0;
      if (abs(f2.x) > abs(f2.y)) {
        r.x += s * mx;
      } else {
        r.y += s * mx;
      }

      float cellID = hash21(r);

      // Distance from hex center (in axial space, then back to world)
      vec2 hexCenter = vec2(r.x - r.y * 0.5, r.y * 0.8660);
      float dist = length(uv - hexCenter);

      return vec3(dist, cellID, length(f2));
    }

    vec4 generate() {
      vec2 uv  = v_uv * u_scale;
      vec3 hex = hexGrid(uv);

      float dist   = hex.x;
      float cellID = hex.y;

      // Hex "radius" in world units
      float hexR = 0.5 / u_scale;  // approx half-width of one column

      // Per-column grey tone variation
      float colTone = 0.85 + (hash21(vec2(cellID, 0.3)) - 0.5) * 0.22;
      vec3  rockCol = u_rock_color.rgb * colTone;

      // Raised edge: a subtle lighter rim just inside the joint
      float normDist = dist / (0.57 / u_scale);  // normalise to ~0..1
      float rimMask  = smoothstep(0.70, 0.84, normDist) * (1.0 - smoothstep(0.84, 0.92, normDist));
      rockCol = mix(rockCol, rockCol * 1.18, rimMask);

      // Dark joint between columns
      float jointWidth = u_joint_width;
      float jointMask  = smoothstep(0.88 - jointWidth, 0.92, normDist);
      rockCol = mix(rockCol, vec3(0.04, 0.04, 0.04), jointMask);

      return vec4(clamp(rockCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Column Density`,type:`float`,min:2,max:16,default:7},{id:`u_rock_color`,name:`Basalt Color`,type:`color`,default:[.38,.38,.36,1]},{id:`u_joint_width`,name:`Joint Width`,type:`float`,min:.01,max:.1,default:.04}]},Lr=s({default:()=>Rr}),Rr={id:`hex_mesh_pro`,name:`Aerodynamic Hex`,category:`Technology`,description:`Technical high-airflow hexagonal mesh grid.`,shader:`
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      float mask = step(0.05, 0.48 - hexDist(gv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Mesh`,type:`color`,default:[.35,.35,.4,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},zr=s({default:()=>Br}),Br={id:`holographic_glitch_artisan`,name:`Hologlitch`,category:`Abstract`,description:`Chromatic offset stripes and holographic artifacts mimicking digital interference.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 40.0);
      float offset = hash(y);
      float r = step(0.5, fract(v_uv.x * 10.0 + offset));
      return mix(u_secondary_color, u_primary_color, r);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Cyan Beam`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Magenta Blur`,type:`color`,default:[1,0,1,1]}]},Vr=s({default:()=>Hr}),Hr={id:`honeycomb_bio`,name:`HoneyComb Bio`,category:`Natural`,description:`Precise hexagonal organic cell wall structure.`,shader:`
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      
      float d = hexDist(gv);
      float mask = smoothstep(0.4, 0.45, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:40,default:12},{id:`u_primary_color`,name:`Honey Fill`,type:`color`,default:[1,.7,0,1]},{id:`u_secondary_color`,name:`Wax Wall`,type:`color`,default:[.2,.1,0,1]}]},Ur=s({default:()=>Wr}),Wr={id:`honeycomb_metal`,name:`Honeycomb Metal`,category:`Industrial`,description:`Aerospace aluminium honeycomb panel â€” machine-perfect hexagonal cells with bright thin walls and deep dark interiors.`,shader:`
    // Perfect hexagonal grid SDF
    // Returns: x = dist to hex centre, y = dist to nearest wall
    vec2 hexGrid(vec2 uv) {
      // Axial hex coordinates
      const vec2 s = vec2(1.0, 1.7320508); // 1, sqrt(3)

      vec2 p  = uv;
      vec4 hC = floor(vec4(p, p - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
      vec4 h  = vec4(p - hC.xy * s, p - (hC.zw + 0.5) * s);

      // Pick closer centre
      return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
    }

    // Hexagon SDF (regular, circumradius 1)
    float hexSDF(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x) - 1.0;
    }

    vec4 generate() {
      float scale     = u_scale;
      vec3  wallCol   = u_wall_color.rgb;
      float cellDepth = u_cell_depth;

      vec2 uv = v_uv * scale;

      // Hex cell local coordinates
      vec2 local = hexGrid(uv);

      // Inner hexagon radius (cell interior)
      float wallThickness = 0.06;
      float hexR = 1.0 - wallThickness * 2.2; // circumradius of inner hex

      // SDF inside the hex cell (positive = inside cell, negative = in wall)
      // local is relative to hex centre, hex circumradius ~ 0.577 in this grid
      float cellRadius  = 0.555;
      float innerRadius = cellRadius - wallThickness;

      float distToEdge  = cellRadius - length(local) * (1.0 / 0.577); // approx
      // More accurate: use hex SDF
      vec2 pl = local / cellRadius;
      float hexd = hexSDF(pl * vec2(1.0, 0.5773503));  // normalised hex
      // hexd < 0 = inside hex cell, > 0 = outside

      float insideCell = step(hexd, -wallThickness / cellRadius);
      float inWall     = 1.0 - insideCell;

      // Wall lighting â€” simulate thin aluminium wall under oblique light
      // Brightest on the wall face closest to light (upper-right)
      vec2  lightDir2D = normalize(vec2(0.7, 0.9));
      float wallFacing = clamp(dot(normalize(local), lightDir2D), 0.0, 1.0);

      // Wall colour â€” bright aluminium with directional specular
      float wallBright  = 0.55 + wallFacing * 0.45;
      float wallSpec    = pow(wallFacing, 12.0) * 0.4;
      vec3  wallShaded  = wallCol * wallBright + wallSpec;

      // Cell interior â€” dark (depth), with slight concentric shading toward centre
      float cellInterior = 1.0 - smoothstep(0.0, 0.8, -hexd / (cellRadius * 0.6));
      vec3  cellCol      = wallCol * (1.0 - cellDepth * 0.92) * (0.04 + cellInterior * 0.06);

      // Chamfer highlight â€” very thin bright line right at the hex wall edge
      float edgeDist   = abs(hexd + wallThickness / cellRadius);
      float edgeHighlight = smoothstep(0.04, 0.0, edgeDist) * 0.6;

      vec3 col = mix(cellCol, wallShaded, inWall);
      col += edgeHighlight * wallCol;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Cell Scale`},{id:`u_wall_color`,type:`color`,default:[.78,.8,.82,1],name:`Wall Colour`},{id:`u_cell_depth`,type:`float`,default:.85,min:.2,max:1,name:`Cell Depth`}]},Gr=s({default:()=>Kr}),Kr={id:`houndstooth`,name:`Houndstooth`,category:`Geometric`,description:`Pro-grade textile pattern for classic racing interiors.`,shader:`
    float houndstooth(vec2 p) {
      vec2 gv = fract(p);
      float mask = step(gv.x, 0.5) * step(gv.y, 0.5);
      mask += step(0.5, gv.x) * step(0.5, gv.y);
      float diag = step(gv.x + gv.y, 0.5);
      float diag2 = step(1.5, gv.x + gv.y);
      return abs(mask - (diag + diag2));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = houndstooth(uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pattern Size`,type:`float`,min:5,max:100,default:40},{id:`u_primary_color`,name:`Primary Thread`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Secondary Thread`,type:`color`,default:[.05,.05,.05,1]}]},qr=s({default:()=>Jr}),Jr={id:`hunting_camo_forest`,name:`Forest Hunting Camo`,category:`Racing`,description:`Pro-grade wilderness camouflage with organic branch and leaf shapes.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv * 1.5);
      float mask1 = step(0.6, n1);
      float n2 = noise(uv * 3.0 + n1 * 0.5);
      float mask2 = step(0.6, n2);
      float n3 = noise(vec2(uv.x * 0.5, uv.y * 4.0));
      float mask3 = step(0.7, n3);
      
      vec4 color = u_color_tan;
      color = mix(color, u_color_green, mask2);
      color = mix(color, u_color_brown, mask1);
      color = mix(color, u_color_dark, mask3);
      
      if (u_is_spec > 0.5) return vec4(0.0, 0.9, 0.0, 1.0);
      return color;
    }
  `,variants:[{name:`Forest (Default)`,uniforms:{u_color_green:[.1,.15,.05,1],u_color_tan:[.5,.45,.3,1],u_color_brown:[.25,.15,.1,1],u_color_dark:[.05,.05,.02,1]}},{name:`Blackout Stealth`,uniforms:{u_color_green:[.06,.06,.07,1],u_color_tan:[.15,.15,.16,1],u_color_brown:[.03,.03,.04,1],u_color_dark:[0,0,0,1]}}],uniforms:[{id:`u_scale`,name:`Detail Density`,type:`float`,min:1,max:10,default:3.5},{id:`u_color_green`,name:`Greenish`,type:`color`,default:[.1,.15,.05,1]},{id:`u_color_tan`,name:`Tan Base`,type:`color`,default:[.5,.45,.3,1]},{id:`u_color_brown`,name:`Brown`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_dark`,name:`Dark`,type:`color`,default:[.05,.05,.02,1]}]},Yr=s({default:()=>Xr}),Xr={id:`impasto_paint_artisan`,name:`Impasto Paint`,category:`Abstract`,description:`Thick, textured brush strokes and heavy oil paint impasto effects.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Paint Peak`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Canvas Base`,type:`color`,default:[.4,0,0,1]}]},Zr=s({default:()=>Qr}),Qr={id:`infinite_spiral_pro`,name:`Infinite Spiral`,category:`Abstract`,description:`Mathematical spirograph with static interlocking floral loops.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float r = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Removed time from spiral function
      float spiral = sin(r * 10.0 - a * 5.0);
      float mask = smoothstep(0.0, 0.1, abs(spiral) - 0.1);
      
      return mix(u_secondary_color, u_primary_color, 1.0 - mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Spiral Power`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Ink Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[0,0,0,1]}]},$r=s({default:()=>ei}),ei={id:`ink_blot_test_artisan`,name:`Ink Blot`,category:`Abstract`,description:`Symmetrical organic Rorschach blobs mimicking organic ink flow on folded paper.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float n = noise(uv * 5.0 + noise(uv * 10.0));
      float mask = step(0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.9,1]}]},ti=s({default:()=>ni}),ni={id:`interference_rings`,name:`Interference Rings`,category:`Abstract`,description:`Newton's rings â€” concentric iridescent interference fringes radiating from a contact point.`,shader:`
    // Convert HSV to RGB (GLSL 1.0 compatible)
    vec3 hsv2rgb(float h, float s, float v) {
      float hh = mod(h * 6.0, 6.0);
      float c  = v * s;
      float x  = c * (1.0 - abs(mod(hh, 2.0) - 1.0));
      vec3 rgb;
      if      (hh < 1.0) rgb = vec3(c, x, 0.0);
      else if (hh < 2.0) rgb = vec3(x, c, 0.0);
      else if (hh < 3.0) rgb = vec3(0.0, c, x);
      else if (hh < 4.0) rgb = vec3(0.0, x, c);
      else if (hh < 5.0) rgb = vec3(x, 0.0, c);
      else               rgb = vec3(c, 0.0, x);
      return rgb + (v - c);
    }

    // Thin-film fringe intensity at path-length difference delta (in half-waves)
    float fringeIntensity(float delta) {
      return 0.5 + 0.5 * cos(delta * 6.28318);
    }

    vec4 generate() {
      float freq  = u_fringe_freq;
      float irid  = u_iridescence;
      float cx    = u_center;        // ring centre X (Y is always 0.5)

      vec2  centre = vec2(cx, 0.5);
      float dist   = length(v_uv - centre);

      // Air-gap thickness grows as r^2 for Newton's rings geometry
      // But visually a sqrt mapping looks more like the classic photo
      float gap = dist * dist * freq * 8.0;

      // Three wavelengths (R, G, B) â€” slightly different fringe frequencies
      float fR = fringeIntensity(gap * 1.00);
      float fG = fringeIntensity(gap * 1.18);
      float fB = fringeIntensity(gap * 1.38);

      vec3 fringeRGB = vec3(fR, fG, fB);

      // Iridescent hue rotation â€” shift hue with gap
      float hue   = fract(gap * 0.08 + 0.0);
      vec3  iridCol = hsv2rgb(hue, irid * 0.7, 1.0);

      // Blend achromatic fringe with iridescent hue
      vec3 col = mix(fringeRGB, iridCol, clamp(irid * 0.5, 0.0, 1.0));

      // Dark centre spot (perfect contact â€” zero gap, destructive at all Î»)
      float centreDark = smoothstep(0.015, 0.0, dist) * 0.9;
      col *= (1.0 - centreDark);

      // Slight radial vignette â€” interference fades at large radius
      float vignette = 1.0 - smoothstep(0.4, 0.72, dist);
      col = mix(vec3(0.92), col, vignette);
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_fringe_freq`,type:`float`,default:18,min:4,max:40,name:`Fringe Frequency`},{id:`u_iridescence`,type:`float`,default:1.2,min:0,max:2,name:`Iridescence`},{id:`u_center`,type:`float`,default:.5,min:.1,max:.9,name:`Ring Centre X`}]},ri=s({default:()=>ii}),ii={id:`iris_fibers_artisan`,name:`Iris Fibers`,category:`Natural`,description:`Radial organic fibrous patterns found in the human eye iris.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 50.0, 0.0));
      float mask = smoothstep(0.1, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Pupil Edge`,type:`color`,default:[.1,.3,.6,1]},{id:`u_secondary_color`,name:`Outer Stroma`,type:`color`,default:[0,.05,.1,1]}]},ai=s({default:()=>oi}),oi={id:`julia_fractal`,name:`Julia Set`,category:`Abstract`,description:`High-symmetry mathematical fractal based on complex number seeds.`,shader:`
    vec4 generate() {
      vec2 z = (v_uv - 0.5) * 4.0 / u_scale;
      vec2 c = vec2(-0.7, 0.27015);
      float iter = 0.0;
      const float max_iter = 64.0;
      
      for(float i=0.0; i<max_iter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 2.0) break;
        iter++;
      }
      
      float mask = iter / max_iter;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fractal Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Core Color`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Outer Space`,type:`color`,default:[0,0,.1,1]}]},si=s({default:()=>ci}),ci={id:`kevlar_grid_artisan`,name:`Kevlar Weave`,category:`Industrial`,description:`Heavy tactical weave used in protective armor and performance gear.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Kevlar Gold`,type:`color`,default:[.8,.7,.2,1]},{id:`u_secondary_color`,name:`Outer Mesh`,type:`color`,default:[.1,.1,.1,1]}]},li=s({default:()=>ui}),ui={id:`knurl_grip`,name:`Knurl Grip`,category:`Racing`,description:`Diamond knurl grip pattern — two sets of diagonal machined ridges crossing at 45 degrees to form sharp pyramid diamonds with bright tips and dark valleys.`,shader:`
    // Rotate a UV coordinate by angle (radians)
    vec2 rot2d(vec2 p, float a) {
      float s = sin(a); float c = cos(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Single set of parallel ridges along one axis after rotation
    // Returns 0 at valley, 1 at ridge peak
    float ridges(vec2 uv, float density, float angle) {
      vec2 r = rot2d(uv, angle);
      // Use r.x for ridge position, fract gives saw-tooth, smoothed to sine-like
      float t = fract(r.x * density);
      // Smooth triangle wave: sharp at peak, smooth at valley
      t = 1.0 - abs(t * 2.0 - 1.0);
      return t;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Two ridge sets at +45 and -45 degrees (0.7854 rad)
      float r1 = ridges(uv, u_density, 0.7854);
      float r2 = ridges(uv, u_density, -0.7854);

      // Diamond height: both ridges must be high simultaneously
      // Multiply gives peak only where both are at maximum
      float diamond = r1 * r2;

      // Sharpen the peak using a power — creates pyramid look
      diamond = pow(diamond, mix(1.5, 3.5, u_depth * 0.5));

      // Valley (dark) vs tip (bright)
      // Valleys between ridges are the darkest points
      float valley = (1.0 - r1) * (1.0 - r2);
      float valleyMask = pow(valley, 1.8);

      // Base colour
      vec3 col = u_base_color.rgb;

      // Darken valleys
      col *= mix(1.0, 0.35, valleyMask * u_depth * 0.7);

      // Bright highlight on pyramid tips
      float tipHighlight = diamond * u_depth * 0.45;
      col += vec3(tipHighlight, tipHighlight * 0.98, tipHighlight * 0.95);

      // Mid-slope shading — slight gradient on ridge faces
      float slope = r1 * (1.0 - r2) + r2 * (1.0 - r1);
      col *= mix(1.0, 0.72, slope * u_depth * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_density`,name:`Diamond Density`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Base Metal`,type:`color`,default:[.55,.55,.57,1]},{id:`u_depth`,name:`Ridge Depth`,type:`float`,min:.2,max:2,default:1}]},di=s({default:()=>fi}),fi={id:`laser_etch`,name:`Laser Etch`,category:`Technology`,description:`Laser-engraved geometric lines on dark anodized metal, revealing bright bare aluminium in precise 45-degree patterns.`,shader:`
    // --- helpers BEFORE generate() ---

    // Rotate UV by 45 degrees
    vec2 rotate45(vec2 uv) {
      float c = 0.70710678; // cos(45deg)
      float s = 0.70710678; // sin(45deg)
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Rotate UV by -45 degrees
    vec2 rotate_neg45(vec2 uv) {
      float c =  0.70710678;
      float s = -0.70710678;
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Sharp line: returns 1.0 on a thin periodic line, 0.0 elsewhere
    // period_fract: fract within one repeat period, width: fraction of period
    float laser_line(float period_fract, float width) {
      // Line lives at fract = 0.0 (and 1.0)
      float dist_to_line = min(period_fract, 1.0 - period_fract);
      return 1.0 - smoothstep(width * 0.3, width * 0.5, dist_to_line);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Primary lines at +45 degrees ---
      vec2 uv45     = rotate45(uv) * u_line_density;
      float line_a  = laser_line(fract(uv45.x), u_line_width);

      // --- Secondary lines at -45 degrees (perpendicular cross) ---
      vec2 uv_neg45 = rotate_neg45(uv) * u_line_density;
      float line_b  = laser_line(fract(uv_neg45.x), u_line_width);

      // --- Cross-hatch gate: only draw second layer in checker zones ---
      // Checker based on grid cells in original UV space
      vec2  grid_cell  = floor(uv * u_line_density * 0.5);
      float checker    = mod(grid_cell.x + grid_cell.y, 2.0);
      // In checker=1 cells, show both line_a and line_b (cross-hatch)
      // In checker=0 cells, show only line_a (single hatch)
      float cross_hatch = mix(0.0, line_b, checker);

      // Combine: primary lines always on, cross-hatch in checker zones
      float etched = clamp(line_a + cross_hatch, 0.0, 1.0);

      // --- Colors ---
      vec3 bg    = u_background.rgb;
      vec3 etch  = u_etch_color.rgb;

      // Bright aluminium in etched lines
      vec3 col   = mix(bg, etch, etched);

      // Slight anodized surface micro-texture in background
      // Use simple high-frequency variation — no extra helper needed
      float micro_x = fract(uv.x * 210.3 + 0.17);
      float micro_y = fract(uv.y * 197.7 + 0.83);
      float micro   = fract(micro_x * 7.3 + micro_y * 13.1);
      float micro_n = (micro - 0.5) * 0.025 * (1.0 - etched);
      col += micro_n;

      // Edge glow on etched lines — very subtle warm glow (laser heat)
      // Lines slightly brighter at center
      float glow_a = laser_line(fract(uv45.x),     u_line_width * 0.18) * 0.08;
      float glow_b = laser_line(fract(uv_neg45.x), u_line_width * 0.18) * checker * 0.08;
      col += (glow_a + glow_b) * vec3(1.0, 0.92, 0.75) * (1.0 - etched * 0.5);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_line_density`,name:`Line Density`,type:`float`,min:4,max:40,default:16},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.08,.1,1]},{id:`u_etch_color`,name:`Etch Color`,type:`color`,default:[.85,.87,.88,1]},{id:`u_line_width`,name:`Line Width`,type:`float`,min:.01,max:.2,default:.06}]},pi=s({default:()=>mi}),mi={id:`lava_crust_pro`,name:`Lava Crust`,category:`Natural`,description:`Static volcanic cooling patterns with high-heat emission cracks.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offset
      float n = noise(uv);
      float mask = smoothstep(0.4, 0.6, n);
      
      vec4 heat = vec4(1.0, 0.2, 0.0, 1.0);
      vec4 rock = vec4(0.1, 0.1, 0.12, 1.0);
      
      return mix(heat, rock, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Intensity`,type:`float`,min:1,max:10,default:4}]},hi=s({default:()=>gi}),gi={id:`leaf_skeleton_pro`,name:`Leaf Skeleton`,category:`Natural`,description:`Technical vein structure mimicking a decaying leaf skeleton.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float mask = step(0.95, hash(id + gv.x * 0.1));
      mask += step(0.98, max(gv.x, gv.y));
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Detail`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.05,1]}]},_i=s({default:()=>vi}),vi={id:`lichen_growth_artisan`,name:`Lichen Moss`,category:`Nature`,description:`Splotchy organic crust and symbiotic growths found on weathered rocks and trees.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, step(0.5, n));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Lichen High`,type:`color`,default:[.7,.8,.5,1]},{id:`u_secondary_color`,name:`Rock Base`,type:`color`,default:[.2,.2,.2,1]}]},yi=s({default:()=>bi}),bi={id:`lichtenberg_trees_artisan`,name:`Lichtenberg Trees`,category:`Experimental`,description:`Fractal electrical discharge patterns found in high-voltage dielectric breakdown.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 100.0);
      float branch = step(0.98, n * hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, branch);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Discharge`,type:`color`,default:[.4,.8,1,1]},{id:`u_secondary_color`,name:`Insulator`,type:`color`,default:[.05,.05,.08,1]}]},xi=s({default:()=>Si}),Si={id:`linear_gradient_artisan`,name:`Master Linear`,category:`Utility`,description:`High-precision linear gradient for base transitions.`,shader:`
    vec4 generate() {
      float mask = v_uv.x;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Start Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`End Color`,type:`color`,default:[0,0,0,1]}]},Ci=s({default:()=>wi}),wi={id:`linen_weave`,name:`Linen Weave`,category:`Industrial`,description:`Natural linen plain weave with organic fibre slubs and warm ecru tones.`,shader:`
    // Hash for pseudo-random noise
    float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    // Smooth noise for slub irregularity
    float noise1(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), u);
    }

    // Simulate a single thread with slubs
    float threadProfile(float pos, float threadId) {
      float base = 0.55;
      float slubFreq = 1.8 + hash11(threadId) * 2.5;
      float slubAmp  = 0.08 + hash11(threadId + 7.3) * 0.12;
      float slub = noise1(pos * slubFreq + hash11(threadId) * 10.0) * slubAmp;
      float twist = sin(pos * (4.0 + hash11(threadId + 3.1)) + hash11(threadId + 1.7) * 6.28) * 0.04;
      return base + slub + twist;
    }

    vec4 generate() {
      float scale = u_weave_scale;
      vec2 uv = v_uv * scale;

      vec2 cell = floor(uv);
      vec2 local = fract(uv);

      // Determine if this cell is warp (vertical) or weft (horizontal) thread on top
      float cellParity = mod(cell.x + cell.y, 2.0);

      // Warp thread runs vertically (u direction is across thread, v along thread)
      // Weft thread runs horizontally (v direction is across thread, u along thread)

      // Thread radii â€” vary slightly per thread for organic feel
      float warpId = cell.x;
      float weftId = cell.y;

      float warpRadius = threadProfile(cell.y + local.y, warpId);
      float weftRadius = threadProfile(cell.x + local.x, weftId + 100.0);

      // Cross-section distance for each thread
      float dWarp = abs(local.x - 0.5);
      float dWeft = abs(local.y - 0.5);

      // Over-under weave: alternate which thread is on top
      float warpOnTop = step(0.5, cellParity);

      float warpMask = smoothstep(warpRadius, warpRadius - 0.04, dWarp);
      float weftMask = smoothstep(weftRadius, weftRadius - 0.04, dWeft);

      // Shadow: thread going under gets slightly darkened
      float shadow = mix(1.0, 0.78, (1.0 - warpOnTop) * warpMask * (1.0 - weftMask));
      shadow      *= mix(1.0, 0.78, warpOnTop * weftMask * (1.0 - warpMask));

      // Micro-fibre fuzz along thread edges
      float fuzz = hash21(floor(uv * 3.0)) * 0.04;

      // Colour blend: warp vs weft tones
      vec3 warpCol = u_base_color.rgb;
      vec3 weftCol = u_warp_color.rgb;
      float blend = mix(warpOnTop * warpMask, (1.0 - warpOnTop) * weftMask, 0.5);
      vec3 col = mix(weftCol, warpCol, clamp(blend + fuzz, 0.0, 1.0));

      col *= shadow;

      // Slight global irregularity
      float globalNoise = noise1(v_uv.x * scale * 0.3) * 0.04;
      col = clamp(col + globalNoise - 0.02, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_weave_scale`,type:`float`,default:18,min:4,max:40,name:`Weave Scale`},{id:`u_base_color`,type:`color`,default:[.82,.75,.58,1],name:`Warp Colour`},{id:`u_warp_color`,type:`color`,default:[.72,.64,.48,1],name:`Weft Colour`}]},Ti=s({default:()=>Ei}),Ei={id:`liquid_mercury_artisan`,name:`Liquid Mercury`,category:`Abstract`,description:`Smooth, blobby metallic shapes with high specularity mimicking liquid metal.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.45, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Blob Size`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Mercury`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.12,1]}]},Di=s({default:()=>Oi}),Oi={id:`louis_check_artisan`,name:`Louis Check`,category:`Abstract`,description:`Luxury designer-style checkered leather pattern with premium soft shading.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      float edge = smoothstep(0.45, 0.5, abs(fract(uv.x) - 0.5)) + smoothstep(0.45, 0.5, abs(fract(uv.y) - 0.5));
      return mix(u_secondary_color, u_primary_color, mask + edge * 0.2);
    }
  `,uniforms:[{id:`u_scale`,name:`Check Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Leather Dark`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Leather Tan`,type:`color`,default:[.6,.45,.35,1]}]},ki=s({default:()=>Ai}),Ai={id:`machined_wheel`,name:`Machined Wheel`,category:`Racing`,description:`CNC machined aluminum wheel face with concentric lathe rings, radial spoke shadows, and a polished centre hub.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv - 0.5;          // centre at 0,0

      float r    = length(uv);
      float ang  = atan(uv.y, uv.x); // -pi .. pi

      // ---- Concentric machining rings ----
      // Lathe produces fine, evenly spaced ridges
      float ringPhase = r * u_ring_freq;
      float ring = sin(ringPhase * 6.28318);
      // Vary slightly with micro noise (tool chatter)
      float chatter = noise(vec2(r * u_ring_freq * 0.5, ang * 3.0)) * 0.15;
      ring = ring * (1.0 - chatter) + chatter;
      ring = ring * 0.5 + 0.5;  // [0,1]

      // Polished highlight: bright crests, dark valleys
      float machinedBright = mix(0.55, 0.92, ring);

      // ---- Spoke shadow regions ----
      // Normalise angle to [0, 2pi)
      float angN  = ang + 3.14159;
      float sector = angN * u_spoke_count / 6.28318; // which spoke
      float sectorFrac = fract(sector);
      // Shadow in pocket between spokes (centre 0.5 of each sector)
      float spokeMask = abs(sectorFrac - 0.5) * 2.0; // 0 at midpoint, 1 at spoke
      float spokeShadow = smoothstep(0.3, 0.7, spokeMask);
      // Only apply beyond inner hub radius
      float hubRadius = 0.12;
      float rimRadius = 0.48;
      float spokeBlend = smoothstep(hubRadius, hubRadius + 0.06, r) *
                         smoothstep(rimRadius, rimRadius - 0.04, r);
      float shadowFactor = mix(1.0, spokeShadow * 0.55 + 0.35, spokeBlend);

      // ---- Hub: smooth polished disc ----
      float hubMask = smoothstep(hubRadius, hubRadius - 0.03, r);
      float hubGlow = 1.0 - r / hubRadius;
      float hubLight = mix(0.0, 0.85 + hubGlow * 0.15, hubMask);

      // ---- Rim lip: slightly darker ----
      float rimMask = smoothstep(rimRadius - 0.03, rimRadius, r);
      float rimDark = mix(1.0, 0.6, rimMask);

      // ---- Compose ----
      float lum = machinedBright * shadowFactor * rimDark;
      lum = mix(lum, 0.9, hubMask); // hub overrides ring texture

      // Aluminium colour — neutral with faint warm tinge
      vec3 alumColor = vec3(0.88, 0.87, 0.86);
      vec3 col = alumColor * lum;

      // Thin iridescent sheen on machined ridges
      float irid = sin(ringPhase * 6.28318 * 0.5 + ang) * 0.03;
      col += vec3(irid * 0.4, irid * 0.5, irid * 0.8) * (1.0 - hubMask);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_ring_freq`,name:`Ring Density`,type:`float`,min:10,max:60,default:30},{id:`u_spoke_count`,name:`Spoke Count`,type:`float`,min:3,max:10,default:5}]},ji=s({default:()=>Mi}),Mi={id:`macrame_knot_artisan`,name:`Macrame Knot`,category:`Abstract`,description:`Interlocking geometric square knots found in traditional fiber crafts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = smoothstep(0.4, 0.5, abs(gv.x - 0.5) + abs(gv.y - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Knot Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cotton Rope`,type:`color`,default:[.95,.9,.85,1]},{id:`u_secondary_color`,name:`Knot Deep`,type:`color`,default:[.6,.55,.5,1]}]},Ni=s({default:()=>Pi}),Pi={id:`mandala_radial_artisan`,name:`Mandala Radial`,category:`Abstract`,description:`Harmonic geometric recurrence and radial symmetry patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float d = length(uv);
      float pulses = sin(d * 40.0) * sin(angle * 8.0);
      float mask = step(0.0, pulses);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Geometry Glow`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Mental Void`,type:`color`,default:[0,0,0,1]}]},Fi=s({default:()=>Ii}),Ii={id:`mandelbrot_fractal`,name:`Mandelbrot Explorer`,category:`Abstract`,description:`Pure mathematical fractal boundary with high-precision iteration.`,shader:`
    vec4 generate() {
      vec2 c = (v_uv - 0.5) * 4.0 / u_scale - vec2(0.5, 0.0);
      vec2 z = vec2(0.0);
      float iter = 0.0;
      const float max_iter = 100.0;
      
      for(float i=0.0; i<max_iter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 2.0) break;
        iter++;
      }
      
      float mask = iter / max_iter;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Zoom Level`,type:`float`,min:1,max:20,default:2},{id:`u_primary_color`,name:`Inner Glow`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Void Depth`,type:`color`,default:[.05,0,.05,1]}]},Li=s({default:()=>Ri}),Ri={id:`maple_leaves_artisan`,name:`Maple Leaf Scatter`,category:`Natural`,description:`Randomly distributed maple leaf shapes with rotation and scale variance.`,shader:`
    float maple(vec2 p) {
      float a = atan(p.y, p.x);
      float r = length(p);
      float d = 1.0 + 0.5 * sin(5.0 * a) * (0.5 + 0.5 * sin(15.0 * a));
      return r - 0.4 * d;
    }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      
      float mask = 0.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          float n = hash(id + offset);
          vec2 p = gv - (offset + vec2(n, hash(id + offset + 1.0)) - 0.5);
          float d = maple(p * (0.8 + n * 0.4));
          mask = max(mask, smoothstep(0.01, 0.0, d));
        }
      }
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:15,default:6},{id:`u_primary_color`,name:`Leaf Color`,type:`color`,default:[1,.4,.1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.05,1]}]},zi=s({default:()=>Bi}),Bi={id:`marble_stone_artisan`,name:`Marbled Stone`,category:`Organic`,description:`Natural stone texture with randomized crystalline veins.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv + noise(uv * 2.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,1,1]},{id:`u_secondary_color`,name:`Stone Base`,type:`color`,default:[.3,.3,.35,1]}]},Vi=s({default:()=>j}),j={id:`matte_clearcoat`,name:`Matte Clearcoat`,category:`Racing`,description:`Flat/satin automotive paint finish with micro-surface grain, mimicking matte-wrapped or flat-painted race cars.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // 3-octave fBm for micro-surface tooth
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p  *= 2.1;
        a  *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // High-frequency micro-texture grain (the "tooth" of flat paint)
      float grain = fbm(uv * u_noise_scale);
      // Keep grain subtle — it's a very small surface roughness
      grain = (grain - 0.5) * 0.06;

      // Base pigment color with grain applied as a lightness nudge
      vec3 col = u_paint_color.rgb + vec3(grain);

      // Fresnel-style brightening: UV edges simulate viewing-angle curvature.
      // Map v_uv to [-1, 1] and use squared distance from center as proxy.
      vec2 centered = uv * 2.0 - 1.0;
      float edgeFactor = dot(centered, centered); // 0 at center, ~1 at corners
      edgeFactor = clamp(edgeFactor, 0.0, 1.0);

      // Satin level governs how much the Fresnel sheen shows
      float sheenAmount = u_sheen * 0.12 * edgeFactor;
      col += vec3(sheenAmount);

      // Very faint specular blob at center for satin finish
      float centralSpec = (1.0 - edgeFactor) * u_sheen * 0.05;
      col += vec3(centralSpec);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_paint_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.08,.08,.08,1]},{id:`u_noise_scale`,name:`Grain Scale`,type:`float`,min:.5,max:20,default:8},{id:`u_sheen`,name:`Satin Sheen`,type:`float`,min:0,max:1,default:.15}]},M=s({default:()=>Hi}),Hi={id:`mesh_jersey`,name:`Mesh Jersey`,category:`Industrial`,description:`Open-hole sports jersey knit mesh with rounded thread loops forming a regular grid of holes.`,shader:`
    // Smooth minimum for rounded shape merging
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Signed distance to a rounded rectangle
    float sdRoundRect(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    // Loop cross-section: a kidney/loop shaped thread path around hole
    float loopSDF(vec2 local, float holeRadius) {
      // Distance to hole border (negative = outside hole)
      float distToHole = length(local) - holeRadius;
      // Thread occupies a band around the hole
      return abs(distToHole) - 0.12;
    }

    vec4 generate() {
      float scale    = u_scale;
      float holeSize = u_hole_size;

      vec2 uv = v_uv * scale;

      // Offset every other column for jersey knit stagger
      float col = floor(uv.x);
      float rowOffset = mod(col, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x, uv.y + rowOffset);

      vec2 cell  = floor(shifted);
      vec2 local = fract(shifted) - 0.5; // [-0.5, 0.5]

      // Elliptical hole (slightly taller than wide â€” jersey stretches horizontally)
      vec2 holeScale = vec2(1.0 / (holeSize * 0.9), 1.0 / holeSize);
      float holeDist = length(local * holeScale) - 1.0;

      // Thread band around the hole
      float threadWidth = 0.22 - holeSize * 0.15;
      threadWidth = clamp(threadWidth, 0.06, 0.18);
      float thread = abs(holeDist) - threadWidth;

      // Shading: inside of loop is slightly darker (depth), top of loop is bright
      float loopShade = 1.0 - smoothstep(-0.05, 0.25, holeDist) * 0.3;

      // Specular glint along the top of each loop arc
      float angle = atan(local.y, local.x);
      float specAngle = cos(angle - 1.1);
      float specGlint = smoothstep(0.6, 1.0, specAngle) * smoothstep(threadWidth, 0.0, abs(thread)) * 0.4;

      // Thread mask
      float threadMask = 1.0 - smoothstep(-0.01, 0.02, thread);

      // Hole (transparent / background)
      float holeMask = smoothstep(-0.02, 0.02, holeDist);
      float bgMask   = 1.0 - threadMask;

      // Darken background (no thread â€” just see-through dark)
      vec3 bgCol     = u_thread_color.rgb * 0.08;
      vec3 threadCol = u_thread_color.rgb * loopShade + specGlint;

      vec3 col3 = mix(bgCol, threadCol, threadMask);

      // Slight crosshatch from neighbouring loops (ambient contact shadow)
      float shadow = 1.0 - smoothstep(0.30, 0.50, length(local)) * 0.18;
      col3 *= shadow;

      return vec4(clamp(col3, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Mesh Scale`},{id:`u_thread_color`,type:`color`,default:[.9,.9,.9,1],name:`Thread Colour`},{id:`u_hole_size`,type:`float`,default:.45,min:.2,max:.7,name:`Hole Size`}]},Ui=s({default:()=>Wi}),Wi={id:`metal_flake`,name:`Metal Flake`,category:`Racing`,description:`Automotive metallic flake base coat with dense randomly oriented aluminium flakes sparkling in a tinted binder.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash1(float n) { return fract(sin(n) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Scale UV for flake grid — u_flake_density maps to grid cells per unit
      vec2 flakeUV  = uv * u_flake_density * 0.04;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);

      float flakeLight = 0.0;

      // Check 3x3 neighbourhood so flakes near cell borders are caught
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = flakeCell + vec2(float(dx), float(dy));
          // Pseudo-random position and orientation per flake
          float rx  = hash(nc + vec2(0.13, 0.45));
          float ry  = hash(nc + vec2(0.67, 0.23));
          float ang = hash(nc + vec2(0.91, 0.55)) * 6.28318;
          float sz  = 0.25 + hash(nc + vec2(0.22, 0.88)) * 0.3;

          // Flake is a small oriented rectangle — rotate local coord
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float ca = cos(ang); float sa = sin(ang);
          vec2 rot = vec2(ca * diff.x - sa * diff.y,
                          sa * diff.x + ca * diff.y);
          // Rectangle SDF: flakes are thin slabs
          vec2 flakeHalf = vec2(sz, sz * 0.15);
          vec2 dBox = abs(rot) - flakeHalf;
          float boxDist = length(max(dBox, 0.0));
          // Bright if inside flake
          float inside = smoothstep(0.04, 0.0, boxDist);
          // Each flake has a unique reflectance based on random orientation vs. light
          float reflBias = hash(nc + vec2(1.3, 2.7));
          float brightness = pow(reflBias, 1.5) * u_flake_brightness;
          flakeLight = max(flakeLight, inside * brightness);
        }
      }

      // Binder base colour — u_base_color tinted slightly lighter for depth
      float bgVariation = noise(uv * 8.0) * 0.04;
      vec3 binder = u_base_color.rgb + vec3(bgVariation);

      // Flake colour: pure silver-white
      vec3 flakeColor = vec3(0.95, 0.95, 0.97);

      vec3 col = mix(binder, flakeColor, flakeLight * 0.9);

      // Subtle slow-varying shimmer across the whole surface (viewing angle variation)
      float shimmer = noise(uv * 2.5 + 1.5708) * 0.06;
      col += u_base_color.rgb * shimmer;

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.08,.15,.35,1]},{id:`u_flake_density`,name:`Flake Density`,type:`float`,min:200,max:2e3,default:800},{id:`u_flake_brightness`,name:`Flake Brightness`,type:`float`,min:.3,max:1.5,default:1}]},Gi=s({default:()=>Ki}),Ki={id:`micro_cells_artisan`,name:`Micro Cells`,category:`Natural`,description:`Biological cellular membranes and nuclei mimicking microscopic organic life.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.1, 0.05, abs(m_dist - 0.2));
      float nucleus = smoothstep(0.1, 0.0, m_dist);
      return mix(u_secondary_color, u_primary_color, mask + nucleus);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organelle`,type:`color`,default:[.8,.4,.6,1]},{id:`u_secondary_color`,name:`Cytoplasm`,type:`color`,default:[.1,.05,.1,1]}]},qi=s({default:()=>Ji}),Ji={id:`micro_logic_grid_artisan`,name:`Logic Array`,category:`Technology`,description:`Microscopic grid of semiconductor logic gates and data-bus structures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Gate Matrix`,type:`float`,min:10,max:200,default:80},{id:`u_primary_color`,name:`Bus Copper`,type:`color`,default:[.8,1,0,1]},{id:`u_secondary_color`,name:`Silicon Base`,type:`color`,default:[.05,.05,.1,1]}]},Yi=s({default:()=>Xi}),Xi={id:`microchip_wafer_pro`,name:`Microchip Die`,category:`Technology`,description:`High-density silicon wafer etching with localized circuit density.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 id = floor(v_uv * u_scale);
      vec2 gv = fract(v_uv * u_scale);
      
      float n = hash(id);
      float mask = step(0.8, n);
      
      // Sub-divisions
      if (n > 0.4) {
        vec2 gv2 = fract(gv * 4.0);
        mask += step(0.9, max(gv2.x, gv2.y)) * 0.5;
      }
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Wafer Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Etched Metal`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Silicon`,type:`color`,default:[.1,.1,.12,1]}]},Zi=s({default:()=>Qi}),Qi={id:`moire_silk_artisan`,name:`Moire Silk`,category:`Abstract`,description:`Water-like wavy fabric interference patterns found in heavy silk moire.`,shader:`
    vec4 generate() {
      float lines1 = sin(v_uv.x * 400.0);
      float lines2 = sin((v_uv.x + v_uv.y * 0.1) * 405.0);
      float mask = smoothstep(-0.5, 0.5, lines1 * lines2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sheen`,type:`color`,default:[.3,.35,.5,1]},{id:`u_secondary_color`,name:`Deep Silk`,type:`color`,default:[.1,.1,.2,1]}]},$i=s({default:()=>ea}),ea={id:`monstera_leaf_artisan`,name:`Monstera Split-Leaf`,category:`Natural`,description:`The iconic tropical split-leaf silhouette with decorative voids.`,shader:`
    float circle(vec2 p, float r) { return length(p) - r; }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Heart shape base
      float heart = d - (sin(a) * sqrt(abs(cos(a))) / (sin(a) + 1.4) - 2.0 * sin(a) + 2.0);
      float mask = smoothstep(0.1, 0.0, heart);
      
      // Secondary holes
      vec2 gv = fract(v_uv * u_scale * 2.0) - 0.5;
      if (length(gv) < 0.2) mask = 0.0;
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Leaf Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Foliage Color`,type:`color`,default:[0,.5,.2,1]},{id:`u_secondary_color`,name:`Negative Space`,type:`color`,default:[0,0,0,0]}]},ta=s({default:()=>na}),na={id:`morpho_iridescence_natural`,name:`Morpho Iridescence`,category:`Natural`,description:`Deep structural blue iridescence of the Morpho butterfly wing — pure nanostructure diffraction blue with fine scale-row banding and angle-dependent shimmer.`,shader:`
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)  { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // 2D smooth noise for micro-distortion
    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Wing scale rows: horizontal bands at u_scale_freq frequency
      float scaleFreq  = u_scale_freq;
      float rowY       = v_uv.y * scaleFreq;

      // Slight horizontal undulation of rows (mimics natural scale misalignment)
      float rowWaver   = smoothNoise1D(v_uv.x * 8.0) * 0.6;
      float rowLocal   = fract(rowY + rowWaver);
      float rowIndex   = floor(rowY + rowWaver);

      // Within-row brightness — each scale row is a ridge-valley structure
      // Bright at scale top, darker at row gap
      float rowBright  = smoothstep(0.0, 0.28, rowLocal) * (1.0 - smoothstep(0.72, 1.0, rowLocal));

      // Per-row tiny random brightness offset (natural variation in scale height)
      float rowVar     = 0.88 + hash11(rowIndex) * 0.24;

      // Angle-dependent shimmer: simulate view-angle dependence with UV position
      // (since we have no real normals, use distance from a "normal incidence" center)
      float dx         = v_uv.x - 0.5;
      float dy         = v_uv.y - 0.5;
      float angleFactor = 1.0 - (dx * dx + dy * dy) * 2.0 * u_shimmer;
      angleFactor      = clamp(angleFactor, 0.0, 1.0);

      // Micro-distortion noise on the diffraction (gives "depth" to the shimmer)
      float microNoise = smoothNoise2D(v_uv * 18.0) * 0.08 - 0.04;

      // Base blue from uniform, modulated by angle and row structure
      vec3 baseBlue    = u_base_blue.rgb;

      // At high angle (edges), the structural color shifts slightly toward UV (darker, more violet)
      float edgeShift  = 1.0 - angleFactor;
      vec3  violetShift = vec3(-0.03, -0.06, 0.05);  // subtle violet push at edges
      vec3  col         = baseBlue + violetShift * edgeShift;

      // Combine row modulation and angle brightness
      float brightness = rowBright * rowVar * angleFactor;
      brightness       = clamp(brightness + microNoise, 0.0, 1.0);

      col *= (0.25 + 0.75 * brightness);  // dark minimum for scale gaps

      // Specular-like shimmer band — narrow bright stripe that follows normal incidence
      float shimmerBand = exp(-40.0 * (dx * dx + dy * dy)) * u_shimmer * 0.35;
      col += baseBlue * shimmerBand;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_base_blue`,name:`Morpho Blue`,type:`color`,default:[.05,.15,.92,1]},{id:`u_scale_freq`,name:`Scale Row Frequency`,type:`float`,min:10,max:80,default:40},{id:`u_shimmer`,name:`Shimmer Intensity`,type:`float`,min:0,max:1,default:.7}]},ra=s({default:()=>ia}),ia={id:`mother_of_pearl_artisan`,name:`Mother of Pearl`,category:`Natural`,description:`Iridescent-like wavy organic noise smears mimicking biological nacre.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float m = noise(v_uv * u_scale * 2.0 + n);
      return mix(u_secondary_color, u_primary_color, m);
    }
  `,uniforms:[{id:`u_scale`,name:`Iridescence Detail`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Shell Pearl`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Shell Deep`,type:`color`,default:[.8,.85,.9,1]}]},aa=s({default:()=>oa}),oa={id:`mud_cracks_artisan`,name:`Dried Mud`,category:`Natural`,description:`High-fidelity organic polygonal fissures mimicking cracked desert earth.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.05, 0.1, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Crack Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Earth`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Fissure`,type:`color`,default:[.15,.1,.05,1]}]},sa=s({default:()=>ca}),ca={id:`mud_splatter`,name:`Mud Splatter`,category:`Racing`,description:`Dried mud and dirt splatter with organic layered blobs of varying size and opacity, typical of rally or race car bodywork.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.2; a *= 0.48; }
      return v;
    }

    // Single splatter blob centred at c with radius r
    float blob(vec2 uv, vec2 c, float r) {
      // Organic distortion via fbm
      float distort = fbm(uv * 5.0 + c * 4.3) * 0.25 * r;
      vec2 diff = uv - c;
      // Stretch in X axis slightly (horizontal splatter motion)
      diff.x *= 0.75;
      float d = length(diff) - distort;
      return smoothstep(r, r * 0.4, d);
    }

    // Small satellite droplets around a main blob
    float droplets(vec2 uv, vec2 c, float seed) {
      float acc = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang   = hash(vec2(seed + fi, 1.1)) * 6.28318;
        float dist  = 0.04 + hash(vec2(seed + fi, 2.3)) * 0.10;
        float dropR = 0.005 + hash(vec2(seed + fi, 3.7)) * 0.018;
        vec2 dropC  = c + vec2(cos(ang), sin(ang)) * dist;
        acc = max(acc, blob(uv, dropC, dropR * u_size));
      }
      return acc;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float mudTotal = 0.0;

      // Main blobs at pseudo-random positions scaled by u_density
      float count = u_density;
      // We iterate a fixed number but break early based on count via weight
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        // Weight fades blobs beyond u_density
        float weight = clamp(count - fi, 0.0, 1.0);
        if (weight < 0.001) break;

        vec2 centre = vec2(hash(vec2(fi * 1.7, 0.3)), hash(vec2(fi * 2.3, 0.8)));
        float r = (0.04 + hash(vec2(fi, 5.5)) * 0.09) * u_size;

        float b = blob(uv, centre, r) * weight;
        // Satellite drops
        float d = droplets(uv, centre, fi * 10.0 + 1.3) * weight;
        mudTotal = max(mudTotal, max(b, d));
      }

      // Thin dried mud edge — slightly lighter, more cracked looking
      float edgeNoise = fbm(uv * 20.0) * 0.1;
      float mudThick  = mudTotal;
      float mudEdge   = smoothstep(0.1, 0.4, mudThick) * (1.0 - smoothstep(0.4, 0.9, mudThick));
      mudEdge *= (0.5 + edgeNoise);

      // Mud colour variation — darker wet centre, lighter dried edge
      vec3 mudDark  = u_mud_color.rgb * 0.6;
      vec3 mudLight = mix(u_mud_color.rgb, vec3(0.55, 0.48, 0.36), 0.5);
      vec3 mudCol   = mix(mudLight, mudDark, smoothstep(0.3, 0.9, mudThick));
      mudCol = mix(mudCol, mudLight * 1.2, mudEdge);

      // Substrate
      float subGrain = noise(uv * 80.0) * 0.03;
      vec3 subCol = u_substrate.rgb + vec3(subGrain);

      vec3 col = mix(subCol, mudCol, mudTotal * 0.95);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_mud_color`,name:`Mud Color`,type:`color`,default:[.3,.22,.12,1]},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.15,.13,.12,1]},{id:`u_density`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_size`,name:`Blob Size`,type:`float`,min:.5,max:3,default:1}]},la=s({default:()=>ua}),ua={id:`multi_env_camo`,name:`Multi-Environment Camo`,category:`Organic`,description:`An advanced shader that uses smooth gradients and soft blending between layers rather than hard edges, creating a highly modern, versatile camouflage.`,shader:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(12.3, 4.5));
      float n3 = fbm(uv * 2.0 + vec2(33.1, 11.2));
      
      // Use smoothstep to create smooth gradient transitions instead of hard cuts
      float blend1 = smoothstep(-0.2, 0.4, n1);
      float blend2 = smoothstep(0.1, 0.6, n2);
      float blend3 = smoothstep(0.2, 0.7, n3);
      
      vec4 color = mix(u_color_base, u_color_1, blend1);
      color = mix(color, u_color_2, blend2);
      
      // Add smaller, sharper dark/light accents
      float n4 = snoise(uv * 4.0);
      float n5 = snoise(uv * 4.0 + vec2(50.0));
      
      if (n4 > 0.5) {
          color = mix(color, u_color_3, smoothstep(0.5, 0.7, n4));
      }
      if (n5 > 0.6) {
          color = mix(color, u_color_4, smoothstep(0.6, 0.8, n5));
      }
      
      return color;
    }
  `,variants:[{name:`Arid (Default)`,uniforms:{u_color_base:[.65,.6,.5,1],u_color_1:[.55,.5,.4,1],u_color_2:[.45,.4,.35,1],u_color_3:[.3,.25,.2,1],u_color_4:[.8,.75,.65,1]}},{name:`Tropic`,uniforms:{u_color_base:[.35,.45,.25,1],u_color_1:[.25,.35,.15,1],u_color_2:[.15,.25,.1,1],u_color_3:[.05,.15,.05,1],u_color_4:[.55,.65,.4,1]}},{name:`Alpine`,uniforms:{u_color_base:[.85,.85,.9,1],u_color_1:[.7,.7,.75,1],u_color_2:[.55,.55,.6,1],u_color_3:[.3,.3,.35,1],u_color_4:[.95,.95,1,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.09,.09,.09,1],u_color_3:[.05,.05,.05,1],u_color_4:[.25,.25,.25,1]}}],uniforms:[{id:`u_scale`,name:`Blend Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.6,.5,1]},{id:`u_color_1`,name:`Gradient 1`,type:`color`,default:[.55,.5,.4,1]},{id:`u_color_2`,name:`Gradient 2`,type:`color`,default:[.45,.4,.35,1]},{id:`u_color_3`,name:`Dark Accent`,type:`color`,default:[.3,.25,.2,1]},{id:`u_color_4`,name:`Light Accent`,type:`color`,default:[.8,.75,.65,1]}]},da=s({default:()=>fa}),fa={id:`mushroom_gills_artisan`,name:`Fungi Gills`,category:`Nature`,description:`Radiant organic ridges found on the underside of exotic fungal caps.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float gills = sin(angle * u_scale);
      float mask = step(0.0, gills);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Gill Count`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gill Ridge`,type:`color`,default:[.8,.75,.7,1]},{id:`u_secondary_color`,name:`Cap Depth`,type:`color`,default:[.4,.35,.3,1]}]},pa=s({default:()=>N}),N={id:`mylar_heatshield`,name:`Mylar Heat Shield`,category:`Racing`,description:`Crinkled mylar or aluminium heat shield foil with bright specular hotspots and crinkle shadow valleys.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_mh(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_mh(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_mh(i);
      float b = hash1_mh(i + vec2(1.0, 0.0));
      float c = hash1_mh(i + vec2(0.0, 1.0));
      float d = hash1_mh(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for wrinkle surface
    float fbm_mh(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_mh(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    // Approximate gradient of FBM for surface normal
    vec2 fbm_gradient(vec2 p) {
      float eps = 0.02;
      float dx = fbm_mh(p + vec2(eps, 0.0)) - fbm_mh(p - vec2(eps, 0.0));
      float dy = fbm_mh(p + vec2(0.0, eps)) - fbm_mh(p - vec2(0.0, eps));
      return vec2(dx, dy) / (2.0 * eps);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Crinkle noise coordinates — scaled by crinkle intensity
      vec2 crinkleUV = uv * u_crinkle;

      // Height field from FBM
      float height = fbm_mh(crinkleUV);

      // Surface gradient — used as a fake normal perturbation
      vec2 grad = fbm_gradient(crinkleUV);

      // Perturbed "normal" in 2D (we simulate a z component)
      // Normal direction: (-grad.x, -grad.y, 1.0) normalized approximately
      float normal_z = 1.0 / sqrt(1.0 + dot(grad, grad) * 0.5);
      float normal_x = -grad.x * normal_z * 0.4;
      float normal_y = -grad.y * normal_z * 0.4;

      // Light direction — coming from upper-left (simulated environment)
      vec3 light_dir = normalize(vec3(0.4, 0.6, 1.0));
      vec3 n = normalize(vec3(normal_x, normal_y, normal_z));
      float ndotl = clamp(dot(n, light_dir), 0.0, 1.0);

      // Environment: bright sky gradient from above
      float sky_env = clamp(0.5 + 0.5 * normal_y, 0.0, 1.0);

      // Specular reflection — approximate mirror highlight
      vec3 view_dir = vec3(0.0, 0.0, 1.0);
      vec3 reflect_dir = vec3(-normal_x * 2.0, -normal_y * 2.0, 1.0);
      float spec_raw = clamp(reflect_dir.z, 0.0, 1.0);
      float spec = pow(spec_raw, 18.0) * u_reflectivity;

      // Foil base color
      vec3 foil = u_foil_color.rgb;
      // Shadow color: dark version of foil
      vec3 shadow_col = foil * 0.15;
      // Bright highlight: near white with foil tint
      vec3 highlight_col = mix(foil, vec3(1.0, 1.0, 1.0), 0.7);

      // Compose: diffuse bounce + specular hotspot
      vec3 col = mix(shadow_col, foil, ndotl);
      // Sky environment adds secondary bounce
      col = mix(col, foil * 1.1, sky_env * 0.25);
      // Specular hotspot is bright white
      col += highlight_col * spec;

      // Height-based crinkle texture: ridges catch more light
      float ridge = smoothstep(0.45, 0.65, height);
      col = mix(col, foil * 1.2, ridge * 0.15);

      // Micro-sheen: fine dimple structure
      float micro = smoothnoise_mh(uv * 80.0 * u_crinkle);
      col += (micro - 0.5) * 0.04;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_foil_color`,name:`Foil Color`,type:`color`,default:[.92,.75,.25,1]},{id:`u_crinkle`,name:`Crinkle Intensity`,type:`float`,min:1,max:10,default:4},{id:`u_reflectivity`,name:`Highlight Brightness`,type:`float`,min:.3,max:2,default:1.4}]},ma=s({default:()=>ha}),ha={id:`nanotech_cells_artisan`,name:`Nano Plating`,category:`Technology`,description:`Microscopic hexagonal active plating designed for dynamic aerodynamic surfaces.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Nano Zoom`,type:`float`,min:10,max:100,default:60},{id:`u_primary_color`,name:`Plate Surface`,type:`color`,default:[.15,.15,.18,1]},{id:`u_secondary_color`,name:`Nano Joint`,type:`color`,default:[0,.8,1,1]}]},ga=s({default:()=>_a}),_a={id:`nappa_leather_artisan`,name:`Nappa Leather`,category:`Racing`,description:`Smooth premium leather grain with subtle organic pores found in high-end bucket seats.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Zoom`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Deep`,type:`color`,default:[.05,.05,.05,1]}]},va=s({default:()=>ya}),ya={id:`nebula_dust_artisan`,name:`Nebula Dust`,category:`Natural`,description:`Soft, colored organic dust clouds found in interstellar gas formations.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n += noise(v_uv * u_scale * 2.0) * 0.5;
      float mask = smoothstep(0.2, 0.8, n / 1.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Gas Density`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Ionized Gas`,type:`color`,default:[.6,.1,.8,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},ba=s({default:()=>xa}),xa={id:`neon_tubes_artisan`,name:`Neon Path`,category:`Abstract`,description:`Glowing tubular neon paths mimicking high-fidelity urban lighting rigs.`,shader:`
    vec4 generate() {
      float y = fract(v_uv.y * u_scale);
      float mask = smoothstep(0.1, 0.2, y) * smoothstep(0.9, 0.8, y);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tube Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Neon Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Vacuum Background`,type:`color`,default:[.05,0,.05,1]}]},Sa=s({default:()=>Ca}),Ca={id:`neoprene`,name:`Neoprene`,category:`Industrial`,description:`Dense rubber neoprene with a characteristic small-cell foam surface texture and slightly glossy matte finish, as used in wetsuits and padding.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Worley nearest-cell distance for foam cells
    float worley(vec2 uv, float scale) {
      vec2 scaled = uv * scale;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(4.1, 2.7)), hash(nc + vec2(8.3, 5.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.65;
          float d = length(scaled - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Cell distance field — each cell is a foam bubble
      float cell = worley(uv, u_cell_size);

      // Cell walls are darker; cell centres are lighter (puffy/raised)
      // Invert: low distance = near wall = dark; high = centre = light
      float cellLight = smoothstep(0.0, 0.45, cell);

      // Subtle secondary micro-bump — smaller cells overlaid
      float micro = worley(uv, u_cell_size * 3.5) * 0.25;

      // Combined height map
      float height = cellLight * 0.75 + micro * 0.25;

      // Base colour modulated by height (puffy top catches more light)
      vec3 col = u_base_color.rgb * mix(0.55, 1.15, height);

      // Cell wall shadow — add slight blue-grey tint in valleys
      float wallShadow = (1.0 - cellLight) * 0.08;
      col -= vec3(wallShadow * 0.4, wallShadow * 0.4, wallShadow * 0.3);

      // Glossy sheen — specular highlight near the top of each bump
      // Approximate: bright where height is near peak
      float specMask = pow(max(0.0, cellLight - 0.6) / 0.4, 2.0);
      float sheen = specMask * u_sheen * 0.4;
      col += vec3(sheen * 0.9, sheen * 0.95, sheen);

      // Surface-level noise for slight material variation
      float surfVar = noise(uv * u_cell_size * 8.0) * 0.04 - 0.02;
      col += vec3(surfVar);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_cell_size`,name:`Cell Size`,type:`float`,min:5,max:40,default:18},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.3}]},wa=s({default:()=>Ta}),Ta={id:`neural_net_artisan`,name:`Neural Network`,category:`Technology`,description:`Interconnected nodes and synthetic logic lines mimicking artificial intelligence structures.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.05, 0.0, abs(m_dist - 0.2));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Node Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Synapse`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Neural Base`,type:`color`,default:[.01,.02,.05,1]}]},Ea=s({default:()=>Da}),Da={id:`nomex_weave`,name:`Nomex Fire Suit Weave`,category:`Racing`,description:`FIA-grade Nomex aramid weave as found on fire suits, helmet liners, and race car interiors. Tight 2/1 diagonal twill structure.`,shader:`
    float hash_nw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Slight diagonal — Nomex is woven at ~30° off horizontal
      float ang = u_angle * 0.5236 + 0.5236; // range ~30°-60°
      float ca = cos(ang), sa = sin(ang);
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2/1 twill: each warp thread goes over 2 weft then under 1
      float row    = mod(cid.y, 3.0);
      float col_   = mod(cid.x, 3.0);
      float warpTop = step(0.01, mod(col_ + row, 3.0) - 0.99);

      // Narrow fiber profiles — Nomex has a tight, fine weave
      float fR = 0.38;
      float fE = 0.055;
      float warpP = smoothstep(fR, fR - fE, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fE, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Sheen along fiber axis
      float warpSheen = max(0.0, 1.0 - abs(cell.x - 0.5) * 3.5) * warpP;
      float weftSheen = max(0.0, 1.0 - abs(cell.y - 0.5) * 3.5) * weftP;
      float topSheen  = mix(weftSheen, warpSheen, warpTop) * 0.18;

      // Fine strand variation
      float strand = hash_nw(cid) * 0.04 - 0.02;

      float fiber = topP * (0.85 + strand) + btmP * 0.45 + topSheen;

      // Nomex colour: cream/golden-tan base
      vec3 base  = u_fiber_color.rgb;
      vec3 shadow = base * 0.40;
      vec3 col   = mix(shadow, base, fiber);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:90,min:30,max:220},{id:`u_angle`,name:`Weave Angle`,type:`float`,default:.5,min:0,max:1},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.92,.84,.62,1]}]},Oa=s({default:()=>ka}),ka={id:`obsidian_fracture_artisan`,name:`Obsidian Flow`,category:`Geology`,description:`Sharp, mirror-like volcanic glass fractures found in fresh obsidian flows.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(floor(v_uv * u_scale));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fracture Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Glass High`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Glass Shore`,type:`color`,default:[0,0,0,1]}]},Aa=s({default:()=>ja}),ja={id:`oil_canvas_artisan`,name:`Oil Canvas Strokes`,category:`Abstract`,description:`Directional brush-stroke noise mimicking thick oil paint on canvas.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv.y * 50.0) + vec2(floor(uv.x * 2.0), 0.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Canvas Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Paint Color`,type:`color`,default:[.6,.1,.2,1]},{id:`u_secondary_color`,name:`Canvas Weave`,type:`color`,default:[.8,.75,.7,1]}]},Ma=s({default:()=>Na}),Na={id:`oil_slick`,name:`Oil Slick`,category:`Natural`,description:`Thin-film oil interference on wet dark tarmac — rainbow iridescence bands in sinuous organic puddles.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_os(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_os(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_os(i);
      float b = hash1_os(i + vec2(1.0, 0.0));
      float c = hash1_os(i + vec2(0.0, 1.0));
      float d = hash1_os(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // 3-octave FBM
    float fbm_os(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 3; i++) {
        v += a * smoothnoise_os(p * s);
        s *= 2.1;
        a *= 0.48;
      }
      return v;
    }

    // HSV-style hue to RGB (GLSL 1.0 compatible, no ES3)
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Animated noise coordinates
      vec2 noiseUV = uv * u_band_scale + vec2(1.5708 * 0.02, 1.5708 * 0.015);

      // Thickness map — two FBM layers for complexity
      float thickness1 = fbm_os(noiseUV);
      float thickness2 = fbm_os(noiseUV * 1.7 + vec2(5.3, 2.1));
      float thickness  = thickness1 * 0.65 + thickness2 * 0.35;

      // Puddle mask — wetness controls coverage
      // Use a separate low-freq noise as a coverage mask
      float puddle_mask = fbm_os(uv * u_band_scale * 0.4 + vec2(3.7, 8.2));
      float wet_mask = smoothstep(1.0 - u_wetness, 1.0 - u_wetness * 0.3, puddle_mask);
      wet_mask = clamp(wet_mask, 0.0, 1.0);

      // Map thickness to hue — full rainbow cycle
      // Shift hue with time for slow drift
      float hue = fract(thickness * 1.2 + 1.5708 * 0.04);
      vec3 iridescent = hue2rgb(hue);

      // Thin-film intensity: brighter at mid-thickness, dimmer at edges
      float film_intensity = smoothstep(0.1, 0.4, thickness) * smoothstep(1.0, 0.6, thickness);
      film_intensity *= u_iridescence * wet_mask;

      // Wet tarmac base: very dark blue-black
      vec3 tarmac_dry = vec3(0.10, 0.10, 0.11);
      // Wet darkens and adds slight grey-blue sheen
      vec3 tarmac_wet = vec3(0.04, 0.04, 0.05);
      vec3 base = mix(tarmac_dry, tarmac_wet, wet_mask * 0.7);

      // Slight specular highlight on wet surface
      float spec_noise = smoothnoise_os(uv * 18.0 + vec2(1.5708 * 0.1));
      float spec = pow(clamp(spec_noise, 0.0, 1.0), 6.0) * wet_mask * 0.12;

      // Additive iridescence on top of base
      vec3 col = base + iridescent * film_intensity * 0.7 + spec;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_band_scale`,name:`Band Scale`,type:`float`,min:1,max:10,default:3},{id:`u_iridescence`,name:`Color Intensity`,type:`float`,min:0,max:2,default:1.2},{id:`u_wetness`,name:`Puddle Coverage`,type:`float`,min:0,max:1,default:.8}]},Pa=s({default:()=>Fa}),Fa={id:`oil_stain`,name:`Oil Stain`,category:`Industrial`,description:`Dark oil and grease stains on a concrete substrate with irregular pooling and thin-film iridescence at dried edges.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // Thin-film iridescence: maps a value [0-1] to an RGB rainbow
    vec3 thinFilm(float t) {
      float r = 0.5 + 0.5 * sin(6.28318 * (t + 0.00));
      float g = 0.5 + 0.5 * sin(6.28318 * (t + 0.33));
      float b = 0.5 + 0.5 * sin(6.28318 * (t + 0.67));
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float totalStain = 0.0;
      float totalEdge  = 0.0;

      // Accumulate multiple stain blobs placed pseudo-randomly
      for (int i = 0; i < 8; i++) {
        if (float(i) >= u_stain_count) break;
        float fi = float(i);
        // Each stain has a random centre
        vec2 centre = vec2(hash(vec2(fi, 0.3)), hash(vec2(fi, 0.7)));
        vec2 diff   = uv - centre;
        // Stretch stain slightly (oil pools are flatter)
        diff.x *= 1.4;
        float dist = length(diff);
        // Organic boundary via fbm
        float boundary = fbm(uv * 4.0 + centre * 7.0) * 0.18;
        float radius   = 0.12 + hash(vec2(fi, 1.1)) * 0.15 + boundary;
        float stain    = smoothstep(radius, radius * 0.5, dist);
        // Opacity darkens toward centre (oil thicker there)
        float depth    = stain * stain;
        totalStain = max(totalStain, depth);
        // Edge ring for iridescence — thin shell just outside stain
        float edgeW  = 0.035;
        float edgeMask = smoothstep(radius - edgeW, radius, dist) *
                         smoothstep(radius + edgeW, radius, dist);
        totalEdge = max(totalEdge, edgeMask);
      }

      // Substrate concrete
      float concGrain = fbm(uv * 18.0) * 0.06;
      vec3 subCol = u_substrate.rgb + vec3(concGrain);

      // Oil colour — very dark, near black, slight brown-green tint
      vec3 oilDark  = vec3(0.04, 0.035, 0.03);
      vec3 oilLight = vec3(0.10, 0.09,  0.07);
      vec3 oilColor = mix(oilDark, oilLight, 1.0 - totalStain);

      vec3 col = mix(subCol, oilColor, totalStain * 0.92);

      // Thin-film iridescent edge
      float filmT = noise(uv * 12.0 + 1.5708 * 0.01) * 0.5;
      vec3 film = thinFilm(filmT);
      col = mix(col, col * 0.5 + film * 0.55, totalEdge * 0.7);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_stain_count`,name:`Stain Count`,type:`float`,min:1,max:8,default:3},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.25,.23,.22,1]}]},Ia=s({default:()=>La}),La={id:`olive_branch_artisan`,name:`Olive Branch`,category:`Natural`,description:`Symmetrical leaf layering along a spine, symbolizing peace and precision.`,shader:`
    float leaf(vec2 p) {
      p = abs(p);
      return max(length(p - vec2(0.0, 0.2)), length(p + vec2(0.0, 0.2))) - 0.3;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float spine = step(abs(uv.x - 0.5), 0.005);
      
      float leafMask = 0.0;
      for(float i=0.0; i<10.0; i++) {
        vec2 p = uv - vec2(0.5, i * 0.1);
        if (mod(i, 2.0) == 0.0) p.x += 0.1; else p.x -= 0.1;
        leafMask = max(leafMask, smoothstep(0.1, 0.05, leaf(p * 15.0)));
      }
      
      float mask = max(spine, leafMask);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Branch Length`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Branch Color`,type:`color`,default:[.4,.5,.2,1]},{id:`u_secondary_color`,name:`Base`,type:`color`,default:[.05,.05,.02,1]}]},Ra=s({default:()=>za}),za={id:`origami_fold`,name:`Origami Fold`,category:`Geometric`,description:`Origami crease pattern with radiating mountain and valley fold lines on cream paper.`,shader:`
    // Distance from point p to infinite line through a and b
    float lineDistance(vec2 p, vec2 a, vec2 b) {
      vec2 ab = b - a;
      vec2 ap = p - a;
      float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
      return length(ap - ab * t);
    }

    // Hash for deterministic fold point placement
    float hash11(float n) {
      return fract(sin(n) * 43758.5453);
    }
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Distance to a crease line from a given fold point, radiating at angle theta
    float creaseLine(vec2 uv, vec2 origin, float angle, float lineWidth) {
      vec2 dir = vec2(cos(angle), sin(angle));
      vec2 p = uv - origin;
      float para  = dot(p, dir);
      float perp  = abs(dot(p, vec2(-dir.y, dir.x)));
      // Only draw the ray (half-line), not full infinite line
      float rayMask = step(0.0, para);
      return perp * rayMask + (1.0 - rayMask) * 9999.0;
    }

    vec4 generate() {
      float complexity = u_complexity;
      vec3  paper  = u_paper_color.rgb;
      vec3  crease = u_crease_color.rgb;

      vec2 uv = v_uv;

      // Number of fold point sources â€” driven by complexity
      int numPoints = int(clamp(complexity * 2.0 + 1.0, 1.0, 11.0));

      float minCreaseDist = 9999.0;
      float creaseAngle   = 0.0;

      // For each fold point, radiate several crease lines
      for (int i = 0; i < 11; i++) {
        if (i >= numPoints) break;
        float fi = float(i);

        // Deterministic fold origin on canvas
        vec2 origin = vec2(
          hash11(fi * 3.71 + 1.0),
          hash11(fi * 5.13 + 2.0)
        );

        // Number of radiating folds from this point
        int numRays = int(3.0 + floor(hash11(fi * 7.0) * complexity * 1.5));
        numRays = min(numRays, 7);

        for (int j = 0; j < 7; j++) {
          if (j >= numRays) break;
          float fj = float(j);
          float baseAngle = hash11(fi * 13.0 + fj * 3.0) * 6.2831;
          float angle = baseAngle;

          // Mountain fold: every other ray
          float isMountain = step(0.5, hash11(fi * 2.1 + fj));

          float d = creaseLine(uv, origin, angle, 0.002);

          if (d < minCreaseDist) {
            minCreaseDist = d;
            creaseAngle   = isMountain;
          }
        }
      }

      // Base paper texture â€” very slight mottled grain
      float grain = (hash21(uv * 180.0) - 0.5) * 0.025;

      // Crease line width (thinner for high complexity)
      float creaseWidth = 0.003 / clamp(complexity * 0.4, 0.5, 2.0);

      float creaseMask  = 1.0 - smoothstep(creaseWidth * 0.5, creaseWidth * 1.5, minCreaseDist);

      // Shadow on valley fold side (slight gradient perpendicular to crease)
      float shadowWidth = creaseWidth * 5.0;
      float foldShadow  = smoothstep(shadowWidth, 0.0, minCreaseDist) * (1.0 - creaseAngle) * 0.18;

      // Light on mountain fold side
      float foldLight   = smoothstep(shadowWidth, 0.0, minCreaseDist) * creaseAngle * 0.10;

      vec3 paperGrain = paper + grain;
      vec3 col = paperGrain;
      col -= foldShadow;       // valley shadow
      col += foldLight;        // mountain highlight
      col = mix(col, crease, creaseMask);  // dark crease line itself

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_complexity`,type:`float`,default:2.5,min:1,max:5,name:`Complexity`},{id:`u_paper_color`,type:`color`,default:[.96,.94,.9,1],name:`Paper Colour`},{id:`u_crease_color`,type:`color`,default:[.55,.5,.45,1],name:`Crease Colour`}]},Ba=s({default:()=>Va}),Va={id:`paint_chips`,name:`Paint Chips`,category:`Industrial`,description:`Chipped and scratched paint surface revealing bare metal substrate through irregular chips and long directional scratches.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash1(float n) { return fract(sin(n) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.3; a *= 0.48; }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_chip_density;

      // ---- Voronoi-ish chip mask ----
      vec2 cell = floor(uv);
      vec2 local = fract(uv);
      float chipMask = 1.0; // 1 = paint intact

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash(nc + vec2(0.3, 0.7)), hash(nc + vec2(0.8, 0.2)));
          // Random chip centre within this cell
          vec2 chipPos = vec2(float(dx), float(dy)) + rnd;
          vec2 diff = local - chipPos;
          // Elliptical chip shape with fbm edge distortion
          float distort = fbm(nc * 3.1 + diff * 2.0) * 0.35;
          float d = length(diff * vec2(1.0 + distort, 0.7 + distort * 0.5));
          // Chip radius random per cell
          float chipR = 0.15 + hash(nc + 5.0) * 0.28;
          chipMask = min(chipMask, smoothstep(chipR - 0.04, chipR, d));
        }
      }

      // ---- Long directional scratches ----
      float scratchUV = v_uv.y * u_chip_density * 8.0;
      float scrLine   = noise(vec2(v_uv.x * u_chip_density * 60.0, scratchUV));
      float scrLine2  = noise(vec2(v_uv.x * u_chip_density * 80.0 + 7.3, scratchUV * 0.7));
      float scratch   = smoothstep(0.82, 0.86, scrLine) + smoothstep(0.85, 0.88, scrLine2);
      scratch = clamp(scratch, 0.0, 1.0);
      // Scratches cut through paint partially (shallow — show primer grey)
      vec4 scratchColor = vec4(mix(u_paint_color.rgb, vec3(0.35, 0.33, 0.32), 0.7), 1.0);

      // ---- Compose layers ----
      // Deep chip — bare metal
      vec4 col = mix(u_base_color, u_paint_color, chipMask);
      // Scratch over top
      col = mix(col, scratchColor, scratch * chipMask);

      // Slight paint edge highlight at chip boundary
      float chipEdge = smoothstep(0.0, 0.04, 1.0 - chipMask) * smoothstep(0.0, 0.04, chipMask);
      col.rgb += vec3(chipEdge * 0.12);

      // Paint surface micro variation
      float paintGrain = noise(v_uv * 300.0) * 0.04;
      col.rgb = mix(col.rgb, col.rgb + paintGrain, chipMask);

      col.a = u_opacity;
      return clamp(col, 0.0, 1.0);
    }
  `,uniforms:[{id:`u_chip_density`,name:`Chip Density`,type:`float`,min:1,max:20,default:8},{id:`u_base_color`,name:`Metal Substrate`,type:`color`,default:[.15,.15,.18,1]},{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.3,.05,.05,1]}]},Ha=s({default:()=>Ua}),Ua={id:`palm_fronds_artisan`,name:`Palm Fronds`,category:`Natural`,description:`Fan-like radial leaf structures found in tropical palm trees.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = atan(uv.y, uv.x);
      float r = length(uv);
      
      float frond = sin(a * 15.0) * step(r, 1.0) * step(0.1, r);
      float mask = smoothstep(0.0, 0.1, frond);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Frond Length`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Palm Leaf`,type:`color`,default:[.1,.6,.2,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[0,0,0,1]}]},Wa=s({default:()=>Ga}),Ga={id:`paper_tear_artisan`,name:`Aggressive Tear`,category:`Abstract`,description:`High-intensity directional shreds and jagged ruptures mimicking ripped metal or heavy cardstock.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p); p *= 2.0; a *= 0.5;
      }
      return v;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Directional shred math
      float shred = fbm(uv * vec2(1.0, 5.0) + fbm(uv * 2.0) * u_intensity);
      float mask = smoothstep(0.4, 0.5, shred);
      
      // Add jaggedness to the edge
      float jagged = fbm(uv * 15.0) * 0.2;
      mask = smoothstep(0.4 + jagged, 0.5 + jagged, shred);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shred Scale`,type:`float`,min:1,max:10,default:3},{id:`u_intensity`,name:`Aggression`,type:`float`,min:.1,max:5,default:2},{id:`u_primary_color`,name:`Top Layer`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Deep Tear`,type:`color`,default:[.95,.95,.95,1]}]},Ka=s({default:()=>qa}),qa={id:`pcb_traces_v3_artisan`,name:`Pro PCB Logic`,category:`Technology`,description:`Triple-layer circuit logic with advanced bus-routing and microscopic trace detail.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = step(0.1, abs(lines));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Trace Copper`,type:`color`,default:[1,.6,.1,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[0,.15,.05,1]}]},Ja=s({default:()=>Ya}),Ya={id:`peacock_eyes_artisan`,name:`Peacock Eyes`,category:`Natural`,description:`Ornate organic pattern mimicking the "eyes" found in peacock feathers.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      vec4 col = u_secondary_color;
      col = mix(col, u_primary_color, smoothstep(0.4, 0.35, d));
      col = mix(col, vec4(0.0, 0.0, 0.5, 1.0), smoothstep(0.25, 0.2, d));
      col = mix(col, vec4(0.0, 1.0, 1.0, 1.0), smoothstep(0.1, 0.05, d));
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Eye Count`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Eye Border`,type:`color`,default:[.1,.8,.3,1]},{id:`u_secondary_color`,name:`Feather Base`,type:`color`,default:[.05,.2,.05,1]}]},Xa=s({default:()=>Za}),Za={id:`pearl_flake_paint`,name:`Pearl Flake Paint`,category:`Racing`,description:`Iridescent pearl automotive paint with hue-shifting colour across the surface and fine mica flake shimmer.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Hue rotation applied to an RGB colour
    vec3 rotateHue(vec3 col, float shift) {
      // Convert to approximate YIQ, rotate chroma
      float Y  =  dot(col, vec3(0.299,  0.587,  0.114));
      float I  =  dot(col, vec3(0.596, -0.274, -0.321));
      float Q  =  dot(col, vec3(0.211, -0.523,  0.311));
      float ang = shift * 6.28318;
      float ca = cos(ang); float sa = sin(ang);
      float Ir = I * ca - Q * sa;
      float Qr = I * sa + Q * ca;
      return clamp(vec3(
        Y + 0.956 * Ir + 0.621 * Qr,
        Y - 0.272 * Ir - 0.647 * Qr,
        Y - 1.107 * Ir + 1.705 * Qr), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Hue shift map — smooth spatial variation simulating viewing angle
      float shiftNoise = noise(uv * 3.0 + 1.5708 * 0.02);
      shiftNoise += noise(uv * 6.0 + 1.7) * 0.4;
      shiftNoise /= 1.4;
      float hueShift = (shiftNoise * 2.0 - 1.0) * u_shift_amount * 0.35;

      // Pearl base shifted
      vec3 pearlBase = rotateHue(u_base_color.rgb, hueShift);

      // Mica flake layer — tiny hexagonal-ish cells
      vec2 flakeUV   = uv * u_flake_density * 0.02;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);
      float micaBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = flakeCell + vec2(float(dx), float(dy));
          float rx = hash(nc + vec2(0.17, 0.53));
          float ry = hash(nc + vec2(0.74, 0.29));
          float reflectance = hash(nc + vec2(0.33, 0.81));
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float d   = length(diff);
          float sz  = 0.25 + hash(nc + vec2(0.5, 0.1)) * 0.2;
          float inside = smoothstep(sz, sz * 0.6, d);
          micaBright = max(micaBright, inside * pow(reflectance, 2.0));
        }
      }

      // Mica flake colour: slightly iridescent — pull from the opposite hue shift
      vec3 micaColor = rotateHue(vec3(0.98, 0.97, 0.95), -hueShift * 0.5);

      vec3 col = mix(pearlBase, micaColor, micaBright * 0.7);

      // Soft gloss gradient to simulate environmental reflection
      float gloss = pow(1.0 - abs(uv.x - 0.5) * 2.0, 2.0) * 0.12;
      col += vec3(gloss);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.95,.93,.9,1]},{id:`u_shift_amount`,name:`Colour Shift`,type:`float`,min:0,max:1,default:.4},{id:`u_flake_density`,name:`Mica Density`,type:`float`,min:100,max:1e3,default:400}]},Qa=s({default:()=>$a}),$a={id:`peat_moss_artisan`,name:`Peat Moss`,category:`Nature`,description:`Dense organic clumpy sprawl mimicking professional landscape and high-fidelity vegetation.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Moss Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Moss High`,type:`color`,default:[.3,.4,.2,1]},{id:`u_secondary_color`,name:`Moss Deep`,type:`color`,default:[.1,.15,.05,1]}]},eo=s({default:()=>to}),to={id:`penrose_tiling_artisan`,name:`Penrose Mesh`,category:`Abstract`,description:`Aperiodic, non-repeating tiling lines mimicking complex mathematical quasicrystal structures.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = 0.62831853; // 2pi/10
      float d = 0.0;
      for (int i=0; i<5; i++) {
        vec2 dir = vec2(cos(float(i)*a), sin(float(i)*a));
        d += step(0.9, fract(dot(uv, dir)));
      }
      return mix(u_secondary_color, u_primary_color, clamp(d, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Penrose Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Tiling Line`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.1,1]}]},no=s({default:()=>ro}),ro={id:`perforated_leather`,name:`Perforated Leather`,category:`Industrial`,description:`Smooth leather with a regular diamond punched-hole pattern over a contrasting backing, as used in racing seats and steering wheel grips.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Fine leather grain — long micro scratches aligned roughly horizontally
    float leatherGrain(vec2 uv) {
      float g1 = noise(vec2(uv.x * 80.0, uv.y * 12.0));
      float g2 = noise(vec2(uv.x * 160.0, uv.y * 8.0 + 3.1));
      return g1 * 0.6 + g2 * 0.4;
    }

    // Diamond grid: offset every other row to form a diamond lattice
    vec2 diamondCell(vec2 uv, float density) {
      vec2 scaled = uv * density;
      // Offset alternating rows by 0.5 in X
      float row = floor(scaled.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 cell = fract(vec2(scaled.x + xOffset, scaled.y));
      // Distance to cell centre
      return abs(cell - 0.5);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Get diamond cell local coords
      vec2 dc = diamondCell(uv, u_hole_density);

      // Diamond hole shape: use Chebyshev / rotated L-inf to get a diamond
      // Rotate local coords 45 degrees
      vec2 rot45 = vec2(dc.x + dc.y, dc.y - dc.x) * 0.7071;
      float holeDist = max(abs(rot45.x), abs(rot45.y));

      // Hole threshold from u_hole_size (0.2–0.7 of half-cell)
      float holeRadius = u_hole_size * 0.5;

      // 1 = inside hole, 0 = leather surface
      float inHole = step(holeDist, holeRadius * 0.5);

      // Soft inner edge bevel — gives a punched-through look
      float bevel = smoothstep(holeRadius * 0.5, holeRadius * 0.5 - 0.015, holeDist);

      // Leather grain texture
      float grain = leatherGrain(uv);
      float grainMod = mix(0.88, 1.08, grain);

      // Leather colour
      vec3 leatherCol = u_leather_color.rgb * grainMod;

      // Subtle sheen on leather — soft specular blob
      float sheen = exp(-pow(length(uv - vec2(0.3, 0.35)) * 3.5, 2.0)) * 0.12;
      leatherCol += vec3(sheen * 0.6, sheen * 0.5, sheen * 0.4);

      // Bevel darkens the edge of the hole (punch shadow)
      vec3 bevelColor = leatherCol * 0.55;

      // Combine: backing where hole, bevel at edge, leather elsewhere
      vec3 col = mix(leatherCol, bevelColor, (1.0 - bevel) * (1.0 - inHole) * step(holeDist, holeRadius * 0.5 + 0.03));
      col = mix(col, u_backing_color.rgb, inHole);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_hole_density`,name:`Hole Density`,type:`float`,min:4,max:30,default:14},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.7,default:.45},{id:`u_leather_color`,name:`Leather Color`,type:`color`,default:[.12,.1,.08,1]},{id:`u_backing_color`,name:`Backing Color`,type:`color`,default:[.85,.05,.05,1]}]},io=s({default:()=>ao}),ao={id:`perforated_sheet`,name:`Perforated Sheet`,category:`Industrial`,description:`CNC-perforated aluminium sheet with round punched-through holes and chamfer highlights on hole rims.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Tile into cells according to density
      vec2 tiled = v_uv * u_density;
      vec2 cellUV = fract(tiled) - 0.5; // [-0.5, 0.5] per cell, center at 0
      vec2 cellID = floor(tiled);

      float d = length(cellUV);         // distance from cell center
      float r = u_hole_size * 0.5;      // hole radius in cell-space [0, 0.5]

      // ---- Hole: fully transparent inside ----
      // Soft edge: 1 px of blur mapped to cell space
      float edgeWidth = 0.008;
      float inHole = smoothstep(r - edgeWidth, r + edgeWidth, d);
      // inHole == 0 inside hole, 1 outside

      // ---- Brushed metal plate ----
      // Subtle horizontal brushing: low-amplitude noise along Y axis
      float brushNoise = noise(vec2(cellID.x + tiled.x * 0.3, tiled.y * 18.0)) * 0.035;
      vec3 metalCol = u_metal_color.rgb + vec3(brushNoise * 0.6, brushNoise * 0.6, brushNoise * 0.65);

      // ---- Chamfer highlight ring on hole rim ----
      // Bright annular band just outside the hole edge (tooling chamfer)
      float chamferInner = r + edgeWidth;
      float chamferOuter = chamferInner + 0.04;
      float chamfer = smoothstep(chamferInner - 0.002, chamferInner + 0.002, d)
                    - smoothstep(chamferOuter - 0.008, chamferOuter,        d);
      chamfer = clamp(chamfer, 0.0, 1.0);

      // Directional highlight: brightest at top-left of rim (simulated light at ~135 deg)
      vec2 dir = normalize(cellUV + vec2(0.001)); // avoid div-by-zero
      float lightAngle = dot(dir, normalize(vec2(-0.7, 0.7)));
      float rimLight = chamfer * clamp(lightAngle, 0.0, 1.0) * 0.55;

      // Combine: metal plate + rim highlight, then punch out the hole via alpha
      vec3 col = clamp(metalCol + vec3(rimLight), 0.0, 1.0);
      float alpha = inHole * u_metal_color.a * u_opacity;

      return vec4(col, alpha);
    }
  `,uniforms:[{id:`u_density`,name:`Hole Density`,type:`float`,min:2,max:40,default:16},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.85,default:.55},{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.78,.8,.82,1]}]},oo=s({default:()=>so}),so={id:`petrified_wood_artisan`,name:`Petrified Wood`,category:`Geology`,description:`Fossilized wood grain with vibrant mineral staining and crystalized structures.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chert High`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Silt Deep`,type:`color`,default:[.4,.2,.1,1]}]},co=s({default:()=>lo}),lo={id:`pine_bark_artisan`,name:`Pine Bark`,category:`Nature`,description:`Rough, vertical flaky ridges found on mature pine trees.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_scale`,name:`Bark Detail`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Bark High`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Bark Crevice`,type:`color`,default:[.15,.1,.08,1]}]},uo=s({default:()=>fo}),fo={id:`piston_top_artisan`,name:`Piston Head`,category:`Utility`,description:`Concentric rings of machined high-performance aluminum with heat seasoning.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Alloy High`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Alloy Deep`,type:`color`,default:[.6,.6,.65,1]}]},po=s({default:()=>mo}),mo={id:`pixel_art_canvas_artisan`,name:`Pixel Grid`,category:`Abstract`,description:`Large-block quantized color grid mimicking retro 8-bit digital canvases.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Pixel Size`,type:`float`,min:8,max:128,default:32},{id:`u_primary_color`,name:`Pixel High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Pixel Dark`,type:`color`,default:[.5,.5,.5,1]}]},ho=s({default:()=>go}),go={id:`plaid_tartan_artisan`,name:`Plaid Tartan`,category:`Abstract`,description:`Multi-colored interlocking textile grid found in classic Scottish kilts.`,shader:`
    vec4 generate() {
      float hor = step(0.7, fract(v_uv.x * u_scale)) * 0.5;
      float ver = step(0.7, fract(v_uv.y * u_scale)) * 0.5;
      return mix(u_secondary_color, u_primary_color, hor + ver);
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Stripe`,type:`color`,default:[1,0,0,1]},{id:`u_secondary_color`,name:`Base Wool`,type:`color`,default:[0,.2,.1,1]}]},P=s({default:()=>_o}),_o={id:`plant_cells_artisan`,name:`Plant Cells`,category:`Natural`,description:`Geometric hexagonal-ish stacked cells mimicking biological plant structures.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float cell = smoothstep(0.05, 0.1, abs(m_dist - 0.2));
      return mix(u_secondary_color, u_primary_color, cell);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Chlorophyll`,type:`color`,default:[.2,.5,.1,1]},{id:`u_secondary_color`,name:`Cell Wall`,type:`color`,default:[.1,.2,.05,1]}]},vo=s({default:()=>F}),F={id:`plasma_core_artisan`,name:`Plasma Core`,category:`Abstract`,description:`Pulsing radial energy patterns mimicking high-energy physics experiment cores.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale - 1.5708);
      float mask = smoothstep(0.2, 0.5, pulse * (1.0 - d));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Speed`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Plasma Glow`,type:`color`,default:[1,.4,1,1]},{id:`u_secondary_color`,name:`Plasma Void`,type:`color`,default:[.1,0,.1,1]}]},I=s({default:()=>L}),L={id:`pleated_fabric`,name:`Pleated Fabric`,category:`Industrial`,description:`Accordion-pleated fabric with lit faces, shadowed valleys, and specular fold edges.`,shader:`
    // Map a value into a sawtooth that folds into a triangle wave (accordion pleat shape)
    float pleatProfile(float x) {
      // x in [0,1] per pleat â€” returns height in [0,1]
      // Each pleat: rise sharply (lit face), fold back (shadow face)
      float t = fract(x);
      // Triangle wave: 0â†’1â†’0 over one period
      return 1.0 - abs(2.0 * t - 1.0);
    }

    // Derivative approximation for surface normal shading
    float pleatDeriv(float x) {
      float t = fract(x);
      return t < 0.5 ? 1.0 : -1.0;
    }

    vec4 generate() {
      float count  = u_pleat_count;
      float depth  = u_depth;
      vec3  fabric = u_fabric_color.rgb;

      // Pleats run vertically â€” fold along Y axis, wave in X
      float px = v_uv.x * count;
      float height = pleatProfile(px);
      float slope  = pleatDeriv(px);  // +1 = lit face, -1 = shadow face

      // Simulate directional lighting: light comes from upper-left
      // Lit face (slope > 0): bright. Shadow face (slope < 0): dark.
      float litFactor   = smoothstep(-1.0, 1.0, slope);
      float shadeAmount = mix(1.0 - 0.55 * depth, 1.0, litFactor);

      // Fold edge highlight: near the peak of each pleat
      float peak = 1.0 - abs(height - 1.0) / 1.0; // 1 at peak, 0 at valley
      float foldEdge = pow(smoothstep(0.80, 1.0, height), 3.0);
      float specular = foldEdge * 0.45 * clamp(depth * 0.7, 0.0, 1.0);

      // Valley shadow: dark crease at the base
      float valley = pow(smoothstep(0.12, 0.0, height), 2.0);
      float valShadow = valley * 0.5 * depth;

      // Ambient occlusion in the tight valley fold
      float ao = 1.0 - valley * 0.4 * depth;

      // Subtle vertical fabric grain (tiny horizontal texture variation along the pleat face)
      float grain = sin(v_uv.y * count * 80.0) * 0.015;

      vec3 col = fabric * shadeAmount * ao;
      col += specular;          // fold edge brightening
      col -= valShadow;         // valley darkening
      col += grain * litFactor; // surface micro-texture

      col = clamp(col, 0.0, 1.0);

      // If specular pass, return the highlight channel
      float specPass = foldEdge * step(0.5, u_is_spec);
      col = mix(col, vec3(specular + 0.1), specPass);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_pleat_count`,type:`float`,default:12,min:4,max:30,name:`Pleat Count`},{id:`u_fabric_color`,type:`color`,default:[.15,.15,.18,1],name:`Fabric Colour`},{id:`u_depth`,type:`float`,default:1,min:.2,max:2,name:`Fold Depth`}]},yo=s({default:()=>bo}),bo={id:`polka_dot_artisan`,name:`Pro Polka Dots`,category:`Organic`,description:`Precision uniform polka dots with adjustable spacing and edge softness.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      float mask = smoothstep(u_radius, u_radius - 0.02, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Count`,type:`float`,min:2,max:50,default:10},{id:`u_radius`,name:`Dot Size`,type:`float`,min:.1,max:.5,default:.3},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[.05,.05,.1,1]}]},xo=s({default:()=>So}),So={id:`powder_coat`,name:`Powder Coat`,category:`Industrial`,description:`Powder coat finish with characteristic orange-peel micro-texture. Common on roll cages, wheel centres, and suspension components.`,shader:`
    float hash_pc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pc(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pc(i), hash_pc(i+vec2(1,0)), f.x),
                 mix(hash_pc(i+vec2(0,1)), hash_pc(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Orange-peel: 3 octaves of noise at different scales
      // Creates the characteristic random bumpy surface
      float s = u_peel_scale;
      float n1 = noise_pc(uv * s);
      float n2 = noise_pc(uv * s * 2.1 + vec2(1.7, 3.3)) * 0.5;
      float n3 = noise_pc(uv * s * 4.3 + vec2(5.1, 2.8)) * 0.25;
      float peel = (n1 + n2 + n3) / 1.75;

      // Convert to surface normal approximation for shading
      // Sample nearby for gradient
      float dx = noise_pc(uv * s + vec2(0.002, 0.0)) - noise_pc(uv * s - vec2(0.002, 0.0));
      float dy = noise_pc(uv * s + vec2(0.0, 0.002)) - noise_pc(uv * s - vec2(0.0, 0.002));
      // Simple Lambertian diffuse from fixed light direction
      vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));
      vec3 normal   = normalize(vec3(-dx * u_depth * 8.0, -dy * u_depth * 8.0, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));

      // Specular — powder coat is semi-matte so keep this subtle
      vec3 viewDir  = vec3(0.0, 0.0, 1.0);
      vec3 halfDir  = normalize(lightDir + viewDir);
      float spec    = pow(max(0.0, dot(normal, halfDir)), 12.0) * 0.08 * u_gloss;

      // Compose
      vec3 base  = u_coat_color.rgb;
      vec3 col   = base * (0.35 + diffuse * 0.65) + vec3(spec);

      // Micro specks — powder coat often has tiny metallic particles
      float speck = step(0.97, hash_pc(uv * 400.0)) * 0.15 * u_gloss;
      col += vec3(speck);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_coat_color`,name:`Coat Colour`,type:`color`,default:[.08,.08,.09,1]},{id:`u_peel_scale`,name:`Peel Scale`,type:`float`,default:60,min:10,max:150},{id:`u_depth`,name:`Texture Depth`,type:`float`,default:.6,min:0,max:1},{id:`u_gloss`,name:`Gloss Level`,type:`float`,default:.4,min:0,max:1}]},Co=s({default:()=>wo}),wo={id:`prism_shards_artisan`,name:`Prism Shards`,category:`Experimental`,description:`Sharp refracted geometric light cells with internal color shifts across the spectrum.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      vec3 color = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + m_point.x * 6.28);
      return vec4(color, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Refraction Density`,type:`float`,min:2,max:15,default:8}]},To=s({default:()=>R}),R={id:`prismatic_flip`,name:`Prismatic Flip Paint`,category:`Racing`,description:`Colour-shifting flip paint that sweeps through the spectrum across the surface — as seen on modern motorsport liveries and special-edition road cars.`,shader:`
    float hash_pf(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pf(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pf(i), hash_pf(i+vec2(1,0)), f.x),
                 mix(hash_pf(i+vec2(0,1)), hash_pf(i+vec2(1,1)), f.x), f.y);
    }

    vec3 hsvToRgb(float h, float s, float v) {
      vec3 c = abs(fract(vec3(h) + vec3(0.0, 0.333, 0.667)) * 6.0 - 3.0) - 1.0;
      return v * mix(vec3(1.0), clamp(c, 0.0, 1.0), s);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Directional hue sweep across surface
      float axis  = mix(uv.x, uv.y, u_direction);
      float sweep = (axis - 0.5) * u_range;

      // Organic turbulence breaks up the flat gradient
      float n = noise_pf(uv * 2.8) * 0.5 + noise_pf(uv * 7.2) * 0.22;
      n /= 0.72;

      float hue = fract(u_base_hue + sweep + (n - 0.5) * u_turbulence);

      vec3 col = hsvToRgb(hue, u_saturation, u_brightness);

      // Directional gloss band — simulates environmental reflection sweep
      float gloss = pow(max(0.0, 1.0 - abs(axis - 0.5) * 2.0), 4.0) * 0.18;
      col = clamp(col + gloss, 0.0, 1.0);

      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_hue`,name:`Base Hue`,type:`float`,default:0,min:0,max:1},{id:`u_range`,name:`Hue Range`,type:`float`,default:.55,min:.05,max:2},{id:`u_direction`,name:`Direction`,type:`float`,default:.3,min:0,max:1},{id:`u_saturation`,name:`Saturation`,type:`float`,default:.88,min:.1,max:1},{id:`u_brightness`,name:`Brightness`,type:`float`,default:.88,min:.2,max:1},{id:`u_turbulence`,name:`Turbulence`,type:`float`,default:.28,min:0,max:1}]},Eo=s({default:()=>Do}),Do={id:`pulsar_radial_artisan`,name:`Pulsar Radial`,category:`Abstract`,description:`High-frequency radial pulses mimicking deep-space electromagnetic emissions.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale);
      float mask = step(0.5, pulse);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Freq`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`Pulsar Beam`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Space Void`,type:`color`,default:[0,0,0,1]}]},Oo=s({default:()=>ko}),ko={id:`quantum_foam_artisan`,name:`Quantum Foam`,category:`Experimental`,description:`Abstract probability interference and grain noise mimicking fluctuations at the Planck scale.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 1.1);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Planck Resolution`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fluctuation`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},Ao=s({default:()=>jo}),jo={id:`quartz_crystal_artisan`,name:`Quartz Plane`,category:`Geology`,description:`Sharp geometric crystalline planes and internal mineral prisms.`,shader:`
    vec4 generate() {
      float d = abs(v_uv.x - 0.5) + abs(v_uv.y - 0.5);
      float mask = step(0.4, fract(d * u_scale));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Quartz Face`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Prism Core`,type:`color`,default:[.8,.8,.9,1]}]},Mo=s({default:()=>No}),No={id:`racing_livery_stripe`,name:`Racing Livery Stripe`,category:`Racing`,description:`Dual-tone diagonal speed stripe with gradient fade and crisp edges â€” a classic motorsport livery element.`,shader:`
    // Signed distance to an infinite angled stripe centred on the canvas
    float stripeSDist(vec2 uv, float angle) {
      // Direction perpendicular to stripe edge
      vec2 dir = vec2(cos(angle), sin(angle));
      // Project UV (centred at 0.5) onto the perpendicular axis
      vec2 p = uv - 0.5;
      return dot(p, dir);
    }

    // Remap x from [a,b] to [0,1]
    float remap01(float x, float a, float b) {
      return clamp((x - a) / (b - a), 0.0, 1.0);
    }

    vec4 generate() {
      vec3  stripeCol = u_stripe_color.rgb;
      vec3  bgCol     = u_bg_color.rgb;
      float halfW     = u_stripe_width * 0.5;
      float angle     = u_angle * 3.14159;  // -pi to pi

      // Perpendicular signed distance to stripe centreline
      float sDist = stripeSDist(v_uv, angle + 1.5707963); // perpendicular to stripe direction

      // Sharp stripe mask â€” no anti-alias blur (crisp edge)
      float stripeMask = step(-halfW, sDist) * step(sDist, halfW);

      // Gradient along the stripe length (parallel to stripe direction)
      vec2  stripeDir = vec2(cos(angle), sin(angle));
      float along     = dot(v_uv - 0.5, stripeDir) + 0.5; // 0â†’1 along stripe

      // Colour gradient from stripeCol at one end to a lighter/darker variant
      vec3 stripeEnd   = mix(stripeCol, vec3(1.0), 0.25); // lighter at far end
      vec3 gradStripe  = mix(stripeCol, stripeEnd, along);

      // Edge highlight â€” very thin bright line at each stripe edge for crispness
      float edgeDist = min(abs(sDist - halfW), abs(sDist + halfW));
      float edgeHighlight = smoothstep(0.012, 0.0, edgeDist) * 0.35 * stripeMask;

      // Compose
      vec3 col = mix(bgCol, gradStripe, stripeMask);
      col += edgeHighlight;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_stripe_color`,type:`color`,default:[.9,.1,.1,1],name:`Stripe Colour`},{id:`u_bg_color`,type:`color`,default:[.05,.05,.05,1],name:`Background Colour`},{id:`u_stripe_width`,type:`float`,default:.45,min:.1,max:.9,name:`Stripe Width`},{id:`u_angle`,type:`float`,default:.3,min:-1,max:1,name:`Stripe Angle`}]},Po=s({default:()=>z}),z={id:`radial_gradient_artisan`,name:`Master Radial`,category:`Utility`,description:`Focus-aligned radial gradient transition.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5) * 2.0;
      float mask = smoothstep(0.0, 1.0, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Center Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Outer Color`,type:`color`,default:[0,0,0,1]}]},Fo=s({default:()=>Io}),Io={id:`rain_on_glass`,name:`Rain on Glass`,category:`Natural`,description:`Rainwater on a tinted glass windshield — beaded droplets with meniscus rim highlights and wavy vertical rivulets.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float hash1(float n) { return fract(sin(n) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // ---- Voronoi-like droplet field ----
    // Returns (distance-to-nearest-center, cell hash).
    vec2 dropletCell(vec2 uv) {
      vec2 cellID = floor(uv);
      vec2 cellUV = fract(uv);
      float minDist = 1e9;
      float minHash = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 nID = cellID + neighbor;
          // Random point within the neighboring cell — offset by noise for organic shape
          float hx = hash(nID);
          float hy = hash(nID + vec2(31.41, 27.18));
          vec2 center = neighbor + vec2(hx, hy);
          // Warp center slightly with slow noise for irregular droplet placement
          center += 0.15 * vec2(
            noise(nID * 0.7 + 1.5708 * 0.03),
            noise(nID * 0.7 + vec2(5.3, 1.7) + 1.5708 * 0.03)
          );
          float d = length(cellUV - center);
          if (d < minDist) {
            minDist = d;
            minHash = hash(nID + vec2(99.1, 7.3));
          }
        }
      }
      return vec2(minDist, minHash);
    }

    // ---- Rivulet streak ----
    // One vertical streak at normalised x position xPos [0,1].
    float rivulet(vec2 uv, float xPos) {
      float xDist = abs(uv.x - xPos);
      // Wavy wobble along Y using noise + time (slow drip)
      float wobble = fbm(vec2(xPos * 4.7, uv.y * 2.5 + 1.5708 * 0.04)) * 0.04;
      float streak = smoothstep(0.022, 0.008, xDist + wobble);
      return streak;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Base tinted glass ----
      vec3 col = u_glass_color.rgb;

      // ---- Droplets ----
      vec2 dropUV = uv * u_drop_density;
      vec2 cell = dropletCell(dropUV);
      float d   = cell.x;   // 0 at droplet center, ~0.5 at cell edge
      float ch  = cell.y;   // per-cell hash for size variation

      // Vary droplet radius slightly per cell for organic feel
      float dropRadius = 0.28 + ch * 0.12;
      dropRadius *= u_wetness;

      // Interior of droplet: slightly brighter (refraction / lensing)
      float dropInterior = smoothstep(dropRadius + 0.01, dropRadius - 0.01, d);

      // Annular rim highlight (surface tension meniscus)
      float rimInner  = dropRadius * 0.78;
      float rimOuter  = dropRadius;
      float rim = smoothstep(rimInner - 0.01, rimInner + 0.01, d)
                - smoothstep(rimOuter  - 0.008, rimOuter,       d);
      rim = clamp(rim, 0.0, 1.0);

      // Water lens brightening inside droplet
      vec3 dropCol = col * (1.0 + 0.18 * dropInterior);
      // Specular rim: white-ish highlight
      dropCol += vec3(rim * 0.55);

      // Blend droplet over glass by coverage
      float dropMask = clamp(dropInterior + rim * 0.6, 0.0, 1.0) * u_wetness;
      col = mix(col, dropCol, dropMask);

      // ---- Rivulets ----
      // Space u_rivulet_count streaks evenly across X, with per-streak hash offset
      float rivMask = 0.0;
      for (int i = 0; i < 20; i++) {
        if (float(i) >= u_rivulet_count) break;
        float xPos = (float(i) + 0.5 + hash1(float(i) * 7.39) * 0.4) / u_rivulet_count;
        rivMask += rivulet(uv, xPos);
      }
      rivMask = clamp(rivMask, 0.0, 1.0) * u_wetness;

      // Rivulets: brighter, slightly blue-tinted water streak
      vec3 rivColor = col * 1.22 + vec3(0.02, 0.03, 0.05);
      col = mix(col, rivColor, rivMask * 0.75);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_glass_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_glass_color`,name:`Glass Tint`,type:`color`,default:[.1,.13,.16,1]},{id:`u_drop_density`,name:`Drop Density`,type:`float`,min:2,max:20,default:8},{id:`u_rivulet_count`,name:`Rivulet Count`,type:`float`,min:2,max:20,default:8},{id:`u_wetness`,name:`Wetness`,type:`float`,min:0,max:1,default:.7}]},Lo=s({default:()=>Ro}),Ro={id:`reaction_diffusion_artisan`,name:`Reaction Diffusion`,category:`Experimental`,description:`Organic biological growth and coral-like patterns mimicking chemical morphogenesis.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n = abs(sin(n * 20.0));
      float mask = smoothstep(0.4, 0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Growth Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organism`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.1,.05,0,1]}]},zo=s({default:()=>Bo}),Bo={id:`realistic_viper_artisan`,name:`Realistic Viper`,category:`Natural`,description:`Small, diamond-shaped high-fidelity interlocking scales mimicking viper skin.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:80,default:40},{id:`u_primary_color`,name:`Scales`,type:`color`,default:[.1,.15,.05,1]},{id:`u_secondary_color`,name:`Skin Deep`,type:`color`,default:[0,.05,0,1]}]},Vo=s({default:()=>Ho}),Ho={id:`rim_spoke_carbon_artisan`,name:`Spoke Carbon`,category:`Racing`,description:`Multi-layered carbon strands optimized for high-strength wheel spokes.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x + uv.y) * sin(uv.x - uv.y);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Resin Base`,type:`color`,default:[.1,.1,.12,1]}]},Uo=s({default:()=>Wo}),Wo={id:`river_cobble_artisan`,name:`River Cobble`,category:`Natural`,description:`Smooth, irregular organic stone clusters mimicking riverbed masonry.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec2 random2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.45, 0.4, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Joint`,type:`color`,default:[.1,.1,.1,1]}]},Go=s({default:()=>Ko}),Ko={id:`river_stone_artisan`,name:`River Stones`,category:`Nature`,description:`Smooth rounded pebble shapes mimicking naturally eroded riverbed stones.`,shader:`
    vec2 rand(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.4, 0.38, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stone Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Pebble Surface`,type:`color`,default:[.5,.5,.5,1]},{id:`u_secondary_color`,name:`Joint Sediment`,type:`color`,default:[.3,.3,.3,1]}]},qo=s({default:()=>Jo}),Jo={id:`rivet_lines_pro`,name:`Panel Rivets`,category:`Industrial`,description:`Structural rivet seams for automotive panels.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale) - 0.5;
      float d = length(g);
      float mask = step(0.3, d) * step(d, 0.35);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rivet Spacing`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Rivet`,type:`color`,default:[.6,.6,.6,1]},{id:`u_secondary_color`,name:`Panel`,type:`color`,default:[.35,.35,.35,1]}]},Yo=s({default:()=>Xo}),Xo={id:`rivet_plate_elite`,name:`Rivet Plate Elite`,category:`Industrial`,description:`Overlapping heavy armor sections with structural corner rivets.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      
      float plate = step(0.02, gv.x) * step(gv.x, 0.98) * step(0.02, gv.y) * step(gv.y, 0.98);
      float rivet = 0.0;
      if (length(gv - 0.1) < 0.05) rivet = 1.0;
      if (length(gv - 0.9) < 0.05) rivet = 1.0;
      
      float mask = max(plate * 0.5, rivet);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Count`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Armor Steel`,type:`color`,default:[.5,.5,.55,1]},{id:`u_secondary_color`,name:`Seam`,type:`color`,default:[.1,.1,.12,1]}]},Zo=s({default:()=>Qo}),Qo={id:`roll_cage_foam_artisan`,name:`Roll Cage Foam`,category:`Racing`,description:`Dense, pitted cellular protective foam found on professional roll cage padding.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, smoothstep(0.2, 0.4, m_dist));
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Foam Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.05,1]}]},$o=s({default:()=>es}),es={id:`roof_shingles_artisan`,name:`Scalloped Shingles`,category:`Industrial`,description:`Overlapping curved roofing tiles used in architectural design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = step(d, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Rows`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Shingle`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Rim`,type:`color`,default:[.4,.4,.45,1]}]},ts=s({default:()=>ns}),ns={id:`root_system_artisan`,name:`Root System`,category:`Nature`,description:`Branching procedural line networks found in organic root systems and neural pathways.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<3; i++) {
        float n = hash(floor(uv));
        d = min(d, abs(fract(uv.x + n) - 0.5));
        uv *= 1.5;
        uv += n;
      }
      float mask = smoothstep(0.1, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Branching`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Root Fiber`,type:`color`,default:[.5,.4,.3,1]},{id:`u_secondary_color`,name:`Soil Deep`,type:`color`,default:[.1,.08,.05,1]}]},rs=s({default:()=>is}),is={id:`rose_gold_brushed`,name:`Rose Gold Brushed`,category:`Industrial`,description:`Directional brushed rose gold metal with warm pink-gold grain streaks and a subtle specular sheen band.`,shader:`
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }

    float brushNoise(float y, float grain) {
      float band = floor(y * grain);
      float f    = fract(y * grain);
      float a = hash11(band);
      float b = hash11(band + 1.0);
      return mix(a, b, f * f * (3.0 - 2.0 * f));
    }

    float gaussianSheen(float x, float center, float sigma) {
      float d = x - center;
      return exp(-(d * d) / (2.0 * sigma * sigma));
    }

    vec4 generate() {
      // Horizontal brush grain along Y axis
      float grain = brushNoise(v_uv.y, u_grain);

      // Fine high-frequency streak noise
      float streak = hash11(floor(v_uv.y * u_grain * 8.0)) * 0.5 + 0.5;
      float noise  = mix(grain, streak, 0.35);

      // Base rose gold color modulated by grain
      vec3 baseCol = u_base_color.rgb * (0.82 + 0.18 * noise);

      // Gaussian specular sheen band across center-ish of UV.x
      float sheen = gaussianSheen(v_uv.x, 0.5, 0.18) * u_sheen;
      // Warm specular highlight — slightly whiter/lighter than base
      vec3 sheenCol = mix(baseCol, vec3(1.0, 0.90, 0.85), sheen * 0.6);

      return vec4(sheenCol, 1.0);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain Density`,type:`float`,min:5,max:100,default:40},{id:`u_sheen`,name:`Sheen Intensity`,type:`float`,min:0,max:1,default:.6},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.88,.65,.55,1]}]},as=s({default:()=>os}),os={id:`rubber_compound`,name:`Rubber Compound`,category:`Racing`,description:`Fresh vulcanised racing tyre rubber — near-black carbon grain, subtle mould-release sheen, and low-frequency press flow marks.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_rb(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_rb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_rb(i);
      float b = hash1_rb(i + vec2(1.0, 0.0));
      float c = hash1_rb(i + vec2(0.0, 1.0));
      float d = hash1_rb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for carbon-black micro grain
    float fbm_rb(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_rb(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Carbon-black micro grain ---
      float grain = fbm_rb(uv * u_grain);

      // Low-frequency vulcanisation press flow marks
      // Circular concentric arcs — low frequency, very subtle
      float flow_angle = atan(uv.y - 0.5, uv.x - 0.5);
      float flow_radius = length(uv - 0.5);
      // Faint concentric ripple from press
      float flow = sin(flow_radius * 18.0 - flow_angle * 0.3) * 0.012;

      // Slight directional sheen — mould release surface
      // The sheen is slightly stronger across the x direction (mould release direction)
      float sheen_grad = 1.0 - abs(uv.x - 0.5) * 0.4;
      // Combined with a Gaussian centered at top-right (raking light)
      float sheen_spot = exp(-5.0 * length(uv - vec2(0.75, 0.75)) * 1.5);
      float sheen = (sheen_grad * 0.3 + sheen_spot * 0.7) * u_sheen;

      // Compound base color
      vec3 base = u_compound_color.rgb;

      // Carbon grain: very subtle brightness — ±4% on near-black base
      float grain_v = (grain - 0.5) * 0.08;

      // Highlight tint: raw rubber has faint warm (brownish) highlight
      vec3 warm_tint = vec3(0.04, 0.02, 0.00);
      float highlight_t = smoothstep(0.45, 0.65, grain);

      vec3 col = base + grain_v + warm_tint * highlight_t * 0.6;

      // Add flow marks (very faint)
      col += flow;

      // Mould-release surface sheen — slightly warm off-white reflection
      col += vec3(0.12, 0.11, 0.09) * sheen * 0.4;

      // Prevent blowing out — rubber stays dark
      col = clamp(col, 0.0, 0.22);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_compound_color`,name:`Rubber Color`,type:`color`,default:[.06,.05,.04,1]},{id:`u_grain`,name:`Surface Grain`,type:`float`,min:5,max:50,default:20},{id:`u_sheen`,name:`Rubber Gloss`,type:`float`,min:0,max:1,default:.4}]},ss=s({default:()=>cs}),cs={id:`safety_harness_artisan`,name:`Safety Harness`,category:`Racing`,description:`Heavy-duty nylon web weave found in 5-point and 6-point racing harnesses.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 40.0;
      float lines = sin(uv.x) * sin(uv.y * 5.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Nylon Web`,type:`color`,default:[.5,0,0,1]},{id:`u_secondary_color`,name:`Weave Gap`,type:`color`,default:[.1,0,0,1]}]},ls=s({default:()=>us}),us={id:`salt_crystal_natural`,name:`Salt Crystal`,category:`Natural`,description:`Cubic salt crystal formations of varying size seen from above, white and translucent on a dark substrate.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Rotate 2D point around origin by angle
    vec2 rot2(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Signed distance to axis-aligned square, centered at origin, half-size h
    float sdSquare(vec2 p, float h) {
      vec2 d = abs(p) - h;
      return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_density;
      vec2 cell = floor(uv);
      vec2 f    = fract(uv) - 0.5;

      // Check this cell and 8 neighbours so crystals from adjacent cells can overlap
      float minDist = 1e9;
      float crystalBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash21(nc), hash21(nc + vec2(37.3, 71.9)));

          // Crystal center jitter within cell (keep away from exact edge)
          vec2 center = vec2(float(dx), float(dy)) + rnd * 0.7 - 0.35;

          // Per-crystal random size (0.15–0.42 of cell)
          float sz = 0.15 + hash11(hash21(nc + 0.5)) * 0.27;

          // Slight random rotation (cubic symmetry — multiples of 15 deg)
          float angle = floor(rnd.y * 6.0) * 0.2618;   // 0..5 × 15°

          vec2 lp = rot2(f - center, angle);
          float d = sdSquare(lp, sz);

          if (d < minDist) {
            minDist = d;
            // Crystal face brightness — slight per-crystal variation
            crystalBright = 0.75 + hash21(nc + vec2(11.1, 23.3)) * 0.25;
          }
        }
      }

      // Inside crystal: minDist < 0
      float inside = 1.0 - smoothstep(-0.02, 0.01, minDist);

      // Edge highlight (raised rim light)
      float rim = smoothstep(0.05, 0.0, abs(minDist)) * 0.5;

      vec3 crystalCol = u_crystal_color.rgb * crystalBright + rim;

      // Dark gap between crystals
      vec3 col = mix(u_background.rgb, crystalCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Crystal Density`,type:`float`,min:4,max:30,default:14},{id:`u_crystal_color`,name:`Crystal Color`,type:`color`,default:[.92,.93,.95,1]},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.06,.08,1]}]},ds=s({default:()=>fs}),fs={id:`sand_dunes_artisan`,name:`Sand Dunes`,category:`Natural`,description:`Rippling wave-like ridges found in vast desert wastelands and oceanic floors.`,shader:`
    vec4 generate() {
      float waves = sin(v_uv.x * 20.0 * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, waves);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:.5,max:3,default:1},{id:`u_primary_color`,name:`Sunlight`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.4,.3,.15,1]}]},ps=s({default:()=>ms}),ms={id:`sandblasted_steel`,name:`Sandblasted Steel`,category:`Industrial`,description:`Bead-blasted aluminium or steel with uniform isotropic micro-crater texture and soft satin sheen.`,shader:`
    // --- helpers BEFORE generate() ---

    // Isotropic 2D hash — uses both x and y, no directional bias
    float hash2_sb(vec2 p) {
      vec2 q = vec2(dot(p, vec2(127.1, 311.7)),
                    dot(p, vec2(269.5, 183.3)));
      return fract(sin(dot(q, vec2(1.0, 37.0))) * 43758.5453);
    }

    float smoothnoise_sb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      // Quintic interpolation for softer micro-pitting
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      float a = hash2_sb(i);
      float b = hash2_sb(i + vec2(1.0, 0.0));
      float c = hash2_sb(i + vec2(0.0, 1.0));
      float d = hash2_sb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Two octaves of isotropic micro-grain
    float micro_grain(vec2 p, float freq) {
      float v  = smoothnoise_sb(p * freq)          * 0.6;
      v       += smoothnoise_sb(p * freq * 2.1 + vec2(1.7, 3.3)) * 0.3;
      v       += smoothnoise_sb(p * freq * 4.3 + vec2(5.1, 2.8)) * 0.1;
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Isotropic micro-crater noise — scale by u_grit
      float grain = micro_grain(uv, u_grit);

      // Map noise to ±8% brightness variation around neutral
      float brightness_var = (grain - 0.5) * 0.16;

      // Base metal color
      vec3 base = u_metal_color.rgb;

      // Apply brightness variation
      vec3 col = base + brightness_var;

      // Soft Gaussian specular sheen — distant area light source
      // Sheen center near UV (0.35, 0.65) — off-center feels natural
      vec2 sheen_center = vec2(0.35, 0.65);
      float sheen_dist = length(uv - sheen_center);
      float sheen = exp(-4.5 * sheen_dist * sheen_dist) * u_sheen * 0.25;

      // Sheen is warm-white
      col += vec3(sheen * 1.0, sheen * 0.98, sheen * 0.94);

      // Second smaller specular hotspot (secondary light bounce)
      vec2  sheen2_center = vec2(0.72, 0.28);
      float sheen2_dist   = length(uv - sheen2_center);
      float sheen2        = exp(-8.0 * sheen2_dist * sheen2_dist) * u_sheen * 0.10;
      col += sheen2;

      // Subtle vignette — edges are marginally darker (blasted surface edge effect)
      float vignette = 1.0 - 0.06 * length(uv - 0.5) * 2.0;
      col *= vignette;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.72,.72,.72,1]},{id:`u_grit`,name:`Grit Size`,type:`float`,min:20,max:200,default:80},{id:`u_sheen`,name:`Surface Sheen`,type:`float`,min:0,max:1,default:.3}]},hs=s({default:()=>gs}),gs={id:`sandstone_layers_artisan`,name:`Sandstone Strata`,category:`Geology`,description:`Fine horizontal layers and sediments found in weathered sandstone walls.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = v_uv.y * u_scale;
      float strata = hash(floor(y));
      return mix(u_secondary_color, u_primary_color, strata);
    }
  `,uniforms:[{id:`u_scale`,name:`Strata Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Sediment High`,type:`color`,default:[.8,.6,.4,1]},{id:`u_secondary_color`,name:`Sediment Deep`,type:`color`,default:[.6,.4,.3,1]}]},_s=s({default:()=>vs}),vs={id:`seat_perforation_artisan`,name:`Seat Perforation`,category:`Racing`,description:`Grid of fine ventilation holes found in professional bucket seats and luxury automotive leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.3, 0.28, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Hole Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Punch Hold`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Leather Surface`,type:`color`,default:[.1,.1,.1,1]}]},ys=s({default:()=>bs}),bs={id:`server_rack_mesh_artisan`,name:`Server Mesh`,category:`Industrial`,description:`Industrial perforated metal mesh found on high-density enterprise server racks.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.45, 0.42, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mesh Zoom`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Steel Rack`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[0,0,0,1]}]},xs=s({default:()=>Ss}),Ss={id:`shift_boot_leather_artisan`,name:`Shift Boot Leather`,category:`Racing`,description:`Organic crumpled leather folds and distressed textures found in shift boots and gaiters.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Leather High`,type:`color`,default:[.12,.1,.08,1]},{id:`u_secondary_color`,name:`Fold Shadow`,type:`color`,default:[.05,.04,.03,1]}]},Cs=s({default:()=>ws}),ws={id:`sierpinski_carpet_artisan`,name:`Fractal Carpet`,category:`Abstract`,description:`Recursive square fractal grid structures found in high-performance digital logic layouts.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            vec2 gv = fract(uv * 3.0);
            if (gv.x > 1.0/3.0 && gv.x < 2.0/3.0 && gv.y > 1.0/3.0 && gv.y < 2.0/3.0) {
                mask = 1.0;
                break;
            }
            uv = gv;
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Logic High`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Deep Silicon`,type:`color`,default:[0,.05,.1,1]}]},Ts=s({default:()=>Es}),Es={id:`sierpinski_mesh_artisan`,name:`Fractal Mesh`,category:`Abstract`,description:`Recursive Sierpinski triangle fractal structures found in high-performance lightweight parts.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            if (uv.x + uv.y > 1.0) {
                mask = 1.0;
                break;
            }
            uv *= 2.0;
            uv = fract(uv);
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Fractal Web`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Fractal Hole`,type:`color`,default:[0,.1,.05,1]}]},Ds=s({default:()=>Os}),Os={id:`single_rivet_line_artisan`,name:`Single Rivet Row`,category:`Industrial`,description:`A single linear row of industrial rivets for precision panel seams.`,shader:`
    vec4 generate() {
      // Create a vertical center mask
      float rowMask = step(0.45, v_uv.y) * step(v_uv.y, 0.55);
      
      // Spacing on X axis
      vec2 g = fract(v_uv * vec2(u_scale, 1.0)) - 0.5;
      float d = length(vec2(g.x, (v_uv.y - 0.5) * 10.0)); // Adjusted vertical scale for roundness
      
      float rivet = smoothstep(0.4, 0.35, d);
      float shadow = smoothstep(0.45, 0.4, d);
      
      vec4 col = mix(u_secondary_color, u_primary_color, rivet);
      return mix(col, vec4(0.0, 0.0, 0.0, 1.0), (shadow - rivet) * 0.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Rivet Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rivet Head`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.3,.3,.32,1]}]},ks=s({default:()=>As}),As={id:`skeletal_mesh_artisan`,name:`Skeletal Mesh`,category:`Abstract`,description:`Periodic rib-like line patterns with organic jitter found in anatomical structures.`,shader:`
    vec4 generate() {
      float ribs = sin(v_uv.y * 50.0 * u_scale + sin(v_uv.x * 20.0));
      float mask = smoothstep(0.0, 0.1, ribs);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Bone`,type:`color`,default:[.9,.9,.85,1]},{id:`u_secondary_color`,name:`Marrow`,type:`color`,default:[.1,.05,.05,1]}]},js=s({default:()=>Ms}),Ms={id:`slate_rock_natural`,name:`Slate Rock`,category:`Natural`,description:`Dark layered slate with parallel cleavage planes, fine horizontal grain, and occasional crossing fracture lines.`,shader:`
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // Wavy layer boundary — each layer is slightly undulated
    float layerWave(float y, float layerIdx) {
      float wave = smoothNoise1D(v_uv.x * 4.0 + layerIdx * 7.3) * 0.012;
      return y + wave;
    }

    vec4 generate() {
      float freq = u_layer_freq;

      // Layer index and local position within layer
      float rawY    = v_uv.y * freq;
      float layerI  = floor(rawY);
      float layerF  = fract(rawY);

      // Slight undulation per layer
      float wavY = layerWave(rawY, layerI);
      layerF = fract(wavY);
      layerI = floor(wavY);

      // Per-layer color variation
      float layerVar = hash11(layerI) * 0.12 - 0.06;

      // Fine horizontal grain noise within layer
      float grain = smoothNoise1D(v_uv.x * freq * 12.0 + layerI * 31.7) * 0.05;

      vec3 baseCol = u_base_color.rgb + layerVar + grain;

      // Thin dark line at layer boundary (cleavage plane)
      float boundary = 1.0 - smoothstep(0.0, 0.04, layerF) * smoothstep(1.0, 0.96, layerF);
      baseCol *= (1.0 - boundary * 0.45);

      // Fracture lines — near-vertical with slight diagonal
      float fracNum   = u_fracture * 12.0;
      float fracX     = v_uv.x * fracNum;
      float fracI     = floor(fracX);
      float fracF     = fract(fracX);

      // Only some cells have a fracture
      float hasFrac   = step(0.75, hash21(vec2(fracI, 0.0)));
      // Fracture meanders slightly in Y
      float fracBias  = hash21(vec2(fracI, 1.0)) * 0.4 - 0.2;  // x offset slope
      float fracLine  = fracF - 0.5 + fracBias * (v_uv.y - 0.5);
      float fracMask  = hasFrac * (1.0 - smoothstep(0.0, 0.012, abs(fracLine)));

      baseCol *= (1.0 - fracMask * 0.55);

      return vec4(clamp(baseCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_layer_freq`,name:`Layer Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Slate Color`,type:`color`,default:[.22,.24,.27,1]},{id:`u_fracture`,name:`Fracture Density`,type:`float`,min:0,max:1,default:.4}]},Ns=s({default:()=>Ps}),Ps={id:`snake_skin_artisan`,name:`Snake Skin`,category:`Natural`,description:`Precisely interlocking reptilian scales with organic variance.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      
      float d = length(gv);
      float mask = smoothstep(0.45, 0.4, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Scale Color`,type:`color`,default:[.2,.4,.1,1]},{id:`u_secondary_color`,name:`Underlayer`,type:`color`,default:[.05,.1,.02,1]}]},Fs=s({default:()=>Is}),Is={id:`snake_skin_v2_artisan`,name:`Viper Scales`,category:`Nature`,description:`Interlocking diamond scales found in aggressive predatory reptilian hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dorsal Scale`,type:`color`,default:[.1,.2,.1,1]},{id:`u_secondary_color`,name:`Inter-scale`,type:`color`,default:[0,0,0,1]}]},Ls=s({default:()=>Rs}),Rs={id:`soap_bubble_abstract`,name:`Soap Bubble`,category:`Abstract`,description:`Iridescent soap film with thin-film interference hues, Newton ring bands, and a dark background.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Hue to RGB — GLSL 1.0 compatible, no array indexing issues
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 center = vec2(0.5);
      vec2 uv     = (v_uv - center) / u_bubble_size;
      float dist  = length(uv);

      // Outside bubble → background
      float bubbleMask = 1.0 - smoothstep(0.44, 0.50, dist);

      // Thin-film interference: hue varies with radial distance
      // Blue→green→yellow→red as we go from center outward
      float filmPhase = dist * 2.8 * u_iridescence;

      // Gentle noise distortion of the hue bands
      float distortion = smoothNoise(uv * 6.0) * 0.12 - 0.06;

      float hue = fract(filmPhase + distortion);
      vec3  iridCol = hue2rgb(hue);

      // Saturation and brightness: near center is dimmer/more transparent look
      float sat = smoothstep(0.05, 0.45, dist);  // more colorful toward rim
      iridCol = mix(vec3(0.85), iridCol, sat * 0.9);

      // Newton ring overlay — concentric bands
      float rings = sin(dist * 60.0 * u_iridescence) * 0.5 + 0.5;
      float ringHue = fract(hue + rings * 0.15);
      vec3 ringCol = hue2rgb(ringHue);
      iridCol = mix(iridCol, ringCol, rings * 0.25 * sat);

      // Bright rim highlight
      float rim = smoothstep(0.30, 0.44, dist) * (1.0 - smoothstep(0.44, 0.50, dist));
      iridCol += vec3(0.4) * rim;

      // Transparent center (slightly washed out, near clear)
      float centerFade = 1.0 - smoothstep(0.0, 0.18, dist);
      iridCol = mix(iridCol, vec3(0.92, 0.95, 0.98), centerFade * 0.55);

      // Composite bubble over background
      vec3 finalCol = mix(u_background.rgb, iridCol, bubbleMask);

      return vec4(clamp(finalCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_bubble_size`,name:`Bubble Size`,type:`float`,min:.5,max:3,default:1.2},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:3,default:1.8},{id:`u_background`,name:`Background Color`,type:`color`,default:[.02,.02,.04,1]}]},zs=s({default:()=>Bs}),Bs={id:`solar_flare_pro`,name:`Solar Flare`,category:`Abstract`,description:`Static plasma energy flux with high-intensity radiation centers.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time dependency
      float n = noise(uv);
      float flare = pow(n, 3.0) * 2.0;
      return mix(u_secondary_color, u_primary_color, flare);
    }
  `,uniforms:[{id:`u_scale`,name:`Flare Scale`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Plasma Heat`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Corona`,type:`color`,default:[.5,.1,0,1]}]},Vs=s({default:()=>Hs}),Hs={id:`solar_flares_v2_artisan`,name:`Solar Corona`,category:`Natural`,description:`Abstract high-energy atmospheric flares and plasma smears from a stellar corona.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 10.0, 0.0));
      float mask = smoothstep(0.5, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Core`,type:`color`,default:[1,.9,.3,1]},{id:`u_secondary_color`,name:`Ejection`,type:`color`,default:[.8,.2,0,0]}]},Us=s({default:()=>Ws}),Ws={id:`speed_trails_artisan`,name:`Speed Trails`,category:`Racing`,description:`Horizontal motion-style smears representing velocity and aerodynamic flow.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(y);
      float trail = step(0.9, hash(v_uv.x * 0.1 + y));
      return mix(u_secondary_color, u_primary_color, trail);
    }
  `,uniforms:[{id:`u_scale`,name:`Trail Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Trail Lite`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[0,0,0,0]}]},Gs=s({default:()=>Ks}),Ks={id:`spider_web_artisan`,name:`Silk Web`,category:`Nature`,description:`Radial-concentric silk networks found in professional predatory arachnid structures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float radial = step(0.98, fract(angle * 8.0 / 6.283));
      float concentric = step(0.95, fract(d * 10.0));
      return mix(u_secondary_color, u_primary_color, clamp(radial + concentric, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Silk Strand`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Void Backdrop`,type:`color`,default:[0,0,0,1]}]},qs=s({default:()=>Js}),Js={id:`splinter_camo`,name:`Splinter Camo`,category:`Geometric`,description:`A non-digital but highly angular, geometric camouflage consisting of sharp intersecting polygons and shards.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Create intersecting angular grids
      mat2 rot1 = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      mat2 rot2 = mat2(cos(-0.8), sin(-0.8), -sin(-0.8), cos(-0.8));
      mat2 rot3 = mat2(cos(1.2), sin(1.2), -sin(1.2), cos(1.2));
      
      vec2 g1 = floor(rot1 * uv);
      vec2 g2 = floor(rot2 * uv * 1.5 + vec2(10.0));
      vec2 g3 = floor(rot3 * uv * 2.0 + vec2(20.0));
      
      float h1 = hash(g1);
      float h2 = hash(g2);
      float h3 = hash(g3);
      
      // Combine to create shards
      float val = fract(h1 + h2 * 0.5 + h3 * 0.25);
      
      vec4 color = u_color_base;
      if (val > 0.3) color = u_color_1;
      if (val > 0.6) color = u_color_2;
      if (val > 0.85) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Swedish M90`,uniforms:{u_color_base:[.65,.7,.55,1],u_color_1:[.35,.45,.3,1],u_color_2:[.15,.25,.15,1],u_color_3:[.1,.12,.1,1]}},{name:`Winter Splinter`,uniforms:{u_color_base:[.9,.9,.95,1],u_color_1:[.7,.7,.75,1],u_color_2:[.4,.45,.5,1],u_color_3:[.2,.2,.25,1]}},{name:`Urban Splinter`,uniforms:{u_color_base:[.55,.55,.55,1],u_color_1:[.4,.4,.4,1],u_color_2:[.2,.2,.2,1],u_color_3:[.05,.05,.05,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.1,.1,.1,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Grid Scale`,type:`float`,min:1,max:20,default:8},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.7,.55,1]},{id:`u_color_1`,name:`Shard 1`,type:`color`,default:[.35,.45,.3,1]},{id:`u_color_2`,name:`Shard 2`,type:`color`,default:[.15,.25,.15,1]},{id:`u_color_3`,name:`Shard 3`,type:`color`,default:[.1,.12,.1,1]}]},Ys=s({default:()=>Xs}),Xs={id:`spray_drip_artisan`,name:`Spray Drip`,category:`Abstract`,description:`Static vertical paint drip effect mimicking street-art application.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float x = floor(v_uv.x * u_scale);
      float h = hash(x);
      float mask = step(v_uv.y, h * 0.5 + 0.3);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Drip Count`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Drip Color`,type:`color`,default:[1,0,.2,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.05,.05,.05,1]}]},Zs=s({default:()=>Qs}),Qs={id:`stained_glass`,name:`Stained Glass`,category:`Abstract`,description:`Backlit stained glass window with vivid saturated color panels and thick dark lead came lines.`,shader:`
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Low-frequency smooth noise for glass inhomogeneity
    float smoothnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1(i);
      float b = hash1(i + vec2(1.0, 0.0));
      float c = hash1(i + vec2(0.0, 1.0));
      float d = hash1(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Pick one of 6 vivid stained-glass hues from a fixed palette
    vec3 glass_palette(float idx) {
      // 0: ruby red, 1: cobalt blue, 2: emerald green,
      // 3: amber gold, 4: violet, 5: teal
      if (idx < 0.5)       return vec3(0.82, 0.06, 0.08);   // ruby red
      else if (idx < 1.5)  return vec3(0.05, 0.12, 0.78);   // cobalt blue
      else if (idx < 2.5)  return vec3(0.04, 0.62, 0.14);   // emerald green
      else if (idx < 3.5)  return vec3(0.92, 0.58, 0.02);   // amber gold
      else if (idx < 4.5)  return vec3(0.48, 0.05, 0.75);   // violet
      else                 return vec3(0.02, 0.58, 0.62);    // teal
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest and second-closest cell
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 rng      = voronoi_rand(i_uv + neighbor);
          // Animate jitter slightly to feel alive
          rng = 0.5 + 0.5 * sin(6.2831 * rng);
          vec2 diff     = neighbor + rng - f_uv;
          float d       = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance = difference between closest and second-closest
      float edge_dist = m2_dist - m_dist;

      // Lead came: narrow band near cell boundary
      float lead_mask = smoothstep(0.0, u_lead_width, edge_dist);

      // Pick palette color from cell hash
      float cell_hash = hash1(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 glass_color = glass_palette(palette_idx);

      // Subtle brightness variation inside panel (±15%) — handblown glass
      float variation = smoothnoise(m_id * 1.7 + vec2(3.1, 7.4));
      float brightness = 1.0 + (variation - 0.5) * 0.30;

      // Backlit luminosity — boost saturation by squaring and scaling
      vec3 lit = glass_color * glass_color * brightness * u_brightness;

      // Lead came color: near-black dark grey
      vec3 lead_color = vec3(0.06, 0.06, 0.07);

      // Blend: inside cell = vivid glass, at boundary = lead
      vec3 col = mix(lead_color, lit, lead_mask);

      // Lead line itself gets a slight sheen highlight at its center
      float lead_sheen = (1.0 - lead_mask) * smoothstep(0.0, u_lead_width * 0.35, edge_dist);
      col += lead_sheen * 0.08;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Glass Sections`,type:`float`,min:2,max:20,default:7},{id:`u_lead_width`,name:`Lead Thickness`,type:`float`,min:.01,max:.12,default:.04},{id:`u_brightness`,name:`Panel Luminosity`,type:`float`,min:.3,max:2,default:1.3}]},$s=s({default:()=>ec}),ec={id:`star_field_artisan`,name:`Star Field Static`,category:`Natural`,description:`High-density thresholded noise clusters representing deep-space star fields.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      float mask = step(0.99, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cluster Density`,type:`float`,min:100,max:2e3,default:800},{id:`u_primary_color`,name:`Star Alpha`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,.02,1]}]},tc=s({default:()=>nc}),nc={id:`starlight_drive_artisan`,name:`Star Drive`,category:`Abstract`,description:`Streaked starfield with motion blur effects found in high-speed space transit simulations.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float h = hash(y);
      float dash = step(0.9, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, dash * h);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Star Streak`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,0,1]}]},rc=s({default:()=>ic}),ic={id:`steel_wool_artisan`,name:`Steel Wool`,category:`Industrial`,description:`Chaos-line noise mimicking tangled metal strands found in industrial abrasives.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 1000.0) * hash(v_uv * 100.0);
      float mask = smoothstep(0.0, 0.2, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel Strand`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[.1,.1,.15,1]}]},ac=s({default:()=>oc}),oc={id:`stitched_leather_pro`,name:`Stitched Leather`,category:`Organic`,description:`Premium pebbled leather texture with perimeter stitching simulation.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float pebble = smoothstep(0.4, 0.5, d);
      
      float stitch_v = step(0.98, fract(v_uv.x * 100.0)) * step(0.01, v_uv.y) * step(v_uv.y, 0.99);
      float stitch_h = step(0.98, fract(v_uv.y * 100.0)) * step(0.01, v_uv.x) * step(v_uv.x, 0.99);
      float stitch = max(stitch_v, stitch_h) * u_show_stitch;
      
      vec4 leather = vec4(0.15, 0.08, 0.05, 1.0);
      vec4 thread = vec4(0.8, 0.7, 0.1, 1.0);
      
      vec4 color = mix(leather, leather * 0.8, pebble);
      return mix(color, thread, stitch);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:100,default:40},{id:`u_show_stitch`,name:`Show Stitch`,type:`float`,min:0,max:1,default:1}]},B=s({default:()=>sc}),sc={id:`tech_fractal_artisan`,name:`Logic Fractal`,category:`Abstract`,description:`Geometric recursive logic patterns mimicking complex computational architectures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;
      float d = 0.0;
      for (int i=0; i<3; i++) {
        uv = abs(uv - 0.5) * 2.0;
        d += length(uv - 0.5);
      }
      float mask = step(1.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Pattern Edge`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Deep Core`,type:`color`,default:[0,.1,.15,1]}]},cc=s({default:()=>lc}),lc={id:`tech_hex_v2_artisan`,name:`Tech Hex v2`,category:`Technology`,description:`Advanced geometric hex-grid with internal subdivided offsets for sci-fi panels.`,shader:`
    vec2 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      return length(a) < length(b) ? a : b;
    }
    vec4 generate() {
      vec2 gv = hexCoords(v_uv * u_scale);
      float mask = smoothstep(0.45, 0.42, length(gv));
      float inner = smoothstep(0.3, 0.28, length(gv));
      return mix(u_secondary_color, u_primary_color, mask - inner);
    }
  `,uniforms:[{id:`u_scale`,name:`Module Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Housing`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Frame`,type:`color`,default:[.05,.05,.08,1]}]},uc=s({default:()=>dc}),dc={id:`terrazzo_chip_artisan`,name:`Terrazzo Chip`,category:`Industrial`,description:`Scattered irregular stone flakes and marble chips mimicking professional terrazzo flooring.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float n = hash(i_uv);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      float mask = step(0.6, hash(i_uv * 1.5));
      return mix(u_secondary_color, vec4(col, 1.0), mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:10,max:100,default:50},{id:`u_secondary_color`,name:`Binding Resin`,type:`color`,default:[.1,.1,.12,1]}]},fc=s({default:()=>pc}),pc={id:`terrazzo_stone_artisan`,name:`Terrazzo Stone`,category:`Industrial`,description:`Multi-colored irregular stone chunks embedded in a polished composite base.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      float mask = step(0.1, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Chip`,type:`color`,default:[.6,.62,.65,1]},{id:`u_secondary_color`,name:`Base Mortar`,type:`color`,default:[.8,.8,.82,1]}]},mc=s({default:()=>hc}),hc={id:`threaded_screw_artisan`,name:`Threaded Bolt`,category:`Industrial`,description:`Helical metal grooves representing industrial fasteners and bolts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float thread = sin(uv.y * 10.0 - uv.x * 2.0);
      float mask = smoothstep(-0.1, 0.1, thread);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Pitch`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Metal`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.1,.1,.15,1]}]},gc=s({default:()=>_c}),_c={id:`tig_weld`,name:`TIG Weld Bead`,category:`Industrial`,description:`TIG weld bead running horizontally with characteristic stacked-coin ripple arcs, hot bright center, and heat-affected steel.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_tw(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_tw(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_tw(i);
      float b = hash1_tw(i + vec2(1.0, 0.0));
      float c = hash1_tw(i + vec2(0.0, 1.0));
      float d = hash1_tw(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Vertical distance from horizontal center line
      float dy = uv.y - 0.5;
      float abs_dy = abs(dy);

      // Bead half-width in UV space
      float half_bead = u_bead_width * 0.5;

      // --- Ripple pattern ---
      // fract along x gives position within one ripple period
      float ripple_x = fract(uv.x * u_bead_freq);
      // Arc: distance from the trailing edge center of each coin
      // Each coin arc is centered at (ripple_x=0, dy=0)
      float arc_dist = length(vec2(ripple_x, dy / half_bead));

      // The stacked-coin ripple: rings of arc distance
      float ring = fract(arc_dist * 2.2);
      float ripple_band = smoothstep(0.35, 0.5, ring) * smoothstep(0.85, 0.7, ring);

      // Bead cross-section envelope: Gaussian falloff from center
      float bead_env = exp(-3.5 * (abs_dy / half_bead) * (abs_dy / half_bead));
      bead_env = clamp(bead_env, 0.0, 1.0);

      // Inside bead flag
      float in_bead = smoothstep(half_bead * 1.1, half_bead * 0.7, abs_dy);

      // --- Colors ---
      // Hot center: near-white/yellow-white
      vec3 hot_center   = vec3(1.00, 0.98, 0.90);
      // Ripple color: warm amber / gold
      vec3 ripple_color = vec3(0.88, 0.62, 0.18);
      // Edge of bead: transition to blue-steel
      vec3 bead_edge    = vec3(0.38, 0.48, 0.58);
      // Steel base: blue-grey
      vec3 steel_base   = vec3(0.55, 0.57, 0.60);
      // HAZ (heat affected zone): slight straw/blue tint
      vec3 haz_color    = vec3(0.52, 0.54, 0.62);

      // Micro surface noise on steel
      float micro = smoothnoise_tw(uv * 120.0) * 0.06 - 0.03;

      // --- Bead interior color ---
      // Blend from hot center outward through ripple amber to bead edge
      float center_t = clamp(abs_dy / half_bead, 0.0, 1.0);
      vec3 bead_col = mix(hot_center, ripple_color, smoothstep(0.0, 0.5, center_t));
      bead_col      = mix(bead_col,   bead_edge,    smoothstep(0.5, 1.0, center_t));

      // Add ripple bands on top (visible on mid-section of bead)
      float ripple_strength = (1.0 - center_t * center_t) * 0.30;
      bead_col = mix(bead_col, ripple_color * 0.7, ripple_band * ripple_strength);

      // --- HAZ gradient either side ---
      // HAZ width controlled by u_heat_spread
      float haz_width = half_bead * u_heat_spread;
      float haz_t = smoothstep(half_bead, haz_width, abs_dy);
      vec3 steel_col = mix(steel_base + micro, haz_color, haz_t);

      // --- Composite bead over steel ---
      vec3 col = mix(steel_col, bead_col, in_bead * bead_env);

      // Slight surface gloss highlight along bead center
      float gloss = exp(-80.0 * dy * dy) * exp(-4.0 * (ripple_x - 0.5) * (ripple_x - 0.5));
      col += gloss * 0.12 * in_bead;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_bead_freq`,name:`Ripple Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_bead_width`,name:`Bead Width`,type:`float`,min:.05,max:.4,default:.18},{id:`u_heat_spread`,name:`Heat Affected Zone`,type:`float`,min:.5,max:3,default:1.5}]},vc=s({default:()=>yc}),yc={id:`tiger_stripe_camo`,name:`Tiger Stripe Camo`,category:`Organic`,description:`Aggressive, horizontally flowing organic stripes characteristic of jungle warfare uniforms.`,shader:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Stretch horizontally and add vertical noise to create tiger stripes
      vec2 distorted_uv = vec2(uv.x, uv.y * 5.0 + snoise(uv * 2.0) * 1.5);
      
      float n1 = snoise(distorted_uv);
      float n2 = snoise(distorted_uv * 1.5 + vec2(10.0, 5.0));
      float n3 = snoise(distorted_uv * 2.0 + vec2(20.0, 10.0));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Jungle Tiger`,uniforms:{u_color_base:[.35,.38,.25,1],u_color_1:[.2,.25,.15,1],u_color_2:[.45,.35,.2,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Tiger`,uniforms:{u_color_base:[.85,.75,.55,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1]}},{name:`Snow Tiger`,uniforms:{u_color_base:[.95,.95,.95,1],u_color_1:[.75,.75,.78,1],u_color_2:[.45,.45,.5,1],u_color_3:[.15,.15,.18,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.12,1],u_color_1:[.08,.08,.08,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Stripe Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.38,.25,1]},{id:`u_color_1`,name:`Stripe 1`,type:`color`,default:[.2,.25,.15,1]},{id:`u_color_2`,name:`Stripe 2`,type:`color`,default:[.45,.35,.2,1]},{id:`u_color_3`,name:`Stripe 3`,type:`color`,default:[.08,.08,.08,1]}]},bc=s({default:()=>xc}),xc={id:`tiger_stripes_artisan`,name:`Predator Stripes`,category:`Organic`,description:`Organic predator-style tiger stripes with tapered edges.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(vec2(uv.x * 0.2, uv.y * 2.0));
      float mask = smoothstep(0.4, 0.6, n + sin(uv.x * 2.0) * 0.2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stripe Spacing`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stripe Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[1,.45,.05,1]}]},Sc=s({default:()=>Cc}),Cc={id:`tinted_carbon`,name:`Tinted Carbon Fibre`,category:`Racing`,description:`Colour-tinted resin carbon fibre — gold, blue, and red carbon as seen on real motorsport bodywork.`,shader:`
    float hash_tc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Standard 45-degree twill orientation
      float ca = 0.70711, sa = 0.70711;
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2x2 twill: diagonal over/under alternation
      float warpTop = step(0.5, mod(cid.x - cid.y, 2.0));

      // Fiber cross-section profiles
      float fR = 0.42;
      float fS = 0.07;
      float warpP = smoothstep(fR, fR - fS, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fS, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Specular streak along fiber axis
      float warpSpec = max(0.0, pow(1.0 - abs(cell.x - 0.5) * 3.0, 2.5)) * warpP;
      float weftSpec = max(0.0, pow(1.0 - abs(cell.y - 0.5) * 3.0, 2.5)) * weftP;
      float topSpec  = mix(weftSpec, warpSpec, warpTop);

      // Per-bundle luminance variation
      float towVar = hash_tc(warpTop > 0.5 ? vec2(cid.x, 0.0) : vec2(0.0, cid.y)) * 0.05;

      // Carbon fiber is almost black — small brightness with specular pop
      float lum = topP * (0.08 + towVar) + topSpec * 0.28 + btmP * 0.035;

      vec3 fiberCol = vec3(lum);

      // Resin occupies the gap zones — tinted by user colour
      float fiberPresence = clamp(topP + btmP * 0.35, 0.0, 1.0);
      float resinMask     = 1.0 - fiberPresence;

      vec3 col = fiberCol + u_tint.rgb * resinMask * u_tint_strength * 0.55;
      col += u_tint.rgb * btmP * (1.0 - topP) * u_tint_strength * 0.18;

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:24,min:8,max:64},{id:`u_tint`,name:`Resin Tint`,type:`color`,default:[.85,.62,.08,1]},{id:`u_tint_strength`,name:`Tint Strength`,type:`float`,default:.65,min:0,max:1}]},wc=s({default:()=>Tc}),Tc={id:`tire_marbles_artisan`,name:`Tire Marbles`,category:`Racing`,description:`Clumpy rubber debris and "offline" track grit formed during high-heat racing conditions.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.8, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grit Size`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Rubber Clump`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Track Surface`,type:`color`,default:[.2,.2,.2,1]}]},Ec=s({default:()=>Dc}),Dc={id:`tire_sidewall_artisan`,name:`Tire Sidewall`,category:`Racing`,description:`Raised geometric patterns and grip ridges found on professional racing tires.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.4) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rubber High`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Rubber Base`,type:`color`,default:[.08,.08,.08,1]}]},Oc=s({default:()=>kc}),kc={id:`tire_tread_rain`,name:`Rain Tire Tread`,category:`Racing`,description:`Deep directional grooves for wet weather conditions.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float x = abs(fract(uv.x) - 0.5);
      float y = fract(uv.y);
      float mask = step(0.15, abs(x - y * 0.5)) * step(0.05, x);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Rubber`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Groove`,type:`color`,default:[.05,.05,.05,1]}]},Ac=s({default:()=>jc}),jc={id:`topographic_pro`,name:`Topographic Map`,category:`Abstract`,description:`Technical contour lines mimicking elevation mapping.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float line = fract(n * u_layers);
      float mask = step(0.9, line);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.1, 0.4, 1.0, 1.0);
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Territory Size`,type:`float`,min:1,max:10,default:3},{id:`u_layers`,name:`Contour Detail`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Line Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Land Color`,type:`color`,default:[.1,.1,.1,1]}]},Mc=s({default:()=>Nc}),Nc={id:`travertine_natural`,name:`Travertine`,category:`Natural`,description:`Layered travertine limestone with wavy cream-to-tan sedimentary bands and occasional trapped gas-bubble void pockets.`,shader:`
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x); float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal Brownian Motion — 3 octaves for wavy bands
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * smoothNoise2D(p);
        p  = p * 2.1 + vec2(3.7, 1.3);
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      // Wavy band: distort the Y coordinate with fbm noise
      float warp  = fbm(v_uv * 2.5) * 0.18 - 0.09;
      float bandY = (v_uv.y + warp) * u_band_freq;

      float layerI = floor(bandY);
      float layerF = fract(bandY);

      // Per-layer color — cycle through cream → beige → tan → light brown
      float colCycle = fract(layerI * 0.137 + hash11(layerI) * 0.4);
      // Map 0→1 through the warm tone range
      vec3 warmA = u_base_color.rgb;                              // cream
      vec3 warmB = u_base_color.rgb * vec3(0.88, 0.82, 0.70);   // tan
      vec3 warmC = u_base_color.rgb * vec3(0.76, 0.67, 0.52);   // light brown
      vec3 warmD = u_base_color.rgb * vec3(0.94, 0.91, 0.84);   // warm off-white

      vec3 layerCol;
      if (colCycle < 0.25) {
        layerCol = mix(warmA, warmB, colCycle * 4.0);
      } else if (colCycle < 0.5) {
        layerCol = mix(warmB, warmC, (colCycle - 0.25) * 4.0);
      } else if (colCycle < 0.75) {
        layerCol = mix(warmC, warmD, (colCycle - 0.5) * 4.0);
      } else {
        layerCol = mix(warmD, warmA, (colCycle - 0.75) * 4.0);
      }

      // Micro surface texture within layer
      float surf = smoothNoise2D(v_uv * 40.0) * 0.04 - 0.02;
      layerCol  += surf;

      // Layer boundary — slight darkening at the stratum transition
      float boundary = (1.0 - smoothstep(0.0, 0.08, layerF)) + (1.0 - smoothstep(1.0, 0.92, layerF));
      layerCol *= (1.0 - boundary * 0.18);

      // Void pockets (gas bubble holes) — scattered dark ellipses
      float voidCount = u_void_density;
      float voidMask  = 0.0;

      // Sample a grid of potential void cells
      vec2 voidUV = v_uv * vec2(voidCount * 1.5, voidCount);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cell  = floor(voidUV) + vec2(float(dx), float(dy));
          float rnd  = hash21(cell);
          // Only ~40% of cells have a void
          if (rnd > 0.60) {
            vec2 jitter  = vec2(hash21(cell + 7.3), hash21(cell + 13.7));
            vec2 center  = cell + jitter;
            vec2 diff    = voidUV - center;
            // Elliptical void (wider than tall)
            float voidR  = 0.08 + hash21(cell + 3.1) * 0.14;
            float aspect = 1.4 + hash21(cell + 5.0) * 0.8;
            float vd     = length(diff * vec2(1.0 / aspect, 1.0)) / voidR;
            float vm     = 1.0 - smoothstep(0.7, 1.0, vd);
            voidMask     = max(voidMask, vm);
          }
        }
      }

      // Void interior is dark brownish-grey
      vec3 voidCol = u_base_color.rgb * vec3(0.18, 0.14, 0.10);
      vec3 col     = mix(layerCol, voidCol, voidMask);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_band_freq`,name:`Band Frequency`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Travertine Color`,type:`color`,default:[.88,.8,.67,1]},{id:`u_void_density`,name:`Void Density`,type:`float`,min:0,max:10,default:3}]},Pc=s({default:()=>Fc}),Fc={id:`truchet_tiles_artisan`,name:`Truchet Arc`,category:`Abstract`,description:`Interlocking arc-based tiles mimicking complex organic circuitry and decorative pavement.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      if (hash(i_uv) > 0.5) f_uv.x = 1.0 - f_uv.x;
      float d = abs(length(f_uv) - 0.5);
      float mask = smoothstep(0.02, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Arc Ribbon`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Tile Depth`,type:`color`,default:[.1,.1,.15,1]}]},Ic=s({default:()=>Lc}),Lc={id:`turbo_fan_artisan`,name:`Turbo Turbine`,category:`Technology`,description:`Radial blades of a high-boost turbocharger compressor wheel.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float blades = sin(angle * u_blades);
      float mask = smoothstep(-0.5, 0.5, blades);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_blades`,name:`Blade Count`,type:`float`,min:6,max:24,default:12},{id:`u_primary_color`,name:`Blade Top`,type:`color`,default:[.9,.92,.95,1]},{id:`u_secondary_color`,name:`Blade Void`,type:`color`,default:[.1,.1,.15,1]}]},Rc=s({default:()=>zc}),zc={id:`twill_carbon_pro`,name:`Pro Twill Carbon`,category:`Racing`,description:`Classic high-detail 2x2 carbon fiber weave.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      float checker = mod(id.x + id.y, 2.0);
      float pattern = step(0.5, abs(gv.x - gv.y));
      if (checker > 0.5) pattern = 1.0 - pattern;
      return mix(u_secondary_color, u_primary_color, pattern);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Primary`,type:`color`,default:[.12,.12,.12,1]},{id:`u_secondary_color`,name:`Secondary`,type:`color`,default:[.05,.05,.05,1]}]},Bc=s({default:()=>V}),V={id:`tyre_burnout`,name:`Tyre Burnout`,category:`Racing`,description:`Dark rubber burnout and skid marks on asphalt with irregular fuzzy edges, lighter internal streaks, and visible tyre tread impressions.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.2; a *= 0.5;
      }
      return v;
    }

    // Tread imprint — parallel lateral bars (simulate tread blocks)
    float treadPattern(vec2 uv, float width) {
      // Tread bars run across the track width (X), repeat in Y
      float bar = fract(uv.y * 18.0);
      bar = step(0.3, bar) * step(bar, 0.7); // alternating blocks
      // Only show tread within the track band
      float xDist = abs(uv.x - 0.5) / (width * 0.5);
      float inTrack = smoothstep(1.0, 0.85, xDist);
      return bar * inTrack * 0.6;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Track envelope along X ---
      // Lateral distance from track centre, normalised
      float xDist = abs(uv.x - 0.5) / (u_width * 0.5);

      // Fuzzy track edge — warp xDist with low-freq noise
      float edgeWarp = fbm(vec2(uv.y * 3.0, uv.x * 1.5)) * 0.25 - 0.125;
      float warpedX = xDist + edgeWarp;

      // Core track mask — dark rubber is densest in the middle
      float trackCore = smoothstep(1.0, 0.4, warpedX);

      // Outer fringe — lighter smear at the edge
      float fringe = smoothstep(1.3, 0.9, warpedX) - trackCore;
      fringe = max(fringe, 0.0);

      // --- Longitudinal variation (acceleration / partial grip) ---
      float longVar = fbm(vec2(uv.x * 4.0, uv.y * 6.0));
      // Patches of lighter rubber (partial grip: partial deposit)
      float partialGrip = smoothstep(0.45, 0.65, longVar);

      // Tread imprint within track
      float tread = treadPattern(uv, u_width);
      // Only show where trackCore is present
      tread *= trackCore * 0.7;

      // --- Combine rubber deposit ---
      float rubberDeposit = trackCore * mix(0.5, 1.0, partialGrip) * u_intensity;
      rubberDeposit = clamp(rubberDeposit, 0.0, 1.0);

      // Asphalt base
      vec3 col = u_asphalt.rgb;
      // Add surface noise to asphalt
      float aspNoise = noise(uv * 120.0) * 0.05 - 0.025;
      col += vec3(aspNoise);

      // Fringe — partially deposited rubber, lighter mix
      vec3 fringeColor = mix(u_asphalt.rgb, u_rubber_color.rgb, 0.5);
      col = mix(col, fringeColor, fringe * u_intensity * 0.6);

      // Core rubber
      col = mix(col, u_rubber_color.rgb, rubberDeposit);

      // Partial grip lighter streaks (less rubber on lighter areas)
      float streakLight = (1.0 - partialGrip) * trackCore * 0.4 * u_intensity;
      col = mix(col, u_asphalt.rgb * 1.15, streakLight);

      // Tread imprint — very slightly lighter within deposit
      col += vec3(tread * 0.06);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_asphalt`,name:`Asphalt`,type:`color`,default:[.18,.17,.16,1]},{id:`u_rubber_color`,name:`Rubber`,type:`color`,default:[.04,.03,.03,1]},{id:`u_intensity`,name:`Intensity`,type:`float`,min:.2,max:2,default:1},{id:`u_width`,name:`Track Width`,type:`float`,min:.05,max:.5,default:.25}]},Vc=s({default:()=>Hc}),Hc={id:`vaporwave_sun_artisan`,name:`Retro Sun`,category:`Abstract`,description:`Segmented radial retro sun patterns found in 80s synthwave and vaporwave aesthetics.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float mask = step(d, 0.4);
      float stripes = step(0.1, fract(v_uv.y * 10.0));
      return mix(u_secondary_color, u_primary_color, mask * stripes);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sun Core`,type:`color`,default:[1,.6,0,1]},{id:`u_secondary_color`,name:`Atmosphere`,type:`color`,default:[1,0,.5,1]}]},Uc=s({default:()=>Wc}),Wc={id:`velvet_pile`,name:`Velvet Pile`,category:`Industrial`,description:`Velvet fabric with directional pile sheen â€” bright along the pile, dark against it, with a dramatic direction effect.`,shader:`
    // Hash noise for micro-fibre variation
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float smoothNoise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec3  baseCol  = u_base_color.rgb;
      float pileAngle = u_pile_direction;
      float sheen    = u_sheen;

      // Pile direction vector (unit vector in direction of pile lay)
      vec2 pileDir = vec2(cos(pileAngle), sin(pileAngle));

      // UV centred
      vec2 uv = v_uv - 0.5;

      // "View direction" approximation: simulate looking straight down at the fabric
      // The effective highlight depends on the angle between the pile direction
      // and the gradient of UV â€” simulating a raking light from upper-left
      vec2 lightDir = normalize(vec2(0.6, 0.8));

      // Pile orientation factor: how much the pile faces the light
      float pileDot = dot(pileDir, lightDir);

      // Micro-variation in pile direction (velvet is never perfectly uniform)
      float microNoise = smoothNoise(v_uv * 28.0) * 2.0 - 1.0;
      float microNoise2 = smoothNoise(v_uv * 7.0) * 2.0 - 1.0;

      // Local pile angle variation
      float localAngle = pileAngle + microNoise * 0.25 + microNoise2 * 0.08;
      vec2 localPile   = vec2(cos(localAngle), sin(localAngle));
      float localDot   = dot(localPile, lightDir);

      // Sheen factor: cos^n of angle between pile and view
      // Bright when pile faces light, dark when it faces away
      float sheenFactor = localDot * 0.5 + 0.5;   // [0,1]
      sheenFactor = pow(sheenFactor, 1.0 / max(sheen, 0.01));

      // Velvet characteristic: bright saturation in highlight direction
      // dark with increased saturation in shadow direction
      float bright = sheenFactor;
      float dark   = 1.0 - sheenFactor;

      // Luminance-preserving colour shift
      vec3 lightened = mix(baseCol, baseCol + (1.0 - baseCol) * 0.6, bright * sheen * 0.5);
      vec3 darkened  = baseCol * (0.22 + 0.78 * (1.0 - dark * sheen * 0.6));

      vec3 col = mix(darkened, lightened, sheenFactor);

      // Micro-fibre sparkle at highlight peak
      float sparkle = hash21(floor(v_uv * 140.0)) * pow(sheenFactor, 4.0) * sheen * 0.15;
      col += sparkle;

      // Fine micro-texture from pile tips
      float micro = smoothNoise(v_uv * 80.0) * 0.04 - 0.02;
      col += micro * sheenFactor;

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_base_color`,type:`color`,default:[.35,.05,.08,1],name:`Velvet Colour`},{id:`u_pile_direction`,type:`float`,default:.785,min:0,max:6.28,name:`Pile Direction (rad)`},{id:`u_sheen`,type:`float`,default:1.2,min:.3,max:2,name:`Sheen Intensity`}]},Gc=s({default:()=>Kc}),Kc={id:`verdigris_patina`,name:`Verdigris Patina`,category:`Industrial`,description:`Aged copper or bronze with green-blue verdigris oxidation pooling in recesses over warm reddish copper.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_vp(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_vp(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_vp(i);
      float b = hash1_vp(i + vec2(1.0, 0.0));
      float c = hash1_vp(i + vec2(0.0, 1.0));
      float d = hash1_vp(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for patina coverage mask
    float fbm_vp(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 5; i++) {
        v += a * smoothnoise_vp(p * s);
        s *= 2.03;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Primary patina coverage mask
      float mask = fbm_vp(uv);

      // Secondary relief noise — surface topology (raised/recessed areas)
      float relief = fbm_vp(uv * 1.6 + vec2(5.2, 3.7));

      // Patina pools in recesses (low relief = low areas = more patina)
      // Bias mask by relief: high relief = less oxidation
      float patina_amount = mask - (relief - 0.5) * 0.35;
      patina_amount = clamp(patina_amount, 0.0, 1.0);

      // Apply coverage control — shift threshold
      float coverage_threshold = 1.0 - u_patina_coverage;
      float patina_t = smoothstep(coverage_threshold - 0.15, coverage_threshold + 0.25, patina_amount);

      // Bare copper threshold — very low mask = polished copper glimpse
      float bare_t = smoothstep(coverage_threshold - 0.3, coverage_threshold - 0.15, patina_amount);

      // Colors
      vec3 copper_base    = vec3(0.72, 0.35, 0.15);   // reddish-orange raw copper
      vec3 copper_polish  = vec3(0.85, 0.48, 0.20);   // brighter polished copper highlight
      vec3 transition     = vec3(0.35, 0.52, 0.40);   // intermediate blue-green
      vec3 verdigris      = u_patina_color.rgb;        // vivid verdigris green-blue

      // Copper base: mix polished and base by relief (raised = more polish)
      float polish_t = smoothstep(0.4, 0.7, relief);
      vec3  copper   = mix(copper_base, copper_polish, polish_t);

      // Transition zone: copper -> blue-green -> verdigris
      vec3 col = copper;
      col = mix(col, transition, smoothstep(0.0, 0.5, patina_t));
      col = mix(col, verdigris,  smoothstep(0.4, 1.0, patina_t));

      // Where mask is very low: bare copper gleam
      col = mix(col, copper_polish, (1.0 - bare_t) * (1.0 - patina_t) * 0.5);

      // Subtle metallic surface grain
      float grain = smoothnoise_vp(uv * 12.0) * 0.06 - 0.03;
      col += grain;

      // Add slight depth variation from relief (recessed = slightly darker)
      float depth = mix(0.80, 1.05, smoothstep(0.3, 0.7, relief));
      col *= depth;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_patina_coverage`,name:`Patina Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:15,default:5},{id:`u_patina_color`,name:`Verdigris Color`,type:`color`,default:[.18,.52,.42,1]}]},qc=s({default:()=>Jc}),Jc={id:`vinyl_wrap`,name:`Vinyl Wrap Film`,category:`Racing`,description:`Matte vinyl wrap film with characteristic micro-pebble surface texture and subtle directional sheen. Excellent as a spec or normal-map source for flat paint finishes.`,shader:`
    float hash_vw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_vw(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_vw(i), hash_vw(i+vec2(1,0)), f.x),
                 mix(hash_vw(i+vec2(0,1)), hash_vw(i+vec2(1,1)), f.x), f.y);
    }

    // Voronoi cell for micro-pebble
    float voronoi_vw(vec2 uv) {
      vec2 cell = floor(uv);
      vec2 frac  = fract(uv);
      float minDist = 8.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 nb  = vec2(float(x), float(y));
          vec2 pt  = nb + vec2(hash_vw(cell + nb + 0.17), hash_vw(cell + nb + 0.89)) - frac;
          minDist  = min(minDist, dot(pt, pt));
        }
      }
      return sqrt(minDist);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Micro-pebble surface ----
      // Two scales of voronoi create the fine orange-peel texture of vinyl
      float pebble  = voronoi_vw(uv * u_pebble_scale);
      float pebble2 = voronoi_vw(uv * u_pebble_scale * 2.8 + 3.7);
      float surface = pebble * 0.65 + pebble2 * 0.35;

      // Convert to a gentle bump map luminance
      float bump = smoothstep(0.0, 0.55, surface) * u_texture_depth;

      // ---- Directional sheen (vinyl has a slight gloss in one direction) ----
      float sheen = pow(max(0.0, 1.0 - abs(uv.x - 0.5) * 2.0), 6.0) * 0.10 * u_sheen;

      // ---- Compose with base colour ----
      vec3 base   = u_base_color.rgb;
      // Shadow in pebble valleys, highlight on ridges
      vec3 shadow = base * 0.78;
      vec3 col    = mix(shadow, base, bump) + vec3(sheen);

      // Fine noise for printing grain
      float grain = (noise_vw(uv * 320.0) - 0.5) * 0.012;
      col += vec3(grain);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Colour`,type:`color`,default:[.12,.12,.15,1]},{id:`u_pebble_scale`,name:`Pebble Scale`,type:`float`,default:80,min:20,max:200},{id:`u_texture_depth`,name:`Texture Depth`,type:`float`,default:.7,min:0,max:1},{id:`u_sheen`,name:`Gloss Sheen`,type:`float`,default:.6,min:0,max:1}]},Yc=s({default:()=>Xc}),Xc={id:`void_grid_artisan`,name:`Void Grid`,category:`Abstract`,description:`Infinite perspective grid reminiscent of 1980s retro-futuristic digital visualization.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[1,0,1,1]},{id:`u_secondary_color`,name:`Void Base`,type:`color`,default:[0,0,.05,1]}]},Zc=s({default:()=>Qc}),Qc={id:`volcanic_basalt_artisan`,name:`Basalt Pillar`,category:`Geology`,description:`Pitted, geometric volcanic rock found in hexagonal basalt formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pillar Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rock Face`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pillar Joint`,type:`color`,default:[0,0,.05,1]}]},$c=s({default:()=>el}),el={id:`voronoi_cells_pro`,name:`Voronoi Cells`,category:`Abstract`,description:`Mathematical fractured cell structures often found in biological and geological formations.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec2 hash2(vec2 p) {
      return vec2(hash(p), hash(p + 1.0));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv);
      
      float minDist = 1.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          vec2 p = hash2(id + offset);
          float d = length(gv - (offset + p));
          minDist = min(minDist, d);
        }
      }
      
      float mask = smoothstep(0.0, 1.0, minDist);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cell Center`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Cell Border`,type:`color`,default:[.1,.1,.12,1]}]},tl=s({default:()=>nl}),nl={id:`washi_paper`,name:`Washi Paper`,category:`Natural`,description:`Japanese handmade washi paper with long random fibres, mottled translucency, and cream base.`,shader:`
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float noise2(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Anisotropic fibre noise: stretched heavily in one direction to simulate long fibres
    float fibreNoise(vec2 uv, float angle, float stretch) {
      float c = cos(angle);
      float s = sin(angle);
      vec2 rotUV = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      // Stretch along the fibre direction, keep thin across
      vec2 stretchedUV = vec2(rotUV.x / stretch, rotUV.y * 80.0);
      float n = noise2(stretchedUV * u_fiber_density);
      // Threshold to get distinct fibre lines rather than a wash
      return smoothstep(0.55, 0.75, n);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Mottled base — low-frequency unevenness of handmade paper
      float mottling = noise2(uv * 3.5) * 0.06
                     + noise2(uv * 9.0)  * 0.03
                     + noise2(uv * 28.0) * 0.015;

      vec3 base = u_paper_color.rgb + (mottling - 0.055);

      // Three fibre layers at slightly different angles (paper screen is mostly horizontal)
      float f1 = fibreNoise(uv, 0.0,    12.0);          // horizontal fibres
      float f2 = fibreNoise(uv, 0.18,   10.0);          // slight right bias
      float f3 = fibreNoise(uv, -0.22,   9.0);          // slight left bias
      float f4 = fibreNoise(uv, 0.55,    6.0) * 0.4;   // occasional diagonal crossing fibre

      float fibreAcc = clamp(f1 * 0.5 + f2 * 0.4 + f3 * 0.35 + f4, 0.0, 1.0);

      // Fine surface grain
      float grain = noise2(uv * 120.0) * 0.02;
      base += grain - 0.01;

      vec3 col = mix(base, u_fiber_color.rgb, fibreAcc * 0.7);

      // Subtle warm variation across the sheet
      float warmth = noise2(uv * 2.0) * 0.025;
      col.r += warmth;
      col.g += warmth * 0.5;

      col = clamp(col, 0.0, 1.0);
      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_fiber_density`,name:`Fibre Density`,type:`float`,min:1,max:12,default:4},{id:`u_paper_color`,name:`Paper Colour`,type:`color`,default:[.93,.91,.85,1]},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.6,.54,.44,1]}]},rl=s({default:()=>H}),H={id:`water_ripples_artisan`,name:`Water Ripples`,category:`Natural`,description:`Static concentric liquid wave interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      // Removed time from ripple function
      float ripple = sin(d * 20.0);
      float mask = smoothstep(-0.1, 0.1, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Scale`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Color`,type:`color`,default:[.1,.6,1,1]},{id:`u_secondary_color`,name:`Deep Water`,type:`color`,default:[0,.2,.4,1]}]},il=s({default:()=>al}),al={id:`watercolor_bleed_artisan`,name:`Watercolor Flow`,category:`Abstract`,description:`Soft organic color spreads and bleeding textures mimicking paint on high-fidelity wet paper.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 5.0 + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Bleed`,type:`color`,default:[.2,.4,.8,.8]},{id:`u_secondary_color`,name:`Pulp Base`,type:`color`,default:[.95,.95,.9,1]}]},U=s({default:()=>ol}),ol={id:`wavy_checkers_artisan`,name:`Wavy Checkers`,category:`Racing`,description:`Flowing, distorted racing flags mimicking a waving checkered banner.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      uv.x += sin(uv.y * 3.0) * 0.2;
      uv.y += cos(uv.x * 2.0) * 0.1;
      
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Check Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Checker A`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Checker B`,type:`color`,default:[0,0,0,1]}]},sl=s({default:()=>cl}),cl={id:`weathered_paint_artisan`,name:`Weathered Paint`,category:`Industrial`,description:`Chipped and peeling paint flakes mimicking aged industrial surfaces.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = step(0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Detail`,type:`float`,min:5,max:50,default:10},{id:`u_primary_color`,name:`Paint`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Exposed Metal`,type:`color`,default:[.3,.3,.35,1]}]},W=s({default:()=>ll}),ll={id:`weathered_rust_pro`,name:`Weathered Rust`,category:`Industrial`,description:`Pro-grade oxidizing metallic surface with realistic pitting and oxidation layers.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv);
      float n2 = noise(uv * 2.5 + n1);
      float mask = smoothstep(0.4, 0.6, n1 * 0.5 + n2 * 0.3);
      
      vec4 steel = vec4(0.4, 0.4, 0.42, 1.0);
      vec4 rust = vec4(0.5, 0.2, 0.1, 1.0);
      
      return mix(steel, rust, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rust Intensity`,type:`float`,min:1,max:20,default:5}]},ul=s({default:()=>dl}),dl={id:`wicker_weave_artisan`,name:`Wicker Weave`,category:`Natural`,description:`Interlocking thick strands of woven wood found in traditional basketry.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float w = floor(uv.y);
      if (mod(w, 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Wicker Slat`,type:`color`,default:[.7,.5,.3,1]},{id:`u_secondary_color`,name:`Joint Deep`,type:`color`,default:[.2,.1,.05,1]}]},fl=s({default:()=>pl}),pl={id:`wire_wound`,name:`Wire Wound`,category:`Industrial`,description:`Tightly wound coil seen from above — concentric oval rings from wire turns with bright highlights and trailing-edge shadows, as in a solenoid cross-section.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Oval ring radius: slight Y compression gives wound-coil perspective
    float ovalRadius(vec2 uv) {
      vec2 p = uv - 0.5;
      // Compress Y slightly to give an oblique view of the coil axis
      p.y *= 1.35;
      return length(p);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float r = ovalRadius(uv);

      // Map radius to coil turns
      // r goes 0 (centre) to ~0.7 (corners); scale to turns count
      float rNorm = r * 2.0; // 0..1 across half-width
      float ring = fract(rNorm * u_turns);

      // Wire cross-section profile: bright lit top, dark shadow underneath
      // ring 0 = wire top (bright), ring 0.5 = gap (dark), ring ~0.8 = shadow underside
      // Smooth cosine-like profile
      float wireProfile = (cos(ring * 6.2832) * 0.5 + 0.5);

      // Shadow asymmetry — trailing edge (ring 0.5–1.0) is darker (self-shadow)
      float shadow = smoothstep(0.5, 0.85, ring) * 0.5;

      // Blend wire colour and gap colour
      // Gap is not zero — you see the gap shadow and the previous wire layer beneath
      vec3 wireCol = u_wire_color.rgb;
      vec3 gapCol  = u_gap_color.rgb;

      // Lit top
      vec3 lit    = wireCol * mix(0.75, 1.35, wireProfile);
      // Shadow fade on trailing side
      lit -= vec3(shadow * 0.35);

      // Mix wire face vs gap
      float gapMask = smoothstep(0.45, 0.55, ring); // gap at ring ~0.5
      vec3 col = mix(lit, gapCol, gapMask * 0.85);

      // Fine surface micro-noise on the wire (surface texture)
      float micro = noise(uv * 80.0) * 0.03 - 0.015;
      col += vec3(micro);

      // Vignette towards edges (coil out-of-frame)
      float vig = smoothstep(0.72, 0.48, rNorm);
      col = mix(gapCol * 0.6, col, vig);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_turns`,name:`Coil Turns`,type:`float`,min:4,max:30,default:12},{id:`u_wire_color`,name:`Wire Color`,type:`color`,default:[.75,.73,.68,1]},{id:`u_gap_color`,name:`Gap Color`,type:`color`,default:[.1,.09,.08,1]}]},ml=s({default:()=>hl}),hl={id:`wood_block_print_artisan`,name:`Wood Print`,category:`Abstract`,description:`Coarse carved relief texture mimicking traditional wood block printing techniques.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 80.0);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 5.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Relief High`,type:`color`,default:[.2,.2,.2,1]},{id:`u_secondary_color`,name:`Carved Wood`,type:`color`,default:[.1,.05,0,1]}]},gl=s({default:()=>_l}),_l={id:`wood_grain_artisan`,name:`Wood Grain Pro`,category:`Natural`,description:`High-detail procedural timber with concentric growth rings and knots.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv * 0.1);
      float ring = fract(length(uv - n * 2.0) * 5.0);
      float mask = smoothstep(0.4, 0.6, ring);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wood density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Grain Color`,type:`color`,default:[.3,.15,.05,1]},{id:`u_secondary_color`,name:`Base Timber`,type:`color`,default:[.45,.25,.1,1]}]},vl=s({default:()=>yl}),yl={id:`wood_parquet_artisan`,name:`Wood Parquet`,category:`Industrial`,description:`Complex interlocking geometric floor planks for premium interior design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mosaic Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Plank A`,type:`color`,default:[.5,.3,.1,1]},{id:`u_secondary_color`,name:`Plank B`,type:`color`,default:[.4,.25,.08,1]}]},bl=s({default:()=>xl}),xl={id:`woodland_classic_camo`,name:`Woodland Classic Camo`,category:`Organic`,description:`Classic M81 style camouflage with large organic blobs overlapping each other.`,shader:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(5.2, 1.3));
      float n3 = fbm(uv + vec2(10.1, -3.4));
      
      vec4 color = u_color_base;
      if (n1 > 0.1) color = u_color_1;
      if (n2 > 0.3) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Classic Woodland`,uniforms:{u_color_base:[.63,.56,.45,1],u_color_1:[.28,.35,.22,1],u_color_2:[.35,.26,.18,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.82,.75,.61,1],u_color_1:[.73,.62,.47,1],u_color_2:[.55,.44,.31,1],u_color_3:[.35,.25,.15,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.7,.7,.75,1],u_color_1:[.45,.45,.5,1],u_color_2:[.25,.25,.3,1],u_color_3:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.04,.04,.05,1],u_color_3:[.01,.01,.01,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base (Tan)`,type:`color`,default:[.63,.56,.45,1]},{id:`u_color_1`,name:`Layer 1 (Green)`,type:`color`,default:[.28,.35,.22,1]},{id:`u_color_2`,name:`Layer 2 (Brown)`,type:`color`,default:[.35,.26,.18,1]},{id:`u_color_3`,name:`Layer 3 (Black)`,type:`color`,default:[.08,.08,.08,1]}]},Sl=s({default:()=>Cl}),Cl={id:`worn_asphalt`,name:`Worn Asphalt`,category:`Racing`,description:`Heavily worn racing asphalt with exposed aggregate, oil-stained patches, crack lines, and rubber marbling from racing tyres.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    // Crack lines — thin dark lines following noise gradient breaks
    float crackMap(vec2 uv, float density) {
      // Use fbm derivatives to find steep gradients = cracks
      vec2 q = uv * density;
      float f1 = fbm(q);
      float f2 = fbm(q + vec2(0.01, 0.0));
      float f3 = fbm(q + vec2(0.0, 0.01));
      float grad = length(vec2(f2 - f1, f3 - f1)) * 80.0;
      // Crack = high gradient region
      return smoothstep(0.6, 1.2, grad);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Base worn asphalt ---
      // Exposed aggregate: lighter grey where tar is worn away
      float wearMap = fbm(uv * 3.5);
      wearMap = smoothstep(0.35, 0.65, wearMap);
      // Apply wear amount — u_wear 1.0 = maximum exposure
      float aggregateExpose = wearMap * u_wear;

      // Aggregate colour is lighter (stone grey) vs tar (dark)
      vec3 tarColor       = u_base_color.rgb;
      vec3 aggregateColor = u_base_color.rgb * 1.45 + vec3(0.05, 0.05, 0.04);

      vec3 col = mix(tarColor, aggregateColor, aggregateExpose);

      // Fine asphalt grain noise
      float grain = noise(uv * 200.0) * 0.07 - 0.035;
      col += vec3(grain);

      // --- Oil stains ---
      // Dark, slightly iridescent patches; positioned by low-freq noise
      float oilMap = fbm(uv * 2.2 + vec2(3.1, 7.4));
      oilMap = smoothstep(0.58, 0.72, oilMap) * u_wear * 0.8;
      // Oil is very dark with slight rainbow shimmer (handled as dark brownish)
      vec3 oilColor = vec3(0.07, 0.065, 0.05);
      col = mix(col, oilColor, oilMap);
      // Faint iridescent tinge at oil edges
      float oilEdge = smoothstep(0.55, 0.58, fbm(uv * 2.2 + vec2(3.1, 7.4)));
      col += vec3(oilEdge * 0.03, oilEdge * 0.02, oilEdge * 0.04) * u_wear;

      // --- Rubber marbling from tyres ---
      // Dark rubber smears — streaky near the racing line (varies with Y mostly)
      float rubberMap = fbm(vec2(uv.x * 6.0, uv.y * 2.0) + vec2(1.7, 0.9));
      rubberMap = smoothstep(0.58, 0.70, rubberMap) * u_wear * 0.65;
      vec3 rubberColor = vec3(0.06, 0.055, 0.05);
      col = mix(col, rubberColor, rubberMap);

      // --- Crack lines ---
      float cracks = crackMap(uv, u_crack_density) * u_wear;
      // Cracks are very dark, thin
      col = mix(col, vec3(0.05, 0.05, 0.04), cracks * 0.85);

      // --- Patch repairs (occasional lighter grey patches) ---
      float patch = fbm(uv * 1.8 + vec2(5.5, 2.2));
      patch = step(0.70, patch) * step(patch, 0.75) * u_wear * 0.5;
      vec3 patchColor = vec3(0.35, 0.34, 0.33);
      col = mix(col, patchColor, patch);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_wear`,name:`Wear Level`,type:`float`,min:0,max:1,default:.7},{id:`u_base_color`,name:`Asphalt Base`,type:`color`,default:[.28,.27,.26,1]},{id:`u_crack_density`,name:`Crack Density`,type:`float`,min:1,max:10,default:4}]},wl=s({default:()=>Tl}),Tl={id:`woven_fiberglass`,name:`Woven Fiberglass`,category:`Industrial`,description:`E-glass plain-weave fiberglass cloth with cream tow bundles, glass-sheen highlights, and amber resin pockets.`,shader:`
    // Smooth Hermite profile for a tow cross-section.
    // Returns 1.0 at the crown (phase == 0) and 0.0 at the flanks.
    float towProfile(float phase) {
      float c = cos(phase * 3.14159265);
      return clamp(c * 0.5 + 0.5, 0.0, 1.0);
    }

    // High-freq hash for fine fiber surface noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_weave_scale;

      // ---- Warp tows (running along Y, repeat in X) ----
      float warpPhase = fract(uv.x);           // 0-1 across each warp tow column
      float warpHeight = towProfile(warpPhase * 2.0 - 1.0); // crown at x=0.5

      // Over-under interlace: warp tow rises and sinks based on weft grid cell parity
      float weftCell = floor(uv.y);
      float warpInterlace = mod(weftCell, 2.0) < 1.0 ? 1.0 : 0.0;
      // Height of warp tow above surface: high when warpInterlace=1
      float warpZ = warpHeight * mix(0.3, 1.0, warpInterlace);

      // ---- Weft tows (running along X, repeat in Y) ----
      float weftPhase = fract(uv.y);
      float weftHeight = towProfile(weftPhase * 2.0 - 1.0);

      float warpCell = floor(uv.x);
      float weftInterlace = mod(warpCell, 2.0) < 1.0 ? 0.0 : 1.0;
      float weftZ = weftHeight * mix(0.3, 1.0, weftInterlace);

      // ---- Determine which tow is on top ----
      // Whichever tow has higher Z wins the pixel; blend gently near crossover
      float zDiff = warpZ - weftZ;
      float blend = smoothstep(-0.15, 0.15, zDiff); // 1 = warp on top, 0 = weft on top
      float topZ   = mix(weftZ, warpZ, blend);

      // ---- Specular highlight on tow crown ----
      // Crown of the top tow catches light
      float spec = pow(clamp(topZ, 0.0, 1.0), 3.0) * u_sheen;

      // ---- Fine fiber surface noise ----
      float fiberNoise = noise(uv * 6.0) * 0.04 - 0.02;

      // ---- Resin pocket brightness ----
      // Where both tows are low (intersection valleys), resin is visible
      float resinMask = (1.0 - clamp(warpZ + weftZ, 0.0, 1.0));
      resinMask = pow(resinMask, 3.0);

      // ---- Compose colors ----
      vec3 fiberCol = u_fiber_color.rgb + fiberNoise;
      vec3 col = mix(fiberCol, u_resin_color.rgb, resinMask * 0.7);

      // Add glass-sheen specular highlight (white-ish)
      col += vec3(spec * 0.55, spec * 0.55, spec * 0.58);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_fiber_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_weave_scale`,name:`Weave Scale`,type:`float`,min:2,max:30,default:12},{id:`u_fiber_color`,name:`Fiber Color`,type:`color`,default:[.88,.88,.84,1]},{id:`u_resin_color`,name:`Resin Color`,type:`color`,default:[.55,.52,.47,1]},{id:`u_sheen`,name:`Glass Specularity`,type:`float`,min:0,max:2,default:1}]},El=s({default:()=>Dl}),Dl={id:`zebra_camo_v2_artisan`,name:`Zebra Camo v2`,category:`Abstract`,description:`High-contrast geometric distortion variant of precision camouflages.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x + sin(uv.y * 2.0)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`High Contrast (Default)`,uniforms:{u_primary_color:[0,0,0,1],u_secondary_color:[1,1,1,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.02,.02,.02,1],u_secondary_color:[.15,.15,.15,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Stripe A`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Stripe B`,type:`color`,default:[1,1,1,1]}]},Ol=[`All`,`Racing`,`Geometric`,`Technology`,`Organic`,`Utility`,`Industrial`,`Abstract`,`Natural`],kl=Object.values(Object.assign({"./patterns/acid_etch.js":x,"./patterns/aero_riblets.js":S,"./patterns/alcantara_suede.js":te,"./patterns/amethyst.js":re,"./patterns/anodized_blue.js":ie,"./patterns/anodized_bronze.js":oe,"./patterns/anodized_red.js":ce,"./patterns/anodized_titanium.js":ue,"./patterns/apex_curbing.js":E,"./patterns/argyle_knit.js":fe,"./patterns/armco_barrier.js":me,"./patterns/asphalt_pro.js":O,"./patterns/autumn_leaves.js":he,"./patterns/banded_agate.js":_e,"./patterns/barbed_wire.js":ye,"./patterns/bird_plumage.js":xe,"./patterns/bismuth_crystal.js":Ce,"./patterns/blueprint_grid.js":Te,"./patterns/bone_pores.js":De,"./patterns/braided_cord.js":ke,"./patterns/brain_coral.js":je,"./patterns/brake_dust.js":Ne,"./patterns/brake_rotor_wear.js":Fe,"./patterns/brake_rotors.js":Le,"./patterns/brick_masonry.js":ze,"./patterns/brushed_aluminum.js":Ve,"./patterns/brushed_gold.js":Ue,"./patterns/bubblewrap.js":Ge,"./patterns/burlap_sack.js":qe,"./patterns/butterfly_wing.js":Ye,"./patterns/cactus_needles.js":Ze,"./patterns/candy_paint.js":$e,"./patterns/canvas_rip.js":tt,"./patterns/carpet_velour.js":rt,"./patterns/cast_iron.js":at,"./patterns/chain_mail.js":st,"./patterns/chalkboard_dust.js":lt,"./patterns/charcoal_sketch.js":dt,"./patterns/choc_chip_camo.js":pt,"./patterns/chopped_carbon.js":ht,"./patterns/chrome_mirror.js":_t,"./patterns/circuit_traces.js":yt,"./patterns/coral_reef.js":xt,"./patterns/corduroy_rib.js":Ct,"./patterns/corroded_aluminum.js":Tt,"./patterns/corrugated_steel.js":Dt,"./patterns/crocodile_hide.js":Ot,"./patterns/cyber_grid.js":At,"./patterns/cyber_leather.js":Mt,"./patterns/cyber_twill.js":Pt,"./patterns/cyber_wiring.js":It,"./patterns/damask_lace.js":Rt,"./patterns/damask_silk.js":Bt,"./patterns/data_matrix.js":Ht,"./patterns/demon_scales.js":Wt,"./patterns/denim_weave.js":Kt,"./patterns/desert_dunes.js":Jt,"./patterns/diamond_plate.js":Xt,"./patterns/diamond_quilt.js":Qt,"./patterns/diamond_stitch_v2.js":en,"./patterns/diatom_shells.js":nn,"./patterns/diffraction_grating.js":an,"./patterns/digi_camo_urban.js":sn,"./patterns/digital_camo_v2.js":ln,"./patterns/digital_glitch.js":dn,"./patterns/door_panel_fabric.js":pn,"./patterns/dragon_plate.js":hn,"./patterns/energy_shield.js":_n,"./patterns/etched_brass.js":yn,"./patterns/exhaust_heat.js":xn,"./patterns/expanded_grating.js":Cn,"./patterns/exposed_aggregate.js":Tn,"./patterns/fiber_optic_bundle.js":Dn,"./patterns/fingerprint_swirls.js":kn,"./patterns/fish_scales.js":jn,"./patterns/flecktarn_camo.js":Nn,"./patterns/fluid_marbling.js":Fn,"./patterns/forest_litter.js":Ln,"./patterns/forged_carbon.js":zn,"./patterns/frost_crystals.js":Vn,"./patterns/frozen_lake.js":Un,"./patterns/fusion_panel.js":Gn,"./patterns/galvanized_steel.js":qn,"./patterns/gauge_cluster.js":Yn,"./patterns/geometric_camo_ops.js":Zn,"./patterns/geometric_fracture.js":$n,"./patterns/glacier_ice.js":tr,"./patterns/glass_shards.js":rr,"./patterns/glitch_interference.js":ar,"./patterns/glitch_text_logic.js":sr,"./patterns/gold_leaf.js":lr,"./patterns/gold_leaf_flake.js":dr,"./patterns/gothic_filigree.js":pr,"./patterns/granite_speckle.js":hr,"./patterns/gravel_trap.js":_r,"./patterns/greek_key.js":yr,"./patterns/halftone_dots.js":xr,"./patterns/halftone_pop.js":Cr,"./patterns/hammered_copper.js":Tr,"./patterns/harlequin_diamond.js":Dr,"./patterns/headliner_mesh.js":kr,"./patterns/heat_blued_titanium.js":jr,"./patterns/herringbone.js":Nr,"./patterns/hex_basalt.js":Fr,"./patterns/hex_mesh.js":Lr,"./patterns/holographic_glitch.js":zr,"./patterns/honeycomb_bio.js":Vr,"./patterns/honeycomb_metal.js":Ur,"./patterns/houndstooth.js":Gr,"./patterns/hunting_camo.js":qr,"./patterns/impasto_paint.js":Yr,"./patterns/infinite_spiral.js":Zr,"./patterns/ink_blot_test.js":$r,"./patterns/interference_rings.js":ti,"./patterns/iris_fibers.js":ri,"./patterns/julia_fractal.js":ai,"./patterns/kevlar_grid.js":si,"./patterns/knurl_grip.js":li,"./patterns/laser_etch.js":di,"./patterns/lava_crust.js":pi,"./patterns/leaf_skeleton.js":hi,"./patterns/lichen_growth.js":_i,"./patterns/lichtenberg_trees.js":yi,"./patterns/linear_gradient.js":xi,"./patterns/linen_weave.js":Ci,"./patterns/liquid_mercury.js":Ti,"./patterns/louis_check.js":Di,"./patterns/machined_wheel.js":ki,"./patterns/macrame_knot.js":ji,"./patterns/mandala_radial.js":Ni,"./patterns/mandelbrot_fractal.js":Fi,"./patterns/maple_leaves.js":Li,"./patterns/marble_stone.js":zi,"./patterns/matte_clearcoat.js":Vi,"./patterns/mesh_jersey.js":M,"./patterns/metal_flake.js":Ui,"./patterns/micro_cells.js":Gi,"./patterns/micro_logic_grid.js":qi,"./patterns/microchip_wafer.js":Yi,"./patterns/moire_silk.js":Zi,"./patterns/monstera_leaf.js":$i,"./patterns/morpho_iridescence.js":ta,"./patterns/mother_of_pearl.js":ra,"./patterns/mud_cracks.js":aa,"./patterns/mud_splatter.js":sa,"./patterns/multi_env_camo.js":la,"./patterns/mushroom_gills.js":da,"./patterns/mylar_heatshield.js":pa,"./patterns/nanotech_cells.js":ma,"./patterns/nappa_leather.js":ga,"./patterns/nebula_dust.js":va,"./patterns/neon_tubes.js":ba,"./patterns/neoprene.js":Sa,"./patterns/neural_net.js":wa,"./patterns/nomex_weave.js":Ea,"./patterns/obsidian_fracture.js":Oa,"./patterns/oil_canvas.js":Aa,"./patterns/oil_slick.js":Ma,"./patterns/oil_stain.js":Pa,"./patterns/olive_branch.js":Ia,"./patterns/origami_fold.js":Ra,"./patterns/paint_chips.js":Ba,"./patterns/palm_fronds.js":Ha,"./patterns/paper_tear.js":Wa,"./patterns/pcb_traces_v3.js":Ka,"./patterns/peacock_eyes.js":Ja,"./patterns/pearl_flake_paint.js":Xa,"./patterns/peat_moss.js":Qa,"./patterns/penrose_tiling.js":eo,"./patterns/perforated_leather.js":no,"./patterns/perforated_sheet.js":io,"./patterns/petrified_wood.js":oo,"./patterns/pine_bark.js":co,"./patterns/piston_top.js":uo,"./patterns/pixel_art_canvas.js":po,"./patterns/plaid_tartan.js":ho,"./patterns/plant_cells.js":P,"./patterns/plasma_core.js":vo,"./patterns/pleated_fabric.js":I,"./patterns/polka_dot.js":yo,"./patterns/powder_coat.js":xo,"./patterns/prism_shards.js":Co,"./patterns/prismatic_flip.js":To,"./patterns/pulsar_radial.js":Eo,"./patterns/quantum_foam.js":Oo,"./patterns/quartz_crystal.js":Ao,"./patterns/racing_livery_stripe.js":Mo,"./patterns/radial_gradient.js":Po,"./patterns/rain_on_glass.js":Fo,"./patterns/reaction_diffusion.js":Lo,"./patterns/realistic_viper.js":zo,"./patterns/rim_spoke_carbon.js":Vo,"./patterns/river_cobble.js":Uo,"./patterns/river_stone.js":Go,"./patterns/rivet_lines.js":qo,"./patterns/rivet_plate_elite.js":Yo,"./patterns/roll_cage_foam.js":Zo,"./patterns/roof_shingles.js":$o,"./patterns/root_system.js":ts,"./patterns/rose_gold.js":rs,"./patterns/rubber_compound.js":as,"./patterns/safety_harness.js":ss,"./patterns/salt_crystal.js":ls,"./patterns/sand_dunes.js":ds,"./patterns/sandblasted_steel.js":ps,"./patterns/sandstone_layers.js":hs,"./patterns/seat_perforation.js":_s,"./patterns/server_rack_mesh.js":ys,"./patterns/shift_boot_leather.js":xs,"./patterns/sierpinski_carpet.js":Cs,"./patterns/sierpinski_mesh.js":Ts,"./patterns/single_rivet_row.js":Ds,"./patterns/skeletal_mesh.js":ks,"./patterns/slate_rock.js":js,"./patterns/snake_skin.js":Ns,"./patterns/snake_skin_v2.js":Fs,"./patterns/soap_bubble.js":Ls,"./patterns/solar_flare.js":zs,"./patterns/solar_flares_v2.js":Vs,"./patterns/speed_trails.js":Us,"./patterns/spider_web.js":Gs,"./patterns/splinter_camo.js":qs,"./patterns/spray_drip.js":Ys,"./patterns/stained_glass.js":Zs,"./patterns/star_field.js":$s,"./patterns/starlight_drive.js":tc,"./patterns/steel_wool.js":rc,"./patterns/stitched_leather.js":ac,"./patterns/tech_fractal.js":B,"./patterns/tech_hex_v2.js":cc,"./patterns/terrazzo_chip.js":uc,"./patterns/terrazzo_stone.js":fc,"./patterns/threaded_screw.js":mc,"./patterns/tig_weld.js":gc,"./patterns/tiger_stripe_camo.js":vc,"./patterns/tiger_stripes.js":bc,"./patterns/tinted_carbon.js":Sc,"./patterns/tire_marbles.js":wc,"./patterns/tire_sidewall.js":Ec,"./patterns/tire_tread_rain.js":Oc,"./patterns/topo_map.js":Ac,"./patterns/travertine.js":Mc,"./patterns/truchet_tiles.js":Pc,"./patterns/turbo_fan.js":Ic,"./patterns/twill_carbon.js":Rc,"./patterns/tyre_burnout.js":Bc,"./patterns/vaporwave_sun.js":Vc,"./patterns/velvet_pile.js":Uc,"./patterns/verdigris_patina.js":Gc,"./patterns/vinyl_wrap.js":qc,"./patterns/void_grid.js":Yc,"./patterns/volcanic_basalt.js":Zc,"./patterns/voronoi_cells.js":$c,"./patterns/washi_paper.js":tl,"./patterns/water_ripples.js":rl,"./patterns/watercolor_bleed.js":il,"./patterns/wavy_checkers.js":U,"./patterns/weathered_paint.js":sl,"./patterns/weathered_rust.js":W,"./patterns/wicker_weave.js":ul,"./patterns/wire_wound.js":fl,"./patterns/wood_block_print.js":ml,"./patterns/wood_grain_pro.js":gl,"./patterns/wood_parquet.js":vl,"./patterns/woodland_classic_camo.js":bl,"./patterns/worn_asphalt.js":Sl,"./patterns/woven_fiberglass.js":wl,"./patterns/zebra_camo_v2.js":El})).map(e=>e.default),Al=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),jl=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),Ml=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),Nl=e=>{let t=Ml(e);return t.charAt(0).toUpperCase()+t.slice(1)},Pl={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},Fl=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},Il=(0,v.createContext)({}),Ll=()=>(0,v.useContext)(Il),Rl=(0,v.forwardRef)(({color:e,size:t,strokeWidth:n,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s},c)=>{let{size:l=24,strokeWidth:u=2,absoluteStrokeWidth:d=!1,color:f=`currentColor`,className:p=``}=Ll()??{},m=r??d?Number(n??u)*24/Number(t??l):n??u;return(0,v.createElement)(`svg`,{ref:c,...Pl,width:t??l??Pl.width,height:t??l??Pl.height,stroke:e??f,strokeWidth:m,className:Al(`lucide`,p,i),...!a&&!Fl(s)&&{"aria-hidden":`true`},...s},[...o.map(([e,t])=>(0,v.createElement)(e,t)),...Array.isArray(a)?a:[a]])}),zl=(e,t)=>{let n=(0,v.forwardRef)(({className:n,...r},i)=>(0,v.createElement)(Rl,{ref:i,iconNode:t,className:Al(`lucide-${jl(Nl(e))}`,`lucide-${e}`,n),...r}));return n.displayName=Nl(e),n},G=zl(`download`,[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]),K=zl(`info`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]]),q=zl(`layers`,[[`path`,{d:`M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z`,key:`zw3jo`}],[`path`,{d:`M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12`,key:`1wduqc`}],[`path`,{d:`M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17`,key:`kqbvx6`}]]),J=zl(`maximize`,[[`path`,{d:`M8 3H5a2 2 0 0 0-2 2v3`,key:`1dcmit`}],[`path`,{d:`M21 8V5a2 2 0 0 0-2-2h-3`,key:`1e4gt3`}],[`path`,{d:`M3 16v3a2 2 0 0 0 2 2h3`,key:`wsl5sc`}],[`path`,{d:`M16 21h3a2 2 0 0 0 2-2v-3`,key:`18trek`}]]),Y=zl(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),Bl=zl(`settings`,[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]),Vl=zl(`shield`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}]]),Hl=zl(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),Ul=zl(`zap`,[[`path`,{d:`M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`,key:`1xq2db`}]]),Wl=o((e=>{var t=Symbol.for(`react.transitional.element`);function n(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.jsx=n,e.jsxs=n})),X=o(((e,t)=>{t.exports=Wl()}))();function Gl(){let e=(0,v.useRef)(null),t=(0,v.useRef)(null),[n,r]=(0,v.useState)(kl[0]),[i,a]=(0,v.useState)({}),[o,s]=(0,v.useState)(!1),[c,l]=(0,v.useState)(2048),[u,d]=(0,v.useState)(!0),f=window.electronAPI!==void 0,[p,m]=(0,v.useState)(``),[h,g]=(0,v.useState)(`All`),[_,y]=(0,v.useState)(``),[x,ee]=(0,v.useState)(!1),[S,C]=(0,v.useState)(!1),[te,ne]=(0,v.useState)(null),[re,w]=(0,v.useState)([]),[ie,ae]=(0,v.useState)(1),oe=(0,v.useRef)(1),[se,ce]=(0,v.useState)(()=>JSON.parse(localStorage.getItem(`simtex_favorites`)||`[]`)),[le,ue]=(0,v.useState)(()=>JSON.parse(localStorage.getItem(`simtex_presets`)||`[]`)),[T,E]=(0,v.useState)(``),[de,fe]=(0,v.useState)(!1),[pe,me]=(0,v.useState)([]),[D,O]=(0,v.useState)(-1),[k,he]=(0,v.useState)([1,1]),[ge,_e]=(0,v.useState)(0),[ve,ye]=(0,v.useState)([0,0]),[be,xe]=(0,v.useState)(!1),Se=(0,v.useMemo)(()=>[`All`,`Favorites`,...Ol.filter(e=>e!==`All`)],[]),Ce=(0,v.useMemo)(()=>kl.filter(e=>{let t=e.name.toLowerCase().includes(p.toLowerCase())||e.description.toLowerCase().includes(p.toLowerCase()),n=h===`All`||(h===`Favorites`?se.includes(e.id):e.category===h);return t&&n}),[p,h,se]);(0,v.useEffect)(()=>{if(!e.current)return;let r=new b(e.current);return t.current=r,we(n),()=>r.stop()},[e]),(0,v.useEffect)(()=>{let n=()=>{if(!t.current||!e.current)return;let n=u?340:0;e.current.width=window.innerWidth-n-40,e.current.height=window.innerHeight-100};return window.addEventListener(`resize`,n),n(),()=>window.removeEventListener(`resize`,n)},[u]),(0,v.useEffect)(()=>{window.electronAPI&&(window.electronAPI.onUpdateStatus(e=>{y(e),w(t=>[...t.slice(-4),e])}),window.electronAPI.onUpdateAvailableData(e=>{ee(!0),ne(e),w(t=>[...t.slice(-4),`v${e.version} found on GitHub`])}),window.electronAPI.onUpdateDownloaded(()=>{C(!0),ee(!1),w(e=>[...e.slice(-4),`Update ready — click to install`])}))},[]),(0,v.useEffect)(()=>{oe.current=ie,t.current&&t.current.render({u_opacity:ie})},[ie]),(0,v.useEffect)(()=>{if(!t.current)return;let e=be?[k[0]*2,k[1]*2]:k;t.current.render({u_uv_scale:e,u_uv_rotation:Math.PI/180*ge,u_uv_offset:ve})},[k,ge,ve,be]);let we=async e=>{if(!t.current)return;let n={};e.uniforms.forEach(e=>{n[e.id]=e.default}),a(n),await t.current.setShader(e),t.current.render({...n,u_is_spec:+!!o,u_opacity:oe.current})},Te=e=>{r(e),we(e)},Ee=e=>{let r={...i,...e.uniforms};a(r),t.current&&t.current.render({...r,u_is_spec:+!!o,u_opacity:oe.current});let s={patternId:n.id,uniforms:r};me(e=>[...e.slice(0,D+1),s].slice(-30)),O(e=>Math.min(e+1,29))},De=(e,r)=>{let s={...i,[e]:r};a(s),t.current&&t.current.render({...s,u_is_spec:+!!o,u_opacity:oe.current});let c={patternId:n.id,uniforms:s};me(e=>[...e.slice(0,D+1),c].slice(-30)),O(e=>Math.min(e+1,29))};(0,v.useEffect)(()=>{t.current&&t.current.render({u_is_spec:+!!o})},[o]);let Oe=()=>{if(!t.current)return;let e=t.current.export(c,c,{...i,u_is_spec:+!!o}),r=document.createElement(`a`);r.download=`simtex_${n.id}_${o?`spec`:`diff`}_${c}.png`,r.href=e,r.click()},ke=()=>{if(!t.current)return;let e=t.current.exportNormalMap(c,c,{...i,u_is_spec:0,u_opacity:1}),r=document.createElement(`a`);r.download=`simtex_${n.id}_normal_${c}.png`,r.href=e,r.click()},Ae=e=>{let t=e=>Math.round(e*255).toString(16).padStart(2,`0`);return`#${t(e[0])}${t(e[1])}${t(e[2])}`},je=(e,t=1)=>[parseInt(e.slice(1,3),16)/255,parseInt(e.slice(3,5),16)/255,parseInt(e.slice(5,7),16)/255,t],Me=e=>{ce(t=>{let n=t.includes(e)?t.filter(t=>t!==e):[...t,e];return localStorage.setItem(`simtex_favorites`,JSON.stringify(n)),n})},Ne=()=>{let e=T.trim()||n.name,t={id:Date.now(),patternId:n.id,name:e,uniforms:{...i}};ue(e=>{let n=[...e,t].slice(-20);return localStorage.setItem(`simtex_presets`,JSON.stringify(n)),n}),E(``),fe(!1)},Pe=e=>{ue(t=>{let n=t.filter(t=>t.id!==e);return localStorage.setItem(`simtex_presets`,JSON.stringify(n)),n})},Fe=e=>{let n=kl.find(t=>t.id===e.patternId);n&&(Te(n),setTimeout(()=>{a(e.uniforms),t.current&&t.current.render({...e.uniforms,u_is_spec:+!!o,u_opacity:oe.current})},50))},Ie=(0,v.useCallback)(e=>{let i=kl.find(t=>t.id===e.patternId);i&&i.id!==n.id&&r(i),a(e.uniforms),t.current&&t.current.render({...e.uniforms,u_is_spec:+!!o,u_opacity:oe.current})},[n.id,o]);return(0,v.useEffect)(()=>{let e=e=>{let t=e.ctrlKey||e.metaKey;if(e.key===`Escape`){u&&p?(m(``),g(`All`)):d(e=>!e);return}if(t&&e.key===`d`){e.preventDefault(),Oe();return}if(t&&e.key===`z`&&!e.shiftKey){e.preventDefault(),O(e=>{let t=e-1;return t<0?e:(me(e=>(Ie(e[t]),e)),t)});return}if(t&&(e.key===`y`||e.key===`z`&&e.shiftKey)){e.preventDefault(),O(e=>(me(t=>{let n=e+1;return n>=t.length||Ie(t[n]),t}),e)),me(e=>(O(t=>{let n=t+1;return n<e.length?(Ie(e[n]),n):t}),e));return}if(e.key===`ArrowUp`||e.key===`ArrowDown`){let t=Ce.findIndex(e=>e.id===n.id);if(t===-1)return;let r=e.key===`ArrowUp`?Math.max(0,t-1):Math.min(Ce.length-1,t+1);r!==t&&Te(Ce[r])}};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[u,p,Ce,n,pe,D,Ie]),(0,X.jsxs)(`div`,{className:`app-container`,children:[(0,X.jsxs)(`aside`,{className:`sidebar glass-panel ${u?`open`:`closed`}`,children:[(0,X.jsxs)(`div`,{className:`sidebar-top`,children:[(0,X.jsx)(`div`,{className:`sidebar-header`,children:(0,X.jsxs)(`div`,{className:`logo`,children:[(0,X.jsx)(Vl,{size:24,color:`var(--color-accent)`}),(0,X.jsxs)(`h1`,{children:[`SIMTEX`,(0,X.jsx)(`span`,{children:`PRO`}),` `,(0,X.jsx)(`small`,{className:`v-tag`,children:`v3.0.4`})]})]})}),(0,X.jsxs)(`section`,{className:`sidebar-section`,children:[(0,X.jsxs)(`div`,{className:`search-wrapper`,children:[(0,X.jsx)(Y,{size:16,className:`search-icon`}),(0,X.jsx)(`input`,{type:`text`,placeholder:`Search patterns...`,value:p,onChange:e=>m(e.target.value),className:`search-input`}),p&&(0,X.jsx)(Hl,{size:14,className:`clear-search`,onClick:()=>{m(``),g(`All`)}})]}),(0,X.jsx)(`div`,{className:`category-tabs pro-scrollbar`,children:Se.map(e=>(0,X.jsx)(`button`,{className:`category-tab ${h===e?`active`:``}`,onClick:()=>g(e),children:e},e))})]})]}),(0,X.jsxs)(`section`,{className:`patterns-container pro-scrollbar`,children:[(0,X.jsxs)(`div`,{className:`section-title`,children:[(0,X.jsx)(q,{size:16}),(0,X.jsxs)(`span`,{children:[`PATTERNS (`,Ce.length,`)`]})]}),(0,X.jsx)(`div`,{className:`pattern-grid`,children:Ce.length>0?Ce.map(e=>(0,X.jsxs)(`button`,{className:`pattern-card ${n.id===e.id?`active`:``}`,onClick:()=>Te(e),children:[(0,X.jsxs)(`div`,{className:`card-header`,children:[(0,X.jsx)(`div`,{className:`pattern-name`,children:e.name}),(0,X.jsx)(`div`,{className:`pattern-category`,children:e.category})]}),(0,X.jsx)(`div`,{className:`pattern-desc`,children:e.description}),(0,X.jsx)(`button`,{className:`fav-star ${se.includes(e.id)?`active`:``}`,onClick:t=>{t.stopPropagation(),Me(e.id)},title:se.includes(e.id)?`Remove from favorites`:`Add to favorites`,children:se.includes(e.id)?`★`:`☆`})]},e.id)):(0,X.jsxs)(`div`,{className:`no-results`,children:[`No patterns found for "`,p||h,`"`]})})]}),(0,X.jsxs)(`div`,{className:`sidebar-bottom`,children:[le.length>0&&(0,X.jsx)(`div`,{className:`preset-chips-row`,children:le.map(e=>(0,X.jsxs)(`span`,{className:`preset-chip`,title:e.name,children:[(0,X.jsx)(`span`,{className:`preset-chip-name`,onClick:()=>Fe(e),children:e.name.slice(0,12)}),(0,X.jsx)(`span`,{className:`preset-chip-del`,onClick:()=>Pe(e.id),children:`×`})]},e.id))}),(0,X.jsxs)(`section`,{className:`sidebar-section`,children:[(0,X.jsxs)(`div`,{className:`section-title`,children:[(0,X.jsx)(Bl,{size:16}),(0,X.jsx)(`span`,{children:`CONTROLS`})]}),(0,X.jsxs)(`div`,{className:`controls-list pro-scrollbar`,children:[(0,X.jsxs)(`div`,{className:`control-group master-control`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:`Master Opacity`}),(0,X.jsxs)(`span`,{className:`control-value`,children:[(ie*100).toFixed(0),`%`]})]}),(0,X.jsx)(`input`,{type:`range`,min:`0`,max:`1`,step:`0.01`,value:ie,onChange:e=>{let t=parseFloat(e.target.value);oe.current=t,ae(t)}})]}),n.variants&&n.variants.length>0&&(0,X.jsxs)(`div`,{className:`control-group variants-control`,style:{marginBottom:`16px`},children:[(0,X.jsx)(`div`,{className:`control-label`,style:{marginBottom:`8px`},children:(0,X.jsx)(`span`,{children:`Theme / Variant`})}),(0,X.jsx)(`div`,{className:`variants-row`,style:{display:`flex`,gap:`6px`,flexWrap:`wrap`},children:n.variants.map((e,t)=>(0,X.jsx)(`button`,{className:`variant-btn`,onClick:()=>Ee(e),style:{background:`#1a1a20`,border:`1px solid var(--color-border)`,color:`#fff`,padding:`6px 10px`,borderRadius:`4px`,fontSize:`11px`,cursor:`pointer`,flex:`1 1 calc(50% - 6px)`,transition:`border-color 0.2s`},onMouseOver:e=>e.currentTarget.style.borderColor=`var(--color-accent)`,onMouseOut:e=>e.currentTarget.style.borderColor=`var(--color-border)`,children:e.name},t))})]}),n.uniforms.map(e=>(0,X.jsxs)(`div`,{className:`control-group`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:e.name}),(0,X.jsx)(`span`,{className:`control-value`,children:e.type===`color`?``:(i[e.id]||0).toFixed(2)})]}),e.type===`float`?(0,X.jsx)(`input`,{type:`range`,min:e.min,max:e.max,step:(e.max-e.min)/100,value:i[e.id]||e.default,onChange:t=>De(e.id,parseFloat(t.target.value))}):(0,X.jsxs)(`div`,{className:`color-control-stack`,children:[(0,X.jsx)(`input`,{type:`color`,className:`color-input`,value:i[e.id]?Ae(i[e.id]):`#ffffff`,onChange:t=>De(e.id,je(t.target.value,i[e.id]?i[e.id][3]:1))}),(0,X.jsxs)(`div`,{className:`alpha-slider-row`,children:[(0,X.jsx)(`span`,{className:`alpha-label`,children:`Alpha`}),(0,X.jsx)(`input`,{type:`range`,min:`0`,max:`1`,step:`0.01`,value:i[e.id]?i[e.id][3]:1,onChange:t=>{let n=i[e.id]||[1,1,1,1];De(e.id,[n[0],n[1],n[2],parseFloat(t.target.value)])}})]})]})]},e.id))]}),(0,X.jsx)(`div`,{className:`preset-save-area`,children:de?(0,X.jsxs)(`div`,{className:`preset-name-row`,children:[(0,X.jsx)(`input`,{type:`text`,className:`preset-name-input`,placeholder:`Preset name...`,value:T,onChange:e=>E(e.target.value),onKeyDown:e=>{e.key===`Enter`&&Ne(),e.key===`Escape`&&fe(!1)},autoFocus:!0}),(0,X.jsx)(`button`,{className:`preset-confirm-btn`,onClick:Ne,children:`Save`}),(0,X.jsx)(`button`,{className:`preset-cancel-btn`,onClick:()=>fe(!1),children:(0,X.jsx)(Hl,{size:12})})]}):(0,X.jsx)(`button`,{className:`btn-save-preset`,onClick:()=>{E(``),fe(!0)},disabled:le.length>=20,title:le.length>=20?`Max 20 presets reached`:`Save current settings as preset`,children:`+ Save Preset`})})]}),(0,X.jsxs)(`section`,{className:`sidebar-section`,children:[(0,X.jsxs)(`div`,{className:`section-title`,children:[(0,X.jsx)(Bl,{size:16}),(0,X.jsx)(`span`,{children:`UV TRANSFORM`})]}),(0,X.jsxs)(`div`,{className:`uv-controls`,children:[(0,X.jsxs)(`div`,{className:`uv-row`,children:[(0,X.jsxs)(`div`,{className:`uv-col`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:`Scale X`}),(0,X.jsxs)(`span`,{className:`control-value`,children:[k[0].toFixed(2),`×`]})]}),(0,X.jsx)(`input`,{type:`range`,min:`0.1`,max:`4.0`,step:`0.05`,value:k[0],onChange:e=>he([parseFloat(e.target.value),k[1]])})]}),(0,X.jsxs)(`div`,{className:`uv-col`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:`Scale Y`}),(0,X.jsxs)(`span`,{className:`control-value`,children:[k[1].toFixed(2),`×`]})]}),(0,X.jsx)(`input`,{type:`range`,min:`0.1`,max:`4.0`,step:`0.05`,value:k[1],onChange:e=>he([k[0],parseFloat(e.target.value)])})]})]}),(0,X.jsxs)(`div`,{className:`control-label`,style:{marginTop:`8px`},children:[(0,X.jsx)(`span`,{children:`Rotation`}),(0,X.jsxs)(`span`,{className:`control-value`,children:[ge.toFixed(0),`°`]})]}),(0,X.jsx)(`input`,{type:`range`,min:`-180`,max:`180`,step:`1`,value:ge,onChange:e=>_e(parseFloat(e.target.value))}),(0,X.jsxs)(`div`,{className:`uv-row`,style:{marginTop:`8px`},children:[(0,X.jsxs)(`div`,{className:`uv-col`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:`Offset X`}),(0,X.jsx)(`span`,{className:`control-value`,children:ve[0].toFixed(2)})]}),(0,X.jsx)(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,value:ve[0],onChange:e=>ye([parseFloat(e.target.value),ve[1]])})]}),(0,X.jsxs)(`div`,{className:`uv-col`,children:[(0,X.jsxs)(`div`,{className:`control-label`,children:[(0,X.jsx)(`span`,{children:`Offset Y`}),(0,X.jsx)(`span`,{className:`control-value`,children:ve[1].toFixed(2)})]}),(0,X.jsx)(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,value:ve[1],onChange:e=>ye([ve[0],parseFloat(e.target.value)])})]})]}),(0,X.jsxs)(`div`,{className:`uv-actions`,children:[(0,X.jsx)(`button`,{className:`uv-btn ${be?`active`:``}`,onClick:()=>xe(e=>!e),children:`2×2 Tile Preview`}),(0,X.jsx)(`button`,{className:`uv-btn`,onClick:()=>{he([1,1]),_e(0),ye([0,0]),xe(!1)},children:`Reset`})]})]})]}),(0,X.jsxs)(`section`,{className:`sidebar-section`,children:[(0,X.jsxs)(`div`,{className:`section-title`,children:[(0,X.jsx)(Ul,{size:16}),(0,X.jsx)(`span`,{children:`MATERIAL MODE`})]}),(0,X.jsxs)(`div`,{className:`mode-toggle`,children:[(0,X.jsx)(`button`,{className:`toggle-btn ${o?``:`active`}`,onClick:()=>s(!1),children:`Standard`}),(0,X.jsx)(`button`,{className:`toggle-btn ${o?`active`:``}`,onClick:()=>s(!0),children:`iRacing Spec`})]}),o&&(0,X.jsxs)(`div`,{className:`info-box`,children:[(0,X.jsx)(K,{size:14}),(0,X.jsx)(`p`,{children:`R: Metallic | G: Roughness`})]})]}),re.length>0&&(0,X.jsxs)(`div`,{className:`update-console`,children:[re.map((e,t)=>(0,X.jsx)(`div`,{className:`log-entry`,children:e},t)),x&&(0,X.jsxs)(`button`,{className:`btn-update-action download`,onClick:()=>window.electronAPI.downloadUpdate(),children:[`Download v`,te?.version]}),S&&(0,X.jsx)(`button`,{className:`btn-update-action install`,onClick:()=>window.electronAPI.restartAndInstall(),children:`Install & Restart`})]})]}),(0,X.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,X.jsx)(`span`,{className:`version-label`,children:`v3.0.4`}),f&&(0,X.jsx)(`button`,{className:`check-updates-link`,onClick:()=>window.electronAPI?.checkForUpdates(),children:`Check for Updates`})]})]}),(0,X.jsxs)(`main`,{className:`main-content`,children:[(0,X.jsxs)(`header`,{className:`top-bar glass-panel`,children:[(0,X.jsx)(`div`,{className:`res-selector`,children:[1024,2048,4096].map(e=>(0,X.jsxs)(`button`,{onClick:()=>l(e),className:c===e?`active`:``,children:[e/1024,`K`]},e))}),(0,X.jsxs)(`div`,{className:`actions`,children:[(0,X.jsx)(`button`,{className:`btn-secondary`,onClick:()=>d(!u),children:(0,X.jsx)(J,{size:18})}),(0,X.jsx)(`button`,{className:`btn-secondary btn-normal`,onClick:ke,title:`Export Normal Map`,children:(0,X.jsx)(`span`,{style:{fontSize:`11px`,fontWeight:800,letterSpacing:`0.05em`},children:`NRM`})}),(0,X.jsxs)(`button`,{className:`btn-primary`,onClick:Oe,children:[(0,X.jsx)(G,{size:18}),(0,X.jsx)(`span`,{children:`Export PNG`})]})]})]}),(0,X.jsx)(`div`,{className:`viewport`,children:(0,X.jsxs)(`div`,{className:`canvas-wrapper`,children:[(0,X.jsx)(`canvas`,{ref:e}),(0,X.jsxs)(`div`,{className:`canvas-overlay`,children:[be&&(0,X.jsx)(`span`,{className:`tile-badge`,children:`TILING 2×2`}),(0,X.jsxs)(`span`,{children:[c,` x `,c,` PREVIEW`]})]})]})})]}),(0,X.jsx)(`style`,{children:`
        .app-container { display: flex; height: 100vh; width: 100vw; background: #050507; overflow: hidden; }

        .sidebar {
          width: 320px;
          height: 100vh;
          background: #0a0a0c;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .sidebar.closed { transform: translateX(-320px); position: absolute; }

        .sidebar-top, .sidebar-bottom {
          flex-shrink: 0;
          padding: 16px 24px;
          background: #0a0a0c;
          z-index: 110;
        }
        .sidebar-top { border-bottom: 1px solid var(--color-border); }
        .sidebar-bottom {
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          max-height: 50vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .patterns-container {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .logo h1 { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.05em; }
        .logo h1 span { color: var(--color-accent); }

        .search-wrapper { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 12px; color: var(--color-text-dim); }
        .clear-search { position: absolute; right: 12px; color: var(--color-text-dim); cursor: pointer; }
        .search-input { width: 100%; background: #1a1a20; border: 1px solid var(--color-border); border-radius: 8px; padding: 10px 12px 10px 36px; color: #fff; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--color-accent); }

        .category-tabs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          padding-bottom: 10px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          mask-image: linear-gradient(to right, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
          scrollbar-width: thin;
          scrollbar-color: var(--color-accent) transparent;
        }

        /* Styled sub-scrollbar for categories */
        .category-tabs::-webkit-scrollbar {
          height: 3px;
        }
        .category-tabs::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .category-tabs::-webkit-scrollbar-thumb {
          background: var(--color-accent);
          border-radius: 10px;
          opacity: 0.5;
        }

        .category-tab {
          flex-shrink: 0;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          color: var(--color-text-dim);
          transition: all 0.2s;
          margin-bottom: 2px;
        }
        .category-tab.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
        .category-tab:hover:not(.active) { background: rgba(255,255,255,0.1); color: #fff; }

        .section-title { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--color-text-dim); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.1em; }

        .pattern-grid { display: flex; flex-direction: column; gap: 10px; }
        .pattern-card {
          padding: 14px;
          text-align: left;
          border-radius: 10px;
          background: #111115;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
          position: relative;
        }
        .pattern-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15); background: #16161c; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .pattern-category { font-size: 9px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .pattern-card.active { background: rgba(37, 99, 235, 0.1); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .pattern-name { font-weight: 600; font-size: 13px; color: #fff; }
        .pattern-desc { font-size: 11px; color: var(--color-text-dim); line-height: 1.4; }
        .no-results { font-size: 12px; color: var(--color-text-dim); text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }

        /* Feature A: star button */
        .fav-star {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 14px;
          line-height: 1;
          color: var(--color-text-dim);
          background: none;
          border: none;
          padding: 2px 4px;
          cursor: pointer;
          transition: color 0.2s, transform 0.15s;
          z-index: 1;
        }
        .fav-star:hover { transform: scale(1.2); }
        .fav-star.active { color: var(--color-accent); }

        .controls-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          flex: 1;
          margin-right: -8px;
          padding-right: 8px;
        }
        .control-group { display: flex; flex-direction: column; gap: 6px; }
        .control-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text); font-weight: 500; }
        .control-value { color: var(--color-accent); font-family: var(--font-mono); font-size: 10px; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .color-input { width: 100%; height: 36px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: #1a1a20; cursor: pointer; padding: 4px; }

        .color-control-stack { display: flex; flex-direction: column; gap: 8px; }
        .alpha-slider-row { display: flex; align-items: center; gap: 10px; padding: 4px 8px; background: rgba(255,255,255,0.03); border-radius: 4px; }
        .alpha-label { font-size: 9px; font-weight: 800; color: var(--color-text-dim); text-transform: uppercase; }
        .alpha-slider-row input { flex: 1; height: 12px; }

        .mode-toggle { display: flex; background: #1a1a20; padding: 4px; border-radius: 8px; gap: 4px; }
        .toggle-btn { flex: 1; padding: 10px; font-size: 11px; font-weight: 700; border-radius: 6px; color: var(--color-text-dim); }
        .toggle-btn.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
        .info-box { margin-top: 12px; padding: 10px 14px; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 8px; display: flex; align-items: center; gap: 10px; color: var(--color-accent); font-size: 11px; font-weight: 600; }

        .main-content { flex: 1; display: flex; flex-direction: column; padding: 20px; gap: 20px; position: relative; overflow: hidden; background: #050507; }
        .top-bar { height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .res-selector { display: flex; gap: 8px; }
        .res-selector button { padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 800; background: rgba(255,255,255,0.05); color: var(--color-text-dim); transition: all 0.2s; }
        .res-selector button.active { background: #fff; color: #000; box-shadow: 0 4px 20px rgba(255,255,255,0.2); }

        .btn-primary { background: var(--color-accent); color: #fff; padding: 10px 24px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; box-shadow: var(--shadow-glow); }
        .btn-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        .viewport { flex: 1; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 16px; overflow: hidden; position: relative;
          background-image: linear-gradient(45deg, #09090b 25%, transparent 25%), linear-gradient(-45deg, #09090b 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #09090b 75%), linear-gradient(-45deg, transparent 75%, #09090b 75%);
          background-size: 60px 60px; background-position: 0 0, 0 30px, 30px -30px, -30px 0px; }
        .canvas-wrapper { position: relative; box-shadow: 0 60px 120px rgba(0,0,0,0.9); border: 1px solid rgba(255,255,255,0.05); }
        .canvas-overlay { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 6px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text-dim); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); }

        .master-control { padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }

        /* Update UI Styles */
        .update-section { margin-top: 10px; }
        .update-card { background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); padding: 16px; border-radius: 12px; }
        .update-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .update-header .glow { color: var(--color-accent); filter: drop-shadow(0 0 5px var(--color-accent)); animation: pulse 2s infinite; }
        .update-card p { font-size: 11px; color: var(--color-text-dim); line-height: 1.4; margin-bottom: 12px; }
        .progress-bar-container { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar { height: 100%; background: var(--color-accent); transition: width 0.3s; }
        .btn-update-install { width: 100%; background: #fff; color: #000; font-weight: 800; font-size: 11px; padding: 10px; border-radius: 8px; transition: all 0.2s; }
        .btn-update-install:hover { transform: scale(1.02); background: var(--color-accent); color: #fff; }
        .btn-update-action { width: 100%; font-weight: 700; font-size: 11px; padding: 8px; border-radius: 8px; margin-top: 6px; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-update-action.download { background: var(--color-accent); color: #000; }
        .btn-update-action.download:hover { filter: brightness(1.15); }
        .btn-update-action.install { background: #fff; color: #000; }
        .btn-update-action.install:hover { transform: scale(1.02); background: var(--color-accent); color: #fff; }

        .sidebar-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .check-updates-link { font-size: 10px; color: var(--color-text-dim); background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline; transition: color 0.2s; }
        .check-updates-link:hover { color: var(--color-accent); }
        .version-label { font-size: 10px; color: rgba(255,255,255,0.2); font-family: var(--font-mono); }

        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

        /* Feature B: preset chips */
        .preset-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 0 4px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 12px;
        }
        .preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(37, 99, 235, 0.12);
          border: 1px solid rgba(37, 99, 235, 0.25);
          border-radius: 20px;
          padding: 3px 10px 3px 10px;
          font-size: 10px;
          font-weight: 700;
          color: var(--color-accent);
          max-width: 140px;
          white-space: nowrap;
        }
        .preset-chip-name {
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .preset-chip-name:hover { text-decoration: underline; }
        .preset-chip-del {
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          color: var(--color-text-dim);
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .preset-chip-del:hover { color: #fff; }

        /* Feature B: save preset controls */
        .preset-save-area { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
        .btn-save-preset {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-dim);
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-save-preset:hover:not(:disabled) { color: var(--color-accent); border-color: var(--color-accent); background: rgba(37, 99, 235, 0.07); }
        .btn-save-preset:disabled { opacity: 0.4; cursor: not-allowed; }

        .preset-name-row { display: flex; gap: 6px; align-items: center; }
        .preset-name-input {
          flex: 1;
          background: #1a1a20;
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          padding: 6px 10px;
          color: #fff;
          font-size: 11px;
          outline: none;
          min-width: 0;
        }
        .preset-confirm-btn {
          font-size: 10px;
          font-weight: 800;
          background: var(--color-accent);
          color: #fff;
          border-radius: 6px;
          padding: 6px 10px;
          flex-shrink: 0;
          cursor: pointer;
          transition: filter 0.2s;
        }
        .preset-confirm-btn:hover { filter: brightness(1.15); }
        .preset-cancel-btn {
          font-size: 10px;
          background: rgba(255,255,255,0.06);
          color: var(--color-text-dim);
          border-radius: 6px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preset-cancel-btn:hover { background: rgba(255,255,255,0.12); }

        .uv-controls { display: flex; flex-direction: column; gap: 6px; }
        .uv-row { display: flex; gap: 12px; }
        .uv-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .uv-actions { display: flex; gap: 8px; margin-top: 10px; }
        .uv-btn { flex: 1; padding: 7px 10px; font-size: 10px; font-weight: 700; border-radius: 6px; background: rgba(255,255,255,0.06); color: var(--color-text-dim); transition: all 0.2s; letter-spacing: 0.05em; text-transform: uppercase; }
        .uv-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .uv-btn.active { background: rgba(37,99,235,0.25); color: var(--color-accent); border: 1px solid rgba(37,99,235,0.4); }
        .btn-normal { width: 42px; height: 42px; font-size: 10px; }
        .tile-badge { background: var(--color-accent); color: #fff; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.08em; }
        .canvas-overlay { display: flex; align-items: center; gap: 8px; }
      `})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,X.jsx)(v.StrictMode,{children:(0,X.jsx)(Gl,{})}));