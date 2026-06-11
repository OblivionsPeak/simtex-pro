import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{a as t,c as n,d as r,f as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d,u as f}from"./vendor-DXAVdzwM.js";import{$ as p,$i as m,$n as h,$r as g,$t as _,A as ee,Ai as v,An as te,Ar as ne,At as y,B as b,Bi as x,Bn as S,Br as C,Bt as re,C as ie,Ca as ae,Ci as w,Cn as oe,Cr as se,Ct as ce,D as le,Di as ue,Dn as T,Dr as E,Dt as de,E as D,Ea as O,Ei as fe,En as k,Er as A,Et as j,F as M,Fi as pe,Fn as N,Fr as P,Ft as me,G as F,Gi as I,Gn as L,Gr as R,Gt as he,H as z,Hi as ge,Hn as B,Hr as V,Ht as H,I as _e,Ii as U,In as W,Ir as G,It as ve,J as ye,Ji as K,Jn as be,Jr as q,Jt as xe,K as Se,Ki as J,Kn as Ce,Kr as we,Kt as Te,L as Ee,Li as De,Ln as Oe,Lr as ke,Lt as Y,M as Ae,Mi as je,Mn as Me,Mr as Ne,Mt as Pe,N as Fe,Ni as Ie,Nn as Le,Nr as Re,Nt as ze,O as Be,Oi as Ve,On as He,Or as Ue,Ot as We,P as Ge,Pi as Ke,Pn as qe,Pr as Je,Pt as Ye,Q as Xe,Qi as Ze,Qn as Qe,Qr as $e,Qt as et,R as tt,Ri as nt,Rn as rt,Rr as it,Rt as at,S as ot,Sa as st,Si as ct,Sn as lt,Sr as ut,St as dt,T as ft,Ta as pt,Ti as mt,Tn as ht,Tr as gt,Tt as _t,U as vt,Ui as yt,Un as bt,Ur as xt,Ut as St,V as Ct,Vi as wt,Vn as Tt,Vr as Et,Vt as Dt,W as Ot,Wi as kt,Wn as At,Wr as jt,Wt as Mt,X as Nt,Xi as Pt,Xn as Ft,Xr as It,Xt as Lt,Y as Rt,Yi as zt,Yn as Bt,Yr as Vt,Yt as Ht,Z as Ut,Zi as Wt,Zn as Gt,Zr as Kt,Zt as qt,_ as Jt,_a as Yt,_i as Xt,_n as Zt,_r as Qt,_t as $t,a as en,aa as tn,ai as nn,an as rn,ar as an,at as on,b as sn,ba as cn,bi as ln,bn as un,br as dn,bt as fn,c as pn,ca as mn,ci as hn,cn as gn,cr as _n,ct as vn,d as yn,da as bn,di as xn,dn as Sn,dr as Cn,dt as wn,ea as Tn,ei as En,en as Dn,er as On,et as kn,f as An,fa as jn,fi as Mn,fn as Nn,fr as Pn,ft as Fn,g as In,ga as Ln,gi as Rn,gn as zn,gr as Bn,gt as Vn,h as Hn,ha as Un,hi as Wn,hn as Gn,hr as Kn,ht as qn,i as Jn,ia as Yn,ii as Xn,in as Zn,ir as Qn,it as $n,j as er,ji as tr,jn as nr,jr as rr,jt as ir,k as ar,ki as or,kn as sr,kr as cr,kt as lr,l as ur,la as dr,li as fr,ln as pr,lr as mr,lt as hr,m as gr,ma as _r,mi as vr,mn as yr,mr as br,mt as xr,n as Sr,na as Cr,ni as wr,nn as Tr,nr as Er,nt as Dr,o as Or,oa as kr,oi as Ar,on as jr,or as Mr,ot as Nr,p as Pr,pa as Fr,pi as Ir,pn as Lr,pr as Rr,pt as zr,q as Br,qi as Vr,qn as Hr,qr as Ur,qt as Wr,r as Gr,ra as Kr,ri as qr,rn as Jr,rr as Yr,rt as Xr,s as Zr,sa as Qr,si as $r,sn as ei,sr as ti,st as ni,t as ri,ta as ii,ti as ai,tn as oi,tr as si,tt as ci,u as li,ua as ui,ui as di,un as fi,ur as pi,ut as mi,v as hi,va as gi,vi as _i,vn as vi,vr as yi,vt as bi,w as xi,wa as Si,wi as Ci,wn as wi,wr as Ti,wt as Ei,x as Di,xa as Oi,xi as ki,xn as Ai,xr as ji,xt as Mi,y as Ni,ya as Pi,yi as Fi,yn as Ii,yr as Li,yt as Ri,z as zi,zi as Bi,zn as Vi,zr as Hi,zt as Ui}from"./patterns-BsrjpPqF.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var X=e(i(),1),Wi=r(),Z=[{name:`hash`,defines:/float\s+hash\s*\(\s*vec2/,deps:[],proto:`float hash(vec2 p);`,src:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`},{name:`noise`,defines:/float\s+noise\s*\(\s*vec2/,deps:[`hash`],proto:`float noise(vec2 p);`,src:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }`},{name:`permute`,defines:/vec3\s+permute\s*\(/,deps:[],proto:`vec3 permute(vec3 x);`,src:`
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }`},{name:`snoise`,defines:/float\s+snoise\s*\(\s*vec2/,deps:[`permute`],proto:`float snoise(vec2 v);`,src:`
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
    }`},{name:`fbm`,defines:/float\s+fbm\s*\(/,deps:[`snoise`],proto:`float fbm(vec2 x);`,src:`
    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }`}];function Gi(e){let t=new Set,n=r=>{t.has(r.name)||r.defines.test(e)||(t.add(r.name),r.deps.forEach(e=>n(Z.find(t=>t.name===e))))};Z.forEach(t=>{RegExp(`\\b${t.name}\\s*\\(`).test(e)&&n(t)});let r=``;return Z.forEach(n=>{t.has(n.name)?r+=n.src+`
`:n.defines.test(e)&&Z.some(e=>t.has(e.name)&&e.deps.includes(n.name))&&(r+=`
    `+n.proto+`
`)}),r}var Ki=class{constructor(e){if(this.canvas=e,this.gl=e.getContext(`webgl`,{preserveDrawingBuffer:!0,alpha:!0}),!this.gl)throw Error(`WebGL not supported`);this.program=null,this.uniforms={},this.currentValues={u_opacity:1,u_uv_scale:[1,1],u_uv_rotation:0,u_uv_offset:[0,0]},this.startTime=Date.now(),this.initBuffers(),this.startLoop()}initBuffers(){let e=this.gl,t=new Float32Array([-1,-1,1,-1,-1,1,1,1]),n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),this.buffer=n,e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)}async setShader(e){let t=`
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_is_spec;
      uniform float u_opacity;
    `;e.uniforms.forEach(e=>{e.type===`color`?t+=`uniform vec4 ${e.id};\n`:t+=`uniform float ${e.id};\n`}),t+=Gi(e.shader),t+=e.shader,e.shader.includes(`u_is_spec`)?t+=`
void main() {
        vec4 res = generate();
        gl_FragColor = vec4(res.rgb, res.a * u_opacity);
      }`:t+=`
void main() {
        vec4 res = generate();
        if (u_is_spec > 0.5) {
          float lum = dot(res.rgb, vec3(0.299, 0.587, 0.114));
          res = vec4(0.0, clamp(1.0 - lum * 0.85, 0.05, 0.95), 0.0, res.a);
        }
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
    `,t);if(!n){console.error(`[ShaderEngine] Failed to build shader for pattern "${e.id}"`);return}this.program=n,this.mapUniforms(),this.dirty=!0}mapUniforms(){let e=this.gl;this.uniforms={};let t=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let n=0;n<t;n++){let t=e.getActiveUniform(this.program,n);this.uniforms[t.name]=e.getUniformLocation(this.program,t.name)}}startLoop(){let e=()=>{(this.dirty||this.canvas.width!==this._lastW||this.canvas.height!==this._lastH)&&(this._lastW=this.canvas.width,this._lastH=this.canvas.height,this.draw(),this.dirty=!1),this.frameId=requestAnimationFrame(e)};this.frameId=requestAnimationFrame(e)}render(e={}){this.currentValues={...this.currentValues,...e},this.dirty=!0}draw(){if(!this.program)return;let e=this.gl;e.viewport(0,0,this.canvas.width,this.canvas.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(this.program),this.uniforms.u_resolution&&e.uniform2f(this.uniforms.u_resolution,this.canvas.width,this.canvas.height),this.uniforms.u_time&&e.uniform1f(this.uniforms.u_time,(Date.now()-this.startTime)/1e3),this.uniforms.u_opacity&&e.uniform1f(this.uniforms.u_opacity,this.currentValues.u_opacity),Object.entries(this.currentValues).forEach(([t,n])=>{let r=this.uniforms[t];!r||t===`u_opacity`||(Array.isArray(n)?n.length===4?e.uniform4fv(r,n):n.length===3?e.uniform3fv(r,n):n.length===2&&e.uniform2fv(r,n):e.uniform1f(r,n))});let t=e.getAttribLocation(this.program,`position`);e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.vertexAttribPointer(t,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t),e.drawArrays(e.TRIANGLE_STRIP,0,4)}stop(){this.frameId&&cancelAnimationFrame(this.frameId)}createProgram(e,t){let n=this.gl,r=this.loadShader(n.VERTEX_SHADER,e),i=this.loadShader(n.FRAGMENT_SHADER,t);if(!r||!i)return null;let a=n.createProgram();return n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),n.getProgramParameter(a,n.LINK_STATUS)?a:(console.error(`[ShaderEngine] Program link error:`,n.getProgramInfoLog(a)),null)}loadShader(e,t){let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`[ShaderEngine] Shader compile error:`,n.getShaderInfoLog(r)),null)}export(e,t,n){let r=this.canvas.width,i=this.canvas.height,a=this.currentValues;this.canvas.width=e,this.canvas.height=t,this.currentValues={...this.currentValues,...n},this.draw();let o=this.canvas.toDataURL(`image/png`);return this.canvas.width=r,this.canvas.height=i,this.currentValues=a,this.dirty=!0,o}exportSeamless(e,t,n,r=.45){let i=this.canvas.width,a=this.canvas.height,o=this.currentValues;this.canvas.width=e,this.canvas.height=t,this.currentValues={...this.currentValues,...n},this.draw();let s=document.createElement(`canvas`);s.width=e,s.height=t;let c=s.getContext(`2d`);c.drawImage(this.canvas,0,0);let l=c.getImageData(0,0,e,t).data,u=document.createElement(`canvas`);u.width=e,u.height=t;let d=u.getContext(`2d`),f=d.createImageData(e,t),p=f.data,m=e>>1,h=t>>1,g=1-r;for(let n=0;n<t;n++){let i=(n+h)%t,a=Math.abs(n/t-.5)*2;for(let t=0;t<e;t++){let o=(t+m)%e,s=(Math.max(Math.abs(t/e-.5)*2,a)-g)/r;s=s<=0?0:s>=1?1:s*s*(3-2*s);let c=(n*e+t)*4,u=(i*e+o)*4;p[c]=l[c]+(l[u]-l[c])*s,p[c+1]=l[c+1]+(l[u+1]-l[c+1])*s,p[c+2]=l[c+2]+(l[u+2]-l[c+2])*s,p[c+3]=l[c+3]+(l[u+3]-l[c+3])*s}}return d.putImageData(f,0,0),this.canvas.width=i,this.canvas.height=a,this.currentValues=o,this.dirty=!0,u.toDataURL(`image/png`)}exportNormalMap(e,t,n,r=3){let i=this.canvas.width,a=this.canvas.height,o=this.currentValues;this.canvas.width=e,this.canvas.height=t,this.currentValues={...this.currentValues,...n},this.draw();let s=document.createElement(`canvas`);s.width=e,s.height=t;let c=s.getContext(`2d`);c.drawImage(this.canvas,0,0);let l=c.getImageData(0,0,e,t).data,u=new Float32Array(e*t);for(let n=0;n<e*t;n++)u[n]=.299*l[n*4]/255+.587*l[n*4+1]/255+.114*l[n*4+2]/255;let d=document.createElement(`canvas`);d.width=e,d.height=t;let f=d.getContext(`2d`),p=f.createImageData(e,t),m=p.data,h=(n,r)=>u[Math.max(0,Math.min(t-1,r))*e+Math.max(0,Math.min(e-1,n))];for(let n=0;n<t;n++)for(let t=0;t<e;t++){let i=-h(t-1,n-1)+h(t+1,n-1)+-2*h(t-1,n)+2*h(t+1,n)+-h(t-1,n+1)+h(t+1,n+1),a=-h(t-1,n-1)+h(t-1,n+1)+-2*h(t,n-1)+2*h(t,n+1)+-h(t+1,n-1)+h(t+1,n+1),o=-i*r,s=-a*r,c=Math.sqrt(o*o+s*s+1),l=(n*e+t)*4;m[l]=Math.round((o/c*.5+.5)*255),m[l+1]=Math.round((s/c*.5+.5)*255),m[l+2]=Math.round((1/c*.5+.5)*255),m[l+3]=255}return f.putImageData(p,0,0),this.canvas.width=i,this.canvas.height=a,this.currentValues=o,this.dirty=!0,d.toDataURL(`image/png`)}},Q=Object.values(Object.assign({"./patterns/acid_etch.js":O,"./patterns/aero_ablative_coating.js":pt,"./patterns/aero_riblets.js":Si,"./patterns/alcantara_suede.js":ae,"./patterns/amethyst.js":st,"./patterns/anodized_blue.js":Oi,"./patterns/anodized_bronze.js":cn,"./patterns/anodized_red.js":Pi,"./patterns/anodized_titanium.js":gi,"./patterns/apex_curbing.js":Yt,"./patterns/argyle_knit.js":Ln,"./patterns/armco_barrier.js":Un,"./patterns/asphalt_pro.js":_r,"./patterns/autumn_leaves.js":Fr,"./patterns/banded_agate.js":jn,"./patterns/barbed_wire.js":bn,"./patterns/bioluminescent_mycelium.js":ui,"./patterns/bird_plumage.js":dr,"./patterns/bismuth_crystal.js":mn,"./patterns/bismuth_labyrinth.js":Qr,"./patterns/blueprint_grid.js":kr,"./patterns/bone_pores.js":tn,"./patterns/braided_cord.js":Yn,"./patterns/brain_coral.js":Kr,"./patterns/brake_dust.js":Cr,"./patterns/brake_rotor_wear.js":ii,"./patterns/brake_rotors.js":Tn,"./patterns/brick_masonry.js":m,"./patterns/brushed_aluminum.js":Ze,"./patterns/brushed_gold.js":Wt,"./patterns/bubblewrap.js":Pt,"./patterns/burlap_sack.js":zt,"./patterns/butterfly_wing.js":K,"./patterns/cactus_needles.js":Vr,"./patterns/candy_paint.js":J,"./patterns/canvas_rip.js":I,"./patterns/carpet_velour.js":kt,"./patterns/cast_iron.js":yt,"./patterns/cephalopod_chromatophores.js":ge,"./patterns/chain_mail.js":wt,"./patterns/chalkboard_dust.js":x,"./patterns/charcoal_sketch.js":Bi,"./patterns/chitinous_exoskeleton.js":nt,"./patterns/choc_chip_camo.js":De,"./patterns/chopped_carbon.js":U,"./patterns/chrome_mirror.js":pe,"./patterns/circuit_traces.js":Ke,"./patterns/coral_reef.js":Ie,"./patterns/corduroy_rib.js":je,"./patterns/corroded_aluminum.js":tr,"./patterns/corrugated_steel.js":v,"./patterns/cow_print.js":or,"./patterns/crocodile_hide.js":Ve,"./patterns/crt_phosphor_mask.js":ue,"./patterns/cyber_grid.js":fe,"./patterns/cyber_leather.js":mt,"./patterns/cyber_twill.js":Ci,"./patterns/cyber_wiring.js":w,"./patterns/damask_lace.js":ct,"./patterns/damask_silk.js":ki,"./patterns/data_matrix.js":ln,"./patterns/dazzle_camo.js":Fi,"./patterns/demon_scales.js":_i,"./patterns/denim_weave.js":Xt,"./patterns/desert_dunes.js":Rn,"./patterns/diamond_plate.js":Wn,"./patterns/diamond_quilt.js":vr,"./patterns/diamond_stitch_v2.js":Ir,"./patterns/diatom_shells.js":Mn,"./patterns/diffraction_grating.js":xn,"./patterns/digi_camo_urban.js":di,"./patterns/digital_camo_v2.js":fr,"./patterns/digital_glitch.js":hn,"./patterns/door_panel_fabric.js":$r,"./patterns/dragon_plate.js":Ar,"./patterns/energy_shield.js":nn,"./patterns/etched_brass.js":Xn,"./patterns/exhaust_heat.js":qr,"./patterns/expanded_grating.js":wr,"./patterns/exposed_aggregate.js":ai,"./patterns/fiber_optic_bundle.js":En,"./patterns/fingerprint_swirls.js":g,"./patterns/fish_scales.js":$e,"./patterns/flecktarn_camo.js":Kt,"./patterns/fluid_marbling.js":It,"./patterns/folded_damascus_steel.js":Vt,"./patterns/forest_litter.js":q,"./patterns/forged_carbon.js":Ur,"./patterns/frost_crystals.js":we,"./patterns/frozen_lake.js":R,"./patterns/fusion_panel.js":jt,"./patterns/galvanized_steel.js":xt,"./patterns/gauge_cluster.js":V,"./patterns/geometric_camo_ops.js":Et,"./patterns/geometric_fracture.js":C,"./patterns/glacier_ice.js":Hi,"./patterns/glass_shards.js":it,"./patterns/glitch_interference.js":ke,"./patterns/glitch_text_logic.js":G,"./patterns/gold_leaf.js":P,"./patterns/gold_leaf_flake.js":Je,"./patterns/gothic_filigree.js":Re,"./patterns/granite_speckle.js":Ne,"./patterns/graphene_nanotubes.js":rr,"./patterns/gravel_trap.js":ne,"./patterns/greek_key.js":cr,"./patterns/halftone_dots.js":Ue,"./patterns/halftone_pop.js":E,"./patterns/hammered_copper.js":A,"./patterns/harlequin_diamond.js":gt,"./patterns/headliner_mesh.js":Ti,"./patterns/heat_blued_titanium.js":se,"./patterns/herringbone.js":ut,"./patterns/hex_basalt.js":ji,"./patterns/hex_fade.js":dn,"./patterns/hex_mesh.js":Li,"./patterns/holographic_foil.js":yi,"./patterns/holographic_glitch.js":Qt,"./patterns/honeycomb_bio.js":Bn,"./patterns/honeycomb_metal.js":Kn,"./patterns/hotrod_flames.js":br,"./patterns/houndstooth.js":Rr,"./patterns/hunting_camo.js":Pn,"./patterns/impasto_paint.js":Cn,"./patterns/infinite_spiral.js":pi,"./patterns/ink_blot_test.js":mr,"./patterns/interference_rings.js":_n,"./patterns/iris_fibers.js":ti,"./patterns/julia_fractal.js":Mr,"./patterns/kers_containment_core.js":an,"./patterns/kevlar_grid.js":Qn,"./patterns/knurl_grip.js":Yr,"./patterns/laser_etch.js":Er,"./patterns/lava_crust.js":si,"./patterns/leaf_skeleton.js":On,"./patterns/leopard_print.js":h,"./patterns/lichen_growth.js":Qe,"./patterns/lichtenberg_trees.js":Gt,"./patterns/linear_gradient.js":Ft,"./patterns/linen_weave.js":Bt,"./patterns/liquid_mercury.js":be,"./patterns/louis_check.js":Hr,"./patterns/low_poly_facets.js":Ce,"./patterns/machined_wheel.js":L,"./patterns/macrame_knot.js":At,"./patterns/mandala_radial.js":bt,"./patterns/mandelbrot_fractal.js":B,"./patterns/maple_leaves.js":Tt,"./patterns/marble_stone.js":S,"./patterns/matte_clearcoat.js":Vi,"./patterns/mesh_jersey.js":rt,"./patterns/metal_flake.js":Oe,"./patterns/micro_cells.js":W,"./patterns/micro_logic_grid.js":N,"./patterns/microchip_wafer.js":qe,"./patterns/moire_silk.js":Le,"./patterns/molten_tungsten.js":Me,"./patterns/monstera_leaf.js":nr,"./patterns/morpho_iridescence.js":te,"./patterns/mother_of_pearl.js":sr,"./patterns/mud_cracks.js":He,"./patterns/mud_splatter.js":T,"./patterns/multi_env_camo.js":k,"./patterns/multicam.js":ht,"./patterns/mushroom_gills.js":wi,"./patterns/mylar_heatshield.js":oe,"./patterns/nanotech_cells.js":lt,"./patterns/nappa_leather.js":Ai,"./patterns/nebula_dust.js":un,"./patterns/neon_tubes.js":Ii,"./patterns/neoprene.js":vi,"./patterns/neural_net.js":Zt,"./patterns/nomex_weave.js":zn,"./patterns/obsidian_fracture.js":Gn,"./patterns/oil_canvas.js":yr,"./patterns/oil_slick.js":Lr,"./patterns/oil_stain.js":Nn,"./patterns/olive_branch.js":Sn,"./patterns/optical_fiber_bundle.js":fi,"./patterns/origami_fold.js":pr,"./patterns/paint_chips.js":gn,"./patterns/paisley_bandana.js":ei,"./patterns/palm_fronds.js":jr,"./patterns/paper_tear.js":rn,"./patterns/pcb_traces_v3.js":Zn,"./patterns/peacock_eyes.js":Jr,"./patterns/pearl_flake_paint.js":Tr,"./patterns/peat_moss.js":oi,"./patterns/penrose_tiling.js":Dn,"./patterns/perforated_leather.js":_,"./patterns/perforated_sheet.js":et,"./patterns/petrified_wood.js":qt,"./patterns/pine_bark.js":Lt,"./patterns/piston_top.js":Ht,"./patterns/pixel_art_canvas.js":xe,"./patterns/plaid_tartan.js":Wr,"./patterns/plant_cells.js":Te,"./patterns/plasma_core.js":he,"./patterns/pleated_fabric.js":Mt,"./patterns/polka_dot.js":St,"./patterns/powder_coat.js":H,"./patterns/prism_shards.js":Dt,"./patterns/prismatic_flip.js":re,"./patterns/pulsar_radial.js":Ui,"./patterns/quantum_foam.js":at,"./patterns/quartz_crystal.js":Y,"./patterns/racing_livery_stripe.js":ve,"./patterns/radial_gradient.js":me,"./patterns/radiolarian_skeletons.js":Ye,"./patterns/rain_on_glass.js":ze,"./patterns/reaction_diffusion.js":Pe,"./patterns/realistic_viper.js":ir,"./patterns/rim_spoke_carbon.js":y,"./patterns/river_cobble.js":lr,"./patterns/river_stone.js":We,"./patterns/rivet_lines.js":de,"./patterns/rivet_plate_elite.js":j,"./patterns/roll_cage_foam.js":_t,"./patterns/roof_shingles.js":Ei,"./patterns/root_system.js":ce,"./patterns/rose_gold.js":dt,"./patterns/rubber_compound.js":Mi,"./patterns/safety_harness.js":fn,"./patterns/sakura_petals.js":Ri,"./patterns/salt_crystal.js":bi,"./patterns/sand_dunes.js":$t,"./patterns/sandblasted_steel.js":Vn,"./patterns/sandstone_layers.js":qn,"./patterns/seat_perforation.js":xr,"./patterns/seigaiha_wave.js":zr,"./patterns/server_rack_mesh.js":Fn,"./patterns/shift_boot_leather.js":wn,"./patterns/sierpinski_carpet.js":mi,"./patterns/sierpinski_mesh.js":hr,"./patterns/single_rivet_row.js":vn,"./patterns/skeletal_mesh.js":ni,"./patterns/slate_rock.js":Nr,"./patterns/snake_skin.js":on,"./patterns/snake_skin_v2.js":$n,"./patterns/soap_bubble.js":Xr,"./patterns/solar_flare.js":Dr,"./patterns/solar_flares_v2.js":ci,"./patterns/sound_wave_eq.js":kn,"./patterns/speed_trails.js":p,"./patterns/spider_lightning.js":Xe,"./patterns/spider_web.js":Ut,"./patterns/splinter_camo.js":Nt,"./patterns/spray_drip.js":Rt,"./patterns/stained_glass.js":ye,"./patterns/star_field.js":Br,"./patterns/starlight_drive.js":Se,"./patterns/steel_wool.js":F,"./patterns/stitched_leather.js":Ot,"./patterns/synaptic_spark.js":vt,"./patterns/tech_fractal.js":z,"./patterns/tech_hex_v2.js":Ct,"./patterns/terrazzo_chip.js":b,"./patterns/terrazzo_stone.js":zi,"./patterns/thermal_tile_scorch.js":tt,"./patterns/threaded_screw.js":Ee,"./patterns/tig_weld.js":_e,"./patterns/tiger_stripe_camo.js":M,"./patterns/tiger_stripes.js":Ge,"./patterns/tinted_carbon.js":Fe,"./patterns/tire_marbles.js":Ae,"./patterns/tire_sidewall.js":er,"./patterns/tire_tread_rain.js":ee,"./patterns/topo_map.js":ar,"./patterns/travertine.js":Be,"./patterns/truchet_tiles.js":le,"./patterns/turbo_fan.js":D,"./patterns/twill_carbon.js":ft,"./patterns/tyre_burnout.js":xi,"./patterns/vaporwave_sun.js":ie,"./patterns/velvet_pile.js":ot,"./patterns/verdigris_patina.js":Di,"./patterns/vinyl_wrap.js":sn,"./patterns/viral_capsid.js":Ni,"./patterns/void_grid.js":hi,"./patterns/volcanic_basalt.js":Jt,"./patterns/voronoi_cells.js":In,"./patterns/washi_paper.js":Hn,"./patterns/water_ripples.js":gr,"./patterns/watercolor_bleed.js":Pr,"./patterns/wavy_checkers.js":An,"./patterns/weathered_paint.js":yn,"./patterns/weathered_rust.js":li,"./patterns/wicker_weave.js":ur,"./patterns/wire_wound.js":pn,"./patterns/wood_block_print.js":Zr,"./patterns/wood_grain_pro.js":Or,"./patterns/wood_parquet.js":en,"./patterns/woodland_classic_camo.js":Jn,"./patterns/worn_asphalt.js":Gr,"./patterns/woven_fiberglass.js":Sr,"./patterns/zebra_camo_v2.js":ri})).map(e=>e.default),qi=[`All`,...[...new Set(Q.map(e=>e.category))].sort()],$=d(),Ji=new Date(Date.now()-21*864e5).toISOString().slice(0,10),Yi=e=>{let t=e=>Math.round(e*255).toString(16).padStart(2,`0`);return`#${t(e[0])}${t(e[1])}${t(e[2])}`},Xi=(e,t=1)=>[parseInt(e.slice(1,3),16)/255,parseInt(e.slice(3,5),16)/255,parseInt(e.slice(5,7),16)/255,t],Zi=({value:e,onChange:t})=>{let n=e||[1,1,1,1],r=Yi(n).toUpperCase(),[i,a]=(0,X.useState)(r),[o,s]=(0,X.useState)(!1),c=o?i:r,l=e=>{a(e);let r=e.trim().replace(/^#/,``);/^[0-9a-fA-F]{6}$/.test(r)&&t(Xi(`#${r}`,n[3]))},u=(e,r)=>{let i=parseInt(r,10);if(Number.isNaN(i))return;let a=Math.min(255,Math.max(0,i)),o=[...n];o[e]=a/255,t(o)};return(0,$.jsxs)(`div`,{className:`color-value-row`,children:[(0,$.jsx)(`input`,{type:`text`,className:`hex-input`,value:c,maxLength:7,spellCheck:!1,onFocus:()=>{a(r),s(!0)},onChange:e=>l(e.target.value),onBlur:()=>s(!1),onKeyDown:e=>{e.key===`Enter`&&e.currentTarget.blur()}}),[`R`,`G`,`B`].map((e,t)=>(0,$.jsxs)(`label`,{className:`rgb-field`,children:[(0,$.jsx)(`span`,{children:e}),(0,$.jsx)(`input`,{type:`number`,min:`0`,max:`255`,value:Math.round(n[t]*255),onChange:e=>u(t,e.target.value)})]},e))]})};function Qi(){let e=(0,X.useRef)(null),r=(0,X.useRef)(null),[i,d]=(0,X.useState)(Q[0]),[p,m]=(0,X.useState)({}),[h,g]=(0,X.useState)(!1),[_,ee]=(0,X.useState)(2048),[v,te]=(0,X.useState)(!0),ne=window.electronAPI!==void 0,[y,b]=(0,X.useState)(``),[x,S]=(0,X.useState)(`All`),[C,re]=(0,X.useState)(!1),[,ie]=(0,X.useState)(``),[ae,w]=(0,X.useState)(!1),[oe,se]=(0,X.useState)(!1),[ce,le]=(0,X.useState)(null),[ue,T]=(0,X.useState)([]),[E,de]=(0,X.useState)(1),D=(0,X.useRef)(1),[O,fe]=(0,X.useState)(()=>JSON.parse(localStorage.getItem(`simtex_favorites`)||`[]`)),[k,A]=(0,X.useState)(()=>JSON.parse(localStorage.getItem(`simtex_presets`)||`[]`)),[j,M]=(0,X.useState)(``),[pe,N]=(0,X.useState)(!1),[P,me]=(0,X.useState)([]),[F,I]=(0,X.useState)(-1),L=(0,X.useRef)(null),[R,he]=(0,X.useState)({}),[z,ge]=(0,X.useState)(!1),[B,V]=(0,X.useState)([1,1]),[H,_e]=(0,X.useState)(0),[U,W]=(0,X.useState)([0,0]),[G,ve]=(0,X.useState)(!1),ye=(0,X.useMemo)(()=>[`All`,`Favorites`,...qi.filter(e=>e!==`All`)],[]),K=(0,X.useMemo)(()=>{let e=Q.filter(e=>{let t=e.name.toLowerCase().includes(y.toLowerCase())||e.description.toLowerCase().includes(y.toLowerCase()),n=x===`All`||(x===`Favorites`?O.includes(e.id):e.category===x);return t&&n});return C?[...e].sort((e,t)=>(t.added||``).localeCompare(e.added||``)||e.name.localeCompare(t.name)):e},[y,x,O,C]);(0,X.useEffect)(()=>{if(!e.current)return;let t=new Ki(e.current);return r.current=t,be(i),()=>t.stop()},[e]),(0,X.useEffect)(()=>{let t=()=>{if(!r.current||!e.current)return;let t=v?340:0;e.current.width=window.innerWidth-t-40,e.current.height=window.innerHeight-100};return window.addEventListener(`resize`,t),t(),()=>window.removeEventListener(`resize`,t)},[v]),(0,X.useEffect)(()=>{let e=document.createElement(`canvas`);e.width=96,e.height=96;let t;try{t=new Ki(e)}catch{return}t.stop();let n=!1,r=0,i=()=>{if(n||r>=Q.length)return;let a={};for(let n=0;n<4&&r<Q.length;n++,r++){let n=Q[r],i={};n.uniforms.forEach(e=>{i[e.id]=e.default}),t.setShader(n),t.render({...i,u_is_spec:0,u_opacity:1,u_uv_scale:[1,1],u_uv_rotation:0,u_uv_offset:[0,0]}),t.draw(),a[n.id]=e.toDataURL(`image/png`)}he(e=>({...e,...a})),setTimeout(i,30)};return setTimeout(i,300),()=>{n=!0}},[]),(0,X.useEffect)(()=>{window.electronAPI&&(window.electronAPI.onUpdateStatus(e=>{ie(e),T(t=>[...t.slice(-4),e])}),window.electronAPI.onUpdateAvailableData(e=>{w(!0),le(e),T(t=>[...t.slice(-4),`v${e.version} found on GitHub`])}),window.electronAPI.onUpdateDownloaded(()=>{se(!0),w(!1),T(e=>[...e.slice(-4),`Update ready — click to install`])}))},[]),(0,X.useEffect)(()=>{D.current=E,r.current&&r.current.render({u_opacity:E})},[E]),(0,X.useEffect)(()=>{if(!r.current)return;let e=G?[B[0]*2,B[1]*2]:B;r.current.render({u_uv_scale:e,u_uv_rotation:Math.PI/180*H,u_uv_offset:U})},[B,H,U,G]);let be=async e=>{if(!r.current)return;let t={};e.uniforms.forEach(e=>{t[e.id]=e.default}),m(t),await r.current.setShader(e),r.current.render({...t,u_is_spec:+!!h,u_opacity:D.current})},q=e=>{d(e),be(e)},xe=e=>{me(t=>[...t.slice(0,F+1),e].slice(-30)),I(e=>Math.min(e+1,29))},Se=e=>{let t={...p,...e.uniforms};m(t),r.current&&r.current.render({...t,u_is_spec:+!!h,u_opacity:D.current}),xe({patternId:i.id,uniforms:t})},J=(e,t)=>{let n={...p,[e]:t};m(n),r.current&&r.current.render({...n,u_is_spec:+!!h,u_opacity:D.current}),clearTimeout(L.current),L.current=setTimeout(()=>{xe({patternId:i.id,uniforms:n})},400)};(0,X.useEffect)(()=>{r.current&&r.current.render({u_is_spec:+!!h})},[h]);let Ce=()=>{if(!r.current)return;let e={...p,u_is_spec:+!!h},t=z?r.current.exportSeamless(_,_,e):r.current.export(_,_,e),n=document.createElement(`a`);n.download=`simtex_${i.id}_${h?`spec`:`diff`}${z?`_seamless`:``}_${_}.png`,n.href=t,n.click()},we=()=>{if(!r.current)return;let e=r.current,t=`simtex_${i.id}${z?`_seamless`:``}_${_}`,n=(e,n)=>{let r=document.createElement(`a`);r.download=`${t}_${n}.png`,r.href=e,r.click()},a={...p,u_is_spec:0};n(z?e.exportSeamless(_,_,a):e.export(_,_,a),`diff`),setTimeout(()=>{let t={...p,u_is_spec:1};n(z?e.exportSeamless(_,_,t):e.export(_,_,t),`spec`)},400),setTimeout(()=>{n(e.exportNormalMap(_,_,{...p,u_is_spec:0,u_opacity:1}),`normal`)},800)},Te=()=>{if(!r.current)return;let e=r.current.exportNormalMap(_,_,{...p,u_is_spec:0,u_opacity:1}),t=document.createElement(`a`);t.download=`simtex_${i.id}_normal_${_}.png`,t.href=e,t.click()},Ee=e=>{fe(t=>{let n=t.includes(e)?t.filter(t=>t!==e):[...t,e];return localStorage.setItem(`simtex_favorites`,JSON.stringify(n)),n})},De=()=>{let e=j.trim()||i.name,t={id:Date.now(),patternId:i.id,name:e,uniforms:{...p}};A(e=>{let n=[...e,t].slice(-20);return localStorage.setItem(`simtex_presets`,JSON.stringify(n)),n}),M(``),N(!1)},Oe=e=>{A(t=>{let n=t.filter(t=>t.id!==e);return localStorage.setItem(`simtex_presets`,JSON.stringify(n)),n})},ke=e=>{let t=Q.find(t=>t.id===e.patternId);t&&(q(t),setTimeout(()=>{m(e.uniforms),r.current&&r.current.render({...e.uniforms,u_is_spec:+!!h,u_opacity:D.current})},50))},Y=(0,X.useCallback)(e=>{let t=Q.find(t=>t.id===e.patternId);t&&t.id!==i.id&&d(t),m(e.uniforms),r.current&&r.current.render({...e.uniforms,u_is_spec:+!!h,u_opacity:D.current})},[i.id,h]);return(0,X.useEffect)(()=>{let e=e=>{let t=e.ctrlKey||e.metaKey,n=e.target.tagName;if(!((n===`INPUT`||n===`TEXTAREA`)&&e.key!==`Escape`)){if(e.key===`Escape`){v&&y?(b(``),S(`All`)):te(e=>!e);return}if(t&&e.key===`d`){e.preventDefault(),Ce();return}if(t&&e.key===`z`&&!e.shiftKey){e.preventDefault();let t=F-1;t>=0&&P[t]&&(Y(P[t]),I(t));return}if(t&&(e.key===`y`||e.key===`z`&&e.shiftKey)){e.preventDefault();let t=F+1;t<P.length&&(Y(P[t]),I(t));return}if(e.key===`ArrowUp`||e.key===`ArrowDown`){let t=K.findIndex(e=>e.id===i.id);if(t===-1)return;let n=e.key===`ArrowUp`?Math.max(0,t-1):Math.min(K.length-1,t+1);n!==t&&q(K[n])}}};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[v,y,K,i,P,F,Y]),(0,$.jsxs)(`div`,{className:`app-container`,children:[(0,$.jsxs)(`aside`,{className:`sidebar glass-panel ${v?`open`:`closed`}`,children:[(0,$.jsxs)(`div`,{className:`sidebar-top`,children:[(0,$.jsx)(`div`,{className:`sidebar-header`,children:(0,$.jsxs)(`div`,{className:`logo`,children:[(0,$.jsx)(a,{size:24,color:`var(--color-accent)`}),(0,$.jsxs)(`h1`,{children:[`SIMTEX`,(0,$.jsx)(`span`,{children:`PRO`}),` `,(0,$.jsx)(`small`,{className:`v-tag`,children:`v3.4.0`})]})]})}),(0,$.jsxs)(`section`,{className:`sidebar-section`,children:[(0,$.jsxs)(`div`,{className:`search-wrapper`,children:[(0,$.jsx)(c,{size:16,className:`search-icon`}),(0,$.jsx)(`input`,{type:`text`,placeholder:`Search patterns...`,value:y,onChange:e=>b(e.target.value),className:`search-input`}),y&&(0,$.jsx)(l,{size:14,className:`clear-search`,onClick:()=>{b(``),S(`All`)}})]}),(0,$.jsx)(`div`,{className:`category-tabs pro-scrollbar`,children:ye.map(e=>(0,$.jsx)(`button`,{className:`category-tab ${x===e?`active`:``}`,onClick:()=>S(e),children:e},e))})]})]}),(0,$.jsxs)(`section`,{className:`patterns-container pro-scrollbar`,children:[(0,$.jsxs)(`div`,{className:`section-title patterns-title`,children:[(0,$.jsx)(n,{size:16}),(0,$.jsxs)(`span`,{children:[`PATTERNS (`,K.length,`)`]}),(0,$.jsx)(`button`,{className:`sort-toggle ${C?`active`:``}`,onClick:()=>re(e=>!e),title:C?`Sorted newest first — click for default order`:`Sort newest first`,children:`NEW FIRST`})]}),(0,$.jsx)(`div`,{className:`pattern-grid`,children:K.length>0?K.map(e=>(0,$.jsxs)(`button`,{className:`pattern-card ${i.id===e.id?`active`:``}`,onClick:()=>q(e),children:[(0,$.jsxs)(`div`,{className:`card-body`,children:[R[e.id]?(0,$.jsx)(`img`,{className:`pattern-thumb`,src:R[e.id],alt:``,draggable:!1}):(0,$.jsx)(`div`,{className:`pattern-thumb placeholder`}),(0,$.jsxs)(`div`,{className:`card-text`,children:[(0,$.jsxs)(`div`,{className:`card-header`,children:[(0,$.jsxs)(`div`,{className:`pattern-name`,children:[e.name,e.added>=Ji&&(0,$.jsx)(`span`,{className:`new-badge`,children:`NEW`})]}),(0,$.jsx)(`div`,{className:`pattern-category`,children:e.category})]}),(0,$.jsx)(`div`,{className:`pattern-desc`,children:e.description})]})]}),(0,$.jsx)(`button`,{className:`fav-star ${O.includes(e.id)?`active`:``}`,onClick:t=>{t.stopPropagation(),Ee(e.id)},title:O.includes(e.id)?`Remove from favorites`:`Add to favorites`,children:O.includes(e.id)?`★`:`☆`})]},e.id)):(0,$.jsxs)(`div`,{className:`no-results`,children:[`No patterns found for "`,y||x,`"`]})})]}),(0,$.jsxs)(`div`,{className:`sidebar-bottom`,children:[k.length>0&&(0,$.jsx)(`div`,{className:`preset-chips-row`,children:k.map(e=>(0,$.jsxs)(`span`,{className:`preset-chip`,title:e.name,children:[(0,$.jsx)(`span`,{className:`preset-chip-name`,onClick:()=>ke(e),children:e.name.slice(0,12)}),(0,$.jsx)(`span`,{className:`preset-chip-del`,onClick:()=>Oe(e.id),children:`×`})]},e.id))}),(0,$.jsxs)(`section`,{className:`sidebar-section`,children:[(0,$.jsxs)(`div`,{className:`section-title`,children:[(0,$.jsx)(t,{size:16}),(0,$.jsx)(`span`,{children:`CONTROLS`})]}),(0,$.jsxs)(`div`,{className:`controls-list pro-scrollbar`,children:[(0,$.jsxs)(`div`,{className:`control-group master-control`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:`Master Opacity`}),(0,$.jsxs)(`span`,{className:`control-value`,children:[(E*100).toFixed(0),`%`]})]}),(0,$.jsx)(`input`,{type:`range`,min:`0`,max:`1`,step:`0.01`,value:E,onChange:e=>{let t=parseFloat(e.target.value);D.current=t,de(t)}})]}),i.variants&&i.variants.length>0&&(0,$.jsxs)(`div`,{className:`control-group variants-control`,style:{marginBottom:`16px`},children:[(0,$.jsx)(`div`,{className:`control-label`,style:{marginBottom:`8px`},children:(0,$.jsx)(`span`,{children:`Theme / Variant`})}),(0,$.jsx)(`div`,{className:`variants-row`,style:{display:`flex`,gap:`6px`,flexWrap:`wrap`},children:i.variants.map((e,t)=>(0,$.jsx)(`button`,{className:`variant-btn`,onClick:()=>Se(e),style:{background:`#1a1a20`,border:`1px solid var(--color-border)`,color:`#fff`,padding:`6px 10px`,borderRadius:`4px`,fontSize:`11px`,cursor:`pointer`,flex:`1 1 calc(50% - 6px)`,transition:`border-color 0.2s`},onMouseOver:e=>e.currentTarget.style.borderColor=`var(--color-accent)`,onMouseOut:e=>e.currentTarget.style.borderColor=`var(--color-border)`,children:e.name},t))})]}),i.uniforms.map(e=>(0,$.jsxs)(`div`,{className:`control-group`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:e.name}),(0,$.jsx)(`span`,{className:`control-value`,children:e.type===`color`?``:(p[e.id]||0).toFixed(2)})]}),e.type===`float`?(0,$.jsx)(`input`,{type:`range`,min:e.min,max:e.max,step:(e.max-e.min)/100,value:p[e.id]||e.default,onChange:t=>J(e.id,parseFloat(t.target.value))}):(0,$.jsxs)(`div`,{className:`color-control-stack`,children:[(0,$.jsx)(`input`,{type:`color`,className:`color-input`,value:p[e.id]?Yi(p[e.id]):`#ffffff`,onChange:t=>J(e.id,Xi(t.target.value,p[e.id]?p[e.id][3]:1))}),(0,$.jsx)(Zi,{value:p[e.id],onChange:t=>J(e.id,t)}),(0,$.jsxs)(`div`,{className:`alpha-slider-row`,children:[(0,$.jsx)(`span`,{className:`alpha-label`,children:`Alpha`}),(0,$.jsx)(`input`,{type:`range`,min:`0`,max:`1`,step:`0.01`,value:p[e.id]?p[e.id][3]:1,onChange:t=>{let n=p[e.id]||[1,1,1,1];J(e.id,[n[0],n[1],n[2],parseFloat(t.target.value)])}})]})]})]},e.id))]}),(0,$.jsx)(`div`,{className:`preset-save-area`,children:pe?(0,$.jsxs)(`div`,{className:`preset-name-row`,children:[(0,$.jsx)(`input`,{type:`text`,className:`preset-name-input`,placeholder:`Preset name...`,value:j,onChange:e=>M(e.target.value),onKeyDown:e=>{e.key===`Enter`&&De(),e.key===`Escape`&&N(!1)},autoFocus:!0}),(0,$.jsx)(`button`,{className:`preset-confirm-btn`,onClick:De,children:`Save`}),(0,$.jsx)(`button`,{className:`preset-cancel-btn`,onClick:()=>N(!1),children:(0,$.jsx)(l,{size:12})})]}):(0,$.jsx)(`button`,{className:`btn-save-preset`,onClick:()=>{M(``),N(!0)},disabled:k.length>=20,title:k.length>=20?`Max 20 presets reached`:`Save current settings as preset`,children:`+ Save Preset`})})]}),(0,$.jsxs)(`section`,{className:`sidebar-section`,children:[(0,$.jsxs)(`div`,{className:`section-title`,children:[(0,$.jsx)(t,{size:16}),(0,$.jsx)(`span`,{children:`UV TRANSFORM`})]}),(0,$.jsxs)(`div`,{className:`uv-controls`,children:[(0,$.jsxs)(`div`,{className:`uv-row`,children:[(0,$.jsxs)(`div`,{className:`uv-col`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:`Scale X`}),(0,$.jsxs)(`span`,{className:`control-value`,children:[B[0].toFixed(2),`×`]})]}),(0,$.jsx)(`input`,{type:`range`,min:`0.1`,max:`4.0`,step:`0.05`,value:B[0],onChange:e=>V([parseFloat(e.target.value),B[1]])})]}),(0,$.jsxs)(`div`,{className:`uv-col`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:`Scale Y`}),(0,$.jsxs)(`span`,{className:`control-value`,children:[B[1].toFixed(2),`×`]})]}),(0,$.jsx)(`input`,{type:`range`,min:`0.1`,max:`4.0`,step:`0.05`,value:B[1],onChange:e=>V([B[0],parseFloat(e.target.value)])})]})]}),(0,$.jsxs)(`div`,{className:`control-label`,style:{marginTop:`8px`},children:[(0,$.jsx)(`span`,{children:`Rotation`}),(0,$.jsxs)(`span`,{className:`control-value`,children:[H.toFixed(0),`°`]})]}),(0,$.jsx)(`input`,{type:`range`,min:`-180`,max:`180`,step:`1`,value:H,onChange:e=>_e(parseFloat(e.target.value))}),(0,$.jsxs)(`div`,{className:`uv-row`,style:{marginTop:`8px`},children:[(0,$.jsxs)(`div`,{className:`uv-col`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:`Offset X`}),(0,$.jsx)(`span`,{className:`control-value`,children:U[0].toFixed(2)})]}),(0,$.jsx)(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,value:U[0],onChange:e=>W([parseFloat(e.target.value),U[1]])})]}),(0,$.jsxs)(`div`,{className:`uv-col`,children:[(0,$.jsxs)(`div`,{className:`control-label`,children:[(0,$.jsx)(`span`,{children:`Offset Y`}),(0,$.jsx)(`span`,{className:`control-value`,children:U[1].toFixed(2)})]}),(0,$.jsx)(`input`,{type:`range`,min:`-1`,max:`1`,step:`0.01`,value:U[1],onChange:e=>W([U[0],parseFloat(e.target.value)])})]})]}),(0,$.jsxs)(`div`,{className:`uv-actions`,children:[(0,$.jsx)(`button`,{className:`uv-btn ${G?`active`:``}`,onClick:()=>ve(e=>!e),children:`2×2 Tile Preview`}),(0,$.jsx)(`button`,{className:`uv-btn`,onClick:()=>{V([1,1]),_e(0),W([0,0]),ve(!1)},children:`Reset`})]})]})]}),(0,$.jsxs)(`section`,{className:`sidebar-section`,children:[(0,$.jsxs)(`div`,{className:`section-title`,children:[(0,$.jsx)(s,{size:16}),(0,$.jsx)(`span`,{children:`MATERIAL MODE`})]}),(0,$.jsxs)(`div`,{className:`mode-toggle`,children:[(0,$.jsx)(`button`,{className:`toggle-btn ${h?``:`active`}`,onClick:()=>g(!1),children:`Standard`}),(0,$.jsx)(`button`,{className:`toggle-btn ${h?`active`:``}`,onClick:()=>g(!0),children:`iRacing Spec`})]}),h&&(0,$.jsxs)(`div`,{className:`info-box`,children:[(0,$.jsx)(o,{size:14}),(0,$.jsx)(`p`,{children:`R: Metallic | G: Roughness`})]})]}),ue.length>0&&(0,$.jsxs)(`div`,{className:`update-console`,children:[ue.map((e,t)=>(0,$.jsx)(`div`,{className:`log-entry`,children:e},t)),ae&&(0,$.jsxs)(`button`,{className:`btn-update-action download`,onClick:()=>window.electronAPI.downloadUpdate(),children:[`Download v`,ce?.version]}),oe&&(0,$.jsx)(`button`,{className:`btn-update-action install`,onClick:()=>window.electronAPI.restartAndInstall(),children:`Install & Restart`})]})]}),(0,$.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,$.jsx)(`span`,{className:`version-label`,children:`v3.4.0`}),ne&&(0,$.jsx)(`button`,{className:`check-updates-link`,onClick:()=>window.electronAPI?.checkForUpdates(),children:`Check for Updates`})]})]}),(0,$.jsxs)(`main`,{className:`main-content`,children:[(0,$.jsxs)(`header`,{className:`top-bar glass-panel`,children:[(0,$.jsx)(`div`,{className:`res-selector`,children:[1024,2048,4096].map(e=>(0,$.jsxs)(`button`,{onClick:()=>ee(e),className:_===e?`active`:``,children:[e/1024,`K`]},e))}),(0,$.jsxs)(`div`,{className:`actions`,children:[(0,$.jsx)(`button`,{className:`btn-secondary`,onClick:()=>te(!v),children:(0,$.jsx)(u,{size:18})}),(0,$.jsx)(`button`,{className:`btn-secondary btn-seamless ${z?`active`:``}`,onClick:()=>ge(e=>!e),title:z?`Seamless tiling export ON — edges will wrap perfectly`:`Seamless tiling export OFF`,children:(0,$.jsx)(`span`,{style:{fontSize:`10px`,fontWeight:800,letterSpacing:`0.05em`},children:`TILE`})}),(0,$.jsx)(`button`,{className:`btn-secondary btn-normal`,onClick:Te,title:`Export Normal Map`,children:(0,$.jsx)(`span`,{style:{fontSize:`11px`,fontWeight:800,letterSpacing:`0.05em`},children:`NRM`})}),(0,$.jsxs)(`button`,{className:`btn-primary`,onClick:Ce,children:[(0,$.jsx)(f,{size:18}),(0,$.jsx)(`span`,{children:`Export PNG`})]}),(0,$.jsxs)(`button`,{className:`btn-primary btn-set`,onClick:we,title:`Export the full iRacing set: diffuse + spec + normal maps with matching filenames`,children:[(0,$.jsx)(f,{size:18}),(0,$.jsx)(`span`,{children:`Export Set`})]})]})]}),(0,$.jsx)(`div`,{className:`viewport`,children:(0,$.jsxs)(`div`,{className:`canvas-wrapper`,children:[(0,$.jsx)(`canvas`,{ref:e}),(0,$.jsxs)(`div`,{className:`canvas-overlay`,children:[G&&(0,$.jsx)(`span`,{className:`tile-badge`,children:`TILING 2×2`}),(0,$.jsxs)(`span`,{children:[_,` x `,_,` PREVIEW`]})]})]})})]}),(0,$.jsx)(`style`,{children:`
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
        .card-body { display: flex; gap: 10px; align-items: flex-start; }
        .card-text { flex: 1; min-width: 0; }
        .pattern-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
          object-fit: cover;
          background: #1a1a20;
        }
        .pattern-thumb.placeholder { background: linear-gradient(135deg, #15151a, #1d1d24); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .pattern-category { font-size: 9px; font-weight: 800; color: var(--color-accent); text-transform: uppercase; background: rgba(37, 99, 235, 0.1); padding: 2px 6px; border-radius: 4px; }
        .pattern-card.active { background: rgba(37, 99, 235, 0.1); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .pattern-name { font-weight: 600; font-size: 13px; color: #fff; }
        .new-badge {
          display: inline-block;
          margin-left: 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #fff;
          background: var(--color-accent);
          border-radius: 4px;
          padding: 1px 5px;
          vertical-align: 2px;
        }
        .patterns-title { position: relative; }
        .sort-toggle {
          margin-left: auto;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          color: var(--color-text-dim);
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-toggle:hover:not(.active) { background: rgba(255,255,255,0.1); color: #fff; }
        .sort-toggle.active { background: var(--color-accent); color: #fff; box-shadow: var(--shadow-glow); }
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
        .color-value-row { display: flex; gap: 6px; }
        .hex-input { flex: 1.4; min-width: 0; background: #1a1a20; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 5px 6px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text); text-transform: uppercase; }
        .hex-input:focus { border-color: var(--color-accent); outline: none; }
        .rgb-field { flex: 1; display: flex; align-items: center; gap: 3px; min-width: 0; }
        .rgb-field span { font-size: 9px; font-weight: 800; color: var(--color-text-dim); }
        .rgb-field input { width: 100%; min-width: 0; background: #1a1a20; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 5px 4px; font-family: var(--font-mono); font-size: 10px; color: var(--color-text); -moz-appearance: textfield; appearance: textfield; }
        .rgb-field input::-webkit-inner-spin-button, .rgb-field input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .rgb-field input:focus { border-color: var(--color-accent); outline: none; }
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
        .actions { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
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
        .btn-seamless.active { background: rgba(37,99,235,0.3); color: var(--color-accent); box-shadow: var(--shadow-glow); }
        .btn-set { background: rgba(37,99,235,0.18); color: var(--color-accent); border: 1px solid rgba(37,99,235,0.45); box-shadow: none; }
        .btn-set:hover { background: rgba(37,99,235,0.3); transform: translateY(-1px); }
        .tile-badge { background: var(--color-accent); color: #fff; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.08em; }
        .canvas-overlay { display: flex; align-items: center; gap: 8px; }
      `})]})}(0,Wi.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(X.StrictMode,{children:(0,$.jsx)(Qi,{})}));