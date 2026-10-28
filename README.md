# dotBeats · 26 mm Assembly

[Explore the assembly](https://evannnx.github.io/dotbeats-case-studio/) · [Download parts](https://evannnx.github.io/dotbeats-case-studio/#downloads)

A fixed 26 mm assembly viewer with exploded views, part explanations and a hardware list.

dotBeats C01 / 26 mm assembly
Units: STL in mm, GLB in metres. Print parts separately.
Print: base x1, lid x1, cap x6, plug x6. panel is an optional single-key fit coupon.
Hardware: 4 x M2.5 brass heat-set inserts (4.6 mm OD x 4 mm length); 4 x M2.5 x 8 mm machine screws (length measured below head). Head must fit a 5 mm diameter x 3.5 mm deep recess.
Insert pockets: diameter 4.0 mm, nominal depth 5.0 mm, in the lid posts. Install from the open ends of the posts before closing the case. Screws enter from the underside of the base.
Assembly: insert keycaps from outside the lid; place the motors inside; fit the carrier/plunger from inside and bond the cap-to-carrier joint without contaminating sliding surfaces. Fit the PCB and battery in the base. Lower the lid so each plunger aligns with a switch, then install the four enclosure screws.
The current S03 package includes PCB retention screws and side-button mounting; see the updates below.
Motor reference: LRA1040 family diameter 10 mm x 4 mm; verify the exact -0301 unit and solder protrusions before purchase/printing. Six motors are needed for six active face buttons. Use the existing matching PCB, ESP and switches. Battery envelope: diameter 18.7 mm x 53.3 mm, wire protrusion envelope 21.7 mm.
Test one printed button first. Switch actuation, overtravel, return, adhesive, wire routing and FDM clearances require physical validation.

## Development

`npm ci` then `npm run dev`. Run `npm run build`, copy dist to docs, add docs/.nojekyll, and push main to publish GitHub Pages.


## S01 side-button update
Two 6 × 6 × 4.3 mm momentary tactile switches at 80 mm centres. Integral base cradles, removable screw retainers, captured caps, and a nominal 0.50 mm stop. Download includes a single-button fit coupon. Reference: Omron B3F-1000; verify real switch dimensions and travel before printing the full base. Existing C01 lid and front-button parts are retained.


## S02 assembly guide and PCB mounting
Ten interactive assembly steps and a printable guide. Three PCB mounts now include centering bushes, insulating washers, M2.5 x 6 mm screws and underside hex-nut pockets. Use the S02 base; the S01 base lacks these pockets. PCB height remains unchanged. Download includes updated printable parts and digital checks; physical fit and button return still require testing.


## S03 centered front buttons (current)
The six front keys and matching lid openings are centered on the 86.5 × 140 × 26 mm enclosure. Keyed caps and offset carrier plungers preserve the existing PCB, ESP, USB and mounting positions. Use the matching S03 lid, caps and carriers together; the S02 base can be reused. The viewer opens in an orthographic front view and retains the ten assembly steps, exploded views and PCB hardware guide. The download contains the updated STL parts, assembly GLB and geometry checks. Physical fit, friction and return still require a trial print.
