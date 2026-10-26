"""CAD model generator. Usage: python build_case_v2.py [parameters.json] [--pcb path.stp]
Requires cadquery. Units mm. Model uses the same coordinates as the web editor.
"""
from pathlib import Path
import json,sys
import cadquery as cq
from OCP.BRepAdaptor import BRepAdaptor_Surface
OUT=Path(__file__).resolve().parent
P=dict(width=86.5,length=140,height=24,wall=2,floor=2,lid=2,radius=9,buttonD=13,buttonGapX=23.5,buttonGapY=49,buttonX=0,buttonY=2,sideD=12,sideGap=87,pcbX=11.135,pcbY=0,pcbZ=7.51,portClearance=.6,postD=3.6,pilotD=1.6)
args=sys.argv[1:]
source=str(OUT/'DFR1222.stp')
if '--pcb' in args:
 i=args.index('--pcb');source=args[i+1];del args[i:i+2]
if args:
 data=json.loads(Path(args[0]).read_text());P.update(data.get('parameters',data))
p=P
assert p['radius']>p['wall'] and p['height']>p['floor']+p['lid']+5
source_shape=cq.importers.importStep(source).val()
solids=source_shape.Solids();substrate=max(solids,key=lambda s:s.Volume())
holes=[]
for f in substrate.Faces():
 if f.geomType()=='CYLINDER':
  c=BRepAdaptor_Surface(f.wrapped).Cylinder()
  if abs(c.Radius()-1)<1e-5 and abs(c.Axis().Direction().Z())>.99:
   q=(round(c.Location().X(),8),round(c.Location().Y(),8))
   if q not in holes:holes.append(q)
assert len(holes)==4
holes.sort(key=lambda q:(q[1],q[0]))
xy=[(y+p['pcbX'],-x+p['pcbY']) for x,y in holes]
port=dict(x=-.06976233844,y=30.61500054,z=1.05351562325,width=9.00682486587,height=2.16096579007)

def box(w,h,d,r,z=0):return cq.Workplane('XY',origin=(0,0,z)).box(w,h,d,centered=(True,True,False)).edges('|Z').fillet(r)
w=p['width'];l=p['length'];t=p['wall'];bh=p['height']-p['lid']-.25
base=box(w,l,bh,p['radius']).faces('<Z').edges().fillet(.6)
base=base.cut(box(w-2*t,l-2*t,bh+2,p['radius']-t,p['floor']))
for y in [-p['sideGap']/2,p['sideGap']/2]:
 cut=cq.Workplane('YZ',origin=(-w/2-2,y,p['height']/2)).circle((p['sideD']+.6)/2).extrude(t+4)
 base=base.cut(cut)
# Local XY rounded opening rotates to world YZ, normal +X.
cut=box(port['width']+2*p['portClearance'],port['height']+2*p['portClearance'],t+4,1.4)
cut=cut.rotate((0,0,0),(0,1,0),90).rotate((0,0,0),(1,0,0),90).translate((w/2-t-2,p['pcbY']-port['x'],p['pcbZ']+port['z']))
base=base.cut(cut)
post_top=p['pcbZ']-1.665
assert post_top>p['floor']
for x,y in xy:
 post=cq.Workplane('XY',origin=(x,y,p['floor']-.1)).circle(p['postD']/2).circle(p['pilotD']/2).extrude(post_top-p['floor']+.1)
 base=base.union(post)
lid=box(w,l,p['lid'],p['radius'],p['height']-p['lid']).faces('>Z').edges().fillet(.6)
buttons=[]
for y in [-p['buttonGapY']/2,p['buttonGapY']/2]:
 for x in [-p['buttonGapX'],0,p['buttonGapX']]:
  x+=p['buttonX']; yy=y+p['buttonY']
  hole=cq.Workplane('XY',origin=(x,yy,p['height']-p['lid']-1)).circle((p['buttonD']+.6)/2).extrude(p['lid']+2)
  lid=lid.cut(hole)
  button=cq.Workplane('XY',origin=(x,yy,p['height']-.55)).circle(p['buttonD']/2).extrude(3.7).edges('>Z').fillet(.5)
  buttons.append(button)
side=[]
for y in [-p['sideGap']/2,p['sideGap']/2]:
 side.append(cq.Workplane('YZ',origin=(-w/2-2.9,y,p['height']/2)).circle(p['sideD']/2).extrude(3.6))
pcb=source_shape.rotate((0,0,0),(0,0,1),-90).translate((p['pcbX'],p['pcbY'],p['pcbZ']))
assembly=cq.Assembly(name='dotBeats_v2')
assembly.add(base,name='base_with_aligned_posts',color=cq.Color(.89,.90,.88))
assembly.add(lid,name='front_panel',color=cq.Color(.97,.97,.94))
assembly.add(pcb,name='DFR1222_original_STEP',color=cq.Color(.18,.33,.30))
for i,b in enumerate(buttons+side):assembly.add(b,name=f'button_visual_{i+1}',color=cq.Color(.97,.97,.95))
OUT.joinpath('exports').mkdir(exist_ok=True)
for name,obj in [('base_v2',base),('lid_v2',lid)]:
 assert obj.val().isValid() and len(obj.solids().vals())==1
 cq.exporters.export(obj,str(OUT/'exports'/f'{name}.step'))
 cq.exporters.export(obj,str(OUT/'exports'/f'{name}.stl'),tolerance=.03,angularTolerance=.1)
assembly.save(str(OUT/'exports'/'case_v2.step'))
# Check potentially colliding source solids with exact B-rep intersections.
collisions=[]
for i,s in enumerate(solids):
 ss=s.rotate((0,0,0),(0,0,1),-90).translate((p['pcbX'],p['pcbY'],p['pcbZ']))
 b=ss.BoundingBox()
 if b.zmin>=post_top+1e-5 and b.xmin>-w/2+t and b.xmax<w/2-t and b.ymin>-l/2+t and b.ymax<l/2-t:continue
 inter=base.val().intersect(ss);volume=inter.Volume()
 if volume>1e-5:collisions.append({'solid_index':i,'interference_mm3':volume})
report={'units':'mm','parameters':p,'source_mount_holes_mm':holes,'case_mount_holes_mm':xy,'mount_hole_diameter_mm':2,'mount_axis_error_mm':0,'usb_opening_center_yz_mm':[p['pcbY']-port['x'],p['pcbZ']+port['z']],'usb_outer_recess_mm':w/2-p['pcbX']-port['y'],'base_valid':base.val().isValid(),'lid_valid':lid.val().isValid(),'pcb_solid_collisions':collisions,'limitation':'USB shell is a surface model; full motor, switch, battery and fastener assembly not validated.'}
(OUT/'exports'/'validation_v2.json').write_text(json.dumps(report,indent=2))
(OUT/'defaults.json').write_text(json.dumps({'schema':'dotbeats-case-v2','units':'mm','parameters':p},indent=2))
print(json.dumps(report,indent=2))
