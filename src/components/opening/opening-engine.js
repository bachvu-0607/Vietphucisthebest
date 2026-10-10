
export function mountOpening(root, onComplete) {
const stage=root.querySelector('.ts-stage'),film=root.querySelector('.ts-film'),fallback=root.querySelector('.ts-fallback'),host=root.querySelector('.ts-canvas'),curtain=root.querySelector('.ts-curtain'),invite=root.querySelector('.ts-invitation'),open=root.querySelector('.ts-open'),skip=root.querySelector('.ts-skip'),status=root.querySelector('.ts-status');
const C={blue:'#243f8e',cream:'#f7eccd',red:'#bc405f',purple:'#785594',green:'#36847a',gold:'#dfbd6f',yellow:'#ddb851'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),settings={duration:5.4};
const clamp=v=>Math.min(1,Math.max(0,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)},mix=(a,b,t)=>a+(b-a)*t;
const ns='http://www.w3.org/2000/svg';
function el(tag,attrs={}){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;}
function pathNode(d,fill,width=3){return el('path',{d,fill,stroke:C.gold,'stroke-width':width*1.5,'stroke-linejoin':'round','stroke-linecap':'round'});}
// Opening clouds are distinct from the hooked wave crests below.
const cloudD='M-170 70C-210 30-183-21-143-15C-133-70-80-86-47-50C-16-98 45-85 62-39C106-65 151-24 126 10C181 6 204 58 161 81C125 106 70 84 29 102C-20 126-75 89-91 69C-126 101-166 95-170 70Z';
const cloudScroll='M-144 28C-158-12-103-42-76-14C-48 19-83 49-108 30C-122 17-105 1-94 13M40 47C113 36 128-25 80-30C43-34 31 5 58 13C73 17 85 2 72-6';
function makeCurtain(){
const svg=el('svg',{viewBox:'0 0 1000 600',preserveAspectRatio:'xMidYMid slice'});
for(const side of [-1,1]){const g=el('g',{'data-cloud':side});
g.append(el('rect',{x:side<0?-700:498,y:-500,width:1202,height:1600,fill:C.blue}));
const decor=el('g',{transform:side>0?'translate(1000 0) scale(-1 1)':''});
[[60,115,1.5,C.purple],[345,84,1.2,C.cream],[390,485,1.4,C.red],[85,480,1.65,C.green],[230,580,1.5,C.yellow]].forEach(([x,y,s,c])=>{const n=el('g',{transform:`translate(${x} ${y}) scale(${s})`});n.append(pathNode(cloudD,c),pathNode(cloudScroll,'none'));decor.append(n)});
g.append(decor);svg.append(g)}curtain.append(svg);
}
makeCurtain();
// Trace the supplied ornament in its 347 x 163 reference coordinates.
// The red double scroll, cream flanks, purple tips, yellow shelf and orange
// bottom scroll form one continuous, layered wave ornament.
function trace(text,mirror=false){
 const tokens=text.match(/[MLCQZ]|-?\d+(?:\.\d+)?/g),out=[];let i=0;
 const sizes={M:2,L:2,C:6,Q:4,Z:0};
 while(i<tokens.length){const k=tokens[i++],v=[];for(let j=0;j<sizes[k];j+=2){let x=+tokens[i++],y=+tokens[i++];if(mirror)x=347-x;v.push((x-173.5)*2.05,(147-y)*1.65)}out.push([k,...v])}return out;
}
const flank='M17 65 C4 64 -5 57 -3 47 C-12 38 -8 24 2 20 C-2 8 10 -2 24 0 C35 -8 49 -4 55 3 C72 10 74 28 64 40 C62 53 71 57 75 67 C56 60 37 73 17 65 Z';
const flankSpiral='M18 56 C37 57 48 41 39 31 C30 20 17 29 23 39 C28 46 37 38 31 35';
const redBody='M56 65 C42 59 38 42 47 29 C45 14 53 5 68 5 C72 -10 91 -13 104 -5 C117 -21 137 -19 149 -9 C160 -23 180 -22 189 -11 C204 -27 226 -21 236 -7 C253 -15 268 -4 267 9 C285 10 294 27 282 40 C282 56 265 65 248 61 C231 79 206 76 190 67 C177 76 160 77 146 69 C126 79 106 75 96 67 C82 73 65 74 56 65 Z';
const redSpiral='M151 66 C151 45 142 20 127 11 C109 -1 87 2 80 17 C69 36 83 52 101 51 C117 51 125 38 117 30 C111 24 102 28 102 34 C102 41 112 44 116 36';
const redTip='M103 34 C103 29 109 27 113 30 C119 33 116 40 111 40 C105 40 101 37 103 34 Z';
const purpleBody='M27 70 C25 60 36 54 45 61 C51 54 61 55 67 63 C78 59 87 68 82 78 C89 86 81 97 70 94 C64 103 51 101 46 94 C30 99 23 89 27 82 C18 79 19 71 27 70 Z';
const purpleSpiral='M34 84 C31 72 45 70 51 78 C55 84 50 94 45 90 M53 87 C57 73 71 70 76 78';
const yellowBody='M78 79 C75 69 85 63 94 69 C98 58 111 59 118 67 C127 59 139 62 145 70 C154 61 169 65 174 74 C179 64 193 61 202 69 C210 59 223 61 228 68 C239 59 251 65 250 76 C266 77 269 93 256 99 C248 111 232 106 222 108 C209 116 192 109 174 106 C155 112 139 116 125 108 C112 112 100 106 90 106 C74 107 66 94 73 85 C67 81 72 77 78 79 Z';
const yellowSpiral='M90 100 C83 85 99 84 105 90 C114 99 102 108 97 102 M132 105 C146 101 143 85 132 86 C124 87 124 94 128 98';
const orangeBody='M128 144 C111 152 99 140 104 126 C99 116 107 103 119 102 C119 89 131 81 143 87 C151 73 170 77 175 90 C188 84 201 91 202 104 C216 106 220 117 214 127 C222 141 210 151 196 145 C184 148 175 140 171 132 C162 144 144 151 128 144 Z';
const orangeLeft='M161 141 C165 124 151 111 136 113 C121 114 118 129 128 137 C138 144 149 135 143 129 C139 124 132 129 136 132';
const orangeRight='M174 140 C168 123 182 112 194 115 C207 117 208 132 199 138 C188 144 178 133 185 128 C190 124 196 129 191 132';
const orangeTop='M140 115 C134 98 151 94 158 107 C164 101 176 102 178 115';
const foamParts=[];
function addFoam(body,color,lines,z,delay=0,mirror=false){foamParts.push({path:trace(body,mirror),color,lines:lines.map(v=>trace(v,mirror)),z,delay})}
addFoam(flank,C.cream,[flankSpiral],0,0);addFoam(flank,C.cream,[flankSpiral],0,0,true);
addFoam(redBody,C.red,[redSpiral],3,.012);foamParts[2].lines.push(trace(redSpiral,true));
addFoam(redTip,C.cream,[],5,.012);addFoam(redTip,C.cream,[],5,.012,true);
addFoam(purpleBody,C.purple,[purpleSpiral],7,.025);addFoam(purpleBody,C.purple,[purpleSpiral],7,.025,true);
addFoam(yellowBody,C.yellow,[yellowSpiral],10,.045);foamParts[7].lines.push(trace(yellowSpiral,true));
addFoam(orangeBody,'#e8843c',[orangeLeft,orangeRight,orangeTop],14,.07);
// Extend the curled foam symmetrically, keeping it in front of the rock bases.
for(const mirror of [false,true]){
 const remap=commands=>commands.map(([k,...v])=>[k,...v.map((n,i)=>i%2?112+(n-112)*1.55:(mirror?285:-285)+(n-(mirror?245:-245))*1.55)]);
 foamParts.push({path:remap(trace(purpleBody,mirror)),color:C.purple,lines:[remap(trace(purpleSpiral,mirror))],z:2,delay:.025});
}
foamParts.sort((a,b)=>a.z-b.z);
// Each ornament moves whole. Red scroll tips travel with their parent red
// body; other central ornaments alternate sides without cutting the artwork.
for(const part of foamParts){
 const xs=part.path.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0));
 const center=(Math.min(...xs)+Math.max(...xs))/2;
 part.exitSide=(part.z===3||part.z===5||part.z===14)?-1:part.z===10?1:(center<0?-1:1);
 part.exitDistance=part.z===3||part.z===5?340:part.z===10?300:260;
}


const d=commands=>commands.map(c=>c.join(' ')).join(' ');
// Draw the low, rounded ridge profiles in the established vector style.
// Side ridges are narrow enough for the foam to cover their whole foot.
const peaks=[
 {x:-180,w:64,h:145,colors:[C.yellow,C.green,C.red,C.purple]},
 {x:180,w:64,h:145,colors:[C.yellow,C.green,C.red,C.purple]},
 {x:0,w:138,h:245,colors:[C.yellow,C.purple,C.blue,C.red]}
];
const ridgeLayers=[{w:1,h:1},{w:.96,h:.87},{w:.87,h:.67},{w:.77,h:.52}];
function ridgeShape(w,h){return [
 ['M',-w,0],['L',-w*.95,h*.56],['Q',-w*.95,h*.66,-w*.78,h*.72],
 ['L',-w*.20,h*.94],['Q',0,h*1.02,w*.20,h*.94],
 ['L',w*.78,h*.72],['Q',w*.95,h*.66,w*.95,h*.56],['L',w,0],['Z']
]}
const bandColors=[C.green,C.blue,C.purple,C.yellow,C.cream,C.red,C.green,C.purple,C.cream];
// Trim two outer ribbons on each side; keep every central ribbon in place.
const bandU=i=>(i+2)/13;
let svgWorld,svgFoam=[],svgPeaks=[],svgBands,svgMarks=[];
function makeFallback(){const svg=el('svg',{viewBox:'0 0 1000 600',preserveAspectRatio:'xMidYMid slice'});svg.append(el('rect',{width:1000,height:600,fill:C.blue,opacity:0}));svgWorld=el('g',{});svg.append(svgWorld);
svgBands=el('g',{});for(let i=0;i<bandColors.length;i++){let x=375+(i+2)*250/13,n=50+(i+2)*900/13;const w=250/13,bw=900/13;svgBands.append(pathNode(`M${x} 285 C${x+40} 378 ${n+75} 419 ${n+40} 465 C${n-10} 522 ${n-25} 548 ${n} 600 L${n+bw} 600 C${n+bw-25} 548 ${n+bw-10} 522 ${n+bw+40} 465 C${n+bw+75} 419 ${x+w+40} 378 ${x+w} 285 Z`,bandColors[i],1.2));}
svgWorld.append(svgBands);
for(const p of peaks){const g=el('g',{transform:`translate(${500+p.x*.56} 285) scale(.56 -.46)`});ridgeLayers.forEach((layer,i)=>g.append(pathNode(d(ridgeShape(p.w*layer.w,p.h*layer.h)),p.colors[i],2)));svgWorld.append(g);svgPeaks.push({g,p})}
for(const part of foamParts){const g=el('g',{});g.append(pathNode(d(part.path),part.color,1.9));part.lines.forEach(line=>g.append(pathNode(d(line),'none',2.1)));svgWorld.append(g);svgFoam.push({g,part,side:part.exitSide})}
for(let j=0;j<16;j++){const g=el('path',{fill:'none',stroke:C.cream,'stroke-width':1.2,opacity:.4});svgWorld.insertBefore(g,svgFoam[0].g);svgMarks.push(g)}fallback.append(svg)}
makeFallback();
let allow3D=true,initTimer=0;
let THREE,renderer,scene,camera,waterGroup,waves=[],mountainGroups=[],foamGroups=[],streaks=[],droplets=[],geos=new Set(),mats=new Set(),textures=new Set(),raf=0,watchdog=0,token=0,running=false,progress=0,observer=null;
const ownGeo=g=>(geos.add(g),g);
function mat(color){const m=new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide});mats.add(m);return m}
function shape(commands){const s=new THREE.Shape();for(const [k,...v]of commands){if(k==='M')s.moveTo(...v);if(k==='L')s.lineTo(...v);if(k==='C')s.bezierCurveTo(...v);if(k==='Q')s.quadraticCurveTo(...v);if(k==='Z')s.closePath()}return s}
function outline(group,commands,color=C.gold,width=1.1,z=4){const sh=shape(commands),pts=sh.getPoints(40).map(p=>new THREE.Vector3(p.x,p.y,z));const curve=new THREE.CurvePath();for(let i=1;i<pts.length;i++)curve.add(new THREE.LineCurve3(pts[i-1],pts[i]));const mesh=new THREE.Mesh(ownGeo(new THREE.TubeGeometry(curve,180,width,4,false)),mat(color));mesh.userData.goldEdge=true;group.add(mesh)}
function filled(group,commands,color,z=0,edge=1){const mesh=new THREE.Mesh(ownGeo(new THREE.ShapeGeometry(shape(commands),24)),mat(color));mesh.position.z=z;group.add(mesh);outline(group,commands,'#8f6c29',2.2*edge,z+.2);outline(group,commands,'#f4d984',1.3*edge,z+.8)}
function surfaceX(u,z,t=0){const distance=clamp((z+980)/1200);return (u-.5)*(530+distance*1250)+Math.sin(distance*Math.PI*2-t*2)*95*distance+Math.sin(z*.006+u*1.3-t*3)*30*distance}
function waveFront(t){return mix(180,-980,ease((t-.10)/.24))}
function surfaceY(z,u,t){const front=waveFront(t),surge=14*Math.exp(-Math.pow((z-front-55)/100,2))*(1-ease((t-.34)/.13));const distance=clamp((z+980)/1200);return 80-distance*20+surge+(Math.sin(z*.012+t*8+u*.8)*4+Math.sin(z*.024+t*13)*1.5)*Math.min(1,distance*7)}
async function init3D(id){
if(!THREE)THREE=await import('three');if(id!==token||!running||!allow3D)return;
renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(C.blue,0);renderer.outputColorSpace=THREE.SRGBColorSpace;host.replaceChildren(renderer.domElement);
scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(43,1,1,7000);
waterGroup=new THREE.Group();scene.add(waterGroup);
for(let i=0;i<bandColors.length;i++){const positions=[],indices=[],segments=70;for(let j=0;j<=segments;j++){const z=-980+j*1200/segments;for(const u of [bandU(i),bandU(i+1)])positions.push(surfaceX(u,z),0,z)}for(let j=0;j<segments;j++){const k=j*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}const geo=ownGeo(new THREE.BufferGeometry());geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);const mesh=new THREE.Mesh(geo,mat(bandColors[i]));mesh.frustumCulled=false;waterGroup.add(mesh);waves.push({geo,i})}
for(let i=0;i<=bandColors.length;i++){const positions=[];for(let j=0;j<=70;j++){const z=-980+j*1200/70;positions.push(surfaceX(bandU(i),z),1,z)}const geo=ownGeo(new THREE.BufferGeometry());geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const m=new THREE.LineBasicMaterial({color:C.gold});mats.add(m);const line=new THREE.Line(geo,m);line.frustumCulled=false;waterGroup.add(line);waves.push({geo,i,line:true})}
for(const p of peaks){const g=new THREE.Group();g.position.set(p.x,80,-980);ridgeLayers.forEach((layer,i)=>filled(g,ridgeShape(p.w*layer.w,p.h*layer.h),p.colors[i],i*3,1.2));scene.add(g);mountainGroups.push(g)}
for(const part of foamParts){const g=new THREE.Group();filled(g,part.path,part.color);part.lines.forEach(line=>{outline(g,line,'#9c792f',2,2);outline(g,line,'#f4d984',1.15,2.7)});g.traverse(o=>{if(o.isMesh){o.renderOrder=30+part.z+(o.position.z>0?.1:0);o.material.depthTest=false;o.material.depthWrite=false;}});scene.add(g);foamGroups.push({g,part,side:part.exitSide})}
for(let i=0;i<20;i++){const geo=ownGeo(new THREE.BufferGeometry());geo.setAttribute('position',new THREE.Float32BufferAttribute(new Array(18).fill(0),3));const m=new THREE.LineBasicMaterial({color:C.cream,transparent:true,opacity:.36});mats.add(m);const l=new THREE.Line(geo,m);l.frustumCulled=false;scene.add(l);streaks.push({geo,i,material:m})}
const dropShape=[['M',0,0],['C',-4,4,-6,10,0,18],['C',6,10,4,4,0,0],['Z']];
for(let i=0;i<21;i++){const g=new THREE.Mesh(ownGeo(new THREE.ShapeGeometry(shape(dropShape),8)),mat(i%3===0?C.gold:C.cream));scene.add(g);droplets.push({g,i})}
observer=new ResizeObserver(resize);observer.observe(stage);resize();fallback.style.visibility='hidden';root.dataset.engine='three';root.dataset.resources='allocated';
}
function resize(){if(!renderer)return;const b=stage.getBoundingClientRect();renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();render(progress)}
function dispose(){observer?.disconnect();observer=null;geos.forEach(g=>g.dispose());geos.clear();mats.forEach(m=>m.dispose());mats.clear();textures.forEach(t=>t.dispose());textures.clear();if(renderer){renderer.renderLists.dispose();renderer.dispose();renderer.forceContextLoss()}renderer=null;scene=null;camera=null;waves=[];mountainGroups=[];foamGroups=[];streaks=[];droplets=[];host.replaceChildren();root.dataset.resources='disposed'}
function stop(){token++;running=false;cancelAnimationFrame(raf);clearTimeout(watchdog);clearTimeout(initTimer);raf=0;root.dataset.activeFrames='0';dispose()}
function phase(name,label){if(stage.dataset.phase===name)return;stage.dataset.phase=name;status.textContent=label}
function render(t){
progress=t;const opening=ease(t/.25),travel=ease((t-.08)/.65),impact=ease((t-.34)/.26),through=ease((t-.72)/.25),fade=ease((t-.86)/.14);
for(const cloud of curtain.querySelectorAll('[data-cloud]')){const side=+cloud.dataset.cloud;cloud.setAttribute('transform',`translate(${side*1040*opening} ${-40*opening})`)}
curtain.style.visibility=t>=.27?'hidden':'visible';invite.style.opacity=1-ease(t/.10);invite.style.visibility=t>.11?'hidden':'visible';film.style.opacity=1;film.style.background=`rgba(36,63,142,${1-ease((t-.76)/.17)})`;
root.dataset.progress=t.toFixed(3);root.dataset.impact=impact.toFixed(2);
const split=ease((t-.77)/.21),mountainFade=1-ease((t-.75)/.12),waterFade=1-ease((t-.80)/.13),foamFade=1-ease((t-.86)/.12),goldFade=1-ease((t-.91)/.09);
const scale=(1+travel*.38+through*.24)/.9;
svgWorld.setAttribute('transform',`translate(500 300) scale(${scale}) skewX(${-5+travel*2+through}) translate(-474 ${-mix(300,315,travel)})`);
const surge=ease((t-.10)/.24);
svgBands.setAttribute('transform',`translate(${Math.sin(t*7)*5} ${600+split*140}) scale(1 ${.02+.98*surge}) translate(0 -600)`);
svgBands.setAttribute('opacity',waterFade);
svgFoam.forEach(({g,part,side})=>{const bloom=ease((t-.34-part.delay)/.19),s=mix(.44,.58,travel);g.setAttribute('transform',`translate(${500+side*split*part.exitDistance*.55} ${328+split*12}) scale(${s} ${-mix(.27,.36,travel)*(.92+.08*bloom)})`);g.setAttribute('opacity',bloom*goldFade);g.querySelectorAll('path').forEach(n=>{n.setAttribute('fill-opacity',foamFade);n.setAttribute('stroke-opacity',goldFade)})});
svgPeaks.forEach(({g,p})=>{g.setAttribute('opacity',mountainFade);const size=1+.12*travel;g.setAttribute('transform',`translate(${500+p.x*.56} 285) scale(${.56*size} ${-.46*size})`)});
svgMarks.forEach((g,i)=>{const f=(i/16+t*1.5)%1,y=330+(1-f)*270,x=500+(i%8-3.5)*(16+(y-320)*.12);g.setAttribute('d',`M${x} ${y}l${(500-x)*.07} -24`);g.setAttribute('opacity',t>.16?.35*waterFade:0)});
if(!renderer)return;
// Camera follows the ribbons toward the foot of the mountains. It never waits
// for the opening curtain to finish before beginning its forward movement.
const aspect=camera.aspect;
const framing=Math.max(1,1.4/aspect);
// Lower the viewing angle continuously with the forward move, including
// the final fly-through, rather than tilting steeply at its end.
const targetY=mix(140,130,travel)-through*30;
const distance=(mix(1260,880,travel)-through*140)*framing*.9;
const pitch=(mix(31,25,travel)-through*4)*Math.PI/180;
camera.position.set(mix(110,45,travel)*(1-through),targetY+Math.tan(pitch)*distance,-960+distance);
camera.fov=aspect<1?57:43;camera.lookAt(0,targetY,-960);camera.updateProjectionMatrix();
const extension=1;waterGroup.scale.z=extension;waterGroup.position.z=-980*(1-extension)+split*240;waterGroup.position.y=-split*65;waterGroup.traverse(o=>{if(o.material){o.material.transparent=true;o.material.opacity=waterFade}});
// Extend the colored front toward the rocks; rebuild from fixed row indices
// so the advance never accumulates or drifts on replay.
const front=waveFront(t);
for(const g of mountainGroups){g.traverse(o=>{if(o.material){o.material.transparent=true;o.material.opacity=mountainFade}});g.scale.setScalar(1+.12*travel);g.rotation.set(-pitch*.55,Math.atan2(camera.position.x,camera.position.z+980)*.4,0)}
for(const item of waves){const a=item.geo.attributes.position;for(let j=0;j<a.count;j++){const row=item.line?j:Math.floor(j/2),z=mix(front,220,row/70),u=bandU(item.line?item.i:item.i+j%2);a.setXYZ(j,surfaceX(u,z,t),surfaceY(z,u,t)+(item.line?1.2:0),z)}a.needsUpdate=true}
foamGroups.forEach(({g,part,side})=>{const bloom=ease((t-.34-part.delay)/.19);g.visible=bloom>0;const s=mix(.78,1.03,travel);g.scale.set(s,mix(.46,.62,travel)*(.92+.08*bloom),s);g.position.set(side*split*part.exitDistance,26-split*18,-966+part.z+22*bloom);g.rotation.set(-pitch*.7,Math.atan2(camera.position.x,camera.position.z-g.position.z)*.5,0);g.traverse(o=>{if(o.isMesh){o.material.transparent=true;o.material.opacity=bloom*(o.userData.goldEdge?goldFade:foamFade)}})});
for(const {geo,i,material} of streaks){material.opacity=.36*waterFade;const z=mix(220,front,((i/20+t*1.7)%1)),u=.10+((i*7)%19)/23;const a=geo.attributes.position;for(let j=0;j<6;j++){const q=Math.max(front,z-j*11);a.setXYZ(j,surfaceX(u,q,t),surfaceY(q,u,t)+2,q)}a.needsUpdate=true}
for(const {g,i}of droplets){const birth=.36+(i%3)*.025,age=clamp((t-birth)/.38),burst=ease((t-birth)/.08);g.visible=t>birth&&age<1;const anchor=(i%3-1)*210,angle=.20+(i/21)*2.75;g.position.set(anchor+Math.cos(angle)*age*160,85+Math.sin(angle)*age*30-age*age*28,-915+age*80);g.rotation.z=-Math.cos(angle)*.9;g.scale.setScalar(burst*(1-age)*(.5+(i%4)*.18))}
renderer.render(scene,camera);
}
function reset(){stop();fallback.style.visibility='visible';film.style.display='block';curtain.style.display='block';invite.style.display='flex';open.disabled=false;skip.hidden=true;root.dataset.engine='svg';phase('ready','Tam sơn · Thủy ba');render(0)}
function finish(){render(1);stop();film.style.display='none';curtain.style.display='none';invite.style.display='none';skip.hidden=true;phase('complete','Đã mở giao diện 2D');onComplete()}
async function start(){if(running)return;allow3D=true;running=true;const id=++token;open.disabled=true;skip.hidden=false;phase('preparing','Chuẩn bị mở cảnh…');if(reduced.matches){finish();return}
const work=init3D(id).catch(()=>{if(id===token){dispose();fallback.style.visibility='visible';root.dataset.engine='svg'}});
await Promise.race([work,new Promise(r=>{initTimer=setTimeout(()=>{allow3D=false;r()},1800)})]);clearTimeout(initTimer);if(id!==token||!running)return;
const begin=performance.now(),duration=settings.duration*1000;watchdog=setTimeout(finish,duration+1800);
function tick(now){if(id!==token||!running)return;const t=clamp((now-begin)/duration);render(t);if(t<.25)phase('opening','Mây mở · Tam sơn ở xa');else if(t<.36)phase('flow','Theo dải sóng về chân núi');else if(t<.75)phase('impact','Sóng chạm núi · Bọt cuộn lên');else phase('through','Bọt mở · Hiện giao diện');if(t===1)finish();else{root.dataset.activeFrames='1';raf=requestAnimationFrame(tick)}}
raf=requestAnimationFrame(tick);

}
open.addEventListener('click',start);
skip.addEventListener('click',finish);
const onHidden=()=>{if(document.hidden&&running)finish()};
const onReduced=()=>{if(reduced.matches&&running)finish()};
document.addEventListener('visibilitychange',onHidden);
window.addEventListener('pagehide',stop);
reduced.addEventListener('change',onReduced);
reset();
// Always offer a way out, even if WebGL or module loading fails.
skip.hidden=false;
return ()=>{
 stop();
 open.removeEventListener('click',start);
 skip.removeEventListener('click',finish);
 document.removeEventListener('visibilitychange',onHidden);
 window.removeEventListener('pagehide',stop);
 reduced.removeEventListener('change',onReduced);
 curtain.replaceChildren();fallback.replaceChildren();
};
}
