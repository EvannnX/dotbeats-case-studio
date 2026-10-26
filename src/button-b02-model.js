import * as T from 'three';
let K;export function setButtonKernel(k){K=k}
export const DEFAULT={capD:13,motorD:10,motorH:4,motorClear:.25,roof:1.2,plugT:3.3,protrusion:3,panelT:2,guideClear:.3,flangeD:15.6,flangeT:1,stemD:3,stopTravel:.4,switchGap:0,switchTravel:.25,switchHeight:5,wireW:2.4,wireRelief:1.2};
export const KEYS=[[-23.75004572,-22.25004445],[-3.75000762,-22.25004445],[16.25003048,-22.25004445],[-23.75004572,22.75004699],[-3.75000762,22.75004699],[16.25003048,22.75004699]];
export const MOUNTS=[[29.25005842,-24.25004851],[-29.25005944,.25000127],[29.25005842,25.00005156]];
export const POSTS=[[-6.8,7.6],[6.8,-7.6]];
export const PCB_TOP=-20.1999492;
export const FIELDS=[['键帽与马达',[['capD','键帽外径',12,14,.1],['protrusion','露出面板高度',2,4,.1],['roof','键帽顶厚',1,2,.1],['motorD','LRA1040 参考直径',9,11,.1],['motorH','LRA1040 参考厚度',3,5,.1],['motorClear','马达单边间隙',.15,.5,.05],['plugT','底托厚度',2.5,4,.1],['wireW','出线槽宽度',1.5,3,.1],['wireRelief','焊点避空深度 · 暂定',.5,1.8,.1]]],['导向与防脱',[['panelT','面板厚度',1.5,3,.1],['guideClear','导向单边间隙',.2,.5,.05],['flangeD','防脱肩外径',15,16,.1],['flangeT','防脱肩厚度',.8,1.2,.1],['stemD','顶杆直径',2.8,3.5,.1],['stopTravel','机械限位行程 · 待验证',.25,.6,.05]]],['PCB 上的轻触开关',[['switchHeight','开关总高 · 图纸为 5 mm',4.8,5.6,.1],['switchGap','静止顶杆间隙',0,.3,.05],['switchTravel','开关触发行程 · 暂定',.1,.4,.05]]]];
export function cleanButton(raw){let p={...DEFAULT};for(const[,fs]of FIELDS)for(const[k,,lo,hi]of fs){let v=Number(raw[k]);if(raw[k]!==undefined&&Number.isFinite(v))p[k]=Math.max(lo,Math.min(hi,v))}return p}
export function dimensions(p){const top=p.panelT+p.protrusion,cavityD=p.motorD+2*p.motorClear,seat=top-p.roof-p.motorH-p.motorClear,bottom=seat-p.plugT,tip=PCB_TOP+p.switchHeight+p.switchGap,outer=19.2,stopZ=-2.7-p.flangeT-p.stopTravel;return{top,cavityD,seat,bottom,tip,stemLength:bottom-tip,outer,stopZ,wall:(p.capD-cavityD)/2,trigger:p.switchGap+p.switchTravel,holeD:p.capD+2*p.guideClear}}
function brush(g){const raw=g.index?g.toNonIndexed():g,a=raw.attributes.position,v=[],t=[],map=new Map();for(let i=0;i<a.count;i++){let xyz=[a.getX(i),a.getY(i),a.getZ(i)],key=xyz.map(x=>Math.round(x*1e5)).join(',');let j=map.get(key);if(j===undefined){j=v.length/3;map.set(key,j);v.push(...xyz)}t.push(j)}let m=new K.Manifold(new K.Mesh({numProp:3,vertProperties:new Float32Array(v),triVerts:new Uint32Array(t)}));if(raw!==g)raw.dispose();g.dispose();return m}
function geom(m){let a=m.getMesh(),g=new T.BufferGeometry(),v=new Float32Array(a.numVert*3);for(let i=0;i<a.numVert;i++)for(let j=0;j<3;j++)v[i*3+j]=a.vertProperties[i*a.numProp+j];g.setAttribute('position',new T.BufferAttribute(v,3));g.setIndex(new T.BufferAttribute(a.triVerts,1));m.delete();let f=g.toNonIndexed();g.dispose();f.computeVertexNormals();return f}
function cyl(d,h,z,x=0,y=0){let g=new T.CylinderGeometry(d/2,d/2,h,96);g.rotateX(Math.PI/2);g.translate(x,y,z+h/2);return brush(g)}
function box(w,l,h,x,y,z){let g=new T.BoxGeometry(w,l,h);g.translate(x,y,z+h/2);return brush(g)}
function op(a,b,add=false){let c=add?a.add(b):a.subtract(b);a.delete();b.delete();return c}
export function buttonGeometry(p){const q=dimensions(p);let cap=cyl(p.capD,q.top-q.bottom,q.bottom);cap=op(cap,cyl(q.cavityD,q.top-p.roof-q.bottom+.1,q.bottom-.1));let shoulder=op(cyl(p.flangeD,p.flangeT,-2.7-p.flangeT),cyl(q.cavityD,p.flangeT+.2,-2.8-p.flangeT));cap=op(cap,shoulder,true);cap=op(cap,box(p.capD,p.wireW,1.8,p.capD/2,0,q.bottom-.1));
 let plug=cyl(q.cavityD-.2,p.plugT,q.bottom);plug=op(plug,cyl(p.stemD,q.stemLength+.1,q.tip),true);plug=op(plug,box(3,p.wireW,p.plugT+.2,q.cavityD/2-.2,0,q.bottom-.1));
 // Solder pocket is a design allowance, not a manufacturer measurement.
 plug=op(plug,box(4,3,p.wireRelief+.1,2,0,q.seat-p.wireRelief));
 let panel=op(box(24,24,p.panelT,0,0,0),cyl(q.holeD,p.panelT+2,-1));
 let guide=op(cyl(q.outer,1.2,q.stopZ-1.2),cyl(q.holeD,1.4,q.stopZ-1.3));
 guide=op(guide,box(q.outer,p.wireW+1,1.6,q.outer/2,.5,q.stopZ-1.3));
 let collar=op(cyl(18.8,2.5,-2.7),cyl(q.holeD,2.7,-2.8));
 for(const[x,y]of POSTS){guide=op(guide,cyl(4.4,6.3,-9,x,y),true);collar=op(collar,cyl(5.8,2.5,-2.7,x,y),true);collar=op(collar,cyl(2.4,3,-2.8,x,y));collar=op(collar,cyl(4.2,1.7,-1.8,x,y))}
 let frame=op(box(68,68,2.5,0,0,-9),box(62,24,3,6,0,-9.2));
 for(const[x,y]of KEYS){frame=op(frame,cyl(p.stemD+2*p.guideClear,3,-9.2,x,y));frame=op(frame,cyl(p.wireW+1,3,-9.2,x+8,y+1.5));const g=guide.translate([x,y,0]);frame=op(frame,g,true);for(const[a,b]of POSTS){frame=op(frame,cyl(2.4,7,-9.1,x+a,y+b));frame=op(frame,hex(4.5,1.8,-9.1,x+a,y+b))}}
 for(const[x,y]of MOUNTS)frame=op(frame,cyl(2.9,3,-9.2,x,y));
 let spacer=op(cyl(8,-9-PCB_TOP,PCB_TOP),cyl(2.9,14,PCB_TOP-.2));
 // A centering shoulder locates within the existing 5.2 mm PCB bore.
 let neck=op(cyl(4.9,1.6,PCB_TOP-1.6),cyl(2.9,2,PCB_TOP-1.8));spacer=op(spacer,neck,true);
 guide.delete();return{cap:geom(cap),plug:geom(plug),frame:geom(frame),collar:geom(collar),spacer:geom(spacer),panel:geom(panel)}}
function hex(across,h,z,x=0,y=0){const g=new T.CylinderGeometry(across/Math.sqrt(3),across/Math.sqrt(3),h,6);g.rotateX(Math.PI/2);g.translate(x,y,z+h/2);return brush(g)}
export function buttonChecks(p){const q=dimensions(p);return{...q,wallOK:q.wall>=1,shoulderOK:p.flangeD>=q.holeD+1&&p.flangeD<=16,stackOK:q.bottom<=-2.7-p.flangeT&&q.bottom-p.stopTravel>-6.5&&q.stemLength>3,strokeOK:q.trigger<=p.stopTravel,spacingOK:q.outer<20&&q.holeD<16.8,guideOK:p.guideClear>=.2,wireOK:p.wireRelief<=p.plugT-1.2&&p.wireW<q.cavityD-p.stemD-1,prototype:true}}
export function checkMovingClearance(p){const g=buttonGeometry(p),out={};for(const stroke of [0,p.stopTravel])for(const moving of ['cap','plug'])for(const fixed of ['frame','collar']){const a=brush(g[moving].clone()).translate([KEYS[0][0],KEYS[0][1],-stroke]);let b=brush(g[fixed].clone());if(fixed==='collar'){const tmp=b.translate([KEYS[0][0],KEYS[0][1],0]);b.delete();b=tmp}const intersection=a.intersect(b);out[`${moving}/${fixed}/${stroke}`]=intersection.volume();intersection.delete();a.delete();b.delete()}for(const v of Object.values(g))v.dispose();return out}
