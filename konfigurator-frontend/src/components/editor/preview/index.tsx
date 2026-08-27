import { Box } from '@mui/material';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';

import { useEditorStore } from '@/store/EditorStore';

const sketch: Sketch = (p) => {
  const { floorPlan, nickainley } = useEditorStore.getState();
  const tab = document.getElementById('tab2') as HTMLElement;
  const rect = tab.getBoundingClientRect();

  p.setup = () => {
    p.createCanvas(223, rect.height - 20);
    // Create canvas and set parent element
    const pc = p.createCanvas(223, rect.height - 20);
    pc.elt.setAttribute('antialias', 'false');
    pc.parent('previewCanvasDiv');

    p.noSmooth(); // Disable multisample
    p.noLoop();
  };

  p.draw = () => {
    p.background(255);
    p.noLoop();

    if (floorPlan?.tool == 2) {
      //Draw a copy of the hovered profile
      if (floorPlan?.changingProfile == null) {
        // if (floorPlan?.hoverProfile !== null) {
        //   p.push();
        //   p.strokeCap(p.PROJECT);
        //   const avPos = floorPlan.hoverProfile.getAveragePosition();
        //   const avSize = floorPlan.hoverProfile.getAverageSize();
        //   const newSize = p.max(avSize.x, avSize.y);
        //   const sc = p.height / (newSize + 50);
        //   const dx = -avSize.x / 2 - avPos.x;
        //   const dy = -avSize.y / 2 - avPos.y;
        //   p.translate(
        //     (p.width + avSize.x * 1.75 * sc) / 2,
        //     (p.height + avSize.y * sc) / 2,
        //   );
        //   p.scale(1.75 * sc, sc);
        //   for (const part of floorPlan.hoverProfile.parts) {
        //     p.push();
        //     // Set the default color
        //     p.stroke(part.c);
        //     p.fill(part.c);
        //     p.strokeWeight(part.thickness * zoomVal);
        //     part.thickness = 4;
        //     p.line(
        //       part.points[0].x + dx,
        //       part.points[0].y + dy,
        //       part.points[1].x + dx,
        //       part.points[1].y + dy,
        //     );
        //     // DESCRIPTOR
        //     let text;
        //     if (
        //       floorPlan.hoverProfile.type == 'Straight' ||
        //       floorPlan.hoverProfile.type == 'End'
        //     ) {
        //       text =
        //         String.fromCharCode(
        //           ((floorPlan.hoverProfile.parts.indexOf(part) + 10) % 13) + 110,
        //         ) +
        //         '=' +
        //         p.round(floorPlan?.mainGeometry.grid.toUnit(part.length), 2) +
        //         floorPlan.mainGeometry.grid.unit; // Name descriptor
        //     } else {
        //       text = String.fromCharCode(
        //         ((floorPlan.hoverProfile.parts.indexOf(part) + 10) % 13) + 110,
        //       ); // Name descriptor
        //     }
        //     p.push();
        //     // Prepare for drawing
        //     p.noStroke();
        //     p.fill(part.c);
        //     p.translate(part.x + dx, part.y + dy);
        //     p.rotate(part.angle);
        //     // Prepare text
        //     p.textFont(nickainley);
        //     p.textSize(15);
        //     p.textAlign(p.CENTER, p.CENTER);
        //     // Draw text
        //     p.text(text, 0, -15);
        //     p.pop();
        //     p.pop();
        //   }
        //   p.pop();
        // }
      } else {
        // while (iteration < maxIterations) {
        //   for (const part of floorPlan.changingProfile.parts) {
        //     part.thickness = 4;
        //   }
        //   iteration++;
        // }

        p.loop();
        p.push();
        p.strokeCap(p.PROJECT);
        const avPos: { x: number; y: number } =
          floorPlan.changingProfile.getAveragePosition();
        const avSize: { x: number; y: number } =
          floorPlan.changingProfile.getAverageSize();

        const newSize = p.max(avSize.x, avSize.y);
        const sc = p.height / (newSize + 50);
        const dx = -avSize.x / 2 - avPos.x;
        const dy = -avSize.y / 2 - avPos.y;
        p.translate((p.width + avSize.x * 1.75 * sc) / 2, (p.height + avSize.y * sc) / 2);
        p.scale(1.75 * sc, sc);
        // console.log('changingProfile', floorPlan.changingProfile);

        for (const part of floorPlan.changingProfile.parts) {
          p.push();

          // LINE
          // Set the default color
          p.stroke(part.c);
          p.fill(part.c);
          p.strokeWeight(4);

          if (part.thickness < 4) {
            part.thickness = 4;
          }

          p.line(
            part.points[0].x + dx,
            part.points[0].y + dy,
            part.points[1].x + dx,
            part.points[1].y + dy,
          );

          // DESCRIPTOR
          let text;
          if (
            floorPlan.changingProfile.type == 'Straight' ||
            floorPlan.changingProfile.type == 'End'
          ) {
            text =
              String.fromCharCode(
                ((floorPlan.changingProfile.parts.indexOf(part) + 10) % 13) + 110,
              ) +
              '=' +
              p.round(floorPlan.mainGeometry.grid.toUnit(part.length), 2) +
              floorPlan.mainGeometry.grid.unit; // Name descriptor
          } else {
            text = String.fromCharCode(
              ((floorPlan.changingProfile.parts.indexOf(part) + 10) % 13) + 110,
            ); // Name descriptor
          }

          p.push();
          // Prepare for drawing
          p.noStroke();
          p.fill(part.c);
          p.translate(part.x + dx, part.y + dy);
          p.rotate(part.angle);

          // Prepare text
          p.textFont(nickainley);
          p.textSize(15);
          p.textAlign(p.CENTER, p.CENTER);

          // Draw text
          p.text(text, 0, -15);
          p.pop();

          p.pop();
        }
        p.noLoop();
        p.pop();
      }
    }
  };
};

const PreviewCanvas = () => {
  return (
    <Box id="tab2" sx={{ width: '100%', borderBottom: '1px solid black' }}>
      <ReactP5Wrapper sketch={sketch} />
      <Box id="previewCanvasDiv" sx={{ width: 223, height: 165, mx: 'auto' }}></Box>;
    </Box>
  );
};

export default PreviewCanvas;
