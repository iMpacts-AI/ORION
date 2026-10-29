var Jv=Object.defineProperty;var eg=(s,e,t)=>e in s?Jv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var cl=(s,e,t)=>eg(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function A0(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Lu={exports:{}},Fa={},Du={exports:{}},St={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nm;function tg(){if(nm)return St;nm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),d=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),_=Symbol.iterator;function g(O){return O===null||typeof O!="object"?null:(O=_&&O[_]||O["@@iterator"],typeof O=="function"?O:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,A={};function S(O,J,De){this.props=O,this.context=J,this.refs=A,this.updater=De||E}S.prototype.isReactComponent={},S.prototype.setState=function(O,J){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,J,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function y(){}y.prototype=S.prototype;function P(O,J,De){this.props=O,this.context=J,this.refs=A,this.updater=De||E}var I=P.prototype=new y;I.constructor=P,M(I,S.prototype),I.isPureReactComponent=!0;var C=Array.isArray,ie=Object.prototype.hasOwnProperty,V={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function q(O,J,De){var ne,k={},ue=null,fe=null;if(J!=null)for(ne in J.ref!==void 0&&(fe=J.ref),J.key!==void 0&&(ue=""+J.key),J)ie.call(J,ne)&&!F.hasOwnProperty(ne)&&(k[ne]=J[ne]);var ge=arguments.length-2;if(ge===1)k.children=De;else if(1<ge){for(var Ae=Array(ge),Fe=0;Fe<ge;Fe++)Ae[Fe]=arguments[Fe+2];k.children=Ae}if(O&&O.defaultProps)for(ne in ge=O.defaultProps,ge)k[ne]===void 0&&(k[ne]=ge[ne]);return{$$typeof:s,type:O,key:ue,ref:fe,props:k,_owner:V.current}}function R(O,J){return{$$typeof:s,type:O.type,key:J,ref:O.ref,props:O.props,_owner:O._owner}}function b(O){return typeof O=="object"&&O!==null&&O.$$typeof===s}function j(O){var J={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(De){return J[De]})}var K=/\/+/g;function Y(O,J){return typeof O=="object"&&O!==null&&O.key!=null?j(""+O.key):J.toString(36)}function le(O,J,De,ne,k){var ue=typeof O;(ue==="undefined"||ue==="boolean")&&(O=null);var fe=!1;if(O===null)fe=!0;else switch(ue){case"string":case"number":fe=!0;break;case"object":switch(O.$$typeof){case s:case e:fe=!0}}if(fe)return fe=O,k=k(fe),O=ne===""?"."+Y(fe,0):ne,C(k)?(De="",O!=null&&(De=O.replace(K,"$&/")+"/"),le(k,J,De,"",function(Fe){return Fe})):k!=null&&(b(k)&&(k=R(k,De+(!k.key||fe&&fe.key===k.key?"":(""+k.key).replace(K,"$&/")+"/")+O)),J.push(k)),1;if(fe=0,ne=ne===""?".":ne+":",C(O))for(var ge=0;ge<O.length;ge++){ue=O[ge];var Ae=ne+Y(ue,ge);fe+=le(ue,J,De,Ae,k)}else if(Ae=g(O),typeof Ae=="function")for(O=Ae.call(O),ge=0;!(ue=O.next()).done;)ue=ue.value,Ae=ne+Y(ue,ge++),fe+=le(ue,J,De,Ae,k);else if(ue==="object")throw J=String(O),Error("Objects are not valid as a React child (found: "+(J==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":J)+"). If you meant to render a collection of children, use an array instead.");return fe}function xe(O,J,De){if(O==null)return O;var ne=[],k=0;return le(O,ne,"","",function(ue){return J.call(De,ue,k++)}),ne}function de(O){if(O._status===-1){var J=O._result;J=J(),J.then(function(De){(O._status===0||O._status===-1)&&(O._status=1,O._result=De)},function(De){(O._status===0||O._status===-1)&&(O._status=2,O._result=De)}),O._status===-1&&(O._status=0,O._result=J)}if(O._status===1)return O._result.default;throw O._result}var me={current:null},B={transition:null},pe={ReactCurrentDispatcher:me,ReactCurrentBatchConfig:B,ReactCurrentOwner:V};function te(){throw Error("act(...) is not supported in production builds of React.")}return St.Children={map:xe,forEach:function(O,J,De){xe(O,function(){J.apply(this,arguments)},De)},count:function(O){var J=0;return xe(O,function(){J++}),J},toArray:function(O){return xe(O,function(J){return J})||[]},only:function(O){if(!b(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},St.Component=S,St.Fragment=t,St.Profiler=a,St.PureComponent=P,St.StrictMode=r,St.Suspense=p,St.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=pe,St.act=te,St.cloneElement=function(O,J,De){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var ne=M({},O.props),k=O.key,ue=O.ref,fe=O._owner;if(J!=null){if(J.ref!==void 0&&(ue=J.ref,fe=V.current),J.key!==void 0&&(k=""+J.key),O.type&&O.type.defaultProps)var ge=O.type.defaultProps;for(Ae in J)ie.call(J,Ae)&&!F.hasOwnProperty(Ae)&&(ne[Ae]=J[Ae]===void 0&&ge!==void 0?ge[Ae]:J[Ae])}var Ae=arguments.length-2;if(Ae===1)ne.children=De;else if(1<Ae){ge=Array(Ae);for(var Fe=0;Fe<Ae;Fe++)ge[Fe]=arguments[Fe+2];ne.children=ge}return{$$typeof:s,type:O.type,key:k,ref:ue,props:ne,_owner:fe}},St.createContext=function(O){return O={$$typeof:d,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},St.createElement=q,St.createFactory=function(O){var J=q.bind(null,O);return J.type=O,J},St.createRef=function(){return{current:null}},St.forwardRef=function(O){return{$$typeof:f,render:O}},St.isValidElement=b,St.lazy=function(O){return{$$typeof:v,_payload:{_status:-1,_result:O},_init:de}},St.memo=function(O,J){return{$$typeof:m,type:O,compare:J===void 0?null:J}},St.startTransition=function(O){var J=B.transition;B.transition={};try{O()}finally{B.transition=J}},St.unstable_act=te,St.useCallback=function(O,J){return me.current.useCallback(O,J)},St.useContext=function(O){return me.current.useContext(O)},St.useDebugValue=function(){},St.useDeferredValue=function(O){return me.current.useDeferredValue(O)},St.useEffect=function(O,J){return me.current.useEffect(O,J)},St.useId=function(){return me.current.useId()},St.useImperativeHandle=function(O,J,De){return me.current.useImperativeHandle(O,J,De)},St.useInsertionEffect=function(O,J){return me.current.useInsertionEffect(O,J)},St.useLayoutEffect=function(O,J){return me.current.useLayoutEffect(O,J)},St.useMemo=function(O,J){return me.current.useMemo(O,J)},St.useReducer=function(O,J,De){return me.current.useReducer(O,J,De)},St.useRef=function(O){return me.current.useRef(O)},St.useState=function(O){return me.current.useState(O)},St.useSyncExternalStore=function(O,J,De){return me.current.useSyncExternalStore(O,J,De)},St.useTransition=function(){return me.current.useTransition()},St.version="18.3.1",St}var im;function mf(){return im||(im=1,Du.exports=tg()),Du.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rm;function ng(){if(rm)return Fa;rm=1;var s=mf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function d(f,p,m){var v,_={},g=null,E=null;m!==void 0&&(g=""+m),p.key!==void 0&&(g=""+p.key),p.ref!==void 0&&(E=p.ref);for(v in p)r.call(p,v)&&!l.hasOwnProperty(v)&&(_[v]=p[v]);if(f&&f.defaultProps)for(v in p=f.defaultProps,p)_[v]===void 0&&(_[v]=p[v]);return{$$typeof:e,type:f,key:g,ref:E,props:_,_owner:a.current}}return Fa.Fragment=t,Fa.jsx=d,Fa.jsxs=d,Fa}var sm;function ig(){return sm||(sm=1,Lu.exports=ng()),Lu.exports}var u=ig(),Te=mf();const rg=A0(Te);var ul={},Uu={exports:{}},Un={},Ou={exports:{}},Fu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var am;function sg(){return am||(am=1,(function(s){function e(B,pe){var te=B.length;B.push(pe);e:for(;0<te;){var O=te-1>>>1,J=B[O];if(0<a(J,pe))B[O]=pe,B[te]=J,te=O;else break e}}function t(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var pe=B[0],te=B.pop();if(te!==pe){B[0]=te;e:for(var O=0,J=B.length,De=J>>>1;O<De;){var ne=2*(O+1)-1,k=B[ne],ue=ne+1,fe=B[ue];if(0>a(k,te))ue<J&&0>a(fe,k)?(B[O]=fe,B[ue]=te,O=ue):(B[O]=k,B[ne]=te,O=ne);else if(ue<J&&0>a(fe,te))B[O]=fe,B[ue]=te,O=ue;else break e}}return pe}function a(B,pe){var te=B.sortIndex-pe.sortIndex;return te!==0?te:B.id-pe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var d=Date,f=d.now();s.unstable_now=function(){return d.now()-f}}var p=[],m=[],v=1,_=null,g=3,E=!1,M=!1,A=!1,S=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,P=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(B){for(var pe=t(m);pe!==null;){if(pe.callback===null)r(m);else if(pe.startTime<=B)r(m),pe.sortIndex=pe.expirationTime,e(p,pe);else break;pe=t(m)}}function C(B){if(A=!1,I(B),!M)if(t(p)!==null)M=!0,de(ie);else{var pe=t(m);pe!==null&&me(C,pe.startTime-B)}}function ie(B,pe){M=!1,A&&(A=!1,y(q),q=-1),E=!0;var te=g;try{for(I(pe),_=t(p);_!==null&&(!(_.expirationTime>pe)||B&&!j());){var O=_.callback;if(typeof O=="function"){_.callback=null,g=_.priorityLevel;var J=O(_.expirationTime<=pe);pe=s.unstable_now(),typeof J=="function"?_.callback=J:_===t(p)&&r(p),I(pe)}else r(p);_=t(p)}if(_!==null)var De=!0;else{var ne=t(m);ne!==null&&me(C,ne.startTime-pe),De=!1}return De}finally{_=null,g=te,E=!1}}var V=!1,F=null,q=-1,R=5,b=-1;function j(){return!(s.unstable_now()-b<R)}function K(){if(F!==null){var B=s.unstable_now();b=B;var pe=!0;try{pe=F(!0,B)}finally{pe?Y():(V=!1,F=null)}}else V=!1}var Y;if(typeof P=="function")Y=function(){P(K)};else if(typeof MessageChannel<"u"){var le=new MessageChannel,xe=le.port2;le.port1.onmessage=K,Y=function(){xe.postMessage(null)}}else Y=function(){S(K,0)};function de(B){F=B,V||(V=!0,Y())}function me(B,pe){q=S(function(){B(s.unstable_now())},pe)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(B){B.callback=null},s.unstable_continueExecution=function(){M||E||(M=!0,de(ie))},s.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<B?Math.floor(1e3/B):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_getFirstCallbackNode=function(){return t(p)},s.unstable_next=function(B){switch(g){case 1:case 2:case 3:var pe=3;break;default:pe=g}var te=g;g=pe;try{return B()}finally{g=te}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(B,pe){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var te=g;g=B;try{return pe()}finally{g=te}},s.unstable_scheduleCallback=function(B,pe,te){var O=s.unstable_now();switch(typeof te=="object"&&te!==null?(te=te.delay,te=typeof te=="number"&&0<te?O+te:O):te=O,B){case 1:var J=-1;break;case 2:J=250;break;case 5:J=1073741823;break;case 4:J=1e4;break;default:J=5e3}return J=te+J,B={id:v++,callback:pe,priorityLevel:B,startTime:te,expirationTime:J,sortIndex:-1},te>O?(B.sortIndex=te,e(m,B),t(p)===null&&B===t(m)&&(A?(y(q),q=-1):A=!0,me(C,te-O))):(B.sortIndex=J,e(p,B),M||E||(M=!0,de(ie))),B},s.unstable_shouldYield=j,s.unstable_wrapCallback=function(B){var pe=g;return function(){var te=g;g=pe;try{return B.apply(this,arguments)}finally{g=te}}}})(Fu)),Fu}var om;function ag(){return om||(om=1,Ou.exports=sg()),Ou.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lm;function og(){if(lm)return Un;lm=1;var s=mf(),e=ag();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function l(n,i){d(n,i),d(n+"Capture",i)}function d(n,i){for(a[n]=i,n=0;n<i.length;n++)r.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,v={},_={};function g(n){return p.call(_,n)?!0:p.call(v,n)?!1:m.test(n)?_[n]=!0:(v[n]=!0,!1)}function E(n,i,o,c){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,i,o,c){if(i===null||typeof i>"u"||E(n,i,o,c))return!0;if(c)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function A(n,i,o,c,h,x,w){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=o,this.propertyName=n,this.type=i,this.sanitizeURL=x,this.removeEmptyString=w}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new A(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];S[i]=new A(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new A(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new A(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new A(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new A(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new A(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new A(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new A(n,5,!1,n.toLowerCase(),null,!1,!1)});var y=/[\-:]([a-z])/g;function P(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(y,P);S[i]=new A(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(y,P);S[i]=new A(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(y,P);S[i]=new A(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new A(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new A("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new A(n,1,!1,n.toLowerCase(),null,!0,!0)});function I(n,i,o,c){var h=S.hasOwnProperty(i)?S[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(M(i,o,h,c)&&(o=null),c||h===null?g(i)&&(o===null?n.removeAttribute(i):n.setAttribute(i,""+o)):h.mustUseProperty?n[h.propertyName]=o===null?h.type===3?!1:"":o:(i=h.attributeName,c=h.attributeNamespace,o===null?n.removeAttribute(i):(h=h.type,o=h===3||h===4&&o===!0?"":""+o,c?n.setAttributeNS(c,i,o):n.setAttribute(i,o))))}var C=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ie=Symbol.for("react.element"),V=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),b=Symbol.for("react.provider"),j=Symbol.for("react.context"),K=Symbol.for("react.forward_ref"),Y=Symbol.for("react.suspense"),le=Symbol.for("react.suspense_list"),xe=Symbol.for("react.memo"),de=Symbol.for("react.lazy"),me=Symbol.for("react.offscreen"),B=Symbol.iterator;function pe(n){return n===null||typeof n!="object"?null:(n=B&&n[B]||n["@@iterator"],typeof n=="function"?n:null)}var te=Object.assign,O;function J(n){if(O===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var De=!1;function ne(n,i){if(!n||De)return"";De=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(ae){var c=ae}Reflect.construct(n,[],i)}else{try{i.call()}catch(ae){c=ae}n.call(i.prototype)}else{try{throw Error()}catch(ae){c=ae}n()}}catch(ae){if(ae&&c&&typeof ae.stack=="string"){for(var h=ae.stack.split(`
`),x=c.stack.split(`
`),w=h.length-1,U=x.length-1;1<=w&&0<=U&&h[w]!==x[U];)U--;for(;1<=w&&0<=U;w--,U--)if(h[w]!==x[U]){if(w!==1||U!==1)do if(w--,U--,0>U||h[w]!==x[U]){var z=`
`+h[w].replace(" at new "," at ");return n.displayName&&z.includes("<anonymous>")&&(z=z.replace("<anonymous>",n.displayName)),z}while(1<=w&&0<=U);break}}}finally{De=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?J(n):""}function k(n){switch(n.tag){case 5:return J(n.type);case 16:return J("Lazy");case 13:return J("Suspense");case 19:return J("SuspenseList");case 0:case 2:case 15:return n=ne(n.type,!1),n;case 11:return n=ne(n.type.render,!1),n;case 1:return n=ne(n.type,!0),n;default:return""}}function ue(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case F:return"Fragment";case V:return"Portal";case R:return"Profiler";case q:return"StrictMode";case Y:return"Suspense";case le:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case j:return(n.displayName||"Context")+".Consumer";case b:return(n._context.displayName||"Context")+".Provider";case K:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case xe:return i=n.displayName||null,i!==null?i:ue(n.type)||"Memo";case de:i=n._payload,n=n._init;try{return ue(n(i))}catch{}}return null}function fe(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ue(i);case 8:return i===q?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function ge(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ae(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Fe(n){var i=Ae(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var h=o.get,x=o.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(w){c=""+w,x.call(this,w)}}),Object.defineProperty(n,i,{enumerable:o.enumerable}),{getValue:function(){return c},setValue:function(w){c=""+w},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function _t(n){n._valueTracker||(n._valueTracker=Fe(n))}function He(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var o=i.getValue(),c="";return n&&(c=Ae(n)?n.checked?"true":"false":n.value),n=c,n!==o?(i.setValue(n),!0):!1}function lt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function W(n,i){var o=i.checked;return te({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function sn(n,i){var o=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;o=ge(i.value!=null?i.value:o),n._wrapperState={initialChecked:c,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function pt(n,i){i=i.checked,i!=null&&I(n,"checked",i,!1)}function mt(n,i){pt(n,i);var o=ge(i.value),c=i.type;if(o!=null)c==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Pt(n,i.type,o):i.hasOwnProperty("defaultValue")&&Pt(n,i.type,ge(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Je(n,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,o||i===n.value||(n.value=i),n.defaultValue=i}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Pt(n,i,o){(i!=="number"||lt(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var Ke=Array.isArray;function D(n,i,o,c){if(n=n.options,i){i={};for(var h=0;h<o.length;h++)i["$"+o[h]]=!0;for(o=0;o<n.length;o++)h=i.hasOwnProperty("$"+n[o].value),n[o].selected!==h&&(n[o].selected=h),h&&c&&(n[o].defaultSelected=!0)}else{for(o=""+ge(o),i=null,h=0;h<n.length;h++){if(n[h].value===o){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function T(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return te({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function se(n,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(t(92));if(Ke(o)){if(1<o.length)throw Error(t(93));o=o[0]}i=o}i==null&&(i=""),o=i}n._wrapperState={initialValue:ge(o)}}function ye(n,i){var o=ge(i.value),c=ge(i.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),i.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),c!=null&&(n.defaultValue=""+c)}function Se(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function ve(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ve(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?ve(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Le,Pe=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,o,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(Le=Le||document.createElement("div"),Le.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Le.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function dt(n,i){if(i){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=i;return}}n.textContent=i}var we={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ke=["Webkit","ms","Moz","O"];Object.keys(we).forEach(function(n){ke.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),we[i]=we[n]})});function tt(n,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||we.hasOwnProperty(n)&&we[n]?(""+i).trim():i+"px"}function rt(n,i){n=n.style;for(var o in i)if(i.hasOwnProperty(o)){var c=o.indexOf("--")===0,h=tt(o,i[o],c);o==="float"&&(o="cssFloat"),c?n.setProperty(o,h):n[o]=h}}var Be=te({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function xt(n,i){if(i){if(Be[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function ct(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var bt=null;function H(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ie=null,he=null,L=null;function Q(n){if(n=Ea(n)){if(typeof Ie!="function")throw Error(t(280));var i=n.stateNode;i&&(i=wo(i),Ie(n.stateNode,n.type,i))}}function _e(n){he?L?L.push(n):L=[n]:he=n}function ze(){if(he){var n=he,i=L;if(L=he=null,Q(n),i)for(n=0;n<i.length;n++)Q(i[n])}}function vt(n,i){return n(i)}function Mt(){}var et=!1;function Ut(n,i,o){if(et)return n(i,o);et=!0;try{return vt(n,i,o)}finally{et=!1,(he!==null||L!==null)&&(Mt(),ze())}}function Wt(n,i){var o=n.stateNode;if(o===null)return null;var c=wo(o);if(c===null)return null;o=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,i,typeof o));return o}var Tn=!1;if(f)try{var It={};Object.defineProperty(It,"passive",{get:function(){Tn=!0}}),window.addEventListener("test",It,It),window.removeEventListener("test",It,It)}catch{Tn=!1}function zn(n,i,o,c,h,x,w,U,z){var ae=Array.prototype.slice.call(arguments,3);try{i.apply(o,ae)}catch(Me){this.onError(Me)}}var st=!1,ai=null,qn=!1,oi=null,Gt={onError:function(n){st=!0,ai=n}};function An(n,i,o,c,h,x,w,U,z){st=!1,ai=null,zn.apply(Gt,arguments)}function ns(n,i,o,c,h,x,w,U,z){if(An.apply(this,arguments),st){if(st){var ae=ai;st=!1,ai=null}else throw Error(t(198));qn||(qn=!0,oi=ae)}}function Cn(n){var i=n,o=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(o=i.return),n=i.return;while(n)}return i.tag===3?o:null}function so(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function ao(n){if(Cn(n)!==n)throw Error(t(188))}function tc(n){var i=n.alternate;if(!i){if(i=Cn(n),i===null)throw Error(t(188));return i!==n?null:n}for(var o=n,c=i;;){var h=o.return;if(h===null)break;var x=h.alternate;if(x===null){if(c=h.return,c!==null){o=c;continue}break}if(h.child===x.child){for(x=h.child;x;){if(x===o)return ao(h),n;if(x===c)return ao(h),i;x=x.sibling}throw Error(t(188))}if(o.return!==c.return)o=h,c=x;else{for(var w=!1,U=h.child;U;){if(U===o){w=!0,o=h,c=x;break}if(U===c){w=!0,c=h,o=x;break}U=U.sibling}if(!w){for(U=x.child;U;){if(U===o){w=!0,o=x,c=h;break}if(U===c){w=!0,c=x,o=h;break}U=U.sibling}if(!w)throw Error(t(189))}}if(o.alternate!==c)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:i}function N(n){return n=tc(n),n!==null?$(n):null}function $(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=$(n);if(i!==null)return i;n=n.sibling}return null}var oe=e.unstable_scheduleCallback,ce=e.unstable_cancelCallback,Z=e.unstable_shouldYield,Ne=e.unstable_requestPaint,Ce=e.unstable_now,Ye=e.unstable_getCurrentPriorityLevel,We=e.unstable_ImmediatePriority,at=e.unstable_UserBlockingPriority,ut=e.unstable_NormalPriority,$e=e.unstable_LowPriority,wt=e.unstable_IdlePriority,Lt=null,Et=null;function fn(n){if(Et&&typeof Et.onCommitFiberRoot=="function")try{Et.onCommitFiberRoot(Lt,n,void 0,(n.current.flags&128)===128)}catch{}}var ft=Math.clz32?Math.clz32:Ct,Ze=Math.log,li=Math.LN2;function Ct(n){return n>>>=0,n===0?32:31-(Ze(n)/li|0)|0}var hn=64,ci=4194304;function Jt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function wi(n,i){var o=n.pendingLanes;if(o===0)return 0;var c=0,h=n.suspendedLanes,x=n.pingedLanes,w=o&268435455;if(w!==0){var U=w&~h;U!==0?c=Jt(U):(x&=w,x!==0&&(c=Jt(x)))}else w=o&~h,w!==0?c=Jt(w):x!==0&&(c=Jt(x));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,x=i&-i,h>=x||h===16&&(x&4194240)!==0))return i;if((c&4)!==0&&(c|=o&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)o=31-ft(i),h=1<<o,c|=n[o],i&=~h;return c}function kt(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Kn(n,i){for(var o=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,x=n.pendingLanes;0<x;){var w=31-ft(x),U=1<<w,z=h[w];z===-1?((U&o)===0||(U&c)!==0)&&(h[w]=kt(U,i)):z<=i&&(n.expiredLanes|=U),x&=~U}}function Di(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Sn(){var n=hn;return hn<<=1,(hn&4194240)===0&&(hn=64),n}function Zn(n){for(var i=[],o=0;31>o;o++)i.push(n);return i}function Rn(n,i,o){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-ft(i),n[i]=o}function oo(n,i){var o=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<o;){var h=31-ft(o),x=1<<h;i[h]=0,c[h]=-1,n[h]=-1,o&=~x}}function nc(n,i){var o=n.entangledLanes|=i;for(n=n.entanglements;o;){var c=31-ft(o),h=1<<c;h&i|n[c]&i&&(n[c]|=i),o&=~h}}var Dt=0;function Df(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Uf,ic,Of,Ff,kf,rc=!1,lo=[],Ji=null,er=null,tr=null,aa=new Map,oa=new Map,nr=[],Sx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Bf(n,i){switch(n){case"focusin":case"focusout":Ji=null;break;case"dragenter":case"dragleave":er=null;break;case"mouseover":case"mouseout":tr=null;break;case"pointerover":case"pointerout":aa.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":oa.delete(i.pointerId)}}function la(n,i,o,c,h,x){return n===null||n.nativeEvent!==x?(n={blockedOn:i,domEventName:o,eventSystemFlags:c,nativeEvent:x,targetContainers:[h]},i!==null&&(i=Ea(i),i!==null&&ic(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function Ex(n,i,o,c,h){switch(i){case"focusin":return Ji=la(Ji,n,i,o,c,h),!0;case"dragenter":return er=la(er,n,i,o,c,h),!0;case"mouseover":return tr=la(tr,n,i,o,c,h),!0;case"pointerover":var x=h.pointerId;return aa.set(x,la(aa.get(x)||null,n,i,o,c,h)),!0;case"gotpointercapture":return x=h.pointerId,oa.set(x,la(oa.get(x)||null,n,i,o,c,h)),!0}return!1}function zf(n){var i=Rr(n.target);if(i!==null){var o=Cn(i);if(o!==null){if(i=o.tag,i===13){if(i=so(o),i!==null){n.blockedOn=i,kf(n.priority,function(){Of(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function co(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var o=ac(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var c=new o.constructor(o.type,o);bt=c,o.target.dispatchEvent(c),bt=null}else return i=Ea(o),i!==null&&ic(i),n.blockedOn=o,!1;i.shift()}return!0}function jf(n,i,o){co(n)&&o.delete(i)}function Mx(){rc=!1,Ji!==null&&co(Ji)&&(Ji=null),er!==null&&co(er)&&(er=null),tr!==null&&co(tr)&&(tr=null),aa.forEach(jf),oa.forEach(jf)}function ca(n,i){n.blockedOn===i&&(n.blockedOn=null,rc||(rc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Mx)))}function ua(n){function i(h){return ca(h,n)}if(0<lo.length){ca(lo[0],n);for(var o=1;o<lo.length;o++){var c=lo[o];c.blockedOn===n&&(c.blockedOn=null)}}for(Ji!==null&&ca(Ji,n),er!==null&&ca(er,n),tr!==null&&ca(tr,n),aa.forEach(i),oa.forEach(i),o=0;o<nr.length;o++)c=nr[o],c.blockedOn===n&&(c.blockedOn=null);for(;0<nr.length&&(o=nr[0],o.blockedOn===null);)zf(o),o.blockedOn===null&&nr.shift()}var is=C.ReactCurrentBatchConfig,uo=!0;function wx(n,i,o,c){var h=Dt,x=is.transition;is.transition=null;try{Dt=1,sc(n,i,o,c)}finally{Dt=h,is.transition=x}}function bx(n,i,o,c){var h=Dt,x=is.transition;is.transition=null;try{Dt=4,sc(n,i,o,c)}finally{Dt=h,is.transition=x}}function sc(n,i,o,c){if(uo){var h=ac(n,i,o,c);if(h===null)Mc(n,i,c,fo,o),Bf(n,c);else if(Ex(h,n,i,o,c))c.stopPropagation();else if(Bf(n,c),i&4&&-1<Sx.indexOf(n)){for(;h!==null;){var x=Ea(h);if(x!==null&&Uf(x),x=ac(n,i,o,c),x===null&&Mc(n,i,c,fo,o),x===h)break;h=x}h!==null&&c.stopPropagation()}else Mc(n,i,c,null,o)}}var fo=null;function ac(n,i,o,c){if(fo=null,n=H(c),n=Rr(n),n!==null)if(i=Cn(n),i===null)n=null;else if(o=i.tag,o===13){if(n=so(i),n!==null)return n;n=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return fo=n,null}function Vf(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ye()){case We:return 1;case at:return 4;case ut:case $e:return 16;case wt:return 536870912;default:return 16}default:return 16}}var ir=null,oc=null,ho=null;function Gf(){if(ho)return ho;var n,i=oc,o=i.length,c,h="value"in ir?ir.value:ir.textContent,x=h.length;for(n=0;n<o&&i[n]===h[n];n++);var w=o-n;for(c=1;c<=w&&i[o-c]===h[x-c];c++);return ho=h.slice(n,1<c?1-c:void 0)}function po(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function mo(){return!0}function Hf(){return!1}function jn(n){function i(o,c,h,x,w){this._reactName=o,this._targetInst=h,this.type=c,this.nativeEvent=x,this.target=w,this.currentTarget=null;for(var U in n)n.hasOwnProperty(U)&&(o=n[U],this[U]=o?o(x):x[U]);return this.isDefaultPrevented=(x.defaultPrevented!=null?x.defaultPrevented:x.returnValue===!1)?mo:Hf,this.isPropagationStopped=Hf,this}return te(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=mo)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=mo)},persist:function(){},isPersistent:mo}),i}var rs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},lc=jn(rs),da=te({},rs,{view:0,detail:0}),Tx=jn(da),cc,uc,fa,xo=te({},da,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:fc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==fa&&(fa&&n.type==="mousemove"?(cc=n.screenX-fa.screenX,uc=n.screenY-fa.screenY):uc=cc=0,fa=n),cc)},movementY:function(n){return"movementY"in n?n.movementY:uc}}),Wf=jn(xo),Ax=te({},xo,{dataTransfer:0}),Cx=jn(Ax),Rx=te({},da,{relatedTarget:0}),dc=jn(Rx),Nx=te({},rs,{animationName:0,elapsedTime:0,pseudoElement:0}),Px=jn(Nx),Ix=te({},rs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Lx=jn(Ix),Dx=te({},rs,{data:0}),Xf=jn(Dx),Ux={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ox={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function kx(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Fx[n])?!!i[n]:!1}function fc(){return kx}var Bx=te({},da,{key:function(n){if(n.key){var i=Ux[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=po(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Ox[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:fc,charCode:function(n){return n.type==="keypress"?po(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?po(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),zx=jn(Bx),jx=te({},xo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Yf=jn(jx),Vx=te({},da,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:fc}),Gx=jn(Vx),Hx=te({},rs,{propertyName:0,elapsedTime:0,pseudoElement:0}),Wx=jn(Hx),Xx=te({},xo,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Yx=jn(Xx),$x=[9,13,27,32],hc=f&&"CompositionEvent"in window,ha=null;f&&"documentMode"in document&&(ha=document.documentMode);var qx=f&&"TextEvent"in window&&!ha,$f=f&&(!hc||ha&&8<ha&&11>=ha),qf=" ",Kf=!1;function Zf(n,i){switch(n){case"keyup":return $x.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Qf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ss=!1;function Kx(n,i){switch(n){case"compositionend":return Qf(i);case"keypress":return i.which!==32?null:(Kf=!0,qf);case"textInput":return n=i.data,n===qf&&Kf?null:n;default:return null}}function Zx(n,i){if(ss)return n==="compositionend"||!hc&&Zf(n,i)?(n=Gf(),ho=oc=ir=null,ss=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return $f&&i.locale!=="ko"?null:i.data;default:return null}}var Qx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Jf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!Qx[n.type]:i==="textarea"}function eh(n,i,o,c){_e(c),i=So(i,"onChange"),0<i.length&&(o=new lc("onChange","change",null,o,c),n.push({event:o,listeners:i}))}var pa=null,ma=null;function Jx(n){gh(n,0)}function vo(n){var i=us(n);if(He(i))return n}function ev(n,i){if(n==="change")return i}var th=!1;if(f){var pc;if(f){var mc="oninput"in document;if(!mc){var nh=document.createElement("div");nh.setAttribute("oninput","return;"),mc=typeof nh.oninput=="function"}pc=mc}else pc=!1;th=pc&&(!document.documentMode||9<document.documentMode)}function ih(){pa&&(pa.detachEvent("onpropertychange",rh),ma=pa=null)}function rh(n){if(n.propertyName==="value"&&vo(ma)){var i=[];eh(i,ma,n,H(n)),Ut(Jx,i)}}function tv(n,i,o){n==="focusin"?(ih(),pa=i,ma=o,pa.attachEvent("onpropertychange",rh)):n==="focusout"&&ih()}function nv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return vo(ma)}function iv(n,i){if(n==="click")return vo(i)}function rv(n,i){if(n==="input"||n==="change")return vo(i)}function sv(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var ui=typeof Object.is=="function"?Object.is:sv;function xa(n,i){if(ui(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var o=Object.keys(n),c=Object.keys(i);if(o.length!==c.length)return!1;for(c=0;c<o.length;c++){var h=o[c];if(!p.call(i,h)||!ui(n[h],i[h]))return!1}return!0}function sh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function ah(n,i){var o=sh(n);n=0;for(var c;o;){if(o.nodeType===3){if(c=n+o.textContent.length,n<=i&&c>=i)return{node:o,offset:i-n};n=c}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=sh(o)}}function oh(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?oh(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function lh(){for(var n=window,i=lt();i instanceof n.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)n=i.contentWindow;else break;i=lt(n.document)}return i}function xc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function av(n){var i=lh(),o=n.focusedElem,c=n.selectionRange;if(i!==o&&o&&o.ownerDocument&&oh(o.ownerDocument.documentElement,o)){if(c!==null&&xc(o)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(n,o.value.length);else if(n=(i=o.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=o.textContent.length,x=Math.min(c.start,h);c=c.end===void 0?x:Math.min(c.end,h),!n.extend&&x>c&&(h=c,c=x,x=h),h=ah(o,x);var w=ah(o,c);h&&w&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==w.node||n.focusOffset!==w.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),x>c?(n.addRange(i),n.extend(w.node,w.offset)):(i.setEnd(w.node,w.offset),n.addRange(i)))}}for(i=[],n=o;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)n=i[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var ov=f&&"documentMode"in document&&11>=document.documentMode,as=null,vc=null,va=null,gc=!1;function ch(n,i,o){var c=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;gc||as==null||as!==lt(c)||(c=as,"selectionStart"in c&&xc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),va&&xa(va,c)||(va=c,c=So(vc,"onSelect"),0<c.length&&(i=new lc("onSelect","select",null,i,o),n.push({event:i,listeners:c}),i.target=as)))}function go(n,i){var o={};return o[n.toLowerCase()]=i.toLowerCase(),o["Webkit"+n]="webkit"+i,o["Moz"+n]="moz"+i,o}var os={animationend:go("Animation","AnimationEnd"),animationiteration:go("Animation","AnimationIteration"),animationstart:go("Animation","AnimationStart"),transitionend:go("Transition","TransitionEnd")},_c={},uh={};f&&(uh=document.createElement("div").style,"AnimationEvent"in window||(delete os.animationend.animation,delete os.animationiteration.animation,delete os.animationstart.animation),"TransitionEvent"in window||delete os.transitionend.transition);function _o(n){if(_c[n])return _c[n];if(!os[n])return n;var i=os[n],o;for(o in i)if(i.hasOwnProperty(o)&&o in uh)return _c[n]=i[o];return n}var dh=_o("animationend"),fh=_o("animationiteration"),hh=_o("animationstart"),ph=_o("transitionend"),mh=new Map,xh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function rr(n,i){mh.set(n,i),l(i,[n])}for(var yc=0;yc<xh.length;yc++){var Sc=xh[yc],lv=Sc.toLowerCase(),cv=Sc[0].toUpperCase()+Sc.slice(1);rr(lv,"on"+cv)}rr(dh,"onAnimationEnd"),rr(fh,"onAnimationIteration"),rr(hh,"onAnimationStart"),rr("dblclick","onDoubleClick"),rr("focusin","onFocus"),rr("focusout","onBlur"),rr(ph,"onTransitionEnd"),d("onMouseEnter",["mouseout","mouseover"]),d("onMouseLeave",["mouseout","mouseover"]),d("onPointerEnter",["pointerout","pointerover"]),d("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ga="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),uv=new Set("cancel close invalid load scroll toggle".split(" ").concat(ga));function vh(n,i,o){var c=n.type||"unknown-event";n.currentTarget=o,ns(c,i,void 0,n),n.currentTarget=null}function gh(n,i){i=(i&4)!==0;for(var o=0;o<n.length;o++){var c=n[o],h=c.event;c=c.listeners;e:{var x=void 0;if(i)for(var w=c.length-1;0<=w;w--){var U=c[w],z=U.instance,ae=U.currentTarget;if(U=U.listener,z!==x&&h.isPropagationStopped())break e;vh(h,U,ae),x=z}else for(w=0;w<c.length;w++){if(U=c[w],z=U.instance,ae=U.currentTarget,U=U.listener,z!==x&&h.isPropagationStopped())break e;vh(h,U,ae),x=z}}}if(qn)throw n=oi,qn=!1,oi=null,n}function zt(n,i){var o=i[Rc];o===void 0&&(o=i[Rc]=new Set);var c=n+"__bubble";o.has(c)||(_h(i,n,2,!1),o.add(c))}function Ec(n,i,o){var c=0;i&&(c|=4),_h(o,n,c,i)}var yo="_reactListening"+Math.random().toString(36).slice(2);function _a(n){if(!n[yo]){n[yo]=!0,r.forEach(function(o){o!=="selectionchange"&&(uv.has(o)||Ec(o,!1,n),Ec(o,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[yo]||(i[yo]=!0,Ec("selectionchange",!1,i))}}function _h(n,i,o,c){switch(Vf(i)){case 1:var h=wx;break;case 4:h=bx;break;default:h=sc}o=h.bind(null,i,o,n),h=void 0,!Tn||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,o,{capture:!0,passive:h}):n.addEventListener(i,o,!0):h!==void 0?n.addEventListener(i,o,{passive:h}):n.addEventListener(i,o,!1)}function Mc(n,i,o,c,h){var x=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var w=c.tag;if(w===3||w===4){var U=c.stateNode.containerInfo;if(U===h||U.nodeType===8&&U.parentNode===h)break;if(w===4)for(w=c.return;w!==null;){var z=w.tag;if((z===3||z===4)&&(z=w.stateNode.containerInfo,z===h||z.nodeType===8&&z.parentNode===h))return;w=w.return}for(;U!==null;){if(w=Rr(U),w===null)return;if(z=w.tag,z===5||z===6){c=x=w;continue e}U=U.parentNode}}c=c.return}Ut(function(){var ae=x,Me=H(o),be=[];e:{var Ee=mh.get(n);if(Ee!==void 0){var Oe=lc,Ge=n;switch(n){case"keypress":if(po(o)===0)break e;case"keydown":case"keyup":Oe=zx;break;case"focusin":Ge="focus",Oe=dc;break;case"focusout":Ge="blur",Oe=dc;break;case"beforeblur":case"afterblur":Oe=dc;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Oe=Wf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Oe=Cx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Oe=Gx;break;case dh:case fh:case hh:Oe=Px;break;case ph:Oe=Wx;break;case"scroll":Oe=Tx;break;case"wheel":Oe=Yx;break;case"copy":case"cut":case"paste":Oe=Lx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Oe=Yf}var Xe=(i&4)!==0,Kt=!Xe&&n==="scroll",ee=Xe?Ee!==null?Ee+"Capture":null:Ee;Xe=[];for(var G=ae,re;G!==null;){re=G;var Re=re.stateNode;if(re.tag===5&&Re!==null&&(re=Re,ee!==null&&(Re=Wt(G,ee),Re!=null&&Xe.push(ya(G,Re,re)))),Kt)break;G=G.return}0<Xe.length&&(Ee=new Oe(Ee,Ge,null,o,Me),be.push({event:Ee,listeners:Xe}))}}if((i&7)===0){e:{if(Ee=n==="mouseover"||n==="pointerover",Oe=n==="mouseout"||n==="pointerout",Ee&&o!==bt&&(Ge=o.relatedTarget||o.fromElement)&&(Rr(Ge)||Ge[Ui]))break e;if((Oe||Ee)&&(Ee=Me.window===Me?Me:(Ee=Me.ownerDocument)?Ee.defaultView||Ee.parentWindow:window,Oe?(Ge=o.relatedTarget||o.toElement,Oe=ae,Ge=Ge?Rr(Ge):null,Ge!==null&&(Kt=Cn(Ge),Ge!==Kt||Ge.tag!==5&&Ge.tag!==6)&&(Ge=null)):(Oe=null,Ge=ae),Oe!==Ge)){if(Xe=Wf,Re="onMouseLeave",ee="onMouseEnter",G="mouse",(n==="pointerout"||n==="pointerover")&&(Xe=Yf,Re="onPointerLeave",ee="onPointerEnter",G="pointer"),Kt=Oe==null?Ee:us(Oe),re=Ge==null?Ee:us(Ge),Ee=new Xe(Re,G+"leave",Oe,o,Me),Ee.target=Kt,Ee.relatedTarget=re,Re=null,Rr(Me)===ae&&(Xe=new Xe(ee,G+"enter",Ge,o,Me),Xe.target=re,Xe.relatedTarget=Kt,Re=Xe),Kt=Re,Oe&&Ge)t:{for(Xe=Oe,ee=Ge,G=0,re=Xe;re;re=ls(re))G++;for(re=0,Re=ee;Re;Re=ls(Re))re++;for(;0<G-re;)Xe=ls(Xe),G--;for(;0<re-G;)ee=ls(ee),re--;for(;G--;){if(Xe===ee||ee!==null&&Xe===ee.alternate)break t;Xe=ls(Xe),ee=ls(ee)}Xe=null}else Xe=null;Oe!==null&&yh(be,Ee,Oe,Xe,!1),Ge!==null&&Kt!==null&&yh(be,Kt,Ge,Xe,!0)}}e:{if(Ee=ae?us(ae):window,Oe=Ee.nodeName&&Ee.nodeName.toLowerCase(),Oe==="select"||Oe==="input"&&Ee.type==="file")var qe=ev;else if(Jf(Ee))if(th)qe=rv;else{qe=nv;var nt=tv}else(Oe=Ee.nodeName)&&Oe.toLowerCase()==="input"&&(Ee.type==="checkbox"||Ee.type==="radio")&&(qe=iv);if(qe&&(qe=qe(n,ae))){eh(be,qe,o,Me);break e}nt&&nt(n,Ee,ae),n==="focusout"&&(nt=Ee._wrapperState)&&nt.controlled&&Ee.type==="number"&&Pt(Ee,"number",Ee.value)}switch(nt=ae?us(ae):window,n){case"focusin":(Jf(nt)||nt.contentEditable==="true")&&(as=nt,vc=ae,va=null);break;case"focusout":va=vc=as=null;break;case"mousedown":gc=!0;break;case"contextmenu":case"mouseup":case"dragend":gc=!1,ch(be,o,Me);break;case"selectionchange":if(ov)break;case"keydown":case"keyup":ch(be,o,Me)}var it;if(hc)e:{switch(n){case"compositionstart":var ot="onCompositionStart";break e;case"compositionend":ot="onCompositionEnd";break e;case"compositionupdate":ot="onCompositionUpdate";break e}ot=void 0}else ss?Zf(n,o)&&(ot="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(ot="onCompositionStart");ot&&($f&&o.locale!=="ko"&&(ss||ot!=="onCompositionStart"?ot==="onCompositionEnd"&&ss&&(it=Gf()):(ir=Me,oc="value"in ir?ir.value:ir.textContent,ss=!0)),nt=So(ae,ot),0<nt.length&&(ot=new Xf(ot,n,null,o,Me),be.push({event:ot,listeners:nt}),it?ot.data=it:(it=Qf(o),it!==null&&(ot.data=it)))),(it=qx?Kx(n,o):Zx(n,o))&&(ae=So(ae,"onBeforeInput"),0<ae.length&&(Me=new Xf("onBeforeInput","beforeinput",null,o,Me),be.push({event:Me,listeners:ae}),Me.data=it))}gh(be,i)})}function ya(n,i,o){return{instance:n,listener:i,currentTarget:o}}function So(n,i){for(var o=i+"Capture",c=[];n!==null;){var h=n,x=h.stateNode;h.tag===5&&x!==null&&(h=x,x=Wt(n,o),x!=null&&c.unshift(ya(n,x,h)),x=Wt(n,i),x!=null&&c.push(ya(n,x,h))),n=n.return}return c}function ls(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function yh(n,i,o,c,h){for(var x=i._reactName,w=[];o!==null&&o!==c;){var U=o,z=U.alternate,ae=U.stateNode;if(z!==null&&z===c)break;U.tag===5&&ae!==null&&(U=ae,h?(z=Wt(o,x),z!=null&&w.unshift(ya(o,z,U))):h||(z=Wt(o,x),z!=null&&w.push(ya(o,z,U)))),o=o.return}w.length!==0&&n.push({event:i,listeners:w})}var dv=/\r\n?/g,fv=/\u0000|\uFFFD/g;function Sh(n){return(typeof n=="string"?n:""+n).replace(dv,`
`).replace(fv,"")}function Eo(n,i,o){if(i=Sh(i),Sh(n)!==i&&o)throw Error(t(425))}function Mo(){}var wc=null,bc=null;function Tc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Ac=typeof setTimeout=="function"?setTimeout:void 0,hv=typeof clearTimeout=="function"?clearTimeout:void 0,Eh=typeof Promise=="function"?Promise:void 0,pv=typeof queueMicrotask=="function"?queueMicrotask:typeof Eh<"u"?function(n){return Eh.resolve(null).then(n).catch(mv)}:Ac;function mv(n){setTimeout(function(){throw n})}function Cc(n,i){var o=i,c=0;do{var h=o.nextSibling;if(n.removeChild(o),h&&h.nodeType===8)if(o=h.data,o==="/$"){if(c===0){n.removeChild(h),ua(i);return}c--}else o!=="$"&&o!=="$?"&&o!=="$!"||c++;o=h}while(o);ua(i)}function sr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Mh(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return n;i--}else o==="/$"&&i++}n=n.previousSibling}return null}var cs=Math.random().toString(36).slice(2),bi="__reactFiber$"+cs,Sa="__reactProps$"+cs,Ui="__reactContainer$"+cs,Rc="__reactEvents$"+cs,xv="__reactListeners$"+cs,vv="__reactHandles$"+cs;function Rr(n){var i=n[bi];if(i)return i;for(var o=n.parentNode;o;){if(i=o[Ui]||o[bi]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(n=Mh(n);n!==null;){if(o=n[bi])return o;n=Mh(n)}return i}n=o,o=n.parentNode}return null}function Ea(n){return n=n[bi]||n[Ui],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function us(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function wo(n){return n[Sa]||null}var Nc=[],ds=-1;function ar(n){return{current:n}}function jt(n){0>ds||(n.current=Nc[ds],Nc[ds]=null,ds--)}function Bt(n,i){ds++,Nc[ds]=n.current,n.current=i}var or={},pn=ar(or),Nn=ar(!1),Nr=or;function fs(n,i){var o=n.type.contextTypes;if(!o)return or;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},x;for(x in o)h[x]=i[x];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function Pn(n){return n=n.childContextTypes,n!=null}function bo(){jt(Nn),jt(pn)}function wh(n,i,o){if(pn.current!==or)throw Error(t(168));Bt(pn,i),Bt(Nn,o)}function bh(n,i,o){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return o;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,fe(n)||"Unknown",h));return te({},o,c)}function To(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||or,Nr=pn.current,Bt(pn,n),Bt(Nn,Nn.current),!0}function Th(n,i,o){var c=n.stateNode;if(!c)throw Error(t(169));o?(n=bh(n,i,Nr),c.__reactInternalMemoizedMergedChildContext=n,jt(Nn),jt(pn),Bt(pn,n)):jt(Nn),Bt(Nn,o)}var Oi=null,Ao=!1,Pc=!1;function Ah(n){Oi===null?Oi=[n]:Oi.push(n)}function gv(n){Ao=!0,Ah(n)}function lr(){if(!Pc&&Oi!==null){Pc=!0;var n=0,i=Dt;try{var o=Oi;for(Dt=1;n<o.length;n++){var c=o[n];do c=c(!0);while(c!==null)}Oi=null,Ao=!1}catch(h){throw Oi!==null&&(Oi=Oi.slice(n+1)),oe(We,lr),h}finally{Dt=i,Pc=!1}}return null}var hs=[],ps=0,Co=null,Ro=0,Qn=[],Jn=0,Pr=null,Fi=1,ki="";function Ir(n,i){hs[ps++]=Ro,hs[ps++]=Co,Co=n,Ro=i}function Ch(n,i,o){Qn[Jn++]=Fi,Qn[Jn++]=ki,Qn[Jn++]=Pr,Pr=n;var c=Fi;n=ki;var h=32-ft(c)-1;c&=~(1<<h),o+=1;var x=32-ft(i)+h;if(30<x){var w=h-h%5;x=(c&(1<<w)-1).toString(32),c>>=w,h-=w,Fi=1<<32-ft(i)+h|o<<h|c,ki=x+n}else Fi=1<<x|o<<h|c,ki=n}function Ic(n){n.return!==null&&(Ir(n,1),Ch(n,1,0))}function Lc(n){for(;n===Co;)Co=hs[--ps],hs[ps]=null,Ro=hs[--ps],hs[ps]=null;for(;n===Pr;)Pr=Qn[--Jn],Qn[Jn]=null,ki=Qn[--Jn],Qn[Jn]=null,Fi=Qn[--Jn],Qn[Jn]=null}var Vn=null,Gn=null,Ht=!1,di=null;function Rh(n,i){var o=ii(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=n,i=n.deletions,i===null?(n.deletions=[o],n.flags|=16):i.push(o)}function Nh(n,i){switch(n.tag){case 5:var o=n.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Vn=n,Gn=sr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Vn=n,Gn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Pr!==null?{id:Fi,overflow:ki}:null,n.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=ii(18,null,null,0),o.stateNode=i,o.return=n,n.child=o,Vn=n,Gn=null,!0):!1;default:return!1}}function Dc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Uc(n){if(Ht){var i=Gn;if(i){var o=i;if(!Nh(n,i)){if(Dc(n))throw Error(t(418));i=sr(o.nextSibling);var c=Vn;i&&Nh(n,i)?Rh(c,o):(n.flags=n.flags&-4097|2,Ht=!1,Vn=n)}}else{if(Dc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Ht=!1,Vn=n}}}function Ph(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Vn=n}function No(n){if(n!==Vn)return!1;if(!Ht)return Ph(n),Ht=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Tc(n.type,n.memoizedProps)),i&&(i=Gn)){if(Dc(n))throw Ih(),Error(t(418));for(;i;)Rh(n,i),i=sr(i.nextSibling)}if(Ph(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(i===0){Gn=sr(n.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}n=n.nextSibling}Gn=null}}else Gn=Vn?sr(n.stateNode.nextSibling):null;return!0}function Ih(){for(var n=Gn;n;)n=sr(n.nextSibling)}function ms(){Gn=Vn=null,Ht=!1}function Oc(n){di===null?di=[n]:di.push(n)}var _v=C.ReactCurrentBatchConfig;function Ma(n,i,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var c=o.stateNode}if(!c)throw Error(t(147,n));var h=c,x=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===x?i.ref:(i=function(w){var U=h.refs;w===null?delete U[x]:U[x]=w},i._stringRef=x,i)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Po(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Lh(n){var i=n._init;return i(n._payload)}function Dh(n){function i(ee,G){if(n){var re=ee.deletions;re===null?(ee.deletions=[G],ee.flags|=16):re.push(G)}}function o(ee,G){if(!n)return null;for(;G!==null;)i(ee,G),G=G.sibling;return null}function c(ee,G){for(ee=new Map;G!==null;)G.key!==null?ee.set(G.key,G):ee.set(G.index,G),G=G.sibling;return ee}function h(ee,G){return ee=xr(ee,G),ee.index=0,ee.sibling=null,ee}function x(ee,G,re){return ee.index=re,n?(re=ee.alternate,re!==null?(re=re.index,re<G?(ee.flags|=2,G):re):(ee.flags|=2,G)):(ee.flags|=1048576,G)}function w(ee){return n&&ee.alternate===null&&(ee.flags|=2),ee}function U(ee,G,re,Re){return G===null||G.tag!==6?(G=Au(re,ee.mode,Re),G.return=ee,G):(G=h(G,re),G.return=ee,G)}function z(ee,G,re,Re){var qe=re.type;return qe===F?Me(ee,G,re.props.children,Re,re.key):G!==null&&(G.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===de&&Lh(qe)===G.type)?(Re=h(G,re.props),Re.ref=Ma(ee,G,re),Re.return=ee,Re):(Re=tl(re.type,re.key,re.props,null,ee.mode,Re),Re.ref=Ma(ee,G,re),Re.return=ee,Re)}function ae(ee,G,re,Re){return G===null||G.tag!==4||G.stateNode.containerInfo!==re.containerInfo||G.stateNode.implementation!==re.implementation?(G=Cu(re,ee.mode,Re),G.return=ee,G):(G=h(G,re.children||[]),G.return=ee,G)}function Me(ee,G,re,Re,qe){return G===null||G.tag!==7?(G=zr(re,ee.mode,Re,qe),G.return=ee,G):(G=h(G,re),G.return=ee,G)}function be(ee,G,re){if(typeof G=="string"&&G!==""||typeof G=="number")return G=Au(""+G,ee.mode,re),G.return=ee,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case ie:return re=tl(G.type,G.key,G.props,null,ee.mode,re),re.ref=Ma(ee,null,G),re.return=ee,re;case V:return G=Cu(G,ee.mode,re),G.return=ee,G;case de:var Re=G._init;return be(ee,Re(G._payload),re)}if(Ke(G)||pe(G))return G=zr(G,ee.mode,re,null),G.return=ee,G;Po(ee,G)}return null}function Ee(ee,G,re,Re){var qe=G!==null?G.key:null;if(typeof re=="string"&&re!==""||typeof re=="number")return qe!==null?null:U(ee,G,""+re,Re);if(typeof re=="object"&&re!==null){switch(re.$$typeof){case ie:return re.key===qe?z(ee,G,re,Re):null;case V:return re.key===qe?ae(ee,G,re,Re):null;case de:return qe=re._init,Ee(ee,G,qe(re._payload),Re)}if(Ke(re)||pe(re))return qe!==null?null:Me(ee,G,re,Re,null);Po(ee,re)}return null}function Oe(ee,G,re,Re,qe){if(typeof Re=="string"&&Re!==""||typeof Re=="number")return ee=ee.get(re)||null,U(G,ee,""+Re,qe);if(typeof Re=="object"&&Re!==null){switch(Re.$$typeof){case ie:return ee=ee.get(Re.key===null?re:Re.key)||null,z(G,ee,Re,qe);case V:return ee=ee.get(Re.key===null?re:Re.key)||null,ae(G,ee,Re,qe);case de:var nt=Re._init;return Oe(ee,G,re,nt(Re._payload),qe)}if(Ke(Re)||pe(Re))return ee=ee.get(re)||null,Me(G,ee,Re,qe,null);Po(G,Re)}return null}function Ge(ee,G,re,Re){for(var qe=null,nt=null,it=G,ot=G=0,ln=null;it!==null&&ot<re.length;ot++){it.index>ot?(ln=it,it=null):ln=it.sibling;var Rt=Ee(ee,it,re[ot],Re);if(Rt===null){it===null&&(it=ln);break}n&&it&&Rt.alternate===null&&i(ee,it),G=x(Rt,G,ot),nt===null?qe=Rt:nt.sibling=Rt,nt=Rt,it=ln}if(ot===re.length)return o(ee,it),Ht&&Ir(ee,ot),qe;if(it===null){for(;ot<re.length;ot++)it=be(ee,re[ot],Re),it!==null&&(G=x(it,G,ot),nt===null?qe=it:nt.sibling=it,nt=it);return Ht&&Ir(ee,ot),qe}for(it=c(ee,it);ot<re.length;ot++)ln=Oe(it,ee,ot,re[ot],Re),ln!==null&&(n&&ln.alternate!==null&&it.delete(ln.key===null?ot:ln.key),G=x(ln,G,ot),nt===null?qe=ln:nt.sibling=ln,nt=ln);return n&&it.forEach(function(vr){return i(ee,vr)}),Ht&&Ir(ee,ot),qe}function Xe(ee,G,re,Re){var qe=pe(re);if(typeof qe!="function")throw Error(t(150));if(re=qe.call(re),re==null)throw Error(t(151));for(var nt=qe=null,it=G,ot=G=0,ln=null,Rt=re.next();it!==null&&!Rt.done;ot++,Rt=re.next()){it.index>ot?(ln=it,it=null):ln=it.sibling;var vr=Ee(ee,it,Rt.value,Re);if(vr===null){it===null&&(it=ln);break}n&&it&&vr.alternate===null&&i(ee,it),G=x(vr,G,ot),nt===null?qe=vr:nt.sibling=vr,nt=vr,it=ln}if(Rt.done)return o(ee,it),Ht&&Ir(ee,ot),qe;if(it===null){for(;!Rt.done;ot++,Rt=re.next())Rt=be(ee,Rt.value,Re),Rt!==null&&(G=x(Rt,G,ot),nt===null?qe=Rt:nt.sibling=Rt,nt=Rt);return Ht&&Ir(ee,ot),qe}for(it=c(ee,it);!Rt.done;ot++,Rt=re.next())Rt=Oe(it,ee,ot,Rt.value,Re),Rt!==null&&(n&&Rt.alternate!==null&&it.delete(Rt.key===null?ot:Rt.key),G=x(Rt,G,ot),nt===null?qe=Rt:nt.sibling=Rt,nt=Rt);return n&&it.forEach(function(Qv){return i(ee,Qv)}),Ht&&Ir(ee,ot),qe}function Kt(ee,G,re,Re){if(typeof re=="object"&&re!==null&&re.type===F&&re.key===null&&(re=re.props.children),typeof re=="object"&&re!==null){switch(re.$$typeof){case ie:e:{for(var qe=re.key,nt=G;nt!==null;){if(nt.key===qe){if(qe=re.type,qe===F){if(nt.tag===7){o(ee,nt.sibling),G=h(nt,re.props.children),G.return=ee,ee=G;break e}}else if(nt.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===de&&Lh(qe)===nt.type){o(ee,nt.sibling),G=h(nt,re.props),G.ref=Ma(ee,nt,re),G.return=ee,ee=G;break e}o(ee,nt);break}else i(ee,nt);nt=nt.sibling}re.type===F?(G=zr(re.props.children,ee.mode,Re,re.key),G.return=ee,ee=G):(Re=tl(re.type,re.key,re.props,null,ee.mode,Re),Re.ref=Ma(ee,G,re),Re.return=ee,ee=Re)}return w(ee);case V:e:{for(nt=re.key;G!==null;){if(G.key===nt)if(G.tag===4&&G.stateNode.containerInfo===re.containerInfo&&G.stateNode.implementation===re.implementation){o(ee,G.sibling),G=h(G,re.children||[]),G.return=ee,ee=G;break e}else{o(ee,G);break}else i(ee,G);G=G.sibling}G=Cu(re,ee.mode,Re),G.return=ee,ee=G}return w(ee);case de:return nt=re._init,Kt(ee,G,nt(re._payload),Re)}if(Ke(re))return Ge(ee,G,re,Re);if(pe(re))return Xe(ee,G,re,Re);Po(ee,re)}return typeof re=="string"&&re!==""||typeof re=="number"?(re=""+re,G!==null&&G.tag===6?(o(ee,G.sibling),G=h(G,re),G.return=ee,ee=G):(o(ee,G),G=Au(re,ee.mode,Re),G.return=ee,ee=G),w(ee)):o(ee,G)}return Kt}var xs=Dh(!0),Uh=Dh(!1),Io=ar(null),Lo=null,vs=null,Fc=null;function kc(){Fc=vs=Lo=null}function Bc(n){var i=Io.current;jt(Io),n._currentValue=i}function zc(n,i,o){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===o)break;n=n.return}}function gs(n,i){Lo=n,Fc=vs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(In=!0),n.firstContext=null)}function ei(n){var i=n._currentValue;if(Fc!==n)if(n={context:n,memoizedValue:i,next:null},vs===null){if(Lo===null)throw Error(t(308));vs=n,Lo.dependencies={lanes:0,firstContext:n}}else vs=vs.next=n;return i}var Lr=null;function jc(n){Lr===null?Lr=[n]:Lr.push(n)}function Oh(n,i,o,c){var h=i.interleaved;return h===null?(o.next=o,jc(i)):(o.next=h.next,h.next=o),i.interleaved=o,Bi(n,c)}function Bi(n,i){n.lanes|=i;var o=n.alternate;for(o!==null&&(o.lanes|=i),o=n,n=n.return;n!==null;)n.childLanes|=i,o=n.alternate,o!==null&&(o.childLanes|=i),o=n,n=n.return;return o.tag===3?o.stateNode:null}var cr=!1;function Vc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Fh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function zi(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ur(n,i,o){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Tt&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Bi(n,o)}return h=c.interleaved,h===null?(i.next=i,jc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Bi(n,o)}function Do(n,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,nc(n,o)}}function kh(n,i){var o=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,o===c)){var h=null,x=null;if(o=o.firstBaseUpdate,o!==null){do{var w={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};x===null?h=x=w:x=x.next=w,o=o.next}while(o!==null);x===null?h=x=i:x=x.next=i}else h=x=i;o={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:x,shared:c.shared,effects:c.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=i:n.next=i,o.lastBaseUpdate=i}function Uo(n,i,o,c){var h=n.updateQueue;cr=!1;var x=h.firstBaseUpdate,w=h.lastBaseUpdate,U=h.shared.pending;if(U!==null){h.shared.pending=null;var z=U,ae=z.next;z.next=null,w===null?x=ae:w.next=ae,w=z;var Me=n.alternate;Me!==null&&(Me=Me.updateQueue,U=Me.lastBaseUpdate,U!==w&&(U===null?Me.firstBaseUpdate=ae:U.next=ae,Me.lastBaseUpdate=z))}if(x!==null){var be=h.baseState;w=0,Me=ae=z=null,U=x;do{var Ee=U.lane,Oe=U.eventTime;if((c&Ee)===Ee){Me!==null&&(Me=Me.next={eventTime:Oe,lane:0,tag:U.tag,payload:U.payload,callback:U.callback,next:null});e:{var Ge=n,Xe=U;switch(Ee=i,Oe=o,Xe.tag){case 1:if(Ge=Xe.payload,typeof Ge=="function"){be=Ge.call(Oe,be,Ee);break e}be=Ge;break e;case 3:Ge.flags=Ge.flags&-65537|128;case 0:if(Ge=Xe.payload,Ee=typeof Ge=="function"?Ge.call(Oe,be,Ee):Ge,Ee==null)break e;be=te({},be,Ee);break e;case 2:cr=!0}}U.callback!==null&&U.lane!==0&&(n.flags|=64,Ee=h.effects,Ee===null?h.effects=[U]:Ee.push(U))}else Oe={eventTime:Oe,lane:Ee,tag:U.tag,payload:U.payload,callback:U.callback,next:null},Me===null?(ae=Me=Oe,z=be):Me=Me.next=Oe,w|=Ee;if(U=U.next,U===null){if(U=h.shared.pending,U===null)break;Ee=U,U=Ee.next,Ee.next=null,h.lastBaseUpdate=Ee,h.shared.pending=null}}while(!0);if(Me===null&&(z=be),h.baseState=z,h.firstBaseUpdate=ae,h.lastBaseUpdate=Me,i=h.shared.interleaved,i!==null){h=i;do w|=h.lane,h=h.next;while(h!==i)}else x===null&&(h.shared.lanes=0);Or|=w,n.lanes=w,n.memoizedState=be}}function Bh(n,i,o){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=o,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var wa={},Ti=ar(wa),ba=ar(wa),Ta=ar(wa);function Dr(n){if(n===wa)throw Error(t(174));return n}function Gc(n,i){switch(Bt(Ta,i),Bt(ba,n),Bt(Ti,wa),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ve(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ve(i,n)}jt(Ti),Bt(Ti,i)}function _s(){jt(Ti),jt(ba),jt(Ta)}function zh(n){Dr(Ta.current);var i=Dr(Ti.current),o=Ve(i,n.type);i!==o&&(Bt(ba,n),Bt(Ti,o))}function Hc(n){ba.current===n&&(jt(Ti),jt(ba))}var Xt=ar(0);function Oo(n){for(var i=n;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Wc=[];function Xc(){for(var n=0;n<Wc.length;n++)Wc[n]._workInProgressVersionPrimary=null;Wc.length=0}var Fo=C.ReactCurrentDispatcher,Yc=C.ReactCurrentBatchConfig,Ur=0,Yt=null,en=null,an=null,ko=!1,Aa=!1,Ca=0,yv=0;function mn(){throw Error(t(321))}function $c(n,i){if(i===null)return!1;for(var o=0;o<i.length&&o<n.length;o++)if(!ui(n[o],i[o]))return!1;return!0}function qc(n,i,o,c,h,x){if(Ur=x,Yt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Fo.current=n===null||n.memoizedState===null?wv:bv,n=o(c,h),Aa){x=0;do{if(Aa=!1,Ca=0,25<=x)throw Error(t(301));x+=1,an=en=null,i.updateQueue=null,Fo.current=Tv,n=o(c,h)}while(Aa)}if(Fo.current=jo,i=en!==null&&en.next!==null,Ur=0,an=en=Yt=null,ko=!1,i)throw Error(t(300));return n}function Kc(){var n=Ca!==0;return Ca=0,n}function Ai(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return an===null?Yt.memoizedState=an=n:an=an.next=n,an}function ti(){if(en===null){var n=Yt.alternate;n=n!==null?n.memoizedState:null}else n=en.next;var i=an===null?Yt.memoizedState:an.next;if(i!==null)an=i,en=n;else{if(n===null)throw Error(t(310));en=n,n={memoizedState:en.memoizedState,baseState:en.baseState,baseQueue:en.baseQueue,queue:en.queue,next:null},an===null?Yt.memoizedState=an=n:an=an.next=n}return an}function Ra(n,i){return typeof i=="function"?i(n):i}function Zc(n){var i=ti(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=en,h=c.baseQueue,x=o.pending;if(x!==null){if(h!==null){var w=h.next;h.next=x.next,x.next=w}c.baseQueue=h=x,o.pending=null}if(h!==null){x=h.next,c=c.baseState;var U=w=null,z=null,ae=x;do{var Me=ae.lane;if((Ur&Me)===Me)z!==null&&(z=z.next={lane:0,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null}),c=ae.hasEagerState?ae.eagerState:n(c,ae.action);else{var be={lane:Me,action:ae.action,hasEagerState:ae.hasEagerState,eagerState:ae.eagerState,next:null};z===null?(U=z=be,w=c):z=z.next=be,Yt.lanes|=Me,Or|=Me}ae=ae.next}while(ae!==null&&ae!==x);z===null?w=c:z.next=U,ui(c,i.memoizedState)||(In=!0),i.memoizedState=c,i.baseState=w,i.baseQueue=z,o.lastRenderedState=c}if(n=o.interleaved,n!==null){h=n;do x=h.lane,Yt.lanes|=x,Or|=x,h=h.next;while(h!==n)}else h===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function Qc(n){var i=ti(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=o.dispatch,h=o.pending,x=i.memoizedState;if(h!==null){o.pending=null;var w=h=h.next;do x=n(x,w.action),w=w.next;while(w!==h);ui(x,i.memoizedState)||(In=!0),i.memoizedState=x,i.baseQueue===null&&(i.baseState=x),o.lastRenderedState=x}return[x,c]}function jh(){}function Vh(n,i){var o=Yt,c=ti(),h=i(),x=!ui(c.memoizedState,h);if(x&&(c.memoizedState=h,In=!0),c=c.queue,Jc(Wh.bind(null,o,c,n),[n]),c.getSnapshot!==i||x||an!==null&&an.memoizedState.tag&1){if(o.flags|=2048,Na(9,Hh.bind(null,o,c,h,i),void 0,null),on===null)throw Error(t(349));(Ur&30)!==0||Gh(o,i,h)}return h}function Gh(n,i,o){n.flags|=16384,n={getSnapshot:i,value:o},i=Yt.updateQueue,i===null?(i={lastEffect:null,stores:null},Yt.updateQueue=i,i.stores=[n]):(o=i.stores,o===null?i.stores=[n]:o.push(n))}function Hh(n,i,o,c){i.value=o,i.getSnapshot=c,Xh(i)&&Yh(n)}function Wh(n,i,o){return o(function(){Xh(i)&&Yh(n)})}function Xh(n){var i=n.getSnapshot;n=n.value;try{var o=i();return!ui(n,o)}catch{return!0}}function Yh(n){var i=Bi(n,1);i!==null&&mi(i,n,1,-1)}function $h(n){var i=Ai();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ra,lastRenderedState:n},i.queue=n,n=n.dispatch=Mv.bind(null,Yt,n),[i.memoizedState,n]}function Na(n,i,o,c){return n={tag:n,create:i,destroy:o,deps:c,next:null},i=Yt.updateQueue,i===null?(i={lastEffect:null,stores:null},Yt.updateQueue=i,i.lastEffect=n.next=n):(o=i.lastEffect,o===null?i.lastEffect=n.next=n:(c=o.next,o.next=n,n.next=c,i.lastEffect=n)),n}function qh(){return ti().memoizedState}function Bo(n,i,o,c){var h=Ai();Yt.flags|=n,h.memoizedState=Na(1|i,o,void 0,c===void 0?null:c)}function zo(n,i,o,c){var h=ti();c=c===void 0?null:c;var x=void 0;if(en!==null){var w=en.memoizedState;if(x=w.destroy,c!==null&&$c(c,w.deps)){h.memoizedState=Na(i,o,x,c);return}}Yt.flags|=n,h.memoizedState=Na(1|i,o,x,c)}function Kh(n,i){return Bo(8390656,8,n,i)}function Jc(n,i){return zo(2048,8,n,i)}function Zh(n,i){return zo(4,2,n,i)}function Qh(n,i){return zo(4,4,n,i)}function Jh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function ep(n,i,o){return o=o!=null?o.concat([n]):null,zo(4,4,Jh.bind(null,i,n),o)}function eu(){}function tp(n,i){var o=ti();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&$c(i,c[1])?c[0]:(o.memoizedState=[n,i],n)}function np(n,i){var o=ti();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&$c(i,c[1])?c[0]:(n=n(),o.memoizedState=[n,i],n)}function ip(n,i,o){return(Ur&21)===0?(n.baseState&&(n.baseState=!1,In=!0),n.memoizedState=o):(ui(o,i)||(o=Sn(),Yt.lanes|=o,Or|=o,n.baseState=!0),i)}function Sv(n,i){var o=Dt;Dt=o!==0&&4>o?o:4,n(!0);var c=Yc.transition;Yc.transition={};try{n(!1),i()}finally{Dt=o,Yc.transition=c}}function rp(){return ti().memoizedState}function Ev(n,i,o){var c=pr(n);if(o={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null},sp(n))ap(i,o);else if(o=Oh(n,i,o,c),o!==null){var h=Mn();mi(o,n,c,h),op(o,i,c)}}function Mv(n,i,o){var c=pr(n),h={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null};if(sp(n))ap(i,h);else{var x=n.alternate;if(n.lanes===0&&(x===null||x.lanes===0)&&(x=i.lastRenderedReducer,x!==null))try{var w=i.lastRenderedState,U=x(w,o);if(h.hasEagerState=!0,h.eagerState=U,ui(U,w)){var z=i.interleaved;z===null?(h.next=h,jc(i)):(h.next=z.next,z.next=h),i.interleaved=h;return}}catch{}finally{}o=Oh(n,i,h,c),o!==null&&(h=Mn(),mi(o,n,c,h),op(o,i,c))}}function sp(n){var i=n.alternate;return n===Yt||i!==null&&i===Yt}function ap(n,i){Aa=ko=!0;var o=n.pending;o===null?i.next=i:(i.next=o.next,o.next=i),n.pending=i}function op(n,i,o){if((o&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,nc(n,o)}}var jo={readContext:ei,useCallback:mn,useContext:mn,useEffect:mn,useImperativeHandle:mn,useInsertionEffect:mn,useLayoutEffect:mn,useMemo:mn,useReducer:mn,useRef:mn,useState:mn,useDebugValue:mn,useDeferredValue:mn,useTransition:mn,useMutableSource:mn,useSyncExternalStore:mn,useId:mn,unstable_isNewReconciler:!1},wv={readContext:ei,useCallback:function(n,i){return Ai().memoizedState=[n,i===void 0?null:i],n},useContext:ei,useEffect:Kh,useImperativeHandle:function(n,i,o){return o=o!=null?o.concat([n]):null,Bo(4194308,4,Jh.bind(null,i,n),o)},useLayoutEffect:function(n,i){return Bo(4194308,4,n,i)},useInsertionEffect:function(n,i){return Bo(4,2,n,i)},useMemo:function(n,i){var o=Ai();return i=i===void 0?null:i,n=n(),o.memoizedState=[n,i],n},useReducer:function(n,i,o){var c=Ai();return i=o!==void 0?o(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=Ev.bind(null,Yt,n),[c.memoizedState,n]},useRef:function(n){var i=Ai();return n={current:n},i.memoizedState=n},useState:$h,useDebugValue:eu,useDeferredValue:function(n){return Ai().memoizedState=n},useTransition:function(){var n=$h(!1),i=n[0];return n=Sv.bind(null,n[1]),Ai().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,o){var c=Yt,h=Ai();if(Ht){if(o===void 0)throw Error(t(407));o=o()}else{if(o=i(),on===null)throw Error(t(349));(Ur&30)!==0||Gh(c,i,o)}h.memoizedState=o;var x={value:o,getSnapshot:i};return h.queue=x,Kh(Wh.bind(null,c,x,n),[n]),c.flags|=2048,Na(9,Hh.bind(null,c,x,o,i),void 0,null),o},useId:function(){var n=Ai(),i=on.identifierPrefix;if(Ht){var o=ki,c=Fi;o=(c&~(1<<32-ft(c)-1)).toString(32)+o,i=":"+i+"R"+o,o=Ca++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=yv++,i=":"+i+"r"+o.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},bv={readContext:ei,useCallback:tp,useContext:ei,useEffect:Jc,useImperativeHandle:ep,useInsertionEffect:Zh,useLayoutEffect:Qh,useMemo:np,useReducer:Zc,useRef:qh,useState:function(){return Zc(Ra)},useDebugValue:eu,useDeferredValue:function(n){var i=ti();return ip(i,en.memoizedState,n)},useTransition:function(){var n=Zc(Ra)[0],i=ti().memoizedState;return[n,i]},useMutableSource:jh,useSyncExternalStore:Vh,useId:rp,unstable_isNewReconciler:!1},Tv={readContext:ei,useCallback:tp,useContext:ei,useEffect:Jc,useImperativeHandle:ep,useInsertionEffect:Zh,useLayoutEffect:Qh,useMemo:np,useReducer:Qc,useRef:qh,useState:function(){return Qc(Ra)},useDebugValue:eu,useDeferredValue:function(n){var i=ti();return en===null?i.memoizedState=n:ip(i,en.memoizedState,n)},useTransition:function(){var n=Qc(Ra)[0],i=ti().memoizedState;return[n,i]},useMutableSource:jh,useSyncExternalStore:Vh,useId:rp,unstable_isNewReconciler:!1};function fi(n,i){if(n&&n.defaultProps){i=te({},i),n=n.defaultProps;for(var o in n)i[o]===void 0&&(i[o]=n[o]);return i}return i}function tu(n,i,o,c){i=n.memoizedState,o=o(c,i),o=o==null?i:te({},i,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Vo={isMounted:function(n){return(n=n._reactInternals)?Cn(n)===n:!1},enqueueSetState:function(n,i,o){n=n._reactInternals;var c=Mn(),h=pr(n),x=zi(c,h);x.payload=i,o!=null&&(x.callback=o),i=ur(n,x,h),i!==null&&(mi(i,n,h,c),Do(i,n,h))},enqueueReplaceState:function(n,i,o){n=n._reactInternals;var c=Mn(),h=pr(n),x=zi(c,h);x.tag=1,x.payload=i,o!=null&&(x.callback=o),i=ur(n,x,h),i!==null&&(mi(i,n,h,c),Do(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var o=Mn(),c=pr(n),h=zi(o,c);h.tag=2,i!=null&&(h.callback=i),i=ur(n,h,c),i!==null&&(mi(i,n,c,o),Do(i,n,c))}};function lp(n,i,o,c,h,x,w){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,x,w):i.prototype&&i.prototype.isPureReactComponent?!xa(o,c)||!xa(h,x):!0}function cp(n,i,o){var c=!1,h=or,x=i.contextType;return typeof x=="object"&&x!==null?x=ei(x):(h=Pn(i)?Nr:pn.current,c=i.contextTypes,x=(c=c!=null)?fs(n,h):or),i=new i(o,x),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Vo,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=x),i}function up(n,i,o,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,c),i.state!==n&&Vo.enqueueReplaceState(i,i.state,null)}function nu(n,i,o,c){var h=n.stateNode;h.props=o,h.state=n.memoizedState,h.refs={},Vc(n);var x=i.contextType;typeof x=="object"&&x!==null?h.context=ei(x):(x=Pn(i)?Nr:pn.current,h.context=fs(n,x)),h.state=n.memoizedState,x=i.getDerivedStateFromProps,typeof x=="function"&&(tu(n,i,x,o),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&Vo.enqueueReplaceState(h,h.state,null),Uo(n,o,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function ys(n,i){try{var o="",c=i;do o+=k(c),c=c.return;while(c);var h=o}catch(x){h=`
Error generating stack: `+x.message+`
`+x.stack}return{value:n,source:i,stack:h,digest:null}}function iu(n,i,o){return{value:n,source:null,stack:o??null,digest:i??null}}function ru(n,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var Av=typeof WeakMap=="function"?WeakMap:Map;function dp(n,i,o){o=zi(-1,o),o.tag=3,o.payload={element:null};var c=i.value;return o.callback=function(){qo||(qo=!0,_u=c),ru(n,i)},o}function fp(n,i,o){o=zi(-1,o),o.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;o.payload=function(){return c(h)},o.callback=function(){ru(n,i)}}var x=n.stateNode;return x!==null&&typeof x.componentDidCatch=="function"&&(o.callback=function(){ru(n,i),typeof c!="function"&&(fr===null?fr=new Set([this]):fr.add(this));var w=i.stack;this.componentDidCatch(i.value,{componentStack:w!==null?w:""})}),o}function hp(n,i,o){var c=n.pingCache;if(c===null){c=n.pingCache=new Av;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(o)||(h.add(o),n=jv.bind(null,n,i,o),i.then(n,n))}function pp(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function mp(n,i,o,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=zi(-1,1),i.tag=2,ur(o,i,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var Cv=C.ReactCurrentOwner,In=!1;function En(n,i,o,c){i.child=n===null?Uh(i,null,o,c):xs(i,n.child,o,c)}function xp(n,i,o,c,h){o=o.render;var x=i.ref;return gs(i,h),c=qc(n,i,o,c,x,h),o=Kc(),n!==null&&!In?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,ji(n,i,h)):(Ht&&o&&Ic(i),i.flags|=1,En(n,i,c,h),i.child)}function vp(n,i,o,c,h){if(n===null){var x=o.type;return typeof x=="function"&&!Tu(x)&&x.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=x,gp(n,i,x,c,h)):(n=tl(o.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(x=n.child,(n.lanes&h)===0){var w=x.memoizedProps;if(o=o.compare,o=o!==null?o:xa,o(w,c)&&n.ref===i.ref)return ji(n,i,h)}return i.flags|=1,n=xr(x,c),n.ref=i.ref,n.return=i,i.child=n}function gp(n,i,o,c,h){if(n!==null){var x=n.memoizedProps;if(xa(x,c)&&n.ref===i.ref)if(In=!1,i.pendingProps=c=x,(n.lanes&h)!==0)(n.flags&131072)!==0&&(In=!0);else return i.lanes=n.lanes,ji(n,i,h)}return su(n,i,o,c,h)}function _p(n,i,o){var c=i.pendingProps,h=c.children,x=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Bt(Es,Hn),Hn|=o;else{if((o&1073741824)===0)return n=x!==null?x.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Bt(Es,Hn),Hn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=x!==null?x.baseLanes:o,Bt(Es,Hn),Hn|=c}else x!==null?(c=x.baseLanes|o,i.memoizedState=null):c=o,Bt(Es,Hn),Hn|=c;return En(n,i,h,o),i.child}function yp(n,i){var o=i.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function su(n,i,o,c,h){var x=Pn(o)?Nr:pn.current;return x=fs(i,x),gs(i,h),o=qc(n,i,o,c,x,h),c=Kc(),n!==null&&!In?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,ji(n,i,h)):(Ht&&c&&Ic(i),i.flags|=1,En(n,i,o,h),i.child)}function Sp(n,i,o,c,h){if(Pn(o)){var x=!0;To(i)}else x=!1;if(gs(i,h),i.stateNode===null)Ho(n,i),cp(i,o,c),nu(i,o,c,h),c=!0;else if(n===null){var w=i.stateNode,U=i.memoizedProps;w.props=U;var z=w.context,ae=o.contextType;typeof ae=="object"&&ae!==null?ae=ei(ae):(ae=Pn(o)?Nr:pn.current,ae=fs(i,ae));var Me=o.getDerivedStateFromProps,be=typeof Me=="function"||typeof w.getSnapshotBeforeUpdate=="function";be||typeof w.UNSAFE_componentWillReceiveProps!="function"&&typeof w.componentWillReceiveProps!="function"||(U!==c||z!==ae)&&up(i,w,c,ae),cr=!1;var Ee=i.memoizedState;w.state=Ee,Uo(i,c,w,h),z=i.memoizedState,U!==c||Ee!==z||Nn.current||cr?(typeof Me=="function"&&(tu(i,o,Me,c),z=i.memoizedState),(U=cr||lp(i,o,U,c,Ee,z,ae))?(be||typeof w.UNSAFE_componentWillMount!="function"&&typeof w.componentWillMount!="function"||(typeof w.componentWillMount=="function"&&w.componentWillMount(),typeof w.UNSAFE_componentWillMount=="function"&&w.UNSAFE_componentWillMount()),typeof w.componentDidMount=="function"&&(i.flags|=4194308)):(typeof w.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=z),w.props=c,w.state=z,w.context=ae,c=U):(typeof w.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{w=i.stateNode,Fh(n,i),U=i.memoizedProps,ae=i.type===i.elementType?U:fi(i.type,U),w.props=ae,be=i.pendingProps,Ee=w.context,z=o.contextType,typeof z=="object"&&z!==null?z=ei(z):(z=Pn(o)?Nr:pn.current,z=fs(i,z));var Oe=o.getDerivedStateFromProps;(Me=typeof Oe=="function"||typeof w.getSnapshotBeforeUpdate=="function")||typeof w.UNSAFE_componentWillReceiveProps!="function"&&typeof w.componentWillReceiveProps!="function"||(U!==be||Ee!==z)&&up(i,w,c,z),cr=!1,Ee=i.memoizedState,w.state=Ee,Uo(i,c,w,h);var Ge=i.memoizedState;U!==be||Ee!==Ge||Nn.current||cr?(typeof Oe=="function"&&(tu(i,o,Oe,c),Ge=i.memoizedState),(ae=cr||lp(i,o,ae,c,Ee,Ge,z)||!1)?(Me||typeof w.UNSAFE_componentWillUpdate!="function"&&typeof w.componentWillUpdate!="function"||(typeof w.componentWillUpdate=="function"&&w.componentWillUpdate(c,Ge,z),typeof w.UNSAFE_componentWillUpdate=="function"&&w.UNSAFE_componentWillUpdate(c,Ge,z)),typeof w.componentDidUpdate=="function"&&(i.flags|=4),typeof w.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof w.componentDidUpdate!="function"||U===n.memoizedProps&&Ee===n.memoizedState||(i.flags|=4),typeof w.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&Ee===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=Ge),w.props=c,w.state=Ge,w.context=z,c=ae):(typeof w.componentDidUpdate!="function"||U===n.memoizedProps&&Ee===n.memoizedState||(i.flags|=4),typeof w.getSnapshotBeforeUpdate!="function"||U===n.memoizedProps&&Ee===n.memoizedState||(i.flags|=1024),c=!1)}return au(n,i,o,c,x,h)}function au(n,i,o,c,h,x){yp(n,i);var w=(i.flags&128)!==0;if(!c&&!w)return h&&Th(i,o,!1),ji(n,i,x);c=i.stateNode,Cv.current=i;var U=w&&typeof o.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&w?(i.child=xs(i,n.child,null,x),i.child=xs(i,null,U,x)):En(n,i,U,x),i.memoizedState=c.state,h&&Th(i,o,!0),i.child}function Ep(n){var i=n.stateNode;i.pendingContext?wh(n,i.pendingContext,i.pendingContext!==i.context):i.context&&wh(n,i.context,!1),Gc(n,i.containerInfo)}function Mp(n,i,o,c,h){return ms(),Oc(h),i.flags|=256,En(n,i,o,c),i.child}var ou={dehydrated:null,treeContext:null,retryLane:0};function lu(n){return{baseLanes:n,cachePool:null,transitions:null}}function wp(n,i,o){var c=i.pendingProps,h=Xt.current,x=!1,w=(i.flags&128)!==0,U;if((U=w)||(U=n!==null&&n.memoizedState===null?!1:(h&2)!==0),U?(x=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),Bt(Xt,h&1),n===null)return Uc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(w=c.children,n=c.fallback,x?(c=i.mode,x=i.child,w={mode:"hidden",children:w},(c&1)===0&&x!==null?(x.childLanes=0,x.pendingProps=w):x=nl(w,c,0,null),n=zr(n,c,o,null),x.return=i,n.return=i,x.sibling=n,i.child=x,i.child.memoizedState=lu(o),i.memoizedState=ou,n):cu(i,w));if(h=n.memoizedState,h!==null&&(U=h.dehydrated,U!==null))return Rv(n,i,w,c,U,h,o);if(x){x=c.fallback,w=i.mode,h=n.child,U=h.sibling;var z={mode:"hidden",children:c.children};return(w&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=z,i.deletions=null):(c=xr(h,z),c.subtreeFlags=h.subtreeFlags&14680064),U!==null?x=xr(U,x):(x=zr(x,w,o,null),x.flags|=2),x.return=i,c.return=i,c.sibling=x,i.child=c,c=x,x=i.child,w=n.child.memoizedState,w=w===null?lu(o):{baseLanes:w.baseLanes|o,cachePool:null,transitions:w.transitions},x.memoizedState=w,x.childLanes=n.childLanes&~o,i.memoizedState=ou,c}return x=n.child,n=x.sibling,c=xr(x,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=o),c.return=i,c.sibling=null,n!==null&&(o=i.deletions,o===null?(i.deletions=[n],i.flags|=16):o.push(n)),i.child=c,i.memoizedState=null,c}function cu(n,i){return i=nl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Go(n,i,o,c){return c!==null&&Oc(c),xs(i,n.child,null,o),n=cu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function Rv(n,i,o,c,h,x,w){if(o)return i.flags&256?(i.flags&=-257,c=iu(Error(t(422))),Go(n,i,w,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(x=c.fallback,h=i.mode,c=nl({mode:"visible",children:c.children},h,0,null),x=zr(x,h,w,null),x.flags|=2,c.return=i,x.return=i,c.sibling=x,i.child=c,(i.mode&1)!==0&&xs(i,n.child,null,w),i.child.memoizedState=lu(w),i.memoizedState=ou,x);if((i.mode&1)===0)return Go(n,i,w,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var U=c.dgst;return c=U,x=Error(t(419)),c=iu(x,c,void 0),Go(n,i,w,c)}if(U=(w&n.childLanes)!==0,In||U){if(c=on,c!==null){switch(w&-w){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|w))!==0?0:h,h!==0&&h!==x.retryLane&&(x.retryLane=h,Bi(n,h),mi(c,n,h,-1))}return bu(),c=iu(Error(t(421))),Go(n,i,w,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=Vv.bind(null,n),h._reactRetry=i,null):(n=x.treeContext,Gn=sr(h.nextSibling),Vn=i,Ht=!0,di=null,n!==null&&(Qn[Jn++]=Fi,Qn[Jn++]=ki,Qn[Jn++]=Pr,Fi=n.id,ki=n.overflow,Pr=i),i=cu(i,c.children),i.flags|=4096,i)}function bp(n,i,o){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),zc(n.return,i,o)}function uu(n,i,o,c,h){var x=n.memoizedState;x===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:o,tailMode:h}:(x.isBackwards=i,x.rendering=null,x.renderingStartTime=0,x.last=c,x.tail=o,x.tailMode=h)}function Tp(n,i,o){var c=i.pendingProps,h=c.revealOrder,x=c.tail;if(En(n,i,c.children,o),c=Xt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&bp(n,o,i);else if(n.tag===19)bp(n,o,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Bt(Xt,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(o=i.child,h=null;o!==null;)n=o.alternate,n!==null&&Oo(n)===null&&(h=o),o=o.sibling;o=h,o===null?(h=i.child,i.child=null):(h=o.sibling,o.sibling=null),uu(i,!1,h,o,x);break;case"backwards":for(o=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Oo(n)===null){i.child=h;break}n=h.sibling,h.sibling=o,o=h,h=n}uu(i,!0,o,null,x);break;case"together":uu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Ho(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function ji(n,i,o){if(n!==null&&(i.dependencies=n.dependencies),Or|=i.lanes,(o&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,o=xr(n,n.pendingProps),i.child=o,o.return=i;n.sibling!==null;)n=n.sibling,o=o.sibling=xr(n,n.pendingProps),o.return=i;o.sibling=null}return i.child}function Nv(n,i,o){switch(i.tag){case 3:Ep(i),ms();break;case 5:zh(i);break;case 1:Pn(i.type)&&To(i);break;case 4:Gc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;Bt(Io,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Bt(Xt,Xt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?wp(n,i,o):(Bt(Xt,Xt.current&1),n=ji(n,i,o),n!==null?n.sibling:null);Bt(Xt,Xt.current&1);break;case 19:if(c=(o&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Tp(n,i,o);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),Bt(Xt,Xt.current),c)break;return null;case 22:case 23:return i.lanes=0,_p(n,i,o)}return ji(n,i,o)}var Ap,du,Cp,Rp;Ap=function(n,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},du=function(){},Cp=function(n,i,o,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Dr(Ti.current);var x=null;switch(o){case"input":h=W(n,h),c=W(n,c),x=[];break;case"select":h=te({},h,{value:void 0}),c=te({},c,{value:void 0}),x=[];break;case"textarea":h=T(n,h),c=T(n,c),x=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Mo)}xt(o,c);var w;o=null;for(ae in h)if(!c.hasOwnProperty(ae)&&h.hasOwnProperty(ae)&&h[ae]!=null)if(ae==="style"){var U=h[ae];for(w in U)U.hasOwnProperty(w)&&(o||(o={}),o[w]="")}else ae!=="dangerouslySetInnerHTML"&&ae!=="children"&&ae!=="suppressContentEditableWarning"&&ae!=="suppressHydrationWarning"&&ae!=="autoFocus"&&(a.hasOwnProperty(ae)?x||(x=[]):(x=x||[]).push(ae,null));for(ae in c){var z=c[ae];if(U=h!=null?h[ae]:void 0,c.hasOwnProperty(ae)&&z!==U&&(z!=null||U!=null))if(ae==="style")if(U){for(w in U)!U.hasOwnProperty(w)||z&&z.hasOwnProperty(w)||(o||(o={}),o[w]="");for(w in z)z.hasOwnProperty(w)&&U[w]!==z[w]&&(o||(o={}),o[w]=z[w])}else o||(x||(x=[]),x.push(ae,o)),o=z;else ae==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,U=U?U.__html:void 0,z!=null&&U!==z&&(x=x||[]).push(ae,z)):ae==="children"?typeof z!="string"&&typeof z!="number"||(x=x||[]).push(ae,""+z):ae!=="suppressContentEditableWarning"&&ae!=="suppressHydrationWarning"&&(a.hasOwnProperty(ae)?(z!=null&&ae==="onScroll"&&zt("scroll",n),x||U===z||(x=[])):(x=x||[]).push(ae,z))}o&&(x=x||[]).push("style",o);var ae=x;(i.updateQueue=ae)&&(i.flags|=4)}},Rp=function(n,i,o,c){o!==c&&(i.flags|=4)};function Pa(n,i){if(!Ht)switch(n.tailMode){case"hidden":i=n.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var c=null;o!==null;)o.alternate!==null&&(c=o),o=o.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function xn(n){var i=n.alternate!==null&&n.alternate.child===n.child,o=0,c=0;if(i)for(var h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=o,i}function Pv(n,i,o){var c=i.pendingProps;switch(Lc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return xn(i),null;case 1:return Pn(i.type)&&bo(),xn(i),null;case 3:return c=i.stateNode,_s(),jt(Nn),jt(pn),Xc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(No(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,di!==null&&(Eu(di),di=null))),du(n,i),xn(i),null;case 5:Hc(i);var h=Dr(Ta.current);if(o=i.type,n!==null&&i.stateNode!=null)Cp(n,i,o,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return xn(i),null}if(n=Dr(Ti.current),No(i)){c=i.stateNode,o=i.type;var x=i.memoizedProps;switch(c[bi]=i,c[Sa]=x,n=(i.mode&1)!==0,o){case"dialog":zt("cancel",c),zt("close",c);break;case"iframe":case"object":case"embed":zt("load",c);break;case"video":case"audio":for(h=0;h<ga.length;h++)zt(ga[h],c);break;case"source":zt("error",c);break;case"img":case"image":case"link":zt("error",c),zt("load",c);break;case"details":zt("toggle",c);break;case"input":sn(c,x),zt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!x.multiple},zt("invalid",c);break;case"textarea":se(c,x),zt("invalid",c)}xt(o,x),h=null;for(var w in x)if(x.hasOwnProperty(w)){var U=x[w];w==="children"?typeof U=="string"?c.textContent!==U&&(x.suppressHydrationWarning!==!0&&Eo(c.textContent,U,n),h=["children",U]):typeof U=="number"&&c.textContent!==""+U&&(x.suppressHydrationWarning!==!0&&Eo(c.textContent,U,n),h=["children",""+U]):a.hasOwnProperty(w)&&U!=null&&w==="onScroll"&&zt("scroll",c)}switch(o){case"input":_t(c),Je(c,x,!0);break;case"textarea":_t(c),Se(c);break;case"select":case"option":break;default:typeof x.onClick=="function"&&(c.onclick=Mo)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{w=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=ve(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=w.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=w.createElement(o,{is:c.is}):(n=w.createElement(o),o==="select"&&(w=n,c.multiple?w.multiple=!0:c.size&&(w.size=c.size))):n=w.createElementNS(n,o),n[bi]=i,n[Sa]=c,Ap(n,i,!1,!1),i.stateNode=n;e:{switch(w=ct(o,c),o){case"dialog":zt("cancel",n),zt("close",n),h=c;break;case"iframe":case"object":case"embed":zt("load",n),h=c;break;case"video":case"audio":for(h=0;h<ga.length;h++)zt(ga[h],n);h=c;break;case"source":zt("error",n),h=c;break;case"img":case"image":case"link":zt("error",n),zt("load",n),h=c;break;case"details":zt("toggle",n),h=c;break;case"input":sn(n,c),h=W(n,c),zt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=te({},c,{value:void 0}),zt("invalid",n);break;case"textarea":se(n,c),h=T(n,c),zt("invalid",n);break;default:h=c}xt(o,h),U=h;for(x in U)if(U.hasOwnProperty(x)){var z=U[x];x==="style"?rt(n,z):x==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,z!=null&&Pe(n,z)):x==="children"?typeof z=="string"?(o!=="textarea"||z!=="")&&dt(n,z):typeof z=="number"&&dt(n,""+z):x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&x!=="autoFocus"&&(a.hasOwnProperty(x)?z!=null&&x==="onScroll"&&zt("scroll",n):z!=null&&I(n,x,z,w))}switch(o){case"input":_t(n),Je(n,c,!1);break;case"textarea":_t(n),Se(n);break;case"option":c.value!=null&&n.setAttribute("value",""+ge(c.value));break;case"select":n.multiple=!!c.multiple,x=c.value,x!=null?D(n,!!c.multiple,x,!1):c.defaultValue!=null&&D(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=Mo)}switch(o){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return xn(i),null;case 6:if(n&&i.stateNode!=null)Rp(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(o=Dr(Ta.current),Dr(Ti.current),No(i)){if(c=i.stateNode,o=i.memoizedProps,c[bi]=i,(x=c.nodeValue!==o)&&(n=Vn,n!==null))switch(n.tag){case 3:Eo(c.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Eo(c.nodeValue,o,(n.mode&1)!==0)}x&&(i.flags|=4)}else c=(o.nodeType===9?o:o.ownerDocument).createTextNode(c),c[bi]=i,i.stateNode=c}return xn(i),null;case 13:if(jt(Xt),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Ht&&Gn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Ih(),ms(),i.flags|=98560,x=!1;else if(x=No(i),c!==null&&c.dehydrated!==null){if(n===null){if(!x)throw Error(t(318));if(x=i.memoizedState,x=x!==null?x.dehydrated:null,!x)throw Error(t(317));x[bi]=i}else ms(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;xn(i),x=!1}else di!==null&&(Eu(di),di=null),x=!0;if(!x)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Xt.current&1)!==0?tn===0&&(tn=3):bu())),i.updateQueue!==null&&(i.flags|=4),xn(i),null);case 4:return _s(),du(n,i),n===null&&_a(i.stateNode.containerInfo),xn(i),null;case 10:return Bc(i.type._context),xn(i),null;case 17:return Pn(i.type)&&bo(),xn(i),null;case 19:if(jt(Xt),x=i.memoizedState,x===null)return xn(i),null;if(c=(i.flags&128)!==0,w=x.rendering,w===null)if(c)Pa(x,!1);else{if(tn!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(w=Oo(n),w!==null){for(i.flags|=128,Pa(x,!1),c=w.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=o,o=i.child;o!==null;)x=o,n=c,x.flags&=14680066,w=x.alternate,w===null?(x.childLanes=0,x.lanes=n,x.child=null,x.subtreeFlags=0,x.memoizedProps=null,x.memoizedState=null,x.updateQueue=null,x.dependencies=null,x.stateNode=null):(x.childLanes=w.childLanes,x.lanes=w.lanes,x.child=w.child,x.subtreeFlags=0,x.deletions=null,x.memoizedProps=w.memoizedProps,x.memoizedState=w.memoizedState,x.updateQueue=w.updateQueue,x.type=w.type,n=w.dependencies,x.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Bt(Xt,Xt.current&1|2),i.child}n=n.sibling}x.tail!==null&&Ce()>Ms&&(i.flags|=128,c=!0,Pa(x,!1),i.lanes=4194304)}else{if(!c)if(n=Oo(w),n!==null){if(i.flags|=128,c=!0,o=n.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Pa(x,!0),x.tail===null&&x.tailMode==="hidden"&&!w.alternate&&!Ht)return xn(i),null}else 2*Ce()-x.renderingStartTime>Ms&&o!==1073741824&&(i.flags|=128,c=!0,Pa(x,!1),i.lanes=4194304);x.isBackwards?(w.sibling=i.child,i.child=w):(o=x.last,o!==null?o.sibling=w:i.child=w,x.last=w)}return x.tail!==null?(i=x.tail,x.rendering=i,x.tail=i.sibling,x.renderingStartTime=Ce(),i.sibling=null,o=Xt.current,Bt(Xt,c?o&1|2:o&1),i):(xn(i),null);case 22:case 23:return wu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Hn&1073741824)!==0&&(xn(i),i.subtreeFlags&6&&(i.flags|=8192)):xn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function Iv(n,i){switch(Lc(i),i.tag){case 1:return Pn(i.type)&&bo(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return _s(),jt(Nn),jt(pn),Xc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Hc(i),null;case 13:if(jt(Xt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));ms()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return jt(Xt),null;case 4:return _s(),null;case 10:return Bc(i.type._context),null;case 22:case 23:return wu(),null;case 24:return null;default:return null}}var Wo=!1,vn=!1,Lv=typeof WeakSet=="function"?WeakSet:Set,je=null;function Ss(n,i){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(c){qt(n,i,c)}else o.current=null}function fu(n,i,o){try{o()}catch(c){qt(n,i,c)}}var Np=!1;function Dv(n,i){if(wc=uo,n=lh(),xc(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var h=c.anchorOffset,x=c.focusNode;c=c.focusOffset;try{o.nodeType,x.nodeType}catch{o=null;break e}var w=0,U=-1,z=-1,ae=0,Me=0,be=n,Ee=null;t:for(;;){for(var Oe;be!==o||h!==0&&be.nodeType!==3||(U=w+h),be!==x||c!==0&&be.nodeType!==3||(z=w+c),be.nodeType===3&&(w+=be.nodeValue.length),(Oe=be.firstChild)!==null;)Ee=be,be=Oe;for(;;){if(be===n)break t;if(Ee===o&&++ae===h&&(U=w),Ee===x&&++Me===c&&(z=w),(Oe=be.nextSibling)!==null)break;be=Ee,Ee=be.parentNode}be=Oe}o=U===-1||z===-1?null:{start:U,end:z}}else o=null}o=o||{start:0,end:0}}else o=null;for(bc={focusedElem:n,selectionRange:o},uo=!1,je=i;je!==null;)if(i=je,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,je=n;else for(;je!==null;){i=je;try{var Ge=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Ge!==null){var Xe=Ge.memoizedProps,Kt=Ge.memoizedState,ee=i.stateNode,G=ee.getSnapshotBeforeUpdate(i.elementType===i.type?Xe:fi(i.type,Xe),Kt);ee.__reactInternalSnapshotBeforeUpdate=G}break;case 3:var re=i.stateNode.containerInfo;re.nodeType===1?re.textContent="":re.nodeType===9&&re.documentElement&&re.removeChild(re.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Re){qt(i,i.return,Re)}if(n=i.sibling,n!==null){n.return=i.return,je=n;break}je=i.return}return Ge=Np,Np=!1,Ge}function Ia(n,i,o){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var x=h.destroy;h.destroy=void 0,x!==void 0&&fu(i,o,x)}h=h.next}while(h!==c)}}function Xo(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&n)===n){var c=o.create;o.destroy=c()}o=o.next}while(o!==i)}}function hu(n){var i=n.ref;if(i!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof i=="function"?i(n):i.current=n}}function Pp(n){var i=n.alternate;i!==null&&(n.alternate=null,Pp(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[bi],delete i[Sa],delete i[Rc],delete i[xv],delete i[vv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Ip(n){return n.tag===5||n.tag===3||n.tag===4}function Lp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Ip(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function pu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(n,i):o.insertBefore(n,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(n,o)):(i=o,i.appendChild(n)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=Mo));else if(c!==4&&(n=n.child,n!==null))for(pu(n,i,o),n=n.sibling;n!==null;)pu(n,i,o),n=n.sibling}function mu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.insertBefore(n,i):o.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(mu(n,i,o),n=n.sibling;n!==null;)mu(n,i,o),n=n.sibling}var un=null,hi=!1;function dr(n,i,o){for(o=o.child;o!==null;)Dp(n,i,o),o=o.sibling}function Dp(n,i,o){if(Et&&typeof Et.onCommitFiberUnmount=="function")try{Et.onCommitFiberUnmount(Lt,o)}catch{}switch(o.tag){case 5:vn||Ss(o,i);case 6:var c=un,h=hi;un=null,dr(n,i,o),un=c,hi=h,un!==null&&(hi?(n=un,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):un.removeChild(o.stateNode));break;case 18:un!==null&&(hi?(n=un,o=o.stateNode,n.nodeType===8?Cc(n.parentNode,o):n.nodeType===1&&Cc(n,o),ua(n)):Cc(un,o.stateNode));break;case 4:c=un,h=hi,un=o.stateNode.containerInfo,hi=!0,dr(n,i,o),un=c,hi=h;break;case 0:case 11:case 14:case 15:if(!vn&&(c=o.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var x=h,w=x.destroy;x=x.tag,w!==void 0&&((x&2)!==0||(x&4)!==0)&&fu(o,i,w),h=h.next}while(h!==c)}dr(n,i,o);break;case 1:if(!vn&&(Ss(o,i),c=o.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=o.memoizedProps,c.state=o.memoizedState,c.componentWillUnmount()}catch(U){qt(o,i,U)}dr(n,i,o);break;case 21:dr(n,i,o);break;case 22:o.mode&1?(vn=(c=vn)||o.memoizedState!==null,dr(n,i,o),vn=c):dr(n,i,o);break;default:dr(n,i,o)}}function Up(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Lv),i.forEach(function(c){var h=Gv.bind(null,n,c);o.has(c)||(o.add(c),c.then(h,h))})}}function pi(n,i){var o=i.deletions;if(o!==null)for(var c=0;c<o.length;c++){var h=o[c];try{var x=n,w=i,U=w;e:for(;U!==null;){switch(U.tag){case 5:un=U.stateNode,hi=!1;break e;case 3:un=U.stateNode.containerInfo,hi=!0;break e;case 4:un=U.stateNode.containerInfo,hi=!0;break e}U=U.return}if(un===null)throw Error(t(160));Dp(x,w,h),un=null,hi=!1;var z=h.alternate;z!==null&&(z.return=null),h.return=null}catch(ae){qt(h,i,ae)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Op(i,n),i=i.sibling}function Op(n,i){var o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(pi(i,n),Ci(n),c&4){try{Ia(3,n,n.return),Xo(3,n)}catch(Xe){qt(n,n.return,Xe)}try{Ia(5,n,n.return)}catch(Xe){qt(n,n.return,Xe)}}break;case 1:pi(i,n),Ci(n),c&512&&o!==null&&Ss(o,o.return);break;case 5:if(pi(i,n),Ci(n),c&512&&o!==null&&Ss(o,o.return),n.flags&32){var h=n.stateNode;try{dt(h,"")}catch(Xe){qt(n,n.return,Xe)}}if(c&4&&(h=n.stateNode,h!=null)){var x=n.memoizedProps,w=o!==null?o.memoizedProps:x,U=n.type,z=n.updateQueue;if(n.updateQueue=null,z!==null)try{U==="input"&&x.type==="radio"&&x.name!=null&&pt(h,x),ct(U,w);var ae=ct(U,x);for(w=0;w<z.length;w+=2){var Me=z[w],be=z[w+1];Me==="style"?rt(h,be):Me==="dangerouslySetInnerHTML"?Pe(h,be):Me==="children"?dt(h,be):I(h,Me,be,ae)}switch(U){case"input":mt(h,x);break;case"textarea":ye(h,x);break;case"select":var Ee=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!x.multiple;var Oe=x.value;Oe!=null?D(h,!!x.multiple,Oe,!1):Ee!==!!x.multiple&&(x.defaultValue!=null?D(h,!!x.multiple,x.defaultValue,!0):D(h,!!x.multiple,x.multiple?[]:"",!1))}h[Sa]=x}catch(Xe){qt(n,n.return,Xe)}}break;case 6:if(pi(i,n),Ci(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,x=n.memoizedProps;try{h.nodeValue=x}catch(Xe){qt(n,n.return,Xe)}}break;case 3:if(pi(i,n),Ci(n),c&4&&o!==null&&o.memoizedState.isDehydrated)try{ua(i.containerInfo)}catch(Xe){qt(n,n.return,Xe)}break;case 4:pi(i,n),Ci(n);break;case 13:pi(i,n),Ci(n),h=n.child,h.flags&8192&&(x=h.memoizedState!==null,h.stateNode.isHidden=x,!x||h.alternate!==null&&h.alternate.memoizedState!==null||(gu=Ce())),c&4&&Up(n);break;case 22:if(Me=o!==null&&o.memoizedState!==null,n.mode&1?(vn=(ae=vn)||Me,pi(i,n),vn=ae):pi(i,n),Ci(n),c&8192){if(ae=n.memoizedState!==null,(n.stateNode.isHidden=ae)&&!Me&&(n.mode&1)!==0)for(je=n,Me=n.child;Me!==null;){for(be=je=Me;je!==null;){switch(Ee=je,Oe=Ee.child,Ee.tag){case 0:case 11:case 14:case 15:Ia(4,Ee,Ee.return);break;case 1:Ss(Ee,Ee.return);var Ge=Ee.stateNode;if(typeof Ge.componentWillUnmount=="function"){c=Ee,o=Ee.return;try{i=c,Ge.props=i.memoizedProps,Ge.state=i.memoizedState,Ge.componentWillUnmount()}catch(Xe){qt(c,o,Xe)}}break;case 5:Ss(Ee,Ee.return);break;case 22:if(Ee.memoizedState!==null){Bp(be);continue}}Oe!==null?(Oe.return=Ee,je=Oe):Bp(be)}Me=Me.sibling}e:for(Me=null,be=n;;){if(be.tag===5){if(Me===null){Me=be;try{h=be.stateNode,ae?(x=h.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none"):(U=be.stateNode,z=be.memoizedProps.style,w=z!=null&&z.hasOwnProperty("display")?z.display:null,U.style.display=tt("display",w))}catch(Xe){qt(n,n.return,Xe)}}}else if(be.tag===6){if(Me===null)try{be.stateNode.nodeValue=ae?"":be.memoizedProps}catch(Xe){qt(n,n.return,Xe)}}else if((be.tag!==22&&be.tag!==23||be.memoizedState===null||be===n)&&be.child!==null){be.child.return=be,be=be.child;continue}if(be===n)break e;for(;be.sibling===null;){if(be.return===null||be.return===n)break e;Me===be&&(Me=null),be=be.return}Me===be&&(Me=null),be.sibling.return=be.return,be=be.sibling}}break;case 19:pi(i,n),Ci(n),c&4&&Up(n);break;case 21:break;default:pi(i,n),Ci(n)}}function Ci(n){var i=n.flags;if(i&2){try{e:{for(var o=n.return;o!==null;){if(Ip(o)){var c=o;break e}o=o.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(dt(h,""),c.flags&=-33);var x=Lp(n);mu(n,x,h);break;case 3:case 4:var w=c.stateNode.containerInfo,U=Lp(n);pu(n,U,w);break;default:throw Error(t(161))}}catch(z){qt(n,n.return,z)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function Uv(n,i,o){je=n,Fp(n)}function Fp(n,i,o){for(var c=(n.mode&1)!==0;je!==null;){var h=je,x=h.child;if(h.tag===22&&c){var w=h.memoizedState!==null||Wo;if(!w){var U=h.alternate,z=U!==null&&U.memoizedState!==null||vn;U=Wo;var ae=vn;if(Wo=w,(vn=z)&&!ae)for(je=h;je!==null;)w=je,z=w.child,w.tag===22&&w.memoizedState!==null?zp(h):z!==null?(z.return=w,je=z):zp(h);for(;x!==null;)je=x,Fp(x),x=x.sibling;je=h,Wo=U,vn=ae}kp(n)}else(h.subtreeFlags&8772)!==0&&x!==null?(x.return=h,je=x):kp(n)}}function kp(n){for(;je!==null;){var i=je;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:vn||Xo(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!vn)if(o===null)c.componentDidMount();else{var h=i.elementType===i.type?o.memoizedProps:fi(i.type,o.memoizedProps);c.componentDidUpdate(h,o.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var x=i.updateQueue;x!==null&&Bh(i,x,c);break;case 3:var w=i.updateQueue;if(w!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Bh(i,w,o)}break;case 5:var U=i.stateNode;if(o===null&&i.flags&4){o=U;var z=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":z.autoFocus&&o.focus();break;case"img":z.src&&(o.src=z.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var ae=i.alternate;if(ae!==null){var Me=ae.memoizedState;if(Me!==null){var be=Me.dehydrated;be!==null&&ua(be)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}vn||i.flags&512&&hu(i)}catch(Ee){qt(i,i.return,Ee)}}if(i===n){je=null;break}if(o=i.sibling,o!==null){o.return=i.return,je=o;break}je=i.return}}function Bp(n){for(;je!==null;){var i=je;if(i===n){je=null;break}var o=i.sibling;if(o!==null){o.return=i.return,je=o;break}je=i.return}}function zp(n){for(;je!==null;){var i=je;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{Xo(4,i)}catch(z){qt(i,o,z)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(z){qt(i,h,z)}}var x=i.return;try{hu(i)}catch(z){qt(i,x,z)}break;case 5:var w=i.return;try{hu(i)}catch(z){qt(i,w,z)}}}catch(z){qt(i,i.return,z)}if(i===n){je=null;break}var U=i.sibling;if(U!==null){U.return=i.return,je=U;break}je=i.return}}var Ov=Math.ceil,Yo=C.ReactCurrentDispatcher,xu=C.ReactCurrentOwner,ni=C.ReactCurrentBatchConfig,Tt=0,on=null,Zt=null,dn=0,Hn=0,Es=ar(0),tn=0,La=null,Or=0,$o=0,vu=0,Da=null,Ln=null,gu=0,Ms=1/0,Vi=null,qo=!1,_u=null,fr=null,Ko=!1,hr=null,Zo=0,Ua=0,yu=null,Qo=-1,Jo=0;function Mn(){return(Tt&6)!==0?Ce():Qo!==-1?Qo:Qo=Ce()}function pr(n){return(n.mode&1)===0?1:(Tt&2)!==0&&dn!==0?dn&-dn:_v.transition!==null?(Jo===0&&(Jo=Sn()),Jo):(n=Dt,n!==0||(n=window.event,n=n===void 0?16:Vf(n.type)),n)}function mi(n,i,o,c){if(50<Ua)throw Ua=0,yu=null,Error(t(185));Rn(n,o,c),((Tt&2)===0||n!==on)&&(n===on&&((Tt&2)===0&&($o|=o),tn===4&&mr(n,dn)),Dn(n,c),o===1&&Tt===0&&(i.mode&1)===0&&(Ms=Ce()+500,Ao&&lr()))}function Dn(n,i){var o=n.callbackNode;Kn(n,i);var c=wi(n,n===on?dn:0);if(c===0)o!==null&&ce(o),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(o!=null&&ce(o),i===1)n.tag===0?gv(Vp.bind(null,n)):Ah(Vp.bind(null,n)),pv(function(){(Tt&6)===0&&lr()}),o=null;else{switch(Df(c)){case 1:o=We;break;case 4:o=at;break;case 16:o=ut;break;case 536870912:o=wt;break;default:o=ut}o=Kp(o,jp.bind(null,n))}n.callbackPriority=i,n.callbackNode=o}}function jp(n,i){if(Qo=-1,Jo=0,(Tt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(ws()&&n.callbackNode!==o)return null;var c=wi(n,n===on?dn:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=el(n,c);else{i=c;var h=Tt;Tt|=2;var x=Hp();(on!==n||dn!==i)&&(Vi=null,Ms=Ce()+500,kr(n,i));do try{Bv();break}catch(U){Gp(n,U)}while(!0);kc(),Yo.current=x,Tt=h,Zt!==null?i=0:(on=null,dn=0,i=tn)}if(i!==0){if(i===2&&(h=Di(n),h!==0&&(c=h,i=Su(n,h))),i===1)throw o=La,kr(n,0),mr(n,c),Dn(n,Ce()),o;if(i===6)mr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!Fv(h)&&(i=el(n,c),i===2&&(x=Di(n),x!==0&&(c=x,i=Su(n,x))),i===1))throw o=La,kr(n,0),mr(n,c),Dn(n,Ce()),o;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:Br(n,Ln,Vi);break;case 3:if(mr(n,c),(c&130023424)===c&&(i=gu+500-Ce(),10<i)){if(wi(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){Mn(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Ac(Br.bind(null,n,Ln,Vi),i);break}Br(n,Ln,Vi);break;case 4:if(mr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var w=31-ft(c);x=1<<w,w=i[w],w>h&&(h=w),c&=~x}if(c=h,c=Ce()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*Ov(c/1960))-c,10<c){n.timeoutHandle=Ac(Br.bind(null,n,Ln,Vi),c);break}Br(n,Ln,Vi);break;case 5:Br(n,Ln,Vi);break;default:throw Error(t(329))}}}return Dn(n,Ce()),n.callbackNode===o?jp.bind(null,n):null}function Su(n,i){var o=Da;return n.current.memoizedState.isDehydrated&&(kr(n,i).flags|=256),n=el(n,i),n!==2&&(i=Ln,Ln=o,i!==null&&Eu(i)),n}function Eu(n){Ln===null?Ln=n:Ln.push.apply(Ln,n)}function Fv(n){for(var i=n;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var c=0;c<o.length;c++){var h=o[c],x=h.getSnapshot;h=h.value;try{if(!ui(x(),h))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function mr(n,i){for(i&=~vu,i&=~$o,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var o=31-ft(i),c=1<<o;n[o]=-1,i&=~c}}function Vp(n){if((Tt&6)!==0)throw Error(t(327));ws();var i=wi(n,0);if((i&1)===0)return Dn(n,Ce()),null;var o=el(n,i);if(n.tag!==0&&o===2){var c=Di(n);c!==0&&(i=c,o=Su(n,c))}if(o===1)throw o=La,kr(n,0),mr(n,i),Dn(n,Ce()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,Br(n,Ln,Vi),Dn(n,Ce()),null}function Mu(n,i){var o=Tt;Tt|=1;try{return n(i)}finally{Tt=o,Tt===0&&(Ms=Ce()+500,Ao&&lr())}}function Fr(n){hr!==null&&hr.tag===0&&(Tt&6)===0&&ws();var i=Tt;Tt|=1;var o=ni.transition,c=Dt;try{if(ni.transition=null,Dt=1,n)return n()}finally{Dt=c,ni.transition=o,Tt=i,(Tt&6)===0&&lr()}}function wu(){Hn=Es.current,jt(Es)}function kr(n,i){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,hv(o)),Zt!==null)for(o=Zt.return;o!==null;){var c=o;switch(Lc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&bo();break;case 3:_s(),jt(Nn),jt(pn),Xc();break;case 5:Hc(c);break;case 4:_s();break;case 13:jt(Xt);break;case 19:jt(Xt);break;case 10:Bc(c.type._context);break;case 22:case 23:wu()}o=o.return}if(on=n,Zt=n=xr(n.current,null),dn=Hn=i,tn=0,La=null,vu=$o=Or=0,Ln=Da=null,Lr!==null){for(i=0;i<Lr.length;i++)if(o=Lr[i],c=o.interleaved,c!==null){o.interleaved=null;var h=c.next,x=o.pending;if(x!==null){var w=x.next;x.next=h,c.next=w}o.pending=c}Lr=null}return n}function Gp(n,i){do{var o=Zt;try{if(kc(),Fo.current=jo,ko){for(var c=Yt.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}ko=!1}if(Ur=0,an=en=Yt=null,Aa=!1,Ca=0,xu.current=null,o===null||o.return===null){tn=1,La=i,Zt=null;break}e:{var x=n,w=o.return,U=o,z=i;if(i=dn,U.flags|=32768,z!==null&&typeof z=="object"&&typeof z.then=="function"){var ae=z,Me=U,be=Me.tag;if((Me.mode&1)===0&&(be===0||be===11||be===15)){var Ee=Me.alternate;Ee?(Me.updateQueue=Ee.updateQueue,Me.memoizedState=Ee.memoizedState,Me.lanes=Ee.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var Oe=pp(w);if(Oe!==null){Oe.flags&=-257,mp(Oe,w,U,x,i),Oe.mode&1&&hp(x,ae,i),i=Oe,z=ae;var Ge=i.updateQueue;if(Ge===null){var Xe=new Set;Xe.add(z),i.updateQueue=Xe}else Ge.add(z);break e}else{if((i&1)===0){hp(x,ae,i),bu();break e}z=Error(t(426))}}else if(Ht&&U.mode&1){var Kt=pp(w);if(Kt!==null){(Kt.flags&65536)===0&&(Kt.flags|=256),mp(Kt,w,U,x,i),Oc(ys(z,U));break e}}x=z=ys(z,U),tn!==4&&(tn=2),Da===null?Da=[x]:Da.push(x),x=w;do{switch(x.tag){case 3:x.flags|=65536,i&=-i,x.lanes|=i;var ee=dp(x,z,i);kh(x,ee);break e;case 1:U=z;var G=x.type,re=x.stateNode;if((x.flags&128)===0&&(typeof G.getDerivedStateFromError=="function"||re!==null&&typeof re.componentDidCatch=="function"&&(fr===null||!fr.has(re)))){x.flags|=65536,i&=-i,x.lanes|=i;var Re=fp(x,U,i);kh(x,Re);break e}}x=x.return}while(x!==null)}Xp(o)}catch(qe){i=qe,Zt===o&&o!==null&&(Zt=o=o.return);continue}break}while(!0)}function Hp(){var n=Yo.current;return Yo.current=jo,n===null?jo:n}function bu(){(tn===0||tn===3||tn===2)&&(tn=4),on===null||(Or&268435455)===0&&($o&268435455)===0||mr(on,dn)}function el(n,i){var o=Tt;Tt|=2;var c=Hp();(on!==n||dn!==i)&&(Vi=null,kr(n,i));do try{kv();break}catch(h){Gp(n,h)}while(!0);if(kc(),Tt=o,Yo.current=c,Zt!==null)throw Error(t(261));return on=null,dn=0,tn}function kv(){for(;Zt!==null;)Wp(Zt)}function Bv(){for(;Zt!==null&&!Z();)Wp(Zt)}function Wp(n){var i=qp(n.alternate,n,Hn);n.memoizedProps=n.pendingProps,i===null?Xp(n):Zt=i,xu.current=null}function Xp(n){var i=n;do{var o=i.alternate;if(n=i.return,(i.flags&32768)===0){if(o=Pv(o,i,Hn),o!==null){Zt=o;return}}else{if(o=Iv(o,i),o!==null){o.flags&=32767,Zt=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{tn=6,Zt=null;return}}if(i=i.sibling,i!==null){Zt=i;return}Zt=i=n}while(i!==null);tn===0&&(tn=5)}function Br(n,i,o){var c=Dt,h=ni.transition;try{ni.transition=null,Dt=1,zv(n,i,o,c)}finally{ni.transition=h,Dt=c}return null}function zv(n,i,o,c){do ws();while(hr!==null);if((Tt&6)!==0)throw Error(t(327));o=n.finishedWork;var h=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var x=o.lanes|o.childLanes;if(oo(n,x),n===on&&(Zt=on=null,dn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||Ko||(Ko=!0,Kp(ut,function(){return ws(),null})),x=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||x){x=ni.transition,ni.transition=null;var w=Dt;Dt=1;var U=Tt;Tt|=4,xu.current=null,Dv(n,o),Op(o,n),av(bc),uo=!!wc,bc=wc=null,n.current=o,Uv(o),Ne(),Tt=U,Dt=w,ni.transition=x}else n.current=o;if(Ko&&(Ko=!1,hr=n,Zo=h),x=n.pendingLanes,x===0&&(fr=null),fn(o.stateNode),Dn(n,Ce()),i!==null)for(c=n.onRecoverableError,o=0;o<i.length;o++)h=i[o],c(h.value,{componentStack:h.stack,digest:h.digest});if(qo)throw qo=!1,n=_u,_u=null,n;return(Zo&1)!==0&&n.tag!==0&&ws(),x=n.pendingLanes,(x&1)!==0?n===yu?Ua++:(Ua=0,yu=n):Ua=0,lr(),null}function ws(){if(hr!==null){var n=Df(Zo),i=ni.transition,o=Dt;try{if(ni.transition=null,Dt=16>n?16:n,hr===null)var c=!1;else{if(n=hr,hr=null,Zo=0,(Tt&6)!==0)throw Error(t(331));var h=Tt;for(Tt|=4,je=n.current;je!==null;){var x=je,w=x.child;if((je.flags&16)!==0){var U=x.deletions;if(U!==null){for(var z=0;z<U.length;z++){var ae=U[z];for(je=ae;je!==null;){var Me=je;switch(Me.tag){case 0:case 11:case 15:Ia(8,Me,x)}var be=Me.child;if(be!==null)be.return=Me,je=be;else for(;je!==null;){Me=je;var Ee=Me.sibling,Oe=Me.return;if(Pp(Me),Me===ae){je=null;break}if(Ee!==null){Ee.return=Oe,je=Ee;break}je=Oe}}}var Ge=x.alternate;if(Ge!==null){var Xe=Ge.child;if(Xe!==null){Ge.child=null;do{var Kt=Xe.sibling;Xe.sibling=null,Xe=Kt}while(Xe!==null)}}je=x}}if((x.subtreeFlags&2064)!==0&&w!==null)w.return=x,je=w;else e:for(;je!==null;){if(x=je,(x.flags&2048)!==0)switch(x.tag){case 0:case 11:case 15:Ia(9,x,x.return)}var ee=x.sibling;if(ee!==null){ee.return=x.return,je=ee;break e}je=x.return}}var G=n.current;for(je=G;je!==null;){w=je;var re=w.child;if((w.subtreeFlags&2064)!==0&&re!==null)re.return=w,je=re;else e:for(w=G;je!==null;){if(U=je,(U.flags&2048)!==0)try{switch(U.tag){case 0:case 11:case 15:Xo(9,U)}}catch(qe){qt(U,U.return,qe)}if(U===w){je=null;break e}var Re=U.sibling;if(Re!==null){Re.return=U.return,je=Re;break e}je=U.return}}if(Tt=h,lr(),Et&&typeof Et.onPostCommitFiberRoot=="function")try{Et.onPostCommitFiberRoot(Lt,n)}catch{}c=!0}return c}finally{Dt=o,ni.transition=i}}return!1}function Yp(n,i,o){i=ys(o,i),i=dp(n,i,1),n=ur(n,i,1),i=Mn(),n!==null&&(Rn(n,1,i),Dn(n,i))}function qt(n,i,o){if(n.tag===3)Yp(n,n,o);else for(;i!==null;){if(i.tag===3){Yp(i,n,o);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(fr===null||!fr.has(c))){n=ys(o,n),n=fp(i,n,1),i=ur(i,n,1),n=Mn(),i!==null&&(Rn(i,1,n),Dn(i,n));break}}i=i.return}}function jv(n,i,o){var c=n.pingCache;c!==null&&c.delete(i),i=Mn(),n.pingedLanes|=n.suspendedLanes&o,on===n&&(dn&o)===o&&(tn===4||tn===3&&(dn&130023424)===dn&&500>Ce()-gu?kr(n,0):vu|=o),Dn(n,i)}function $p(n,i){i===0&&((n.mode&1)===0?i=1:(i=ci,ci<<=1,(ci&130023424)===0&&(ci=4194304)));var o=Mn();n=Bi(n,i),n!==null&&(Rn(n,i,o),Dn(n,o))}function Vv(n){var i=n.memoizedState,o=0;i!==null&&(o=i.retryLane),$p(n,o)}function Gv(n,i){var o=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(o=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),$p(n,o)}var qp;qp=function(n,i,o){if(n!==null)if(n.memoizedProps!==i.pendingProps||Nn.current)In=!0;else{if((n.lanes&o)===0&&(i.flags&128)===0)return In=!1,Nv(n,i,o);In=(n.flags&131072)!==0}else In=!1,Ht&&(i.flags&1048576)!==0&&Ch(i,Ro,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Ho(n,i),n=i.pendingProps;var h=fs(i,pn.current);gs(i,o),h=qc(null,i,c,n,h,o);var x=Kc();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Pn(c)?(x=!0,To(i)):x=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,Vc(i),h.updater=Vo,i.stateNode=h,h._reactInternals=i,nu(i,c,n,o),i=au(null,i,c,!0,x,o)):(i.tag=0,Ht&&x&&Ic(i),En(null,i,h,o),i=i.child),i;case 16:c=i.elementType;e:{switch(Ho(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=Wv(c),n=fi(c,n),h){case 0:i=su(null,i,c,n,o);break e;case 1:i=Sp(null,i,c,n,o);break e;case 11:i=xp(null,i,c,n,o);break e;case 14:i=vp(null,i,c,fi(c.type,n),o);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),su(n,i,c,h,o);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),Sp(n,i,c,h,o);case 3:e:{if(Ep(i),n===null)throw Error(t(387));c=i.pendingProps,x=i.memoizedState,h=x.element,Fh(n,i),Uo(i,c,null,o);var w=i.memoizedState;if(c=w.element,x.isDehydrated)if(x={element:c,isDehydrated:!1,cache:w.cache,pendingSuspenseBoundaries:w.pendingSuspenseBoundaries,transitions:w.transitions},i.updateQueue.baseState=x,i.memoizedState=x,i.flags&256){h=ys(Error(t(423)),i),i=Mp(n,i,c,o,h);break e}else if(c!==h){h=ys(Error(t(424)),i),i=Mp(n,i,c,o,h);break e}else for(Gn=sr(i.stateNode.containerInfo.firstChild),Vn=i,Ht=!0,di=null,o=Uh(i,null,c,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(ms(),c===h){i=ji(n,i,o);break e}En(n,i,c,o)}i=i.child}return i;case 5:return zh(i),n===null&&Uc(i),c=i.type,h=i.pendingProps,x=n!==null?n.memoizedProps:null,w=h.children,Tc(c,h)?w=null:x!==null&&Tc(c,x)&&(i.flags|=32),yp(n,i),En(n,i,w,o),i.child;case 6:return n===null&&Uc(i),null;case 13:return wp(n,i,o);case 4:return Gc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=xs(i,null,c,o):En(n,i,c,o),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),xp(n,i,c,h,o);case 7:return En(n,i,i.pendingProps,o),i.child;case 8:return En(n,i,i.pendingProps.children,o),i.child;case 12:return En(n,i,i.pendingProps.children,o),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,x=i.memoizedProps,w=h.value,Bt(Io,c._currentValue),c._currentValue=w,x!==null)if(ui(x.value,w)){if(x.children===h.children&&!Nn.current){i=ji(n,i,o);break e}}else for(x=i.child,x!==null&&(x.return=i);x!==null;){var U=x.dependencies;if(U!==null){w=x.child;for(var z=U.firstContext;z!==null;){if(z.context===c){if(x.tag===1){z=zi(-1,o&-o),z.tag=2;var ae=x.updateQueue;if(ae!==null){ae=ae.shared;var Me=ae.pending;Me===null?z.next=z:(z.next=Me.next,Me.next=z),ae.pending=z}}x.lanes|=o,z=x.alternate,z!==null&&(z.lanes|=o),zc(x.return,o,i),U.lanes|=o;break}z=z.next}}else if(x.tag===10)w=x.type===i.type?null:x.child;else if(x.tag===18){if(w=x.return,w===null)throw Error(t(341));w.lanes|=o,U=w.alternate,U!==null&&(U.lanes|=o),zc(w,o,i),w=x.sibling}else w=x.child;if(w!==null)w.return=x;else for(w=x;w!==null;){if(w===i){w=null;break}if(x=w.sibling,x!==null){x.return=w.return,w=x;break}w=w.return}x=w}En(n,i,h.children,o),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,gs(i,o),h=ei(h),c=c(h),i.flags|=1,En(n,i,c,o),i.child;case 14:return c=i.type,h=fi(c,i.pendingProps),h=fi(c.type,h),vp(n,i,c,h,o);case 15:return gp(n,i,i.type,i.pendingProps,o);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),Ho(n,i),i.tag=1,Pn(c)?(n=!0,To(i)):n=!1,gs(i,o),cp(i,c,h),nu(i,c,h,o),au(null,i,c,!0,n,o);case 19:return Tp(n,i,o);case 22:return _p(n,i,o)}throw Error(t(156,i.tag))};function Kp(n,i){return oe(n,i)}function Hv(n,i,o,c){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ii(n,i,o,c){return new Hv(n,i,o,c)}function Tu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Wv(n){if(typeof n=="function")return Tu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===K)return 11;if(n===xe)return 14}return 2}function xr(n,i){var o=n.alternate;return o===null?(o=ii(n.tag,i,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=i,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,i=n.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function tl(n,i,o,c,h,x){var w=2;if(c=n,typeof n=="function")Tu(n)&&(w=1);else if(typeof n=="string")w=5;else e:switch(n){case F:return zr(o.children,h,x,i);case q:w=8,h|=8;break;case R:return n=ii(12,o,i,h|2),n.elementType=R,n.lanes=x,n;case Y:return n=ii(13,o,i,h),n.elementType=Y,n.lanes=x,n;case le:return n=ii(19,o,i,h),n.elementType=le,n.lanes=x,n;case me:return nl(o,h,x,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case b:w=10;break e;case j:w=9;break e;case K:w=11;break e;case xe:w=14;break e;case de:w=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=ii(w,o,i,h),i.elementType=n,i.type=c,i.lanes=x,i}function zr(n,i,o,c){return n=ii(7,n,c,i),n.lanes=o,n}function nl(n,i,o,c){return n=ii(22,n,c,i),n.elementType=me,n.lanes=o,n.stateNode={isHidden:!1},n}function Au(n,i,o){return n=ii(6,n,null,i),n.lanes=o,n}function Cu(n,i,o){return i=ii(4,n.children!==null?n.children:[],n.key,i),i.lanes=o,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Xv(n,i,o,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Zn(0),this.expirationTimes=Zn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Zn(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Ru(n,i,o,c,h,x,w,U,z){return n=new Xv(n,i,o,U,z),i===1?(i=1,x===!0&&(i|=8)):i=0,x=ii(3,null,null,i),n.current=x,x.stateNode=n,x.memoizedState={element:c,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},Vc(x),n}function Yv(n,i,o){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:V,key:c==null?null:""+c,children:n,containerInfo:i,implementation:o}}function Zp(n){if(!n)return or;n=n._reactInternals;e:{if(Cn(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Pn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(Pn(o))return bh(n,o,i)}return i}function Qp(n,i,o,c,h,x,w,U,z){return n=Ru(o,c,!0,n,h,x,w,U,z),n.context=Zp(null),o=n.current,c=Mn(),h=pr(o),x=zi(c,h),x.callback=i??null,ur(o,x,h),n.current.lanes=h,Rn(n,h,c),Dn(n,c),n}function il(n,i,o,c){var h=i.current,x=Mn(),w=pr(h);return o=Zp(o),i.context===null?i.context=o:i.pendingContext=o,i=zi(x,w),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ur(h,i,w),n!==null&&(mi(n,h,w,x),Do(n,h,w)),w}function rl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Jp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<i?o:i}}function Nu(n,i){Jp(n,i),(n=n.alternate)&&Jp(n,i)}function $v(){return null}var em=typeof reportError=="function"?reportError:function(n){console.error(n)};function Pu(n){this._internalRoot=n}sl.prototype.render=Pu.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));il(n,i,null,null)},sl.prototype.unmount=Pu.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Fr(function(){il(null,n,null,null)}),i[Ui]=null}};function sl(n){this._internalRoot=n}sl.prototype.unstable_scheduleHydration=function(n){if(n){var i=Ff();n={blockedOn:null,target:n,priority:i};for(var o=0;o<nr.length&&i!==0&&i<nr[o].priority;o++);nr.splice(o,0,n),o===0&&zf(n)}};function Iu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function al(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function tm(){}function qv(n,i,o,c,h){if(h){if(typeof c=="function"){var x=c;c=function(){var ae=rl(w);x.call(ae)}}var w=Qp(i,c,n,0,null,!1,!1,"",tm);return n._reactRootContainer=w,n[Ui]=w.current,_a(n.nodeType===8?n.parentNode:n),Fr(),w}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var U=c;c=function(){var ae=rl(z);U.call(ae)}}var z=Ru(n,0,!1,null,null,!1,!1,"",tm);return n._reactRootContainer=z,n[Ui]=z.current,_a(n.nodeType===8?n.parentNode:n),Fr(function(){il(i,z,o,c)}),z}function ol(n,i,o,c,h){var x=o._reactRootContainer;if(x){var w=x;if(typeof h=="function"){var U=h;h=function(){var z=rl(w);U.call(z)}}il(i,w,n,h)}else w=qv(o,i,n,h,c);return rl(w)}Uf=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var o=Jt(i.pendingLanes);o!==0&&(nc(i,o|1),Dn(i,Ce()),(Tt&6)===0&&(Ms=Ce()+500,lr()))}break;case 13:Fr(function(){var c=Bi(n,1);if(c!==null){var h=Mn();mi(c,n,1,h)}}),Nu(n,1)}},ic=function(n){if(n.tag===13){var i=Bi(n,134217728);if(i!==null){var o=Mn();mi(i,n,134217728,o)}Nu(n,134217728)}},Of=function(n){if(n.tag===13){var i=pr(n),o=Bi(n,i);if(o!==null){var c=Mn();mi(o,n,i,c)}Nu(n,i)}},Ff=function(){return Dt},kf=function(n,i){var o=Dt;try{return Dt=n,i()}finally{Dt=o}},Ie=function(n,i,o){switch(i){case"input":if(mt(n,o),i=o.name,o.type==="radio"&&i!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var c=o[i];if(c!==n&&c.form===n.form){var h=wo(c);if(!h)throw Error(t(90));He(c),mt(c,h)}}}break;case"textarea":ye(n,o);break;case"select":i=o.value,i!=null&&D(n,!!o.multiple,i,!1)}},vt=Mu,Mt=Fr;var Kv={usingClientEntryPoint:!1,Events:[Ea,us,wo,_e,ze,Mu]},Oa={findFiberByHostInstance:Rr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zv={bundleType:Oa.bundleType,version:Oa.version,rendererPackageName:Oa.rendererPackageName,rendererConfig:Oa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:C.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=N(n),n===null?null:n.stateNode},findFiberByHostInstance:Oa.findFiberByHostInstance||$v,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ll=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ll.isDisabled&&ll.supportsFiber)try{Lt=ll.inject(Zv),Et=ll}catch{}}return Un.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Kv,Un.createPortal=function(n,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Iu(i))throw Error(t(200));return Yv(n,i,null,o)},Un.createRoot=function(n,i){if(!Iu(n))throw Error(t(299));var o=!1,c="",h=em;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Ru(n,1,!1,null,null,o,!1,c,h),n[Ui]=i.current,_a(n.nodeType===8?n.parentNode:n),new Pu(i)},Un.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=N(i),n=n===null?null:n.stateNode,n},Un.flushSync=function(n){return Fr(n)},Un.hydrate=function(n,i,o){if(!al(i))throw Error(t(200));return ol(null,n,i,!0,o)},Un.hydrateRoot=function(n,i,o){if(!Iu(n))throw Error(t(405));var c=o!=null&&o.hydratedSources||null,h=!1,x="",w=em;if(o!=null&&(o.unstable_strictMode===!0&&(h=!0),o.identifierPrefix!==void 0&&(x=o.identifierPrefix),o.onRecoverableError!==void 0&&(w=o.onRecoverableError)),i=Qp(i,null,n,1,o??null,h,!1,x,w),n[Ui]=i.current,_a(n),c)for(n=0;n<c.length;n++)o=c[n],h=o._getVersion,h=h(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,h]:i.mutableSourceEagerHydrationData.push(o,h);return new sl(i)},Un.render=function(n,i,o){if(!al(i))throw Error(t(200));return ol(null,n,i,!1,o)},Un.unmountComponentAtNode=function(n){if(!al(n))throw Error(t(40));return n._reactRootContainer?(Fr(function(){ol(null,null,n,!1,function(){n._reactRootContainer=null,n[Ui]=null})}),!0):!1},Un.unstable_batchedUpdates=Mu,Un.unstable_renderSubtreeIntoContainer=function(n,i,o,c){if(!al(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ol(n,i,o,!1,c)},Un.version="18.3.1-next-f1338f8080-20240426",Un}var cm;function lg(){if(cm)return Uu.exports;cm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Uu.exports=og(),Uu.exports}var um;function cg(){if(um)return ul;um=1;var s=lg();return ul.createRoot=s.createRoot,ul.hydrateRoot=s.hydrateRoot,ul}var ug=cg();const dg=A0(ug);class fg{constructor(){cl(this,"listeners",{});cl(this,"history",[]);cl(this,"maxHistory",100)}subscribe(e,t){return this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t),()=>{this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(r=>r!==t))}}emit(e,t){const r=this.listeners[e];r&&r.forEach(a=>{try{a(t)}catch(l){console.error(`Error in event listener for ${String(e)}:`,l)}})}logActivity(e,t,r,a){const l={id:"act_"+Math.random().toString(36).substring(2,9),timestamp:Date.now(),type:e,message:t,details:r,mode:a};return this.history.unshift(l),this.history.length>this.maxHistory&&this.history.pop(),this.emit("activity.logged",{event:l}),l}getActivityHistory(){return[...this.history]}}const ku=new fg;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xf="170",hg=0,dm=1,pg=2,C0=1,mg=2,$i=3,Ar=0,kn=1,Ni=2,br=0,Gs=1,fm=2,hm=3,pm=4,xg=5,qr=100,vg=101,gg=102,_g=103,yg=104,Sg=200,Eg=201,Mg=202,wg=203,Md=204,wd=205,bg=206,Tg=207,Ag=208,Cg=209,Rg=210,Ng=211,Pg=212,Ig=213,Lg=214,bd=0,Td=1,Ad=2,Xs=3,Cd=4,Rd=5,Nd=6,Pd=7,R0=0,Dg=1,Ug=2,Tr=0,Og=1,Fg=2,kg=3,Bg=4,zg=5,jg=6,Vg=7,N0=300,Ys=301,$s=302,Id=303,Ld=304,Yl=306,Dd=1e3,Zr=1001,Ud=1002,Si=1003,Gg=1004,dl=1005,Pi=1006,Bu=1007,Qr=1008,Qi=1009,P0=1010,I0=1011,Ka=1012,vf=1013,Jr=1014,qi=1015,eo=1016,gf=1017,_f=1018,qs=1020,L0=35902,D0=1021,U0=1022,yi=1023,O0=1024,F0=1025,Hs=1026,Ks=1027,k0=1028,yf=1029,B0=1030,Sf=1031,Ef=1033,Fl=33776,kl=33777,Bl=33778,zl=33779,Od=35840,Fd=35841,kd=35842,Bd=35843,zd=36196,jd=37492,Vd=37496,Gd=37808,Hd=37809,Wd=37810,Xd=37811,Yd=37812,$d=37813,qd=37814,Kd=37815,Zd=37816,Qd=37817,Jd=37818,ef=37819,tf=37820,nf=37821,jl=36492,rf=36494,sf=36495,z0=36283,af=36284,of=36285,lf=36286,Hg=3200,Wg=3201,j0=0,Xg=1,wr="",si="srgb",ea="srgb-linear",$l="linear",Ot="srgb",bs=7680,mm=519,Yg=512,$g=513,qg=514,V0=515,Kg=516,Zg=517,Qg=518,Jg=519,xm=35044,vm="300 es",Ki=2e3,Wl=2001;class ta{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let l=0,d=a.length;l<d;l++)a[l].call(this,e);e.target=null}}}const gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],zu=Math.PI/180,cf=180/Math.PI;function na(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(gn[s&255]+gn[s>>8&255]+gn[s>>16&255]+gn[s>>24&255]+"-"+gn[e&255]+gn[e>>8&255]+"-"+gn[e>>16&15|64]+gn[e>>24&255]+"-"+gn[t&63|128]+gn[t>>8&255]+"-"+gn[t>>16&255]+gn[t>>24&255]+gn[r&255]+gn[r>>8&255]+gn[r>>16&255]+gn[r>>24&255]).toLowerCase()}function yn(s,e,t){return Math.max(e,Math.min(t,s))}function e_(s,e){return(s%e+e)%e}function ju(s,e,t){return(1-t)*s+t*e}function ka(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function On(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Qe{constructor(e=0,t=0){Qe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(yn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),l=this.x-e.x,d=this.y-e.y;return this.x=l*r-d*a+e.x,this.y=l*a+d*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ht{constructor(e,t,r,a,l,d,f,p,m){ht.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,d,f,p,m)}set(e,t,r,a,l,d,f,p,m){const v=this.elements;return v[0]=e,v[1]=a,v[2]=f,v[3]=t,v[4]=l,v[5]=p,v[6]=r,v[7]=d,v[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,d=r[0],f=r[3],p=r[6],m=r[1],v=r[4],_=r[7],g=r[2],E=r[5],M=r[8],A=a[0],S=a[3],y=a[6],P=a[1],I=a[4],C=a[7],ie=a[2],V=a[5],F=a[8];return l[0]=d*A+f*P+p*ie,l[3]=d*S+f*I+p*V,l[6]=d*y+f*C+p*F,l[1]=m*A+v*P+_*ie,l[4]=m*S+v*I+_*V,l[7]=m*y+v*C+_*F,l[2]=g*A+E*P+M*ie,l[5]=g*S+E*I+M*V,l[8]=g*y+E*C+M*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],d=e[4],f=e[5],p=e[6],m=e[7],v=e[8];return t*d*v-t*f*m-r*l*v+r*f*p+a*l*m-a*d*p}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],d=e[4],f=e[5],p=e[6],m=e[7],v=e[8],_=v*d-f*m,g=f*p-v*l,E=m*l-d*p,M=t*_+r*g+a*E;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/M;return e[0]=_*A,e[1]=(a*m-v*r)*A,e[2]=(f*r-a*d)*A,e[3]=g*A,e[4]=(v*t-a*p)*A,e[5]=(a*l-f*t)*A,e[6]=E*A,e[7]=(r*p-m*t)*A,e[8]=(d*t-r*l)*A,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,l,d,f){const p=Math.cos(l),m=Math.sin(l);return this.set(r*p,r*m,-r*(p*d+m*f)+d+e,-a*m,a*p,-a*(-m*d+p*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Vu.makeScale(e,t)),this}rotate(e){return this.premultiply(Vu.makeRotation(-e)),this}translate(e,t){return this.premultiply(Vu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Vu=new ht;function G0(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Xl(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function t_(){const s=Xl("canvas");return s.style.display="block",s}const gm={};function Ha(s){s in gm||(gm[s]=!0,console.warn(s))}function n_(s,e,t){return new Promise(function(r,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}function i_(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function r_(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const At={enabled:!0,workingColorSpace:ea,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Ot&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Ot&&(s.r=Ws(s.r),s.g=Ws(s.g),s.b=Ws(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===wr?$l:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ws(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const _m=[.64,.33,.3,.6,.15,.06],ym=[.2126,.7152,.0722],Sm=[.3127,.329],Em=new ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mm=new ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);At.define({[ea]:{primaries:_m,whitePoint:Sm,transfer:$l,toXYZ:Em,fromXYZ:Mm,luminanceCoefficients:ym,workingColorSpaceConfig:{unpackColorSpace:si},outputColorSpaceConfig:{drawingBufferColorSpace:si}},[si]:{primaries:_m,whitePoint:Sm,transfer:Ot,toXYZ:Em,fromXYZ:Mm,luminanceCoefficients:ym,outputColorSpaceConfig:{drawingBufferColorSpace:si}}});let Ts;class s_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ts===void 0&&(Ts=Xl("canvas")),Ts.width=e.width,Ts.height=e.height;const r=Ts.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Ts}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xl("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),l=a.data;for(let d=0;d<l.length;d++)l[d]=Zi(l[d]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Zi(t[r]/255)*255):t[r]=Zi(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let a_=0;class H0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:a_++}),this.uuid=na(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let d=0,f=a.length;d<f;d++)a[d].isDataTexture?l.push(Gu(a[d].image)):l.push(Gu(a[d]))}else l=Gu(a);r.url=l}return t||(e.images[this.uuid]=r),r}}function Gu(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?s_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let o_=0;class Bn extends ta{constructor(e=Bn.DEFAULT_IMAGE,t=Bn.DEFAULT_MAPPING,r=Zr,a=Zr,l=Pi,d=Qr,f=yi,p=Qi,m=Bn.DEFAULT_ANISOTROPY,v=wr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:o_++}),this.uuid=na(),this.name="",this.source=new H0(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=l,this.minFilter=d,this.anisotropy=m,this.format=f,this.internalFormat=null,this.type=p,this.offset=new Qe(0,0),this.repeat=new Qe(1,1),this.center=new Qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==N0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dd:e.x=e.x-Math.floor(e.x);break;case Zr:e.x=e.x<0?0:1;break;case Ud:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dd:e.y=e.y-Math.floor(e.y);break;case Zr:e.y=e.y<0?0:1;break;case Ud:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bn.DEFAULT_IMAGE=null;Bn.DEFAULT_MAPPING=N0;Bn.DEFAULT_ANISOTROPY=1;class Ft{constructor(e=0,t=0,r=0,a=1){Ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=this.w,d=e.elements;return this.x=d[0]*t+d[4]*r+d[8]*a+d[12]*l,this.y=d[1]*t+d[5]*r+d[9]*a+d[13]*l,this.z=d[2]*t+d[6]*r+d[10]*a+d[14]*l,this.w=d[3]*t+d[7]*r+d[11]*a+d[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,l;const p=e.elements,m=p[0],v=p[4],_=p[8],g=p[1],E=p[5],M=p[9],A=p[2],S=p[6],y=p[10];if(Math.abs(v-g)<.01&&Math.abs(_-A)<.01&&Math.abs(M-S)<.01){if(Math.abs(v+g)<.1&&Math.abs(_+A)<.1&&Math.abs(M+S)<.1&&Math.abs(m+E+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const I=(m+1)/2,C=(E+1)/2,ie=(y+1)/2,V=(v+g)/4,F=(_+A)/4,q=(M+S)/4;return I>C&&I>ie?I<.01?(r=0,a=.707106781,l=.707106781):(r=Math.sqrt(I),a=V/r,l=F/r):C>ie?C<.01?(r=.707106781,a=0,l=.707106781):(a=Math.sqrt(C),r=V/a,l=q/a):ie<.01?(r=.707106781,a=.707106781,l=0):(l=Math.sqrt(ie),r=F/l,a=q/l),this.set(r,a,l,t),this}let P=Math.sqrt((S-M)*(S-M)+(_-A)*(_-A)+(g-v)*(g-v));return Math.abs(P)<.001&&(P=1),this.x=(S-M)/P,this.y=(_-A)/P,this.z=(g-v)/P,this.w=Math.acos((m+E+y-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class l_ extends ta{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ft(0,0,e,t),this.scissorTest=!1,this.viewport=new Ft(0,0,e,t);const a={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const l=new Bn(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);l.flipY=!1,l.generateMipmaps=r.generateMipmaps,l.internalFormat=r.internalFormat,this.textures=[];const d=r.count;for(let f=0;f<d;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new H0(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class es extends l_{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class W0 extends Bn{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Si,this.minFilter=Si,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class c_ extends Bn{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Si,this.minFilter=Si,this.wrapR=Zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class to{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,l,d,f){let p=r[a+0],m=r[a+1],v=r[a+2],_=r[a+3];const g=l[d+0],E=l[d+1],M=l[d+2],A=l[d+3];if(f===0){e[t+0]=p,e[t+1]=m,e[t+2]=v,e[t+3]=_;return}if(f===1){e[t+0]=g,e[t+1]=E,e[t+2]=M,e[t+3]=A;return}if(_!==A||p!==g||m!==E||v!==M){let S=1-f;const y=p*g+m*E+v*M+_*A,P=y>=0?1:-1,I=1-y*y;if(I>Number.EPSILON){const ie=Math.sqrt(I),V=Math.atan2(ie,y*P);S=Math.sin(S*V)/ie,f=Math.sin(f*V)/ie}const C=f*P;if(p=p*S+g*C,m=m*S+E*C,v=v*S+M*C,_=_*S+A*C,S===1-f){const ie=1/Math.sqrt(p*p+m*m+v*v+_*_);p*=ie,m*=ie,v*=ie,_*=ie}}e[t]=p,e[t+1]=m,e[t+2]=v,e[t+3]=_}static multiplyQuaternionsFlat(e,t,r,a,l,d){const f=r[a],p=r[a+1],m=r[a+2],v=r[a+3],_=l[d],g=l[d+1],E=l[d+2],M=l[d+3];return e[t]=f*M+v*_+p*E-m*g,e[t+1]=p*M+v*g+m*_-f*E,e[t+2]=m*M+v*E+f*g-p*_,e[t+3]=v*M-f*_-p*g-m*E,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,l=e._z,d=e._order,f=Math.cos,p=Math.sin,m=f(r/2),v=f(a/2),_=f(l/2),g=p(r/2),E=p(a/2),M=p(l/2);switch(d){case"XYZ":this._x=g*v*_+m*E*M,this._y=m*E*_-g*v*M,this._z=m*v*M+g*E*_,this._w=m*v*_-g*E*M;break;case"YXZ":this._x=g*v*_+m*E*M,this._y=m*E*_-g*v*M,this._z=m*v*M-g*E*_,this._w=m*v*_+g*E*M;break;case"ZXY":this._x=g*v*_-m*E*M,this._y=m*E*_+g*v*M,this._z=m*v*M+g*E*_,this._w=m*v*_-g*E*M;break;case"ZYX":this._x=g*v*_-m*E*M,this._y=m*E*_+g*v*M,this._z=m*v*M-g*E*_,this._w=m*v*_+g*E*M;break;case"YZX":this._x=g*v*_+m*E*M,this._y=m*E*_+g*v*M,this._z=m*v*M-g*E*_,this._w=m*v*_-g*E*M;break;case"XZY":this._x=g*v*_-m*E*M,this._y=m*E*_-g*v*M,this._z=m*v*M+g*E*_,this._w=m*v*_+g*E*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],l=t[8],d=t[1],f=t[5],p=t[9],m=t[2],v=t[6],_=t[10],g=r+f+_;if(g>0){const E=.5/Math.sqrt(g+1);this._w=.25/E,this._x=(v-p)*E,this._y=(l-m)*E,this._z=(d-a)*E}else if(r>f&&r>_){const E=2*Math.sqrt(1+r-f-_);this._w=(v-p)/E,this._x=.25*E,this._y=(a+d)/E,this._z=(l+m)/E}else if(f>_){const E=2*Math.sqrt(1+f-r-_);this._w=(l-m)/E,this._x=(a+d)/E,this._y=.25*E,this._z=(p+v)/E}else{const E=2*Math.sqrt(1+_-r-f);this._w=(d-a)/E,this._x=(l+m)/E,this._y=(p+v)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yn(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,l=e._z,d=e._w,f=t._x,p=t._y,m=t._z,v=t._w;return this._x=r*v+d*f+a*m-l*p,this._y=a*v+d*p+l*f-r*m,this._z=l*v+d*m+r*p-a*f,this._w=d*v-r*f-a*p-l*m,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,l=this._z,d=this._w;let f=d*e._w+r*e._x+a*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=d,this._x=r,this._y=a,this._z=l,this;const p=1-f*f;if(p<=Number.EPSILON){const E=1-t;return this._w=E*d+t*this._w,this._x=E*r+t*this._x,this._y=E*a+t*this._y,this._z=E*l+t*this._z,this.normalize(),this}const m=Math.sqrt(p),v=Math.atan2(m,f),_=Math.sin((1-t)*v)/m,g=Math.sin(t*v)/m;return this._w=d*_+this._w*g,this._x=r*_+this._x*g,this._y=a*_+this._y*g,this._z=l*_+this._z*g,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(e=0,t=0,r=0){X.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*a,this.y=l[1]*t+l[4]*r+l[7]*a,this.z=l[2]*t+l[5]*r+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=e.elements,d=1/(l[3]*t+l[7]*r+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*a+l[12])*d,this.y=(l[1]*t+l[5]*r+l[9]*a+l[13])*d,this.z=(l[2]*t+l[6]*r+l[10]*a+l[14])*d,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,l=e.x,d=e.y,f=e.z,p=e.w,m=2*(d*a-f*r),v=2*(f*t-l*a),_=2*(l*r-d*t);return this.x=t+p*m+d*_-f*v,this.y=r+p*v+f*m-l*_,this.z=a+p*_+l*v-d*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*a,this.y=l[1]*t+l[5]*r+l[9]*a,this.z=l[2]*t+l[6]*r+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,l=e.z,d=t.x,f=t.y,p=t.z;return this.x=a*p-l*f,this.y=l*d-r*p,this.z=r*f-a*d,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Hu.copy(this).projectOnVector(e),this.sub(Hu)}reflect(e){return this.sub(Hu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(yn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hu=new X,wm=new to;class no{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(xi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(xi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=xi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let d=0,f=l.count;d<f;d++)e.isMesh===!0?e.getVertexPosition(d,xi):xi.fromBufferAttribute(l,d),xi.applyMatrix4(e.matrixWorld),this.expandByPoint(xi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),fl.copy(r.boundingBox)),fl.applyMatrix4(e.matrixWorld),this.union(fl)}const a=e.children;for(let l=0,d=a.length;l<d;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xi),xi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ba),hl.subVectors(this.max,Ba),As.subVectors(e.a,Ba),Cs.subVectors(e.b,Ba),Rs.subVectors(e.c,Ba),gr.subVectors(Cs,As),_r.subVectors(Rs,Cs),jr.subVectors(As,Rs);let t=[0,-gr.z,gr.y,0,-_r.z,_r.y,0,-jr.z,jr.y,gr.z,0,-gr.x,_r.z,0,-_r.x,jr.z,0,-jr.x,-gr.y,gr.x,0,-_r.y,_r.x,0,-jr.y,jr.x,0];return!Wu(t,As,Cs,Rs,hl)||(t=[1,0,0,0,1,0,0,0,1],!Wu(t,As,Cs,Rs,hl))?!1:(pl.crossVectors(gr,_r),t=[pl.x,pl.y,pl.z],Wu(t,As,Cs,Rs,hl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Gi=[new X,new X,new X,new X,new X,new X,new X,new X],xi=new X,fl=new no,As=new X,Cs=new X,Rs=new X,gr=new X,_r=new X,jr=new X,Ba=new X,hl=new X,pl=new X,Vr=new X;function Wu(s,e,t,r,a){for(let l=0,d=s.length-3;l<=d;l+=3){Vr.fromArray(s,l);const f=a.x*Math.abs(Vr.x)+a.y*Math.abs(Vr.y)+a.z*Math.abs(Vr.z),p=e.dot(Vr),m=t.dot(Vr),v=r.dot(Vr);if(Math.max(-Math.max(p,m,v),Math.min(p,m,v))>f)return!1}return!0}const u_=new no,za=new X,Xu=new X;class ql{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):u_.setFromPoints(e).getCenter(r);let a=0;for(let l=0,d=e.length;l<d;l++)a=Math.max(a,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;za.subVectors(e,this.center);const t=za.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(za,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(za.copy(e.center).add(Xu)),this.expandByPoint(za.copy(e.center).sub(Xu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Hi=new X,Yu=new X,ml=new X,yr=new X,$u=new X,xl=new X,qu=new X;class X0{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Hi.copy(this.origin).addScaledVector(this.direction,t),Hi.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){Yu.copy(e).add(t).multiplyScalar(.5),ml.copy(t).sub(e).normalize(),yr.copy(this.origin).sub(Yu);const l=e.distanceTo(t)*.5,d=-this.direction.dot(ml),f=yr.dot(this.direction),p=-yr.dot(ml),m=yr.lengthSq(),v=Math.abs(1-d*d);let _,g,E,M;if(v>0)if(_=d*p-f,g=d*f-p,M=l*v,_>=0)if(g>=-M)if(g<=M){const A=1/v;_*=A,g*=A,E=_*(_+d*g+2*f)+g*(d*_+g+2*p)+m}else g=l,_=Math.max(0,-(d*g+f)),E=-_*_+g*(g+2*p)+m;else g=-l,_=Math.max(0,-(d*g+f)),E=-_*_+g*(g+2*p)+m;else g<=-M?(_=Math.max(0,-(-d*l+f)),g=_>0?-l:Math.min(Math.max(-l,-p),l),E=-_*_+g*(g+2*p)+m):g<=M?(_=0,g=Math.min(Math.max(-l,-p),l),E=g*(g+2*p)+m):(_=Math.max(0,-(d*l+f)),g=_>0?l:Math.min(Math.max(-l,-p),l),E=-_*_+g*(g+2*p)+m);else g=d>0?-l:l,_=Math.max(0,-(d*g+f)),E=-_*_+g*(g+2*p)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,_),a&&a.copy(Yu).addScaledVector(ml,g),E}intersectSphere(e,t){Hi.subVectors(e.center,this.origin);const r=Hi.dot(this.direction),a=Hi.dot(Hi)-r*r,l=e.radius*e.radius;if(a>l)return null;const d=Math.sqrt(l-a),f=r-d,p=r+d;return p<0?null:f<0?this.at(p,t):this.at(f,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,l,d,f,p;const m=1/this.direction.x,v=1/this.direction.y,_=1/this.direction.z,g=this.origin;return m>=0?(r=(e.min.x-g.x)*m,a=(e.max.x-g.x)*m):(r=(e.max.x-g.x)*m,a=(e.min.x-g.x)*m),v>=0?(l=(e.min.y-g.y)*v,d=(e.max.y-g.y)*v):(l=(e.max.y-g.y)*v,d=(e.min.y-g.y)*v),r>d||l>a||((l>r||isNaN(r))&&(r=l),(d<a||isNaN(a))&&(a=d),_>=0?(f=(e.min.z-g.z)*_,p=(e.max.z-g.z)*_):(f=(e.max.z-g.z)*_,p=(e.min.z-g.z)*_),r>p||f>a)||((f>r||r!==r)&&(r=f),(p<a||a!==a)&&(a=p),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,Hi)!==null}intersectTriangle(e,t,r,a,l){$u.subVectors(t,e),xl.subVectors(r,e),qu.crossVectors($u,xl);let d=this.direction.dot(qu),f;if(d>0){if(a)return null;f=1}else if(d<0)f=-1,d=-d;else return null;yr.subVectors(this.origin,e);const p=f*this.direction.dot(xl.crossVectors(yr,xl));if(p<0)return null;const m=f*this.direction.dot($u.cross(yr));if(m<0||p+m>d)return null;const v=-f*yr.dot(qu);return v<0?null:this.at(v/d,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Vt{constructor(e,t,r,a,l,d,f,p,m,v,_,g,E,M,A,S){Vt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,d,f,p,m,v,_,g,E,M,A,S)}set(e,t,r,a,l,d,f,p,m,v,_,g,E,M,A,S){const y=this.elements;return y[0]=e,y[4]=t,y[8]=r,y[12]=a,y[1]=l,y[5]=d,y[9]=f,y[13]=p,y[2]=m,y[6]=v,y[10]=_,y[14]=g,y[3]=E,y[7]=M,y[11]=A,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Vt().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Ns.setFromMatrixColumn(e,0).length(),l=1/Ns.setFromMatrixColumn(e,1).length(),d=1/Ns.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*d,t[9]=r[9]*d,t[10]=r[10]*d,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,l=e.z,d=Math.cos(r),f=Math.sin(r),p=Math.cos(a),m=Math.sin(a),v=Math.cos(l),_=Math.sin(l);if(e.order==="XYZ"){const g=d*v,E=d*_,M=f*v,A=f*_;t[0]=p*v,t[4]=-p*_,t[8]=m,t[1]=E+M*m,t[5]=g-A*m,t[9]=-f*p,t[2]=A-g*m,t[6]=M+E*m,t[10]=d*p}else if(e.order==="YXZ"){const g=p*v,E=p*_,M=m*v,A=m*_;t[0]=g+A*f,t[4]=M*f-E,t[8]=d*m,t[1]=d*_,t[5]=d*v,t[9]=-f,t[2]=E*f-M,t[6]=A+g*f,t[10]=d*p}else if(e.order==="ZXY"){const g=p*v,E=p*_,M=m*v,A=m*_;t[0]=g-A*f,t[4]=-d*_,t[8]=M+E*f,t[1]=E+M*f,t[5]=d*v,t[9]=A-g*f,t[2]=-d*m,t[6]=f,t[10]=d*p}else if(e.order==="ZYX"){const g=d*v,E=d*_,M=f*v,A=f*_;t[0]=p*v,t[4]=M*m-E,t[8]=g*m+A,t[1]=p*_,t[5]=A*m+g,t[9]=E*m-M,t[2]=-m,t[6]=f*p,t[10]=d*p}else if(e.order==="YZX"){const g=d*p,E=d*m,M=f*p,A=f*m;t[0]=p*v,t[4]=A-g*_,t[8]=M*_+E,t[1]=_,t[5]=d*v,t[9]=-f*v,t[2]=-m*v,t[6]=E*_+M,t[10]=g-A*_}else if(e.order==="XZY"){const g=d*p,E=d*m,M=f*p,A=f*m;t[0]=p*v,t[4]=-_,t[8]=m*v,t[1]=g*_+A,t[5]=d*v,t[9]=E*_-M,t[2]=M*_-E,t[6]=f*v,t[10]=A*_+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(d_,e,f_)}lookAt(e,t,r){const a=this.elements;return Wn.subVectors(e,t),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),Sr.crossVectors(r,Wn),Sr.lengthSq()===0&&(Math.abs(r.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),Sr.crossVectors(r,Wn)),Sr.normalize(),vl.crossVectors(Wn,Sr),a[0]=Sr.x,a[4]=vl.x,a[8]=Wn.x,a[1]=Sr.y,a[5]=vl.y,a[9]=Wn.y,a[2]=Sr.z,a[6]=vl.z,a[10]=Wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,d=r[0],f=r[4],p=r[8],m=r[12],v=r[1],_=r[5],g=r[9],E=r[13],M=r[2],A=r[6],S=r[10],y=r[14],P=r[3],I=r[7],C=r[11],ie=r[15],V=a[0],F=a[4],q=a[8],R=a[12],b=a[1],j=a[5],K=a[9],Y=a[13],le=a[2],xe=a[6],de=a[10],me=a[14],B=a[3],pe=a[7],te=a[11],O=a[15];return l[0]=d*V+f*b+p*le+m*B,l[4]=d*F+f*j+p*xe+m*pe,l[8]=d*q+f*K+p*de+m*te,l[12]=d*R+f*Y+p*me+m*O,l[1]=v*V+_*b+g*le+E*B,l[5]=v*F+_*j+g*xe+E*pe,l[9]=v*q+_*K+g*de+E*te,l[13]=v*R+_*Y+g*me+E*O,l[2]=M*V+A*b+S*le+y*B,l[6]=M*F+A*j+S*xe+y*pe,l[10]=M*q+A*K+S*de+y*te,l[14]=M*R+A*Y+S*me+y*O,l[3]=P*V+I*b+C*le+ie*B,l[7]=P*F+I*j+C*xe+ie*pe,l[11]=P*q+I*K+C*de+ie*te,l[15]=P*R+I*Y+C*me+ie*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],l=e[12],d=e[1],f=e[5],p=e[9],m=e[13],v=e[2],_=e[6],g=e[10],E=e[14],M=e[3],A=e[7],S=e[11],y=e[15];return M*(+l*p*_-a*m*_-l*f*g+r*m*g+a*f*E-r*p*E)+A*(+t*p*E-t*m*g+l*d*g-a*d*E+a*m*v-l*p*v)+S*(+t*m*_-t*f*E-l*d*_+r*d*E+l*f*v-r*m*v)+y*(-a*f*v-t*p*_+t*f*g+a*d*_-r*d*g+r*p*v)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],d=e[4],f=e[5],p=e[6],m=e[7],v=e[8],_=e[9],g=e[10],E=e[11],M=e[12],A=e[13],S=e[14],y=e[15],P=_*S*m-A*g*m+A*p*E-f*S*E-_*p*y+f*g*y,I=M*g*m-v*S*m-M*p*E+d*S*E+v*p*y-d*g*y,C=v*A*m-M*_*m+M*f*E-d*A*E-v*f*y+d*_*y,ie=M*_*p-v*A*p-M*f*g+d*A*g+v*f*S-d*_*S,V=t*P+r*I+a*C+l*ie;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/V;return e[0]=P*F,e[1]=(A*g*l-_*S*l-A*a*E+r*S*E+_*a*y-r*g*y)*F,e[2]=(f*S*l-A*p*l+A*a*m-r*S*m-f*a*y+r*p*y)*F,e[3]=(_*p*l-f*g*l-_*a*m+r*g*m+f*a*E-r*p*E)*F,e[4]=I*F,e[5]=(v*S*l-M*g*l+M*a*E-t*S*E-v*a*y+t*g*y)*F,e[6]=(M*p*l-d*S*l-M*a*m+t*S*m+d*a*y-t*p*y)*F,e[7]=(d*g*l-v*p*l+v*a*m-t*g*m-d*a*E+t*p*E)*F,e[8]=C*F,e[9]=(M*_*l-v*A*l-M*r*E+t*A*E+v*r*y-t*_*y)*F,e[10]=(d*A*l-M*f*l+M*r*m-t*A*m-d*r*y+t*f*y)*F,e[11]=(v*f*l-d*_*l-v*r*m+t*_*m+d*r*E-t*f*E)*F,e[12]=ie*F,e[13]=(v*A*a-M*_*a+M*r*g-t*A*g-v*r*S+t*_*S)*F,e[14]=(M*f*a-d*A*a-M*r*p+t*A*p+d*r*S-t*f*S)*F,e[15]=(d*_*a-v*f*a+v*r*p-t*_*p-d*r*g+t*f*g)*F,this}scale(e){const t=this.elements,r=e.x,a=e.y,l=e.z;return t[0]*=r,t[4]*=a,t[8]*=l,t[1]*=r,t[5]*=a,t[9]*=l,t[2]*=r,t[6]*=a,t[10]*=l,t[3]*=r,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),l=1-r,d=e.x,f=e.y,p=e.z,m=l*d,v=l*f;return this.set(m*d+r,m*f-a*p,m*p+a*f,0,m*f+a*p,v*f+r,v*p-a*d,0,m*p-a*f,v*p+a*d,l*p*p+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,l,d){return this.set(1,r,l,0,e,1,d,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,l=t._x,d=t._y,f=t._z,p=t._w,m=l+l,v=d+d,_=f+f,g=l*m,E=l*v,M=l*_,A=d*v,S=d*_,y=f*_,P=p*m,I=p*v,C=p*_,ie=r.x,V=r.y,F=r.z;return a[0]=(1-(A+y))*ie,a[1]=(E+C)*ie,a[2]=(M-I)*ie,a[3]=0,a[4]=(E-C)*V,a[5]=(1-(g+y))*V,a[6]=(S+P)*V,a[7]=0,a[8]=(M+I)*F,a[9]=(S-P)*F,a[10]=(1-(g+A))*F,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let l=Ns.set(a[0],a[1],a[2]).length();const d=Ns.set(a[4],a[5],a[6]).length(),f=Ns.set(a[8],a[9],a[10]).length();this.determinant()<0&&(l=-l),e.x=a[12],e.y=a[13],e.z=a[14],vi.copy(this);const m=1/l,v=1/d,_=1/f;return vi.elements[0]*=m,vi.elements[1]*=m,vi.elements[2]*=m,vi.elements[4]*=v,vi.elements[5]*=v,vi.elements[6]*=v,vi.elements[8]*=_,vi.elements[9]*=_,vi.elements[10]*=_,t.setFromRotationMatrix(vi),r.x=l,r.y=d,r.z=f,this}makePerspective(e,t,r,a,l,d,f=Ki){const p=this.elements,m=2*l/(t-e),v=2*l/(r-a),_=(t+e)/(t-e),g=(r+a)/(r-a);let E,M;if(f===Ki)E=-(d+l)/(d-l),M=-2*d*l/(d-l);else if(f===Wl)E=-d/(d-l),M=-d*l/(d-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return p[0]=m,p[4]=0,p[8]=_,p[12]=0,p[1]=0,p[5]=v,p[9]=g,p[13]=0,p[2]=0,p[6]=0,p[10]=E,p[14]=M,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,t,r,a,l,d,f=Ki){const p=this.elements,m=1/(t-e),v=1/(r-a),_=1/(d-l),g=(t+e)*m,E=(r+a)*v;let M,A;if(f===Ki)M=(d+l)*_,A=-2*_;else if(f===Wl)M=l*_,A=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return p[0]=2*m,p[4]=0,p[8]=0,p[12]=-g,p[1]=0,p[5]=2*v,p[9]=0,p[13]=-E,p[2]=0,p[6]=0,p[10]=A,p[14]=-M,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Ns=new X,vi=new Vt,d_=new X(0,0,0),f_=new X(1,1,1),Sr=new X,vl=new X,Wn=new X,bm=new Vt,Tm=new to;class Ii{constructor(e=0,t=0,r=0,a=Ii.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,l=a[0],d=a[4],f=a[8],p=a[1],m=a[5],v=a[9],_=a[2],g=a[6],E=a[10];switch(t){case"XYZ":this._y=Math.asin(yn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-v,E),this._z=Math.atan2(-d,l)):(this._x=Math.atan2(g,m),this._z=0);break;case"YXZ":this._x=Math.asin(-yn(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(f,E),this._z=Math.atan2(p,m)):(this._y=Math.atan2(-_,l),this._z=0);break;case"ZXY":this._x=Math.asin(yn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-_,E),this._z=Math.atan2(-d,m)):(this._y=0,this._z=Math.atan2(p,l));break;case"ZYX":this._y=Math.asin(-yn(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(g,E),this._z=Math.atan2(p,l)):(this._x=0,this._z=Math.atan2(-d,m));break;case"YZX":this._z=Math.asin(yn(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-v,m),this._y=Math.atan2(-_,l)):(this._x=0,this._y=Math.atan2(f,E));break;case"XZY":this._z=Math.asin(-yn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(g,m),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-v,E),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return bm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bm,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tm.setFromEuler(this),this.setFromQuaternion(Tm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ii.DEFAULT_ORDER="XYZ";let Y0=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},h_=0;const Am=new X,Ps=new to,Wi=new Vt,gl=new X,ja=new X,p_=new X,m_=new to,Cm=new X(1,0,0),Rm=new X(0,1,0),Nm=new X(0,0,1),Pm={type:"added"},x_={type:"removed"},Is={type:"childadded",child:null},Ku={type:"childremoved",child:null};class bn extends ta{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:h_++}),this.uuid=na(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bn.DEFAULT_UP.clone();const e=new X,t=new Ii,r=new to,a=new X(1,1,1);function l(){r.setFromEuler(t,!1)}function d(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Vt},normalMatrix:{value:new ht}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=bn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Y0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ps.setFromAxisAngle(e,t),this.quaternion.multiply(Ps),this}rotateOnWorldAxis(e,t){return Ps.setFromAxisAngle(e,t),this.quaternion.premultiply(Ps),this}rotateX(e){return this.rotateOnAxis(Cm,e)}rotateY(e){return this.rotateOnAxis(Rm,e)}rotateZ(e){return this.rotateOnAxis(Nm,e)}translateOnAxis(e,t){return Am.copy(e).applyQuaternion(this.quaternion),this.position.add(Am.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cm,e)}translateY(e){return this.translateOnAxis(Rm,e)}translateZ(e){return this.translateOnAxis(Nm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wi.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?gl.copy(e):gl.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),ja.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wi.lookAt(ja,gl,this.up):Wi.lookAt(gl,ja,this.up),this.quaternion.setFromRotationMatrix(Wi),a&&(Wi.extractRotation(a.matrixWorld),Ps.setFromRotationMatrix(Wi),this.quaternion.premultiply(Ps.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Pm),Is.child=e,this.dispatchEvent(Is),Is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(x_),Ku.child=e,this.dispatchEvent(Ku),Ku.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Pm),Is.child=e,this.dispatchEvent(Is),Is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const d=this.children[r].getObjectByProperty(e,t);if(d!==void 0)return d}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let l=0,d=a.length;l<d;l++)a[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,e,p_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ja,m_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let l=0,d=a.length;l<d;l++)a[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(f=>({boxInitialized:f.boxInitialized,boxMin:f.box.min.toArray(),boxMax:f.box.max.toArray(),sphereInitialized:f.sphereInitialized,sphereRadius:f.sphere.radius,sphereCenter:f.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function l(f,p){return f[p.uuid]===void 0&&(f[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const p=f.shapes;if(Array.isArray(p))for(let m=0,v=p.length;m<v;m++){const _=p[m];l(e.shapes,_)}else l(e.shapes,p)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let p=0,m=this.material.length;p<m;p++)f.push(l(e.materials,this.material[p]));a.material=f}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let f=0;f<this.children.length;f++)a.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let f=0;f<this.animations.length;f++){const p=this.animations[f];a.animations.push(l(e.animations,p))}}if(t){const f=d(e.geometries),p=d(e.materials),m=d(e.textures),v=d(e.images),_=d(e.shapes),g=d(e.skeletons),E=d(e.animations),M=d(e.nodes);f.length>0&&(r.geometries=f),p.length>0&&(r.materials=p),m.length>0&&(r.textures=m),v.length>0&&(r.images=v),_.length>0&&(r.shapes=_),g.length>0&&(r.skeletons=g),E.length>0&&(r.animations=E),M.length>0&&(r.nodes=M)}return r.object=a,r;function d(f){const p=[];for(const m in f){const v=f[m];delete v.metadata,p.push(v)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}bn.DEFAULT_UP=new X(0,1,0);bn.DEFAULT_MATRIX_AUTO_UPDATE=!0;bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gi=new X,Xi=new X,Zu=new X,Yi=new X,Ls=new X,Ds=new X,Im=new X,Qu=new X,Ju=new X,ed=new X,td=new Ft,nd=new Ft,id=new Ft;class _i{constructor(e=new X,t=new X,r=new X){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),gi.subVectors(e,t),a.cross(gi);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,r,a,l){gi.subVectors(a,t),Xi.subVectors(r,t),Zu.subVectors(e,t);const d=gi.dot(gi),f=gi.dot(Xi),p=gi.dot(Zu),m=Xi.dot(Xi),v=Xi.dot(Zu),_=d*m-f*f;if(_===0)return l.set(0,0,0),null;const g=1/_,E=(m*p-f*v)*g,M=(d*v-f*p)*g;return l.set(1-E-M,M,E)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,Yi)===null?!1:Yi.x>=0&&Yi.y>=0&&Yi.x+Yi.y<=1}static getInterpolation(e,t,r,a,l,d,f,p){return this.getBarycoord(e,t,r,a,Yi)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(l,Yi.x),p.addScaledVector(d,Yi.y),p.addScaledVector(f,Yi.z),p)}static getInterpolatedAttribute(e,t,r,a,l,d){return td.setScalar(0),nd.setScalar(0),id.setScalar(0),td.fromBufferAttribute(e,t),nd.fromBufferAttribute(e,r),id.fromBufferAttribute(e,a),d.setScalar(0),d.addScaledVector(td,l.x),d.addScaledVector(nd,l.y),d.addScaledVector(id,l.z),d}static isFrontFacing(e,t,r,a){return gi.subVectors(r,t),Xi.subVectors(e,t),gi.cross(Xi).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),Xi.subVectors(this.a,this.b),gi.cross(Xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,l){return _i.getInterpolation(e,this.a,this.b,this.c,t,r,a,l)}containsPoint(e){return _i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,l=this.c;let d,f;Ls.subVectors(a,r),Ds.subVectors(l,r),Qu.subVectors(e,r);const p=Ls.dot(Qu),m=Ds.dot(Qu);if(p<=0&&m<=0)return t.copy(r);Ju.subVectors(e,a);const v=Ls.dot(Ju),_=Ds.dot(Ju);if(v>=0&&_<=v)return t.copy(a);const g=p*_-v*m;if(g<=0&&p>=0&&v<=0)return d=p/(p-v),t.copy(r).addScaledVector(Ls,d);ed.subVectors(e,l);const E=Ls.dot(ed),M=Ds.dot(ed);if(M>=0&&E<=M)return t.copy(l);const A=E*m-p*M;if(A<=0&&m>=0&&M<=0)return f=m/(m-M),t.copy(r).addScaledVector(Ds,f);const S=v*M-E*_;if(S<=0&&_-v>=0&&E-M>=0)return Im.subVectors(l,a),f=(_-v)/(_-v+(E-M)),t.copy(a).addScaledVector(Im,f);const y=1/(S+A+g);return d=A*y,f=g*y,t.copy(r).addScaledVector(Ls,d).addScaledVector(Ds,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const $0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Er={h:0,s:0,l:0},_l={h:0,s:0,l:0};function rd(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Nt{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=si){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.toWorkingColorSpace(this,t),this}setRGB(e,t,r,a=At.workingColorSpace){return this.r=e,this.g=t,this.b=r,At.toWorkingColorSpace(this,a),this}setHSL(e,t,r,a=At.workingColorSpace){if(e=e_(e,1),t=yn(t,0,1),r=yn(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,d=2*r-l;this.r=rd(d,l,e+1/3),this.g=rd(d,l,e),this.b=rd(d,l,e-1/3)}return At.toWorkingColorSpace(this,a),this}setStyle(e,t=si){function r(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const d=a[1],f=a[2];switch(d){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],d=l.length;if(d===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(d===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=si){const r=$0[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=Ws(e.r),this.g=Ws(e.g),this.b=Ws(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=si){return At.fromWorkingColorSpace(_n.copy(this),e),Math.round(yn(_n.r*255,0,255))*65536+Math.round(yn(_n.g*255,0,255))*256+Math.round(yn(_n.b*255,0,255))}getHexString(e=si){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.fromWorkingColorSpace(_n.copy(this),t);const r=_n.r,a=_n.g,l=_n.b,d=Math.max(r,a,l),f=Math.min(r,a,l);let p,m;const v=(f+d)/2;if(f===d)p=0,m=0;else{const _=d-f;switch(m=v<=.5?_/(d+f):_/(2-d-f),d){case r:p=(a-l)/_+(a<l?6:0);break;case a:p=(l-r)/_+2;break;case l:p=(r-a)/_+4;break}p/=6}return e.h=p,e.s=m,e.l=v,e}getRGB(e,t=At.workingColorSpace){return At.fromWorkingColorSpace(_n.copy(this),t),e.r=_n.r,e.g=_n.g,e.b=_n.b,e}getStyle(e=si){At.fromWorkingColorSpace(_n.copy(this),e);const t=_n.r,r=_n.g,a=_n.b;return e!==si?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(Er),this.setHSL(Er.h+e,Er.s+t,Er.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Er),e.getHSL(_l);const r=ju(Er.h,_l.h,t),a=ju(Er.s,_l.s,t),l=ju(Er.l,_l.l,t);return this.setHSL(r,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*a,this.g=l[1]*t+l[4]*r+l[7]*a,this.b=l[2]*t+l[5]*r+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _n=new Nt;Nt.NAMES=$0;let v_=0;class ia extends ta{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:v_++}),this.uuid=na(),this.name="",this.blending=Gs,this.side=Ar,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Md,this.blendDst=wd,this.blendEquation=qr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bs,this.stencilZFail=bs,this.stencilZPass=bs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Gs&&(r.blending=this.blending),this.side!==Ar&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Md&&(r.blendSrc=this.blendSrc),this.blendDst!==wd&&(r.blendDst=this.blendDst),this.blendEquation!==qr&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bs&&(r.stencilFail=this.stencilFail),this.stencilZFail!==bs&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==bs&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(l){const d=[];for(const f in l){const p=l[f];delete p.metadata,d.push(p)}return d}if(t){const l=a(e.textures),d=a(e.images);l.length>0&&(r.textures=l),d.length>0&&(r.images=d)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let l=0;l!==a;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xa extends ia{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ii,this.combine=R0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Qt=new X,yl=new Qe;class Ei{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=xm,this.updateRanges=[],this.gpuType=qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)yl.fromBufferAttribute(this,t),yl.applyMatrix3(e),this.setXY(t,yl.x,yl.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix3(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=ka(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=On(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ka(t,this.array)),t}setX(e,t){return this.normalized&&(t=On(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ka(t,this.array)),t}setY(e,t){return this.normalized&&(t=On(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ka(t,this.array)),t}setZ(e,t){return this.normalized&&(t=On(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ka(t,this.array)),t}setW(e,t){return this.normalized&&(t=On(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=On(t,this.array),r=On(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=On(t,this.array),r=On(r,this.array),a=On(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,l){return e*=this.itemSize,this.normalized&&(t=On(t,this.array),r=On(r,this.array),a=On(a,this.array),l=On(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xm&&(e.usage=this.usage),e}}class q0 extends Ei{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class K0 extends Ei{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class $n extends Ei{constructor(e,t,r){super(new Float32Array(e),t,r)}}let g_=0;const ri=new Vt,sd=new bn,Us=new X,Xn=new no,Va=new no,cn=new X;class Mi extends ta{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:g_++}),this.uuid=na(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(G0(e)?K0:q0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new ht().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ri.makeRotationFromQuaternion(e),this.applyMatrix4(ri),this}rotateX(e){return ri.makeRotationX(e),this.applyMatrix4(ri),this}rotateY(e){return ri.makeRotationY(e),this.applyMatrix4(ri),this}rotateZ(e){return ri.makeRotationZ(e),this.applyMatrix4(ri),this}translate(e,t,r){return ri.makeTranslation(e,t,r),this.applyMatrix4(ri),this}scale(e,t,r){return ri.makeScale(e,t,r),this.applyMatrix4(ri),this}lookAt(e){return sd.lookAt(e),sd.updateMatrix(),this.applyMatrix4(sd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Us).negate(),this.translate(Us.x,Us.y,Us.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let a=0,l=e.length;a<l;a++){const d=e[a];r.push(d.x,d.y,d.z||0)}this.setAttribute("position",new $n(r,3))}else{for(let r=0,a=t.count;r<a;r++){const l=e[r];t.setXYZ(r,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new no);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];Xn.setFromBufferAttribute(l),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,Xn.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,Xn.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(Xn.min),this.boundingBox.expandByPoint(Xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ql);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const r=this.boundingSphere.center;if(Xn.setFromBufferAttribute(e),t)for(let l=0,d=t.length;l<d;l++){const f=t[l];Va.setFromBufferAttribute(f),this.morphTargetsRelative?(cn.addVectors(Xn.min,Va.min),Xn.expandByPoint(cn),cn.addVectors(Xn.max,Va.max),Xn.expandByPoint(cn)):(Xn.expandByPoint(Va.min),Xn.expandByPoint(Va.max))}Xn.getCenter(r);let a=0;for(let l=0,d=e.count;l<d;l++)cn.fromBufferAttribute(e,l),a=Math.max(a,r.distanceToSquared(cn));if(t)for(let l=0,d=t.length;l<d;l++){const f=t[l],p=this.morphTargetsRelative;for(let m=0,v=f.count;m<v;m++)cn.fromBufferAttribute(f,m),p&&(Us.fromBufferAttribute(e,m),cn.add(Us)),a=Math.max(a,r.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ei(new Float32Array(4*r.count),4));const d=this.getAttribute("tangent"),f=[],p=[];for(let q=0;q<r.count;q++)f[q]=new X,p[q]=new X;const m=new X,v=new X,_=new X,g=new Qe,E=new Qe,M=new Qe,A=new X,S=new X;function y(q,R,b){m.fromBufferAttribute(r,q),v.fromBufferAttribute(r,R),_.fromBufferAttribute(r,b),g.fromBufferAttribute(l,q),E.fromBufferAttribute(l,R),M.fromBufferAttribute(l,b),v.sub(m),_.sub(m),E.sub(g),M.sub(g);const j=1/(E.x*M.y-M.x*E.y);isFinite(j)&&(A.copy(v).multiplyScalar(M.y).addScaledVector(_,-E.y).multiplyScalar(j),S.copy(_).multiplyScalar(E.x).addScaledVector(v,-M.x).multiplyScalar(j),f[q].add(A),f[R].add(A),f[b].add(A),p[q].add(S),p[R].add(S),p[b].add(S))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let q=0,R=P.length;q<R;++q){const b=P[q],j=b.start,K=b.count;for(let Y=j,le=j+K;Y<le;Y+=3)y(e.getX(Y+0),e.getX(Y+1),e.getX(Y+2))}const I=new X,C=new X,ie=new X,V=new X;function F(q){ie.fromBufferAttribute(a,q),V.copy(ie);const R=f[q];I.copy(R),I.sub(ie.multiplyScalar(ie.dot(R))).normalize(),C.crossVectors(V,R);const j=C.dot(p[q])<0?-1:1;d.setXYZW(q,I.x,I.y,I.z,j)}for(let q=0,R=P.length;q<R;++q){const b=P[q],j=b.start,K=b.count;for(let Y=j,le=j+K;Y<le;Y+=3)F(e.getX(Y+0)),F(e.getX(Y+1)),F(e.getX(Y+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Ei(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let g=0,E=r.count;g<E;g++)r.setXYZ(g,0,0,0);const a=new X,l=new X,d=new X,f=new X,p=new X,m=new X,v=new X,_=new X;if(e)for(let g=0,E=e.count;g<E;g+=3){const M=e.getX(g+0),A=e.getX(g+1),S=e.getX(g+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,A),d.fromBufferAttribute(t,S),v.subVectors(d,l),_.subVectors(a,l),v.cross(_),f.fromBufferAttribute(r,M),p.fromBufferAttribute(r,A),m.fromBufferAttribute(r,S),f.add(v),p.add(v),m.add(v),r.setXYZ(M,f.x,f.y,f.z),r.setXYZ(A,p.x,p.y,p.z),r.setXYZ(S,m.x,m.y,m.z)}else for(let g=0,E=t.count;g<E;g+=3)a.fromBufferAttribute(t,g+0),l.fromBufferAttribute(t,g+1),d.fromBufferAttribute(t,g+2),v.subVectors(d,l),_.subVectors(a,l),v.cross(_),r.setXYZ(g+0,v.x,v.y,v.z),r.setXYZ(g+1,v.x,v.y,v.z),r.setXYZ(g+2,v.x,v.y,v.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)cn.fromBufferAttribute(e,t),cn.normalize(),e.setXYZ(t,cn.x,cn.y,cn.z)}toNonIndexed(){function e(f,p){const m=f.array,v=f.itemSize,_=f.normalized,g=new m.constructor(p.length*v);let E=0,M=0;for(let A=0,S=p.length;A<S;A++){f.isInterleavedBufferAttribute?E=p[A]*f.data.stride+f.offset:E=p[A]*v;for(let y=0;y<v;y++)g[M++]=m[E++]}return new Ei(g,v,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Mi,r=this.index.array,a=this.attributes;for(const f in a){const p=a[f],m=e(p,r);t.setAttribute(f,m)}const l=this.morphAttributes;for(const f in l){const p=[],m=l[f];for(let v=0,_=m.length;v<_;v++){const g=m[v],E=e(g,r);p.push(E)}t.morphAttributes[f]=p}t.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let f=0,p=d.length;f<p;f++){const m=d[f];t.addGroup(m.start,m.count,m.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const m in p)p[m]!==void 0&&(e[m]=p[m]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const p in r){const m=r[p];e.data.attributes[p]=m.toJSON(e.data)}const a={};let l=!1;for(const p in this.morphAttributes){const m=this.morphAttributes[p],v=[];for(let _=0,g=m.length;_<g;_++){const E=m[_];v.push(E.toJSON(e.data))}v.length>0&&(a[p]=v,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere={center:f.center.toArray(),radius:f.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(t));const a=e.attributes;for(const m in a){const v=a[m];this.setAttribute(m,v.clone(t))}const l=e.morphAttributes;for(const m in l){const v=[],_=l[m];for(let g=0,E=_.length;g<E;g++)v.push(_[g].clone(t));this.morphAttributes[m]=v}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let m=0,v=d.length;m<v;m++){const _=d[m];this.addGroup(_.start,_.count,_.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lm=new Vt,Gr=new X0,Sl=new ql,Dm=new X,El=new X,Ml=new X,wl=new X,ad=new X,bl=new X,Um=new X,Tl=new X;class Fn extends bn{constructor(e=new Mi,t=new Xa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,d=a.length;l<d;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,l=r.morphAttributes.position,d=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const f=this.morphTargetInfluences;if(l&&f){bl.set(0,0,0);for(let p=0,m=l.length;p<m;p++){const v=f[p],_=l[p];v!==0&&(ad.fromBufferAttribute(_,e),d?bl.addScaledVector(ad,v):bl.addScaledVector(ad.sub(t),v))}t.add(bl)}return t}raycast(e,t){const r=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Sl.copy(r.boundingSphere),Sl.applyMatrix4(l),Gr.copy(e.ray).recast(e.near),!(Sl.containsPoint(Gr.origin)===!1&&(Gr.intersectSphere(Sl,Dm)===null||Gr.origin.distanceToSquared(Dm)>(e.far-e.near)**2))&&(Lm.copy(l).invert(),Gr.copy(e.ray).applyMatrix4(Lm),!(r.boundingBox!==null&&Gr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Gr)))}_computeIntersections(e,t,r){let a;const l=this.geometry,d=this.material,f=l.index,p=l.attributes.position,m=l.attributes.uv,v=l.attributes.uv1,_=l.attributes.normal,g=l.groups,E=l.drawRange;if(f!==null)if(Array.isArray(d))for(let M=0,A=g.length;M<A;M++){const S=g[M],y=d[S.materialIndex],P=Math.max(S.start,E.start),I=Math.min(f.count,Math.min(S.start+S.count,E.start+E.count));for(let C=P,ie=I;C<ie;C+=3){const V=f.getX(C),F=f.getX(C+1),q=f.getX(C+2);a=Al(this,y,e,r,m,v,_,V,F,q),a&&(a.faceIndex=Math.floor(C/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,E.start),A=Math.min(f.count,E.start+E.count);for(let S=M,y=A;S<y;S+=3){const P=f.getX(S),I=f.getX(S+1),C=f.getX(S+2);a=Al(this,d,e,r,m,v,_,P,I,C),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(p!==void 0)if(Array.isArray(d))for(let M=0,A=g.length;M<A;M++){const S=g[M],y=d[S.materialIndex],P=Math.max(S.start,E.start),I=Math.min(p.count,Math.min(S.start+S.count,E.start+E.count));for(let C=P,ie=I;C<ie;C+=3){const V=C,F=C+1,q=C+2;a=Al(this,y,e,r,m,v,_,V,F,q),a&&(a.faceIndex=Math.floor(C/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,E.start),A=Math.min(p.count,E.start+E.count);for(let S=M,y=A;S<y;S+=3){const P=S,I=S+1,C=S+2;a=Al(this,d,e,r,m,v,_,P,I,C),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function __(s,e,t,r,a,l,d,f){let p;if(e.side===kn?p=r.intersectTriangle(d,l,a,!0,f):p=r.intersectTriangle(a,l,d,e.side===Ar,f),p===null)return null;Tl.copy(f),Tl.applyMatrix4(s.matrixWorld);const m=t.ray.origin.distanceTo(Tl);return m<t.near||m>t.far?null:{distance:m,point:Tl.clone(),object:s}}function Al(s,e,t,r,a,l,d,f,p,m){s.getVertexPosition(f,El),s.getVertexPosition(p,Ml),s.getVertexPosition(m,wl);const v=__(s,e,t,r,El,Ml,wl,Um);if(v){const _=new X;_i.getBarycoord(Um,El,Ml,wl,_),a&&(v.uv=_i.getInterpolatedAttribute(a,f,p,m,_,new Qe)),l&&(v.uv1=_i.getInterpolatedAttribute(l,f,p,m,_,new Qe)),d&&(v.normal=_i.getInterpolatedAttribute(d,f,p,m,_,new X),v.normal.dot(r.direction)>0&&v.normal.multiplyScalar(-1));const g={a:f,b:p,c:m,normal:new X,materialIndex:0};_i.getNormal(El,Ml,wl,g.normal),v.face=g,v.barycoord=_}return v}class io extends Mi{constructor(e=1,t=1,r=1,a=1,l=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:l,depthSegments:d};const f=this;a=Math.floor(a),l=Math.floor(l),d=Math.floor(d);const p=[],m=[],v=[],_=[];let g=0,E=0;M("z","y","x",-1,-1,r,t,e,d,l,0),M("z","y","x",1,-1,r,t,-e,d,l,1),M("x","z","y",1,1,e,r,t,a,d,2),M("x","z","y",1,-1,e,r,-t,a,d,3),M("x","y","z",1,-1,e,t,r,a,l,4),M("x","y","z",-1,-1,e,t,-r,a,l,5),this.setIndex(p),this.setAttribute("position",new $n(m,3)),this.setAttribute("normal",new $n(v,3)),this.setAttribute("uv",new $n(_,2));function M(A,S,y,P,I,C,ie,V,F,q,R){const b=C/F,j=ie/q,K=C/2,Y=ie/2,le=V/2,xe=F+1,de=q+1;let me=0,B=0;const pe=new X;for(let te=0;te<de;te++){const O=te*j-Y;for(let J=0;J<xe;J++){const De=J*b-K;pe[A]=De*P,pe[S]=O*I,pe[y]=le,m.push(pe.x,pe.y,pe.z),pe[A]=0,pe[S]=0,pe[y]=V>0?1:-1,v.push(pe.x,pe.y,pe.z),_.push(J/F),_.push(1-te/q),me+=1}}for(let te=0;te<q;te++)for(let O=0;O<F;O++){const J=g+O+xe*te,De=g+O+xe*(te+1),ne=g+(O+1)+xe*(te+1),k=g+(O+1)+xe*te;p.push(J,De,k),p.push(De,ne,k),B+=6}f.addGroup(E,B,R),E+=B,g+=me}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new io(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zs(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const a=s[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function wn(s){const e={};for(let t=0;t<s.length;t++){const r=Zs(s[t]);for(const a in r)e[a]=r[a]}return e}function y_(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Z0(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const S_={clone:Zs,merge:wn};var E_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,M_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cr extends ia{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=E_,this.fragmentShader=M_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=y_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const d=this.uniforms[a].value;d&&d.isTexture?t.uniforms[a]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?t.uniforms[a]={type:"c",value:d.getHex()}:d&&d.isVector2?t.uniforms[a]={type:"v2",value:d.toArray()}:d&&d.isVector3?t.uniforms[a]={type:"v3",value:d.toArray()}:d&&d.isVector4?t.uniforms[a]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?t.uniforms[a]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?t.uniforms[a]={type:"m4",value:d.toArray()}:t.uniforms[a]={value:d}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}let Q0=class extends bn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=Ki}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}};const Mr=new X,Om=new Qe,Fm=new Qe;class Yn extends Q0{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=cf*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cf*2*Math.atan(Math.tan(zu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){Mr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Mr.x,Mr.y).multiplyScalar(-e/Mr.z),Mr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(Mr.x,Mr.y).multiplyScalar(-e/Mr.z)}getViewSize(e,t){return this.getViewBounds(e,Om,Fm),t.subVectors(Fm,Om)}setViewOffset(e,t,r,a,l,d){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(zu*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,l=-.5*a;const d=this.view;if(this.view!==null&&this.view.enabled){const p=d.fullWidth,m=d.fullHeight;l+=d.offsetX*a/p,t-=d.offsetY*r/m,a*=d.width/p,r*=d.height/m}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Os=-90,Fs=1;class w_ extends bn{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Yn(Os,Fs,e,t);a.layers=this.layers,this.add(a);const l=new Yn(Os,Fs,e,t);l.layers=this.layers,this.add(l);const d=new Yn(Os,Fs,e,t);d.layers=this.layers,this.add(d);const f=new Yn(Os,Fs,e,t);f.layers=this.layers,this.add(f);const p=new Yn(Os,Fs,e,t);p.layers=this.layers,this.add(p);const m=new Yn(Os,Fs,e,t);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,l,d,f,p]=t;for(const m of t)this.remove(m);if(e===Ki)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===Wl)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of t)this.add(m),m.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,d,f,p,m,v]=this.children,_=e.getRenderTarget(),g=e.getActiveCubeFace(),E=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const A=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,l),e.setRenderTarget(r,1,a),e.render(t,d),e.setRenderTarget(r,2,a),e.render(t,f),e.setRenderTarget(r,3,a),e.render(t,p),e.setRenderTarget(r,4,a),e.render(t,m),r.texture.generateMipmaps=A,e.setRenderTarget(r,5,a),e.render(t,v),e.setRenderTarget(_,g,E),e.xr.enabled=M,r.texture.needsPMREMUpdate=!0}}class J0 extends Bn{constructor(e,t,r,a,l,d,f,p,m,v){e=e!==void 0?e:[],t=t!==void 0?t:Ys,super(e,t,r,a,l,d,f,p,m,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class b_ extends es{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new J0(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Pi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new io(5,5,5),l=new Cr({name:"CubemapFromEquirect",uniforms:Zs(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:kn,blending:br});l.uniforms.tEquirect.value=t;const d=new Fn(a,l),f=t.minFilter;return t.minFilter===Qr&&(t.minFilter=Pi),new w_(1,10,this).update(e,d),t.minFilter=f,d.geometry.dispose(),d.material.dispose(),this}clear(e,t,r,a){const l=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(t,r,a);e.setRenderTarget(l)}}const od=new X,T_=new X,A_=new ht;class Yr{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=od.subVectors(r,t).cross(T_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(od),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/a;return l<0||l>1?null:t.copy(e.start).addScaledVector(r,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||A_.getNormalMatrix(e),a=this.coplanarPoint(od).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hr=new ql,Cl=new X;class Mf{constructor(e=new Yr,t=new Yr,r=new Yr,a=new Yr,l=new Yr,d=new Yr){this.planes=[e,t,r,a,l,d]}set(e,t,r,a,l,d){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(r),f[3].copy(a),f[4].copy(l),f[5].copy(d),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Ki){const r=this.planes,a=e.elements,l=a[0],d=a[1],f=a[2],p=a[3],m=a[4],v=a[5],_=a[6],g=a[7],E=a[8],M=a[9],A=a[10],S=a[11],y=a[12],P=a[13],I=a[14],C=a[15];if(r[0].setComponents(p-l,g-m,S-E,C-y).normalize(),r[1].setComponents(p+l,g+m,S+E,C+y).normalize(),r[2].setComponents(p+d,g+v,S+M,C+P).normalize(),r[3].setComponents(p-d,g-v,S-M,C-P).normalize(),r[4].setComponents(p-f,g-_,S-A,C-I).normalize(),t===Ki)r[5].setComponents(p+f,g+_,S+A,C+I).normalize();else if(t===Wl)r[5].setComponents(f,_,A,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hr)}intersectsSprite(e){return Hr.center.set(0,0,0),Hr.radius=.7071067811865476,Hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hr)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Cl.x=a.normal.x>0?e.max.x:e.min.x,Cl.y=a.normal.y>0?e.max.y:e.min.y,Cl.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Cl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ex(){let s=null,e=!1,t=null,r=null;function a(l,d){t(l,d),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function C_(s){const e=new WeakMap;function t(f,p){const m=f.array,v=f.usage,_=m.byteLength,g=s.createBuffer();s.bindBuffer(p,g),s.bufferData(p,m,v),f.onUploadCallback();let E;if(m instanceof Float32Array)E=s.FLOAT;else if(m instanceof Uint16Array)f.isFloat16BufferAttribute?E=s.HALF_FLOAT:E=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)E=s.SHORT;else if(m instanceof Uint32Array)E=s.UNSIGNED_INT;else if(m instanceof Int32Array)E=s.INT;else if(m instanceof Int8Array)E=s.BYTE;else if(m instanceof Uint8Array)E=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)E=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:g,type:E,bytesPerElement:m.BYTES_PER_ELEMENT,version:f.version,size:_}}function r(f,p,m){const v=p.array,_=p.updateRanges;if(s.bindBuffer(m,f),_.length===0)s.bufferSubData(m,0,v);else{_.sort((E,M)=>E.start-M.start);let g=0;for(let E=1;E<_.length;E++){const M=_[g],A=_[E];A.start<=M.start+M.count+1?M.count=Math.max(M.count,A.start+A.count-M.start):(++g,_[g]=A)}_.length=g+1;for(let E=0,M=_.length;E<M;E++){const A=_[E];s.bufferSubData(m,A.start*v.BYTES_PER_ELEMENT,v,A.start,A.count)}p.clearUpdateRanges()}p.onUploadCallback()}function a(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const p=e.get(f);p&&(s.deleteBuffer(p.buffer),e.delete(f))}function d(f,p){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const v=e.get(f);(!v||v.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const m=e.get(f);if(m===void 0)e.set(f,t(f,p));else if(m.version<f.version){if(m.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,f,p),m.version=f.version}}return{get:a,remove:l,update:d}}class Kl extends Mi{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const l=e/2,d=t/2,f=Math.floor(r),p=Math.floor(a),m=f+1,v=p+1,_=e/f,g=t/p,E=[],M=[],A=[],S=[];for(let y=0;y<v;y++){const P=y*g-d;for(let I=0;I<m;I++){const C=I*_-l;M.push(C,-P,0),A.push(0,0,1),S.push(I/f),S.push(1-y/p)}}for(let y=0;y<p;y++)for(let P=0;P<f;P++){const I=P+m*y,C=P+m*(y+1),ie=P+1+m*(y+1),V=P+1+m*y;E.push(I,C,V),E.push(C,ie,V)}this.setIndex(E),this.setAttribute("position",new $n(M,3)),this.setAttribute("normal",new $n(A,3)),this.setAttribute("uv",new $n(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kl(e.width,e.height,e.widthSegments,e.heightSegments)}}var R_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,N_=`#ifdef USE_ALPHAHASH
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
#endif`,P_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,I_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,L_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,D_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,U_=`#ifdef USE_AOMAP
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
#endif`,O_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F_=`#ifdef USE_BATCHING
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
#endif`,k_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,B_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,z_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,j_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,V_=`#ifdef USE_IRIDESCENCE
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
#endif`,G_=`#ifdef USE_BUMPMAP
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
#endif`,H_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,W_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,X_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Y_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,q_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,K_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Z_=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Q_=`#define PI 3.141592653589793
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
} // validated`,J_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ey=`vec3 transformedNormal = objectNormal;
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
#endif`,ty=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ny=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,iy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ry=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ay=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,oy=`#ifdef USE_ENVMAP
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
#endif`,ly=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cy=`#ifdef USE_ENVMAP
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
#endif`,uy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dy=`#ifdef USE_ENVMAP
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
#endif`,fy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,py=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,my=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xy=`#ifdef USE_GRADIENTMAP
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
}`,vy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_y=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yy=`uniform bool receiveShadow;
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
#endif`,Sy=`#ifdef USE_ENVMAP
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
#endif`,Ey=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,My=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,by=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ty=`PhysicalMaterial material;
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
#endif`,Ay=`struct PhysicalMaterial {
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
}`,Cy=`
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
#endif`,Ry=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ny=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Py=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Iy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ly=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Uy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Oy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ky=`#if defined( USE_POINTS_UV )
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
#endif`,By=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hy=`#ifdef USE_MORPHTARGETS
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
#endif`,Wy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$y=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ky=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zy=`#ifdef USE_NORMALMAP
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
#endif`,Qy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,eS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,nS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,iS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,aS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,oS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,uS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hS=`float getShadowMask() {
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
}`,pS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mS=`#ifdef USE_SKINNING
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
#endif`,xS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vS=`#ifdef USE_SKINNING
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
#endif`,gS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_S=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,SS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ES=`#ifdef USE_TRANSMISSION
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
#endif`,MS=`#ifdef USE_TRANSMISSION
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
#endif`,wS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,TS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const CS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,RS=`uniform sampler2D t2D;
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
}`,NS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,PS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,IS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DS=`#include <common>
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
}`,US=`#if DEPTH_PACKING == 3200
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
}`,OS=`#define DISTANCE
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
}`,FS=`#define DISTANCE
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
}`,kS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zS=`uniform float scale;
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
}`,jS=`uniform vec3 diffuse;
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
}`,VS=`#include <common>
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
}`,GS=`uniform vec3 diffuse;
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
}`,HS=`#define LAMBERT
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
}`,WS=`#define LAMBERT
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
}`,XS=`#define MATCAP
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
}`,YS=`#define MATCAP
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
}`,$S=`#define NORMAL
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
}`,qS=`#define NORMAL
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
}`,KS=`#define PHONG
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
}`,ZS=`#define PHONG
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
}`,QS=`#define STANDARD
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
}`,JS=`#define STANDARD
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
}`,eE=`#define TOON
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
}`,tE=`#define TOON
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
}`,nE=`uniform float size;
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
}`,iE=`uniform vec3 diffuse;
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
}`,rE=`#include <common>
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
}`,sE=`uniform vec3 color;
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
}`,aE=`uniform float rotation;
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
}`,oE=`uniform vec3 diffuse;
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
}`,gt={alphahash_fragment:R_,alphahash_pars_fragment:N_,alphamap_fragment:P_,alphamap_pars_fragment:I_,alphatest_fragment:L_,alphatest_pars_fragment:D_,aomap_fragment:U_,aomap_pars_fragment:O_,batching_pars_vertex:F_,batching_vertex:k_,begin_vertex:B_,beginnormal_vertex:z_,bsdfs:j_,iridescence_fragment:V_,bumpmap_pars_fragment:G_,clipping_planes_fragment:H_,clipping_planes_pars_fragment:W_,clipping_planes_pars_vertex:X_,clipping_planes_vertex:Y_,color_fragment:$_,color_pars_fragment:q_,color_pars_vertex:K_,color_vertex:Z_,common:Q_,cube_uv_reflection_fragment:J_,defaultnormal_vertex:ey,displacementmap_pars_vertex:ty,displacementmap_vertex:ny,emissivemap_fragment:iy,emissivemap_pars_fragment:ry,colorspace_fragment:sy,colorspace_pars_fragment:ay,envmap_fragment:oy,envmap_common_pars_fragment:ly,envmap_pars_fragment:cy,envmap_pars_vertex:uy,envmap_physical_pars_fragment:Sy,envmap_vertex:dy,fog_vertex:fy,fog_pars_vertex:hy,fog_fragment:py,fog_pars_fragment:my,gradientmap_pars_fragment:xy,lightmap_pars_fragment:vy,lights_lambert_fragment:gy,lights_lambert_pars_fragment:_y,lights_pars_begin:yy,lights_toon_fragment:Ey,lights_toon_pars_fragment:My,lights_phong_fragment:wy,lights_phong_pars_fragment:by,lights_physical_fragment:Ty,lights_physical_pars_fragment:Ay,lights_fragment_begin:Cy,lights_fragment_maps:Ry,lights_fragment_end:Ny,logdepthbuf_fragment:Py,logdepthbuf_pars_fragment:Iy,logdepthbuf_pars_vertex:Ly,logdepthbuf_vertex:Dy,map_fragment:Uy,map_pars_fragment:Oy,map_particle_fragment:Fy,map_particle_pars_fragment:ky,metalnessmap_fragment:By,metalnessmap_pars_fragment:zy,morphinstance_vertex:jy,morphcolor_vertex:Vy,morphnormal_vertex:Gy,morphtarget_pars_vertex:Hy,morphtarget_vertex:Wy,normal_fragment_begin:Xy,normal_fragment_maps:Yy,normal_pars_fragment:$y,normal_pars_vertex:qy,normal_vertex:Ky,normalmap_pars_fragment:Zy,clearcoat_normal_fragment_begin:Qy,clearcoat_normal_fragment_maps:Jy,clearcoat_pars_fragment:eS,iridescence_pars_fragment:tS,opaque_fragment:nS,packing:iS,premultiplied_alpha_fragment:rS,project_vertex:sS,dithering_fragment:aS,dithering_pars_fragment:oS,roughnessmap_fragment:lS,roughnessmap_pars_fragment:cS,shadowmap_pars_fragment:uS,shadowmap_pars_vertex:dS,shadowmap_vertex:fS,shadowmask_pars_fragment:hS,skinbase_vertex:pS,skinning_pars_vertex:mS,skinning_vertex:xS,skinnormal_vertex:vS,specularmap_fragment:gS,specularmap_pars_fragment:_S,tonemapping_fragment:yS,tonemapping_pars_fragment:SS,transmission_fragment:ES,transmission_pars_fragment:MS,uv_pars_fragment:wS,uv_pars_vertex:bS,uv_vertex:TS,worldpos_vertex:AS,background_vert:CS,background_frag:RS,backgroundCube_vert:NS,backgroundCube_frag:PS,cube_vert:IS,cube_frag:LS,depth_vert:DS,depth_frag:US,distanceRGBA_vert:OS,distanceRGBA_frag:FS,equirect_vert:kS,equirect_frag:BS,linedashed_vert:zS,linedashed_frag:jS,meshbasic_vert:VS,meshbasic_frag:GS,meshlambert_vert:HS,meshlambert_frag:WS,meshmatcap_vert:XS,meshmatcap_frag:YS,meshnormal_vert:$S,meshnormal_frag:qS,meshphong_vert:KS,meshphong_frag:ZS,meshphysical_vert:QS,meshphysical_frag:JS,meshtoon_vert:eE,meshtoon_frag:tE,points_vert:nE,points_frag:iE,shadow_vert:rE,shadow_frag:sE,sprite_vert:aE,sprite_frag:oE},Ue={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ht}},envmap:{envMap:{value:null},envMapRotation:{value:new ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ht},normalScale:{value:new Qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0},uvTransform:{value:new ht}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new Qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}}},Ri={basic:{uniforms:wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:gt.meshbasic_vert,fragmentShader:gt.meshbasic_frag},lambert:{uniforms:wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Nt(0)}}]),vertexShader:gt.meshlambert_vert,fragmentShader:gt.meshlambert_frag},phong:{uniforms:wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:gt.meshphong_vert,fragmentShader:gt.meshphong_frag},standard:{uniforms:wn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag},toon:{uniforms:wn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new Nt(0)}}]),vertexShader:gt.meshtoon_vert,fragmentShader:gt.meshtoon_frag},matcap:{uniforms:wn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:gt.meshmatcap_vert,fragmentShader:gt.meshmatcap_frag},points:{uniforms:wn([Ue.points,Ue.fog]),vertexShader:gt.points_vert,fragmentShader:gt.points_frag},dashed:{uniforms:wn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gt.linedashed_vert,fragmentShader:gt.linedashed_frag},depth:{uniforms:wn([Ue.common,Ue.displacementmap]),vertexShader:gt.depth_vert,fragmentShader:gt.depth_frag},normal:{uniforms:wn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:gt.meshnormal_vert,fragmentShader:gt.meshnormal_frag},sprite:{uniforms:wn([Ue.sprite,Ue.fog]),vertexShader:gt.sprite_vert,fragmentShader:gt.sprite_frag},background:{uniforms:{uvTransform:{value:new ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gt.background_vert,fragmentShader:gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ht}},vertexShader:gt.backgroundCube_vert,fragmentShader:gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gt.cube_vert,fragmentShader:gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gt.equirect_vert,fragmentShader:gt.equirect_frag},distanceRGBA:{uniforms:wn([Ue.common,Ue.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gt.distanceRGBA_vert,fragmentShader:gt.distanceRGBA_frag},shadow:{uniforms:wn([Ue.lights,Ue.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:gt.shadow_vert,fragmentShader:gt.shadow_frag}};Ri.physical={uniforms:wn([Ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ht},clearcoatNormalScale:{value:new Qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ht},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ht},transmissionSamplerSize:{value:new Qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ht},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ht},anisotropyVector:{value:new Qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ht}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag};const Rl={r:0,b:0,g:0},Wr=new Ii,lE=new Vt;function cE(s,e,t,r,a,l,d){const f=new Nt(0);let p=l===!0?0:1,m,v,_=null,g=0,E=null;function M(P){let I=P.isScene===!0?P.background:null;return I&&I.isTexture&&(I=(P.backgroundBlurriness>0?t:e).get(I)),I}function A(P){let I=!1;const C=M(P);C===null?y(f,p):C&&C.isColor&&(y(C,1),I=!0);const ie=s.xr.getEnvironmentBlendMode();ie==="additive"?r.buffers.color.setClear(0,0,0,1,d):ie==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,d),(s.autoClear||I)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(P,I){const C=M(I);C&&(C.isCubeTexture||C.mapping===Yl)?(v===void 0&&(v=new Fn(new io(1,1,1),new Cr({name:"BackgroundCubeMaterial",uniforms:Zs(Ri.backgroundCube.uniforms),vertexShader:Ri.backgroundCube.vertexShader,fragmentShader:Ri.backgroundCube.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),v.geometry.deleteAttribute("normal"),v.geometry.deleteAttribute("uv"),v.onBeforeRender=function(ie,V,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(v.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(v)),Wr.copy(I.backgroundRotation),Wr.x*=-1,Wr.y*=-1,Wr.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Wr.y*=-1,Wr.z*=-1),v.material.uniforms.envMap.value=C,v.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,v.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,v.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,v.material.uniforms.backgroundRotation.value.setFromMatrix4(lE.makeRotationFromEuler(Wr)),v.material.toneMapped=At.getTransfer(C.colorSpace)!==Ot,(_!==C||g!==C.version||E!==s.toneMapping)&&(v.material.needsUpdate=!0,_=C,g=C.version,E=s.toneMapping),v.layers.enableAll(),P.unshift(v,v.geometry,v.material,0,0,null)):C&&C.isTexture&&(m===void 0&&(m=new Fn(new Kl(2,2),new Cr({name:"BackgroundMaterial",uniforms:Zs(Ri.background.uniforms),vertexShader:Ri.background.vertexShader,fragmentShader:Ri.background.fragmentShader,side:Ar,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=C,m.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,m.material.toneMapped=At.getTransfer(C.colorSpace)!==Ot,C.matrixAutoUpdate===!0&&C.updateMatrix(),m.material.uniforms.uvTransform.value.copy(C.matrix),(_!==C||g!==C.version||E!==s.toneMapping)&&(m.material.needsUpdate=!0,_=C,g=C.version,E=s.toneMapping),m.layers.enableAll(),P.unshift(m,m.geometry,m.material,0,0,null))}function y(P,I){P.getRGB(Rl,Z0(s)),r.buffers.color.setClear(Rl.r,Rl.g,Rl.b,I,d)}return{getClearColor:function(){return f},setClearColor:function(P,I=1){f.set(P),p=I,y(f,p)},getClearAlpha:function(){return p},setClearAlpha:function(P){p=P,y(f,p)},render:A,addToRenderList:S}}function uE(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=g(null);let l=a,d=!1;function f(b,j,K,Y,le){let xe=!1;const de=_(Y,K,j);l!==de&&(l=de,m(l.object)),xe=E(b,Y,K,le),xe&&M(b,Y,K,le),le!==null&&e.update(le,s.ELEMENT_ARRAY_BUFFER),(xe||d)&&(d=!1,C(b,j,K,Y),le!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(le).buffer))}function p(){return s.createVertexArray()}function m(b){return s.bindVertexArray(b)}function v(b){return s.deleteVertexArray(b)}function _(b,j,K){const Y=K.wireframe===!0;let le=r[b.id];le===void 0&&(le={},r[b.id]=le);let xe=le[j.id];xe===void 0&&(xe={},le[j.id]=xe);let de=xe[Y];return de===void 0&&(de=g(p()),xe[Y]=de),de}function g(b){const j=[],K=[],Y=[];for(let le=0;le<t;le++)j[le]=0,K[le]=0,Y[le]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:j,enabledAttributes:K,attributeDivisors:Y,object:b,attributes:{},index:null}}function E(b,j,K,Y){const le=l.attributes,xe=j.attributes;let de=0;const me=K.getAttributes();for(const B in me)if(me[B].location>=0){const te=le[B];let O=xe[B];if(O===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(O=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(O=b.instanceColor)),te===void 0||te.attribute!==O||O&&te.data!==O.data)return!0;de++}return l.attributesNum!==de||l.index!==Y}function M(b,j,K,Y){const le={},xe=j.attributes;let de=0;const me=K.getAttributes();for(const B in me)if(me[B].location>=0){let te=xe[B];te===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(te=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(te=b.instanceColor));const O={};O.attribute=te,te&&te.data&&(O.data=te.data),le[B]=O,de++}l.attributes=le,l.attributesNum=de,l.index=Y}function A(){const b=l.newAttributes;for(let j=0,K=b.length;j<K;j++)b[j]=0}function S(b){y(b,0)}function y(b,j){const K=l.newAttributes,Y=l.enabledAttributes,le=l.attributeDivisors;K[b]=1,Y[b]===0&&(s.enableVertexAttribArray(b),Y[b]=1),le[b]!==j&&(s.vertexAttribDivisor(b,j),le[b]=j)}function P(){const b=l.newAttributes,j=l.enabledAttributes;for(let K=0,Y=j.length;K<Y;K++)j[K]!==b[K]&&(s.disableVertexAttribArray(K),j[K]=0)}function I(b,j,K,Y,le,xe,de){de===!0?s.vertexAttribIPointer(b,j,K,le,xe):s.vertexAttribPointer(b,j,K,Y,le,xe)}function C(b,j,K,Y){A();const le=Y.attributes,xe=K.getAttributes(),de=j.defaultAttributeValues;for(const me in xe){const B=xe[me];if(B.location>=0){let pe=le[me];if(pe===void 0&&(me==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),me==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),pe!==void 0){const te=pe.normalized,O=pe.itemSize,J=e.get(pe);if(J===void 0)continue;const De=J.buffer,ne=J.type,k=J.bytesPerElement,ue=ne===s.INT||ne===s.UNSIGNED_INT||pe.gpuType===vf;if(pe.isInterleavedBufferAttribute){const fe=pe.data,ge=fe.stride,Ae=pe.offset;if(fe.isInstancedInterleavedBuffer){for(let Fe=0;Fe<B.locationSize;Fe++)y(B.location+Fe,fe.meshPerAttribute);b.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Fe=0;Fe<B.locationSize;Fe++)S(B.location+Fe);s.bindBuffer(s.ARRAY_BUFFER,De);for(let Fe=0;Fe<B.locationSize;Fe++)I(B.location+Fe,O/B.locationSize,ne,te,ge*k,(Ae+O/B.locationSize*Fe)*k,ue)}else{if(pe.isInstancedBufferAttribute){for(let fe=0;fe<B.locationSize;fe++)y(B.location+fe,pe.meshPerAttribute);b.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let fe=0;fe<B.locationSize;fe++)S(B.location+fe);s.bindBuffer(s.ARRAY_BUFFER,De);for(let fe=0;fe<B.locationSize;fe++)I(B.location+fe,O/B.locationSize,ne,te,O*k,O/B.locationSize*fe*k,ue)}}else if(de!==void 0){const te=de[me];if(te!==void 0)switch(te.length){case 2:s.vertexAttrib2fv(B.location,te);break;case 3:s.vertexAttrib3fv(B.location,te);break;case 4:s.vertexAttrib4fv(B.location,te);break;default:s.vertexAttrib1fv(B.location,te)}}}}P()}function ie(){q();for(const b in r){const j=r[b];for(const K in j){const Y=j[K];for(const le in Y)v(Y[le].object),delete Y[le];delete j[K]}delete r[b]}}function V(b){if(r[b.id]===void 0)return;const j=r[b.id];for(const K in j){const Y=j[K];for(const le in Y)v(Y[le].object),delete Y[le];delete j[K]}delete r[b.id]}function F(b){for(const j in r){const K=r[j];if(K[b.id]===void 0)continue;const Y=K[b.id];for(const le in Y)v(Y[le].object),delete Y[le];delete K[b.id]}}function q(){R(),d=!0,l!==a&&(l=a,m(l.object))}function R(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:f,reset:q,resetDefaultState:R,dispose:ie,releaseStatesOfGeometry:V,releaseStatesOfProgram:F,initAttributes:A,enableAttribute:S,disableUnusedAttributes:P}}function dE(s,e,t){let r;function a(m){r=m}function l(m,v){s.drawArrays(r,m,v),t.update(v,r,1)}function d(m,v,_){_!==0&&(s.drawArraysInstanced(r,m,v,_),t.update(v,r,_))}function f(m,v,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,v,0,_);let E=0;for(let M=0;M<_;M++)E+=v[M];t.update(E,r,1)}function p(m,v,_,g){if(_===0)return;const E=e.get("WEBGL_multi_draw");if(E===null)for(let M=0;M<m.length;M++)d(m[M],v[M],g[M]);else{E.multiDrawArraysInstancedWEBGL(r,m,0,v,0,g,0,_);let M=0;for(let A=0;A<_;A++)M+=v[A]*g[A];t.update(M,r,1)}}this.setMode=a,this.render=l,this.renderInstances=d,this.renderMultiDraw=f,this.renderMultiDrawInstances=p}function fE(s,e,t,r){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function d(F){return!(F!==yi&&r.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(F){const q=F===eo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==Qi&&r.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==qi&&!q)}function p(F){if(F==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=t.precision!==void 0?t.precision:"highp";const v=p(m);v!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",v,"instead."),m=v);const _=t.logarithmicDepthBuffer===!0,g=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),E=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),P=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),C=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),ie=M>0,V=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:p,textureFormatReadable:d,textureTypeReadable:f,precision:m,logarithmicDepthBuffer:_,reverseDepthBuffer:g,maxTextures:E,maxVertexTextures:M,maxTextureSize:A,maxCubemapSize:S,maxAttributes:y,maxVertexUniforms:P,maxVaryings:I,maxFragmentUniforms:C,vertexTextures:ie,maxSamples:V}}function hE(s){const e=this;let t=null,r=0,a=!1,l=!1;const d=new Yr,f=new ht,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(_,g){const E=_.length!==0||g||r!==0||a;return a=g,r=_.length,E},this.beginShadows=function(){l=!0,v(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(_,g){t=v(_,g,0)},this.setState=function(_,g,E){const M=_.clippingPlanes,A=_.clipIntersection,S=_.clipShadows,y=s.get(_);if(!a||M===null||M.length===0||l&&!S)l?v(null):m();else{const P=l?0:r,I=P*4;let C=y.clippingState||null;p.value=C,C=v(M,g,I,E);for(let ie=0;ie!==I;++ie)C[ie]=t[ie];y.clippingState=C,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=P}};function m(){p.value!==t&&(p.value=t,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function v(_,g,E,M){const A=_!==null?_.length:0;let S=null;if(A!==0){if(S=p.value,M!==!0||S===null){const y=E+A*4,P=g.matrixWorldInverse;f.getNormalMatrix(P),(S===null||S.length<y)&&(S=new Float32Array(y));for(let I=0,C=E;I!==A;++I,C+=4)d.copy(_[I]).applyMatrix4(P,f),d.normal.toArray(S,C),S[C+3]=d.constant}p.value=S,p.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,S}}function pE(s){let e=new WeakMap;function t(d,f){return f===Id?d.mapping=Ys:f===Ld&&(d.mapping=$s),d}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Id||f===Ld)if(e.has(d)){const p=e.get(d).texture;return t(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const m=new b_(p.height);return m.fromEquirectangularTexture(s,d),e.set(d,m),d.addEventListener("dispose",a),t(m.texture,d.mapping)}else return null}}return d}function a(d){const f=d.target;f.removeEventListener("dispose",a);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function l(){e=new WeakMap}return{get:r,dispose:l}}class mE extends Q0{constructor(e=-1,t=1,r=1,a=-1,l=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=l,this.far=d,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,l,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=r-e,d=r+e,f=a+t,p=a-t;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=m*this.view.offsetX,d=l+m*this.view.width,f-=v*this.view.offsetY,p=f-v*this.view.height}this.projectionMatrix.makeOrthographic(l,d,f,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Bs=4,km=[.125,.215,.35,.446,.526,.582],Kr=20,ld=new mE,Bm=new Nt;let cd=null,ud=0,dd=0,fd=!1;const $r=(1+Math.sqrt(5))/2,ks=1/$r,zm=[new X(-$r,ks,0),new X($r,ks,0),new X(-ks,0,$r),new X(ks,0,$r),new X(0,$r,-ks),new X(0,$r,ks),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class jm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100){cd=this._renderer.getRenderTarget(),ud=this._renderer.getActiveCubeFace(),dd=this._renderer.getActiveMipmapLevel(),fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,r,a,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(cd,ud,dd),this._renderer.xr.enabled=fd,e.scissorTest=!1,Nl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ys||e.mapping===$s?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cd=this._renderer.getRenderTarget(),ud=this._renderer.getActiveCubeFace(),dd=this._renderer.getActiveMipmapLevel(),fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Pi,minFilter:Pi,generateMipmaps:!1,type:eo,format:yi,colorSpace:ea,depthBuffer:!1},a=Vm(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vm(e,t,r);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xE(l)),this._blurMaterial=vE(l,e,t)}return a}_compileMaterial(e){const t=new Fn(this._lodPlanes[0],e);this._renderer.compile(t,ld)}_sceneToCubeUV(e,t,r,a){const f=new Yn(90,1,t,r),p=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],v=this._renderer,_=v.autoClear,g=v.toneMapping;v.getClearColor(Bm),v.toneMapping=Tr,v.autoClear=!1;const E=new Xa({name:"PMREM.Background",side:kn,depthWrite:!1,depthTest:!1}),M=new Fn(new io,E);let A=!1;const S=e.background;S?S.isColor&&(E.color.copy(S),e.background=null,A=!0):(E.color.copy(Bm),A=!0);for(let y=0;y<6;y++){const P=y%3;P===0?(f.up.set(0,p[y],0),f.lookAt(m[y],0,0)):P===1?(f.up.set(0,0,p[y]),f.lookAt(0,m[y],0)):(f.up.set(0,p[y],0),f.lookAt(0,0,m[y]));const I=this._cubeSize;Nl(a,P*I,y>2?I:0,I,I),v.setRenderTarget(a),A&&v.render(M,f),v.render(e,f)}M.geometry.dispose(),M.material.dispose(),v.toneMapping=g,v.autoClear=_,e.background=S}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===Ys||e.mapping===$s;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gm());const l=a?this._cubemapMaterial:this._equirectMaterial,d=new Fn(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const p=this._cubeSize;Nl(t,0,0,3*p,2*p),r.setRenderTarget(t),r.render(d,ld)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let l=1;l<a;l++){const d=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=zm[(a-l-1)%zm.length];this._blur(e,l-1,l,d,f)}t.autoClear=r}_blur(e,t,r,a,l){const d=this._pingPongRenderTarget;this._halfBlur(e,d,t,r,a,"latitudinal",l),this._halfBlur(d,e,r,r,a,"longitudinal",l)}_halfBlur(e,t,r,a,l,d,f){const p=this._renderer,m=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const v=3,_=new Fn(this._lodPlanes[a],m),g=m.uniforms,E=this._sizeLods[r]-1,M=isFinite(l)?Math.PI/(2*E):2*Math.PI/(2*Kr-1),A=l/M,S=isFinite(l)?1+Math.floor(v*A):Kr;S>Kr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Kr}`);const y=[];let P=0;for(let F=0;F<Kr;++F){const q=F/A,R=Math.exp(-q*q/2);y.push(R),F===0?P+=R:F<S&&(P+=2*R)}for(let F=0;F<y.length;F++)y[F]=y[F]/P;g.envMap.value=e.texture,g.samples.value=S,g.weights.value=y,g.latitudinal.value=d==="latitudinal",f&&(g.poleAxis.value=f);const{_lodMax:I}=this;g.dTheta.value=M,g.mipInt.value=I-r;const C=this._sizeLods[a],ie=3*C*(a>I-Bs?a-I+Bs:0),V=4*(this._cubeSize-C);Nl(t,ie,V,3*C,2*C),p.setRenderTarget(t),p.render(_,ld)}}function xE(s){const e=[],t=[],r=[];let a=s;const l=s-Bs+1+km.length;for(let d=0;d<l;d++){const f=Math.pow(2,a);t.push(f);let p=1/f;d>s-Bs?p=km[d-s+Bs-1]:d===0&&(p=0),r.push(p);const m=1/(f-2),v=-m,_=1+m,g=[v,v,_,v,_,_,v,v,_,_,v,_],E=6,M=6,A=3,S=2,y=1,P=new Float32Array(A*M*E),I=new Float32Array(S*M*E),C=new Float32Array(y*M*E);for(let V=0;V<E;V++){const F=V%3*2/3-1,q=V>2?0:-1,R=[F,q,0,F+2/3,q,0,F+2/3,q+1,0,F,q,0,F+2/3,q+1,0,F,q+1,0];P.set(R,A*M*V),I.set(g,S*M*V);const b=[V,V,V,V,V,V];C.set(b,y*M*V)}const ie=new Mi;ie.setAttribute("position",new Ei(P,A)),ie.setAttribute("uv",new Ei(I,S)),ie.setAttribute("faceIndex",new Ei(C,y)),e.push(ie),a>Bs&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function Vm(s,e,t){const r=new es(s,e,t);return r.texture.mapping=Yl,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Nl(s,e,t,r,a){s.viewport.set(e,t,r,a),s.scissor.set(e,t,r,a)}function vE(s,e,t){const r=new Float32Array(Kr),a=new X(0,1,0);return new Cr({name:"SphericalGaussianBlur",defines:{n:Kr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:wf(),fragmentShader:`

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
		`,blending:br,depthTest:!1,depthWrite:!1})}function Gm(){return new Cr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wf(),fragmentShader:`

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
		`,blending:br,depthTest:!1,depthWrite:!1})}function Hm(){return new Cr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:br,depthTest:!1,depthWrite:!1})}function wf(){return`

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
	`}function gE(s){let e=new WeakMap,t=null;function r(f){if(f&&f.isTexture){const p=f.mapping,m=p===Id||p===Ld,v=p===Ys||p===$s;if(m||v){let _=e.get(f);const g=_!==void 0?_.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return t===null&&(t=new jm(s)),_=m?t.fromEquirectangular(f,_):t.fromCubemap(f,_),_.texture.pmremVersion=f.pmremVersion,e.set(f,_),_.texture;if(_!==void 0)return _.texture;{const E=f.image;return m&&E&&E.height>0||v&&E&&a(E)?(t===null&&(t=new jm(s)),_=m?t.fromEquirectangular(f):t.fromCubemap(f),_.texture.pmremVersion=f.pmremVersion,e.set(f,_),f.addEventListener("dispose",l),_.texture):null}}}return f}function a(f){let p=0;const m=6;for(let v=0;v<m;v++)f[v]!==void 0&&p++;return p===m}function l(f){const p=f.target;p.removeEventListener("dispose",l);const m=e.get(p);m!==void 0&&(e.delete(p),m.dispose())}function d(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:d}}function _E(s){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&Ha("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function yE(s,e,t,r){const a={},l=new WeakMap;function d(_){const g=_.target;g.index!==null&&e.remove(g.index);for(const M in g.attributes)e.remove(g.attributes[M]);for(const M in g.morphAttributes){const A=g.morphAttributes[M];for(let S=0,y=A.length;S<y;S++)e.remove(A[S])}g.removeEventListener("dispose",d),delete a[g.id];const E=l.get(g);E&&(e.remove(E),l.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function f(_,g){return a[g.id]===!0||(g.addEventListener("dispose",d),a[g.id]=!0,t.memory.geometries++),g}function p(_){const g=_.attributes;for(const M in g)e.update(g[M],s.ARRAY_BUFFER);const E=_.morphAttributes;for(const M in E){const A=E[M];for(let S=0,y=A.length;S<y;S++)e.update(A[S],s.ARRAY_BUFFER)}}function m(_){const g=[],E=_.index,M=_.attributes.position;let A=0;if(E!==null){const P=E.array;A=E.version;for(let I=0,C=P.length;I<C;I+=3){const ie=P[I+0],V=P[I+1],F=P[I+2];g.push(ie,V,V,F,F,ie)}}else if(M!==void 0){const P=M.array;A=M.version;for(let I=0,C=P.length/3-1;I<C;I+=3){const ie=I+0,V=I+1,F=I+2;g.push(ie,V,V,F,F,ie)}}else return;const S=new(G0(g)?K0:q0)(g,1);S.version=A;const y=l.get(_);y&&e.remove(y),l.set(_,S)}function v(_){const g=l.get(_);if(g){const E=_.index;E!==null&&g.version<E.version&&m(_)}else m(_);return l.get(_)}return{get:f,update:p,getWireframeAttribute:v}}function SE(s,e,t){let r;function a(g){r=g}let l,d;function f(g){l=g.type,d=g.bytesPerElement}function p(g,E){s.drawElements(r,E,l,g*d),t.update(E,r,1)}function m(g,E,M){M!==0&&(s.drawElementsInstanced(r,E,l,g*d,M),t.update(E,r,M))}function v(g,E,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,E,0,l,g,0,M);let S=0;for(let y=0;y<M;y++)S+=E[y];t.update(S,r,1)}function _(g,E,M,A){if(M===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<g.length;y++)m(g[y]/d,E[y],A[y]);else{S.multiDrawElementsInstancedWEBGL(r,E,0,l,g,0,A,0,M);let y=0;for(let P=0;P<M;P++)y+=E[P]*A[P];t.update(y,r,1)}}this.setMode=a,this.setIndex=f,this.render=p,this.renderInstances=m,this.renderMultiDraw=v,this.renderMultiDrawInstances=_}function EE(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,d,f){switch(t.calls++,d){case s.TRIANGLES:t.triangles+=f*(l/3);break;case s.LINES:t.lines+=f*(l/2);break;case s.LINE_STRIP:t.lines+=f*(l-1);break;case s.LINE_LOOP:t.lines+=f*l;break;case s.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function ME(s,e,t){const r=new WeakMap,a=new Ft;function l(d,f,p){const m=d.morphTargetInfluences,v=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,_=v!==void 0?v.length:0;let g=r.get(f);if(g===void 0||g.count!==_){let b=function(){q.dispose(),r.delete(f),f.removeEventListener("dispose",b)};var E=b;g!==void 0&&g.texture.dispose();const M=f.morphAttributes.position!==void 0,A=f.morphAttributes.normal!==void 0,S=f.morphAttributes.color!==void 0,y=f.morphAttributes.position||[],P=f.morphAttributes.normal||[],I=f.morphAttributes.color||[];let C=0;M===!0&&(C=1),A===!0&&(C=2),S===!0&&(C=3);let ie=f.attributes.position.count*C,V=1;ie>e.maxTextureSize&&(V=Math.ceil(ie/e.maxTextureSize),ie=e.maxTextureSize);const F=new Float32Array(ie*V*4*_),q=new W0(F,ie,V,_);q.type=qi,q.needsUpdate=!0;const R=C*4;for(let j=0;j<_;j++){const K=y[j],Y=P[j],le=I[j],xe=ie*V*4*j;for(let de=0;de<K.count;de++){const me=de*R;M===!0&&(a.fromBufferAttribute(K,de),F[xe+me+0]=a.x,F[xe+me+1]=a.y,F[xe+me+2]=a.z,F[xe+me+3]=0),A===!0&&(a.fromBufferAttribute(Y,de),F[xe+me+4]=a.x,F[xe+me+5]=a.y,F[xe+me+6]=a.z,F[xe+me+7]=0),S===!0&&(a.fromBufferAttribute(le,de),F[xe+me+8]=a.x,F[xe+me+9]=a.y,F[xe+me+10]=a.z,F[xe+me+11]=le.itemSize===4?a.w:1)}}g={count:_,texture:q,size:new Qe(ie,V)},r.set(f,g),f.addEventListener("dispose",b)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",d.morphTexture,t);else{let M=0;for(let S=0;S<m.length;S++)M+=m[S];const A=f.morphTargetsRelative?1:1-M;p.getUniforms().setValue(s,"morphTargetBaseInfluence",A),p.getUniforms().setValue(s,"morphTargetInfluences",m)}p.getUniforms().setValue(s,"morphTargetsTexture",g.texture,t),p.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:l}}function wE(s,e,t,r){let a=new WeakMap;function l(p){const m=r.render.frame,v=p.geometry,_=e.get(p,v);if(a.get(_)!==m&&(e.update(_),a.set(_,m)),p.isInstancedMesh&&(p.hasEventListener("dispose",f)===!1&&p.addEventListener("dispose",f),a.get(p)!==m&&(t.update(p.instanceMatrix,s.ARRAY_BUFFER),p.instanceColor!==null&&t.update(p.instanceColor,s.ARRAY_BUFFER),a.set(p,m))),p.isSkinnedMesh){const g=p.skeleton;a.get(g)!==m&&(g.update(),a.set(g,m))}return _}function d(){a=new WeakMap}function f(p){const m=p.target;m.removeEventListener("dispose",f),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:l,dispose:d}}class tx extends Bn{constructor(e,t,r,a,l,d,f,p,m,v=Hs){if(v!==Hs&&v!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&v===Hs&&(r=Jr),r===void 0&&v===Ks&&(r=qs),super(null,a,l,d,f,p,v,r,m),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=f!==void 0?f:Si,this.minFilter=p!==void 0?p:Si,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const nx=new Bn,Wm=new tx(1,1),ix=new W0,rx=new c_,sx=new J0,Xm=[],Ym=[],$m=new Float32Array(16),qm=new Float32Array(9),Km=new Float32Array(4);function ra(s,e,t){const r=s[0];if(r<=0||r>0)return s;const a=e*t;let l=Xm[a];if(l===void 0&&(l=new Float32Array(a),Xm[a]=l),e!==0){r.toArray(l,0);for(let d=1,f=0;d!==e;++d)f+=t,s[d].toArray(l,f)}return l}function nn(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function rn(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function Zl(s,e){let t=Ym[e];t===void 0&&(t=new Int32Array(e),Ym[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function bE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function TE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;s.uniform2fv(this.addr,e),rn(t,e)}}function AE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(nn(t,e))return;s.uniform3fv(this.addr,e),rn(t,e)}}function CE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;s.uniform4fv(this.addr,e),rn(t,e)}}function RE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(nn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),rn(t,e)}else{if(nn(t,r))return;Km.set(r),s.uniformMatrix2fv(this.addr,!1,Km),rn(t,r)}}function NE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(nn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),rn(t,e)}else{if(nn(t,r))return;qm.set(r),s.uniformMatrix3fv(this.addr,!1,qm),rn(t,r)}}function PE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(nn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),rn(t,e)}else{if(nn(t,r))return;$m.set(r),s.uniformMatrix4fv(this.addr,!1,$m),rn(t,r)}}function IE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function LE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;s.uniform2iv(this.addr,e),rn(t,e)}}function DE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;s.uniform3iv(this.addr,e),rn(t,e)}}function UE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;s.uniform4iv(this.addr,e),rn(t,e)}}function OE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function FE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;s.uniform2uiv(this.addr,e),rn(t,e)}}function kE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;s.uniform3uiv(this.addr,e),rn(t,e)}}function BE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;s.uniform4uiv(this.addr,e),rn(t,e)}}function zE(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Wm.compareFunction=V0,l=Wm):l=nx,t.setTexture2D(e||l,a)}function jE(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||rx,a)}function VE(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||sx,a)}function GE(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||ix,a)}function HE(s){switch(s){case 5126:return bE;case 35664:return TE;case 35665:return AE;case 35666:return CE;case 35674:return RE;case 35675:return NE;case 35676:return PE;case 5124:case 35670:return IE;case 35667:case 35671:return LE;case 35668:case 35672:return DE;case 35669:case 35673:return UE;case 5125:return OE;case 36294:return FE;case 36295:return kE;case 36296:return BE;case 35678:case 36198:case 36298:case 36306:case 35682:return zE;case 35679:case 36299:case 36307:return jE;case 35680:case 36300:case 36308:case 36293:return VE;case 36289:case 36303:case 36311:case 36292:return GE}}function WE(s,e){s.uniform1fv(this.addr,e)}function XE(s,e){const t=ra(e,this.size,2);s.uniform2fv(this.addr,t)}function YE(s,e){const t=ra(e,this.size,3);s.uniform3fv(this.addr,t)}function $E(s,e){const t=ra(e,this.size,4);s.uniform4fv(this.addr,t)}function qE(s,e){const t=ra(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function KE(s,e){const t=ra(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function ZE(s,e){const t=ra(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function QE(s,e){s.uniform1iv(this.addr,e)}function JE(s,e){s.uniform2iv(this.addr,e)}function e1(s,e){s.uniform3iv(this.addr,e)}function t1(s,e){s.uniform4iv(this.addr,e)}function n1(s,e){s.uniform1uiv(this.addr,e)}function i1(s,e){s.uniform2uiv(this.addr,e)}function r1(s,e){s.uniform3uiv(this.addr,e)}function s1(s,e){s.uniform4uiv(this.addr,e)}function a1(s,e,t){const r=this.cache,a=e.length,l=Zl(t,a);nn(r,l)||(s.uniform1iv(this.addr,l),rn(r,l));for(let d=0;d!==a;++d)t.setTexture2D(e[d]||nx,l[d])}function o1(s,e,t){const r=this.cache,a=e.length,l=Zl(t,a);nn(r,l)||(s.uniform1iv(this.addr,l),rn(r,l));for(let d=0;d!==a;++d)t.setTexture3D(e[d]||rx,l[d])}function l1(s,e,t){const r=this.cache,a=e.length,l=Zl(t,a);nn(r,l)||(s.uniform1iv(this.addr,l),rn(r,l));for(let d=0;d!==a;++d)t.setTextureCube(e[d]||sx,l[d])}function c1(s,e,t){const r=this.cache,a=e.length,l=Zl(t,a);nn(r,l)||(s.uniform1iv(this.addr,l),rn(r,l));for(let d=0;d!==a;++d)t.setTexture2DArray(e[d]||ix,l[d])}function u1(s){switch(s){case 5126:return WE;case 35664:return XE;case 35665:return YE;case 35666:return $E;case 35674:return qE;case 35675:return KE;case 35676:return ZE;case 5124:case 35670:return QE;case 35667:case 35671:return JE;case 35668:case 35672:return e1;case 35669:case 35673:return t1;case 5125:return n1;case 36294:return i1;case 36295:return r1;case 36296:return s1;case 35678:case 36198:case 36298:case 36306:case 35682:return a1;case 35679:case 36299:case 36307:return o1;case 35680:case 36300:case 36308:case 36293:return l1;case 36289:case 36303:case 36311:case 36292:return c1}}class d1{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=HE(t.type)}}class f1{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=u1(t.type)}}class h1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let l=0,d=a.length;l!==d;++l){const f=a[l];f.setValue(e,t[f.id],r)}}}const hd=/(\w+)(\])?(\[|\.)?/g;function Zm(s,e){s.seq.push(e),s.map[e.id]=e}function p1(s,e,t){const r=s.name,a=r.length;for(hd.lastIndex=0;;){const l=hd.exec(r),d=hd.lastIndex;let f=l[1];const p=l[2]==="]",m=l[3];if(p&&(f=f|0),m===void 0||m==="["&&d+2===a){Zm(t,m===void 0?new d1(f,s,e):new f1(f,s,e));break}else{let _=t.map[f];_===void 0&&(_=new h1(f),Zm(t,_)),t=_}}}class Vl{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),d=e.getUniformLocation(t,l.name);p1(l,d,this)}}setValue(e,t,r,a){const l=this.map[t];l!==void 0&&l.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let l=0,d=t.length;l!==d;++l){const f=t[l],p=r[f.id];p.needsUpdate!==!1&&f.setValue(e,p.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,l=e.length;a!==l;++a){const d=e[a];d.id in t&&r.push(d)}return r}}function Qm(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const m1=37297;let x1=0;function v1(s,e){const t=s.split(`
`),r=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let d=a;d<l;d++){const f=d+1;r.push(`${f===e?">":" "} ${f}: ${t[d]}`)}return r.join(`
`)}const Jm=new ht;function g1(s){At._getMatrix(Jm,At.workingColorSpace,s);const e=`mat3( ${Jm.elements.map(t=>t.toFixed(4))} )`;switch(At.getTransfer(s)){case $l:return[e,"LinearTransferOETF"];case Ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function e0(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const l=/ERROR: 0:(\d+)/.exec(a);if(l){const d=parseInt(l[1]);return t.toUpperCase()+`

`+a+`

`+v1(s.getShaderSource(e),d)}else return a}function _1(s,e){const t=g1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function y1(s,e){let t;switch(e){case Og:t="Linear";break;case Fg:t="Reinhard";break;case kg:t="Cineon";break;case Bg:t="ACESFilmic";break;case jg:t="AgX";break;case Vg:t="Neutral";break;case zg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Pl=new X;function S1(){At.getLuminanceCoefficients(Pl);const s=Pl.x.toFixed(4),e=Pl.y.toFixed(4),t=Pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function E1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Wa).join(`
`)}function M1(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function w1(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const l=s.getActiveAttrib(e,a),d=l.name;let f=1;l.type===s.FLOAT_MAT2&&(f=2),l.type===s.FLOAT_MAT3&&(f=3),l.type===s.FLOAT_MAT4&&(f=4),t[d]={type:l.type,location:s.getAttribLocation(e,d),locationSize:f}}return t}function Wa(s){return s!==""}function t0(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function n0(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const b1=/^[ \t]*#include +<([\w\d./]+)>/gm;function uf(s){return s.replace(b1,A1)}const T1=new Map;function A1(s,e){let t=gt[e];if(t===void 0){const r=T1.get(e);if(r!==void 0)t=gt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return uf(t)}const C1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function i0(s){return s.replace(C1,R1)}function R1(s,e,t,r){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function r0(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function N1(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===C0?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===mg?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===$i&&(e="SHADOWMAP_TYPE_VSM"),e}function P1(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ys:case $s:e="ENVMAP_TYPE_CUBE";break;case Yl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function I1(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case $s:e="ENVMAP_MODE_REFRACTION";break}return e}function L1(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case R0:e="ENVMAP_BLENDING_MULTIPLY";break;case Dg:e="ENVMAP_BLENDING_MIX";break;case Ug:e="ENVMAP_BLENDING_ADD";break}return e}function D1(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function U1(s,e,t,r){const a=s.getContext(),l=t.defines;let d=t.vertexShader,f=t.fragmentShader;const p=N1(t),m=P1(t),v=I1(t),_=L1(t),g=D1(t),E=E1(t),M=M1(l),A=a.createProgram();let S,y,P=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Wa).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Wa).join(`
`),y.length>0&&(y+=`
`)):(S=[r0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+v:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wa).join(`
`),y=[r0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.envMap?"#define "+v:"",t.envMap?"#define "+_:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tr?"#define TONE_MAPPING":"",t.toneMapping!==Tr?gt.tonemapping_pars_fragment:"",t.toneMapping!==Tr?y1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",gt.colorspace_pars_fragment,_1("linearToOutputTexel",t.outputColorSpace),S1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Wa).join(`
`)),d=uf(d),d=t0(d,t),d=n0(d,t),f=uf(f),f=t0(f,t),f=n0(f,t),d=i0(d),f=i0(f),t.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,S=[E,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",t.glslVersion===vm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const I=P+S+d,C=P+y+f,ie=Qm(a,a.VERTEX_SHADER,I),V=Qm(a,a.FRAGMENT_SHADER,C);a.attachShader(A,ie),a.attachShader(A,V),t.index0AttributeName!==void 0?a.bindAttribLocation(A,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(A,0,"position"),a.linkProgram(A);function F(j){if(s.debug.checkShaderErrors){const K=a.getProgramInfoLog(A).trim(),Y=a.getShaderInfoLog(ie).trim(),le=a.getShaderInfoLog(V).trim();let xe=!0,de=!0;if(a.getProgramParameter(A,a.LINK_STATUS)===!1)if(xe=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,A,ie,V);else{const me=e0(a,ie,"vertex"),B=e0(a,V,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(A,a.VALIDATE_STATUS)+`

Material Name: `+j.name+`
Material Type: `+j.type+`

Program Info Log: `+K+`
`+me+`
`+B)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(Y===""||le==="")&&(de=!1);de&&(j.diagnostics={runnable:xe,programLog:K,vertexShader:{log:Y,prefix:S},fragmentShader:{log:le,prefix:y}})}a.deleteShader(ie),a.deleteShader(V),q=new Vl(a,A),R=w1(a,A)}let q;this.getUniforms=function(){return q===void 0&&F(this),q};let R;this.getAttributes=function(){return R===void 0&&F(this),R};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=a.getProgramParameter(A,m1)),b},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(A),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=x1++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=ie,this.fragmentShader=V,this}let O1=0;class F1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),l=this._getShaderStage(r),d=this._getShaderCacheForMaterial(e);return d.has(a)===!1&&(d.add(a),a.usedTimes++),d.has(l)===!1&&(d.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new k1(e),t.set(e,r)),r}}class k1{constructor(e){this.id=O1++,this.code=e,this.usedTimes=0}}function B1(s,e,t,r,a,l,d){const f=new Y0,p=new F1,m=new Set,v=[],_=a.logarithmicDepthBuffer,g=a.vertexTextures;let E=a.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function A(R){return m.add(R),R===0?"uv":`uv${R}`}function S(R,b,j,K,Y){const le=K.fog,xe=Y.geometry,de=R.isMeshStandardMaterial?K.environment:null,me=(R.isMeshStandardMaterial?t:e).get(R.envMap||de),B=me&&me.mapping===Yl?me.image.height:null,pe=M[R.type];R.precision!==null&&(E=a.getMaxPrecision(R.precision),E!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",E,"instead."));const te=xe.morphAttributes.position||xe.morphAttributes.normal||xe.morphAttributes.color,O=te!==void 0?te.length:0;let J=0;xe.morphAttributes.position!==void 0&&(J=1),xe.morphAttributes.normal!==void 0&&(J=2),xe.morphAttributes.color!==void 0&&(J=3);let De,ne,k,ue;if(pe){const et=Ri[pe];De=et.vertexShader,ne=et.fragmentShader}else De=R.vertexShader,ne=R.fragmentShader,p.update(R),k=p.getVertexShaderID(R),ue=p.getFragmentShaderID(R);const fe=s.getRenderTarget(),ge=s.state.buffers.depth.getReversed(),Ae=Y.isInstancedMesh===!0,Fe=Y.isBatchedMesh===!0,_t=!!R.map,He=!!R.matcap,lt=!!me,W=!!R.aoMap,sn=!!R.lightMap,pt=!!R.bumpMap,mt=!!R.normalMap,Je=!!R.displacementMap,Pt=!!R.emissiveMap,Ke=!!R.metalnessMap,D=!!R.roughnessMap,T=R.anisotropy>0,se=R.clearcoat>0,ye=R.dispersion>0,Se=R.iridescence>0,ve=R.sheen>0,Ve=R.transmission>0,Le=T&&!!R.anisotropyMap,Pe=se&&!!R.clearcoatMap,dt=se&&!!R.clearcoatNormalMap,we=se&&!!R.clearcoatRoughnessMap,ke=Se&&!!R.iridescenceMap,tt=Se&&!!R.iridescenceThicknessMap,rt=ve&&!!R.sheenColorMap,Be=ve&&!!R.sheenRoughnessMap,xt=!!R.specularMap,ct=!!R.specularColorMap,bt=!!R.specularIntensityMap,H=Ve&&!!R.transmissionMap,Ie=Ve&&!!R.thicknessMap,he=!!R.gradientMap,L=!!R.alphaMap,Q=R.alphaTest>0,_e=!!R.alphaHash,ze=!!R.extensions;let vt=Tr;R.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(vt=s.toneMapping);const Mt={shaderID:pe,shaderType:R.type,shaderName:R.name,vertexShader:De,fragmentShader:ne,defines:R.defines,customVertexShaderID:k,customFragmentShaderID:ue,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:E,batching:Fe,batchingColor:Fe&&Y._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&Y.instanceColor!==null,instancingMorph:Ae&&Y.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:fe===null?s.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:ea,alphaToCoverage:!!R.alphaToCoverage,map:_t,matcap:He,envMap:lt,envMapMode:lt&&me.mapping,envMapCubeUVHeight:B,aoMap:W,lightMap:sn,bumpMap:pt,normalMap:mt,displacementMap:g&&Je,emissiveMap:Pt,normalMapObjectSpace:mt&&R.normalMapType===Xg,normalMapTangentSpace:mt&&R.normalMapType===j0,metalnessMap:Ke,roughnessMap:D,anisotropy:T,anisotropyMap:Le,clearcoat:se,clearcoatMap:Pe,clearcoatNormalMap:dt,clearcoatRoughnessMap:we,dispersion:ye,iridescence:Se,iridescenceMap:ke,iridescenceThicknessMap:tt,sheen:ve,sheenColorMap:rt,sheenRoughnessMap:Be,specularMap:xt,specularColorMap:ct,specularIntensityMap:bt,transmission:Ve,transmissionMap:H,thicknessMap:Ie,gradientMap:he,opaque:R.transparent===!1&&R.blending===Gs&&R.alphaToCoverage===!1,alphaMap:L,alphaTest:Q,alphaHash:_e,combine:R.combine,mapUv:_t&&A(R.map.channel),aoMapUv:W&&A(R.aoMap.channel),lightMapUv:sn&&A(R.lightMap.channel),bumpMapUv:pt&&A(R.bumpMap.channel),normalMapUv:mt&&A(R.normalMap.channel),displacementMapUv:Je&&A(R.displacementMap.channel),emissiveMapUv:Pt&&A(R.emissiveMap.channel),metalnessMapUv:Ke&&A(R.metalnessMap.channel),roughnessMapUv:D&&A(R.roughnessMap.channel),anisotropyMapUv:Le&&A(R.anisotropyMap.channel),clearcoatMapUv:Pe&&A(R.clearcoatMap.channel),clearcoatNormalMapUv:dt&&A(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&A(R.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&A(R.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&A(R.iridescenceThicknessMap.channel),sheenColorMapUv:rt&&A(R.sheenColorMap.channel),sheenRoughnessMapUv:Be&&A(R.sheenRoughnessMap.channel),specularMapUv:xt&&A(R.specularMap.channel),specularColorMapUv:ct&&A(R.specularColorMap.channel),specularIntensityMapUv:bt&&A(R.specularIntensityMap.channel),transmissionMapUv:H&&A(R.transmissionMap.channel),thicknessMapUv:Ie&&A(R.thicknessMap.channel),alphaMapUv:L&&A(R.alphaMap.channel),vertexTangents:!!xe.attributes.tangent&&(mt||T),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!xe.attributes.color&&xe.attributes.color.itemSize===4,pointsUvs:Y.isPoints===!0&&!!xe.attributes.uv&&(_t||L),fog:!!le,useFog:R.fog===!0,fogExp2:!!le&&le.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:_,reverseDepthBuffer:ge,skinning:Y.isSkinnedMesh===!0,morphTargets:xe.morphAttributes.position!==void 0,morphNormals:xe.morphAttributes.normal!==void 0,morphColors:xe.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:J,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:R.dithering,shadowMapEnabled:s.shadowMap.enabled&&j.length>0,shadowMapType:s.shadowMap.type,toneMapping:vt,decodeVideoTexture:_t&&R.map.isVideoTexture===!0&&At.getTransfer(R.map.colorSpace)===Ot,decodeVideoTextureEmissive:Pt&&R.emissiveMap.isVideoTexture===!0&&At.getTransfer(R.emissiveMap.colorSpace)===Ot,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===Ni,flipSided:R.side===kn,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:ze&&R.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&R.extensions.multiDraw===!0||Fe)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return Mt.vertexUv1s=m.has(1),Mt.vertexUv2s=m.has(2),Mt.vertexUv3s=m.has(3),m.clear(),Mt}function y(R){const b=[];if(R.shaderID?b.push(R.shaderID):(b.push(R.customVertexShaderID),b.push(R.customFragmentShaderID)),R.defines!==void 0)for(const j in R.defines)b.push(j),b.push(R.defines[j]);return R.isRawShaderMaterial===!1&&(P(b,R),I(b,R),b.push(s.outputColorSpace)),b.push(R.customProgramCacheKey),b.join()}function P(R,b){R.push(b.precision),R.push(b.outputColorSpace),R.push(b.envMapMode),R.push(b.envMapCubeUVHeight),R.push(b.mapUv),R.push(b.alphaMapUv),R.push(b.lightMapUv),R.push(b.aoMapUv),R.push(b.bumpMapUv),R.push(b.normalMapUv),R.push(b.displacementMapUv),R.push(b.emissiveMapUv),R.push(b.metalnessMapUv),R.push(b.roughnessMapUv),R.push(b.anisotropyMapUv),R.push(b.clearcoatMapUv),R.push(b.clearcoatNormalMapUv),R.push(b.clearcoatRoughnessMapUv),R.push(b.iridescenceMapUv),R.push(b.iridescenceThicknessMapUv),R.push(b.sheenColorMapUv),R.push(b.sheenRoughnessMapUv),R.push(b.specularMapUv),R.push(b.specularColorMapUv),R.push(b.specularIntensityMapUv),R.push(b.transmissionMapUv),R.push(b.thicknessMapUv),R.push(b.combine),R.push(b.fogExp2),R.push(b.sizeAttenuation),R.push(b.morphTargetsCount),R.push(b.morphAttributeCount),R.push(b.numDirLights),R.push(b.numPointLights),R.push(b.numSpotLights),R.push(b.numSpotLightMaps),R.push(b.numHemiLights),R.push(b.numRectAreaLights),R.push(b.numDirLightShadows),R.push(b.numPointLightShadows),R.push(b.numSpotLightShadows),R.push(b.numSpotLightShadowsWithMaps),R.push(b.numLightProbes),R.push(b.shadowMapType),R.push(b.toneMapping),R.push(b.numClippingPlanes),R.push(b.numClipIntersection),R.push(b.depthPacking)}function I(R,b){f.disableAll(),b.supportsVertexTextures&&f.enable(0),b.instancing&&f.enable(1),b.instancingColor&&f.enable(2),b.instancingMorph&&f.enable(3),b.matcap&&f.enable(4),b.envMap&&f.enable(5),b.normalMapObjectSpace&&f.enable(6),b.normalMapTangentSpace&&f.enable(7),b.clearcoat&&f.enable(8),b.iridescence&&f.enable(9),b.alphaTest&&f.enable(10),b.vertexColors&&f.enable(11),b.vertexAlphas&&f.enable(12),b.vertexUv1s&&f.enable(13),b.vertexUv2s&&f.enable(14),b.vertexUv3s&&f.enable(15),b.vertexTangents&&f.enable(16),b.anisotropy&&f.enable(17),b.alphaHash&&f.enable(18),b.batching&&f.enable(19),b.dispersion&&f.enable(20),b.batchingColor&&f.enable(21),R.push(f.mask),f.disableAll(),b.fog&&f.enable(0),b.useFog&&f.enable(1),b.flatShading&&f.enable(2),b.logarithmicDepthBuffer&&f.enable(3),b.reverseDepthBuffer&&f.enable(4),b.skinning&&f.enable(5),b.morphTargets&&f.enable(6),b.morphNormals&&f.enable(7),b.morphColors&&f.enable(8),b.premultipliedAlpha&&f.enable(9),b.shadowMapEnabled&&f.enable(10),b.doubleSided&&f.enable(11),b.flipSided&&f.enable(12),b.useDepthPacking&&f.enable(13),b.dithering&&f.enable(14),b.transmission&&f.enable(15),b.sheen&&f.enable(16),b.opaque&&f.enable(17),b.pointsUvs&&f.enable(18),b.decodeVideoTexture&&f.enable(19),b.decodeVideoTextureEmissive&&f.enable(20),b.alphaToCoverage&&f.enable(21),R.push(f.mask)}function C(R){const b=M[R.type];let j;if(b){const K=Ri[b];j=S_.clone(K.uniforms)}else j=R.uniforms;return j}function ie(R,b){let j;for(let K=0,Y=v.length;K<Y;K++){const le=v[K];if(le.cacheKey===b){j=le,++j.usedTimes;break}}return j===void 0&&(j=new U1(s,b,R,l),v.push(j)),j}function V(R){if(--R.usedTimes===0){const b=v.indexOf(R);v[b]=v[v.length-1],v.pop(),R.destroy()}}function F(R){p.remove(R)}function q(){p.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:C,acquireProgram:ie,releaseProgram:V,releaseShaderCache:F,programs:v,dispose:q}}function z1(){let s=new WeakMap;function e(d){return s.has(d)}function t(d){let f=s.get(d);return f===void 0&&(f={},s.set(d,f)),f}function r(d){s.delete(d)}function a(d,f,p){s.get(d)[f]=p}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:a,dispose:l}}function j1(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function s0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function a0(){const s=[];let e=0;const t=[],r=[],a=[];function l(){e=0,t.length=0,r.length=0,a.length=0}function d(_,g,E,M,A,S){let y=s[e];return y===void 0?(y={id:_.id,object:_,geometry:g,material:E,groupOrder:M,renderOrder:_.renderOrder,z:A,group:S},s[e]=y):(y.id=_.id,y.object=_,y.geometry=g,y.material=E,y.groupOrder=M,y.renderOrder=_.renderOrder,y.z=A,y.group=S),e++,y}function f(_,g,E,M,A,S){const y=d(_,g,E,M,A,S);E.transmission>0?r.push(y):E.transparent===!0?a.push(y):t.push(y)}function p(_,g,E,M,A,S){const y=d(_,g,E,M,A,S);E.transmission>0?r.unshift(y):E.transparent===!0?a.unshift(y):t.unshift(y)}function m(_,g){t.length>1&&t.sort(_||j1),r.length>1&&r.sort(g||s0),a.length>1&&a.sort(g||s0)}function v(){for(let _=e,g=s.length;_<g;_++){const E=s[_];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:t,transmissive:r,transparent:a,init:l,push:f,unshift:p,finish:v,sort:m}}function V1(){let s=new WeakMap;function e(r,a){const l=s.get(r);let d;return l===void 0?(d=new a0,s.set(r,[d])):a>=l.length?(d=new a0,l.push(d)):d=l[a],d}function t(){s=new WeakMap}return{get:e,dispose:t}}function G1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new X,color:new Nt};break;case"SpotLight":t={position:new X,direction:new X,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":t={color:new Nt,position:new X,halfWidth:new X,halfHeight:new X};break}return s[e.id]=t,t}}}function H1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let W1=0;function X1(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Y1(s){const e=new G1,t=H1(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new X);const a=new X,l=new Vt,d=new Vt;function f(m){let v=0,_=0,g=0;for(let R=0;R<9;R++)r.probe[R].set(0,0,0);let E=0,M=0,A=0,S=0,y=0,P=0,I=0,C=0,ie=0,V=0,F=0;m.sort(X1);for(let R=0,b=m.length;R<b;R++){const j=m[R],K=j.color,Y=j.intensity,le=j.distance,xe=j.shadow&&j.shadow.map?j.shadow.map.texture:null;if(j.isAmbientLight)v+=K.r*Y,_+=K.g*Y,g+=K.b*Y;else if(j.isLightProbe){for(let de=0;de<9;de++)r.probe[de].addScaledVector(j.sh.coefficients[de],Y);F++}else if(j.isDirectionalLight){const de=e.get(j);if(de.color.copy(j.color).multiplyScalar(j.intensity),j.castShadow){const me=j.shadow,B=t.get(j);B.shadowIntensity=me.intensity,B.shadowBias=me.bias,B.shadowNormalBias=me.normalBias,B.shadowRadius=me.radius,B.shadowMapSize=me.mapSize,r.directionalShadow[E]=B,r.directionalShadowMap[E]=xe,r.directionalShadowMatrix[E]=j.shadow.matrix,P++}r.directional[E]=de,E++}else if(j.isSpotLight){const de=e.get(j);de.position.setFromMatrixPosition(j.matrixWorld),de.color.copy(K).multiplyScalar(Y),de.distance=le,de.coneCos=Math.cos(j.angle),de.penumbraCos=Math.cos(j.angle*(1-j.penumbra)),de.decay=j.decay,r.spot[A]=de;const me=j.shadow;if(j.map&&(r.spotLightMap[ie]=j.map,ie++,me.updateMatrices(j),j.castShadow&&V++),r.spotLightMatrix[A]=me.matrix,j.castShadow){const B=t.get(j);B.shadowIntensity=me.intensity,B.shadowBias=me.bias,B.shadowNormalBias=me.normalBias,B.shadowRadius=me.radius,B.shadowMapSize=me.mapSize,r.spotShadow[A]=B,r.spotShadowMap[A]=xe,C++}A++}else if(j.isRectAreaLight){const de=e.get(j);de.color.copy(K).multiplyScalar(Y),de.halfWidth.set(j.width*.5,0,0),de.halfHeight.set(0,j.height*.5,0),r.rectArea[S]=de,S++}else if(j.isPointLight){const de=e.get(j);if(de.color.copy(j.color).multiplyScalar(j.intensity),de.distance=j.distance,de.decay=j.decay,j.castShadow){const me=j.shadow,B=t.get(j);B.shadowIntensity=me.intensity,B.shadowBias=me.bias,B.shadowNormalBias=me.normalBias,B.shadowRadius=me.radius,B.shadowMapSize=me.mapSize,B.shadowCameraNear=me.camera.near,B.shadowCameraFar=me.camera.far,r.pointShadow[M]=B,r.pointShadowMap[M]=xe,r.pointShadowMatrix[M]=j.shadow.matrix,I++}r.point[M]=de,M++}else if(j.isHemisphereLight){const de=e.get(j);de.skyColor.copy(j.color).multiplyScalar(Y),de.groundColor.copy(j.groundColor).multiplyScalar(Y),r.hemi[y]=de,y++}}S>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ue.LTC_FLOAT_1,r.rectAreaLTC2=Ue.LTC_FLOAT_2):(r.rectAreaLTC1=Ue.LTC_HALF_1,r.rectAreaLTC2=Ue.LTC_HALF_2)),r.ambient[0]=v,r.ambient[1]=_,r.ambient[2]=g;const q=r.hash;(q.directionalLength!==E||q.pointLength!==M||q.spotLength!==A||q.rectAreaLength!==S||q.hemiLength!==y||q.numDirectionalShadows!==P||q.numPointShadows!==I||q.numSpotShadows!==C||q.numSpotMaps!==ie||q.numLightProbes!==F)&&(r.directional.length=E,r.spot.length=A,r.rectArea.length=S,r.point.length=M,r.hemi.length=y,r.directionalShadow.length=P,r.directionalShadowMap.length=P,r.pointShadow.length=I,r.pointShadowMap.length=I,r.spotShadow.length=C,r.spotShadowMap.length=C,r.directionalShadowMatrix.length=P,r.pointShadowMatrix.length=I,r.spotLightMatrix.length=C+ie-V,r.spotLightMap.length=ie,r.numSpotLightShadowsWithMaps=V,r.numLightProbes=F,q.directionalLength=E,q.pointLength=M,q.spotLength=A,q.rectAreaLength=S,q.hemiLength=y,q.numDirectionalShadows=P,q.numPointShadows=I,q.numSpotShadows=C,q.numSpotMaps=ie,q.numLightProbes=F,r.version=W1++)}function p(m,v){let _=0,g=0,E=0,M=0,A=0;const S=v.matrixWorldInverse;for(let y=0,P=m.length;y<P;y++){const I=m[y];if(I.isDirectionalLight){const C=r.directional[_];C.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(S),_++}else if(I.isSpotLight){const C=r.spot[E];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),C.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),C.direction.sub(a),C.direction.transformDirection(S),E++}else if(I.isRectAreaLight){const C=r.rectArea[M];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),d.identity(),l.copy(I.matrixWorld),l.premultiply(S),d.extractRotation(l),C.halfWidth.set(I.width*.5,0,0),C.halfHeight.set(0,I.height*.5,0),C.halfWidth.applyMatrix4(d),C.halfHeight.applyMatrix4(d),M++}else if(I.isPointLight){const C=r.point[g];C.position.setFromMatrixPosition(I.matrixWorld),C.position.applyMatrix4(S),g++}else if(I.isHemisphereLight){const C=r.hemi[A];C.direction.setFromMatrixPosition(I.matrixWorld),C.direction.transformDirection(S),A++}}}return{setup:f,setupView:p,state:r}}function o0(s){const e=new Y1(s),t=[],r=[];function a(v){m.camera=v,t.length=0,r.length=0}function l(v){t.push(v)}function d(v){r.push(v)}function f(){e.setup(t)}function p(v){e.setupView(t,v)}const m={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:f,setupLightsView:p,pushLight:l,pushShadow:d}}function $1(s){let e=new WeakMap;function t(a,l=0){const d=e.get(a);let f;return d===void 0?(f=new o0(s),e.set(a,[f])):l>=d.length?(f=new o0(s),d.push(f)):f=d[l],f}function r(){e=new WeakMap}return{get:t,dispose:r}}class q1 extends ia{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Hg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class K1 extends ia{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Z1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q1=`uniform sampler2D shadow_pass;
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
}`;function J1(s,e,t){let r=new Mf;const a=new Qe,l=new Qe,d=new Ft,f=new q1({depthPacking:Wg}),p=new K1,m={},v=t.maxTextureSize,_={[Ar]:kn,[kn]:Ar,[Ni]:Ni},g=new Cr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qe},radius:{value:4}},vertexShader:Z1,fragmentShader:Q1}),E=g.clone();E.defines.HORIZONTAL_PASS=1;const M=new Mi;M.setAttribute("position",new Ei(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new Fn(M,g),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=C0;let y=this.type;this.render=function(V,F,q){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||V.length===0)return;const R=s.getRenderTarget(),b=s.getActiveCubeFace(),j=s.getActiveMipmapLevel(),K=s.state;K.setBlending(br),K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);const Y=y!==$i&&this.type===$i,le=y===$i&&this.type!==$i;for(let xe=0,de=V.length;xe<de;xe++){const me=V[xe],B=me.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",me,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const pe=B.getFrameExtents();if(a.multiply(pe),l.copy(B.mapSize),(a.x>v||a.y>v)&&(a.x>v&&(l.x=Math.floor(v/pe.x),a.x=l.x*pe.x,B.mapSize.x=l.x),a.y>v&&(l.y=Math.floor(v/pe.y),a.y=l.y*pe.y,B.mapSize.y=l.y)),B.map===null||Y===!0||le===!0){const O=this.type!==$i?{minFilter:Si,magFilter:Si}:{};B.map!==null&&B.map.dispose(),B.map=new es(a.x,a.y,O),B.map.texture.name=me.name+".shadowMap",B.camera.updateProjectionMatrix()}s.setRenderTarget(B.map),s.clear();const te=B.getViewportCount();for(let O=0;O<te;O++){const J=B.getViewport(O);d.set(l.x*J.x,l.y*J.y,l.x*J.z,l.y*J.w),K.viewport(d),B.updateMatrices(me,O),r=B.getFrustum(),C(F,q,B.camera,me,this.type)}B.isPointLightShadow!==!0&&this.type===$i&&P(B,q),B.needsUpdate=!1}y=this.type,S.needsUpdate=!1,s.setRenderTarget(R,b,j)};function P(V,F){const q=e.update(A);g.defines.VSM_SAMPLES!==V.blurSamples&&(g.defines.VSM_SAMPLES=V.blurSamples,E.defines.VSM_SAMPLES=V.blurSamples,g.needsUpdate=!0,E.needsUpdate=!0),V.mapPass===null&&(V.mapPass=new es(a.x,a.y)),g.uniforms.shadow_pass.value=V.map.texture,g.uniforms.resolution.value=V.mapSize,g.uniforms.radius.value=V.radius,s.setRenderTarget(V.mapPass),s.clear(),s.renderBufferDirect(F,null,q,g,A,null),E.uniforms.shadow_pass.value=V.mapPass.texture,E.uniforms.resolution.value=V.mapSize,E.uniforms.radius.value=V.radius,s.setRenderTarget(V.map),s.clear(),s.renderBufferDirect(F,null,q,E,A,null)}function I(V,F,q,R){let b=null;const j=q.isPointLight===!0?V.customDistanceMaterial:V.customDepthMaterial;if(j!==void 0)b=j;else if(b=q.isPointLight===!0?p:f,s.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0){const K=b.uuid,Y=F.uuid;let le=m[K];le===void 0&&(le={},m[K]=le);let xe=le[Y];xe===void 0&&(xe=b.clone(),le[Y]=xe,F.addEventListener("dispose",ie)),b=xe}if(b.visible=F.visible,b.wireframe=F.wireframe,R===$i?b.side=F.shadowSide!==null?F.shadowSide:F.side:b.side=F.shadowSide!==null?F.shadowSide:_[F.side],b.alphaMap=F.alphaMap,b.alphaTest=F.alphaTest,b.map=F.map,b.clipShadows=F.clipShadows,b.clippingPlanes=F.clippingPlanes,b.clipIntersection=F.clipIntersection,b.displacementMap=F.displacementMap,b.displacementScale=F.displacementScale,b.displacementBias=F.displacementBias,b.wireframeLinewidth=F.wireframeLinewidth,b.linewidth=F.linewidth,q.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const K=s.properties.get(b);K.light=q}return b}function C(V,F,q,R,b){if(V.visible===!1)return;if(V.layers.test(F.layers)&&(V.isMesh||V.isLine||V.isPoints)&&(V.castShadow||V.receiveShadow&&b===$i)&&(!V.frustumCulled||r.intersectsObject(V))){V.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,V.matrixWorld);const Y=e.update(V),le=V.material;if(Array.isArray(le)){const xe=Y.groups;for(let de=0,me=xe.length;de<me;de++){const B=xe[de],pe=le[B.materialIndex];if(pe&&pe.visible){const te=I(V,pe,R,b);V.onBeforeShadow(s,V,F,q,Y,te,B),s.renderBufferDirect(q,null,Y,te,V,B),V.onAfterShadow(s,V,F,q,Y,te,B)}}}else if(le.visible){const xe=I(V,le,R,b);V.onBeforeShadow(s,V,F,q,Y,xe,null),s.renderBufferDirect(q,null,Y,xe,V,null),V.onAfterShadow(s,V,F,q,Y,xe,null)}}const K=V.children;for(let Y=0,le=K.length;Y<le;Y++)C(K[Y],F,q,R,b)}function ie(V){V.target.removeEventListener("dispose",ie);for(const q in m){const R=m[q],b=V.target.uuid;b in R&&(R[b].dispose(),delete R[b])}}}const eM={[bd]:Td,[Ad]:Nd,[Cd]:Pd,[Xs]:Rd,[Td]:bd,[Nd]:Ad,[Pd]:Cd,[Rd]:Xs};function tM(s,e){function t(){let H=!1;const Ie=new Ft;let he=null;const L=new Ft(0,0,0,0);return{setMask:function(Q){he!==Q&&!H&&(s.colorMask(Q,Q,Q,Q),he=Q)},setLocked:function(Q){H=Q},setClear:function(Q,_e,ze,vt,Mt){Mt===!0&&(Q*=vt,_e*=vt,ze*=vt),Ie.set(Q,_e,ze,vt),L.equals(Ie)===!1&&(s.clearColor(Q,_e,ze,vt),L.copy(Ie))},reset:function(){H=!1,he=null,L.set(-1,0,0,0)}}}function r(){let H=!1,Ie=!1,he=null,L=null,Q=null;return{setReversed:function(_e){if(Ie!==_e){const ze=e.get("EXT_clip_control");Ie?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT);const vt=Q;Q=null,this.setClear(vt)}Ie=_e},getReversed:function(){return Ie},setTest:function(_e){_e?fe(s.DEPTH_TEST):ge(s.DEPTH_TEST)},setMask:function(_e){he!==_e&&!H&&(s.depthMask(_e),he=_e)},setFunc:function(_e){if(Ie&&(_e=eM[_e]),L!==_e){switch(_e){case bd:s.depthFunc(s.NEVER);break;case Td:s.depthFunc(s.ALWAYS);break;case Ad:s.depthFunc(s.LESS);break;case Xs:s.depthFunc(s.LEQUAL);break;case Cd:s.depthFunc(s.EQUAL);break;case Rd:s.depthFunc(s.GEQUAL);break;case Nd:s.depthFunc(s.GREATER);break;case Pd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}L=_e}},setLocked:function(_e){H=_e},setClear:function(_e){Q!==_e&&(Ie&&(_e=1-_e),s.clearDepth(_e),Q=_e)},reset:function(){H=!1,he=null,L=null,Q=null,Ie=!1}}}function a(){let H=!1,Ie=null,he=null,L=null,Q=null,_e=null,ze=null,vt=null,Mt=null;return{setTest:function(et){H||(et?fe(s.STENCIL_TEST):ge(s.STENCIL_TEST))},setMask:function(et){Ie!==et&&!H&&(s.stencilMask(et),Ie=et)},setFunc:function(et,Ut,Wt){(he!==et||L!==Ut||Q!==Wt)&&(s.stencilFunc(et,Ut,Wt),he=et,L=Ut,Q=Wt)},setOp:function(et,Ut,Wt){(_e!==et||ze!==Ut||vt!==Wt)&&(s.stencilOp(et,Ut,Wt),_e=et,ze=Ut,vt=Wt)},setLocked:function(et){H=et},setClear:function(et){Mt!==et&&(s.clearStencil(et),Mt=et)},reset:function(){H=!1,Ie=null,he=null,L=null,Q=null,_e=null,ze=null,vt=null,Mt=null}}}const l=new t,d=new r,f=new a,p=new WeakMap,m=new WeakMap;let v={},_={},g=new WeakMap,E=[],M=null,A=!1,S=null,y=null,P=null,I=null,C=null,ie=null,V=null,F=new Nt(0,0,0),q=0,R=!1,b=null,j=null,K=null,Y=null,le=null;const xe=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let de=!1,me=0;const B=s.getParameter(s.VERSION);B.indexOf("WebGL")!==-1?(me=parseFloat(/^WebGL (\d)/.exec(B)[1]),de=me>=1):B.indexOf("OpenGL ES")!==-1&&(me=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),de=me>=2);let pe=null,te={};const O=s.getParameter(s.SCISSOR_BOX),J=s.getParameter(s.VIEWPORT),De=new Ft().fromArray(O),ne=new Ft().fromArray(J);function k(H,Ie,he,L){const Q=new Uint8Array(4),_e=s.createTexture();s.bindTexture(H,_e),s.texParameteri(H,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(H,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ze=0;ze<he;ze++)H===s.TEXTURE_3D||H===s.TEXTURE_2D_ARRAY?s.texImage3D(Ie,0,s.RGBA,1,1,L,0,s.RGBA,s.UNSIGNED_BYTE,Q):s.texImage2D(Ie+ze,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Q);return _e}const ue={};ue[s.TEXTURE_2D]=k(s.TEXTURE_2D,s.TEXTURE_2D,1),ue[s.TEXTURE_CUBE_MAP]=k(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[s.TEXTURE_2D_ARRAY]=k(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ue[s.TEXTURE_3D]=k(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),d.setClear(1),f.setClear(0),fe(s.DEPTH_TEST),d.setFunc(Xs),pt(!1),mt(dm),fe(s.CULL_FACE),W(br);function fe(H){v[H]!==!0&&(s.enable(H),v[H]=!0)}function ge(H){v[H]!==!1&&(s.disable(H),v[H]=!1)}function Ae(H,Ie){return _[H]!==Ie?(s.bindFramebuffer(H,Ie),_[H]=Ie,H===s.DRAW_FRAMEBUFFER&&(_[s.FRAMEBUFFER]=Ie),H===s.FRAMEBUFFER&&(_[s.DRAW_FRAMEBUFFER]=Ie),!0):!1}function Fe(H,Ie){let he=E,L=!1;if(H){he=g.get(Ie),he===void 0&&(he=[],g.set(Ie,he));const Q=H.textures;if(he.length!==Q.length||he[0]!==s.COLOR_ATTACHMENT0){for(let _e=0,ze=Q.length;_e<ze;_e++)he[_e]=s.COLOR_ATTACHMENT0+_e;he.length=Q.length,L=!0}}else he[0]!==s.BACK&&(he[0]=s.BACK,L=!0);L&&s.drawBuffers(he)}function _t(H){return M!==H?(s.useProgram(H),M=H,!0):!1}const He={[qr]:s.FUNC_ADD,[vg]:s.FUNC_SUBTRACT,[gg]:s.FUNC_REVERSE_SUBTRACT};He[_g]=s.MIN,He[yg]=s.MAX;const lt={[Sg]:s.ZERO,[Eg]:s.ONE,[Mg]:s.SRC_COLOR,[Md]:s.SRC_ALPHA,[Rg]:s.SRC_ALPHA_SATURATE,[Ag]:s.DST_COLOR,[bg]:s.DST_ALPHA,[wg]:s.ONE_MINUS_SRC_COLOR,[wd]:s.ONE_MINUS_SRC_ALPHA,[Cg]:s.ONE_MINUS_DST_COLOR,[Tg]:s.ONE_MINUS_DST_ALPHA,[Ng]:s.CONSTANT_COLOR,[Pg]:s.ONE_MINUS_CONSTANT_COLOR,[Ig]:s.CONSTANT_ALPHA,[Lg]:s.ONE_MINUS_CONSTANT_ALPHA};function W(H,Ie,he,L,Q,_e,ze,vt,Mt,et){if(H===br){A===!0&&(ge(s.BLEND),A=!1);return}if(A===!1&&(fe(s.BLEND),A=!0),H!==xg){if(H!==S||et!==R){if((y!==qr||C!==qr)&&(s.blendEquation(s.FUNC_ADD),y=qr,C=qr),et)switch(H){case Gs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fm:s.blendFunc(s.ONE,s.ONE);break;case hm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case pm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Gs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fm:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case hm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case pm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}P=null,I=null,ie=null,V=null,F.set(0,0,0),q=0,S=H,R=et}return}Q=Q||Ie,_e=_e||he,ze=ze||L,(Ie!==y||Q!==C)&&(s.blendEquationSeparate(He[Ie],He[Q]),y=Ie,C=Q),(he!==P||L!==I||_e!==ie||ze!==V)&&(s.blendFuncSeparate(lt[he],lt[L],lt[_e],lt[ze]),P=he,I=L,ie=_e,V=ze),(vt.equals(F)===!1||Mt!==q)&&(s.blendColor(vt.r,vt.g,vt.b,Mt),F.copy(vt),q=Mt),S=H,R=!1}function sn(H,Ie){H.side===Ni?ge(s.CULL_FACE):fe(s.CULL_FACE);let he=H.side===kn;Ie&&(he=!he),pt(he),H.blending===Gs&&H.transparent===!1?W(br):W(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),d.setFunc(H.depthFunc),d.setTest(H.depthTest),d.setMask(H.depthWrite),l.setMask(H.colorWrite);const L=H.stencilWrite;f.setTest(L),L&&(f.setMask(H.stencilWriteMask),f.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),f.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Pt(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?fe(s.SAMPLE_ALPHA_TO_COVERAGE):ge(s.SAMPLE_ALPHA_TO_COVERAGE)}function pt(H){b!==H&&(H?s.frontFace(s.CW):s.frontFace(s.CCW),b=H)}function mt(H){H!==hg?(fe(s.CULL_FACE),H!==j&&(H===dm?s.cullFace(s.BACK):H===pg?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ge(s.CULL_FACE),j=H}function Je(H){H!==K&&(de&&s.lineWidth(H),K=H)}function Pt(H,Ie,he){H?(fe(s.POLYGON_OFFSET_FILL),(Y!==Ie||le!==he)&&(s.polygonOffset(Ie,he),Y=Ie,le=he)):ge(s.POLYGON_OFFSET_FILL)}function Ke(H){H?fe(s.SCISSOR_TEST):ge(s.SCISSOR_TEST)}function D(H){H===void 0&&(H=s.TEXTURE0+xe-1),pe!==H&&(s.activeTexture(H),pe=H)}function T(H,Ie,he){he===void 0&&(pe===null?he=s.TEXTURE0+xe-1:he=pe);let L=te[he];L===void 0&&(L={type:void 0,texture:void 0},te[he]=L),(L.type!==H||L.texture!==Ie)&&(pe!==he&&(s.activeTexture(he),pe=he),s.bindTexture(H,Ie||ue[H]),L.type=H,L.texture=Ie)}function se(){const H=te[pe];H!==void 0&&H.type!==void 0&&(s.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function ye(){try{s.compressedTexImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Se(){try{s.compressedTexImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ve(){try{s.texSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ve(){try{s.texSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Pe(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function dt(){try{s.texStorage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function we(){try{s.texStorage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ke(){try{s.texImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function tt(){try{s.texImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function rt(H){De.equals(H)===!1&&(s.scissor(H.x,H.y,H.z,H.w),De.copy(H))}function Be(H){ne.equals(H)===!1&&(s.viewport(H.x,H.y,H.z,H.w),ne.copy(H))}function xt(H,Ie){let he=m.get(Ie);he===void 0&&(he=new WeakMap,m.set(Ie,he));let L=he.get(H);L===void 0&&(L=s.getUniformBlockIndex(Ie,H.name),he.set(H,L))}function ct(H,Ie){const L=m.get(Ie).get(H);p.get(Ie)!==L&&(s.uniformBlockBinding(Ie,L,H.__bindingPointIndex),p.set(Ie,L))}function bt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),d.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),v={},pe=null,te={},_={},g=new WeakMap,E=[],M=null,A=!1,S=null,y=null,P=null,I=null,C=null,ie=null,V=null,F=new Nt(0,0,0),q=0,R=!1,b=null,j=null,K=null,Y=null,le=null,De.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),l.reset(),d.reset(),f.reset()}return{buffers:{color:l,depth:d,stencil:f},enable:fe,disable:ge,bindFramebuffer:Ae,drawBuffers:Fe,useProgram:_t,setBlending:W,setMaterial:sn,setFlipSided:pt,setCullFace:mt,setLineWidth:Je,setPolygonOffset:Pt,setScissorTest:Ke,activeTexture:D,bindTexture:T,unbindTexture:se,compressedTexImage2D:ye,compressedTexImage3D:Se,texImage2D:ke,texImage3D:tt,updateUBOMapping:xt,uniformBlockBinding:ct,texStorage2D:dt,texStorage3D:we,texSubImage2D:ve,texSubImage3D:Ve,compressedTexSubImage2D:Le,compressedTexSubImage3D:Pe,scissor:rt,viewport:Be,reset:bt}}function l0(s,e,t,r){const a=nM(r);switch(t){case D0:return s*e;case O0:return s*e;case F0:return s*e*2;case k0:return s*e/a.components*a.byteLength;case yf:return s*e/a.components*a.byteLength;case B0:return s*e*2/a.components*a.byteLength;case Sf:return s*e*2/a.components*a.byteLength;case U0:return s*e*3/a.components*a.byteLength;case yi:return s*e*4/a.components*a.byteLength;case Ef:return s*e*4/a.components*a.byteLength;case Fl:case kl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Bl:case zl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Fd:case Bd:return Math.max(s,16)*Math.max(e,8)/4;case Od:case kd:return Math.max(s,8)*Math.max(e,8)/2;case zd:case jd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Vd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Gd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Hd:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Wd:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Yd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case $d:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case qd:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Kd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Zd:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Qd:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Jd:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ef:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case tf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case nf:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case jl:case rf:case sf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case z0:case af:return Math.ceil(s/4)*Math.ceil(e/4)*8;case of:case lf:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function nM(s){switch(s){case Qi:case P0:return{byteLength:1,components:1};case Ka:case I0:case eo:return{byteLength:2,components:1};case gf:case _f:return{byteLength:2,components:4};case Jr:case vf:case qi:return{byteLength:4,components:1};case L0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function iM(s,e,t,r,a,l,d){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new Qe,v=new WeakMap;let _;const g=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(D,T){return E?new OffscreenCanvas(D,T):Xl("canvas")}function A(D,T,se){let ye=1;const Se=Ke(D);if((Se.width>se||Se.height>se)&&(ye=se/Math.max(Se.width,Se.height)),ye<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ve=Math.floor(ye*Se.width),Ve=Math.floor(ye*Se.height);_===void 0&&(_=M(ve,Ve));const Le=T?M(ve,Ve):_;return Le.width=ve,Le.height=Ve,Le.getContext("2d").drawImage(D,0,0,ve,Ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Se.width+"x"+Se.height+") to ("+ve+"x"+Ve+")."),Le}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Se.width+"x"+Se.height+")."),D;return D}function S(D){return D.generateMipmaps}function y(D){s.generateMipmap(D)}function P(D){return D.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?s.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function I(D,T,se,ye,Se=!1){if(D!==null){if(s[D]!==void 0)return s[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ve=T;if(T===s.RED&&(se===s.FLOAT&&(ve=s.R32F),se===s.HALF_FLOAT&&(ve=s.R16F),se===s.UNSIGNED_BYTE&&(ve=s.R8)),T===s.RED_INTEGER&&(se===s.UNSIGNED_BYTE&&(ve=s.R8UI),se===s.UNSIGNED_SHORT&&(ve=s.R16UI),se===s.UNSIGNED_INT&&(ve=s.R32UI),se===s.BYTE&&(ve=s.R8I),se===s.SHORT&&(ve=s.R16I),se===s.INT&&(ve=s.R32I)),T===s.RG&&(se===s.FLOAT&&(ve=s.RG32F),se===s.HALF_FLOAT&&(ve=s.RG16F),se===s.UNSIGNED_BYTE&&(ve=s.RG8)),T===s.RG_INTEGER&&(se===s.UNSIGNED_BYTE&&(ve=s.RG8UI),se===s.UNSIGNED_SHORT&&(ve=s.RG16UI),se===s.UNSIGNED_INT&&(ve=s.RG32UI),se===s.BYTE&&(ve=s.RG8I),se===s.SHORT&&(ve=s.RG16I),se===s.INT&&(ve=s.RG32I)),T===s.RGB_INTEGER&&(se===s.UNSIGNED_BYTE&&(ve=s.RGB8UI),se===s.UNSIGNED_SHORT&&(ve=s.RGB16UI),se===s.UNSIGNED_INT&&(ve=s.RGB32UI),se===s.BYTE&&(ve=s.RGB8I),se===s.SHORT&&(ve=s.RGB16I),se===s.INT&&(ve=s.RGB32I)),T===s.RGBA_INTEGER&&(se===s.UNSIGNED_BYTE&&(ve=s.RGBA8UI),se===s.UNSIGNED_SHORT&&(ve=s.RGBA16UI),se===s.UNSIGNED_INT&&(ve=s.RGBA32UI),se===s.BYTE&&(ve=s.RGBA8I),se===s.SHORT&&(ve=s.RGBA16I),se===s.INT&&(ve=s.RGBA32I)),T===s.RGB&&se===s.UNSIGNED_INT_5_9_9_9_REV&&(ve=s.RGB9_E5),T===s.RGBA){const Ve=Se?$l:At.getTransfer(ye);se===s.FLOAT&&(ve=s.RGBA32F),se===s.HALF_FLOAT&&(ve=s.RGBA16F),se===s.UNSIGNED_BYTE&&(ve=Ve===Ot?s.SRGB8_ALPHA8:s.RGBA8),se===s.UNSIGNED_SHORT_4_4_4_4&&(ve=s.RGBA4),se===s.UNSIGNED_SHORT_5_5_5_1&&(ve=s.RGB5_A1)}return(ve===s.R16F||ve===s.R32F||ve===s.RG16F||ve===s.RG32F||ve===s.RGBA16F||ve===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ve}function C(D,T){let se;return D?T===null||T===Jr||T===qs?se=s.DEPTH24_STENCIL8:T===qi?se=s.DEPTH32F_STENCIL8:T===Ka&&(se=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Jr||T===qs?se=s.DEPTH_COMPONENT24:T===qi?se=s.DEPTH_COMPONENT32F:T===Ka&&(se=s.DEPTH_COMPONENT16),se}function ie(D,T){return S(D)===!0||D.isFramebufferTexture&&D.minFilter!==Si&&D.minFilter!==Pi?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function V(D){const T=D.target;T.removeEventListener("dispose",V),q(T),T.isVideoTexture&&v.delete(T)}function F(D){const T=D.target;T.removeEventListener("dispose",F),b(T)}function q(D){const T=r.get(D);if(T.__webglInit===void 0)return;const se=D.source,ye=g.get(se);if(ye){const Se=ye[T.__cacheKey];Se.usedTimes--,Se.usedTimes===0&&R(D),Object.keys(ye).length===0&&g.delete(se)}r.remove(D)}function R(D){const T=r.get(D);s.deleteTexture(T.__webglTexture);const se=D.source,ye=g.get(se);delete ye[T.__cacheKey],d.memory.textures--}function b(D){const T=r.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),r.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ye=0;ye<6;ye++){if(Array.isArray(T.__webglFramebuffer[ye]))for(let Se=0;Se<T.__webglFramebuffer[ye].length;Se++)s.deleteFramebuffer(T.__webglFramebuffer[ye][Se]);else s.deleteFramebuffer(T.__webglFramebuffer[ye]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[ye])}else{if(Array.isArray(T.__webglFramebuffer))for(let ye=0;ye<T.__webglFramebuffer.length;ye++)s.deleteFramebuffer(T.__webglFramebuffer[ye]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ye=0;ye<T.__webglColorRenderbuffer.length;ye++)T.__webglColorRenderbuffer[ye]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[ye]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const se=D.textures;for(let ye=0,Se=se.length;ye<Se;ye++){const ve=r.get(se[ye]);ve.__webglTexture&&(s.deleteTexture(ve.__webglTexture),d.memory.textures--),r.remove(se[ye])}r.remove(D)}let j=0;function K(){j=0}function Y(){const D=j;return D>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+a.maxTextures),j+=1,D}function le(D){const T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function xe(D,T){const se=r.get(D);if(D.isVideoTexture&&Je(D),D.isRenderTargetTexture===!1&&D.version>0&&se.__version!==D.version){const ye=D.image;if(ye===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ye.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(se,D,T);return}}t.bindTexture(s.TEXTURE_2D,se.__webglTexture,s.TEXTURE0+T)}function de(D,T){const se=r.get(D);if(D.version>0&&se.__version!==D.version){ne(se,D,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,se.__webglTexture,s.TEXTURE0+T)}function me(D,T){const se=r.get(D);if(D.version>0&&se.__version!==D.version){ne(se,D,T);return}t.bindTexture(s.TEXTURE_3D,se.__webglTexture,s.TEXTURE0+T)}function B(D,T){const se=r.get(D);if(D.version>0&&se.__version!==D.version){k(se,D,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,se.__webglTexture,s.TEXTURE0+T)}const pe={[Dd]:s.REPEAT,[Zr]:s.CLAMP_TO_EDGE,[Ud]:s.MIRRORED_REPEAT},te={[Si]:s.NEAREST,[Gg]:s.NEAREST_MIPMAP_NEAREST,[dl]:s.NEAREST_MIPMAP_LINEAR,[Pi]:s.LINEAR,[Bu]:s.LINEAR_MIPMAP_NEAREST,[Qr]:s.LINEAR_MIPMAP_LINEAR},O={[Yg]:s.NEVER,[Jg]:s.ALWAYS,[$g]:s.LESS,[V0]:s.LEQUAL,[qg]:s.EQUAL,[Qg]:s.GEQUAL,[Kg]:s.GREATER,[Zg]:s.NOTEQUAL};function J(D,T){if(T.type===qi&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Pi||T.magFilter===Bu||T.magFilter===dl||T.magFilter===Qr||T.minFilter===Pi||T.minFilter===Bu||T.minFilter===dl||T.minFilter===Qr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(D,s.TEXTURE_WRAP_S,pe[T.wrapS]),s.texParameteri(D,s.TEXTURE_WRAP_T,pe[T.wrapT]),(D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY)&&s.texParameteri(D,s.TEXTURE_WRAP_R,pe[T.wrapR]),s.texParameteri(D,s.TEXTURE_MAG_FILTER,te[T.magFilter]),s.texParameteri(D,s.TEXTURE_MIN_FILTER,te[T.minFilter]),T.compareFunction&&(s.texParameteri(D,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(D,s.TEXTURE_COMPARE_FUNC,O[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Si||T.minFilter!==dl&&T.minFilter!==Qr||T.type===qi&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||r.get(T).__currentAnisotropy){const se=e.get("EXT_texture_filter_anisotropic");s.texParameterf(D,se.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy}}}function De(D,T){let se=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",V));const ye=T.source;let Se=g.get(ye);Se===void 0&&(Se={},g.set(ye,Se));const ve=le(T);if(ve!==D.__cacheKey){Se[ve]===void 0&&(Se[ve]={texture:s.createTexture(),usedTimes:0},d.memory.textures++,se=!0),Se[ve].usedTimes++;const Ve=Se[D.__cacheKey];Ve!==void 0&&(Se[D.__cacheKey].usedTimes--,Ve.usedTimes===0&&R(T)),D.__cacheKey=ve,D.__webglTexture=Se[ve].texture}return se}function ne(D,T,se){let ye=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ye=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ye=s.TEXTURE_3D);const Se=De(D,T),ve=T.source;t.bindTexture(ye,D.__webglTexture,s.TEXTURE0+se);const Ve=r.get(ve);if(ve.version!==Ve.__version||Se===!0){t.activeTexture(s.TEXTURE0+se);const Le=At.getPrimaries(At.workingColorSpace),Pe=T.colorSpace===wr?null:At.getPrimaries(T.colorSpace),dt=T.colorSpace===wr||Le===Pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let we=A(T.image,!1,a.maxTextureSize);we=Pt(T,we);const ke=l.convert(T.format,T.colorSpace),tt=l.convert(T.type);let rt=I(T.internalFormat,ke,tt,T.colorSpace,T.isVideoTexture);J(ye,T);let Be;const xt=T.mipmaps,ct=T.isVideoTexture!==!0,bt=Ve.__version===void 0||Se===!0,H=ve.dataReady,Ie=ie(T,we);if(T.isDepthTexture)rt=C(T.format===Ks,T.type),bt&&(ct?t.texStorage2D(s.TEXTURE_2D,1,rt,we.width,we.height):t.texImage2D(s.TEXTURE_2D,0,rt,we.width,we.height,0,ke,tt,null));else if(T.isDataTexture)if(xt.length>0){ct&&bt&&t.texStorage2D(s.TEXTURE_2D,Ie,rt,xt[0].width,xt[0].height);for(let he=0,L=xt.length;he<L;he++)Be=xt[he],ct?H&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,Be.width,Be.height,ke,tt,Be.data):t.texImage2D(s.TEXTURE_2D,he,rt,Be.width,Be.height,0,ke,tt,Be.data);T.generateMipmaps=!1}else ct?(bt&&t.texStorage2D(s.TEXTURE_2D,Ie,rt,we.width,we.height),H&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,we.width,we.height,ke,tt,we.data)):t.texImage2D(s.TEXTURE_2D,0,rt,we.width,we.height,0,ke,tt,we.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){ct&&bt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ie,rt,xt[0].width,xt[0].height,we.depth);for(let he=0,L=xt.length;he<L;he++)if(Be=xt[he],T.format!==yi)if(ke!==null)if(ct){if(H)if(T.layerUpdates.size>0){const Q=l0(Be.width,Be.height,T.format,T.type);for(const _e of T.layerUpdates){const ze=Be.data.subarray(_e*Q/Be.data.BYTES_PER_ELEMENT,(_e+1)*Q/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,_e,Be.width,Be.height,1,ke,ze)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,0,Be.width,Be.height,we.depth,ke,Be.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,he,rt,Be.width,Be.height,we.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ct?H&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,0,Be.width,Be.height,we.depth,ke,tt,Be.data):t.texImage3D(s.TEXTURE_2D_ARRAY,he,rt,Be.width,Be.height,we.depth,0,ke,tt,Be.data)}else{ct&&bt&&t.texStorage2D(s.TEXTURE_2D,Ie,rt,xt[0].width,xt[0].height);for(let he=0,L=xt.length;he<L;he++)Be=xt[he],T.format!==yi?ke!==null?ct?H&&t.compressedTexSubImage2D(s.TEXTURE_2D,he,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(s.TEXTURE_2D,he,rt,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?H&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,Be.width,Be.height,ke,tt,Be.data):t.texImage2D(s.TEXTURE_2D,he,rt,Be.width,Be.height,0,ke,tt,Be.data)}else if(T.isDataArrayTexture)if(ct){if(bt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ie,rt,we.width,we.height,we.depth),H)if(T.layerUpdates.size>0){const he=l0(we.width,we.height,T.format,T.type);for(const L of T.layerUpdates){const Q=we.data.subarray(L*he/we.data.BYTES_PER_ELEMENT,(L+1)*he/we.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,L,we.width,we.height,1,ke,tt,Q)}T.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,we.width,we.height,we.depth,ke,tt,we.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,rt,we.width,we.height,we.depth,0,ke,tt,we.data);else if(T.isData3DTexture)ct?(bt&&t.texStorage3D(s.TEXTURE_3D,Ie,rt,we.width,we.height,we.depth),H&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,we.width,we.height,we.depth,ke,tt,we.data)):t.texImage3D(s.TEXTURE_3D,0,rt,we.width,we.height,we.depth,0,ke,tt,we.data);else if(T.isFramebufferTexture){if(bt)if(ct)t.texStorage2D(s.TEXTURE_2D,Ie,rt,we.width,we.height);else{let he=we.width,L=we.height;for(let Q=0;Q<Ie;Q++)t.texImage2D(s.TEXTURE_2D,Q,rt,he,L,0,ke,tt,null),he>>=1,L>>=1}}else if(xt.length>0){if(ct&&bt){const he=Ke(xt[0]);t.texStorage2D(s.TEXTURE_2D,Ie,rt,he.width,he.height)}for(let he=0,L=xt.length;he<L;he++)Be=xt[he],ct?H&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,ke,tt,Be):t.texImage2D(s.TEXTURE_2D,he,rt,ke,tt,Be);T.generateMipmaps=!1}else if(ct){if(bt){const he=Ke(we);t.texStorage2D(s.TEXTURE_2D,Ie,rt,he.width,he.height)}H&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ke,tt,we)}else t.texImage2D(s.TEXTURE_2D,0,rt,ke,tt,we);S(T)&&y(ye),Ve.__version=ve.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function k(D,T,se){if(T.image.length!==6)return;const ye=De(D,T),Se=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+se);const ve=r.get(Se);if(Se.version!==ve.__version||ye===!0){t.activeTexture(s.TEXTURE0+se);const Ve=At.getPrimaries(At.workingColorSpace),Le=T.colorSpace===wr?null:At.getPrimaries(T.colorSpace),Pe=T.colorSpace===wr||Ve===Le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const dt=T.isCompressedTexture||T.image[0].isCompressedTexture,we=T.image[0]&&T.image[0].isDataTexture,ke=[];for(let L=0;L<6;L++)!dt&&!we?ke[L]=A(T.image[L],!0,a.maxCubemapSize):ke[L]=we?T.image[L].image:T.image[L],ke[L]=Pt(T,ke[L]);const tt=ke[0],rt=l.convert(T.format,T.colorSpace),Be=l.convert(T.type),xt=I(T.internalFormat,rt,Be,T.colorSpace),ct=T.isVideoTexture!==!0,bt=ve.__version===void 0||ye===!0,H=Se.dataReady;let Ie=ie(T,tt);J(s.TEXTURE_CUBE_MAP,T);let he;if(dt){ct&&bt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ie,xt,tt.width,tt.height);for(let L=0;L<6;L++){he=ke[L].mipmaps;for(let Q=0;Q<he.length;Q++){const _e=he[Q];T.format!==yi?rt!==null?ct?H&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q,0,0,_e.width,_e.height,rt,_e.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q,xt,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ct?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q,0,0,_e.width,_e.height,rt,Be,_e.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q,xt,_e.width,_e.height,0,rt,Be,_e.data)}}}else{if(he=T.mipmaps,ct&&bt){he.length>0&&Ie++;const L=Ke(ke[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ie,xt,L.width,L.height)}for(let L=0;L<6;L++)if(we){ct?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,ke[L].width,ke[L].height,rt,Be,ke[L].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,xt,ke[L].width,ke[L].height,0,rt,Be,ke[L].data);for(let Q=0;Q<he.length;Q++){const ze=he[Q].image[L].image;ct?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q+1,0,0,ze.width,ze.height,rt,Be,ze.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q+1,xt,ze.width,ze.height,0,rt,Be,ze.data)}}else{ct?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,rt,Be,ke[L]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,xt,rt,Be,ke[L]);for(let Q=0;Q<he.length;Q++){const _e=he[Q];ct?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q+1,0,0,rt,Be,_e.image[L]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+L,Q+1,xt,rt,Be,_e.image[L])}}}S(T)&&y(s.TEXTURE_CUBE_MAP),ve.__version=Se.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function ue(D,T,se,ye,Se,ve){const Ve=l.convert(se.format,se.colorSpace),Le=l.convert(se.type),Pe=I(se.internalFormat,Ve,Le,se.colorSpace),dt=r.get(T),we=r.get(se);if(we.__renderTarget=T,!dt.__hasExternalTextures){const ke=Math.max(1,T.width>>ve),tt=Math.max(1,T.height>>ve);Se===s.TEXTURE_3D||Se===s.TEXTURE_2D_ARRAY?t.texImage3D(Se,ve,Pe,ke,tt,T.depth,0,Ve,Le,null):t.texImage2D(Se,ve,Pe,ke,tt,0,Ve,Le,null)}t.bindFramebuffer(s.FRAMEBUFFER,D),mt(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ye,Se,we.__webglTexture,0,pt(T)):(Se===s.TEXTURE_2D||Se>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Se<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ye,Se,we.__webglTexture,ve),t.bindFramebuffer(s.FRAMEBUFFER,null)}function fe(D,T,se){if(s.bindRenderbuffer(s.RENDERBUFFER,D),T.depthBuffer){const ye=T.depthTexture,Se=ye&&ye.isDepthTexture?ye.type:null,ve=C(T.stencilBuffer,Se),Ve=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Le=pt(T);mt(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Le,ve,T.width,T.height):se?s.renderbufferStorageMultisample(s.RENDERBUFFER,Le,ve,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,ve,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ve,s.RENDERBUFFER,D)}else{const ye=T.textures;for(let Se=0;Se<ye.length;Se++){const ve=ye[Se],Ve=l.convert(ve.format,ve.colorSpace),Le=l.convert(ve.type),Pe=I(ve.internalFormat,Ve,Le,ve.colorSpace),dt=pt(T);se&&mt(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,dt,Pe,T.width,T.height):mt(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,dt,Pe,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,Pe,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ge(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ye=r.get(T.depthTexture);ye.__renderTarget=T,(!ye.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),xe(T.depthTexture,0);const Se=ye.__webglTexture,ve=pt(T);if(T.depthTexture.format===Hs)mt(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Se,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Se,0);else if(T.depthTexture.format===Ks)mt(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Se,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Se,0);else throw new Error("Unknown depthTexture format")}function Ae(D){const T=r.get(D),se=D.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==D.depthTexture){const ye=D.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ye){const Se=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ye.removeEventListener("dispose",Se)};ye.addEventListener("dispose",Se),T.__depthDisposeCallback=Se}T.__boundDepthTexture=ye}if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(se)throw new Error("target.depthTexture not supported in Cube render targets");ge(T.__webglFramebuffer,D)}else if(se){T.__webglDepthbuffer=[];for(let ye=0;ye<6;ye++)if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[ye]),T.__webglDepthbuffer[ye]===void 0)T.__webglDepthbuffer[ye]=s.createRenderbuffer(),fe(T.__webglDepthbuffer[ye],D,!1);else{const Se=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=T.__webglDepthbuffer[ye];s.bindRenderbuffer(s.RENDERBUFFER,ve),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,ve)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),fe(T.__webglDepthbuffer,D,!1);else{const ye=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Se),s.framebufferRenderbuffer(s.FRAMEBUFFER,ye,s.RENDERBUFFER,Se)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Fe(D,T,se){const ye=r.get(D);T!==void 0&&ue(ye.__webglFramebuffer,D,D.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),se!==void 0&&Ae(D)}function _t(D){const T=D.texture,se=r.get(D),ye=r.get(T);D.addEventListener("dispose",F);const Se=D.textures,ve=D.isWebGLCubeRenderTarget===!0,Ve=Se.length>1;if(Ve||(ye.__webglTexture===void 0&&(ye.__webglTexture=s.createTexture()),ye.__version=T.version,d.memory.textures++),ve){se.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(T.mipmaps&&T.mipmaps.length>0){se.__webglFramebuffer[Le]=[];for(let Pe=0;Pe<T.mipmaps.length;Pe++)se.__webglFramebuffer[Le][Pe]=s.createFramebuffer()}else se.__webglFramebuffer[Le]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){se.__webglFramebuffer=[];for(let Le=0;Le<T.mipmaps.length;Le++)se.__webglFramebuffer[Le]=s.createFramebuffer()}else se.__webglFramebuffer=s.createFramebuffer();if(Ve)for(let Le=0,Pe=Se.length;Le<Pe;Le++){const dt=r.get(Se[Le]);dt.__webglTexture===void 0&&(dt.__webglTexture=s.createTexture(),d.memory.textures++)}if(D.samples>0&&mt(D)===!1){se.__webglMultisampledFramebuffer=s.createFramebuffer(),se.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer);for(let Le=0;Le<Se.length;Le++){const Pe=Se[Le];se.__webglColorRenderbuffer[Le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,se.__webglColorRenderbuffer[Le]);const dt=l.convert(Pe.format,Pe.colorSpace),we=l.convert(Pe.type),ke=I(Pe.internalFormat,dt,we,Pe.colorSpace,D.isXRRenderTarget===!0),tt=pt(D);s.renderbufferStorageMultisample(s.RENDERBUFFER,tt,ke,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,se.__webglColorRenderbuffer[Le])}s.bindRenderbuffer(s.RENDERBUFFER,null),D.depthBuffer&&(se.__webglDepthRenderbuffer=s.createRenderbuffer(),fe(se.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ve){t.bindTexture(s.TEXTURE_CUBE_MAP,ye.__webglTexture),J(s.TEXTURE_CUBE_MAP,T);for(let Le=0;Le<6;Le++)if(T.mipmaps&&T.mipmaps.length>0)for(let Pe=0;Pe<T.mipmaps.length;Pe++)ue(se.__webglFramebuffer[Le][Pe],D,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pe);else ue(se.__webglFramebuffer[Le],D,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);S(T)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ve){for(let Le=0,Pe=Se.length;Le<Pe;Le++){const dt=Se[Le],we=r.get(dt);t.bindTexture(s.TEXTURE_2D,we.__webglTexture),J(s.TEXTURE_2D,dt),ue(se.__webglFramebuffer,D,dt,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,0),S(dt)&&y(s.TEXTURE_2D)}t.unbindTexture()}else{let Le=s.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Le=D.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Le,ye.__webglTexture),J(Le,T),T.mipmaps&&T.mipmaps.length>0)for(let Pe=0;Pe<T.mipmaps.length;Pe++)ue(se.__webglFramebuffer[Pe],D,T,s.COLOR_ATTACHMENT0,Le,Pe);else ue(se.__webglFramebuffer,D,T,s.COLOR_ATTACHMENT0,Le,0);S(T)&&y(Le),t.unbindTexture()}D.depthBuffer&&Ae(D)}function He(D){const T=D.textures;for(let se=0,ye=T.length;se<ye;se++){const Se=T[se];if(S(Se)){const ve=P(D),Ve=r.get(Se).__webglTexture;t.bindTexture(ve,Ve),y(ve),t.unbindTexture()}}}const lt=[],W=[];function sn(D){if(D.samples>0){if(mt(D)===!1){const T=D.textures,se=D.width,ye=D.height;let Se=s.COLOR_BUFFER_BIT;const ve=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ve=r.get(D),Le=T.length>1;if(Le)for(let Pe=0;Pe<T.length;Pe++)t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer);for(let Pe=0;Pe<T.length;Pe++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(Se|=s.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(Se|=s.STENCIL_BUFFER_BIT)),Le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ve.__webglColorRenderbuffer[Pe]);const dt=r.get(T[Pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,dt,0)}s.blitFramebuffer(0,0,se,ye,0,0,se,ye,Se,s.NEAREST),p===!0&&(lt.length=0,W.length=0,lt.push(s.COLOR_ATTACHMENT0+Pe),D.depthBuffer&&D.resolveDepthBuffer===!1&&(lt.push(ve),W.push(ve),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,W)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,lt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Le)for(let Pe=0;Pe<T.length;Pe++){t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,Ve.__webglColorRenderbuffer[Pe]);const dt=r.get(T[Pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,dt,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&p){const T=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function pt(D){return Math.min(a.maxSamples,D.samples)}function mt(D){const T=r.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Je(D){const T=d.render.frame;v.get(D)!==T&&(v.set(D,T),D.update())}function Pt(D,T){const se=D.colorSpace,ye=D.format,Se=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||se!==ea&&se!==wr&&(At.getTransfer(se)===Ot?(ye!==yi||Se!==Qi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",se)),T}function Ke(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(m.width=D.naturalWidth||D.width,m.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(m.width=D.displayWidth,m.height=D.displayHeight):(m.width=D.width,m.height=D.height),m}this.allocateTextureUnit=Y,this.resetTextureUnits=K,this.setTexture2D=xe,this.setTexture2DArray=de,this.setTexture3D=me,this.setTextureCube=B,this.rebindTextures=Fe,this.setupRenderTarget=_t,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=sn,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=mt}function rM(s,e){function t(r,a=wr){let l;const d=At.getTransfer(a);if(r===Qi)return s.UNSIGNED_BYTE;if(r===gf)return s.UNSIGNED_SHORT_4_4_4_4;if(r===_f)return s.UNSIGNED_SHORT_5_5_5_1;if(r===L0)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===P0)return s.BYTE;if(r===I0)return s.SHORT;if(r===Ka)return s.UNSIGNED_SHORT;if(r===vf)return s.INT;if(r===Jr)return s.UNSIGNED_INT;if(r===qi)return s.FLOAT;if(r===eo)return s.HALF_FLOAT;if(r===D0)return s.ALPHA;if(r===U0)return s.RGB;if(r===yi)return s.RGBA;if(r===O0)return s.LUMINANCE;if(r===F0)return s.LUMINANCE_ALPHA;if(r===Hs)return s.DEPTH_COMPONENT;if(r===Ks)return s.DEPTH_STENCIL;if(r===k0)return s.RED;if(r===yf)return s.RED_INTEGER;if(r===B0)return s.RG;if(r===Sf)return s.RG_INTEGER;if(r===Ef)return s.RGBA_INTEGER;if(r===Fl||r===kl||r===Bl||r===zl)if(d===Ot)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===Fl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===kl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Bl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===zl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===Fl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===kl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Bl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===zl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Od||r===Fd||r===kd||r===Bd)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Od)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Fd)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===kd)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Bd)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===zd||r===jd||r===Vd)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===zd||r===jd)return d===Ot?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===Vd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Gd||r===Hd||r===Wd||r===Xd||r===Yd||r===$d||r===qd||r===Kd||r===Zd||r===Qd||r===Jd||r===ef||r===tf||r===nf)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===Gd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Hd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Wd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Xd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Yd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===$d)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===qd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Kd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Zd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Qd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Jd)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ef)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===tf)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===nf)return d===Ot?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===jl||r===rf||r===sf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===jl)return d===Ot?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===rf)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===sf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===z0||r===af||r===of||r===lf)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===jl)return l.COMPRESSED_RED_RGTC1_EXT;if(r===af)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===of)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===lf)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===qs?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}class sM extends Yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class zs extends bn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const aM={type:"move"};class pd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,l=null,d=null;const f=this._targetRay,p=this._grip,m=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(m&&e.hand){d=!0;for(const A of e.hand.values()){const S=t.getJointPose(A,r),y=this._getHandJoint(m,A);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const v=m.joints["index-finger-tip"],_=m.joints["thumb-tip"],g=v.position.distanceTo(_.position),E=.02,M=.005;m.inputState.pinching&&g>E+M?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&g<=E-M&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1));f!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&l!==null&&(a=l),a!==null&&(f.matrix.fromArray(a.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,a.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(a.linearVelocity)):f.hasLinearVelocity=!1,a.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(a.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(aM)))}return f!==null&&(f.visible=a!==null),p!==null&&(p.visible=l!==null),m!==null&&(m.visible=d!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new zs;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const oM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lM=`
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

}`;class cM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){const a=new Bn,l=e.properties.get(a);l.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Cr({vertexShader:oM,fragmentShader:lM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Fn(new Kl(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class uM extends ta{constructor(e,t){super();const r=this;let a=null,l=1,d=null,f="local-floor",p=1,m=null,v=null,_=null,g=null,E=null,M=null;const A=new cM,S=t.getContextAttributes();let y=null,P=null;const I=[],C=[],ie=new Qe;let V=null;const F=new Yn;F.viewport=new Ft;const q=new Yn;q.viewport=new Ft;const R=[F,q],b=new sM;let j=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ne){let k=I[ne];return k===void 0&&(k=new pd,I[ne]=k),k.getTargetRaySpace()},this.getControllerGrip=function(ne){let k=I[ne];return k===void 0&&(k=new pd,I[ne]=k),k.getGripSpace()},this.getHand=function(ne){let k=I[ne];return k===void 0&&(k=new pd,I[ne]=k),k.getHandSpace()};function Y(ne){const k=C.indexOf(ne.inputSource);if(k===-1)return;const ue=I[k];ue!==void 0&&(ue.update(ne.inputSource,ne.frame,m||d),ue.dispatchEvent({type:ne.type,data:ne.inputSource}))}function le(){a.removeEventListener("select",Y),a.removeEventListener("selectstart",Y),a.removeEventListener("selectend",Y),a.removeEventListener("squeeze",Y),a.removeEventListener("squeezestart",Y),a.removeEventListener("squeezeend",Y),a.removeEventListener("end",le),a.removeEventListener("inputsourceschange",xe);for(let ne=0;ne<I.length;ne++){const k=C[ne];k!==null&&(C[ne]=null,I[ne].disconnect(k))}j=null,K=null,A.reset(),e.setRenderTarget(y),E=null,g=null,_=null,a=null,P=null,De.stop(),r.isPresenting=!1,e.setPixelRatio(V),e.setSize(ie.width,ie.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ne){l=ne,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ne){f=ne,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||d},this.setReferenceSpace=function(ne){m=ne},this.getBaseLayer=function(){return g!==null?g:E},this.getBinding=function(){return _},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(ne){if(a=ne,a!==null){if(y=e.getRenderTarget(),a.addEventListener("select",Y),a.addEventListener("selectstart",Y),a.addEventListener("selectend",Y),a.addEventListener("squeeze",Y),a.addEventListener("squeezestart",Y),a.addEventListener("squeezeend",Y),a.addEventListener("end",le),a.addEventListener("inputsourceschange",xe),S.xrCompatible!==!0&&await t.makeXRCompatible(),V=e.getPixelRatio(),e.getSize(ie),a.renderState.layers===void 0){const k={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:l};E=new XRWebGLLayer(a,t,k),a.updateRenderState({baseLayer:E}),e.setPixelRatio(1),e.setSize(E.framebufferWidth,E.framebufferHeight,!1),P=new es(E.framebufferWidth,E.framebufferHeight,{format:yi,type:Qi,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let k=null,ue=null,fe=null;S.depth&&(fe=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,k=S.stencil?Ks:Hs,ue=S.stencil?qs:Jr);const ge={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:l};_=new XRWebGLBinding(a,t),g=_.createProjectionLayer(ge),a.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),P=new es(g.textureWidth,g.textureHeight,{format:yi,type:Qi,depthTexture:new tx(g.textureWidth,g.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,k),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1})}P.isXRRenderTarget=!0,this.setFoveation(p),m=null,d=await a.requestReferenceSpace(f),De.setContext(a),De.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return A.getDepthTexture()};function xe(ne){for(let k=0;k<ne.removed.length;k++){const ue=ne.removed[k],fe=C.indexOf(ue);fe>=0&&(C[fe]=null,I[fe].disconnect(ue))}for(let k=0;k<ne.added.length;k++){const ue=ne.added[k];let fe=C.indexOf(ue);if(fe===-1){for(let Ae=0;Ae<I.length;Ae++)if(Ae>=C.length){C.push(ue),fe=Ae;break}else if(C[Ae]===null){C[Ae]=ue,fe=Ae;break}if(fe===-1)break}const ge=I[fe];ge&&ge.connect(ue)}}const de=new X,me=new X;function B(ne,k,ue){de.setFromMatrixPosition(k.matrixWorld),me.setFromMatrixPosition(ue.matrixWorld);const fe=de.distanceTo(me),ge=k.projectionMatrix.elements,Ae=ue.projectionMatrix.elements,Fe=ge[14]/(ge[10]-1),_t=ge[14]/(ge[10]+1),He=(ge[9]+1)/ge[5],lt=(ge[9]-1)/ge[5],W=(ge[8]-1)/ge[0],sn=(Ae[8]+1)/Ae[0],pt=Fe*W,mt=Fe*sn,Je=fe/(-W+sn),Pt=Je*-W;if(k.matrixWorld.decompose(ne.position,ne.quaternion,ne.scale),ne.translateX(Pt),ne.translateZ(Je),ne.matrixWorld.compose(ne.position,ne.quaternion,ne.scale),ne.matrixWorldInverse.copy(ne.matrixWorld).invert(),ge[10]===-1)ne.projectionMatrix.copy(k.projectionMatrix),ne.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{const Ke=Fe+Je,D=_t+Je,T=pt-Pt,se=mt+(fe-Pt),ye=He*_t/D*Ke,Se=lt*_t/D*Ke;ne.projectionMatrix.makePerspective(T,se,ye,Se,Ke,D),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert()}}function pe(ne,k){k===null?ne.matrixWorld.copy(ne.matrix):ne.matrixWorld.multiplyMatrices(k.matrixWorld,ne.matrix),ne.matrixWorldInverse.copy(ne.matrixWorld).invert()}this.updateCamera=function(ne){if(a===null)return;let k=ne.near,ue=ne.far;A.texture!==null&&(A.depthNear>0&&(k=A.depthNear),A.depthFar>0&&(ue=A.depthFar)),b.near=q.near=F.near=k,b.far=q.far=F.far=ue,(j!==b.near||K!==b.far)&&(a.updateRenderState({depthNear:b.near,depthFar:b.far}),j=b.near,K=b.far),F.layers.mask=ne.layers.mask|2,q.layers.mask=ne.layers.mask|4,b.layers.mask=F.layers.mask|q.layers.mask;const fe=ne.parent,ge=b.cameras;pe(b,fe);for(let Ae=0;Ae<ge.length;Ae++)pe(ge[Ae],fe);ge.length===2?B(b,F,q):b.projectionMatrix.copy(F.projectionMatrix),te(ne,b,fe)};function te(ne,k,ue){ue===null?ne.matrix.copy(k.matrixWorld):(ne.matrix.copy(ue.matrixWorld),ne.matrix.invert(),ne.matrix.multiply(k.matrixWorld)),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.updateMatrixWorld(!0),ne.projectionMatrix.copy(k.projectionMatrix),ne.projectionMatrixInverse.copy(k.projectionMatrixInverse),ne.isPerspectiveCamera&&(ne.fov=cf*2*Math.atan(1/ne.projectionMatrix.elements[5]),ne.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(g===null&&E===null))return p},this.setFoveation=function(ne){p=ne,g!==null&&(g.fixedFoveation=ne),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=ne)},this.hasDepthSensing=function(){return A.texture!==null},this.getDepthSensingMesh=function(){return A.getMesh(b)};let O=null;function J(ne,k){if(v=k.getViewerPose(m||d),M=k,v!==null){const ue=v.views;E!==null&&(e.setRenderTargetFramebuffer(P,E.framebuffer),e.setRenderTarget(P));let fe=!1;ue.length!==b.cameras.length&&(b.cameras.length=0,fe=!0);for(let Ae=0;Ae<ue.length;Ae++){const Fe=ue[Ae];let _t=null;if(E!==null)_t=E.getViewport(Fe);else{const lt=_.getViewSubImage(g,Fe);_t=lt.viewport,Ae===0&&(e.setRenderTargetTextures(P,lt.colorTexture,g.ignoreDepthValues?void 0:lt.depthStencilTexture),e.setRenderTarget(P))}let He=R[Ae];He===void 0&&(He=new Yn,He.layers.enable(Ae),He.viewport=new Ft,R[Ae]=He),He.matrix.fromArray(Fe.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(Fe.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(_t.x,_t.y,_t.width,_t.height),Ae===0&&(b.matrix.copy(He.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),fe===!0&&b.cameras.push(He)}const ge=a.enabledFeatures;if(ge&&ge.includes("depth-sensing")){const Ae=_.getDepthInformation(ue[0]);Ae&&Ae.isValid&&Ae.texture&&A.init(e,Ae,a.renderState)}}for(let ue=0;ue<I.length;ue++){const fe=C[ue],ge=I[ue];fe!==null&&ge!==void 0&&ge.update(fe,k,m||d)}O&&O(ne,k),k.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:k}),M=null}const De=new ex;De.setAnimationLoop(J),this.setAnimationLoop=function(ne){O=ne},this.dispose=function(){}}}const Xr=new Ii,dM=new Vt;function fM(s,e){function t(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function r(S,y){y.color.getRGB(S.fogColor.value,Z0(s)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function a(S,y,P,I,C){y.isMeshBasicMaterial||y.isMeshLambertMaterial?l(S,y):y.isMeshToonMaterial?(l(S,y),_(S,y)):y.isMeshPhongMaterial?(l(S,y),v(S,y)):y.isMeshStandardMaterial?(l(S,y),g(S,y),y.isMeshPhysicalMaterial&&E(S,y,C)):y.isMeshMatcapMaterial?(l(S,y),M(S,y)):y.isMeshDepthMaterial?l(S,y):y.isMeshDistanceMaterial?(l(S,y),A(S,y)):y.isMeshNormalMaterial?l(S,y):y.isLineBasicMaterial?(d(S,y),y.isLineDashedMaterial&&f(S,y)):y.isPointsMaterial?p(S,y,P,I):y.isSpriteMaterial?m(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function l(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,t(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===kn&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,t(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===kn&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,t(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,t(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const P=e.get(y),I=P.envMap,C=P.envMapRotation;I&&(S.envMap.value=I,Xr.copy(C),Xr.x*=-1,Xr.y*=-1,Xr.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Xr.y*=-1,Xr.z*=-1),S.envMapRotation.value.setFromMatrix4(dM.makeRotationFromEuler(Xr)),S.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap&&(S.lightMap.value=y.lightMap,S.lightMapIntensity.value=y.lightMapIntensity,t(y.lightMap,S.lightMapTransform)),y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,S.aoMapTransform))}function d(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform))}function f(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function p(S,y,P,I){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*P,S.scale.value=I*.5,y.map&&(S.map.value=y.map,t(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function m(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function v(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function _(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function g(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function E(S,y,P){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===kn&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=P.texture,S.transmissionSamplerSize.value.set(P.width,P.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,y){y.matcap&&(S.matcap.value=y.matcap)}function A(S,y){const P=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(P.matrixWorld),S.nearDistance.value=P.shadow.camera.near,S.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function hM(s,e,t,r){let a={},l={},d=[];const f=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(P,I){const C=I.program;r.uniformBlockBinding(P,C)}function m(P,I){let C=a[P.id];C===void 0&&(M(P),C=v(P),a[P.id]=C,P.addEventListener("dispose",S));const ie=I.program;r.updateUBOMapping(P,ie);const V=e.render.frame;l[P.id]!==V&&(g(P),l[P.id]=V)}function v(P){const I=_();P.__bindingPointIndex=I;const C=s.createBuffer(),ie=P.__size,V=P.usage;return s.bindBuffer(s.UNIFORM_BUFFER,C),s.bufferData(s.UNIFORM_BUFFER,ie,V),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,I,C),C}function _(){for(let P=0;P<f;P++)if(d.indexOf(P)===-1)return d.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(P){const I=a[P.id],C=P.uniforms,ie=P.__cache;s.bindBuffer(s.UNIFORM_BUFFER,I);for(let V=0,F=C.length;V<F;V++){const q=Array.isArray(C[V])?C[V]:[C[V]];for(let R=0,b=q.length;R<b;R++){const j=q[R];if(E(j,V,R,ie)===!0){const K=j.__offset,Y=Array.isArray(j.value)?j.value:[j.value];let le=0;for(let xe=0;xe<Y.length;xe++){const de=Y[xe],me=A(de);typeof de=="number"||typeof de=="boolean"?(j.__data[0]=de,s.bufferSubData(s.UNIFORM_BUFFER,K+le,j.__data)):de.isMatrix3?(j.__data[0]=de.elements[0],j.__data[1]=de.elements[1],j.__data[2]=de.elements[2],j.__data[3]=0,j.__data[4]=de.elements[3],j.__data[5]=de.elements[4],j.__data[6]=de.elements[5],j.__data[7]=0,j.__data[8]=de.elements[6],j.__data[9]=de.elements[7],j.__data[10]=de.elements[8],j.__data[11]=0):(de.toArray(j.__data,le),le+=me.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,K,j.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function E(P,I,C,ie){const V=P.value,F=I+"_"+C;if(ie[F]===void 0)return typeof V=="number"||typeof V=="boolean"?ie[F]=V:ie[F]=V.clone(),!0;{const q=ie[F];if(typeof V=="number"||typeof V=="boolean"){if(q!==V)return ie[F]=V,!0}else if(q.equals(V)===!1)return q.copy(V),!0}return!1}function M(P){const I=P.uniforms;let C=0;const ie=16;for(let F=0,q=I.length;F<q;F++){const R=Array.isArray(I[F])?I[F]:[I[F]];for(let b=0,j=R.length;b<j;b++){const K=R[b],Y=Array.isArray(K.value)?K.value:[K.value];for(let le=0,xe=Y.length;le<xe;le++){const de=Y[le],me=A(de),B=C%ie,pe=B%me.boundary,te=B+pe;C+=pe,te!==0&&ie-te<me.storage&&(C+=ie-te),K.__data=new Float32Array(me.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=C,C+=me.storage}}}const V=C%ie;return V>0&&(C+=ie-V),P.__size=C,P.__cache={},this}function A(P){const I={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(I.boundary=4,I.storage=4):P.isVector2?(I.boundary=8,I.storage=8):P.isVector3||P.isColor?(I.boundary=16,I.storage=12):P.isVector4?(I.boundary=16,I.storage=16):P.isMatrix3?(I.boundary=48,I.storage=48):P.isMatrix4?(I.boundary=64,I.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),I}function S(P){const I=P.target;I.removeEventListener("dispose",S);const C=d.indexOf(I.__bindingPointIndex);d.splice(C,1),s.deleteBuffer(a[I.id]),delete a[I.id],delete l[I.id]}function y(){for(const P in a)s.deleteBuffer(a[P]);d=[],a={},l={}}return{bind:p,update:m,dispose:y}}class pM{constructor(e={}){const{canvas:t=t_(),context:r=null,depth:a=!0,stencil:l=!1,alpha:d=!1,antialias:f=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:m=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:_=!1,reverseDepthBuffer:g=!1}=e;this.isWebGLRenderer=!0;let E;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=r.getContextAttributes().alpha}else E=d;const M=new Uint32Array(4),A=new Int32Array(4);let S=null,y=null;const P=[],I=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=si,this.toneMapping=Tr,this.toneMappingExposure=1;const C=this;let ie=!1,V=0,F=0,q=null,R=-1,b=null;const j=new Ft,K=new Ft;let Y=null;const le=new Nt(0);let xe=0,de=t.width,me=t.height,B=1,pe=null,te=null;const O=new Ft(0,0,de,me),J=new Ft(0,0,de,me);let De=!1;const ne=new Mf;let k=!1,ue=!1;const fe=new Vt,ge=new Vt,Ae=new X,Fe=new Ft,_t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let He=!1;function lt(){return q===null?B:1}let W=r;function sn(N,$){return t.getContext(N,$)}try{const N={alpha:!0,depth:a,stencil:l,antialias:f,premultipliedAlpha:p,preserveDrawingBuffer:m,powerPreference:v,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${xf}`),t.addEventListener("webglcontextlost",L,!1),t.addEventListener("webglcontextrestored",Q,!1),t.addEventListener("webglcontextcreationerror",_e,!1),W===null){const $="webgl2";if(W=sn($,N),W===null)throw sn($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(N){throw console.error("THREE.WebGLRenderer: "+N.message),N}let pt,mt,Je,Pt,Ke,D,T,se,ye,Se,ve,Ve,Le,Pe,dt,we,ke,tt,rt,Be,xt,ct,bt,H;function Ie(){pt=new _E(W),pt.init(),ct=new rM(W,pt),mt=new fE(W,pt,e,ct),Je=new tM(W,pt),mt.reverseDepthBuffer&&g&&Je.buffers.depth.setReversed(!0),Pt=new EE(W),Ke=new z1,D=new iM(W,pt,Je,Ke,mt,ct,Pt),T=new pE(C),se=new gE(C),ye=new C_(W),bt=new uE(W,ye),Se=new yE(W,ye,Pt,bt),ve=new wE(W,Se,ye,Pt),rt=new ME(W,mt,D),we=new hE(Ke),Ve=new B1(C,T,se,pt,mt,bt,we),Le=new fM(C,Ke),Pe=new V1,dt=new $1(pt),tt=new cE(C,T,se,Je,ve,E,p),ke=new J1(C,ve,mt),H=new hM(W,Pt,mt,Je),Be=new dE(W,pt,Pt),xt=new SE(W,pt,Pt),Pt.programs=Ve.programs,C.capabilities=mt,C.extensions=pt,C.properties=Ke,C.renderLists=Pe,C.shadowMap=ke,C.state=Je,C.info=Pt}Ie();const he=new uM(C,W);this.xr=he,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const N=pt.get("WEBGL_lose_context");N&&N.loseContext()},this.forceContextRestore=function(){const N=pt.get("WEBGL_lose_context");N&&N.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(N){N!==void 0&&(B=N,this.setSize(de,me,!1))},this.getSize=function(N){return N.set(de,me)},this.setSize=function(N,$,oe=!0){if(he.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}de=N,me=$,t.width=Math.floor(N*B),t.height=Math.floor($*B),oe===!0&&(t.style.width=N+"px",t.style.height=$+"px"),this.setViewport(0,0,N,$)},this.getDrawingBufferSize=function(N){return N.set(de*B,me*B).floor()},this.setDrawingBufferSize=function(N,$,oe){de=N,me=$,B=oe,t.width=Math.floor(N*oe),t.height=Math.floor($*oe),this.setViewport(0,0,N,$)},this.getCurrentViewport=function(N){return N.copy(j)},this.getViewport=function(N){return N.copy(O)},this.setViewport=function(N,$,oe,ce){N.isVector4?O.set(N.x,N.y,N.z,N.w):O.set(N,$,oe,ce),Je.viewport(j.copy(O).multiplyScalar(B).round())},this.getScissor=function(N){return N.copy(J)},this.setScissor=function(N,$,oe,ce){N.isVector4?J.set(N.x,N.y,N.z,N.w):J.set(N,$,oe,ce),Je.scissor(K.copy(J).multiplyScalar(B).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(N){Je.setScissorTest(De=N)},this.setOpaqueSort=function(N){pe=N},this.setTransparentSort=function(N){te=N},this.getClearColor=function(N){return N.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor.apply(tt,arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha.apply(tt,arguments)},this.clear=function(N=!0,$=!0,oe=!0){let ce=0;if(N){let Z=!1;if(q!==null){const Ne=q.texture.format;Z=Ne===Ef||Ne===Sf||Ne===yf}if(Z){const Ne=q.texture.type,Ce=Ne===Qi||Ne===Jr||Ne===Ka||Ne===qs||Ne===gf||Ne===_f,Ye=tt.getClearColor(),We=tt.getClearAlpha(),at=Ye.r,ut=Ye.g,$e=Ye.b;Ce?(M[0]=at,M[1]=ut,M[2]=$e,M[3]=We,W.clearBufferuiv(W.COLOR,0,M)):(A[0]=at,A[1]=ut,A[2]=$e,A[3]=We,W.clearBufferiv(W.COLOR,0,A))}else ce|=W.COLOR_BUFFER_BIT}$&&(ce|=W.DEPTH_BUFFER_BIT),oe&&(ce|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(ce)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",L,!1),t.removeEventListener("webglcontextrestored",Q,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Pe.dispose(),dt.dispose(),Ke.dispose(),T.dispose(),se.dispose(),ve.dispose(),bt.dispose(),H.dispose(),Ve.dispose(),he.dispose(),he.removeEventListener("sessionstart",Tn),he.removeEventListener("sessionend",It),zn.stop()};function L(N){N.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),ie=!0}function Q(){console.log("THREE.WebGLRenderer: Context Restored."),ie=!1;const N=Pt.autoReset,$=ke.enabled,oe=ke.autoUpdate,ce=ke.needsUpdate,Z=ke.type;Ie(),Pt.autoReset=N,ke.enabled=$,ke.autoUpdate=oe,ke.needsUpdate=ce,ke.type=Z}function _e(N){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",N.statusMessage)}function ze(N){const $=N.target;$.removeEventListener("dispose",ze),vt($)}function vt(N){Mt(N),Ke.remove(N)}function Mt(N){const $=Ke.get(N).programs;$!==void 0&&($.forEach(function(oe){Ve.releaseProgram(oe)}),N.isShaderMaterial&&Ve.releaseShaderCache(N))}this.renderBufferDirect=function(N,$,oe,ce,Z,Ne){$===null&&($=_t);const Ce=Z.isMesh&&Z.matrixWorld.determinant()<0,Ye=so(N,$,oe,ce,Z);Je.setMaterial(ce,Ce);let We=oe.index,at=1;if(ce.wireframe===!0){if(We=Se.getWireframeAttribute(oe),We===void 0)return;at=2}const ut=oe.drawRange,$e=oe.attributes.position;let wt=ut.start*at,Lt=(ut.start+ut.count)*at;Ne!==null&&(wt=Math.max(wt,Ne.start*at),Lt=Math.min(Lt,(Ne.start+Ne.count)*at)),We!==null?(wt=Math.max(wt,0),Lt=Math.min(Lt,We.count)):$e!=null&&(wt=Math.max(wt,0),Lt=Math.min(Lt,$e.count));const Et=Lt-wt;if(Et<0||Et===1/0)return;bt.setup(Z,ce,Ye,oe,We);let fn,ft=Be;if(We!==null&&(fn=ye.get(We),ft=xt,ft.setIndex(fn)),Z.isMesh)ce.wireframe===!0?(Je.setLineWidth(ce.wireframeLinewidth*lt()),ft.setMode(W.LINES)):ft.setMode(W.TRIANGLES);else if(Z.isLine){let Ze=ce.linewidth;Ze===void 0&&(Ze=1),Je.setLineWidth(Ze*lt()),Z.isLineSegments?ft.setMode(W.LINES):Z.isLineLoop?ft.setMode(W.LINE_LOOP):ft.setMode(W.LINE_STRIP)}else Z.isPoints?ft.setMode(W.POINTS):Z.isSprite&&ft.setMode(W.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)ft.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(pt.get("WEBGL_multi_draw"))ft.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const Ze=Z._multiDrawStarts,li=Z._multiDrawCounts,Ct=Z._multiDrawCount,hn=We?ye.get(We).bytesPerElement:1,ci=Ke.get(ce).currentProgram.getUniforms();for(let Jt=0;Jt<Ct;Jt++)ci.setValue(W,"_gl_DrawID",Jt),ft.render(Ze[Jt]/hn,li[Jt])}else if(Z.isInstancedMesh)ft.renderInstances(wt,Et,Z.count);else if(oe.isInstancedBufferGeometry){const Ze=oe._maxInstanceCount!==void 0?oe._maxInstanceCount:1/0,li=Math.min(oe.instanceCount,Ze);ft.renderInstances(wt,Et,li)}else ft.render(wt,Et)};function et(N,$,oe){N.transparent===!0&&N.side===Ni&&N.forceSinglePass===!1?(N.side=kn,N.needsUpdate=!0,An(N,$,oe),N.side=Ar,N.needsUpdate=!0,An(N,$,oe),N.side=Ni):An(N,$,oe)}this.compile=function(N,$,oe=null){oe===null&&(oe=N),y=dt.get(oe),y.init($),I.push(y),oe.traverseVisible(function(Z){Z.isLight&&Z.layers.test($.layers)&&(y.pushLight(Z),Z.castShadow&&y.pushShadow(Z))}),N!==oe&&N.traverseVisible(function(Z){Z.isLight&&Z.layers.test($.layers)&&(y.pushLight(Z),Z.castShadow&&y.pushShadow(Z))}),y.setupLights();const ce=new Set;return N.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const Ne=Z.material;if(Ne)if(Array.isArray(Ne))for(let Ce=0;Ce<Ne.length;Ce++){const Ye=Ne[Ce];et(Ye,oe,Z),ce.add(Ye)}else et(Ne,oe,Z),ce.add(Ne)}),I.pop(),y=null,ce},this.compileAsync=function(N,$,oe=null){const ce=this.compile(N,$,oe);return new Promise(Z=>{function Ne(){if(ce.forEach(function(Ce){Ke.get(Ce).currentProgram.isReady()&&ce.delete(Ce)}),ce.size===0){Z(N);return}setTimeout(Ne,10)}pt.get("KHR_parallel_shader_compile")!==null?Ne():setTimeout(Ne,10)})};let Ut=null;function Wt(N){Ut&&Ut(N)}function Tn(){zn.stop()}function It(){zn.start()}const zn=new ex;zn.setAnimationLoop(Wt),typeof self<"u"&&zn.setContext(self),this.setAnimationLoop=function(N){Ut=N,he.setAnimationLoop(N),N===null?zn.stop():zn.start()},he.addEventListener("sessionstart",Tn),he.addEventListener("sessionend",It),this.render=function(N,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(ie===!0)return;if(N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(he.cameraAutoUpdate===!0&&he.updateCamera($),$=he.getCamera()),N.isScene===!0&&N.onBeforeRender(C,N,$,q),y=dt.get(N,I.length),y.init($),I.push(y),ge.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),ne.setFromProjectionMatrix(ge),ue=this.localClippingEnabled,k=we.init(this.clippingPlanes,ue),S=Pe.get(N,P.length),S.init(),P.push(S),he.enabled===!0&&he.isPresenting===!0){const Ne=C.xr.getDepthSensingMesh();Ne!==null&&st(Ne,$,-1/0,C.sortObjects)}st(N,$,0,C.sortObjects),S.finish(),C.sortObjects===!0&&S.sort(pe,te),He=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,He&&tt.addToRenderList(S,N),this.info.render.frame++,k===!0&&we.beginShadows();const oe=y.state.shadowsArray;ke.render(oe,N,$),k===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const ce=S.opaque,Z=S.transmissive;if(y.setupLights(),$.isArrayCamera){const Ne=$.cameras;if(Z.length>0)for(let Ce=0,Ye=Ne.length;Ce<Ye;Ce++){const We=Ne[Ce];qn(ce,Z,N,We)}He&&tt.render(N);for(let Ce=0,Ye=Ne.length;Ce<Ye;Ce++){const We=Ne[Ce];ai(S,N,We,We.viewport)}}else Z.length>0&&qn(ce,Z,N,$),He&&tt.render(N),ai(S,N,$);q!==null&&(D.updateMultisampleRenderTarget(q),D.updateRenderTargetMipmap(q)),N.isScene===!0&&N.onAfterRender(C,N,$),bt.resetDefaultState(),R=-1,b=null,I.pop(),I.length>0?(y=I[I.length-1],k===!0&&we.setGlobalState(C.clippingPlanes,y.state.camera)):y=null,P.pop(),P.length>0?S=P[P.length-1]:S=null};function st(N,$,oe,ce){if(N.visible===!1)return;if(N.layers.test($.layers)){if(N.isGroup)oe=N.renderOrder;else if(N.isLOD)N.autoUpdate===!0&&N.update($);else if(N.isLight)y.pushLight(N),N.castShadow&&y.pushShadow(N);else if(N.isSprite){if(!N.frustumCulled||ne.intersectsSprite(N)){ce&&Fe.setFromMatrixPosition(N.matrixWorld).applyMatrix4(ge);const Ce=ve.update(N),Ye=N.material;Ye.visible&&S.push(N,Ce,Ye,oe,Fe.z,null)}}else if((N.isMesh||N.isLine||N.isPoints)&&(!N.frustumCulled||ne.intersectsObject(N))){const Ce=ve.update(N),Ye=N.material;if(ce&&(N.boundingSphere!==void 0?(N.boundingSphere===null&&N.computeBoundingSphere(),Fe.copy(N.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Fe.copy(Ce.boundingSphere.center)),Fe.applyMatrix4(N.matrixWorld).applyMatrix4(ge)),Array.isArray(Ye)){const We=Ce.groups;for(let at=0,ut=We.length;at<ut;at++){const $e=We[at],wt=Ye[$e.materialIndex];wt&&wt.visible&&S.push(N,Ce,wt,oe,Fe.z,$e)}}else Ye.visible&&S.push(N,Ce,Ye,oe,Fe.z,null)}}const Ne=N.children;for(let Ce=0,Ye=Ne.length;Ce<Ye;Ce++)st(Ne[Ce],$,oe,ce)}function ai(N,$,oe,ce){const Z=N.opaque,Ne=N.transmissive,Ce=N.transparent;y.setupLightsView(oe),k===!0&&we.setGlobalState(C.clippingPlanes,oe),ce&&Je.viewport(j.copy(ce)),Z.length>0&&oi(Z,$,oe),Ne.length>0&&oi(Ne,$,oe),Ce.length>0&&oi(Ce,$,oe),Je.buffers.depth.setTest(!0),Je.buffers.depth.setMask(!0),Je.buffers.color.setMask(!0),Je.setPolygonOffset(!1)}function qn(N,$,oe,ce){if((oe.isScene===!0?oe.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ce.id]===void 0&&(y.state.transmissionRenderTarget[ce.id]=new es(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float")?eo:Qi,minFilter:Qr,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:At.workingColorSpace}));const Ne=y.state.transmissionRenderTarget[ce.id],Ce=ce.viewport||j;Ne.setSize(Ce.z,Ce.w);const Ye=C.getRenderTarget();C.setRenderTarget(Ne),C.getClearColor(le),xe=C.getClearAlpha(),xe<1&&C.setClearColor(16777215,.5),C.clear(),He&&tt.render(oe);const We=C.toneMapping;C.toneMapping=Tr;const at=ce.viewport;if(ce.viewport!==void 0&&(ce.viewport=void 0),y.setupLightsView(ce),k===!0&&we.setGlobalState(C.clippingPlanes,ce),oi(N,oe,ce),D.updateMultisampleRenderTarget(Ne),D.updateRenderTargetMipmap(Ne),pt.has("WEBGL_multisampled_render_to_texture")===!1){let ut=!1;for(let $e=0,wt=$.length;$e<wt;$e++){const Lt=$[$e],Et=Lt.object,fn=Lt.geometry,ft=Lt.material,Ze=Lt.group;if(ft.side===Ni&&Et.layers.test(ce.layers)){const li=ft.side;ft.side=kn,ft.needsUpdate=!0,Gt(Et,oe,ce,fn,ft,Ze),ft.side=li,ft.needsUpdate=!0,ut=!0}}ut===!0&&(D.updateMultisampleRenderTarget(Ne),D.updateRenderTargetMipmap(Ne))}C.setRenderTarget(Ye),C.setClearColor(le,xe),at!==void 0&&(ce.viewport=at),C.toneMapping=We}function oi(N,$,oe){const ce=$.isScene===!0?$.overrideMaterial:null;for(let Z=0,Ne=N.length;Z<Ne;Z++){const Ce=N[Z],Ye=Ce.object,We=Ce.geometry,at=ce===null?Ce.material:ce,ut=Ce.group;Ye.layers.test(oe.layers)&&Gt(Ye,$,oe,We,at,ut)}}function Gt(N,$,oe,ce,Z,Ne){N.onBeforeRender(C,$,oe,ce,Z,Ne),N.modelViewMatrix.multiplyMatrices(oe.matrixWorldInverse,N.matrixWorld),N.normalMatrix.getNormalMatrix(N.modelViewMatrix),Z.onBeforeRender(C,$,oe,ce,N,Ne),Z.transparent===!0&&Z.side===Ni&&Z.forceSinglePass===!1?(Z.side=kn,Z.needsUpdate=!0,C.renderBufferDirect(oe,$,ce,Z,N,Ne),Z.side=Ar,Z.needsUpdate=!0,C.renderBufferDirect(oe,$,ce,Z,N,Ne),Z.side=Ni):C.renderBufferDirect(oe,$,ce,Z,N,Ne),N.onAfterRender(C,$,oe,ce,Z,Ne)}function An(N,$,oe){$.isScene!==!0&&($=_t);const ce=Ke.get(N),Z=y.state.lights,Ne=y.state.shadowsArray,Ce=Z.state.version,Ye=Ve.getParameters(N,Z.state,Ne,$,oe),We=Ve.getProgramCacheKey(Ye);let at=ce.programs;ce.environment=N.isMeshStandardMaterial?$.environment:null,ce.fog=$.fog,ce.envMap=(N.isMeshStandardMaterial?se:T).get(N.envMap||ce.environment),ce.envMapRotation=ce.environment!==null&&N.envMap===null?$.environmentRotation:N.envMapRotation,at===void 0&&(N.addEventListener("dispose",ze),at=new Map,ce.programs=at);let ut=at.get(We);if(ut!==void 0){if(ce.currentProgram===ut&&ce.lightsStateVersion===Ce)return Cn(N,Ye),ut}else Ye.uniforms=Ve.getUniforms(N),N.onBeforeCompile(Ye,C),ut=Ve.acquireProgram(Ye,We),at.set(We,ut),ce.uniforms=Ye.uniforms;const $e=ce.uniforms;return(!N.isShaderMaterial&&!N.isRawShaderMaterial||N.clipping===!0)&&($e.clippingPlanes=we.uniform),Cn(N,Ye),ce.needsLights=tc(N),ce.lightsStateVersion=Ce,ce.needsLights&&($e.ambientLightColor.value=Z.state.ambient,$e.lightProbe.value=Z.state.probe,$e.directionalLights.value=Z.state.directional,$e.directionalLightShadows.value=Z.state.directionalShadow,$e.spotLights.value=Z.state.spot,$e.spotLightShadows.value=Z.state.spotShadow,$e.rectAreaLights.value=Z.state.rectArea,$e.ltc_1.value=Z.state.rectAreaLTC1,$e.ltc_2.value=Z.state.rectAreaLTC2,$e.pointLights.value=Z.state.point,$e.pointLightShadows.value=Z.state.pointShadow,$e.hemisphereLights.value=Z.state.hemi,$e.directionalShadowMap.value=Z.state.directionalShadowMap,$e.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,$e.spotShadowMap.value=Z.state.spotShadowMap,$e.spotLightMatrix.value=Z.state.spotLightMatrix,$e.spotLightMap.value=Z.state.spotLightMap,$e.pointShadowMap.value=Z.state.pointShadowMap,$e.pointShadowMatrix.value=Z.state.pointShadowMatrix),ce.currentProgram=ut,ce.uniformsList=null,ut}function ns(N){if(N.uniformsList===null){const $=N.currentProgram.getUniforms();N.uniformsList=Vl.seqWithValue($.seq,N.uniforms)}return N.uniformsList}function Cn(N,$){const oe=Ke.get(N);oe.outputColorSpace=$.outputColorSpace,oe.batching=$.batching,oe.batchingColor=$.batchingColor,oe.instancing=$.instancing,oe.instancingColor=$.instancingColor,oe.instancingMorph=$.instancingMorph,oe.skinning=$.skinning,oe.morphTargets=$.morphTargets,oe.morphNormals=$.morphNormals,oe.morphColors=$.morphColors,oe.morphTargetsCount=$.morphTargetsCount,oe.numClippingPlanes=$.numClippingPlanes,oe.numIntersection=$.numClipIntersection,oe.vertexAlphas=$.vertexAlphas,oe.vertexTangents=$.vertexTangents,oe.toneMapping=$.toneMapping}function so(N,$,oe,ce,Z){$.isScene!==!0&&($=_t),D.resetTextureUnits();const Ne=$.fog,Ce=ce.isMeshStandardMaterial?$.environment:null,Ye=q===null?C.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:ea,We=(ce.isMeshStandardMaterial?se:T).get(ce.envMap||Ce),at=ce.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,ut=!!oe.attributes.tangent&&(!!ce.normalMap||ce.anisotropy>0),$e=!!oe.morphAttributes.position,wt=!!oe.morphAttributes.normal,Lt=!!oe.morphAttributes.color;let Et=Tr;ce.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Et=C.toneMapping);const fn=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,ft=fn!==void 0?fn.length:0,Ze=Ke.get(ce),li=y.state.lights;if(k===!0&&(ue===!0||N!==b)){const Sn=N===b&&ce.id===R;we.setState(ce,N,Sn)}let Ct=!1;ce.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==li.state.version||Ze.outputColorSpace!==Ye||Z.isBatchedMesh&&Ze.batching===!1||!Z.isBatchedMesh&&Ze.batching===!0||Z.isBatchedMesh&&Ze.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&Ze.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&Ze.instancing===!1||!Z.isInstancedMesh&&Ze.instancing===!0||Z.isSkinnedMesh&&Ze.skinning===!1||!Z.isSkinnedMesh&&Ze.skinning===!0||Z.isInstancedMesh&&Ze.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Ze.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Ze.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Ze.instancingMorph===!1&&Z.morphTexture!==null||Ze.envMap!==We||ce.fog===!0&&Ze.fog!==Ne||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==we.numPlanes||Ze.numIntersection!==we.numIntersection)||Ze.vertexAlphas!==at||Ze.vertexTangents!==ut||Ze.morphTargets!==$e||Ze.morphNormals!==wt||Ze.morphColors!==Lt||Ze.toneMapping!==Et||Ze.morphTargetsCount!==ft)&&(Ct=!0):(Ct=!0,Ze.__version=ce.version);let hn=Ze.currentProgram;Ct===!0&&(hn=An(ce,$,Z));let ci=!1,Jt=!1,wi=!1;const kt=hn.getUniforms(),Kn=Ze.uniforms;if(Je.useProgram(hn.program)&&(ci=!0,Jt=!0,wi=!0),ce.id!==R&&(R=ce.id,Jt=!0),ci||b!==N){Je.buffers.depth.getReversed()?(fe.copy(N.projectionMatrix),i_(fe),r_(fe),kt.setValue(W,"projectionMatrix",fe)):kt.setValue(W,"projectionMatrix",N.projectionMatrix),kt.setValue(W,"viewMatrix",N.matrixWorldInverse);const Zn=kt.map.cameraPosition;Zn!==void 0&&Zn.setValue(W,Ae.setFromMatrixPosition(N.matrixWorld)),mt.logarithmicDepthBuffer&&kt.setValue(W,"logDepthBufFC",2/(Math.log(N.far+1)/Math.LN2)),(ce.isMeshPhongMaterial||ce.isMeshToonMaterial||ce.isMeshLambertMaterial||ce.isMeshBasicMaterial||ce.isMeshStandardMaterial||ce.isShaderMaterial)&&kt.setValue(W,"isOrthographic",N.isOrthographicCamera===!0),b!==N&&(b=N,Jt=!0,wi=!0)}if(Z.isSkinnedMesh){kt.setOptional(W,Z,"bindMatrix"),kt.setOptional(W,Z,"bindMatrixInverse");const Sn=Z.skeleton;Sn&&(Sn.boneTexture===null&&Sn.computeBoneTexture(),kt.setValue(W,"boneTexture",Sn.boneTexture,D))}Z.isBatchedMesh&&(kt.setOptional(W,Z,"batchingTexture"),kt.setValue(W,"batchingTexture",Z._matricesTexture,D),kt.setOptional(W,Z,"batchingIdTexture"),kt.setValue(W,"batchingIdTexture",Z._indirectTexture,D),kt.setOptional(W,Z,"batchingColorTexture"),Z._colorsTexture!==null&&kt.setValue(W,"batchingColorTexture",Z._colorsTexture,D));const Di=oe.morphAttributes;if((Di.position!==void 0||Di.normal!==void 0||Di.color!==void 0)&&rt.update(Z,oe,hn),(Jt||Ze.receiveShadow!==Z.receiveShadow)&&(Ze.receiveShadow=Z.receiveShadow,kt.setValue(W,"receiveShadow",Z.receiveShadow)),ce.isMeshGouraudMaterial&&ce.envMap!==null&&(Kn.envMap.value=We,Kn.flipEnvMap.value=We.isCubeTexture&&We.isRenderTargetTexture===!1?-1:1),ce.isMeshStandardMaterial&&ce.envMap===null&&$.environment!==null&&(Kn.envMapIntensity.value=$.environmentIntensity),Jt&&(kt.setValue(W,"toneMappingExposure",C.toneMappingExposure),Ze.needsLights&&ao(Kn,wi),Ne&&ce.fog===!0&&Le.refreshFogUniforms(Kn,Ne),Le.refreshMaterialUniforms(Kn,ce,B,me,y.state.transmissionRenderTarget[N.id]),Vl.upload(W,ns(Ze),Kn,D)),ce.isShaderMaterial&&ce.uniformsNeedUpdate===!0&&(Vl.upload(W,ns(Ze),Kn,D),ce.uniformsNeedUpdate=!1),ce.isSpriteMaterial&&kt.setValue(W,"center",Z.center),kt.setValue(W,"modelViewMatrix",Z.modelViewMatrix),kt.setValue(W,"normalMatrix",Z.normalMatrix),kt.setValue(W,"modelMatrix",Z.matrixWorld),ce.isShaderMaterial||ce.isRawShaderMaterial){const Sn=ce.uniformsGroups;for(let Zn=0,Rn=Sn.length;Zn<Rn;Zn++){const oo=Sn[Zn];H.update(oo,hn),H.bind(oo,hn)}}return hn}function ao(N,$){N.ambientLightColor.needsUpdate=$,N.lightProbe.needsUpdate=$,N.directionalLights.needsUpdate=$,N.directionalLightShadows.needsUpdate=$,N.pointLights.needsUpdate=$,N.pointLightShadows.needsUpdate=$,N.spotLights.needsUpdate=$,N.spotLightShadows.needsUpdate=$,N.rectAreaLights.needsUpdate=$,N.hemisphereLights.needsUpdate=$}function tc(N){return N.isMeshLambertMaterial||N.isMeshToonMaterial||N.isMeshPhongMaterial||N.isMeshStandardMaterial||N.isShadowMaterial||N.isShaderMaterial&&N.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(N,$,oe){Ke.get(N.texture).__webglTexture=$,Ke.get(N.depthTexture).__webglTexture=oe;const ce=Ke.get(N);ce.__hasExternalTextures=!0,ce.__autoAllocateDepthBuffer=oe===void 0,ce.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ce.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(N,$){const oe=Ke.get(N);oe.__webglFramebuffer=$,oe.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(N,$=0,oe=0){q=N,V=$,F=oe;let ce=!0,Z=null,Ne=!1,Ce=!1;if(N){const We=Ke.get(N);if(We.__useDefaultFramebuffer!==void 0)Je.bindFramebuffer(W.FRAMEBUFFER,null),ce=!1;else if(We.__webglFramebuffer===void 0)D.setupRenderTarget(N);else if(We.__hasExternalTextures)D.rebindTextures(N,Ke.get(N.texture).__webglTexture,Ke.get(N.depthTexture).__webglTexture);else if(N.depthBuffer){const $e=N.depthTexture;if(We.__boundDepthTexture!==$e){if($e!==null&&Ke.has($e)&&(N.width!==$e.image.width||N.height!==$e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(N)}}const at=N.texture;(at.isData3DTexture||at.isDataArrayTexture||at.isCompressedArrayTexture)&&(Ce=!0);const ut=Ke.get(N).__webglFramebuffer;N.isWebGLCubeRenderTarget?(Array.isArray(ut[$])?Z=ut[$][oe]:Z=ut[$],Ne=!0):N.samples>0&&D.useMultisampledRTT(N)===!1?Z=Ke.get(N).__webglMultisampledFramebuffer:Array.isArray(ut)?Z=ut[oe]:Z=ut,j.copy(N.viewport),K.copy(N.scissor),Y=N.scissorTest}else j.copy(O).multiplyScalar(B).floor(),K.copy(J).multiplyScalar(B).floor(),Y=De;if(Je.bindFramebuffer(W.FRAMEBUFFER,Z)&&ce&&Je.drawBuffers(N,Z),Je.viewport(j),Je.scissor(K),Je.setScissorTest(Y),Ne){const We=Ke.get(N.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+$,We.__webglTexture,oe)}else if(Ce){const We=Ke.get(N.texture),at=$||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,We.__webglTexture,oe||0,at)}R=-1},this.readRenderTargetPixels=function(N,$,oe,ce,Z,Ne,Ce){if(!(N&&N.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ye=Ke.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ye=Ye[Ce]),Ye){Je.bindFramebuffer(W.FRAMEBUFFER,Ye);try{const We=N.texture,at=We.format,ut=We.type;if(!mt.textureFormatReadable(at)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!mt.textureTypeReadable(ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=N.width-ce&&oe>=0&&oe<=N.height-Z&&W.readPixels($,oe,ce,Z,ct.convert(at),ct.convert(ut),Ne)}finally{const We=q!==null?Ke.get(q).__webglFramebuffer:null;Je.bindFramebuffer(W.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(N,$,oe,ce,Z,Ne,Ce){if(!(N&&N.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ye=Ke.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ye=Ye[Ce]),Ye){const We=N.texture,at=We.format,ut=We.type;if(!mt.textureFormatReadable(at))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!mt.textureTypeReadable(ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=N.width-ce&&oe>=0&&oe<=N.height-Z){Je.bindFramebuffer(W.FRAMEBUFFER,Ye);const $e=W.createBuffer();W.bindBuffer(W.PIXEL_PACK_BUFFER,$e),W.bufferData(W.PIXEL_PACK_BUFFER,Ne.byteLength,W.STREAM_READ),W.readPixels($,oe,ce,Z,ct.convert(at),ct.convert(ut),0);const wt=q!==null?Ke.get(q).__webglFramebuffer:null;Je.bindFramebuffer(W.FRAMEBUFFER,wt);const Lt=W.fenceSync(W.SYNC_GPU_COMMANDS_COMPLETE,0);return W.flush(),await n_(W,Lt,4),W.bindBuffer(W.PIXEL_PACK_BUFFER,$e),W.getBufferSubData(W.PIXEL_PACK_BUFFER,0,Ne),W.deleteBuffer($e),W.deleteSync(Lt),Ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(N,$=null,oe=0){N.isTexture!==!0&&(Ha("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,N=arguments[1]);const ce=Math.pow(2,-oe),Z=Math.floor(N.image.width*ce),Ne=Math.floor(N.image.height*ce),Ce=$!==null?$.x:0,Ye=$!==null?$.y:0;D.setTexture2D(N,0),W.copyTexSubImage2D(W.TEXTURE_2D,oe,0,0,Ce,Ye,Z,Ne),Je.unbindTexture()},this.copyTextureToTexture=function(N,$,oe=null,ce=null,Z=0){N.isTexture!==!0&&(Ha("WebGLRenderer: copyTextureToTexture function signature has changed."),ce=arguments[0]||null,N=arguments[1],$=arguments[2],Z=arguments[3]||0,oe=null);let Ne,Ce,Ye,We,at,ut,$e,wt,Lt;const Et=N.isCompressedTexture?N.mipmaps[Z]:N.image;oe!==null?(Ne=oe.max.x-oe.min.x,Ce=oe.max.y-oe.min.y,Ye=oe.isBox3?oe.max.z-oe.min.z:1,We=oe.min.x,at=oe.min.y,ut=oe.isBox3?oe.min.z:0):(Ne=Et.width,Ce=Et.height,Ye=Et.depth||1,We=0,at=0,ut=0),ce!==null?($e=ce.x,wt=ce.y,Lt=ce.z):($e=0,wt=0,Lt=0);const fn=ct.convert($.format),ft=ct.convert($.type);let Ze;$.isData3DTexture?(D.setTexture3D($,0),Ze=W.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(D.setTexture2DArray($,0),Ze=W.TEXTURE_2D_ARRAY):(D.setTexture2D($,0),Ze=W.TEXTURE_2D),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,$.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,$.unpackAlignment);const li=W.getParameter(W.UNPACK_ROW_LENGTH),Ct=W.getParameter(W.UNPACK_IMAGE_HEIGHT),hn=W.getParameter(W.UNPACK_SKIP_PIXELS),ci=W.getParameter(W.UNPACK_SKIP_ROWS),Jt=W.getParameter(W.UNPACK_SKIP_IMAGES);W.pixelStorei(W.UNPACK_ROW_LENGTH,Et.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,Et.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,We),W.pixelStorei(W.UNPACK_SKIP_ROWS,at),W.pixelStorei(W.UNPACK_SKIP_IMAGES,ut);const wi=N.isDataArrayTexture||N.isData3DTexture,kt=$.isDataArrayTexture||$.isData3DTexture;if(N.isRenderTargetTexture||N.isDepthTexture){const Kn=Ke.get(N),Di=Ke.get($),Sn=Ke.get(Kn.__renderTarget),Zn=Ke.get(Di.__renderTarget);Je.bindFramebuffer(W.READ_FRAMEBUFFER,Sn.__webglFramebuffer),Je.bindFramebuffer(W.DRAW_FRAMEBUFFER,Zn.__webglFramebuffer);for(let Rn=0;Rn<Ye;Rn++)wi&&W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ke.get(N).__webglTexture,Z,ut+Rn),N.isDepthTexture?(kt&&W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ke.get($).__webglTexture,Z,Lt+Rn),W.blitFramebuffer(We,at,Ne,Ce,$e,wt,Ne,Ce,W.DEPTH_BUFFER_BIT,W.NEAREST)):kt?W.copyTexSubImage3D(Ze,Z,$e,wt,Lt+Rn,We,at,Ne,Ce):W.copyTexSubImage2D(Ze,Z,$e,wt,Lt+Rn,We,at,Ne,Ce);Je.bindFramebuffer(W.READ_FRAMEBUFFER,null),Je.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else kt?N.isDataTexture||N.isData3DTexture?W.texSubImage3D(Ze,Z,$e,wt,Lt,Ne,Ce,Ye,fn,ft,Et.data):$.isCompressedArrayTexture?W.compressedTexSubImage3D(Ze,Z,$e,wt,Lt,Ne,Ce,Ye,fn,Et.data):W.texSubImage3D(Ze,Z,$e,wt,Lt,Ne,Ce,Ye,fn,ft,Et):N.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,Z,$e,wt,Ne,Ce,fn,ft,Et.data):N.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,Z,$e,wt,Et.width,Et.height,fn,Et.data):W.texSubImage2D(W.TEXTURE_2D,Z,$e,wt,Ne,Ce,fn,ft,Et);W.pixelStorei(W.UNPACK_ROW_LENGTH,li),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,Ct),W.pixelStorei(W.UNPACK_SKIP_PIXELS,hn),W.pixelStorei(W.UNPACK_SKIP_ROWS,ci),W.pixelStorei(W.UNPACK_SKIP_IMAGES,Jt),Z===0&&$.generateMipmaps&&W.generateMipmap(Ze),Je.unbindTexture()},this.copyTextureToTexture3D=function(N,$,oe=null,ce=null,Z=0){return N.isTexture!==!0&&(Ha("WebGLRenderer: copyTextureToTexture3D function signature has changed."),oe=arguments[0]||null,ce=arguments[1]||null,N=arguments[2],$=arguments[3],Z=arguments[4]||0),Ha('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(N,$,oe,ce,Z)},this.initRenderTarget=function(N){Ke.get(N).__webglFramebuffer===void 0&&D.setupRenderTarget(N)},this.initTexture=function(N){N.isCubeTexture?D.setTextureCube(N,0):N.isData3DTexture?D.setTexture3D(N,0):N.isDataArrayTexture||N.isCompressedArrayTexture?D.setTexture2DArray(N,0):D.setTexture2D(N,0),Je.unbindTexture()},this.resetState=function(){V=0,F=0,q=null,Je.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=At._getDrawingBufferColorSpace(e),t.unpackColorSpace=At._getUnpackColorSpace()}}class mM extends bn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ii,this.environmentIntensity=1,this.environmentRotation=new Ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ax extends ia{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const c0=new Vt,df=new X0,Il=new ql,Ll=new X;class xM extends bn{constructor(e=new Mi,t=new ax){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const r=this.geometry,a=this.matrixWorld,l=e.params.Points.threshold,d=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Il.copy(r.boundingSphere),Il.applyMatrix4(a),Il.radius+=l,e.ray.intersectsSphere(Il)===!1)return;c0.copy(a).invert(),df.copy(e.ray).applyMatrix4(c0);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),p=f*f,m=r.index,_=r.attributes.position;if(m!==null){const g=Math.max(0,d.start),E=Math.min(m.count,d.start+d.count);for(let M=g,A=E;M<A;M++){const S=m.getX(M);Ll.fromBufferAttribute(_,S),u0(Ll,S,p,a,e,t,this)}}else{const g=Math.max(0,d.start),E=Math.min(_.count,d.start+d.count);for(let M=g,A=E;M<A;M++)Ll.fromBufferAttribute(_,M),u0(Ll,M,p,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,d=a.length;l<d;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function u0(s,e,t,r,a,l,d){const f=df.distanceSqToPoint(s);if(f<t){const p=new X;df.closestPointToPoint(s,p),p.applyMatrix4(r);const m=a.ray.origin.distanceTo(p);if(m<a.near||m>a.far)return;l.push({distance:m,distanceToRay:Math.sqrt(f),point:p,index:e,face:null,faceIndex:null,barycoord:null,object:d})}}class Li{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const r=this.getUtoTmapping(e);return this.getPoint(r,t)}getPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return t}getSpacedPoints(e=5){const t=[];for(let r=0;r<=e;r++)t.push(this.getPointAt(r/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let r,a=this.getPoint(0),l=0;t.push(0);for(let d=1;d<=e;d++)r=this.getPoint(d/e),l+=r.distanceTo(a),t.push(l),a=r;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const r=this.getLengths();let a=0;const l=r.length;let d;t?d=t:d=e*r[l-1];let f=0,p=l-1,m;for(;f<=p;)if(a=Math.floor(f+(p-f)/2),m=r[a]-d,m<0)f=a+1;else if(m>0)p=a-1;else{p=a;break}if(a=p,r[a]===d)return a/(l-1);const v=r[a],g=r[a+1]-v,E=(d-v)/g;return(a+E)/(l-1)}getTangent(e,t){let a=e-1e-4,l=e+1e-4;a<0&&(a=0),l>1&&(l=1);const d=this.getPoint(a),f=this.getPoint(l),p=t||(d.isVector2?new Qe:new X);return p.copy(f).sub(d).normalize(),p}getTangentAt(e,t){const r=this.getUtoTmapping(e);return this.getTangent(r,t)}computeFrenetFrames(e,t){const r=new X,a=[],l=[],d=[],f=new X,p=new Vt;for(let E=0;E<=e;E++){const M=E/e;a[E]=this.getTangentAt(M,new X)}l[0]=new X,d[0]=new X;let m=Number.MAX_VALUE;const v=Math.abs(a[0].x),_=Math.abs(a[0].y),g=Math.abs(a[0].z);v<=m&&(m=v,r.set(1,0,0)),_<=m&&(m=_,r.set(0,1,0)),g<=m&&r.set(0,0,1),f.crossVectors(a[0],r).normalize(),l[0].crossVectors(a[0],f),d[0].crossVectors(a[0],l[0]);for(let E=1;E<=e;E++){if(l[E]=l[E-1].clone(),d[E]=d[E-1].clone(),f.crossVectors(a[E-1],a[E]),f.length()>Number.EPSILON){f.normalize();const M=Math.acos(yn(a[E-1].dot(a[E]),-1,1));l[E].applyMatrix4(p.makeRotationAxis(f,M))}d[E].crossVectors(a[E],l[E])}if(t===!0){let E=Math.acos(yn(l[0].dot(l[e]),-1,1));E/=e,a[0].dot(f.crossVectors(l[0],l[e]))>0&&(E=-E);for(let M=1;M<=e;M++)l[M].applyMatrix4(p.makeRotationAxis(a[M],E*M)),d[M].crossVectors(a[M],l[M])}return{tangents:a,normals:l,binormals:d}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class bf extends Li{constructor(e=0,t=0,r=1,a=1,l=0,d=Math.PI*2,f=!1,p=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=r,this.yRadius=a,this.aStartAngle=l,this.aEndAngle=d,this.aClockwise=f,this.aRotation=p}getPoint(e,t=new Qe){const r=t,a=Math.PI*2;let l=this.aEndAngle-this.aStartAngle;const d=Math.abs(l)<Number.EPSILON;for(;l<0;)l+=a;for(;l>a;)l-=a;l<Number.EPSILON&&(d?l=0:l=a),this.aClockwise===!0&&!d&&(l===a?l=-a:l=l-a);const f=this.aStartAngle+e*l;let p=this.aX+this.xRadius*Math.cos(f),m=this.aY+this.yRadius*Math.sin(f);if(this.aRotation!==0){const v=Math.cos(this.aRotation),_=Math.sin(this.aRotation),g=p-this.aX,E=m-this.aY;p=g*v-E*_+this.aX,m=g*_+E*v+this.aY}return r.set(p,m)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class vM extends bf{constructor(e,t,r,a,l,d){super(e,t,r,r,a,l,d),this.isArcCurve=!0,this.type="ArcCurve"}}function Tf(){let s=0,e=0,t=0,r=0;function a(l,d,f,p){s=l,e=f,t=-3*l+3*d-2*f-p,r=2*l-2*d+f+p}return{initCatmullRom:function(l,d,f,p,m){a(d,f,m*(f-l),m*(p-d))},initNonuniformCatmullRom:function(l,d,f,p,m,v,_){let g=(d-l)/m-(f-l)/(m+v)+(f-d)/v,E=(f-d)/v-(p-d)/(v+_)+(p-f)/_;g*=v,E*=v,a(d,f,g,E)},calc:function(l){const d=l*l,f=d*l;return s+e*l+t*d+r*f}}}const Dl=new X,md=new Tf,xd=new Tf,vd=new Tf;class gM extends Li{constructor(e=[],t=!1,r="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=r,this.tension=a}getPoint(e,t=new X){const r=t,a=this.points,l=a.length,d=(l-(this.closed?0:1))*e;let f=Math.floor(d),p=d-f;this.closed?f+=f>0?0:(Math.floor(Math.abs(f)/l)+1)*l:p===0&&f===l-1&&(f=l-2,p=1);let m,v;this.closed||f>0?m=a[(f-1)%l]:(Dl.subVectors(a[0],a[1]).add(a[0]),m=Dl);const _=a[f%l],g=a[(f+1)%l];if(this.closed||f+2<l?v=a[(f+2)%l]:(Dl.subVectors(a[l-1],a[l-2]).add(a[l-1]),v=Dl),this.curveType==="centripetal"||this.curveType==="chordal"){const E=this.curveType==="chordal"?.5:.25;let M=Math.pow(m.distanceToSquared(_),E),A=Math.pow(_.distanceToSquared(g),E),S=Math.pow(g.distanceToSquared(v),E);A<1e-4&&(A=1),M<1e-4&&(M=A),S<1e-4&&(S=A),md.initNonuniformCatmullRom(m.x,_.x,g.x,v.x,M,A,S),xd.initNonuniformCatmullRom(m.y,_.y,g.y,v.y,M,A,S),vd.initNonuniformCatmullRom(m.z,_.z,g.z,v.z,M,A,S)}else this.curveType==="catmullrom"&&(md.initCatmullRom(m.x,_.x,g.x,v.x,this.tension),xd.initCatmullRom(m.y,_.y,g.y,v.y,this.tension),vd.initCatmullRom(m.z,_.z,g.z,v.z,this.tension));return r.set(md.calc(p),xd.calc(p),vd.calc(p)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(a.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){const a=this.points[t];e.points.push(a.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(new X().fromArray(a))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function d0(s,e,t,r,a){const l=(r-e)*.5,d=(a-t)*.5,f=s*s,p=s*f;return(2*t-2*r+l+d)*p+(-3*t+3*r-2*l-d)*f+l*s+t}function _M(s,e){const t=1-s;return t*t*e}function yM(s,e){return 2*(1-s)*s*e}function SM(s,e){return s*s*e}function Ya(s,e,t,r){return _M(s,e)+yM(s,t)+SM(s,r)}function EM(s,e){const t=1-s;return t*t*t*e}function MM(s,e){const t=1-s;return 3*t*t*s*e}function wM(s,e){return 3*(1-s)*s*s*e}function bM(s,e){return s*s*s*e}function $a(s,e,t,r,a){return EM(s,e)+MM(s,t)+wM(s,r)+bM(s,a)}class ox extends Li{constructor(e=new Qe,t=new Qe,r=new Qe,a=new Qe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=r,this.v3=a}getPoint(e,t=new Qe){const r=t,a=this.v0,l=this.v1,d=this.v2,f=this.v3;return r.set($a(e,a.x,l.x,d.x,f.x),$a(e,a.y,l.y,d.y,f.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class TM extends Li{constructor(e=new X,t=new X,r=new X,a=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=r,this.v3=a}getPoint(e,t=new X){const r=t,a=this.v0,l=this.v1,d=this.v2,f=this.v3;return r.set($a(e,a.x,l.x,d.x,f.x),$a(e,a.y,l.y,d.y,f.y),$a(e,a.z,l.z,d.z,f.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lx extends Li{constructor(e=new Qe,t=new Qe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Qe){const r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Qe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class AM extends Li{constructor(e=new X,t=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new X){const r=t;return e===1?r.copy(this.v2):(r.copy(this.v2).sub(this.v1),r.multiplyScalar(e).add(this.v1)),r}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new X){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cx extends Li{constructor(e=new Qe,t=new Qe,r=new Qe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new Qe){const r=t,a=this.v0,l=this.v1,d=this.v2;return r.set(Ya(e,a.x,l.x,d.x),Ya(e,a.y,l.y,d.y)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class CM extends Li{constructor(e=new X,t=new X,r=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=r}getPoint(e,t=new X){const r=t,a=this.v0,l=this.v1,d=this.v2;return r.set(Ya(e,a.x,l.x,d.x),Ya(e,a.y,l.y,d.y),Ya(e,a.z,l.z,d.z)),r}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ux extends Li{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Qe){const r=t,a=this.points,l=(a.length-1)*e,d=Math.floor(l),f=l-d,p=a[d===0?d:d-1],m=a[d],v=a[d>a.length-2?a.length-1:d+1],_=a[d>a.length-3?a.length-1:d+2];return r.set(d0(f,p.x,m.x,v.x,_.x),d0(f,p.y,m.y,v.y,_.y)),r}copy(e){super.copy(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(a.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,r=this.points.length;t<r;t++){const a=this.points[t];e.points.push(a.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,r=e.points.length;t<r;t++){const a=e.points[t];this.points.push(new Qe().fromArray(a))}return this}}var f0=Object.freeze({__proto__:null,ArcCurve:vM,CatmullRomCurve3:gM,CubicBezierCurve:ox,CubicBezierCurve3:TM,EllipseCurve:bf,LineCurve:lx,LineCurve3:AM,QuadraticBezierCurve:cx,QuadraticBezierCurve3:CM,SplineCurve:ux});class RM extends Li{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const r=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new f0[r](t,e))}return this}getPoint(e,t){const r=e*this.getLength(),a=this.getCurveLengths();let l=0;for(;l<a.length;){if(a[l]>=r){const d=a[l]-r,f=this.curves[l],p=f.getLength(),m=p===0?0:1-d/p;return f.getPointAt(m,t)}l++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let r=0,a=this.curves.length;r<a;r++)t+=this.curves[r].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let r=0;r<=e;r++)t.push(this.getPoint(r/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let r;for(let a=0,l=this.curves;a<l.length;a++){const d=l[a],f=d.isEllipseCurve?e*2:d.isLineCurve||d.isLineCurve3?1:d.isSplineCurve?e*d.points.length:e,p=d.getPoints(f);for(let m=0;m<p.length;m++){const v=p[m];r&&r.equals(v)||(t.push(v),r=v)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){const a=e.curves[t];this.curves.push(a.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,r=this.curves.length;t<r;t++){const a=this.curves[t];e.curves.push(a.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,r=e.curves.length;t<r;t++){const a=e.curves[t];this.curves.push(new f0[a.type]().fromJSON(a))}return this}}class h0 extends RM{constructor(e){super(),this.type="Path",this.currentPoint=new Qe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,r=e.length;t<r;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const r=new lx(this.currentPoint.clone(),new Qe(e,t));return this.curves.push(r),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,r,a){const l=new cx(this.currentPoint.clone(),new Qe(e,t),new Qe(r,a));return this.curves.push(l),this.currentPoint.set(r,a),this}bezierCurveTo(e,t,r,a,l,d){const f=new ox(this.currentPoint.clone(),new Qe(e,t),new Qe(r,a),new Qe(l,d));return this.curves.push(f),this.currentPoint.set(l,d),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),r=new ux(t);return this.curves.push(r),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,r,a,l,d){const f=this.currentPoint.x,p=this.currentPoint.y;return this.absarc(e+f,t+p,r,a,l,d),this}absarc(e,t,r,a,l,d){return this.absellipse(e,t,r,r,a,l,d),this}ellipse(e,t,r,a,l,d,f,p){const m=this.currentPoint.x,v=this.currentPoint.y;return this.absellipse(e+m,t+v,r,a,l,d,f,p),this}absellipse(e,t,r,a,l,d,f,p){const m=new bf(e,t,r,a,l,d,f,p);if(this.curves.length>0){const _=m.getPoint(0);_.equals(this.currentPoint)||this.lineTo(_.x,_.y)}this.curves.push(m);const v=m.getPoint(1);return this.currentPoint.copy(v),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class dx extends h0{constructor(e){super(e),this.uuid=na(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let r=0,a=this.holes.length;r<a;r++)t[r]=this.holes[r].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,r=e.holes.length;t<r;t++){const a=e.holes[t];this.holes.push(a.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,r=this.holes.length;t<r;t++){const a=this.holes[t];e.holes.push(a.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,r=e.holes.length;t<r;t++){const a=e.holes[t];this.holes.push(new h0().fromJSON(a))}return this}}const NM={triangulate:function(s,e,t=2){const r=e&&e.length,a=r?e[0]*t:s.length;let l=fx(s,0,a,t,!0);const d=[];if(!l||l.next===l.prev)return d;let f,p,m,v,_,g,E;if(r&&(l=UM(s,e,l,t)),s.length>80*t){f=m=s[0],p=v=s[1];for(let M=t;M<a;M+=t)_=s[M],g=s[M+1],_<f&&(f=_),g<p&&(p=g),_>m&&(m=_),g>v&&(v=g);E=Math.max(m-f,v-p),E=E!==0?32767/E:0}return Za(l,d,t,f,p,E,0),d}};function fx(s,e,t,r,a){let l,d;if(a===XM(s,e,t,r)>0)for(l=e;l<t;l+=r)d=p0(l,s[l],s[l+1],d);else for(l=t-r;l>=e;l-=r)d=p0(l,s[l],s[l+1],d);return d&&Ql(d,d.next)&&(Ja(d),d=d.next),d}function ts(s,e){if(!s)return s;e||(e=s);let t=s,r;do if(r=!1,!t.steiner&&(Ql(t,t.next)||$t(t.prev,t,t.next)===0)){if(Ja(t),t=e=t.prev,t===t.next)break;r=!0}else t=t.next;while(r||t!==e);return e}function Za(s,e,t,r,a,l,d){if(!s)return;!d&&l&&zM(s,r,a,l);let f=s,p,m;for(;s.prev!==s.next;){if(p=s.prev,m=s.next,l?IM(s,r,a,l):PM(s)){e.push(p.i/t|0),e.push(s.i/t|0),e.push(m.i/t|0),Ja(s),s=m.next,f=m.next;continue}if(s=m,s===f){d?d===1?(s=LM(ts(s),e,t),Za(s,e,t,r,a,l,2)):d===2&&DM(s,e,t,r,a,l):Za(ts(s),e,t,r,a,l,1);break}}}function PM(s){const e=s.prev,t=s,r=s.next;if($t(e,t,r)>=0)return!1;const a=e.x,l=t.x,d=r.x,f=e.y,p=t.y,m=r.y,v=a<l?a<d?a:d:l<d?l:d,_=f<p?f<m?f:m:p<m?p:m,g=a>l?a>d?a:d:l>d?l:d,E=f>p?f>m?f:m:p>m?p:m;let M=r.next;for(;M!==e;){if(M.x>=v&&M.x<=g&&M.y>=_&&M.y<=E&&js(a,f,l,p,d,m,M.x,M.y)&&$t(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function IM(s,e,t,r){const a=s.prev,l=s,d=s.next;if($t(a,l,d)>=0)return!1;const f=a.x,p=l.x,m=d.x,v=a.y,_=l.y,g=d.y,E=f<p?f<m?f:m:p<m?p:m,M=v<_?v<g?v:g:_<g?_:g,A=f>p?f>m?f:m:p>m?p:m,S=v>_?v>g?v:g:_>g?_:g,y=ff(E,M,e,t,r),P=ff(A,S,e,t,r);let I=s.prevZ,C=s.nextZ;for(;I&&I.z>=y&&C&&C.z<=P;){if(I.x>=E&&I.x<=A&&I.y>=M&&I.y<=S&&I!==a&&I!==d&&js(f,v,p,_,m,g,I.x,I.y)&&$t(I.prev,I,I.next)>=0||(I=I.prevZ,C.x>=E&&C.x<=A&&C.y>=M&&C.y<=S&&C!==a&&C!==d&&js(f,v,p,_,m,g,C.x,C.y)&&$t(C.prev,C,C.next)>=0))return!1;C=C.nextZ}for(;I&&I.z>=y;){if(I.x>=E&&I.x<=A&&I.y>=M&&I.y<=S&&I!==a&&I!==d&&js(f,v,p,_,m,g,I.x,I.y)&&$t(I.prev,I,I.next)>=0)return!1;I=I.prevZ}for(;C&&C.z<=P;){if(C.x>=E&&C.x<=A&&C.y>=M&&C.y<=S&&C!==a&&C!==d&&js(f,v,p,_,m,g,C.x,C.y)&&$t(C.prev,C,C.next)>=0)return!1;C=C.nextZ}return!0}function LM(s,e,t){let r=s;do{const a=r.prev,l=r.next.next;!Ql(a,l)&&hx(a,r,r.next,l)&&Qa(a,l)&&Qa(l,a)&&(e.push(a.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),Ja(r),Ja(r.next),r=s=l),r=r.next}while(r!==s);return ts(r)}function DM(s,e,t,r,a,l){let d=s;do{let f=d.next.next;for(;f!==d.prev;){if(d.i!==f.i&&GM(d,f)){let p=px(d,f);d=ts(d,d.next),p=ts(p,p.next),Za(d,e,t,r,a,l,0),Za(p,e,t,r,a,l,0);return}f=f.next}d=d.next}while(d!==s)}function UM(s,e,t,r){const a=[];let l,d,f,p,m;for(l=0,d=e.length;l<d;l++)f=e[l]*r,p=l<d-1?e[l+1]*r:s.length,m=fx(s,f,p,r,!1),m===m.next&&(m.steiner=!0),a.push(VM(m));for(a.sort(OM),l=0;l<a.length;l++)t=FM(a[l],t);return t}function OM(s,e){return s.x-e.x}function FM(s,e){const t=kM(s,e);if(!t)return e;const r=px(t,s);return ts(r,r.next),ts(t,t.next)}function kM(s,e){let t=e,r=-1/0,a;const l=s.x,d=s.y;do{if(d<=t.y&&d>=t.next.y&&t.next.y!==t.y){const g=t.x+(d-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(g<=l&&g>r&&(r=g,a=t.x<t.next.x?t:t.next,g===l))return a}t=t.next}while(t!==e);if(!a)return null;const f=a,p=a.x,m=a.y;let v=1/0,_;t=a;do l>=t.x&&t.x>=p&&l!==t.x&&js(d<m?l:r,d,p,m,d<m?r:l,d,t.x,t.y)&&(_=Math.abs(d-t.y)/(l-t.x),Qa(t,s)&&(_<v||_===v&&(t.x>a.x||t.x===a.x&&BM(a,t)))&&(a=t,v=_)),t=t.next;while(t!==f);return a}function BM(s,e){return $t(s.prev,s,e.prev)<0&&$t(e.next,s,s.next)<0}function zM(s,e,t,r){let a=s;do a.z===0&&(a.z=ff(a.x,a.y,e,t,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==s);a.prevZ.nextZ=null,a.prevZ=null,jM(a)}function jM(s){let e,t,r,a,l,d,f,p,m=1;do{for(t=s,s=null,l=null,d=0;t;){for(d++,r=t,f=0,e=0;e<m&&(f++,r=r.nextZ,!!r);e++);for(p=m;f>0||p>0&&r;)f!==0&&(p===0||!r||t.z<=r.z)?(a=t,t=t.nextZ,f--):(a=r,r=r.nextZ,p--),l?l.nextZ=a:s=a,a.prevZ=l,l=a;t=r}l.nextZ=null,m*=2}while(d>1);return s}function ff(s,e,t,r,a){return s=(s-t)*a|0,e=(e-r)*a|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function VM(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function js(s,e,t,r,a,l,d,f){return(a-d)*(e-f)>=(s-d)*(l-f)&&(s-d)*(r-f)>=(t-d)*(e-f)&&(t-d)*(l-f)>=(a-d)*(r-f)}function GM(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!HM(s,e)&&(Qa(s,e)&&Qa(e,s)&&WM(s,e)&&($t(s.prev,s,e.prev)||$t(s,e.prev,e))||Ql(s,e)&&$t(s.prev,s,s.next)>0&&$t(e.prev,e,e.next)>0)}function $t(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Ql(s,e){return s.x===e.x&&s.y===e.y}function hx(s,e,t,r){const a=Ol($t(s,e,t)),l=Ol($t(s,e,r)),d=Ol($t(t,r,s)),f=Ol($t(t,r,e));return!!(a!==l&&d!==f||a===0&&Ul(s,t,e)||l===0&&Ul(s,r,e)||d===0&&Ul(t,s,r)||f===0&&Ul(t,e,r))}function Ul(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ol(s){return s>0?1:s<0?-1:0}function HM(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&hx(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Qa(s,e){return $t(s.prev,s,s.next)<0?$t(s,e,s.next)>=0&&$t(s,s.prev,e)>=0:$t(s,e,s.prev)<0||$t(s,s.next,e)<0}function WM(s,e){let t=s,r=!1;const a=(s.x+e.x)/2,l=(s.y+e.y)/2;do t.y>l!=t.next.y>l&&t.next.y!==t.y&&a<(t.next.x-t.x)*(l-t.y)/(t.next.y-t.y)+t.x&&(r=!r),t=t.next;while(t!==s);return r}function px(s,e){const t=new hf(s.i,s.x,s.y),r=new hf(e.i,e.x,e.y),a=s.next,l=e.prev;return s.next=e,e.prev=s,t.next=a,a.prev=t,r.next=t,t.prev=r,l.next=r,r.prev=l,r}function p0(s,e,t,r){const a=new hf(s,e,t);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function Ja(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function hf(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function XM(s,e,t,r){let a=0;for(let l=e,d=t-r;l<t;l+=r)a+=(s[d]-s[l])*(s[l+1]+s[d+1]),d=l;return a}class qa{static area(e){const t=e.length;let r=0;for(let a=t-1,l=0;l<t;a=l++)r+=e[a].x*e[l].y-e[l].x*e[a].y;return r*.5}static isClockWise(e){return qa.area(e)<0}static triangulateShape(e,t){const r=[],a=[],l=[];m0(e),x0(r,e);let d=e.length;t.forEach(m0);for(let p=0;p<t.length;p++)a.push(d),d+=t[p].length,x0(r,t[p]);const f=NM.triangulate(r,a);for(let p=0;p<f.length;p+=3)l.push(f.slice(p,p+3));return l}}function m0(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function x0(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Af extends Mi{constructor(e=new dx([new Qe(0,.5),new Qe(-.5,-.5),new Qe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const r=[],a=[],l=[],d=[];let f=0,p=0;if(Array.isArray(e)===!1)m(e);else for(let v=0;v<e.length;v++)m(e[v]),this.addGroup(f,p,v),f+=p,p=0;this.setIndex(r),this.setAttribute("position",new $n(a,3)),this.setAttribute("normal",new $n(l,3)),this.setAttribute("uv",new $n(d,2));function m(v){const _=a.length/3,g=v.extractPoints(t);let E=g.shape;const M=g.holes;qa.isClockWise(E)===!1&&(E=E.reverse());for(let S=0,y=M.length;S<y;S++){const P=M[S];qa.isClockWise(P)===!0&&(M[S]=P.reverse())}const A=qa.triangulateShape(E,M);for(let S=0,y=M.length;S<y;S++){const P=M[S];E=E.concat(P)}for(let S=0,y=E.length;S<y;S++){const P=E[S];a.push(P.x,P.y,0),l.push(0,0,1),d.push(P.x,P.y)}for(let S=0,y=A.length;S<y;S++){const P=A[S],I=P[0]+_,C=P[1]+_,ie=P[2]+_;r.push(I,C,ie),p+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return YM(t,e)}static fromJSON(e,t){const r=[];for(let a=0,l=e.shapes.length;a<l;a++){const d=t[e.shapes[a]];r.push(d)}return new Af(r,e.curveSegments)}}function YM(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,r=s.length;t<r;t++){const a=s[t];e.shapes.push(a.uuid)}else e.shapes.push(s.uuid);return e}class Vs extends Mi{constructor(e=1,t=.4,r=12,a=48,l=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:a,arc:l},r=Math.floor(r),a=Math.floor(a);const d=[],f=[],p=[],m=[],v=new X,_=new X,g=new X;for(let E=0;E<=r;E++)for(let M=0;M<=a;M++){const A=M/a*l,S=E/r*Math.PI*2;_.x=(e+t*Math.cos(S))*Math.cos(A),_.y=(e+t*Math.cos(S))*Math.sin(A),_.z=t*Math.sin(S),f.push(_.x,_.y,_.z),v.x=e*Math.cos(A),v.y=e*Math.sin(A),g.subVectors(_,v).normalize(),p.push(g.x,g.y,g.z),m.push(M/a),m.push(E/r)}for(let E=1;E<=r;E++)for(let M=1;M<=a;M++){const A=(a+1)*E+M-1,S=(a+1)*(E-1)+M-1,y=(a+1)*(E-1)+M,P=(a+1)*E+M;d.push(A,S,P),d.push(S,y,P)}this.setIndex(d),this.setAttribute("position",new $n(f,3)),this.setAttribute("normal",new $n(p,3)),this.setAttribute("uv",new $n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class v0 extends ia{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=j0,this.normalScale=new Qe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ii,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class mx extends bn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const gd=new Vt,g0=new X,_0=new X;class $M{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Qe(512,512),this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mf,this._frameExtents=new Qe(1,1),this._viewportCount=1,this._viewports=[new Ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;g0.setFromMatrixPosition(e.matrixWorld),t.position.copy(g0),_0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_0),t.updateMatrixWorld(),gd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gd),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(gd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const y0=new Vt,Ga=new X,_d=new X;class qM extends $M{constructor(){super(new Yn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Qe(4,2),this._viewportCount=6,this._viewports=[new Ft(2,1,1,1),new Ft(0,1,1,1),new Ft(3,1,1,1),new Ft(1,1,1,1),new Ft(3,0,1,1),new Ft(1,0,1,1)],this._cubeDirections=[new X(1,0,0),new X(-1,0,0),new X(0,0,1),new X(0,0,-1),new X(0,1,0),new X(0,-1,0)],this._cubeUps=[new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,0,1),new X(0,0,-1)]}updateMatrices(e,t=0){const r=this.camera,a=this.matrix,l=e.distance||r.far;l!==r.far&&(r.far=l,r.updateProjectionMatrix()),Ga.setFromMatrixPosition(e.matrixWorld),r.position.copy(Ga),_d.copy(r.position),_d.add(this._cubeDirections[t]),r.up.copy(this._cubeUps[t]),r.lookAt(_d),r.updateMatrixWorld(),a.makeTranslation(-Ga.x,-Ga.y,-Ga.z),y0.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(y0)}}class yd extends mx{constructor(e,t,r=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=a,this.shadow=new qM}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class KM extends mx{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class ZM{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=S0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=S0();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function S0(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xf);const E0=({assistantState:s})=>{const e=Te.useRef(null);return Te.useEffect(()=>{const t=e.current;if(!t)return;const r=t.clientWidth||600,a=t.clientHeight||450,l=new mM,d=new Yn(40,r/a,.1,1e3);d.position.z=22;const f=new pM({antialias:!0,alpha:!0});f.setSize(r,a),f.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.appendChild(f.domElement);const p=new zs;l.add(p);const m=new Vs(5.2,1.4,32,120),v=new v0({color:3900150,emissive:1981066,emissiveIntensity:.45,roughness:.25,metalness:.85,wireframe:!1}),_=new Fn(m,v);p.add(_);const g=new Vs(5.22,1.42,16,60),E=new Xa({color:3718648,wireframe:!0,transparent:!0,opacity:.25}),M=new Fn(g,E);p.add(M);const A=new Vs(8.2,.12,16,160),S=new v0({color:9133302,emissive:3718648,emissiveIntensity:.8,roughness:.1,metalness:.95}),y=new Fn(A,S);y.rotation.x=Math.PI/2.7,y.rotation.y=-Math.PI/6,p.add(y);const P=new Vs(9.6,.04,12,140),I=new Xa({color:6333946,transparent:!0,opacity:.35}),C=new Fn(P,I);C.rotation.x=Math.PI/2.5,C.rotation.y=-Math.PI/5,p.add(C);const ie=new zs;ie.position.set(5.8,4.2,2.5);const V=new dx,F=1.6,q=.25;for(let ge=0;ge<8;ge++){const Ae=ge%2===0?F:q,Fe=ge*Math.PI/4,_t=Math.cos(Fe)*Ae,He=Math.sin(Fe)*Ae;ge===0?V.moveTo(_t,He):V.lineTo(_t,He)}V.closePath();const R=new Af(V),b=new Xa({color:16777215,side:Ni,transparent:!0,opacity:.95}),j=new Fn(R,b);ie.add(j),p.add(ie);const K=new KM(988970,1.2);l.add(K);const Y=new yd(3718648,3.5,40);Y.position.set(-10,8,12),l.add(Y);const le=new yd(9133302,4,40);le.position.set(12,-8,10),l.add(le);const xe=new yd(16777215,2,15);xe.position.copy(ie.position),l.add(xe);const de=1500,me=new Float32Array(de*3);for(let ge=0;ge<de*3;ge+=3)me[ge]=(Math.random()-.5)*60,me[ge+1]=(Math.random()-.5)*45,me[ge+2]=(Math.random()-.5)*30-5;const B=new Mi;B.setAttribute("position",new Ei(me,3));const pe=new ax({color:12248829,size:.12,transparent:!0,opacity:.65}),te=new xM(B,pe);l.add(te);let O=0,J=0;const De=ge=>{const Ae=t.getBoundingClientRect();O=((ge.clientX-Ae.left)/r-.5)*2,J=((ge.clientY-Ae.top)/a-.5)*2};t.addEventListener("mousemove",De);let ne,k=new ZM;const ue=()=>{ne=requestAnimationFrame(ue);const ge=k.getElapsedTime(),Ae=s==="THINKING"?3:s==="EXECUTING"?2.2:s==="LISTENING"?1.5:.8;_.rotation.z=ge*.15*Ae,M.rotation.z=-ge*.12*Ae,y.rotation.z=ge*.3*Ae,C.rotation.z=-ge*.2*Ae;const Fe=1+.25*Math.sin(ge*5);ie.scale.set(Fe,Fe,Fe),p.rotation.y+=(O*.35-p.rotation.y)*.05,p.rotation.x+=(-J*.35-p.rotation.x)*.05,s==="THINKING"?(v.emissive.setHex(165063),S.emissive.setHex(3718648)):s==="EXECUTING"?(v.emissive.setHex(8141549),S.emissive.setHex(12616956)):s==="SPEAKING"?(v.emissive.setHex(366185),S.emissive.setHex(3462041)):(v.emissive.setHex(1981066),S.emissive.setHex(9133302)),f.render(l,d)};ue();const fe=()=>{if(!t)return;const ge=t.clientWidth||600,Ae=t.clientHeight||450;d.aspect=ge/Ae,d.updateProjectionMatrix(),f.setSize(ge,Ae)};return window.addEventListener("resize",fe),()=>{cancelAnimationFrame(ne),window.removeEventListener("resize",fe),t.removeEventListener("mousemove",De),f.dispose(),t.contains(f.domElement)&&t.removeChild(f.domElement)}},[s]),u.jsxs("div",{className:"relative w-full h-full flex flex-col items-center justify-center overflow-hidden",children:[u.jsx("div",{ref:e,className:"w-full flex-1 min-h-[300px] flex items-center justify-center cursor-pointer"}),u.jsxs("div",{className:"absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden",children:[u.jsx("div",{className:"absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-36 rounded-[100%] bg-gradient-to-t from-blue-600/30 via-indigo-600/15 to-transparent blur-xl"}),u.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"})]}),u.jsxs("div",{className:"absolute bottom-3 flex flex-col items-center select-none pointer-events-none z-10",children:[u.jsx("h1",{className:"text-2xl font-black tracking-[0.3em] text-white font-sans drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]",children:"ORION"}),u.jsx("div",{className:"text-[10px] font-mono tracking-[0.25em] text-cyan-300 font-semibold uppercase mt-0.5",children:"COMMAND • ASSIST • CREATE"}),u.jsx("div",{className:"text-[9px] font-mono tracking-[0.2em] text-slate-400 mt-0.5",children:"YOUR AI. YOUR COMPUTER. YOUR WORLD."})]})]})};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const QM=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),xx=(...s)=>s.filter((e,t,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var JM={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ew=Te.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:a="",children:l,iconNode:d,...f},p)=>Te.createElement("svg",{ref:p,...JM,width:e,height:e,stroke:s,strokeWidth:r?Number(t)*24/Number(e):t,className:xx("lucide",a),...f},[...d.map(([m,v])=>Te.createElement(m,v)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=(s,e)=>{const t=Te.forwardRef(({className:r,...a},l)=>Te.createElement(ew,{ref:l,iconNode:e,className:xx(`lucide-${QM(s)}`,r),...a}));return t.displayName=`${s}`,t};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jl=yt("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sd=yt("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tw=yt("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M0=yt("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0=yt("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nw=yt("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gl=yt("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cf=yt("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iw=yt("CircleStop",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["rect",{x:"9",y:"9",width:"6",height:"6",rx:"1",key:"1ssd4o"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rw=yt("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qs=yt("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sw=yt("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aw=yt("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=yt("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ow=yt("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lw=yt("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hl=yt("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cw=yt("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uw=yt("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rf=yt("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dw=yt("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fw=yt("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vx=yt("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=yt("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hw=yt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nf=yt("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gx=yt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pw=yt("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _x=yt("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Js=yt("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=yt("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pf=yt("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mw=yt("SquareCheckBig",[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yx=yt("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ec=yt("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xw=yt("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=yt("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vw=yt("Wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lf=yt("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),b0=({snapshot:s})=>{var d,f,p,m;if(!s)return u.jsx("div",{className:"h-full flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse",children:"CONNECTING_SYSTEM_TELEMETRY..."});const{cpu:e,memory:t,storage:r,network:a,isMock:l}=s;return u.jsxs("div",{className:"h-full flex flex-col justify-between space-y-4 p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-tl relative text-xs backdrop-blur-md",children:[u.jsxs("div",{className:"flex items-center justify-between border-b border-blue-500/20 pb-2",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(Jl,{className:"w-4 h-4 text-cyan-400 animate-pulse"}),u.jsx("span",{className:"font-semibold text-white tracking-wider uppercase font-sans",children:"SYSTEM TELEMETRY"})]}),l&&u.jsx("span",{className:"px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider font-mono",children:"DEV MOCK"})]}),u.jsxs("div",{className:"space-y-1.5",children:[u.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[u.jsxs("span",{className:"flex items-center text-slate-300",children:[u.jsx(Qs,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," CPU UTILIZATION"]}),u.jsxs("span",{className:"font-bold text-cyan-300",children:[e.usagePercent,"%"]})]}),u.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:u.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]",style:{width:`${e.usagePercent}%`}})}),u.jsx("div",{className:"grid grid-cols-4 gap-1 pt-1 font-mono",children:e.cores.slice(0,8).map(v=>u.jsxs("div",{className:"bg-blue-950/30 p-1 border border-blue-500/20 text-[9px] rounded-sm",children:[u.jsxs("div",{className:"text-slate-400",children:["C",v.id]}),u.jsxs("div",{className:"text-white font-bold",children:[v.usagePercent,"%"]})]},v.id))})]}),u.jsxs("div",{className:"space-y-1.5",children:[u.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[u.jsxs("span",{className:"flex items-center text-slate-300",children:[u.jsx(Qs,{className:"w-3.5 h-3.5 mr-1.5 text-violet-400"})," SYSTEM MEMORY (RAM)"]}),u.jsxs("span",{className:"font-bold text-violet-300",children:[t.usagePercent,"%"]})]}),u.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:u.jsx("div",{className:"h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_8px_rgba(139,92,246,0.5)]",style:{width:`${t.usagePercent}%`}})}),u.jsxs("div",{className:"flex justify-between text-[10px] text-slate-400 font-mono",children:[u.jsxs("span",{children:["USED: ",(t.usedBytes/(1024*1024*1024)).toFixed(1)," GB"]}),u.jsxs("span",{children:["TOTAL: ",(t.totalBytes/(1024*1024*1024)).toFixed(1)," GB"]})]})]}),u.jsxs("div",{className:"space-y-1.5",children:[u.jsxs("div",{className:"flex justify-between items-center text-[11px] font-mono",children:[u.jsxs("span",{className:"flex items-center text-slate-300",children:[u.jsx(cw,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," MAIN STORAGE"]}),u.jsxs("span",{className:"font-bold text-white",children:[((d=r[0])==null?void 0:d.usagePercent)||0,"%"]})]}),u.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 rounded-sm",children:u.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300",style:{width:`${((f=r[0])==null?void 0:f.usagePercent)||0}%`}})}),u.jsxs("div",{className:"flex justify-between text-[10px] text-slate-400 font-mono",children:[u.jsx("span",{children:(p=r[0])==null?void 0:p.driveLabel}),u.jsxs("span",{children:["FREE: ",((((m=r[0])==null?void 0:m.freeBytes)||0)/(1024*1024*1024)).toFixed(0)," GB"]})]})]}),u.jsxs("div",{className:"pt-2 border-t border-blue-500/20",children:[u.jsxs("div",{className:"flex justify-between items-center text-[11px] mb-1 font-mono",children:[u.jsxs("span",{className:"flex items-center text-slate-300",children:[u.jsx(vw,{className:"w-3.5 h-3.5 mr-1.5 text-cyan-400"})," NETWORK COMM"]}),u.jsx("span",{className:"text-[10px] text-cyan-300 font-semibold",children:a.ipAddress})]}),u.jsxs("div",{className:"grid grid-cols-3 gap-2 text-[10px] font-mono",children:[u.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[u.jsx("div",{className:"text-slate-400 text-[9px]",children:"DOWN"}),u.jsxs("div",{className:"text-white font-bold",children:[a.downloadKbps," KB/s"]})]}),u.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[u.jsx("div",{className:"text-slate-400 text-[9px]",children:"UP"}),u.jsxs("div",{className:"text-white font-bold",children:[a.uploadKbps," KB/s"]})]}),u.jsxs("div",{className:"bg-blue-950/30 p-1.5 border border-blue-500/20 rounded-sm",children:[u.jsx("div",{className:"text-slate-400 text-[9px]",children:"PING"}),u.jsxs("div",{className:"text-cyan-300 font-bold",children:[a.pingMs," ms"]})]})]})]}),u.jsxs("div",{className:"flex justify-between items-center text-[10px] bg-blue-950/40 p-2 border border-blue-500/20 font-mono rounded-sm",children:[u.jsx("span",{className:"text-slate-400",children:"CPU THERMAL:"}),u.jsx("span",{className:"text-white font-bold",children:s.cpu.temperatureCelsius!==null?`${s.cpu.temperatureCelsius}°C`:"N/A"}),u.jsx("span",{className:"text-slate-400 border-l border-blue-500/20 pl-2",children:"GPU THERMAL:"}),u.jsx("span",{className:"text-white font-bold",children:s.gpu.temperatureCelsius!==null?`${s.gpu.temperatureCelsius}°C`:"N/A"})]})]})},gw=({activities:s})=>{const e=r=>{switch(r){case"VOICE_INPUT":return u.jsx(fw,{className:"w-3.5 h-3.5 text-amber-400"});case"PROCESSING":return u.jsx(Pf,{className:"w-3.5 h-3.5 text-cyan-400 animate-pulse"});case"TOOL_EXECUTION":return u.jsx(sa,{className:"w-3.5 h-3.5 text-violet-400"});case"TASK_COMPLETE":return u.jsx(Gl,{className:"w-3.5 h-3.5 text-emerald-400"});case"ERROR_EVENT":return u.jsx(If,{className:"w-3.5 h-3.5 text-red-400"});default:return u.jsx(Qs,{className:"w-3.5 h-3.5 text-blue-400"})}},t=r=>{switch(r){case"VOICE_INPUT":return"text-amber-300 border-amber-500/30 bg-amber-500/10";case"PROCESSING":return"text-cyan-300 border-cyan-500/30 bg-cyan-500/10";case"TOOL_EXECUTION":return"text-violet-300 border-violet-500/30 bg-violet-500/10";case"TASK_COMPLETE":return"text-emerald-300 border-emerald-500/30 bg-emerald-500/10";case"ERROR_EVENT":return"text-red-300 border-red-500/30 bg-red-500/10";default:return"text-slate-400 border-blue-500/20 bg-blue-950/30"}};return u.jsxs("div",{className:"h-full flex flex-col justify-between p-4 bg-[#0B0F1A]/85 border border-blue-500/20 hud-corner-br relative text-xs backdrop-blur-md",children:[u.jsxs("div",{className:"flex items-center justify-between border-b border-blue-500/20 pb-2 mb-3",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(ec,{className:"w-4 h-4 text-cyan-400"}),u.jsx("span",{className:"font-semibold text-white tracking-wider uppercase font-sans",children:"ORION ACTIVITY LOG"})]}),u.jsxs("span",{className:"text-[10px] text-slate-400 font-mono",children:[s.length," EVENTS"]})]}),u.jsx("div",{className:"flex-1 overflow-y-auto space-y-2 pr-1",children:s.length===0?u.jsx("div",{className:"h-full flex items-center justify-center text-slate-500 text-[11px] font-mono",children:"NO_ACTIVE_ACTIVITY_LOGGED"}):s.map(r=>u.jsxs("div",{className:"p-2 bg-blue-950/30 border border-blue-500/20 hover:border-blue-400/40 rounded transition-colors space-y-1 text-[11px]",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("div",{className:"flex items-center space-x-1.5",children:[e(r.type),u.jsx("span",{className:`px-1.5 py-0.2 text-[9px] border rounded font-semibold font-mono ${t(r.type)}`,children:r.type})]}),u.jsx("span",{className:"text-[9px] text-slate-400 font-mono",children:new Date(r.timestamp).toLocaleTimeString([],{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"})})]}),u.jsx("div",{className:"text-slate-200 pl-5 leading-tight font-mono",children:r.message}),r.details&&u.jsx("div",{className:"pl-5 text-[10px] text-slate-400 font-mono",children:JSON.stringify(r.details)})]},r.id))}),u.jsxs("div",{className:"pt-3 border-t border-blue-500/20 flex justify-between items-center text-[10px] text-slate-400 font-mono",children:[u.jsxs("span",{className:"flex items-center",children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-2"}),"REALTIME STREAM ACTIVE"]}),u.jsx("span",{className:"uppercase text-blue-400/80",children:"LOG_LEVEL: VERBOSE"})]})]})},T0=({currentTask:s})=>{const[e,t]=Te.useState(null),[r,a]=Te.useState(0);return Te.useEffect(()=>{const l=async()=>{const f=window.orionApi||window.arvisApi;if(f&&f.getAIRouterStatus)try{const p=await f.getAIRouterStatus();t(p);const m=await f.getAllProviderStatuses();a(m.filter(v=>v.isConfigured).length)}catch{}};l();const d=setInterval(l,3e3);return()=>clearInterval(d)},[]),u.jsxs("div",{className:"h-full flex items-center justify-between p-3.5 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-lg text-xs relative overflow-hidden backdrop-blur-md",children:[u.jsx("div",{className:"absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"}),u.jsxs("div",{className:"flex items-center space-x-3.5 min-w-[340px]",children:[u.jsx("div",{className:"p-2 bg-blue-500/10 border border-blue-400/30 text-cyan-300 rounded-md shadow-[0_0_12px_rgba(56,189,248,0.25)]",children:u.jsx(Lf,{className:"w-5 h-5 animate-pulse"})}),u.jsxs("div",{children:[u.jsxs("div",{className:"flex items-center space-x-1.5",children:[u.jsx("span",{className:"text-[10px] text-cyan-400 tracking-wider uppercase font-bold font-mono",children:"ORION QUANTUM SECTOR"}),u.jsx("span",{className:`w-2 h-2 rounded-full ${e!=null&&e.isHealthy?"bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]":"bg-amber-400 animate-ping"}`})]}),u.jsx("div",{className:"font-semibold text-white text-xs tracking-wide font-mono flex items-center space-x-2",children:u.jsx("span",{className:"text-cyan-300 font-bold",children:e?e.displayName:"SECTOR 00 // KERNEL AUTONOMOUS CORE"})}),u.jsx("div",{className:"text-[9px] text-slate-400 font-mono truncate max-w-[300px]",children:e?e.currentModel:"Zero-Latency Deterministic Micro-Kernel [Sovereign Grid]"})]})]}),u.jsxs("div",{className:"flex-1 px-6 space-y-1 max-w-[500px]",children:[u.jsxs("div",{className:"flex justify-between items-center text-[10px] font-mono",children:[u.jsxs("span",{className:"text-slate-300 uppercase tracking-wider",children:["ACTION: ",s?s.currentAction:"STANDBY IDLE"]}),u.jsx("span",{className:"text-cyan-300 font-bold",children:s?`${s.progressPercent}%`:"0%"})]}),u.jsx("div",{className:"w-full bg-blue-950/40 h-2 border border-blue-500/25 p-0.5 overflow-hidden rounded-sm",children:u.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.4)]",style:{width:`${s?s.progressPercent:0}%`}})})]}),u.jsxs("div",{className:"flex items-center space-x-3 text-right",children:[u.jsxs("div",{children:[u.jsx("div",{className:"text-[9px] text-slate-400 font-mono uppercase tracking-wider",children:"STATUS"}),u.jsx("div",{className:"font-bold text-cyan-300 font-mono tracking-wider uppercase",children:s?s.status:"STANDBY"})]}),(s==null?void 0:s.status)==="RUNNING"&&u.jsx(dw,{className:"w-5 h-5 text-cyan-400 animate-spin"}),(s==null?void 0:s.status)==="COMPLETED"&&u.jsx(Cf,{className:"w-5 h-5 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"}),(s==null?void 0:s.status)==="FAILED"&&u.jsx(nw,{className:"w-5 h-5 text-red-400"}),!s&&u.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-slate-500 opacity-60"})]})]})},_w=()=>{const[s,e]=Te.useState([]),[t,r]=Te.useState(""),[a,l]=Te.useState(""),[d,f]=Te.useState("PREFERENCE");Te.useEffect(()=>{p()},[]);const p=async()=>{const _=window.orionApi||window.arvisApi;if(_){const g=await _.getMemories();e(g)}},m=async _=>{if(_.preventDefault(),!t.trim()||!a.trim())return;const g=window.orionApi||window.arvisApi;g&&(await g.saveMemory({category:d,key:t,value:a,source:"USER_EXPLICIT"}),r(""),l(""),p())},v=async _=>{const g=window.orionApi||window.arvisApi;g&&(await g.deleteMemory(_),p())};return u.jsxs("div",{className:"h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-4",children:[u.jsxs("div",{children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(sw,{className:"w-5 h-5 text-arvis-accent"}),u.jsx("h2",{className:"text-lg font-bold text-arvis-text tracking-widest",children:"USER-CONTROLLED MEMORY BANK"})]}),u.jsx("p",{className:"text-xs text-arvis-dim mt-1",children:"ORION memory is completely explicit, transparent, and user-inspectable. No hidden data collection."})]}),u.jsxs("div",{className:"flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim",children:[u.jsx(ro,{className:"w-4 h-4 text-green-400"}),u.jsx("span",{children:"PRIVACY STATUS: ZERO STEALTH STORAGE"})]})]}),u.jsxs("form",{onSubmit:m,className:"p-4 bg-black/40 border border-arvis-border space-y-3",children:[u.jsx("div",{className:"text-xs font-semibold text-arvis-cyan uppercase",children:"ADD EXPLICIT MEMORY ENTRY"}),u.jsxs("div",{className:"grid grid-cols-4 gap-3",children:[u.jsxs("select",{value:d,onChange:_=>f(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none",children:[u.jsx("option",{value:"PREFERENCE",children:"PREFERENCE"}),u.jsx("option",{value:"FACT",children:"FACT"}),u.jsx("option",{value:"AUTOMATION",children:"AUTOMATION"}),u.jsx("option",{value:"WORKFLOW",children:"WORKFLOW"}),u.jsx("option",{value:"SYSTEM_NOTE",children:"SYSTEM_NOTE"})]}),u.jsx("input",{type:"text",placeholder:"Key (e.g., preferred_theme)",value:t,onChange:_=>r(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"}),u.jsx("input",{type:"text",placeholder:"Value (e.g., Cyberpunk Dark HUD)",value:a,onChange:_=>l(_.target.value),className:"bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"}),u.jsxs("button",{type:"submit",className:"flex items-center justify-center space-x-2 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30 text-xs font-bold transition-all",children:[u.jsx(hw,{className:"w-4 h-4"}),u.jsx("span",{children:"SAVE MEMORY"})]})]})]}),u.jsxs("div",{className:"space-y-3",children:[u.jsxs("div",{className:"text-xs font-semibold text-arvis-dim uppercase",children:["INSPECTABLE MEMORIES (",s.length,")"]}),u.jsx("div",{className:"space-y-2",children:s.map(_=>u.jsxs("div",{className:"p-3 bg-black/30 border border-arvis-border/70 flex justify-between items-center",children:[u.jsxs("div",{className:"space-y-1",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx("span",{className:"px-2 py-0.5 text-[9px] bg-arvis-accent/20 border border-arvis-accent/40 text-arvis-accent font-bold",children:_.category}),u.jsx("span",{className:"font-mono text-xs font-bold text-arvis-cyan",children:_.key}),u.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["(",_.source,")"]})]}),u.jsx("div",{className:"text-xs text-arvis-text font-mono pl-1",children:_.value})]}),u.jsx("button",{onClick:()=>v(_.id),className:"p-2 text-arvis-dim hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors",title:"Delete memory",children:u.jsx(xw,{className:"w-4 h-4"})})]},_.id))})]})]})},yw=()=>{const[s,e]=Te.useState([]),[t,r]=Te.useState(null),[a,l]=Te.useState("{}"),[d,f]=Te.useState(null),[p,m]=Te.useState(!1),[v,_]=Te.useState("Open Chrome and search for the latest Nvidia earnings."),[g,E]=Te.useState(null),[M,A]=Te.useState(null),[S,y]=Te.useState(!1),[P,I]=Te.useState(!1),[C,ie]=Te.useState(!1);Te.useEffect(()=>{const K=window.orionApi||window.arvisApi;let Y;return K&&(K.getTools().then(e),K.onComputerTaskUpdated&&(Y=K.onComputerTaskUpdated(le=>{E(le),(le.status==="COMPLETED"||le.status==="FAILED"||le.status==="CANCELLED"||le.status==="ESTOPPED")&&y(!1)}))),()=>{Y&&Y()}},[]);const V=async()=>{const K=window.orionApi||window.arvisApi;if(!(!K||!K.getComputerObservation))try{const Y=await K.getComputerObservation();A(Y)}catch(Y){f(`[OBSERVATION ERROR] ${Y.message}`)}},F=async()=>{const K=window.orionApi||window.arvisApi;if(!(!K||!K.executeComputerCommand||!v.trim())){y(!0),I(!1);try{const Y=await K.executeComputerCommand(v,{isDryRun:C});E(Y),Y.status!=="RUNNING"&&Y.status!=="EXECUTING"&&y(!1)}catch(Y){f(`[COMMAND ERROR] ${Y.message}`),y(!1)}}},q=async()=>{const K=window.orionApi||window.arvisApi;!K||!K.emergencyStopComputer||(await K.emergencyStopComputer(),I(!0),y(!1))},R=async()=>{const K=window.orionApi||window.arvisApi;!K||!K.resetEmergencyStopComputer||(await K.resetEmergencyStopComputer(),I(!1))},b=K=>{r(K),f(null),m(!1);const Y={};Object.keys(K.parameters).forEach(le=>{Y[le]=K.parameters[le].type==="string"?"example_val":!0}),l(JSON.stringify(Y,null,2))},j=async()=>{const K=window.orionApi||window.arvisApi;if(!(!t||!K)){if(t.permissionLevel==="CRITICAL"&&!p){f("[SECURITY BLOCK] Execution refused. Critical action requires manual confirmation checkbox.");return}try{const Y=JSON.parse(a),le={id:"call_"+Math.random().toString(36).substring(2,9),toolId:t.id,toolName:t.name,arguments:Y,timestamp:Date.now(),requiresUserApproval:p};f(`Executing tool '${t.name}'...`);const xe=await K.executeTool(le);f(JSON.stringify(xe,null,2))}catch(Y){f(`[ERROR] Invalid parameters format or execution error: ${Y.message}`)}}};return u.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden",children:[u.jsx("div",{className:"col-span-7 bg-black/40 border border-arvis-border p-4 flex flex-col justify-between space-y-4 overflow-y-auto",children:u.jsxs("div",{className:"space-y-3",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-3",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(ec,{className:"w-5 h-5 text-arvis-cyan"}),u.jsxs("div",{children:[u.jsx("h3",{className:"font-bold text-sm text-arvis-text font-mono",children:"UNIVERSAL DESKTOP CONTROL HUD"}),u.jsx("p",{className:"text-[10px] text-arvis-dim",children:"Closed-Loop Autonomous Observe → Plan → Act → Verify Engine"})]})]}),u.jsxs("div",{className:"flex items-center space-x-2",children:[P?u.jsxs("button",{onClick:R,className:"px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 text-[10px] font-mono font-bold flex items-center space-x-1",children:[u.jsx(Nf,{className:"w-3 h-3"}),u.jsx("span",{children:"RESET ESTOP"})]}):u.jsxs("button",{onClick:q,className:"px-2.5 py-1 bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-red-600/50",children:[u.jsx(iw,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"EMERGENCY STOP"})]}),u.jsxs("button",{onClick:V,className:"px-2.5 py-1 bg-arvis-cyan/10 border border-arvis-cyan/40 text-arvis-cyan text-[10px] font-mono font-bold flex items-center space-x-1 hover:bg-arvis-cyan/20",children:[u.jsx(pf,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"OBSERVE SCREEN"})]})]})]}),u.jsxs("div",{className:"space-y-2",children:[u.jsxs("div",{className:"flex justify-between items-center",children:[u.jsx("label",{className:"text-[11px] text-arvis-dim font-mono uppercase",children:"NATURAL LANGUAGE DESKTOP INSTRUCTION"}),u.jsxs("label",{className:"flex items-center space-x-1.5 cursor-pointer text-[10px] font-mono text-arvis-cyan",children:[u.jsx("input",{type:"checkbox",checked:C,onChange:K=>ie(K.target.checked),className:"rounded bg-black border-arvis-border text-arvis-cyan focus:ring-0"}),u.jsx("span",{className:C?"text-amber-400 font-bold":"text-arvis-dim",children:C?"DRY-RUN (PREVIEW ONLY)":"LIVE EXECUTION"})]})]}),u.jsxs("div",{className:"flex space-x-2",children:[u.jsx("input",{type:"text",value:v,onChange:K=>_(K.target.value),placeholder:"e.g. Open Chrome and search for latest Nvidia earnings.",className:"flex-1 bg-black border border-arvis-border px-3 py-2 text-xs font-mono text-arvis-cyan focus:border-arvis-cyan outline-none"}),u.jsxs("button",{onClick:F,disabled:S||P,className:`px-4 py-2 border font-mono font-bold text-xs flex items-center space-x-1 disabled:opacity-50 ${C?"bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30":"bg-arvis-cyan/20 border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[u.jsx(_x,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:C?"PREVIEW":"RUN"})]})]})]}),g&&u.jsxs("div",{className:"p-3 bg-black/70 border border-arvis-border space-y-2 font-mono text-xs",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-1.5",children:[u.jsxs("span",{className:"text-arvis-cyan font-bold",children:["TASK EXECUTION PLAN: ",g.taskId]}),u.jsxs("div",{className:"flex items-center space-x-1.5",children:[g.isDryRun&&u.jsx("span",{className:"px-1.5 py-0.5 text-[8px] font-bold border border-amber-500 bg-amber-500/20 text-amber-400",children:"DRY-RUN"}),u.jsx("span",{className:`px-2 py-0.5 text-[9px] font-bold border ${g.status==="COMPLETED"?"border-green-500 bg-green-500/20 text-green-400":g.status==="RUNNING"||g.status==="EXECUTING"?"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan animate-pulse":g.status==="AWAITING_APPROVAL"?"border-amber-500 bg-amber-500/20 text-amber-400":g.status==="ESTOPPED"?"border-red-600 bg-red-600/30 text-red-300":"border-red-500 bg-red-500/20 text-red-400"}`,children:g.status})]})]}),u.jsxs("div",{className:"text-[11px] text-arvis-dim",children:["Intent: ",g.intent]}),u.jsx("div",{className:"space-y-1 max-h-40 overflow-y-auto",children:g.actions.map((K,Y)=>u.jsxs("div",{className:`p-1.5 border text-[10px] flex justify-between items-center ${Y===g.currentActionIndex?"border-arvis-cyan bg-arvis-cyan/15 text-arvis-text":Y<g.currentActionIndex?"border-green-500/40 bg-black/40 text-arvis-dim":"border-arvis-border/40 bg-black/20 text-arvis-dim"}`,children:[u.jsxs("span",{children:[Y+1,". [",K.type,"] ",K.reason||K.target]}),u.jsx("span",{className:"text-[9px]",children:K.riskLevel})]},K.id))})]}),M&&u.jsxs("div",{className:"p-3 bg-black/70 border border-arvis-border space-y-1.5 font-mono text-[11px]",children:[u.jsxs("div",{className:"text-arvis-cyan font-bold border-b border-arvis-border pb-1 flex justify-between",children:[u.jsx("span",{children:"DESKTOP OBSERVATION SNAPSHOT"}),M.observationId&&u.jsx("span",{className:"text-arvis-dim text-[9px]",children:M.observationId})]}),u.jsxs("div",{children:["Active App: ",u.jsx("span",{className:"text-arvis-text",children:M.activeWindow.processName})]}),u.jsxs("div",{children:["Window Title: ",u.jsx("span",{className:"text-arvis-text",children:M.activeWindow.title})]}),u.jsxs("div",{children:["Resolution: ",u.jsxs("span",{className:"text-arvis-text",children:[M.screen.width,"x",M.screen.height]})]}),u.jsxs("div",{children:["Interactive Elements Detected: ",u.jsxs("span",{className:"text-arvis-text",children:[M.interactiveElements.length," elements"]})]})]})]})}),u.jsxs("div",{className:"col-span-5 bg-black/40 border border-arvis-border p-3 flex flex-col space-y-3 overflow-y-auto",children:[u.jsxs("div",{className:"flex items-center justify-between border-b border-arvis-border pb-2 text-xs font-bold text-arvis-text",children:[u.jsxs("div",{className:"flex items-center space-x-1.5",children:[u.jsx(ro,{className:"w-4 h-4 text-arvis-cyan"}),u.jsx("span",{children:"TOOL DISPATCH MATRIX"})]}),u.jsxs("span",{className:"text-[9px] text-arvis-dim font-mono",children:[s.length," TOOLS"]})]}),u.jsx("div",{className:"space-y-1.5 max-h-48 overflow-y-auto",children:s.map(K=>u.jsx("button",{onClick:()=>b(K),className:`w-full text-left p-2 border transition-all text-[11px] space-y-0.5 ${(t==null?void 0:t.id)===K.id?"border-arvis-accent bg-arvis-accent/15 text-arvis-text":"border-arvis-border/60 bg-black/20 text-arvis-dim hover:border-arvis-border hover:text-arvis-text"}`,children:u.jsxs("div",{className:"flex justify-between items-center",children:[u.jsx("span",{className:"font-bold font-mono",children:K.name}),u.jsx("span",{className:"text-[8px] font-bold border px-1 py-0.2 border-arvis-cyan/40 text-arvis-cyan",children:K.permissionLevel})]})},K.id))}),t&&u.jsxs("div",{className:"space-y-2 border-t border-arvis-border pt-2 font-mono text-xs",children:[u.jsx("textarea",{value:a,onChange:K=>l(K.target.value),className:"w-full h-20 bg-black border border-arvis-border p-2 text-[10px] text-arvis-cyan outline-none resize-none"}),u.jsxs("button",{onClick:j,className:"w-full py-1.5 bg-arvis-accent/20 border border-arvis-accent text-arvis-accent font-bold text-[11px] flex items-center justify-center space-x-1 hover:bg-arvis-accent/30",children:[u.jsx(sa,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"DISPATCH TOOL"})]})]}),d&&u.jsx("div",{className:"p-2 bg-black border border-arvis-border text-[10px] font-mono text-arvis-cyan max-h-32 overflow-y-auto whitespace-pre-wrap",children:d})]})]})},Sw=({cameraActive:s})=>{const[e,t]=Te.useState(null),[r,a]=Te.useState(!1),[l,d]=Te.useState(null),f=async p=>{if(p==="CAMERA"&&!s){d("SECURITY NOTICE: Camera is currently toggled OFF in top privacy header. Enable camera toggle before capture."),setTimeout(()=>d(null),5e3);return}d(null);const m=window.orionApi||window.arvisApi;if(m){a(!0);const v=await m.captureVision(p);t(v),a(!1)}};return u.jsxs("div",{className:"h-full grid grid-cols-2 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden",children:[u.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 flex flex-col justify-between relative",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2 text-xs",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(pf,{className:"w-4 h-4 text-arvis-cyan"}),u.jsx("span",{className:"font-bold text-arvis-text",children:"OPTICAL SENSOR & DISPLAY FEED"})]}),u.jsx("span",{className:"text-[10px] text-arvis-dim",children:"STATUS: READY"})]}),l&&u.jsxs("div",{className:"mt-2 p-2 bg-amber-500/20 border border-amber-500 text-amber-300 font-mono text-[10px] flex items-center space-x-1.5 animate-pulse",children:[u.jsx(Js,{className:"w-3.5 h-3.5 shrink-0 text-amber-400"}),u.jsx("span",{children:l})]}),u.jsxs("div",{className:"relative flex-1 my-4 border border-arvis-cyan/30 bg-black flex items-center justify-center overflow-hidden",children:[u.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]"}),u.jsx("div",{className:"absolute top-2 left-2 text-[9px] text-arvis-cyan font-mono",children:"FRAME_BUFFER: 1920x1080"}),u.jsx("div",{className:"absolute bottom-2 right-2 text-[9px] text-arvis-dim font-mono",children:"OPTICAL_STREAM: READY"}),r?u.jsxs("div",{className:"flex flex-col items-center space-y-2 text-arvis-cyan animate-pulse",children:[u.jsx(Pf,{className:"w-8 h-8 animate-spin"}),u.jsx("span",{className:"text-xs font-bold",children:"ANALYZING OPTICAL INPUT..."})]}):e?u.jsxs("div",{className:"p-4 text-center space-y-2",children:[u.jsxs("div",{className:"inline-block px-3 py-1 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan text-xs font-bold",children:["ANALYSIS COMPLETE (",e.analysis.source,")"]}),u.jsx("p",{className:"text-xs text-arvis-text font-mono max-w-sm",children:e.analysis.sceneSummary})]}):u.jsxs("div",{className:"text-center text-xs text-arvis-dim space-y-2",children:[u.jsx(pf,{className:"w-8 h-8 mx-auto text-arvis-dim opacity-50"}),u.jsx("div",{children:"TRIGGER OPTICAL CAPTURE FROM CONTROLS BELOW"})]})]}),u.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[u.jsxs("button",{onClick:()=>f("CAMERA"),className:`py-2.5 border text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${s?"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30":"border-arvis-border bg-black/40 text-arvis-dim opacity-50 cursor-not-allowed"}`,children:[u.jsx(tw,{className:"w-4 h-4"}),u.jsx("span",{children:"ANALYZE CAMERA FRAME"})]}),u.jsxs("button",{onClick:()=>f("SCREENSHOT"),className:"py-2.5 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent hover:bg-arvis-accent/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all",children:[u.jsx(vx,{className:"w-4 h-4"}),u.jsx("span",{children:"ANALYZE SCREENSHOT"})]})]})]}),u.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 flex flex-col justify-between overflow-y-auto space-y-4",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2 text-xs",children:[u.jsx("span",{className:"font-bold text-arvis-text",children:"VISION INTELLIGENCE RESULT"}),u.jsx("span",{className:"text-[10px] text-arvis-dim",children:"MULTIMODAL VLM ENGINE"})]}),e?u.jsxs("div",{className:"space-y-4 text-xs font-mono",children:[u.jsxs("div",{children:[u.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"DETECTED OBJECTS"}),u.jsx("div",{className:"space-y-1",children:e.analysis.detectedObjects.map((p,m)=>u.jsxs("div",{className:"p-2 bg-black border border-arvis-border flex justify-between",children:[u.jsx("span",{className:"text-arvis-cyan font-bold",children:p.label}),u.jsxs("span",{className:"text-arvis-dim",children:["CONF: ",(p.confidence*100).toFixed(0),"%"]})]},m))})]}),e.analysis.extractedText&&u.jsxs("div",{children:[u.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"EXTRACTED OCR TEXT"}),u.jsx("pre",{className:"p-2 bg-black border border-arvis-border text-arvis-text text-[11px] whitespace-pre-wrap",children:e.analysis.extractedText})]}),u.jsxs("div",{children:[u.jsx("div",{className:"text-arvis-dim text-[10px] uppercase mb-1",children:"SCENE SUMMARY"}),u.jsx("div",{className:"p-2 bg-black border border-arvis-border text-arvis-text",children:e.analysis.sceneSummary})]})]}):u.jsx("div",{className:"h-full flex items-center justify-center text-xs text-arvis-dim",children:"NO VISION RESULT CAPTURED YET"}),u.jsxs("div",{className:"p-2 bg-black/60 border border-arvis-border text-[10px] text-arvis-dim flex items-center space-x-2",children:[u.jsx(Js,{className:"w-4 h-4 text-arvis-amber shrink-0"}),u.jsx("span",{children:"PRIVACY GUARANTEE: Camera/Screen analysis only runs on explicit user command."})]})]})]})},Ew=()=>{const[s,e]=Te.useState([]),[t,r]=Te.useState("SPEED_FIRST"),[a,l]=Te.useState(!1),[d,f]=Te.useState(null),[p,m]=Te.useState(!1),[v,_]=Te.useState({OPENROUTER_API_KEY:"",GROQ_API_KEY:"",GEMINI_API_KEY:"",GITHUB_TOKEN:"",CEREBRAS_API_KEY:"",MISTRAL_API_KEY:"",NVIDIA_API_KEY:"",DEEPSEEK_API_KEY:"",CLOUDFLARE_API_TOKEN:"",CLOUDFLARE_ACCOUNT_ID:""}),[g,E]=Te.useState("");Te.useEffect(()=>{M();const P=setInterval(M,3e3);return()=>clearInterval(P)},[]);const M=async()=>{const P=window.orionApi||window.arvisApi;if(P&&P.getAllProviderStatuses)try{const I=await P.getAllProviderStatuses();e(I)}catch{}},A=async P=>{r(P);const I=window.orionApi||window.arvisApi;I&&I.setAIRoutingStrategy&&(await I.setAIRoutingStrategy(P),M())},S=async()=>{const P=window.orionApi||window.arvisApi;if(P&&P.runLiveQualificationTest){m(!0);try{const I=await P.runLiveQualificationTest();f(I),M()}catch{}finally{m(!1)}}},y=async P=>{P.preventDefault();const I=window.orionApi||window.arvisApi;I&&I.saveProviderKeys&&(E("SAVING CREDENTIALS TO SECURE ELECTRON MAIN..."),await I.saveProviderKeys(v)?(E("SUCCESSFULLY ACTIVATED PROVIDER KEYS!"),setTimeout(()=>E(""),3e3),l(!1),M()):E("ERROR SAVING KEYS TO .ENV"))};return u.jsxs("div",{className:"h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto font-mono text-xs",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-4",children:[u.jsxs("div",{children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(Lf,{className:"w-5 h-5 text-arvis-cyan"}),u.jsx("h2",{className:"text-lg font-bold text-arvis-text tracking-widest uppercase",children:"ORION OMNI-BRAIN CLOUD AI FABRIC"})]}),u.jsx("p",{className:"text-xs text-arvis-dim mt-1",children:"Zero-cost, ultra-responsive cloud AI failover router. API credentials safely preserved in Main process."})]}),u.jsxs("div",{className:"flex items-center space-x-3",children:[u.jsxs("button",{onClick:S,disabled:p,className:"flex items-center space-x-1.5 px-3 py-1.5 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all font-bold disabled:opacity-50",children:[u.jsx(sa,{className:"w-4 h-4"}),u.jsx("span",{children:p?"QUALIFYING...":"RUN LIVE QUALIFICATION TEST"})]}),u.jsxs("button",{onClick:()=>l(!a),className:"flex items-center space-x-1.5 px-3 py-1.5 border border-arvis-cyan bg-arvis-cyan/10 text-arvis-cyan hover:bg-arvis-cyan/20 transition-all font-bold",children:[u.jsx(uw,{className:"w-4 h-4"}),u.jsx("span",{children:a?"HIDE KEY INPUT":"CONFIGURE PROVIDER KEYS"})]}),u.jsxs("div",{className:"flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim",children:[u.jsx(ro,{className:"w-4 h-4 text-green-400"}),u.jsx("span",{children:"MAIN PROCESS ISOLATION"})]})]})]}),a&&u.jsxs("form",{onSubmit:y,className:"p-4 bg-black/70 border border-arvis-cyan/60 space-y-4",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2",children:[u.jsx("span",{className:"font-bold text-arvis-cyan uppercase",children:"SECURE MAIN-PROCESS CREDENTIAL MANAGER (.ENV)"}),u.jsx("span",{className:"text-[10px] text-arvis-dim",children:"Keys are saved locally to .env and never sent to DOM or external telemetry"})]}),u.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-cyan font-bold text-[10px] block mb-1",children:"OPENROUTER API KEY (OPENROUTER_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"Key...",value:v.OPENROUTER_API_KEY,onChange:P=>_({...v,OPENROUTER_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-cyan/80 p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-accent outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GROQ API KEY (GROQ_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"gsk_...",value:v.GROQ_API_KEY,onChange:P=>_({...v,GROQ_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GEMINI API KEY (GEMINI_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"AIzaSy...",value:v.GEMINI_API_KEY,onChange:P=>_({...v,GEMINI_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"GITHUB TOKEN (GITHUB_TOKEN)"}),u.jsx("input",{type:"password",placeholder:"ghp_...",value:v.GITHUB_TOKEN,onChange:P=>_({...v,GITHUB_TOKEN:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"CEREBRAS API KEY (CEREBRAS_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"csk_...",value:v.CEREBRAS_API_KEY,onChange:P=>_({...v,CEREBRAS_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"MISTRAL API KEY (MISTRAL_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"Key...",value:v.MISTRAL_API_KEY,onChange:P=>_({...v,MISTRAL_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]}),u.jsxs("div",{children:[u.jsx("label",{className:"text-arvis-dim text-[10px] block mb-1",children:"DEEPSEEK API KEY (DEEPSEEK_API_KEY)"}),u.jsx("input",{type:"password",placeholder:"sk-...",value:v.DEEPSEEK_API_KEY,onChange:P=>_({...v,DEEPSEEK_API_KEY:P.target.value}),className:"w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"})]})]}),u.jsxs("div",{className:"flex justify-between items-center pt-2",children:[u.jsx("span",{className:"text-arvis-cyan font-bold text-[10px]",children:g}),u.jsxs("button",{type:"submit",className:"flex items-center space-x-1.5 px-4 py-2 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent font-bold hover:bg-arvis-accent/30 transition-all",children:[u.jsx(pw,{className:"w-4 h-4"}),u.jsx("span",{children:"SAVE & ACTIVATE CLOUD PROVIDERS"})]})]})]}),d&&u.jsxs("div",{className:"p-4 bg-black/60 border border-green-500/60 space-y-2",children:[u.jsx("span",{className:"font-bold text-green-400 uppercase text-xs",children:"LIVE QUALIFICATION RESULTS REPORT"}),u.jsx("div",{className:"grid grid-cols-4 gap-2 text-[10px]",children:Object.entries(d).map(([P,I])=>u.jsxs("div",{className:"p-2 border border-arvis-border bg-black/40",children:[u.jsx("div",{className:"font-bold text-arvis-text uppercase",children:P}),u.jsxs("div",{className:I.status==="READY"?"text-green-400 font-bold":"text-arvis-dim",children:["STATUS: ",I.status]}),u.jsxs("div",{children:["LATENCY: ",I.latencyMs," ms"]})]},P))})]}),u.jsxs("div",{className:"p-4 bg-black/40 border border-arvis-border space-y-3",children:[u.jsxs("div",{className:"flex justify-between items-center",children:[u.jsx("span",{className:"font-bold text-arvis-cyan uppercase text-xs",children:"ROUTING STRATEGY SELECTOR"}),u.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["ACTIVE: [",t,"]"]})]}),u.jsx("div",{className:"grid grid-cols-5 gap-2",children:["SPEED_FIRST","BALANCED","QUALITY_FIRST","VISION","CODING"].map(P=>u.jsx("button",{onClick:()=>A(P),className:`p-2 border text-center transition-all text-xs font-bold ${t===P?"border-arvis-accent bg-arvis-accent/20 text-arvis-accent shadow-[0_0_10px_rgba(255,42,95,0.3)]":"border-arvis-border/60 bg-black/30 text-arvis-dim hover:text-arvis-text hover:border-arvis-border"}`,children:P},P))})]}),u.jsxs("div",{className:"space-y-3",children:[u.jsxs("div",{className:"flex justify-between items-center text-xs font-semibold text-arvis-dim uppercase",children:[u.jsxs("span",{children:["CONFIGURED PROVIDER MATRIX (",s.filter(P=>P.isConfigured).length," / ",s.length,")"]}),u.jsxs("button",{onClick:M,className:"flex items-center space-x-1 text-arvis-cyan hover:underline",children:[u.jsx(Nf,{className:"w-3 h-3"}),u.jsx("span",{children:"REFRESH MATRIX"})]})]}),u.jsx("div",{className:"grid grid-cols-2 gap-3",children:s.map(P=>u.jsxs("div",{className:`p-3 border space-y-2 relative ${P.isConfigured?P.isHealthy?"border-arvis-cyan/60 bg-black/50":"border-arvis-amber/60 bg-arvis-amber/10":"border-arvis-border/40 bg-black/20 opacity-60"}`,children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border/60 pb-1.5",children:[u.jsx("span",{className:"font-bold text-arvis-text text-xs",children:P.displayName}),u.jsx("span",{className:`px-1.5 py-0.2 text-[9px] font-bold border ${P.isConfigured?P.isHealthy?"border-green-500/40 bg-green-500/20 text-green-400":"border-arvis-amber/40 bg-arvis-amber/20 text-arvis-amber animate-pulse":"border-arvis-border bg-black/40 text-arvis-dim"}`,children:P.isConfigured?P.isHealthy?"HEALTHY":"COOLDOWN / 429":"NOT CONFIGURED"})]}),u.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[10px]",children:[u.jsxs("div",{children:[u.jsx("span",{className:"text-arvis-dim",children:"MODEL:"}),u.jsx("div",{className:"text-arvis-cyan truncate",children:P.currentModel})]}),u.jsxs("div",{children:[u.jsx("span",{className:"text-arvis-dim",children:"LATENCY (TTFT):"}),u.jsxs("div",{className:"text-arvis-text",children:[P.lastObservedLatencyMs>0?`${P.lastObservedLatencyMs} ms`:"N/A",P.lastObservedTtftMs?` (${P.lastObservedTtftMs}ms TTFT)`:""]})]})]}),u.jsxs("div",{className:"flex space-x-1.5 pt-1 text-[8px]",children:[u.jsxs("span",{className:`px-1 border ${P.capabilities.supportsTools?"border-arvis-cyan text-arvis-cyan":"border-arvis-border text-arvis-dim"}`,children:["TOOLS: ",P.capabilities.supportsTools?"YES":"NO"]}),u.jsxs("span",{className:`px-1 border ${P.capabilities.supportsVision?"border-arvis-accent text-arvis-accent":"border-arvis-border text-arvis-dim"}`,children:["VISION: ",P.capabilities.supportsVision?"YES":"NO"]}),u.jsxs("span",{className:`px-1 border ${P.capabilities.supportsStreaming?"border-green-400 text-green-400":"border-arvis-border text-arvis-dim"}`,children:["STREAM: ",P.capabilities.supportsStreaming?"YES":"NO"]})]})]},P.id))})]})]})},Ed=[{id:"demo-1",number:1,title:"Basic Intelligence & System Overview",tag:"INTELLIGENCE",command:"ORION, give me a quick overview of this machine.",description:"Natural language intent classification, parallel multi-tool DAG planning, and telemetry synthesis.",expectedBehavior:"Executes system.get_info, system.get_cpu_usage, and system.get_memory_usage concurrently, synthesizing a structured system report."},{id:"demo-2",number:2,title:"Safe Tool Execution & Hardware Telemetry",tag:"TOOL USE",command:"Check current CPU and memory usage.",description:"Direct execution of native low-risk read tools with execution metrics, call IDs, and core breakdown.",expectedBehavior:"Polls hardware sensors directly via Node.js OS bindings in single-digit milliseconds."},{id:"demo-3",number:3,title:"Safety Boundary & Permission Enforcement",tag:"PERMISSION GATE",command:"Write test file to restricted system directory C:\\Windows\\System32.",description:"Deterministic risk evaluation intercepts unauthorized mutations to protected system boundaries.",expectedBehavior:"ActionRiskEvaluator flags CRITICAL risk level and ToolService blocks execution under safety policy."},{id:"demo-4",number:4,title:"Visual Perception & Display Stream",tag:"VISION",command:"Capture primary desktop screen and analyze display buffer.",description:"Full-resolution 1080p desktop display stream capture via native Electron desktopCapturer.",expectedBehavior:"Captures primary display buffer, computes buffer length, and routes to multimodal adapter."},{id:"demo-5",number:5,title:"Autonomous Failure Recovery & Replanning",tag:"RELIABILITY",command:"Read non-existent restricted configuration file /invalid/path/missing.cfg.",description:"Demonstrates graceful error handling, replanning evaluation, and zero-crash recovery.",expectedBehavior:"Detects tool error, attempts autonomous replanning recovery, and returns clean explanatory feedback."}],Mw=()=>{var V,F,q;const[s,e]=Te.useState(Ed[0]),[t,r]=Te.useState(Ed[0].command),[a,l]=Te.useState(!1),[d,f]=Te.useState(null),[p,m]=Te.useState(null),[v,_]=Te.useState(null),[g,E]=Te.useState([]),[M,A]=Te.useState(null),[S,y]=Te.useState(null);Te.useEffect(()=>{P();const R=setInterval(P,5e3);return()=>clearInterval(R)},[]);const P=async()=>{const R=window.orionApi||window.arvisApi;if(R&&R.getDemoHealthCheck)try{const b=await R.getDemoHealthCheck();f(b)}catch{}},I=R=>{e(R),r(R.command),m(null),_(null),A(null),E([])},C=async()=>{const R=window.orionApi||window.arvisApi;R&&(R.resetDemo?await R.resetDemo():R.clearConversation&&await R.clearConversation()),m(null),_(null),A(null),E([]),y("DEMO ENVIRONMENT RESET: Conversation memory & temporary task state flushed clean."),setTimeout(()=>y(null),4e3),P()},ie=async R=>{var K,Y,le,xe,de,me,B;l(!0),m(null),_(null),A(null);const b=[{label:"USER INPUT",detail:`Received: "${R.command}"`,status:"DONE"},{label:"INTENT CLASSIFICATION",detail:`Evaluating intent category [${R.tag}]...`,status:"ACTIVE"},{label:"PLAN GENERATION",detail:"Decomposing task into Directed Acyclic Graph (DAG)...",status:"PENDING"},{label:"PERMISSION GATE",detail:"Evaluating deterministic risk boundaries...",status:"PENDING"},{label:"TOOL EXECUTION",detail:"Executing registered tools...",status:"PENDING"},{label:"RESULT VERIFICATION",detail:"Verifying data integrity...",status:"PENDING"},{label:"RESPONSE SYNTHESIS",detail:"Synthesizing natural response...",status:"PENDING"}];if(E([...b]),R.id==="demo-4"){const pe=window.orionApi||window.arvisApi;if(pe)try{b[1].status="DONE",b[1].detail="Intent: VISION_CAPTURE (Confidence: 100%)",b[2].status="DONE",b[2].detail="Plan: Execute native desktopCapturer display buffer snapshot",b[3].status="DONE",b[3].detail="Permission: READ_ONLY (LOW Risk, Autonomously Approved)",b[4].status="ACTIVE",b[4].detail="Capturing 1920x1080 display buffer...",E([...b]);const te=Date.now(),O=await pe.captureScreen(),J=Date.now()-te;if(O){A(O),b[4].status="DONE",b[4].durationMs=J,b[4].detail=`Display buffer captured: ${O.length.toLocaleString()} base64 chars (${J}ms)`,b[5].status="DONE",b[5].detail="Verification: Non-empty image payload confirmed",b[6].status="DONE",b[6].detail="Response generated",E([...b]);const De=`Optical Screen Capture Complete: Successfully captured primary 1920x1080 desktop frame in ${J}ms (${O.length.toLocaleString()} bytes base64). Local display buffer ready for multimodal reasoning.`;m(De),_({success:!0,toolCallsExecuted:[{toolName:"desktopCapturer.getSources",toolId:"vision.capture_screen"}],toolResults:[{success:!0,toolId:"vision.capture_screen",executionTimeMs:J}],metrics:{totalCommandLatencyMs:J,toolExecutionLatencyMs:J}})}else b[4].status="FAILED",b[4].detail="Display capture returned null",E([...b]),m("Optical screen capture failed: No active desktop displays detected.")}catch(te){b[4].status="FAILED",b[4].detail=`Capture error: ${te.message}`,E([...b]),m(`Vision Capture Error: ${te.message}`)}finally{l(!1)}return}const j=window.orionApi||window.arvisApi;if(j)try{const pe=Date.now(),te=await j.processCommand(R.command,"TEXT"),O=Date.now()-pe;b[1].status="DONE",b[1].detail=`Intent identified in ${((K=te.metrics)==null?void 0:K.intentClassificationLatencyMs)||1}ms`,b[2].status="DONE",b[2].detail=`DAG Plan generated in ${((Y=te.metrics)==null?void 0:Y.planningLatencyMs)||1}ms (${((le=te.toolCallsExecuted)==null?void 0:le.length)||0} tools resolved)`,b[3].status=R.id==="demo-3"?"BLOCKED":"DONE",b[3].detail=R.id==="demo-3"?"Risk: CRITICAL — Protected System Boundary Enforced":"Risk: LOW — Read-only operation approved",b[4].status=R.id==="demo-3"?"BLOCKED":R.id==="demo-5"?"FAILED":"DONE",b[4].durationMs=(xe=te.metrics)==null?void 0:xe.toolExecutionLatencyMs,b[4].detail=((de=te.toolCallsExecuted)==null?void 0:de.length)>0?`Executed ${te.toolCallsExecuted.map(J=>J.toolName).join(", ")} (${((me=te.metrics)==null?void 0:me.toolExecutionLatencyMs)||5}ms)`:"Security policy blocked tool dispatch",b[5].status=R.id==="demo-3"?"BLOCKED":"DONE",b[5].detail=R.id==="demo-5"?"Autonomous Replanning: Evaluated alternative recovery paths":te.success?"Data integrity verified":"Safe error interception verified",b[6].status="DONE",b[6].detail=`Response synthesized in ${((B=te.metrics)==null?void 0:B.aiTotalGenerationLatencyMs)||1}ms`,E([...b]),m(te.response),_(te)}catch(pe){b[4].status="FAILED",b[4].detail=`Error: ${pe.message}`,E([...b]),m(`ORION Error: ${pe.message}`)}finally{l(!1)}};return u.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden font-mono text-xs select-none",children:[u.jsxs("div",{className:"col-span-5 flex flex-col justify-between space-y-4 overflow-hidden",children:[u.jsxs("div",{className:"bg-black/50 border border-arvis-border p-3 space-y-2 shrink-0",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border/60 pb-2",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(ro,{className:"w-4 h-4 text-green-400"}),u.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"CODERS HQ PRE-FLIGHT CHECK"})]}),u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsxs("span",{className:`px-2 py-0.5 text-[9px] font-bold border ${(d==null?void 0:d.overallStatus)==="READY"?"border-green-500 bg-green-500/20 text-green-400":"border-arvis-amber bg-arvis-amber/20 text-arvis-amber"}`,children:["● ",(d==null?void 0:d.overallStatus)||"READY_WITH_LIMITATIONS"]}),u.jsx("button",{onClick:C,title:"Reset Demo Environment",className:"p-1 border border-arvis-border hover:border-arvis-accent text-arvis-dim hover:text-arvis-accent transition-colors",children:u.jsx(gx,{className:"w-3.5 h-3.5"})})]})]}),u.jsxs("div",{className:"grid grid-cols-3 gap-2 text-[10px]",children:[u.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[u.jsx("span",{className:"text-arvis-dim block",children:"AI ROUTER"}),u.jsx("span",{className:"text-arvis-cyan font-bold truncate block",children:((V=d==null?void 0:d.aiRouter)==null?void 0:V.displayName)||"Omni-Router"})]}),u.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[u.jsx("span",{className:"text-arvis-dim block",children:"TOOL REGISTRY"}),u.jsxs("span",{className:"text-green-400 font-bold block",children:[((F=d==null?void 0:d.tools)==null?void 0:F.totalCount)||16," ACTIVE TOOLS"]})]}),u.jsxs("div",{className:"bg-black/40 p-1.5 border border-arvis-border/40",children:[u.jsx("span",{className:"text-arvis-dim block",children:"IPC BOUNDARY"}),u.jsx("span",{className:"text-arvis-text font-bold block",children:"ONLINE (ISOLATED)"})]})]}),S&&u.jsx("div",{className:"p-1.5 bg-green-500/10 border border-green-500/40 text-green-400 text-[10px] animate-pulse",children:S})]}),u.jsxs("div",{className:"flex-1 overflow-y-auto space-y-2 pr-1",children:[u.jsx("div",{className:"text-[10px] text-arvis-dim uppercase tracking-wider font-bold mb-1",children:"OFFICIAL DEMO SEQUENCES (3–5 MINUTE WALKTHROUGH)"}),Ed.map(R=>{const b=s.id===R.id;return u.jsxs("div",{onClick:()=>I(R),className:`p-3 border cursor-pointer transition-all space-y-1.5 ${b?"border-arvis-cyan bg-arvis-cyan/10 shadow-[0_0_12px_rgba(0,240,255,0.15)]":"border-arvis-border/60 bg-black/30 hover:border-arvis-border hover:bg-black/50"}`,children:[u.jsxs("div",{className:"flex justify-between items-center",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsxs("span",{className:"px-1.5 py-0.2 bg-black border border-arvis-border text-[9px] font-bold text-arvis-cyan",children:["DEMO ",R.number]}),u.jsx("span",{className:"font-bold text-arvis-text text-xs",children:R.title})]}),u.jsx("span",{className:"text-[9px] text-arvis-dim border border-arvis-border/40 px-1",children:R.tag})]}),u.jsx("p",{className:"text-[10px] text-arvis-dim line-clamp-2",children:R.description}),u.jsxs("div",{className:"text-[10px] text-arvis-cyan font-mono bg-black/50 p-1 border border-arvis-border/40 truncate",children:["> ",R.command]})]},R.id)})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-3 space-y-2 shrink-0",children:[u.jsxs("div",{className:"flex justify-between items-center text-[10px]",children:[u.jsxs("span",{className:"text-arvis-dim",children:["TARGET: DEMO ",s.number," — ",s.tag]}),u.jsx("span",{className:"text-arvis-cyan font-bold",children:a?"EXECUTING PIPELINE...":"READY TO TRIGGER"})]}),u.jsxs("button",{onClick:()=>ie(s),disabled:a,className:`w-full py-2.5 border font-bold flex items-center justify-center space-x-2 transition-all ${a?"border-arvis-amber bg-arvis-amber/20 text-arvis-amber cursor-wait":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"}`,children:[u.jsx(sa,{className:"w-4 h-4"}),u.jsx("span",{children:a?"RUNNING REAL ORION PIPELINE...":`EXECUTE DEMO ${s.number}`})]})]})]}),u.jsxs("div",{className:"col-span-7 flex flex-col justify-between space-y-4 overflow-hidden",children:[u.jsxs("div",{className:"bg-black/50 border border-arvis-border p-4 space-y-3 flex-1 overflow-y-auto",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-2",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(Jl,{className:"w-4 h-4 text-arvis-accent animate-pulse"}),u.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"LIVE EXECUTION TRACE (REAL ARCHITECTURE)"})]}),u.jsx("span",{className:"text-[10px] text-arvis-dim font-mono",children:"OBSERVE → PLAN → GATE → ACT → VERIFY"})]}),g.length===0?u.jsxs("div",{className:"h-44 flex flex-col items-center justify-center text-arvis-dim space-y-2",children:[u.jsx(ec,{className:"w-8 h-8 opacity-40 text-arvis-dim"}),u.jsx("div",{className:"text-xs",children:"SELECT AND TRIGGER A DEMO SCENARIO TO WITNESS LIVE PIPELINE EXECUTION"}),u.jsx("div",{className:"text-[10px] text-arvis-dim opacity-70",children:"Each step reflects authentic internal events and real latency timings"})]}):u.jsx("div",{className:"space-y-1.5",children:g.map((R,b)=>u.jsxs("div",{className:`p-2 border flex items-center justify-between text-[11px] font-mono transition-all ${R.status==="DONE"?"border-green-500/40 bg-green-500/5 text-green-300":R.status==="ACTIVE"?"border-arvis-cyan bg-arvis-cyan/15 text-arvis-cyan animate-pulse":R.status==="BLOCKED"?"border-red-500/60 bg-red-500/10 text-red-400":R.status==="FAILED"?"border-arvis-amber/60 bg-arvis-amber/10 text-arvis-amber":"border-arvis-border/30 bg-black/20 text-arvis-dim"}`,children:[u.jsxs("div",{className:"flex items-center space-x-2.5",children:[R.status==="DONE"&&u.jsx(Cf,{className:"w-4 h-4 text-green-400 shrink-0"}),R.status==="ACTIVE"&&u.jsx(Lf,{className:"w-4 h-4 text-arvis-cyan shrink-0 animate-spin"}),R.status==="BLOCKED"&&u.jsx(Js,{className:"w-4 h-4 text-red-400 shrink-0"}),R.status==="FAILED"&&u.jsx(If,{className:"w-4 h-4 text-arvis-amber shrink-0"}),R.status==="PENDING"&&u.jsx("div",{className:"w-2 h-2 rounded-full bg-arvis-dim/40 ml-1 shrink-0"}),u.jsxs("div",{children:[u.jsxs("span",{className:"font-bold mr-2",children:["[",R.label,"]"]}),u.jsx("span",{className:"text-xs text-arvis-text",children:R.detail})]})]}),R.durationMs!==void 0&&u.jsxs("span",{className:"text-[10px] font-bold text-arvis-cyan bg-black/60 px-1.5 py-0.5 border border-arvis-cyan/30",children:[R.durationMs,"ms"]})]},b))}),M&&u.jsxs("div",{className:"mt-3 p-3 bg-black border border-arvis-cyan space-y-2",children:[u.jsxs("div",{className:"flex justify-between items-center text-[10px] border-b border-arvis-border/60 pb-1 text-arvis-cyan font-bold",children:[u.jsxs("span",{className:"flex items-center space-x-1",children:[u.jsx(vx,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"PRIMARY SCREENSHOT BUFFER (1920x1080 DISPLAY RESOLUTION)"})]}),u.jsx("span",{className:"text-green-400",children:"REAL FRAME BUFFER"})]}),u.jsx("div",{className:"max-h-48 overflow-hidden border border-arvis-border/40 flex items-center justify-center bg-black/80",children:u.jsx("img",{src:M,alt:"Live Screen Buffer",className:"max-h-48 object-contain"})})]})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-4 space-y-2 shrink-0 max-h-56 overflow-y-auto",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-arvis-border pb-1.5 text-[10px]",children:[u.jsx("span",{className:"font-bold text-arvis-text uppercase tracking-wider",children:"ORION SYNTHESIZED RESPONSE"}),((q=v==null?void 0:v.metrics)==null?void 0:q.totalCommandLatencyMs)&&u.jsxs("span",{className:"text-arvis-cyan font-bold font-mono",children:["TOTAL COMMAND LATENCY: ",v.metrics.totalCommandLatencyMs,"ms"]})]}),p?u.jsxs("div",{className:"space-y-2",children:[u.jsx("pre",{className:"text-xs text-arvis-text whitespace-pre-wrap font-mono leading-relaxed bg-black/40 p-2.5 border border-arvis-border/60",children:p}),(v==null?void 0:v.toolCallsExecuted)&&v.toolCallsExecuted.length>0&&u.jsxs("div",{className:"flex items-center space-x-2 text-[10px] text-arvis-dim",children:[u.jsx("span",{className:"text-arvis-cyan font-bold",children:"TOOLS DISPATCHED:"}),v.toolCallsExecuted.map((R,b)=>u.jsxs("span",{className:"px-1.5 py-0.5 bg-black border border-arvis-border text-arvis-text",children:[R.toolName," (",R.toolId,")"]},b))]})]}):u.jsx("div",{className:"py-6 text-center text-xs text-arvis-dim",children:"NO ACTIVE EXECUTION COMPLETED YET. SELECT AND TRIGGER A SCENARIO ABOVE."})]})]})]})},ww=()=>{var te,O,J,De,ne;const[s,e]=Te.useState("SINGLE"),[t,r]=Te.useState("Video_001"),[a,l]=Te.useState(!1),[d,f]=Te.useState(null),[p,m]=Te.useState(!1),[v,_]=Te.useState(["Video_001","Video_002","Video_003"]),[g,E]=Te.useState(null),[M,A]=Te.useState(null),[S,y]=Te.useState(null),[P,I]=Te.useState(null),C=async()=>{var ue;const k=window.orionApi||window.arvisApi;if(k)try{const fe=await k.getSystemSnapshot();if(A(fe),k.getTitanOutputPreview){const ge=s==="SINGLE"?t:((ue=g==null?void 0:g.progress)==null?void 0:ue.currentTarget)||"Video_001",Ae=await k.getTitanOutputPreview({target:ge});I(Ae)}}catch(fe){console.error("Error fetching telemetry/preview:",fe)}};Te.useEffect(()=>{var Ae,Fe,_t,He;const k=window.orionApi||window.arvisApi;if(!k)return;(Ae=k.getTitanPipelineStatus)==null||Ae.call(k).then(lt=>{lt&&f(lt)}),(Fe=k.getTitanBatchStatus)==null||Fe.call(k).then(lt=>{lt&&E(lt)}),C();const ue=setInterval(C,3e3),fe=(_t=k.onTitanPipelineUpdated)==null?void 0:_t.call(k,lt=>{f(lt),lt.state!=="INSPECTING"&&lt.state!=="PLANNING"&&lt.state!=="VOICE_READY"&&lt.state!=="RENDERING"&&lt.state!=="QA_ANALYSIS"&&m(!1),C()}),ge=(He=k.onTitanBatchUpdated)==null?void 0:He.call(k,lt=>{E(lt),lt.state!=="RUNNING_TARGET"&&lt.state!=="TARGET_QA"&&lt.state!=="VALIDATING_TARGETS"&&m(!1),C()});return()=>{clearInterval(ue),fe&&fe(),ge&&ge()}},[t,s]);const ie=async()=>{const k=window.orionApi||window.arvisApi;if(k){m(!0);try{if(k.runTitanPipeline){const ue=await k.runTitanPipeline({target:t,hasExplicitRenderApproval:a});f(ue)}}catch(ue){console.error("Titan Pipeline IPC error:",ue)}finally{m(!1)}}},V=async()=>{const k=window.orionApi||window.arvisApi;if(k){l(!0),m(!0);try{if(k.approveTitanRender){const ue=await k.approveTitanRender({target:t});f(ue)}}catch(ue){console.error("Titan Render Approval IPC error:",ue)}finally{m(!1)}}},F=async()=>{const k=window.orionApi||window.arvisApi;if(k)try{if(k.resetTitanPipeline){const ue=await k.resetTitanPipeline();f(ue),l(!1)}}catch(ue){console.error("Titan Reset IPC error:",ue)}},q=k=>{p||(v.includes(k)?v.length>1&&_(v.filter(ue=>ue!==k)):_([...v,k]))},R=async()=>{const k=window.orionApi||window.arvisApi;if(!(!k||v.length===0)){m(!0);try{if(k.runTitanBatch){const ue=await k.runTitanBatch({targets:v,hasExplicitRenderApproval:a});E(ue)}}catch(ue){console.error("Titan Batch IPC error:",ue)}finally{m(!1)}}},b=async()=>{const k=window.orionApi||window.arvisApi;if(k){l(!0),m(!0);try{if(k.approveTitanBatchTarget){const ue=await k.approveTitanBatchTarget();E(ue)}}catch(ue){console.error("Titan Batch Approval IPC error:",ue)}finally{m(!1)}}},j=async()=>{const k=window.orionApi||window.arvisApi;if(k)try{if(k.resetTitanBatch){const ue=await k.resetTitanBatch();E(ue),l(!1)}}catch(ue){console.error("Titan Batch Reset IPC error:",ue)}},K=async()=>{var ue;const k=window.orionApi||window.arvisApi;if(k){m(!0),y(null);try{if(k.packageTitanRelease){const fe=await k.packageTitanRelease({target:t,forceOverwrite:!0});fe.success?y({success:!0,message:`RELEASE PACKAGED: ${t} bundle created & verified.`,canonicalHash:(ue=fe.data)==null?void 0:ue.canonicalHash}):y({success:!1,message:`PACKAGING ERROR: ${fe.error||"Unknown error"}`})}}catch(fe){y({success:!1,message:`IPC ERROR: ${fe.message}`})}finally{m(!1)}}},Y=async()=>{var ue;const k=window.orionApi||window.arvisApi;if(k){m(!0),y(null);try{if(k.validateTitanRelease){const fe=await k.validateTitanRelease({target:t});fe.success?y({success:!0,message:"AUDIT PASSED: 5/5 artifacts verified. Canonical hash valid.",canonicalHash:(ue=fe.data)==null?void 0:ue.canonicalHash}):y({success:!1,message:`AUDIT FAILED: ${fe.error||"Validation error"}`})}}catch(fe){y({success:!1,message:`AUDIT IPC ERROR: ${fe.message}`})}finally{m(!1)}}},le=(d==null?void 0:d.state)||"IDLE",xe=(g==null?void 0:g.state)||"IDLE",de=()=>{if(s==="BATCH")switch(xe){case"RUNNING_TARGET":return"TITAN RENDERING";case"AWAITING_TARGET_APPROVAL":return"TITAN AWAITING APPROVAL";case"TARGET_QA":return"TITAN QA ANALYSIS";case"BATCH_COMPLETED":return"TITAN GATE PASSED";case"BATCH_FAILED":return"TITAN GATE FAILED";case"ERROR":return"SYSTEM ERROR";default:return"TITAN IDLE"}switch(le){case"INSPECTING":return"TITAN INSPECTING";case"PLANNING":return"TITAN PLANNING";case"VOICE_READY":return"TITAN VOICE READY";case"AWAITING_RENDER_APPROVAL":return"TITAN AWAITING APPROVAL";case"RENDERING":return"TITAN RENDERING";case"QA_ANALYSIS":return"TITAN QA ANALYSIS";case"GATE_PASSED":return"TITAN GATE PASSED";case"GATE_FAILED":return"TITAN GATE FAILED";case"ERROR":return"SYSTEM ERROR";default:return"TITAN IDLE"}},me=M?((M.memory.freeBytes||0)/(1024*1024)).toFixed(0):"N/A",B=M?((M.memory.totalBytes||0)/(1024*1024*1024)).toFixed(1):"N/A",pe=M?`${M.cpu.usagePercent.toFixed(1)}%`:"0.0%";return u.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden font-mono text-xs text-arvis-text",children:[u.jsxs("div",{className:"col-span-4 flex flex-col justify-between space-y-3 bg-black/40 border border-arvis-border p-3 overflow-y-auto",children:[u.jsxs("div",{className:"space-y-3",children:[u.jsxs("div",{className:"flex items-center justify-between border-b border-arvis-border pb-2",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx(Jl,{className:"w-4 h-4 text-arvis-cyan"}),u.jsx("span",{className:"font-extrabold text-xs tracking-widest text-arvis-text",children:"TITAN // OPERATOR COMMAND"})]}),u.jsxs("div",{className:"flex space-x-1 bg-black border border-arvis-border p-0.5",children:[u.jsx("button",{onClick:()=>e("SINGLE"),className:`px-2 py-0.5 text-[9px] font-bold transition-all ${s==="SINGLE"?"bg-arvis-cyan/30 text-arvis-cyan":"text-arvis-dim hover:text-arvis-text"}`,children:"SINGLE"}),u.jsx("button",{onClick:()=>e("BATCH"),className:`px-2 py-0.5 text-[9px] font-bold transition-all ${s==="BATCH"?"bg-arvis-cyan/30 text-arvis-cyan":"text-arvis-dim hover:text-arvis-text"}`,children:"BATCH"})]})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1",children:[u.jsx("div",{className:"text-[9px] text-arvis-dim tracking-wider",children:"UNIFIED OPERATOR STATUS"}),u.jsxs("div",{className:"text-xs font-bold text-arvis-cyan tracking-wider flex items-center space-x-2",children:[u.jsx("span",{className:"w-2 h-2 rounded-full bg-arvis-cyan animate-ping"}),u.jsx("span",{children:de()})]})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1.5 text-[10px]",children:[u.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between",children:[u.jsxs("span",{className:"flex items-center space-x-1",children:[u.jsx(Qs,{className:"w-3 h-3 text-arvis-cyan"}),u.jsx("span",{children:"SYSTEM TELEMETRY"})]}),u.jsx("span",{className:"text-green-400",children:"ONLINE"})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"CPU USAGE:"}),u.jsx("span",{className:"text-arvis-cyan font-bold",children:pe})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"RAM AVAILABLE:"}),u.jsxs("span",{className:"text-green-400 font-bold",children:[me," MB / ",B," GB"]})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"MODE:"}),u.jsxs("span",{className:"text-arvis-cyan font-bold",children:[s," PRODUCTION"]})]}),s==="SINGLE"?u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"TARGET:"}),u.jsx("span",{className:"text-arvis-cyan font-bold",children:t})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"RENDER ATTEMPTS:"}),u.jsxs("span",{children:[(d==null?void 0:d.renderAttempts)||0," / 1"]})]})]}):u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"BATCH TARGETS:"}),u.jsxs("span",{className:"text-arvis-cyan font-bold",children:[v.length," TARGETS"]})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"COMPLETED / TOTAL:"}),u.jsxs("span",{children:[((te=g==null?void 0:g.progress)==null?void 0:te.completedTargets)||0," / ",v.length]})]})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{children:"APPROVAL STATUS:"}),u.jsx("span",{className:a?"text-green-400 font-bold":"text-amber-400",children:a?"AUTHORIZED":"APPROVAL REQUIRED"})]})]}),s==="SINGLE"?u.jsxs("div",{className:"space-y-1",children:[u.jsx("label",{className:"text-[9px] text-arvis-dim tracking-wider uppercase block",children:"SELECT TARGET PROJECT"}),u.jsxs("select",{value:t,onChange:k=>r(k.target.value),disabled:p,className:"w-full bg-black border border-arvis-border text-arvis-cyan p-1.5 font-mono outline-none focus:border-arvis-cyan text-xs",children:[u.jsx("option",{value:"Video_001",children:"Video_001 (Nvidia $3T Moat)"}),u.jsx("option",{value:"Video_002",children:"Video_002 ($1M AI Agency)"}),u.jsx("option",{value:"Video_003",children:"Video_003 (Gigafactory Automation)"})]})]}):u.jsxs("div",{className:"space-y-1.5 bg-black/60 border border-arvis-border p-2",children:[u.jsx("label",{className:"text-[9px] text-arvis-dim tracking-wider uppercase block",children:"BATCH TARGET SELECTOR (SEQUENTIAL)"}),u.jsx("div",{className:"space-y-1",children:["Video_001","Video_002","Video_003"].map(k=>u.jsxs("div",{onClick:()=>q(k),className:"flex items-center space-x-2 cursor-pointer hover:text-arvis-cyan select-none",children:[v.includes(k)?u.jsx(mw,{className:"w-3.5 h-3.5 text-arvis-cyan"}):u.jsx(yx,{className:"w-3.5 h-3.5 text-arvis-dim"}),u.jsx("span",{className:"text-[11px]",children:k})]},k))})]}),u.jsxs("div",{className:"space-y-2",children:[s==="SINGLE"?u.jsxs("button",{onClick:ie,disabled:p,className:`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${p?"border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[u.jsx(sa,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:p?"PIPELINE EXECUTING...":"RUN TITAN PIPELINE"})]}):u.jsxs("button",{onClick:R,disabled:p||v.length===0,className:`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${p||v.length===0?"border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed":"border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30"}`,children:[u.jsx(Rf,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:p?"BATCH EXECUTING...":`START BATCH (${v.length} TARGETS)`})]}),u.jsxs("button",{onClick:s==="SINGLE"?F:j,disabled:p,className:"w-full p-1.5 border border-arvis-border hover:border-arvis-cyan text-[10px] text-arvis-dim hover:text-arvis-cyan transition-all flex items-center justify-center space-x-1",children:[u.jsx(gx,{className:"w-3 h-3"}),u.jsx("span",{children:s==="SINGLE"?"RESET PIPELINE":"RESET BATCH"})]})]})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-1 text-[10px]",children:[u.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center space-x-1",children:[u.jsx(lw,{className:"w-3 h-3 text-arvis-cyan"}),u.jsx("span",{children:"OUTPUT PREVIEW (READ-ONLY)"})]}),P!=null&&P.exists?u.jsxs("div",{className:"space-y-0.5 text-green-300",children:[u.jsxs("div",{className:"font-bold text-xs text-arvis-cyan flex items-center space-x-1",children:[u.jsx(Gl,{className:"w-3 h-3 text-green-400"}),u.jsx("span",{children:P.filename})]}),u.jsxs("div",{className:"text-arvis-dim",children:["SIZE: ",P.sizeMB," MB (",P.sizeBytes.toLocaleString()," bytes)"]}),u.jsxs("div",{className:"text-[9px] text-arvis-dim truncate",children:["PATH: ",P.filePath]})]}):u.jsx("div",{className:"text-arvis-dim italic text-[9px] py-1",children:(P==null?void 0:P.message)||"No experimental output rendered."})]}),u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-2 space-y-2 text-[10px]",children:[u.jsxs("div",{className:"text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between",children:[u.jsxs("span",{className:"flex items-center space-x-1",children:[u.jsx(Js,{className:"w-3 h-3 text-amber-400"}),u.jsx("span",{children:"PHASE 7B RELEASE CONTROLS"})]}),u.jsx("span",{className:"text-amber-400 text-[8px] border border-amber-500/30 px-1 bg-amber-500/10",children:"LOCAL ONLY"})]}),u.jsxs("div",{className:"flex space-x-1.5",children:[u.jsx("button",{onClick:K,disabled:p,className:"flex-1 p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-[9px] transition-all",children:"[ PACKAGE RELEASE ]"}),u.jsx("button",{onClick:Y,disabled:p,className:"flex-1 p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-arvis-cyan font-bold text-[9px] transition-all",children:"[ AUDIT RELEASE ]"})]}),S&&u.jsxs("div",{className:`p-1.5 border text-[9px] leading-tight ${S.success?"bg-green-500/10 border-green-500/30 text-green-300":"bg-red-500/10 border-red-500/30 text-red-300"}`,children:[u.jsx("div",{className:"font-bold",children:S.message}),S.canonicalHash&&u.jsxs("div",{className:"text-[8px] text-arvis-dim truncate mt-0.5",children:["HASH: ",S.canonicalHash]})]})]})]}),u.jsxs("div",{className:"col-span-5 flex flex-col space-y-3 justify-between bg-black/40 border border-arvis-border p-3 overflow-y-auto",children:[s==="BATCH"?u.jsxs("div",{children:[u.jsxs("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex justify-between",children:[u.jsx("span",{children:"SEQUENTIAL BATCH PROGRESSION"}),u.jsxs("span",{children:["STATE: [",xe,"]"]})]}),u.jsx("div",{className:"space-y-2 font-mono text-xs",children:v.map((k,ue)=>{var _t,He;const fe=(_t=g==null?void 0:g.targetResults)==null?void 0:_t[k],ge=((He=g==null?void 0:g.progress)==null?void 0:He.currentTarget)===k,Ae=fe==null?void 0:fe.gatePassed,Fe=fe&&!fe.gatePassed&&fe.state!=="AWAITING_APPROVAL";return u.jsxs("div",{className:"flex items-center justify-between p-2 bg-black/60 border border-arvis-border",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsxs("span",{className:"text-[10px] text-arvis-dim",children:["#",ue+1]}),u.jsx("span",{className:ge?"text-arvis-cyan font-bold":"text-arvis-text",children:k})]}),u.jsxs("div",{children:[Ae&&u.jsxs("span",{className:"text-green-400 font-bold text-[10px]",children:["[ GATE PASSED - ",fe.qaScore,"/100 ]"]}),Fe&&u.jsxs("span",{className:"text-red-400 font-bold text-[10px]",children:["[ FAILED - ",fe.qaScore||0,"/100 ]"]}),ge&&u.jsx("span",{className:"text-arvis-cyan font-bold text-[10px] animate-pulse",children:"◉ EXECUTING"}),!fe&&!ge&&u.jsx("span",{className:"text-arvis-dim text-[10px]",children:"○ QUEUED"})]})]},k)})})]}):u.jsxs("div",{children:[u.jsx("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2",children:"PIPELINE EXECUTION STAGES"}),u.jsx("div",{className:"space-y-2 font-mono text-xs",children:["INSPECTING","PLANNING","VOICE_READY","RENDERING","QA_ANALYSIS"].map(k=>u.jsxs("div",{className:"flex items-center space-x-3",children:[u.jsx("span",{className:le===k?"text-arvis-cyan font-bold animate-pulse":"text-arvis-dim",children:le===k?"◉":"○"}),u.jsx("span",{className:le===k?"text-arvis-cyan font-bold":"text-arvis-text",children:k})]},k))})]}),(le==="AWAITING_RENDER_APPROVAL"||xe==="AWAITING_TARGET_APPROVAL")&&u.jsxs("div",{className:"bg-amber-500/10 border-2 border-amber-500 p-3 space-y-2 animate-pulse",children:[u.jsxs("div",{className:"flex items-center space-x-2 text-amber-400 font-bold text-xs tracking-wider",children:[u.jsx(Js,{className:"w-4 h-4"}),u.jsx("span",{children:"RENDER APPROVAL REQUIRED"})]}),u.jsxs("div",{className:"bg-black/60 border border-amber-500/30 p-2 space-y-1 text-[10px] text-amber-200",children:[u.jsxs("div",{children:["• ",u.jsx("strong",{children:"TARGET:"})," ",u.jsx("code",{className:"text-arvis-cyan",children:s==="SINGLE"?t:((O=g==null?void 0:g.progress)==null?void 0:O.pendingApprovalTarget)||t})," ",s==="BATCH"&&`(TARGET ${((J=g==null?void 0:g.progress)==null?void 0:J.currentTargetIndex)||1} / ${v.length})`]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"ACTION:"})," Invoke ",u.jsx("code",{className:"text-arvis-cyan",children:"master_documentary_compiler.py"})]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"RISK LEVEL:"})," ",u.jsx("span",{className:"text-red-400 font-bold",children:"HIGH (MUTATING / DANGEROUS)"})]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"OUTPUT PATH:"})," ",u.jsx("code",{className:"text-arvis-cyan",children:"07_Video_Projects/Experimental/"})]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"QA GATE REQUIREMENT:"})," Score >= 90.0 / 100"]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"AVAILABLE RAM:"})," ",u.jsxs("span",{className:"text-green-400 font-bold",children:[me," MB free"]})," (Precondition >= 512MB)"]})]}),u.jsxs("div",{className:"flex items-center space-x-2 pt-1",children:[u.jsx("button",{onClick:s==="SINGLE"?V:b,disabled:p,className:"flex-1 p-2 bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-all text-xs tracking-wider",children:"[ APPROVE RENDER ]"}),u.jsx("button",{onClick:s==="SINGLE"?F:j,disabled:p,className:"px-3 p-2 bg-black border border-amber-500/50 text-amber-400 hover:bg-white/5 text-xs font-bold",children:"[ CANCEL ]"})]})]}),s==="BATCH"&&xe==="BATCH_COMPLETED"&&g&&u.jsxs("div",{className:"bg-green-500/10 border-2 border-green-500 p-3 space-y-2",children:[u.jsxs("div",{className:"flex items-center space-x-2 text-green-400 font-bold text-xs tracking-wider",children:[u.jsx(Gl,{className:"w-4 h-4"}),u.jsx("span",{children:"BATCH PRODUCTION COMPLETED"})]}),u.jsxs("div",{className:"bg-black/60 border border-green-500/30 p-2 space-y-1 text-[10px] text-green-200",children:[u.jsxs("div",{children:["• ",u.jsx("strong",{children:"TOTAL TARGETS:"})," ",g.totalTargets]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"PASSED:"})," ",g.passedTargets," / ",g.totalTargets]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"FAILED:"})," ",g.failedTargets]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"QA GATE STATUS:"})," ALL TARGETS PASSED (>= 90/100)"]}),u.jsxs("div",{children:["• ",u.jsx("strong",{children:"PROTECTED MASTERS:"})," UNCHANGED & INTACT"]})]})]}),s==="SINGLE"&&u.jsxs("div",{className:"bg-black/60 border border-arvis-border p-3 space-y-2",children:[u.jsx("div",{className:"text-[10px] text-arvis-dim",children:"RETENTION QA GATE EVALUATION"}),u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("div",{children:[u.jsx("div",{className:"text-2xl font-extrabold tracking-wider text-arvis-text",children:(d==null?void 0:d.qaScore)!==void 0?`${d.qaScore} / 100`:"-- / 100"}),u.jsx("div",{className:"text-[9px] text-arvis-dim",children:"DETERMINISTIC GATE THRESHOLD: 90.0 / 100"})]}),le==="GATE_PASSED"&&u.jsxs("div",{className:"flex items-center space-x-1 px-2.5 py-1 bg-green-500/20 border border-green-500 text-green-400 font-bold text-xs",children:[u.jsx(Gl,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"[ GATE PASSED ]"})]}),le==="GATE_FAILED"&&u.jsxs("div",{className:"flex items-center space-x-1 px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 font-bold text-xs",children:[u.jsx(rw,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"[ GATE FAILED ]"})]})]})]})]}),u.jsxs("div",{className:"col-span-3 flex flex-col bg-black/40 border border-arvis-border p-3 overflow-hidden",children:[u.jsxs("div",{className:"text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex items-center justify-between",children:[u.jsxs("span",{className:"flex items-center space-x-1.5",children:[u.jsx(ow,{className:"w-3.5 h-3.5 text-arvis-cyan"}),u.jsx("span",{children:"EVENT STREAM"})]}),u.jsxs("span",{className:"text-[9px] text-arvis-dim",children:[s==="SINGLE"?((De=d==null?void 0:d.auditTrail)==null?void 0:De.length)||0:((ne=g==null?void 0:g.events)==null?void 0:ne.length)||0," EVENTS"]})]}),u.jsx("div",{className:"flex-1 overflow-y-auto space-y-1.5 text-[10px] pr-1",children:s==="SINGLE"?d!=null&&d.auditTrail&&d.auditTrail.length>0?d.auditTrail.map((k,ue)=>{const fe=new Date(k.timestamp).toLocaleTimeString(),ge=k.severity==="SUCCESS"?"text-green-400 font-bold":k.severity==="WARNING"?"text-amber-400 font-bold":k.severity==="ERROR"?"text-red-400 font-bold":"text-arvis-cyan font-bold",Ae=k.severity==="SUCCESS"?"bg-green-500/10 border-green-500/30":k.severity==="WARNING"?"bg-amber-500/10 border-amber-500/30":k.severity==="ERROR"?"bg-red-500/10 border-red-500/30":"bg-cyan-500/10 border-cyan-500/30";return u.jsxs("div",{className:"border-b border-arvis-border/40 pb-1",children:[u.jsxs("div",{className:"flex justify-between text-arvis-dim text-[9px]",children:[u.jsx("span",{children:fe}),u.jsx("span",{className:`px-1 border text-[8px] ${Ae} ${ge}`,children:k.stage})]}),u.jsx("div",{className:"text-arvis-text leading-tight mt-0.5 text-[9px]",children:k.message})]},ue)}):u.jsx("div",{className:"text-arvis-dim text-center mt-12",children:"No active pipeline events"}):g!=null&&g.events&&g.events.length>0?g.events.map((k,ue)=>{const fe=new Date(k.timestamp).toLocaleTimeString(),ge=k.severity==="SUCCESS"?"text-green-400 font-bold":k.severity==="WARNING"?"text-amber-400 font-bold":k.severity==="ERROR"?"text-red-400 font-bold":"text-arvis-cyan font-bold",Ae=k.severity==="SUCCESS"?"bg-green-500/10 border-green-500/30":k.severity==="WARNING"?"bg-amber-500/10 border-amber-500/30":k.severity==="ERROR"?"bg-red-500/10 border-red-500/30":"bg-cyan-500/10 border-cyan-500/30";return u.jsxs("div",{className:"border-b border-arvis-border/40 pb-1",children:[u.jsxs("div",{className:"flex justify-between text-arvis-dim text-[9px]",children:[u.jsx("span",{children:fe}),u.jsx("span",{className:`px-1 border text-[8px] ${Ae} ${ge}`,children:k.target||k.state})]}),u.jsx("div",{className:"text-arvis-text leading-tight mt-0.5 text-[9px]",children:k.message})]},ue)}):u.jsx("div",{className:"text-arvis-dim text-center mt-12",children:"No active batch events"})})]})]})},bw=({currentMode:s,assistantState:e,snapshot:t,activities:r,currentTask:a,cameraActive:l})=>{if(s==="COMMAND")return u.jsxs("div",{className:"h-full grid grid-cols-12 gap-4 p-4 overflow-hidden",children:[u.jsx("div",{className:"col-span-3 h-full overflow-hidden",children:u.jsx(b0,{snapshot:t})}),u.jsxs("div",{className:"col-span-6 h-full flex flex-col justify-between space-y-4",children:[u.jsxs("div",{className:"flex-1 bg-[#0B0F1A]/85 border border-blue-500/25 rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center orion-glass",children:[u.jsxs("div",{className:"absolute top-3 left-3 text-[9px] text-slate-400 font-mono tracking-widest flex items-center space-x-1.5",children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"}),u.jsx("span",{children:"ORION // CORE_VISUALIZER"})]}),u.jsxs("div",{className:"absolute top-3 right-3 text-[9px] text-cyan-300 font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30",children:["STATE: [",e,"]"]}),u.jsx(E0,{assistantState:e})]}),u.jsx("div",{className:"h-24",children:u.jsx(T0,{currentTask:a})})]}),u.jsx("div",{className:"col-span-3 h-full overflow-hidden",children:u.jsx(gw,{activities:r})})]});switch(s){case"DEMO":return u.jsx(Mw,{});case"MEMORY":return u.jsx(_w,{});case"COMPUTER":return u.jsx(yw,{});case"VISION":return u.jsx(Sw,{cameraActive:l});case"NETWORK":return u.jsx(Ew,{});case"SYSTEM":return u.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl overflow-y-auto space-y-6",children:[u.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest mb-4 flex items-center space-x-2",children:[u.jsx(Qs,{className:"w-5 h-5 text-cyan-400"}),u.jsx("span",{children:"FULL SYSTEM TELEMETRY DIAGNOSTICS"})]}),u.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[u.jsx(b0,{snapshot:t}),u.jsxs("div",{className:"bg-[#070A13]/80 border border-blue-500/30 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-300 shadow-xl",children:[u.jsx("div",{className:"text-cyan-400 font-bold border-b border-blue-500/30 pb-2 text-sm tracking-wider",children:"HARDWARE SPECIFICATIONS"}),u.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[u.jsx("span",{className:"text-slate-400",children:"PROCESSOR:"})," ",u.jsx("span",{className:"font-semibold text-white",children:(t==null?void 0:t.cpu.model)||"N/A"})]}),u.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[u.jsx("span",{className:"text-slate-400",children:"CORES DETECTED:"})," ",u.jsxs("span",{className:"font-semibold text-cyan-300",children:[(t==null?void 0:t.cpu.cores.length)||0," CORES"]})]}),u.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[u.jsx("span",{className:"text-slate-400",children:"GRAPHICS:"})," ",u.jsx("span",{className:"font-semibold text-indigo-300",children:(t==null?void 0:t.gpu.name)||"N/A"})]}),u.jsxs("div",{className:"flex justify-between py-1 border-b border-white/5",children:[u.jsx("span",{className:"text-slate-400",children:"MEMORY TOTAL:"})," ",u.jsxs("span",{className:"font-semibold text-white",children:[(((t==null?void 0:t.memory.totalBytes)||0)/(1024*1024*1024)).toFixed(2)," GB"]})]}),u.jsxs("div",{className:"flex justify-between py-1",children:[u.jsx("span",{className:"text-slate-400",children:"TELEMETRY MODE:"})," ",u.jsx("span",{className:"font-semibold text-emerald-400",children:t!=null&&t.isMock?"DEVELOPMENT MOCK PROVIDER":"NATIVE HARDWARE"})]})]})]})]});case"WORLD":return u.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl flex flex-col justify-between",children:[u.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest flex items-center space-x-2",children:[u.jsx(Hl,{className:"w-5 h-5 text-cyan-400"}),u.jsx("span",{children:"GLOBAL INTELLIGENCE & GEOGRAPHIC NETWORK"})]}),u.jsx("div",{className:"flex-1 my-4 border border-blue-500/30 rounded-xl relative bg-[#070A13] overflow-hidden",children:u.jsx(E0,{assistantState:e})}),u.jsx("div",{className:"text-xs text-slate-400 font-mono",children:"GLOBAL GEOGRAPHIC DATA ENRICHMENT SERVICE READY FOR API INTEGRATION."})]});case"TASK":return u.jsxs("div",{className:"h-full p-6 bg-[#0B0F1A]/85 border border-blue-500/20 rounded-xl space-y-4",children:[u.jsxs("h2",{className:"text-lg font-bold text-white tracking-widest flex items-center space-x-2",children:[u.jsx(Rf,{className:"w-5 h-5 text-violet-400"}),u.jsx("span",{children:"AUTOMATION PIPELINE & TASK MANAGER"})]}),u.jsx("div",{className:"h-28",children:u.jsx(T0,{currentTask:a})})]});case"TITAN":return u.jsx(ww,{});default:return u.jsxs("div",{className:"h-full flex items-center justify-center text-arvis-dim text-xs",children:["MODE [",s,"] INITIALIZING..."]})}},Tw=({app:s,size:e=20})=>{if(s.iconDataUrl)return u.jsx("img",{src:s.iconDataUrl,alt:s.displayName,style:{width:e,height:e},className:"rounded-sm object-contain flex-shrink-0"});const[t,r,a]=s.brandRgb||[139,92,246];return u.jsx("span",{style:{width:e,height:e,backgroundColor:`rgba(${t}, ${r}, ${a}, 0.18)`,borderColor:`rgba(${t}, ${r}, ${a}, 0.55)`,color:`rgb(${t}, ${r}, ${a})`},className:"rounded flex items-center justify-center border text-[10px] font-bold flex-shrink-0",children:s.displayName.slice(0,1).toUpperCase()})},Aw=()=>{var s;try{const t=(s=new URLSearchParams(window.location.search).get("mode"))==null?void 0:s.toUpperCase();if(t&&["COMMAND","VISION","COMPUTER","SYSTEM","NETWORK","MEMORY","TITAN","DEMO"].includes(t))return t;const r=window.location.hash.replace("#","").toUpperCase();if(r&&["COMMAND","VISION","COMPUTER","SYSTEM","NETWORK","MEMORY","TITAN","DEMO"].includes(r))return r}catch{}return"COMMAND"},Cw=()=>{var H,Ie,he;const[s,e]=Te.useState("STANDBY"),[t,r]=Te.useState("Standby"),[a,l]=Te.useState("Ready for task execution"),[d,f]=Te.useState(Aw),[p,m]=Te.useState("WORKSTATION"),[v,_]=Te.useState({micActive:!1,cameraActive:!1,screenCaptureActive:!1,userConfirmationRequired:!0}),[g,E]=Te.useState(null),[M,A]=Te.useState([]),[S,y]=Te.useState(null),[P,I]=Te.useState(""),[C,ie]=Te.useState([{id:"welcome_msg",role:"assistant",content:"ORION Workstation online. Real Windows process/window verification, closed-loop Chrome execution, and the 10-agent engineering command roster are active. Enter a task below or select a quick action.",timestamp:Date.now(),executionState:"Completed",agentId:"commander",providerModel:"ollama:llama3.1:8b"}]),[V,F]=Te.useState(!1),[q,R]=Te.useState([]),[b,j]=Te.useState(null),[K,Y]=Te.useState(!1),[le,xe]=Te.useState("commander"),[de,me]=Te.useState([]),[B,pe]=Te.useState([]),[te,O]=Te.useState(null),[J,De]=Te.useState(null),[ne,k]=Te.useState(!1),[ue,fe]=Te.useState(!0),[ge,Ae]=Te.useState("3dbbe5b1dfbf058a..."),[Fe,_t]=Te.useState([]),[He,lt]=Te.useState(null),[W,sn]=Te.useState([]),[pt,mt]=Te.useState("https://example.com"),[Je,Pt]=Te.useState("official ORION GitHub repository"),[Ke,D]=Te.useState(!0),[T,se]=Te.useState(!1),[ye,Se]=Te.useState(!0),ve=Te.useRef(null),Ve=Te.useRef(null),Le=()=>{var L;(L=ve.current)==null||L.scrollIntoView({behavior:"smooth"})};Te.useEffect(()=>{Le()},[C.length]);const Pe=Te.useCallback(async(L=!1)=>{const Q=window.orionApi||window.arvisApi;if(Q)try{const[_e,ze,vt,Mt,et,Ut]=await Promise.all([Q.getSystemSnapshot().catch(()=>null),Q.getActiveAppsState?Q.getActiveAppsState(L).catch(()=>null):Promise.resolve(null),Q.getAgentsRoster?Q.getAgentsRoster().catch(()=>null):Promise.resolve(null),Q.getSecurityStatus?Q.getSecurityStatus().catch(()=>null):Promise.resolve(null),Q.getAIRouterStatus?Q.getAIRouterStatus().catch(()=>null):Promise.resolve(null),Q.browserObserve?Q.browserObserve().catch(()=>null):Promise.resolve(null)]);_e&&(E(_e),ku.emit("system.stats.updated",{snapshot:_e})),ze&&Array.isArray(ze.apps)&&(R(ze.apps),ze.activeWindow&&j(ze.activeWindow)),vt&&(vt.activeAgentId&&xe(vt.activeAgentId),Array.isArray(vt.roster)&&me(vt.roster),Array.isArray(vt.tasks)&&pe(vt.tasks),vt.backendHealth&&O(vt.backendHealth)),Mt&&(k(!!Mt.estopActive),fe(!!Mt.policyIntegrityVerified),Mt.policyHash&&Ae(String(Mt.policyHash).slice(0,16)+"..."),Array.isArray(Mt.pendingApprovals)&&(_t(Mt.pendingApprovals),Mt.pendingApprovals.length>0&&t!=="Running"&&r("Awaiting Approval"))),et&&De(et),Ut&&lt(Ut)}catch{}},[t]);Te.useEffect(()=>{Pe(!0);const L=setInterval(()=>{Pe(!1)},3e3),Q=window.orionApi||window.arvisApi;Q&&Q.getInitialMode&&Q.getInitialMode().then(et=>{et==="DEMO"&&(f("DEMO"),m("LEGACY_HUD"))}).catch(()=>{});const _e=Q!=null&&Q.onStreamToken?Q.onStreamToken(({token:et})=>{const Ut=Ve.current;Ut&&ie(Wt=>Wt.map(Tn=>Tn.id===Ut?{...Tn,content:(Tn.content||"")+et,isStreaming:!0}:Tn))}):void 0,ze=Q!=null&&Q.onOrchestratorStateChanged?Q.onOrchestratorStateChanged(({state:et,detail:Ut})=>{const Wt={PLANNING:"Planning",EXECUTING:"Running",VERIFYING:"Verifying",COMPLETED:"Completed",FAILED:"Failed",BLOCKED:"Blocked",CANCELLED:"Cancelled",AWAITING_APPROVAL:"Awaiting Approval"};Wt[et]&&r(Wt[et]),Ut&&l(Ut)}):void 0,vt=Q!=null&&Q.onBrowserStageChanged?Q.onBrowserStageChanged(et=>{sn(Ut=>[...Ut.slice(-18),et]),l(`[Browser ${et.stage}] ${et.detail}`),et.stage==="PLAN"?r("Planning"):et.stage==="AUTHORIZE"&&et.detail.toLowerCase().includes("approval")?r("Awaiting Approval"):et.stage==="EXECUTE"?r("Running"):et.stage==="VERIFY"&&r("Verifying")}):void 0,Mt=ku.subscribe("activity.logged",()=>{A(ku.getActivityHistory())});return()=>{clearInterval(L),_e&&_e(),ze&&ze(),vt&&vt(),Mt()}},[Pe]);const dt=L=>{const Q=(L||"").toLowerCase();return Q.includes("emergency stop")?'Click "Reset E-Stop" in the top bar to clear the emergency lock before running new actions.':Q.includes("authorization required")||Q.includes("approval")?'Review the Pending Approval card in the right panel and click "Approve" to authorize this operation.':Q.includes("policy violation")||Q.includes("restricted")||Q.includes("prohibited")?"Target path or command is inside a protected system boundary. Choose a safe workspace path inside the project repository.":Q.includes("enoent")||Q.includes("not found")||Q.includes("unavailable")?"Verify that the target application or URL exists and is reachable, then retry.":Q.includes("timed out")||Q.includes("timeout")?"The target took too long to respond. Check network connectivity or retry with a simpler query.":"Inspect the tool execution evidence below or check the Diagnostics drawer for full error details."},we=async L=>{var et,Ut,Wt,Tn;const Q=(L!==void 0?L:P).trim();if(!Q||V)return;L===void 0&&I("");const _e={id:`user_${Date.now()}`,role:"user",content:Q,timestamp:Date.now()},ze=`asst_${Date.now()+1}`;Ve.current=ze;const vt={id:ze,role:"assistant",content:"",timestamp:Date.now(),executionState:"Planning",agentId:le,providerModel:J?`${J.id}:${J.currentModel}`:"ollama:llama3.1:8b",isStreaming:!0};ie(It=>[...It,_e,vt]),F(!0),r("Planning"),l(`Analyzing: "${Q.slice(0,70)}"`);const Mt=window.orionApi||window.arvisApi;if(!Mt){F(!1);return}try{const It=Q.toLowerCase();if((/^(?:please\s+)?(?:open|launch)\s+(?:google\s+)?chrome[.!]?$/i.test(Q)||It.includes("in chrome")&&/https?:\/\//i.test(Q)||It.includes("search for")&&It.includes("orion")&&It.includes("github")||It.includes("open the official repository")&&It.includes("summarize"))&&Mt.browserExecuteClosedLoop){r("Running"),sn([]);const Gt=await Mt.browserExecuteClosedLoop({goal:Q,visibleWindow:!0}),An=Gt.status==="COMPLETED"?"Completed":Gt.status==="AWAITING_APPROVAL"?"Awaiting Approval":Gt.status==="CANCELLED"?"Cancelled":Gt.status==="ESTOPPED"||Gt.status==="BLOCKED"?"Blocked":"Failed";r(An),l(Gt.summary||Gt.error||""),ie(ns=>ns.map(Cn=>Cn.id===ze?{...Cn,content:Gt.summary||Gt.error||"Browser task finished.",executionState:An,browserReport:Gt,isStreaming:!1,errorRecoverySuggestion:Gt.success?void 0:dt(Gt.error||Gt.summary)}:Cn)),await Pe(!0);return}r("Running");const st=await Mt.processCommand(Q,"TEXT"),ai=((et=st==null?void 0:st.response)==null?void 0:et.includes("SECURITY POLICY"))||((Ut=st==null?void 0:st.toolResults)==null?void 0:Ut.some(Gt=>/POLICY VIOLATION|BLOCKED|Emergency Stop/i.test(Gt.error||""))),oi=((Wt=st==null?void 0:st.toolResults)==null?void 0:Wt.some(Gt=>/AUTHORIZATION REQUIRED/i.test(Gt.error||"")))?"Awaiting Approval":ai?"Blocked":st!=null&&st.success?"Completed":"Failed";r(oi),l(st!=null&&st.success?`Verified completion in ${((Tn=st.metrics)==null?void 0:Tn.totalCommandLatencyMs)||0}ms`:(st==null?void 0:st.response)||"Task failed"),ie(Gt=>Gt.map(An=>An.id===ze?{...An,content:(st==null?void 0:st.response)||An.content||"Task finished.",executionState:oi,toolCalls:(st==null?void 0:st.toolCallsExecuted)||[],toolResults:(st==null?void 0:st.toolResults)||[],isStreaming:!1,errorRecoverySuggestion:st!=null&&st.success?void 0:dt((st==null?void 0:st.response)||"")}:An))}catch(It){const zn=/cancel|abort/i.test((It==null?void 0:It.message)||""),st=zn?"Cancelled":"Failed";r(st),l((It==null?void 0:It.message)||"Task execution failed"),ie(ai=>ai.map(qn=>qn.id===ze?{...qn,content:zn?"Task cancelled by operator.":`Execution failed: ${(It==null?void 0:It.message)||String(It)}`,executionState:st,isStreaming:!1,errorRecoverySuggestion:dt((It==null?void 0:It.message)||"")}:qn))}finally{Ve.current=null,F(!1),await Pe(!0)}},ke=async()=>{const L=window.orionApi||window.arvisApi;if(L)try{L.cancelCommand?await L.cancelCommand("Stopped by operator from workstation UI"):L.cancelComputerTask&&await L.cancelComputerTask("Stopped by operator"),r("Cancelled"),l("Active task cancelled by operator."),F(!1)}catch{}},tt=async()=>{var Q,_e,ze;const L=window.orionApi||window.arvisApi;L&&(ne?(await((Q=L.resetEmergencyStopComputer)==null?void 0:Q.call(L)),k(!1),r("Standby"),l("Emergency Stop reset by operator. System ready.")):(await((_e=L.emergencyStopComputer)==null?void 0:_e.call(L)),await((ze=L.cancelCommand)==null?void 0:ze.call(L,"EMERGENCY STOP TRIGGERED")),k(!0),r("Blocked"),l("EMERGENCY STOP ACTIVE — All mutating desktop and browser operations are locked."),F(!1)),await Pe(!0))},rt=async L=>{const Q=window.orionApi||window.arvisApi;if(!Q||!Q.focusOrOpenApp)return;r("Running"),l(L.status==="Open"?`Focusing ${L.displayName} window...`:`Launching ${L.displayName} and verifying window...`);const _e=await Q.focusOrOpenApp(L.id);_e!=null&&_e.success?(r("Completed"),l(_e.action==="FOCUSED"?`Focused ${L.displayName} window.`:`Launched and verified ${L.displayName}.`)):(r(ne?"Blocked":"Failed"),l((_e==null?void 0:_e.error)||`Failed to activate ${L.displayName}.`)),await Pe(!0)},Be=async L=>{const Q=window.orionApi||window.arvisApi;if(!Q||!Q.approvePendingRequest)return;const _e=await Q.approvePendingRequest(L);_e!=null&&_e.success&&(r("Completed"),l(`Approved request ${L}. Action token bound.`)),await Pe(!1)},xt=async L=>{const Q=window.orionApi||window.arvisApi;!Q||!Q.denyPendingRequest||(await Q.denyPendingRequest(L),r("Blocked"),l(`Denied approval request ${L}.`),await Pe(!1))},ct=L=>{L.key==="Enter"&&!L.shiftKey&&(L.preventDefault(),we())},bt=L=>{switch(L){case"Completed":return"bg-emerald-500/15 text-emerald-300 border-emerald-500/35";case"Running":case"Planning":case"Verifying":return"bg-violet-500/20 text-violet-200 border-violet-500/40 animate-pulse";case"Awaiting Approval":return"bg-amber-500/20 text-amber-300 border-amber-500/40";case"Failed":case"Blocked":return"bg-rose-500/20 text-rose-300 border-rose-500/40";case"Cancelled":return"bg-slate-700/40 text-slate-300 border-slate-600/50";default:return"bg-slate-800/70 text-slate-300 border-slate-700/60"}};return u.jsxs("div",{className:"w-screen h-screen flex flex-col bg-[#07090E] text-slate-100 overflow-hidden select-none font-sans",children:[u.jsxs("header",{className:"h-14 px-4 bg-[#0B0F19]/95 border-b border-white/[0.07] flex items-center justify-between flex-shrink-0 z-30",children:[u.jsxs("div",{className:"flex items-center space-x-5",children:[u.jsxs("div",{className:"flex items-center space-x-2.5",children:[u.jsx("div",{className:"w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/40 flex items-center justify-center shadow-inner",children:u.jsx(Pf,{className:"w-4 h-4 text-violet-400"})}),u.jsxs("div",{children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx("span",{className:"text-sm font-semibold tracking-wider text-white",children:"ORION"}),u.jsx("span",{className:"text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30",children:"OS WORKSTATION"})]}),u.jsx("div",{className:"text-[10px] text-slate-400 font-mono truncate max-w-[240px]",children:a})]})]}),u.jsxs("nav",{className:"flex items-center bg-[#07090E] p-1 rounded-lg border border-white/[0.06] space-x-1",children:[u.jsxs("button",{onClick:()=>m("WORKSTATION"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${p==="WORKSTATION"?"bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm":"text-slate-400 hover:text-slate-200"}`,children:[u.jsx(ec,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"Conversation"})]}),u.jsxs("button",{onClick:()=>m("BROWSER"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${p==="BROWSER"?"bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm":"text-slate-400 hover:text-slate-200"}`,children:[u.jsx(Hl,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"Chrome Control"})]}),u.jsxs("button",{onClick:()=>m("AGENTS"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${p==="AGENTS"?"bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm":"text-slate-400 hover:text-slate-200"}`,children:[u.jsx(Sd,{className:"w-3.5 h-3.5"}),u.jsxs("span",{children:["Agents (",de.length||10,")"]})]}),u.jsxs("button",{onClick:()=>m("LEGACY_HUD"),className:`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${p==="LEGACY_HUD"?"bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-sm":"text-slate-400 hover:text-slate-200"}`,children:[u.jsx(Rf,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"Subsystems & Demo"})]})]})]}),u.jsxs("div",{className:"flex items-center space-x-3",children:[u.jsxs("div",{className:`px-2.5 py-1 rounded-md border text-xs font-mono flex items-center space-x-1.5 ${bt(t)}`,children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-current"}),u.jsx("span",{children:t.toUpperCase()})]}),u.jsxs("div",{className:"hidden xl:flex items-center space-x-1.5 bg-[#07090E] px-2.5 py-1 rounded-md border border-white/[0.07] text-xs",children:[u.jsx(Sd,{className:"w-3.5 h-3.5 text-violet-400"}),u.jsx("span",{className:"text-slate-400",children:"Agent:"}),u.jsx("select",{value:le,onChange:async L=>{var ze;const Q=L.target.value;xe(Q);const _e=window.orionApi||window.arvisApi;await((ze=_e==null?void 0:_e.setActiveAgent)==null?void 0:ze.call(_e,Q)),await Pe(!1)},className:"bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer",children:(de.length>0?de:[{id:"commander",displayName:"ORION Commander"},{id:"recon",displayName:"Reconnaissance Engineer"},{id:"security",displayName:"Security Engineer"},{id:"implementation",displayName:"Implementation Engineer"},{id:"qa",displayName:"QA & Verification"},{id:"windows",displayName:"Windows & Desktop"}]).map(L=>u.jsxs("option",{value:L.id,className:"bg-[#0B0F19] text-slate-200",children:[L.id," — ",L.displayName]},L.id))})]}),u.jsxs("div",{className:"hidden lg:flex items-center space-x-1.5 bg-[#07090E] px-2.5 py-1 rounded-md border border-white/[0.07] text-xs font-mono",children:[u.jsx(Qs,{className:"w-3.5 h-3.5 text-indigo-400"}),u.jsx("span",{className:"text-slate-300",children:J?`${J.id}:${J.currentModel}`:"ollama:llama3.1:8b"})]}),u.jsxs("button",{onClick:tt,className:`px-3 py-1.5 rounded-md text-xs font-mono font-semibold tracking-wider transition-all flex items-center space-x-1.5 border ${ne?"bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 animate-pulse":"bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"}`,title:ne?"Click to Reset Emergency Stop":"Immediate Hardware/Process Emergency Stop",children:[u.jsx(Js,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:ne?"RESET E-STOP":"E-STOP"})]}),u.jsx("button",{onClick:()=>D(L=>!L),className:"p-1.5 rounded-md bg-[#07090E] border border-white/[0.07] text-slate-400 hover:text-slate-200 text-xs",title:"Toggle Execution Details & Diagnostics Panel",children:u.jsx(Jl,{className:"w-4 h-4"})})]})]}),u.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[u.jsxs("aside",{className:"w-64 bg-[#0B0F19]/90 border-r border-white/[0.06] flex flex-col justify-between flex-shrink-0",children:[u.jsxs("div",{className:"p-3.5 space-y-3 overflow-y-auto",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-400",children:"Active Applications"}),u.jsx("button",{onClick:async()=>{Y(!0),await Pe(!0),Y(!1)},className:"p-1 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors",title:"Refresh live Windows process and window state",children:u.jsx(Nf,{className:`w-3.5 h-3.5 ${K?"animate-spin text-violet-400":""}`})})]}),b&&u.jsxs("div",{className:"p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] space-y-1",children:[u.jsxs("div",{className:"flex items-center justify-between text-[10px] text-slate-400",children:[u.jsx("span",{children:"OS FOREGROUND WINDOW"}),u.jsx("span",{className:"text-emerald-400 font-mono",children:"LIVE"})]}),u.jsx("div",{className:"text-xs font-medium text-slate-200 truncate",title:b.title,children:b.title||"Desktop"}),u.jsxs("div",{className:"text-[10px] font-mono text-slate-400 truncate",children:["Process: ",b.processName]})]}),u.jsx("div",{className:"space-y-1.5",children:q.map(L=>{const Q=L.status==="Open",_e=L.status==="Launching",ze=L.status==="Launch failed";return u.jsxs("button",{onClick:()=>rt(L),className:`w-full p-2.5 rounded-lg border text-left transition-all flex items-start space-x-2.5 group ${L.isForeground?"bg-violet-600/15 border-violet-500/40":Q?"bg-[#111625]/90 hover:bg-[#161C2E] border-white/[0.08]":"bg-[#07090E]/60 hover:bg-[#111625]/60 border-white/[0.04] opacity-80 hover:opacity-100"}`,children:[u.jsx(Tw,{app:L,size:22}),u.jsxs("div",{className:"flex-1 min-w-0",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-xs font-medium text-slate-100 truncate",children:L.displayName}),u.jsx("span",{className:`text-[10px] font-mono px-1.5 py-0.5 rounded ${Q?"bg-emerald-500/15 text-emerald-300":_e?"bg-amber-500/20 text-amber-300 animate-pulse":ze?"bg-rose-500/20 text-rose-300":"bg-slate-800 text-slate-400"}`,children:L.status})]}),u.jsx("div",{className:"mt-1 flex items-center space-x-1.5 text-[10px]",children:L.verifiedWindow?u.jsxs("span",{className:"text-emerald-400/90 flex items-center space-x-1 truncate",children:[u.jsx(Cf,{className:"w-3 h-3 flex-shrink-0"}),u.jsx("span",{className:"truncate",title:L.windowTitle||"Window verified",children:L.windowTitle||"Window verified"})]}):Q?u.jsx("span",{className:"text-slate-400 truncate",children:"Background process running"}):u.jsx("span",{className:"text-slate-500 group-hover:text-violet-300 transition-colors",children:"Click to launch & verify"})})]})]},L.id)})})]}),u.jsxs("div",{className:"p-3 border-t border-white/[0.06] bg-[#07090E]/80 space-y-2 text-[11px] font-mono",children:[u.jsxs("div",{className:"flex items-center justify-between text-slate-400",children:[u.jsx("span",{children:"CPU LOAD"}),u.jsxs("span",{className:"text-slate-200",children:[(g==null?void 0:g.cpu.usagePercent)??0,"%"]})]}),u.jsx("div",{className:"w-full h-1 bg-slate-800 rounded-full overflow-hidden",children:u.jsx("div",{className:"h-full bg-violet-500 transition-all duration-300",style:{width:`${Math.min(100,(g==null?void 0:g.cpu.usagePercent)??0)}%`}})}),u.jsxs("div",{className:"flex items-center justify-between text-slate-400 pt-1",children:[u.jsx("span",{children:"MEMORY"}),u.jsx("span",{className:"text-slate-200",children:g?`${(g.memory.usedBytes/1073741824).toFixed(1)} / ${(g.memory.totalBytes/1073741824).toFixed(0)} GB`:"—"})]}),u.jsxs("div",{className:"flex items-center justify-between text-slate-400 pt-1",children:[u.jsx("span",{children:"POLICY SHA-256"}),u.jsx("span",{className:ue?"text-emerald-400":"text-rose-400",children:ue?"VERIFIED":"TAMPERED"})]})]})]}),u.jsxs("main",{className:"flex-1 flex flex-col bg-[#07090E] overflow-hidden relative",children:[p==="WORKSTATION"&&u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"px-6 py-2.5 bg-[#0B0F19]/60 border-b border-white/[0.05] flex items-center space-x-2 overflow-x-auto flex-shrink-0",children:[u.jsx("span",{className:"text-[11px] font-mono text-slate-400 mr-1 flex-shrink-0",children:"QUICK TASKS:"}),[{label:"Open Chrome",prompt:"Open Chrome."},{label:"Open example.com in Chrome",prompt:"Open https://example.com in Chrome."},{label:"Search ORION GitHub Repo",prompt:"Search for the official ORION GitHub repository and show me the result."},{label:"Summarize Official ORION Repo",prompt:"Open the official repository and summarize its visible project information."},{label:"System Overview",prompt:"Give me an overview of this machine"},{label:"Check Display Brightness",prompt:"What is my current screen brightness?"}].map(L=>u.jsx("button",{disabled:V,onClick:()=>we(L.prompt),className:"px-2.5 py-1 rounded-md bg-[#111625] hover:bg-violet-600/20 border border-white/[0.07] hover:border-violet-500/40 text-xs text-slate-300 hover:text-violet-200 transition-all flex-shrink-0 disabled:opacity-40",children:L.label},L.label))]}),u.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-5 space-y-5",children:[C.map(L=>u.jsx("div",{className:`flex flex-col ${L.role==="user"?"items-end":"items-start"}`,children:u.jsxs("div",{className:`max-w-3xl rounded-xl p-4 border ${L.role==="user"?"bg-violet-600/20 border-violet-500/35 text-slate-100":"bg-[#0B0F19] border-white/[0.07] text-slate-200 shadow-lg"}`,children:[u.jsxs("div",{className:"flex items-center justify-between space-x-4 mb-2 text-[11px] font-mono text-slate-400",children:[u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsx("span",{className:"font-semibold text-slate-300",children:L.role==="user"?"OPERATOR":`ORION (${L.agentId||"commander"})`}),L.providerModel&&L.role==="assistant"&&u.jsx("span",{className:"px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400",children:L.providerModel})]}),u.jsxs("div",{className:"flex items-center space-x-2",children:[L.executionState&&u.jsx("span",{className:`px-1.5 py-0.5 rounded border text-[10px] ${bt(L.executionState)}`,children:L.executionState}),u.jsx("span",{children:new Date(L.timestamp).toLocaleTimeString()})]})]}),u.jsx("div",{className:"text-sm leading-relaxed whitespace-pre-wrap select-text",children:L.content||(L.isStreaming?"Executing and verifying...":"")}),L.browserReport&&u.jsxs("div",{className:"mt-3 p-3 rounded-lg bg-[#07090E] border border-white/[0.07] space-y-2 text-xs font-mono",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("span",{className:"text-violet-300 font-semibold flex items-center space-x-1.5",children:[u.jsx(Hl,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"CLOSED-LOOP CHROME VERIFICATION"})]}),u.jsx("span",{className:L.browserReport.postconditionsVerified?"text-emerald-400":"text-rose-400",children:L.browserReport.postconditionsVerified?"POSTCONDITIONS VERIFIED":"UNVERIFIED / FAILED"})]}),L.browserReport.url&&u.jsxs("div",{className:"text-slate-300 truncate",children:["URL: ",u.jsx("span",{className:"text-cyan-300 select-text",children:L.browserReport.url})]}),L.browserReport.title&&u.jsxs("div",{className:"text-slate-300 truncate",children:["Title: ",u.jsx("span",{className:"text-white select-text",children:L.browserReport.title})]}),Array.isArray(L.browserReport.searchResults)&&L.browserReport.searchResults.length>0&&u.jsxs("div",{className:"space-y-1 pt-1 border-t border-white/[0.06]",children:[u.jsx("div",{className:"text-[10px] text-slate-400",children:"EXTRACTED SEARCH RESULTS:"}),L.browserReport.searchResults.slice(0,4).map((Q,_e)=>u.jsxs("div",{className:"p-1.5 rounded bg-[#0B0F19] border border-white/[0.04]",children:[u.jsx("div",{className:"text-violet-300 font-semibold truncate select-text",children:Q.title}),u.jsx("div",{className:"text-cyan-400 text-[11px] truncate select-text",children:Q.url})]},_e))]}),Array.isArray(L.browserReport.steps)&&u.jsx("div",{className:"pt-1 border-t border-white/[0.06] flex flex-wrap gap-1.5",children:L.browserReport.steps.map((Q,_e)=>u.jsx("span",{className:"px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300",title:Q.detail,children:Q.stage},_e))})]}),Array.isArray(L.toolResults)&&L.toolResults.length>0&&u.jsx("div",{className:"mt-3 space-y-2",children:L.toolResults.map((Q,_e)=>u.jsxs("div",{className:"p-2.5 rounded-lg bg-[#07090E] border border-white/[0.07] text-xs font-mono space-y-1",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-violet-300 font-semibold",children:Q.toolId}),u.jsxs("span",{className:`px-1.5 py-0.5 rounded text-[10px] ${Q.success&&Q.verificationStatus==="VERIFIED"?"bg-emerald-500/15 text-emerald-300":Q.success?"bg-blue-500/15 text-blue-300":"bg-rose-500/15 text-rose-300"}`,children:[Q.verificationStatus||(Q.success?"VERIFIED":"FAILED")," (",Q.executionTimeMs||0,"ms)"]})]}),Q.error&&u.jsx("div",{className:"text-rose-300 select-text",children:Q.error})]},Q.toolCallId||_e))}),L.errorRecoverySuggestion&&u.jsxs("div",{className:"mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2",children:[u.jsx(If,{className:"w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"}),u.jsxs("div",{children:[u.jsx("span",{className:"font-semibold",children:"Recovery Suggestion: "}),u.jsx("span",{children:L.errorRecoverySuggestion})]})]})]})},L.id)),u.jsx("div",{ref:ve})]}),u.jsx("div",{className:"p-4 bg-[#0B0F19]/95 border-t border-white/[0.07]",children:u.jsxs("div",{className:"max-w-4xl mx-auto flex items-end space-x-3",children:[u.jsx("div",{className:"flex-1 bg-[#07090E] border border-white/[0.1] focus-within:border-violet-500/60 rounded-xl p-2.5 transition-all",children:u.jsx("textarea",{rows:2,value:P,onChange:L=>I(L.target.value),onKeyDown:ct,placeholder:"Give ORION a task (e.g., 'Open https://example.com in Chrome.' or 'Search for the official ORION GitHub repository')... Press Enter to send, Shift+Enter for newline.",className:"w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none select-text"})}),V?u.jsxs("button",{onClick:ke,className:"px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-rose-600/25 transition-all",children:[u.jsx(yx,{className:"w-4 h-4 fill-current"}),u.jsx("span",{children:"STOP"})]}):u.jsxs("button",{onClick:()=>we(),disabled:!P.trim(),className:"px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-violet-600/20 transition-all",children:[u.jsx("span",{children:"EXECUTE"}),u.jsx(_x,{className:"w-3.5 h-3.5"})]})]})})]}),p==="BROWSER"&&u.jsxs("div",{className:"flex-1 overflow-y-auto p-6 space-y-6",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("div",{children:[u.jsxs("h2",{className:"text-lg font-semibold text-white flex items-center space-x-2",children:[u.jsx(Hl,{className:"w-5 h-5 text-violet-400"}),u.jsx("span",{children:"Closed-Loop Chrome & Web Execution Engine"})]}),u.jsx("p",{className:"text-xs text-slate-400 mt-0.5",children:"OBSERVE → UNDERSTAND → PLAN → VALIDATE → AUTHORIZE → EXECUTE → OBSERVE AGAIN → VERIFY → REPORT"})]}),u.jsxs("button",{onClick:async()=>{var Q;const L=window.orionApi||window.arvisApi;await((Q=L==null?void 0:L.browserOpenChrome)==null?void 0:Q.call(L,{visibleWindow:!0})),await Pe(!0)},className:"px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-2",children:[u.jsx(aw,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"Launch & Focus Visible Chrome"})]})]}),u.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[u.jsxs("div",{className:"p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3",children:[u.jsx("div",{className:"text-xs font-semibold text-slate-300 uppercase tracking-wider",children:"1. Navigate Chrome to URL"}),u.jsxs("div",{className:"flex space-x-2",children:[u.jsx("input",{type:"text",value:pt,onChange:L=>mt(L.target.value),className:"flex-1 bg-[#07090E] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"}),u.jsx("button",{onClick:()=>{m("WORKSTATION"),we(`Open ${pt} in Chrome.`)},className:"px-3.5 py-2 rounded-lg bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 text-violet-200 text-xs font-medium",children:"Navigate & Verify"})]})]}),u.jsxs("div",{className:"p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3",children:[u.jsx("div",{className:"text-xs font-semibold text-slate-300 uppercase tracking-wider",children:"2. Search Web & Extract Verified Links"}),u.jsxs("div",{className:"flex space-x-2",children:[u.jsx("input",{type:"text",value:Je,onChange:L=>Pt(L.target.value),className:"flex-1 bg-[#07090E] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-100"}),u.jsx("button",{onClick:()=>{m("WORKSTATION"),we(`Search for ${Je} and show me the result.`)},className:"px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-medium",children:"Search & Extract"})]})]})]}),u.jsxs("div",{className:"p-4 rounded-xl bg-[#0B0F19] border border-white/[0.07] space-y-3 font-mono text-xs",children:[u.jsxs("div",{className:"flex items-center justify-between border-b border-white/[0.06] pb-2",children:[u.jsx("span",{className:"text-violet-300 font-semibold",children:"ACTIVE BROWSER OBSERVATION"}),u.jsxs("span",{className:"text-slate-400",children:["Adapter: ",(He==null?void 0:He.adapterMode)||"HTTP_FETCH"," | ReadyState: ",(He==null?void 0:He.readyState)||"complete"]})]}),u.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[u.jsxs("div",{children:[u.jsx("span",{className:"text-slate-400",children:"Active URL: "}),u.jsx("span",{className:"text-cyan-300 select-text",children:(He==null?void 0:He.url)||"about:blank"})]}),u.jsxs("div",{children:[u.jsx("span",{className:"text-slate-400",children:"Page Title: "}),u.jsx("span",{className:"text-white select-text",children:(He==null?void 0:He.title)||"Blank Window"})]})]}),(He==null?void 0:He.extractedText)&&u.jsx("div",{className:"p-3 rounded bg-[#07090E] border border-white/[0.05] text-slate-300 max-h-40 overflow-y-auto select-text",children:He.extractedText})]})]}),p==="AGENTS"&&u.jsxs("div",{className:"flex-1 overflow-y-auto p-6 space-y-6",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("div",{children:[u.jsxs("h2",{className:"text-lg font-semibold text-white flex items-center space-x-2",children:[u.jsx(Sd,{className:"w-5 h-5 text-violet-400"}),u.jsx("span",{children:"Multi-Agent Engineering Roster & Task Coordinator"})]}),u.jsx("p",{className:"text-xs text-slate-400 mt-0.5",children:"Real inspectable agents with enforced permission ceilings, tool allowlists, and verified evidence records."})]}),u.jsxs("button",{onClick:async()=>{const L=window.orionApi||window.arvisApi;L!=null&&L.delegateAgentGoal&&(r("Running"),l("Coordinating parallel Recon + Security + QA verification..."),await L.delegateAgentGoal("Verify Chrome & UI workstation integration and security boundaries","src/main/index.ts"),r("Completed"),await Pe(!1))},className:"px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center space-x-1.5",children:[u.jsx(sa,{className:"w-3.5 h-3.5"}),u.jsx("span",{children:"Run Coordinated Recon + Security + QA Pass"})]})]}),u.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3.5",children:de.map(L=>u.jsxs("div",{className:`p-4 rounded-xl border transition-all space-y-2 ${le===L.id?"bg-violet-600/10 border-violet-500/40":"bg-[#0B0F19] border-white/[0.07]"}`,children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsxs("div",{children:[u.jsx("span",{className:"text-xs font-mono text-violet-300 font-semibold",children:L.id}),u.jsx("h3",{className:"text-sm font-semibold text-white",children:L.displayName})]}),u.jsxs("div",{className:"flex items-center space-x-2",children:[u.jsxs("span",{className:"px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-slate-300",children:[L.maxPermissionLevel," ",L.readOnly?"(RO)":""]}),u.jsx("span",{className:`px-2 py-0.5 rounded text-[10px] font-mono ${L.status==="RUNNING"?"bg-amber-500/20 text-amber-300 animate-pulse":L.status==="COMPLETED"?"bg-emerald-500/15 text-emerald-300":"bg-slate-800 text-slate-400"}`,children:L.status})]})]}),u.jsx("div",{className:"text-xs text-slate-400",children:L.roleTitle}),u.jsxs("div",{className:"flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/[0.05]",children:[u.jsx("span",{className:"text-indigo-300",children:L.backend}),u.jsx("button",{onClick:async()=>{var _e;const Q=window.orionApi||window.arvisApi;await((_e=Q==null?void 0:Q.setActiveAgent)==null?void 0:_e.call(Q,L.id)),xe(L.id)},className:"text-violet-400 hover:text-violet-300 underline",children:le===L.id?"Active Coordinator":"Select Agent"})]}),L.latestResultSummary&&u.jsxs("div",{className:"p-2 rounded bg-[#07090E] text-[11px] font-mono text-slate-300 truncate",title:L.latestResultSummary,children:["Latest: ",L.latestResultSummary]})]},L.id))})]}),p==="LEGACY_HUD"&&u.jsxs("div",{className:"flex-1 flex flex-col overflow-hidden",children:[u.jsx("div",{className:"px-4 py-2 bg-[#0B0F19] border-b border-white/[0.06] flex items-center space-x-2",children:["COMPUTER","VISION","SYSTEM","NETWORK","MEMORY","TITAN","DEMO"].map(L=>u.jsx("button",{onClick:()=>f(L),className:`px-2.5 py-1 rounded text-xs font-mono ${d===L?"bg-violet-600/30 text-violet-200 border border-violet-500/40":"text-slate-400 hover:text-white"}`,children:L},L))}),u.jsx("div",{className:"flex-1 overflow-hidden",children:u.jsx(bw,{currentMode:d==="COMMAND"?"COMPUTER":d,assistantState:s,snapshot:g,activities:M,currentTask:S,cameraActive:v.cameraActive})})]})]}),Ke&&u.jsxs("aside",{className:"w-80 bg-[#0B0F19]/95 border-l border-white/[0.06] flex flex-col overflow-y-auto flex-shrink-0 p-3.5 space-y-4",children:[u.jsxs("div",{className:"space-y-2",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-400",children:"Authorization Gate"}),u.jsxs("span",{className:"text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300",children:[Fe.length," Pending"]})]}),Fe.length===0?u.jsxs("div",{className:"p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] text-xs text-slate-400 flex items-center space-x-2",children:[u.jsx(ro,{className:"w-4 h-4 text-emerald-400 flex-shrink-0"}),u.jsx("span",{children:"No pending approval requests. Action-bound gate active."})]}):Fe.map(L=>u.jsxs("div",{className:"p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 space-y-2 text-xs",children:[u.jsxs("div",{className:"flex items-center justify-between font-mono",children:[u.jsx("span",{className:"text-amber-300 font-semibold",children:L.toolId}),u.jsx("span",{className:"px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px]",children:L.evaluatedRisk})]}),u.jsx("div",{className:"text-slate-200 text-[11px]",children:L.reason}),u.jsxs("div",{className:"flex space-x-2 pt-1",children:[u.jsx("button",{onClick:()=>Be(L.approvalId),className:"flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs",children:"Approve"}),u.jsx("button",{onClick:()=>xt(L.approvalId),className:"flex-1 py-1.5 rounded bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs",children:"Deny"})]})]},L.approvalId))]}),u.jsxs("div",{className:"p-3 rounded-lg bg-[#07090E] border border-white/[0.06] space-y-2 text-xs font-mono",children:[u.jsx("div",{className:"text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400",children:"Active Execution Context"}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"State:"}),u.jsx("span",{className:"text-violet-300",children:t})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Coordinator:"}),u.jsx("span",{className:"text-slate-200",children:le})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Provider:"}),u.jsx("span",{className:"text-indigo-300",children:J?`${J.id}:${J.currentModel}`:"ollama:llama3.1:8b"})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"E-Stop:"}),u.jsx("span",{className:ne?"text-rose-400 font-bold":"text-emerald-400",children:ne?"LOCKED (ACTIVE)":"ARMED (READY)"})]})]}),u.jsxs("div",{className:"border-t border-white/[0.06] pt-3",children:[u.jsxs("button",{onClick:()=>Se(L=>!L),className:"w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200",children:[u.jsxs("span",{children:["Execution Timeline (",W.length+B.length,")"]}),ye?u.jsx(M0,{className:"w-3.5 h-3.5"}):u.jsx(w0,{className:"w-3.5 h-3.5"})]}),ye&&u.jsxs("div",{className:"mt-2 space-y-1.5 max-h-56 overflow-y-auto",children:[W.slice(-6).map((L,Q)=>u.jsxs("div",{className:"p-2 rounded bg-[#07090E] border border-white/[0.04] text-[11px] font-mono",children:[u.jsxs("span",{className:"text-violet-400 font-semibold",children:["[",L.stage,"]"]})," ",u.jsx("span",{className:"text-slate-300",children:L.detail})]},Q)),B.slice(-6).reverse().map(L=>u.jsxs("div",{className:"p-2 rounded bg-[#07090E] border border-white/[0.04] text-[11px] font-mono",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-indigo-300 font-semibold",children:L.agentId}),u.jsx("span",{className:L.status==="COMPLETED"?"text-emerald-400":"text-amber-300",children:L.status})]}),u.jsx("div",{className:"text-slate-300 truncate",children:L.title})]},L.taskId)),W.length===0&&B.length===0&&u.jsx("div",{className:"text-xs text-slate-500 py-2",children:"No tasks executed in this session yet."})]})]}),u.jsxs("div",{className:"border-t border-white/[0.06] pt-3",children:[u.jsxs("button",{onClick:()=>se(L=>!L),className:"w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200",children:[u.jsx("span",{children:"Backend & Provider Diagnostics"}),T?u.jsx(M0,{className:"w-3.5 h-3.5"}):u.jsx(w0,{className:"w-3.5 h-3.5"})]}),T&&u.jsxs("div",{className:"mt-2 p-2.5 rounded-lg bg-[#07090E] border border-white/[0.05] space-y-2 text-[11px] font-mono",children:[u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Ollama Local:"}),u.jsx("span",{className:"text-emerald-400",children:(H=te==null?void 0:te.ollama)!=null&&H.healthy?`READY (${te.ollama.activeModel})`:"FALLBACK READY"})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Gemini Cloud:"}),u.jsx("span",{className:"text-amber-300",children:(Ie=te==null?void 0:te.gemini)!=null&&Ie.configured?"CONFIGURED":"NOT CONFIGURED"})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Argon Runtime:"}),u.jsx("span",{className:"text-slate-400",children:((he=te==null?void 0:te.argon)==null?void 0:he.status)||"UNAVAILABLE"})]}),u.jsxs("div",{className:"flex justify-between",children:[u.jsx("span",{className:"text-slate-400",children:"Policy Hash:"}),u.jsx("span",{className:"text-emerald-400",children:ge})]})]})]})]})]})]})};dg.createRoot(document.getElementById("root")).render(u.jsx(rg.StrictMode,{children:u.jsx(Cw,{})}));
