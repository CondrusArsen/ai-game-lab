var ht,ut,ti,Wi,Je,qi,gi=1,_i=3,gn=0,_n=1,xn=2,vn=3,yn=4,Sn=5,Mn=6,bn=7,xi=0,vi=1,yi=2,Bn=1,Vn=2,kn=3,zn=4,Gn=5,Hn=6,Wn=7,Xn=300,Si=301,qn=302,Mi=306,En=1e3,xt=1001,Tn=1002,wn=1003,bi=1006,Ei=1008,Ti=1009,Yn=1015,Zn=1023,yt=2300,Ut=2301,Dt=2302,An=2303,Rn=2400,Cn=2401,In=2402,Jn="",Me="srgb",Pn="srgb-linear",Ln="linear",Nt="srgb",wi=35044,vt=2e3,Dn=2001;function Yi(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Zi(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Nn(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}var ni={},Ft=null;function Ai(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ne(...i){i=Ai(i);let e="THREE."+i.shift();if(Ft)Ft("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $(...i){i=Ai(i);let e="THREE."+i.shift();if(Ft)Ft("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function rt(...i){let e=i.join(" ");e in ni||(ni[e]=!0,ne(...i))}var Ji={[gn]:_n,[xn]:Mn,[yn]:bn,[vn]:Sn,[_n]:gn,[Mn]:xn,[bn]:yn,[Sn]:vn},We=class{addEventListener(i,e){this._listeners===void 0&&(this._listeners={});let t=this._listeners;t[i]===void 0&&(t[i]=[]),t[i].indexOf(e)===-1&&t[i].push(e)}hasEventListener(i,e){let t=this._listeners;return t===void 0?!1:t[i]!==void 0&&t[i].indexOf(e)!==-1}removeEventListener(i,e){let t=this._listeners;if(t===void 0)return;let r=t[i];if(r!==void 0){let a=r.indexOf(e);a!==-1&&r.splice(a,1)}}dispatchEvent(i){let e=this._listeners;if(e===void 0)return;let t=e[i.type];if(t!==void 0){i.target=this;let r=t.slice(0);for(let a=0,n=r.length;a<n;a++)r[a].call(this,i);i.target=null}}},ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],mo=Math.PI/180,$i=180/Math.PI;function Et(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ce[i&255]+ce[i>>8&255]+ce[i>>16&255]+ce[i>>24&255]+"-"+ce[e&255]+ce[e>>8&255]+"-"+ce[e>>16&15|64]+ce[e>>24&255]+"-"+ce[t&63|128]+ce[t>>8&255]+"-"+ce[t>>16&255]+ce[t>>24&255]+ce[r&255]+ce[r>>8&255]+ce[r>>16&255]+ce[r>>24&255]).toLowerCase()}function k(i,e,t){return Math.max(e,Math.min(t,i))}function Ki(i,e){return(i%e+e)%e}function rn(i,e,t){return(1-t)*i+t*e}function ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function me(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var fe=(ht=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=k(this.x,e.x,t.x),this.y=k(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=k(this.x,e,t),this.y=k(this.y,e,t),this}clampLength(e,t){let r=this.length();return this.divideScalar(r||1).multiplyScalar(k(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let r=this.dot(e)/t;return Math.acos(k(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let r=Math.cos(t),a=Math.sin(t),n=this.x-e.x,o=this.y-e.y;return this.x=n*r-o*a+e.x,this.y=n*a+o*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ht.prototype.isVector2=!0,ht),X=class{constructor(i=0,e=0,t=0,r=1){this.isQuaternion=!0,this._x=i,this._y=e,this._z=t,this._w=r}static slerpFlat(i,e,t,r,a,n,o){let s=t[r+0],l=t[r+1],c=t[r+2],d=t[r+3],m=a[n+0],u=a[n+1],h=a[n+2],f=a[n+3];if(d!==f||s!==m||l!==u||c!==h){let _=s*m+l*u+c*h+d*f;_<0&&(m=-m,u=-u,h=-h,f=-f,_=-_);let p=1-o;if(_<.9995){let g=Math.acos(_),v=Math.sin(g);p=Math.sin(p*g)/v,o=Math.sin(o*g)/v,s=s*p+m*o,l=l*p+u*o,c=c*p+h*o,d=d*p+f*o}else{s=s*p+m*o,l=l*p+u*o,c=c*p+h*o,d=d*p+f*o;let g=1/Math.sqrt(s*s+l*l+c*c+d*d);s*=g,l*=g,c*=g,d*=g}}i[e]=s,i[e+1]=l,i[e+2]=c,i[e+3]=d}static multiplyQuaternionsFlat(i,e,t,r,a,n){let o=t[r],s=t[r+1],l=t[r+2],c=t[r+3],d=a[n],m=a[n+1],u=a[n+2],h=a[n+3];return i[e]=o*h+c*d+s*u-l*m,i[e+1]=s*h+c*m+l*d-o*u,i[e+2]=l*h+c*u+o*m-s*d,i[e+3]=c*h-o*d-s*m-l*u,i}get x(){return this._x}set x(i){this._x=i,this._onChangeCallback()}get y(){return this._y}set y(i){this._y=i,this._onChangeCallback()}get z(){return this._z}set z(i){this._z=i,this._onChangeCallback()}get w(){return this._w}set w(i){this._w=i,this._onChangeCallback()}set(i,e,t,r){return this._x=i,this._y=e,this._z=t,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(i){return this._x=i.x,this._y=i.y,this._z=i.z,this._w=i.w,this._onChangeCallback(),this}setFromEuler(i,e=!0){let t=i._x,r=i._y,a=i._z,n=i._order,o=Math.cos,s=Math.sin,l=o(t/2),c=o(r/2),d=o(a/2),m=s(t/2),u=s(r/2),h=s(a/2);switch(n){case"XYZ":this._x=m*c*d+l*u*h,this._y=l*u*d-m*c*h,this._z=l*c*h+m*u*d,this._w=l*c*d-m*u*h;break;case"YXZ":this._x=m*c*d+l*u*h,this._y=l*u*d-m*c*h,this._z=l*c*h-m*u*d,this._w=l*c*d+m*u*h;break;case"ZXY":this._x=m*c*d-l*u*h,this._y=l*u*d+m*c*h,this._z=l*c*h+m*u*d,this._w=l*c*d-m*u*h;break;case"ZYX":this._x=m*c*d-l*u*h,this._y=l*u*d+m*c*h,this._z=l*c*h-m*u*d,this._w=l*c*d+m*u*h;break;case"YZX":this._x=m*c*d+l*u*h,this._y=l*u*d+m*c*h,this._z=l*c*h-m*u*d,this._w=l*c*d-m*u*h;break;case"XZY":this._x=m*c*d-l*u*h,this._y=l*u*d-m*c*h,this._z=l*c*h+m*u*d,this._w=l*c*d+m*u*h;break;default:ne("Quaternion: .setFromEuler() encountered an unknown order: "+n)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(i,e){let t=e/2,r=Math.sin(t);return this._x=i.x*r,this._y=i.y*r,this._z=i.z*r,this._w=Math.cos(t),this._onChangeCallback(),this}setFromRotationMatrix(i){let e=i.elements,t=e[0],r=e[4],a=e[8],n=e[1],o=e[5],s=e[9],l=e[2],c=e[6],d=e[10],m=t+o+d;if(m>0){let u=.5/Math.sqrt(m+1);this._w=.25/u,this._x=(c-s)*u,this._y=(a-l)*u,this._z=(n-r)*u}else if(t>o&&t>d){let u=2*Math.sqrt(1+t-o-d);this._w=(c-s)/u,this._x=.25*u,this._y=(r+n)/u,this._z=(a+l)/u}else if(o>d){let u=2*Math.sqrt(1+o-t-d);this._w=(a-l)/u,this._x=(r+n)/u,this._y=.25*u,this._z=(s+c)/u}else{let u=2*Math.sqrt(1+d-t-o);this._w=(n-r)/u,this._x=(a+l)/u,this._y=(s+c)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(i,e){let t=i.dot(e)+1;return t<1e-8?(t=0,Math.abs(i.x)>Math.abs(i.z)?(this._x=-i.y,this._y=i.x,this._z=0,this._w=t):(this._x=0,this._y=-i.z,this._z=i.y,this._w=t)):(this._x=i.y*e.z-i.z*e.y,this._y=i.z*e.x-i.x*e.z,this._z=i.x*e.y-i.y*e.x,this._w=t),this.normalize()}angleTo(i){return 2*Math.acos(Math.abs(k(this.dot(i),-1,1)))}rotateTowards(i,e){let t=this.angleTo(i);if(t===0)return this;let r=Math.min(1,e/t);return this.slerp(i,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(i){return this._x*i._x+this._y*i._y+this._z*i._z+this._w*i._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let i=this.length();return i===0?(this._x=0,this._y=0,this._z=0,this._w=1):(i=1/i,this._x=this._x*i,this._y=this._y*i,this._z=this._z*i,this._w=this._w*i),this._onChangeCallback(),this}multiply(i){return this.multiplyQuaternions(this,i)}premultiply(i){return this.multiplyQuaternions(i,this)}multiplyQuaternions(i,e){let t=i._x,r=i._y,a=i._z,n=i._w,o=e._x,s=e._y,l=e._z,c=e._w;return this._x=t*c+n*o+r*l-a*s,this._y=r*c+n*s+a*o-t*l,this._z=a*c+n*l+t*s-r*o,this._w=n*c-t*o-r*s-a*l,this._onChangeCallback(),this}slerp(i,e){let t=i._x,r=i._y,a=i._z,n=i._w,o=this.dot(i);o<0&&(t=-t,r=-r,a=-a,n=-n,o=-o);let s=1-e;if(o<.9995){let l=Math.acos(o),c=Math.sin(l);s=Math.sin(s*l)/c,e=Math.sin(e*l)/c,this._x=this._x*s+t*e,this._y=this._y*s+r*e,this._z=this._z*s+a*e,this._w=this._w*s+n*e,this._onChangeCallback()}else this._x=this._x*s+t*e,this._y=this._y*s+r*e,this._z=this._z*s+a*e,this._w=this._w*s+n*e,this.normalize();return this}slerpQuaternions(i,e,t){return this.copy(i).slerp(e,t)}random(){let i=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),t=Math.random(),r=Math.sqrt(1-t),a=Math.sqrt(t);return this.set(r*Math.sin(i),r*Math.cos(i),a*Math.sin(e),a*Math.cos(e))}equals(i){return i._x===this._x&&i._y===this._y&&i._z===this._z&&i._w===this._w}fromArray(i,e=0){return this._x=i[e],this._y=i[e+1],this._z=i[e+2],this._w=i[e+3],this._onChangeCallback(),this}toArray(i=[],e=0){return i[e]=this._x,i[e+1]=this._y,i[e+2]=this._z,i[e+3]=this._w,i}fromBufferAttribute(i,e){return this._x=i.getX(e),this._y=i.getY(e),this._z=i.getZ(e),this._w=i.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(i){return this._onChangeCallback=i,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=(ut=class{constructor(e=0,t=0,r=0){this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ii.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ii.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,r=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[3]*r+n[6]*a,this.y=n[1]*t+n[4]*r+n[7]*a,this.z=n[2]*t+n[5]*r+n[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,r=this.y,a=this.z,n=e.elements,o=1/(n[3]*t+n[7]*r+n[11]*a+n[15]);return this.x=(n[0]*t+n[4]*r+n[8]*a+n[12])*o,this.y=(n[1]*t+n[5]*r+n[9]*a+n[13])*o,this.z=(n[2]*t+n[6]*r+n[10]*a+n[14])*o,this}applyQuaternion(e){let t=this.x,r=this.y,a=this.z,n=e.x,o=e.y,s=e.z,l=e.w,c=2*(o*a-s*r),d=2*(s*t-n*a),m=2*(n*r-o*t);return this.x=t+l*c+o*m-s*d,this.y=r+l*d+s*c-n*m,this.z=a+l*m+n*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,r=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[4]*r+n[8]*a,this.y=n[1]*t+n[5]*r+n[9]*a,this.z=n[2]*t+n[6]*r+n[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=k(this.x,e.x,t.x),this.y=k(this.y,e.y,t.y),this.z=k(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=k(this.x,e,t),this.y=k(this.y,e,t),this.z=k(this.z,e,t),this}clampLength(e,t){let r=this.length();return this.divideScalar(r||1).multiplyScalar(k(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let r=e.x,a=e.y,n=e.z,o=t.x,s=t.y,l=t.z;return this.x=a*l-n*s,this.y=n*o-r*l,this.z=r*s-a*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return an.copy(this).projectOnVector(e),this.sub(an)}reflect(e){return this.sub(an.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let r=this.dot(e)/t;return Math.acos(k(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){let a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ut.prototype.isVector3=!0,ut),an=new w,ii=new X,B=(ti=class{constructor(e,t,r,a,n,o,s,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,n,o,s,l,c)}set(e,t,r,a,n,o,s,l,c){let d=this.elements;return d[0]=e,d[1]=a,d[2]=s,d[3]=t,d[4]=n,d[5]=l,d[6]=r,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let r=e.elements,a=t.elements,n=this.elements,o=r[0],s=r[3],l=r[6],c=r[1],d=r[4],m=r[7],u=r[2],h=r[5],f=r[8],_=a[0],p=a[3],g=a[6],v=a[1],S=a[4],C=a[7],P=a[2],b=a[5],E=a[8];return n[0]=o*_+s*v+l*P,n[3]=o*p+s*S+l*b,n[6]=o*g+s*C+l*E,n[1]=c*_+d*v+m*P,n[4]=c*p+d*S+m*b,n[7]=c*g+d*C+m*E,n[2]=u*_+h*v+f*P,n[5]=u*p+h*S+f*b,n[8]=u*g+h*C+f*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*s*c-r*n*d+r*s*l+a*n*c-a*o*l}invert(){let e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8],m=d*o-s*c,u=s*l-d*n,h=c*n-o*l,f=t*m+r*u+a*h;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/f;return e[0]=m*_,e[1]=(a*c-d*r)*_,e[2]=(s*r-a*o)*_,e[3]=u*_,e[4]=(d*t-a*l)*_,e[5]=(a*n-s*t)*_,e[6]=h*_,e[7]=(r*l-c*t)*_,e[8]=(o*t-r*n)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,n,o,s){let l=Math.cos(n),c=Math.sin(n);return this.set(r*l,r*c,-r*(l*o+c*s)+o+e,-a*c,a*l,-a*(-c*o+l*s)+s+t,0,0,1),this}scale(e,t){return rt("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(on.makeScale(e,t)),this}rotate(e){return rt("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(on.makeRotation(-e)),this}translate(e,t){return rt("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(on.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){let r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ti.prototype.isMatrix3=!0,ti),on=new B,si=new B().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ri=new B().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qi(){let i={enabled:!0,workingColorSpace:Pn,spaces:{},convert:function(a,n,o){return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===Nt&&(a.r=Pe(a.r),a.g=Pe(a.g),a.b=Pe(a.b)),this.spaces[n].primaries!==this.spaces[o].primaries&&(a.applyMatrix3(this.spaces[n].toXYZ),a.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Nt&&(a.r=at(a.r),a.g=at(a.g),a.b=at(a.b))),a},workingToColorSpace:function(a,n){return this.convert(a,this.workingColorSpace,n)},colorSpaceToWorking:function(a,n){return this.convert(a,n,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===Jn?Ln:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,n=this.workingColorSpace){return a.fromArray(this.spaces[n].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,n,o){return a.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,n){return rt("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(a,n)},toWorkingColorSpace:function(a,n){return rt("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(a,n)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],r=[.3127,.329];return i.define({[Pn]:{primaries:e,whitePoint:r,transfer:Ln,toXYZ:si,fromXYZ:ri,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Me},outputColorSpaceConfig:{drawingBufferColorSpace:Me}},[Me]:{primaries:e,whitePoint:r,transfer:Nt,toXYZ:si,fromXYZ:ri,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Me}}}),i}var Se=Qi();function Pe(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function at(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var $e,Ot=class{static getDataURL(i,e="image/png"){if(/^data:/i.test(i.src)||typeof HTMLCanvasElement>"u")return i.src;let t;if(i instanceof HTMLCanvasElement)t=i;else{$e===void 0&&($e=Nn("canvas")),$e.width=i.width,$e.height=i.height;let r=$e.getContext("2d");i instanceof ImageData?r.putImageData(i,0,0):r.drawImage(i,0,0,i.width,i.height),t=$e}return t.toDataURL(e)}static sRGBToLinear(i){if(typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap){let e=Nn("canvas");e.width=i.width,e.height=i.height;let t=e.getContext("2d");t.drawImage(i,0,0,i.width,i.height);let r=t.getImageData(0,0,i.width,i.height),a=r.data;for(let n=0;n<a.length;n++)a[n]=Pe(a[n]/255)*255;return t.putImageData(r,0,0),e}else if(i.data){let e=i.data.slice(0);for(let t=0;t<e.length;t++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[t]=Math.floor(Pe(e[t]/255)*255):e[t]=Pe(e[t]);return{data:e,width:i.width,height:i.height}}else return ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),i}},ji=0,Bt=class{constructor(i=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ji++}),this.uuid=Et(),this.data=i,this.dataReady=!0,this.version=0}getSize(i){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?i.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?i.set(e.displayWidth,e.displayHeight,0):e!==null?i.set(e.width,e.height,e.depth||0):i.set(0,0,0),i}set needsUpdate(i){i===!0&&this.version++}toJSON(i){let e=i===void 0||typeof i=="string";if(!e&&i.images[this.uuid]!==void 0)return i.images[this.uuid];let t={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let n=0,o=r.length;n<o;n++)r[n].isDataTexture?a.push(ln(r[n].image)):a.push(ln(r[n]))}else a=ln(r);t.url=a}return e||(i.images[this.uuid]=t),t}};function ln(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ot.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ne("Texture: Unable to serialize Texture."),{})}var es=0,cn=new w,Xe=class sn extends We{constructor(e=sn.DEFAULT_IMAGE,t=sn.DEFAULT_MAPPING,r=xt,a=xt,n=bi,o=Ei,s=Zn,l=Ti,c=sn.DEFAULT_ANISOTROPY,d=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:es++}),this.uuid=Et(),this.name="",this.source=new Bt(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=n,this.minFilter=o,this.anisotropy=c,this.format=s,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new B,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(cn).x}get height(){return this.source.getSize(cn).y}get depth(){return this.source.getSize(cn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let r=e[t];if(r===void 0){ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let a=this[t];if(a===void 0){ne(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&r&&a.isVector2&&r.isVector2||a&&r&&a.isVector3&&r.isVector3||a&&r&&a.isMatrix3&&r.isMatrix3?a.copy(r):this[t]=r}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xn)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case En:e.x=e.x-Math.floor(e.x);break;case xt:e.x=e.x<0?0:1;break;case Tn:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case En:e.y=e.y-Math.floor(e.y);break;case xt:e.y=e.y<0?0:1;break;case Tn:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Xe.DEFAULT_IMAGE=null,Xe.DEFAULT_MAPPING=Xn,Xe.DEFAULT_ANISOTROPY=1;var Un=(Wi=class{constructor(e=0,t=0,r=0,a=1){this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,r=this.y,a=this.z,n=this.w,o=e.elements;return this.x=o[0]*t+o[4]*r+o[8]*a+o[12]*n,this.y=o[1]*t+o[5]*r+o[9]*a+o[13]*n,this.z=o[2]*t+o[6]*r+o[10]*a+o[14]*n,this.w=o[3]*t+o[7]*r+o[11]*a+o[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,n,o=e.elements,s=o[0],l=o[4],c=o[8],d=o[1],m=o[5],u=o[9],h=o[2],f=o[6],_=o[10];if(Math.abs(l-d)<.01&&Math.abs(c-h)<.01&&Math.abs(u-f)<.01){if(Math.abs(l+d)<.1&&Math.abs(c+h)<.1&&Math.abs(u+f)<.1&&Math.abs(s+m+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let g=(s+1)/2,v=(m+1)/2,S=(_+1)/2,C=(l+d)/4,P=(c+h)/4,b=(u+f)/4;return g>v&&g>S?g<.01?(r=0,a=.707106781,n=.707106781):(r=Math.sqrt(g),a=C/r,n=P/r):v>S?v<.01?(r=.707106781,a=0,n=.707106781):(a=Math.sqrt(v),r=C/a,n=b/a):S<.01?(r=.707106781,a=.707106781,n=0):(n=Math.sqrt(S),r=P/n,a=b/n),this.set(r,a,n,t),this}let p=Math.sqrt((f-u)*(f-u)+(c-h)*(c-h)+(d-l)*(d-l));return Math.abs(p)<.001&&(p=1),this.x=(f-u)/p,this.y=(c-h)/p,this.z=(d-l)/p,this.w=Math.acos((s+m+_-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=k(this.x,e.x,t.x),this.y=k(this.y,e.y,t.y),this.z=k(this.z,e.z,t.z),this.w=k(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=k(this.x,e,t),this.y=k(this.y,e,t),this.z=k(this.z,e,t),this.w=k(this.w,e,t),this}clampLength(e,t){let r=this.length();return this.divideScalar(r||1).multiplyScalar(k(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Wi.prototype.isVector4=!0,Wi),j=(Je=class{constructor(e,t,r,a,n,o,s,l,c,d,m,u,h,f,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,n,o,s,l,c,d,m,u,h,f,_,p)}set(e,t,r,a,n,o,s,l,c,d,m,u,h,f,_,p){let g=this.elements;return g[0]=e,g[4]=t,g[8]=r,g[12]=a,g[1]=n,g[5]=o,g[9]=s,g[13]=l,g[2]=c,g[6]=d,g[10]=m,g[14]=u,g[3]=h,g[7]=f,g[11]=_,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Je().fromArray(this.elements)}copy(e){let t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){let t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),r.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,r=e.elements,a=1/Ke.setFromMatrixColumn(e,0).length(),n=1/Ke.setFromMatrixColumn(e,1).length(),o=1/Ke.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*n,t[5]=r[5]*n,t[6]=r[6]*n,t[7]=0,t[8]=r[8]*o,t[9]=r[9]*o,t[10]=r[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,r=e.x,a=e.y,n=e.z,o=Math.cos(r),s=Math.sin(r),l=Math.cos(a),c=Math.sin(a),d=Math.cos(n),m=Math.sin(n);if(e.order==="XYZ"){let u=o*d,h=o*m,f=s*d,_=s*m;t[0]=l*d,t[4]=-l*m,t[8]=c,t[1]=h+f*c,t[5]=u-_*c,t[9]=-s*l,t[2]=_-u*c,t[6]=f+h*c,t[10]=o*l}else if(e.order==="YXZ"){let u=l*d,h=l*m,f=c*d,_=c*m;t[0]=u+_*s,t[4]=f*s-h,t[8]=o*c,t[1]=o*m,t[5]=o*d,t[9]=-s,t[2]=h*s-f,t[6]=_+u*s,t[10]=o*l}else if(e.order==="ZXY"){let u=l*d,h=l*m,f=c*d,_=c*m;t[0]=u-_*s,t[4]=-o*m,t[8]=f+h*s,t[1]=h+f*s,t[5]=o*d,t[9]=_-u*s,t[2]=-o*c,t[6]=s,t[10]=o*l}else if(e.order==="ZYX"){let u=o*d,h=o*m,f=s*d,_=s*m;t[0]=l*d,t[4]=f*c-h,t[8]=u*c+_,t[1]=l*m,t[5]=_*c+u,t[9]=h*c-f,t[2]=-c,t[6]=s*l,t[10]=o*l}else if(e.order==="YZX"){let u=o*l,h=o*c,f=s*l,_=s*c;t[0]=l*d,t[4]=_-u*m,t[8]=f*m+h,t[1]=m,t[5]=o*d,t[9]=-s*d,t[2]=-c*d,t[6]=h*m+f,t[10]=u-_*m}else if(e.order==="XZY"){let u=o*l,h=o*c,f=s*l,_=s*c;t[0]=l*d,t[4]=-m,t[8]=c*d,t[1]=u*m+_,t[5]=o*d,t[9]=h*m-f,t[2]=f*m-h,t[6]=s*d,t[10]=_*m+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ts,e,ns)}lookAt(e,t,r){let a=this.elements;return _e.subVectors(e,t),_e.lengthSq()===0&&(_e.z=1),_e.normalize(),Le.crossVectors(r,_e),Le.lengthSq()===0&&(Math.abs(r.z)===1?_e.x+=1e-4:_e.z+=1e-4,_e.normalize(),Le.crossVectors(r,_e)),Le.normalize(),wt.crossVectors(_e,Le),a[0]=Le.x,a[4]=wt.x,a[8]=_e.x,a[1]=Le.y,a[5]=wt.y,a[9]=_e.y,a[2]=Le.z,a[6]=wt.z,a[10]=_e.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let r=e.elements,a=t.elements,n=this.elements,o=r[0],s=r[4],l=r[8],c=r[12],d=r[1],m=r[5],u=r[9],h=r[13],f=r[2],_=r[6],p=r[10],g=r[14],v=r[3],S=r[7],C=r[11],P=r[15],b=a[0],E=a[4],R=a[8],T=a[12],D=a[1],U=a[5],G=a[9],y=a[13],L=a[2],A=a[6],z=a[10],Q=a[14],J=a[3],ie=a[7],ae=a[11],de=a[15];return n[0]=o*b+s*D+l*L+c*J,n[4]=o*E+s*U+l*A+c*ie,n[8]=o*R+s*G+l*z+c*ae,n[12]=o*T+s*y+l*Q+c*de,n[1]=d*b+m*D+u*L+h*J,n[5]=d*E+m*U+u*A+h*ie,n[9]=d*R+m*G+u*z+h*ae,n[13]=d*T+m*y+u*Q+h*de,n[2]=f*b+_*D+p*L+g*J,n[6]=f*E+_*U+p*A+g*ie,n[10]=f*R+_*G+p*z+g*ae,n[14]=f*T+_*y+p*Q+g*de,n[3]=v*b+S*D+C*L+P*J,n[7]=v*E+S*U+C*A+P*ie,n[11]=v*R+S*G+C*z+P*ae,n[15]=v*T+S*y+C*Q+P*de,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],r=e[4],a=e[8],n=e[12],o=e[1],s=e[5],l=e[9],c=e[13],d=e[2],m=e[6],u=e[10],h=e[14],f=e[3],_=e[7],p=e[11],g=e[15],v=l*h-c*u,S=s*h-c*m,C=s*u-l*m,P=o*h-c*d,b=o*u-l*d,E=o*m-s*d;return t*(_*v-p*S+g*C)-r*(f*v-p*P+g*b)+a*(f*S-_*P+g*E)-n*(f*C-_*b+p*E)}determinantAffine(){let e=this.elements,t=e[0],r=e[4],a=e[8],n=e[1],o=e[5],s=e[9],l=e[2],c=e[6],d=e[10];return t*(o*d-s*c)-r*(n*d-s*l)+a*(n*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){let a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){let e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],d=e[8],m=e[9],u=e[10],h=e[11],f=e[12],_=e[13],p=e[14],g=e[15],v=t*s-r*o,S=t*l-a*o,C=t*c-n*o,P=r*l-a*s,b=r*c-n*s,E=a*c-n*l,R=d*_-m*f,T=d*p-u*f,D=d*g-h*f,U=m*p-u*_,G=m*g-h*_,y=u*g-h*p,L=v*y-S*G+C*U+P*D-b*T+E*R;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/L;return e[0]=(s*y-l*G+c*U)*A,e[1]=(a*G-r*y-n*U)*A,e[2]=(_*E-p*b+g*P)*A,e[3]=(u*b-m*E-h*P)*A,e[4]=(l*D-o*y-c*T)*A,e[5]=(t*y-a*D+n*T)*A,e[6]=(p*C-f*E-g*S)*A,e[7]=(d*E-u*C+h*S)*A,e[8]=(o*G-s*D+c*R)*A,e[9]=(r*D-t*G-n*R)*A,e[10]=(f*b-_*C+g*v)*A,e[11]=(m*C-d*b-h*v)*A,e[12]=(s*T-o*U-l*R)*A,e[13]=(t*U-r*T+a*R)*A,e[14]=(_*S-f*P-p*v)*A,e[15]=(d*P-m*S+u*v)*A,this}scale(e){let t=this.elements,r=e.x,a=e.y,n=e.z;return t[0]*=r,t[4]*=a,t[8]*=n,t[1]*=r,t[5]*=a,t[9]*=n,t[2]*=r,t[6]*=a,t[10]*=n,t[3]*=r,t[7]*=a,t[11]*=n,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let r=Math.cos(t),a=Math.sin(t),n=1-r,o=e.x,s=e.y,l=e.z,c=n*o,d=n*s;return this.set(c*o+r,c*s-a*l,c*l+a*s,0,c*s+a*l,d*s+r,d*l-a*o,0,c*l-a*s,d*l+a*o,n*l*l+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,n,o){return this.set(1,r,n,0,e,1,o,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){let a=this.elements,n=t._x,o=t._y,s=t._z,l=t._w,c=n+n,d=o+o,m=s+s,u=n*c,h=n*d,f=n*m,_=o*d,p=o*m,g=s*m,v=l*c,S=l*d,C=l*m,P=r.x,b=r.y,E=r.z;return a[0]=(1-(_+g))*P,a[1]=(h+C)*P,a[2]=(f-S)*P,a[3]=0,a[4]=(h-C)*b,a[5]=(1-(u+g))*b,a[6]=(p+v)*b,a[7]=0,a[8]=(f+S)*E,a[9]=(p-v)*E,a[10]=(1-(u+_))*E,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){let a=this.elements;e.x=a[12],e.y=a[13],e.z=a[14];let n=this.determinantAffine();if(n===0)return r.set(1,1,1),t.identity(),this;let o=Ke.set(a[0],a[1],a[2]).length(),s=Ke.set(a[4],a[5],a[6]).length(),l=Ke.set(a[8],a[9],a[10]).length();n<0&&(o=-o),be.copy(this);let c=1/o,d=1/s,m=1/l;return be.elements[0]*=c,be.elements[1]*=c,be.elements[2]*=c,be.elements[4]*=d,be.elements[5]*=d,be.elements[6]*=d,be.elements[8]*=m,be.elements[9]*=m,be.elements[10]*=m,t.setFromRotationMatrix(be),r.x=o,r.y=s,r.z=l,this}makePerspective(e,t,r,a,n,o,s=vt,l=!1){let c=this.elements,d=2*n/(t-e),m=2*n/(r-a),u=(t+e)/(t-e),h=(r+a)/(r-a),f,_;if(l)f=n/(o-n),_=o*n/(o-n);else if(s===vt)f=-(o+n)/(o-n),_=-2*o*n/(o-n);else if(s===Dn)f=-o/(o-n),_=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+s);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=m,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,r,a,n,o,s=vt,l=!1){let c=this.elements,d=2/(t-e),m=2/(r-a),u=-(t+e)/(t-e),h=-(r+a)/(r-a),f,_;if(l)f=1/(o-n),_=o/(o-n);else if(s===vt)f=-2/(o-n),_=-(o+n)/(o-n);else if(s===Dn)f=-1/(o-n),_=-n/(o-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+s);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=m,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=f,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){let r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}},Je.prototype.isMatrix4=!0,Je),Ke=new w,be=new j,ts=new w(0,0,0),ns=new w(1,1,1),Le=new w,wt=new w,_e=new w,ai=new j,oi=new X,le=class So{constructor(e=0,t=0,r=0,a=So.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){let a=e.elements,n=a[0],o=a[4],s=a[8],l=a[1],c=a[5],d=a[9],m=a[2],u=a[6],h=a[10];switch(t){case"XYZ":this._y=Math.asin(k(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-k(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(s,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-m,n),this._z=0);break;case"ZXY":this._x=Math.asin(k(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-m,h),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-k(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(u,h),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(k(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-m,n)):(this._x=0,this._y=Math.atan2(s,h));break;case"XZY":this._z=Math.asin(-k(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(s,n)):(this._x=Math.atan2(-d,h),this._y=0);break;default:ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return ai.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ai,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return oi.setFromEuler(this),this.setFromQuaternion(oi,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};le.DEFAULT_ORDER="XYZ";var Vt=class{constructor(){this.mask=1}set(i){this.mask=(1<<i|0)>>>0}enable(i){this.mask|=1<<i|0}enableAll(){this.mask=-1}toggle(i){this.mask^=1<<i|0}disable(i){this.mask&=~(1<<i|0)}disableAll(){this.mask=0}test(i){return(this.mask&i.mask)!==0}isEnabled(i){return(this.mask&(1<<i|0))!==0}},is=0,li=new w,Qe=new X,Ce=new j,At=new w,pt=new w,ss=new w,rs=new X,ci=new w(1,0,0),hi=new w(0,1,0),ui=new w(0,0,1),di={type:"added"},as={type:"removed"},je={type:"childadded",child:null},hn={type:"childremoved",child:null},Fe=class vo extends We{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:is++}),this.uuid=Et(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vo.DEFAULT_UP.clone();let e=new w,t=new le,r=new X,a=new w(1,1,1);function n(){r.setFromEuler(t,!1)}function o(){t.setFromQuaternion(r,void 0,!1)}t._onChange(n),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new j},normalMatrix:{value:new B}}),this.matrix=new j,this.matrixWorld=new j,this.matrixAutoUpdate=vo.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vo.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vt,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qe.setFromAxisAngle(e,t),this.quaternion.multiply(Qe),this}rotateOnWorldAxis(e,t){return Qe.setFromAxisAngle(e,t),this.quaternion.premultiply(Qe),this}rotateX(e){return this.rotateOnAxis(ci,e)}rotateY(e){return this.rotateOnAxis(hi,e)}rotateZ(e){return this.rotateOnAxis(ui,e)}translateOnAxis(e,t){return li.copy(e).applyQuaternion(this.quaternion),this.position.add(li.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ci,e)}translateY(e){return this.translateOnAxis(hi,e)}translateZ(e){return this.translateOnAxis(ui,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ce.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?At.copy(e):At.set(e,t,r);let a=this.parent;this.updateWorldMatrix(!0,!1),pt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ce.lookAt(pt,At,this.up):Ce.lookAt(At,pt,this.up),this.quaternion.setFromRotationMatrix(Ce),a&&(Ce.extractRotation(a.matrixWorld),Qe.setFromRotationMatrix(Ce),this.quaternion.premultiply(Qe.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(di),je.child=e,this.dispatchEvent(je),je.child=null):$("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(as),hn.child=e,this.dispatchEvent(hn),hn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ce.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ce.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ce),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(di),je.child=e,this.dispatchEvent(je),je.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){let n=this.children[r].getObjectByProperty(e,t);if(n!==void 0)return n}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);let a=this.children;for(let n=0,o=a.length;n<o;n++)a[n].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pt,e,ss),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pt,rs,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,r=e.y,a=e.z,n=this.matrix.elements;n[12]+=t-n[0]*t-n[4]*r-n[8]*a,n[13]+=r-n[1]*t-n[5]*r-n[9]*a,n[14]+=a-n[2]*t-n[6]*r-n[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t,r=!1){let a=this.parent;if(e===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||r)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,r=!0),t===!0){let n=this.children;for(let o=0,s=n.length;o<s;o++)n[o].updateWorldMatrix(!1,!0,r)}}toJSON(e){let t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(s=>({...s,boundingBox:s.boundingBox?s.boundingBox.toJSON():void 0,boundingSphere:s.boundingSphere?s.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(s=>({...s})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function n(s,l){return s[l.uuid]===void 0&&(s[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(e.geometries,this.geometry);let s=this.geometry.parameters;if(s!==void 0&&s.shapes!==void 0){let l=s.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let m=l[c];n(e.shapes,m)}else n(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let s=[];for(let l=0,c=this.material.length;l<c;l++)s.push(n(e.materials,this.material[l]));a.material=s}else a.material=n(e.materials,this.material);if(this.children.length>0){a.children=[];for(let s=0;s<this.children.length;s++)a.children.push(this.children[s].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let s=0;s<this.animations.length;s++){let l=this.animations[s];a.animations.push(n(e.animations,l))}}if(t){let s=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),m=o(e.shapes),u=o(e.skeletons),h=o(e.animations),f=o(e.nodes);s.length>0&&(r.geometries=s),l.length>0&&(r.materials=l),c.length>0&&(r.textures=c),d.length>0&&(r.images=d),m.length>0&&(r.shapes=m),u.length>0&&(r.skeletons=u),h.length>0&&(r.animations=h),f.length>0&&(r.nodes=f)}return r.object=a,r;function o(s){let l=[];for(let c in s){let d=s[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){let a=e.children[r];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Fe.DEFAULT_UP=new w(0,1,0),Fe.DEFAULT_MATRIX_AUTO_UPDATE=!0,Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ri={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},De={h:0,s:0,l:0},Rt={h:0,s:0,l:0};function un(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Y=class{constructor(i,e,t){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(i,e,t)}set(i,e,t){if(e===void 0&&t===void 0){let r=i;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(i,e,t);return this}setScalar(i){return this.r=i,this.g=i,this.b=i,this}setHex(i,e=Me){return i=Math.floor(i),this.r=(i>>16&255)/255,this.g=(i>>8&255)/255,this.b=(i&255)/255,Se.colorSpaceToWorking(this,e),this}setRGB(i,e,t,r=Se.workingColorSpace){return this.r=i,this.g=e,this.b=t,Se.colorSpaceToWorking(this,r),this}setHSL(i,e,t,r=Se.workingColorSpace){if(i=Ki(i,1),e=k(e,0,1),t=k(t,0,1),e===0)this.r=this.g=this.b=t;else{let a=t<=.5?t*(1+e):t+e-t*e,n=2*t-a;this.r=un(n,a,i+1/3),this.g=un(n,a,i),this.b=un(n,a,i-1/3)}return Se.colorSpaceToWorking(this,r),this}setStyle(i,e=Me){function t(a){a!==void 0&&parseFloat(a)<1&&ne("Color: Alpha component of "+i+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(i)){let a,n=r[1],o=r[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return t(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return t(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return t(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:ne("Color: Unknown color model "+i)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(i)){let a=r[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(n===6)return this.setHex(parseInt(a,16),e);ne("Color: Invalid hex color "+i)}else if(i&&i.length>0)return this.setColorName(i,e);return this}setColorName(i,e=Me){let t=Ri[i.toLowerCase()];return t!==void 0?this.setHex(t,e):ne("Color: Unknown color "+i),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(i){return this.r=i.r,this.g=i.g,this.b=i.b,this}copySRGBToLinear(i){return this.r=Pe(i.r),this.g=Pe(i.g),this.b=Pe(i.b),this}copyLinearToSRGB(i){return this.r=at(i.r),this.g=at(i.g),this.b=at(i.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(i=Me){return Se.workingToColorSpace(he.copy(this),i),Math.round(k(he.r*255,0,255))*65536+Math.round(k(he.g*255,0,255))*256+Math.round(k(he.b*255,0,255))}getHexString(i=Me){return("000000"+this.getHex(i).toString(16)).slice(-6)}getHSL(i,e=Se.workingColorSpace){Se.workingToColorSpace(he.copy(this),e);let t=he.r,r=he.g,a=he.b,n=Math.max(t,r,a),o=Math.min(t,r,a),s,l,c=(o+n)/2;if(o===n)s=0,l=0;else{let d=n-o;switch(l=c<=.5?d/(n+o):d/(2-n-o),n){case t:s=(r-a)/d+(r<a?6:0);break;case r:s=(a-t)/d+2;break;case a:s=(t-r)/d+4;break}s/=6}return i.h=s,i.s=l,i.l=c,i}getRGB(i,e=Se.workingColorSpace){return Se.workingToColorSpace(he.copy(this),e),i.r=he.r,i.g=he.g,i.b=he.b,i}getStyle(i=Me){Se.workingToColorSpace(he.copy(this),i);let e=he.r,t=he.g,r=he.b;return i!==Me?`color(${i} ${e.toFixed(3)} ${t.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(t*255)},${Math.round(r*255)})`}offsetHSL(i,e,t){return this.getHSL(De),this.setHSL(De.h+i,De.s+e,De.l+t)}add(i){return this.r+=i.r,this.g+=i.g,this.b+=i.b,this}addColors(i,e){return this.r=i.r+e.r,this.g=i.g+e.g,this.b=i.b+e.b,this}addScalar(i){return this.r+=i,this.g+=i,this.b+=i,this}sub(i){return this.r=Math.max(0,this.r-i.r),this.g=Math.max(0,this.g-i.g),this.b=Math.max(0,this.b-i.b),this}multiply(i){return this.r*=i.r,this.g*=i.g,this.b*=i.b,this}multiplyScalar(i){return this.r*=i,this.g*=i,this.b*=i,this}lerp(i,e){return this.r+=(i.r-this.r)*e,this.g+=(i.g-this.g)*e,this.b+=(i.b-this.b)*e,this}lerpColors(i,e,t){return this.r=i.r+(e.r-i.r)*t,this.g=i.g+(e.g-i.g)*t,this.b=i.b+(e.b-i.b)*t,this}lerpHSL(i,e){this.getHSL(De),i.getHSL(Rt);let t=rn(De.h,Rt.h,e),r=rn(De.s,Rt.s,e),a=rn(De.l,Rt.l,e);return this.setHSL(t,r,a),this}setFromVector3(i){return this.r=i.x,this.g=i.y,this.b=i.z,this}applyMatrix3(i){let e=this.r,t=this.g,r=this.b,a=i.elements;return this.r=a[0]*e+a[3]*t+a[6]*r,this.g=a[1]*e+a[4]*t+a[7]*r,this.b=a[2]*e+a[5]*t+a[8]*r,this}equals(i){return i.r===this.r&&i.g===this.g&&i.b===this.b}fromArray(i,e=0){return this.r=i[e],this.g=i[e+1],this.b=i[e+2],this}toArray(i=[],e=0){return i[e]=this.r,i[e+1]=this.g,i[e+2]=this.b,i}fromBufferAttribute(i,e){return this.r=i.getX(e),this.g=i.getY(e),this.b=i.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},he=new Y;Y.NAMES=Ri;var Oe=class{constructor(i=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=i,this.max=e}set(i,e){return this.min.copy(i),this.max.copy(e),this}setFromArray(i){this.makeEmpty();for(let e=0,t=i.length;e<t;e+=3)this.expandByPoint(Ee.fromArray(i,e));return this}setFromBufferAttribute(i){this.makeEmpty();for(let e=0,t=i.count;e<t;e++)this.expandByPoint(Ee.fromBufferAttribute(i,e));return this}setFromPoints(i){this.makeEmpty();for(let e=0,t=i.length;e<t;e++)this.expandByPoint(i[e]);return this}setFromCenterAndSize(i,e){let t=Ee.copy(e).multiplyScalar(.5);return this.min.copy(i).sub(t),this.max.copy(i).add(t),this}setFromObject(i,e=!1){return this.makeEmpty(),this.expandByObject(i,e)}clone(){return new this.constructor().copy(this)}copy(i){return this.min.copy(i.min),this.max.copy(i.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(i){return this.isEmpty()?i.set(0,0,0):i.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(i){return this.isEmpty()?i.set(0,0,0):i.subVectors(this.max,this.min)}expandByPoint(i){return this.min.min(i),this.max.max(i),this}expandByVector(i){return this.min.sub(i),this.max.add(i),this}expandByScalar(i){return this.min.addScalar(-i),this.max.addScalar(i),this}expandByObject(i,e=!1){i.updateWorldMatrix(!1,!1);let t=i.geometry;if(t!==void 0){let a=t.getAttribute("position");if(e===!0&&a!==void 0&&i.isInstancedMesh!==!0)for(let n=0,o=a.count;n<o;n++)i.isMesh===!0?i.getVertexPosition(n,Ee):Ee.fromBufferAttribute(a,n),Ee.applyMatrix4(i.matrixWorld),this.expandByPoint(Ee);else i.boundingBox!==void 0?(i.boundingBox===null&&i.computeBoundingBox(),Ct.copy(i.boundingBox)):(t.boundingBox===null&&t.computeBoundingBox(),Ct.copy(t.boundingBox)),Ct.applyMatrix4(i.matrixWorld),this.union(Ct)}let r=i.children;for(let a=0,n=r.length;a<n;a++)this.expandByObject(r[a],e);return this}containsPoint(i){return i.x>=this.min.x&&i.x<=this.max.x&&i.y>=this.min.y&&i.y<=this.max.y&&i.z>=this.min.z&&i.z<=this.max.z}containsBox(i){return this.min.x<=i.min.x&&i.max.x<=this.max.x&&this.min.y<=i.min.y&&i.max.y<=this.max.y&&this.min.z<=i.min.z&&i.max.z<=this.max.z}getParameter(i,e){return e.set((i.x-this.min.x)/(this.max.x-this.min.x),(i.y-this.min.y)/(this.max.y-this.min.y),(i.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(i){return i.max.x>=this.min.x&&i.min.x<=this.max.x&&i.max.y>=this.min.y&&i.min.y<=this.max.y&&i.max.z>=this.min.z&&i.min.z<=this.max.z}intersectsSphere(i){return this.clampPoint(i.center,Ee),Ee.distanceToSquared(i.center)<=i.radius*i.radius}intersectsPlane(i){let e,t;return i.normal.x>0?(e=i.normal.x*this.min.x,t=i.normal.x*this.max.x):(e=i.normal.x*this.max.x,t=i.normal.x*this.min.x),i.normal.y>0?(e+=i.normal.y*this.min.y,t+=i.normal.y*this.max.y):(e+=i.normal.y*this.max.y,t+=i.normal.y*this.min.y),i.normal.z>0?(e+=i.normal.z*this.min.z,t+=i.normal.z*this.max.z):(e+=i.normal.z*this.max.z,t+=i.normal.z*this.min.z),e<=-i.constant&&t>=-i.constant}intersectsTriangle(i){if(this.isEmpty())return!1;this.getCenter(mt),It.subVectors(this.max,mt),et.subVectors(i.a,mt),tt.subVectors(i.b,mt),nt.subVectors(i.c,mt),Ne.subVectors(tt,et),Ue.subVectors(nt,tt),Ge.subVectors(et,nt);let e=[0,-Ne.z,Ne.y,0,-Ue.z,Ue.y,0,-Ge.z,Ge.y,Ne.z,0,-Ne.x,Ue.z,0,-Ue.x,Ge.z,0,-Ge.x,-Ne.y,Ne.x,0,-Ue.y,Ue.x,0,-Ge.y,Ge.x,0];return!dn(e,et,tt,nt,It)||(e=[1,0,0,0,1,0,0,0,1],!dn(e,et,tt,nt,It))?!1:(Pt.crossVectors(Ne,Ue),e=[Pt.x,Pt.y,Pt.z],dn(e,et,tt,nt,It))}clampPoint(i,e){return e.copy(i).clamp(this.min,this.max)}distanceToPoint(i){return this.clampPoint(i,Ee).distanceTo(i)}getBoundingSphere(i){return this.isEmpty()?i.makeEmpty():(this.getCenter(i.center),i.radius=this.getSize(Ee).length()*.5),i}intersect(i){return this.min.max(i.min),this.max.min(i.max),this.isEmpty()&&this.makeEmpty(),this}union(i){return this.min.min(i.min),this.max.max(i.max),this}applyMatrix4(i){return this.isEmpty()?this:(Ie[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(i),Ie[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(i),Ie[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(i),Ie[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(i),Ie[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(i),Ie[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(i),Ie[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(i),Ie[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(i),this.setFromPoints(Ie),this)}translate(i){return this.min.add(i),this.max.add(i),this}equals(i){return i.min.equals(this.min)&&i.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(i){return this.min.fromArray(i.min),this.max.fromArray(i.max),this}},Ie=[new w,new w,new w,new w,new w,new w,new w,new w],Ee=new w,Ct=new Oe,et=new w,tt=new w,nt=new w,Ne=new w,Ue=new w,Ge=new w,mt=new w,It=new w,Pt=new w,He=new w;function dn(i,e,t,r,a){for(let n=0,o=i.length-3;n<=o;n+=3){He.fromArray(i,n);let s=a.x*Math.abs(He.x)+a.y*Math.abs(He.y)+a.z*Math.abs(He.z),l=e.dot(He),c=t.dot(He),d=r.dot(He);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>s)return!1}return!0}var te=new w,Lt=new fe,os=0,ee=class extends We{constructor(i,e,t=!1){if(super(),Array.isArray(i))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:os++}),this.name="",this.array=i,this.itemSize=e,this.count=i!==void 0?i.length/e:0,this.normalized=t,this.usage=wi,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(i){i===!0&&this.version++}setUsage(i){return this.usage=i,this}addUpdateRange(i,e){this.updateRanges.push({start:i,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(i){return this.name=i.name,this.array=new i.array.constructor(i.array),this.itemSize=i.itemSize,this.count=i.count,this.normalized=i.normalized,this.usage=i.usage,this.gpuType=i.gpuType,this}copyAt(i,e,t){i*=this.itemSize,t*=e.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[i+r]=e.array[t+r];return this}copyArray(i){return this.array.set(i),this}applyMatrix3(i){if(this.itemSize===2)for(let e=0,t=this.count;e<t;e++)Lt.fromBufferAttribute(this,e),Lt.applyMatrix3(i),this.setXY(e,Lt.x,Lt.y);else if(this.itemSize===3)for(let e=0,t=this.count;e<t;e++)te.fromBufferAttribute(this,e),te.applyMatrix3(i),this.setXYZ(e,te.x,te.y,te.z);return this}applyMatrix4(i){for(let e=0,t=this.count;e<t;e++)te.fromBufferAttribute(this,e),te.applyMatrix4(i),this.setXYZ(e,te.x,te.y,te.z);return this}applyNormalMatrix(i){for(let e=0,t=this.count;e<t;e++)te.fromBufferAttribute(this,e),te.applyNormalMatrix(i),this.setXYZ(e,te.x,te.y,te.z);return this}transformDirection(i){for(let e=0,t=this.count;e<t;e++)te.fromBufferAttribute(this,e),te.transformDirection(i),this.setXYZ(e,te.x,te.y,te.z);return this}set(i,e=0){return this.array.set(i,e),this}getComponent(i,e){let t=this.array[i*this.itemSize+e];return this.normalized&&(t=ft(t,this.array)),t}setComponent(i,e,t){return this.normalized&&(t=me(t,this.array)),this.array[i*this.itemSize+e]=t,this}getX(i){let e=this.array[i*this.itemSize];return this.normalized&&(e=ft(e,this.array)),e}setX(i,e){return this.normalized&&(e=me(e,this.array)),this.array[i*this.itemSize]=e,this}getY(i){let e=this.array[i*this.itemSize+1];return this.normalized&&(e=ft(e,this.array)),e}setY(i,e){return this.normalized&&(e=me(e,this.array)),this.array[i*this.itemSize+1]=e,this}getZ(i){let e=this.array[i*this.itemSize+2];return this.normalized&&(e=ft(e,this.array)),e}setZ(i,e){return this.normalized&&(e=me(e,this.array)),this.array[i*this.itemSize+2]=e,this}getW(i){let e=this.array[i*this.itemSize+3];return this.normalized&&(e=ft(e,this.array)),e}setW(i,e){return this.normalized&&(e=me(e,this.array)),this.array[i*this.itemSize+3]=e,this}setXY(i,e,t){return i*=this.itemSize,this.normalized&&(e=me(e,this.array),t=me(t,this.array)),this.array[i+0]=e,this.array[i+1]=t,this}setXYZ(i,e,t,r){return i*=this.itemSize,this.normalized&&(e=me(e,this.array),t=me(t,this.array),r=me(r,this.array)),this.array[i+0]=e,this.array[i+1]=t,this.array[i+2]=r,this}setXYZW(i,e,t,r,a){return i*=this.itemSize,this.normalized&&(e=me(e,this.array),t=me(t,this.array),r=me(r,this.array),a=me(a,this.array)),this.array[i+0]=e,this.array[i+1]=t,this.array[i+2]=r,this.array[i+3]=a,this}onUpload(i){return this.onUploadCallback=i,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let i={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return i.name=this.name,i.usage=this.usage,i.gpuType=this.gpuType,i}dispose(){this.dispatchEvent({type:"dispose"})}},kt=class extends ee{constructor(i,e,t){super(new Uint16Array(i),e,t)}},zt=class extends ee{constructor(i,e,t){super(new Uint32Array(i),e,t)}},ot=class extends ee{constructor(i,e,t){super(new Float32Array(i),e,t)}},ls=new Oe,gt=new w,fn=new w,Gt=class{constructor(i=new w,e=-1){this.isSphere=!0,this.center=i,this.radius=e}set(i,e){return this.center.copy(i),this.radius=e,this}setFromPoints(i,e){let t=this.center;e!==void 0?t.copy(e):ls.setFromPoints(i).getCenter(t);let r=0;for(let a=0,n=i.length;a<n;a++)r=Math.max(r,t.distanceToSquared(i[a]));return this.radius=Math.sqrt(r),this}copy(i){return this.center.copy(i.center),this.radius=i.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(i){return i.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(i){return i.distanceTo(this.center)-this.radius}intersectsSphere(i){let e=this.radius+i.radius;return i.center.distanceToSquared(this.center)<=e*e}intersectsBox(i){return i.intersectsSphere(this)}intersectsPlane(i){return Math.abs(i.distanceToPoint(this.center))<=this.radius}clampPoint(i,e){let t=this.center.distanceToSquared(i);return e.copy(i),t>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(i){return this.isEmpty()?(i.makeEmpty(),i):(i.set(this.center,this.center),i.expandByScalar(this.radius),i)}applyMatrix4(i){return this.center.applyMatrix4(i),this.radius=this.radius*i.getMaxScaleOnAxis(),this}translate(i){return this.center.add(i),this}expandByPoint(i){if(this.isEmpty())return this.center.copy(i),this.radius=0,this;gt.subVectors(i,this.center);let e=gt.lengthSq();if(e>this.radius*this.radius){let t=Math.sqrt(e),r=(t-this.radius)*.5;this.center.addScaledVector(gt,r/t),this.radius+=r}return this}union(i){return i.isEmpty()?this:this.isEmpty()?(this.copy(i),this):(this.center.equals(i.center)===!0?this.radius=Math.max(this.radius,i.radius):(fn.subVectors(i.center,this.center).setLength(i.radius),this.expandByPoint(gt.copy(i.center).add(fn)),this.expandByPoint(gt.copy(i.center).sub(fn))),this)}equals(i){return i.center.equals(this.center)&&i.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(i){return this.radius=i.radius,this.center.fromArray(i.center),this}},cs=0,ye=new j,pn=new Fe,it=new w,xe=new Oe,_t=new Oe,oe=new w,St=class Mo extends We{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cs++}),this.uuid=Et(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yi(e)?zt:kt)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let r=this.attributes.normal;if(r!==void 0){let n=new B().getNormalMatrix(e);r.applyNormalMatrix(n),r.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ye.makeRotationFromQuaternion(e),this.applyMatrix4(ye),this}rotateX(e){return ye.makeRotationX(e),this.applyMatrix4(ye),this}rotateY(e){return ye.makeRotationY(e),this.applyMatrix4(ye),this}rotateZ(e){return ye.makeRotationZ(e),this.applyMatrix4(ye),this}translate(e,t,r){return ye.makeTranslation(e,t,r),this.applyMatrix4(ye),this}scale(e,t,r){return ye.makeScale(e,t,r),this.applyMatrix4(ye),this}lookAt(e){return pn.lookAt(e),pn.updateMatrix(),this.applyMatrix4(pn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(it).negate(),this.translate(it.x,it.y,it.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let r=[];for(let a=0,n=e.length;a<n;a++){let o=e[a];r.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ot(r,3))}else{let r=Math.min(e.length,t.count);for(let a=0;a<r;a++){let n=e[a];t.setXYZ(a,n.x,n.y,n.z||0)}e.length>t.count&&ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oe);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let n=t[r];xe.setFromBufferAttribute(n),this.morphTargetsRelative?(oe.addVectors(this.boundingBox.min,xe.min),this.boundingBox.expandByPoint(oe),oe.addVectors(this.boundingBox.max,xe.max),this.boundingBox.expandByPoint(oe)):(this.boundingBox.expandByPoint(xe.min),this.boundingBox.expandByPoint(xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){let r=this.boundingSphere.center;if(xe.setFromBufferAttribute(e),t)for(let n=0,o=t.length;n<o;n++){let s=t[n];_t.setFromBufferAttribute(s),this.morphTargetsRelative?(oe.addVectors(xe.min,_t.min),xe.expandByPoint(oe),oe.addVectors(xe.max,_t.max),xe.expandByPoint(oe)):(xe.expandByPoint(_t.min),xe.expandByPoint(_t.max))}xe.getCenter(r);let a=0;for(let n=0,o=e.count;n<o;n++)oe.fromBufferAttribute(e,n),a=Math.max(a,r.distanceToSquared(oe));if(t)for(let n=0,o=t.length;n<o;n++){let s=t[n],l=this.morphTargetsRelative;for(let c=0,d=s.count;c<d;c++)oe.fromBufferAttribute(s,c),l&&(it.fromBufferAttribute(e,c),oe.add(it)),a=Math.max(a,r.distanceToSquared(oe))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&$('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let r=t.position,a=t.normal,n=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==r.count)&&(o=new ee(new Float32Array(4*r.count),4),this.setAttribute("tangent",o));let s=[],l=[];for(let R=0;R<r.count;R++)s[R]=new w,l[R]=new w;let c=new w,d=new w,m=new w,u=new fe,h=new fe,f=new fe,_=new w,p=new w;function g(R,T,D){c.fromBufferAttribute(r,R),d.fromBufferAttribute(r,T),m.fromBufferAttribute(r,D),u.fromBufferAttribute(n,R),h.fromBufferAttribute(n,T),f.fromBufferAttribute(n,D),d.sub(c),m.sub(c),h.sub(u),f.sub(u);let U=1/(h.x*f.y-f.x*h.y);isFinite(U)&&(_.copy(d).multiplyScalar(f.y).addScaledVector(m,-h.y).multiplyScalar(U),p.copy(m).multiplyScalar(h.x).addScaledVector(d,-f.x).multiplyScalar(U),s[R].add(_),s[T].add(_),s[D].add(_),l[R].add(p),l[T].add(p),l[D].add(p))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,T=v.length;R<T;++R){let D=v[R],U=D.start,G=D.count;for(let y=U,L=U+G;y<L;y+=3)g(e.getX(y+0),e.getX(y+1),e.getX(y+2))}let S=new w,C=new w,P=new w,b=new w;function E(R){P.fromBufferAttribute(a,R),b.copy(P);let T=s[R];S.copy(T),S.sub(P.multiplyScalar(P.dot(T))).normalize(),C.crossVectors(b,T);let D=C.dot(l[R])<0?-1:1;o.setXYZW(R,S.x,S.y,S.z,D)}for(let R=0,T=v.length;R<T;++R){let D=v[R],U=D.start,G=D.count;for(let y=U,L=U+G;y<L;y+=3)E(e.getX(y+0)),E(e.getX(y+1)),E(e.getX(y+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0||r.count!==t.count)r=new ee(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let u=0,h=r.count;u<h;u++)r.setXYZ(u,0,0,0);let a=new w,n=new w,o=new w,s=new w,l=new w,c=new w,d=new w,m=new w;if(e)for(let u=0,h=e.count;u<h;u+=3){let f=e.getX(u+0),_=e.getX(u+1),p=e.getX(u+2);a.fromBufferAttribute(t,f),n.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),d.subVectors(o,n),m.subVectors(a,n),d.cross(m),s.fromBufferAttribute(r,f),l.fromBufferAttribute(r,_),c.fromBufferAttribute(r,p),s.add(d),l.add(d),c.add(d),r.setXYZ(f,s.x,s.y,s.z),r.setXYZ(_,l.x,l.y,l.z),r.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,h=t.count;u<h;u+=3)a.fromBufferAttribute(t,u+0),n.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),d.subVectors(o,n),m.subVectors(a,n),d.cross(m),r.setXYZ(u+0,d.x,d.y,d.z),r.setXYZ(u+1,d.x,d.y,d.z),r.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)oe.fromBufferAttribute(e,t),oe.normalize(),e.setXYZ(t,oe.x,oe.y,oe.z)}toNonIndexed(){function e(s,l){let c=s.array,d=s.itemSize,m=s.normalized,u=new c.constructor(l.length*d),h=0,f=0;for(let _=0,p=l.length;_<p;_++){s.isInterleavedBufferAttribute?h=l[_]*s.data.stride+s.offset:h=l[_]*d;for(let g=0;g<d;g++)u[f++]=c[h++]}return new ee(u,d,m)}if(this.index===null)return ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new Mo,r=this.index.array,a=this.attributes;for(let s in a){let l=a[s],c=e(l,r);t.setAttribute(s,c)}let n=this.morphAttributes;for(let s in n){let l=[],c=n[s];for(let d=0,m=c.length;d<m;d++){let u=c[d],h=e(u,r);l.push(h)}t.morphAttributes[s]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let s=0,l=o.length;s<l;s++){let c=o[s];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let r=this.attributes;for(let l in r){let c=r[l];e.data.attributes[l]=c.toJSON(e.data)}let a={},n=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let m=0,u=c.length;m<u;m++){let h=c[m];d.push(h.toJSON(e.data))}d.length>0&&(a[l]=d,n=!0)}n&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let s=this.boundingSphere;return s!==null&&(e.data.boundingSphere=s.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let r=e.index;r!==null&&this.setIndex(r.clone());let a=e.attributes;for(let c in a){let d=a[c];this.setAttribute(c,d.clone(t))}let n=e.morphAttributes;for(let c in n){let d=[],m=n[c];for(let u=0,h=m.length;u<h;u++)d.push(m[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,d=o.length;c<d;c++){let m=o[c];this.addGroup(m.start,m.count,m.materialIndex)}let s=e.boundingBox;s!==null&&(this.boundingBox=s.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},lt=class extends Fe{constructor(){super(),this.isBone=!0,this.type="Bone"}},Ht=class extends Xe{constructor(i=null,e=1,t=1,r,a,n,o,s,l=wn,c=wn,d,m){super(null,n,o,s,l,c,r,a,d,m),this.isDataTexture=!0,this.image={data:i,width:e,height:t},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},fi=new j,hs=new j,Mt=class bo{constructor(e=[],t=[]){this.uuid=Et(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ne("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let r=0,a=this.bones.length;r<a;r++)this.boneInverses.push(new j)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let r=new j;this.bones[e]&&r.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(r)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let r=this.bones[e];r&&r.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let r=this.bones[e];r&&(r.parent&&r.parent.isBone?(r.matrix.copy(r.parent.matrixWorld).invert(),r.matrix.multiply(r.matrixWorld)):r.matrix.copy(r.matrixWorld),r.matrix.decompose(r.position,r.quaternion,r.scale))}}update(){let e=this.bones,t=this.boneInverses,r=this.boneMatrices,a=this.boneTexture;for(let n=0,o=e.length;n<o;n++){let s=e[n]?e[n].matrixWorld:hs;fi.multiplyMatrices(s,t[n]),fi.toArray(r,n*16)}a!==null&&(a.needsUpdate=!0)}clone(){return new bo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let r=new Ht(t,e,e,Zn,Yn);return r.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=r,this}getBoneByName(e){for(let t=0,r=this.bones.length;t<r;t++){let a=this.bones[t];if(a.name===e)return a}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let r=0,a=e.bones.length;r<a;r++){let n=e.bones[r],o=t[n];o===void 0&&(ne("Skeleton: No bone found with UUID:",n),o=new lt),this.bones.push(o),this.boneInverses.push(new j().fromArray(e.boneInverses[r]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,r=this.boneInverses;for(let a=0,n=t.length;a<n;a++){let o=t[a];e.bones.push(o.uuid);let s=r[a];e.boneInverses.push(s.toArray())}return e}};function Ci(i){let e={};for(let t in i){e[t]={};for(let r in i[t]){let a=i[t][r];if(pi(a))a.isRenderTargetTexture?(ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone();else if(Array.isArray(a))if(pi(a[0])){let n=[];for(let o=0,s=a.length;o<s;o++)n[o]=a[o].clone();e[t][r]=n}else e[t][r]=a.slice();else e[t][r]=a}}return e}function pe(i){let e={};for(let t=0;t<i.length;t++){let r=Ci(i[t]);for(let a in r)e[a]=r[a]}return e}function pi(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function st(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function mn(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Be=class{constructor(i,e,t,r){this.parameterPositions=i,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new e.constructor(t),this.sampleValues=e,this.valueSize=t,this.settings=null,this.DefaultSettings_={}}evaluate(i){let e=this.parameterPositions,t=this._cachedIndex,r=e[t],a=e[t-1];i:{e:{let n;t:{r:if(!(i<r)){for(let o=t+2;;){if(r===void 0){if(i<a)break r;return t=e.length,this._cachedIndex=t,this.copySampleValue_(t-1)}if(t===o)break;if(a=r,r=e[++t],i<r)break e}n=e.length;break t}if(!(i>=a)){let o=e[1];i<o&&(t=2,a=o);for(let s=t-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(t===s)break;if(r=a,a=e[--t-1],i>=a)break e}n=t,t=0;break t}break i}for(;t<n;){let o=t+n>>>1;i<e[o]?n=o:t=o+1}if(r=e[t],a=e[t-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return t=e.length,this._cachedIndex=t,this.copySampleValue_(t-1)}this._cachedIndex=t,this.intervalChanged_(t,a,r)}return this.interpolate_(t,a,i,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(i){let e=this.resultBuffer,t=this.sampleValues,r=this.valueSize,a=i*r;for(let n=0;n!==r;++n)e[n]=t[a+n];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Wt=class extends Be{constructor(i,e,t,r){super(i,e,t,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Rn,endingEnd:Rn}}intervalChanged_(i,e,t){let r=this.parameterPositions,a=i-2,n=i+1,o=r[a],s=r[n];if(o===void 0)switch(this.getSettings_().endingStart){case Cn:a=i,o=2*e-t;break;case In:a=r.length-2,o=e+r[a]-r[a+1];break;default:a=i,o=t}if(s===void 0)switch(this.getSettings_().endingEnd){case Cn:n=i,s=2*t-e;break;case In:n=1,s=t+r[1]-r[0];break;default:n=i-1,s=e}let l=(t-e)*.5,c=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(s-t),this._offsetPrev=a*c,this._offsetNext=n*c}interpolate_(i,e,t,r){let a=this.resultBuffer,n=this.sampleValues,o=this.valueSize,s=i*o,l=s-o,c=this._offsetPrev,d=this._offsetNext,m=this._weightPrev,u=this._weightNext,h=(t-e)/(r-e),f=h*h,_=f*h,p=-m*_+2*m*f-m*h,g=(1+m)*_+(-1.5-2*m)*f+(-.5+m)*h+1,v=(-1-u)*_+(1.5+u)*f+.5*h,S=u*_-u*f;for(let C=0;C!==o;++C)a[C]=p*n[c+C]+g*n[l+C]+v*n[s+C]+S*n[d+C];return a}},Xt=class extends Be{constructor(i,e,t,r){super(i,e,t,r)}interpolate_(i,e,t,r){let a=this.resultBuffer,n=this.sampleValues,o=this.valueSize,s=i*o,l=s-o,c=(t-e)/(r-e),d=1-c;for(let m=0;m!==o;++m)a[m]=n[l+m]*d+n[s+m]*c;return a}},qt=class extends Be{constructor(i,e,t,r){super(i,e,t,r)}interpolate_(i){return this.copySampleValue_(i-1)}},Yt=class extends Be{interpolate_(i,e,t,r){let a=this.resultBuffer,n=this.sampleValues,o=this.valueSize,s=i*o,l=s-o,c=this.inTangents,d=this.outTangents;if(!c||!d){let h=(t-e)/(r-e),f=1-h;for(let _=0;_!==o;++_)a[_]=n[l+_]*f+n[s+_]*h;return a}let m=o*2,u=i-1;for(let h=0;h!==o;++h){let f=n[l+h],_=n[s+h],p=u*m+h*2,g=d[p],v=d[p+1],S=i*m+h*2,C=c[S],P=c[S+1],b=ds(t,e,g,C,r);a[h]=Ii(b,f,v,P,_)}return a}};function Ii(i,e,t,r,a){let n=1-i;return n*n*n*e+3*n*n*i*t+3*n*i*i*r+i*i*i*a}function us(i,e,t,r,a){let n=1-i;return 3*n*n*(t-e)+6*n*i*(r-t)+3*i*i*(a-r)}function ds(i,e,t,r,a){let n=(i-e)/(a-e);for(let o=0;o<8;o++){let s=Ii(n,e,t,r,a)-i;if(Math.abs(s)<1e-10)break;let l=us(n,e,t,r,a);if(Math.abs(l)<1e-10)break;n=Math.max(0,Math.min(1,n-s/l))}return n}var ve=class{constructor(i,e,t,r){if(i===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+i);this.name=i,this.times=st(e,this.TimeBufferType),this.values=st(t,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(i){let e=i.constructor,t;if(e.toJSON!==this.toJSON)t=e.toJSON(i);else{t={name:i.name,times:st(i.times,Array),values:st(i.values,Array)};let r=i.getInterpolation();r!==i.DefaultInterpolation&&(t.interpolation=r),mn(i.settings)&&(t.settings={inTangents:st(i.settings.inTangents,Array),outTangents:st(i.settings.outTangents,Array)})}return t.type=i.ValueTypeName,t}InterpolantFactoryMethodDiscrete(i){return new qt(this.times,this.values,this.getValueSize(),i)}InterpolantFactoryMethodLinear(i){return new Xt(this.times,this.values,this.getValueSize(),i)}InterpolantFactoryMethodSmooth(i){return new Wt(this.times,this.values,this.getValueSize(),i)}InterpolantFactoryMethodBezier(i){let e=new Yt(this.times,this.values,this.getValueSize(),i);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(i){let e;switch(i){case yt:e=this.InterpolantFactoryMethodDiscrete;break;case Ut:e=this.InterpolantFactoryMethodLinear;break;case Dt:e=this.InterpolantFactoryMethodSmooth;break;case An:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let t="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(i!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(t);return ne("KeyframeTrack:",t),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yt;case this.InterpolantFactoryMethodLinear:return Ut;case this.InterpolantFactoryMethodSmooth:return Dt;case this.InterpolantFactoryMethodBezier:return An}}getValueSize(){return this.values.length/this.times.length}shift(i){if(i!==0){let e=this.times;for(let t=0,r=e.length;t!==r;++t)e[t]+=i}return this}scale(i){if(i!==1){let e=this.times;for(let t=0,r=e.length;t!==r;++t)e[t]*=i;mn(this.settings)&&(mi(this.settings.inTangents,i),mi(this.settings.outTangents,i))}return this}trim(i,e){let t=this.times,r=t.length,a=0,n=r-1;for(;a!==r&&t[a]<i;)++a;for(;n!==-1&&t[n]>e;)--n;if(++n,a!==0||n!==r){a>=n&&(n=Math.max(n,1),a=n-1);let o=this.getValueSize();this.times=t.slice(a,n),this.values=this.values.slice(a*o,n*o)}return this}validate(){let i=!0,e=this.getValueSize();e-Math.floor(e)!==0&&($("KeyframeTrack: Invalid value size in track.",this),i=!1);let t=this.times,r=this.values,a=t.length;a===0&&($("KeyframeTrack: Track is empty.",this),i=!1);let n=null;for(let o=0;o!==a;o++){let s=t[o];if(typeof s=="number"&&isNaN(s)){$("KeyframeTrack: Time is not a valid number.",this,o,s),i=!1;break}if(n!==null&&n>s){$("KeyframeTrack: Out of order keys.",this,o,s,n),i=!1;break}n=s}if(r!==void 0&&Zi(r))for(let o=0,s=r.length;o!==s;++o){let l=r[o];if(isNaN(l)){$("KeyframeTrack: Value is not a valid number.",this,o,l),i=!1;break}}return i}optimize(){let i=this.times.slice(),e=this.values.slice(),t=this.getValueSize(),r=this.getInterpolation()===Dt,a=i.length-1,n=1;for(let o=1;o<a;++o){let s=!1,l=i[o],c=i[o+1];if(l!==c&&(o!==1||l!==i[0]))if(r)s=!0;else{let d=o*t,m=d-t,u=d+t;for(let h=0;h!==t;++h){let f=e[d+h];if(f!==e[m+h]||f!==e[u+h]){s=!0;break}}}if(s){if(o!==n){i[n]=i[o];let d=o*t,m=n*t;for(let u=0;u!==t;++u)e[m+u]=e[d+u]}++n}}if(a>0){i[n]=i[a];for(let o=a*t,s=n*t,l=0;l!==t;++l)e[s+l]=e[o+l];++n}return n!==i.length?(this.times=i.slice(0,n),this.values=e.slice(0,n*t)):(this.times=i,this.values=e),this}clone(){let i=this.times.slice(),e=this.values.slice(),t=this.constructor,r=new t(this.name,i,e);return r.createInterpolant=this.createInterpolant,mn(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function mi(i,e){for(let t=0,r=i.length;t!==r;t+=2)i[t]*=e}ve.prototype.ValueTypeName="",ve.prototype.TimeBufferType=Float32Array,ve.prototype.ValueBufferType=Float32Array,ve.prototype.DefaultInterpolation=Ut;var Ve=class extends ve{constructor(i,e,t){super(i,e,t)}};Ve.prototype.ValueTypeName="bool",Ve.prototype.ValueBufferType=Array,Ve.prototype.DefaultInterpolation=yt,Ve.prototype.InterpolantFactoryMethodLinear=void 0,Ve.prototype.InterpolantFactoryMethodSmooth=void 0;var Zt=class extends ve{constructor(i,e,t,r){super(i,e,t,r)}};Zt.prototype.ValueTypeName="color";var Jt=class extends ve{constructor(i,e,t,r){super(i,e,t,r)}};Jt.prototype.ValueTypeName="number";var $t=class extends Be{constructor(i,e,t,r){super(i,e,t,r)}interpolate_(i,e,t,r){let a=this.resultBuffer,n=this.sampleValues,o=this.valueSize,s=(t-e)/(r-e),l=i*o;for(let c=l+o;l!==c;l+=4)X.slerpFlat(a,0,n,l-o,n,l,s);return a}},bt=class extends ve{constructor(i,e,t,r){super(i,e,t,r)}InterpolantFactoryMethodLinear(i){return new $t(this.times,this.values,this.getValueSize(),i)}};bt.prototype.ValueTypeName="quaternion",bt.prototype.InterpolantFactoryMethodSmooth=void 0;var ke=class extends ve{constructor(i,e,t){super(i,e,t)}};ke.prototype.ValueTypeName="string",ke.prototype.ValueBufferType=Array,ke.prototype.DefaultInterpolation=yt,ke.prototype.InterpolantFactoryMethodLinear=void 0,ke.prototype.InterpolantFactoryMethodSmooth=void 0;var Kt=class extends ve{constructor(i,e,t,r){super(i,e,t,r)}};Kt.prototype.ValueTypeName="vector";var Qt=class{constructor(i,e,t){let r=this,a=!1,n=0,o=0,s,l=[];this.onStart=void 0,this.onLoad=i,this.onProgress=e,this.onError=t,this._abortController=null,this.itemStart=function(c){o++,a===!1&&r.onStart!==void 0&&r.onStart(c,n,o),a=!0},this.itemEnd=function(c){n++,r.onProgress!==void 0&&r.onProgress(c,n,o),n===o&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(c){r.onError!==void 0&&r.onError(c)},this.resolveURL=function(c){return c=c.normalize("NFC"),s?s(c):c},this.setURLModifier=function(c){return s=c,this},this.addHandler=function(c,d){return l.push(c,d),this},this.removeHandler=function(c){let d=l.indexOf(c);return d!==-1&&l.splice(d,2),this},this.getHandler=function(c){for(let d=0,m=l.length;d<m;d+=2){let u=l[d],h=l[d+1];if(u.global&&(u.lastIndex=0),u.test(c))return h}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Pi=new Qt,jt=class{constructor(i){this.manager=i!==void 0?i:Pi,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(i,e){let t=this;return new Promise(function(r,a){t.load(i,r,e,a)})}parse(){}setCrossOrigin(i){return this.crossOrigin=i,this}setWithCredentials(i){return this.withCredentials=i,this}setPath(i){return this.path=i,this}setResourcePath(i){return this.resourcePath=i,this}setRequestHeader(i){return this.requestHeader=i,this}abort(){return this}};jt.DEFAULT_MATERIAL_NAME="__DEFAULT";var $n="\\[\\]\\.:\\/",fs=new RegExp("["+$n+"]","g"),Kn="[^"+$n+"]",ps="[^"+$n.replace("\\.","")+"]",ms=/((?:WC+[\/:])*)/.source.replace("WC",Kn),gs=/(WCOD+)?/.source.replace("WCOD",ps),_s=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Kn),xs=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Kn),vs=new RegExp("^"+ms+gs+_s+xs+"$"),ys=["material","materials","bones","map"],Fn=class{constructor(i,e,t){let r=t||q.parseTrackName(e);this._targetGroup=i,this._bindings=i.subscribe_(e,r)}getValue(i,e){this.bind();let t=this._targetGroup.nCachedObjects_,r=this._bindings[t];r!==void 0&&r.getValue(i,e)}setValue(i,e){let t=this._bindings;for(let r=this._targetGroup.nCachedObjects_,a=t.length;r!==a;++r)t[r].setValue(i,e)}bind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].bind()}unbind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].unbind()}},q=class dt{constructor(e,t,r){this.path=t,this.parsedPath=r||dt.parseTrackName(t),this.node=dt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,r){return e&&e.isAnimationObjectGroup?new dt.Composite(e,t,r):new dt(e,t,r)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fs,"")}static parseTrackName(e){let t=vs.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let r={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},a=r.nodeName&&r.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=r.nodeName.substring(a+1);ys.indexOf(n)!==-1&&(r.nodeName=r.nodeName.substring(0,a),r.objectName=n)}if(r.propertyName===null||r.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return r}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let r=e.skeleton.getBoneByName(t);if(r!==void 0)return r}if(e.children){let r=function(n){for(let o=0;o<n.length;o++){let s=n[o];if(s.name===t||s.uuid===t)return s;let l=r(s.children);if(l)return l}return null},a=r(e.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)e[t++]=r[a]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,r=t.objectName,a=t.propertyName,n=t.propertyIndex;if(e||(e=dt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ne("PropertyBinding: No target node found for track: "+this.path+".");return}if(r){let c=t.objectIndex;switch(r){case"materials":if(!e.material){$("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[r]===void 0){$("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[r]}if(c!==void 0){if(e[c]===void 0){$("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[a];if(o===void 0){let c=t.nodeName;$("PropertyBinding: Trying to update property for track: "+c+"."+a+" but it wasn't found.",e);return}let s=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?s=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!e.geometry){$("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[n]!==void 0&&(n=e.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=n}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};q.Composite=Fn,q.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},q.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},q.prototype.GetterByBindingType=[q.prototype._getValue_direct,q.prototype._getValue_array,q.prototype._getValue_arrayElement,q.prototype._getValue_toArray],q.prototype.SetterByBindingTypeAndVersioning=[[q.prototype._setValue_direct,q.prototype._setValue_direct_setNeedsUpdate,q.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[q.prototype._setValue_array,q.prototype._setValue_array_setNeedsUpdate,q.prototype._setValue_array_setMatrixWorldNeedsUpdate],[q.prototype._setValue_arrayElement,q.prototype._setValue_arrayElement_setNeedsUpdate,q.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[q.prototype._setValue_fromArray,q.prototype._setValue_fromArray_setNeedsUpdate,q.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var go=new Float32Array(1),On=(qi=class{constructor(e,t,r,a){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,r,a)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let r=0;r<4;r++)this.elements[r]=e[r+t];return this}set(e,t,r,a){let n=this.elements;return n[0]=e,n[2]=t,n[1]=r,n[3]=a,this}},qi.prototype.isMatrix2=!0,qi);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}})),typeof window<"u"&&(window.__THREE__?ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var Ms=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bs=`#ifdef USE_ALPHAHASH
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
#endif`,Es=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ts=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ws=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,As=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rs=`#ifdef USE_AOMAP
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
#endif`,Cs=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Is=`#ifdef USE_BATCHING
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
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ps=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ls=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ds=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ns=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Us=`#ifdef USE_IRIDESCENCE
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
#endif`,Fs=`#ifdef USE_BUMPMAP
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
#endif`,Os=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Bs=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vs=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ks=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zs=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gs=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Hs=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ws=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Xs=`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,qs=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ys=`vec3 transformedNormal = objectNormal;
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
#endif`,Zs=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Js=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$s=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ks=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qs="gl_FragColor = linearToOutputTexel( gl_FragColor );",js=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,er=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,tr=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,nr=`#ifdef USE_ENVMAP
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
#endif`,ir=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sr=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rr=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ar=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,or=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lr=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cr=`#ifdef USE_GRADIENTMAP
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
}`,hr=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ur=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dr=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fr=`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#endif
#include <lightprobes_pars_fragment>`,pr=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
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
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,mr=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gr=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_r=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xr=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vr=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,yr=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Sr=`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mr=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,br=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Er=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Tr=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wr=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ar=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rr=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Cr=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ir=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pr=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lr=`#if defined( USE_POINTS_UV )
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
#endif`,Dr=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nr=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ur=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fr=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Or=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Br=`#ifdef USE_MORPHTARGETS
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
#endif`,Vr=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kr=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zr=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Gr=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hr=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wr=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Xr=`#ifdef USE_NORMALMAP
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
#endif`,qr=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yr=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zr=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jr=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$r=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kr=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Qr=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jr=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ea=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ta=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,na=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ia=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sa=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ra=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
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
#endif`,aa=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,oa=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,la=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ca=`#ifdef USE_SKINNING
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
#endif`,ha=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ua=`#ifdef USE_SKINNING
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
#endif`,da=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fa=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pa=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ma=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ga=`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_a=`#ifdef USE_TRANSMISSION
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
#endif`,xa=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,va=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ya=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sa=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ma=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ba=`uniform sampler2D t2D;
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
}`,Ea=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ta=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wa=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Aa=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ra=`#include <common>
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
}`,Ca=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ia=`#define DISTANCE
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
}`,Pa=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,La=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Da=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Na=`uniform float scale;
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
}`,Ua=`uniform vec3 diffuse;
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
}`,Fa=`#include <common>
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
}`,Oa=`uniform vec3 diffuse;
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
}`,Ba=`#define LAMBERT
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
}`,Va=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,ka=`#define MATCAP
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
}`,za=`#define MATCAP
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
}`,Ga=`#define NORMAL
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
}`,Ha=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Wa=`#define PHONG
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
}`,Xa=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,qa=`#define STANDARD
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
}`,Ya=`#define STANDARD
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
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,Za=`#define TOON
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
}`,Ja=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,$a=`uniform float size;
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
}`,Ka=`uniform vec3 diffuse;
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
}`,Qa=`#include <common>
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
}`,ja=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,eo=`uniform float rotation;
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
}`,to=`uniform vec3 diffuse;
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
}`,V={alphahash_fragment:Ms,alphahash_pars_fragment:bs,alphamap_fragment:Es,alphamap_pars_fragment:Ts,alphatest_fragment:ws,alphatest_pars_fragment:As,aomap_fragment:Rs,aomap_pars_fragment:Cs,batching_pars_vertex:Is,batching_vertex:Ps,begin_vertex:Ls,beginnormal_vertex:Ds,bsdfs:Ns,iridescence_fragment:Us,bumpmap_pars_fragment:Fs,clipping_planes_fragment:Os,clipping_planes_pars_fragment:Bs,clipping_planes_pars_vertex:Vs,clipping_planes_vertex:ks,color_fragment:zs,color_pars_fragment:Gs,color_pars_vertex:Hs,color_vertex:Ws,common:Xs,cube_uv_reflection_fragment:qs,defaultnormal_vertex:Ys,displacementmap_pars_vertex:Zs,displacementmap_vertex:Js,emissivemap_fragment:$s,emissivemap_pars_fragment:Ks,colorspace_fragment:Qs,colorspace_pars_fragment:js,envmap_fragment:er,envmap_common_pars_fragment:tr,envmap_pars_fragment:nr,envmap_pars_vertex:ir,envmap_physical_pars_fragment:pr,envmap_vertex:sr,fog_vertex:rr,fog_pars_vertex:ar,fog_fragment:or,fog_pars_fragment:lr,gradientmap_pars_fragment:cr,lightmap_pars_fragment:hr,lights_lambert_fragment:ur,lights_lambert_pars_fragment:dr,lights_pars_begin:fr,lights_toon_fragment:mr,lights_toon_pars_fragment:gr,lights_phong_fragment:_r,lights_phong_pars_fragment:xr,lights_physical_fragment:vr,lights_physical_pars_fragment:yr,lights_fragment_begin:Sr,lights_fragment_maps:Mr,lights_fragment_end:br,lightprobes_pars_fragment:Er,logdepthbuf_fragment:Tr,logdepthbuf_pars_fragment:wr,logdepthbuf_pars_vertex:Ar,logdepthbuf_vertex:Rr,map_fragment:Cr,map_pars_fragment:Ir,map_particle_fragment:Pr,map_particle_pars_fragment:Lr,metalnessmap_fragment:Dr,metalnessmap_pars_fragment:Nr,morphinstance_vertex:Ur,morphcolor_vertex:Fr,morphnormal_vertex:Or,morphtarget_pars_vertex:Br,morphtarget_vertex:Vr,normal_fragment_begin:kr,normal_fragment_maps:zr,normal_pars_fragment:Gr,normal_pars_vertex:Hr,normal_vertex:Wr,normalmap_pars_fragment:Xr,clearcoat_normal_fragment_begin:qr,clearcoat_normal_fragment_maps:Yr,clearcoat_pars_fragment:Zr,iridescence_pars_fragment:Jr,opaque_fragment:$r,packing:Kr,premultiplied_alpha_fragment:Qr,project_vertex:jr,dithering_fragment:ea,dithering_pars_fragment:ta,roughnessmap_fragment:na,roughnessmap_pars_fragment:ia,shadowmap_pars_fragment:sa,shadowmap_pars_vertex:ra,shadowmap_vertex:aa,shadowmask_pars_fragment:oa,skinbase_vertex:la,skinning_pars_vertex:ca,skinning_vertex:ha,skinnormal_vertex:ua,specularmap_fragment:da,specularmap_pars_fragment:fa,tonemapping_fragment:pa,tonemapping_pars_fragment:ma,transmission_fragment:ga,transmission_pars_fragment:_a,uv_pars_fragment:xa,uv_pars_vertex:va,uv_vertex:ya,worldpos_vertex:Sa,background_vert:Ma,background_frag:ba,backgroundCube_vert:Ea,backgroundCube_frag:Ta,cube_vert:wa,cube_frag:Aa,depth_vert:Ra,depth_frag:Ca,distance_vert:Ia,distance_frag:Pa,equirect_vert:La,equirect_frag:Da,linedashed_vert:Na,linedashed_frag:Ua,meshbasic_vert:Fa,meshbasic_frag:Oa,meshlambert_vert:Ba,meshlambert_frag:Va,meshmatcap_vert:ka,meshmatcap_frag:za,meshnormal_vert:Ga,meshnormal_frag:Ha,meshphong_vert:Wa,meshphong_frag:Xa,meshphysical_vert:qa,meshphysical_frag:Ya,meshtoon_vert:Za,meshtoon_frag:Ja,points_vert:$a,points_frag:Ka,shadow_vert:Qa,shadow_frag:ja,sprite_vert:eo,sprite_frag:to},I={common:{diffuse:{value:new Y(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new B}},envmap:{envMap:{value:null},envMapRotation:{value:new B},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new B}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new B}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new B},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new B},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new B},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new B}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new B}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new B}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Y(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new w},probesMax:{value:new w},probesResolution:{value:new w}},points:{diffuse:{value:new Y(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0},uvTransform:{value:new B}},sprite:{diffuse:{value:new Y(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}}},Li={basic:{uniforms:pe([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.fog]),vertexShader:V.meshbasic_vert,fragmentShader:V.meshbasic_frag},lambert:{uniforms:pe([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.fog,I.lights,{emissive:{value:new Y(0)},envMapIntensity:{value:1}}]),vertexShader:V.meshlambert_vert,fragmentShader:V.meshlambert_frag},phong:{uniforms:pe([I.common,I.specularmap,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.fog,I.lights,{emissive:{value:new Y(0)},specular:{value:new Y(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:V.meshphong_vert,fragmentShader:V.meshphong_frag},standard:{uniforms:pe([I.common,I.envmap,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.roughnessmap,I.metalnessmap,I.fog,I.lights,{emissive:{value:new Y(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:V.meshphysical_vert,fragmentShader:V.meshphysical_frag},toon:{uniforms:pe([I.common,I.aomap,I.lightmap,I.emissivemap,I.bumpmap,I.normalmap,I.displacementmap,I.gradientmap,I.fog,I.lights,{emissive:{value:new Y(0)}}]),vertexShader:V.meshtoon_vert,fragmentShader:V.meshtoon_frag},matcap:{uniforms:pe([I.common,I.bumpmap,I.normalmap,I.displacementmap,I.fog,{matcap:{value:null}}]),vertexShader:V.meshmatcap_vert,fragmentShader:V.meshmatcap_frag},points:{uniforms:pe([I.points,I.fog]),vertexShader:V.points_vert,fragmentShader:V.points_frag},dashed:{uniforms:pe([I.common,I.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:V.linedashed_vert,fragmentShader:V.linedashed_frag},depth:{uniforms:pe([I.common,I.displacementmap]),vertexShader:V.depth_vert,fragmentShader:V.depth_frag},normal:{uniforms:pe([I.common,I.bumpmap,I.normalmap,I.displacementmap,{opacity:{value:1}}]),vertexShader:V.meshnormal_vert,fragmentShader:V.meshnormal_frag},sprite:{uniforms:pe([I.sprite,I.fog]),vertexShader:V.sprite_vert,fragmentShader:V.sprite_frag},background:{uniforms:{uvTransform:{value:new B},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:V.background_vert,fragmentShader:V.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new B}},vertexShader:V.backgroundCube_vert,fragmentShader:V.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:V.cube_vert,fragmentShader:V.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:V.equirect_vert,fragmentShader:V.equirect_frag},distance:{uniforms:pe([I.common,I.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:V.distance_vert,fragmentShader:V.distance_frag},shadow:{uniforms:pe([I.lights,I.fog,{color:{value:new Y(0)},opacity:{value:1}}]),vertexShader:V.shadow_vert,fragmentShader:V.shadow_frag}};Li.physical={uniforms:pe([Li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new B},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new B},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new B},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new B},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new B},sheen:{value:0},sheenColor:{value:new Y(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new B},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new B},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new B},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new B},attenuationDistance:{value:0},attenuationColor:{value:new Y(0)},specularColor:{value:new Y(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new B},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new B},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new B}}]),vertexShader:V.meshphysical_vert,fragmentShader:V.meshphysical_frag};var no=new B;no.set(-1,0,0,0,1,0,0,0,1);var zf={[Bn]:"LINEAR_TONE_MAPPING",[Vn]:"REINHARD_TONE_MAPPING",[kn]:"CINEON_TONE_MAPPING",[zn]:"ACES_FILMIC_TONE_MAPPING",[Hn]:"AGX_TONE_MAPPING",[Wn]:"NEUTRAL_TONE_MAPPING",[Gn]:"CUSTOM_TONE_MAPPING"},Gf=new Float32Array(16),Hf=new Float32Array(9),Wf=new Float32Array(4),Xf={[Bn]:"Linear",[Vn]:"Reinhard",[kn]:"Cineon",[zn]:"ACESFilmic",[Hn]:"AgX",[Wn]:"Neutral",[Gn]:"Custom"},qf={[gi]:"SHADOWMAP_TYPE_PCF",[_i]:"SHADOWMAP_TYPE_VSM"},Yf={[Si]:"ENVMAP_TYPE_CUBE",[qn]:"ENVMAP_TYPE_CUBE",[Mi]:"ENVMAP_TYPE_CUBE_UV"},Zf={[qn]:"ENVMAP_MODE_REFRACTION"},Jf={[xi]:"ENVMAP_BLENDING_MULTIPLY",[vi]:"ENVMAP_BLENDING_MIX",[yi]:"ENVMAP_BLENDING_ADD"},io=new B;io.set(-1,0,0,0,1,0,0,0,1);var $f=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),{abs:Tt,min:Te,max:ue,sqrt:we,exp:Di}=Math;function Fi(i,e,t){if(t<=0)return Te(i,e);let r=ue(t-Tt(i-e),0)/t;return Te(i,e)-r*r*t*.25}function Ni(i,e,t){return-Fi(-i,-e,t)}function so(i,e,t,r){let a=i-r.c[0],n=e-r.c[1],o=t-r.c[2];return we(a*a+n*n+o*o)-r.r}function Qn(i,e,t,r){let a=e-i.c[0],n=t-i.c[1],o=r-i.c[2];if(i.m){let s=i.m;return[s[0]*a+s[1]*n+s[2]*o,s[3]*a+s[4]*n+s[5]*o,s[6]*a+s[7]*n+s[8]*o]}return[a,n,o]}function ro(i,e,t,r){let[a,n,o]=Qn(r,i,e,t),s=r.radii,l=we((a/s[0])**2+(n/s[1])**2+(o/s[2])**2),c=we((a/(s[0]*s[0]))**2+(n/(s[1]*s[1]))**2+(o/(s[2]*s[2]))**2);return c>1e-9?l*(l-1)/c:-Te(s[0],s[1],s[2])}function ao(i,e,t,r){let a=r.a,n=r.b,o=r.r0,s=r.r1,l=n[0]-a[0],c=n[1]-a[1],d=n[2]-a[2],m=l*l+c*c+d*d,u=o-s,h=m-u*u,f=1/m,_=i-a[0],p=e-a[1],g=t-a[2],v=_*l+p*c+g*d,S=v-m,C=_*m-l*v,P=p*m-c*v,b=g*m-d*v,E=C*C+P*P+b*b,R=v*v*m,T=S*S*m,D=Math.sign(u)*u*u*E;return Math.sign(S)*h*T>D?we(E+T)*f-s:Math.sign(v)*h*R<D?we(E+R)*f-o:(we(E*h*f)+v*u)*f-o}function Oi(i,e,t,r){let[a,n,o]=Qn(r,i,e,t),s=r.half,l=r.round,c=Tt(a)-s[0]+l,d=Tt(n)-s[1]+l,m=Tt(o)-s[2]+l;return we(ue(c,0)**2+ue(d,0)**2+ue(m,0)**2)+Te(ue(c,ue(d,m)),0)-l}function oo(i,e,t,r){let[a,n,o]=Qn(r,i,e,t),s=we(a*a+o*o)-r.R;return we(s*s+n*n)-r.r}var lo={sphere:so,ellipsoid:ro,cone:ao,box:Oi,torus:oo},ct=new Proxy({},{get:(i,e)=>(t,r,a,n)=>{let o=lo[e](t,r,a,n);return n.clip&&(o=ue(o,Oi(t,r,a,n.clip))),n.warp&&(o+=n.warp(t,r,a)),o}});function ge(i,e,t){return{c:i,half:[e[0]/2,e[1]/2,e[2]/2],round:0,m:tn(t)}}function tn(i){if(!i)return null;let e=new j().makeRotationFromQuaternion(i).invert().elements;return[e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]]}var Ui=i=>i&&i.isColor?i:new Y(i??"#ffffff"),qe=class{constructor(){this.prims=[]}_add(i,e={}){return i.op=e.op||"add",i.k=e.k??.03,i.color=typeof e.color=="function"?e.color:Ui(e.color),i.mat=e.mat??0,i.ink=e.ink??1,i.face=e.face??0,i.bone=e.bone??0,i.uv=e.uv||null,i.paint=e.paint??(i.op!=="sub"||!!e.color),i.pat=e.pat||null,i.col2=e.color2?Ui(e.color2):null,i.lid=e.lid??(i.op==="sub"?30:i.mat===0?0:10+i.mat),i.wbias=e.wbias??0,e.clip&&(i.clip=e.clip),e.bones&&(i.bones=e.bones),i.part=e.part??this.defaultPart??0,e.warp&&(i.warp=e.warp),e.noLine&&(i.noLine=!0),this.prims.push(i),i}sphere(i,e,t){return this._add({type:"sphere",c:i,r:e,bb:[i[0]-e,i[1]-e,i[2]-e,i[0]+e,i[1]+e,i[2]+e]},t)}ellipsoid(i,e,t,r){let a=ue(...e);return this._add({type:"ellipsoid",c:i,radii:e,m:tn(t),bb:[i[0]-a,i[1]-a,i[2]-a,i[0]+a,i[1]+a,i[2]+a]},r)}cone(i,e,t,r,a){let n=ue(t,r);return this._add({type:"cone",a:i,b:e,r0:t,r1:r,bb:[Te(i[0],e[0])-n,Te(i[1],e[1])-n,Te(i[2],e[2])-n,ue(i[0],e[0])+n,ue(i[1],e[1])+n,ue(i[2],e[2])+n]},a)}capsule(i,e,t,r){return this.cone(i,e,t,t,r)}chain(i,e,t){for(let r=0;r<i.length-1;r++)this.cone(i[r],i[r+1],e[r],e[r+1],{...t,bone:Array.isArray(t.bone)?t.bone[r]:t.bone})}box(i,e,t,r,a){let n=[e[0]/2,e[1]/2,e[2]/2],o=we(n[0]**2+n[1]**2+n[2]**2);return this._add({type:"box",c:i,half:n,round:t,m:tn(r),bb:[i[0]-o,i[1]-o,i[2]-o,i[0]+o,i[1]+o,i[2]+o]},a)}torus(i,e,t,r,a){let n=e+t;return this._add({type:"torus",c:i,R:e,r:t,m:tn(r),bb:[i[0]-n,i[1]-n,i[2]-n,i[0]+n,i[1]+n,i[2]+n]},a)}buildParts(i={}){let e=this.prims,t=[...new Set(e.filter(a=>a.op!=="sub"&&a.op!=="paint").map(a=>a.part))].sort((a,n)=>a-n),r={};try{for(let a of t)this.prims=e.filter(n=>n.part===a),r[a]=this.build(i)}finally{this.prims=e}return r}build({h:i=.012,nBones:e=1,aoStep:t=.018}={}){this.aoStep=t;let r=this.prims,a=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let g of r)if(g.op!=="sub"&&g.op!=="paint")for(let v=0;v<3;v++)a[v]=Te(a[v],g.bb[v]-g.k),a[v+3]=ue(a[v+3],g.bb[v+3]+g.k);for(let g=0;g<3;g++)a[g]-=2*i,a[g+3]+=2*i;let n=Math.ceil((a[3]-a[0])/i)+1,o=Math.ceil((a[4]-a[1])/i)+1,s=Math.ceil((a[5]-a[2])/i)+1,l=new Float32Array(n*o*s).fill(1e3),c=(g,v,S)=>g+n*(v+o*S);for(let g of r){if(g.op==="paint")continue;let v=ct[g.type],S=g.k+2*i,C=ue(0,Math.floor((g.bb[0]-S-a[0])/i)),P=Te(n-1,Math.ceil((g.bb[3]+S-a[0])/i)),b=ue(0,Math.floor((g.bb[1]-S-a[1])/i)),E=Te(o-1,Math.ceil((g.bb[4]+S-a[1])/i)),R=ue(0,Math.floor((g.bb[2]-S-a[2])/i)),T=Te(s-1,Math.ceil((g.bb[5]+S-a[2])/i));for(let D=R;D<=T;D++){let U=a[2]+D*i;for(let G=b;G<=E;G++){let y=a[1]+G*i,L=c(C,G,D);for(let A=C;A<=P;A++,L++){let z=a[0]+A*i,Q=v(z,y,U,g);l[L]=g.op==="sub"?Ni(l[L],-Q,g.k):g.op==="int"?Ni(l[L],Q,g.k):Fi(l[L],Q,g.k)}}}}this.field={F:l,nx:n,ny:o,nz:s,h:i,bb:a};let d=new Int32Array(n*o*s).fill(-1),m=[],u=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],h=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],f=new Float32Array(8);for(let g=0;g<s-1;g++)for(let v=0;v<o-1;v++)for(let S=0;S<n-1;S++){let C=0;for(let T=0;T<8;T++)f[T]=l[c(S+h[T][0],v+h[T][1],g+h[T][2])],f[T]<0&&(C|=1<<T);if(C===0||C===255)continue;let P=0,b=0,E=0,R=0;for(let[T,D]of u){if(f[T]<0==f[D]<0)continue;let U=f[T]/(f[T]-f[D]);P+=h[T][0]+(h[D][0]-h[T][0])*U,b+=h[T][1]+(h[D][1]-h[T][1])*U,E+=h[T][2]+(h[D][2]-h[T][2])*U,R++}d[c(S,v,g)]=m.length/3,m.push(a[0]+(S+P/R)*i,a[1]+(v+b/R)*i,a[2]+(g+E/R)*i)}let _=[];for(let g=1;g<s-1;g++)for(let v=1;v<o-1;v++)for(let S=1;S<n-1;S++){let C=l[c(S,v,g)]<0;l[c(S+1,v,g)]<0!==C&&S<n-1&&p(d[c(S,v-1,g-1)],d[c(S,v,g-1)],d[c(S,v,g)],d[c(S,v-1,g)],C),l[c(S,v+1,g)]<0!==C&&p(d[c(S-1,v,g-1)],d[c(S-1,v,g)],d[c(S,v,g)],d[c(S,v,g-1)],C),l[c(S,v,g+1)]<0!==C&&p(d[c(S-1,v-1,g)],d[c(S,v-1,g)],d[c(S,v,g)],d[c(S-1,v,g)],C)}function p(g,v,S,C,P){g<0||v<0||S<0||C<0||(P?_.push(g,v,S,g,S,C):_.push(g,C,S,g,S,v))}return this._attributes(m,_,e)}sample(i,e,t){let{F:r,nx:a,ny:n,nz:o,h:s,bb:l}=this.field,c=(i-l[0])/s,d=(e-l[1])/s,m=(t-l[2])/s,u=Math.max(0,Math.min(a-2,Math.floor(c))),h=Math.max(0,Math.min(n-2,Math.floor(d))),f=Math.max(0,Math.min(o-2,Math.floor(m))),_=c-u,p=d-h,g=m-f,v=(E,R,T)=>r[E+a*(R+n*T)],S=v(u,h,f)*(1-_)+v(u+1,h,f)*_,C=v(u,h+1,f)*(1-_)+v(u+1,h+1,f)*_,P=v(u,h,f+1)*(1-_)+v(u+1,h,f+1)*_,b=v(u,h+1,f+1)*(1-_)+v(u+1,h+1,f+1)*_;return(S*(1-p)+C*p)*(1-g)+(P*(1-p)+b*p)*g}_attributes(i,e,t){let r=i.length/3,a=this.field.h,n=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r),l=new Float32Array(r*2),c=new Float32Array(r*3),d=this.aoStep,m=new Float32Array(r*3),u=new Float32Array(r*3),h=new Float32Array(r*3),f=new Float32Array(r*2),_=new Uint16Array(r*4),p=new Float32Array(r*4),g=this.prims,v=g.filter(E=>E.op!=="sub"&&E.op!=="paint"),S=g.filter(E=>E.op==="sub"&&E.paint),C=g.filter(E=>E.op==="paint"),P=new Y;for(let E=0;E<r;E++){let R=i[E*3],T=i[E*3+1],D=i[E*3+2],U=a*.75,G=this.sample(R+U,T,D)-this.sample(R-U,T,D),y=this.sample(R,T+U,D)-this.sample(R,T-U,D),L=this.sample(R,T,D+U)-this.sample(R,T,D-U),A=Math.hypot(G,y,L)||1;m[E*3]=G/A,m[E*3+1]=y/A,m[E*3+2]=L/A;let z=0,Q=0;for(let M=1;M<=4;M++){let F=M*d,W=this.sample(R+m[E*3]*F,T+m[E*3+1]*F,D+m[E*3+2]*F),re=1/M;z+=re*Math.max(0,(F-W)/F),Q+=re}o[E]=Math.min(1,z/Q*1.4);let J=1e9,ie=null,ae=[];for(let M of v){if(R<M.bb[0]-M.k-.05||R>M.bb[3]+M.k+.05||T<M.bb[1]-M.k-.05||T>M.bb[4]+M.k+.05||D<M.bb[2]-M.k-.05||D>M.bb[5]+M.k+.05)continue;let F=ct[M.type](R,T,D,M)-M.wbias;ae.push([M,F]),F<J&&(J=F,ie=M)}ie||(ie=v[0],ae.push([ie,0]),J=0);let de=new Map;for(let[M,F]of ae){let W=Di(-(F-J)/.035);W<.01||de.set(M.bone,(de.get(M.bone)||0)+W)}let Ae=[...de.entries()].sort((M,F)=>F[1]-M[1]).slice(0,4),wo=Ae.reduce((M,F)=>M+F[1],0);for(let M=0;M<4;M++)_[E*4+M]=Ae[M]?Ae[M][0]:0,p[E*4+M]=Ae[M]?Ae[M][1]/wo:0;let se=ie,yo=!1,Eo=ie.lid??0,Xi=0,en=0,nn=0,Re=0;for(let[M,F]of ae){let W=Di(-(F-J)/.0035);if(W<.02)continue;let re=typeof M.color=="function"?P.copy(M.color(R,T,D)):M.color;Xi+=re.r*W,en+=re.g*W,nn+=re.b*W,Re+=W}for(let M of S){let F=-ct[M.type](R,T,D,M);if(Tt(F)<a*.9){let W=typeof M.color=="function"?P.copy(M.color(R,T,D)):M.color;Xi=W.r,en=W.g,nn=W.b,Re=1,se=M}}for(let M of C){if(R<M.bb[0]-.02||R>M.bb[3]+.02||T<M.bb[1]-.02||T>M.bb[4]+.02||D<M.bb[2]-.02||D>M.bb[5]+.02||M.bones&&!M.bones.includes(Ae[0][0]))continue;let F=ct[M.type](R,T,D,M);if(F<.002){let W=typeof M.color=="function"?P.copy(M.color(R,T,D)):M.color,re=Math.min(1,Math.max(0,(.002-F)/.003));Xi=Xi/Re*(1-re)+W.r*re,en=en/Re*(1-re)+W.g*re,nn=nn/Re*(1-re)+W.b*re,Re=1,re>.5&&(se={...se,mat:M.mat,ink:M.ink,face:0,uv:null,lid:M.lid,pat:M.pat,col2:M.col2},yo=!0)}}let ze=1e9;if(!yo)for(let[M,F]of ae)(M.lid??0)!==Eo&&!M.noLine&&(ze=Math.min(ze,(F-J)*.5));let _o=[];for(let M of C)M.noLine||R<M.bb[0]-.05||R>M.bb[3]+.05||T<M.bb[1]-.05||T>M.bb[4]+.05||D<M.bb[2]-.05||D>M.bb[5]+.05||M.bones&&!M.bones.includes(Ae[0][0])||_o.push([M,ct[M.type](R,T,D,M)]);let Ao=se.lid??0;for(let[M,F]of _o){if(F>.002&&Ao===M.lid)continue;let W=!1;for(let[re,xo]of _o)if(re!==M&&re.lid===M.lid&&xo<-.004){W=!0;break}if(!W){for(let[re,xo]of ae)if(re.lid===M.lid&&xo-J<.004){W=!0;break}}W||(ze=Math.min(ze,Math.abs(F-.0035)))}for(let M of S){if(M.noLine)continue;let F=ct[M.type](R,T,D,M);ze=Math.min(ze,Math.abs(Math.abs(F)-a*.9))}if(se.face&&(o[E]=0),n[E]=Math.max(0,1-ze/.04),u[E*3]=Xi/Re,u[E*3+1]=en/Re,u[E*3+2]=nn/Re,h[E*3]=se.ink,h[E*3+1]=se.mat,h[E*3+2]=se.face,s[E]=0,se.pat){l[E*2]=se.pat[0],l[E*2+1]=se.pat[1];let M=se.col2||se.color;c[E*3]=M.r,c[E*3+1]=M.g,c[E*3+2]=M.b}if(se.uv){let M=se.uv(R,T,D);f[E*2]=M[0],f[E*2+1]=M[1]}else f[E*2]=-4,f[E*2+1]=-4}let b=new St;return b.setAttribute("position",new ot(i,3)),b.setAttribute("normal",new ee(m,3)),b.setAttribute("color",new ee(u,3)),b.setAttribute("ext",new ee(h,3)),b.setAttribute("uv",new ee(f,2)),b.setAttribute("occ",new ee(o,1)),b.setAttribute("bnd",new ee(n,1)),b.setAttribute("pat",new ee(l,2)),b.setAttribute("col2",new ee(c,3)),b.setAttribute("lid",new ee(s,1)),b.setAttribute("skinIndex",new ee(_,4)),b.setAttribute("skinWeight",new ee(p,4)),b.setIndex(e),b}};function jn(i,e){let t=Object.keys(i),r={},a=[],n={};for(let l of t)n[l]=new w(...i[l]);for(let l of t){let c=new lt;c.name=l,r[l]=c,a.push(c)}let o=null;for(let l of t){let c=e[l];c?(r[c].add(r[l]),r[l].position.copy(n[l]).sub(n[c])):(o=r[l],r[l].position.copy(n[l]))}let s=new Mt(a);return{names:t,byName:r,bones:a,rest:n,root:o,skeleton:s,index:l=>{let c=t.indexOf(l);if(c<0)throw new Error("no bone "+l);return c},springs:[]}}var jf=new w,ep=new w,tp=new X,np=new j,N=(i,e,t)=>new w(i,e,t),x=i=>[i.x,i.y,i.z],Ye=(i,e,t)=>new X().setFromEuler(new le(i*Math.PI/180,e*Math.PI/180,t*Math.PI/180,"YXZ")),Z=i=>new Y(i),co=i=>{let e=new j().makeRotationFromQuaternion(i).invert().elements;return[e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]]},O={skin:0,cloth:1,hair:2,metal:3,rubber:4,ink:5,lens:6,wood:7,paper:8},ho={height:1,legLen:.42,torsoLen:.36,neckLen:.05,headR:[.15,.16,.15],shoulderW:.34,hipW:.27,chest:[.17,.13,.13],pelvis:[.15,.11,.12],belly:0,bust:0,upperArm:.2,foreArm:.18,armR:[.055,.045,.035],legR:[.075,.055,.04],hand:.068,foot:.11,ear:1,nose:"bulb",noseSize:1,jowl:0,chin:0,skin:"#f2a58f",skinShade:"#e08878",cheek:"#ef7d78",hair:null,hairColor:"#2a2228",moustache:null,costume:[],rest:"stand"};function uo(i){let e={},t=i.rest==="stand"?i.legLen+.06:.42,r=i.rest==="recline"?58:i.rest==="sit"?6:0,a=N(0,Math.cos(r*Math.PI/180),-Math.sin(r*Math.PI/180));e.root=N(0,0,0),e.hips=N(0,t,0),e.spine=e.hips.clone().addScaledVector(a,i.torsoLen*.32),e.chest=e.hips.clone().addScaledVector(a,i.torsoLen*.62),e.belly=e.spine.clone().add(N(0,0,.02)),e.neck=e.hips.clone().addScaledVector(a,i.torsoLen*.98),e.head=e.neck.clone().addScaledVector(a,i.neckLen),e.hair=e.head.clone().addScaledVector(a,i.headR[1]*1.6);let n=e.hips.clone().addScaledVector(a,i.torsoLen*.88);for(let[o,s]of[["L",1],["R",-1]]){let l=n.clone().add(N(s*i.shoulderW/2,0,0));e["arm"+o]=l;let c,d;i.rest==="stand"?(c=N(s*.5,-.86,.06).normalize(),d=N(s*.18,-.82,.42).normalize()):i.rest==="sit"?(c=N(s*.3,-.92,.2).normalize(),d=N(s*.05,-.3,.95).normalize()):(c=N(s*.55,-.55,.35).normalize(),d=N(s*-.35,.1,.9).normalize()),e["fore"+o]=l.clone().addScaledVector(c,i.upperArm),e["hand"+o]=e["fore"+o].clone().addScaledVector(d,i.foreArm);let m=e.hips.clone().add(N(s*i.hipW*.36,-.03,0));e["thigh"+o]=m;let u,h;i.rest==="stand"?(u=N(s*.04,-1,0),h=N(0,-1,-.02)):i.rest==="sit"?(u=N(s*.12,-.08,1).normalize(),h=N(0,-1,.04).normalize()):(u=N(s*.15,.25,1).normalize(),h=N(s*.05,-.85,.5).normalize()),e["shin"+o]=m.clone().addScaledVector(u,i.legLen*.5),e["foot"+o]=e["shin"+o].clone().addScaledVector(h,i.legLen*.5)}return{J:e,tdir:a}}var Bi={hips:"root",spine:"hips",belly:"spine",chest:"spine",neck:"chest",head:"neck",hair:"head",armL:"chest",foreL:"armL",handL:"foreL",armR:"chest",foreR:"armR",handR:"foreR",thighL:"hips",shinL:"thighL",footL:"shinL",thighR:"hips",shinR:"thighR",footR:"shinR"};function Vi(i,e={}){let t={...ho,...i},{J:r,tdir:a}=uo(t),n=Object.keys(Bi);n.unshift("root");let o=jn(Object.fromEntries(n.map(y=>[y,x(r[y])])),Object.fromEntries(Object.entries(Bi))),s=y=>o.index(y),l=new qe;t.toon&&(l.defaultPart=8);let c=Z(t.skin),d=Z(t.skinShade),m=Z(t.cheek),u=t.toon?y=>()=>y.clone():y=>(L,A,z)=>y.clone().lerp(d,.18+.18*Math.sin(L*37+A*23)*Math.sin(z*31-A*11)),h={skin:{color:t.toon?c:u(c),mat:O.skin}},f=a,_=N(1,0,0),p=new w().crossVectors(_,f).normalize(),g=new X().setFromUnitVectors(N(0,1,0),f);if(l.ellipsoid(x(r.hips.clone().addScaledVector(p,.005)),t.pelvis,g,{...h.skin,bone:s("hips"),k:.05}),l.ellipsoid(x(r.spine.clone().lerp(r.chest,.3)),[t.pelvis[0]*.92,t.torsoLen*.24,t.pelvis[2]*.95],g,{...h.skin,bone:s("spine"),k:.06}),l.ellipsoid(x(r.chest.clone().addScaledVector(f,.02)),t.chest,g,{...h.skin,bone:s("chest"),k:.06}),t.belly>0){let y=r.spine.clone().addScaledVector(p,t.chest[2]*.55+t.belly*.06).addScaledVector(f,-.01);l.ellipsoid(x(y),[t.pelvis[0]*(.95+t.belly*.35),t.torsoLen*(.28+t.belly*.12),t.pelvis[2]*(.8+t.belly*.9)],g,{color:(L,A,z)=>u(c)(L,A,z).lerp(Z("#ffb3a0"),.25),mat:O.skin,bone:s("belly"),k:.09,wbias:.01}),l.sphere(x(y.clone().addScaledVector(p,t.pelvis[2]*(.8+t.belly*.9)-.006).addScaledVector(f,-.02)),.012,{op:"sub",k:.01,color:"#8a3c48"})}if(t.bust>0)for(let y of[1,-1])l.sphere(x(r.chest.clone().addScaledVector(p,t.chest[2]*.7).add(N(y*t.chest[0]*.42,0,0)).addScaledVector(f,-.02)),.055*t.bust+.02,{...h.skin,bone:s("chest"),k:.05});for(let y of["L","R"])l.sphere(x(r["arm"+y]),t.armR[0]*1.05,{...h.skin,bone:s("arm"+y),k:.06});l.cone(x(r.neck.clone().addScaledVector(f,-.03)),x(r.head.clone().addScaledVector(f,.02)),t.headR[0]*.42,t.headR[0]*.36,{...h.skin,bone:s("neck"),k:.04});let v=r.head.clone().addScaledVector(f,t.headR[1]*.85),S=g,C=(y,L,A)=>{let z=N(y,L,A).sub(v).applyQuaternion(S.clone().invert());return z.z>-t.headR[2]*.15?[.5+z.x/(t.headR[0]*1.62),.5+(z.y+t.headR[1]*.06)/(t.headR[1]*1.62)]:[-4,-4]};if(l.ellipsoid(x(v),t.headR,S,{part:0,color:u(c),mat:O.skin,bone:s("head"),face:1,uv:C,k:.04}),t.jowl>0&&l.ellipsoid(x(v.clone().addScaledVector(f,-t.headR[1]*.62).addScaledVector(p,t.headR[2]*.25)),[t.headR[0]*(.75+t.jowl*.2),t.headR[1]*(.3+t.jowl*.12),t.headR[2]*.7],S,{part:0,color:u(c),mat:O.skin,bone:s("head"),face:1,uv:C,k:.05}),t.chin>0&&l.sphere(x(v.clone().addScaledVector(f,-t.headR[1]*.85).addScaledVector(p,t.headR[2]*.62)),t.headR[0]*.25*t.chin,{part:0,color:u(c),mat:O.skin,bone:s("head"),face:1,uv:C,k:.04}),!t.toon)for(let y of[1,-1])l.sphere(x(v.clone().add(N(y*t.headR[0]*.55,0,0)).addScaledVector(f,-t.headR[1]*.25).addScaledVector(p,t.headR[2]*.62)),t.headR[0]*.3,{color:(L,A,z)=>u(c)(L,A,z).lerp(m,.45),mat:O.skin,bone:s("head"),face:1,uv:C,k:.05});let P=v.clone().addScaledVector(p,t.headR[2]*.95).addScaledVector(f,-t.headR[1]*.12),b=t.noseSize*t.headR[0],E={color:(y,L,A)=>u(c)(y,L,A).lerp(Z("#ec6a66"),.45),mat:O.skin,bone:s("head"),face:1,uv:C};if(t.toon){let y=t.headR[0]*(t.nose==="bulb"?.19:t.nose==="button"?.12:.15)*Math.min(1.3,t.noseSize),L=P.clone().addScaledVector(p,y*.35),A={part:1,color:c.clone().lerp(Z(t.noseCol||"#d9786c"),t.noseCol?1:.35),mat:O.skin,bone:s("head"),k:.004,lid:7};t.nose==="long"||t.nose==="hook"?l.ellipsoid(x(L.clone().addScaledVector(f,-y*.25)),[y*.8,y*1.35,y*.9],S,A):l.sphere(x(L),y,A)}else t.nose==="bulb"?(l.cone(x(P.clone().addScaledVector(f,b*.25)),x(P.clone().addScaledVector(p,b*.42).addScaledVector(f,-b*.12)),b*.13,b*.2,{...E,k:.03}),l.sphere(x(P.clone().addScaledVector(p,b*.45).addScaledVector(f,-b*.16)),b*.24,{...E,k:.02})):t.nose==="hook"?(l.cone(x(P.clone().addScaledVector(f,b*.35)),x(P.clone().addScaledVector(p,b*.55).addScaledVector(f,-b*.2)),b*.12,b*.09,{...E,k:.025}),l.sphere(x(P.clone().addScaledVector(p,b*.48).addScaledVector(f,-b*.28)),b*.1,{...E,k:.02})):t.nose==="long"?l.cone(x(P.clone().addScaledVector(f,b*.3)),x(P.clone().addScaledVector(p,b*.7).addScaledVector(f,-b*.25)),b*.11,b*.13,{...E,k:.03}):l.sphere(x(P.clone().addScaledVector(p,b*.12)),b*.16,{...E,k:.03});let R=[];for(let y of[1,-1]){let L=v.clone().add(N(y*t.headR[0]*.98,0,0)).addScaledVector(f,-t.headR[1]*.08).addScaledVector(p,-t.headR[2]*.08),A=t.ear*t.headR[1]*(t.toon?.3:.42),z=new X().setFromEuler(new le(0,y*.35,y*-.12)),Q={part:t.toon?2:0,color:t.toon?c:(J,ie,ae)=>u(c)(J,ie,ae).lerp(Z("#f0857c"),.4),mat:O.skin,bone:s("head"),ink:1.1,lid:t.toon?6:void 0};l.ellipsoid(x(L.clone().add(N(y*A*.18,0,0))),[A*.28,A,A*.72],z,{...Q,k:.02}),t.toon||l.torus(x(L.clone().add(N(y*A*.36,A*.05,0))),A*.62,A*.17,new X().setFromEuler(new le(0,0,Math.PI/2)).premultiply(z),{...Q,k:.015}),l.sphere(x(L.clone().add(N(y*A*.5,-A*.08,A*.05))),A*(t.toon?.22:.3),{op:"sub",part:t.toon?2:0,k:.02,color:t.toon?c.clone().lerp(Z("#c05060"),.35):"#5a1e2c",noLine:!!t.toon}),R.push(L.clone().add(N(y*A*.5,-A*.08,A*.05)))}let T=Z(t.hairColor),D=t.costume.some(y=>["cap","strawhat","hanky","bicorne","veil"].includes(y.type)),U={part:t.toon?4:0,color:t.toon?T:(y,L,A)=>T.clone().lerp(Z("#ffffff"),.08*Math.max(0,Math.sin(L*300+y*40))),mat:O.hair,bone:s("head"),k:.02,ink:1.1};if(t.hair==="tufts"){for(let y of[1,-1])for(let L=0;L<3;L++)l.sphere(x(v.clone().add(N(y*t.headR[0]*(.92-L*.06),t.headR[1]*(.18+L*.16),-t.headR[2]*(.1+L*.12)))),t.headR[0]*(.24-L*.03),U);if(!D)for(let y=0;y<3;y++)l.sphere(x(v.clone().add(N((y-1)*t.headR[0]*.2,t.headR[1]*.9,t.headR[2]*(.25-Math.abs(y-1)*.1)))),t.headR[0]*.16,U)}if(t.hair==="fringe")for(let y=0;y<11;y++){let L=Math.PI*(.62+y*.075);l.sphere(x(v.clone().add(N(Math.cos(L)*t.headR[0]*.98,-t.headR[1]*.05+Math.sin(y*1.7)*.01,Math.sin(L)*t.headR[2]*.98))),t.headR[0]*.2,U)}if(t.hair==="bun"&&(l.ellipsoid(x(v.clone().addScaledVector(f,t.headR[1]*.25)),[t.headR[0]*1.03,t.headR[1]*.8,t.headR[2]*1.03],S,{...U,clip:ge(x(v.clone().addScaledVector(f,t.headR[1]*.75).addScaledVector(p,-t.headR[2]*.25)),[t.headR[0]*2.4,t.headR[1]*1.3,t.headR[2]*2.2])}),l.sphere(x(v.clone().addScaledVector(f,t.headR[1]*.55).addScaledVector(p,-t.headR[2]*.95)),t.headR[0]*.42,U)),t.hair==="curly")for(let y=0;y<16;y++){let L=y/16*Math.PI*2,A=.3+y%3*.2;l.sphere(x(v.clone().add(N(Math.cos(L)*t.headR[0]*.8,t.headR[1]*(.55+.3*Math.sin(y*2.3)),Math.sin(L)*t.headR[2]*.8-.02))),t.headR[0]*(.28+.05*Math.sin(y*5.1)),{...U,bone:s("hair")})}if(t.hair==="pompadour"&&(l.ellipsoid(x(v.clone().addScaledVector(f,t.headR[1]*.45).addScaledVector(p,-t.headR[2]*.1)),[t.headR[0]*1.02,t.headR[1]*.62,t.headR[2]*1.02],S,{...U,bone:s("hair")}),l.cone(x(v.clone().addScaledVector(f,t.headR[1]*.85)),x(v.clone().addScaledVector(f,t.headR[1]*1.05).addScaledVector(p,t.headR[2]*1.05)),t.headR[0]*.55,t.headR[0]*.28,{...U,bone:s("hair")})),t.hair==="afro")for(let y=0;y<26;y++){let L=y/26,A=L*Math.PI*2*3.3,z=Math.acos(1-L*1.5);l.sphere(x(v.clone().add(N(Math.sin(z)*Math.cos(A)*t.headR[0]*1.15,Math.cos(z)*t.headR[1]*1+t.headR[1]*.35,Math.sin(z)*Math.sin(A)*t.headR[2]*1.1-.03))),t.headR[0]*.42,{...U,bone:s("hair"),k:.04})}if(t.hair==="curlers"){l.ellipsoid(x(v.clone().addScaledVector(f,t.headR[1]*.2)),[t.headR[0]*1.04,t.headR[1]*.85,t.headR[2]*1.04],S,{...U,clip:ge(x(v.clone().addScaledVector(f,t.headR[1]*.75).addScaledVector(p,-t.headR[2]*.2)),[t.headR[0]*2.4,t.headR[1]*1.3,t.headR[2]*2.2])});let y=["#ff7fa3","#7fc8ff","#ffd34a","#9dfc8a"];for(let L=0;L<9;L++){let A=-.9+L%5*.45,z=Math.floor(L/5),Q=t.headR[0]*(1.02-z*.1),J=t.headR[1]*(.55+z*.3),ie=v.clone().add(N(Math.sin(A)*Q,0,Math.cos(A)*Q*(z?.4:-.2))).addScaledVector(f,J);l.cone(x(ie.clone().add(N(-.03,0,0))),x(ie.clone().add(N(.03,0,0))),.022,.022,{color:y[L%4],mat:O.cloth,bone:s("head"),k:.004,lid:47})}}if(t.moustache&&t.toon){let y=t.headR[0]*.18*t.noseSize,L=P.clone().addScaledVector(f,-y*.95).addScaledVector(p,y*.15),A=t.moustache==="walrus"?1.25:t.moustache==="comb"?.9:.7;for(let z of[1,-1])l.ellipsoid(x(L.clone().add(N(z*t.headR[0]*.2*A,-t.headR[1]*.02,0))),[t.headR[0]*.24*A,t.headR[1]*.11,t.headR[2]*.12],new X().setFromEuler(new le(0,0,z*-.22)).premultiply(S),{part:3,color:t.moustacheColor||t.hairColor,mat:O.hair,bone:s("head"),k:.01,ink:1,lid:8})}else if(t.moustache){let y=P.clone().addScaledVector(p,b*.32).addScaledVector(f,-b*.42),L=t.moustache==="walrus"?1.25:t.moustache==="comb"?.95:.7;for(let A of[1,-1])l.ellipsoid(x(y.clone().add(N(A*b*.2*L,-b*.04,-b*.02))),[b*.26*L,b*.09,b*.11],new X().setFromEuler(new le(0,0,A*-.3)),{color:t.moustacheColor||t.hairColor,mat:O.hair,bone:s("head"),k:.012,ink:.8})}for(let y of["L","R"]){let L=y==="L"?1:-1;l.cone(x(r["arm"+y]),x(r["fore"+y]),t.armR[0],t.armR[1],{...h.skin,bone:s("arm"+y),k:.035}),l.cone(x(r["fore"+y]),x(r["hand"+y]),t.armR[1],t.armR[2],{...h.skin,bone:s("fore"+y),k:.03});let A=r["hand"+y].clone().sub(r["fore"+y]).normalize(),z=r["hand"+y].clone().addScaledVector(A,t.hand*.55),Q=new X().setFromUnitVectors(N(0,-1,0),A);l.ellipsoid(x(z),[t.hand*.6,t.hand*.62,t.hand*.3],Q,{...h.skin,bone:s("hand"+y),k:.025});let J=new w().crossVectors(A,N(0,0,1)).normalize();J.lengthSq()<.1&&J.set(1,0,0);for(let ae=0;ae<3;ae++){let de=z.clone().addScaledVector(A,t.hand*.45).addScaledVector(J,(ae-1)*t.hand*.4),Ae=de.clone().addScaledVector(A,t.hand*(.55+(ae===1?.1:0))).addScaledVector(N(0,0,1),t.hand*.1);l.cone(x(de),x(Ae),t.hand*.24,t.hand*.22,{...h.skin,bone:s("hand"+y),k:.012})}let ie=z.clone().addScaledVector(J,L*t.hand*.5).addScaledVector(N(0,0,1),t.hand*.15);l.cone(x(ie),x(ie.clone().addScaledVector(A,t.hand*.4).addScaledVector(N(0,0,1),t.hand*.3)),t.hand*.17,t.hand*.13,{...h.skin,bone:s("hand"+y),k:.012})}for(let y of["L","R"]){l.cone(x(r["thigh"+y]),x(r["shin"+y]),t.legR[0],t.legR[1],{...h.skin,bone:s("thigh"+y),k:.05}),l.cone(x(r["shin"+y]),x(r["foot"+y]),t.legR[1],t.legR[2],{...h.skin,bone:s("shin"+y),k:.035});let L=r["foot"+y].clone().sub(r["shin"+y]).normalize();l.ellipsoid(x(r["shin"+y].clone().lerp(r["foot"+y],.3).addScaledVector(p,-t.legR[1]*.35)),[t.legR[1]*.85,t.legLen*.14,t.legR[1]*.85],new X().setFromUnitVectors(N(0,-1,0),L),{...h.skin,bone:s("shin"+y),k:.04});let A=r["foot"+y].clone().add(N(0,-.025,t.foot*.45));l.ellipsoid(x(A),[t.foot*.42,t.foot*.3,t.foot*.75],null,{...h.skin,bone:s("foot"+y),k:.03});for(let z=0;z<5;z++)l.sphere(x(A.clone().add(N((z-2)*t.foot*.17+(y==="L"?-.004:.004),-t.foot*.06,t.foot*.78-Math.abs(z-1)*t.foot*.06))),t.foot*(z===1?.14:.11),{...h.skin,bone:s("foot"+y),k:.012})}t.costume.forEach((y,L)=>fo(l,y,{J:r,B:s,s:t,up:f,fwd:p,tq:g,hc:v,hq:S,li:40+L}));let G=e.noGeo?null:t.toon?l.buildParts({h:e.h||.0095}):{0:l.build({h:e.h||.0095})};return{geo:G?G[0]:null,parts:G,rig:o,J:r,ears:R,hc:v,spec:t,mouth:P.clone().addScaledVector(p,b*.2).addScaledVector(f,-b*.65)}}function fo(i,e,{J:t,B:r,s:a,up:n,fwd:o,tq:s,hc:l,hq:c,li:d}){let m=typeof e.color=="function"?e.color:Z(e.color||"#ffffff"),u=a.toon&&["cap","strawhat","hanky","bicorne","headphones","glasses","tiara","veil"].includes(e.type),h=a.toon&&e.type==="shoes",f={part:u?5:h?6:void 0,color:m,mat:e.mat??O.cloth,ink:e.ink??1.1,k:e.k??.03,lid:e.lid??d,pat:e.pat,color2:e.color2},_=e.inflate??.012;if(e.type==="briefs"&&i.ellipsoid(x(t.hips.clone().addScaledVector(n,-.01)),[a.pelvis[0]+.08,a.pelvis[1]*1,a.pelvis[2]+.08],s,{...f,op:"paint",bones:[r("hips"),r("thighL"),r("thighR"),r("belly"),r("spine")],clip:ge(x(t.hips.clone().addScaledVector(n,-.03)),[.8,a.pelvis[1]*1.25,.8])}),e.type==="dress"||e.type==="swimsuit"){let p=t.neck.clone().addScaledVector(n,-.05),g=e.type==="dress"?t.hips.clone().addScaledVector(n,-(e.length??.32)):t.hips.clone().addScaledVector(n,-.06);if(i.cone(x(p),x(t.spine),a.chest[0]*.8+_,a.pelvis[0]*1.02+_,{...f,bone:r("chest")}),i.cone(x(t.spine),x(g),a.pelvis[0]*1.05+_+a.belly*.05,e.type==="dress"?a.pelvis[0]*(1.3+(e.flare??.4))+a.belly*.06:a.pelvis[0]+_,{...f,bone:r("hips"),k:.06}),i.cone(x(t.neck.clone().addScaledVector(n,-.02)),x(t.hips.clone().addScaledVector(n,-.1)),.45,.45,{...f,op:"paint",bones:[r("hips"),r("spine"),r("belly"),r("chest")],clip:ge(x(t.chest.clone().lerp(t.hips,.5).addScaledVector(n,-.02)),[.9,a.torsoLen*1.05,.9])}),e.sleeves)for(let v of["L","R"])i.cone(x(t["arm"+v]),x(t["arm"+v].clone().lerp(t["fore"+v],e.sleeves)),a.armR[0]+_*1.3,a.armR[1]+_*1.4,{...f,bone:r("arm"+v)})}if(e.type==="shirt"||e.type==="jacket"){let p=e.type==="jacket"?.12:.04;i.cone(x(t.neck.clone().addScaledVector(n,.02)),x(t.hips.clone().addScaledVector(n,-p)),.4,.4,{...f,op:"paint",bones:[r("hips"),r("spine"),r("chest"),r("belly"),r("armL"),r("armR")],clip:ge(x(t.chest.clone().lerp(t.hips,.5).addScaledVector(n,-p*.5)),[.9,a.torsoLen*1.25+p,.9])}),i.torus(x(t.hips.clone().addScaledVector(n,-p)),a.pelvis[0]+(a.belly>0?.02:.004),.012,s,{...f,bone:r("hips"),k:.012});for(let g of["L","R"]){let v=t["arm"+g].clone().lerp(t["fore"+g],e.sleeves??.45);i.sphere(x(t["arm"+g]),a.armR[0]*1.6,{...f,op:"paint",bones:[r("arm"+g),r("chest")]}),i.cone(x(t["arm"+g]),x(v),a.armR[0]+_*1.2,a.armR[1]+_*1.6,{...f,bone:r("arm"+g),k:.02})}e.collar&&i.torus(x(t.neck.clone().addScaledVector(n,-.02)),a.headR[0]*.42,.016,s,{...f,color:Z(e.collar),bone:r("chest"),k:.01})}if(e.type==="trousers"||e.type==="shorts"){let p=e.type==="shorts"?.42:.92,g=[r("hips"),r("thighL"),r("thighR"),r("shinL"),r("shinR")];i.ellipsoid(x(t.hips.clone().addScaledVector(n,-.02)),[a.pelvis[0]+.08,a.pelvis[1]*1.1,a.pelvis[2]+.08],s,{...f,op:"paint",bones:g});for(let v of["L","R"]){let S=t["thigh"+v],C=t["shin"+v],P=t["foot"+v],b=p<.5?S.clone().lerp(C,p*2):C.clone().lerp(P,(p-.5)*2);p<.5?i.cone(x(S),x(b),a.legR[0]+.05,a.legR[0]+.05,{...f,op:"paint"}):(i.cone(x(S),x(C),a.legR[0]+.05,a.legR[1]+.05,{...f,op:"paint"}),i.cone(x(C),x(b),a.legR[1]+.05,a.legR[2]+.05,{...f,op:"paint"}));let E=p<.5?S:C,R=p<.5?a.legR[0]*.9+a.legR[1]*.1:a.legR[2];i.torus(x(b),R+.008,.01,new X().setFromUnitVectors(N(0,1,0),b.clone().sub(E).normalize()),{...f,bone:r((p<.5?"thigh":"shin")+v),k:.01})}}if(e.type==="shoes")for(let p of["L","R"]){let g=t["foot"+p].clone().add(N(0,-.02,a.foot*.42));i.ellipsoid(x(g),[a.foot*.5,a.foot*.36,a.foot*.85],null,{...f,bone:r("foot"+p),k:.02})}if(e.type==="hanky"){i.ellipsoid(x(l.clone().addScaledVector(n,a.headR[1]*.18)),[a.headR[0]*1.06,a.headR[1]*.92,a.headR[2]*1.06],c,{...f,bone:r("head"),clip:ge(x(l.clone().addScaledVector(n,a.headR[1]*(a.toon?.98:.72))),[.6,a.headR[1]*1.15,.6])});for(let[p,g]of[[1,1],[-1,1],[1,-1],[-1,-1]]){let v=l.clone().addScaledVector(n,a.headR[1]*.92).add(N(p*a.headR[0]*.78,0,g*a.headR[2]*.78));i.ellipsoid(x(v),[a.headR[0]*.17,a.headR[0]*.09,a.headR[0]*.13],Ye(g*20,0,p*-35),{...f,bone:r("head"),k:.01})}}if(e.type==="strawhat"){let p=l.clone().addScaledVector(n,a.headR[1]*(e.lift??.62));i.ellipsoid(x(p),[a.headR[0]*(e.brim??1.9),a.headR[1]*.06,a.headR[2]*(e.brim??1.9)],Ye(e.tilt??-8,0,e.roll??-5),{...f,bone:r("head"),k:.01}),i.ellipsoid(x(p.clone().addScaledVector(n,a.headR[1]*.25)),[a.headR[0]*.98,a.headR[1]*.42,a.headR[2]*.98],Ye(e.tilt??-8,0,e.roll??-5),{...f,bone:r("head"),k:.02}),e.band&&i.torus(x(p.clone().addScaledVector(n,a.headR[1]*.1)),a.headR[0]*.98,a.headR[1]*.08,Ye(e.tilt??-8,0,e.roll??-5),{...f,color:Z(e.band),bone:r("head"),k:.005})}if(e.type==="cap"){let p=l.clone().addScaledVector(n,a.headR[1]*(a.toon?.86:.7));i.box(x(p),[a.headR[0]*2.05,a.headR[1]*.5,a.headR[2]*1.6],.02,s,{...f,bone:r("head"),k:.015}),e.band&&i.box(x(p.clone().addScaledVector(n,-a.headR[1]*.18)),[a.headR[0]*2.1,a.headR[1]*.12,a.headR[2]*1.65],.01,s,{...f,color:Z(e.band),bone:r("head"),k:.005})}if(e.type==="chain"){let p=t.chest.clone().addScaledVector(n,.05).addScaledVector(o,a.chest[2]*.85);i.torus(x(p.clone().addScaledVector(n,.03)),a.chest[0]*.55,.006,new X().setFromEuler(new le(-1.15,0,0)).premultiply(s),{color:"#e8b33a",mat:O.metal,ink:.4,bone:r("chest"),k:.004}),i.cone(x(p.clone().addScaledVector(n,-.03)),x(p.clone().addScaledVector(n,-.075).addScaledVector(o,.015)),.014,.005,{color:"#d9342b",mat:O.cloth,ink:.6,bone:r("chest"),k:.004})}if(e.type==="glasses")for(let p of[1,-1])i.torus(x(l.clone().add(N(p*a.headR[0]*.36,0,0)).addScaledVector(n,a.headR[1]*.12).addScaledVector(o,a.headR[2]*.97)),a.headR[0]*.22,.008,Ye(90,0,0),{part:a.toon?5:0,color:e.color||"#1d1820",mat:O.metal,ink:.4,bone:r("head"),k:.004});if(e.type==="headphones"){for(let p of[1,-1]){let g=l.clone().add(N(p*a.headR[0]*1.12,0,0)).addScaledVector(n,-a.headR[1]*.05);i.cone(x(g.clone().add(N(-p*.01,0,0))),x(g.clone().add(N(p*.05,0,0))),.075,.07,{...f,color:Z(e.color||"#e8432f"),mat:O.rubber,bone:r("head"),k:.01}),i.sphere(x(g.clone().add(N(p*.055,0,0))),.05,{...f,color:Z("#1d1820"),mat:O.rubber,bone:r("head"),k:.01,lid:(f.lid||40)+1})}i.torus(x(l.clone().addScaledVector(n,a.headR[1]*.25)),a.headR[0]*1.12,.018,new X().setFromEuler(new le(0,0,Math.PI/2)),{...f,color:Z("#c9c2b6"),mat:O.metal,bone:r("head"),k:.006,clip:ge(x(l.clone().addScaledVector(n,a.headR[1]*.7)),[.6,a.headR[1]*1.2,.6])})}if(e.type==="socks")for(let p of["L","R"])i.cone(x(t["shin"+p].clone().lerp(t["foot"+p],.55)),x(t["foot"+p]),a.legR[2]+.012,a.legR[2]+.012,{...f,op:"paint",bones:[r("shin"+p),r("foot"+p)]});if(e.type==="vest"&&i.cone(x(t.chest.clone().addScaledVector(n,.06)),x(t.hips.clone().addScaledVector(n,-.02)),.4,.4,{...f,op:"paint",pat:[2,60],color2:Z("#e8e2d6"),bones:[r("hips"),r("spine"),r("chest"),r("belly")],clip:ge(x(t.chest.clone().lerp(t.hips,.5)),[.9,a.torsoLen*1.1,.9])}),e.type==="cigar"){let p=l.clone().addScaledVector(n,-a.headR[1]*.45).addScaledVector(o,a.headR[2]*.9).add(N(-a.headR[0]*.3,0,0));i.cone(x(p),x(p.clone().addScaledVector(o,.1).add(N(-.04,-.02,0))),.014,.016,{color:"#6a3c22",mat:O.wood,bone:r("head"),k:.004,lid:48}),i.sphere(x(p.clone().addScaledVector(o,.105).add(N(-.042,-.021,0))),.012,{color:"#ff6a3a",mat:13,bone:r("head"),k:.003,lid:49})}if(e.type==="tiara"){let p=l.clone().addScaledVector(n,a.headR[1]*.62).addScaledVector(o,a.headR[2]*.3);i.torus(x(p),a.headR[0]*.7,.012,Ye(-20,0,0),{part:a.toon?5:0,color:"#ffd34a",mat:O.metal,bone:r("head"),k:.004,lid:50});for(let g=-2;g<=2;g++)i.sphere(x(p.clone().add(N(g*a.headR[0]*.28,.03-Math.abs(g)*.012,a.headR[2]*.5-Math.abs(g)*.02))),.02-Math.abs(g)*.003,{part:a.toon?5:0,color:g?"#ffd34a":"#e2302a",mat:O.metal,bone:r("head"),k:.004,lid:50})}if(e.type==="veil"&&(i.ellipsoid(x(l.clone().addScaledVector(n,a.headR[1]*.1).addScaledVector(o,-a.headR[2]*.1)),[a.headR[0]*1.15,a.headR[1]*1.15,a.headR[2]*1.12],c,{...f,clip:ge(x(l.clone().addScaledVector(o,-a.headR[2]*.55).addScaledVector(n,-a.headR[1]*.2)),[.6,a.headR[1]*3,a.headR[2]*1.6])}),i.torus(x(l.clone().addScaledVector(o,a.headR[2]*.2).addScaledVector(n,a.headR[1]*.05)),a.headR[0]*.95,.03,new X().setFromUnitVectors(N(0,1,0),o),{...f,color:Z("#fbf7ee"),bone:r("head"),k:.01,lid:(f.lid||40)+1})),e.type==="bicorne"){let p=l.clone().addScaledVector(n,a.headR[1]*.78);i.ellipsoid(x(p),[a.headR[0]*1.9,a.headR[1]*.55,a.headR[2]*.42],s,{...f,color:Z("#141018"),bone:r("head"),k:.02,clip:ge(x(p.clone().addScaledVector(n,a.headR[1]*.4)),[a.headR[0]*4,a.headR[1]*.9,a.headR[2]])}),i.sphere(x(p.clone().addScaledVector(n,a.headR[1]*.28).addScaledVector(o,a.headR[2]*.36)),a.headR[0]*.2,{...f,color:Z("#d9342b"),bone:r("head"),k:.004,lid:(f.lid||40)+1}),i.sphere(x(p.clone().addScaledVector(n,a.headR[1]*.28).addScaledVector(o,a.headR[2]*.42)),a.headR[0]*.1,{...f,color:Z("#2a62c4"),bone:r("head"),k:.002,lid:(f.lid||40)+2})}if(e.type==="bandolier"){let p=t.armR.clone().addScaledVector(n,.02),g=t.hips.clone().add(N(a.hipW*.45,0,0));i.cone(x(p),x(g),.48,.48,{...f,color:Z("#fbf7ee"),op:"paint",bones:[r("chest"),r("spine"),r("belly"),r("hips")],clip:{c:x(p.clone().lerp(g,.5)),half:[.03,.4,.4],round:0,m:co(new X().setFromUnitVectors(N(0,1,0),g.clone().sub(p).normalize()))}})}if(e.type==="stripe")for(let p of["L","R"]){let g=p==="L"?1:-1;i.box(x(t["thigh"+p].clone().lerp(t["foot"+p],.5).add(N(g*(a.legR[0]+.03),0,0))),[.06,a.legLen*1.1,.03],0,null,{...f,color:Z(e.color||"#d9342b"),op:"paint",bones:[r("thigh"+p),r("shin"+p)]})}if(e.type==="briefcase"){let p=t.handR.clone().addScaledVector(t.handR.clone().sub(t.foreR).normalize(),a.hand*1.6);i.box(x(p.clone().add(N(0,-.1,0))),[.09,.24,.32],.02,null,{color:"#5a3a24",mat:O.wood,bone:r("handR"),k:.006,lid:51}),i.torus(x(p.clone().add(N(0,.04,0))),.035,.008,Ye(0,0,90),{color:"#c9c2b6",mat:O.metal,bone:r("handR"),k:.004,lid:52})}if(e.type==="camera"){let p=t.chest.clone().addScaledVector(o,a.chest[2]+.04).addScaledVector(n,-.04);i.box(x(p),[.15,.1,.07],.012,s,{color:"#1d1820",mat:O.rubber,bone:r("chest"),k:.006,lid:53}),i.cone(x(p.clone().addScaledVector(o,.03)),x(p.clone().addScaledVector(o,.08)),.032,.03,{color:"#c9c2b6",mat:O.metal,bone:r("chest"),k:.004,lid:54}),i.torus(x(t.neck.clone().addScaledVector(n,-.06)),a.chest[0]*.6,.006,new X().setFromEuler(new le(-1.15,0,0)).premultiply(s),{color:"#3a2418",mat:O.cloth,bone:r("chest"),k:.003,lid:55})}e.type==="scarf"&&(i.ellipsoid(x(l.clone().addScaledVector(n,a.headR[1]*.2)),[a.headR[0]*1.1,a.headR[1]*.92,a.headR[2]*1.1],c,{...f,clip:ge(x(l.clone().addScaledVector(n,a.headR[1]*.7).addScaledVector(o,-a.headR[2]*.15)),[a.headR[0]*2.5,a.headR[1]*1.3,a.headR[2]*2.2])}),i.cone(x(l.clone().addScaledVector(n,-a.headR[1]*.75).addScaledVector(o,-a.headR[2]*.2)),x(l.clone().addScaledVector(n,-a.headR[1]*1.05).addScaledVector(o,-a.headR[2]*.6).add(N(a.headR[0]*.4,0,0))),.03,.02,{...f,bone:r("head"),k:.01})),e.type==="apron"&&i.box(x(t.spine.clone().addScaledVector(o,a.pelvis[2]*.9).addScaledVector(n,-.06)),[a.pelvis[0]*1.6,a.torsoLen*.95,.2],.02,s,{...f,op:"paint",bones:[r("hips"),r("spine"),r("belly"),r("chest")]}),e.type==="ring"&&i.torus(x(t.hips.clone().addScaledVector(n,.06)),a.pelvis[0]+.07,.06,s,{...f,mat:O.rubber,bone:r("hips"),k:.01,pat:[7,8],color2:Z("#fdf6ea")}),e.type==="custom"&&e.build(i,{J:t,B:r,s:a,up:n,fwd:o,tq:s,hc:l,hq:c,O:f})}var K=(i,e,t)=>new w(i,e,t),H=i=>[i.x,i.y,i.z],Ze=i=>new Y(i),ki={root:[0,0,0],w0:[0,.05,0],w1:[0,.13,.008],w2:[0,.22,.004],w3:[0,.3,-.006],head:[0,.36,0],quiff:[0,.48,.03],armL:[.07,.29,.01],handL:[.15,.24,.04],armR:[-.07,.29,.01],handR:[-.15,.24,.04],tail:[0,.2,-.07]},po=[0,.43,.01];function zi(i={}){let e=Object.fromEntries(Object.entries(ki).map(([h,f])=>[h,K(...f)])),t=Object.keys(ki),r=h=>t.indexOf(h),a=Ze(i.skin||"#ff86a8"),n=i.baffo?Ze("#3f6fe0"):Ze("#f26a92"),o=i.baffo?Ze("#1d1820"):Ze("#fbf7ee"),s=new qe,l={part:0,color:a,mat:O.skin,pat:[1,34],color2:n};s.sphere(H(e.w0.clone().add(K(0,-.005,0))),.085,{...l,bone:r("w0"),k:.04}),s.cone(H(e.w0),H(e.w1),.082,.075,{...l,bone:r("w0"),k:.04}),s.cone(H(e.w1),H(e.w2),.075,.07,{...l,bone:r("w1"),k:.04}),s.cone(H(e.w2),H(e.w3),.07,.066,{...l,bone:r("w2"),k:.04}),s.cone(H(e.w3),H(e.head),.066,.075,{...l,bone:r("w3"),k:.04});let c=K(...po),d=[.115,.105,.105],m=(h,f,_)=>{let p=K(h,f,_).sub(c);return p.z>-d[2]*.1?[.5+p.x/(d[0]*1.9),.5+(p.y+d[1]*.08)/(d[1]*1.9)]:[-4,-4]};s.ellipsoid(H(c),d,null,{color:a,mat:O.skin,bone:r("head"),face:1,uv:m,k:.05}),s.cone(H(e.w1.clone().add(K(0,.02,0))),H(e.w3.clone().add(K(0,.02,0))),.11,.1,{op:"paint",color:o,mat:O.cloth,bones:[r("w1"),r("w2"),r("w3")],lid:41,clip:ge(H(e.w2.clone().add(K(0,.01,-.04))),[.3,.2,.14])});for(let h of[1,-1])s.cone(H(e.w2.clone().add(K(h*.035,.02,-.06))),H(e.w0.clone().add(K(h*.05,-.02,-.1))),.026,.034,{part:8,color:o,mat:O.cloth,bone:r("tail"),k:.015,lid:41});for(let h of[1,-1])s.ellipsoid(H(e.w3.clone().add(K(h*.032,.035,.082))),[.034,.024,.016],new X().setFromEuler(new le(0,0,h*.25)),{part:5,color:"#e2302a",mat:O.cloth,bone:r("w3"),k:.006,lid:42});s.sphere(H(e.w3.clone().add(K(0,.035,.09))),.016,{part:5,color:"#c4201c",mat:O.cloth,bone:r("w3"),k:.004,lid:42});let u={part:4,color:(h,f,_)=>Math.abs((f-c.y)*1.2-(_-c.z)*.9-.11)<.012?Ze("#6a5f86"):Ze("#16121c"),mat:O.hair,bone:r("quiff"),k:.03,lid:43};if(s.ellipsoid(H(c.clone().add(K(0,.062,-.025))),[.104,.05,.09],null,{...u,bone:r("head")}),s.cone(H(c.clone().add(K(0,.085,-.05))),H(c.clone().add(K(0,.15,.06))),.062,.05,u),s.sphere(H(c.clone().add(K(0,.135,.085))),.05,u),s.sphere(H(c.clone().add(K(0,.105,.13))),.03,{...u,op:"sub",k:.01,noLine:!0,color:"#16121c"}),i.baffo){for(let h of[1,-1])s.ellipsoid(H(c.clone().add(K(h*.045,-.045,.1))),[.055,.02,.025],new X().setFromEuler(new le(0,0,h*-.35)),{part:3,color:"#16121c",mat:O.hair,bone:r("head"),k:.008,lid:45});s.cone(H(e.w0.clone().add(K(0,-.04,0))),H(e.w1.clone().add(K(0,.01,0))),.125,.085,{part:8,color:"#fbf7ee",mat:O.cloth,bone:r("w0"),k:.02,lid:46}),s.sphere(H(e.w3.clone().add(K(0,-.02,.075))),.022,{part:5,color:"#ffd34a",mat:3,bone:r("w3"),k:.004,lid:47})}for(let h of["L","R"]){let f=h==="L"?1:-1;s.cone(H(e["arm"+h]),H(e["hand"+h]),.018,.015,{color:a,mat:O.skin,bone:r("arm"+h),k:.02}),s.sphere(H(e["hand"+h].clone().add(K(f*.015,-.01,.01))),.032,{part:6,color:o,mat:O.cloth,bone:r("hand"+h),k:.01,lid:44}),s.cone(H(e["hand"+h].clone().add(K(f*.03,-.01,.02))),H(e["hand"+h].clone().add(K(f*.06,.01,.035))),.012,.01,{part:6,color:o,mat:O.cloth,bone:r("hand"+h),k:.008,lid:44})}return s}function Gi(i,e={}){let t=new qe,r=i,a=()=>(r=r*16807%2147483647)/2147483647,n=e.n??7,o=e.w??2.4,s=e.tower??.6,l="#fbf8f0";for(let c=0;c<n;c++){let d=c/(n-1)-.5,m=.32+.22*a()+s*.5*Math.exp(-d*d*18);t.sphere([d*o,m*.55,(a()-.5)*.4],m,{color:l,k:.12,mat:8})}for(let c=0;c<Math.round(n*.6);c++){let d=(a()-.5)*o*.6,m=.5+s*(.6+a()*.8);t.sphere([d,m,(a()-.5)*.3],.25+.2*a()+s*.15,{color:l,k:.1,mat:8})}if(s>.5)for(let c=0;c<4;c++)t.sphere([(a()-.5)*.5,1.2+s*.9+c*.25,(a()-.5)*.3],.38-c*.05,{color:l,k:.12,mat:8});return t.box([0,-.5,0],[o*3,1,3],0,null,{op:"sub",k:.04,color:l,noLine:!0}),t}var ei=i=>i&&i.isVector3?[i.x,i.y,i.z]:i;function Hi(i){let e,t={},r=[];if(i.kind==="bather"){let l=Vi(i.spec,{h:i.h});e=l.geo,t={ears:l.ears.map(ei),hc:ei(l.hc),mouth:ei(l.mouth)},r=Object.entries(l.parts||{}).filter(([c])=>+c!=0)}else if(i.kind==="worm"){let l=zi(i.o||{}).buildParts({h:i.h||.0055,aoStep:.008});e=l[0],r=Object.entries(l).filter(([c])=>+c!=0)}else i.kind==="cloud"&&(e=Gi(i.seed,i.o||{}).build({h:i.h||.045,aoStep:.07}));let a={},n=[];for(let l in e.attributes){let c=e.attributes[l];a[l]=[c.array,c.itemSize],n.push(c.array.buffer)}let o=e.index.array;n.push(o.buffer);let s=r.map(([l,c])=>{let d={};for(let m in c.attributes){let u=c.attributes[m];d[m]=[u.array,u.itemSize],n.push(u.array.buffer)}return n.push(c.index.array.buffer),{part:+l,attrs:d,index:c.index.array}});return{res:{attrs:a,index:o,meta:t,parts:s},transfer:n}}var fp=import.meta.url.includes("/src/");self.onmessage=i=>{try{let{res:e,transfer:t}=Hi(i.data.job);self.postMessage({res:e},t)}catch(e){self.postMessage({error:String(e&&e.stack||e)})}};/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
