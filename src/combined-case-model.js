import * as THREE from 'three';
import A from './assembly-data.json' with {type:'json'};
export {A};let kernel;export function setKernel(k){kernel=k;}const ADDITION=1,SUBTRACTION=0;
export const HARDWARE_PRESETS={"2": {"screwSize": 2, "clearD": 2.4, "headD": 4.2, "headDepth": 3.5, "insertOD": 3.6, "insertHole": 3.2, "insertL": 3, "screwL": 8}, "2.5": {"screwSize": 2.5, "clearD": 2.9, "headD": 5, "headDepth": 3.5, "insertOD": 4.6, "insertHole": 4, "insertL": 4, "screwL": 8}, "3": {"screwSize": 3, "clearD": 3.4, "headD": 6.2, "headDepth": 3.5, "insertOD": 4.6, "insertHole": 4, "insertL": 5.7, "screwL": 10}};
export const DEFAULTS={"width": 86.5, "length": 140, "height": 28, "wall": 2, "floor": 2, "lid": 2, "radius": 9, "buttonD": 13, "buttonGapX": 20.000038100076, "buttonGapY": 45.000091440182, "buttonX": 0, "buttonY": 0, "sideD": 12, "sideGap": 80, "pcbX": 1.059492768983, "pcbY": 3, "pcbZ": 4.2, "espX": 0, "espY": 0, "espZ": 0, "portClearance": 0.6, "postD": 8, "pilotD": 2.8, "batteryD": 18.7, "batteryL": 53.3, "batteryWireD": 21.7, "batteryX": 0, "batteryY": -55.5, "batteryClear": 0.3, "fitClear": 0.3, "lipDepth": 3, "screwSize": 2.5, "clearD": 2.9, "headD": 5, "headDepth": 3.5, "insertOD": 4.6, "insertHole": 4, "insertL": 4, "screwL": 8, "bossD": 10, "supportH": 8};
export const PORT={x:-.06976233844,y:30.61500054,z:1.05351562325,width:9.00682486587,height:2.16096579007};
export const ranges={width:[76,115,.5],length:[115,180,.5],height:[24,42,.5],wall:[1.5,3.5,.1],floor:[1.5,3,.1],lid:[1.5,3,.1],radius:[5,16,.5],buttonD:[8,16,.5],buttonGapX:[18,28,.5],buttonGapY:[35,60,.5],buttonX:[-10,10,.1],buttonY:[-10,10,.1],sideD:[8,14,.5],sideGap:[40,120,1],pcbX:[-6,6,.1],pcbY:[-20,20,.1],pcbZ:[3.8,9,.1],espX:[-5,5,.1],espY:[-5,5,.1],espZ:[0,8,.1],portClearance:[.3,1.5,.1],postD:[7,9,.1],pilotD:[2.4,4,.1],batteryD:[16,22,.1],batteryL:[45,65,.1],batteryWireD:[18.7,25,.1],batteryX:[-10,10,.1],batteryY:[-72,-42,.1],batteryClear:[.2,.8,.1],fitClear:[.2,.5,.05],lipDepth:[2,4,.25],screwSize:[2,3,.5],clearD:[2.2,4,.1],headD:[3.8,7,.1],headDepth:[2.5,4,.1],insertOD:[3,6,.1],insertHole:[2.8,5.5,.05],insertL:[2.5,7,.1],screwL:[6,14,.5],bossD:[9,11,.5],supportH:[7,10,.5]};
export function clean(input){const p={...DEFAULTS};for(const k in p){const v=Number(input[k]);if(Number.isFinite(v)&&input[k]!==undefined)p[k]=Math.min(ranges[k][1],Math.max(ranges[k][0],v))}p.screwSize=[2,2.5,3].reduce((a,b)=>Math.abs(b-p.screwSize)<Math.abs(a-p.screwSize)?b:a,2);return p}
export function holePositions(p){return A.mount_holes_local.map(([x,y])=>[x+p.pcbX,y+p.pcbY])}
export function espOrigin(p){return [p.pcbX+A.esp_local_origin[0]+p.espX,p.pcbY+A.esp_local_origin[1]+p.espY,p.pcbZ+A.esp_height_above_carrier+p.espZ]}
export function buttonPositions(p){const out=[];for(const y of [-p.buttonGapY/2,p.buttonGapY/2])for(const x of [-p.buttonGapX,0,p.buttonGapX])out.push([p.pcbX-3.750007620012+x+p.buttonX,p.pcbY+.25000127013+y+p.buttonY]);return out}
export function roundedShape(w,h,r){r=Math.min(r,w/2,h/2);const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.absarc(x+w-r,y+r,r,-Math.PI/2,0,false);s.lineTo(x+w,y+h-r);s.absarc(x+w-r,y+h-r,r,0,Math.PI/2,false);s.lineTo(x+r,y+h);s.absarc(x+r,y+h-r,r,Math.PI/2,Math.PI,false);s.lineTo(x,y+r);s.absarc(x+r,y+r,r,Math.PI,Math.PI*1.5,false);return s}
function extrude(shape,depth,z=0,bevel=0){const g=new THREE.ExtrudeGeometry(shape,{depth,steps:1,curveSegments:12,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3});g.translate(0,0,z);return g}
function brush(g){const raw=g.index?g.toNonIndexed():g;const pos=raw.attributes.position;const verts=[],tri=[],map=new Map();for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),key=[x,y,z].map(v=>Math.round(v*1e5)).join(',');let index=map.get(key);if(index===undefined){index=verts.length/3;map.set(key,index);verts.push(x,y,z)}tri.push(index)}const result=new kernel.Manifold(new kernel.Mesh({numProp:3,vertProperties:new Float32Array(verts),triVerts:new Uint32Array(tri)}));if(raw!==g)raw.dispose();g.dispose();return result}
function op(a,g,operation=SUBTRACTION){const b=brush(g);const result=operation===ADDITION?a.add(b):a.subtract(b);a.delete();b.delete();return result}
function toGeometry(s){const m=s.getMesh(),g=new THREE.BufferGeometry();const verts=new Float32Array(m.numVert*3);for(let i=0;i<m.numVert;i++)for(let j=0;j<3;j++)verts[i*3+j]=m.vertProperties[i*m.numProp+j];g.setAttribute('position',new THREE.BufferAttribute(verts,3));g.setIndex(new THREE.BufferAttribute(m.triVerts,1));s.delete();const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();return flat}
export function makeBase(p){const bh=p.height-p.lid-.25;let b=brush(extrude(roundedShape(p.width,p.length,p.radius),bh));b=op(b,extrude(roundedShape(p.width-2*p.wall,p.length-2*p.wall,p.radius-p.wall),bh+1,p.floor));
 for(const y of [-p.sideGap/2,p.sideGap/2]){const g=new THREE.CylinderGeometry((p.sideD+.6)/2,(p.sideD+.6)/2,p.wall+5,48);g.rotateZ(Math.PI/2);g.translate(-p.width/2,y,p.height/2);b=op(b,g)}
 const ep=espOrigin(p),port=extrude(roundedShape(PORT.width+2*p.portClearance,PORT.height+2*p.portClearance,1.4),p.wall+4);port.rotateY(Math.PI/2);port.rotateX(Math.PI/2);port.translate(p.width/2-p.wall-2,ep[1]-PORT.x,ep[2]+PORT.z);b=op(b,port);
 for(const[x,y]of holePositions(p)){const s=new THREE.Shape();s.absarc(0,0,p.postD/2,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,p.pilotD/2,0,Math.PI*2,true);s.holes.push(h);const g=extrude(s,Math.max(.2,p.pcbZ-p.floor)+.15,p.floor-.15);g.translate(x,y,0);b=op(b,g,ADDITION)}
 const q=batteryLayout(p);let holder=brush(cube(q.length,q.width,q.z-p.floor+.1,p.batteryX,p.batteryY,(q.z+p.floor-.1)/2));
 const cavity=new THREE.CylinderGeometry(q.r,q.r,q.innerLength,96);cavity.rotateZ(Math.PI/2);cavity.translate(p.batteryX,p.batteryY,q.z);holder=op(holder,cavity);
 holder=op(holder,cube(3,7,5,p.batteryX+q.length/2-.5,p.batteryY,q.z));
 for(const x of [-p.batteryL*.3,p.batteryL*.3])holder=op(holder,cube(5.5,q.width+2,1.5,p.batteryX+x,p.batteryY,p.floor+1.25));
 const combined=b.add(holder);b.delete();holder.delete();return toGeometry(addBaseScrews(combined,p))}
export function makeLid(p){const s=roundedShape(p.width,p.length,p.radius);for(const[x,y]of buttonPositions(p)){const h=new THREE.Path();h.absarc(x,y,(p.buttonD+.6)/2,0,Math.PI*2,true);s.holes.push(h)}let b=brush(extrude(s,p.lid,p.height-p.lid));return toGeometry(addLidScrews(b,p))}
export function evaluate(p){const holes=holePositions(p),ep=espOrigin(p),recess=p.width/2-(ep[0]+PORT.y),top=p.height-p.lid-Math.max(ep[2]+5.635,p.pcbZ+10.10005685),bottom=p.pcbZ-1.59995-p.floor;
 const solderGap=ep[2]+A.esp_board_bottom_z-(p.pcbZ+A.carrier_size[2]),bottomFeatureGap=ep[2]+A.esp_bottom_z-(p.pcbZ+A.carrier_size[2]);
 const envelope=bottomFeatureGap>=0&&Math.abs(p.pcbX)+A.carrier_size[1]/2<p.width/2-p.wall&&Math.abs(p.pcbY)+A.carrier_size[0]/2<p.length/2-p.wall&&top>0&&bottom>0;
 const buttonFits=buttonPositions(p).every(([x,y])=>Math.abs(x)+(p.buttonD+.6)/2<p.width/2-p.wall&&Math.abs(y)+(p.buttonD+.6)/2<p.length/2-p.radius);
 const postFits=holes.every(([x,y])=>Math.abs(x)+p.postD/2<p.width/2-p.wall&&Math.abs(y)+p.postD/2<p.length/2-p.wall)&&p.pcbZ>p.floor;
 const portZ=ep[2]+PORT.z,portFits=portZ-(PORT.height/2+p.portClearance)>p.floor&&portZ+PORT.height/2+p.portClearance<p.height-p.lid-.25;
 const sideFits=p.height/2-(p.sideD+.6)/2>p.floor&&p.height/2+(p.sideD+.6)/2<p.height-p.lid-.25&&p.sideGap/2+(p.sideD+.6)/2<p.length/2-p.radius;

 const actual=A.switches_local.map(([x,y])=>[x+p.pcbX,y+p.pcbY]);const buttonError=Math.max(...buttonPositions(p).map(([x,y])=>Math.min(...actual.map(([a,b])=>Math.hypot(x-a,y-b)))));
 return{fastener:fastenerCheck(p),solderGap,bottomFeatureGap,battery:batteryCheck(p),holes,recess,top,bottom,envelope,buttonFits,postFits,portFits,sideFits,portAligned:recess>=.2&&recess<=2.5,buttonError,stackHeight:ep[2]+5.635};}

function cube(w,h,d,x,y,z){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);return g}
export function batteryLayout(p){const r=p.batteryD/2+p.batteryClear;return {r,z:p.floor+(p.batterySeat??1)+r,innerLength:p.batteryL+.8,length:p.batteryL+4.8,width:2*r+4};}
export function batteryCheck(p){const q=batteryLayout(p),halfW=p.width/2-p.wall,halfL=p.length/2-p.wall,rr=Math.max(0,p.radius-p.wall);
 const corners=[-1,1].flatMap(a=>[-1,1].map(b=>[p.batteryX+a*q.length/2,p.batteryY+b*q.width/2]));
 const shellGap=Math.min(...corners.map(([x,y])=>{const dx=Math.abs(x)-(halfW-rr),dy=Math.abs(y)-(halfL-rr);return rr-Math.hypot(Math.max(dx,0),Math.max(dy,0))-Math.min(Math.max(dx,dy),0)}));
 const pcbGap=p.pcbY-A.carrier_size[0]/2-(p.batteryY+Math.max(q.width,p.batteryWireD)/2);
 const roofGap=p.height-p.lid-(q.z+Math.max(p.batteryD,p.batteryWireD)/2);
 const sideGap=p.batteryX-q.length/2-(-halfW);
 return{...q,shellGap,pcbGap,roofGap,sideGap,ok:shellGap>=.4&&pcbGap>=.5&&roofGap>=.4&&sideGap>=2&&p.batteryWireD>=p.batteryD};}


export function screwLayout(p){return {z:p.height-p.lid,points:[-1,1].flatMap(x=>[-1,1].map(y=>[x*(p.width/2-7.5),y*(p.length/2-10)])),pocketDepth:p.insertL+1,engagement:Math.min(p.insertL,p.headDepth+p.screwL-p.supportH),tipClearance:p.supportH+p.insertL+1-p.headDepth-p.screwL};}
function roundPost(d,h,x,y,z){const g=new THREE.CylinderGeometry(d/2,d/2,h,64);g.rotateX(Math.PI/2);g.translate(x,y,z+h/2);return g}
function addBaseScrews(b,p){for(const[x,y]of screwLayout(p).points){b=op(b,roundPost(p.bossD,p.supportH-p.floor+.1,x,y,p.floor-.1),ADDITION);b=op(b,roundPost(p.clearD,p.supportH+2,x,y,-1));b=op(b,roundPost(p.headD,p.headDepth+1,x,y,-1));}return b}
function addLidScrews(b,p){const q=screwLayout(p),w=p.width-2*(p.wall+p.fitClear),l=p.length-2*(p.wall+p.fitClear),r=p.radius-p.wall-p.fitClear;
 let lip=brush(extrude(roundedShape(w,l,r),p.lipDepth+.05,q.z-p.lipDepth));lip=op(lip,extrude(roundedShape(w-2.4,l-2.4,r-1.2),p.lipDepth+.3,q.z-p.lipDepth-.1));let c=b.add(lip);b.delete();lip.delete();b=c;
 for(const[x,y]of q.points){b=op(b,roundPost(p.bossD,q.z-p.supportH+.05,x,y,p.supportH),ADDITION);b=op(b,roundPost(p.insertHole,q.pocketDepth+.1,x,y,p.supportH-.1));}return b;}
export function fastenerCheck(p){const q=screwLayout(p),r=p.bossD/2,halfX=p.width/2-p.wall,halfY=p.length/2-p.wall,rr=p.radius-p.wall;
 const shell=q.points.every(([x,y])=>Math.hypot(Math.max(Math.abs(x)-(halfX-rr),0),Math.max(Math.abs(y)-(halfY-rr),0))+r<rr-.1);
 const rectGap=(x,y,cx,cy,hx,hy)=>Math.hypot(Math.max(Math.abs(x-cx)-hx,0),Math.max(Math.abs(y-cy)-hy,0))-r;
 const battery=batteryLayout(p);const batteryGap=Math.min(...q.points.map(([x,y])=>rectGap(x,y,p.batteryX,p.batteryY,battery.length/2,battery.width/2)));
 const pcbGap=Math.min(...q.points.map(([x,y])=>rectGap(x,y,p.pcbX,p.pcbY,A.carrier_size[1]/2,A.carrier_size[0]/2)));
 const ep=espOrigin(p),espGap=Math.min(...q.points.map(([x,y])=>rectGap(x,y,ep[0],ep[1],34,14)));
 const buttonGap=Math.min(...q.points.flatMap(([x,y])=>buttonPositions(p).map(([bx,by])=>Math.hypot(x-bx,y-by)-r-(p.buttonD+.6)/2)));
 const wall=(p.bossD-p.insertOD)/2,roof=q.z-p.supportH-q.pocketDepth;
 const lipX=halfX-p.fitClear-1.2,lipY=halfY-p.fitClear-1.2;
 const lip=buttonPositions(p).every(([x,y])=>Math.abs(x)+(p.buttonD+.6)/2<lipX&&Math.abs(y)+(p.buttonD+.6)/2<lipY)&&Math.abs(p.batteryY)+p.batteryD/2<lipY&&Math.abs(p.batteryX)+p.batteryL/2<lipX&&p.radius-p.wall-p.fitClear>1.7&&p.supportH<q.z-p.lipDepth;
 const holes=p.clearD>=p.screwSize+.2&&p.clearD<p.headD-.6&&p.headD<=p.bossD-3&&p.insertHole>p.screwSize+.3&&p.insertHole<p.insertOD&&wall>=2&&p.supportH-p.headDepth>=2&&roof>=2;
 return{ok:shell&&lip&&holes&&batteryGap>=.5&&pcbGap>=.5&&espGap>=.5&&buttonGap>=.5&&q.engagement>=p.screwSize&&q.tipClearance>=.5,...q,shell,lip,holes,batteryGap,pcbGap,espGap,buttonGap,wall,roof,count:4};}
