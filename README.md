# dotBeats · 26 mm Assembly

[Explore the assembly](https://evannnx.github.io/dotbeats-case-studio/) · [Download parts](https://evannnx.github.io/dotbeats-case-studio/#downloads)

A fixed 26 mm assembly viewer with exploded views, part explanations and a hardware list.

dotBeats C01 / 26 mm assembly
Units: STL in mm, GLB in metres. Print parts separately.
Print: base x1, lid x1, cap x6, plug x6. panel is an optional single-key fit coupon.
Hardware: 4 x M2.5 brass heat-set inserts (4.6 mm OD x 4 mm length); 4 x M2.5 x 8 mm machine screws (length measured below head). Head must fit a 5 mm diameter x 3.5 mm deep recess.
Insert pockets: diameter 4.0 mm, nominal depth 5.0 mm, in the lid posts. Install from the open ends of the posts before closing the case. Screws enter from the underside of the base.
Assembly: insert keycaps from outside the lid; place the motors inside; fit the carrier/plunger from inside and bond the cap-to-carrier joint without contaminating sliding surfaces. Fit the PCB and battery in the base. Lower the lid so each plunger aligns with a switch, then install the four enclosure screws.
This enclosure hardware does not specify PCB retention screws. PCB mounting and side-button internals remain prototype details to verify.
Motor reference: LRA1040 family diameter 10 mm x 4 mm; verify the exact -0301 unit and solder protrusions before purchase/printing. Six motors are needed for six active face buttons. Use the existing matching PCB, ESP and switches. Battery envelope: diameter 18.7 mm x 53.3 mm, wire protrusion envelope 21.7 mm.
Test one printed button first. Switch actuation, overtravel, return, adhesive, wire routing and FDM clearances require physical validation.

## Development

`npm ci` then `npm run dev`. Run `npm run build`, copy dist to docs, add docs/.nojekyll, and push main to publish GitHub Pages.
