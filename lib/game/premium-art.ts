import { ENEMIES, TOWERS, type EnemyType, type TowerType } from './data'

const TAU = Math.PI * 2
type Point = readonly [number, number]

function path(ctx: CanvasRenderingContext2D, points: Point[], fill: string, stroke = '#020617', line = 1.2) {
  ctx.beginPath()
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y))
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (line > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke() }
}
function metal(ctx: CanvasRenderingContext2D, x:number,y:number,w:number,h:number,base:string) {
  const g=ctx.createLinearGradient(x,y,x+w,y+h)
  g.addColorStop(0,'#e2e8f0'); g.addColorStop(.16,base); g.addColorStop(.58,base); g.addColorStop(1,'#020617')
  return g
}
function glow(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,color:string,blur=12) {
  ctx.save(); ctx.shadowColor=color; ctx.shadowBlur=blur
  const g=ctx.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r)
  g.addColorStop(0,'#fff');g.addColorStop(.22,color);g.addColorStop(1,color)
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore()
}
function rivet(ctx:CanvasRenderingContext2D,x:number,y:number,color:string) {
  ctx.fillStyle='#020617';ctx.beginPath();ctx.arc(x,y,2,0,TAU);ctx.fill()
  ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(x-.35,y-.35,1.15,0,TAU);ctx.fill()
  ctx.strokeStyle=color;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-1,y);ctx.lineTo(x+1,y);ctx.stroke()
}
function barrel(ctx:CanvasRenderingContext2D,length:number,r:number,color:string,accent:string,recoil:number,y=0) {
  ctx.save();ctx.translate(-Math.max(0,recoil)*3,y)
  ctx.fillStyle='#020617';ctx.beginPath();ctx.roundRect(-8,-r-2,length+12,r*2+4,r);ctx.fill()
  ctx.fillStyle=metal(ctx,-6,-r,length+12,r*2,accent);ctx.beginPath();ctx.roundRect(-6,-r,length+9,r*2,r*.6);ctx.fill()
  ctx.strokeStyle=color;ctx.lineWidth=1.1;ctx.stroke()
  ctx.fillStyle='#020617';ctx.beginPath();ctx.ellipse(length+2,0,3,r+1,0,0,TAU);ctx.fill()
  ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(length+2,0,2,Math.max(1,r-1),0,0,TAU);ctx.stroke()
  ctx.fillStyle='#e2e8f0';ctx.fillRect(-3,-r-1,2,r*2+2);ctx.restore()
}
function core(ctx:CanvasRenderingContext2D,color:string,accent:string,r:number,time:number,recoil=0) {
  ctx.save();ctx.shadowColor=color;ctx.shadowBlur=13
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,0,r+3,0,TAU);ctx.fill()
  const g=ctx.createRadialGradient(-r*.3,-r*.35,0,0,0,r*(.94+Math.sin(time*6)*.045+recoil*.04))
  g.addColorStop(0,'#fff');g.addColorStop(.22,color);g.addColorStop(1,accent)
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill()
  ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.globalAlpha=.7;ctx.lineWidth=1
  ctx.beginPath();ctx.arc(-r*.12,-r*.12,r*.5,-2.5,.25);ctx.stroke();ctx.restore()
}
function base(ctx:CanvasRenderingContext2D,color:string,tier:number,time:number) {
  ctx.save();ctx.shadowColor='#000';ctx.shadowBlur=10;ctx.fillStyle='rgba(0,0,0,.58)'
  ctx.beginPath();ctx.ellipse(2,8,23,13,0,0,TAU);ctx.fill();ctx.restore()
  path(ctx,[[-22,-8],[-15,-19],[13,-21],[22,-9],[20,13],[9,21],[-15,17],[-22,7]],metal(ctx,-20,-20,42,42,'#334155'),'#020617',2)
  path(ctx,[[-18,-8],[-12,-15],[12,-16],[18,-7],[16,11],[8,16],[-12,13],[-18,6]],'#0b1728','#64748b',1)
  ctx.save();ctx.globalAlpha=.48+tier*.12+Math.sin(time*2)*.05;ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=8+tier*5;ctx.lineWidth=tier>1?2.3:1.4
  ctx.beginPath();ctx.ellipse(0,1,15.5,12.5,0,0,TAU);ctx.stroke();ctx.restore()
  for(const [x,y] of [[-15,-8],[15,-8],[-12,11],[12,11]] as Point[])rivet(ctx,x,y,color)
  if(tier>0){ctx.save();ctx.rotate(time*(tier%2?.22:-.18));ctx.strokeStyle=color;ctx.globalAlpha=.28;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,19,-2.5,2.5);ctx.stroke();for(let i=0;i<tier*2+2;i++){const a=i*TAU/(tier*2+2);glow(ctx,Math.cos(a)*19,Math.sin(a)*19,1.3,color,4)}ctx.restore()}
}
function support(ctx:CanvasRenderingContext2D,type:TowerType,color:string,accent:string,time:number) {
  if(['incomeFarm','incomeTax','economyHouse','masterBank'].includes(type)){
    ctx.save();ctx.translate(0,-4)
    path(ctx,[[-13,11],[-13,-5],[0,-15],[13,-5],[13,11]],metal(ctx,-13,-15,26,26,accent),color,1.8)
    ctx.fillStyle='#0f172a';ctx.fillRect(-8,-5,16,14);ctx.strokeStyle=color;ctx.strokeRect(-8,-5,16,14)
    ctx.fillStyle='#fef3c7';ctx.font='900 11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle'
    ctx.fillText(type==='masterBank'?'$':type==='economyHouse'?'$$$':type==='incomeTax'?'$$':'$',0,2)
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-9);ctx.lineTo(-9,-17);ctx.lineTo(0,-22);ctx.lineTo(9,-17);ctx.lineTo(9,-9);ctx.stroke()
    if(type==='masterBank'){ctx.strokeStyle='#fde68a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,19,-2.5,2.5);ctx.stroke()}
    ctx.restore();return true
  }
  if(['buffer','commsLanHouse','commsBuilding','electricalStation','commsCenter'].includes(type)){
    ctx.save()
    if(type==='commsBuilding'||type==='commsCenter'){
      ctx.fillStyle=metal(ctx,-12,-14,24,28,accent);ctx.strokeStyle=color;ctx.lineWidth=2
      ctx.beginPath();ctx.roundRect(-12,-12,24,23,4);ctx.fill();ctx.stroke()
      ctx.fillStyle='#082f49';ctx.fillRect(-7,-7,14,10);ctx.fillStyle='#a5f3fc'
      for(let i=0;i<3;i++)ctx.fillRect(-5+i*5,-5,2,6)
      ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,-22);ctx.stroke()
      for(let i=0;i<3;i++){ctx.globalAlpha=.7-i*.15;ctx.beginPath();ctx.arc(0,-22,6+i*4,-2.8,-.3);ctx.stroke()}
      glow(ctx,0,-22,2.5,color,8)
    }else{
      ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.lineWidth=type==='electricalStation'?3.5:2.5
      const r=type==='commsLanHouse'?13:type==='electricalStation'?11:9
      ctx.beginPath();ctx.arc(0,-2,r,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-r,-2);ctx.lineTo(r,-2);ctx.moveTo(0,-2-r);ctx.lineTo(0,-2+r);ctx.stroke()
      core(ctx,color,accent,4.5,time)
    }
    ctx.restore();return true
  }
  return false
}

export function drawPremiumTower(ctx:CanvasRenderingContext2D,type:TowerType,x:number,y:number,angle:number,recoil=0){
  const d=TOWERS[type],c=d.color,a=d.accent,t=d.tier,time=Date.now()/1000
  ctx.save();ctx.translate(x,y);base(ctx,c,t,time)
  if(support(ctx,type,c,a,time)){ctx.restore();return}
  ctx.save();ctx.translate(0,-3);ctx.rotate(angle)
  const ballistic=['shooter','dual','tripleShooter','gatlingGun','splitHeel'].includes(type)
  const artillery=['cannon','mortar','cluster','cryoMortar','cannonadeBomber','flamethrower','meteorShower'].includes(type)
  const electric=['lightning','tesla','thunderstorm','bolt','plasmaRod','soulstorm','hyperLaser','raygun','skybreaker'].includes(type)
  const cryo=['retarder','icicles','snowballer','ice','snowballLauncher','plasmaHypothermia','glacialCataclysm'].includes(type)
  const earth=['boulderLauncher','rockLauncher','slingshot','boulderCannon','pebblesLauncher'].includes(type)
  if(ballistic){
    ctx.fillStyle='#0f172a';ctx.beginPath();ctx.roundRect(-13,-12,24,24,6);ctx.fill()
    ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.stroke()
    ctx.fillStyle=metal(ctx,-11,-10,22,20,a);ctx.beginPath();ctx.roundRect(-10,-10,19,20,5);ctx.fill()
    const n=type==='shooter'?1:type==='dual'||type==='splitHeel'?2:type==='tripleShooter'?3:6
    if(type==='gatlingGun'){ctx.fillStyle='#1e293b';ctx.beginPath();ctx.roundRect(-2,-11,19,22,4);ctx.fill();ctx.strokeStyle=c;ctx.stroke()}
    for(let i=0;i<n;i++)barrel(ctx,type==='gatlingGun'?24:20,type==='gatlingGun'?1.7:2.6,c,a,recoil,(i-(n-1)/2)*(type==='gatlingGun'?3.3:6))
    core(ctx,c,a,type==='gatlingGun'?4.8:4,time,recoil)
    if(type==='gatlingGun'){ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(5,0,12,-1.15,1.15);ctx.stroke()}
    if(type==='splitHeel'){path(ctx,[[-12,-13],[-19,-19],[-4,-17],[0,-12]],c,'#fff',.7);path(ctx,[[-12,13],[-19,19],[-4,17],[0,12]],c,'#fff',.7)}
  }else if(artillery){
    ctx.fillStyle='#111827';ctx.beginPath();ctx.roundRect(-14,-13,27,26,type==='cannon'?6:9);ctx.fill()
    ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=metal(ctx,-12,-12,25,24,a);ctx.beginPath();ctx.roundRect(-11,-10,21,20,5);ctx.fill()
    if(['mortar','cryoMortar','cluster','meteorShower'].includes(type)){
      ctx.save();ctx.rotate(-.22);ctx.fillStyle='#020617';ctx.beginPath();ctx.ellipse(1,0,15,12,0,0,TAU);ctx.fill()
      ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.stroke();ctx.fillStyle=a;ctx.beginPath();ctx.ellipse(2,0,9,7,0,0,TAU);ctx.fill()
      if(type==='cluster')for(const q of [0,Math.PI/2,Math.PI,Math.PI*1.5])glow(ctx,Math.cos(q)*12,Math.sin(q)*9,2.5,c,5)
      ctx.restore()
    }else barrel(ctx,type==='flamethrower'?23:25,type==='cannonadeBomber'?3.3:5,c,a,recoil)
    if(type==='flamethrower'){path(ctx,[[17,-5],[27,-9],[32,0],[27,9],[17,5]],'#f97316','#fed7aa',1);glow(ctx,24,0,3,'#fef3c7',12)}
    if(type==='cannonadeBomber')for(const q of [0,Math.PI/2,Math.PI,Math.PI*1.5])glow(ctx,Math.cos(q)*12,Math.sin(q)*12,3,c,6)
  }else if(electric){
    ctx.fillStyle='#0f172a';ctx.beginPath();ctx.arc(0,0,type==='skybreaker'?14:12,0,TAU);ctx.fill()
    ctx.strokeStyle=c;ctx.shadowColor=c;ctx.shadowBlur=14;ctx.lineWidth=type==='skybreaker'||type==='soulstorm'?3:2
    ctx.beginPath();ctx.arc(0,0,type==='skybreaker'?17:14,0,TAU);ctx.stroke()
    if(['lightning','bolt','tesla','thunderstorm'].includes(type)){
      path(ctx,[[-2,-12],[3,-4],[-1,1],[6,10]],'#e0f2fe',c,1)
      if(type==='tesla'||type==='thunderstorm')for(let i=0;i<4;i++){const q=i*Math.PI/2+time*.4;ctx.beginPath();ctx.moveTo(Math.cos(q)*12,Math.sin(q)*12);ctx.lineTo(Math.cos(q+.24)*21,Math.sin(q+.24)*21);ctx.stroke()}
    }else if(['plasmaRod','hyperLaser','raygun'].includes(type)){barrel(ctx,type==='hyperLaser'?27:23,type==='hyperLaser'?5:3,c,a,recoil);glow(ctx,0,0,5,'#e0f2fe',8)}
    else if(type==='skybreaker'){
      ctx.fillStyle='#334155';ctx.beginPath();ctx.ellipse(0,0,17,8,0,0,TAU);ctx.fill();ctx.strokeStyle='#fdba74';ctx.lineWidth=1.6;ctx.stroke()
      ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(-12,-7);ctx.lineTo(12,-7);ctx.moveTo(0,-7);ctx.lineTo(0,-17);ctx.stroke()
      ctx.fillStyle='#7dd3fc';ctx.beginPath();ctx.ellipse(8,-1,5,3,0,0,TAU);ctx.fill()
    }else for(let i=0;i<3;i++){const q=i*TAU/3+time*.28;ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(Math.cos(q)*5,Math.sin(q)*5);ctx.lineTo(Math.cos(q)*21,Math.sin(q)*21);ctx.stroke()}
    core(ctx,c,a,type==='soulstorm'?7:5,time,recoil)
  }else if(cryo){
    ctx.fillStyle='#0c2435';ctx.beginPath();ctx.roundRect(-13,-12,25,24,6);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke()
    if(['ice','icicles','glacialCataclysm'].includes(type)){
      const count=type==='glacialCataclysm'?5:3
      for(let i=0;i<count;i++){const yy=(i-(count-1)/2)*7;path(ctx,[[0,yy],[17+recoil*2,yy-3],[12,yy],[17+recoil*2,yy+3]],c,'#ecfeff',.8)}
    }else if(type==='snowballer'||type==='snowballLauncher'){barrel(ctx,18,5,c,a,recoil);glow(ctx,19,0,type==='snowballLauncher'?7:5,'#e0f2fe',7)}
    else if(type==='plasmaHypothermia'){core(ctx,c,a,8,time,recoil);for(const q of [0,2.1,4.2]){ctx.strokeStyle='#e0f2fe';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(q)*8,Math.sin(q)*8);ctx.lineTo(Math.cos(q)*18,Math.sin(q)*18);ctx.stroke()}}
    else {barrel(ctx,21,4.5,c,a,recoil);for(const yy of [-7,7])path(ctx,[[-9,yy],[-16,yy-6],[-2,yy-5],[3,yy]],'#bae6fd',c,1)}
  }else if(earth){
    ctx.fillStyle='#292524';ctx.beginPath();ctx.roundRect(-13,-12,25,24,6);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke()
    if(type==='slingshot'){ctx.strokeStyle='#fef3c7';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-9,-12);ctx.lineTo(0,0);ctx.lineTo(-9,12);ctx.moveTo(0,0);ctx.lineTo(15,0);ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-12);ctx.quadraticCurveTo(7,0,-9,12);ctx.stroke()}
    else if(type==='pebblesLauncher'){for(const [px,py] of [[9,-7],[17,-3],[9,3],[17,7]] as Point[])glow(ctx,px,py,3,c,6)}
    else{barrel(ctx,type==='boulderCannon'?18:22,type==='boulderCannon'?7:5,c,a,recoil);path(ctx,[[13,-7],[20,-10],[24,-2],[21,8],[12,7],[10,0]],metal(ctx,12,-10,12,18,c),'#e7e5e4',1)}
  }else if(['teleporter','portalGun','mimic'].includes(type)){
    ctx.save();ctx.rotate(time*(type==='mimic'?-.35:.3))
    for(let i=0;i<3;i++){ctx.strokeStyle=i===1?'#e9d5ff':c;ctx.globalAlpha=.9-i*.18;ctx.shadowColor=c;ctx.shadowBlur=10;ctx.lineWidth=2.3;ctx.beginPath();ctx.ellipse(0,0,17-i*3,9+i*2,i*.38,0,TAU);ctx.stroke()}
    ctx.restore();core(ctx,'#f5d0fe',a,type==='mimic'?6:4,time,recoil)
  }else if(type==='singularity'||type==='plasmaCannon'){
    ctx.fillStyle='#08051b';ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.fill();ctx.strokeStyle=c;ctx.shadowColor=c;ctx.shadowBlur=18;ctx.lineWidth=3
    for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,15+i*3,7+i*2,time*.35+i,0,TAU);ctx.stroke()}
    core(ctx,c,a,type==='singularity'?6:8,time,recoil)
  }else if(type==='bladeOfChaos'){
    ctx.save();ctx.rotate(time*.9);for(let i=0;i<3;i++){ctx.rotate(TAU/3);path(ctx,[[0,-4],[7,-22],[3,-9],[0,-5]],c,'#fff',1)}ctx.restore();core(ctx,c,a,5,time,recoil)
  }else if(type==='ringOfFlames'){
    ctx.save();ctx.rotate(time*.4);ctx.strokeStyle=c;ctx.lineWidth=4;ctx.shadowColor=c;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.stroke()
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);path(ctx,[[15,-5],[28,-12],[25,0],[28,12],[15,5]],'#f97316','#fef08a',1)}ctx.restore();core(ctx,c,a,4,time,recoil)
  }else{
    ctx.fillStyle=metal(ctx,-12,-12,24,24,a);ctx.beginPath();ctx.roundRect(-12,-11,24,22,5);ctx.fill();ctx.strokeStyle=c;ctx.stroke()
    barrel(ctx,22,4,c,a,recoil);core(ctx,c,a,4,time,recoil)
  }
  if(t>=2){ctx.strokeStyle=c;ctx.globalAlpha=.75;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,24+Math.sin(time*4)*1.5,-2.7,2.7);ctx.stroke();ctx.globalAlpha=1}
  ctx.restore();ctx.restore()
}

function bugLegs(ctx:CanvasRenderingContext2D,r:number,anim:number,color:string,speed:number){
  ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.1,r*.13);ctx.lineCap='round';ctx.lineJoin='round'
  for(const side of [-1,1])for(let i=0;i<3;i++){
    const phase=anim*speed+i*1.9+(side===1?Math.PI:0)
    const hipX=-r*.45+i*r*.45,hipY=side*r*.28
    const kneeX=hipX+Math.sin(phase)*r*.36+(i-1)*r*.12
    const kneeY=side*r*(.72+Math.cos(phase)*.12)
    const footX=kneeX+Math.cos(phase)*r*.3,footY=side*r*1.12
    ctx.beginPath();ctx.moveTo(hipX,hipY);ctx.lineTo(kneeX,kneeY);ctx.lineTo(footX,footY);ctx.stroke()
    ctx.beginPath();ctx.moveTo(footX-r*.1,footY);ctx.lineTo(footX+r*.16,footY+side*r*.04);ctx.stroke()
  }
}
function shell(ctx:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,dark:string){
  const g=ctx.createLinearGradient(x-rx,y-ry,x+rx,y+ry);g.addColorStop(0,'#fff');g.addColorStop(.18,color);g.addColorStop(.72,color);g.addColorStop(1,dark)
  ctx.fillStyle=g;ctx.strokeStyle=dark;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();ctx.stroke()
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=Math.max(1,rx*.08);ctx.beginPath();ctx.arc(x-rx*.12,y-ry*.1,rx*.72,-2.7,-.5);ctx.stroke()
}
function eye(ctx:CanvasRenderingContext2D,x:number,y:number,r:number){
  ctx.fillStyle='#020617';ctx.beginPath();ctx.arc(x,y,r+1.2,0,TAU);ctx.fill()
  ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y,r*.72,0,TAU);ctx.fill()
  ctx.fillStyle='#020617';ctx.beginPath();ctx.arc(x+r*.18,y,r*.38,0,TAU);ctx.fill()
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-r*.15,y-r*.2,r*.18,0,TAU);ctx.fill()
}
export function drawPremiumBug(ctx:CanvasRenderingContext2D,type:EnemyType,x:number,y:number,angle:number,anim:number,cocooning=false,airborne=false,helmet=false,segmentHp?:number[],burrowing=false){
  const d=ENEMIES[type],r=d.radius
  ctx.save();ctx.translate(x,y)
  if(burrowing){ctx.fillStyle='rgba(120,113,108,.65)';ctx.strokeStyle='#e7e5e4';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,3,r*1.5,r*.52,0,0,TAU);ctx.fill();ctx.stroke();for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#78716c':'#d6d3d1';ctx.beginPath();ctx.arc((i-2)*r*.48,-3+(i%2)*4,2.5,0,TAU);ctx.fill()}ctx.restore();return}
  const boss=type==='bugPrince'||type==='bugQueen'||type==='bugKing'
  const scale=airborne?1.18:1
  ctx.scale(scale,scale);ctx.rotate(angle)
  if(airborne){ctx.shadowColor=d.color;ctx.shadowBlur=14}
  if(type==='dirtBug'&&segmentHp){segmentHp.forEach((hp,i)=>{if(hp<=0)return;shell(ctx,-r*(1.65+i*1.02),0,r*.62,r*.55,i%2?'#78716c':'#a8a29e','#292524')})}
  if(type==='flyBug'||type==='jumper'||type==='bugQueen'){
    const flap=Math.sin(anim*18)*.18
    for(const side of [-1,1]){ctx.save();ctx.rotate(side*(.45+flap));ctx.fillStyle='rgba(224,242,254,.62)';ctx.strokeStyle='#bae6fd';ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(-r*.12,side*r*.9,r*.38,r*.85,side*.2,0,TAU);ctx.fill();ctx.stroke();ctx.restore()}
  }
  bugLegs(ctx,r,anim,d.dark,type==='runner'||type==='bombug'?25:14)
  if(type==='vessel'&&cocooning){
    const pulse=1+Math.sin(anim*5)*.035
    ctx.scale(pulse,1/pulse);shell(ctx,0,0,r*1.3,r*.9,'#92400e','#451a03')
    for(let i=-2;i<=2;i++){ctx.strokeStyle='#f59e0b';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(i*r*.35,0,r*.22,r*.8,i*.12,-Math.PI/2,Math.PI/2);ctx.stroke()}
    glow(ctx,-r*.7,-2,2,'#fbbf24',5);ctx.restore();return
  }
  shell(ctx,-r*.45,0,r*.78,r*.62,d.color,d.dark)
  shell(ctx,-r*.9,0,r*.24,r*.52,d.dark,'#020617')
  shell(ctx,r*.25,0,r*.43,r*.44,d.color,d.dark)
  if(type==='tank'||type==='vessel'||type==='ironBug'||type==='bugKing'){
    shell(ctx,-r*.55,0,r*.66,r*.55,type==='ironBug'?'#cbd5e1':type==='bugKing'?'#a78bfa':'#a16207',d.dark)
    ctx.strokeStyle=type==='ironBug'?'#f8fafc':'#fcd34d';ctx.lineWidth=1.5
    for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-r*.9,i*r*.28);ctx.lineTo(-r*.2,i*r*.28);ctx.stroke()}
  }
  if(type==='ghostBug'){ctx.globalAlpha=.58;ctx.strokeStyle='#ede9fe';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*1.25,.2,TAU-.2);ctx.stroke();glow(ctx,0,0,r*.45,'#c4b5fd',14)}
  if(type==='shadowBug'){ctx.strokeStyle='#c4b5fd';ctx.lineWidth=2;ctx.shadowColor='#8b5cf6';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,0,r*1.1,0,TAU);ctx.stroke();ctx.fillStyle='#1e1b4b';ctx.beginPath();ctx.ellipse(-r*.2,0,r*.8,r*.58,0,0,TAU);ctx.fill()}
  if(type==='rubberBug'){ctx.strokeStyle='#713f12';ctx.lineWidth=2.4;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-r*.55,0,r*(.4+i*.12),-1.1,1.1);ctx.stroke()}}
  if(type==='heatBug'||type==='bombug'){ctx.strokeStyle=type==='heatBug'?'#fed7aa':'#fecaca';ctx.lineWidth=2.5;ctx.shadowColor=d.color;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(-r*.5,0,r*.85,-2.2,2.2);ctx.stroke();ctx.shadowBlur=0;if(type==='bombug')glow(ctx,-r*.55,0,r*.22,'#ef4444',15)}
  if(type==='splitter'){ctx.strokeStyle='#ffedd5';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-r,-r*.5);ctx.lineTo(r*.25,r*.5);ctx.moveTo(-r,r*.5);ctx.lineTo(r*.25,-r*.5);ctx.stroke()}
  if(type==='spitter'){shell(ctx,r*.48,-r*.24,r*.2,r*.22,'#67e8f9','#164e63');ctx.fillStyle='#cffafe';ctx.beginPath();ctx.arc(r*.62,-r*.25,r*.12,0,TAU);ctx.fill()}
  if(type==='bulb'){glow(ctx,-r*.45,0,r*.4,'#fde047',anim%6<3?18:5);for(let i=0;i<6;i++){const a=i*TAU/6;ctx.strokeStyle='#fef08a';ctx.beginPath();ctx.moveTo(-r*.45+Math.cos(a)*r*.5,Math.sin(a)*r*.5);ctx.lineTo(-r*.45+Math.cos(a)*r*.78,Math.sin(a)*r*.78);ctx.stroke()}}
  if(type==='healer'){ctx.strokeStyle='#dcfce7';ctx.lineWidth=3;ctx.shadowColor='#4ade80';ctx.shadowBlur=9;ctx.beginPath();ctx.moveTo(-r*.55,-r*.32);ctx.lineTo(-r*.55,r*.32);ctx.moveTo(-r*.85,0);ctx.lineTo(-r*.25,0);ctx.stroke();ctx.shadowBlur=0}
  if(type==='starbug'){path(ctx,Array.from({length:10},(_,i)=>{const q=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.48:r*1.18;return[Math.cos(q)*rr,Math.sin(q)*rr] as Point}),'#fef3c7','#f59e0b',2)}
  if(type==='buguns'){for(const yy of [-r*.3,r*.3]){shell(ctx,r*.58,yy,r*.22,r*.2,'#fed7aa','#9a3412')}}
  if(type==='swarmer'||type==='swarmBug'){for(let i=0;i<3;i++){ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(-r*.4+i*r*.35,Math.sin(anim*9+i)*r*.35,r*.28,0,TAU);ctx.fill()}}
  if(type==='dirtBug'){path(ctx,[[-r*1.1,-r*.1],[-r*.7,-r*.65],[-r*.2,-r*.52],[-r*.1,r*.42],[-r*.72,r*.6]],'#78716c','#d6d3d1',1)}
  if(type==='bugPrince'||type==='bugQueen'||type==='bugKing'){
    const crown=type==='bugKing'?r*1.9:type==='bugQueen'?r*1.55:r*1.25
    path(ctx,[[-r*.55,-r*.48],[-r*.68,-r*1.05],[-r*.24,-r*.78],[0,-crown],[r*.22,-r*.78],[r*.68,-r*1.05],[r*.52,-r*.42]],type==='bugQueen'?'#f5d0fe':'#fef3c7',type==='bugKing'?'#581c87':'#92400e',2.3)
    for(const xx of [-r*.42,0,r*.42])glow(ctx,xx,-crown*.65,r*.11,type==='bugKing'?'#c084fc':type==='bugQueen'?'#f0abfc':'#fbbf24',9)
    if(type==='bugKing'){ctx.strokeStyle='#e9d5ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*1.45,-2.6,2.6);ctx.stroke();for(let i=0;i<6;i++)glow(ctx,Math.cos(i*TAU/6)*r*1.42,Math.sin(i*TAU/6)*r*1.42,2,'#c084fc',7)}
  }
  if(type==='ironBug'||helmet||type==='bugQueen'||type==='bugKing'){
    shell(ctx,r*.25,-r*.25,r*.48,r*.34,type==='bugQueen'?'#f5d0fe':'#cbd5e1','#475569')
    ctx.strokeStyle='#f8fafc';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(r*.25,-r*.25,r*.39,Math.PI,TAU);ctx.stroke()
  }
  if(type==='vessel'&&!cocooning){ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-r*.5,0,r*.66,-1.2,1.2);ctx.stroke()}
  eye(ctx,r*.55,-r*.2,Math.max(1.5,r*.13));eye(ctx,r*.55,r*.2,Math.max(1.5,r*.13))
  ctx.strokeStyle=d.dark;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(r*.75,-r*.25);ctx.quadraticCurveTo(r*1.25,-r*.55,r*1.45,-r*.85);ctx.moveTo(r*.75,r*.25);ctx.quadraticCurveTo(r*1.25,r*.55,r*1.45,r*.85);ctx.stroke()
  if(type==='flyBug'||type==='jumper'){ctx.strokeStyle='#7dd3fc';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-r*.2,-r*.6);ctx.lineTo(-r*.55,-r*1.1);ctx.moveTo(r*.2,-r*.6);ctx.lineTo(r*.45,-r*1.15);ctx.stroke()}
  if(boss){ctx.strokeStyle=type==='bugKing'?'#c084fc':type==='bugQueen'?'#f0abfc':'#fbbf24';ctx.lineWidth=1.6;ctx.globalAlpha=.65+Math.sin(anim*5)*.15;ctx.beginPath();ctx.arc(0,0,r*1.35,0,TAU);ctx.stroke()}
  ctx.restore()
}
