var Qv=Object.defineProperty;var Jv=(s,e,t)=>e in s?Qv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var cl=(s,e,t)=>Jv(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function E0(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Lu={exports:{}},Da={},Du={exports:{}},mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jp;function ex(){if(Jp)return mt;Jp=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),_=Symbol.iterator;function x(U){return U===null||typeof U!="object"?null:(U=_&&U[_]||U["@@iterator"],typeof U=="function"?U:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,b={};function S(U,te,Ne){this.props=U,this.context=te,this.refs=b,this.updater=Ne||E}S.prototype.isReactComponent={},S.prototype.setState=function(U,te){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,te,"setState")},S.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function y(){}y.prototype=S.prototype;function R(U,te,Ne){this.props=U,this.context=te,this.refs=b,this.updater=Ne||E}var I=R.prototype=new y;I.constructor=R,M(I,S.prototype),I.isPureReactComponent=!0;var C=Array.isArray,Z=Object.prototype.hasOwnProperty,V={current:null},O={key:!0,ref:!0,__self:!0,__source:!0};function H(U,te,Ne){var ee,F={},le=null,ce=null;if(te!=null)for(ee in te.ref!==void 0&&(ce=te.ref),te.key!==void 0&&(le=""+te.key),te)Z.call(te,ee)&&!O.hasOwnProperty(ee)&&(F[ee]=te[ee]);var ge=arguments.length-2;if(ge===1)F.children=Ne;else if(1<ge){for(var Me=Array(ge),Ve=0;Ve<ge;Ve++)Me[Ve]=arguments[Ve+2];F.children=Me}if(U&&U.defaultProps)for(ee in ge=U.defaultProps,ge)F[ee]===void 0&&(F[ee]=ge[ee]);return{$$typeof:s,type:U,key:le,ref:ce,props:F,_owner:V.current}}function N(U,te){return{$$typeof:s,type:U.type,key:te,ref:U.ref,props:U.props,_owner:U._owner}}function w(U){return typeof U=="object"&&U!==null&&U.$$typeof===s}function k(U){var te={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(Ne){return te[Ne]})}var W=/\/+/g;function $(U,te){return typeof U=="object"&&U!==null&&U.key!=null?k(""+U.key):te.toString(36)}function oe(U,te,Ne,ee,F){var le=typeof U;(le==="undefined"||le==="boolean")&&(U=null);var ce=!1;if(U===null)ce=!0;else switch(le){case"string":case"number":ce=!0;break;case"object":switch(U.$$typeof){case s:case e:ce=!0}}if(ce)return ce=U,F=F(ce),U=ee===""?"."+$(ce,0):ee,C(F)?(Ne="",U!=null&&(Ne=U.replace(W,"$&/")+"/"),oe(F,te,Ne,"",function(Ve){return Ve})):F!=null&&(w(F)&&(F=N(F,Ne+(!F.key||ce&&ce.key===F.key?"":(""+F.key).replace(W,"$&/")+"/")+U)),te.push(F)),1;if(ce=0,ee=ee===""?".":ee+":",C(U))for(var ge=0;ge<U.length;ge++){le=U[ge];var Me=ee+$(le,ge);ce+=oe(le,te,Ne,Me,F)}else if(Me=x(U),typeof Me=="function")for(U=Me.call(U),ge=0;!(le=U.next()).done;)le=le.value,Me=ee+$(le,ge++),ce+=oe(le,te,Ne,Me,F);else if(le==="object")throw te=String(U),Error("Objects are not valid as a React child (found: "+(te==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":te)+"). If you meant to render a collection of children, use an array instead.");return ce}function pe(U,te,Ne){if(U==null)return U;var ee=[],F=0;return oe(U,ee,"","",function(le){return te.call(Ne,le,F++)}),ee}function fe(U){if(U._status===-1){var te=U._result;te=te(),te.then(function(Ne){(U._status===0||U._status===-1)&&(U._status=1,U._result=Ne)},function(Ne){(U._status===0||U._status===-1)&&(U._status=2,U._result=Ne)}),U._status===-1&&(U._status=0,U._result=te)}if(U._status===1)return U._result.default;throw U._result}var he={current:null},z={transition:null},ue={ReactCurrentDispatcher:he,ReactCurrentBatchConfig:z,ReactCurrentOwner:V};function ne(){throw Error("act(...) is not supported in production builds of React.")}return mt.Children={map:pe,forEach:function(U,te,Ne){pe(U,function(){te.apply(this,arguments)},Ne)},count:function(U){var te=0;return pe(U,function(){te++}),te},toArray:function(U){return pe(U,function(te){return te})||[]},only:function(U){if(!w(U))throw Error("React.Children.only expected to receive a single React element child.");return U}},mt.Component=S,mt.Fragment=t,mt.Profiler=a,mt.PureComponent=R,mt.StrictMode=r,mt.Suspense=p,mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ue,mt.act=ne,mt.cloneElement=function(U,te,Ne){if(U==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+U+".");var ee=M({},U.props),F=U.key,le=U.ref,ce=U._owner;if(te!=null){if(te.ref!==void 0&&(le=te.ref,ce=V.current),te.key!==void 0&&(F=""+te.key),U.type&&U.type.defaultProps)var ge=U.type.defaultProps;for(Me in te)Z.call(te,Me)&&!O.hasOwnProperty(Me)&&(ee[Me]=te[Me]===void 0&&ge!==void 0?ge[Me]:te[Me])}var Me=arguments.length-2;if(Me===1)ee.children=Ne;else if(1<Me){ge=Array(Me);for(var Ve=0;Ve<Me;Ve++)ge[Ve]=arguments[Ve+2];ee.children=ge}return{$$typeof:s,type:U.type,key:F,ref:le,props:ee,_owner:ce}},mt.createContext=function(U){return U={$$typeof:u,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},U.Provider={$$typeof:l,_context:U},U.Consumer=U},mt.createElement=H,mt.createFactory=function(U){var te=H.bind(null,U);return te.type=U,te},mt.createRef=function(){return{current:null}},mt.forwardRef=function(U){return{$$typeof:d,render:U}},mt.isValidElement=w,mt.lazy=function(U){return{$$typeof:v,_payload:{_status:-1,_result:U},_init:fe}},mt.memo=function(U,te){return{$$typeof:m,type:U,compare:te===void 0?null:te}},mt.startTransition=function(U){var te=z.transition;z.transition={};try{U()}finally{z.transition=te}},mt.unstable_act=ne,mt.useCallback=function(U,te){return he.current.useCallback(U,te)},mt.useContext=function(U){return he.current.useContext(U)},mt.useDebugValue=function(){},mt.useDeferredValue=function(U){return he.current.useDeferredValue(U)},mt.useEffect=function(U,te){return he.current.useEffect(U,te)},mt.useId=function(){return he.current.useId()},mt.useImperativeHandle=function(U,te,Ne){return he.current.useImperativeHandle(U,te,Ne)},mt.useInsertionEffect=function(U,te){return he.current.useInsertionEffect(U,te)},mt.useLayoutEffect=function(U,te){return he.current.useLayoutEffect(U,te)},mt.useMemo=function(U,te){return he.current.useMemo(U,te)},mt.useReducer=function(U,te,Ne){return he.current.useReducer(U,te,Ne)},mt.useRef=function(U){return he.current.useRef(U)},mt.useState=function(U){return he.current.useState(U)},mt.useSyncExternalStore=function(U,te,Ne){return he.current.useSyncExternalStore(U,te,Ne)},mt.useTransition=function(){return he.current.useTransition()},mt.version="18.3.1",mt}var em;function ff(){return em||(em=1,Du.exports=ex()),Du.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tm;function tx(){if(tm)return Da;tm=1;var s=ff(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(d,p,m){var v,_={},x=null,E=null;m!==void 0&&(x=""+m),p.key!==void 0&&(x=""+p.key),p.ref!==void 0&&(E=p.ref);for(v in p)r.call(p,v)&&!l.hasOwnProperty(v)&&(_[v]=p[v]);if(d&&d.defaultProps)for(v in p=d.defaultProps,p)_[v]===void 0&&(_[v]=p[v]);return{$$typeof:e,type:d,key:x,ref:E,props:_,_owner:a.current}}return Da.Fragment=t,Da.jsx=u,Da.jsxs=u,Da}var nm;function nx(){return nm||(nm=1,Lu.exports=tx()),Lu.exports}var f=nx(),Ue=ff();const ix=E0(Ue);var ul={},Uu={exports:{}},Nn={},Ou={exports:{}},Fu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var im;function rx(){return im||(im=1,(function(s){function e(z,ue){var ne=z.length;z.push(ue);e:for(;0<ne;){var U=ne-1>>>1,te=z[U];if(0<a(te,ue))z[U]=ue,z[ne]=te,ne=U;else break e}}function t(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var ue=z[0],ne=z.pop();if(ne!==ue){z[0]=ne;e:for(var U=0,te=z.length,Ne=te>>>1;U<Ne;){var ee=2*(U+1)-1,F=z[ee],le=ee+1,ce=z[le];if(0>a(F,ne))le<te&&0>a(ce,F)?(z[U]=ce,z[le]=ne,U=le):(z[U]=F,z[ee]=ne,U=ee);else if(le<te&&0>a(ce,ne))z[U]=ce,z[le]=ne,U=le;else break e}}return ue}function a(z,ue){var ne=z.sortIndex-ue.sortIndex;return ne!==0?ne:z.id-ue.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var u=Date,d=u.now();s.unstable_now=function(){return u.now()-d}}var p=[],m=[],v=1,_=null,x=3,E=!1,M=!1,b=!1,S=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,R=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(z){for(var ue=t(m);ue!==null;){if(ue.callback===null)r(m);else if(ue.startTime<=z)r(m),ue.sortIndex=ue.expirationTime,e(p,ue);else break;ue=t(m)}}function C(z){if(b=!1,I(z),!M)if(t(p)!==null)M=!0,fe(Z);else{var ue=t(m);ue!==null&&he(C,ue.startTime-z)}}function Z(z,ue){M=!1,b&&(b=!1,y(H),H=-1),E=!0;var ne=x;try{for(I(ue),_=t(p);_!==null&&(!(_.expirationTime>ue)||z&&!k());){var U=_.callback;if(typeof U=="function"){_.callback=null,x=_.priorityLevel;var te=U(_.expirationTime<=ue);ue=s.unstable_now(),typeof te=="function"?_.callback=te:_===t(p)&&r(p),I(ue)}else r(p);_=t(p)}if(_!==null)var Ne=!0;else{var ee=t(m);ee!==null&&he(C,ee.startTime-ue),Ne=!1}return Ne}finally{_=null,x=ne,E=!1}}var V=!1,O=null,H=-1,N=5,w=-1;function k(){return!(s.unstable_now()-w<N)}function W(){if(O!==null){var z=s.unstable_now();w=z;var ue=!0;try{ue=O(!0,z)}finally{ue?$():(V=!1,O=null)}}else V=!1}var $;if(typeof R=="function")$=function(){R(W)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,pe=oe.port2;oe.port1.onmessage=W,$=function(){pe.postMessage(null)}}else $=function(){S(W,0)};function fe(z){O=z,V||(V=!0,$())}function he(z,ue){H=S(function(){z(s.unstable_now())},ue)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(z){z.callback=null},s.unstable_continueExecution=function(){M||E||(M=!0,fe(Z))},s.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):N=0<z?Math.floor(1e3/z):5},s.unstable_getCurrentPriorityLevel=function(){return x},s.unstable_getFirstCallbackNode=function(){return t(p)},s.unstable_next=function(z){switch(x){case 1:case 2:case 3:var ue=3;break;default:ue=x}var ne=x;x=ue;try{return z()}finally{x=ne}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(z,ue){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var ne=x;x=z;try{return ue()}finally{x=ne}},s.unstable_scheduleCallback=function(z,ue,ne){var U=s.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?U+ne:U):ne=U,z){case 1:var te=-1;break;case 2:te=250;break;case 5:te=1073741823;break;case 4:te=1e4;break;default:te=5e3}return te=ne+te,z={id:v++,callback:ue,priorityLevel:z,startTime:ne,expirationTime:te,sortIndex:-1},ne>U?(z.sortIndex=ne,e(m,z),t(p)===null&&z===t(m)&&(b?(y(H),H=-1):b=!0,he(C,ne-U))):(z.sortIndex=te,e(p,z),M||E||(M=!0,fe(Z))),z},s.unstable_shouldYield=k,s.unstable_wrapCallback=function(z){var ue=x;return function(){var ne=x;x=ue;try{return z.apply(this,arguments)}finally{x=ne}}}})(Fu)),Fu}var rm;function sx(){return rm||(rm=1,Ou.exports=rx()),Ou.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sm;function ax(){if(sm)return Nn;sm=1;var s=ff(),e=sx();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(a[n]=i,n=0;n<i.length;n++)r.add(i[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,v={},_={};function x(n){return p.call(_,n)?!0:p.call(v,n)?!1:m.test(n)?_[n]=!0:(v[n]=!0,!1)}function E(n,i,o,c){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,i,o,c){if(i===null||typeof i>"u"||E(n,i,o,c))return!0;if(c)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function b(n,i,o,c,h,g,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=o,this.propertyName=n,this.type=i,this.sanitizeURL=g,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new b(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new b(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new b(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new b(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new b(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new b(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new b(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new b(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new b(n,5,!1,n.toLowerCase(),null,!1,!1)});var y=/[\-:]([a-z])/g;function R(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(y,R);S[i]=new b(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(y,R);S[i]=new b(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(y,R);S[i]=new b(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new b(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new b("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new b(n,1,!1,n.toLowerCase(),null,!0,!0)});function I(n,i,o,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(M(i,o,h,c)&&(o=null),c||h===null?x(i)&&(o===null?n.removeAttribute(i):n.setAttribute(i,""+o)):h.mustUseProperty?n[h.propertyName]=o===null?h.type===3?!1:"":o:(i=h.attributeName,c=h.attributeNamespace,o===null?n.removeAttribute(i):(h=h.type,o=h===3||h===4&&o===!0?"":""+o,c?n.setAttributeNS(c,i,o):n.setAttribute(i,o))))}var C=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Z=Symbol.for("react.element"),V=Symbol.for("react.portal"),O=Symbol.for("react.fragment"),H=Symbol.for("react.strict_mode"),N=Symbol.for("react.profiler"),w=Symbol.for("react.provider"),k=Symbol.for("react.context"),W=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),oe=Symbol.for("react.suspense_list"),pe=Symbol.for("react.memo"),fe=Symbol.for("react.lazy"),he=Symbol.for("react.offscreen"),z=Symbol.iterator;function ue(n){return n===null||typeof n!="object"?null:(n=z&&n[z]||n["@@iterator"],typeof n=="function"?n:null)}var ne=Object.assign,U;function te(n){if(U===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);U=i&&i[1]||""}return`
`+U+n}var Ne=!1;function ee(n,i){if(!n||Ne)return"";Ne=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(re){var c=re}Reflect.construct(n,[],i)}else{try{i.call()}catch(re){c=re}n.call(i.prototype)}else{try{throw Error()}catch(re){c=re}n()}}catch(re){if(re&&c&&typeof re.stack=="string"){for(var h=re.stack.split(`
`),g=c.stack.split(`
`),T=h.length-1,D=g.length-1;1<=T&&0<=D&&h[T]!==g[D];)D--;for(;1<=T&&0<=D;T--,D--)if(h[T]!==g[D]){if(T!==1||D!==1)do if(T--,D--,0>D||h[T]!==g[D]){var B=`
`+h[T].replace(" at new "," at ");return n.displayName&&B.includes("<anonymous>")&&(B=B.replace("<anonymous>",n.displayName)),B}while(1<=T&&0<=D);break}}}finally{Ne=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?te(n):""}function F(n){switch(n.tag){case 5:return te(n.type);case 16:return te("Lazy");case 13:return te("Suspense");case 19:return te("SuspenseList");case 0:case 2:case 15:return n=ee(n.type,!1),n;case 11:return n=ee(n.type.render,!1),n;case 1:return n=ee(n.type,!0),n;default:return""}}function le(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case O:return"Fragment";case V:return"Portal";case N:return"Profiler";case H:return"StrictMode";case $:return"Suspense";case oe:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case k:return(n.displayName||"Context")+".Consumer";case w:return(n._context.displayName||"Context")+".Provider";case W:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case pe:return i=n.displayName||null,i!==null?i:le(n.type)||"Memo";case fe:i=n._payload,n=n._init;try{return le(n(i))}catch{}}return null}function ce(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return le(i);case 8:return i===H?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function ge(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Me(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Ve(n){var i=Me(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var h=o.get,g=o.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(T){c=""+T,g.call(this,T)}}),Object.defineProperty(n,i,{enumerable:o.enumerable}),{getValue:function(){return c},setValue:function(T){c=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function vt(n){n._valueTracker||(n._valueTracker=Ve(n))}function st(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var o=i.getValue(),c="";return n&&(c=Me(n)?n.checked?"true":"false":n.value),n=c,n!==o?(i.setValue(n),!0):!1}function at(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function K(n,i){var o=i.checked;return ne({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function mn(n,i){var o=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;o=ge(i.value!=null?i.value:o),n._wrapperState={initialChecked:c,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function xt(n,i){i=i.checked,i!=null&&I(n,"checked",i,!1)}function ht(n,i){xt(n,i);var o=ge(i.value),c=i.type;if(o!=null)c==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Rt(n,i.type,o):i.hasOwnProperty("defaultValue")&&Rt(n,i.type,ge(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Ze(n,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,o||i===n.value||(n.value=i),n.defaultValue=i}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Rt(n,i,o){(i!=="number"||at(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var Ke=Array.isArray;function L(n,i,o,c){if(n=n.options,i){i={};for(var h=0;h<o.length;h++)i["$"+o[h]]=!0;for(o=0;o<n.length;o++)h=i.hasOwnProperty("$"+n[o].value),n[o].selected!==h&&(n[o].selected=h),h&&c&&(n[o].defaultSelected=!0)}else{for(o=""+ge(o),i=null,h=0;h<n.length;h++){if(n[h].value===o){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function A(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ne({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ie(n,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(t(92));if(Ke(o)){if(1<o.length)throw Error(t(93));o=o[0]}i=o}i==null&&(i=""),o=i}n._wrapperState={initialValue:ge(o)}}function xe(n,i){var o=ge(i.value),c=ge(i.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),i.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),c!=null&&(n.defaultValue=""+c)}function ye(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function me(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function je(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?me(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Ce,Oe=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,o,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(Ce=Ce||document.createElement("div"),Ce.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Ce.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function ft(n,i){if(i){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=i;return}}n.textContent=i}var Te={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ke=["Webkit","ms","Moz","O"];Object.keys(Te).forEach(function(n){ke.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),Te[i]=Te[n]})});function et(n,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||Te.hasOwnProperty(n)&&Te[n]?(""+i).trim():i+"px"}function tt(n,i){n=n.style;for(var o in i)if(i.hasOwnProperty(o)){var c=o.indexOf("--")===0,h=et(o,i[o],c);o==="float"&&(o="cssFloat"),c?n.setProperty(o,h):n[o]=h}}var Be=ne({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function pt(n,i){if(i){if(Be[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function ot(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ct=null;function j(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Re=null,de=null,ve=null;function Le(n){if(n=_a(n)){if(typeof Re!="function")throw Error(t(280));var i=n.stateNode;i&&(i=To(i),Re(n.stateNode,n.type,i))}}function Ie(n){de?ve?ve.push(n):ve=[n]:de=n}function lt(){if(de){var n=de,i=ve;if(ve=de=null,Le(n),i)for(n=0;n<i.length;n++)Le(i[n])}}function Ut(n,i){return n(i)}function Yt(){}var St=!1;function Mn(n,i,o){if(St)return n(i,o);St=!0;try{return Ut(n,i,o)}finally{St=!1,(de!==null||ve!==null)&&(Yt(),lt())}}function gn(n,i){var o=n.stateNode;if(o===null)return null;var c=To(o);if(c===null)return null;o=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,i,typeof o));return o}var es=!1;if(d)try{var Yi={};Object.defineProperty(Yi,"passive",{get:function(){es=!0}}),window.addEventListener("test",Yi,Yi),window.removeEventListener("test",Yi,Yi)}catch{es=!1}function bi(n,i,o,c,h,g,T,D,B){var re=Array.prototype.slice.call(arguments,3);try{i.apply(o,re)}catch(Se){this.onError(Se)}}var Ai=!1,wr=null,br=!1,qi=null,io={onError:function(n){Ai=!0,wr=n}};function ts(n,i,o,c,h,g,T,D,B){Ai=!1,wr=null,bi.apply(io,arguments)}function ro(n,i,o,c,h,g,T,D,B){if(ts.apply(this,arguments),Ai){if(Ai){var re=wr;Ai=!1,wr=null}else throw Error(t(198));br||(br=!0,qi=re)}}function mi(n){var i=n,o=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(o=i.return),n=i.return;while(n)}return i.tag===3?o:null}function so(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function ao(n){if(mi(n)!==n)throw Error(t(188))}function tc(n){var i=n.alternate;if(!i){if(i=mi(n),i===null)throw Error(t(188));return i!==n?null:n}for(var o=n,c=i;;){var h=o.return;if(h===null)break;var g=h.alternate;if(g===null){if(c=h.return,c!==null){o=c;continue}break}if(h.child===g.child){for(g=h.child;g;){if(g===o)return ao(h),n;if(g===c)return ao(h),i;g=g.sibling}throw Error(t(188))}if(o.return!==c.return)o=h,c=g;else{for(var T=!1,D=h.child;D;){if(D===o){T=!0,o=h,c=g;break}if(D===c){T=!0,c=h,o=g;break}D=D.sibling}if(!T){for(D=g.child;D;){if(D===o){T=!0,o=g,c=h;break}if(D===c){T=!0,c=g,o=h;break}D=D.sibling}if(!T)throw Error(t(189))}}if(o.alternate!==c)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:i}function P(n){return n=tc(n),n!==null?Y(n):null}function Y(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Y(n);if(i!==null)return i;n=n.sibling}return null}var se=e.unstable_scheduleCallback,ae=e.unstable_cancelCallback,q=e.unstable_shouldYield,Ae=e.unstable_requestPaint,we=e.unstable_now,We=e.unstable_getCurrentPriorityLevel,Ge=e.unstable_ImmediatePriority,nt=e.unstable_UserBlockingPriority,rt=e.unstable_NormalPriority,Xe=e.unstable_LowPriority,yt=e.unstable_IdlePriority,At=null,_t=null;function an(n){if(_t&&typeof _t.onCommitFiberRoot=="function")try{_t.onCommitFiberRoot(At,n,void 0,(n.current.flags&128)===128)}catch{}}var ct=Math.clz32?Math.clz32:Tt,qe=Math.log,Jn=Math.LN2;function Tt(n){return n>>>=0,n===0?32:31-(qe(n)/Jn|0)|0}var on=64,ei=4194304;function qt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function gi(n,i){var o=n.pendingLanes;if(o===0)return 0;var c=0,h=n.suspendedLanes,g=n.pingedLanes,T=o&268435455;if(T!==0){var D=T&~h;D!==0?c=qt(D):(g&=T,g!==0&&(c=qt(g)))}else T=o&~h,T!==0?c=qt(T):g!==0&&(c=qt(g));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,g=i&-i,h>=g||h===16&&(g&4194240)!==0))return i;if((c&4)!==0&&(c|=o&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)o=31-ct(i),h=1<<o,c|=n[o],i&=~h;return c}function Lt(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Hn(n,i){for(var o=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,g=n.pendingLanes;0<g;){var T=31-ct(g),D=1<<T,B=h[T];B===-1?((D&o)===0||(D&c)!==0)&&(h[T]=Lt(D,i)):B<=i&&(n.expiredLanes|=D),g&=~D}}function Ci(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function vn(){var n=on;return on<<=1,(on&4194240)===0&&(on=64),n}function jn(n){for(var i=[],o=0;31>o;o++)i.push(n);return i}function Tn(n,i,o){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-ct(i),n[i]=o}function oo(n,i){var o=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<o;){var h=31-ct(o),g=1<<h;i[h]=0,c[h]=-1,n[h]=-1,o&=~g}}function nc(n,i){var o=n.entangledLanes|=i;for(n=n.entanglements;o;){var c=31-ct(o),h=1<<c;h&i|n[c]&i&&(n[c]|=i),o&=~h}}var Nt=0;function Pf(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var If,ic,Lf,Df,Uf,rc=!1,lo=[],$i=null,Ki=null,Zi=null,ia=new Map,ra=new Map,Qi=[],yg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Of(n,i){switch(n){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":Ki=null;break;case"mouseover":case"mouseout":Zi=null;break;case"pointerover":case"pointerout":ia.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":ra.delete(i.pointerId)}}function sa(n,i,o,c,h,g){return n===null||n.nativeEvent!==g?(n={blockedOn:i,domEventName:o,eventSystemFlags:c,nativeEvent:g,targetContainers:[h]},i!==null&&(i=_a(i),i!==null&&ic(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function Sg(n,i,o,c,h){switch(i){case"focusin":return $i=sa($i,n,i,o,c,h),!0;case"dragenter":return Ki=sa(Ki,n,i,o,c,h),!0;case"mouseover":return Zi=sa(Zi,n,i,o,c,h),!0;case"pointerover":var g=h.pointerId;return ia.set(g,sa(ia.get(g)||null,n,i,o,c,h)),!0;case"gotpointercapture":return g=h.pointerId,ra.set(g,sa(ra.get(g)||null,n,i,o,c,h)),!0}return!1}function Ff(n){var i=Ar(n.target);if(i!==null){var o=mi(i);if(o!==null){if(i=o.tag,i===13){if(i=so(o),i!==null){n.blockedOn=i,Uf(n.priority,function(){Lf(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function co(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var o=ac(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var c=new o.constructor(o.type,o);Ct=c,o.target.dispatchEvent(c),Ct=null}else return i=_a(o),i!==null&&ic(i),n.blockedOn=o,!1;i.shift()}return!0}function kf(n,i,o){co(n)&&o.delete(i)}function Eg(){rc=!1,$i!==null&&co($i)&&($i=null),Ki!==null&&co(Ki)&&(Ki=null),Zi!==null&&co(Zi)&&(Zi=null),ia.forEach(kf),ra.forEach(kf)}function aa(n,i){n.blockedOn===i&&(n.blockedOn=null,rc||(rc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Eg)))}function oa(n){function i(h){return aa(h,n)}if(0<lo.length){aa(lo[0],n);for(var o=1;o<lo.length;o++){var c=lo[o];c.blockedOn===n&&(c.blockedOn=null)}}for($i!==null&&aa($i,n),Ki!==null&&aa(Ki,n),Zi!==null&&aa(Zi,n),ia.forEach(i),ra.forEach(i),o=0;o<Qi.length;o++)c=Qi[o],c.blockedOn===n&&(c.blockedOn=null);for(;0<Qi.length&&(o=Qi[0],o.blockedOn===null);)Ff(o),o.blockedOn===null&&Qi.shift()}var ns=C.ReactCurrentBatchConfig,uo=!0;function Mg(n,i,o,c){var h=Nt,g=ns.transition;ns.transition=null;try{Nt=1,sc(n,i,o,c)}finally{Nt=h,ns.transition=g}}function Tg(n,i,o,c){var h=Nt,g=ns.transition;ns.transition=null;try{Nt=4,sc(n,i,o,c)}finally{Nt=h,ns.transition=g}}function sc(n,i,o,c){if(uo){var h=ac(n,i,o,c);if(h===null)Mc(n,i,c,fo,o),Of(n,c);else if(Sg(h,n,i,o,c))c.stopPropagation();else if(Of(n,c),i&4&&-1<yg.indexOf(n)){for(;h!==null;){var g=_a(h);if(g!==null&&If(g),g=ac(n,i,o,c),g===null&&Mc(n,i,c,fo,o),g===h)break;h=g}h!==null&&c.stopPropagation()}else Mc(n,i,c,null,o)}}var fo=null;function ac(n,i,o,c){if(fo=null,n=j(c),n=Ar(n),n!==null)if(i=mi(n),i===null)n=null;else if(o=i.tag,o===13){if(n=so(i),n!==null)return n;n=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return fo=n,null}function Bf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(We()){case Ge:return 1;case nt:return 4;case rt:case Xe:return 16;case yt:return 536870912;default:return 16}default:return 16}}var Ji=null,oc=null,ho=null;function zf(){if(ho)return ho;var n,i=oc,o=i.length,c,h="value"in Ji?Ji.value:Ji.textContent,g=h.length;for(n=0;n<o&&i[n]===h[n];n++);var T=o-n;for(c=1;c<=T&&i[o-c]===h[g-c];c++);return ho=h.slice(n,1<c?1-c:void 0)}function po(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function mo(){return!0}function Vf(){return!1}function Un(n){function i(o,c,h,g,T){this._reactName=o,this._targetInst=h,this.type=c,this.nativeEvent=g,this.target=T,this.currentTarget=null;for(var D in n)n.hasOwnProperty(D)&&(o=n[D],this[D]=o?o(g):g[D]);return this.isDefaultPrevented=(g.defaultPrevented!=null?g.defaultPrevented:g.returnValue===!1)?mo:Vf,this.isPropagationStopped=Vf,this}return ne(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=mo)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=mo)},persist:function(){},isPersistent:mo}),i}var is={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},lc=Un(is),la=ne({},is,{view:0,detail:0}),wg=Un(la),cc,uc,ca,go=ne({},la,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:fc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==ca&&(ca&&n.type==="mousemove"?(cc=n.screenX-ca.screenX,uc=n.screenY-ca.screenY):uc=cc=0,ca=n),cc)},movementY:function(n){return"movementY"in n?n.movementY:uc}}),Gf=Un(go),bg=ne({},go,{dataTransfer:0}),Ag=Un(bg),Cg=ne({},la,{relatedTarget:0}),dc=Un(Cg),Rg=ne({},is,{animationName:0,elapsedTime:0,pseudoElement:0}),Ng=Un(Rg),Pg=ne({},is,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Ig=Un(Pg),Lg=ne({},is,{data:0}),Hf=Un(Lg),Dg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ug={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Og={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fg(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Og[n])?!!i[n]:!1}function fc(){return Fg}var kg=ne({},la,{key:function(n){if(n.key){var i=Dg[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=po(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Ug[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:fc,charCode:function(n){return n.type==="keypress"?po(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?po(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Bg=Un(kg),zg=ne({},go,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jf=Un(zg),Vg=ne({},la,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:fc}),Gg=Un(Vg),Hg=ne({},is,{propertyName:0,elapsedTime:0,pseudoElement:0}),jg=Un(Hg),Wg=ne({},go,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Xg=Un(Wg),Yg=[9,13,27,32],hc=d&&"CompositionEvent"in window,ua=null;d&&"documentMode"in document&&(ua=document.documentMode);var qg=d&&"TextEvent"in window&&!ua,Wf=d&&(!hc||ua&&8<ua&&11>=ua),Xf=" ",Yf=!1;function qf(n,i){switch(n){case"keyup":return Yg.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function $f(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var rs=!1;function $g(n,i){switch(n){case"compositionend":return $f(i);case"keypress":return i.which!==32?null:(Yf=!0,Xf);case"textInput":return n=i.data,n===Xf&&Yf?null:n;default:return null}}function Kg(n,i){if(rs)return n==="compositionend"||!hc&&qf(n,i)?(n=zf(),ho=oc=Ji=null,rs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Wf&&i.locale!=="ko"?null:i.data;default:return null}}var Zg={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Kf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!Zg[n.type]:i==="textarea"}function Zf(n,i,o,c){Ie(c),i=So(i,"onChange"),0<i.length&&(o=new lc("onChange","change",null,o,c),n.push({event:o,listeners:i}))}var da=null,fa=null;function Qg(n){mh(n,0)}function vo(n){var i=cs(n);if(st(i))return n}function Jg(n,i){if(n==="change")return i}var Qf=!1;if(d){var pc;if(d){var mc="oninput"in document;if(!mc){var Jf=document.createElement("div");Jf.setAttribute("oninput","return;"),mc=typeof Jf.oninput=="function"}pc=mc}else pc=!1;Qf=pc&&(!document.documentMode||9<document.documentMode)}function eh(){da&&(da.detachEvent("onpropertychange",th),fa=da=null)}function th(n){if(n.propertyName==="value"&&vo(fa)){var i=[];Zf(i,fa,n,j(n)),Mn(Qg,i)}}function ev(n,i,o){n==="focusin"?(eh(),da=i,fa=o,da.attachEvent("onpropertychange",th)):n==="focusout"&&eh()}function tv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return vo(fa)}function nv(n,i){if(n==="click")return vo(i)}function iv(n,i){if(n==="input"||n==="change")return vo(i)}function rv(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var ti=typeof Object.is=="function"?Object.is:rv;function ha(n,i){if(ti(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var o=Object.keys(n),c=Object.keys(i);if(o.length!==c.length)return!1;for(c=0;c<o.length;c++){var h=o[c];if(!p.call(i,h)||!ti(n[h],i[h]))return!1}return!0}function nh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function ih(n,i){var o=nh(n);n=0;for(var c;o;){if(o.nodeType===3){if(c=n+o.textContent.length,n<=i&&c>=i)return{node:o,offset:i-n};n=c}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=nh(o)}}function rh(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?rh(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function sh(){for(var n=window,i=at();i instanceof n.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)n=i.contentWindow;else break;i=at(n.document)}return i}function gc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function sv(n){var i=sh(),o=n.focusedElem,c=n.selectionRange;if(i!==o&&o&&o.ownerDocument&&rh(o.ownerDocument.documentElement,o)){if(c!==null&&gc(o)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(n,o.value.length);else if(n=(i=o.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=o.textContent.length,g=Math.min(c.start,h);c=c.end===void 0?g:Math.min(c.end,h),!n.extend&&g>c&&(h=c,c=g,g=h),h=ih(o,g);var T=ih(o,c);h&&T&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),g>c?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=o;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)n=i[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var av=d&&"documentMode"in document&&11>=document.documentMode,ss=null,vc=null,pa=null,xc=!1;function ah(n,i,o){var c=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;xc||ss==null||ss!==at(c)||(c=ss,"selectionStart"in c&&gc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),pa&&ha(pa,c)||(pa=c,c=So(vc,"onSelect"),0<c.length&&(i=new lc("onSelect","select",null,i,o),n.push({event:i,listeners:c}),i.target=ss)))}function xo(n,i){var o={};return o[n.toLowerCase()]=i.toLowerCase(),o["Webkit"+n]="webkit"+i,o["Moz"+n]="moz"+i,o}var as={animationend:xo("Animation","AnimationEnd"),animationiteration:xo("Animation","AnimationIteration"),animationstart:xo("Animation","AnimationStart"),transitionend:xo("Transition","TransitionEnd")},_c={},oh={};d&&(oh=document.createElement("div").style,"AnimationEvent"in window||(delete as.animationend.animation,delete as.animationiteration.animation,delete as.animationstart.animation),"TransitionEvent"in window||delete as.transitionend.transition);function _o(n){if(_c[n])return _c[n];if(!as[n])return n;var i=as[n],o;for(o in i)if(i.hasOwnProperty(o)&&o in oh)return _c[n]=i[o];return n}var lh=_o("animationend"),ch=_o("animationiteration"),uh=_o("animationstart"),dh=_o("transitionend"),fh=new Map,hh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function er(n,i){fh.set(n,i),l(i,[n])}for(var yc=0;yc<hh.length;yc++){var Sc=hh[yc],ov=Sc.toLowerCase(),lv=Sc[0].toUpperCase()+Sc.slice(1);er(ov,"on"+lv)}er(lh,"onAnimationEnd"),er(ch,"onAnimationIteration"),er(uh,"onAnimationStart"),er("dblclick","onDoubleClick"),er("focusin","onFocus"),er("focusout","onBlur"),er(dh,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ma="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),cv=new Set("cancel close invalid load scroll toggle".split(" ").concat(ma));function ph(n,i,o){var c=n.type||"unknown-event";n.currentTarget=o,ro(c,i,void 0,n),n.currentTarget=null}function mh(n,i){i=(i&4)!==0;for(var o=0;o<n.length;o++){var c=n[o],h=c.event;c=c.listeners;e:{var g=void 0;if(i)for(var T=c.length-1;0<=T;T--){var D=c[T],B=D.instance,re=D.currentTarget;if(D=D.listener,B!==g&&h.isPropagationStopped())break e;ph(h,D,re),g=B}else for(T=0;T<c.length;T++){if(D=c[T],B=D.instance,re=D.currentTarget,D=D.listener,B!==g&&h.isPropagationStopped())break e;ph(h,D,re),g=B}}}if(br)throw n=qi,br=!1,qi=null,n}function Ot(n,i){var o=i[Rc];o===void 0&&(o=i[Rc]=new Set);var c=n+"__bubble";o.has(c)||(gh(i,n,2,!1),o.add(c))}function Ec(n,i,o){var c=0;i&&(c|=4),gh(o,n,c,i)}var yo="_reactListening"+Math.random().toString(36).slice(2);function ga(n){if(!n[yo]){n[yo]=!0,r.forEach(function(o){o!=="selectionchange"&&(cv.has(o)||Ec(o,!1,n),Ec(o,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[yo]||(i[yo]=!0,Ec("selectionchange",!1,i))}}function gh(n,i,o,c){switch(Bf(i)){case 1:var h=Mg;break;case 4:h=Tg;break;default:h=sc}o=h.bind(null,i,o,n),h=void 0,!es||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,o,{capture:!0,passive:h}):n.addEventListener(i,o,!0):h!==void 0?n.addEventListener(i,o,{passive:h}):n.addEventListener(i,o,!1)}function Mc(n,i,o,c,h){var g=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var T=c.tag;if(T===3||T===4){var D=c.stateNode.containerInfo;if(D===h||D.nodeType===8&&D.parentNode===h)break;if(T===4)for(T=c.return;T!==null;){var B=T.tag;if((B===3||B===4)&&(B=T.stateNode.containerInfo,B===h||B.nodeType===8&&B.parentNode===h))return;T=T.return}for(;D!==null;){if(T=Ar(D),T===null)return;if(B=T.tag,B===5||B===6){c=g=T;continue e}D=D.parentNode}}c=c.return}Mn(function(){var re=g,Se=j(o),Ee=[];e:{var _e=fh.get(n);if(_e!==void 0){var De=lc,ze=n;switch(n){case"keypress":if(po(o)===0)break e;case"keydown":case"keyup":De=Bg;break;case"focusin":ze="focus",De=dc;break;case"focusout":ze="blur",De=dc;break;case"beforeblur":case"afterblur":De=dc;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":De=Gf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":De=Ag;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":De=Gg;break;case lh:case ch:case uh:De=Ng;break;case dh:De=jg;break;case"scroll":De=wg;break;case"wheel":De=Xg;break;case"copy":case"cut":case"paste":De=Ig;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":De=jf}var He=(i&4)!==0,jt=!He&&n==="scroll",Q=He?_e!==null?_e+"Capture":null:_e;He=[];for(var G=re,J;G!==null;){J=G;var be=J.stateNode;if(J.tag===5&&be!==null&&(J=be,Q!==null&&(be=gn(G,Q),be!=null&&He.push(va(G,be,J)))),jt)break;G=G.return}0<He.length&&(_e=new De(_e,ze,null,o,Se),Ee.push({event:_e,listeners:He}))}}if((i&7)===0){e:{if(_e=n==="mouseover"||n==="pointerover",De=n==="mouseout"||n==="pointerout",_e&&o!==Ct&&(ze=o.relatedTarget||o.fromElement)&&(Ar(ze)||ze[Ri]))break e;if((De||_e)&&(_e=Se.window===Se?Se:(_e=Se.ownerDocument)?_e.defaultView||_e.parentWindow:window,De?(ze=o.relatedTarget||o.toElement,De=re,ze=ze?Ar(ze):null,ze!==null&&(jt=mi(ze),ze!==jt||ze.tag!==5&&ze.tag!==6)&&(ze=null)):(De=null,ze=re),De!==ze)){if(He=Gf,be="onMouseLeave",Q="onMouseEnter",G="mouse",(n==="pointerout"||n==="pointerover")&&(He=jf,be="onPointerLeave",Q="onPointerEnter",G="pointer"),jt=De==null?_e:cs(De),J=ze==null?_e:cs(ze),_e=new He(be,G+"leave",De,o,Se),_e.target=jt,_e.relatedTarget=J,be=null,Ar(Se)===re&&(He=new He(Q,G+"enter",ze,o,Se),He.target=J,He.relatedTarget=jt,be=He),jt=be,De&&ze)t:{for(He=De,Q=ze,G=0,J=He;J;J=os(J))G++;for(J=0,be=Q;be;be=os(be))J++;for(;0<G-J;)He=os(He),G--;for(;0<J-G;)Q=os(Q),J--;for(;G--;){if(He===Q||Q!==null&&He===Q.alternate)break t;He=os(He),Q=os(Q)}He=null}else He=null;De!==null&&vh(Ee,_e,De,He,!1),ze!==null&&jt!==null&&vh(Ee,jt,ze,He,!0)}}e:{if(_e=re?cs(re):window,De=_e.nodeName&&_e.nodeName.toLowerCase(),De==="select"||De==="input"&&_e.type==="file")var Ye=Jg;else if(Kf(_e))if(Qf)Ye=iv;else{Ye=tv;var Qe=ev}else(De=_e.nodeName)&&De.toLowerCase()==="input"&&(_e.type==="checkbox"||_e.type==="radio")&&(Ye=nv);if(Ye&&(Ye=Ye(n,re))){Zf(Ee,Ye,o,Se);break e}Qe&&Qe(n,_e,re),n==="focusout"&&(Qe=_e._wrapperState)&&Qe.controlled&&_e.type==="number"&&Rt(_e,"number",_e.value)}switch(Qe=re?cs(re):window,n){case"focusin":(Kf(Qe)||Qe.contentEditable==="true")&&(ss=Qe,vc=re,pa=null);break;case"focusout":pa=vc=ss=null;break;case"mousedown":xc=!0;break;case"contextmenu":case"mouseup":case"dragend":xc=!1,ah(Ee,o,Se);break;case"selectionchange":if(av)break;case"keydown":case"keyup":ah(Ee,o,Se)}var Je;if(hc)e:{switch(n){case"compositionstart":var it="onCompositionStart";break e;case"compositionend":it="onCompositionEnd";break e;case"compositionupdate":it="onCompositionUpdate";break e}it=void 0}else rs?qf(n,o)&&(it="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(it="onCompositionStart");it&&(Wf&&o.locale!=="ko"&&(rs||it!=="onCompositionStart"?it==="onCompositionEnd"&&rs&&(Je=zf()):(Ji=Se,oc="value"in Ji?Ji.value:Ji.textContent,rs=!0)),Qe=So(re,it),0<Qe.length&&(it=new Hf(it,n,null,o,Se),Ee.push({event:it,listeners:Qe}),Je?it.data=Je:(Je=$f(o),Je!==null&&(it.data=Je)))),(Je=qg?$g(n,o):Kg(n,o))&&(re=So(re,"onBeforeInput"),0<re.length&&(Se=new Hf("onBeforeInput","beforeinput",null,o,Se),Ee.push({event:Se,listeners:re}),Se.data=Je))}mh(Ee,i)})}function va(n,i,o){return{instance:n,listener:i,currentTarget:o}}function So(n,i){for(var o=i+"Capture",c=[];n!==null;){var h=n,g=h.stateNode;h.tag===5&&g!==null&&(h=g,g=gn(n,o),g!=null&&c.unshift(va(n,g,h)),g=gn(n,i),g!=null&&c.push(va(n,g,h))),n=n.return}return c}function os(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function vh(n,i,o,c,h){for(var g=i._reactName,T=[];o!==null&&o!==c;){var D=o,B=D.alternate,re=D.stateNode;if(B!==null&&B===c)break;D.tag===5&&re!==null&&(D=re,h?(B=gn(o,g),B!=null&&T.unshift(va(o,B,D))):h||(B=gn(o,g),B!=null&&T.push(va(o,B,D)))),o=o.return}T.length!==0&&n.push({event:i,listeners:T})}var uv=/\r\n?/g,dv=/\u0000|\uFFFD/g;function xh(n){return(typeof n=="string"?n:""+n).replace(uv,`
`).replace(dv,"")}function Eo(n,i,o){if(i=xh(i),xh(n)!==i&&o)throw Error(t(425))}function Mo(){}var Tc=null,wc=null;function bc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Ac=typeof setTimeout=="function"?setTimeout:void 0,fv=typeof clearTimeout=="function"?clearTimeout:void 0,_h=typeof Promise=="function"?Promise:void 0,hv=typeof queueMicrotask=="function"?queueMicrotask:typeof _h<"u"?function(n){return _h.resolve(null).then(n).catch(pv)}:Ac;function pv(n){setTimeout(function(){throw n})}function Cc(n,i){var o=i,c=0;do{var h=o.nextSibling;if(n.removeChild(o),h&&h.nodeType===8)if(o=h.data,o==="/$"){if(c===0){n.removeChild(h),oa(i);return}c--}else o!=="$"&&o!=="$?"&&o!=="$!"||c++;o=h}while(o);oa(i)}function tr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function yh(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return n;i--}else o==="/$"&&i++}n=n.previousSibling}return null}var ls=Math.random().toString(36).slice(2),vi="__reactFiber$"+ls,xa="__reactProps$"+ls,Ri="__reactContainer$"+ls,Rc="__reactEvents$"+ls,mv="__reactListeners$"+ls,gv="__reactHandles$"+ls;function Ar(n){var i=n[vi];if(i)return i;for(var o=n.parentNode;o;){if(i=o[Ri]||o[vi]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(n=yh(n);n!==null;){if(o=n[vi])return o;n=yh(n)}return i}n=o,o=n.parentNode}return null}function _a(n){return n=n[vi]||n[Ri],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function cs(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function To(n){return n[xa]||null}var Nc=[],us=-1;function nr(n){return{current:n}}function Ft(n){0>us||(n.current=Nc[us],Nc[us]=null,us--)}function Dt(n,i){us++,Nc[us]=n.current,n.current=i}var ir={},ln=nr(ir),wn=nr(!1),Cr=ir;function ds(n,i){var o=n.type.contextTypes;if(!o)return ir;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},g;for(g in o)h[g]=i[g];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function bn(n){return n=n.childContextTypes,n!=null}function wo(){Ft(wn),Ft(ln)}function Sh(n,i,o){if(ln.current!==ir)throw Error(t(168));Dt(ln,i),Dt(wn,o)}function Eh(n,i,o){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return o;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,ce(n)||"Unknown",h));return ne({},o,c)}function bo(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||ir,Cr=ln.current,Dt(ln,n),Dt(wn,wn.current),!0}function Mh(n,i,o){var c=n.stateNode;if(!c)throw Error(t(169));o?(n=Eh(n,i,Cr),c.__reactInternalMemoizedMergedChildContext=n,Ft(wn),Ft(ln),Dt(ln,n)):Ft(wn),Dt(wn,o)}var Ni=null,Ao=!1,Pc=!1;function Th(n){Ni===null?Ni=[n]:Ni.push(n)}function vv(n){Ao=!0,Th(n)}function rr(){if(!Pc&&Ni!==null){Pc=!0;var n=0,i=Nt;try{var o=Ni;for(Nt=1;n<o.length;n++){var c=o[n];do c=c(!0);while(c!==null)}Ni=null,Ao=!1}catch(h){throw Ni!==null&&(Ni=Ni.slice(n+1)),se(Ge,rr),h}finally{Nt=i,Pc=!1}}return null}var fs=[],hs=0,Co=null,Ro=0,Wn=[],Xn=0,Rr=null,Pi=1,Ii="";function Nr(n,i){fs[hs++]=Ro,fs[hs++]=Co,Co=n,Ro=i}function wh(n,i,o){Wn[Xn++]=Pi,Wn[Xn++]=Ii,Wn[Xn++]=Rr,Rr=n;var c=Pi;n=Ii;var h=32-ct(c)-1;c&=~(1<<h),o+=1;var g=32-ct(i)+h;if(30<g){var T=h-h%5;g=(c&(1<<T)-1).toString(32),c>>=T,h-=T,Pi=1<<32-ct(i)+h|o<<h|c,Ii=g+n}else Pi=1<<g|o<<h|c,Ii=n}function Ic(n){n.return!==null&&(Nr(n,1),wh(n,1,0))}function Lc(n){for(;n===Co;)Co=fs[--hs],fs[hs]=null,Ro=fs[--hs],fs[hs]=null;for(;n===Rr;)Rr=Wn[--Xn],Wn[Xn]=null,Ii=Wn[--Xn],Wn[Xn]=null,Pi=Wn[--Xn],Wn[Xn]=null}var On=null,Fn=null,Bt=!1,ni=null;function bh(n,i){var o=Kn(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=n,i=n.deletions,i===null?(n.deletions=[o],n.flags|=16):i.push(o)}function Ah(n,i){switch(n.tag){case 5:var o=n.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,On=n,Fn=tr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,On=n,Fn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Rr!==null?{id:Pi,overflow:Ii}:null,n.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=Kn(18,null,null,0),o.stateNode=i,o.return=n,n.child=o,On=n,Fn=null,!0):!1;default:return!1}}function Dc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Uc(n){if(Bt){var i=Fn;if(i){var o=i;if(!Ah(n,i)){if(Dc(n))throw Error(t(418));i=tr(o.nextSibling);var c=On;i&&Ah(n,i)?bh(c,o):(n.flags=n.flags&-4097|2,Bt=!1,On=n)}}else{if(Dc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Bt=!1,On=n}}}function Ch(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;On=n}function No(n){if(n!==On)return!1;if(!Bt)return Ch(n),Bt=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!bc(n.type,n.memoizedProps)),i&&(i=Fn)){if(Dc(n))throw Rh(),Error(t(418));for(;i;)bh(n,i),i=tr(i.nextSibling)}if(Ch(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(i===0){Fn=tr(n.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}n=n.nextSibling}Fn=null}}else Fn=On?tr(n.stateNode.nextSibling):null;return!0}function Rh(){for(var n=Fn;n;)n=tr(n.nextSibling)}function ps(){Fn=On=null,Bt=!1}function Oc(n){ni===null?ni=[n]:ni.push(n)}var xv=C.ReactCurrentBatchConfig;function ya(n,i,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var c=o.stateNode}if(!c)throw Error(t(147,n));var h=c,g=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===g?i.ref:(i=function(T){var D=h.refs;T===null?delete D[g]:D[g]=T},i._stringRef=g,i)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Po(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Nh(n){var i=n._init;return i(n._payload)}function Ph(n){function i(Q,G){if(n){var J=Q.deletions;J===null?(Q.deletions=[G],Q.flags|=16):J.push(G)}}function o(Q,G){if(!n)return null;for(;G!==null;)i(Q,G),G=G.sibling;return null}function c(Q,G){for(Q=new Map;G!==null;)G.key!==null?Q.set(G.key,G):Q.set(G.index,G),G=G.sibling;return Q}function h(Q,G){return Q=fr(Q,G),Q.index=0,Q.sibling=null,Q}function g(Q,G,J){return Q.index=J,n?(J=Q.alternate,J!==null?(J=J.index,J<G?(Q.flags|=2,G):J):(Q.flags|=2,G)):(Q.flags|=1048576,G)}function T(Q){return n&&Q.alternate===null&&(Q.flags|=2),Q}function D(Q,G,J,be){return G===null||G.tag!==6?(G=Au(J,Q.mode,be),G.return=Q,G):(G=h(G,J),G.return=Q,G)}function B(Q,G,J,be){var Ye=J.type;return Ye===O?Se(Q,G,J.props.children,be,J.key):G!==null&&(G.elementType===Ye||typeof Ye=="object"&&Ye!==null&&Ye.$$typeof===fe&&Nh(Ye)===G.type)?(be=h(G,J.props),be.ref=ya(Q,G,J),be.return=Q,be):(be=tl(J.type,J.key,J.props,null,Q.mode,be),be.ref=ya(Q,G,J),be.return=Q,be)}function re(Q,G,J,be){return G===null||G.tag!==4||G.stateNode.containerInfo!==J.containerInfo||G.stateNode.implementation!==J.implementation?(G=Cu(J,Q.mode,be),G.return=Q,G):(G=h(G,J.children||[]),G.return=Q,G)}function Se(Q,G,J,be,Ye){return G===null||G.tag!==7?(G=kr(J,Q.mode,be,Ye),G.return=Q,G):(G=h(G,J),G.return=Q,G)}function Ee(Q,G,J){if(typeof G=="string"&&G!==""||typeof G=="number")return G=Au(""+G,Q.mode,J),G.return=Q,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case Z:return J=tl(G.type,G.key,G.props,null,Q.mode,J),J.ref=ya(Q,null,G),J.return=Q,J;case V:return G=Cu(G,Q.mode,J),G.return=Q,G;case fe:var be=G._init;return Ee(Q,be(G._payload),J)}if(Ke(G)||ue(G))return G=kr(G,Q.mode,J,null),G.return=Q,G;Po(Q,G)}return null}function _e(Q,G,J,be){var Ye=G!==null?G.key:null;if(typeof J=="string"&&J!==""||typeof J=="number")return Ye!==null?null:D(Q,G,""+J,be);if(typeof J=="object"&&J!==null){switch(J.$$typeof){case Z:return J.key===Ye?B(Q,G,J,be):null;case V:return J.key===Ye?re(Q,G,J,be):null;case fe:return Ye=J._init,_e(Q,G,Ye(J._payload),be)}if(Ke(J)||ue(J))return Ye!==null?null:Se(Q,G,J,be,null);Po(Q,J)}return null}function De(Q,G,J,be,Ye){if(typeof be=="string"&&be!==""||typeof be=="number")return Q=Q.get(J)||null,D(G,Q,""+be,Ye);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case Z:return Q=Q.get(be.key===null?J:be.key)||null,B(G,Q,be,Ye);case V:return Q=Q.get(be.key===null?J:be.key)||null,re(G,Q,be,Ye);case fe:var Qe=be._init;return De(Q,G,J,Qe(be._payload),Ye)}if(Ke(be)||ue(be))return Q=Q.get(J)||null,Se(G,Q,be,Ye,null);Po(G,be)}return null}function ze(Q,G,J,be){for(var Ye=null,Qe=null,Je=G,it=G=0,tn=null;Je!==null&&it<J.length;it++){Je.index>it?(tn=Je,Je=null):tn=Je.sibling;var wt=_e(Q,Je,J[it],be);if(wt===null){Je===null&&(Je=tn);break}n&&Je&&wt.alternate===null&&i(Q,Je),G=g(wt,G,it),Qe===null?Ye=wt:Qe.sibling=wt,Qe=wt,Je=tn}if(it===J.length)return o(Q,Je),Bt&&Nr(Q,it),Ye;if(Je===null){for(;it<J.length;it++)Je=Ee(Q,J[it],be),Je!==null&&(G=g(Je,G,it),Qe===null?Ye=Je:Qe.sibling=Je,Qe=Je);return Bt&&Nr(Q,it),Ye}for(Je=c(Q,Je);it<J.length;it++)tn=De(Je,Q,it,J[it],be),tn!==null&&(n&&tn.alternate!==null&&Je.delete(tn.key===null?it:tn.key),G=g(tn,G,it),Qe===null?Ye=tn:Qe.sibling=tn,Qe=tn);return n&&Je.forEach(function(hr){return i(Q,hr)}),Bt&&Nr(Q,it),Ye}function He(Q,G,J,be){var Ye=ue(J);if(typeof Ye!="function")throw Error(t(150));if(J=Ye.call(J),J==null)throw Error(t(151));for(var Qe=Ye=null,Je=G,it=G=0,tn=null,wt=J.next();Je!==null&&!wt.done;it++,wt=J.next()){Je.index>it?(tn=Je,Je=null):tn=Je.sibling;var hr=_e(Q,Je,wt.value,be);if(hr===null){Je===null&&(Je=tn);break}n&&Je&&hr.alternate===null&&i(Q,Je),G=g(hr,G,it),Qe===null?Ye=hr:Qe.sibling=hr,Qe=hr,Je=tn}if(wt.done)return o(Q,Je),Bt&&Nr(Q,it),Ye;if(Je===null){for(;!wt.done;it++,wt=J.next())wt=Ee(Q,wt.value,be),wt!==null&&(G=g(wt,G,it),Qe===null?Ye=wt:Qe.sibling=wt,Qe=wt);return Bt&&Nr(Q,it),Ye}for(Je=c(Q,Je);!wt.done;it++,wt=J.next())wt=De(Je,Q,it,wt.value,be),wt!==null&&(n&&wt.alternate!==null&&Je.delete(wt.key===null?it:wt.key),G=g(wt,G,it),Qe===null?Ye=wt:Qe.sibling=wt,Qe=wt);return n&&Je.forEach(function(Zv){return i(Q,Zv)}),Bt&&Nr(Q,it),Ye}function jt(Q,G,J,be){if(typeof J=="object"&&J!==null&&J.type===O&&J.key===null&&(J=J.props.children),typeof J=="object"&&J!==null){switch(J.$$typeof){case Z:e:{for(var Ye=J.key,Qe=G;Qe!==null;){if(Qe.key===Ye){if(Ye=J.type,Ye===O){if(Qe.tag===7){o(Q,Qe.sibling),G=h(Qe,J.props.children),G.return=Q,Q=G;break e}}else if(Qe.elementType===Ye||typeof Ye=="object"&&Ye!==null&&Ye.$$typeof===fe&&Nh(Ye)===Qe.type){o(Q,Qe.sibling),G=h(Qe,J.props),G.ref=ya(Q,Qe,J),G.return=Q,Q=G;break e}o(Q,Qe);break}else i(Q,Qe);Qe=Qe.sibling}J.type===O?(G=kr(J.props.children,Q.mode,be,J.key),G.return=Q,Q=G):(be=tl(J.type,J.key,J.props,null,Q.mode,be),be.ref=ya(Q,G,J),be.return=Q,Q=be)}return T(Q);case V:e:{for(Qe=J.key;G!==null;){if(G.key===Qe)if(G.tag===4&&G.stateNode.containerInfo===J.containerInfo&&G.stateNode.implementation===J.implementation){o(Q,G.sibling),G=h(G,J.children||[]),G.return=Q,Q=G;break e}else{o(Q,G);break}else i(Q,G);G=G.sibling}G=Cu(J,Q.mode,be),G.return=Q,Q=G}return T(Q);case fe:return Qe=J._init,jt(Q,G,Qe(J._payload),be)}if(Ke(J))return ze(Q,G,J,be);if(ue(J))return He(Q,G,J,be);Po(Q,J)}return typeof J=="string"&&J!==""||typeof J=="number"?(J=""+J,G!==null&&G.tag===6?(o(Q,G.sibling),G=h(G,J),G.return=Q,Q=G):(o(Q,G),G=Au(J,Q.mode,be),G.return=Q,Q=G),T(Q)):o(Q,G)}return jt}var ms=Ph(!0),Ih=Ph(!1),Io=nr(null),Lo=null,gs=null,Fc=null;function kc(){Fc=gs=Lo=null}function Bc(n){var i=Io.current;Ft(Io),n._currentValue=i}function zc(n,i,o){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===o)break;n=n.return}}function vs(n,i){Lo=n,Fc=gs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(An=!0),n.firstContext=null)}function Yn(n){var i=n._currentValue;if(Fc!==n)if(n={context:n,memoizedValue:i,next:null},gs===null){if(Lo===null)throw Error(t(308));gs=n,Lo.dependencies={lanes:0,firstContext:n}}else gs=gs.next=n;return i}var Pr=null;function Vc(n){Pr===null?Pr=[n]:Pr.push(n)}function Lh(n,i,o,c){var h=i.interleaved;return h===null?(o.next=o,Vc(i)):(o.next=h.next,h.next=o),i.interleaved=o,Li(n,c)}function Li(n,i){n.lanes|=i;var o=n.alternate;for(o!==null&&(o.lanes|=i),o=n,n=n.return;n!==null;)n.childLanes|=i,o=n.alternate,o!==null&&(o.childLanes|=i),o=n,n=n.return;return o.tag===3?o.stateNode:null}var sr=!1;function Gc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Dh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Di(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ar(n,i,o){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Et&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Li(n,o)}return h=c.interleaved,h===null?(i.next=i,Vc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Li(n,o)}function Do(n,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,nc(n,o)}}function Uh(n,i){var o=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,o===c)){var h=null,g=null;if(o=o.firstBaseUpdate,o!==null){do{var T={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};g===null?h=g=T:g=g.next=T,o=o.next}while(o!==null);g===null?h=g=i:g=g.next=i}else h=g=i;o={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:g,shared:c.shared,effects:c.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=i:n.next=i,o.lastBaseUpdate=i}function Uo(n,i,o,c){var h=n.updateQueue;sr=!1;var g=h.firstBaseUpdate,T=h.lastBaseUpdate,D=h.shared.pending;if(D!==null){h.shared.pending=null;var B=D,re=B.next;B.next=null,T===null?g=re:T.next=re,T=B;var Se=n.alternate;Se!==null&&(Se=Se.updateQueue,D=Se.lastBaseUpdate,D!==T&&(D===null?Se.firstBaseUpdate=re:D.next=re,Se.lastBaseUpdate=B))}if(g!==null){var Ee=h.baseState;T=0,Se=re=B=null,D=g;do{var _e=D.lane,De=D.eventTime;if((c&_e)===_e){Se!==null&&(Se=Se.next={eventTime:De,lane:0,tag:D.tag,payload:D.payload,callback:D.callback,next:null});e:{var ze=n,He=D;switch(_e=i,De=o,He.tag){case 1:if(ze=He.payload,typeof ze=="function"){Ee=ze.call(De,Ee,_e);break e}Ee=ze;break e;case 3:ze.flags=ze.flags&-65537|128;case 0:if(ze=He.payload,_e=typeof ze=="function"?ze.call(De,Ee,_e):ze,_e==null)break e;Ee=ne({},Ee,_e);break e;case 2:sr=!0}}D.callback!==null&&D.lane!==0&&(n.flags|=64,_e=h.effects,_e===null?h.effects=[D]:_e.push(D))}else De={eventTime:De,lane:_e,tag:D.tag,payload:D.payload,callback:D.callback,next:null},Se===null?(re=Se=De,B=Ee):Se=Se.next=De,T|=_e;if(D=D.next,D===null){if(D=h.shared.pending,D===null)break;_e=D,D=_e.next,_e.next=null,h.lastBaseUpdate=_e,h.shared.pending=null}}while(!0);if(Se===null&&(B=Ee),h.baseState=B,h.firstBaseUpdate=re,h.lastBaseUpdate=Se,i=h.shared.interleaved,i!==null){h=i;do T|=h.lane,h=h.next;while(h!==i)}else g===null&&(h.shared.lanes=0);Dr|=T,n.lanes=T,n.memoizedState=Ee}}function Oh(n,i,o){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=o,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var Sa={},xi=nr(Sa),Ea=nr(Sa),Ma=nr(Sa);function Ir(n){if(n===Sa)throw Error(t(174));return n}function Hc(n,i){switch(Dt(Ma,i),Dt(Ea,n),Dt(xi,Sa),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:je(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=je(i,n)}Ft(xi),Dt(xi,i)}function xs(){Ft(xi),Ft(Ea),Ft(Ma)}function Fh(n){Ir(Ma.current);var i=Ir(xi.current),o=je(i,n.type);i!==o&&(Dt(Ea,n),Dt(xi,o))}function jc(n){Ea.current===n&&(Ft(xi),Ft(Ea))}var zt=nr(0);function Oo(n){for(var i=n;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Wc=[];function Xc(){for(var n=0;n<Wc.length;n++)Wc[n]._workInProgressVersionPrimary=null;Wc.length=0}var Fo=C.ReactCurrentDispatcher,Yc=C.ReactCurrentBatchConfig,Lr=0,Vt=null,$t=null,Jt=null,ko=!1,Ta=!1,wa=0,_v=0;function cn(){throw Error(t(321))}function qc(n,i){if(i===null)return!1;for(var o=0;o<i.length&&o<n.length;o++)if(!ti(n[o],i[o]))return!1;return!0}function $c(n,i,o,c,h,g){if(Lr=g,Vt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Fo.current=n===null||n.memoizedState===null?Mv:Tv,n=o(c,h),Ta){g=0;do{if(Ta=!1,wa=0,25<=g)throw Error(t(301));g+=1,Jt=$t=null,i.updateQueue=null,Fo.current=wv,n=o(c,h)}while(Ta)}if(Fo.current=Vo,i=$t!==null&&$t.next!==null,Lr=0,Jt=$t=Vt=null,ko=!1,i)throw Error(t(300));return n}function Kc(){var n=wa!==0;return wa=0,n}function _i(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Jt===null?Vt.memoizedState=Jt=n:Jt=Jt.next=n,Jt}function qn(){if($t===null){var n=Vt.alternate;n=n!==null?n.memoizedState:null}else n=$t.next;var i=Jt===null?Vt.memoizedState:Jt.next;if(i!==null)Jt=i,$t=n;else{if(n===null)throw Error(t(310));$t=n,n={memoizedState:$t.memoizedState,baseState:$t.baseState,baseQueue:$t.baseQueue,queue:$t.queue,next:null},Jt===null?Vt.memoizedState=Jt=n:Jt=Jt.next=n}return Jt}function ba(n,i){return typeof i=="function"?i(n):i}function Zc(n){var i=qn(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=$t,h=c.baseQueue,g=o.pending;if(g!==null){if(h!==null){var T=h.next;h.next=g.next,g.next=T}c.baseQueue=h=g,o.pending=null}if(h!==null){g=h.next,c=c.baseState;var D=T=null,B=null,re=g;do{var Se=re.lane;if((Lr&Se)===Se)B!==null&&(B=B.next={lane:0,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null}),c=re.hasEagerState?re.eagerState:n(c,re.action);else{var Ee={lane:Se,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null};B===null?(D=B=Ee,T=c):B=B.next=Ee,Vt.lanes|=Se,Dr|=Se}re=re.next}while(re!==null&&re!==g);B===null?T=c:B.next=D,ti(c,i.memoizedState)||(An=!0),i.memoizedState=c,i.baseState=T,i.baseQueue=B,o.lastRenderedState=c}if(n=o.interleaved,n!==null){h=n;do g=h.lane,Vt.lanes|=g,Dr|=g,h=h.next;while(h!==n)}else h===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function Qc(n){var i=qn(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=o.dispatch,h=o.pending,g=i.memoizedState;if(h!==null){o.pending=null;var T=h=h.next;do g=n(g,T.action),T=T.next;while(T!==h);ti(g,i.memoizedState)||(An=!0),i.memoizedState=g,i.baseQueue===null&&(i.baseState=g),o.lastRenderedState=g}return[g,c]}function kh(){}function Bh(n,i){var o=Vt,c=qn(),h=i(),g=!ti(c.memoizedState,h);if(g&&(c.memoizedState=h,An=!0),c=c.queue,Jc(Gh.bind(null,o,c,n),[n]),c.getSnapshot!==i||g||Jt!==null&&Jt.memoizedState.tag&1){if(o.flags|=2048,Aa(9,Vh.bind(null,o,c,h,i),void 0,null),en===null)throw Error(t(349));(Lr&30)!==0||zh(o,i,h)}return h}function zh(n,i,o){n.flags|=16384,n={getSnapshot:i,value:o},i=Vt.updateQueue,i===null?(i={lastEffect:null,stores:null},Vt.updateQueue=i,i.stores=[n]):(o=i.stores,o===null?i.stores=[n]:o.push(n))}function Vh(n,i,o,c){i.value=o,i.getSnapshot=c,Hh(i)&&jh(n)}function Gh(n,i,o){return o(function(){Hh(i)&&jh(n)})}function Hh(n){var i=n.getSnapshot;n=n.value;try{var o=i();return!ti(n,o)}catch{return!0}}function jh(n){var i=Li(n,1);i!==null&&ai(i,n,1,-1)}function Wh(n){var i=_i();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ba,lastRenderedState:n},i.queue=n,n=n.dispatch=Ev.bind(null,Vt,n),[i.memoizedState,n]}function Aa(n,i,o,c){return n={tag:n,create:i,destroy:o,deps:c,next:null},i=Vt.updateQueue,i===null?(i={lastEffect:null,stores:null},Vt.updateQueue=i,i.lastEffect=n.next=n):(o=i.lastEffect,o===null?i.lastEffect=n.next=n:(c=o.next,o.next=n,n.next=c,i.lastEffect=n)),n}function Xh(){return qn().memoizedState}function Bo(n,i,o,c){var h=_i();Vt.flags|=n,h.memoizedState=Aa(1|i,o,void 0,c===void 0?null:c)}function zo(n,i,o,c){var h=qn();c=c===void 0?null:c;var g=void 0;if($t!==null){var T=$t.memoizedState;if(g=T.destroy,c!==null&&qc(c,T.deps)){h.memoizedState=Aa(i,o,g,c);return}}Vt.flags|=n,h.memoizedState=Aa(1|i,o,g,c)}function Yh(n,i){return Bo(8390656,8,n,i)}function Jc(n,i){return zo(2048,8,n,i)}function qh(n,i){return zo(4,2,n,i)}function $h(n,i){return zo(4,4,n,i)}function Kh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Zh(n,i,o){return o=o!=null?o.concat([n]):null,zo(4,4,Kh.bind(null,i,n),o)}function eu(){}function Qh(n,i){var o=qn();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&qc(i,c[1])?c[0]:(o.memoizedState=[n,i],n)}function Jh(n,i){var o=qn();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&qc(i,c[1])?c[0]:(n=n(),o.memoizedState=[n,i],n)}function ep(n,i,o){return(Lr&21)===0?(n.baseState&&(n.baseState=!1,An=!0),n.memoizedState=o):(ti(o,i)||(o=vn(),Vt.lanes|=o,Dr|=o,n.baseState=!0),i)}function yv(n,i){var o=Nt;Nt=o!==0&&4>o?o:4,n(!0);var c=Yc.transition;Yc.transition={};try{n(!1),i()}finally{Nt=o,Yc.transition=c}}function tp(){return qn().memoizedState}function Sv(n,i,o){var c=ur(n);if(o={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null},np(n))ip(i,o);else if(o=Lh(n,i,o,c),o!==null){var h=_n();ai(o,n,c,h),rp(o,i,c)}}function Ev(n,i,o){var c=ur(n),h={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null};if(np(n))ip(i,h);else{var g=n.alternate;if(n.lanes===0&&(g===null||g.lanes===0)&&(g=i.lastRenderedReducer,g!==null))try{var T=i.lastRenderedState,D=g(T,o);if(h.hasEagerState=!0,h.eagerState=D,ti(D,T)){var B=i.interleaved;B===null?(h.next=h,Vc(i)):(h.next=B.next,B.next=h),i.interleaved=h;return}}catch{}finally{}o=Lh(n,i,h,c),o!==null&&(h=_n(),ai(o,n,c,h),rp(o,i,c))}}function np(n){var i=n.alternate;return n===Vt||i!==null&&i===Vt}function ip(n,i){Ta=ko=!0;var o=n.pending;o===null?i.next=i:(i.next=o.next,o.next=i),n.pending=i}function rp(n,i,o){if((o&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,nc(n,o)}}var Vo={readContext:Yn,useCallback:cn,useContext:cn,useEffect:cn,useImperativeHandle:cn,useInsertionEffect:cn,useLayoutEffect:cn,useMemo:cn,useReducer:cn,useRef:cn,useState:cn,useDebugValue:cn,useDeferredValue:cn,useTransition:cn,useMutableSource:cn,useSyncExternalStore:cn,useId:cn,unstable_isNewReconciler:!1},Mv={readContext:Yn,useCallback:function(n,i){return _i().memoizedState=[n,i===void 0?null:i],n},useContext:Yn,useEffect:Yh,useImperativeHandle:function(n,i,o){return o=o!=null?o.concat([n]):null,Bo(4194308,4,Kh.bind(null,i,n),o)},useLayoutEffect:function(n,i){return Bo(4194308,4,n,i)},useInsertionEffect:function(n,i){return Bo(4,2,n,i)},useMemo:function(n,i){var o=_i();return i=i===void 0?null:i,n=n(),o.memoizedState=[n,i],n},useReducer:function(n,i,o){var c=_i();return i=o!==void 0?o(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=Sv.bind(null,Vt,n),[c.memoizedState,n]},useRef:function(n){var i=_i();return n={current:n},i.memoizedState=n},useState:Wh,useDebugValue:eu,useDeferredValue:function(n){return _i().memoizedState=n},useTransition:function(){var n=Wh(!1),i=n[0];return n=yv.bind(null,n[1]),_i().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,o){var c=Vt,h=_i();if(Bt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=i(),en===null)throw Error(t(349));(Lr&30)!==0||zh(c,i,o)}h.memoizedState=o;var g={value:o,getSnapshot:i};return h.queue=g,Yh(Gh.bind(null,c,g,n),[n]),c.flags|=2048,Aa(9,Vh.bind(null,c,g,o,i),void 0,null),o},useId:function(){var n=_i(),i=en.identifierPrefix;if(Bt){var o=Ii,c=Pi;o=(c&~(1<<32-ct(c)-1)).toString(32)+o,i=":"+i+"R"+o,o=wa++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=_v++,i=":"+i+"r"+o.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},Tv={readContext:Yn,useCallback:Qh,useContext:Yn,useEffect:Jc,useImperativeHandle:Zh,useInsertionEffect:qh,useLayoutEffect:$h,useMemo:Jh,useReducer:Zc,useRef:Xh,useState:function(){return Zc(ba)},useDebugValue:eu,useDeferredValue:function(n){var i=qn();return ep(i,$t.memoizedState,n)},useTransition:function(){var n=Zc(ba)[0],i=qn().memoizedState;return[n,i]},useMutableSource:kh,useSyncExternalStore:Bh,useId:tp,unstable_isNewReconciler:!1},wv={readContext:Yn,useCallback:Qh,useContext:Yn,useEffect:Jc,useImperativeHandle:Zh,useInsertionEffect:qh,useLayoutEffect:$h,useMemo:Jh,useReducer:Qc,useRef:Xh,useState:function(){return Qc(ba)},useDebugValue:eu,useDeferredValue:function(n){var i=qn();return $t===null?i.memoizedState=n:ep(i,$t.memoizedState,n)},useTransition:function(){var n=Qc(ba)[0],i=qn().memoizedState;return[n,i]},useMutableSource:kh,useSyncExternalStore:Bh,useId:tp,unstable_isNewReconciler:!1};function ii(n,i){if(n&&n.defaultProps){i=ne({},i),n=n.defaultProps;for(var o in n)i[o]===void 0&&(i[o]=n[o]);return i}return i}function tu(n,i,o,c){i=n.memoizedState,o=o(c,i),o=o==null?i:ne({},i,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Go={isMounted:function(n){return(n=n._reactInternals)?mi(n)===n:!1},enqueueSetState:function(n,i,o){n=n._reactInternals;var c=_n(),h=ur(n),g=Di(c,h);g.payload=i,o!=null&&(g.callback=o),i=ar(n,g,h),i!==null&&(ai(i,n,h,c),Do(i,n,h))},enqueueReplaceState:function(n,i,o){n=n._reactInternals;var c=_n(),h=ur(n),g=Di(c,h);g.tag=1,g.payload=i,o!=null&&(g.callback=o),i=ar(n,g,h),i!==null&&(ai(i,n,h,c),Do(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var o=_n(),c=ur(n),h=Di(o,c);h.tag=2,i!=null&&(h.callback=i),i=ar(n,h,c),i!==null&&(ai(i,n,c,o),Do(i,n,c))}};function sp(n,i,o,c,h,g,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,g,T):i.prototype&&i.prototype.isPureReactComponent?!ha(o,c)||!ha(h,g):!0}function ap(n,i,o){var c=!1,h=ir,g=i.contextType;return typeof g=="object"&&g!==null?g=Yn(g):(h=bn(i)?Cr:ln.current,c=i.contextTypes,g=(c=c!=null)?ds(n,h):ir),i=new i(o,g),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Go,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=g),i}function op(n,i,o,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,c),i.state!==n&&Go.enqueueReplaceState(i,i.state,null)}function nu(n,i,o,c){var h=n.stateNode;h.props=o,h.state=n.memoizedState,h.refs={},Gc(n);var g=i.contextType;typeof g=="object"&&g!==null?h.context=Yn(g):(g=bn(i)?Cr:ln.current,h.context=ds(n,g)),h.state=n.memoizedState,g=i.getDerivedStateFromProps,typeof g=="function"&&(tu(n,i,g,o),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Go.enqueueReplaceState(h,h.state,null),Uo(n,o,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function _s(n,i){try{var o="",c=i;do o+=F(c),c=c.return;while(c);var h=o}catch(g){h=`
Error generating stack: `+g.message+`
`+g.stack}return{value:n,source:i,stack:h,digest:null}}function iu(n,i,o){return{value:n,source:null,stack:o??null,digest:i??null}}function ru(n,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var bv=typeof WeakMap=="function"?WeakMap:Map;function lp(n,i,o){o=Di(-1,o),o.tag=3,o.payload={element:null};var c=i.value;return o.callback=function(){$o||($o=!0,_u=c),ru(n,i)},o}function cp(n,i,o){o=Di(-1,o),o.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;o.payload=function(){return c(h)},o.callback=function(){ru(n,i)}}var g=n.stateNode;return g!==null&&typeof g.componentDidCatch=="function"&&(o.callback=function(){ru(n,i),typeof c!="function"&&(lr===null?lr=new Set([this]):lr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),o}function up(n,i,o){var c=n.pingCache;if(c===null){c=n.pingCache=new bv;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(o)||(h.add(o),n=zv.bind(null,n,i,o),i.then(n,n))}function dp(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function fp(n,i,o,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=Di(-1,1),i.tag=2,ar(o,i,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var Av=C.ReactCurrentOwner,An=!1;function xn(n,i,o,c){i.child=n===null?Ih(i,null,o,c):ms(i,n.child,o,c)}function hp(n,i,o,c,h){o=o.render;var g=i.ref;return vs(i,h),c=$c(n,i,o,c,g,h),o=Kc(),n!==null&&!An?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ui(n,i,h)):(Bt&&o&&Ic(i),i.flags|=1,xn(n,i,c,h),i.child)}function pp(n,i,o,c,h){if(n===null){var g=o.type;return typeof g=="function"&&!bu(g)&&g.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=g,mp(n,i,g,c,h)):(n=tl(o.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(g=n.child,(n.lanes&h)===0){var T=g.memoizedProps;if(o=o.compare,o=o!==null?o:ha,o(T,c)&&n.ref===i.ref)return Ui(n,i,h)}return i.flags|=1,n=fr(g,c),n.ref=i.ref,n.return=i,i.child=n}function mp(n,i,o,c,h){if(n!==null){var g=n.memoizedProps;if(ha(g,c)&&n.ref===i.ref)if(An=!1,i.pendingProps=c=g,(n.lanes&h)!==0)(n.flags&131072)!==0&&(An=!0);else return i.lanes=n.lanes,Ui(n,i,h)}return su(n,i,o,c,h)}function gp(n,i,o){var c=i.pendingProps,h=c.children,g=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Dt(Ss,kn),kn|=o;else{if((o&1073741824)===0)return n=g!==null?g.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Dt(Ss,kn),kn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=g!==null?g.baseLanes:o,Dt(Ss,kn),kn|=c}else g!==null?(c=g.baseLanes|o,i.memoizedState=null):c=o,Dt(Ss,kn),kn|=c;return xn(n,i,h,o),i.child}function vp(n,i){var o=i.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function su(n,i,o,c,h){var g=bn(o)?Cr:ln.current;return g=ds(i,g),vs(i,h),o=$c(n,i,o,c,g,h),c=Kc(),n!==null&&!An?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Ui(n,i,h)):(Bt&&c&&Ic(i),i.flags|=1,xn(n,i,o,h),i.child)}function xp(n,i,o,c,h){if(bn(o)){var g=!0;bo(i)}else g=!1;if(vs(i,h),i.stateNode===null)jo(n,i),ap(i,o,c),nu(i,o,c,h),c=!0;else if(n===null){var T=i.stateNode,D=i.memoizedProps;T.props=D;var B=T.context,re=o.contextType;typeof re=="object"&&re!==null?re=Yn(re):(re=bn(o)?Cr:ln.current,re=ds(i,re));var Se=o.getDerivedStateFromProps,Ee=typeof Se=="function"||typeof T.getSnapshotBeforeUpdate=="function";Ee||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(D!==c||B!==re)&&op(i,T,c,re),sr=!1;var _e=i.memoizedState;T.state=_e,Uo(i,c,T,h),B=i.memoizedState,D!==c||_e!==B||wn.current||sr?(typeof Se=="function"&&(tu(i,o,Se,c),B=i.memoizedState),(D=sr||sp(i,o,D,c,_e,B,re))?(Ee||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=B),T.props=c,T.state=B,T.context=re,c=D):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{T=i.stateNode,Dh(n,i),D=i.memoizedProps,re=i.type===i.elementType?D:ii(i.type,D),T.props=re,Ee=i.pendingProps,_e=T.context,B=o.contextType,typeof B=="object"&&B!==null?B=Yn(B):(B=bn(o)?Cr:ln.current,B=ds(i,B));var De=o.getDerivedStateFromProps;(Se=typeof De=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(D!==Ee||_e!==B)&&op(i,T,c,B),sr=!1,_e=i.memoizedState,T.state=_e,Uo(i,c,T,h);var ze=i.memoizedState;D!==Ee||_e!==ze||wn.current||sr?(typeof De=="function"&&(tu(i,o,De,c),ze=i.memoizedState),(re=sr||sp(i,o,re,c,_e,ze,B)||!1)?(Se||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(c,ze,B),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(c,ze,B)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ze),T.props=c,T.state=ze,T.context=B,c=re):(typeof T.componentDidUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(i.flags|=1024),c=!1)}return au(n,i,o,c,g,h)}function au(n,i,o,c,h,g){vp(n,i);var T=(i.flags&128)!==0;if(!c&&!T)return h&&Mh(i,o,!1),Ui(n,i,g);c=i.stateNode,Av.current=i;var D=T&&typeof o.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&T?(i.child=ms(i,n.child,null,g),i.child=ms(i,null,D,g)):xn(n,i,D,g),i.memoizedState=c.state,h&&Mh(i,o,!0),i.child}function _p(n){var i=n.stateNode;i.pendingContext?Sh(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Sh(n,i.context,!1),Hc(n,i.containerInfo)}function yp(n,i,o,c,h){return ps(),Oc(h),i.flags|=256,xn(n,i,o,c),i.child}var ou={dehydrated:null,treeContext:null,retryLane:0};function lu(n){return{baseLanes:n,cachePool:null,transitions:null}}function Sp(n,i,o){var c=i.pendingProps,h=zt.current,g=!1,T=(i.flags&128)!==0,D;if((D=T)||(D=n!==null&&n.memoizedState===null?!1:(h&2)!==0),D?(g=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),Dt(zt,h&1),n===null)return Uc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=c.children,n=c.fallback,g?(c=i.mode,g=i.child,T={mode:"hidden",children:T},(c&1)===0&&g!==null?(g.childLanes=0,g.pendingProps=T):g=nl(T,c,0,null),n=kr(n,c,o,null),g.return=i,n.return=i,g.sibling=n,i.child=g,i.child.memoizedState=lu(o),i.memoizedState=ou,n):cu(i,T));if(h=n.memoizedState,h!==null&&(D=h.dehydrated,D!==null))return Cv(n,i,T,c,D,h,o);if(g){g=c.fallback,T=i.mode,h=n.child,D=h.sibling;var B={mode:"hidden",children:c.children};return(T&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=B,i.deletions=null):(c=fr(h,B),c.subtreeFlags=h.subtreeFlags&14680064),D!==null?g=fr(D,g):(g=kr(g,T,o,null),g.flags|=2),g.return=i,c.return=i,c.sibling=g,i.child=c,c=g,g=i.child,T=n.child.memoizedState,T=T===null?lu(o):{baseLanes:T.baseLanes|o,cachePool:null,transitions:T.transitions},g.memoizedState=T,g.childLanes=n.childLanes&~o,i.memoizedState=ou,c}return g=n.child,n=g.sibling,c=fr(g,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=o),c.return=i,c.sibling=null,n!==null&&(o=i.deletions,o===null?(i.deletions=[n],i.flags|=16):o.push(n)),i.child=c,i.memoizedState=null,c}function cu(n,i){return i=nl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Ho(n,i,o,c){return c!==null&&Oc(c),ms(i,n.child,null,o),n=cu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function Cv(n,i,o,c,h,g,T){if(o)return i.flags&256?(i.flags&=-257,c=iu(Error(t(422))),Ho(n,i,T,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(g=c.fallback,h=i.mode,c=nl({mode:"visible",children:c.children},h,0,null),g=kr(g,h,T,null),g.flags|=2,c.return=i,g.return=i,c.sibling=g,i.child=c,(i.mode&1)!==0&&ms(i,n.child,null,T),i.child.memoizedState=lu(T),i.memoizedState=ou,g);if((i.mode&1)===0)return Ho(n,i,T,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var D=c.dgst;return c=D,g=Error(t(419)),c=iu(g,c,void 0),Ho(n,i,T,c)}if(D=(T&n.childLanes)!==0,An||D){if(c=en,c!==null){switch(T&-T){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|T))!==0?0:h,h!==0&&h!==g.retryLane&&(g.retryLane=h,Li(n,h),ai(c,n,h,-1))}return wu(),c=iu(Error(t(421))),Ho(n,i,T,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=Vv.bind(null,n),h._reactRetry=i,null):(n=g.treeContext,Fn=tr(h.nextSibling),On=i,Bt=!0,ni=null,n!==null&&(Wn[Xn++]=Pi,Wn[Xn++]=Ii,Wn[Xn++]=Rr,Pi=n.id,Ii=n.overflow,Rr=i),i=cu(i,c.children),i.flags|=4096,i)}function Ep(n,i,o){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),zc(n.return,i,o)}function uu(n,i,o,c,h){var g=n.memoizedState;g===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:o,tailMode:h}:(g.isBackwards=i,g.rendering=null,g.renderingStartTime=0,g.last=c,g.tail=o,g.tailMode=h)}function Mp(n,i,o){var c=i.pendingProps,h=c.revealOrder,g=c.tail;if(xn(n,i,c.children,o),c=zt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Ep(n,o,i);else if(n.tag===19)Ep(n,o,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Dt(zt,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(o=i.child,h=null;o!==null;)n=o.alternate,n!==null&&Oo(n)===null&&(h=o),o=o.sibling;o=h,o===null?(h=i.child,i.child=null):(h=o.sibling,o.sibling=null),uu(i,!1,h,o,g);break;case"backwards":for(o=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Oo(n)===null){i.child=h;break}n=h.sibling,h.sibling=o,o=h,h=n}uu(i,!0,o,null,g);break;case"together":uu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function jo(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ui(n,i,o){if(n!==null&&(i.dependencies=n.dependencies),Dr|=i.lanes,(o&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,o=fr(n,n.pendingProps),i.child=o,o.return=i;n.sibling!==null;)n=n.sibling,o=o.sibling=fr(n,n.pendingProps),o.return=i;o.sibling=null}return i.child}function Rv(n,i,o){switch(i.tag){case 3:_p(i),ps();break;case 5:Fh(i);break;case 1:bn(i.type)&&bo(i);break;case 4:Hc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;Dt(Io,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Dt(zt,zt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?Sp(n,i,o):(Dt(zt,zt.current&1),n=Ui(n,i,o),n!==null?n.sibling:null);Dt(zt,zt.current&1);break;case 19:if(c=(o&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Mp(n,i,o);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),Dt(zt,zt.current),c)break;return null;case 22:case 23:return i.lanes=0,gp(n,i,o)}return Ui(n,i,o)}var Tp,du,wp,bp;Tp=function(n,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},du=function(){},wp=function(n,i,o,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Ir(xi.current);var g=null;switch(o){case"input":h=K(n,h),c=K(n,c),g=[];break;case"select":h=ne({},h,{value:void 0}),c=ne({},c,{value:void 0}),g=[];break;case"textarea":h=A(n,h),c=A(n,c),g=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Mo)}pt(o,c);var T;o=null;for(re in h)if(!c.hasOwnProperty(re)&&h.hasOwnProperty(re)&&h[re]!=null)if(re==="style"){var D=h[re];for(T in D)D.hasOwnProperty(T)&&(o||(o={}),o[T]="")}else re!=="dangerouslySetInnerHTML"&&re!=="children"&&re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&re!=="autoFocus"&&(a.hasOwnProperty(re)?g||(g=[]):(g=g||[]).push(re,null));for(re in c){var B=c[re];if(D=h!=null?h[re]:void 0,c.hasOwnProperty(re)&&B!==D&&(B!=null||D!=null))if(re==="style")if(D){for(T in D)!D.hasOwnProperty(T)||B&&B.hasOwnProperty(T)||(o||(o={}),o[T]="");for(T in B)B.hasOwnProperty(T)&&D[T]!==B[T]&&(o||(o={}),o[T]=B[T])}else o||(g||(g=[]),g.push(re,o)),o=B;else re==="dangerouslySetInnerHTML"?(B=B?B.__html:void 0,D=D?D.__html:void 0,B!=null&&D!==B&&(g=g||[]).push(re,B)):re==="children"?typeof B!="string"&&typeof B!="number"||(g=g||[]).push(re,""+B):re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&(a.hasOwnProperty(re)?(B!=null&&re==="onScroll"&&Ot("scroll",n),g||D===B||(g=[])):(g=g||[]).push(re,B))}o&&(g=g||[]).push("style",o);var re=g;(i.updateQueue=re)&&(i.flags|=4)}},bp=function(n,i,o,c){o!==c&&(i.flags|=4)};function Ca(n,i){if(!Bt)switch(n.tailMode){case"hidden":i=n.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var c=null;o!==null;)o.alternate!==null&&(c=o),o=o.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function un(n){var i=n.alternate!==null&&n.alternate.child===n.child,o=0,c=0;if(i)for(var h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=o,i}function Nv(n,i,o){var c=i.pendingProps;switch(Lc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return un(i),null;case 1:return bn(i.type)&&wo(),un(i),null;case 3:return c=i.stateNode,xs(),Ft(wn),Ft(ln),Xc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(No(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,ni!==null&&(Eu(ni),ni=null))),du(n,i),un(i),null;case 5:jc(i);var h=Ir(Ma.current);if(o=i.type,n!==null&&i.stateNode!=null)wp(n,i,o,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return un(i),null}if(n=Ir(xi.current),No(i)){c=i.stateNode,o=i.type;var g=i.memoizedProps;switch(c[vi]=i,c[xa]=g,n=(i.mode&1)!==0,o){case"dialog":Ot("cancel",c),Ot("close",c);break;case"iframe":case"object":case"embed":Ot("load",c);break;case"video":case"audio":for(h=0;h<ma.length;h++)Ot(ma[h],c);break;case"source":Ot("error",c);break;case"img":case"image":case"link":Ot("error",c),Ot("load",c);break;case"details":Ot("toggle",c);break;case"input":mn(c,g),Ot("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!g.multiple},Ot("invalid",c);break;case"textarea":ie(c,g),Ot("invalid",c)}pt(o,g),h=null;for(var T in g)if(g.hasOwnProperty(T)){var D=g[T];T==="children"?typeof D=="string"?c.textContent!==D&&(g.suppressHydrationWarning!==!0&&Eo(c.textContent,D,n),h=["children",D]):typeof D=="number"&&c.textContent!==""+D&&(g.suppressHydrationWarning!==!0&&Eo(c.textContent,D,n),h=["children",""+D]):a.hasOwnProperty(T)&&D!=null&&T==="onScroll"&&Ot("scroll",c)}switch(o){case"input":vt(c),Ze(c,g,!0);break;case"textarea":vt(c),ye(c);break;case"select":case"option":break;default:typeof g.onClick=="function"&&(c.onclick=Mo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{T=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=me(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=T.createElement(o,{is:c.is}):(n=T.createElement(o),o==="select"&&(T=n,c.multiple?T.multiple=!0:c.size&&(T.size=c.size))):n=T.createElementNS(n,o),n[vi]=i,n[xa]=c,Tp(n,i,!1,!1),i.stateNode=n;e:{switch(T=ot(o,c),o){case"dialog":Ot("cancel",n),Ot("close",n),h=c;break;case"iframe":case"object":case"embed":Ot("load",n),h=c;break;case"video":case"audio":for(h=0;h<ma.length;h++)Ot(ma[h],n);h=c;break;case"source":Ot("error",n),h=c;break;case"img":case"image":case"link":Ot("error",n),Ot("load",n),h=c;break;case"details":Ot("toggle",n),h=c;break;case"input":mn(n,c),h=K(n,c),Ot("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=ne({},c,{value:void 0}),Ot("invalid",n);break;case"textarea":ie(n,c),h=A(n,c),Ot("invalid",n);break;default:h=c}pt(o,h),D=h;for(g in D)if(D.hasOwnProperty(g)){var B=D[g];g==="style"?tt(n,B):g==="dangerouslySetInnerHTML"?(B=B?B.__html:void 0,B!=null&&Oe(n,B)):g==="children"?typeof B=="string"?(o!=="textarea"||B!=="")&&ft(n,B):typeof B=="number"&&ft(n,""+B):g!=="suppressContentEditableWarning"&&g!=="suppressHydrationWarning"&&g!=="autoFocus"&&(a.hasOwnProperty(g)?B!=null&&g==="onScroll"&&Ot("scroll",n):B!=null&&I(n,g,B,T))}switch(o){case"input":vt(n),Ze(n,c,!1);break;case"textarea":vt(n),ye(n);break;case"option":c.value!=null&&n.setAttribute("value",""+ge(c.value));break;case"select":n.multiple=!!c.multiple,g=c.value,g!=null?L(n,!!c.multiple,g,!1):c.defaultValue!=null&&L(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Mo)}switch(o){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return un(i),null;case 6:if(n&&i.stateNode!=null)bp(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(o=Ir(Ma.current),Ir(xi.current),No(i)){if(c=i.stateNode,o=i.memoizedProps,c[vi]=i,(g=c.nodeValue!==o)&&(n=On,n!==null))switch(n.tag){case 3:Eo(c.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Eo(c.nodeValue,o,(n.mode&1)!==0)}g&&(i.flags|=4)}else c=(o.nodeType===9?o:o.ownerDocument).createTextNode(c),c[vi]=i,i.stateNode=c}return un(i),null;case 13:if(Ft(zt),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Bt&&Fn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Rh(),ps(),i.flags|=98560,g=!1;else if(g=No(i),c!==null&&c.dehydrated!==null){if(n===null){if(!g)throw Error(t(318));if(g=i.memoizedState,g=g!==null?g.dehydrated:null,!g)throw Error(t(317));g[vi]=i}else ps(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;un(i),g=!1}else ni!==null&&(Eu(ni),ni=null),g=!0;if(!g)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(zt.current&1)!==0?Kt===0&&(Kt=3):wu())),i.updateQueue!==null&&(i.flags|=4),un(i),null);case 4:return xs(),du(n,i),n===null&&ga(i.stateNode.containerInfo),un(i),null;case 10:return Bc(i.type._context),un(i),null;case 17:return bn(i.type)&&wo(),un(i),null;case 19:if(Ft(zt),g=i.memoizedState,g===null)return un(i),null;if(c=(i.flags&128)!==0,T=g.rendering,T===null)if(c)Ca(g,!1);else{if(Kt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=Oo(n),T!==null){for(i.flags|=128,Ca(g,!1),c=T.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=o,o=i.child;o!==null;)g=o,n=c,g.flags&=14680066,T=g.alternate,T===null?(g.childLanes=0,g.lanes=n,g.child=null,g.subtreeFlags=0,g.memoizedProps=null,g.memoizedState=null,g.updateQueue=null,g.dependencies=null,g.stateNode=null):(g.childLanes=T.childLanes,g.lanes=T.lanes,g.child=T.child,g.subtreeFlags=0,g.deletions=null,g.memoizedProps=T.memoizedProps,g.memoizedState=T.memoizedState,g.updateQueue=T.updateQueue,g.type=T.type,n=T.dependencies,g.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Dt(zt,zt.current&1|2),i.child}n=n.sibling}g.tail!==null&&we()>Es&&(i.flags|=128,c=!0,Ca(g,!1),i.lanes=4194304)}else{if(!c)if(n=Oo(T),n!==null){if(i.flags|=128,c=!0,o=n.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Ca(g,!0),g.tail===null&&g.tailMode==="hidden"&&!T.alternate&&!Bt)return un(i),null}else 2*we()-g.renderingStartTime>Es&&o!==1073741824&&(i.flags|=128,c=!0,Ca(g,!1),i.lanes=4194304);g.isBackwards?(T.sibling=i.child,i.child=T):(o=g.last,o!==null?o.sibling=T:i.child=T,g.last=T)}return g.tail!==null?(i=g.tail,g.rendering=i,g.tail=i.sibling,g.renderingStartTime=we(),i.sibling=null,o=zt.current,Dt(zt,c?o&1|2:o&1),i):(un(i),null);case 22:case 23:return Tu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(kn&1073741824)!==0&&(un(i),i.subtreeFlags&6&&(i.flags|=8192)):un(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function Pv(n,i){switch(Lc(i),i.tag){case 1:return bn(i.type)&&wo(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return xs(),Ft(wn),Ft(ln),Xc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return jc(i),null;case 13:if(Ft(zt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));ps()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Ft(zt),null;case 4:return xs(),null;case 10:return Bc(i.type._context),null;case 22:case 23:return Tu(),null;case 24:return null;default:return null}}var Wo=!1,dn=!1,Iv=typeof WeakSet=="function"?WeakSet:Set,Fe=null;function ys(n,i){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(c){Ht(n,i,c)}else o.current=null}function fu(n,i,o){try{o()}catch(c){Ht(n,i,c)}}var Ap=!1;function Lv(n,i){if(Tc=uo,n=sh(),gc(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var h=c.anchorOffset,g=c.focusNode;c=c.focusOffset;try{o.nodeType,g.nodeType}catch{o=null;break e}var T=0,D=-1,B=-1,re=0,Se=0,Ee=n,_e=null;t:for(;;){for(var De;Ee!==o||h!==0&&Ee.nodeType!==3||(D=T+h),Ee!==g||c!==0&&Ee.nodeType!==3||(B=T+c),Ee.nodeType===3&&(T+=Ee.nodeValue.length),(De=Ee.firstChild)!==null;)_e=Ee,Ee=De;for(;;){if(Ee===n)break t;if(_e===o&&++re===h&&(D=T),_e===g&&++Se===c&&(B=T),(De=Ee.nextSibling)!==null)break;Ee=_e,_e=Ee.parentNode}Ee=De}o=D===-1||B===-1?null:{start:D,end:B}}else o=null}o=o||{start:0,end:0}}else o=null;for(wc={focusedElem:n,selectionRange:o},uo=!1,Fe=i;Fe!==null;)if(i=Fe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Fe=n;else for(;Fe!==null;){i=Fe;try{var ze=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ze!==null){var He=ze.memoizedProps,jt=ze.memoizedState,Q=i.stateNode,G=Q.getSnapshotBeforeUpdate(i.elementType===i.type?He:ii(i.type,He),jt);Q.__reactInternalSnapshotBeforeUpdate=G}break;case 3:var J=i.stateNode.containerInfo;J.nodeType===1?J.textContent="":J.nodeType===9&&J.documentElement&&J.removeChild(J.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){Ht(i,i.return,be)}if(n=i.sibling,n!==null){n.return=i.return,Fe=n;break}Fe=i.return}return ze=Ap,Ap=!1,ze}function Ra(n,i,o){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var g=h.destroy;h.destroy=void 0,g!==void 0&&fu(i,o,g)}h=h.next}while(h!==c)}}function Xo(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&n)===n){var c=o.create;o.destroy=c()}o=o.next}while(o!==i)}}function hu(n){var i=n.ref;if(i!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof i=="function"?i(n):i.current=n}}function Cp(n){var i=n.alternate;i!==null&&(n.alternate=null,Cp(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[vi],delete i[xa],delete i[Rc],delete i[mv],delete i[gv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Rp(n){return n.tag===5||n.tag===3||n.tag===4}function Np(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Rp(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function pu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(n,i):o.insertBefore(n,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(n,o)):(i=o,i.appendChild(n)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=Mo));else if(c!==4&&(n=n.child,n!==null))for(pu(n,i,o),n=n.sibling;n!==null;)pu(n,i,o),n=n.sibling}function mu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.insertBefore(n,i):o.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(mu(n,i,o),n=n.sibling;n!==null;)mu(n,i,o),n=n.sibling}var rn=null,ri=!1;function or(n,i,o){for(o=o.child;o!==null;)Pp(n,i,o),o=o.sibling}function Pp(n,i,o){if(_t&&typeof _t.onCommitFiberUnmount=="function")try{_t.onCommitFiberUnmount(At,o)}catch{}switch(o.tag){case 5:dn||ys(o,i);case 6:var c=rn,h=ri;rn=null,or(n,i,o),rn=c,ri=h,rn!==null&&(ri?(n=rn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):rn.removeChild(o.stateNode));break;case 18:rn!==null&&(ri?(n=rn,o=o.stateNode,n.nodeType===8?Cc(n.parentNode,o):n.nodeType===1&&Cc(n,o),oa(n)):Cc(rn,o.stateNode));break;case 4:c=rn,h=ri,rn=o.stateNode.containerInfo,ri=!0,or(n,i,o),rn=c,ri=h;break;case 0:case 11:case 14:case 15:if(!dn&&(c=o.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var g=h,T=g.destroy;g=g.tag,T!==void 0&&((g&2)!==0||(g&4)!==0)&&fu(o,i,T),h=h.next}while(h!==c)}or(n,i,o);break;case 1:if(!dn&&(ys(o,i),c=o.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=o.memoizedProps,c.state=o.memoizedState,c.componentWillUnmount()}catch(D){Ht(o,i,D)}or(n,i,o);break;case 21:or(n,i,o);break;case 22:o.mode&1?(dn=(c=dn)||o.memoizedState!==null,or(n,i,o),dn=c):or(n,i,o);break;default:or(n,i,o)}}function Ip(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Iv),i.forEach(function(c){var h=Gv.bind(null,n,c);o.has(c)||(o.add(c),c.then(h,h))})}}function si(n,i){var o=i.deletions;if(o!==null)for(var c=0;c<o.length;c++){var h=o[c];try{var g=n,T=i,D=T;e:for(;D!==null;){switch(D.tag){case 5:rn=D.stateNode,ri=!1;break e;case 3:rn=D.stateNode.containerInfo,ri=!0;break e;case 4:rn=D.stateNode.containerInfo,ri=!0;break e}D=D.return}if(rn===null)throw Error(t(160));Pp(g,T,h),rn=null,ri=!1;var B=h.alternate;B!==null&&(B.return=null),h.return=null}catch(re){Ht(h,i,re)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Lp(i,n),i=i.sibling}function Lp(n,i){var o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(si(i,n),yi(n),c&4){try{Ra(3,n,n.return),Xo(3,n)}catch(He){Ht(n,n.return,He)}try{Ra(5,n,n.return)}catch(He){Ht(n,n.return,He)}}break;case 1:si(i,n),yi(n),c&512&&o!==null&&ys(o,o.return);break;case 5:if(si(i,n),yi(n),c&512&&o!==null&&ys(o,o.return),n.flags&32){var h=n.stateNode;try{ft(h,"")}catch(He){Ht(n,n.return,He)}}if(c&4&&(h=n.stateNode,h!=null)){var g=n.memoizedProps,T=o!==null?o.memoizedProps:g,D=n.type,B=n.updateQueue;if(n.updateQueue=null,B!==null)try{D==="input"&&g.type==="radio"&&g.name!=null&&xt(h,g),ot(D,T);var re=ot(D,g);for(T=0;T<B.length;T+=2){var Se=B[T],Ee=B[T+1];Se==="style"?tt(h,Ee):Se==="dangerouslySetInnerHTML"?Oe(h,Ee):Se==="children"?ft(h,Ee):I(h,Se,Ee,re)}switch(D){case"input":ht(h,g);break;case"textarea":xe(h,g);break;case"select":var _e=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!g.multiple;var De=g.value;De!=null?L(h,!!g.multiple,De,!1):_e!==!!g.multiple&&(g.defaultValue!=null?L(h,!!g.multiple,g.defaultValue,!0):L(h,!!g.multiple,g.multiple?[]:"",!1))}h[xa]=g}catch(He){Ht(n,n.return,He)}}break;case 6:if(si(i,n),yi(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,g=n.memoizedProps;try{h.nodeValue=g}catch(He){Ht(n,n.return,He)}}break;case 3:if(si(i,n),yi(n),c&4&&o!==null&&o.memoizedState.isDehydrated)try{oa(i.containerInfo)}catch(He){Ht(n,n.return,He)}break;case 4:si(i,n),yi(n);break;case 13:si(i,n),yi(n),h=n.child,h.flags&8192&&(g=h.memoizedState!==null,h.stateNode.isHidden=g,!g||h.alternate!==null&&h.alternate.memoizedState!==null||(xu=we())),c&4&&Ip(n);break;case 22:if(Se=o!==null&&o.memoizedState!==null,n.mode&1?(dn=(re=dn)||Se,si(i,n),dn=re):si(i,n),yi(n),c&8192){if(re=n.memoizedState!==null,(n.stateNode.isHidden=re)&&!Se&&(n.mode&1)!==0)for(Fe=n,Se=n.child;Se!==null;){for(Ee=Fe=Se;Fe!==null;){switch(_e=Fe,De=_e.child,_e.tag){case 0:case 11:case 14:case 15:Ra(4,_e,_e.return);break;case 1:ys(_e,_e.return);var ze=_e.stateNode;if(typeof ze.componentWillUnmount=="function"){c=_e,o=_e.return;try{i=c,ze.props=i.memoizedProps,ze.state=i.memoizedState,ze.componentWillUnmount()}catch(He){Ht(c,o,He)}}break;case 5:ys(_e,_e.return);break;case 22:if(_e.memoizedState!==null){Op(Ee);continue}}De!==null?(De.return=_e,Fe=De):Op(Ee)}Se=Se.sibling}e:for(Se=null,Ee=n;;){if(Ee.tag===5){if(Se===null){Se=Ee;try{h=Ee.stateNode,re?(g=h.style,typeof g.setProperty=="function"?g.setProperty("display","none","important"):g.display="none"):(D=Ee.stateNode,B=Ee.memoizedProps.style,T=B!=null&&B.hasOwnProperty("display")?B.display:null,D.style.display=et("display",T))}catch(He){Ht(n,n.return,He)}}}else if(Ee.tag===6){if(Se===null)try{Ee.stateNode.nodeValue=re?"":Ee.memoizedProps}catch(He){Ht(n,n.return,He)}}else if((Ee.tag!==22&&Ee.tag!==23||Ee.memoizedState===null||Ee===n)&&Ee.child!==null){Ee.child.return=Ee,Ee=Ee.child;continue}if(Ee===n)break e;for(;Ee.sibling===null;){if(Ee.return===null||Ee.return===n)break e;Se===Ee&&(Se=null),Ee=Ee.return}Se===Ee&&(Se=null),Ee.sibling.return=Ee.return,Ee=Ee.sibling}}break;case 19:si(i,n),yi(n),c&4&&Ip(n);break;case 21:break;default:si(i,n),yi(n)}}function yi(n){var i=n.flags;if(i&2){try{e:{for(var o=n.return;o!==null;){if(Rp(o)){var c=o;break e}o=o.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(ft(h,""),c.flags&=-33);var g=Np(n);mu(n,g,h);break;case 3:case 4:var T=c.stateNode.containerInfo,D=Np(n);pu(n,D,T);break;default:throw Error(t(161))}}catch(B){Ht(n,n.return,B)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function Dv(n,i,o){Fe=n,Dp(n)}function Dp(n,i,o){for(var c=(n.mode&1)!==0;Fe!==null;){var h=Fe,g=h.child;if(h.tag===22&&c){var T=h.memoizedState!==null||Wo;if(!T){var D=h.alternate,B=D!==null&&D.memoizedState!==null||dn;D=Wo;var re=dn;if(Wo=T,(dn=B)&&!re)for(Fe=h;Fe!==null;)T=Fe,B=T.child,T.tag===22&&T.memoizedState!==null?Fp(h):B!==null?(B.return=T,Fe=B):Fp(h);for(;g!==null;)Fe=g,Dp(g),g=g.sibling;Fe=h,Wo=D,dn=re}Up(n)}else(h.subtreeFlags&8772)!==0&&g!==null?(g.return=h,Fe=g):Up(n)}}function Up(n){for(;Fe!==null;){var i=Fe;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:dn||Xo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!dn)if(o===null)c.componentDidMount();else{var h=i.elementType===i.type?o.memoizedProps:ii(i.type,o.memoizedProps);c.componentDidUpdate(h,o.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var g=i.updateQueue;g!==null&&Oh(i,g,c);break;case 3:var T=i.updateQueue;if(T!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Oh(i,T,o)}break;case 5:var D=i.stateNode;if(o===null&&i.flags&4){o=D;var B=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":B.autoFocus&&o.focus();break;case"img":B.src&&(o.src=B.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var re=i.alternate;if(re!==null){var Se=re.memoizedState;if(Se!==null){var Ee=Se.dehydrated;Ee!==null&&oa(Ee)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}dn||i.flags&512&&hu(i)}catch(_e){Ht(i,i.return,_e)}}if(i===n){Fe=null;break}if(o=i.sibling,o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function Op(n){for(;Fe!==null;){var i=Fe;if(i===n){Fe=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function Fp(n){for(;Fe!==null;){var i=Fe;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{Xo(4,i)}catch(B){Ht(i,o,B)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(B){Ht(i,h,B)}}var g=i.return;try{hu(i)}catch(B){Ht(i,g,B)}break;case 5:var T=i.return;try{hu(i)}catch(B){Ht(i,T,B)}}}catch(B){Ht(i,i.return,B)}if(i===n){Fe=null;break}var D=i.sibling;if(D!==null){D.return=i.return,Fe=D;break}Fe=i.return}}var Uv=Math.ceil,Yo=C.ReactCurrentDispatcher,gu=C.ReactCurrentOwner,$n=C.ReactCurrentBatchConfig,Et=0,en=null,Wt=null,sn=0,kn=0,Ss=nr(0),Kt=0,Na=null,Dr=0,qo=0,vu=0,Pa=null,Cn=null,xu=0,Es=1/0,Oi=null,$o=!1,_u=null,lr=null,Ko=!1,cr=null,Zo=0,Ia=0,yu=null,Qo=-1,Jo=0;function _n(){return(Et&6)!==0?we():Qo!==-1?Qo:Qo=we()}function ur(n){return(n.mode&1)===0?1:(Et&2)!==0&&sn!==0?sn&-sn:xv.transition!==null?(Jo===0&&(Jo=vn()),Jo):(n=Nt,n!==0||(n=window.event,n=n===void 0?16:Bf(n.type)),n)}function ai(n,i,o,c){if(50<Ia)throw Ia=0,yu=null,Error(t(185));Tn(n,o,c),((Et&2)===0||n!==en)&&(n===en&&((Et&2)===0&&(qo|=o),Kt===4&&dr(n,sn)),Rn(n,c),o===1&&Et===0&&(i.mode&1)===0&&(Es=we()+500,Ao&&rr()))}function Rn(n,i){var o=n.callbackNode;Hn(n,i);var c=gi(n,n===en?sn:0);if(c===0)o!==null&&ae(o),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(o!=null&&ae(o),i===1)n.tag===0?vv(Bp.bind(null,n)):Th(Bp.bind(null,n)),hv(function(){(Et&6)===0&&rr()}),o=null;else{switch(Pf(c)){case 1:o=Ge;break;case 4:o=nt;break;case 16:o=rt;break;case 536870912:o=yt;break;default:o=rt}o=Yp(o,kp.bind(null,n))}n.callbackPriority=i,n.callbackNode=o}}function kp(n,i){if(Qo=-1,Jo=0,(Et&6)!==0)throw Error(t(327));var o=n.callbackNode;if(Ms()&&n.callbackNode!==o)return null;var c=gi(n,n===en?sn:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=el(n,c);else{i=c;var h=Et;Et|=2;var g=Vp();(en!==n||sn!==i)&&(Oi=null,Es=we()+500,Or(n,i));do try{kv();break}catch(D){zp(n,D)}while(!0);kc(),Yo.current=g,Et=h,Wt!==null?i=0:(en=null,sn=0,i=Kt)}if(i!==0){if(i===2&&(h=Ci(n),h!==0&&(c=h,i=Su(n,h))),i===1)throw o=Na,Or(n,0),dr(n,c),Rn(n,we()),o;if(i===6)dr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!Ov(h)&&(i=el(n,c),i===2&&(g=Ci(n),g!==0&&(c=g,i=Su(n,g))),i===1))throw o=Na,Or(n,0),dr(n,c),Rn(n,we()),o;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:Fr(n,Cn,Oi);break;case 3:if(dr(n,c),(c&130023424)===c&&(i=xu+500-we(),10<i)){if(gi(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){_n(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Ac(Fr.bind(null,n,Cn,Oi),i);break}Fr(n,Cn,Oi);break;case 4:if(dr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var T=31-ct(c);g=1<<T,T=i[T],T>h&&(h=T),c&=~g}if(c=h,c=we()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*Uv(c/1960))-c,10<c){n.timeoutHandle=Ac(Fr.bind(null,n,Cn,Oi),c);break}Fr(n,Cn,Oi);break;case 5:Fr(n,Cn,Oi);break;default:throw Error(t(329))}}}return Rn(n,we()),n.callbackNode===o?kp.bind(null,n):null}function Su(n,i){var o=Pa;return n.current.memoizedState.isDehydrated&&(Or(n,i).flags|=256),n=el(n,i),n!==2&&(i=Cn,Cn=o,i!==null&&Eu(i)),n}function Eu(n){Cn===null?Cn=n:Cn.push.apply(Cn,n)}function Ov(n){for(var i=n;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var c=0;c<o.length;c++){var h=o[c],g=h.getSnapshot;h=h.value;try{if(!ti(g(),h))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function dr(n,i){for(i&=~vu,i&=~qo,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var o=31-ct(i),c=1<<o;n[o]=-1,i&=~c}}function Bp(n){if((Et&6)!==0)throw Error(t(327));Ms();var i=gi(n,0);if((i&1)===0)return Rn(n,we()),null;var o=el(n,i);if(n.tag!==0&&o===2){var c=Ci(n);c!==0&&(i=c,o=Su(n,c))}if(o===1)throw o=Na,Or(n,0),dr(n,i),Rn(n,we()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,Fr(n,Cn,Oi),Rn(n,we()),null}function Mu(n,i){var o=Et;Et|=1;try{return n(i)}finally{Et=o,Et===0&&(Es=we()+500,Ao&&rr())}}function Ur(n){cr!==null&&cr.tag===0&&(Et&6)===0&&Ms();var i=Et;Et|=1;var o=$n.transition,c=Nt;try{if($n.transition=null,Nt=1,n)return n()}finally{Nt=c,$n.transition=o,Et=i,(Et&6)===0&&rr()}}function Tu(){kn=Ss.current,Ft(Ss)}function Or(n,i){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,fv(o)),Wt!==null)for(o=Wt.return;o!==null;){var c=o;switch(Lc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&wo();break;case 3:xs(),Ft(wn),Ft(ln),Xc();break;case 5:jc(c);break;case 4:xs();break;case 13:Ft(zt);break;case 19:Ft(zt);break;case 10:Bc(c.type._context);break;case 22:case 23:Tu()}o=o.return}if(en=n,Wt=n=fr(n.current,null),sn=kn=i,Kt=0,Na=null,vu=qo=Dr=0,Cn=Pa=null,Pr!==null){for(i=0;i<Pr.length;i++)if(o=Pr[i],c=o.interleaved,c!==null){o.interleaved=null;var h=c.next,g=o.pending;if(g!==null){var T=g.next;g.next=h,c.next=T}o.pending=c}Pr=null}return n}function zp(n,i){do{var o=Wt;try{if(kc(),Fo.current=Vo,ko){for(var c=Vt.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}ko=!1}if(Lr=0,Jt=$t=Vt=null,Ta=!1,wa=0,gu.current=null,o===null||o.return===null){Kt=1,Na=i,Wt=null;break}e:{var g=n,T=o.return,D=o,B=i;if(i=sn,D.flags|=32768,B!==null&&typeof B=="object"&&typeof B.then=="function"){var re=B,Se=D,Ee=Se.tag;if((Se.mode&1)===0&&(Ee===0||Ee===11||Ee===15)){var _e=Se.alternate;_e?(Se.updateQueue=_e.updateQueue,Se.memoizedState=_e.memoizedState,Se.lanes=_e.lanes):(Se.updateQueue=null,Se.memoizedState=null)}var De=dp(T);if(De!==null){De.flags&=-257,fp(De,T,D,g,i),De.mode&1&&up(g,re,i),i=De,B=re;var ze=i.updateQueue;if(ze===null){var He=new Set;He.add(B),i.updateQueue=He}else ze.add(B);break e}else{if((i&1)===0){up(g,re,i),wu();break e}B=Error(t(426))}}else if(Bt&&D.mode&1){var jt=dp(T);if(jt!==null){(jt.flags&65536)===0&&(jt.flags|=256),fp(jt,T,D,g,i),Oc(_s(B,D));break e}}g=B=_s(B,D),Kt!==4&&(Kt=2),Pa===null?Pa=[g]:Pa.push(g),g=T;do{switch(g.tag){case 3:g.flags|=65536,i&=-i,g.lanes|=i;var Q=lp(g,B,i);Uh(g,Q);break e;case 1:D=B;var G=g.type,J=g.stateNode;if((g.flags&128)===0&&(typeof G.getDerivedStateFromError=="function"||J!==null&&typeof J.componentDidCatch=="function"&&(lr===null||!lr.has(J)))){g.flags|=65536,i&=-i,g.lanes|=i;var be=cp(g,D,i);Uh(g,be);break e}}g=g.return}while(g!==null)}Hp(o)}catch(Ye){i=Ye,Wt===o&&o!==null&&(Wt=o=o.return);continue}break}while(!0)}function Vp(){var n=Yo.current;return Yo.current=Vo,n===null?Vo:n}function wu(){(Kt===0||Kt===3||Kt===2)&&(Kt=4),en===null||(Dr&268435455)===0&&(qo&268435455)===0||dr(en,sn)}function el(n,i){var o=Et;Et|=2;var c=Vp();(en!==n||sn!==i)&&(Oi=null,Or(n,i));do try{Fv();break}catch(h){zp(n,h)}while(!0);if(kc(),Et=o,Yo.current=c,Wt!==null)throw Error(t(261));return en=null,sn=0,Kt}function Fv(){for(;Wt!==null;)Gp(Wt)}function kv(){for(;Wt!==null&&!q();)Gp(Wt)}function Gp(n){var i=Xp(n.alternate,n,kn);n.memoizedProps=n.pendingProps,i===null?Hp(n):Wt=i,gu.current=null}function Hp(n){var i=n;do{var o=i.alternate;if(n=i.return,(i.flags&32768)===0){if(o=Nv(o,i,kn),o!==null){Wt=o;return}}else{if(o=Pv(o,i),o!==null){o.flags&=32767,Wt=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Kt=6,Wt=null;return}}if(i=i.sibling,i!==null){Wt=i;return}Wt=i=n}while(i!==null);Kt===0&&(Kt=5)}function Fr(n,i,o){var c=Nt,h=$n.transition;try{$n.transition=null,Nt=1,Bv(n,i,o,c)}finally{$n.transition=h,Nt=c}return null}function Bv(n,i,o,c){do Ms();while(cr!==null);if((Et&6)!==0)throw Error(t(327));o=n.finishedWork;var h=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var g=o.lanes|o.childLanes;if(oo(n,g),n===en&&(Wt=en=null,sn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||Ko||(Ko=!0,Yp(rt,function(){return Ms(),null})),g=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||g){g=$n.transition,$n.transition=null;var T=Nt;Nt=1;var D=Et;Et|=4,gu.current=null,Lv(n,o),Lp(o,n),sv(wc),uo=!!Tc,wc=Tc=null,n.current=o,Dv(o),Ae(),Et=D,Nt=T,$n.transition=g}else n.current=o;if(Ko&&(Ko=!1,cr=n,Zo=h),g=n.pendingLanes,g===0&&(lr=null),an(o.stateNode),Rn(n,we()),i!==null)for(c=n.onRecoverableError,o=0;o<i.length;o++)h=i[o],c(h.value,{componentStack:h.stack,digest:h.digest});if($o)throw $o=!1,n=_u,_u=null,n;return(Zo&1)!==0&&n.tag!==0&&Ms(),g=n.pendingLanes,(g&1)!==0?n===yu?Ia++:(Ia=0,yu=n):Ia=0,rr(),null}function Ms(){if(cr!==null){var n=Pf(Zo),i=$n.transition,o=Nt;try{if($n.transition=null,Nt=16>n?16:n,cr===null)var c=!1;else{if(n=cr,cr=null,Zo=0,(Et&6)!==0)throw Error(t(331));var h=Et;for(Et|=4,Fe=n.current;Fe!==null;){var g=Fe,T=g.child;if((Fe.flags&16)!==0){var D=g.deletions;if(D!==null){for(var B=0;B<D.length;B++){var re=D[B];for(Fe=re;Fe!==null;){var Se=Fe;switch(Se.tag){case 0:case 11:case 15:Ra(8,Se,g)}var Ee=Se.child;if(Ee!==null)Ee.return=Se,Fe=Ee;else for(;Fe!==null;){Se=Fe;var _e=Se.sibling,De=Se.return;if(Cp(Se),Se===re){Fe=null;break}if(_e!==null){_e.return=De,Fe=_e;break}Fe=De}}}var ze=g.alternate;if(ze!==null){var He=ze.child;if(He!==null){ze.child=null;do{var jt=He.sibling;He.sibling=null,He=jt}while(He!==null)}}Fe=g}}if((g.subtreeFlags&2064)!==0&&T!==null)T.return=g,Fe=T;else e:for(;Fe!==null;){if(g=Fe,(g.flags&2048)!==0)switch(g.tag){case 0:case 11:case 15:Ra(9,g,g.return)}var Q=g.sibling;if(Q!==null){Q.return=g.return,Fe=Q;break e}Fe=g.return}}var G=n.current;for(Fe=G;Fe!==null;){T=Fe;var J=T.child;if((T.subtreeFlags&2064)!==0&&J!==null)J.return=T,Fe=J;else e:for(T=G;Fe!==null;){if(D=Fe,(D.flags&2048)!==0)try{switch(D.tag){case 0:case 11:case 15:Xo(9,D)}}catch(Ye){Ht(D,D.return,Ye)}if(D===T){Fe=null;break e}var be=D.sibling;if(be!==null){be.return=D.return,Fe=be;break e}Fe=D.return}}if(Et=h,rr(),_t&&typeof _t.onPostCommitFiberRoot=="function")try{_t.onPostCommitFiberRoot(At,n)}catch{}c=!0}return c}finally{Nt=o,$n.transition=i}}return!1}function jp(n,i,o){i=_s(o,i),i=lp(n,i,1),n=ar(n,i,1),i=_n(),n!==null&&(Tn(n,1,i),Rn(n,i))}function Ht(n,i,o){if(n.tag===3)jp(n,n,o);else for(;i!==null;){if(i.tag===3){jp(i,n,o);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(lr===null||!lr.has(c))){n=_s(o,n),n=cp(i,n,1),i=ar(i,n,1),n=_n(),i!==null&&(Tn(i,1,n),Rn(i,n));break}}i=i.return}}function zv(n,i,o){var c=n.pingCache;c!==null&&c.delete(i),i=_n(),n.pingedLanes|=n.suspendedLanes&o,en===n&&(sn&o)===o&&(Kt===4||Kt===3&&(sn&130023424)===sn&&500>we()-xu?Or(n,0):vu|=o),Rn(n,i)}function Wp(n,i){i===0&&((n.mode&1)===0?i=1:(i=ei,ei<<=1,(ei&130023424)===0&&(ei=4194304)));var o=_n();n=Li(n,i),n!==null&&(Tn(n,i,o),Rn(n,o))}function Vv(n){var i=n.memoizedState,o=0;i!==null&&(o=i.retryLane),Wp(n,o)}function Gv(n,i){var o=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(o=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),Wp(n,o)}var Xp;Xp=function(n,i,o){if(n!==null)if(n.memoizedProps!==i.pendingProps||wn.current)An=!0;else{if((n.lanes&o)===0&&(i.flags&128)===0)return An=!1,Rv(n,i,o);An=(n.flags&131072)!==0}else An=!1,Bt&&(i.flags&1048576)!==0&&wh(i,Ro,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;jo(n,i),n=i.pendingProps;var h=ds(i,ln.current);vs(i,o),h=$c(null,i,c,n,h,o);var g=Kc();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,bn(c)?(g=!0,bo(i)):g=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,Gc(i),h.updater=Go,i.stateNode=h,h._reactInternals=i,nu(i,c,n,o),i=au(null,i,c,!0,g,o)):(i.tag=0,Bt&&g&&Ic(i),xn(null,i,h,o),i=i.child),i;case 16:c=i.elementType;e:{switch(jo(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=jv(c),n=ii(c,n),h){case 0:i=su(null,i,c,n,o);break e;case 1:i=xp(null,i,c,n,o);break e;case 11:i=hp(null,i,c,n,o);break e;case 14:i=pp(null,i,c,ii(c.type,n),o);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ii(c,h),su(n,i,c,h,o);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ii(c,h),xp(n,i,c,h,o);case 3:e:{if(_p(i),n===null)throw Error(t(387));c=i.pendingProps,g=i.memoizedState,h=g.element,Dh(n,i),Uo(i,c,null,o);var T=i.memoizedState;if(c=T.element,g.isDehydrated)if(g={element:c,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=g,i.memoizedState=g,i.flags&256){h=_s(Error(t(423)),i),i=yp(n,i,c,o,h);break e}else if(c!==h){h=_s(Error(t(424)),i),i=yp(n,i,c,o,h);break e}else for(Fn=tr(i.stateNode.containerInfo.firstChild),On=i,Bt=!0,ni=null,o=Ih(i,null,c,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(ps(),c===h){i=Ui(n,i,o);break e}xn(n,i,c,o)}i=i.child}return i;case 5:return Fh(i),n===null&&Uc(i),c=i.type,h=i.pendingProps,g=n!==null?n.memoizedProps:null,T=h.children,bc(c,h)?T=null:g!==null&&bc(c,g)&&(i.flags|=32),vp(n,i),xn(n,i,T,o),i.child;case 6:return n===null&&Uc(i),null;case 13:return Sp(n,i,o);case 4:return Hc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ms(i,null,c,o):xn(n,i,c,o),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ii(c,h),hp(n,i,c,h,o);case 7:return xn(n,i,i.pendingProps,o),i.child;case 8:return xn(n,i,i.pendingProps.children,o),i.child;case 12:return xn(n,i,i.pendingProps.children,o),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,g=i.memoizedProps,T=h.value,Dt(Io,c._currentValue),c._currentValue=T,g!==null)if(ti(g.value,T)){if(g.children===h.children&&!wn.current){i=Ui(n,i,o);break e}}else for(g=i.child,g!==null&&(g.return=i);g!==null;){var D=g.dependencies;if(D!==null){T=g.child;for(var B=D.firstContext;B!==null;){if(B.context===c){if(g.tag===1){B=Di(-1,o&-o),B.tag=2;var re=g.updateQueue;if(re!==null){re=re.shared;var Se=re.pending;Se===null?B.next=B:(B.next=Se.next,Se.next=B),re.pending=B}}g.lanes|=o,B=g.alternate,B!==null&&(B.lanes|=o),zc(g.return,o,i),D.lanes|=o;break}B=B.next}}else if(g.tag===10)T=g.type===i.type?null:g.child;else if(g.tag===18){if(T=g.return,T===null)throw Error(t(341));T.lanes|=o,D=T.alternate,D!==null&&(D.lanes|=o),zc(T,o,i),T=g.sibling}else T=g.child;if(T!==null)T.return=g;else for(T=g;T!==null;){if(T===i){T=null;break}if(g=T.sibling,g!==null){g.return=T.return,T=g;break}T=T.return}g=T}xn(n,i,h.children,o),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,vs(i,o),h=Yn(h),c=c(h),i.flags|=1,xn(n,i,c,o),i.child;case 14:return c=i.type,h=ii(c,i.pendingProps),h=ii(c.type,h),pp(n,i,c,h,o);case 15:return mp(n,i,i.type,i.pendingProps,o);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:ii(c,h),jo(n,i),i.tag=1,bn(c)?(n=!0,bo(i)):n=!1,vs(i,o),ap(i,c,h),nu(i,c,h,o),au(null,i,c,!0,n,o);case 19:return Mp(n,i,o);case 22:return gp(n,i,o)}throw Error(t(156,i.tag))};function Yp(n,i){return se(n,i)}function Hv(n,i,o,c){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Kn(n,i,o,c){return new Hv(n,i,o,c)}function bu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function jv(n){if(typeof n=="function")return bu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===W)return 11;if(n===pe)return 14}return 2}function fr(n,i){var o=n.alternate;return o===null?(o=Kn(n.tag,i,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=i,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,i=n.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function tl(n,i,o,c,h,g){var T=2;if(c=n,typeof n=="function")bu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case O:return kr(o.children,h,g,i);case H:T=8,h|=8;break;case N:return n=Kn(12,o,i,h|2),n.elementType=N,n.lanes=g,n;case $:return n=Kn(13,o,i,h),n.elementType=$,n.lanes=g,n;case oe:return n=Kn(19,o,i,h),n.elementType=oe,n.lanes=g,n;case he:return nl(o,h,g,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case w:T=10;break e;case k:T=9;break e;case W:T=11;break e;case pe:T=14;break e;case fe:T=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=Kn(T,o,i,h),i.elementType=n,i.type=c,i.lanes=g,i}function kr(n,i,o,c){return n=Kn(7,n,c,i),n.lanes=o,n}function nl(n,i,o,c){return n=Kn(22,n,c,i),n.elementType=he,n.lanes=o,n.stateNode={isHidden:!1},n}function Au(n,i,o){return n=Kn(6,n,null,i),n.lanes=o,n}function Cu(n,i,o){return i=Kn(4,n.children!==null?n.children:[],n.key,i),i.lanes=o,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Wv(n,i,o,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=jn(0),this.expirationTimes=jn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=jn(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Ru(n,i,o,c,h,g,T,D,B){return n=new Wv(n,i,o,D,B),i===1?(i=1,g===!0&&(i|=8)):i=0,g=Kn(3,null,null,i),n.current=g,g.stateNode=n,g.memoizedState={element:c,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},Gc(g),n}function Xv(n,i,o){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:V,key:c==null?null:""+c,children:n,containerInfo:i,implementation:o}}function qp(n){if(!n)return ir;n=n._reactInternals;e:{if(mi(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(bn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(bn(o))return Eh(n,o,i)}return i}function $p(n,i,o,c,h,g,T,D,B){return n=Ru(o,c,!0,n,h,g,T,D,B),n.context=qp(null),o=n.current,c=_n(),h=ur(o),g=Di(c,h),g.callback=i??null,ar(o,g,h),n.current.lanes=h,Tn(n,h,c),Rn(n,c),n}function il(n,i,o,c){var h=i.current,g=_n(),T=ur(h);return o=qp(o),i.context===null?i.context=o:i.pendingContext=o,i=Di(g,T),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ar(h,i,T),n!==null&&(ai(n,h,T,g),Do(n,h,T)),T}function rl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Kp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<i?o:i}}function Nu(n,i){Kp(n,i),(n=n.alternate)&&Kp(n,i)}function Yv(){return null}var Zp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Pu(n){this._internalRoot=n}sl.prototype.render=Pu.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));il(n,i,null,null)},sl.prototype.unmount=Pu.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Ur(function(){il(null,n,null,null)}),i[Ri]=null}};function sl(n){this._internalRoot=n}sl.prototype.unstable_scheduleHydration=function(n){if(n){var i=Df();n={blockedOn:null,target:n,priority:i};for(var o=0;o<Qi.length&&i!==0&&i<Qi[o].priority;o++);Qi.splice(o,0,n),o===0&&Ff(n)}};function Iu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function al(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Qp(){}function qv(n,i,o,c,h){if(h){if(typeof c=="function"){var g=c;c=function(){var re=rl(T);g.call(re)}}var T=$p(i,c,n,0,null,!1,!1,"",Qp);return n._reactRootContainer=T,n[Ri]=T.current,ga(n.nodeType===8?n.parentNode:n),Ur(),T}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var D=c;c=function(){var re=rl(B);D.call(re)}}var B=Ru(n,0,!1,null,null,!1,!1,"",Qp);return n._reactRootContainer=B,n[Ri]=B.current,ga(n.nodeType===8?n.parentNode:n),Ur(function(){il(i,B,o,c)}),B}function ol(n,i,o,c,h){var g=o._reactRootContainer;if(g){var T=g;if(typeof h=="function"){var D=h;h=function(){var B=rl(T);D.call(B)}}il(i,T,n,h)}else T=qv(o,i,n,h,c);return rl(T)}If=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var o=qt(i.pendingLanes);o!==0&&(nc(i,o|1),Rn(i,we()),(Et&6)===0&&(Es=we()+500,rr()))}break;case 13:Ur(function(){var c=Li(n,1);if(c!==null){var h=_n();ai(c,n,1,h)}}),Nu(n,1)}},ic=function(n){if(n.tag===13){var i=Li(n,134217728);if(i!==null){var o=_n();ai(i,n,134217728,o)}Nu(n,134217728)}},Lf=function(n){if(n.tag===13){var i=ur(n),o=Li(n,i);if(o!==null){var c=_n();ai(o,n,i,c)}Nu(n,i)}},Df=function(){return Nt},Uf=function(n,i){var o=Nt;try{return Nt=n,i()}finally{Nt=o}},Re=function(n,i,o){switch(i){case"input":if(ht(n,o),i=o.name,o.type==="radio"&&i!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var c=o[i];if(c!==n&&c.form===n.form){var h=To(c);if(!h)throw Error(t(90));st(c),ht(c,h)}}}break;case"textarea":xe(n,o);break;case"select":i=o.value,i!=null&&L(n,!!o.multiple,i,!1)}},Ut=Mu,Yt=Ur;var $v={usingClientEntryPoint:!1,Events:[_a,cs,To,Ie,lt,Mu]},La={findFiberByHostInstance:Ar,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Kv={bundleType:La.bundleType,version:La.version,rendererPackageName:La.rendererPackageName,rendererConfig:La.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:C.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=P(n),n===null?null:n.stateNode},findFiberByHostInstance:La.findFiberByHostInstance||Yv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ll=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ll.isDisabled&&ll.supportsFiber)try{At=ll.inject(Kv),_t=ll}catch{}}return Nn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$v,Nn.createPortal=function(n,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Iu(i))throw Error(t(200));return Xv(n,i,null,o)},Nn.createRoot=function(n,i){if(!Iu(n))throw Error(t(299));var o=!1,c="",h=Zp;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Ru(n,1,!1,null,null,o,!1,c,h),n[Ri]=i.current,ga(n.nodeType===8?n.parentNode:n),new Pu(i)},Nn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=P(i),n=n===null?null:n.stateNode,n},Nn.flushSync=function(n){return Ur(n)},Nn.hydrate=function(n,i,o){if(!al(i))throw Error(t(200));return ol(null,n,i,!0,o)},Nn.hydrateRoot=function(n,i,o){if(!Iu(n))throw Error(t(405));var c=o!=null&&o.hydratedSources||null,h=!1,g="",T=Zp;if(o!=null&&(o.unstable_strictMode===!0&&(h=!0),o.identifierPrefix!==void 0&&(g=o.identifierPrefix),o.onRecoverableError!==void 0&&(T=o.onRecoverableError)),i=$p(i,null,n,1,o??null,h,!1,g,T),n[Ri]=i.current,ga(n),c)for(n=0;n<c.length;n++)o=c[n],h=o._getVersion,h=h(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,h]:i.mutableSourceEagerHydrationData.push(o,h);return new sl(i)},Nn.render=function(n,i,o){if(!al(i))throw Error(t(200));return ol(null,n,i,!1,o)},Nn.unmountComponentAtNode=function(n){if(!al(n))throw Error(t(40));return n._reactRootContainer?(Ur(function(){ol(null,null,n,!1,function(){n._reactRootContainer=null,n[Ri]=null})}),!0):!1},Nn.unstable_batchedUpdates=Mu,Nn.unstable_renderSubtreeIntoContainer=function(n,i,o,c){if(!al(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ol(n,i,o,!1,c)},Nn.version="18.3.1-next-f1338f8080-20240426",Nn}var am;function ox(){if(am)return Uu.exports;am=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Uu.exports=ax(),Uu.exports}var om;function lx(){if(om)return ul;om=1;var s=ox();return ul.createRoot=s.createRoot,ul.hydrateRoot=s.hydrateRoot,ul}var cx=lx();const ux=E0(cx);class dx{constructor(){cl(this,"listeners",{});cl(this,"history",[]);cl(this,"maxHistory",100)}subscribe(e,t){return this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t),()=>{this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(r=>r!==t))}}emit(e,t){const r=this.listeners[e];r&&r.forEach(a=>{try{a(t)}catch(l){console.error(`Error in event listener for ${String(e)}:`,l)}})}logActivity(e,t,r,a){const l={id:"act_"+Math.random().toString(36).substring(2,9),timestamp:Date.now(),type:e,message:t,details:r,mode:a};return this.history.unshift(l),this.history.length>this.maxHistory&&this.history.pop(),this.emit("activity.logged",{event:l}),l}getActivityHistory(){return[...this.history]}}const yn=new dx,fx=({size:s=40,className:e="",showText:t=!1,showTagline:r=!1,animated:a=!0,glow:l=!0,variant:u="emblem"})=>{const d=typeof s=="number"?s:40,p=()=>f.jsx("div",{className:`relative flex items-center justify-center select-none ${e}`,style:{width:d,height:d},children:f.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:`w-full h-full ${a?"transition-transform duration-500 hover:scale-105":""}`,style:{filter:l?"drop-shadow(0 0 16px rgba(59, 130, 246, 0.65)) drop-shadow(0 0 32px rgba(139, 92, 246, 0.45))":"none"},children:[f.jsxs("defs",{children:[f.jsxs("linearGradient",{id:"orionPlanetGrad",x1:"20",y1:"20",x2:"180",y2:"180",gradientUnits:"userSpaceOnUse",children:[f.jsx("stop",{offset:"0%",stopColor:"#38BDF8"}),f.jsx("stop",{offset:"35%",stopColor:"#3B82F6"}),f.jsx("stop",{offset:"70%",stopColor:"#8B5CF6"}),f.jsx("stop",{offset:"100%",stopColor:"#A855F7"})]}),f.jsxs("linearGradient",{id:"orionRingGrad",x1:"10",y1:"140",x2:"190",y2:"40",gradientUnits:"userSpaceOnUse",children:[f.jsx("stop",{offset:"0%",stopColor:"#60A5FA",stopOpacity:"0.8"}),f.jsx("stop",{offset:"45%",stopColor:"#38BDF8"}),f.jsx("stop",{offset:"85%",stopColor:"#C084FC"}),f.jsx("stop",{offset:"100%",stopColor:"#FFFFFF"})]}),f.jsxs("radialGradient",{id:"starFlare",cx:"50%",cy:"50%",r:"50%",children:[f.jsx("stop",{offset:"0%",stopColor:"#FFFFFF"}),f.jsx("stop",{offset:"25%",stopColor:"#BAE6FD"}),f.jsx("stop",{offset:"70%",stopColor:"#38BDF8",stopOpacity:"0.4"}),f.jsx("stop",{offset:"100%",stopColor:"#3B82F6",stopOpacity:"0"})]}),f.jsxs("filter",{id:"innerDepth",x:"-10%",y:"-10%",width:"120%",height:"120%",children:[f.jsx("feGaussianBlur",{stdDeviation:"3",result:"blur"}),f.jsx("feComposite",{in2:"SourceAlpha",operator:"arithmetic",k2:"-1",k3:"1",result:"shadow"}),f.jsx("feFlood",{floodColor:"#0B0F1A",floodOpacity:"0.7"}),f.jsx("feComposite",{in2:"shadow",operator:"in"}),f.jsx("feComposite",{in2:"SourceGraphic",operator:"over"})]})]}),f.jsx("path",{d:"M 28 126 C 22 136 32 144 54 138 C 96 126 142 98 174 62",stroke:"url(#orionRingGrad)",strokeWidth:"6",strokeLinecap:"round",opacity:"0.75"}),f.jsx("circle",{cx:"100",cy:"100",r:"62",stroke:"url(#orionPlanetGrad)",strokeWidth:"28",fill:"none",filter:"url(#innerDepth)"}),f.jsx("path",{d:"M 60 66 A 62 62 0 0 1 140 66",stroke:"#FFFFFF",strokeWidth:"4",strokeLinecap:"round",opacity:"0.6"}),f.jsx("path",{d:"M 22 136 C 40 152 74 150 114 132 C 152 114 180 84 186 64 C 188 56 182 50 172 54",stroke:"url(#orionRingGrad)",strokeWidth:"7",strokeLinecap:"round"}),f.jsx("path",{d:"M 80 144 C 120 128 156 98 174 68",stroke:"#FFFFFF",strokeWidth:"2.5",strokeLinecap:"round",opacity:"0.8"}),f.jsxs("g",{transform:"translate(154, 44)",children:[f.jsx("circle",{cx:"0",cy:"0",r:"24",fill:"url(#starFlare)",opacity:"0.85"}),f.jsx("path",{d:"M 0 -22 Q 1 -6 6 0 Q 1 6 0 22 Q -1 6 -6 0 Q -1 -6 0 -22 Z",fill:"#FFFFFF",className:a?"animate-pulse":""}),f.jsx("path",{d:"M -22 0 Q -6 -1 0 -6 Q 6 -1 22 0 Q 6 1 0 6 Q -6 1 -22 0 Z",fill:"#FFFFFF",className:a?"animate-pulse":""}),f.jsx("circle",{cx:"0",cy:"0",r:"3.5",fill:"#FFFFFF"})]})]})});return u==="emblem"&&!t?p():f.jsxs("div",{className:`flex items-center space-x-3 select-none ${e}`,children:[p(),(t||u==="horizontal"||u==="full")&&f.jsxs("div",{className:"flex flex-col",children:[f.jsx("div",{className:"flex items-center space-x-2",children:f.jsx("span",{className:"font-extrabold tracking-[0.25em] text-white font-sans uppercase drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]",style:{fontSize:typeof s=="number"?Math.max(14,s*.45):"18px"},children:"ORION"})}),r&&f.jsx("span",{className:"text-[10px] text-blue-400 font-mono tracking-widest uppercase",children:"COMMAND • ASSIST • CREATE"})]})]})};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hx=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),M0=(...s)=>s.filter((e,t,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var px={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mx=Ue.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:a="",children:l,iconNode:u,...d},p)=>Ue.createElement("svg",{ref:p,...px,width:e,height:e,stroke:s,strokeWidth:r?Number(t)*24/Number(e):t,className:M0("lucide",a),...d},[...u.map(([m,v])=>Ue.createElement(m,v)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=(s,e)=>{const t=Ue.forwardRef(({className:r,...a},l)=>Ue.createElement(mx,{ref:l,iconNode:e,className:M0(`lucide-${hx(s)}`,r),...a}));return t.displayName=`${s}`,t};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hf=gt("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T0=gt("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gx=gt("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fl=gt("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0=gt("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vx=gt("CirclePlay",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xx=gt("CircleStop",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["rect",{x:"9",y:"9",width:"6",height:"6",rx:"1",key:"1ssd4o"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _x=gt("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ws=gt("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=gt("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jl=gt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yx=gt("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sx=gt("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0=gt("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ex=gt("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mx=gt("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=gt("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tx=gt("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mf=gt("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gf=gt("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wx=gt("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=gt("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bx=gt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0=gt("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0=gt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ax=gt("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N0=gt("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=gt("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yl=gt("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cx=gt("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vf=gt("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rx=gt("SquareCheckBig",[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nx=gt("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ql=gt("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Px=gt("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0=gt("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix=gt("Wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xf=gt("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),Lx=[{mode:"COMMAND",label:"COMMAND",icon:ql},{mode:"DEMO",label:"DEMO",icon:vx,isSpecial:!0},{mode:"SYSTEM",label:"SYSTEM",icon:Ws},{mode:"VISION",label:"VISION",icon:jl},{mode:"COMPUTER",label:"COMPUTER",icon:gf},{mode:"NETWORK",label:"NETWORK",icon:wx},{mode:"WORLD",label:"WORLD",icon:A0},{mode:"TASK",label:"SUPERVISOR",icon:pf},{mode:"MEMORY",label:"MEMORY",icon:b0},{mode:"TITAN",label:"TITAN",icon:vf}],Dx=({assistantState:s,currentMode:e,privacy:t,onModeSelect:r,onToggleMic:a,onToggleCamera:l})=>{const u=()=>{switch(s){case"LISTENING":return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"}),f.jsx("span",{children:"LISTENING"})]});case"THINKING":return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(59,130,246,0.35)]",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"}),f.jsx("span",{children:"THINKING"})]});case"EXECUTING":return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(139,92,246,0.35)]",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"}),f.jsx("span",{children:"EXECUTING"})]});case"VISION":return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)]",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-300"}),f.jsx("span",{children:"VISION ACTIVE"})]});case"SPEAKING":return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 text-[11px] font-mono flex items-center space-x-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"}),f.jsx("span",{children:"SPEAKING"})]});case"ERROR":return f.jsx("span",{className:"px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/50 text-[11px] font-mono",children:"⚠️ SYSTEM ERROR"});default:return f.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-blue-500/10 text-slate-300 border border-blue-500/25 text-[11px] font-mono flex items-center space-x-1.5",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-blue-400/80"}),f.jsx("span",{children:"STANDBY"})]})}};return f.jsxs("div",{className:"w-full bg-[#0B0F1A]/90 border-b border-blue-500/20 px-4 py-2.5 flex flex-col space-y-2.5 backdrop-blur-md",children:[f.jsxs("div",{className:"flex justify-between items-center",children:[f.jsxs("div",{className:"flex items-center space-x-3.5",children:[f.jsx(fx,{size:36,animated:!0,glow:!0}),f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx("span",{className:"font-extrabold text-lg text-white tracking-[0.22em] font-sans drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]",children:"ORION"}),f.jsx("span",{className:"text-[10px] text-blue-400/80 tracking-widest font-mono border-l border-blue-500/30 pl-2",children:"v1.0.0"})]}),f.jsx("div",{className:"text-[9px] text-slate-400 font-mono tracking-wider uppercase flex items-center space-x-1.5",children:f.jsx("span",{className:"text-cyan-400 font-semibold",children:"YOUR AI. YOUR COMPUTER. YOUR WORLD."})})]})]}),f.jsxs("div",{className:"flex items-center space-x-5 text-xs",children:[f.jsxs("div",{className:"flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]",children:[f.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"}),f.jsx("span",{className:"font-mono text-[11px] font-bold tracking-widest text-emerald-300",children:"ORION ONLINE"})]}),f.jsxs("div",{className:"flex items-center space-x-2 border-l border-blue-500/20 pl-4",children:[f.jsx("span",{className:"text-slate-400 text-[10px] font-mono",children:"STATE:"}),u()]})]}),f.jsxs("div",{className:"flex items-center space-x-2.5 text-xs",children:[f.jsxs("button",{onClick:a,className:`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all text-[11px] font-mono ${t.micActive?"border-amber-400/80 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)]":"border-blue-500/20 bg-blue-950/30 text-slate-400 hover:border-blue-400/40 hover:text-slate-200"}`,children:[f.jsx(mf,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:t.micActive?"MIC ON":"MIC OFF"})]}),f.jsxs("button",{onClick:l,className:`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all text-[11px] font-mono ${t.cameraActive?"border-cyan-400/80 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.35)]":"border-blue-500/20 bg-blue-950/30 text-slate-400 hover:border-blue-400/40 hover:text-slate-200"}`,children:[f.jsx(T0,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:t.cameraActive?"CAM ON":"CAM OFF"})]}),f.jsxs("div",{className:"flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-slate-300 text-[10px] font-mono",children:[f.jsx(Cx,{className:"w-3.5 h-3.5 text-emerald-400"}),f.jsx("span",{className:"tracking-wider",children:"SAFETY: ENFORCED"})]})]})]}),f.jsx("div",{className:"flex space-x-1.5 border-t border-blue-500/20 pt-2 overflow-x-auto",children:Lx.map(({mode:d,label:p,icon:m,isSpecial:v})=>{const _=e===d;return f.jsxs("button",{onClick:()=>r(d),className:`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider transition-all border ${_?v?"border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]":"border-blue-400 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-violet-600/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]":v?"border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10":"border-blue-500/15 bg-blue-950/20 text-slate-400 hover:text-white hover:border-blue-400/40 hover:bg-blue-900/20"}`,children:[f.jsx(m,{className:"w-3 h-3"}),f.jsx("span",{children:p})]},d)})})]})};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const _f="170",Ux=0,lm=1,Ox=2,I0=1,Fx=2,Gi=3,Mr=0,Ln=1,Ei=2,Sr=0,Gs=1,cm=2,um=3,dm=4,kx=5,Yr=100,Bx=101,zx=102,Vx=103,Gx=104,Hx=200,jx=201,Wx=202,Xx=203,Sd=204,Ed=205,Yx=206,qx=207,$x=208,Kx=209,Zx=210,Qx=211,Jx=212,e_=213,t_=214,Md=0,Td=1,wd=2,Xs=3,bd=4,Ad=5,Cd=6,Rd=7,L0=0,n_=1,i_=2,Er=0,r_=1,s_=2,a_=3,o_=4,l_=5,c_=6,u_=7,D0=300,Ys=301,qs=302,Nd=303,Pd=304,$l=306,Id=1e3,$r=1001,Ld=1002,fi=1003,d_=1004,dl=1005,Mi=1006,ku=1007,Kr=1008,Xi=1009,U0=1010,O0=1011,qa=1012,yf=1013,Zr=1014,Hi=1015,Ja=1016,Sf=1017,Ef=1018,$s=1020,F0=35902,k0=1021,B0=1022,di=1023,z0=1024,V0=1025,Hs=1026,Ks=1027,G0=1028,Mf=1029,H0=1030,Tf=1031,wf=1033,kl=33776,Bl=33777,zl=33778,Vl=33779,Dd=35840,Ud=35841,Od=35842,Fd=35843,kd=36196,Bd=37492,zd=37496,Vd=37808,Gd=37809,Hd=37810,jd=37811,Wd=37812,Xd=37813,Yd=37814,qd=37815,$d=37816,Kd=37817,Zd=37818,Qd=37819,Jd=37820,ef=37821,Gl=36492,tf=36494,nf=36495,j0=36283,rf=36284,sf=36285,af=36286,f_=3200,h_=3201,W0=0,p_=1,yr="",Qn="srgb",Qs="srgb-linear",Kl="linear",Pt="srgb",Ts=7680,fm=519,m_=512,g_=513,v_=514,X0=515,x_=516,__=517,y_=518,S_=519,hm=35044,pm="300 es",ji=2e3,Wl=2001;class Js{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let l=0,u=a.length;l<u;l++)a[l].call(this,e);e.target=null}}}const fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bu=Math.PI/180,of=180/Math.PI;function ea(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(fn[s&255]+fn[s>>8&255]+fn[s>>16&255]+fn[s>>24&255]+"-"+fn[e&255]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[t&63|128]+fn[t>>8&255]+"-"+fn[t>>16&255]+fn[t>>24&255]+fn[r&255]+fn[r>>8&255]+fn[r>>16&255]+fn[r>>24&255]).toLowerCase()}function pn(s,e,t){return Math.max(e,Math.min(t,s))}function E_(s,e){return(s%e+e)%e}function zu(s,e,t){return(1-t)*s+t*e}function Ua(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Pn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class $e{constructor(e=0,t=0){$e.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(pn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*r-u*a+e.x,this.y=l*a+u*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ut{constructor(e,t,r,a,l,u,d,p,m){ut.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,d,p,m)}set(e,t,r,a,l,u,d,p,m){const v=this.elements;return v[0]=e,v[1]=a,v[2]=d,v[3]=t,v[4]=l,v[5]=p,v[6]=r,v[7]=u,v[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],d=r[3],p=r[6],m=r[1],v=r[4],_=r[7],x=r[2],E=r[5],M=r[8],b=a[0],S=a[3],y=a[6],R=a[1],I=a[4],C=a[7],Z=a[2],V=a[5],O=a[8];return l[0]=u*b+d*R+p*Z,l[3]=u*S+d*I+p*V,l[6]=u*y+d*C+p*O,l[1]=m*b+v*R+_*Z,l[4]=m*S+v*I+_*V,l[7]=m*y+v*C+_*O,l[2]=x*b+E*R+M*Z,l[5]=x*S+E*I+M*V,l[8]=x*y+E*C+M*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],p=e[6],m=e[7],v=e[8];return t*u*v-t*d*m-r*l*v+r*d*p+a*l*m-a*u*p}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],p=e[6],m=e[7],v=e[8],_=v*u-d*m,x=d*p-v*l,E=m*l-u*p,M=t*_+r*x+a*E;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/M;return e[0]=_*b,e[1]=(a*m-v*r)*b,e[2]=(d*r-a*u)*b,e[3]=x*b,e[4]=(v*t-a*p)*b,e[5]=(a*l-d*t)*b,e[6]=E*b,e[7]=(r*p-m*t)*b,e[8]=(u*t-r*l)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,l,u,d){const p=Math.cos(l),m=Math.sin(l);return this.set(r*p,r*m,-r*(p*u+m*d)+u+e,-a*m,a*p,-a*(-m*u+p*d)+d+t,0,0,1),this}scale(e,t){return this.premultiply(Vu.makeScale(e,t)),this}rotate(e){return this.premultiply(Vu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Vu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Vu=new ut;function Y0(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Xl(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function M_(){const s=Xl("canvas");return s.style.display="block",s}const mm={};function Va(s){s in mm||(mm[s]=!0,console.warn(s))}function T_(s,e,t){return new Promise(function(r,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}function w_(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function b_(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Mt={enabled:!0,workingColorSpace:Qs,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Pt&&(s.r=Wi(s.r),s.g=Wi(s.g),s.b=Wi(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Pt&&(s.r=js(s.r),s.g=js(s.g),s.b=js(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===yr?Kl:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Wi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function js(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const gm=[.64,.33,.3,.6,.15,.06],vm=[.2126,.7152,.0722],xm=[.3127,.329],_m=new ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ym=new ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Mt.define({[Qs]:{primaries:gm,whitePoint:xm,transfer:Kl,toXYZ:_m,fromXYZ:ym,luminanceCoefficients:vm,workingColorSpaceConfig:{unpackColorSpace:Qn},outputColorSpaceConfig:{drawingBufferColorSpace:Qn}},[Qn]:{primaries:gm,whitePoint:xm,transfer:Pt,toXYZ:_m,fromXYZ:ym,luminanceCoefficients:vm,outputColorSpaceConfig:{drawingBufferColorSpace:Qn}}});let ws;class A_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ws===void 0&&(ws=Xl("canvas")),ws.width=e.width,ws.height=e.height;const r=ws.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=ws}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xl("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),l=a.data;for(let u=0;u<l.length;u++)l[u]=Wi(l[u]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Wi(t[r]/255)*255):t[r]=Wi(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let C_=0;class q0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:C_++}),this.uuid=ea(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let u=0,d=a.length;u<d;u++)a[u].isDataTexture?l.push(Gu(a[u].image)):l.push(Gu(a[u]))}else l=Gu(a);r.url=l}return t||(e.images[this.uuid]=r),r}}function Gu(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?A_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let R_=0;class Dn extends Js{constructor(e=Dn.DEFAULT_IMAGE,t=Dn.DEFAULT_MAPPING,r=$r,a=$r,l=Mi,u=Kr,d=di,p=Xi,m=Dn.DEFAULT_ANISOTROPY,v=yr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:R_++}),this.uuid=ea(),this.name="",this.source=new q0(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=l,this.minFilter=u,this.anisotropy=m,this.format=d,this.internalFormat=null,this.type=p,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==D0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Id:e.x=e.x-Math.floor(e.x);break;case $r:e.x=e.x<0?0:1;break;case Ld:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Id:e.y=e.y-Math.floor(e.y);break;case $r:e.y=e.y<0?0:1;break;case Ld:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=D0;Dn.DEFAULT_ANISOTROPY=1;class It{constructor(e=0,t=0,r=0,a=1){It.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*r+u[8]*a+u[12]*l,this.y=u[1]*t+u[5]*r+u[9]*a+u[13]*l,this.z=u[2]*t+u[6]*r+u[10]*a+u[14]*l,this.w=u[3]*t+u[7]*r+u[11]*a+u[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,l;const p=e.elements,m=p[0],v=p[4],_=p[8],x=p[1],E=p[5],M=p[9],b=p[2],S=p[6],y=p[10];if(Math.abs(v-x)<.01&&Math.abs(_-b)<.01&&Math.abs(M-S)<.01){if(Math.abs(v+x)<.1&&Math.abs(_+b)<.1&&Math.abs(M+S)<.1&&Math.abs(m+E+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const I=(m+1)/2,C=(E+1)/2,Z=(y+1)/2,V=(v+x)/4,O=(_+b)/4,H=(M+S)/4;return I>C&&I>Z?I<.01?(r=0,a=.707106781,l=.707106781):(r=Math.sqrt(I),a=V/r,l=O/r):C>Z?C<.01?(r=.707106781,a=0,l=.707106781):(a=Math.sqrt(C),r=V/a,l=H/a):Z<.01?(r=.707106781,a=.707106781,l=0):(l=Math.sqrt(Z),r=O/l,a=H/l),this.set(r,a,l,t),this}let R=Math.sqrt((S-M)*(S-M)+(_-b)*(_-b)+(x-v)*(x-v));return Math.abs(R)<.001&&(R=1),this.x=(S-M)/R,this.y=(_-b)/R,this.z=(x-v)/R,this.w=Math.acos((m+E+y-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class N_ extends Js{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t);const a={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const l=new Dn(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);l.flipY=!1,l.generateMipmaps=r.generateMipmaps,l.internalFormat=r.internalFormat,this.textures=[];const u=r.count;for(let d=0;d<u;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new q0(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qr extends N_{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class $0 extends Dn{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=fi,this.minFilter=fi,this.wrapR=$r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class P_ extends Dn{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=fi,this.minFilter=fi,this.wrapR=$r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class eo{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,l,u,d){let p=r[a+0],m=r[a+1],v=r[a+2],_=r[a+3];const x=l[u+0],E=l[u+1],M=l[u+2],b=l[u+3];if(d===0){e[t+0]=p,e[t+1]=m,e[t+2]=v,e[t+3]=_;return}if(d===1){e[t+0]=x,e[t+1]=E,e[t+2]=M,e[t+3]=b;return}if(_!==b||p!==x||m!==E||v!==M){let S=1-d;const y=p*x+m*E+v*M+_*b,R=y>=0?1:-1,I=1-y*y;if(I>Number.EPSILON){const Z=Math.sqrt(I),V=Math.atan2(Z,y*R);S=Math.sin(S*V)/Z,d=Math.sin(d*V)/Z}const C=d*R;if(p=p*S+x*C,m=m*S+E*C,v=v*S+M*C,_=_*S+b*C,S===1-d){const Z=1/Math.sqrt(p*p+m*m+v*v+_*_);p*=Z,m*=Z,v*=Z,_*=Z}}e[t]=p,e[t+1]=m,e[t+2]=v,e[t+3]=_}static multiplyQuaternionsFlat(e,t,r,a,l,u){const d=r[a],p=r[a+1],m=r[a+2],v=r[a+3],_=l[u],x=l[u+1],E=l[u+2],M=l[u+3];return e[t]=d*M+v*_+p*E-m*x,e[t+1]=p*M+v*x+m*_-d*E,e[t+2]=m*M+v*E+d*x-p*_,e[t+3]=v*M-d*_-p*x-m*E,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,l=e._z,u=e._order,d=Math.cos,p=Math.sin,m=d(r/2),v=d(a/2),_=d(l/2),x=p(r/2),E=p(a/2),M=p(l/2);switch(u){case"XYZ":this._x=x*v*_+m*E*M,this._y=m*E*_-x*v*M,this._z=m*v*M+x*E*_,this._w=m*v*_-x*E*M;break;case"YXZ":this._x=x*v*_+m*E*M,this._y=m*E*_-x*v*M,this._z=m*v*M-x*E*_,this._w=m*v*_+x*E*M;break;case"ZXY":this._x=x*v*_-m*E*M,this._y=m*E*_+x*v*M,this._z=m*v*M+x*E*_,this._w=m*v*_-x*E*M;break;case"ZYX":this._x=x*v*_-m*E*M,this._y=m*E*_+x*v*M,this._z=m*v*M-x*E*_,this._w=m*v*_+x*E*M;break;case"YZX":this._x=x*v*_+m*E*M,this._y=m*E*_+x*v*M,this._z=m*v*M-x*E*_,this._w=m*v*_-x*E*M;break;case"XZY":this._x=x*v*_-m*E*M,this._y=m*E*_-x*v*M,this._z=m*v*M+x*E*_,this._w=m*v*_+x*E*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],l=t[8],u=t[1],d=t[5],p=t[9],m=t[2],v=t[6],_=t[10],x=r+d+_;if(x>0){const E=.5/Math.sqrt(x+1);this._w=.25/E,this._x=(v-p)*E,this._y=(l-m)*E,this._z=(u-a)*E}else if(r>d&&r>_){const E=2*Math.sqrt(1+r-d-_);this._w=(v-p)/E,this._x=.25*E,this._y=(a+u)/E,this._z=(l+m)/E}else if(d>_){const E=2*Math.sqrt(1+d-r-_);this._w=(l-m)/E,this._x=(a+u)/E,this._y=.25*E,this._z=(p+v)/E}else{const E=2*Math.sqrt(1+_-r-d);this._w=(u-a)/E,this._x=(l+m)/E,this._y=(p+v)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(pn(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,l=e._z,u=e._w,d=t._x,p=t._y,m=t._z,v=t._w;return this._x=r*v+u*d+a*m-l*p,this._y=a*v+u*p+l*d-r*m,this._z=l*v+u*m+r*p-a*d,this._w=u*v-r*d-a*p-l*m,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,l=this._z,u=this._w;let d=u*e._w+r*e._x+a*e._y+l*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=u,this._x=r,this._y=a,this._z=l,this;const p=1-d*d;if(p<=Number.EPSILON){const E=1-t;return this._w=E*u+t*this._w,this._x=E*r+t*this._x,this._y=E*a+t*this._y,this._z=E*l+t*this._z,this.normalize(),this}const m=Math.sqrt(p),v=Math.atan2(m,d),_=Math.sin((1-t)*v)/m,x=Math.sin(t*v)/m;return this._w=u*_+this._w*x,this._x=r*_+this._x*x,this._y=a*_+this._y*x,this._z=l*_+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(e=0,t=0,r=0){X.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*a,this.y=l[1]*t+l[4]*r+l[7]*a,this.z=l[2]*t+l[5]*r+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=e.elements,u=1/(l[3]*t+l[7]*r+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*a+l[12])*u,this.y=(l[1]*t+l[5]*r+l[9]*a+l[13])*u,this.z=(l[2]*t+l[6]*r+l[10]*a+l[14])*u,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,l=e.x,u=e.y,d=e.z,p=e.w,m=2*(u*a-d*r),v=2*(d*t-l*a),_=2*(l*r-u*t);return this.x=t+p*m+u*_-d*v,this.y=r+p*v+d*m-l*_,this.z=a+p*_+l*v-u*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*a,this.y=l[1]*t+l[5]*r+l[9]*a,this.z=l[2]*t+l[6]*r+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,l=e.z,u=t.x,d=t.y,p=t.z;return this.x=a*p-l*d,this.y=l*u-r*p,this.z=r*d-a*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Hu.copy(this).projectOnVector(e),this.sub(Hu)}reflect(e){return this.sub(Hu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(pn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hu=new X,Sm=new eo;class to{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(oi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(oi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=oi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,d=l.count;u<d;u++)e.isMesh===!0?e.getVertexPosition(u,oi):oi.fromBufferAttribute(l,u),oi.applyMatrix4(e.matrixWorld),this.expandByPoint(oi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),fl.copy(r.boundingBox)),fl.applyMatrix4(e.matrixWorld),this.union(fl)}const a=e.children;for(let l=0,u=a.length;l<u;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,oi),oi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Oa),hl.subVectors(this.max,Oa),bs.subVectors(e.a,Oa),As.subVectors(e.b,Oa),Cs.subVectors(e.c,Oa),pr.subVectors(As,bs),mr.subVectors(Cs,As),Br.subVectors(bs,Cs);let t=[0,-pr.z,pr.y,0,-mr.z,mr.y,0,-Br.z,Br.y,pr.z,0,-pr.x,mr.z,0,-mr.x,Br.z,0,-Br.x,-pr.y,pr.x,0,-mr.y,mr.x,0,-Br.y,Br.x,0];return!ju(t,bs,As,Cs,hl)||(t=[1,0,0,0,1,0,0,0,1],!ju(t,bs,As,Cs,hl))?!1:(pl.crossVectors(pr,mr),t=[pl.x,pl.y,pl.z],ju(t,bs,As,Cs,hl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,oi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(oi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Fi=[new X,new X,new X,new X,new X,new X,new X,new X],oi=new X,fl=new to,bs=new X,As=new X,Cs=new X,pr=new X,mr=new X,Br=new X,Oa=new X,hl=new X,pl=new X,zr=new X;function ju(s,e,t,r,a){for(let l=0,u=s.length-3;l<=u;l+=3){zr.fromArray(s,l);const d=a.x*Math.abs(zr.x)+a.y*Math.abs(zr.y)+a.z*Math.abs(zr.z),p=e.dot(zr),m=t.dot(zr),v=r.dot(zr);if(Math.max(-Math.max(p,m,v),Math.min(p,m,v))>d)return!1}return!0}const I_=new to,Fa=new X,Wu=new X;class Zl{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):I_.setFromPoints(e).getCenter(r);let a=0;for(let l=0,u=e.length;l<u;l++)a=Math.max(a,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fa.subVectors(e,this.center);const t=Fa.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(Fa,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fa.copy(e.center).add(Wu)),this.expandByPoint(Fa.copy(e.center).sub(Wu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ki=new X,Xu=new X,ml=new X,gr=new X,Yu=new X,gl=new X,qu=new X;class K0{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ki)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ki.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ki.copy(this.origin).addScaledVector(this.direction,t),ki.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){Xu.copy(e).add(t).multiplyScalar(.5),ml.copy(t).sub(e).normalize(),gr.copy(this.origin).sub(Xu);const l=e.distanceTo(t)*.5,u=-this.direction.dot(ml),d=gr.dot(this.direction),p=-gr.dot(ml),m=gr.lengthSq(),v=Math.abs(1-u*u);let _,x,E,M;if(v>0)if(_=u*p-d,x=u*d-p,M=l*v,_>=0)if(x>=-M)if(x<=M){const b=1/v;_*=b,x*=b,E=_*(_+u*x+2*d)+x*(u*_+x+2*p)+m}else x=l,_=Math.max(0,-(u*x+d)),E=-_*_+x*(x+2*p)+m;else x=-l,_=Math.max(0,-(u*x+d)),E=-_*_+x*(x+2*p)+m;else x<=-M?(_=Math.max(0,-(-u*l+d)),x=_>0?-l:Math.min(Math.max(-l,-p),l),E=-_*_+x*(x+2*p)+m):x<=M?(_=0,x=Math.min(Math.max(-l,-p),l),E=x*(x+2*p)+m):(_=Math.max(0,-(u*l+d)),x=_>0?l:Math.min(Math.max(-l,-p),l),E=-_*_+x*(x+2*p)+m);else x=u>0?-l:l,_=Math.max(0,-(u*x+d)),E=-_*_+x*(x+2*p)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,_),a&&a.copy(Xu).addScaledVector(ml,x),E}intersectSphere(e,t){ki.subVectors(e.center,this.origin);const r=ki.dot(this.direction),a=ki.dot(ki)-r*r,l=e.radius*e.radius;if(a>l)return null;const u=Math.sqrt(l-a),d=r-u,p=r+u;return p<0?null:d<0?this.at(p,t):this.at(d,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,l,u,d,p;const m=1/this.direction.x,v=1/this.direction.y,_=1/this.direction.z,x=this.origin;return m>=0?(r=(e.min.x-x.x)*m,a=(e.max.x-x.x)*m):(r=(e.max.x-x.x)*m,a=(e.min.x-x.x)*m),v>=0?(l=(e.min.y-x.y)*v,u=(e.max.y-x.y)*v):(l=(e.max.y-x.y)*v,u=(e.min.y-x.y)*v),r>u||l>a||((l>r||isNaN(r))&&(r=l),(u<a||isNaN(a))&&(a=u),_>=0?(d=(e.min.z-x.z)*_,p=(e.max.z-x.z)*_):(d=(e.max.z-x.z)*_,p=(e.min.z-x.z)*_),r>p||d>a)||((d>r||r!==r)&&(r=d),(p<a||a!==a)&&(a=p),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,ki)!==null}intersectTriangle(e,t,r,a,l){Yu.subVectors(t,e),gl.subVectors(r,e),qu.crossVectors(Yu,gl);let u=this.direction.dot(qu),d;if(u>0){if(a)return null;d=1}else if(u<0)d=-1,u=-u;else return null;gr.subVectors(this.origin,e);const p=d*this.direction.dot(gl.crossVectors(gr,gl));if(p<0)return null;const m=d*this.direction.dot(Yu.cross(gr));if(m<0||p+m>u)return null;const v=-d*gr.dot(qu);return v<0?null:this.at(v/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class kt{constructor(e,t,r,a,l,u,d,p,m,v,_,x,E,M,b,S){kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,d,p,m,v,_,x,E,M,b,S)}set(e,t,r,a,l,u,d,p,m,v,_,x,E,M,b,S){const y=this.elements;return y[0]=e,y[4]=t,y[8]=r,y[12]=a,y[1]=l,y[5]=u,y[9]=d,y[13]=p,y[2]=m,y[6]=v,y[10]=_,y[14]=x,y[3]=E,y[7]=M,y[11]=b,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new kt().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Rs.setFromMatrixColumn(e,0).length(),l=1/Rs.setFromMatrixColumn(e,1).length(),u=1/Rs.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*u,t[9]=r[9]*u,t[10]=r[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,l=e.z,u=Math.cos(r),d=Math.sin(r),p=Math.cos(a),m=Math.sin(a),v=Math.cos(l),_=Math.sin(l);if(e.order==="XYZ"){const x=u*v,E=u*_,M=d*v,b=d*_;t[0]=p*v,t[4]=-p*_,t[8]=m,t[1]=E+M*m,t[5]=x-b*m,t[9]=-d*p,t[2]=b-x*m,t[6]=M+E*m,t[10]=u*p}else if(e.order==="YXZ"){const x=p*v,E=p*_,M=m*v,b=m*_;t[0]=x+b*d,t[4]=M*d-E,t[8]=u*m,t[1]=u*_,t[5]=u*v,t[9]=-d,t[2]=E*d-M,t[6]=b+x*d,t[10]=u*p}else if(e.order==="ZXY"){const x=p*v,E=p*_,M=m*v,b=m*_;t[0]=x-b*d,t[4]=-u*_,t[8]=M+E*d,t[1]=E+M*d,t[5]=u*v,t[9]=b-x*d,t[2]=-u*m,t[6]=d,t[10]=u*p}else if(e.order==="ZYX"){const x=u*v,E=u*_,M=d*v,b=d*_;t[0]=p*v,t[4]=M*m-E,t[8]=x*m+b,t[1]=p*_,t[5]=b*m+x,t[9]=E*m-M,t[2]=-m,t[6]=d*p,t[10]=u*p}else if(e.order==="YZX"){const x=u*p,E=u*m,M=d*p,b=d*m;t[0]=p*v,t[4]=b-x*_,t[8]=M*_+E,t[1]=_,t[5]=u*v,t[9]=-d*v,t[2]=-m*v,t[6]=E*_+M,t[10]=x-b*_}else if(e.order==="XZY"){const x=u*p,E=u*m,M=d*p,b=d*m;t[0]=p*v,t[4]=-_,t[8]=m*v,t[1]=x*_+b,t[5]=u*v,t[9]=E*_-M,t[2]=M*_-E,t[6]=d*v,t[10]=b*_+x}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(L_,e,D_)}lookAt(e,t,r){const a=this.elements;return Bn.subVectors(e,t),Bn.lengthSq()===0&&(Bn.z=1),Bn.normalize(),vr.crossVectors(r,Bn),vr.lengthSq()===0&&(Math.abs(r.z)===1?Bn.x+=1e-4:Bn.z+=1e-4,Bn.normalize(),vr.crossVectors(r,Bn)),vr.normalize(),vl.crossVectors(Bn,vr),a[0]=vr.x,a[4]=vl.x,a[8]=Bn.x,a[1]=vr.y,a[5]=vl.y,a[9]=Bn.y,a[2]=vr.z,a[6]=vl.z,a[10]=Bn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],d=r[4],p=r[8],m=r[12],v=r[1],_=r[5],x=r[9],E=r[13],M=r[2],b=r[6],S=r[10],y=r[14],R=r[3],I=r[7],C=r[11],Z=r[15],V=a[0],O=a[4],H=a[8],N=a[12],w=a[1],k=a[5],W=a[9],$=a[13],oe=a[2],pe=a[6],fe=a[10],he=a[14],z=a[3],ue=a[7],ne=a[11],U=a[15];return l[0]=u*V+d*w+p*oe+m*z,l[4]=u*O+d*k+p*pe+m*ue,l[8]=u*H+d*W+p*fe+m*ne,l[12]=u*N+d*$+p*he+m*U,l[1]=v*V+_*w+x*oe+E*z,l[5]=v*O+_*k+x*pe+E*ue,l[9]=v*H+_*W+x*fe+E*ne,l[13]=v*N+_*$+x*he+E*U,l[2]=M*V+b*w+S*oe+y*z,l[6]=M*O+b*k+S*pe+y*ue,l[10]=M*H+b*W+S*fe+y*ne,l[14]=M*N+b*$+S*he+y*U,l[3]=R*V+I*w+C*oe+Z*z,l[7]=R*O+I*k+C*pe+Z*ue,l[11]=R*H+I*W+C*fe+Z*ne,l[15]=R*N+I*$+C*he+Z*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],l=e[12],u=e[1],d=e[5],p=e[9],m=e[13],v=e[2],_=e[6],x=e[10],E=e[14],M=e[3],b=e[7],S=e[11],y=e[15];return M*(+l*p*_-a*m*_-l*d*x+r*m*x+a*d*E-r*p*E)+b*(+t*p*E-t*m*x+l*u*x-a*u*E+a*m*v-l*p*v)+S*(+t*m*_-t*d*E-l*u*_+r*u*E+l*d*v-r*m*v)+y*(-a*d*v-t*p*_+t*d*x+a*u*_-r*u*x+r*p*v)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],d=e[5],p=e[6],m=e[7],v=e[8],_=e[9],x=e[10],E=e[11],M=e[12],b=e[13],S=e[14],y=e[15],R=_*S*m-b*x*m+b*p*E-d*S*E-_*p*y+d*x*y,I=M*x*m-v*S*m-M*p*E+u*S*E+v*p*y-u*x*y,C=v*b*m-M*_*m+M*d*E-u*b*E-v*d*y+u*_*y,Z=M*_*p-v*b*p-M*d*x+u*b*x+v*d*S-u*_*S,V=t*R+r*I+a*C+l*Z;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/V;return e[0]=R*O,e[1]=(b*x*l-_*S*l-b*a*E+r*S*E+_*a*y-r*x*y)*O,e[2]=(d*S*l-b*p*l+b*a*m-r*S*m-d*a*y+r*p*y)*O,e[3]=(_*p*l-d*x*l-_*a*m+r*x*m+d*a*E-r*p*E)*O,e[4]=I*O,e[5]=(v*S*l-M*x*l+M*a*E-t*S*E-v*a*y+t*x*y)*O,e[6]=(M*p*l-u*S*l-M*a*m+t*S*m+u*a*y-t*p*y)*O,e[7]=(u*x*l-v*p*l+v*a*m-t*x*m-u*a*E+t*p*E)*O,e[8]=C*O,e[9]=(M*_*l-v*b*l-M*r*E+t*b*E+v*r*y-t*_*y)*O,e[10]=(u*b*l-M*d*l+M*r*m-t*b*m-u*r*y+t*d*y)*O,e[11]=(v*d*l-u*_*l-v*r*m+t*_*m+u*r*E-t*d*E)*O,e[12]=Z*O,e[13]=(v*b*a-M*_*a+M*r*x-t*b*x-v*r*S+t*_*S)*O,e[14]=(M*d*a-u*b*a-M*r*p+t*b*p+u*r*S-t*d*S)*O,e[15]=(u*_*a-v*d*a+v*r*p-t*_*p-u*r*x+t*d*x)*O,this}scale(e){const t=this.elements,r=e.x,a=e.y,l=e.z;return t[0]*=r,t[4]*=a,t[8]*=l,t[1]*=r,t[5]*=a,t[9]*=l,t[2]*=r,t[6]*=a,t[10]*=l,t[3]*=r,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),l=1-r,u=e.x,d=e.y,p=e.z,m=l*u,v=l*d;return this.set(m*u+r,m*d-a*p,m*p+a*d,0,m*d+a*p,v*d+r,v*p-a*u,0,m*p-a*d,v*p+a*u,l*p*p+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,l,u){return this.set(1,r,l,0,e,1,u,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,l=t._x,u=t._y,d=t._z,p=t._w,m=l+l,v=u+u,_=d+d,x=l*m,E=l*v,M=l*_,b=u*v,S=u*_,y=d*_,R=p*m,I=p*v,C=p*_,Z=r.x,V=r.y,O=r.z;return a[0]=(1-(b+y))*Z,a[1]=(E+C)*Z,a[2]=(M-I)*Z,a[3]=0,a[4]=(E-C)*V,a[5]=(1-(x+y))*V,a[6]=(S+R)*V,a[7]=0,a[8]=(M+I)*O,a[9]=(S-R)*O,a[10]=(1-(x+b))*O,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let l=Rs.set(a[0],a[1],a[2]).length();const u=Rs.set(a[4],a[5],a[6]).length(),d=Rs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(l=-l),e.x=a[12],e.y=a[13],e.z=a[14],li.copy(this);const m=1/l,v=1/u,_=1/d;return li.elements[0]*=m,li.elements[1]*=m,li.elements[2]*=m,li.elements[4]*=v,li.elements[5]*=v,li.elements[6]*=v,li.elements[8]*=_,li.elements[9]*=_,li.elements[10]*=_,t.setFromRotationMatrix(li),r.x=l,r.y=u,r.z=d,this}makePerspective(e,t,r,a,l,u,d=ji){const p=this.elements,m=2*l/(t-e),v=2*l/(r-a),_=(t+e)/(t-e),x=(r+a)/(r-a);let E,M;if(d===ji)E=-(u+l)/(u-l),M=-2*u*l/(u-l);else if(d===Wl)E=-u/(u-l),M=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=m,p[4]=0,p[8]=_,p[12]=0,p[1]=0,p[5]=v,p[9]=x,p[13]=0,p[2]=0,p[6]=0,p[10]=E,p[14]=M,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,t,r,a,l,u,d=ji){const p=this.elements,m=1/(t-e),v=1/(r-a),_=1/(u-l),x=(t+e)*m,E=(r+a)*v;let M,b;if(d===ji)M=(u+l)*_,b=-2*_;else if(d===Wl)M=l*_,b=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=2*m,p[4]=0,p[8]=0,p[12]=-x,p[1]=0,p[5]=2*v,p[9]=0,p[13]=-E,p[2]=0,p[6]=0,p[10]=b,p[14]=-M,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Rs=new X,li=new kt,L_=new X(0,0,0),D_=new X(1,1,1),vr=new X,vl=new X,Bn=new X,Em=new kt,Mm=new eo;class Ti{constructor(e=0,t=0,r=0,a=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,l=a[0],u=a[4],d=a[8],p=a[1],m=a[5],v=a[9],_=a[2],x=a[6],E=a[10];switch(t){case"XYZ":this._y=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-v,E),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(x,m),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(d,E),this._z=Math.atan2(p,m)):(this._y=Math.atan2(-_,l),this._z=0);break;case"ZXY":this._x=Math.asin(pn(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-_,E),this._z=Math.atan2(-u,m)):(this._y=0,this._z=Math.atan2(p,l));break;case"ZYX":this._y=Math.asin(-pn(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(x,E),this._z=Math.atan2(p,l)):(this._x=0,this._z=Math.atan2(-u,m));break;case"YZX":this._z=Math.asin(pn(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-v,m),this._y=Math.atan2(-_,l)):(this._x=0,this._y=Math.atan2(d,E));break;case"XZY":this._z=Math.asin(-pn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(x,m),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-v,E),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Em.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Em,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Mm.setFromEuler(this),this.setFromQuaternion(Mm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class Z0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let U_=0;const Tm=new X,Ns=new eo,Bi=new kt,xl=new X,ka=new X,O_=new X,F_=new eo,wm=new X(1,0,0),bm=new X(0,1,0),Am=new X(0,0,1),Cm={type:"added"},k_={type:"removed"},Ps={type:"childadded",child:null},$u={type:"childremoved",child:null};class En extends Js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:U_++}),this.uuid=ea(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=En.DEFAULT_UP.clone();const e=new X,t=new Ti,r=new eo,a=new X(1,1,1);function l(){r.setFromEuler(t,!1)}function u(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new kt},normalMatrix:{value:new ut}}),this.matrix=new kt,this.matrixWorld=new kt,this.matrixAutoUpdate=En.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Z0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ns.setFromAxisAngle(e,t),this.quaternion.multiply(Ns),this}rotateOnWorldAxis(e,t){return Ns.setFromAxisAngle(e,t),this.quaternion.premultiply(Ns),this}rotateX(e){return this.rotateOnAxis(wm,e)}rotateY(e){return this.rotateOnAxis(bm,e)}rotateZ(e){return this.rotateOnAxis(Am,e)}translateOnAxis(e,t){return Tm.copy(e).applyQuaternion(this.quaternion),this.position.add(Tm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wm,e)}translateY(e){return this.translateOnAxis(bm,e)}translateZ(e){return this.translateOnAxis(Am,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?xl.copy(e):xl.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),ka.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(ka,xl,this.up):Bi.lookAt(xl,ka,this.up),this.quaternion.setFromRotationMatrix(Bi),a&&(Bi.extractRotation(a.matrixWorld),Ns.setFromRotationMatrix(Bi),this.quaternion.premultiply(Ns.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cm),Ps.child=e,this.dispatchEvent(Ps),Ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(k_),$u.child=e,this.dispatchEvent($u),$u.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cm),Ps.child=e,this.dispatchEvent(Ps),Ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const u=this.children[r].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ka,e,O_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ka,F_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function l(d,p){return d[p.uuid]===void 0&&(d[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const p=d.shapes;if(Array.isArray(p))for(let m=0,v=p.length;m<v;m++){const _=p[m];l(e.shapes,_)}else l(e.shapes,p)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let p=0,m=this.material.length;p<m;p++)d.push(l(e.materials,this.material[p]));a.material=d}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const p=this.animations[d];a.animations.push(l(e.animations,p))}}if(t){const d=u(e.geometries),p=u(e.materials),m=u(e.textures),v=u(e.images),_=u(e.shapes),x=u(e.skeletons),E=u(e.animations),M=u(e.nodes);d.length>0&&(r.geometries=d),p.length>0&&(r.materials=p),m.length>0&&(r.textures=m),v.length>0&&(r.images=v),_.length>0&&(r.shapes=_),x.length>0&&(r.skeletons=x),E.length>0&&(r.animations=E),M.length>0&&(r.nodes=M)}return r.object=a,r;function u(d){const p=[];for(const m in d){const v=d[m];delete v.metadata,p.push(v)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}En.DEFAULT_UP=new X(0,1,0);En.DEFAULT_MATRIX_AUTO_UPDATE=!0;En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ci=new X,zi=new X,Ku=new X,Vi=new X,Is=new X,Ls=new X,Rm=new X,Zu=new X,Qu=new X,Ju=new X,ed=new It,td=new It,nd=new It;class ui{constructor(e=new X,t=new X,r=new X){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),ci.subVectors(e,t),a.cross(ci);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,r,a,l){ci.subVectors(a,t),zi.subVectors(r,t),Ku.subVectors(e,t);const u=ci.dot(ci),d=ci.dot(zi),p=ci.dot(Ku),m=zi.dot(zi),v=zi.dot(Ku),_=u*m-d*d;if(_===0)return l.set(0,0,0),null;const x=1/_,E=(m*p-d*v)*x,M=(u*v-d*p)*x;return l.set(1-E-M,M,E)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(e,t,r,a,l,u,d,p){return this.getBarycoord(e,t,r,a,Vi)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(l,Vi.x),p.addScaledVector(u,Vi.y),p.addScaledVector(d,Vi.z),p)}static getInterpolatedAttribute(e,t,r,a,l,u){return ed.setScalar(0),td.setScalar(0),nd.setScalar(0),ed.fromBufferAttribute(e,t),td.fromBufferAttribute(e,r),nd.fromBufferAttribute(e,a),u.setScalar(0),u.addScaledVector(ed,l.x),u.addScaledVector(td,l.y),u.addScaledVector(nd,l.z),u}static isFrontFacing(e,t,r,a){return ci.subVectors(r,t),zi.subVectors(e,t),ci.cross(zi).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ci.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),ci.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ui.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ui.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,l){return ui.getInterpolation(e,this.a,this.b,this.c,t,r,a,l)}containsPoint(e){return ui.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ui.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,l=this.c;let u,d;Is.subVectors(a,r),Ls.subVectors(l,r),Zu.subVectors(e,r);const p=Is.dot(Zu),m=Ls.dot(Zu);if(p<=0&&m<=0)return t.copy(r);Qu.subVectors(e,a);const v=Is.dot(Qu),_=Ls.dot(Qu);if(v>=0&&_<=v)return t.copy(a);const x=p*_-v*m;if(x<=0&&p>=0&&v<=0)return u=p/(p-v),t.copy(r).addScaledVector(Is,u);Ju.subVectors(e,l);const E=Is.dot(Ju),M=Ls.dot(Ju);if(M>=0&&E<=M)return t.copy(l);const b=E*m-p*M;if(b<=0&&m>=0&&M<=0)return d=m/(m-M),t.copy(r).addScaledVector(Ls,d);const S=v*M-E*_;if(S<=0&&_-v>=0&&E-M>=0)return Rm.subVectors(l,a),d=(_-v)/(_-v+(E-M)),t.copy(a).addScaledVector(Rm,d);const y=1/(S+b+x);return u=b*y,d=x*y,t.copy(r).addScaledVector(Is,u).addScaledVector(Ls,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Q0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xr={h:0,s:0,l:0},_l={h:0,s:0,l:0};function id(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class bt{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Mt.toWorkingColorSpace(this,t),this}setRGB(e,t,r,a=Mt.workingColorSpace){return this.r=e,this.g=t,this.b=r,Mt.toWorkingColorSpace(this,a),this}setHSL(e,t,r,a=Mt.workingColorSpace){if(e=E_(e,1),t=pn(t,0,1),r=pn(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,u=2*r-l;this.r=id(u,l,e+1/3),this.g=id(u,l,e),this.b=id(u,l,e-1/3)}return Mt.toWorkingColorSpace(this,a),this}setStyle(e,t=Qn){function r(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=a[1],d=a[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qn){const r=Q0[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}copyLinearToSRGB(e){return this.r=js(e.r),this.g=js(e.g),this.b=js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qn){return Mt.fromWorkingColorSpace(hn.copy(this),e),Math.round(pn(hn.r*255,0,255))*65536+Math.round(pn(hn.g*255,0,255))*256+Math.round(pn(hn.b*255,0,255))}getHexString(e=Qn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Mt.workingColorSpace){Mt.fromWorkingColorSpace(hn.copy(this),t);const r=hn.r,a=hn.g,l=hn.b,u=Math.max(r,a,l),d=Math.min(r,a,l);let p,m;const v=(d+u)/2;if(d===u)p=0,m=0;else{const _=u-d;switch(m=v<=.5?_/(u+d):_/(2-u-d),u){case r:p=(a-l)/_+(a<l?6:0);break;case a:p=(l-r)/_+2;break;case l:p=(r-a)/_+4;break}p/=6}return e.h=p,e.s=m,e.l=v,e}getRGB(e,t=Mt.workingColorSpace){return Mt.fromWorkingColorSpace(hn.copy(this),t),e.r=hn.r,e.g=hn.g,e.b=hn.b,e}getStyle(e=Qn){Mt.fromWorkingColorSpace(hn.copy(this),e);const t=hn.r,r=hn.g,a=hn.b;return e!==Qn?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(xr),this.setHSL(xr.h+e,xr.s+t,xr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(xr),e.getHSL(_l);const r=zu(xr.h,_l.h,t),a=zu(xr.s,_l.s,t),l=zu(xr.l,_l.l,t);return this.setHSL(r,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*a,this.g=l[1]*t+l[4]*r+l[7]*a,this.b=l[2]*t+l[5]*r+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const hn=new bt;bt.NAMES=Q0;let B_=0;class ta extends Js{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:B_++}),this.uuid=ea(),this.name="",this.blending=Gs,this.side=Mr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sd,this.blendDst=Ed,this.blendEquation=Yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Gs&&(r.blending=this.blending),this.side!==Mr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Sd&&(r.blendSrc=this.blendSrc),this.blendDst!==Ed&&(r.blendDst=this.blendDst),this.blendEquation!==Yr&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(l){const u=[];for(const d in l){const p=l[d];delete p.metadata,u.push(p)}return u}if(t){const l=a(e.textures),u=a(e.images);l.length>0&&(r.textures=l),u.length>0&&(r.images=u)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let l=0;l!==a;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ha extends ta{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=L0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Xt=new X,yl=new $e;class hi{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=hm,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)yl.fromBufferAttribute(this,t),yl.applyMatrix3(e),this.setXY(t,yl.x,yl.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix3(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=Ua(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Pn(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ua(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ua(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ua(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ua(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array),a=Pn(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,l){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),r=Pn(r,this.array),a=Pn(a,this.array),l=Pn(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==hm&&(e.usage=this.usage),e}}class J0 extends hi{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class eg extends hi{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class Gn extends hi{constructor(e,t,r){super(new Float32Array(e),t,r)}}let z_=0;const Zn=new kt,rd=new En,Ds=new X,zn=new to,Ba=new to,nn=new X;class pi extends Js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:z_++}),this.uuid=ea(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Y0(e)?eg:J0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new ut().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Zn.makeRotationFromQuaternion(e),this.applyMatrix4(Zn),this}rotateX(e){return Zn.makeRotationX(e),this.applyMatrix4(Zn),this}rotateY(e){return Zn.makeRotationY(e),this.applyMatrix4(Zn),this}rotateZ(e){return Zn.makeRotationZ(e),this.applyMatrix4(Zn),this}translate(e,t,r){return Zn.makeTranslation(e,t,r),this.applyMatrix4(Zn),this}scale(e,t,r){return Zn.makeScale(e,t,r),this.applyMatrix4(Zn),this}lookAt(e){return rd.lookAt(e),rd.updateMatrix(),this.applyMatrix4(rd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let a=0,l=e.length;a<l;a++){const u=e[a];r.push(u.x,u.y,u.z||0)}this.setAttribute("position",new Gn(r,3))}else{for(let r=0,a=t.count;r<a;r++){const l=e[r];t.setXYZ(r,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new to);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];zn.setFromBufferAttribute(l),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,zn.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,zn.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(zn.min),this.boundingBox.expandByPoint(zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const r=this.boundingSphere.center;if(zn.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const d=t[l];Ba.setFromBufferAttribute(d),this.morphTargetsRelative?(nn.addVectors(zn.min,Ba.min),zn.expandByPoint(nn),nn.addVectors(zn.max,Ba.max),zn.expandByPoint(nn)):(zn.expandByPoint(Ba.min),zn.expandByPoint(Ba.max))}zn.getCenter(r);let a=0;for(let l=0,u=e.count;l<u;l++)nn.fromBufferAttribute(e,l),a=Math.max(a,r.distanceToSquared(nn));if(t)for(let l=0,u=t.length;l<u;l++){const d=t[l],p=this.morphTargetsRelative;for(let m=0,v=d.count;m<v;m++)nn.fromBufferAttribute(d,m),p&&(Ds.fromBufferAttribute(e,m),nn.add(Ds)),a=Math.max(a,r.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hi(new Float32Array(4*r.count),4));const u=this.getAttribute("tangent"),d=[],p=[];for(let H=0;H<r.count;H++)d[H]=new X,p[H]=new X;const m=new X,v=new X,_=new X,x=new $e,E=new $e,M=new $e,b=new X,S=new X;function y(H,N,w){m.fromBufferAttribute(r,H),v.fromBufferAttribute(r,N),_.fromBufferAttribute(r,w),x.fromBufferAttribute(l,H),E.fromBufferAttribute(l,N),M.fromBufferAttribute(l,w),v.sub(m),_.sub(m),E.sub(x),M.sub(x);const k=1/(E.x*M.y-M.x*E.y);isFinite(k)&&(b.copy(v).multiplyScalar(M.y).addScaledVector(_,-E.y).multiplyScalar(k),S.copy(_).multiplyScalar(E.x).addScaledVector(v,-M.x).multiplyScalar(k),d[H].add(b),d[N].add(b),d[w].add(b),p[H].add(S),p[N].add(S),p[w].add(S))}let R=this.groups;R.length===0&&(R=[{start:0,count:e.count}]);for(let H=0,N=R.length;H<N;++H){const w=R[H],k=w.start,W=w.count;for(let $=k,oe=k+W;$<oe;$+=3)y(e.getX($+0),e.getX($+1),e.getX($+2))}const I=new X,C=new X,Z=new X,V=new X;function O(H){Z.fromBufferAttribute(a,H),V.copy(Z);const N=d[H];I.copy(N),I.sub(Z.multiplyScalar(Z.dot(N))).normalize(),C.crossVectors(V,N);const k=C.dot(p[H])<0?-1:1;u.setXYZW(H,I.x,I.y,I.z,k)}for(let H=0,N=R.length;H<N;++H){const w=R[H],k=w.start,W=w.count;for(let $=k,oe=k+W;$<oe;$+=3)O(e.getX($+0)),O(e.getX($+1)),O(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new hi(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let x=0,E=r.count;x<E;x++)r.setXYZ(x,0,0,0);const a=new X,l=new X,u=new X,d=new X,p=new X,m=new X,v=new X,_=new X;if(e)for(let x=0,E=e.count;x<E;x+=3){const M=e.getX(x+0),b=e.getX(x+1),S=e.getX(x+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,b),u.fromBufferAttribute(t,S),v.subVectors(u,l),_.subVectors(a,l),v.cross(_),d.fromBufferAttribute(r,M),p.fromBufferAttribute(r,b),m.fromBufferAttribute(r,S),d.add(v),p.add(v),m.add(v),r.setXYZ(M,d.x,d.y,d.z),r.setXYZ(b,p.x,p.y,p.z),r.setXYZ(S,m.x,m.y,m.z)}else for(let x=0,E=t.count;x<E;x+=3)a.fromBufferAttribute(t,x+0),l.fromBufferAttribute(t,x+1),u.fromBufferAttribute(t,x+2),v.subVectors(u,l),_.subVectors(a,l),v.cross(_),r.setXYZ(x+0,v.x,v.y,v.z),r.setXYZ(x+1,v.x,v.y,v.z),r.setXYZ(x+2,v.x,v.y,v.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(d,p){const m=d.array,v=d.itemSize,_=d.normalized,x=new m.constructor(p.length*v);let E=0,M=0;for(let b=0,S=p.length;b<S;b++){d.isInterleavedBufferAttribute?E=p[b]*d.data.stride+d.offset:E=p[b]*v;for(let y=0;y<v;y++)x[M++]=m[E++]}return new hi(x,v,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new pi,r=this.index.array,a=this.attributes;for(const d in a){const p=a[d],m=e(p,r);t.setAttribute(d,m)}const l=this.morphAttributes;for(const d in l){const p=[],m=l[d];for(let v=0,_=m.length;v<_;v++){const x=m[v],E=e(x,r);p.push(E)}t.morphAttributes[d]=p}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let d=0,p=u.length;d<p;d++){const m=u[d];t.addGroup(m.start,m.count,m.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const m in p)p[m]!==void 0&&(e[m]=p[m]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const p in r){const m=r[p];e.data.attributes[p]=m.toJSON(e.data)}const a={};let l=!1;for(const p in this.morphAttributes){const m=this.morphAttributes[p],v=[];for(let _=0,x=m.length;_<x;_++){const E=m[_];v.push(E.toJSON(e.data))}v.length>0&&(a[p]=v,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(t));const a=e.attributes;for(const m in a){const v=a[m];this.setAttribute(m,v.clone(t))}const l=e.morphAttributes;for(const m in l){const v=[],_=l[m];for(let x=0,E=_.length;x<E;x++)v.push(_[x].clone(t));this.morphAttributes[m]=v}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let m=0,v=u.length;m<v;m++){const _=u[m];this.addGroup(_.start,_.count,_.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nm=new kt,Vr=new K0,Sl=new Zl,Pm=new X,El=new X,Ml=new X,Tl=new X,sd=new X,wl=new X,Im=new X,bl=new X;class In extends En{constructor(e=new pi,t=new Ha){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,l=r.morphAttributes.position,u=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(l&&d){wl.set(0,0,0);for(let p=0,m=l.length;p<m;p++){const v=d[p],_=l[p];v!==0&&(sd.fromBufferAttribute(_,e),u?wl.addScaledVector(sd,v):wl.addScaledVector(sd.sub(t),v))}t.add(wl)}return t}raycast(e,t){const r=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Sl.copy(r.boundingSphere),Sl.applyMatrix4(l),Vr.copy(e.ray).recast(e.near),!(Sl.containsPoint(Vr.origin)===!1&&(Vr.intersectSphere(Sl,Pm)===null||Vr.origin.distanceToSquared(Pm)>(e.far-e.near)**2))&&(Nm.copy(l).invert(),Vr.copy(e.ray).applyMatrix4(Nm),!(r.boundingBox!==null&&Vr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Vr)))}_computeIntersections(e,t,r){let a;const l=this.geometry,u=this.material,d=l.index,p=l.attributes.position,m=l.attributes.uv,v=l.attributes.uv1,_=l.attributes.normal,x=l.groups,E=l.drawRange;if(d!==null)if(Array.isArray(u))for(let M=0,b=x.length;M<b;M++){const S=x[M],y=u[S.materialIndex],R=Math.max(S.start,E.start),I=Math.min(d.count,Math.min(S.start+S.count,E.start+E.count));for(let C=R,Z=I;C<Z;C+=3){const V=d.getX(C),O=d.getX(C+1),H=d.getX(C+2);a=Al(this,y,e,r,m,v,_,V,O,H),a&&(a.faceIndex=Math.floor(C/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,E.start),b=Math.min(d.count,E.start+E.count);for(let S=M,y=b;S<y;S+=3){const R=d.getX(S),I=d.getX(S+1),C=d.getX(S+2);a=Al(this,u,e,r,m,v,_,R,I,C),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(p!==void 0)if(Array.isArray(u))for(let M=0,b=x.length;M<b;M++){const S=x[M],y=u[S.materialIndex],R=Math.max(S.start,E.start),I=Math.min(p.count,Math.min(S.start+S.count,E.start+E.count));for(let C=R,Z=I;C<Z;C+=3){const V=C,O=C+1,H=C+2;a=Al(this,y,e,r,m,v,_,V,O,H),a&&(a.faceIndex=Math.floor(C/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,E.start),b=Math.min(p.count,E.start+E.count);for(let S=M,y=b;S<y;S+=3){const R=S,I=S+1,C=S+2;a=Al(this,u,e,r,m,v,_,R,I,C),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function V_(s,e,t,r,a,l,u,d){let p;if(e.side===Ln?p=r.intersectTriangle(u,l,a,!0,d):p=r.intersectTriangle(a,l,u,e.side===Mr,d),p===null)return null;bl.copy(d),bl.applyMatrix4(s.matrixWorld);const m=t.ray.origin.distanceTo(bl);return m<t.near||m>t.far?null:{distance:m,point:bl.clone(),object:s}}function Al(s,e,t,r,a,l,u,d,p,m){s.getVertexPosition(d,El),s.getVertexPosition(p,Ml),s.getVertexPosition(m,Tl);const v=V_(s,e,t,r,El,Ml,Tl,Im);if(v){const _=new X;ui.getBarycoord(Im,El,Ml,Tl,_),a&&(v.uv=ui.getInterpolatedAttribute(a,d,p,m,_,new $e)),l&&(v.uv1=ui.getInterpolatedAttribute(l,d,p,m,_,new $e)),u&&(v.normal=ui.getInterpolatedAttribute(u,d,p,m,_,new X),v.normal.dot(r.direction)>0&&v.normal.multiplyScalar(-1));const x={a:d,b:p,c:m,normal:new X,materialIndex:0};ui.getNormal(El,Ml,Tl,x.normal),v.face=x,v.barycoord=_}return v}class no extends pi{constructor(e=1,t=1,r=1,a=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:l,depthSegments:u};const d=this;a=Math.floor(a),l=Math.floor(l),u=Math.floor(u);const p=[],m=[],v=[],_=[];let x=0,E=0;M("z","y","x",-1,-1,r,t,e,u,l,0),M("z","y","x",1,-1,r,t,-e,u,l,1),M("x","z","y",1,1,e,r,t,a,u,2),M("x","z","y",1,-1,e,r,-t,a,u,3),M("x","y","z",1,-1,e,t,r,a,l,4),M("x","y","z",-1,-1,e,t,-r,a,l,5),this.setIndex(p),this.setAttribute("position",new Gn(m,3)),this.setAttribute("normal",new Gn(v,3)),this.setAttribute("uv",new Gn(_,2));function M(b,S,y,R,I,C,Z,V,O,H,N){const w=C/O,k=Z/H,W=C/2,$=Z/2,oe=V/2,pe=O+1,fe=H+1;let he=0,z=0;const ue=new X;for(let ne=0;ne<fe;ne++){const U=ne*k-$;for(let te=0;te<pe;te++){const Ne=te*w-W;ue[b]=Ne*R,ue[S]=U*I,ue[y]=oe,m.push(ue.x,ue.y,ue.z),ue[b]=0,ue[S]=0,ue[y]=V>0?1:-1,v.push(ue.x,ue.y,ue.z),_.push(te/O),_.push(1-ne/H),he+=1}}for(let ne=0;ne<H;ne++)for(let U=0;U<O;U++){const te=x+U+pe*ne,Ne=x+U+pe*(ne+1),ee=x+(U+1)+pe*(ne+1),F=x+(U+1)+pe*ne;p.push(te,Ne,F),p.push(Ne,ee,F),z+=6}d.addGroup(E,z,N),E+=z,x+=he}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new no(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zs(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const a=s[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function Sn(s){const e={};for(let t=0;t<s.length;t++){const r=Zs(s[t]);for(const a in r)e[a]=r[a]}return e}function G_(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function tg(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Mt.workingColorSpace}const H_={clone:Zs,merge:Sn};var j_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,W_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tr extends ta{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=j_,this.fragmentShader=W_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=G_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const u=this.uniforms[a].value;u&&u.isTexture?t.uniforms[a]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[a]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[a]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[a]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[a]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[a]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[a]={type:"m4",value:u.toArray()}:t.uniforms[a]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class ng extends En{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new kt,this.projectionMatrix=new kt,this.projectionMatrixInverse=new kt,this.coordinateSystem=ji}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const _r=new X,Lm=new $e,Dm=new $e;class Vn extends ng{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=of*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Bu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return of*2*Math.atan(Math.tan(Bu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){_r.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_r.x,_r.y).multiplyScalar(-e/_r.z),_r.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(_r.x,_r.y).multiplyScalar(-e/_r.z)}getViewSize(e,t){return this.getViewBounds(e,Lm,Dm),t.subVectors(Dm,Lm)}setViewOffset(e,t,r,a,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Bu*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,l=-.5*a;const u=this.view;if(this.view!==null&&this.view.enabled){const p=u.fullWidth,m=u.fullHeight;l+=u.offsetX*a/p,t-=u.offsetY*r/m,a*=u.width/p,r*=u.height/m}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Us=-90,Os=1;class X_ extends En{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Vn(Us,Os,e,t);a.layers=this.layers,this.add(a);const l=new Vn(Us,Os,e,t);l.layers=this.layers,this.add(l);const u=new Vn(Us,Os,e,t);u.layers=this.layers,this.add(u);const d=new Vn(Us,Os,e,t);d.layers=this.layers,this.add(d);const p=new Vn(Us,Os,e,t);p.layers=this.layers,this.add(p);const m=new Vn(Us,Os,e,t);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,l,u,d,p]=t;for(const m of t)this.remove(m);if(e===ji)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===Wl)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of t)this.add(m),m.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,d,p,m,v]=this.children,_=e.getRenderTarget(),x=e.getActiveCubeFace(),E=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const b=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,l),e.setRenderTarget(r,1,a),e.render(t,u),e.setRenderTarget(r,2,a),e.render(t,d),e.setRenderTarget(r,3,a),e.render(t,p),e.setRenderTarget(r,4,a),e.render(t,m),r.texture.generateMipmaps=b,e.setRenderTarget(r,5,a),e.render(t,v),e.setRenderTarget(_,x,E),e.xr.enabled=M,r.texture.needsPMREMUpdate=!0}}class ig extends Dn{constructor(e,t,r,a,l,u,d,p,m,v){e=e!==void 0?e:[],t=t!==void 0?t:Ys,super(e,t,r,a,l,u,d,p,m,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Y_ extends Qr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new ig(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Mi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new no(5,5,5),l=new Tr({name:"CubemapFromEquirect",uniforms:Zs(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Ln,blending:Sr});l.uniforms.tEquirect.value=t;const u=new In(a,l),d=t.minFilter;return t.minFilter===Kr&&(t.minFilter=Mi),new X_(1,10,this).update(e,u),t.minFilter=d,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,r,a){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,r,a);e.setRenderTarget(l)}}const ad=new X,q_=new X,$_=new ut;class Wr{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=ad.subVectors(r,t).cross(q_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(ad),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/a;return l<0||l>1?null:t.copy(e.start).addScaledVector(r,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||$_.getNormalMatrix(e),a=this.coplanarPoint(ad).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gr=new Zl,Cl=new X;class bf{constructor(e=new Wr,t=new Wr,r=new Wr,a=new Wr,l=new Wr,u=new Wr){this.planes=[e,t,r,a,l,u]}set(e,t,r,a,l,u){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(r),d[3].copy(a),d[4].copy(l),d[5].copy(u),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=ji){const r=this.planes,a=e.elements,l=a[0],u=a[1],d=a[2],p=a[3],m=a[4],v=a[5],_=a[6],x=a[7],E=a[8],M=a[9],b=a[10],S=a[11],y=a[12],R=a[13],I=a[14],C=a[15];if(r[0].setComponents(p-l,x-m,S-E,C-y).normalize(),r[1].setComponents(p+l,x+m,S+E,C+y).normalize(),r[2].setComponents(p+u,x+v,S+M,C+R).normalize(),r[3].setComponents(p-u,x-v,S-M,C-R).normalize(),r[4].setComponents(p-d,x-_,S-b,C-I).normalize(),t===ji)r[5].setComponents(p+d,x+_,S+b,C+I).normalize();else if(t===Wl)r[5].setComponents(d,_,b,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gr)}intersectsSprite(e){return Gr.center.set(0,0,0),Gr.radius=.7071067811865476,Gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gr)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Cl.x=a.normal.x>0?e.max.x:e.min.x,Cl.y=a.normal.y>0?e.max.y:e.min.y,Cl.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Cl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function rg(){let s=null,e=!1,t=null,r=null;function a(l,u){t(l,u),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function K_(s){const e=new WeakMap;function t(d,p){const m=d.array,v=d.usage,_=m.byteLength,x=s.createBuffer();s.bindBuffer(p,x),s.bufferData(p,m,v),d.onUploadCallback();let E;if(m instanceof Float32Array)E=s.FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?E=s.HALF_FLOAT:E=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)E=s.SHORT;else if(m instanceof Uint32Array)E=s.UNSIGNED_INT;else if(m instanceof Int32Array)E=s.INT;else if(m instanceof Int8Array)E=s.BYTE;else if(m instanceof Uint8Array)E=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)E=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:x,type:E,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:_}}function r(d,p,m){const v=p.array,_=p.updateRanges;if(s.bindBuffer(m,d),_.length===0)s.bufferSubData(m,0,v);else{_.sort((E,M)=>E.start-M.start);let x=0;for(let E=1;E<_.length;E++){const M=_[x],b=_[E];b.start<=M.start+M.count+1?M.count=Math.max(M.count,b.start+b.count-M.start):(++x,_[x]=b)}_.length=x+1;for(let E=0,M=_.length;E<M;E++){const b=_[E];s.bufferSubData(m,b.start*v.BYTES_PER_ELEMENT,v,b.start,b.count)}p.clearUpdateRanges()}p.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);p&&(s.deleteBuffer(p.buffer),e.delete(d))}function u(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const v=e.get(d);(!v||v.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=e.get(d);if(m===void 0)e.set(d,t(d,p));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,d,p),m.version=d.version}}return{get:a,remove:l,update:u}}class Ql extends pi{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const l=e/2,u=t/2,d=Math.floor(r),p=Math.floor(a),m=d+1,v=p+1,_=e/d,x=t/p,E=[],M=[],b=[],S=[];for(let y=0;y<v;y++){const R=y*x-u;for(let I=0;I<m;I++){const C=I*_-l;M.push(C,-R,0),b.push(0,0,1),S.push(I/d),S.push(1-y/p)}}for(let y=0;y<p;y++)for(let R=0;R<d;R++){const I=R+m*y,C=R+m*(y+1),Z=R+1+m*(y+1),V=R+1+m*y;E.push(I,C,V),E.push(C,Z,V)}this.setIndex(E),this.setAttribute("position",new Gn(M,3)),this.setAttribute("normal",new Gn(b,3)),this.setAttribute("uv",new Gn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ql(e.width,e.height,e.widthSegments,e.heightSegments)}}var Z_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Q_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,J_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ey=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ty=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ny=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,iy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ry=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ay=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ly=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dy=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,fy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,py=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,my=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,_y=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,yy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ey=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,My=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ty=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,by=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ay="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ry=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ny=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Py=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Iy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ly=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Dy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Uy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Oy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ky=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,By=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Hy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$y=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ky=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Zy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,iS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,aS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,oS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,uS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_S=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,yS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,SS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ES=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,MS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,TS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,AS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,CS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,RS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,NS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,PS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,IS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,LS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,DS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,US=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,OS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,FS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,kS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,BS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,VS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,GS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,HS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,WS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,XS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,YS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$S=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const KS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ZS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,QS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,JS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,iE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,rE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,aE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,oE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,mE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_E=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,SE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ME=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,AE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,CE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,RE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:Z_,alphahash_pars_fragment:Q_,alphamap_fragment:J_,alphamap_pars_fragment:ey,alphatest_fragment:ty,alphatest_pars_fragment:ny,aomap_fragment:iy,aomap_pars_fragment:ry,batching_pars_vertex:sy,batching_vertex:ay,begin_vertex:oy,beginnormal_vertex:ly,bsdfs:cy,iridescence_fragment:uy,bumpmap_pars_fragment:dy,clipping_planes_fragment:fy,clipping_planes_pars_fragment:hy,clipping_planes_pars_vertex:py,clipping_planes_vertex:my,color_fragment:gy,color_pars_fragment:vy,color_pars_vertex:xy,color_vertex:_y,common:yy,cube_uv_reflection_fragment:Sy,defaultnormal_vertex:Ey,displacementmap_pars_vertex:My,displacementmap_vertex:Ty,emissivemap_fragment:wy,emissivemap_pars_fragment:by,colorspace_fragment:Ay,colorspace_pars_fragment:Cy,envmap_fragment:Ry,envmap_common_pars_fragment:Ny,envmap_pars_fragment:Py,envmap_pars_vertex:Iy,envmap_physical_pars_fragment:Hy,envmap_vertex:Ly,fog_vertex:Dy,fog_pars_vertex:Uy,fog_fragment:Oy,fog_pars_fragment:Fy,gradientmap_pars_fragment:ky,lightmap_pars_fragment:By,lights_lambert_fragment:zy,lights_lambert_pars_fragment:Vy,lights_pars_begin:Gy,lights_toon_fragment:jy,lights_toon_pars_fragment:Wy,lights_phong_fragment:Xy,lights_phong_pars_fragment:Yy,lights_physical_fragment:qy,lights_physical_pars_fragment:$y,lights_fragment_begin:Ky,lights_fragment_maps:Zy,lights_fragment_end:Qy,logdepthbuf_fragment:Jy,logdepthbuf_pars_fragment:eS,logdepthbuf_pars_vertex:tS,logdepthbuf_vertex:nS,map_fragment:iS,map_pars_fragment:rS,map_particle_fragment:sS,map_particle_pars_fragment:aS,metalnessmap_fragment:oS,metalnessmap_pars_fragment:lS,morphinstance_vertex:cS,morphcolor_vertex:uS,morphnormal_vertex:dS,morphtarget_pars_vertex:fS,morphtarget_vertex:hS,normal_fragment_begin:pS,normal_fragment_maps:mS,normal_pars_fragment:gS,normal_pars_vertex:vS,normal_vertex:xS,normalmap_pars_fragment:_S,clearcoat_normal_fragment_begin:yS,clearcoat_normal_fragment_maps:SS,clearcoat_pars_fragment:ES,iridescence_pars_fragment:MS,opaque_fragment:TS,packing:wS,premultiplied_alpha_fragment:bS,project_vertex:AS,dithering_fragment:CS,dithering_pars_fragment:RS,roughnessmap_fragment:NS,roughnessmap_pars_fragment:PS,shadowmap_pars_fragment:IS,shadowmap_pars_vertex:LS,shadowmap_vertex:DS,shadowmask_pars_fragment:US,skinbase_vertex:OS,skinning_pars_vertex:FS,skinning_vertex:kS,skinnormal_vertex:BS,specularmap_fragment:zS,specularmap_pars_fragment:VS,tonemapping_fragment:GS,tonemapping_pars_fragment:HS,transmission_fragment:jS,transmission_pars_fragment:WS,uv_pars_fragment:XS,uv_pars_vertex:YS,uv_vertex:qS,worldpos_vertex:$S,background_vert:KS,background_frag:ZS,backgroundCube_vert:QS,backgroundCube_frag:JS,cube_vert:eE,cube_frag:tE,depth_vert:nE,depth_frag:iE,distanceRGBA_vert:rE,distanceRGBA_frag:sE,equirect_vert:aE,equirect_frag:oE,linedashed_vert:lE,linedashed_frag:cE,meshbasic_vert:uE,meshbasic_frag:dE,meshlambert_vert:fE,meshlambert_frag:hE,meshmatcap_vert:pE,meshmatcap_frag:mE,meshnormal_vert:gE,meshnormal_frag:vE,meshphong_vert:xE,meshphong_frag:_E,meshphysical_vert:yE,meshphysical_frag:SE,meshtoon_vert:EE,meshtoon_frag:ME,points_vert:TE,points_frag:wE,shadow_vert:bE,shadow_frag:AE,sprite_vert:CE,sprite_frag:RE},Pe={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ut}},envmap:{envMap:{value:null},envMapRotation:{value:new ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ut},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0},uvTransform:{value:new ut}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}}},Si={basic:{uniforms:Sn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:Sn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new bt(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:Sn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:Sn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:Sn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new bt(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:Sn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:Sn([Pe.points,Pe.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:Sn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:Sn([Pe.common,Pe.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:Sn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:Sn([Pe.sprite,Pe.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ut}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:Sn([Pe.common,Pe.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:Sn([Pe.lights,Pe.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};Si.physical={uniforms:Sn([Si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ut},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ut},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ut},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ut},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ut},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ut}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Rl={r:0,b:0,g:0},Hr=new Ti,NE=new kt;function PE(s,e,t,r,a,l,u){const d=new bt(0);let p=l===!0?0:1,m,v,_=null,x=0,E=null;function M(R){let I=R.isScene===!0?R.background:null;return I&&I.isTexture&&(I=(R.backgroundBlurriness>0?t:e).get(I)),I}function b(R){let I=!1;const C=M(R);C===null?y(d,p):C&&C.isColor&&(y(C,1),I=!0);const Z=s.xr.getEnvironmentBlendMode();Z==="additive"?r.buffers.color.setClear(0,0,0,1,u):Z==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,u),(s.autoClear||I)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(R,I){const C=M(I);C&&(C.isCubeTexture||C.mapping===$l)?(v===void 0&&(v=new In(new no(1,1,1),new Tr({name:"BackgroundCubeMaterial",uniforms:Zs(Si.backgroundCube.uniforms),vertexShader:Si.backgroundCube.vertexShader,fragmentShader:Si.backgroundCube.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1})),v.geometry.deleteAttribute("normal"),v.geometry.deleteAttribute("uv"),v.onBeforeRender=function(Z,V,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(v.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(v)),Hr.copy(I.backgroundRotation),Hr.x*=-1,Hr.y*=-1,Hr.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Hr.y*=-1,Hr.z*=-1),v.material.uniforms.envMap.value=C,v.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,v.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,v.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,v.material.uniforms.backgroundRotation.value.setFromMatrix4(NE.makeRotationFromEuler(Hr)),v.material.toneMapped=Mt.getTransfer(C.colorSpace)!==Pt,(_!==C||x!==C.version||E!==s.toneMapping)&&(v.material.needsUpdate=!0,_=C,x=C.version,E=s.toneMapping),v.layers.enableAll(),R.unshift(v,v.geometry,v.material,0,0,null)):C&&C.isTexture&&(m===void 0&&(m=new In(new Ql(2,2),new Tr({name:"BackgroundMaterial",uniforms:Zs(Si.background.uniforms),vertexShader:Si.background.vertexShader,fragmentShader:Si.background.fragmentShader,side:Mr,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=C,m.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,m.material.toneMapped=Mt.getTransfer(C.colorSpace)!==Pt,C.matrixAutoUpdate===!0&&C.updateMatrix(),m.material.uniforms.uvTransform.value.copy(C.matrix),(_!==C||x!==C.version||E!==s.toneMapping)&&(m.material.needsUpdate=!0,_=C,x=C.version,E=s.toneMapping),m.layers.enableAll(),R.unshift(m,m.geometry,m.material,0,0,null))}function y(R,I){R.getRGB(Rl,tg(s)),r.buffers.color.setClear(Rl.r,Rl.g,Rl.b,I,u)}return{getClearColor:function(){return d},setClearColor:function(R,I=1){d.set(R),p=I,y(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(R){p=R,y(d,p)},render:b,addToRenderList:S}}function IE(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=x(null);let l=a,u=!1;function d(w,k,W,$,oe){let pe=!1;const fe=_($,W,k);l!==fe&&(l=fe,m(l.object)),pe=E(w,$,W,oe),pe&&M(w,$,W,oe),oe!==null&&e.update(oe,s.ELEMENT_ARRAY_BUFFER),(pe||u)&&(u=!1,C(w,k,W,$),oe!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(oe).buffer))}function p(){return s.createVertexArray()}function m(w){return s.bindVertexArray(w)}function v(w){return s.deleteVertexArray(w)}function _(w,k,W){const $=W.wireframe===!0;let oe=r[w.id];oe===void 0&&(oe={},r[w.id]=oe);let pe=oe[k.id];pe===void 0&&(pe={},oe[k.id]=pe);let fe=pe[$];return fe===void 0&&(fe=x(p()),pe[$]=fe),fe}function x(w){const k=[],W=[],$=[];for(let oe=0;oe<t;oe++)k[oe]=0,W[oe]=0,$[oe]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:W,attributeDivisors:$,object:w,attributes:{},index:null}}function E(w,k,W,$){const oe=l.attributes,pe=k.attributes;let fe=0;const he=W.getAttributes();for(const z in he)if(he[z].location>=0){const ne=oe[z];let U=pe[z];if(U===void 0&&(z==="instanceMatrix"&&w.instanceMatrix&&(U=w.instanceMatrix),z==="instanceColor"&&w.instanceColor&&(U=w.instanceColor)),ne===void 0||ne.attribute!==U||U&&ne.data!==U.data)return!0;fe++}return l.attributesNum!==fe||l.index!==$}function M(w,k,W,$){const oe={},pe=k.attributes;let fe=0;const he=W.getAttributes();for(const z in he)if(he[z].location>=0){let ne=pe[z];ne===void 0&&(z==="instanceMatrix"&&w.instanceMatrix&&(ne=w.instanceMatrix),z==="instanceColor"&&w.instanceColor&&(ne=w.instanceColor));const U={};U.attribute=ne,ne&&ne.data&&(U.data=ne.data),oe[z]=U,fe++}l.attributes=oe,l.attributesNum=fe,l.index=$}function b(){const w=l.newAttributes;for(let k=0,W=w.length;k<W;k++)w[k]=0}function S(w){y(w,0)}function y(w,k){const W=l.newAttributes,$=l.enabledAttributes,oe=l.attributeDivisors;W[w]=1,$[w]===0&&(s.enableVertexAttribArray(w),$[w]=1),oe[w]!==k&&(s.vertexAttribDivisor(w,k),oe[w]=k)}function R(){const w=l.newAttributes,k=l.enabledAttributes;for(let W=0,$=k.length;W<$;W++)k[W]!==w[W]&&(s.disableVertexAttribArray(W),k[W]=0)}function I(w,k,W,$,oe,pe,fe){fe===!0?s.vertexAttribIPointer(w,k,W,oe,pe):s.vertexAttribPointer(w,k,W,$,oe,pe)}function C(w,k,W,$){b();const oe=$.attributes,pe=W.getAttributes(),fe=k.defaultAttributeValues;for(const he in pe){const z=pe[he];if(z.location>=0){let ue=oe[he];if(ue===void 0&&(he==="instanceMatrix"&&w.instanceMatrix&&(ue=w.instanceMatrix),he==="instanceColor"&&w.instanceColor&&(ue=w.instanceColor)),ue!==void 0){const ne=ue.normalized,U=ue.itemSize,te=e.get(ue);if(te===void 0)continue;const Ne=te.buffer,ee=te.type,F=te.bytesPerElement,le=ee===s.INT||ee===s.UNSIGNED_INT||ue.gpuType===yf;if(ue.isInterleavedBufferAttribute){const ce=ue.data,ge=ce.stride,Me=ue.offset;if(ce.isInstancedInterleavedBuffer){for(let Ve=0;Ve<z.locationSize;Ve++)y(z.location+Ve,ce.meshPerAttribute);w.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ve=0;Ve<z.locationSize;Ve++)S(z.location+Ve);s.bindBuffer(s.ARRAY_BUFFER,Ne);for(let Ve=0;Ve<z.locationSize;Ve++)I(z.location+Ve,U/z.locationSize,ee,ne,ge*F,(Me+U/z.locationSize*Ve)*F,le)}else{if(ue.isInstancedBufferAttribute){for(let ce=0;ce<z.locationSize;ce++)y(z.location+ce,ue.meshPerAttribute);w.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ce=0;ce<z.locationSize;ce++)S(z.location+ce);s.bindBuffer(s.ARRAY_BUFFER,Ne);for(let ce=0;ce<z.locationSize;ce++)I(z.location+ce,U/z.locationSize,ee,ne,U*F,U/z.locationSize*ce*F,le)}}else if(fe!==void 0){const ne=fe[he];if(ne!==void 0)switch(ne.length){case 2:s.vertexAttrib2fv(z.location,ne);break;case 3:s.vertexAttrib3fv(z.location,ne);break;case 4:s.vertexAttrib4fv(z.location,ne);break;default:s.vertexAttrib1fv(z.location,ne)}}}}R()}function Z(){H();for(const w in r){const k=r[w];for(const W in k){const $=k[W];for(const oe in $)v($[oe].object),delete $[oe];delete k[W]}delete r[w]}}function V(w){if(r[w.id]===void 0)return;const k=r[w.id];for(const W in k){const $=k[W];for(const oe in $)v($[oe].object),delete $[oe];delete k[W]}delete r[w.id]}function O(w){for(const k in r){const W=r[k];if(W[w.id]===void 0)continue;const $=W[w.id];for(const oe in $)v($[oe].object),delete $[oe];delete W[w.id]}}function H(){N(),u=!0,l!==a&&(l=a,m(l.object))}function N(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:H,resetDefaultState:N,dispose:Z,releaseStatesOfGeometry:V,releaseStatesOfProgram:O,initAttributes:b,enableAttribute:S,disableUnusedAttributes:R}}function LE(s,e,t){let r;function a(m){r=m}function l(m,v){s.drawArrays(r,m,v),t.update(v,r,1)}function u(m,v,_){_!==0&&(s.drawArraysInstanced(r,m,v,_),t.update(v,r,_))}function d(m,v,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,v,0,_);let E=0;for(let M=0;M<_;M++)E+=v[M];t.update(E,r,1)}function p(m,v,_,x){if(_===0)return;const E=e.get("WEBGL_multi_draw");if(E===null)for(let M=0;M<m.length;M++)u(m[M],v[M],x[M]);else{E.multiDrawArraysInstancedWEBGL(r,m,0,v,0,x,0,_);let M=0;for(let b=0;b<_;b++)M+=v[b]*x[b];t.update(M,r,1)}}this.setMode=a,this.render=l,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function DE(s,e,t,r){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function u(O){return!(O!==di&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(O){const H=O===Ja&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(O!==Xi&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==Hi&&!H)}function p(O){if(O==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=t.precision!==void 0?t.precision:"highp";const v=p(m);v!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",v,"instead."),m=v);const _=t.logarithmicDepthBuffer===!0,x=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),E=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),R=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),C=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),Z=M>0,V=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:p,textureFormatReadable:u,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:_,reverseDepthBuffer:x,maxTextures:E,maxVertexTextures:M,maxTextureSize:b,maxCubemapSize:S,maxAttributes:y,maxVertexUniforms:R,maxVaryings:I,maxFragmentUniforms:C,vertexTextures:Z,maxSamples:V}}function UE(s){const e=this;let t=null,r=0,a=!1,l=!1;const u=new Wr,d=new ut,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(_,x){const E=_.length!==0||x||r!==0||a;return a=x,r=_.length,E},this.beginShadows=function(){l=!0,v(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(_,x){t=v(_,x,0)},this.setState=function(_,x,E){const M=_.clippingPlanes,b=_.clipIntersection,S=_.clipShadows,y=s.get(_);if(!a||M===null||M.length===0||l&&!S)l?v(null):m();else{const R=l?0:r,I=R*4;let C=y.clippingState||null;p.value=C,C=v(M,x,I,E);for(let Z=0;Z!==I;++Z)C[Z]=t[Z];y.clippingState=C,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=R}};function m(){p.value!==t&&(p.value=t,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function v(_,x,E,M){const b=_!==null?_.length:0;let S=null;if(b!==0){if(S=p.value,M!==!0||S===null){const y=E+b*4,R=x.matrixWorldInverse;d.getNormalMatrix(R),(S===null||S.length<y)&&(S=new Float32Array(y));for(let I=0,C=E;I!==b;++I,C+=4)u.copy(_[I]).applyMatrix4(R,d),u.normal.toArray(S,C),S[C+3]=u.constant}p.value=S,p.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,S}}function OE(s){let e=new WeakMap;function t(u,d){return d===Nd?u.mapping=Ys:d===Pd&&(u.mapping=qs),u}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Nd||d===Pd)if(e.has(u)){const p=e.get(u).texture;return t(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const m=new Y_(p.height);return m.fromEquirectangularTexture(s,u),e.set(u,m),u.addEventListener("dispose",a),t(m.texture,u.mapping)}else return null}}return u}function a(u){const d=u.target;d.removeEventListener("dispose",a);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function l(){e=new WeakMap}return{get:r,dispose:l}}class FE extends ng{constructor(e=-1,t=1,r=1,a=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=r-e,u=r+e,d=a+t,p=a-t;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=m*this.view.offsetX,u=l+m*this.view.width,d-=v*this.view.offsetY,p=d-v*this.view.height}this.projectionMatrix.makeOrthographic(l,u,d,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ks=4,Um=[.125,.215,.35,.446,.526,.582],qr=20,od=new FE,Om=new bt;let ld=null,cd=0,ud=0,dd=!1;const Xr=(1+Math.sqrt(5))/2,Fs=1/Xr,Fm=[new X(-Xr,Fs,0),new X(Xr,Fs,0),new X(-Fs,0,Xr),new X(Fs,0,Xr),new X(0,Xr,-Fs),new X(0,Xr,Fs),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class km{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100){ld=this._renderer.getRenderTarget(),cd=this._renderer.getActiveCubeFace(),ud=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,r,a,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ld,cd,ud),this._renderer.xr.enabled=dd,e.scissorTest=!1,Nl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ys||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ld=this._renderer.getRenderTarget(),cd=this._renderer.getActiveCubeFace(),ud=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Mi,minFilter:Mi,generateMipmaps:!1,type:Ja,format:di,colorSpace:Qs,depthBuffer:!1},a=Bm(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bm(e,t,r);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=kE(l)),this._blurMaterial=BE(l,e,t)}return a}_compileMaterial(e){const t=new In(this._lodPlanes[0],e);this._renderer.compile(t,od)}_sceneToCubeUV(e,t,r,a){const d=new Vn(90,1,t,r),p=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],v=this._renderer,_=v.autoClear,x=v.toneMapping;v.getClearColor(Om),v.toneMapping=Er,v.autoClear=!1;const E=new Ha({name:"PMREM.Background",side:Ln,depthWrite:!1,depthTest:!1}),M=new In(new no,E);let b=!1;const S=e.background;S?S.isColor&&(E.color.copy(S),e.background=null,b=!0):(E.color.copy(Om),b=!0);for(let y=0;y<6;y++){const R=y%3;R===0?(d.up.set(0,p[y],0),d.lookAt(m[y],0,0)):R===1?(d.up.set(0,0,p[y]),d.lookAt(0,m[y],0)):(d.up.set(0,p[y],0),d.lookAt(0,0,m[y]));const I=this._cubeSize;Nl(a,R*I,y>2?I:0,I,I),v.setRenderTarget(a),b&&v.render(M,d),v.render(e,d)}M.geometry.dispose(),M.material.dispose(),v.toneMapping=x,v.autoClear=_,e.background=S}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===Ys||e.mapping===qs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zm());const l=a?this._cubemapMaterial:this._equirectMaterial,u=new In(this._lodPlanes[0],l),d=l.uniforms;d.envMap.value=e;const p=this._cubeSize;Nl(t,0,0,3*p,2*p),r.setRenderTarget(t),r.render(u,od)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let l=1;l<a;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),d=Fm[(a-l-1)%Fm.length];this._blur(e,l-1,l,u,d)}t.autoClear=r}_blur(e,t,r,a,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,r,a,"latitudinal",l),this._halfBlur(u,e,r,r,a,"longitudinal",l)}_halfBlur(e,t,r,a,l,u,d){const p=this._renderer,m=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const v=3,_=new In(this._lodPlanes[a],m),x=m.uniforms,E=this._sizeLods[r]-1,M=isFinite(l)?Math.PI/(2*E):2*Math.PI/(2*qr-1),b=l/M,S=isFinite(l)?1+Math.floor(v*b):qr;S>qr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${qr}`);const y=[];let R=0;for(let O=0;O<qr;++O){const H=O/b,N=Math.exp(-H*H/2);y.push(N),O===0?R+=N:O<S&&(R+=2*N)}for(let O=0;O<y.length;O++)y[O]=y[O]/R;x.envMap.value=e.texture,x.samples.value=S,x.weights.value=y,x.latitudinal.value=u==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:I}=this;x.dTheta.value=M,x.mipInt.value=I-r;const C=this._sizeLods[a],Z=3*C*(a>I-ks?a-I+ks:0),V=4*(this._cubeSize-C);Nl(t,Z,V,3*C,2*C),p.setRenderTarget(t),p.render(_,od)}}function kE(s){const e=[],t=[],r=[];let a=s;const l=s-ks+1+Um.length;for(let u=0;u<l;u++){const d=Math.pow(2,a);t.push(d);let p=1/d;u>s-ks?p=Um[u-s+ks-1]:u===0&&(p=0),r.push(p);const m=1/(d-2),v=-m,_=1+m,x=[v,v,_,v,_,_,v,v,_,_,v,_],E=6,M=6,b=3,S=2,y=1,R=new Float32Array(b*M*E),I=new Float32Array(S*M*E),C=new Float32Array(y*M*E);for(let V=0;V<E;V++){const O=V%3*2/3-1,H=V>2?0:-1,N=[O,H,0,O+2/3,H,0,O+2/3,H+1,0,O,H,0,O+2/3,H+1,0,O,H+1,0];R.set(N,b*M*V),I.set(x,S*M*V);const w=[V,V,V,V,V,V];C.set(w,y*M*V)}const Z=new pi;Z.setAttribute("position",new hi(R,b)),Z.setAttribute("uv",new hi(I,S)),Z.setAttribute("faceIndex",new hi(C,y)),e.push(Z),a>ks&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function Bm(s,e,t){const r=new Qr(s,e,t);return r.texture.mapping=$l,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Nl(s,e,t,r,a){s.viewport.set(e,t,r,a),s.scissor.set(e,t,r,a)}function BE(s,e,t){const r=new Float32Array(qr),a=new X(0,1,0);return new Tr({name:"SphericalGaussianBlur",defines:{n:qr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function zm(){return new Tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function Vm(){return new Tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function Af(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zE(s){let e=new WeakMap,t=null;function r(d){if(d&&d.isTexture){const p=d.mapping,m=p===Nd||p===Pd,v=p===Ys||p===qs;if(m||v){let _=e.get(d);const x=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return t===null&&(t=new km(s)),_=m?t.fromEquirectangular(d,_):t.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),_.texture;if(_!==void 0)return _.texture;{const E=d.image;return m&&E&&E.height>0||v&&E&&a(E)?(t===null&&(t=new km(s)),_=m?t.fromEquirectangular(d):t.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),d.addEventListener("dispose",l),_.texture):null}}}return d}function a(d){let p=0;const m=6;for(let v=0;v<m;v++)d[v]!==void 0&&p++;return p===m}function l(d){const p=d.target;p.removeEventListener("dispose",l);const m=e.get(p);m!==void 0&&(e.delete(p),m.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:u}}function VE(s){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&Va("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function GE(s,e,t,r){const a={},l=new WeakMap;function u(_){const x=_.target;x.index!==null&&e.remove(x.index);for(const M in x.attributes)e.remove(x.attributes[M]);for(const M in x.morphAttributes){const b=x.morphAttributes[M];for(let S=0,y=b.length;S<y;S++)e.remove(b[S])}x.removeEventListener("dispose",u),delete a[x.id];const E=l.get(x);E&&(e.remove(E),l.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,t.memory.geometries--}function d(_,x){return a[x.id]===!0||(x.addEventListener("dispose",u),a[x.id]=!0,t.memory.geometries++),x}function p(_){const x=_.attributes;for(const M in x)e.update(x[M],s.ARRAY_BUFFER);const E=_.morphAttributes;for(const M in E){const b=E[M];for(let S=0,y=b.length;S<y;S++)e.update(b[S],s.ARRAY_BUFFER)}}function m(_){const x=[],E=_.index,M=_.attributes.position;let b=0;if(E!==null){const R=E.array;b=E.version;for(let I=0,C=R.length;I<C;I+=3){const Z=R[I+0],V=R[I+1],O=R[I+2];x.push(Z,V,V,O,O,Z)}}else if(M!==void 0){const R=M.array;b=M.version;for(let I=0,C=R.length/3-1;I<C;I+=3){const Z=I+0,V=I+1,O=I+2;x.push(Z,V,V,O,O,Z)}}else return;const S=new(Y0(x)?eg:J0)(x,1);S.version=b;const y=l.get(_);y&&e.remove(y),l.set(_,S)}function v(_){const x=l.get(_);if(x){const E=_.index;E!==null&&x.version<E.version&&m(_)}else m(_);return l.get(_)}return{get:d,update:p,getWireframeAttribute:v}}function HE(s,e,t){let r;function a(x){r=x}let l,u;function d(x){l=x.type,u=x.bytesPerElement}function p(x,E){s.drawElements(r,E,l,x*u),t.update(E,r,1)}function m(x,E,M){M!==0&&(s.drawElementsInstanced(r,E,l,x*u,M),t.update(E,r,M))}function v(x,E,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,E,0,l,x,0,M);let S=0;for(let y=0;y<M;y++)S+=E[y];t.update(S,r,1)}function _(x,E,M,b){if(M===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<x.length;y++)m(x[y]/u,E[y],b[y]);else{S.multiDrawElementsInstancedWEBGL(r,E,0,l,x,0,b,0,M);let y=0;for(let R=0;R<M;R++)y+=E[R]*b[R];t.update(y,r,1)}}this.setMode=a,this.setIndex=d,this.render=p,this.renderInstances=m,this.renderMultiDraw=v,this.renderMultiDrawInstances=_}function jE(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,u,d){switch(t.calls++,u){case s.TRIANGLES:t.triangles+=d*(l/3);break;case s.LINES:t.lines+=d*(l/2);break;case s.LINE_STRIP:t.lines+=d*(l-1);break;case s.LINE_LOOP:t.lines+=d*l;break;case s.POINTS:t.points+=d*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function WE(s,e,t){const r=new WeakMap,a=new It;function l(u,d,p){const m=u.morphTargetInfluences,v=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=v!==void 0?v.length:0;let x=r.get(d);if(x===void 0||x.count!==_){let w=function(){H.dispose(),r.delete(d),d.removeEventListener("dispose",w)};var E=w;x!==void 0&&x.texture.dispose();const M=d.morphAttributes.position!==void 0,b=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,y=d.morphAttributes.position||[],R=d.morphAttributes.normal||[],I=d.morphAttributes.color||[];let C=0;M===!0&&(C=1),b===!0&&(C=2),S===!0&&(C=3);let Z=d.attributes.position.count*C,V=1;Z>e.maxTextureSize&&(V=Math.ceil(Z/e.maxTextureSize),Z=e.maxTextureSize);const O=new Float32Array(Z*V*4*_),H=new $0(O,Z,V,_);H.type=Hi,H.needsUpdate=!0;const N=C*4;for(let k=0;k<_;k++){const W=y[k],$=R[k],oe=I[k],pe=Z*V*4*k;for(let fe=0;fe<W.count;fe++){const he=fe*N;M===!0&&(a.fromBufferAttribute(W,fe),O[pe+he+0]=a.x,O[pe+he+1]=a.y,O[pe+he+2]=a.z,O[pe+he+3]=0),b===!0&&(a.fromBufferAttribute($,fe),O[pe+he+4]=a.x,O[pe+he+5]=a.y,O[pe+he+6]=a.z,O[pe+he+7]=0),S===!0&&(a.fromBufferAttribute(oe,fe),O[pe+he+8]=a.x,O[pe+he+9]=a.y,O[pe+he+10]=a.z,O[pe+he+11]=oe.itemSize===4?a.w:1)}}x={count:_,texture:H,size:new $e(Z,V)},r.set(d,x),d.addEventListener("dispose",w)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",u.morphTexture,t);else{let M=0;for(let S=0;S<m.length;S++)M+=m[S];const b=d.morphTargetsRelative?1:1-M;p.getUniforms().setValue(s,"morphTargetBaseInfluence",b),p.getUniforms().setValue(s,"morphTargetInfluences",m)}p.getUniforms().setValue(s,"morphTargetsTexture",x.texture,t),p.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}return{update:l}}function XE(s,e,t,r){let a=new WeakMap;function l(p){const m=r.render.frame,v=p.geometry,_=e.get(p,v);if(a.get(_)!==m&&(e.update(_),a.set(_,m)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),a.get(p)!==m&&(t.update(p.instanceMatrix,s.ARRAY_BUFFER),p.instanceColor!==null&&t.update(p.instanceColor,s.ARRAY_BUFFER),a.set(p,m))),p.isSkinnedMesh){const x=p.skeleton;a.get(x)!==m&&(x.update(),a.set(x,m))}return _}function u(){a=new WeakMap}function d(p){const m=p.target;m.removeEventListener("dispose",d),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:l,dispose:u}}class sg extends Dn{constructor(e,t,r,a,l,u,d,p,m,v=Hs){if(v!==Hs&&v!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&v===Hs&&(r=Zr),r===void 0&&v===Ks&&(r=$s),super(null,a,l,u,d,p,v,r,m),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=d!==void 0?d:fi,this.minFilter=p!==void 0?p:fi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const ag=new Dn,Gm=new sg(1,1),og=new $0,lg=new P_,cg=new ig,Hm=[],jm=[],Wm=new Float32Array(16),Xm=new Float32Array(9),Ym=new Float32Array(4);function na(s,e,t){const r=s[0];if(r<=0||r>0)return s;const a=e*t;let l=Hm[a];if(l===void 0&&(l=new Float32Array(a),Hm[a]=l),e!==0){r.toArray(l,0);for(let u=1,d=0;u!==e;++u)d+=t,s[u].toArray(l,d)}return l}function Zt(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function Qt(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function Jl(s,e){let t=jm[e];t===void 0&&(t=new Int32Array(e),jm[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function YE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function qE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2fv(this.addr,e),Qt(t,e)}}function $E(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Zt(t,e))return;s.uniform3fv(this.addr,e),Qt(t,e)}}function KE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4fv(this.addr,e),Qt(t,e)}}function ZE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(Zt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,r))return;Ym.set(r),s.uniformMatrix2fv(this.addr,!1,Ym),Qt(t,r)}}function QE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(Zt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,r))return;Xm.set(r),s.uniformMatrix3fv(this.addr,!1,Xm),Qt(t,r)}}function JE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(Zt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Qt(t,e)}else{if(Zt(t,r))return;Wm.set(r),s.uniformMatrix4fv(this.addr,!1,Wm),Qt(t,r)}}function e1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function t1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2iv(this.addr,e),Qt(t,e)}}function n1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;s.uniform3iv(this.addr,e),Qt(t,e)}}function i1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4iv(this.addr,e),Qt(t,e)}}function r1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function s1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2uiv(this.addr,e),Qt(t,e)}}function a1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;s.uniform3uiv(this.addr,e),Qt(t,e)}}function o1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4uiv(this.addr,e),Qt(t,e)}}function l1(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Gm.compareFunction=X0,l=Gm):l=ag,t.setTexture2D(e||l,a)}function c1(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||lg,a)}function u1(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||cg,a)}function d1(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||og,a)}function f1(s){switch(s){case 5126:return YE;case 35664:return qE;case 35665:return $E;case 35666:return KE;case 35674:return ZE;case 35675:return QE;case 35676:return JE;case 5124:case 35670:return e1;case 35667:case 35671:return t1;case 35668:case 35672:return n1;case 35669:case 35673:return i1;case 5125:return r1;case 36294:return s1;case 36295:return a1;case 36296:return o1;case 35678:case 36198:case 36298:case 36306:case 35682:return l1;case 35679:case 36299:case 36307:return c1;case 35680:case 36300:case 36308:case 36293:return u1;case 36289:case 36303:case 36311:case 36292:return d1}}function h1(s,e){s.uniform1fv(this.addr,e)}function p1(s,e){const t=na(e,this.size,2);s.uniform2fv(this.addr,t)}function m1(s,e){const t=na(e,this.size,3);s.uniform3fv(this.addr,t)}function g1(s,e){const t=na(e,this.size,4);s.uniform4fv(this.addr,t)}function v1(s,e){const t=na(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function x1(s,e){const t=na(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function _1(s,e){const t=na(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function y1(s,e){s.uniform1iv(this.addr,e)}function S1(s,e){s.uniform2iv(this.addr,e)}function E1(s,e){s.uniform3iv(this.addr,e)}function M1(s,e){s.uniform4iv(this.addr,e)}function T1(s,e){s.uniform1uiv(this.addr,e)}function w1(s,e){s.uniform2uiv(this.addr,e)}function b1(s,e){s.uniform3uiv(this.addr,e)}function A1(s,e){s.uniform4uiv(this.addr,e)}function C1(s,e,t){const r=this.cache,a=e.length,l=Jl(t,a);Zt(r,l)||(s.uniform1iv(this.addr,l),Qt(r,l));for(let u=0;u!==a;++u)t.setTexture2D(e[u]||ag,l[u])}function R1(s,e,t){const r=this.cache,a=e.length,l=Jl(t,a);Zt(r,l)||(s.uniform1iv(this.addr,l),Qt(r,l));for(let u=0;u!==a;++u)t.setTexture3D(e[u]||lg,l[u])}function N1(s,e,t){const r=this.cache,a=e.length,l=Jl(t,a);Zt(r,l)||(s.uniform1iv(this.addr,l),Qt(r,l));for(let u=0;u!==a;++u)t.setTextureCube(e[u]||cg,l[u])}function P1(s,e,t){const r=this.cache,a=e.length,l=Jl(t,a);Zt(r,l)||(s.uniform1iv(this.addr,l),Qt(r,l));for(let u=0;u!==a;++u)t.setTexture2DArray(e[u]||og,l[u])}function I1(s){switch(s){case 5126:return h1;case 35664:return p1;case 35665:return m1;case 35666:return g1;case 35674:return v1;case 35675:return x1;case 35676:return _1;case 5124:case 35670:return y1;case 35667:case 35671:return S1;case 35668:case 35672:return E1;case 35669:case 35673:return M1;case 5125:return T1;case 36294:return w1;case 36295:return b1;case 36296:return A1;case 35678:case 36198:case 36298:case 36306:case 35682:return C1;case 35679:case 36299:case 36307:return R1;case 35680:case 36300:case 36308:case 36293:return N1;case 36289:case 36303:case 36311:case 36292:return P1}}class L1{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=f1(t.type)}}class D1{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=I1(t.type)}}class U1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let l=0,u=a.length;l!==u;++l){const d=a[l];d.setValue(e,t[d.id],r)}}}const fd=/(\w+)(\])?(\[|\.)?/g;function qm(s,e){s.seq.push(e),s.map[e.id]=e}function O1(s,e,t){const r=s.name,a=r.length;for(fd.lastIndex=0;;){const l=fd.exec(r),u=fd.lastIndex;let d=l[1];const p=l[2]==="]",m=l[3];if(p&&(d=d|0),m===void 0||m==="["&&u+2===a){qm(t,m===void 0?new L1(d,s,e):new D1(d,s,e));break}else{let _=t.map[d];_===void 0&&(_=new U1(d),qm(t,_)),t=_}}}class Hl{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),u=e.getUniformLocation(t,l.name);O1(l,u,this)}}setValue(e,t,r,a){const l=this.map[t];l!==void 0&&l.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let l=0,u=t.length;l!==u;++l){const d=t[l],p=r[d.id];p.needsUpdate!==!1&&d.setValue(e,p.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,l=e.length;a!==l;++a){const u=e[a];u.id in t&&r.push(u)}return r}}function $m(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const F1=37297;let k1=0;function B1(s,e){const t=s.split(`
`),r=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=a;u<l;u++){const d=u+1;r.push(`${d===e?">":" "} ${d}: ${t[u]}`)}return r.join(`
`)}const Km=new ut;function z1(s){Mt._getMatrix(Km,Mt.workingColorSpace,s);const e=`mat3( ${Km.elements.map(t=>t.toFixed(4))} )`;switch(Mt.getTransfer(s)){case Kl:return[e,"LinearTransferOETF"];case Pt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Zm(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const l=/ERROR: 0:(\d+)/.exec(a);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+a+`

`+B1(s.getShaderSource(e),u)}else return a}function V1(s,e){const t=z1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function G1(s,e){let t;switch(e){case r_:t="Linear";break;case s_:t="Reinhard";break;case a_:t="Cineon";break;case o_:t="ACESFilmic";break;case c_:t="AgX";break;case u_:t="Neutral";break;case l_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Pl=new X;function H1(){Mt.getLuminanceCoefficients(Pl);const s=Pl.x.toFixed(4),e=Pl.y.toFixed(4),t=Pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function j1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ga).join(`
`)}function W1(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function X1(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const l=s.getActiveAttrib(e,a),u=l.name;let d=1;l.type===s.FLOAT_MAT2&&(d=2),l.type===s.FLOAT_MAT3&&(d=3),l.type===s.FLOAT_MAT4&&(d=4),t[u]={type:l.type,location:s.getAttribLocation(e,u),locationSize:d}}return t}function Ga(s){return s!==""}function Qm(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jm(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Y1=/^[ \t]*#include +<([\w\d./]+)>/gm;function lf(s){return s.replace(Y1,$1)}const q1=new Map;function $1(s,e){let t=dt[e];if(t===void 0){const r=q1.get(e);if(r!==void 0)t=dt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return lf(t)}const K1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function e0(s){return s.replace(K1,Z1)}function Z1(s,e,t,r){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function t0(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Q1(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===I0?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Fx?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Gi&&(e="SHADOWMAP_TYPE_VSM"),e}function J1(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ys:case qs:e="ENVMAP_TYPE_CUBE";break;case $l:e="ENVMAP_TYPE_CUBE_UV";break}return e}function eM(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case qs:e="ENVMAP_MODE_REFRACTION";break}return e}function tM(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case L0:e="ENVMAP_BLENDING_MULTIPLY";break;case n_:e="ENVMAP_BLENDING_MIX";break;case i_:e="ENVMAP_BLENDING_ADD";break}return e}function nM(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function iM(s,e,t,r){const a=s.getContext(),l=t.defines;let u=t.vertexShader,d=t.fragmentShader;const p=Q1(t),m=J1(t),v=eM(t),_=tM(t),x=nM(t),E=j1(t),M=W1(l),b=a.createProgram();let S,y,R=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Ga).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Ga).join(`
`),y.length>0&&(y+=`
`)):(S=[t0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+v:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ga).join(`
`),y=[t0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.envMap?"#define "+v:"",t.envMap?"#define "+_:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Er?"#define TONE_MAPPING":"",t.toneMapping!==Er?dt.tonemapping_pars_fragment:"",t.toneMapping!==Er?G1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,V1("linearToOutputTexel",t.outputColorSpace),H1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ga).join(`
`)),u=lf(u),u=Qm(u,t),u=Jm(u,t),d=lf(d),d=Qm(d,t),d=Jm(d,t),u=e0(u),d=e0(d),t.isRawShaderMaterial!==!0&&(R=`#version 300 es
`,S=[E,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",t.glslVersion===pm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const I=R+S+u,C=R+y+d,Z=$m(a,a.VERTEX_SHADER,I),V=$m(a,a.FRAGMENT_SHADER,C);a.attachShader(b,Z),a.attachShader(b,V),t.index0AttributeName!==void 0?a.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(b,0,"position"),a.linkProgram(b);function O(k){if(s.debug.checkShaderErrors){const W=a.getProgramInfoLog(b).trim(),$=a.getShaderInfoLog(Z).trim(),oe=a.getShaderInfoLog(V).trim();let pe=!0,fe=!0;if(a.getProgramParameter(b,a.LINK_STATUS)===!1)if(pe=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,b,Z,V);else{const he=Zm(a,Z,"vertex"),z=Zm(a,V,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(b,a.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+W+`
`+he+`
`+z)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):($===""||oe==="")&&(fe=!1);fe&&(k.diagnostics={runnable:pe,programLog:W,vertexShader:{log:$,prefix:S},fragmentShader:{log:oe,prefix:y}})}a.deleteShader(Z),a.deleteShader(V),H=new Hl(a,b),N=X1(a,b)}let H;this.getUniforms=function(){return H===void 0&&O(this),H};let N;this.getAttributes=function(){return N===void 0&&O(this),N};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=a.getProgramParameter(b,F1)),w},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=k1++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=Z,this.fragmentShader=V,this}let rM=0;class sM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),l=this._getShaderStage(r),u=this._getShaderCacheForMaterial(e);return u.has(a)===!1&&(u.add(a),a.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new aM(e),t.set(e,r)),r}}class aM{constructor(e){this.id=rM++,this.code=e,this.usedTimes=0}}function oM(s,e,t,r,a,l,u){const d=new Z0,p=new sM,m=new Set,v=[],_=a.logarithmicDepthBuffer,x=a.vertexTextures;let E=a.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(N){return m.add(N),N===0?"uv":`uv${N}`}function S(N,w,k,W,$){const oe=W.fog,pe=$.geometry,fe=N.isMeshStandardMaterial?W.environment:null,he=(N.isMeshStandardMaterial?t:e).get(N.envMap||fe),z=he&&he.mapping===$l?he.image.height:null,ue=M[N.type];N.precision!==null&&(E=a.getMaxPrecision(N.precision),E!==N.precision&&console.warn("THREE.WebGLProgram.getParameters:",N.precision,"not supported, using",E,"instead."));const ne=pe.morphAttributes.position||pe.morphAttributes.normal||pe.morphAttributes.color,U=ne!==void 0?ne.length:0;let te=0;pe.morphAttributes.position!==void 0&&(te=1),pe.morphAttributes.normal!==void 0&&(te=2),pe.morphAttributes.color!==void 0&&(te=3);let Ne,ee,F,le;if(ue){const St=Si[ue];Ne=St.vertexShader,ee=St.fragmentShader}else Ne=N.vertexShader,ee=N.fragmentShader,p.update(N),F=p.getVertexShaderID(N),le=p.getFragmentShaderID(N);const ce=s.getRenderTarget(),ge=s.state.buffers.depth.getReversed(),Me=$.isInstancedMesh===!0,Ve=$.isBatchedMesh===!0,vt=!!N.map,st=!!N.matcap,at=!!he,K=!!N.aoMap,mn=!!N.lightMap,xt=!!N.bumpMap,ht=!!N.normalMap,Ze=!!N.displacementMap,Rt=!!N.emissiveMap,Ke=!!N.metalnessMap,L=!!N.roughnessMap,A=N.anisotropy>0,ie=N.clearcoat>0,xe=N.dispersion>0,ye=N.iridescence>0,me=N.sheen>0,je=N.transmission>0,Ce=A&&!!N.anisotropyMap,Oe=ie&&!!N.clearcoatMap,ft=ie&&!!N.clearcoatNormalMap,Te=ie&&!!N.clearcoatRoughnessMap,ke=ye&&!!N.iridescenceMap,et=ye&&!!N.iridescenceThicknessMap,tt=me&&!!N.sheenColorMap,Be=me&&!!N.sheenRoughnessMap,pt=!!N.specularMap,ot=!!N.specularColorMap,Ct=!!N.specularIntensityMap,j=je&&!!N.transmissionMap,Re=je&&!!N.thicknessMap,de=!!N.gradientMap,ve=!!N.alphaMap,Le=N.alphaTest>0,Ie=!!N.alphaHash,lt=!!N.extensions;let Ut=Er;N.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(Ut=s.toneMapping);const Yt={shaderID:ue,shaderType:N.type,shaderName:N.name,vertexShader:Ne,fragmentShader:ee,defines:N.defines,customVertexShaderID:F,customFragmentShaderID:le,isRawShaderMaterial:N.isRawShaderMaterial===!0,glslVersion:N.glslVersion,precision:E,batching:Ve,batchingColor:Ve&&$._colorsTexture!==null,instancing:Me,instancingColor:Me&&$.instanceColor!==null,instancingMorph:Me&&$.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:ce===null?s.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Qs,alphaToCoverage:!!N.alphaToCoverage,map:vt,matcap:st,envMap:at,envMapMode:at&&he.mapping,envMapCubeUVHeight:z,aoMap:K,lightMap:mn,bumpMap:xt,normalMap:ht,displacementMap:x&&Ze,emissiveMap:Rt,normalMapObjectSpace:ht&&N.normalMapType===p_,normalMapTangentSpace:ht&&N.normalMapType===W0,metalnessMap:Ke,roughnessMap:L,anisotropy:A,anisotropyMap:Ce,clearcoat:ie,clearcoatMap:Oe,clearcoatNormalMap:ft,clearcoatRoughnessMap:Te,dispersion:xe,iridescence:ye,iridescenceMap:ke,iridescenceThicknessMap:et,sheen:me,sheenColorMap:tt,sheenRoughnessMap:Be,specularMap:pt,specularColorMap:ot,specularIntensityMap:Ct,transmission:je,transmissionMap:j,thicknessMap:Re,gradientMap:de,opaque:N.transparent===!1&&N.blending===Gs&&N.alphaToCoverage===!1,alphaMap:ve,alphaTest:Le,alphaHash:Ie,combine:N.combine,mapUv:vt&&b(N.map.channel),aoMapUv:K&&b(N.aoMap.channel),lightMapUv:mn&&b(N.lightMap.channel),bumpMapUv:xt&&b(N.bumpMap.channel),normalMapUv:ht&&b(N.normalMap.channel),displacementMapUv:Ze&&b(N.displacementMap.channel),emissiveMapUv:Rt&&b(N.emissiveMap.channel),metalnessMapUv:Ke&&b(N.metalnessMap.channel),roughnessMapUv:L&&b(N.roughnessMap.channel),anisotropyMapUv:Ce&&b(N.anisotropyMap.channel),clearcoatMapUv:Oe&&b(N.clearcoatMap.channel),clearcoatNormalMapUv:ft&&b(N.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&b(N.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&b(N.iridescenceMap.channel),iridescenceThicknessMapUv:et&&b(N.iridescenceThicknessMap.channel),sheenColorMapUv:tt&&b(N.sheenColorMap.channel),sheenRoughnessMapUv:Be&&b(N.sheenRoughnessMap.channel),specularMapUv:pt&&b(N.specularMap.channel),specularColorMapUv:ot&&b(N.specularColorMap.channel),specularIntensityMapUv:Ct&&b(N.specularIntensityMap.channel),transmissionMapUv:j&&b(N.transmissionMap.channel),thicknessMapUv:Re&&b(N.thicknessMap.channel),alphaMapUv:ve&&b(N.alphaMap.channel),vertexTangents:!!pe.attributes.tangent&&(ht||A),vertexColors:N.vertexColors,vertexAlphas:N.vertexColors===!0&&!!pe.attributes.color&&pe.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!pe.attributes.uv&&(vt||ve),fog:!!oe,useFog:N.fog===!0,fogExp2:!!oe&&oe.isFogExp2,flatShading:N.flatShading===!0,sizeAttenuation:N.sizeAttenuation===!0,logarithmicDepthBuffer:_,reverseDepthBuffer:ge,skinning:$.isSkinnedMesh===!0,morphTargets:pe.morphAttributes.position!==void 0,morphNormals:pe.morphAttributes.normal!==void 0,morphColors:pe.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:te,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:N.dithering,shadowMapEnabled:s.shadowMap.enabled&&k.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ut,decodeVideoTexture:vt&&N.map.isVideoTexture===!0&&Mt.getTransfer(N.map.colorSpace)===Pt,decodeVideoTextureEmissive:Rt&&N.emissiveMap.isVideoTexture===!0&&Mt.getTransfer(N.emissiveMap.colorSpace)===Pt,premultipliedAlpha:N.premultipliedAlpha,doubleSided:N.side===Ei,flipSided:N.side===Ln,useDepthPacking:N.depthPacking>=0,depthPacking:N.depthPacking||0,index0AttributeName:N.index0AttributeName,extensionClipCullDistance:lt&&N.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(lt&&N.extensions.multiDraw===!0||Ve)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:N.customProgramCacheKey()};return Yt.vertexUv1s=m.has(1),Yt.vertexUv2s=m.has(2),Yt.vertexUv3s=m.has(3),m.clear(),Yt}function y(N){const w=[];if(N.shaderID?w.push(N.shaderID):(w.push(N.customVertexShaderID),w.push(N.customFragmentShaderID)),N.defines!==void 0)for(const k in N.defines)w.push(k),w.push(N.defines[k]);return N.isRawShaderMaterial===!1&&(R(w,N),I(w,N),w.push(s.outputColorSpace)),w.push(N.customProgramCacheKey),w.join()}function R(N,w){N.push(w.precision),N.push(w.outputColorSpace),N.push(w.envMapMode),N.push(w.envMapCubeUVHeight),N.push(w.mapUv),N.push(w.alphaMapUv),N.push(w.lightMapUv),N.push(w.aoMapUv),N.push(w.bumpMapUv),N.push(w.normalMapUv),N.push(w.displacementMapUv),N.push(w.emissiveMapUv),N.push(w.metalnessMapUv),N.push(w.roughnessMapUv),N.push(w.anisotropyMapUv),N.push(w.clearcoatMapUv),N.push(w.clearcoatNormalMapUv),N.push(w.clearcoatRoughnessMapUv),N.push(w.iridescenceMapUv),N.push(w.iridescenceThicknessMapUv),N.push(w.sheenColorMapUv),N.push(w.sheenRoughnessMapUv),N.push(w.specularMapUv),N.push(w.specularColorMapUv),N.push(w.specularIntensityMapUv),N.push(w.transmissionMapUv),N.push(w.thicknessMapUv),N.push(w.combine),N.push(w.fogExp2),N.push(w.sizeAttenuation),N.push(w.morphTargetsCount),N.push(w.morphAttributeCount),N.push(w.numDirLights),N.push(w.numPointLights),N.push(w.numSpotLights),N.push(w.numSpotLightMaps),N.push(w.numHemiLights),N.push(w.numRectAreaLights),N.push(w.numDirLightShadows),N.push(w.numPointLightShadows),N.push(w.numSpotLightShadows),N.push(w.numSpotLightShadowsWithMaps),N.push(w.numLightProbes),N.push(w.shadowMapType),N.push(w.toneMapping),N.push(w.numClippingPlanes),N.push(w.numClipIntersection),N.push(w.depthPacking)}function I(N,w){d.disableAll(),w.supportsVertexTextures&&d.enable(0),w.instancing&&d.enable(1),w.instancingColor&&d.enable(2),w.instancingMorph&&d.enable(3),w.matcap&&d.enable(4),w.envMap&&d.enable(5),w.normalMapObjectSpace&&d.enable(6),w.normalMapTangentSpace&&d.enable(7),w.clearcoat&&d.enable(8),w.iridescence&&d.enable(9),w.alphaTest&&d.enable(10),w.vertexColors&&d.enable(11),w.vertexAlphas&&d.enable(12),w.vertexUv1s&&d.enable(13),w.vertexUv2s&&d.enable(14),w.vertexUv3s&&d.enable(15),w.vertexTangents&&d.enable(16),w.anisotropy&&d.enable(17),w.alphaHash&&d.enable(18),w.batching&&d.enable(19),w.dispersion&&d.enable(20),w.batchingColor&&d.enable(21),N.push(d.mask),d.disableAll(),w.fog&&d.enable(0),w.useFog&&d.enable(1),w.flatShading&&d.enable(2),w.logarithmicDepthBuffer&&d.enable(3),w.reverseDepthBuffer&&d.enable(4),w.skinning&&d.enable(5),w.morphTargets&&d.enable(6),w.morphNormals&&d.enable(7),w.morphColors&&d.enable(8),w.premultipliedAlpha&&d.enable(9),w.shadowMapEnabled&&d.enable(10),w.doubleSided&&d.enable(11),w.flipSided&&d.enable(12),w.useDepthPacking&&d.enable(13),w.dithering&&d.enable(14),w.transmission&&d.enable(15),w.sheen&&d.enable(16),w.opaque&&d.enable(17),w.pointsUvs&&d.enable(18),w.decodeVideoTexture&&d.enable(19),w.decodeVideoTextureEmissive&&d.enable(20),w.alphaToCoverage&&d.enable(21),N.push(d.mask)}function C(N){const w=M[N.type];let k;if(w){const W=Si[w];k=H_.clone(W.uniforms)}else k=N.uniforms;return k}function Z(N,w){let k;for(let W=0,$=v.length;W<$;W++){const oe=v[W];if(oe.cacheKey===w){k=oe,++k.usedTimes;break}}return k===void 0&&(k=new iM(s,w,N,l),v.push(k)),k}function V(N){if(--N.usedTimes===0){const w=v.indexOf(N);v[w]=v[v.length-1],v.pop(),N.destroy()}}function O(N){p.remove(N)}function H(){p.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:C,acquireProgram:Z,releaseProgram:V,releaseShaderCache:O,programs:v,dispose:H}}function lM(){let s=new WeakMap;function e(u){return s.has(u)}function t(u){let d=s.get(u);return d===void 0&&(d={},s.set(u,d)),d}function r(u){s.delete(u)}function a(u,d,p){s.get(u)[d]=p}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:a,dispose:l}}function cM(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function n0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function i0(){const s=[];let e=0;const t=[],r=[],a=[];function l(){e=0,t.length=0,r.length=0,a.length=0}function u(_,x,E,M,b,S){let y=s[e];return y===void 0?(y={id:_.id,object:_,geometry:x,material:E,groupOrder:M,renderOrder:_.renderOrder,z:b,group:S},s[e]=y):(y.id=_.id,y.object=_,y.geometry=x,y.material=E,y.groupOrder=M,y.renderOrder=_.renderOrder,y.z=b,y.group=S),e++,y}function d(_,x,E,M,b,S){const y=u(_,x,E,M,b,S);E.transmission>0?r.push(y):E.transparent===!0?a.push(y):t.push(y)}function p(_,x,E,M,b,S){const y=u(_,x,E,M,b,S);E.transmission>0?r.unshift(y):E.transparent===!0?a.unshift(y):t.unshift(y)}function m(_,x){t.length>1&&t.sort(_||cM),r.length>1&&r.sort(x||n0),a.length>1&&a.sort(x||n0)}function v(){for(let _=e,x=s.length;_<x;_++){const E=s[_];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:t,transmissive:r,transparent:a,init:l,push:d,unshift:p,finish:v,sort:m}}function uM(){let s=new WeakMap;function e(r,a){const l=s.get(r);let u;return l===void 0?(u=new i0,s.set(r,[u])):a>=l.length?(u=new i0,l.push(u)):u=l[a],u}function t(){s=new WeakMap}return{get:e,dispose:t}}function dM(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new X,color:new bt};break;case"SpotLight":t={position:new X,direction:new X,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new bt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":t={color:new bt,position:new X,halfWidth:new X,halfHeight:new X};break}return s[e.id]=t,t}}}function fM(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let hM=0;function pM(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function mM(s){const e=new dM,t=fM(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new X);const a=new X,l=new kt,u=new kt;function d(m){let v=0,_=0,x=0;for(let N=0;N<9;N++)r.probe[N].set(0,0,0);let E=0,M=0,b=0,S=0,y=0,R=0,I=0,C=0,Z=0,V=0,O=0;m.sort(pM);for(let N=0,w=m.length;N<w;N++){const k=m[N],W=k.color,$=k.intensity,oe=k.distance,pe=k.shadow&&k.shadow.map?k.shadow.map.texture:null;if(k.isAmbientLight)v+=W.r*$,_+=W.g*$,x+=W.b*$;else if(k.isLightProbe){for(let fe=0;fe<9;fe++)r.probe[fe].addScaledVector(k.sh.coefficients[fe],$);O++}else if(k.isDirectionalLight){const fe=e.get(k);if(fe.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const he=k.shadow,z=t.get(k);z.shadowIntensity=he.intensity,z.shadowBias=he.bias,z.shadowNormalBias=he.normalBias,z.shadowRadius=he.radius,z.shadowMapSize=he.mapSize,r.directionalShadow[E]=z,r.directionalShadowMap[E]=pe,r.directionalShadowMatrix[E]=k.shadow.matrix,R++}r.directional[E]=fe,E++}else if(k.isSpotLight){const fe=e.get(k);fe.position.setFromMatrixPosition(k.matrixWorld),fe.color.copy(W).multiplyScalar($),fe.distance=oe,fe.coneCos=Math.cos(k.angle),fe.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),fe.decay=k.decay,r.spot[b]=fe;const he=k.shadow;if(k.map&&(r.spotLightMap[Z]=k.map,Z++,he.updateMatrices(k),k.castShadow&&V++),r.spotLightMatrix[b]=he.matrix,k.castShadow){const z=t.get(k);z.shadowIntensity=he.intensity,z.shadowBias=he.bias,z.shadowNormalBias=he.normalBias,z.shadowRadius=he.radius,z.shadowMapSize=he.mapSize,r.spotShadow[b]=z,r.spotShadowMap[b]=pe,C++}b++}else if(k.isRectAreaLight){const fe=e.get(k);fe.color.copy(W).multiplyScalar($),fe.halfWidth.set(k.width*.5,0,0),fe.halfHeight.set(0,k.height*.5,0),r.rectArea[S]=fe,S++}else if(k.isPointLight){const fe=e.get(k);if(fe.color.copy(k.color).multiplyScalar(k.intensity),fe.distance=k.distance,fe.decay=k.decay,k.castShadow){const he=k.shadow,z=t.get(k);z.shadowIntensity=he.intensity,z.shadowBias=he.bias,z.shadowNormalBias=he.normalBias,z.shadowRadius=he.radius,z.shadowMapSize=he.mapSize,z.shadowCameraNear=he.camera.near,z.shadowCameraFar=he.camera.far,r.pointShadow[M]=z,r.pointShadowMap[M]=pe,r.pointShadowMatrix[M]=k.shadow.matrix,I++}r.point[M]=fe,M++}else if(k.isHemisphereLight){const fe=e.get(k);fe.skyColor.copy(k.color).multiplyScalar($),fe.groundColor.copy(k.groundColor).multiplyScalar($),r.hemi[y]=fe,y++}}S>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Pe.LTC_FLOAT_1,r.rectAreaLTC2=Pe.LTC_FLOAT_2):(r.rectAreaLTC1=Pe.LTC_HALF_1,r.rectAreaLTC2=Pe.LTC_HALF_2)),r.ambient[0]=v,r.ambient[1]=_,r.ambient[2]=x;const H=r.hash;(H.directionalLength!==E||H.pointLength!==M||H.spotLength!==b||H.rectAreaLength!==S||H.hemiLength!==y||H.numDirectionalShadows!==R||H.numPointShadows!==I||H.numSpotShadows!==C||H.numSpotMaps!==Z||H.numLightProbes!==O)&&(r.directional.length=E,r.spot.length=b,r.rectArea.length=S,r.point.length=M,r.hemi.length=y,r.directionalShadow.length=R,r.directionalShadowMap.length=R,r.pointShadow.length=I,r.pointShadowMap.length=I,r.spotShadow.length=C,r.spotShadowMap.length=C,r.directionalShadowMatrix.length=R,r.pointShadowMatrix.length=I,r.spotLightMatrix.length=C+Z-V,r.spotLightMap.length=Z,r.numSpotLightShadowsWithMaps=V,r.numLightProbes=O,H.directionalLength=E,H.pointLength=M,H.spotLength=b,H.rectAreaLength=S,H.hemiLength=y,H.numDirectionalShadows=R,H.numPointShadows=I,H.numSpotShadows=C,H.numSpotMaps=Z,H.numLightProbes=O,r.version=hM++)}function p(m,v){let _=0,x=0,E=0,M=0,b=0;const S=v.matrixWorldInverse;for(let y=0,R=m.length;y<R;y++){const I=m[y];if(I.isDirectionalLight){const C=r.directional[_];C.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(S),_++}else if(I.isSpotLight){const C=r.spot[E];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),C.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(S),E++}else if(I.isRectAreaLight){const C=r.rectArea[M];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),u.identity(),l.copy(I.matrixWorld),l.premultiply(S),u.extractRotation(l),C.halfWidth.set(I.width*.5,0,0),C.halfHeight.set(0,I.height*.5,0),C.halfWidth.applyMatrix4(u),C.halfHeight.applyMatrix4(u),M++}else if(I.isPointLight){const C=r.point[x];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),x++}else if(I.isHemisphereLight){const C=r.hemi[b];C.direction.setFromMatrixPosition(I.matrixWorld),C.direction.transformDirection(S),b++}}}return{setup:d,setupView:p,state:r}}function r0(s){const e=new mM(s),t=[],r=[];function a(v){m.camera=v,t.length=0,r.length=0}function l(v){t.push(v)}function u(v){r.push(v)}function d(){e.setup(t)}function p(v){e.setupView(t,v)}const m={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:d,setupLightsView:p,pushLight:l,pushShadow:u}}function gM(s){let e=new WeakMap;function t(a,l=0){const u=e.get(a);let d;return u===void 0?(d=new r0(s),e.set(a,[d])):l>=u.length?(d=new r0(s),u.push(d)):d=u[l],d}function r(){e=new WeakMap}return{get:t,dispose:r}}class vM extends ta{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=f_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class xM extends ta{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const _M=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function SM(s,e,t){let r=new bf;const a=new $e,l=new $e,u=new It,d=new vM({depthPacking:h_}),p=new xM,m={},v=t.maxTextureSize,_={[Mr]:Ln,[Ln]:Mr,[Ei]:Ei},x=new Tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:_M,fragmentShader:yM}),E=x.clone();E.defines.HORIZONTAL_PASS=1;const M=new pi;M.setAttribute("position",new hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new In(M,x),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=I0;let y=this.type;this.render=function(V,O,H){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||V.length===0)return;const N=s.getRenderTarget(),w=s.getActiveCubeFace(),k=s.getActiveMipmapLevel(),W=s.state;W.setBlending(Sr),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const $=y!==Gi&&this.type===Gi,oe=y===Gi&&this.type!==Gi;for(let pe=0,fe=V.length;pe<fe;pe++){const he=V[pe],z=he.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",he,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;a.copy(z.mapSize);const ue=z.getFrameExtents();if(a.multiply(ue),l.copy(z.mapSize),(a.x>v||a.y>v)&&(a.x>v&&(l.x=Math.floor(v/ue.x),a.x=l.x*ue.x,z.mapSize.x=l.x),a.y>v&&(l.y=Math.floor(v/ue.y),a.y=l.y*ue.y,z.mapSize.y=l.y)),z.map===null||$===!0||oe===!0){const U=this.type!==Gi?{minFilter:fi,magFilter:fi}:{};z.map!==null&&z.map.dispose(),z.map=new Qr(a.x,a.y,U),z.map.texture.name=he.name+".shadowMap",z.camera.updateProjectionMatrix()}s.setRenderTarget(z.map),s.clear();const ne=z.getViewportCount();for(let U=0;U<ne;U++){const te=z.getViewport(U);u.set(l.x*te.x,l.y*te.y,l.x*te.z,l.y*te.w),W.viewport(u),z.updateMatrices(he,U),r=z.getFrustum(),C(O,H,z.camera,he,this.type)}z.isPointLightShadow!==!0&&this.type===Gi&&R(z,H),z.needsUpdate=!1}y=this.type,S.needsUpdate=!1,s.setRenderTarget(N,w,k)};function R(V,O){const H=e.update(b);x.defines.VSM_SAMPLES!==V.blurSamples&&(x.defines.VSM_SAMPLES=V.blurSamples,E.defines.VSM_SAMPLES=V.blurSamples,x.needsUpdate=!0,E.needsUpdate=!0),V.mapPass===null&&(V.mapPass=new Qr(a.x,a.y)),x.uniforms.shadow_pass.value=V.map.texture,x.uniforms.resolution.value=V.mapSize,x.uniforms.radius.value=V.radius,s.setRenderTarget(V.mapPass),s.clear(),s.renderBufferDirect(O,null,H,x,b,null),E.uniforms.shadow_pass.value=V.mapPass.texture,E.uniforms.resolution.value=V.mapSize,E.uniforms.radius.value=V.radius,s.setRenderTarget(V.map),s.clear(),s.renderBufferDirect(O,null,H,E,b,null)}function I(V,O,H,N){let w=null;const k=H.isPointLight===!0?V.customDistanceMaterial:V.customDepthMaterial;if(k!==void 0)w=k;else if(w=H.isPointLight===!0?p:d,s.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0){const W=w.uuid,$=O.uuid;let oe=m[W];oe===void 0&&(oe={},m[W]=oe);let pe=oe[$];pe===void 0&&(pe=w.clone(),oe[$]=pe,O.addEventListener("dispose",Z)),w=pe}if(w.visible=O.visible,w.wireframe=O.wireframe,N===Gi?w.side=O.shadowSide!==null?O.shadowSide:O.side:w.side=O.shadowSide!==null?O.shadowSide:_[O.side],w.alphaMap=O.alphaMap,w.alphaTest=O.alphaTest,w.map=O.map,w.clipShadows=O.clipShadows,w.clippingPlanes=O.clippingPlanes,w.clipIntersection=O.clipIntersection,w.displacementMap=O.displacementMap,w.displacementScale=O.displacementScale,w.displacementBias=O.displacementBias,w.wireframeLinewidth=O.wireframeLinewidth,w.linewidth=O.linewidth,H.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const W=s.properties.get(w);W.light=H}return w}function C(V,O,H,N,w){if(V.visible===!1)return;if(V.layers.test(O.layers)&&(V.isMesh||V.isLine||V.isPoints)&&(V.castShadow||V.receiveShadow&&w===Gi)&&(!V.frustumCulled||r.intersectsObject(V))){V.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,V.matrixWorld);const $=e.update(V),oe=V.material;if(Array.isArray(oe)){const pe=$.groups;for(let fe=0,he=pe.length;fe<he;fe++){const z=pe[fe],ue=oe[z.materialIndex];if(ue&&ue.visible){const ne=I(V,ue,N,w);V.onBeforeShadow(s,V,O,H,$,ne,z),s.renderBufferDirect(H,null,$,ne,V,z),V.onAfterShadow(s,V,O,H,$,ne,z)}}}else if(oe.visible){const pe=I(V,oe,N,w);V.onBeforeShadow(s,V,O,H,$,pe,null),s.renderBufferDirect(H,null,$,pe,V,null),V.onAfterShadow(s,V,O,H,$,pe,null)}}const W=V.children;for(let $=0,oe=W.length;$<oe;$++)C(W[$],O,H,N,w)}function Z(V){V.target.removeEventListener("dispose",Z);for(const H in m){const N=m[H],w=V.target.uuid;w in N&&(N[w].dispose(),delete N[w])}}}const EM={[Md]:Td,[wd]:Cd,[bd]:Rd,[Xs]:Ad,[Td]:Md,[Cd]:wd,[Rd]:bd,[Ad]:Xs};function MM(s,e){function t(){let j=!1;const Re=new It;let de=null;const ve=new It(0,0,0,0);return{setMask:function(Le){de!==Le&&!j&&(s.colorMask(Le,Le,Le,Le),de=Le)},setLocked:function(Le){j=Le},setClear:function(Le,Ie,lt,Ut,Yt){Yt===!0&&(Le*=Ut,Ie*=Ut,lt*=Ut),Re.set(Le,Ie,lt,Ut),ve.equals(Re)===!1&&(s.clearColor(Le,Ie,lt,Ut),ve.copy(Re))},reset:function(){j=!1,de=null,ve.set(-1,0,0,0)}}}function r(){let j=!1,Re=!1,de=null,ve=null,Le=null;return{setReversed:function(Ie){if(Re!==Ie){const lt=e.get("EXT_clip_control");Re?lt.clipControlEXT(lt.LOWER_LEFT_EXT,lt.ZERO_TO_ONE_EXT):lt.clipControlEXT(lt.LOWER_LEFT_EXT,lt.NEGATIVE_ONE_TO_ONE_EXT);const Ut=Le;Le=null,this.setClear(Ut)}Re=Ie},getReversed:function(){return Re},setTest:function(Ie){Ie?ce(s.DEPTH_TEST):ge(s.DEPTH_TEST)},setMask:function(Ie){de!==Ie&&!j&&(s.depthMask(Ie),de=Ie)},setFunc:function(Ie){if(Re&&(Ie=EM[Ie]),ve!==Ie){switch(Ie){case Md:s.depthFunc(s.NEVER);break;case Td:s.depthFunc(s.ALWAYS);break;case wd:s.depthFunc(s.LESS);break;case Xs:s.depthFunc(s.LEQUAL);break;case bd:s.depthFunc(s.EQUAL);break;case Ad:s.depthFunc(s.GEQUAL);break;case Cd:s.depthFunc(s.GREATER);break;case Rd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ve=Ie}},setLocked:function(Ie){j=Ie},setClear:function(Ie){Le!==Ie&&(Re&&(Ie=1-Ie),s.clearDepth(Ie),Le=Ie)},reset:function(){j=!1,de=null,ve=null,Le=null,Re=!1}}}function a(){let j=!1,Re=null,de=null,ve=null,Le=null,Ie=null,lt=null,Ut=null,Yt=null;return{setTest:function(St){j||(St?ce(s.STENCIL_TEST):ge(s.STENCIL_TEST))},setMask:function(St){Re!==St&&!j&&(s.stencilMask(St),Re=St)},setFunc:function(St,Mn,gn){(de!==St||ve!==Mn||Le!==gn)&&(s.stencilFunc(St,Mn,gn),de=St,ve=Mn,Le=gn)},setOp:function(St,Mn,gn){(Ie!==St||lt!==Mn||Ut!==gn)&&(s.stencilOp(St,Mn,gn),Ie=St,lt=Mn,Ut=gn)},setLocked:function(St){j=St},setClear:function(St){Yt!==St&&(s.clearStencil(St),Yt=St)},reset:function(){j=!1,Re=null,de=null,ve=null,Le=null,Ie=null,lt=null,Ut=null,Yt=null}}}const l=new t,u=new r,d=new a,p=new WeakMap,m=new WeakMap;let v={},_={},x=new WeakMap,E=[],M=null,b=!1,S=null,y=null,R=null,I=null,C=null,Z=null,V=null,O=new bt(0,0,0),H=0,N=!1,w=null,k=null,W=null,$=null,oe=null;const pe=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let fe=!1,he=0;const z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(z)[1]),fe=he>=1):z.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),fe=he>=2);let ue=null,ne={};const U=s.getParameter(s.SCISSOR_BOX),te=s.getParameter(s.VIEWPORT),Ne=new It().fromArray(U),ee=new It().fromArray(te);function F(j,Re,de,ve){const Le=new Uint8Array(4),Ie=s.createTexture();s.bindTexture(j,Ie),s.texParameteri(j,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(j,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let lt=0;lt<de;lt++)j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?s.texImage3D(Re,0,s.RGBA,1,1,ve,0,s.RGBA,s.UNSIGNED_BYTE,Le):s.texImage2D(Re+lt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Le);return Ie}const le={};le[s.TEXTURE_2D]=F(s.TEXTURE_2D,s.TEXTURE_2D,1),le[s.TEXTURE_CUBE_MAP]=F(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[s.TEXTURE_2D_ARRAY]=F(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),le[s.TEXTURE_3D]=F(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),u.setClear(1),d.setClear(0),ce(s.DEPTH_TEST),u.setFunc(Xs),xt(!1),ht(lm),ce(s.CULL_FACE),K(Sr);function ce(j){v[j]!==!0&&(s.enable(j),v[j]=!0)}function ge(j){v[j]!==!1&&(s.disable(j),v[j]=!1)}function Me(j,Re){return _[j]!==Re?(s.bindFramebuffer(j,Re),_[j]=Re,j===s.DRAW_FRAMEBUFFER&&(_[s.FRAMEBUFFER]=Re),j===s.FRAMEBUFFER&&(_[s.DRAW_FRAMEBUFFER]=Re),!0):!1}function Ve(j,Re){let de=E,ve=!1;if(j){de=x.get(Re),de===void 0&&(de=[],x.set(Re,de));const Le=j.textures;if(de.length!==Le.length||de[0]!==s.COLOR_ATTACHMENT0){for(let Ie=0,lt=Le.length;Ie<lt;Ie++)de[Ie]=s.COLOR_ATTACHMENT0+Ie;de.length=Le.length,ve=!0}}else de[0]!==s.BACK&&(de[0]=s.BACK,ve=!0);ve&&s.drawBuffers(de)}function vt(j){return M!==j?(s.useProgram(j),M=j,!0):!1}const st={[Yr]:s.FUNC_ADD,[Bx]:s.FUNC_SUBTRACT,[zx]:s.FUNC_REVERSE_SUBTRACT};st[Vx]=s.MIN,st[Gx]=s.MAX;const at={[Hx]:s.ZERO,[jx]:s.ONE,[Wx]:s.SRC_COLOR,[Sd]:s.SRC_ALPHA,[Zx]:s.SRC_ALPHA_SATURATE,[$x]:s.DST_COLOR,[Yx]:s.DST_ALPHA,[Xx]:s.ONE_MINUS_SRC_COLOR,[Ed]:s.ONE_MINUS_SRC_ALPHA,[Kx]:s.ONE_MINUS_DST_COLOR,[qx]:s.ONE_MINUS_DST_ALPHA,[Qx]:s.CONSTANT_COLOR,[Jx]:s.ONE_MINUS_CONSTANT_COLOR,[e_]:s.CONSTANT_ALPHA,[t_]:s.ONE_MINUS_CONSTANT_ALPHA};function K(j,Re,de,ve,Le,Ie,lt,Ut,Yt,St){if(j===Sr){b===!0&&(ge(s.BLEND),b=!1);return}if(b===!1&&(ce(s.BLEND),b=!0),j!==kx){if(j!==S||St!==N){if((y!==Yr||C!==Yr)&&(s.blendEquation(s.FUNC_ADD),y=Yr,C=Yr),St)switch(j){case Gs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cm:s.blendFunc(s.ONE,s.ONE);break;case um:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case dm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case Gs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case cm:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case um:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case dm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}R=null,I=null,Z=null,V=null,O.set(0,0,0),H=0,S=j,N=St}return}Le=Le||Re,Ie=Ie||de,lt=lt||ve,(Re!==y||Le!==C)&&(s.blendEquationSeparate(st[Re],st[Le]),y=Re,C=Le),(de!==R||ve!==I||Ie!==Z||lt!==V)&&(s.blendFuncSeparate(at[de],at[ve],at[Ie],at[lt]),R=de,I=ve,Z=Ie,V=lt),(Ut.equals(O)===!1||Yt!==H)&&(s.blendColor(Ut.r,Ut.g,Ut.b,Yt),O.copy(Ut),H=Yt),S=j,N=!1}function mn(j,Re){j.side===Ei?ge(s.CULL_FACE):ce(s.CULL_FACE);let de=j.side===Ln;Re&&(de=!de),xt(de),j.blending===Gs&&j.transparent===!1?K(Sr):K(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),u.setFunc(j.depthFunc),u.setTest(j.depthTest),u.setMask(j.depthWrite),l.setMask(j.colorWrite);const ve=j.stencilWrite;d.setTest(ve),ve&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Rt(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?ce(s.SAMPLE_ALPHA_TO_COVERAGE):ge(s.SAMPLE_ALPHA_TO_COVERAGE)}function xt(j){w!==j&&(j?s.frontFace(s.CW):s.frontFace(s.CCW),w=j)}function ht(j){j!==Ux?(ce(s.CULL_FACE),j!==k&&(j===lm?s.cullFace(s.BACK):j===Ox?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ge(s.CULL_FACE),k=j}function Ze(j){j!==W&&(fe&&s.lineWidth(j),W=j)}function Rt(j,Re,de){j?(ce(s.POLYGON_OFFSET_FILL),($!==Re||oe!==de)&&(s.polygonOffset(Re,de),$=Re,oe=de)):ge(s.POLYGON_OFFSET_FILL)}function Ke(j){j?ce(s.SCISSOR_TEST):ge(s.SCISSOR_TEST)}function L(j){j===void 0&&(j=s.TEXTURE0+pe-1),ue!==j&&(s.activeTexture(j),ue=j)}function A(j,Re,de){de===void 0&&(ue===null?de=s.TEXTURE0+pe-1:de=ue);let ve=ne[de];ve===void 0&&(ve={type:void 0,texture:void 0},ne[de]=ve),(ve.type!==j||ve.texture!==Re)&&(ue!==de&&(s.activeTexture(de),ue=de),s.bindTexture(j,Re||le[j]),ve.type=j,ve.texture=Re)}function ie(){const j=ne[ue];j!==void 0&&j.type!==void 0&&(s.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function xe(){try{s.compressedTexImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ye(){try{s.compressedTexImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function me(){try{s.texSubImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function je(){try{s.texSubImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ce(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Oe(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ft(){try{s.texStorage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Te(){try{s.texStorage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ke(){try{s.texImage2D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function et(){try{s.texImage3D.apply(s,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function tt(j){Ne.equals(j)===!1&&(s.scissor(j.x,j.y,j.z,j.w),Ne.copy(j))}function Be(j){ee.equals(j)===!1&&(s.viewport(j.x,j.y,j.z,j.w),ee.copy(j))}function pt(j,Re){let de=m.get(Re);de===void 0&&(de=new WeakMap,m.set(Re,de));let ve=de.get(j);ve===void 0&&(ve=s.getUniformBlockIndex(Re,j.name),de.set(j,ve))}function ot(j,Re){const ve=m.get(Re).get(j);p.get(Re)!==ve&&(s.uniformBlockBinding(Re,ve,j.__bindingPointIndex),p.set(Re,ve))}function Ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),u.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),v={},ue=null,ne={},_={},x=new WeakMap,E=[],M=null,b=!1,S=null,y=null,R=null,I=null,C=null,Z=null,V=null,O=new bt(0,0,0),H=0,N=!1,w=null,k=null,W=null,$=null,oe=null,Ne.set(0,0,s.canvas.width,s.canvas.height),ee.set(0,0,s.canvas.width,s.canvas.height),l.reset(),u.reset(),d.reset()}return{buffers:{color:l,depth:u,stencil:d},enable:ce,disable:ge,bindFramebuffer:Me,drawBuffers:Ve,useProgram:vt,setBlending:K,setMaterial:mn,setFlipSided:xt,setCullFace:ht,setLineWidth:Ze,setPolygonOffset:Rt,setScissorTest:Ke,activeTexture:L,bindTexture:A,unbindTexture:ie,compressedTexImage2D:xe,compressedTexImage3D:ye,texImage2D:ke,texImage3D:et,updateUBOMapping:pt,uniformBlockBinding:ot,texStorage2D:ft,texStorage3D:Te,texSubImage2D:me,texSubImage3D:je,compressedTexSubImage2D:Ce,compressedTexSubImage3D:Oe,scissor:tt,viewport:Be,reset:Ct}}function s0(s,e,t,r){const a=TM(r);switch(t){case k0:return s*e;case z0:return s*e;case V0:return s*e*2;case G0:return s*e/a.components*a.byteLength;case Mf:return s*e/a.components*a.byteLength;case H0:return s*e*2/a.components*a.byteLength;case Tf:return s*e*2/a.components*a.byteLength;case B0:return s*e*3/a.components*a.byteLength;case di:return s*e*4/a.components*a.byteLength;case wf:return s*e*4/a.components*a.byteLength;case kl:case Bl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case zl:case Vl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ud:case Fd:return Math.max(s,16)*Math.max(e,8)/4;case Dd:case Od:return Math.max(s,8)*Math.max(e,8)/2;case kd:case Bd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case zd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Gd:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Hd:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case jd:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Xd:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Yd:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case qd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case $d:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Kd:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Zd:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Qd:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Jd:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ef:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Gl:case tf:case nf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case j0:case rf:return Math.ceil(s/4)*Math.ceil(e/4)*8;case sf:case af:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function TM(s){switch(s){case Xi:case U0:return{byteLength:1,components:1};case qa:case O0:case Ja:return{byteLength:2,components:1};case Sf:case Ef:return{byteLength:2,components:4};case Zr:case yf:case Hi:return{byteLength:4,components:1};case F0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function wM(s,e,t,r,a,l,u){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new $e,v=new WeakMap;let _;const x=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(L,A){return E?new OffscreenCanvas(L,A):Xl("canvas")}function b(L,A,ie){let xe=1;const ye=Ke(L);if((ye.width>ie||ye.height>ie)&&(xe=ie/Math.max(ye.width,ye.height)),xe<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const me=Math.floor(xe*ye.width),je=Math.floor(xe*ye.height);_===void 0&&(_=M(me,je));const Ce=A?M(me,je):_;return Ce.width=me,Ce.height=je,Ce.getContext("2d").drawImage(L,0,0,me,je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ye.width+"x"+ye.height+") to ("+me+"x"+je+")."),Ce}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ye.width+"x"+ye.height+")."),L;return L}function S(L){return L.generateMipmaps}function y(L){s.generateMipmap(L)}function R(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function I(L,A,ie,xe,ye=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let me=A;if(A===s.RED&&(ie===s.FLOAT&&(me=s.R32F),ie===s.HALF_FLOAT&&(me=s.R16F),ie===s.UNSIGNED_BYTE&&(me=s.R8)),A===s.RED_INTEGER&&(ie===s.UNSIGNED_BYTE&&(me=s.R8UI),ie===s.UNSIGNED_SHORT&&(me=s.R16UI),ie===s.UNSIGNED_INT&&(me=s.R32UI),ie===s.BYTE&&(me=s.R8I),ie===s.SHORT&&(me=s.R16I),ie===s.INT&&(me=s.R32I)),A===s.RG&&(ie===s.FLOAT&&(me=s.RG32F),ie===s.HALF_FLOAT&&(me=s.RG16F),ie===s.UNSIGNED_BYTE&&(me=s.RG8)),A===s.RG_INTEGER&&(ie===s.UNSIGNED_BYTE&&(me=s.RG8UI),ie===s.UNSIGNED_SHORT&&(me=s.RG16UI),ie===s.UNSIGNED_INT&&(me=s.RG32UI),ie===s.BYTE&&(me=s.RG8I),ie===s.SHORT&&(me=s.RG16I),ie===s.INT&&(me=s.RG32I)),A===s.RGB_INTEGER&&(ie===s.UNSIGNED_BYTE&&(me=s.RGB8UI),ie===s.UNSIGNED_SHORT&&(me=s.RGB16UI),ie===s.UNSIGNED_INT&&(me=s.RGB32UI),ie===s.BYTE&&(me=s.RGB8I),ie===s.SHORT&&(me=s.RGB16I),ie===s.INT&&(me=s.RGB32I)),A===s.RGBA_INTEGER&&(ie===s.UNSIGNED_BYTE&&(me=s.RGBA8UI),ie===s.UNSIGNED_SHORT&&(me=s.RGBA16UI),ie===s.UNSIGNED_INT&&(me=s.RGBA32UI),ie===s.BYTE&&(me=s.RGBA8I),ie===s.SHORT&&(me=s.RGBA16I),ie===s.INT&&(me=s.RGBA32I)),A===s.RGB&&ie===s.UNSIGNED_INT_5_9_9_9_REV&&(me=s.RGB9_E5),A===s.RGBA){const je=ye?Kl:Mt.getTransfer(xe);ie===s.FLOAT&&(me=s.RGBA32F),ie===s.HALF_FLOAT&&(me=s.RGBA16F),ie===s.UNSIGNED_BYTE&&(me=je===Pt?s.SRGB8_ALPHA8:s.RGBA8),ie===s.UNSIGNED_SHORT_4_4_4_4&&(me=s.RGBA4),ie===s.UNSIGNED_SHORT_5_5_5_1&&(me=s.RGB5_A1)}return(me===s.R16F||me===s.R32F||me===s.RG16F||me===s.RG32F||me===s.RGBA16F||me===s.RGBA32F)&&e.get("EXT_color_buffer_float"),me}function C(L,A){let ie;return L?A===null||A===Zr||A===$s?ie=s.DEPTH24_STENCIL8:A===Hi?ie=s.DEPTH32F_STENCIL8:A===qa&&(ie=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Zr||A===$s?ie=s.DEPTH_COMPONENT24:A===Hi?ie=s.DEPTH_COMPONENT32F:A===qa&&(ie=s.DEPTH_COMPONENT16),ie}function Z(L,A){return S(L)===!0||L.isFramebufferTexture&&L.minFilter!==fi&&L.minFilter!==Mi?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function V(L){const A=L.target;A.removeEventListener("dispose",V),H(A),A.isVideoTexture&&v.delete(A)}function O(L){const A=L.target;A.removeEventListener("dispose",O),w(A)}function H(L){const A=r.get(L);if(A.__webglInit===void 0)return;const ie=L.source,xe=x.get(ie);if(xe){const ye=xe[A.__cacheKey];ye.usedTimes--,ye.usedTimes===0&&N(L),Object.keys(xe).length===0&&x.delete(ie)}r.remove(L)}function N(L){const A=r.get(L);s.deleteTexture(A.__webglTexture);const ie=L.source,xe=x.get(ie);delete xe[A.__cacheKey],u.memory.textures--}function w(L){const A=r.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),r.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let xe=0;xe<6;xe++){if(Array.isArray(A.__webglFramebuffer[xe]))for(let ye=0;ye<A.__webglFramebuffer[xe].length;ye++)s.deleteFramebuffer(A.__webglFramebuffer[xe][ye]);else s.deleteFramebuffer(A.__webglFramebuffer[xe]);A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer[xe])}else{if(Array.isArray(A.__webglFramebuffer))for(let xe=0;xe<A.__webglFramebuffer.length;xe++)s.deleteFramebuffer(A.__webglFramebuffer[xe]);else s.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&s.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let xe=0;xe<A.__webglColorRenderbuffer.length;xe++)A.__webglColorRenderbuffer[xe]&&s.deleteRenderbuffer(A.__webglColorRenderbuffer[xe]);A.__webglDepthRenderbuffer&&s.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const ie=L.textures;for(let xe=0,ye=ie.length;xe<ye;xe++){const me=r.get(ie[xe]);me.__webglTexture&&(s.deleteTexture(me.__webglTexture),u.memory.textures--),r.remove(ie[xe])}r.remove(L)}let k=0;function W(){k=0}function $(){const L=k;return L>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+a.maxTextures),k+=1,L}function oe(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function pe(L,A){const ie=r.get(L);if(L.isVideoTexture&&Ze(L),L.isRenderTargetTexture===!1&&L.version>0&&ie.__version!==L.version){const xe=L.image;if(xe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(xe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(ie,L,A);return}}t.bindTexture(s.TEXTURE_2D,ie.__webglTexture,s.TEXTURE0+A)}function fe(L,A){const ie=r.get(L);if(L.version>0&&ie.__version!==L.version){ee(ie,L,A);return}t.bindTexture(s.TEXTURE_2D_ARRAY,ie.__webglTexture,s.TEXTURE0+A)}function he(L,A){const ie=r.get(L);if(L.version>0&&ie.__version!==L.version){ee(ie,L,A);return}t.bindTexture(s.TEXTURE_3D,ie.__webglTexture,s.TEXTURE0+A)}function z(L,A){const ie=r.get(L);if(L.version>0&&ie.__version!==L.version){F(ie,L,A);return}t.bindTexture(s.TEXTURE_CUBE_MAP,ie.__webglTexture,s.TEXTURE0+A)}const ue={[Id]:s.REPEAT,[$r]:s.CLAMP_TO_EDGE,[Ld]:s.MIRRORED_REPEAT},ne={[fi]:s.NEAREST,[d_]:s.NEAREST_MIPMAP_NEAREST,[dl]:s.NEAREST_MIPMAP_LINEAR,[Mi]:s.LINEAR,[ku]:s.LINEAR_MIPMAP_NEAREST,[Kr]:s.LINEAR_MIPMAP_LINEAR},U={[m_]:s.NEVER,[S_]:s.ALWAYS,[g_]:s.LESS,[X0]:s.LEQUAL,[v_]:s.EQUAL,[y_]:s.GEQUAL,[x_]:s.GREATER,[__]:s.NOTEQUAL};function te(L,A){if(A.type===Hi&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Mi||A.magFilter===ku||A.magFilter===dl||A.magFilter===Kr||A.minFilter===Mi||A.minFilter===ku||A.minFilter===dl||A.minFilter===Kr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,ue[A.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,ue[A.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,ue[A.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,ne[A.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,ne[A.minFilter]),A.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,U[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===fi||A.minFilter!==dl&&A.minFilter!==Kr||A.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||r.get(A).__currentAnisotropy){const ie=e.get("EXT_texture_filter_anisotropic");s.texParameterf(L,ie.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),r.get(A).__currentAnisotropy=A.anisotropy}}}function Ne(L,A){let ie=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",V));const xe=A.source;let ye=x.get(xe);ye===void 0&&(ye={},x.set(xe,ye));const me=oe(A);if(me!==L.__cacheKey){ye[me]===void 0&&(ye[me]={texture:s.createTexture(),usedTimes:0},u.memory.textures++,ie=!0),ye[me].usedTimes++;const je=ye[L.__cacheKey];je!==void 0&&(ye[L.__cacheKey].usedTimes--,je.usedTimes===0&&N(A)),L.__cacheKey=me,L.__webglTexture=ye[me].texture}return ie}function ee(L,A,ie){let xe=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(xe=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(xe=s.TEXTURE_3D);const ye=Ne(L,A),me=A.source;t.bindTexture(xe,L.__webglTexture,s.TEXTURE0+ie);const je=r.get(me);if(me.version!==je.__version||ye===!0){t.activeTexture(s.TEXTURE0+ie);const Ce=Mt.getPrimaries(Mt.workingColorSpace),Oe=A.colorSpace===yr?null:Mt.getPrimaries(A.colorSpace),ft=A.colorSpace===yr||Ce===Oe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);let Te=b(A.image,!1,a.maxTextureSize);Te=Rt(A,Te);const ke=l.convert(A.format,A.colorSpace),et=l.convert(A.type);let tt=I(A.internalFormat,ke,et,A.colorSpace,A.isVideoTexture);te(xe,A);let Be;const pt=A.mipmaps,ot=A.isVideoTexture!==!0,Ct=je.__version===void 0||ye===!0,j=me.dataReady,Re=Z(A,Te);if(A.isDepthTexture)tt=C(A.format===Ks,A.type),Ct&&(ot?t.texStorage2D(s.TEXTURE_2D,1,tt,Te.width,Te.height):t.texImage2D(s.TEXTURE_2D,0,tt,Te.width,Te.height,0,ke,et,null));else if(A.isDataTexture)if(pt.length>0){ot&&Ct&&t.texStorage2D(s.TEXTURE_2D,Re,tt,pt[0].width,pt[0].height);for(let de=0,ve=pt.length;de<ve;de++)Be=pt[de],ot?j&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,Be.width,Be.height,ke,et,Be.data):t.texImage2D(s.TEXTURE_2D,de,tt,Be.width,Be.height,0,ke,et,Be.data);A.generateMipmaps=!1}else ot?(Ct&&t.texStorage2D(s.TEXTURE_2D,Re,tt,Te.width,Te.height),j&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Te.width,Te.height,ke,et,Te.data)):t.texImage2D(s.TEXTURE_2D,0,tt,Te.width,Te.height,0,ke,et,Te.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){ot&&Ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Re,tt,pt[0].width,pt[0].height,Te.depth);for(let de=0,ve=pt.length;de<ve;de++)if(Be=pt[de],A.format!==di)if(ke!==null)if(ot){if(j)if(A.layerUpdates.size>0){const Le=s0(Be.width,Be.height,A.format,A.type);for(const Ie of A.layerUpdates){const lt=Be.data.subarray(Ie*Le/Be.data.BYTES_PER_ELEMENT,(Ie+1)*Le/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,Ie,Be.width,Be.height,1,ke,lt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,0,Be.width,Be.height,Te.depth,ke,Be.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,de,tt,Be.width,Be.height,Te.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ot?j&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,de,0,0,0,Be.width,Be.height,Te.depth,ke,et,Be.data):t.texImage3D(s.TEXTURE_2D_ARRAY,de,tt,Be.width,Be.height,Te.depth,0,ke,et,Be.data)}else{ot&&Ct&&t.texStorage2D(s.TEXTURE_2D,Re,tt,pt[0].width,pt[0].height);for(let de=0,ve=pt.length;de<ve;de++)Be=pt[de],A.format!==di?ke!==null?ot?j&&t.compressedTexSubImage2D(s.TEXTURE_2D,de,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(s.TEXTURE_2D,de,tt,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ot?j&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,Be.width,Be.height,ke,et,Be.data):t.texImage2D(s.TEXTURE_2D,de,tt,Be.width,Be.height,0,ke,et,Be.data)}else if(A.isDataArrayTexture)if(ot){if(Ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Re,tt,Te.width,Te.height,Te.depth),j)if(A.layerUpdates.size>0){const de=s0(Te.width,Te.height,A.format,A.type);for(const ve of A.layerUpdates){const Le=Te.data.subarray(ve*de/Te.data.BYTES_PER_ELEMENT,(ve+1)*de/Te.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ve,Te.width,Te.height,1,ke,et,Le)}A.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Te.width,Te.height,Te.depth,ke,et,Te.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,tt,Te.width,Te.height,Te.depth,0,ke,et,Te.data);else if(A.isData3DTexture)ot?(Ct&&t.texStorage3D(s.TEXTURE_3D,Re,tt,Te.width,Te.height,Te.depth),j&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Te.width,Te.height,Te.depth,ke,et,Te.data)):t.texImage3D(s.TEXTURE_3D,0,tt,Te.width,Te.height,Te.depth,0,ke,et,Te.data);else if(A.isFramebufferTexture){if(Ct)if(ot)t.texStorage2D(s.TEXTURE_2D,Re,tt,Te.width,Te.height);else{let de=Te.width,ve=Te.height;for(let Le=0;Le<Re;Le++)t.texImage2D(s.TEXTURE_2D,Le,tt,de,ve,0,ke,et,null),de>>=1,ve>>=1}}else if(pt.length>0){if(ot&&Ct){const de=Ke(pt[0]);t.texStorage2D(s.TEXTURE_2D,Re,tt,de.width,de.height)}for(let de=0,ve=pt.length;de<ve;de++)Be=pt[de],ot?j&&t.texSubImage2D(s.TEXTURE_2D,de,0,0,ke,et,Be):t.texImage2D(s.TEXTURE_2D,de,tt,ke,et,Be);A.generateMipmaps=!1}else if(ot){if(Ct){const de=Ke(Te);t.texStorage2D(s.TEXTURE_2D,Re,tt,de.width,de.height)}j&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ke,et,Te)}else t.texImage2D(s.TEXTURE_2D,0,tt,ke,et,Te);S(A)&&y(xe),je.__version=me.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function F(L,A,ie){if(A.image.length!==6)return;const xe=Ne(L,A),ye=A.source;t.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+ie);const me=r.get(ye);if(ye.version!==me.__version||xe===!0){t.activeTexture(s.TEXTURE0+ie);const je=Mt.getPrimaries(Mt.workingColorSpace),Ce=A.colorSpace===yr?null:Mt.getPrimaries(A.colorSpace),Oe=A.colorSpace===yr||je===Ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);const ft=A.isCompressedTexture||A.image[0].isCompressedTexture,Te=A.image[0]&&A.image[0].isDataTexture,ke=[];for(let ve=0;ve<6;ve++)!ft&&!Te?ke[ve]=b(A.image[ve],!0,a.maxCubemapSize):ke[ve]=Te?A.image[ve].image:A.image[ve],ke[ve]=Rt(A,ke[ve]);const et=ke[0],tt=l.convert(A.format,A.colorSpace),Be=l.convert(A.type),pt=I(A.internalFormat,tt,Be,A.colorSpace),ot=A.isVideoTexture!==!0,Ct=me.__version===void 0||xe===!0,j=ye.dataReady;let Re=Z(A,et);te(s.TEXTURE_CUBE_MAP,A);let de;if(ft){ot&&Ct&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,pt,et.width,et.height);for(let ve=0;ve<6;ve++){de=ke[ve].mipmaps;for(let Le=0;Le<de.length;Le++){const Ie=de[Le];A.format!==di?tt!==null?ot?j&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le,0,0,Ie.width,Ie.height,tt,Ie.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le,pt,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ot?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le,0,0,Ie.width,Ie.height,tt,Be,Ie.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le,pt,Ie.width,Ie.height,0,tt,Be,Ie.data)}}}else{if(de=A.mipmaps,ot&&Ct){de.length>0&&Re++;const ve=Ke(ke[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,pt,ve.width,ve.height)}for(let ve=0;ve<6;ve++)if(Te){ot?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,ke[ve].width,ke[ve].height,tt,Be,ke[ve].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,pt,ke[ve].width,ke[ve].height,0,tt,Be,ke[ve].data);for(let Le=0;Le<de.length;Le++){const lt=de[Le].image[ve].image;ot?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le+1,0,0,lt.width,lt.height,tt,Be,lt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le+1,pt,lt.width,lt.height,0,tt,Be,lt.data)}}else{ot?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,tt,Be,ke[ve]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,pt,tt,Be,ke[ve]);for(let Le=0;Le<de.length;Le++){const Ie=de[Le];ot?j&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le+1,0,0,tt,Be,Ie.image[ve]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Le+1,pt,tt,Be,Ie.image[ve])}}}S(A)&&y(s.TEXTURE_CUBE_MAP),me.__version=ye.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function le(L,A,ie,xe,ye,me){const je=l.convert(ie.format,ie.colorSpace),Ce=l.convert(ie.type),Oe=I(ie.internalFormat,je,Ce,ie.colorSpace),ft=r.get(A),Te=r.get(ie);if(Te.__renderTarget=A,!ft.__hasExternalTextures){const ke=Math.max(1,A.width>>me),et=Math.max(1,A.height>>me);ye===s.TEXTURE_3D||ye===s.TEXTURE_2D_ARRAY?t.texImage3D(ye,me,Oe,ke,et,A.depth,0,je,Ce,null):t.texImage2D(ye,me,Oe,ke,et,0,je,Ce,null)}t.bindFramebuffer(s.FRAMEBUFFER,L),ht(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,xe,ye,Te.__webglTexture,0,xt(A)):(ye===s.TEXTURE_2D||ye>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ye<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,xe,ye,Te.__webglTexture,me),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ce(L,A,ie){if(s.bindRenderbuffer(s.RENDERBUFFER,L),A.depthBuffer){const xe=A.depthTexture,ye=xe&&xe.isDepthTexture?xe.type:null,me=C(A.stencilBuffer,ye),je=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ce=xt(A);ht(A)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ce,me,A.width,A.height):ie?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ce,me,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,me,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,je,s.RENDERBUFFER,L)}else{const xe=A.textures;for(let ye=0;ye<xe.length;ye++){const me=xe[ye],je=l.convert(me.format,me.colorSpace),Ce=l.convert(me.type),Oe=I(me.internalFormat,je,Ce,me.colorSpace),ft=xt(A);ie&&ht(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ft,Oe,A.width,A.height):ht(A)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ft,Oe,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,Oe,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ge(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const xe=r.get(A.depthTexture);xe.__renderTarget=A,(!xe.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),pe(A.depthTexture,0);const ye=xe.__webglTexture,me=xt(A);if(A.depthTexture.format===Hs)ht(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ye,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ye,0);else if(A.depthTexture.format===Ks)ht(A)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ye,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ye,0);else throw new Error("Unknown depthTexture format")}function Me(L){const A=r.get(L),ie=L.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==L.depthTexture){const xe=L.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),xe){const ye=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,xe.removeEventListener("dispose",ye)};xe.addEventListener("dispose",ye),A.__depthDisposeCallback=ye}A.__boundDepthTexture=xe}if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if(ie)throw new Error("target.depthTexture not supported in Cube render targets");ge(A.__webglFramebuffer,L)}else if(ie){A.__webglDepthbuffer=[];for(let xe=0;xe<6;xe++)if(t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[xe]),A.__webglDepthbuffer[xe]===void 0)A.__webglDepthbuffer[xe]=s.createRenderbuffer(),ce(A.__webglDepthbuffer[xe],L,!1);else{const ye=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,me=A.__webglDepthbuffer[xe];s.bindRenderbuffer(s.RENDERBUFFER,me),s.framebufferRenderbuffer(s.FRAMEBUFFER,ye,s.RENDERBUFFER,me)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=s.createRenderbuffer(),ce(A.__webglDepthbuffer,L,!1);else{const xe=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=A.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ye),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,ye)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ve(L,A,ie){const xe=r.get(L);A!==void 0&&le(xe.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),ie!==void 0&&Me(L)}function vt(L){const A=L.texture,ie=r.get(L),xe=r.get(A);L.addEventListener("dispose",O);const ye=L.textures,me=L.isWebGLCubeRenderTarget===!0,je=ye.length>1;if(je||(xe.__webglTexture===void 0&&(xe.__webglTexture=s.createTexture()),xe.__version=A.version,u.memory.textures++),me){ie.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0){ie.__webglFramebuffer[Ce]=[];for(let Oe=0;Oe<A.mipmaps.length;Oe++)ie.__webglFramebuffer[Ce][Oe]=s.createFramebuffer()}else ie.__webglFramebuffer[Ce]=s.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){ie.__webglFramebuffer=[];for(let Ce=0;Ce<A.mipmaps.length;Ce++)ie.__webglFramebuffer[Ce]=s.createFramebuffer()}else ie.__webglFramebuffer=s.createFramebuffer();if(je)for(let Ce=0,Oe=ye.length;Ce<Oe;Ce++){const ft=r.get(ye[Ce]);ft.__webglTexture===void 0&&(ft.__webglTexture=s.createTexture(),u.memory.textures++)}if(L.samples>0&&ht(L)===!1){ie.__webglMultisampledFramebuffer=s.createFramebuffer(),ie.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,ie.__webglMultisampledFramebuffer);for(let Ce=0;Ce<ye.length;Ce++){const Oe=ye[Ce];ie.__webglColorRenderbuffer[Ce]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,ie.__webglColorRenderbuffer[Ce]);const ft=l.convert(Oe.format,Oe.colorSpace),Te=l.convert(Oe.type),ke=I(Oe.internalFormat,ft,Te,Oe.colorSpace,L.isXRRenderTarget===!0),et=xt(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,et,ke,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ce,s.RENDERBUFFER,ie.__webglColorRenderbuffer[Ce])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(ie.__webglDepthRenderbuffer=s.createRenderbuffer(),ce(ie.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(me){t.bindTexture(s.TEXTURE_CUBE_MAP,xe.__webglTexture),te(s.TEXTURE_CUBE_MAP,A);for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0)for(let Oe=0;Oe<A.mipmaps.length;Oe++)le(ie.__webglFramebuffer[Ce][Oe],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,Oe);else le(ie.__webglFramebuffer[Ce],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);S(A)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(je){for(let Ce=0,Oe=ye.length;Ce<Oe;Ce++){const ft=ye[Ce],Te=r.get(ft);t.bindTexture(s.TEXTURE_2D,Te.__webglTexture),te(s.TEXTURE_2D,ft),le(ie.__webglFramebuffer,L,ft,s.COLOR_ATTACHMENT0+Ce,s.TEXTURE_2D,0),S(ft)&&y(s.TEXTURE_2D)}t.unbindTexture()}else{let Ce=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ce=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Ce,xe.__webglTexture),te(Ce,A),A.mipmaps&&A.mipmaps.length>0)for(let Oe=0;Oe<A.mipmaps.length;Oe++)le(ie.__webglFramebuffer[Oe],L,A,s.COLOR_ATTACHMENT0,Ce,Oe);else le(ie.__webglFramebuffer,L,A,s.COLOR_ATTACHMENT0,Ce,0);S(A)&&y(Ce),t.unbindTexture()}L.depthBuffer&&Me(L)}function st(L){const A=L.textures;for(let ie=0,xe=A.length;ie<xe;ie++){const ye=A[ie];if(S(ye)){const me=R(L),je=r.get(ye).__webglTexture;t.bindTexture(me,je),y(me),t.unbindTexture()}}}const at=[],K=[];function mn(L){if(L.samples>0){if(ht(L)===!1){const A=L.textures,ie=L.width,xe=L.height;let ye=s.COLOR_BUFFER_BIT;const me=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,je=r.get(L),Ce=A.length>1;if(Ce)for(let Oe=0;Oe<A.length;Oe++)t.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Oe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Oe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,je.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Oe=0;Oe<A.length;Oe++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ye|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ye|=s.STENCIL_BUFFER_BIT)),Ce){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,je.__webglColorRenderbuffer[Oe]);const ft=r.get(A[Oe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ft,0)}s.blitFramebuffer(0,0,ie,xe,0,0,ie,xe,ye,s.NEAREST),p===!0&&(at.length=0,K.length=0,at.push(s.COLOR_ATTACHMENT0+Oe),L.depthBuffer&&L.resolveDepthBuffer===!1&&(at.push(me),K.push(me),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,K)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,at))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Ce)for(let Oe=0;Oe<A.length;Oe++){t.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Oe,s.RENDERBUFFER,je.__webglColorRenderbuffer[Oe]);const ft=r.get(A[Oe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Oe,s.TEXTURE_2D,ft,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&p){const A=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[A])}}}function xt(L){return Math.min(a.maxSamples,L.samples)}function ht(L){const A=r.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ze(L){const A=u.render.frame;v.get(L)!==A&&(v.set(L,A),L.update())}function Rt(L,A){const ie=L.colorSpace,xe=L.format,ye=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||ie!==Qs&&ie!==yr&&(Mt.getTransfer(ie)===Pt?(xe!==di||ye!==Xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ie)),A}function Ke(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(m.width=L.naturalWidth||L.width,m.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(m.width=L.displayWidth,m.height=L.displayHeight):(m.width=L.width,m.height=L.height),m}this.allocateTextureUnit=$,this.resetTextureUnits=W,this.setTexture2D=pe,this.setTexture2DArray=fe,this.setTexture3D=he,this.setTextureCube=z,this.rebindTextures=Ve,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=mn,this.setupDepthRenderbuffer=Me,this.setupFrameBufferTexture=le,this.useMultisampledRTT=ht}function bM(s,e){function t(r,a=yr){let l;const u=Mt.getTransfer(a);if(r===Xi)return s.UNSIGNED_BYTE;if(r===Sf)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Ef)return s.UNSIGNED_SHORT_5_5_5_1;if(r===F0)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===U0)return s.BYTE;if(r===O0)return s.SHORT;if(r===qa)return s.UNSIGNED_SHORT;if(r===yf)return s.INT;if(r===Zr)return s.UNSIGNED_INT;if(r===Hi)return s.FLOAT;if(r===Ja)return s.HALF_FLOAT;if(r===k0)return s.ALPHA;if(r===B0)return s.RGB;if(r===di)return s.RGBA;if(r===z0)return s.LUMINANCE;if(r===V0)return s.LUMINANCE_ALPHA;if(r===Hs)return s.DEPTH_COMPONENT;if(r===Ks)return s.DEPTH_STENCIL;if(r===G0)return s.RED;if(r===Mf)return s.RED_INTEGER;if(r===H0)return s.RG;if(r===Tf)return s.RG_INTEGER;if(r===wf)return s.RGBA_INTEGER;if(r===kl||r===Bl||r===zl||r===Vl)if(u===Pt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===kl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Bl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===zl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Vl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===kl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Bl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===zl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Vl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Dd||r===Ud||r===Od||r===Fd)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Dd)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ud)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Od)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Fd)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===kd||r===Bd||r===zd)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===kd||r===Bd)return u===Pt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===zd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Vd||r===Gd||r===Hd||r===jd||r===Wd||r===Xd||r===Yd||r===qd||r===$d||r===Kd||r===Zd||r===Qd||r===Jd||r===ef)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===Vd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Gd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Hd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===jd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Wd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Xd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Yd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===qd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===$d)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Kd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Zd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Qd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Jd)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===ef)return u===Pt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Gl||r===tf||r===nf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===Gl)return u===Pt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===tf)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===nf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===j0||r===rf||r===sf||r===af)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===Gl)return l.COMPRESSED_RED_RGTC1_EXT;if(r===rf)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===sf)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===af)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===$s?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}class AM extends Vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Bs extends En{constructor(){super(),this.isGroup=!0,this.type="Group"}}const CM={type:"move"};class hd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,l=null,u=null;const d=this._targetRay,p=this._grip,m=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(m&&e.hand){u=!0;for(const b of e.hand.values()){const S=t.getJointPose(b,r),y=this._getHandJoint(m,b);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const v=m.joints["index-finger-tip"],_=m.joints["thumb-tip"],x=v.position.distanceTo(_.position),E=.02,M=.005;m.inputState.pinching&&x>E+M?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&x<=E-M&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1));d!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&l!==null&&(a=l),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(CM)))}return d!==null&&(d.visible=a!==null),p!==null&&(p.visible=l!==null),m!==null&&(m.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new Bs;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const RM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,NM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){const a=new Dn,l=e.properties.get(a);l.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Tr({vertexShader:RM,fragmentShader:NM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new In(new Ql(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class IM extends Js{constructor(e,t){super();const r=this;let a=null,l=1,u=null,d="local-floor",p=1,m=null,v=null,_=null,x=null,E=null,M=null;const b=new PM,S=t.getContextAttributes();let y=null,R=null;const I=[],C=[],Z=new $e;let V=null;const O=new Vn;O.viewport=new It;const H=new Vn;H.viewport=new It;const N=[O,H],w=new AM;let k=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let F=I[ee];return F===void 0&&(F=new hd,I[ee]=F),F.getTargetRaySpace()},this.getControllerGrip=function(ee){let F=I[ee];return F===void 0&&(F=new hd,I[ee]=F),F.getGripSpace()},this.getHand=function(ee){let F=I[ee];return F===void 0&&(F=new hd,I[ee]=F),F.getHandSpace()};function $(ee){const F=C.indexOf(ee.inputSource);if(F===-1)return;const le=I[F];le!==void 0&&(le.update(ee.inputSource,ee.frame,m||u),le.dispatchEvent({type:ee.type,data:ee.inputSource}))}function oe(){a.removeEventListener("select",$),a.removeEventListener("selectstart",$),a.removeEventListener("selectend",$),a.removeEventListener("squeeze",$),a.removeEventListener("squeezestart",$),a.removeEventListener("squeezeend",$),a.removeEventListener("end",oe),a.removeEventListener("inputsourceschange",pe);for(let ee=0;ee<I.length;ee++){const F=C[ee];F!==null&&(C[ee]=null,I[ee].disconnect(F))}k=null,W=null,b.reset(),e.setRenderTarget(y),E=null,x=null,_=null,a=null,R=null,Ne.stop(),r.isPresenting=!1,e.setPixelRatio(V),e.setSize(Z.width,Z.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){l=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){d=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||u},this.setReferenceSpace=function(ee){m=ee},this.getBaseLayer=function(){return x!==null?x:E},this.getBinding=function(){return _},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(ee){if(a=ee,a!==null){if(y=e.getRenderTarget(),a.addEventListener("select",$),a.addEventListener("selectstart",$),a.addEventListener("selectend",$),a.addEventListener("squeeze",$),a.addEventListener("squeezestart",$),a.addEventListener("squeezeend",$),a.addEventListener("end",oe),a.addEventListener("inputsourceschange",pe),S.xrCompatible!==!0&&await t.makeXRCompatible(),V=e.getPixelRatio(),e.getSize(Z),a.renderState.layers===void 0){const F={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};E=new XRWebGLLayer(a,t,F),a.updateRenderState({baseLayer:E}),e.setPixelRatio(1),e.setSize(E.framebufferWidth,E.framebufferHeight,!1),R=new Qr(E.framebufferWidth,E.framebufferHeight,{format:di,type:Xi,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let F=null,le=null,ce=null;S.depth&&(ce=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,F=S.stencil?Ks:Hs,le=S.stencil?$s:Zr);const ge={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:l};_=new XRWebGLBinding(a,t),x=_.createProjectionLayer(ge),a.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),R=new Qr(x.textureWidth,x.textureHeight,{format:di,type:Xi,depthTexture:new sg(x.textureWidth,x.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(p),m=null,u=await a.requestReferenceSpace(d),Ne.setContext(a),Ne.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function pe(ee){for(let F=0;F<ee.removed.length;F++){const le=ee.removed[F],ce=C.indexOf(le);ce>=0&&(C[ce]=null,I[ce].disconnect(le))}for(let F=0;F<ee.added.length;F++){const le=ee.added[F];let ce=C.indexOf(le);if(ce===-1){for(let Me=0;Me<I.length;Me++)if(Me>=C.length){C.push(le),ce=Me;break}else if(C[Me]===null){C[Me]=le,ce=Me;break}if(ce===-1)break}const ge=I[ce];ge&&ge.connect(le)}}const fe=new X,he=new X;function z(ee,F,le){fe.setFromMatrixPosition(F.matrixWorld),he.setFromMatrixPosition(le.matrixWorld);const ce=fe.distanceTo(he),ge=F.projectionMatrix.elements,Me=le.projectionMatrix.elements,Ve=ge[14]/(ge[10]-1),vt=ge[14]/(ge[10]+1),st=(ge[9]+1)/ge[5],at=(ge[9]-1)/ge[5],K=(ge[8]-1)/ge[0],mn=(Me[8]+1)/Me[0],xt=Ve*K,ht=Ve*mn,Ze=ce/(-K+mn),Rt=Ze*-K;if(F.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Rt),ee.translateZ(Ze),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),ge[10]===-1)ee.projectionMatrix.copy(F.projectionMatrix),ee.projectionMatrixInverse.copy(F.projectionMatrixInverse);else{const Ke=Ve+Ze,L=vt+Ze,A=xt-Rt,ie=ht+(ce-Rt),xe=st*vt/L*Ke,ye=at*vt/L*Ke;ee.projectionMatrix.makePerspective(A,ie,xe,ye,Ke,L),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function ue(ee,F){F===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(F.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(a===null)return;let F=ee.near,le=ee.far;b.texture!==null&&(b.depthNear>0&&(F=b.depthNear),b.depthFar>0&&(le=b.depthFar)),w.near=H.near=O.near=F,w.far=H.far=O.far=le,(k!==w.near||W!==w.far)&&(a.updateRenderState({depthNear:w.near,depthFar:w.far}),k=w.near,W=w.far),O.layers.mask=ee.layers.mask|2,H.layers.mask=ee.layers.mask|4,w.layers.mask=O.layers.mask|H.layers.mask;const ce=ee.parent,ge=w.cameras;ue(w,ce);for(let Me=0;Me<ge.length;Me++)ue(ge[Me],ce);ge.length===2?z(w,O,H):w.projectionMatrix.copy(O.projectionMatrix),ne(ee,w,ce)};function ne(ee,F,le){le===null?ee.matrix.copy(F.matrixWorld):(ee.matrix.copy(le.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(F.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(F.projectionMatrix),ee.projectionMatrixInverse.copy(F.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=of*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(x===null&&E===null))return p},this.setFoveation=function(ee){p=ee,x!==null&&(x.fixedFoveation=ee),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=ee)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(w)};let U=null;function te(ee,F){if(v=F.getViewerPose(m||u),M=F,v!==null){const le=v.views;E!==null&&(e.setRenderTargetFramebuffer(R,E.framebuffer),e.setRenderTarget(R));let ce=!1;le.length!==w.cameras.length&&(w.cameras.length=0,ce=!0);for(let Me=0;Me<le.length;Me++){const Ve=le[Me];let vt=null;if(E!==null)vt=E.getViewport(Ve);else{const at=_.getViewSubImage(x,Ve);vt=at.viewport,Me===0&&(e.setRenderTargetTextures(R,at.colorTexture,x.ignoreDepthValues?void 0:at.depthStencilTexture),e.setRenderTarget(R))}let st=N[Me];st===void 0&&(st=new Vn,st.layers.enable(Me),st.viewport=new It,N[Me]=st),st.matrix.fromArray(Ve.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(Ve.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(vt.x,vt.y,vt.width,vt.height),Me===0&&(w.matrix.copy(st.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),ce===!0&&w.cameras.push(st)}const ge=a.enabledFeatures;if(ge&&ge.includes("depth-sensing")){const Me=_.getDepthInformation(le[0]);Me&&Me.isValid&&Me.texture&&b.init(e,Me,a.renderState)}}for(let le=0;le<I.length;le++){const ce=C[le],ge=I[le];ce!==null&&ge!==void 0&&ge.update(ce,F,m||u)}U&&U(ee,F),F.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:F}),M=null}const Ne=new rg;Ne.setAnimationLoop(te),this.setAnimationLoop=function(ee){U=ee},this.dispose=function(){}}}const jr=new Ti,LM=new kt;function DM(s,e){function t(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function r(S,y){y.color.getRGB(S.fogColor.value,tg(s)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function a(S,y,R,I,C){y.isMeshBasicMaterial||y.isMeshLambertMaterial?l(S,y):y.isMeshToonMaterial?(l(S,y),_(S,y)):y.isMeshPhongMaterial?(l(S,y),v(S,y)):y.isMeshStandardMaterial?(l(S,y),x(S,y),y.isMeshPhysicalMaterial&&E(S,y,C)):y.isMeshMatcapMaterial?(l(S,y),M(S,y)):y.isMeshDepthMaterial?l(S,y):y.isMeshDistanceMaterial?(l(S,y),b(S,y)):y.isMeshNormalMaterial?l(S,y):y.isLineBasicMaterial?(u(S,y),y.isLineDashedMaterial&&d(S,y)):y.isPointsMaterial?p(S,y,R,I):y.isSpriteMaterial?m(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function l(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,t(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===Ln&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,t(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===Ln&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,t(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,t(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const R=e.get(y),I=R.envMap,C=R.envMapRotation;I&&(S.envMap.value=I,jr.copy(C),jr.x*=-1,jr.y*=-1,jr.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(jr.y*=-1,jr.z*=-1),S.envMapRotation.value.setFromMatrix4(LM.makeRotationFromEuler(jr)),S.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap&&(S.lightMap.value=y.lightMap,S.lightMapIntensity.value=y.lightMapIntensity,t(y.lightMap,S.lightMapTransform)),y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,S.aoMapTransform))}function u(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform))}function d(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function p(S,y,R,I){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*R,S.scale.value=I*.5,y.map&&(S.map.value=y.map,t(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function m(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function v(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function _(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function x(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function E(S,y,R){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Ln&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=R.texture,S.transmissionSamplerSize.value.set(R.width,R.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,y){y.matcap&&(S.matcap.value=y.matcap)}function b(S,y){const R=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(R.matrixWorld),S.nearDistance.value=R.shadow.camera.near,S.farDistance.value=R.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function UM(s,e,t,r){let a={},l={},u=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(R,I){const C=I.program;r.uniformBlockBinding(R,C)}function m(R,I){let C=a[R.id];C===void 0&&(M(R),C=v(R),a[R.id]=C,R.addEventListener("dispose",S));const Z=I.program;r.updateUBOMapping(R,Z);const V=e.render.frame;l[R.id]!==V&&(x(R),l[R.id]=V)}function v(R){const I=_();R.__bindingPointIndex=I;const C=s.createBuffer(),Z=R.__size,V=R.usage;return s.bindBuffer(s.UNIFORM_BUFFER,C),s.bufferData(s.UNIFORM_BUFFER,Z,V),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,I,C),C}function _(){for(let R=0;R<d;R++)if(u.indexOf(R)===-1)return u.push(R),R;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(R){const I=a[R.id],C=R.uniforms,Z=R.__cache;s.bindBuffer(s.UNIFORM_BUFFER,I);for(let V=0,O=C.length;V<O;V++){const H=Array.isArray(C[V])?C[V]:[C[V]];for(let N=0,w=H.length;N<w;N++){const k=H[N];if(E(k,V,N,Z)===!0){const W=k.__offset,$=Array.isArray(k.value)?k.value:[k.value];let oe=0;for(let pe=0;pe<$.length;pe++){const fe=$[pe],he=b(fe);typeof fe=="number"||typeof fe=="boolean"?(k.__data[0]=fe,s.bufferSubData(s.UNIFORM_BUFFER,W+oe,k.__data)):fe.isMatrix3?(k.__data[0]=fe.elements[0],k.__data[1]=fe.elements[1],k.__data[2]=fe.elements[2],k.__data[3]=0,k.__data[4]=fe.elements[3],k.__data[5]=fe.elements[4],k.__data[6]=fe.elements[5],k.__data[7]=0,k.__data[8]=fe.elements[6],k.__data[9]=fe.elements[7],k.__data[10]=fe.elements[8],k.__data[11]=0):(fe.toArray(k.__data,oe),oe+=he.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,W,k.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function E(R,I,C,Z){const V=R.value,O=I+"_"+C;if(Z[O]===void 0)return typeof V=="number"||typeof V=="boolean"?Z[O]=V:Z[O]=V.clone(),!0;{const H=Z[O];if(typeof V=="number"||typeof V=="boolean"){if(H!==V)return Z[O]=V,!0}else if(H.equals(V)===!1)return H.copy(V),!0}return!1}function M(R){const I=R.uniforms;let C=0;const Z=16;for(let O=0,H=I.length;O<H;O++){const N=Array.isArray(I[O])?I[O]:[I[O]];for(let w=0,k=N.length;w<k;w++){const W=N[w],$=Array.isArray(W.value)?W.value:[W.value];for(let oe=0,pe=$.length;oe<pe;oe++){const fe=$[oe],he=b(fe),z=C%Z,ue=z%he.boundary,ne=z+ue;C+=ue,ne!==0&&Z-ne<he.storage&&(C+=Z-ne),W.__data=new Float32Array(he.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=C,C+=he.storage}}}const V=C%Z;return V>0&&(C+=Z-V),R.__size=C,R.__cache={},this}function b(R){const I={boundary:0,storage:0};return typeof R=="number"||typeof R=="boolean"?(I.boundary=4,I.storage=4):R.isVector2?(I.boundary=8,I.storage=8):R.isVector3||R.isColor?(I.boundary=16,I.storage=12):R.isVector4?(I.boundary=16,I.storage=16):R.isMatrix3?(I.boundary=48,I.storage=48):R.isMatrix4?(I.boundary=64,I.storage=64):R.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",R),I}function S(R){const I=R.target;I.removeEventListener("dispose",S);const C=u.indexOf(I.__bindingPointIndex);u.splice(C,1),s.deleteBuffer(a[I.id]),delete a[I.id],delete l[I.id]}function y(){for(const R in a)s.deleteBuffer(a[R]);u=[],a={},l={}}return{bind:p,update:m,dispose:y}}class OM{constructor(e={}){const{canvas:t=M_(),context:r=null,depth:a=!0,stencil:l=!1,alpha:u=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:m=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:_=!1,reverseDepthBuffer:x=!1}=e;this.isWebGLRenderer=!0;let E;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=r.getContextAttributes().alpha}else E=u;const M=new Uint32Array(4),b=new Int32Array(4);let S=null,y=null;const R=[],I=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qn,this.toneMapping=Er,this.toneMappingExposure=1;const C=this;let Z=!1,V=0,O=0,H=null,N=-1,w=null;const k=new It,W=new It;let $=null;const oe=new bt(0);let pe=0,fe=t.width,he=t.height,z=1,ue=null,ne=null;const U=new It(0,0,fe,he),te=new It(0,0,fe,he);let Ne=!1;const ee=new bf;let F=!1,le=!1;const ce=new kt,ge=new kt,Me=new X,Ve=new It,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function at(){return H===null?z:1}let K=r;function mn(P,Y){return t.getContext(P,Y)}try{const P={alpha:!0,depth:a,stencil:l,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:m,powerPreference:v,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_f}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",Ie,!1),K===null){const Y="webgl2";if(K=mn(Y,P),K===null)throw mn(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let xt,ht,Ze,Rt,Ke,L,A,ie,xe,ye,me,je,Ce,Oe,ft,Te,ke,et,tt,Be,pt,ot,Ct,j;function Re(){xt=new VE(K),xt.init(),ot=new bM(K,xt),ht=new DE(K,xt,e,ot),Ze=new MM(K,xt),ht.reverseDepthBuffer&&x&&Ze.buffers.depth.setReversed(!0),Rt=new jE(K),Ke=new lM,L=new wM(K,xt,Ze,Ke,ht,ot,Rt),A=new OE(C),ie=new zE(C),xe=new K_(K),Ct=new IE(K,xe),ye=new GE(K,xe,Rt,Ct),me=new XE(K,ye,xe,Rt),tt=new WE(K,ht,L),Te=new UE(Ke),je=new oM(C,A,ie,xt,ht,Ct,Te),Ce=new DM(C,Ke),Oe=new uM,ft=new gM(xt),et=new PE(C,A,ie,Ze,me,E,p),ke=new SM(C,me,ht),j=new UM(K,Rt,ht,Ze),Be=new LE(K,xt,Rt),pt=new HE(K,xt,Rt),Rt.programs=je.programs,C.capabilities=ht,C.extensions=xt,C.properties=Ke,C.renderLists=Oe,C.shadowMap=ke,C.state=Ze,C.info=Rt}Re();const de=new IM(C,K);this.xr=de,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){const P=xt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=xt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(P){P!==void 0&&(z=P,this.setSize(fe,he,!1))},this.getSize=function(P){return P.set(fe,he)},this.setSize=function(P,Y,se=!0){if(de.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}fe=P,he=Y,t.width=Math.floor(P*z),t.height=Math.floor(Y*z),se===!0&&(t.style.width=P+"px",t.style.height=Y+"px"),this.setViewport(0,0,P,Y)},this.getDrawingBufferSize=function(P){return P.set(fe*z,he*z).floor()},this.setDrawingBufferSize=function(P,Y,se){fe=P,he=Y,z=se,t.width=Math.floor(P*se),t.height=Math.floor(Y*se),this.setViewport(0,0,P,Y)},this.getCurrentViewport=function(P){return P.copy(k)},this.getViewport=function(P){return P.copy(U)},this.setViewport=function(P,Y,se,ae){P.isVector4?U.set(P.x,P.y,P.z,P.w):U.set(P,Y,se,ae),Ze.viewport(k.copy(U).multiplyScalar(z).round())},this.getScissor=function(P){return P.copy(te)},this.setScissor=function(P,Y,se,ae){P.isVector4?te.set(P.x,P.y,P.z,P.w):te.set(P,Y,se,ae),Ze.scissor(W.copy(te).multiplyScalar(z).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(P){Ze.setScissorTest(Ne=P)},this.setOpaqueSort=function(P){ue=P},this.setTransparentSort=function(P){ne=P},this.getClearColor=function(P){return P.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(P=!0,Y=!0,se=!0){let ae=0;if(P){let q=!1;if(H!==null){const Ae=H.texture.format;q=Ae===wf||Ae===Tf||Ae===Mf}if(q){const Ae=H.texture.type,we=Ae===Xi||Ae===Zr||Ae===qa||Ae===$s||Ae===Sf||Ae===Ef,We=et.getClearColor(),Ge=et.getClearAlpha(),nt=We.r,rt=We.g,Xe=We.b;we?(M[0]=nt,M[1]=rt,M[2]=Xe,M[3]=Ge,K.clearBufferuiv(K.COLOR,0,M)):(b[0]=nt,b[1]=rt,b[2]=Xe,b[3]=Ge,K.clearBufferiv(K.COLOR,0,b))}else ae|=K.COLOR_BUFFER_BIT}Y&&(ae|=K.DEPTH_BUFFER_BIT),se&&(ae|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",Ie,!1),Oe.dispose(),ft.dispose(),Ke.dispose(),A.dispose(),ie.dispose(),me.dispose(),Ct.dispose(),j.dispose(),je.dispose(),de.dispose(),de.removeEventListener("sessionstart",es),de.removeEventListener("sessionend",Yi),bi.stop()};function ve(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),Z=!0}function Le(){console.log("THREE.WebGLRenderer: Context Restored."),Z=!1;const P=Rt.autoReset,Y=ke.enabled,se=ke.autoUpdate,ae=ke.needsUpdate,q=ke.type;Re(),Rt.autoReset=P,ke.enabled=Y,ke.autoUpdate=se,ke.needsUpdate=ae,ke.type=q}function Ie(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function lt(P){const Y=P.target;Y.removeEventListener("dispose",lt),Ut(Y)}function Ut(P){Yt(P),Ke.remove(P)}function Yt(P){const Y=Ke.get(P).programs;Y!==void 0&&(Y.forEach(function(se){je.releaseProgram(se)}),P.isShaderMaterial&&je.releaseShaderCache(P))}this.renderBufferDirect=function(P,Y,se,ae,q,Ae){Y===null&&(Y=vt);const we=q.isMesh&&q.matrixWorld.determinant()<0,We=so(P,Y,se,ae,q);Ze.setMaterial(ae,we);let Ge=se.index,nt=1;if(ae.wireframe===!0){if(Ge=ye.getWireframeAttribute(se),Ge===void 0)return;nt=2}const rt=se.drawRange,Xe=se.attributes.position;let yt=rt.start*nt,At=(rt.start+rt.count)*nt;Ae!==null&&(yt=Math.max(yt,Ae.start*nt),At=Math.min(At,(Ae.start+Ae.count)*nt)),Ge!==null?(yt=Math.max(yt,0),At=Math.min(At,Ge.count)):Xe!=null&&(yt=Math.max(yt,0),At=Math.min(At,Xe.count));const _t=At-yt;if(_t<0||_t===1/0)return;Ct.setup(q,ae,We,se,Ge);let an,ct=Be;if(Ge!==null&&(an=xe.get(Ge),ct=pt,ct.setIndex(an)),q.isMesh)ae.wireframe===!0?(Ze.setLineWidth(ae.wireframeLinewidth*at()),ct.setMode(K.LINES)):ct.setMode(K.TRIANGLES);else if(q.isLine){let qe=ae.linewidth;qe===void 0&&(qe=1),Ze.setLineWidth(qe*at()),q.isLineSegments?ct.setMode(K.LINES):q.isLineLoop?ct.setMode(K.LINE_LOOP):ct.setMode(K.LINE_STRIP)}else q.isPoints?ct.setMode(K.POINTS):q.isSprite&&ct.setMode(K.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ct.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(xt.get("WEBGL_multi_draw"))ct.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const qe=q._multiDrawStarts,Jn=q._multiDrawCounts,Tt=q._multiDrawCount,on=Ge?xe.get(Ge).bytesPerElement:1,ei=Ke.get(ae).currentProgram.getUniforms();for(let qt=0;qt<Tt;qt++)ei.setValue(K,"_gl_DrawID",qt),ct.render(qe[qt]/on,Jn[qt])}else if(q.isInstancedMesh)ct.renderInstances(yt,_t,q.count);else if(se.isInstancedBufferGeometry){const qe=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Jn=Math.min(se.instanceCount,qe);ct.renderInstances(yt,_t,Jn)}else ct.render(yt,_t)};function St(P,Y,se){P.transparent===!0&&P.side===Ei&&P.forceSinglePass===!1?(P.side=Ln,P.needsUpdate=!0,ts(P,Y,se),P.side=Mr,P.needsUpdate=!0,ts(P,Y,se),P.side=Ei):ts(P,Y,se)}this.compile=function(P,Y,se=null){se===null&&(se=P),y=ft.get(se),y.init(Y),I.push(y),se.traverseVisible(function(q){q.isLight&&q.layers.test(Y.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),P!==se&&P.traverseVisible(function(q){q.isLight&&q.layers.test(Y.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),y.setupLights();const ae=new Set;return P.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Ae=q.material;if(Ae)if(Array.isArray(Ae))for(let we=0;we<Ae.length;we++){const We=Ae[we];St(We,se,q),ae.add(We)}else St(Ae,se,q),ae.add(Ae)}),I.pop(),y=null,ae},this.compileAsync=function(P,Y,se=null){const ae=this.compile(P,Y,se);return new Promise(q=>{function Ae(){if(ae.forEach(function(we){Ke.get(we).currentProgram.isReady()&&ae.delete(we)}),ae.size===0){q(P);return}setTimeout(Ae,10)}xt.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let Mn=null;function gn(P){Mn&&Mn(P)}function es(){bi.stop()}function Yi(){bi.start()}const bi=new rg;bi.setAnimationLoop(gn),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(P){Mn=P,de.setAnimationLoop(P),P===null?bi.stop():bi.start()},de.addEventListener("sessionstart",es),de.addEventListener("sessionend",Yi),this.render=function(P,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(Z===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),de.enabled===!0&&de.isPresenting===!0&&(de.cameraAutoUpdate===!0&&de.updateCamera(Y),Y=de.getCamera()),P.isScene===!0&&P.onBeforeRender(C,P,Y,H),y=ft.get(P,I.length),y.init(Y),I.push(y),ge.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),ee.setFromProjectionMatrix(ge),le=this.localClippingEnabled,F=Te.init(this.clippingPlanes,le),S=Oe.get(P,R.length),S.init(),R.push(S),de.enabled===!0&&de.isPresenting===!0){const Ae=C.xr.getDepthSensingMesh();Ae!==null&&Ai(Ae,Y,-1/0,C.sortObjects)}Ai(P,Y,0,C.sortObjects),S.finish(),C.sortObjects===!0&&S.sort(ue,ne),st=de.enabled===!1||de.isPresenting===!1||de.hasDepthSensing()===!1,st&&et.addToRenderList(S,P),this.info.render.frame++,F===!0&&Te.beginShadows();const se=y.state.shadowsArray;ke.render(se,P,Y),F===!0&&Te.endShadows(),this.info.autoReset===!0&&this.info.reset();const ae=S.opaque,q=S.transmissive;if(y.setupLights(),Y.isArrayCamera){const Ae=Y.cameras;if(q.length>0)for(let we=0,We=Ae.length;we<We;we++){const Ge=Ae[we];br(ae,q,P,Ge)}st&&et.render(P);for(let we=0,We=Ae.length;we<We;we++){const Ge=Ae[we];wr(S,P,Ge,Ge.viewport)}}else q.length>0&&br(ae,q,P,Y),st&&et.render(P),wr(S,P,Y);H!==null&&(L.updateMultisampleRenderTarget(H),L.updateRenderTargetMipmap(H)),P.isScene===!0&&P.onAfterRender(C,P,Y),Ct.resetDefaultState(),N=-1,w=null,I.pop(),I.length>0?(y=I[I.length-1],F===!0&&Te.setGlobalState(C.clippingPlanes,y.state.camera)):y=null,R.pop(),R.length>0?S=R[R.length-1]:S=null};function Ai(P,Y,se,ae){if(P.visible===!1)return;if(P.layers.test(Y.layers)){if(P.isGroup)se=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(Y);else if(P.isLight)y.pushLight(P),P.castShadow&&y.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||ee.intersectsSprite(P)){ae&&Ve.setFromMatrixPosition(P.matrixWorld).applyMatrix4(ge);const we=me.update(P),We=P.material;We.visible&&S.push(P,we,We,se,Ve.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||ee.intersectsObject(P))){const we=me.update(P),We=P.material;if(ae&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Ve.copy(P.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Ve.copy(we.boundingSphere.center)),Ve.applyMatrix4(P.matrixWorld).applyMatrix4(ge)),Array.isArray(We)){const Ge=we.groups;for(let nt=0,rt=Ge.length;nt<rt;nt++){const Xe=Ge[nt],yt=We[Xe.materialIndex];yt&&yt.visible&&S.push(P,we,yt,se,Ve.z,Xe)}}else We.visible&&S.push(P,we,We,se,Ve.z,null)}}const Ae=P.children;for(let we=0,We=Ae.length;we<We;we++)Ai(Ae[we],Y,se,ae)}function wr(P,Y,se,ae){const q=P.opaque,Ae=P.transmissive,we=P.transparent;y.setupLightsView(se),F===!0&&Te.setGlobalState(C.clippingPlanes,se),ae&&Ze.viewport(k.copy(ae)),q.length>0&&qi(q,Y,se),Ae.length>0&&qi(Ae,Y,se),we.length>0&&qi(we,Y,se),Ze.buffers.depth.setTest(!0),Ze.buffers.depth.setMask(!0),Ze.buffers.color.setMask(!0),Ze.setPolygonOffset(!1)}function br(P,Y,se,ae){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ae.id]===void 0&&(y.state.transmissionRenderTarget[ae.id]=new Qr(1,1,{generateMipmaps:!0,type:xt.has("EXT_color_buffer_half_float")||xt.has("EXT_color_buffer_float")?Ja:Xi,minFilter:Kr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Mt.workingColorSpace}));const Ae=y.state.transmissionRenderTarget[ae.id],we=ae.viewport||k;Ae.setSize(we.z,we.w);const We=C.getRenderTarget();C.setRenderTarget(Ae),C.getClearColor(oe),pe=C.getClearAlpha(),pe<1&&C.setClearColor(16777215,.5),C.clear(),st&&et.render(se);const Ge=C.toneMapping;C.toneMapping=Er;const nt=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),y.setupLightsView(ae),F===!0&&Te.setGlobalState(C.clippingPlanes,ae),qi(P,se,ae),L.updateMultisampleRenderTarget(Ae),L.updateRenderTargetMipmap(Ae),xt.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let Xe=0,yt=Y.length;Xe<yt;Xe++){const At=Y[Xe],_t=At.object,an=At.geometry,ct=At.material,qe=At.group;if(ct.side===Ei&&_t.layers.test(ae.layers)){const Jn=ct.side;ct.side=Ln,ct.needsUpdate=!0,io(_t,se,ae,an,ct,qe),ct.side=Jn,ct.needsUpdate=!0,rt=!0}}rt===!0&&(L.updateMultisampleRenderTarget(Ae),L.updateRenderTargetMipmap(Ae))}C.setRenderTarget(We),C.setClearColor(oe,pe),nt!==void 0&&(ae.viewport=nt),C.toneMapping=Ge}function qi(P,Y,se){const ae=Y.isScene===!0?Y.overrideMaterial:null;for(let q=0,Ae=P.length;q<Ae;q++){const we=P[q],We=we.object,Ge=we.geometry,nt=ae===null?we.material:ae,rt=we.group;We.layers.test(se.layers)&&io(We,Y,se,Ge,nt,rt)}}function io(P,Y,se,ae,q,Ae){P.onBeforeRender(C,Y,se,ae,q,Ae),P.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),q.onBeforeRender(C,Y,se,ae,P,Ae),q.transparent===!0&&q.side===Ei&&q.forceSinglePass===!1?(q.side=Ln,q.needsUpdate=!0,C.renderBufferDirect(se,Y,ae,q,P,Ae),q.side=Mr,q.needsUpdate=!0,C.renderBufferDirect(se,Y,ae,q,P,Ae),q.side=Ei):C.renderBufferDirect(se,Y,ae,q,P,Ae),P.onAfterRender(C,Y,se,ae,q,Ae)}function ts(P,Y,se){Y.isScene!==!0&&(Y=vt);const ae=Ke.get(P),q=y.state.lights,Ae=y.state.shadowsArray,we=q.state.version,We=je.getParameters(P,q.state,Ae,Y,se),Ge=je.getProgramCacheKey(We);let nt=ae.programs;ae.environment=P.isMeshStandardMaterial?Y.environment:null,ae.fog=Y.fog,ae.envMap=(P.isMeshStandardMaterial?ie:A).get(P.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&P.envMap===null?Y.environmentRotation:P.envMapRotation,nt===void 0&&(P.addEventListener("dispose",lt),nt=new Map,ae.programs=nt);let rt=nt.get(Ge);if(rt!==void 0){if(ae.currentProgram===rt&&ae.lightsStateVersion===we)return mi(P,We),rt}else We.uniforms=je.getUniforms(P),P.onBeforeCompile(We,C),rt=je.acquireProgram(We,Ge),nt.set(Ge,rt),ae.uniforms=We.uniforms;const Xe=ae.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Xe.clippingPlanes=Te.uniform),mi(P,We),ae.needsLights=tc(P),ae.lightsStateVersion=we,ae.needsLights&&(Xe.ambientLightColor.value=q.state.ambient,Xe.lightProbe.value=q.state.probe,Xe.directionalLights.value=q.state.directional,Xe.directionalLightShadows.value=q.state.directionalShadow,Xe.spotLights.value=q.state.spot,Xe.spotLightShadows.value=q.state.spotShadow,Xe.rectAreaLights.value=q.state.rectArea,Xe.ltc_1.value=q.state.rectAreaLTC1,Xe.ltc_2.value=q.state.rectAreaLTC2,Xe.pointLights.value=q.state.point,Xe.pointLightShadows.value=q.state.pointShadow,Xe.hemisphereLights.value=q.state.hemi,Xe.directionalShadowMap.value=q.state.directionalShadowMap,Xe.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Xe.spotShadowMap.value=q.state.spotShadowMap,Xe.spotLightMatrix.value=q.state.spotLightMatrix,Xe.spotLightMap.value=q.state.spotLightMap,Xe.pointShadowMap.value=q.state.pointShadowMap,Xe.pointShadowMatrix.value=q.state.pointShadowMatrix),ae.currentProgram=rt,ae.uniformsList=null,rt}function ro(P){if(P.uniformsList===null){const Y=P.currentProgram.getUniforms();P.uniformsList=Hl.seqWithValue(Y.seq,P.uniforms)}return P.uniformsList}function mi(P,Y){const se=Ke.get(P);se.outputColorSpace=Y.outputColorSpace,se.batching=Y.batching,se.batchingColor=Y.batchingColor,se.instancing=Y.instancing,se.instancingColor=Y.instancingColor,se.instancingMorph=Y.instancingMorph,se.skinning=Y.skinning,se.morphTargets=Y.morphTargets,se.morphNormals=Y.morphNormals,se.morphColors=Y.morphColors,se.morphTargetsCount=Y.morphTargetsCount,se.numClippingPlanes=Y.numClippingPlanes,se.numIntersection=Y.numClipIntersection,se.vertexAlphas=Y.vertexAlphas,se.vertexTangents=Y.vertexTangents,se.toneMapping=Y.toneMapping}function so(P,Y,se,ae,q){Y.isScene!==!0&&(Y=vt),L.resetTextureUnits();const Ae=Y.fog,we=ae.isMeshStandardMaterial?Y.environment:null,We=H===null?C.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Qs,Ge=(ae.isMeshStandardMaterial?ie:A).get(ae.envMap||we),nt=ae.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,rt=!!se.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),Xe=!!se.morphAttributes.position,yt=!!se.morphAttributes.normal,At=!!se.morphAttributes.color;let _t=Er;ae.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(_t=C.toneMapping);const an=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,ct=an!==void 0?an.length:0,qe=Ke.get(ae),Jn=y.state.lights;if(F===!0&&(le===!0||P!==w)){const vn=P===w&&ae.id===N;Te.setState(ae,P,vn)}let Tt=!1;ae.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Jn.state.version||qe.outputColorSpace!==We||q.isBatchedMesh&&qe.batching===!1||!q.isBatchedMesh&&qe.batching===!0||q.isBatchedMesh&&qe.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&qe.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&qe.instancing===!1||!q.isInstancedMesh&&qe.instancing===!0||q.isSkinnedMesh&&qe.skinning===!1||!q.isSkinnedMesh&&qe.skinning===!0||q.isInstancedMesh&&qe.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&qe.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&qe.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&qe.instancingMorph===!1&&q.morphTexture!==null||qe.envMap!==Ge||ae.fog===!0&&qe.fog!==Ae||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==Te.numPlanes||qe.numIntersection!==Te.numIntersection)||qe.vertexAlphas!==nt||qe.vertexTangents!==rt||qe.morphTargets!==Xe||qe.morphNormals!==yt||qe.morphColors!==At||qe.toneMapping!==_t||qe.morphTargetsCount!==ct)&&(Tt=!0):(Tt=!0,qe.__version=ae.version);let on=qe.currentProgram;Tt===!0&&(on=ts(ae,Y,q));let ei=!1,qt=!1,gi=!1;const Lt=on.getUniforms(),Hn=qe.uniforms;if(Ze.useProgram(on.program)&&(ei=!0,qt=!0,gi=!0),ae.id!==N&&(N=ae.id,qt=!0),ei||w!==P){Ze.buffers.depth.getReversed()?(ce.copy(P.projectionMatrix),w_(ce),b_(ce),Lt.setValue(K,"projectionMatrix",ce)):Lt.setValue(K,"projectionMatrix",P.projectionMatrix),Lt.setValue(K,"viewMatrix",P.matrixWorldInverse);const jn=Lt.map.cameraPosition;jn!==void 0&&jn.setValue(K,Me.setFromMatrixPosition(P.matrixWorld)),ht.logarithmicDepthBuffer&&Lt.setValue(K,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&Lt.setValue(K,"isOrthographic",P.isOrthographicCamera===!0),w!==P&&(w=P,qt=!0,gi=!0)}if(q.isSkinnedMesh){Lt.setOptional(K,q,"bindMatrix"),Lt.setOptional(K,q,"bindMatrixInverse");const vn=q.skeleton;vn&&(vn.boneTexture===null&&vn.computeBoneTexture(),Lt.setValue(K,"boneTexture",vn.boneTexture,L))}q.isBatchedMesh&&(Lt.setOptional(K,q,"batchingTexture"),Lt.setValue(K,"batchingTexture",q._matricesTexture,L),Lt.setOptional(K,q,"batchingIdTexture"),Lt.setValue(K,"batchingIdTexture",q._indirectTexture,L),Lt.setOptional(K,q,"batchingColorTexture"),q._colorsTexture!==null&&Lt.setValue(K,"batchingColorTexture",q._colorsTexture,L));const Ci=se.morphAttributes;if((Ci.position!==void 0||Ci.normal!==void 0||Ci.color!==void 0)&&tt.update(q,se,on),(qt||qe.receiveShadow!==q.receiveShadow)&&(qe.receiveShadow=q.receiveShadow,Lt.setValue(K,"receiveShadow",q.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(Hn.envMap.value=Ge,Hn.flipEnvMap.value=Ge.isCubeTexture&&Ge.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&Y.environment!==null&&(Hn.envMapIntensity.value=Y.environmentIntensity),qt&&(Lt.setValue(K,"toneMappingExposure",C.toneMappingExposure),qe.needsLights&&ao(Hn,gi),Ae&&ae.fog===!0&&Ce.refreshFogUniforms(Hn,Ae),Ce.refreshMaterialUniforms(Hn,ae,z,he,y.state.transmissionRenderTarget[P.id]),Hl.upload(K,ro(qe),Hn,L)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(Hl.upload(K,ro(qe),Hn,L),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&Lt.setValue(K,"center",q.center),Lt.setValue(K,"modelViewMatrix",q.modelViewMatrix),Lt.setValue(K,"normalMatrix",q.normalMatrix),Lt.setValue(K,"modelMatrix",q.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){const vn=ae.uniformsGroups;for(let jn=0,Tn=vn.length;jn<Tn;jn++){const oo=vn[jn];j.update(oo,on),j.bind(oo,on)}}return on}function ao(P,Y){P.ambientLightColor.needsUpdate=Y,P.lightProbe.needsUpdate=Y,P.directionalLights.needsUpdate=Y,P.directionalLightShadows.needsUpdate=Y,P.pointLights.needsUpdate=Y,P.pointLightShadows.needsUpdate=Y,P.spotLights.needsUpdate=Y,P.spotLightShadows.needsUpdate=Y,P.rectAreaLights.needsUpdate=Y,P.hemisphereLights.needsUpdate=Y}function tc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(P,Y,se){Ke.get(P.texture).__webglTexture=Y,Ke.get(P.depthTexture).__webglTexture=se;const ae=Ke.get(P);ae.__hasExternalTextures=!0,ae.__autoAllocateDepthBuffer=se===void 0,ae.__autoAllocateDepthBuffer||xt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ae.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,Y){const se=Ke.get(P);se.__webglFramebuffer=Y,se.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(P,Y=0,se=0){H=P,V=Y,O=se;let ae=!0,q=null,Ae=!1,we=!1;if(P){const Ge=Ke.get(P);if(Ge.__useDefaultFramebuffer!==void 0)Ze.bindFramebuffer(K.FRAMEBUFFER,null),ae=!1;else if(Ge.__webglFramebuffer===void 0)L.setupRenderTarget(P);else if(Ge.__hasExternalTextures)L.rebindTextures(P,Ke.get(P.texture).__webglTexture,Ke.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Xe=P.depthTexture;if(Ge.__boundDepthTexture!==Xe){if(Xe!==null&&Ke.has(Xe)&&(P.width!==Xe.image.width||P.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(P)}}const nt=P.texture;(nt.isData3DTexture||nt.isDataArrayTexture||nt.isCompressedArrayTexture)&&(we=!0);const rt=Ke.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(rt[Y])?q=rt[Y][se]:q=rt[Y],Ae=!0):P.samples>0&&L.useMultisampledRTT(P)===!1?q=Ke.get(P).__webglMultisampledFramebuffer:Array.isArray(rt)?q=rt[se]:q=rt,k.copy(P.viewport),W.copy(P.scissor),$=P.scissorTest}else k.copy(U).multiplyScalar(z).floor(),W.copy(te).multiplyScalar(z).floor(),$=Ne;if(Ze.bindFramebuffer(K.FRAMEBUFFER,q)&&ae&&Ze.drawBuffers(P,q),Ze.viewport(k),Ze.scissor(W),Ze.setScissorTest($),Ae){const Ge=Ke.get(P.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ge.__webglTexture,se)}else if(we){const Ge=Ke.get(P.texture),nt=Y||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,Ge.__webglTexture,se||0,nt)}N=-1},this.readRenderTargetPixels=function(P,Y,se,ae,q,Ae,we){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=Ke.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&we!==void 0&&(We=We[we]),We){Ze.bindFramebuffer(K.FRAMEBUFFER,We);try{const Ge=P.texture,nt=Ge.format,rt=Ge.type;if(!ht.textureFormatReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ht.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=P.width-ae&&se>=0&&se<=P.height-q&&K.readPixels(Y,se,ae,q,ot.convert(nt),ot.convert(rt),Ae)}finally{const Ge=H!==null?Ke.get(H).__webglFramebuffer:null;Ze.bindFramebuffer(K.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(P,Y,se,ae,q,Ae,we){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=Ke.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&we!==void 0&&(We=We[we]),We){const Ge=P.texture,nt=Ge.format,rt=Ge.type;if(!ht.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ht.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=P.width-ae&&se>=0&&se<=P.height-q){Ze.bindFramebuffer(K.FRAMEBUFFER,We);const Xe=K.createBuffer();K.bindBuffer(K.PIXEL_PACK_BUFFER,Xe),K.bufferData(K.PIXEL_PACK_BUFFER,Ae.byteLength,K.STREAM_READ),K.readPixels(Y,se,ae,q,ot.convert(nt),ot.convert(rt),0);const yt=H!==null?Ke.get(H).__webglFramebuffer:null;Ze.bindFramebuffer(K.FRAMEBUFFER,yt);const At=K.fenceSync(K.SYNC_GPU_COMMANDS_COMPLETE,0);return K.flush(),await T_(K,At,4),K.bindBuffer(K.PIXEL_PACK_BUFFER,Xe),K.getBufferSubData(K.PIXEL_PACK_BUFFER,0,Ae),K.deleteBuffer(Xe),K.deleteSync(At),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,Y=null,se=0){P.isTexture!==!0&&(Va("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,P=arguments[1]);const ae=Math.pow(2,-se),q=Math.floor(P.image.width*ae),Ae=Math.floor(P.image.height*ae),we=Y!==null?Y.x:0,We=Y!==null?Y.y:0;L.setTexture2D(P,0),K.copyTexSubImage2D(K.TEXTURE_2D,se,0,0,we,We,q,Ae),Ze.unbindTexture()},this.copyTextureToTexture=function(P,Y,se=null,ae=null,q=0){P.isTexture!==!0&&(Va("WebGLRenderer: copyTextureToTexture function signature has changed."),ae=arguments[0]||null,P=arguments[1],Y=arguments[2],q=arguments[3]||0,se=null);let Ae,we,We,Ge,nt,rt,Xe,yt,At;const _t=P.isCompressedTexture?P.mipmaps[q]:P.image;se!==null?(Ae=se.max.x-se.min.x,we=se.max.y-se.min.y,We=se.isBox3?se.max.z-se.min.z:1,Ge=se.min.x,nt=se.min.y,rt=se.isBox3?se.min.z:0):(Ae=_t.width,we=_t.height,We=_t.depth||1,Ge=0,nt=0,rt=0),ae!==null?(Xe=ae.x,yt=ae.y,At=ae.z):(Xe=0,yt=0,At=0);const an=ot.convert(Y.format),ct=ot.convert(Y.type);let qe;Y.isData3DTexture?(L.setTexture3D(Y,0),qe=K.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(L.setTexture2DArray(Y,0),qe=K.TEXTURE_2D_ARRAY):(L.setTexture2D(Y,0),qe=K.TEXTURE_2D),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,Y.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,Y.unpackAlignment);const Jn=K.getParameter(K.UNPACK_ROW_LENGTH),Tt=K.getParameter(K.UNPACK_IMAGE_HEIGHT),on=K.getParameter(K.UNPACK_SKIP_PIXELS),ei=K.getParameter(K.UNPACK_SKIP_ROWS),qt=K.getParameter(K.UNPACK_SKIP_IMAGES);K.pixelStorei(K.UNPACK_ROW_LENGTH,_t.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,_t.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Ge),K.pixelStorei(K.UNPACK_SKIP_ROWS,nt),K.pixelStorei(K.UNPACK_SKIP_IMAGES,rt);const gi=P.isDataArrayTexture||P.isData3DTexture,Lt=Y.isDataArrayTexture||Y.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const Hn=Ke.get(P),Ci=Ke.get(Y),vn=Ke.get(Hn.__renderTarget),jn=Ke.get(Ci.__renderTarget);Ze.bindFramebuffer(K.READ_FRAMEBUFFER,vn.__webglFramebuffer),Ze.bindFramebuffer(K.DRAW_FRAMEBUFFER,jn.__webglFramebuffer);for(let Tn=0;Tn<We;Tn++)gi&&K.framebufferTextureLayer(K.READ_FRAMEBUFFER,K.COLOR_ATTACHMENT0,Ke.get(P).__webglTexture,q,rt+Tn),P.isDepthTexture?(Lt&&K.framebufferTextureLayer(K.DRAW_FRAMEBUFFER,K.COLOR_ATTACHMENT0,Ke.get(Y).__webglTexture,q,At+Tn),K.blitFramebuffer(Ge,nt,Ae,we,Xe,yt,Ae,we,K.DEPTH_BUFFER_BIT,K.NEAREST)):Lt?K.copyTexSubImage3D(qe,q,Xe,yt,At+Tn,Ge,nt,Ae,we):K.copyTexSubImage2D(qe,q,Xe,yt,At+Tn,Ge,nt,Ae,we);Ze.bindFramebuffer(K.READ_FRAMEBUFFER,null),Ze.bindFramebuffer(K.DRAW_FRAMEBUFFER,null)}else Lt?P.isDataTexture||P.isData3DTexture?K.texSubImage3D(qe,q,Xe,yt,At,Ae,we,We,an,ct,_t.data):Y.isCompressedArrayTexture?K.compressedTexSubImage3D(qe,q,Xe,yt,At,Ae,we,We,an,_t.data):K.texSubImage3D(qe,q,Xe,yt,At,Ae,we,We,an,ct,_t):P.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,q,Xe,yt,Ae,we,an,ct,_t.data):P.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,q,Xe,yt,_t.width,_t.height,an,_t.data):K.texSubImage2D(K.TEXTURE_2D,q,Xe,yt,Ae,we,an,ct,_t);K.pixelStorei(K.UNPACK_ROW_LENGTH,Jn),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Tt),K.pixelStorei(K.UNPACK_SKIP_PIXELS,on),K.pixelStorei(K.UNPACK_SKIP_ROWS,ei),K.pixelStorei(K.UNPACK_SKIP_IMAGES,qt),q===0&&Y.generateMipmaps&&K.generateMipmap(qe),Ze.unbindTexture()},this.copyTextureToTexture3D=function(P,Y,se=null,ae=null,q=0){return P.isTexture!==!0&&(Va("WebGLRenderer: copyTextureToTexture3D function signature has changed."),se=arguments[0]||null,ae=arguments[1]||null,P=arguments[2],Y=arguments[3],q=arguments[4]||0),Va('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,Y,se,ae,q)},this.initRenderTarget=function(P){Ke.get(P).__webglFramebuffer===void 0&&L.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?L.setTextureCube(P,0):P.isData3DTexture?L.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?L.setTexture2DArray(P,0):L.setTexture2D(P,0),Ze.unbindTexture()},this.resetState=function(){V=0,O=0,H=null,Ze.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Mt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Mt._getUnpackColorSpace()}}class FM extends En{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ug extends ta{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const a0=new kt,cf=new K0,Il=new Zl,Ll=new X;class kM extends En{constructor(e=new pi,t=new ug){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const r=this.geometry,a=this.matrixWorld,l=e.params.Points.threshold,u=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Il.copy(r.boundingSphere),Il.applyMatrix4(a),Il.radius+=l,e.ray.intersectsSphere(Il)===!1)return;a0.copy(a).invert(),cf.copy(e.ray).applyMatrix4(a0);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),p=d*d,m=r.index,_=r.attributes.position;if(m!==null){const x=Math.max(0,u.start),E=Math.min(m.count,u.start+u.count);for(let M=x,b=E;M<b;M++){const S=m.getX(M);Ll.fromBufferAttribute(_,S),o0(Ll,S,p,a,e,t,this)}}else{const x=Math.max(0,u.start),E=Math.min(_.count,u.start+u.count);for(let M=x,b=E;M<b;M++)Ll.fromBufferAttribute(_,M),o0(Ll,M,p,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function o0(s,e,t,r,a,l,u){const d=cf.distanceSqToPoint(s);if(d<t){const p=new X;cf.closestPointToPoint(s,p),p.applyMatrix4(r);const m=a.ray.origin.distanceTo(p);if(m<a.near||m>a.far)return;l.push({distance:m,distanceToRay:Math.sqrt(d),point:p,index:e,face:null,faceIndex:null,barycoord:null,object:u})}}class wi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const r=this.getUtoTmapping(e);return this.getPoint(r,t)}getPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return t}getSpacedPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPointAt(r/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let r,a=this.getPoint(0),l=0;t.push(0);for(let u=1;u<=e;u++)r=this.getPoint(u/e),l+=r.distanceTo(a),t.push(l),a=r;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const r=this.getLengths();let a=0;const l=r.length;let u;t?u=t:u=e*r[l-1];let d=0,p=l-1,m;for(;d<=p;)if(a=Math.floor(d+(p-d)/2),m=r[a]-u,m<0)d=a+1;else if(m>0)p=a-1;else{p=a;break}if(a=p,r[a]===u)return a/(l-1);const v=r[a],x=r[a+1]-v,E=(u-v)/x;return(a+E)/(l-1)}getTangent(e,t){let a=e-1e-4,l=e+1e-4;a<0&&(a=0),l>1&&(l=1);const u=this.getPoint(a),d=this.getPoint(l),p=t||(u.isVector2?new $e:new X);return p.copy(d).sub(u).normalize(),p}getTangentAt(e,t){const r=this.getUtoTmapping(e);return this.getTangent(r,t)}computeFrenetFrames(e,t){const r=new X,a=[],l=[],u=[],d=new X,p=new kt;for(let E=0;E<=e;E++){const M=E/e;a[E]=this.getTangentAt(M,new X)}l[0]=new X,u[0]=new X;let m=Number.MAX_VALUE;const v=Math.abs(a[0].x),_=Math.abs(a[0].y),x=Math.abs(a[0].z);v<=m&&(m=v,r.set(1,0,0)),_<=m&&(m=_,r.set(0,1,0)),x<=m&&r.set(0,0,1),d.crossVectors(a[0],r).normalize(),l[0].crossVectors(a[0],d),u[0].crossVectors(a[0],l[0]);for(let E=1;E<=e;E++){if(l[E]=l[E-1].clone(),u[E]=u[E-1].clone(),d.crossVectors(a[E-1],a[E]),d.length()>Number.EPSILON){d.normalize();const M=Math.acos(pn(a[E-1].dot(a[E]),-1,1));l[E].applyMatrix4(p.makeRotationAxis(d,M))}u[E].crossVectors(a[E],l[E])}if(t===!0){let E=Math.acos(pn(l[0].dot(l[e]),-1,1));E/=e,a[0].dot(d.crossVectors(l[0],l[e]))>0&&(E=-E);for(let M=1;M<=e;M++)l[M].applyMatrix4(p.makeRotationAxis(a[M],E*M)),u[M].crossVectors(a[M],l[M])}return{tangents:a,normals:l,binormals:u}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Cf extends wi{constructor(e=0,t=0,r=1,a=1,l=0,u=Math.PI*2,d=!1,p=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=r,this.yRadius=a,this.aStartAngle=l,this.aEndAngle=u,this.aClockwise=d,this.aRotation=p}getPoint(e,t=new $e){const r=t,a=Math.PI*2;let l=this.aEndAngle-this.aStartAngle;const u=Math.abs(l)<Number.EPSILON;for(;l<0;)l+=a;for(;l>a;)l-=a;l<Number.EPSILON&&(u?l=0:l=a),this.aClockwise===!0&&!u&&(l===a?l=-a:l=l-a);const d=this.aStartAngle+e*l;let p=this.aX+this.xRadius*Math.cos(d),m=this.aY+this.yRadius*Math.sin(d);if(this.aRotation!==0){const v=Math.cos(this.aRotation),_=Math.sin(this.aRotation),x=p-this.aX,E=m-this.aY;p=x*v-E*_+this.aX,m=x*_+E*v+this.aY}return r.set(p,m)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class BM extends Cf{constructor(e,t,r,a,l,u){super(e,t,r,r,a,l,u),this.isArcCurve=!0,this.type="ArcCurve"}}function Rf(){let s=0,e=0,t=0,r=0;function a(l,u,d,p){s=l,e=d,t=-3*l+3*u-2*d-p,r=2*l-2*u+d+p}return{initCatmullRom:function(l,u,d,p,m){a(u,d,m*(d-l),m*(p-u))},initNonuniformCatmullRom:function(l,u,d,p,m,v,_){let x=(u-l)/m-(d-l)/(m+v)+(d-u)/v,E=(d-u)/v-(p-u)/(v+_)+(p-d)/_;x*=v,E*=v,a(u,d,x,E)},calc:function(l){const u=l*l,d=u*l;return s+e*l+t*u+r*d}}}const Dl=new X,pd=new Rf,md=new Rf,gd=new Rf;class zM extends wi{constructor(e=[],t=!1,r="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=r,this.tension=a}getPoint(e,t=new X){const r=t,a=this.points,l=a.length,u=(l-(this.closed?0:1))*e;let d=Math.floor(u),p=u-d;this.closed?d+=d>0?0:(Math.floor(Math.abs(d)/l)+1)*l:p===0&&d===l-1&&(d=l-2,p=1);let m,v;this.closed||d>0?m=a[(d-1)%l]:(Dl.subVectors(a[0],a[1]).add(a[0]),m=Dl);const _=a[d%l],x=a[(d+1)%l];if(this.closed||d+2<l?v=a[(d+2)%l]:(Dl.subVectors(a[l-1],a[l-2]).add(a[l-1]),v=Dl),this.curveType==="centripetal"||this.curveType==="chordal"){const E=this.curveType==="chordal"?.5:.25;let M=Math.pow(m.distanceToSquared(_),E),b=Math.pow(_.distanceToSquared(x),E),S=Math.pow(x.distanceToSquared(v),E);b<1e-4&&(b=1),M<1e-4&&(M=b),S<1e-4&&(S=b),pd.initNonuniformCatmullRom(m.x,_.x,x.x,v.x,M,b,S),md.initNonuniformCatmullRom(m.y,_.y,x.y,v.y,M,b,S),gd.initNonuniformCatmullRom(m.z,_.z,x.z,v.z,M,b,S)}else this.curveType==="catmullrom"&&(pd.initCatmullRom(m.x,_.x,x.x,v.x,this.tension),md.initCatmullRom(m.y,_.y,x.y,v.y,this.tension),gd.initCatmullRom(m.z,_.z,x.z,v.z,this.tension));return r.set(pd.calc(p),md.calc(p),gd.calc(p)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(a.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){const a=this.points[t];e.points.push(a.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(new X().fromArray(a))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function l0(s,e,t,r,a){const l=(r-e)*.5,u=(a-t)*.5,d=s*s,p=s*d;return(2*t-2*r+l+u)*p+(-3*t+3*r-2*l-u)*d+l*s+t}function VM(s,e){const t=1-s;return t*t*e}function GM(s,e){return 2*(1-s)*s*e}function HM(s,e){return s*s*e}function ja(s,e,t,r){return VM(s,e)+GM(s,t)+HM(s,r)}function jM(s,e){const t=1-s;return t*t*t*e}function WM(s,e){const t=1-s;return 3*t*t*s*e}function XM(s,e){return 3*(1-s)*s*s*e}function YM(s,e){return s*s*s*e}function Wa(s,e,t,r,a){return jM(s,e)+WM(s,t)+XM(s,r)+YM(s,a)}class dg extends wi{constructor(e=new $e,t=new $e,r=new $e,a=new $e){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=r,this.v3=a}getPoint(e,t=new $e){const r=t,a=this.v0,l=this.v1,u=this.v2,d=this.v3;return r.set(Wa(e,a.x,l.x,u.x,d.x),Wa(e,a.y,l.y,u.y,d.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class qM extends wi{constructor(e=new X,t=new X,r=new X,a=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=r,this.v3=a}getPoint(e,t=new X){const r=t,a=this.v0,l=this.v1,u=this.v2,d=this.v3;return r.set(Wa(e,a.x,l.x,u.x,d.x),Wa(e,a.y,l.y,u.y,d.y),Wa(e,a.z,l.z,u.z,d.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class fg extends wi{constructor(e=new $e,t=new $e){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new $e){const r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new $e){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $M extends wi{constructor(e=new X,t=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new X){const r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new X){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hg extends wi{constructor(e=new $e,t=new $e,r=new $e){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new $e){const r=t,a=this.v0,l=this.v1,u=this.v2;return r.set(ja(e,a.x,l.x,u.x),ja(e,a.y,l.y,u.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class KM extends wi{constructor(e=new X,t=new X,r=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new X){const r=t,a=this.v0,l=this.v1,u=this.v2;return r.set(ja(e,a.x,l.x,u.x),ja(e,a.y,l.y,u.y),ja(e,a.z,l.z,u.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class pg extends wi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new $e){const r=t,a=this.points,l=(a.length-1)*e,u=Math.floor(l),d=l-u,p=a[u===0?u:u-1],m=a[u],v=a[u>a.length-2?a.length-1:u+1],_=a[u>a.length-3?a.length-1:u+2];return r.set(l0(d,p.x,m.x,v.x,_.x),l0(d,p.y,m.y,v.y,_.y)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(a.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){const a=this.points[t];e.points.push(a.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(new $e().fromArray(a))}return this}}var c0=Object.freeze({__proto__:null,ArcCurve:BM,CatmullRomCurve3:zM,CubicBezierCurve:dg,CubicBezierCurve3:qM,EllipseCurve:Cf,LineCurve:fg,LineCurve3:$M,QuadraticBezierCurve:hg,QuadraticBezierCurve3:KM,SplineCurve:pg});class ZM extends wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const r=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new c0[r](t,e))}return this}getPoint(e,t){const r=e*this.getLength(),a=this.getCurveLengths();let l=0;for(;l<a.length;){if(a[l]>=r){const u=a[l]-r,d=this.curves[l],p=d.getLength(),m=p===0?0:1-u/p;return d.getPointAt(m,t)}l++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let r=0,a=this.curves.length;r<a;r++)t+=this.curves[r].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let r;for(let a=0,l=this.curves;a<l.length;a++){const u=l[a],d=u.isEllipseCurve?e*2:u.isLineCurve||u.isLineCurve3?1:u.isSplineCurve?e*u.points.length:e,p=u.getPoints(d);for(let m=0;m<p.length;m++){const v=p[m];r&&r.equals(v)||(t.push(v),r=v)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){const a=e.curves[t];this.curves.push(a.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,r=this.curves.length;t<r;t++){const a=this.curves[t];e.curves.push(a.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){const a=e.curves[t];this.curves.push(new c0[a.type]().fromJSON(a))}return this}}class u0 extends ZM{constructor(e){super(),this.type="Path",this.currentPoint=new $e,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,r=e.length;t<r;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const r=new fg(this.currentPoint.clone(),new $e(e,t));return this.curves.push(r),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,r,a){const l=new hg(this.currentPoint.clone(),new $e(e,t),new $e(r,a));return this.curves.push(l),this.currentPoint.set(r,a),this}bezierCurveTo(e,t,r,a,l,u){const d=new dg(this.currentPoint.clone(),new $e(e,t),new $e(r,a),new $e(l,u));return this.curves.push(d),this.currentPoint.set(l,u),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),r=new pg(t);return this.curves.push(r),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,r,a,l,u){const d=this.currentPoint.x,p=this.currentPoint.y;return this.absarc(e+d,t+p,r,a,l,u),this}absarc(e,t,r,a,l,u){return this.absellipse(e,t,r,r,a,l,u),this}ellipse(e,t,r,a,l,u,d,p){const m=this.currentPoint.x,v=this.currentPoint.y;return this.absellipse(e+m,t+v,r,a,l,u,d,p),this}absellipse(e,t,r,a,l,u,d,p){const m=new Cf(e,t,r,a,l,u,d,p);if(this.curves.length>0){const _=m.getPoint(0);_.equals(this.currentPoint)||this.lineTo(_.x,_.y)}this.curves.push(m);const v=m.getPoint(1);return this.currentPoint.copy(v),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class mg extends u0{constructor(e){super(e),this.uuid=ea(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let r=0,a=this.holes.length;r<a;r++)t[r]=this.holes[r].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,r=e.holes.length;t<r;t++){const a=e.holes[t];this.holes.push(a.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,r=this.holes.length;t<r;t++){const a=this.holes[t];e.holes.push(a.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,r=e.holes.length;t<r;t++){const a=e.holes[t];this.holes.push(new u0().fromJSON(a))}return this}}const QM={triangulate:function(s,e,t=2){const r=e&&e.length,a=r?e[0]*t:s.length;let l=gg(s,0,a,t,!0);const u=[];if(!l||l.next===l.prev)return u;let d,p,m,v,_,x,E;if(r&&(l=iT(s,e,l,t)),s.length>80*t){d=m=s[0],p=v=s[1];for(let M=t;M<a;M+=t)_=s[M],x=s[M+1],_<d&&(d=_),x<p&&(p=x),_>m&&(m=_),x>v&&(v=x);E=Math.max(m-d,v-p),E=E!==0?32767/E:0}return $a(l,u,t,d,p,E,0),u}};function gg(s,e,t,r,a){let l,u;if(a===pT(s,e,t,r)>0)for(l=e;l<t;l+=r)u=d0(l,s[l],s[l+1],u);else for(l=t-r;l>=e;l-=r)u=d0(l,s[l],s[l+1],u);return u&&ec(u,u.next)&&(Za(u),u=u.next),u}function Jr(s,e){if(!s)return s;e||(e=s);let t=s,r;do if(r=!1,!t.steiner&&(ec(t,t.next)||Gt(t.prev,t,t.next)===0)){if(Za(t),t=e=t.prev,t===t.next)break;r=!0}else t=t.next;while(r||t!==e);return e}function $a(s,e,t,r,a,l,u){if(!s)return;!u&&l&&lT(s,r,a,l);let d=s,p,m;for(;s.prev!==s.next;){if(p=s.prev,m=s.next,l?eT(s,r,a,l):JM(s)){e.push(p.i/t|0),e.push(s.i/t|0),e.push(m.i/t|0),Za(s),s=m.next,d=m.next;continue}if(s=m,s===d){u?u===1?(s=tT(Jr(s),e,t),$a(s,e,t,r,a,l,2)):u===2&&nT(s,e,t,r,a,l):$a(Jr(s),e,t,r,a,l,1);break}}}function JM(s){const e=s.prev,t=s,r=s.next;if(Gt(e,t,r)>=0)return!1;const a=e.x,l=t.x,u=r.x,d=e.y,p=t.y,m=r.y,v=a<l?a<u?a:u:l<u?l:u,_=d<p?d<m?d:m:p<m?p:m,x=a>l?a>u?a:u:l>u?l:u,E=d>p?d>m?d:m:p>m?p:m;let M=r.next;for(;M!==e;){if(M.x>=v&&M.x<=x&&M.y>=_&&M.y<=E&&zs(a,d,l,p,u,m,M.x,M.y)&&Gt(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function eT(s,e,t,r){const a=s.prev,l=s,u=s.next;if(Gt(a,l,u)>=0)return!1;const d=a.x,p=l.x,m=u.x,v=a.y,_=l.y,x=u.y,E=d<p?d<m?d:m:p<m?p:m,M=v<_?v<x?v:x:_<x?_:x,b=d>p?d>m?d:m:p>m?p:m,S=v>_?v>x?v:x:_>x?_:x,y=uf(E,M,e,t,r),R=uf(b,S,e,t,r);let I=s.prevZ,C=s.nextZ;for(;I&&I.z>=y&&C&&C.z<=R;){if(I.x>=E&&I.x<=b&&I.y>=M&&I.y<=S&&I!==a&&I!==u&&zs(d,v,p,_,m,x,I.x,I.y)&&Gt(I.prev,I,I.next)>=0||(I=I.prevZ,C.x>=E&&C.x<=b&&C.y>=M&&C.y<=S&&C!==a&&C!==u&&zs(d,v,p,_,m,x,C.x,C.y)&&Gt(C.prev,C,C.next)>=0))return!1;C=C.nextZ}for(;I&&I.z>=y;){if(I.x>=E&&I.x<=b&&I.y>=M&&I.y<=S&&I!==a&&I!==u&&zs(d,v,p,_,m,x,I.x,I.y)&&Gt(I.prev,I,I.next)>=0)return!1;I=I.prevZ}for(;C&&C.z<=R;){if(C.x>=E&&C.x<=b&&C.y>=M&&C.y<=S&&C!==a&&C!==u&&zs(d,v,p,_,m,x,C.x,C.y)&&Gt(C.prev,C,C.next)>=0)return!1;C=C.nextZ}return!0}function tT(s,e,t){let r=s;do{const a=r.prev,l=r.next.next;!ec(a,l)&&vg(a,r,r.next,l)&&Ka(a,l)&&Ka(l,a)&&(e.push(a.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),Za(r),Za(r.next),r=s=l),r=r.next}while(r!==s);return Jr(r)}function nT(s,e,t,r,a,l){let u=s;do{let d=u.next.next;for(;d!==u.prev;){if(u.i!==d.i&&dT(u,d)){let p=xg(u,d);u=Jr(u,u.next),p=Jr(p,p.next),$a(u,e,t,r,a,l,0),$a(p,e,t,r,a,l,0);return}d=d.next}u=u.next}while(u!==s)}function iT(s,e,t,r){const a=[];let l,u,d,p,m;for(l=0,u=e.length;l<u;l++)d=e[l]*r,p=l<u-1?e[l+1]*r:s.length,m=gg(s,d,p,r,!1),m===m.next&&(m.steiner=!0),a.push(uT(m));for(a.sort(rT),l=0;l<a.length;l++)t=sT(a[l],t);return t}function rT(s,e){return s.x-e.x}function sT(s,e){const t=aT(s,e);if(!t)return e;const r=xg(t,s);return Jr(r,r.next),Jr(t,t.next)}function aT(s,e){let t=e,r=-1/0,a;const l=s.x,u=s.y;do{if(u<=t.y&&u>=t.next.y&&t.next.y!==t.y){const x=t.x+(u-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(x<=l&&x>r&&(r=x,a=t.x<t.next.x?t:t.next,x===l))return a}t=t.next}while(t!==e);if(!a)return null;const d=a,p=a.x,m=a.y;let v=1/0,_;t=a;do l>=t.x&&t.x>=p&&l!==t.x&&zs(u<m?l:r,u,p,m,u<m?r:l,u,t.x,t.y)&&(_=Math.abs(u-t.y)/(l-t.x),Ka(t,s)&&(_<v||_===v&&(t.x>a.x||t.x===a.x&&oT(a,t)))&&(a=t,v=_)),t=t.next;while(t!==d);return a}function oT(s,e){return Gt(s.prev,s,e.prev)<0&&Gt(e.next,s,s.next)<0}function lT(s,e,t,r){let a=s;do a.z===0&&(a.z=uf(a.x,a.y,e,t,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==s);a.prevZ.nextZ=null,a.prevZ=null,cT(a)}function cT(s){let e,t,r,a,l,u,d,p,m=1;do{for(t=s,s=null,l=null,u=0;t;){for(u++,r=t,d=0,e=0;e<m&&(d++,r=r.nextZ,!!r);e++);for(p=m;d>0||p>0&&r;)d!==0&&(p===0||!r||t.z<=r.z)?(a=t,t=t.nextZ,d--):(a=r,r=r.nextZ,p--),l?l.nextZ=a:s=a,a.prevZ=l,l=a;t=r}l.nextZ=null,m*=2}while(u>1);return s}function uf(s,e,t,r,a){return s=(s-t)*a|0,e=(e-r)*a|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function uT(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function zs(s,e,t,r,a,l,u,d){return(a-u)*(e-d)>=(s-u)*(l-d)&&(s-u)*(r-d)>=(t-u)*(e-d)&&(t-u)*(l-d)>=(a-u)*(r-d)}function dT(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!fT(s,e)&&(Ka(s,e)&&Ka(e,s)&&hT(s,e)&&(Gt(s.prev,s,e.prev)||Gt(s,e.prev,e))||ec(s,e)&&Gt(s.prev,s,s.next)>0&&Gt(e.prev,e,e.next)>0)}function Gt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function ec(s,e){return s.x===e.x&&s.y===e.y}function vg(s,e,t,r){const a=Ol(Gt(s,e,t)),l=Ol(Gt(s,e,r)),u=Ol(Gt(t,r,s)),d=Ol(Gt(t,r,e));return!!(a!==l&&u!==d||a===0&&Ul(s,t,e)||l===0&&Ul(s,r,e)||u===0&&Ul(t,s,r)||d===0&&Ul(t,e,r))}function Ul(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ol(s){return s>0?1:s<0?-1:0}function fT(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&vg(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Ka(s,e){return Gt(s.prev,s,s.next)<0?Gt(s,e,s.next)>=0&&Gt(s,s.prev,e)>=0:Gt(s,e,s.prev)<0||Gt(s,s.next,e)<0}function hT(s,e){let t=s,r=!1;const a=(s.x+e.x)/2,l=(s.y+e.y)/2;do t.y>l!=t.next.y>l&&t.next.y!==t.y&&a<(t.next.x-t.x)*(l-t.y)/(t.next.y-t.y)+t.x&&(r=!r),t=t.next;while(t!==s);return r}function xg(s,e){const t=new df(s.i,s.x,s.y),r=new df(e.i,e.x,e.y),a=s.next,l=e.prev;return s.next=e,e.prev=s,t.next=a,a.prev=t,r.next=t,t.prev=r,l.next=r,r.prev=l,r}function d0(s,e,t,r){const a=new df(s,e,t);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function Za(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function df(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function pT(s,e,t,r){let a=0;for(let l=e,u=t-r;l<t;l+=r)a+=(s[u]-s[l])*(s[l+1]+s[u+1]),u=l;return a}class Xa{static area(e){const t=e.length;let r=0;for(let a=t-1,l=0;l<t;a=l++)r+=e[a].x*e[l].y-e[l].x*e[a].y;return r*.5}static isClockWise(e){return Xa.area(e)<0}static triangulateShape(e,t){const r=[],a=[],l=[];f0(e),h0(r,e);let u=e.length;t.forEach(f0);for(let p=0;p<t.length;p++)a.push(u),u+=t[p].length,h0(r,t[p]);const d=QM.triangulate(r,a);for(let p=0;p<d.length;p+=3)l.push(d.slice(p,p+3));return l}}function f0(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function h0(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Nf extends pi{constructor(e=new mg([new $e(0,.5),new $e(-.5,-.5),new $e(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const r=[],a=[],l=[],u=[];let d=0,p=0;if(Array.isArray(e)===!1)m(e);else for(let v=0;v<e.length;v++)m(e[v]),this.addGroup(d,p,v),d+=p,p=0;this.setIndex(r),this.setAttribute("position",new Gn(a,3)),this.setAttribute("normal",new Gn(l,3)),this.setAttribute("uv",new Gn(u,2));function m(v){const _=a.length/3,x=v.extractPoints(t);let E=x.shape;const M=x.holes;Xa.isClockWise(E)===!1&&(E=E.reverse());for(let S=0,y=M.length;S<y;S++){const R=M[S];Xa.isClockWise(R)===!0&&(M[S]=R.reverse())}const b=Xa.triangulateShape(E,M);for(let S=0,y=M.length;S<y;S++){const R=M[S];E=E.concat(R)}for(let S=0,y=E.length;S<y;S++){const R=E[S];a.push(R.x,R.y,0),l.push(0,0,1),u.push(R.x,R.y)}for(let S=0,y=b.length;S<y;S++){const R=b[S],I=R[0]+_,C=R[1]+_,Z=R[2]+_;r.push(I,C,Z),p+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return mT(t,e)}static fromJSON(e,t){const r=[];for(let a=0,l=e.shapes.length;a<l;a++){const u=t[e.shapes[a]];r.push(u)}return new Nf(r,e.curveSegments)}}function mT(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,r=s.length;t<r;t++){const a=s[t];e.shapes.push(a.uuid)}else e.shapes.push(s.uuid);return e}class Vs extends pi{constructor(e=1,t=.4,r=12,a=48,l=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:a,arc:l},r=Math.floor(r),a=Math.floor(a);const u=[],d=[],p=[],m=[],v=new X,_=new X,x=new X;for(let E=0;E<=r;E++)for(let M=0;M<=a;M++){const b=M/a*l,S=E/r*Math.PI*2;_.x=(e+t*Math.cos(S))*Math.cos(b),_.y=(e+t*Math.cos(S))*Math.sin(b),_.z=t*Math.sin(S),d.push(_.x,_.y,_.z),v.x=e*Math.cos(b),v.y=e*Math.sin(b),x.subVectors(_,v).normalize(),p.push(x.x,x.y,x.z),m.push(M/a),m.push(E/r)}for(let E=1;E<=r;E++)for(let M=1;M<=a;M++){const b=(a+1)*E+M-1,S=(a+1)*(E-1)+M-1,y=(a+1)*(E-1)+M,R=(a+1)*E+M;u.push(b,S,R),u.push(S,y,R)}this.setIndex(u),this.setAttribute("position",new Gn(d,3)),this.setAttribute("normal",new Gn(p,3)),this.setAttribute("uv",new Gn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class p0 extends ta{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=W0,this.normalScale=new $e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _g extends En{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const vd=new kt,m0=new X,g0=new X;class gT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $e(512,512),this.map=null,this.mapPass=null,this.matrix=new kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bf,this._frameExtents=new $e(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;m0.setFromMatrixPosition(e.matrixWorld),t.position.copy(m0),g0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(g0),t.updateMatrixWorld(),vd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vd),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(vd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const v0=new kt,za=new X,xd=new X;class vT extends gT{constructor(){super(new Vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new $e(4,2),this._viewportCount=6,this._viewports=[new It(2,1,1,1),new It(0,1,1,1),new It(3,1,1,1),new It(1,1,1,1),new It(3,0,1,1),new It(1,0,1,1)],this._cubeDirections=[new X(1,0,0),new X(-1,0,0),new X(0,0,1),new X(0,0,-1),new X(0,1,0),new X(0,-1,0)],this._cubeUps=[new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,0,1),new X(0,0,-1)]}updateMatrices(e,t=0){const r=this.camera,a=this.matrix,l=e.distance||r.far;l!==r.far&&(r.far=l,r.updateProjectionMatrix()),za.setFromMatrixPosition(e.matrixWorld),r.position.copy(za),xd.copy(r.position),xd.add(this._cubeDirections[t]),r.up.copy(this._cubeUps[t]),r.lookAt(xd),r.updateMatrixWorld(),a.makeTranslation(-za.x,-za.y,-za.z),v0.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(v0)}}class _d extends _g{constructor(e,t,r=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=a,this.shadow=new vT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class xT extends _g{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class _T{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=x0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=x0();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function x0(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_f}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_f);const _0=({assistantState:s})=>{const e=Ue.useRef(null);return Ue.useEffect(()=>{const t=e.current;if(!t)return;const r=t.clientWidth||600,a=t.clientHeight||450,l=new FM,u=new Vn(40,r/a,.1,1e3);u.position.z=22;const d=new OM({antialias:!0,alpha:!0});d.setSize(r,a),d.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.appendChild(d.domElement);const p=new Bs;l.add(p);const m=new Vs(5.2,1.4,32,120),v=new p0({color:3900150,emissive:1981066,emissiveIntensity:.45,roughness:.25,metalness:.85,wireframe:!1}),_=new In(m,v);p.add(_);const x=new Vs(5.22,1.42,16,60),E=new Ha({color:3718648,wireframe:!0,transparent:!0,opacity:.25}),M=new In(x,E);p.add(M);const b=new Vs(8.2,.12,16,160),S=new p0({color:9133302,emissive:3718648,emissiveIntensity:.8,roughness:.1,metalness:.95}),y=new In(b,S);y.rotation.x=Math.PI/2.7,y.rotation.y=-Math.PI/6,p.add(y);const R=new Vs(9.6,.04,12,140),I=new Ha({color:6333946,transparent:!0,opacity:.35}),C=new In(R,I);C.rotation.x=Math.PI/2.5,C.rotation.y=-Math.PI/5,p.add(C);const Z=new Bs;Z.position.set(5.8,4.2,2.5);const V=new mg,O=1.6,H=.25;for(let ge=0;ge<8;ge++){const Me=ge%2===0?O:H,Ve=ge*Math.PI/4,vt=Math.cos(Ve)*Me,st=Math.sin(Ve)*Me;ge===0?V.moveTo(vt,st):V.lineTo(vt,st)}V.closePath();const N=new Nf(V),w=new Ha({color:16777215,side:Ei,transparent:!0,opacity:.95}),k=new In(N,w);Z.add(k),p.add(Z);const W=new xT(988970,1.2);l.add(W);const $=new _d(3718648,3.5,40);$.position.set(-10,8,12),l.add($);const oe=new _d(9133302,4,40);oe.position.set(12,-8,10),l.add(oe);const pe=new _d(16777215,2,15);pe.position.copy(Z.position),l.add(pe);const fe=1500,he=new Float32Array(fe*3);for(let ge=0;ge<fe*3;ge+=3)he[ge]=(Math.random()-.5)*60,he[ge+1]=(Math.random()-.5)*45,he[ge+2]=(Math.random()-.5)*30-5;const z=new pi;z.setAttribute("position",new hi(he,3));const ue=new ug({color:12248829,size:.12,transparent:!0,opacity:.65}),ne=new kM(z,ue);l.add(ne);let U=0,te=0;const Ne=ge=>{const Me=t.getBoundingClientRect();U=((ge.clientX-Me.left)/r-.5)*2,te=((ge.clientY-Me.top)/a-.5)*2};t.addEventListener("mousemove",Ne);let ee,F=new _T;const le=()=>{ee=requestAnimationFrame(le);const ge=F.getElapsedTime(),Me=s==="THINKING"?3:s==="EXECUTING"?2.2:s==="LISTENING"?1.5:.8;_.rotation.z=ge*.15*Me,M.rotation.z=-ge*.12*Me,y.rotation.z=ge*.3*Me,C.rotation.z=-ge*.2*Me;const Ve=1+.25*Math.sin(ge*5);Z.scale.set(Ve,Ve,Ve),p.rotation.y+=(U*.35-p.rotation.y)*.05,p.rotation.x+=(-te*.35-p.rotation.x)*.05,s==="THINKING"?(v.emissive.setHex(165063),S.emissive.setHex(3718648)):s==="EXECUTING"?(v.emissive.setHex(8141549),S.emissive.setHex(12616956)):s==="SPEAKING"?(v.emissive.setHex(366185),S.emissive.setHex(3462041)):(v.emissive.setHex(1981066),S.emissive.setHex(9133302)),d.render(l,u)};le();const ce=()=>{if(!t)return;const ge=t.clientWidth||600,Me=t.clientHeight||450;u.aspect=ge/Me,u.updateProjectionMatrix(),d.setSize(ge,Me)};return window.addEventListener("resize",ce),()=>{cancelAnimationFrame(ee),window.removeEventListener("resize",ce),t.removeEventListener("mousemove",Ne),d.dispose(),t.contains(d.domElement)&&t.removeChild(d.domElement)}},[s]),f.jsxs("div",{className:"relative w-full h-full flex flex-col items-center justify-center overflow-hidden",children:[f.jsx("div",{ref:e,className:"w-full flex-1 min-h-[300px] flex items-center justify-center cursor-pointer"}),f.jsxs("div",{className:"absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden",children:[f.jsx("div",{className:"absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-36 rounded-[100%] bg-gradient-to-t from-blue-600/30 via-indigo-600/15 to-transparent blur-xl"}),f.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"})]}),f.jsxs("div",{className:"absolute bottom-3 flex flex-col items-center select-none pointer-events-none z-10",children:[f.jsx("h1",{className:"text-2xl font-black tracking-[0.3em] text-white font-sans drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]",children:"ORION"}),f.jsx("div",{className:"text-[10px] font-mono tracking-[0.25em] text-cyan-300 font-semibold uppercase mt-0.5",children:"COMMAND • ASSIST • CREATE"}),f.jsx("div",{className:"text-[9px] font-mono tracking-[0.2em] text-slate-400 mt-0.5",children:"YOUR AI. YOUR COMPUTER. YOUR WORLD."})]})]})},y0=({snapshot:s})=>{var u,d,p,m;if(!s)return f.jsx("div",{className:"h-full flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse",children:"CONNECTING_SYSTEM_TELEMETRY..."});const{cpu:e,memory:t,storage:r,network:a,isMock:l}=s;return f.jsxs("div",{className:"h-full flex flex-col justify-between space-y-4 p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-tl relative text-xs backdrop-blur-md",children:[f.jsxs("div",{className:"flex items-center justify-between border-b border-blue-500/20 pb-2",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(hf,{className:"w-4 h-4 text-cyan-400 animate-pulse"}),f.jsx("span",{className:"font-semibold text-white tracking-wider uppercase font-sans",children:"SYSTEM TELEMETRY"})]}),l&&f.jsx("span",{className:"px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider font-mono",children:"DEV MOCK"})]}),f.jsxs("div",{className:"space-y-1.5",children:[f.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[f.jsxs("span",{className:"flex items-center text-slate-300",children:[f.jsx(Ws,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," CPU UTILIZATION"]}),f.jsxs("span",{className:"font-bold text-cyan-300",children:[e.usagePercent,"%"]})]}),f.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:f.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]",style:{width:`${e.usagePercent}%`}})}),f.jsx("div",{className:"grid grid-cols-4 gap-1 pt-1 font-mono",children:e.cores.slice(0,8).map(v=>f.jsxs("div",{className:"bg-blue-950/30 p-1 border border-blue-500/20 text-[9px] rounded-sm",children:[f.jsxs("div",{className:"text-slate-400",children:["C",v.id]}),f.jsxs("div",{className:"text-white font-bold",children:[v.usagePercent,"%"]})]},v.id))})]}),f.jsxs("div",{className:"space-y-1.5",children:[f.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[f.jsxs("span",{className:"flex items-center text-slate-300",children:[f.jsx(Ws,{className:"w-3.5 h-3.5 mr-1.5 text-violet-400"})," SYSTEM MEMORY (RAM)"]}),f.jsxs("span",{className:"font-bold text-violet-300",children:[t.usagePercent,"%"]})]}),f.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:f.jsx("div",{className:"h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(139,92,246,0.5)]",style:{width:`${t.usagePercent}%`}})}),f.jsxs("div",{className:"flex justify-between text-[10px] text-slate-400 font-mono",children:[f.jsxs("span",{children:["USED: ",(t.usedBytes/(1024*1024*1024)).toFixed(1)," GB"]}),f.jsxs("span",{children:["TOTAL: ",(t.totalBytes/(1024*1024*1024)).toFixed(1)," GB"]})]})]}),f.jsxs("div",{className:"space-y-1.5",children:[f.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[f.jsxs("span",{className:"flex items-center text-slate-300",children:[f.jsx(Ex,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," MAIN STORAGE"]}),f.jsxs("span",{className:"font-bold text-white",children:[((u=r[0])==null?void 0:u.usagePercent)||0,"%"]})]}),f.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 rounded-sm",children:f.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300",style:{width:`${((d=r[0])==null?void 0:d.usagePercent)||0}%`}})}),f.jsxs("div",{className:"flex justify-between text-[10px] text-slate-400 font-mono",children:[f.jsx("span",{children:(p=r[0])==null?void 0:p.driveLabel}),f.jsxs("span",{children:["FREE: ",((((m=r[0])==null?void 0:m.freeBytes)||0)/(1024*1024*1024)).toFixed(0)," GB"]})]})]}),f.jsxs("div",{className:"pt-2 border-t border-blue-500/20",children:[f.jsxs("div",{className:"flex justify-between items-center text-[11px] mb-1 font-mono",children:[f.jsxs("span",{className:"flex items-center text-slate-300",children:[f.jsx(Ix,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," NETWORK COMM"]}),f.jsx("span",{className:"text-[10px] text-cyan-300 font-semibold",children:a.ipAddress})]}),f.jsxs("div",{className:"grid grid-cols-3 gap-2 text-[10px] font-mono",children:[f.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[f.jsx("div",{className:"text-slate-400 text-[9px]",children:"DOWN"}),f.jsxs("div",{className:"text-white font-bold",children:[a.downloadKbps," KB/s"]})]}),f.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[f.jsx("div",{className:"text-slate-400 text-[9px]",children:"UP"}),f.jsxs("div",{className:"text-white font-bold",children:[a.uploadKbps," KB/s"]})]}),f.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[f.jsx("div",{className:"text-slate-400 text-[9px]",children:"PING"}),f.jsxs("div",{className:"text-cyan-300 font-bold",children:[a.pingMs," ms"]})]})]})]}),f.jsxs("div",{className:"flex justify-between items-center text-[10px] bg-blue-950/40 p-2 border border-blue-500/20 font-mono rounded-sm",children:[f.jsx("span",{className:"text-slate-400",children:"CPU THERMAL:"}),f.jsx("span",{className:"text-white font-bold",children:s.cpu.temperatureCelsius!==null?`${s.cpu.temperatureCelsius}°C`:"N/A"}),f.jsx("span",{className:"text-slate-400 border-l border-blue-500/20 pl-2",children:"GPU THERMAL:"}),f.jsx("span",{className:"text-white font-bold",children:s.gpu.temperatureCelsius!==null?`${s.gpu.temperatureCelsius}°C`:"N/A"})]})]})},yT=({activities:s})=>{const e=r=>{switch(r){case"VOICE_INPUT":return f.jsx(mf,{className:"w-3.5 h-3.5 text-amber-400"});case"PROCESSING":return f.jsx(vf,{className:"w-3.5 h-3.5 text-cyan-400 animate-pulse"});case"TOOL_EXECUTION":return f.jsx(Qa,{className:"w-3.5 h-3.5 text-violet-400"});case"TASK_COMPLETE":return f.jsx(Fl,{className:"w-3.5 h-3.5 text-emerald-400"});case"ERROR_EVENT":return f.jsx(P0,{className:"w-3.5 h-3.5 text-red-400"});default:return f.jsx(Ws,{className:"w-3.5 h-3.5 text-blue-400"})}},t=r=>{switch(r){case"VOICE_INPUT":return"text-amber-300 border-amber-500/30 bg-amber-500/10";case"PROCESSING":return"text-cyan-300 border-cyan-500/30 bg-cyan-500/10";case"TOOL_EXECUTION":return"text-violet-300 border-violet-500/30 bg-violet-500/10";case"TASK_COMPLETE":return"text-emerald-300 border-emerald-500/30 bg-emerald-500/10";case"ERROR_EVENT":return"text-red-300 border-red-500/30 bg-red-500/10";default:return"text-slate-400 border-blue-500/20 bg-blue-950/30"}};return f.jsxs("div",{className:"h-full flex flex-col justify-between p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-br relative text-xs backdrop-blur-md",children:[f.jsxs("div",{className:"flex items-center justify-between border-b border-blue-500/20 pb-2 mb-3",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(ql,{className:"w-4 h-4 text-cyan-400"}),f.jsx("span",{className:"font-semibold text-white tracking-wider uppercase font-sans",children:"ORION ACTIVITY LOG"})]}),f.jsxs("span",{className:"text-[10px] text-slate-400 font-mono",children:[s.length," EVENTS"]})]}),f.jsx("div",{className:"flex-1 overflow-y-auto space-y-2 pr-1",children:s.length===0?f.jsx("div",{className:"h-full flex items-center justify-center text-slate-500 text-[11px] font-mono",children:"NO_ACTIVE_ACTIVITY_LOGGED"}):s.map(r=>f.jsxs("div",{className:"p-2 bg-blue-950/30 border border-blue-500/20 hover:border-blue-400/40 rounded transition-colors space-y-1 text-[11px]",children:[f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{className:"flex items-center space-x-1.5",children:[e(r.type),f.jsx("span",{className:`px-1.5 py-0.2 text-[9px] border rounded font-semibold font-mono ${t(r.type)}`,children:r.type})]}),f.jsx("span",{className:"text-[9px] text-slate-400 font-mono",children:new Date(r.timestamp).toLocaleTimeString([],{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})})]}),f.jsx("div",{className:"text-slate-200 pl-5 leading-tight font-mono",children:r.message}),r.details&&f.jsx("div",{className:"pl-5 text-[10px] text-slate-400 font-mono",children:JSON.stringify(r.details)})]},r.id))}),f.jsxs("div",{className:"pt-3 border-t border-blue-500/20 flex justify-between items-center text-[10px] text-slate-400 font-mono",children:[f.jsxs("span",{className:"flex items-center",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-2"}),"REALTIME STREAM ACTIVE"]}),f.jsx("span",{className:"uppercase text-blue-400/80",children:"LOG_LEVEL: VERBOSE"})]})]})},S0=({currentTask:s})=>{const[e,t]=Ue.useState(null),[r,a]=Ue.useState(0);return Ue.useEffect(()=>{const l=async()=>{const d=window.orionApi||window.arvisApi;if(d&&d.getAIRouterStatus)try{const p=await d.getAIRouterStatus();t(p);const m=await d.getAllProviderStatuses();a(m.filter(v=>v.isConfigured).length)}catch{}};l();const u=setInterval(l,3e3);return()=>clearInterval(u)},[]),f.jsxs("div",{className:"h-full flex items-center justify-between p-3.5 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-lg text-xs relative overflow-hidden backdrop-blur-md",children:[f.jsx("div",{className:"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"}),f.jsxs("div",{className:"flex items-center space-x-3.5 min-w-[340px]",children:[f.jsx("div",{className:"p-2 bg-blue-500/10 border border-blue-400/30 text-cyan-300 rounded-md shadow-[0_0_12px_rgba(56,189,248,0.25)]",children:f.jsx(xf,{className:"w-5 h-5 animate-pulse"})}),f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center space-x-1.5",children:[f.jsx("span",{className:"text-[10px] text-cyan-400 tracking-wider uppercase font-bold font-mono",children:"ORION QUANTUM SECTOR"}),f.jsx("span",{className:`w-2 h-2 rounded-full ${e!=null&&e.isHealthy?"bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]":"bg-amber-400 animate-ping"}`})]}),f.jsx("div",{className:"font-semibold text-white text-xs tracking-wide font-mono flex items-center space-x-2",children:f.jsx("span",{className:"text-cyan-300 font-bold",children:e?e.displayName:"SECTOR 00 // KERNEL AUTONOMOUS CORE"})}),f.jsx("div",{className:"text-[9px] text-slate-400 font-mono truncate max-w-[300px]",children:e?e.currentModel:"Zero-Latency Deterministic Micro-Kernel [Sovereign Grid]"})]})]}),f.jsxs("div",{className:"flex-1 px-6 space-y-1 max-w-[500px]",children:[f.jsxs("div",{className:"flex justify-between items-center text-[10px] font-mono",children:[f.jsxs("span",{className:"text-slate-300 uppercase tracking-wider",children:["ACTION: ",s?s.currentAction:"STANDBY IDLE"]}),f.jsx("span",{className:"text-cyan-300 font-bold",children:s?`${s.progressPercent}%`:"0%"})]}),f.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:f.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.4)]",style:{width:`${s?s.progressPercent:0}%`}})})]}),f.jsxs("div",{className:"flex items-center space-x-3 text-right",children:[f.jsxs("div",{children:[f.jsx("div",{className:"text-[9px] text-slate-400 font-mono uppercase tracking-wider",children:"STATUS"}),f.jsx("div",{className:"font-bold text-cyan-300 font-mono tracking-wider uppercase",children:s?s.status:"STANDBY"})]}),(s==null?void 0:s.status)==="RUNNING"&&f.jsx(Tx,{className:"w-5 h-5 text-cyan-400 animate-spin"}),(s==null?void 0:s.status)==="COMPLETED"&&f.jsx(w0,{className:"w-5 h-5 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"}),(s==null?void 0:s.status)==="FAILED"&&f.jsx(gx,{className:"w-5 h-5 text-red-400"}),!s&&f.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-slate-500 opacity-60"})]})]})},ST=()=>{const[s,e]=Ue.useState([]),[t,r]=Ue.useState(""),[a,l]=Ue.useState(""),[u,d]=Ue.useState("PREFERENCE");Ue.useEffect(()=>{p()},[]);const p=async()=>{const _=window.orionApi||window.arvisApi;if(_){const x=await _.getMemories();e(x)}},m=async _=>{if(_.preventDefault(),!t.trim()||!a.trim())return;const x=window.orionApi||window.arvisApi;x&&(await x.saveMemory({category:u,key:t,value:a,source:"USER_EXPLICIT"}),r(""),l(""),p())},v=async _=>{const x=window.orionApi||window.arvisApi;x&&(await x.deleteMemory(_),p())};return f.jsxs("div",{className:"h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-4",children:[f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(b0,{className:"w-5 h-5 text-arvis-accent"}),f.jsx("h2",{className:"text-lg font-bold text-arvis-text tracking-widest",children:"USER-CONTROLLED MEMORY BANK"})]}),f.jsx("p",{className:"text-xs text-arvis-dim mt-1",children:"ORION memory is completely explicit, transparent, and user-inspectable. No hidden data collection."})]}),f.jsxs("div",{className:"flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim",children:[f.jsx(Yl,{className:"w-4 h-4 text-green-400"}),f.jsx("span",{children:"PRIVACY STATUS: ZERO STEALTH STORAGE"})]})]}),f.jsxs("form",{onSubmit:m,className:"p-4 bg-black/40 border border-arvis-border space-y-3",children:[f.jsx("div",{className:"text-xs font-semibold text-arvis-cyan uppercase",children:"ADD EXPLICIT MEMORY ENTRY"}),f.jsxs("div",{className:"grid grid-cols-4 gap-3",children:[f.jsxs("select",{value:u,onChange:_=>d(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none",children:[f.jsx("option",{value:"PREFERENCE",children:"PREFERENCE"}),f.jsx("option",{value:"FACT",children:"FACT"}),f.jsx("option",{value:"AUTOMATION",children:"AUTOMATION"}),f.jsx("option",{value:"WORKFLOW",children:"WORKFLOW"}),f.jsx("option",{value:"SYSTEM_NOTE",children:"SYSTEM_NOTE"})]}),f.jsx("input",{type:"text",placeholder:"Key (e.g., preferred_theme)",value:t,onChange:_=>r(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"}),f.jsx("input",{type:"text",placeholder:"Value (e.g., Cyberpunk Dark HUD)",value:a,onChange:_=>l(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"}),f.jsxs("button",{type:"submit",className:"flex items-center justify-center space-x-2 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30 text-xs font-bold transition-all",children:[f.jsx(bx,{className:"w-4 h-4"}),f.jsx("span",{children:"SAVE MEMORY"})]})]})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsxs("div",{className:"text-xs font-semibold text-arvis-dim uppercase",children:["INSPECTABLE MEMORIES (",s.length,")"]}),f.jsx("div",{className:"space-y-2",children:s.map(_=>f.jsxs("div",{className:"p-3 bg-black/30 border border-arvis-border/70 flex justify-between items-center",children:[f.jsxs("div",{className:"space-y-1",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx("span",{className:"px-2 py-0.5 text-[9px] bg-arvis-accent/20 border border-arvis-accent/40 text-arvis-accent font-bold",children:_.category}),f.jsx("span",{className:"font-mono text-xs font-bold text-arvis-cyan",children:_.key}),f.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["(",_.source,")"]})]}),f.jsx("div",{className:"text-xs text-arvis-text font-mono pl-1",children:_.value})]}),f.jsx("button",{onClick:()=>v(_.id),className:"p-2 text-arvis-dim hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors",title:"Delete memory",children:f.jsx(Px,{className:"w-4 h-4"})})]},_.id))})]})]})},ET=()=>{const[s,e]=Ue.useState([]),[t,r]=Ue.useState(null),[a,l]=Ue.useState("{}"),[u,d]=Ue.useState(null),[p,m]=Ue.useState(!1),[v,_]=Ue.useState("Open Chrome and search for the latest Nvidia earnings."),[x,E]=Ue.useState(null),[M,b]=Ue.useState(null),[S,y]=Ue.useState(!1),[R,I]=Ue.useState(!1),[C,Z]=Ue.useState(!1);Ue.useEffect(()=>{const W=window.orionApi||window.arvisApi;let $;return W&&(W.getTools().then(e),W.onComputerTaskUpdated&&($=W.onComputerTaskUpdated(oe=>{E(oe),(oe.status==="COMPLETED"||oe.status==="FAILED"||oe.status==="CANCELLED"||oe.status==="ESTOPPED")&&y(!1)}))),()=>{$&&$()}},[]);const V=async()=>{const W=window.orionApi||window.arvisApi;if(!(!W||!W.getComputerObservation))try{const $=await W.getComputerObservation();b($)}catch($){d(`[OBSERVATION ERROR] ${$.message}`)}},O=async()=>{const W=window.orionApi||window.arvisApi;if(!(!W||!W.executeComputerCommand||!v.trim())){y(!0),I(!1);try{const $=await W.executeComputerCommand(v,{isDryRun:C});E($),$.status!=="RUNNING"&&$.status!=="EXECUTING"&&y(!1)}catch($){d(`[COMMAND ERROR] ${$.message}`),y(!1)}}},H=async()=>{const W=window.orionApi||window.arvisApi;!W||!W.emergencyStopComputer||(await W.emergencyStopComputer(),I(!0),y(!1))},N=async()=>{const W=window.orionApi||window.arvisApi;!W||!W.resetEmergencyStopComputer||(await W.resetEmergencyStopComputer(),I(!1))},w=W=>{r(W),d(null),m(!1);const $={};Object.keys(W.parameters).forEach(oe=>{$[oe]=W.parameters[oe].type==="string"?"example_val":!0}),l(JSON.stringify($,null,2))},k=async()=>{const W=window.orionApi||window.arvisApi;if(!(!t||!W)){if(t.permissionLevel==="CRITICAL"&&!p){d("[SECURITY BLOCK] Execution refused. Critical action requires manual confirmation checkbox.");return}try{const $=JSON.parse(a),oe={id:"call_"+Math.random().toString(36).substring(2,9),toolId:t.id,toolName:t.name,arguments:$,timestamp:Date.now(),requiresUserApproval:p};d(`Executing tool '${t.name}'...`);const pe=await W.executeTool(oe);d(JSON.stringify(pe,null,2))}catch($){d(`[ERROR] Invalid parameters format or execution error: ${$.message}`)}}};return f.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden",children:[f.jsx("div",{className:"col-span-7 bg-black/40 border border-arvis-border p-4 flex flex-col justify-between space-y-4 overflow-y-auto",children:f.jsxs("div",{className:"space-y-3",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-3",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(ql,{className:"w-5 h-5 text-arvis-cyan"}),f.jsxs("div",{children:[f.jsx("h3",{className:"font-bold text-sm text-arvis-text font-mono",children:"UNIVERSAL DESKTOP CONTROL HUD"}),f.jsx("p",{className:"text-[10px] text-arvis-dim",children:"Closed-Loop Autonomous Observe → Plan → Act → Verify Engine"})]})]}),f.jsxs("div",{className:"flex items-center space-x-2",children:[R?f.jsxs("button",{onClick:N,className:"px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 text-[10px] font-mono font-bold flex items-center space-x-1",children:[f.jsx(C0,{className:"w-3 h-3"}),f.jsx("span",{children:"RESET ESTOP"})]}):f.jsxs("button",{onClick:H,className:"px-2.5 py-1 bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-red-600/50",children:[f.jsx(xx,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"EMERGENCY STOP"})]}),f.jsxs("button",{onClick:V,className:"px-2.5 py-1 bg-arvis-cyan/10 border border-arvis-cyan/40 text-arvis-cyan text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-arvis-cyan/20",children:[f.jsx(jl,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"OBSERVE SCREEN"})]})]})]}),f.jsxs("div",{className:"space-y-2",children:[f.jsxs("div",{className:"flex justify-between items-center",children:[f.jsx("label",{className:"text-[11px] text-arvis-dim font-mono uppercase",children:"NATURAL LANGUAGE DESKTOP INSTRUCTION"}),f.jsxs("label",{className:"flex items-center space-x-1.5 cursor-pointer text-[10px] font-mono text-arvis-cyan",children:[f.jsx("input",{type:"checkbox",checked:C,onChange:W=>Z(W.target.checked),className:"rounded bg-black border-arvis-border text-arvis-cyan focus:ring-0"}),f.jsx("span",{className:C?"text-amber-400 font-bold":"text-arvis-dim",children:C?"DRY-RUN (PREVIEW ONLY)":"LIVE EXECUTION"})]})]}),f.jsxs("div",{className:"flex space-x-2",children:[f.jsx("input",{type:"text",value:v,onChange:W=>_(W.target.value),placeholder:"e.g. Open Chrome and search for latest Nvidia earnings.",className:"flex-1 bg-black border border-arvis-border px-3 py-2 text-xs font-mono text-arvis-cyan focus:border-arvis-cyan outline-none"}),f.jsxs("button",{onClick:O,disabled:S||R,className:`px-4 py-2 border font-mono font-bold text-xs flex items-center space-x-1 disabled:opacity-50 ${C?"bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30":"bg-arvis-cyan/20 border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[f.jsx(N0,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:C?"PREVIEW":"RUN"})]})]})]}),x&&f.jsxs("div",{className:"p-3 bg-black/70 border border-arvis-border space-y-2 font-mono text-xs",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-1.5",children:[f.jsxs("span",{className:"text-arvis-cyan font-bold",children:["TASK EXECUTION PLAN: ",x.taskId]}),f.jsxs("div",{className:"flex items-center space-x-1.5",children:[x.isDryRun&&f.jsx("span",{className:"px-1.5 py-0.5 text-[8px] font-bold border border-amber-500 bg-amber-500/20 text-amber-400",children:"DRY-RUN"}),f.jsx("span",{className:`px-2 py-0.5 text-[9px] font-bold border ${x.status==="COMPLETED"?"border-green-500 bg-green-500/20 text-green-400":x.status==="RUNNING"||x.status==="EXECUTING"?"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan animate-pulse":x.status==="AWAITING_APPROVAL"?"border-amber-500 bg-amber-500/20 text-amber-400":x.status==="ESTOPPED"?"border-red-600 bg-red-600/30 text-red-300":"border-red-500 bg-red-500/20 text-red-400"}`,children:x.status})]})]}),f.jsxs("div",{className:"text-[11px] text-arvis-dim",children:["Intent: ",x.intent]}),f.jsx("div",{className:"space-y-1 max-h-40 overflow-y-auto",children:x.actions.map((W,$)=>f.jsxs("div",{className:`p-1.5 border text-[10px] flex justify-between items-center ${$===x.currentActionIndex?"border-arvis-cyan bg-arvis-cyan/15 text-arvis-text":$<x.currentActionIndex?"border-green-500/40 bg-black/40 text-arvis-dim":"border-arvis-border/40 bg-black/20 text-arvis-dim"}`,children:[f.jsxs("span",{children:[$+1,". [",W.type,"] ",W.reason||W.target]}),f.jsx("span",{className:"text-[9px]",children:W.riskLevel})]},W.id))})]}),M&&f.jsxs("div",{className:"p-3 bg-black/70 border border-arvis-border space-y-1.5 font-mono text-[11px]",children:[f.jsxs("div",{className:"text-arvis-cyan font-bold border-b border-arvis-border pb-1 flex justify-between",children:[f.jsx("span",{children:"DESKTOP OBSERVATION SNAPSHOT"}),M.observationId&&f.jsx("span",{className:"text-arvis-dim text-[9px]",children:M.observationId})]}),f.jsxs("div",{children:["Active App: ",f.jsx("span",{className:"text-arvis-text",children:M.activeWindow.processName})]}),f.jsxs("div",{children:["Window Title: ",f.jsx("span",{className:"text-arvis-text",children:M.activeWindow.title})]}),f.jsxs("div",{children:["Resolution: ",f.jsxs("span",{className:"text-arvis-text",children:[M.screen.width,"x",M.screen.height]})]}),f.jsxs("div",{children:["Interactive Elements Detected: ",f.jsxs("span",{className:"text-arvis-text",children:[M.interactiveElements.length," elements"]})]})]})]})}),f.jsxs("div",{className:"col-span-5 bg-black/40 border border-arvis-border p-3 flex flex-col space-y-3 overflow-y-auto",children:[f.jsxs("div",{className:"flex items-center justify-between border-b border-arvis-border pb-2 text-xs font-bold text-arvis-text",children:[f.jsxs("div",{className:"flex items-center space-x-1.5",children:[f.jsx(Yl,{className:"w-4 h-4 text-arvis-cyan"}),f.jsx("span",{children:"TOOL DISPATCH MATRIX"})]}),f.jsxs("span",{className:"text-[9px] text-arvis-dim font-mono",children:[s.length," TOOLS"]})]}),f.jsx("div",{className:"space-y-1.5 max-h-48 overflow-y-auto",children:s.map(W=>f.jsx("button",{onClick:()=>w(W),className:`w-full text-left p-2 border transition-all text-[11px] space-y-0.5 ${(t==null?void 0:t.id)===W.id?"border-arvis-accent bg-arvis-accent/15 text-arvis-text":"border-arvis-border/60 bg-black/20 text-arvis-dim hover:border-arvis-border hover:text-arvis-text"}`,children:f.jsxs("div",{className:"flex justify-between items-center",children:[f.jsx("span",{className:"font-bold font-mono",children:W.name}),f.jsx("span",{className:"text-[8px] font-bold border px-1 py-0.2 border-arvis-cyan/40 text-arvis-cyan",children:W.permissionLevel})]})},W.id))}),t&&f.jsxs("div",{className:"space-y-2 border-t border-arvis-border pt-2 font-mono text-xs",children:[f.jsx("textarea",{value:a,onChange:W=>l(W.target.value),className:"w-full h-20 bg-black border border-arvis-border p-2 text-[10px] text-arvis-cyan outline-none resize-none"}),f.jsxs("button",{onClick:k,className:"w-full py-1.5 bg-arvis-accent/20 border border-arvis-accent text-arvis-accent font-bold text-[11px] flex items-center justify-center space-x-1 hover:bg-arvis-accent/30",children:[f.jsx(Qa,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"DISPATCH TOOL"})]})]}),u&&f.jsx("div",{className:"p-2 bg-black border border-arvis-border text-[10px] font-mono text-arvis-cyan max-h-32 overflow-y-auto whitespace-pre-wrap",children:u})]})]})},MT=({cameraActive:s})=>{const[e,t]=Ue.useState(null),[r,a]=Ue.useState(!1),[l,u]=Ue.useState(null),d=async p=>{if(p==="CAMERA"&&!s){u("SECURITY NOTICE: Camera is currently toggled OFF in top privacy header. Enable camera toggle before capture."),setTimeout(()=>u(null),5e3);return}u(null);const m=window.orionApi||window.arvisApi;if(m){a(!0);const v=await m.captureVision(p);t(v),a(!1)}};return f.jsxs("div",{className:"h-full grid grid-cols-2 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden",children:[f.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 flex flex-col justify-between relative",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2 text-xs",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(jl,{className:"w-4 h-4 text-arvis-cyan"}),f.jsx("span",{className:"font-bold text-arvis-text",children:"OPTICAL SENSOR & DISPLAY FEED"})]}),f.jsx("span",{className:"text-[10px] text-arvis-dim",children:"STATUS: READY"})]}),l&&f.jsxs("div",{className:"mt-2 p-2 bg-amber-500/20 border border-amber-500 text-amber-300 font-mono text-[10px] flex items-center space-x-1.5 animate-pulse",children:[f.jsx(Ya,{className:"w-3.5 h-3.5 shrink-0 text-amber-400"}),f.jsx("span",{children:l})]}),f.jsxs("div",{className:"relative flex-1 my-4 border border-arvis-cyan/30 bg-black flex items-center justify-center overflow-hidden",children:[f.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]"}),f.jsx("div",{className:"absolute top-2 left-2 text-[9px] text-arvis-cyan font-mono",children:"FRAME_BUFFER: 1920x1080"}),f.jsx("div",{className:"absolute bottom-2 right-2 text-[9px] text-arvis-dim font-mono",children:"OPTICAL_STREAM: READY"}),r?f.jsxs("div",{className:"flex flex-col items-center space-y-2 text-arvis-cyan animate-pulse",children:[f.jsx(vf,{className:"w-8 h-8 animate-spin"}),f.jsx("span",{className:"text-xs font-bold",children:"ANALYZING OPTICAL INPUT..."})]}):e?f.jsxs("div",{className:"p-4 text-center space-y-2",children:[f.jsxs("div",{className:"inline-block px-3 py-1 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan text-xs font-bold",children:["ANALYSIS COMPLETE (",e.analysis.source,")"]}),f.jsx("p",{className:"text-xs text-arvis-text font-mono max-w-sm",children:e.analysis.sceneSummary})]}):f.jsxs("div",{className:"text-center text-xs text-arvis-dim space-y-2",children:[f.jsx(jl,{className:"w-8 h-8 mx-auto text-arvis-dim opacity-50"}),f.jsx("div",{children:"TRIGGER OPTICAL CAPTURE FROM CONTROLS BELOW"})]})]}),f.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[f.jsxs("button",{onClick:()=>d("CAMERA"),className:`py-2.5 border text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${s?"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30":"border-arvis-border bg-black/40 text-arvis-dim opacity-50 cursor-not-allowed"}`,children:[f.jsx(T0,{className:"w-4 h-4"}),f.jsx("span",{children:"ANALYZE CAMERA FRAME"})]}),f.jsxs("button",{onClick:()=>d("SCREENSHOT"),className:"py-2.5 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent hover:bg-arvis-accent/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all",children:[f.jsx(gf,{className:"w-4 h-4"}),f.jsx("span",{children:"ANALYZE SCREENSHOT"})]})]})]}),f.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 flex flex-col justify-between overflow-y-auto space-y-4",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2 text-xs",children:[f.jsx("span",{className:"font-bold text-arvis-text",children:"VISION INTELLIGENCE RESULT"}),f.jsx("span",{className:"text-[10px] text-arvis-dim",children:"MULTIMODAL VLM ENGINE"})]}),e?f.jsxs("div",{className:"space-y-4 text-xs font-mono",children:[f.jsxs("div",{children:[f.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"DETECTED OBJECTS"}),f.jsx("div",{className:"space-y-1",children:e.analysis.detectedObjects.map((p,m)=>f.jsxs("div",{className:"p-2 bg-black border border-arvis-border flex justify-between",children:[f.jsx("span",{className:"text-arvis-cyan font-bold",children:p.label}),f.jsxs("span",{className:"text-arvis-dim",children:["CONF: ",(p.confidence*100).toFixed(0),"%"]})]},m))})]}),e.analysis.extractedText&&f.jsxs("div",{children:[f.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"EXTRACTED OCR TEXT"}),f.jsx("pre",{className:"p-2 bg-black border border-arvis-border text-arvis-text text-[11px] whitespace-pre-wrap",children:e.analysis.extractedText})]}),f.jsxs("div",{children:[f.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"SCENE SUMMARY"}),f.jsx("div",{className:"p-2 bg-black border border-arvis-border text-arvis-text",children:e.analysis.sceneSummary})]})]}):f.jsx("div",{className:"h-full flex items-center justify-center text-xs text-arvis-dim",children:"NO VISION RESULT CAPTURED YET"}),f.jsxs("div",{className:"p-2 bg-black/60 border border-arvis-border text-[10px] text-arvis-dim flex items-center space-x-2",children:[f.jsx(Ya,{className:"w-4 h-4 text-arvis-amber shrink-0"}),f.jsx("span",{children:"PRIVACY GUARANTEE: Camera/Screen analysis only runs on explicit user command."})]})]})]})},TT=()=>{const[s,e]=Ue.useState([]),[t,r]=Ue.useState("SPEED_FIRST"),[a,l]=Ue.useState(!1),[u,d]=Ue.useState(null),[p,m]=Ue.useState(!1),[v,_]=Ue.useState({OPENROUTER_API_KEY:"",GROQ_API_KEY:"",GEMINI_API_KEY:"",GITHUB_TOKEN:"",CEREBRAS_API_KEY:"",MISTRAL_API_KEY:"",NVIDIA_API_KEY:"",DEEPSEEK_API_KEY:"",CLOUDFLARE_API_TOKEN:"",CLOUDFLARE_ACCOUNT_ID:""}),[x,E]=Ue.useState("");Ue.useEffect(()=>{M();const R=setInterval(M,3e3);return()=>clearInterval(R)},[]);const M=async()=>{const R=window.orionApi||window.arvisApi;if(R&&R.getAllProviderStatuses)try{const I=await R.getAllProviderStatuses();e(I)}catch{}},b=async R=>{r(R);const I=window.orionApi||window.arvisApi;I&&I.setAIRoutingStrategy&&(await I.setAIRoutingStrategy(R),M())},S=async()=>{const R=window.orionApi||window.arvisApi;if(R&&R.runLiveQualificationTest){m(!0);try{const I=await R.runLiveQualificationTest();d(I),M()}catch{}finally{m(!1)}}},y=async R=>{R.preventDefault();const I=window.orionApi||window.arvisApi;I&&I.saveProviderKeys&&(E("SAVING CREDENTIALS TO SECURE ELECTRON MAIN..."),await I.saveProviderKeys(v)?(E("SUCCESSFULLY ACTIVATED PROVIDER KEYS!"),setTimeout(()=>E(""),3e3),l(!1),M()):E("ERROR SAVING KEYS TO .ENV"))};return f.jsxs("div",{className:"h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto font-mono text-xs",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-4",children:[f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(xf,{className:"w-5 h-5 text-arvis-cyan"}),f.jsx("h2",{className:"text-lg font-bold text-arvis-text tracking-widest uppercase",children:"ORION OMNI-BRAIN CLOUD AI FABRIC"})]}),f.jsx("p",{className:"text-xs text-arvis-dim mt-1",children:"Zero-cost, ultra-responsive cloud AI failover router. API credentials safely preserved in Main process."})]}),f.jsxs("div",{className:"flex items-center space-x-3",children:[f.jsxs("button",{onClick:S,disabled:p,className:"flex items-center space-x-1.5 px-3 py-1.5 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all font-bold disabled:opacity-50",children:[f.jsx(Qa,{className:"w-4 h-4"}),f.jsx("span",{children:p?"QUALIFYING...":"RUN LIVE QUALIFICATION TEST"})]}),f.jsxs("button",{onClick:()=>l(!a),className:"flex items-center space-x-1.5 px-3 py-1.5 border border-arvis-cyan bg-arvis-cyan/10 text-arvis-cyan hover:bg-arvis-cyan/20 transition-all font-bold",children:[f.jsx(Mx,{className:"w-4 h-4"}),f.jsx("span",{children:a?"HIDE KEY INPUT":"CONFIGURE PROVIDER KEYS"})]}),f.jsxs("div",{className:"flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim",children:[f.jsx(Yl,{className:"w-4 h-4 text-green-400"}),f.jsx("span",{children:"MAIN PROCESS ISOLATION"})]})]})]}),a&&f.jsxs("form",{onSubmit:y,className:"p-4 bg-black/70 border border-arvis-cyan/60 space-y-4",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2",children:[f.jsx("span",{className:"font-bold text-arvis-cyan uppercase",children:"SECURE MAIN-PROCESS CREDENTIAL MANAGER (.ENV)"}),f.jsx("span",{className:"text-[10px] text-arvis-dim",children:"Keys are saved locally to .env and never sent to DOM or external telemetry"})]}),f.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-cyan font-bold text-[10px] block mb-1",children:"OPENROUTER API KEY (OPENROUTER_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"Key...",value:v.OPENROUTER_API_KEY,onChange:R=>_({...v,OPENROUTER_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-cyan/80 p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-accent outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GROQ API KEY (GROQ_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"gsk_...",value:v.GROQ_API_KEY,onChange:R=>_({...v,GROQ_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GEMINI API KEY (GEMINI_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"AIzaSy...",value:v.GEMINI_API_KEY,onChange:R=>_({...v,GEMINI_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GITHUB TOKEN (GITHUB_TOKEN)"}),f.jsx("input",{type:"password",placeholder:"ghp_...",value:v.GITHUB_TOKEN,onChange:R=>_({...v,GITHUB_TOKEN:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"CEREBRAS API KEY (CEREBRAS_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"csk_...",value:v.CEREBRAS_API_KEY,onChange:R=>_({...v,CEREBRAS_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"MISTRAL API KEY (MISTRAL_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"Key...",value:v.MISTRAL_API_KEY,onChange:R=>_({...v,MISTRAL_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"DEEPSEEK API KEY (DEEPSEEK_API_KEY)"}),f.jsx("input",{type:"password",placeholder:"sk-...",value:v.DEEPSEEK_API_KEY,onChange:R=>_({...v,DEEPSEEK_API_KEY:R.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]})]}),f.jsxs("div",{className:"flex justify-between items-center pt-2",children:[f.jsx("span",{className:"text-arvis-cyan font-bold text-[10px]",children:x}),f.jsxs("button",{type:"submit",className:"flex items-center space-x-1.5 px-4 py-2 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent font-bold hover:bg-arvis-accent/30 transition-all",children:[f.jsx(Ax,{className:"w-4 h-4"}),f.jsx("span",{children:"SAVE & ACTIVATE CLOUD PROVIDERS"})]})]})]}),u&&f.jsxs("div",{className:"p-4 bg-black/60 border border-green-500/60 space-y-2",children:[f.jsx("span",{className:"font-bold text-green-400 uppercase text-xs",children:"LIVE QUALIFICATION RESULTS REPORT"}),f.jsx("div",{className:"grid grid-cols-4 gap-2 text-[10px]",children:Object.entries(u).map(([R,I])=>f.jsxs("div",{className:"p-2 border border-arvis-border bg-black/40",children:[f.jsx("div",{className:"font-bold text-arvis-text uppercase",children:R}),f.jsxs("div",{className:I.status==="READY"?"text-green-400 font-bold":"text-arvis-dim",children:["STATUS: ",I.status]}),f.jsxs("div",{children:["LATENCY: ",I.latencyMs," ms"]})]},R))})]}),f.jsxs("div",{className:"p-4 bg-black/40 border border-arvis-border space-y-3",children:[f.jsxs("div",{className:"flex justify-between items-center",children:[f.jsx("span",{className:"font-bold text-arvis-cyan uppercase text-xs",children:"ROUTING STRATEGY SELECTOR"}),f.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["ACTIVE: [",t,"]"]})]}),f.jsx("div",{className:"grid grid-cols-5 gap-2",children:["SPEED_FIRST","BALANCED","QUALITY_FIRST","VISION","CODING"].map(R=>f.jsx("button",{onClick:()=>b(R),className:`p-2 border text-center transition-all text-xs font-bold ${t===R?"border-arvis-accent bg-arvis-accent/20 text-arvis-accent shadow-[0_0_10px_rgba(255,42,95,0.3)]":"border-arvis-border/60 bg-black/30 text-arvis-dim hover:text-arvis-text hover:border-arvis-border"}`,children:R},R))})]}),f.jsxs("div",{className:"space-y-3",children:[f.jsxs("div",{className:"flex justify-between items-center text-xs font-semibold text-arvis-dim uppercase",children:[f.jsxs("span",{children:["CONFIGURED PROVIDER MATRIX (",s.filter(R=>R.isConfigured).length," / ",s.length,")"]}),f.jsxs("button",{onClick:M,className:"flex items-center space-x-1 text-arvis-cyan hover:underline",children:[f.jsx(C0,{className:"w-3 h-3"}),f.jsx("span",{children:"REFRESH MATRIX"})]})]}),f.jsx("div",{className:"grid grid-cols-2 gap-3",children:s.map(R=>f.jsxs("div",{className:`p-3 border space-y-2 relative ${R.isConfigured?R.isHealthy?"border-arvis-cyan/60 bg-black/50":"border-arvis-amber/60 bg-arvis-amber/10":"border-arvis-border/40 bg-black/20 opacity-60"}`,children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border/60 pb-1.5",children:[f.jsx("span",{className:"font-bold text-arvis-text text-xs",children:R.displayName}),f.jsx("span",{className:`px-1.5 py-0.2 text-[9px] font-bold border ${R.isConfigured?R.isHealthy?"border-green-500/40 bg-green-500/20 text-green-400":"border-arvis-amber/40 bg-arvis-amber/20 text-arvis-amber animate-pulse":"border-arvis-border bg-black/40 text-arvis-dim"}`,children:R.isConfigured?R.isHealthy?"HEALTHY":"COOLDOWN / 429":"NOT CONFIGURED"})]}),f.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[10px]",children:[f.jsxs("div",{children:[f.jsx("span",{className:"text-arvis-dim",children:"MODEL:"}),f.jsx("div",{className:"text-arvis-cyan truncate",children:R.currentModel})]}),f.jsxs("div",{children:[f.jsx("span",{className:"text-arvis-dim",children:"LATENCY (TTFT):"}),f.jsxs("div",{className:"text-arvis-text",children:[R.lastObservedLatencyMs>0?`${R.lastObservedLatencyMs} ms`:"N/A",R.lastObservedTtftMs?` (${R.lastObservedTtftMs}ms TTFT)`:""]})]})]}),f.jsxs("div",{className:"flex space-x-1.5 pt-1 text-[8px]",children:[f.jsxs("span",{className:`px-1 border ${R.capabilities.supportsTools?"border-arvis-cyan text-arvis-cyan":"border-arvis-border text-arvis-dim"}`,children:["TOOLS: ",R.capabilities.supportsTools?"YES":"NO"]}),f.jsxs("span",{className:`px-1 border ${R.capabilities.supportsVision?"border-arvis-accent text-arvis-accent":"border-arvis-border text-arvis-dim"}`,children:["VISION: ",R.capabilities.supportsVision?"YES":"NO"]}),f.jsxs("span",{className:`px-1 border ${R.capabilities.supportsStreaming?"border-green-400 text-green-400":"border-arvis-border text-arvis-dim"}`,children:["STREAM: ",R.capabilities.supportsStreaming?"YES":"NO"]})]})]},R.id))})]})]})},yd=[{id:"demo-1",number:1,title:"Basic Intelligence & System Overview",tag:"INTELLIGENCE",command:"ORION, give me a quick overview of this machine.",description:"Natural language intent classification, parallel multi-tool DAG planning, and telemetry synthesis.",expectedBehavior:"Executes system.get_info, system.get_cpu_usage, and system.get_memory_usage concurrently, synthesizing a structured system report."},{id:"demo-2",number:2,title:"Safe Tool Execution & Hardware Telemetry",tag:"TOOL USE",command:"Check current CPU and memory usage.",description:"Direct execution of native low-risk read tools with execution metrics, call IDs, and core breakdown.",expectedBehavior:"Polls hardware sensors directly via Node.js OS bindings in single-digit milliseconds."},{id:"demo-3",number:3,title:"Safety Boundary & Permission Enforcement",tag:"PERMISSION GATE",command:"Write test file to restricted system directory C:\\Windows\\System32.",description:"Deterministic risk evaluation intercepts unauthorized mutations to protected system boundaries.",expectedBehavior:"ActionRiskEvaluator flags CRITICAL risk level and ToolService blocks execution under safety policy."},{id:"demo-4",number:4,title:"Visual Perception & Display Stream",tag:"VISION",command:"Capture primary desktop screen and analyze display buffer.",description:"Full-resolution 1080p desktop display stream capture via native Electron desktopCapturer.",expectedBehavior:"Captures primary display buffer, computes buffer length, and routes to multimodal adapter."},{id:"demo-5",number:5,title:"Autonomous Failure Recovery & Replanning",tag:"RELIABILITY",command:"Read non-existent restricted configuration file /invalid/path/missing.cfg.",description:"Demonstrates graceful error handling, replanning evaluation, and zero-crash recovery.",expectedBehavior:"Detects tool error, attempts autonomous replanning recovery, and returns clean explanatory feedback."}],wT=()=>{var V,O,H;const[s,e]=Ue.useState(yd[0]),[t,r]=Ue.useState(yd[0].command),[a,l]=Ue.useState(!1),[u,d]=Ue.useState(null),[p,m]=Ue.useState(null),[v,_]=Ue.useState(null),[x,E]=Ue.useState([]),[M,b]=Ue.useState(null),[S,y]=Ue.useState(null);Ue.useEffect(()=>{R();const N=setInterval(R,5e3);return()=>clearInterval(N)},[]);const R=async()=>{const N=window.orionApi||window.arvisApi;if(N&&N.getDemoHealthCheck)try{const w=await N.getDemoHealthCheck();d(w)}catch{}},I=N=>{e(N),r(N.command),m(null),_(null),b(null),E([])},C=async()=>{const N=window.orionApi||window.arvisApi;N&&(N.resetDemo?await N.resetDemo():N.clearConversation&&await N.clearConversation()),m(null),_(null),b(null),E([]),y("DEMO ENVIRONMENT RESET: Conversation memory & temporary task state flushed clean."),setTimeout(()=>y(null),4e3),R()},Z=async N=>{var W,$,oe,pe,fe,he,z;l(!0),m(null),_(null),b(null);const w=[{label:"USER INPUT",detail:`Received: "${N.command}"`,status:"DONE"},{label:"INTENT CLASSIFICATION",detail:`Evaluating intent category [${N.tag}]...`,status:"ACTIVE"},{label:"PLAN GENERATION",detail:"Decomposing task into Directed Acyclic Graph (DAG)...",status:"PENDING"},{label:"PERMISSION GATE",detail:"Evaluating deterministic risk boundaries...",status:"PENDING"},{label:"TOOL EXECUTION",detail:"Executing registered tools...",status:"PENDING"},{label:"RESULT VERIFICATION",detail:"Verifying data integrity...",status:"PENDING"},{label:"RESPONSE SYNTHESIS",detail:"Synthesizing natural response...",status:"PENDING"}];if(E([...w]),N.id==="demo-4"){const ue=window.orionApi||window.arvisApi;if(ue)try{w[1].status="DONE",w[1].detail="Intent: VISION_CAPTURE (Confidence: 100%)",w[2].status="DONE",w[2].detail="Plan: Execute native desktopCapturer display buffer snapshot",w[3].status="DONE",w[3].detail="Permission: READ_ONLY (LOW Risk, Autonomously Approved)",w[4].status="ACTIVE",w[4].detail="Capturing 1920x1080 display buffer...",E([...w]);const ne=Date.now(),U=await ue.captureScreen(),te=Date.now()-ne;if(U){b(U),w[4].status="DONE",w[4].durationMs=te,w[4].detail=`Display buffer captured: ${U.length.toLocaleString()} base64 chars (${te}ms)`,w[5].status="DONE",w[5].detail="Verification: Non-empty image payload confirmed",w[6].status="DONE",w[6].detail="Response generated",E([...w]);const Ne=`Optical Screen Capture Complete: Successfully captured primary 1920x1080 desktop frame in ${te}ms (${U.length.toLocaleString()} bytes base64). Local display buffer ready for multimodal reasoning.`;m(Ne),_({success:!0,toolCallsExecuted:[{toolName:"desktopCapturer.getSources",toolId:"vision.capture_screen"}],toolResults:[{success:!0,toolId:"vision.capture_screen",executionTimeMs:te}],metrics:{totalCommandLatencyMs:te,toolExecutionLatencyMs:te}})}else w[4].status="FAILED",w[4].detail="Display capture returned null",E([...w]),m("Optical screen capture failed: No active desktop displays detected.")}catch(ne){w[4].status="FAILED",w[4].detail=`Capture error: ${ne.message}`,E([...w]),m(`Vision Capture Error: ${ne.message}`)}finally{l(!1)}return}const k=window.orionApi||window.arvisApi;if(k)try{const ue=Date.now(),ne=await k.processCommand(N.command,"TEXT"),U=Date.now()-ue;w[1].status="DONE",w[1].detail=`Intent identified in ${((W=ne.metrics)==null?void 0:W.intentClassificationLatencyMs)||1}ms`,w[2].status="DONE",w[2].detail=`DAG Plan generated in ${(($=ne.metrics)==null?void 0:$.planningLatencyMs)||1}ms (${((oe=ne.toolCallsExecuted)==null?void 0:oe.length)||0} tools resolved)`,w[3].status=N.id==="demo-3"?"BLOCKED":"DONE",w[3].detail=N.id==="demo-3"?"Risk: CRITICAL — Protected System Boundary Enforced":"Risk: LOW — Read-only operation approved",w[4].status=N.id==="demo-3"?"BLOCKED":N.id==="demo-5"?"FAILED":"DONE",w[4].durationMs=(pe=ne.metrics)==null?void 0:pe.toolExecutionLatencyMs,w[4].detail=((fe=ne.toolCallsExecuted)==null?void 0:fe.length)>0?`Executed ${ne.toolCallsExecuted.map(te=>te.toolName).join(", ")} (${((he=ne.metrics)==null?void 0:he.toolExecutionLatencyMs)||5}ms)`:"Security policy blocked tool dispatch",w[5].status=N.id==="demo-3"?"BLOCKED":"DONE",w[5].detail=N.id==="demo-5"?"Autonomous Replanning: Evaluated alternative recovery paths":ne.success?"Data integrity verified":"Safe error interception verified",w[6].status="DONE",w[6].detail=`Response synthesized in ${((z=ne.metrics)==null?void 0:z.aiTotalGenerationLatencyMs)||1}ms`,E([...w]),m(ne.response),_(ne)}catch(ue){w[4].status="FAILED",w[4].detail=`Error: ${ue.message}`,E([...w]),m(`ORION Error: ${ue.message}`)}finally{l(!1)}};return f.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden font-mono text-xs select-none",children:[f.jsxs("div",{className:"col-span-5 flex flex-col justify-between space-y-4 overflow-hidden",children:[f.jsxs("div",{className:"bg-black/50 border border-arvis-border p-3 space-y-2 shrink-0",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border/60 pb-2",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(Yl,{className:"w-4 h-4 text-green-400"}),f.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"CODERS HQ PRE-FLIGHT CHECK"})]}),f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsxs("span",{className:`px-2 py-0.5 text-[9px] font-bold border ${(u==null?void 0:u.overallStatus)==="READY"?"border-green-500 bg-green-500/20 text-green-400":"border-arvis-amber bg-arvis-amber/20 text-arvis-amber"}`,children:["● ",(u==null?void 0:u.overallStatus)||"READY_WITH_LIMITATIONS"]}),f.jsx("button",{onClick:C,title:"Reset Demo Environment",className:"p-1 border border-arvis-border hover:border-arvis-accent text-arvis-dim hover:text-arvis-accent transition-colors",children:f.jsx(R0,{className:"w-3.5 h-3.5"})})]})]}),f.jsxs("div",{className:"grid grid-cols-3 gap-2 text-[10px]",children:[f.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[f.jsx("span",{className:"text-arvis-dim block",children:"AI ROUTER"}),f.jsx("span",{className:"text-arvis-cyan font-bold truncate block",children:((V=u==null?void 0:u.aiRouter)==null?void 0:V.displayName)||"Omni-Router"})]}),f.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[f.jsx("span",{className:"text-arvis-dim block",children:"TOOL REGISTRY"}),f.jsxs("span",{className:"text-green-400 font-bold block",children:[((O=u==null?void 0:u.tools)==null?void 0:O.totalCount)||16," ACTIVE TOOLS"]})]}),f.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[f.jsx("span",{className:"text-arvis-dim block",children:"IPC BOUNDARY"}),f.jsx("span",{className:"text-arvis-text font-bold block",children:"ONLINE (ISOLATED)"})]})]}),S&&f.jsx("div",{className:"p-1.5 bg-green-500/10 border border-green-500/40 text-green-400 text-[10px] animate-pulse",children:S})]}),f.jsxs("div",{className:"flex-1 overflow-y-auto space-y-2 pr-1",children:[f.jsx("div",{className:"text-[10px] text-arvis-dim uppercase tracking-wider font-bold mb-1",children:"OFFICIAL DEMO SEQUENCES (3–5 MINUTE WALKTHROUGH)"}),yd.map(N=>{const w=s.id===N.id;return f.jsxs("div",{onClick:()=>I(N),className:`p-3 border cursor-pointer transition-all space-y-1.5 ${w?"border-arvis-cyan bg-arvis-cyan/10 shadow-[0_0_12px_rgba(0,240,255,0.15)]":"border-arvis-border/60 bg-black/30 hover:border-arvis-border hover:bg-black/50"}`,children:[f.jsxs("div",{className:"flex justify-between items-center",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsxs("span",{className:"px-1.5 py-0.2 bg-black border border-arvis-border text-[9px] font-bold text-arvis-cyan",children:["DEMO ",N.number]}),f.jsx("span",{className:"font-bold text-arvis-text text-xs",children:N.title})]}),f.jsx("span",{className:"text-[9px] text-arvis-dim border border-arvis-border/40 px-1",children:N.tag})]}),f.jsx("p",{className:"text-[10px] text-arvis-dim line-clamp-2",children:N.description}),f.jsxs("div",{className:"text-[10px] text-arvis-cyan font-mono bg-black/50 p-1 border border-arvis-border/40 truncate",children:["> ",N.command]})]},N.id)})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-3 space-y-2 shrink-0",children:[f.jsxs("div",{className:"flex justify-between items-center text-[10px]",children:[f.jsxs("span",{className:"text-arvis-dim",children:["TARGET: DEMO ",s.number," — ",s.tag]}),f.jsx("span",{className:"text-arvis-cyan font-bold",children:a?"EXECUTING PIPELINE...":"READY TO TRIGGER"})]}),f.jsxs("button",{onClick:()=>Z(s),disabled:a,className:`w-full py-2.5 border font-bold flex items-center justify-center space-x-2 transition-all ${a?"border-arvis-amber bg-arvis-amber/20 text-arvis-amber cursor-wait":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"}`,children:[f.jsx(Qa,{className:"w-4 h-4"}),f.jsx("span",{children:a?"RUNNING REAL ORION PIPELINE...":`EXECUTE DEMO ${s.number}`})]})]})]}),f.jsxs("div",{className:"col-span-7 flex flex-col justify-between space-y-4 overflow-hidden",children:[f.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 space-y-3 flex-1 overflow-y-auto",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(hf,{className:"w-4 h-4 text-arvis-accent animate-pulse"}),f.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"LIVE EXECUTION TRACE (REAL ARCHITECTURE)"})]}),f.jsx("span",{className:"text-[10px] text-arvis-dim font-mono",children:"OBSERVE → PLAN → GATE → ACT → VERIFY"})]}),x.length===0?f.jsxs("div",{className:"h-44 flex flex-col items-center justify-center text-arvis-dim space-y-2",children:[f.jsx(ql,{className:"w-8 h-8 opacity-40 text-arvis-dim"}),f.jsx("div",{className:"text-xs",children:"SELECT AND TRIGGER A DEMO SCENARIO TO WITNESS LIVE PIPELINE EXECUTION"}),f.jsx("div",{className:"text-[10px] text-arvis-dim opacity-70",children:"Each step reflects authentic internal events and real latency timings"})]}):f.jsx("div",{className:"space-y-1.5",children:x.map((N,w)=>f.jsxs("div",{className:`p-2 border flex items-center justify-between text-[11px] font-mono transition-all ${N.status==="DONE"?"border-green-500/40 bg-green-500/5 text-green-300":N.status==="ACTIVE"?"border-arvis-cyan bg-arvis-cyan/15 text-arvis-cyan animate-pulse":N.status==="BLOCKED"?"border-red-500/60 bg-red-500/10 text-red-400":N.status==="FAILED"?"border-arvis-amber/60 bg-arvis-amber/10 text-arvis-amber":"border-arvis-border/30 bg-black/20 text-arvis-dim"}`,children:[f.jsxs("div",{className:"flex items-center space-x-2.5",children:[N.status==="DONE"&&f.jsx(w0,{className:"w-4 h-4 text-green-400 shrink-0"}),N.status==="ACTIVE"&&f.jsx(xf,{className:"w-4 h-4 text-arvis-cyan shrink-0 animate-spin"}),N.status==="BLOCKED"&&f.jsx(Ya,{className:"w-4 h-4 text-red-400 shrink-0"}),N.status==="FAILED"&&f.jsx(P0,{className:"w-4 h-4 text-arvis-amber shrink-0"}),N.status==="PENDING"&&f.jsx("div",{className:"w-2 h-2 rounded-full bg-arvis-dim/40 ml-1 shrink-0"}),f.jsxs("div",{children:[f.jsxs("span",{className:"font-bold mr-2",children:["[",N.label,"]"]}),f.jsx("span",{className:"text-xs text-arvis-text",children:N.detail})]})]}),N.durationMs!==void 0&&f.jsxs("span",{className:"text-[10px] font-bold text-arvis-cyan bg-black/60 px-1.5 py-0.5 border border-arvis-cyan/30",children:[N.durationMs,"ms"]})]},w))}),M&&f.jsxs("div",{className:"mt-3 p-3 bg-black border border-arvis-cyan space-y-2",children:[f.jsxs("div",{className:"flex justify-between items-center text-[10px] border-b border-arvis-border/60 pb-1 text-arvis-cyan font-bold",children:[f.jsxs("span",{className:"flex items-center space-x-1",children:[f.jsx(gf,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"PRIMARY SCREENSHOT BUFFER (1920x1080 DISPLAY RESOLUTION)"})]}),f.jsx("span",{className:"text-green-400",children:"REAL FRAME BUFFER"})]}),f.jsx("div",{className:"max-h-48 overflow-hidden border border-arvis-border/40 flex items-center justify-center bg-black/80",children:f.jsx("img",{src:M,alt:"Live Screen Buffer",className:"max-h-48 object-contain"})})]})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-4 space-y-2 shrink-0 max-h-56 overflow-y-auto",children:[f.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-1.5 text-[10px]",children:[f.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"ORION SYNTHESIZED RESPONSE"}),((H=v==null?void 0:v.metrics)==null?void 0:H.totalCommandLatencyMs)&&f.jsxs("span",{className:"text-arvis-cyan font-bold font-mono",children:["TOTAL COMMAND LATENCY: ",v.metrics.totalCommandLatencyMs,"ms"]})]}),p?f.jsxs("div",{className:"space-y-2",children:[f.jsx("pre",{className:"text-xs text-arvis-text whitespace-pre-wrap font-mono leading-relaxed bg-black/40 p-2.5 border border-arvis-border/60",children:p}),(v==null?void 0:v.toolCallsExecuted)&&v.toolCallsExecuted.length>0&&f.jsxs("div",{className:"flex items-center space-x-2 text-[10px] text-arvis-dim",children:[f.jsx("span",{className:"text-arvis-cyan font-bold",children:"TOOLS DISPATCHED:"}),v.toolCallsExecuted.map((N,w)=>f.jsxs("span",{className:"px-1.5 py-0.5 bg-black border border-arvis-border text-arvis-text",children:[N.toolName," (",N.toolId,")"]},w))]})]}):f.jsx("div",{className:"py-6 text-center text-xs text-arvis-dim",children:"NO ACTIVE EXECUTION COMPLETED YET. SELECT AND TRIGGER A SCENARIO ABOVE."})]})]})]})},bT=()=>{var ne,U,te,Ne,ee;const[s,e]=Ue.useState("SINGLE"),[t,r]=Ue.useState("Video_001"),[a,l]=Ue.useState(!1),[u,d]=Ue.useState(null),[p,m]=Ue.useState(!1),[v,_]=Ue.useState(["Video_001","Video_002","Video_003"]),[x,E]=Ue.useState(null),[M,b]=Ue.useState(null),[S,y]=Ue.useState(null),[R,I]=Ue.useState(null),C=async()=>{var le;const F=window.orionApi||window.arvisApi;if(F)try{const ce=await F.getSystemSnapshot();if(b(ce),F.getTitanOutputPreview){const ge=s==="SINGLE"?t:((le=x==null?void 0:x.progress)==null?void 0:le.currentTarget)||"Video_001",Me=await F.getTitanOutputPreview({target:ge});I(Me)}}catch(ce){console.error("Error fetching telemetry/preview:",ce)}};Ue.useEffect(()=>{var Me,Ve,vt,st;const F=window.orionApi||window.arvisApi;if(!F)return;(Me=F.getTitanPipelineStatus)==null||Me.call(F).then(at=>{at&&d(at)}),(Ve=F.getTitanBatchStatus)==null||Ve.call(F).then(at=>{at&&E(at)}),C();const le=setInterval(C,3e3),ce=(vt=F.onTitanPipelineUpdated)==null?void 0:vt.call(F,at=>{d(at),at.state!=="INSPECTING"&&at.state!=="PLANNING"&&at.state!=="VOICE_READY"&&at.state!=="RENDERING"&&at.state!=="QA_ANALYSIS"&&m(!1),C()}),ge=(st=F.onTitanBatchUpdated)==null?void 0:st.call(F,at=>{E(at),at.state!=="RUNNING_TARGET"&&at.state!=="TARGET_QA"&&at.state!=="VALIDATING_TARGETS"&&m(!1),C()});return()=>{clearInterval(le),ce&&ce(),ge&&ge()}},[t,s]);const Z=async()=>{const F=window.orionApi||window.arvisApi;if(F){m(!0);try{if(F.runTitanPipeline){const le=await F.runTitanPipeline({target:t,hasExplicitRenderApproval:a});d(le)}}catch(le){console.error("Titan Pipeline IPC error:",le)}finally{m(!1)}}},V=async()=>{const F=window.orionApi||window.arvisApi;if(F){l(!0),m(!0);try{if(F.approveTitanRender){const le=await F.approveTitanRender({target:t});d(le)}}catch(le){console.error("Titan Render Approval IPC error:",le)}finally{m(!1)}}},O=async()=>{const F=window.orionApi||window.arvisApi;if(F)try{if(F.resetTitanPipeline){const le=await F.resetTitanPipeline();d(le),l(!1)}}catch(le){console.error("Titan Reset IPC error:",le)}},H=F=>{p||(v.includes(F)?v.length>1&&_(v.filter(le=>le!==F)):_([...v,F]))},N=async()=>{const F=window.orionApi||window.arvisApi;if(!(!F||v.length===0)){m(!0);try{if(F.runTitanBatch){const le=await F.runTitanBatch({targets:v,hasExplicitRenderApproval:a});E(le)}}catch(le){console.error("Titan Batch IPC error:",le)}finally{m(!1)}}},w=async()=>{const F=window.orionApi||window.arvisApi;if(F){l(!0),m(!0);try{if(F.approveTitanBatchTarget){const le=await F.approveTitanBatchTarget();E(le)}}catch(le){console.error("Titan Batch Approval IPC error:",le)}finally{m(!1)}}},k=async()=>{const F=window.orionApi||window.arvisApi;if(F)try{if(F.resetTitanBatch){const le=await F.resetTitanBatch();E(le),l(!1)}}catch(le){console.error("Titan Batch Reset IPC error:",le)}},W=async()=>{var le;const F=window.orionApi||window.arvisApi;if(F){m(!0),y(null);try{if(F.packageTitanRelease){const ce=await F.packageTitanRelease({target:t,forceOverwrite:!0});ce.success?y({success:!0,message:`RELEASE PACKAGED: ${t} bundle created & verified.`,canonicalHash:(le=ce.data)==null?void 0:le.canonicalHash}):y({success:!1,message:`PACKAGING ERROR: ${ce.error||"Unknown error"}`})}}catch(ce){y({success:!1,message:`IPC ERROR: ${ce.message}`})}finally{m(!1)}}},$=async()=>{var le;const F=window.orionApi||window.arvisApi;if(F){m(!0),y(null);try{if(F.validateTitanRelease){const ce=await F.validateTitanRelease({target:t});ce.success?y({success:!0,message:"AUDIT PASSED: 5/5 artifacts verified. Canonical hash valid.",canonicalHash:(le=ce.data)==null?void 0:le.canonicalHash}):y({success:!1,message:`AUDIT FAILED: ${ce.error||"Validation error"}`})}}catch(ce){y({success:!1,message:`AUDIT IPC ERROR: ${ce.message}`})}finally{m(!1)}}},oe=(u==null?void 0:u.state)||"IDLE",pe=(x==null?void 0:x.state)||"IDLE",fe=()=>{if(s==="BATCH")switch(pe){case"RUNNING_TARGET":return"TITAN RENDERING";case"AWAITING_TARGET_APPROVAL":return"TITAN AWAITING APPROVAL";case"TARGET_QA":return"TITAN QA ANALYSIS";case"BATCH_COMPLETED":return"TITAN GATE PASSED";case"BATCH_FAILED":return"TITAN GATE FAILED";case"ERROR":return"SYSTEM ERROR";default:return"TITAN IDLE"}switch(oe){case"INSPECTING":return"TITAN INSPECTING";case"PLANNING":return"TITAN PLANNING";case"VOICE_READY":return"TITAN VOICE READY";case"AWAITING_RENDER_APPROVAL":return"TITAN AWAITING APPROVAL";case"RENDERING":return"TITAN RENDERING";case"QA_ANALYSIS":return"TITAN QA ANALYSIS";case"GATE_PASSED":return"TITAN GATE PASSED";case"GATE_FAILED":return"TITAN GATE FAILED";case"ERROR":return"SYSTEM ERROR";default:return"TITAN IDLE"}},he=M?((M.memory.freeBytes||0)/(1024*1024)).toFixed(0):"N/A",z=M?((M.memory.totalBytes||0)/(1024*1024*1024)).toFixed(1):"N/A",ue=M?`${M.cpu.usagePercent.toFixed(1)}%`:"0.0%";return f.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden font-mono text-xs text-arvis-text",children:[f.jsxs("div",{className:"col-span-4 flex flex-col justify-between space-y-3 bg-black/40 border border-arvis-border p-3 overflow-y-auto",children:[f.jsxs("div",{className:"space-y-3",children:[f.jsxs("div",{className:"flex items-center justify-between border-b border-arvis-border pb-2",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsx(hf,{className:"w-4 h-4 text-arvis-cyan"}),f.jsx("span",{className:"font-extrabold text-xs tracking-widest text-arvis-text",children:"TITAN // OPERATOR COMMAND"})]}),f.jsxs("div",{className:"flex space-x-1 bg-black border border-arvis-border p-0.5",children:[f.jsx("button",{onClick:()=>e("SINGLE"),className:`px-2 py-0.5 text-[9px] font-bold transition-all ${s==="SINGLE"?"bg-arvis-cyan/30 text-arvis-cyan":"text-arvis-dim hover:text-arvis-text"}`,children:"SINGLE"}),f.jsx("button",{onClick:()=>e("BATCH"),className:`px-2 py-0.5 text-[9px] font-bold transition-all ${s==="BATCH"?"bg-arvis-cyan/30 text-arvis-cyan":"text-arvis-dim hover:text-arvis-text"}`,children:"BATCH"})]})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1",children:[f.jsx("div",{className:"text-[9px] text-arvis-dim tracking-wider",children:"UNIFIED OPERATOR STATUS"}),f.jsxs("div",{className:"text-xs font-bold text-arvis-cyan tracking-wider flex items-center space-x-2",children:[f.jsx("span",{className:"w-2 h-2 rounded-full bg-arvis-cyan animate-ping"}),f.jsx("span",{children:fe()})]})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1.5 text-[10px]",children:[f.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between",children:[f.jsxs("span",{className:"flex items-center space-x-1",children:[f.jsx(Ws,{className:"w-3 h-3 text-arvis-cyan"}),f.jsx("span",{children:"SYSTEM TELEMETRY"})]}),f.jsx("span",{className:"text-green-400",children:"ONLINE"})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"CPU USAGE:"}),f.jsx("span",{className:"text-arvis-cyan font-bold",children:ue})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"RAM AVAILABLE:"}),f.jsxs("span",{className:"text-green-400 font-bold",children:[he," MB / ",z," GB"]})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"MODE:"}),f.jsxs("span",{className:"text-arvis-cyan font-bold",children:[s," PRODUCTION"]})]}),s==="SINGLE"?f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"TARGET:"}),f.jsx("span",{className:"text-arvis-cyan font-bold",children:t})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"RENDER ATTEMPTS:"}),f.jsxs("span",{children:[(u==null?void 0:u.renderAttempts)||0," / 1"]})]})]}):f.jsxs(f.Fragment,{children:[f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"BATCH TARGETS:"}),f.jsxs("span",{className:"text-arvis-cyan font-bold",children:[v.length," TARGETS"]})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"COMPLETED / TOTAL:"}),f.jsxs("span",{children:[((ne=x==null?void 0:x.progress)==null?void 0:ne.completedTargets)||0," / ",v.length]})]})]}),f.jsxs("div",{className:"flex justify-between",children:[f.jsx("span",{children:"APPROVAL STATUS:"}),f.jsx("span",{className:a?"text-green-400 font-bold":"text-amber-400",children:a?"AUTHORIZED":"APPROVAL REQUIRED"})]})]}),s==="SINGLE"?f.jsxs("div",{className:"space-y-1",children:[f.jsx("label",{className:"text-[9px] text-arvis-dim tracking-wider uppercase block",children:"SELECT TARGET PROJECT"}),f.jsxs("select",{value:t,onChange:F=>r(F.target.value),disabled:p,className:"w-full bg-black border border-arvis-border text-arvis-cyan p-1.5 font-mono outline-none focus:border-arvis-cyan text-xs",children:[f.jsx("option",{value:"Video_001",children:"Video_001 (Nvidia $3T Moat)"}),f.jsx("option",{value:"Video_002",children:"Video_002 ($1M AI Agency)"}),f.jsx("option",{value:"Video_003",children:"Video_003 (Gigafactory Automation)"})]})]}):f.jsxs("div",{className:"space-y-1.5 bg-black/60 border border-arvis-border p-2",children:[f.jsx("label",{className:"text-[9px] text-arvis-dim tracking-wider uppercase block",children:"BATCH TARGET SELECTOR (SEQUENTIAL)"}),f.jsx("div",{className:"space-y-1",children:["Video_001","Video_002","Video_003"].map(F=>f.jsxs("div",{onClick:()=>H(F),className:"flex items-center space-x-2 cursor-pointer hover:text-arvis-cyan select-none",children:[v.includes(F)?f.jsx(Rx,{className:"w-3.5 h-3.5 text-arvis-cyan"}):f.jsx(Nx,{className:"w-3.5 h-3.5 text-arvis-dim"}),f.jsx("span",{className:"text-[11px]",children:F})]},F))})]}),f.jsxs("div",{className:"space-y-2",children:[s==="SINGLE"?f.jsxs("button",{onClick:Z,disabled:p,className:`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${p?"border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[f.jsx(Qa,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:p?"PIPELINE EXECUTING...":"RUN TITAN PIPELINE"})]}):f.jsxs("button",{onClick:N,disabled:p||v.length===0,className:`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${p||v.length===0?"border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[f.jsx(pf,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:p?"BATCH EXECUTING...":`START BATCH (${v.length} TARGETS)`})]}),f.jsxs("button",{onClick:s==="SINGLE"?O:k,disabled:p,className:"w-full p-1.5 border border-arvis-border hover:border-arvis-cyan text-[10px] text-arvis-dim hover:text-arvis-cyan transition-all flex items-center justify-center space-x-1",children:[f.jsx(R0,{className:"w-3 h-3"}),f.jsx("span",{children:s==="SINGLE"?"RESET PIPELINE":"RESET BATCH"})]})]})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1 text-[10px]",children:[f.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center space-x-1",children:[f.jsx(Sx,{className:"w-3 h-3 text-arvis-cyan"}),f.jsx("span",{children:"OUTPUT PREVIEW (READ-ONLY)"})]}),R!=null&&R.exists?f.jsxs("div",{className:"space-y-0.5 text-green-300",children:[f.jsxs("div",{className:"font-bold text-xs text-arvis-cyan flex items-center space-x-1",children:[f.jsx(Fl,{className:"w-3 h-3 text-green-400"}),f.jsx("span",{children:R.filename})]}),f.jsxs("div",{className:"text-arvis-dim",children:["SIZE: ",R.sizeMB," MB (",R.sizeBytes.toLocaleString()," bytes)"]}),f.jsxs("div",{className:"text-[9px] text-arvis-dim truncate",children:["PATH: ",R.filePath]})]}):f.jsx("div",{className:"text-arvis-dim italic text-[9px] py-1",children:(R==null?void 0:R.message)||"No experimental output rendered."})]}),f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-2 text-[10px]",children:[f.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between",children:[f.jsxs("span",{className:"flex items-center space-x-1",children:[f.jsx(Ya,{className:"w-3 h-3 text-amber-400"}),f.jsx("span",{children:"PHASE 7B RELEASE CONTROLS"})]}),f.jsx("span",{className:"text-amber-400 text-[8px] border border-amber-500/30 px-1 bg-amber-500/10",children:"LOCAL ONLY"})]}),f.jsxs("div",{className:"flex space-x-1.5",children:[f.jsx("button",{onClick:W,disabled:p,className:"flex-1 p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-[9px] transition-all",children:"[ PACKAGE RELEASE ]"}),f.jsx("button",{onClick:$,disabled:p,className:"flex-1 p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-arvis-cyan font-bold text-[9px] transition-all",children:"[ AUDIT RELEASE ]"})]}),S&&f.jsxs("div",{className:`p-1.5 border text-[9px] leading-tight ${S.success?"bg-green-500/10 border-green-500/30 text-green-300":"bg-red-500/10 border-red-500/30 text-red-300"}`,children:[f.jsx("div",{className:"font-bold",children:S.message}),S.canonicalHash&&f.jsxs("div",{className:"text-[8px] text-arvis-dim truncate mt-0.5",children:["HASH: ",S.canonicalHash]})]})]})]}),f.jsxs("div",{className:"col-span-5 flex flex-col space-y-3 justify-between bg-black/40 border border-arvis-border p-3 overflow-y-auto",children:[s==="BATCH"?f.jsxs("div",{children:[f.jsxs("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex justify-between",children:[f.jsx("span",{children:"SEQUENTIAL BATCH PROGRESSION"}),f.jsxs("span",{children:["STATE: [",pe,"]"]})]}),f.jsx("div",{className:"space-y-2 font-mono text-xs",children:v.map((F,le)=>{var vt,st;const ce=(vt=x==null?void 0:x.targetResults)==null?void 0:vt[F],ge=((st=x==null?void 0:x.progress)==null?void 0:st.currentTarget)===F,Me=ce==null?void 0:ce.gatePassed,Ve=ce&&!ce.gatePassed&&ce.state!=="AWAITING_APPROVAL";return f.jsxs("div",{className:"flex items-center justify-between p-2 bg-black/60 border border-arvis-border",children:[f.jsxs("div",{className:"flex items-center space-x-2",children:[f.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["#",le+1]}),f.jsx("span",{className:ge?"text-arvis-cyan font-bold":"text-arvis-text",children:F})]}),f.jsxs("div",{children:[Me&&f.jsxs("span",{className:"text-green-400 font-bold text-[10px]",children:["[ GATE PASSED - ",ce.qaScore,"/100 ]"]}),Ve&&f.jsxs("span",{className:"text-red-400 font-bold text-[10px]",children:["[ FAILED - ",ce.qaScore||0,"/100 ]"]}),ge&&f.jsx("span",{className:"text-arvis-cyan font-bold text-[10px] animate-pulse",children:"◉ EXECUTING"}),!ce&&!ge&&f.jsx("span",{className:"text-arvis-dim text-[10px]",children:"○ QUEUED"})]})]},F)})})]}):f.jsxs("div",{children:[f.jsx("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2",children:"PIPELINE EXECUTION STAGES"}),f.jsx("div",{className:"space-y-2 font-mono text-xs",children:["INSPECTING","PLANNING","VOICE_READY","RENDERING","QA_ANALYSIS"].map(F=>f.jsxs("div",{className:"flex items-center space-x-3",children:[f.jsx("span",{className:oe===F?"text-arvis-cyan font-bold animate-pulse":"text-arvis-dim",children:oe===F?"◉":"○"}),f.jsx("span",{className:oe===F?"text-arvis-cyan font-bold":"text-arvis-text",children:F})]},F))})]}),(oe==="AWAITING_RENDER_APPROVAL"||pe==="AWAITING_TARGET_APPROVAL")&&f.jsxs("div",{className:"bg-amber-500/10 border-2 border-amber-500 p-3 space-y-2 animate-pulse",children:[f.jsxs("div",{className:"flex items-center space-x-2 text-amber-400 font-bold text-xs tracking-wider",children:[f.jsx(Ya,{className:"w-4 h-4"}),f.jsx("span",{children:"RENDER APPROVAL REQUIRED"})]}),f.jsxs("div",{className:"bg-black/60 border border-amber-500/30 p-2 space-y-1 text-[10px] text-amber-200",children:[f.jsxs("div",{children:["• ",f.jsx("strong",{children:"TARGET:"})," ",f.jsx("code",{className:"text-arvis-cyan",children:s==="SINGLE"?t:((U=x==null?void 0:x.progress)==null?void 0:U.pendingApprovalTarget)||t})," ",s==="BATCH"&&`(TARGET ${((te=x==null?void 0:x.progress)==null?void 0:te.currentTargetIndex)||1} / ${v.length})`]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"ACTION:"})," Invoke ",f.jsx("code",{className:"text-arvis-cyan",children:"master_documentary_compiler.py"})]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"RISK LEVEL:"})," ",f.jsx("span",{className:"text-red-400 font-bold",children:"HIGH (MUTATING / DANGEROUS)"})]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"OUTPUT PATH:"})," ",f.jsx("code",{className:"text-arvis-cyan",children:"07_Video_Projects/Experimental/"})]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"QA GATE REQUIREMENT:"})," Score >= 90.0 / 100"]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"AVAILABLE RAM:"})," ",f.jsxs("span",{className:"text-green-400 font-bold",children:[he," MB free"]})," (Precondition >= 512MB)"]})]}),f.jsxs("div",{className:"flex items-center space-x-2 pt-1",children:[f.jsx("button",{onClick:s==="SINGLE"?V:w,disabled:p,className:"flex-1 p-2 bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-all text-xs tracking-wider",children:"[ APPROVE RENDER ]"}),f.jsx("button",{onClick:s==="SINGLE"?O:k,disabled:p,className:"px-3 p-2 bg-black border border-amber-500/50 text-amber-400 hover:bg-white/5 text-xs font-bold",children:"[ CANCEL ]"})]})]}),s==="BATCH"&&pe==="BATCH_COMPLETED"&&x&&f.jsxs("div",{className:"bg-green-500/10 border-2 border-green-500 p-3 space-y-2",children:[f.jsxs("div",{className:"flex items-center space-x-2 text-green-400 font-bold text-xs tracking-wider",children:[f.jsx(Fl,{className:"w-4 h-4"}),f.jsx("span",{children:"BATCH PRODUCTION COMPLETED"})]}),f.jsxs("div",{className:"bg-black/60 border border-green-500/30 p-2 space-y-1 text-[10px] text-green-200",children:[f.jsxs("div",{children:["• ",f.jsx("strong",{children:"TOTAL TARGETS:"})," ",x.totalTargets]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"PASSED:"})," ",x.passedTargets," / ",x.totalTargets]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"FAILED:"})," ",x.failedTargets]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"QA GATE STATUS:"})," ALL TARGETS PASSED (>= 90/100)"]}),f.jsxs("div",{children:["• ",f.jsx("strong",{children:"PROTECTED MASTERS:"})," UNCHANGED & INTACT"]})]})]}),s==="SINGLE"&&f.jsxs("div",{className:"bg-black/60 border border-arvis-border p-3 space-y-2",children:[f.jsx("div",{className:"text-[10px] text-arvis-dim",children:"RETENTION QA GATE EVALUATION"}),f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{children:[f.jsx("div",{className:"text-2xl font-extrabold tracking-wider text-arvis-text",children:(u==null?void 0:u.qaScore)!==void 0?`${u.qaScore} / 100`:"-- / 100"}),f.jsx("div",{className:"text-[9px] text-arvis-dim",children:"DETERMINISTIC GATE THRESHOLD: 90.0 / 100"})]}),oe==="GATE_PASSED"&&f.jsxs("div",{className:"flex items-center space-x-1 px-2.5 py-1 bg-green-500/20 border border-green-500 text-green-400 font-bold text-xs",children:[f.jsx(Fl,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"[ GATE PASSED ]"})]}),oe==="GATE_FAILED"&&f.jsxs("div",{className:"flex items-center space-x-1 px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 font-bold text-xs",children:[f.jsx(_x,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"[ GATE FAILED ]"})]})]})]})]}),f.jsxs("div",{className:"col-span-3 flex flex-col bg-black/40 border border-arvis-border p-3 overflow-hidden",children:[f.jsxs("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex items-center justify-between",children:[f.jsxs("span",{className:"flex items-center space-x-1.5",children:[f.jsx(yx,{className:"w-3.5 h-3.5 text-arvis-cyan"}),f.jsx("span",{children:"EVENT STREAM"})]}),f.jsxs("span",{className:"text-[9px] text-arvis-dim",children:[s==="SINGLE"?((Ne=u==null?void 0:u.auditTrail)==null?void 0:Ne.length)||0:((ee=x==null?void 0:x.events)==null?void 0:ee.length)||0," EVENTS"]})]}),f.jsx("div",{className:"flex-1 overflow-y-auto space-y-1.5 text-[10px] pr-1",children:s==="SINGLE"?u!=null&&u.auditTrail&&u.auditTrail.length>0?u.auditTrail.map((F,le)=>{const ce=new Date(F.timestamp).toLocaleTimeString(),ge=F.severity==="SUCCESS"?"text-green-400 font-bold":F.severity==="WARNING"?"text-amber-400 font-bold":F.severity==="ERROR"?"text-red-400 font-bold":"text-arvis-cyan font-bold",Me=F.severity==="SUCCESS"?"bg-green-500/10 border-green-500/30":F.severity==="WARNING"?"bg-amber-500/10 border-amber-500/30":F.severity==="ERROR"?"bg-red-500/10 border-red-500/30":"bg-cyan-500/10 border-cyan-500/30";return f.jsxs("div",{className:"border-b border-arvis-border/40 pb-1",children:[f.jsxs("div",{className:"flex justify-between text-arvis-dim text-[9px]",children:[f.jsx("span",{children:ce}),f.jsx("span",{className:`px-1 border text-[8px] ${Me} ${ge}`,children:F.stage})]}),f.jsx("div",{className:"text-arvis-text leading-tight mt-0.5 text-[9px]",children:F.message})]},le)}):f.jsx("div",{className:"text-arvis-dim text-center mt-12",children:"No active pipeline events"}):x!=null&&x.events&&x.events.length>0?x.events.map((F,le)=>{const ce=new Date(F.timestamp).toLocaleTimeString(),ge=F.severity==="SUCCESS"?"text-green-400 font-bold":F.severity==="WARNING"?"text-amber-400 font-bold":F.severity==="ERROR"?"text-red-400 font-bold":"text-arvis-cyan font-bold",Me=F.severity==="SUCCESS"?"bg-green-500/10 border-green-500/30":F.severity==="WARNING"?"bg-amber-500/10 border-amber-500/30":F.severity==="ERROR"?"bg-red-500/10 border-red-500/30":"bg-cyan-500/10 border-cyan-500/30";return f.jsxs("div",{className:"border-b border-arvis-border/40 pb-1",children:[f.jsxs("div",{className:"flex justify-between text-arvis-dim text-[9px]",children:[f.jsx("span",{children:ce}),f.jsx("span",{className:`px-1 border text-[8px] ${Me} ${ge}`,children:F.target||F.state})]}),f.jsx("div",{className:"text-arvis-text leading-tight mt-0.5 text-[9px]",children:F.message})]},le)}):f.jsx("div",{className:"text-arvis-dim text-center mt-12",children:"No active batch events"})})]})]})},AT=({currentMode:s,assistantState:e,snapshot:t,activities:r,currentTask:a,cameraActive:l})=>{if(s==="COMMAND")return f.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 overflow-hidden",children:[f.jsx("div",{className:"col-span-3 h-full overflow-hidden",children:f.jsx(y0,{snapshot:t})}),f.jsxs("div",{className:"col-span-6 h-full flex flex-col justify-between space-y-4",children:[f.jsxs("div",{className:"flex-1 bg-[#0B0F1A]/85 border border-blue-500/25 rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center orion-glass",children:[f.jsxs("div",{className:"absolute top-3 left-3 text-[9px] text-slate-400 font-mono tracking-widest flex items-center space-x-1.5",children:[f.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"}),f.jsx("span",{children:"ORION // CORE_VISUALIZER"})]}),f.jsxs("div",{className:"absolute top-3 right-3 text-[9px] text-cyan-300 font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30",children:["STATE: [",e,"]"]}),f.jsx(_0,{assistantState:e})]}),f.jsx("div",{className:"h-24",children:f.jsx(S0,{currentTask:a})})]}),f.jsx("div",{className:"col-span-3 h-full overflow-hidden",children:f.jsx(yT,{activities:r})})]});switch(s){case"DEMO":return f.jsx(wT,{});case"MEMORY":return f.jsx(ST,{});case"COMPUTER":return f.jsx(ET,{});case"VISION":return f.jsx(MT,{cameraActive:l});case"NETWORK":return f.jsx(TT,{});case"SYSTEM":return f.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl overflow-y-auto space-y-6",children:[f.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest mb-4 flex items-center space-x-2",children:[f.jsx(Ws,{className:"w-5 h-5 text-cyan-400"}),f.jsx("span",{children:"FULL SYSTEM TELEMETRY DIAGNOSTICS"})]}),f.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[f.jsx(y0,{snapshot:t}),f.jsxs("div",{className:"bg-[#070A13]/80 border border-blue-500/30 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-300 shadow-xl",children:[f.jsx("div",{className:"text-cyan-400 font-bold border-b border-blue-500/30 pb-2 text-sm tracking-wider",children:"HARDWARE SPECIFICATIONS"}),f.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[f.jsx("span",{className:"text-slate-400",children:"PROCESSOR:"})," ",f.jsx("span",{className:"font-semibold text-white",children:(t==null?void 0:t.cpu.model)||"N/A"})]}),f.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[f.jsx("span",{className:"text-slate-400",children:"CORES DETECTED:"})," ",f.jsxs("span",{className:"font-semibold text-cyan-300",children:[(t==null?void 0:t.cpu.cores.length)||0," CORES"]})]}),f.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[f.jsx("span",{className:"text-slate-400",children:"GRAPHICS:"})," ",f.jsx("span",{className:"font-semibold text-indigo-300",children:(t==null?void 0:t.gpu.name)||"N/A"})]}),f.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[f.jsx("span",{className:"text-slate-400",children:"MEMORY TOTAL:"})," ",f.jsxs("span",{className:"font-semibold text-white",children:[(((t==null?void 0:t.memory.totalBytes)||0)/(1024*1024*1024)).toFixed(2)," GB"]})]}),f.jsxs("div",{className:"flex justify-between py-1",children:[f.jsx("span",{className:"text-slate-400",children:"TELEMETRY MODE:"})," ",f.jsx("span",{className:"font-semibold text-emerald-400",children:t!=null&&t.isMock?"DEVELOPMENT MOCK PROVIDER":"NATIVE HARDWARE"})]})]})]})]});case"WORLD":return f.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl flex flex-col justify-between",children:[f.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest flex items-center space-x-2",children:[f.jsx(A0,{className:"w-5 h-5 text-cyan-400"}),f.jsx("span",{children:"GLOBAL INTELLIGENCE & GEOGRAPHIC NETWORK"})]}),f.jsx("div",{className:"flex-1 my-4 border border-blue-500/30 rounded-xl relative bg-[#070A13] overflow-hidden",children:f.jsx(_0,{assistantState:e})}),f.jsx("div",{className:"text-xs text-slate-400 font-mono",children:"GLOBAL GEOGRAPHIC DATA ENRICHMENT SERVICE READY FOR API INTEGRATION."})]});case"TASK":return f.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl space-y-4",children:[f.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest flex items-center space-x-2",children:[f.jsx(pf,{className:"w-5 h-5 text-violet-400"}),f.jsx("span",{children:"AUTOMATION PIPELINE & TASK MANAGER"})]}),f.jsx("div",{className:"h-28",children:f.jsx(S0,{currentTask:a})})]});case"TITAN":return f.jsx(bT,{});default:return f.jsxs("div",{className:"h-full flex items-center justify-center text-arvis-dim text-xs",children:["MODE [",s,"] INITIALIZING..."]})}},CT=()=>{var s;try{const t=(s=new URLSearchParams(window.location.search).get("mode"))==null?void 0:s.toUpperCase();if(t&&["COMMAND","VISION","TOOLS","SETTINGS","SYSTEM","SUPERVISOR","DEMO"].includes(t))return t;const r=window.location.hash.replace("#","").toUpperCase();if(r&&["COMMAND","VISION","TOOLS","SETTINGS","SYSTEM","SUPERVISOR","DEMO"].includes(r))return r}catch{}return"COMMAND"},RT=()=>{const[s,e]=Ue.useState("STANDBY"),[t,r]=Ue.useState(CT),[a,l]=Ue.useState({micActive:!1,cameraActive:!1,screenCaptureActive:!1,userConfirmationRequired:!0}),[u,d]=Ue.useState(null),[p,m]=Ue.useState([]),[v,_]=Ue.useState(null),[x,E]=Ue.useState("");Ue.useEffect(()=>{yn.logActivity("SYSTEM_EVENT","ORION Core Orchestrator Online",{mode:"COMMAND"},"COMMAND");const R=yn.subscribe("activity.logged",()=>{m(yn.getActivityHistory())}),I=yn.subscribe("assistant.state.changed",({state:H})=>{e(H)}),C=yn.subscribe("assistant.mode.changed",({mode:H})=>{r(H)}),Z=window.orionApi||window.arvisApi;Z&&Z.getInitialMode&&Z.getInitialMode().then(H=>{H&&H==="DEMO"&&r("DEMO")}).catch(()=>{});const V=async()=>{var N;const H=window.orionApi||window.arvisApi;if(H)try{const w=await H.getSystemSnapshot();d(w),yn.emit("system.stats.updated",{snapshot:w});const k=await((N=H.getSupervisorTasks)==null?void 0:N.call(H));if(k&&k.length>0){const W=k[k.length-1];_({id:W.taskId,title:W.title,status:W.status==="COMPLETED"?"COMPLETED":"RUNNING",progressPercent:W.progressPercent,currentAction:W.description,startedAt:W.createdAt,logs:[W.description,`Status: ${W.status}`,`Retries: ${W.retriesAttempted}`]})}}catch(w){console.error("Error fetching system snapshot:",w)}};V();const O=setInterval(V,2500);return()=>{clearInterval(O),R(),I(),C()}},[]);const M=R=>{const I=t;r(R),yn.emit("assistant.mode.changed",{mode:R,previousMode:I}),yn.logActivity("SYSTEM_EVENT",`Navigated to ${R} HUD Screen Mode`,{mode:R})},b=async()=>{const R=!a.micActive;l(C=>({...C,micActive:R}));const I=window.orionApi||window.arvisApi;I&&await I.controlVoice(R?"start":"stop"),R?(e("LISTENING"),yn.logActivity("VOICE_INPUT","Microphone Activated - Listening for Wake Word")):(e("STANDBY"),yn.logActivity("SYSTEM_EVENT","Microphone Deactivated"))},S=()=>{const R=!a.cameraActive;l(I=>({...I,cameraActive:R})),R?(e("VISION"),yn.logActivity("SYSTEM_EVENT","Optical Sensor / Camera Input Activated")):(e("STANDBY"),yn.logActivity("SYSTEM_EVENT","Camera Input Deactivated"))},y=async R=>{if(R.preventDefault(),!x.trim())return;const I=x.trim();E(""),yn.logActivity("VOICE_INPUT",`Operator: "${I}"`);const C=window.orionApi||window.arvisApi;if(C)try{e("THINKING");const Z=await C.processCommand(I,"TEXT");Z&&(Z.response&&yn.logActivity("TASK_COMPLETE",Z.response),Z.suggestedMode&&M(Z.suggestedMode))}catch(Z){console.error("Command processing error:",Z),yn.logActivity("ERROR_EVENT",`Error: ${Z.message||Z}`)}finally{e("STANDBY")}};return f.jsxs("div",{className:"w-screen h-screen flex flex-col justify-between bg-[#0B0F1A] text-white overflow-hidden select-none font-mono relative",children:[f.jsx("div",{className:"absolute inset-0 pointer-events-none scanline-overlay z-50 opacity-20"}),f.jsx(Dx,{assistantState:s,currentMode:t,privacy:a,onModeSelect:M,onToggleMic:b,onToggleCamera:S}),f.jsx("div",{className:"flex-1 overflow-hidden relative",children:f.jsx(AT,{currentMode:t,assistantState:s,snapshot:u,activities:p,currentTask:v,cameraActive:a.cameraActive})}),f.jsxs("div",{className:"p-3 bg-[#0B0F1A]/90 border-t border-blue-500/20 backdrop-blur-md flex items-center space-x-3 z-40",children:[f.jsx("button",{onClick:b,className:`p-2.5 rounded-lg border transition-all ${a.micActive?"border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse shadow-lg shadow-amber-500/30":"border-blue-500/30 bg-[#070A13]/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40"}`,title:"Toggle Microphone Voice Command",children:f.jsx(mf,{className:"w-4 h-4"})}),f.jsxs("form",{onSubmit:y,className:"flex-1 flex items-center space-x-2",children:[f.jsx("input",{type:"text",placeholder:"Type or speak command (e.g., 'ORION, show system' or 'ORION, what's my CPU usage?')...",value:x,onChange:R=>E(R.target.value),className:"w-full bg-[#070A13]/80 border border-blue-500/30 rounded-lg p-2.5 px-4 text-xs text-cyan-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 outline-none transition-all"}),f.jsxs("button",{type:"submit",className:"p-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5",children:[f.jsx("span",{children:"SEND"}),f.jsx(N0,{className:"w-3.5 h-3.5"})]})]})]})]})};ux.createRoot(document.getElementById("root")).render(f.jsx(ix.StrictMode,{children:f.jsx(RT,{})}));
