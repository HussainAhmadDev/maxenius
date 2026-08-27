import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';
import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';

import { useEditorStore } from '@/store/EditorStore';
import { PDFProfile } from '@/types/PdfProfile';

const updateFieldValue = (name: string) =>
  (document.getElementsByName(name)[0] as HTMLInputElement)?.value?.replace(',', '.');

interface Props {
  index: number;
  field: FieldArrayWithId<
    {
      id: number | null;
      profiles: PDFProfile[] | null | undefined;
    },
    'profiles',
    'id'
  >;
}
function Dimensions({ index, field }: Props) {
  const { formState, watch } = useFormContext();
  const [
    aMass,
    bMass,
    cMass,
    aMassAngle,
    bMassAngle,
    cMassAngle,
    aMassOverhang,
    cMassOverhang,
  ] = watch([
    `profiles[${index}].a_mass`,
    `profiles[${index}].b_mass`,
    `profiles[${index}].c_mass`,
    `profiles[${index}].a_mass_angle`,
    `profiles[${index}].b_mass_angle`,
    `profiles[${index}].c_mass_angle`,
    `profiles[${index}].a_mass_overhang`,
    `profiles[${index}].c_mass_overhang`,
  ]);

  function sketch(p: P5CanvasInstance) {
    const { projectData } = useEditorStore.getState();
    if (!projectData) {
      return;
    }
    const canvDivs = document.getElementsByClassName('canvasDivs');

    p.setup = function () {
      const c = p.createCanvas(canvDivs[0].getBoundingClientRect().width, 300);
      c.elt.id = `profile${index}`;
      c.elt.style.margin = '10px 0px';
    };
    const pdf_data = projectData?.file.pdf[projectData?.file.pdf.length - 1]?.pdf_data;

    p.draw = function () {
      p.clear();
      const a_mass = parseFloat(aMass?.replace(',', '.'));
      const b_mass = parseFloat(bMass?.replace(',', '.'));
      const c_mass = parseFloat(cMass?.replace(',', '.'));

      const a_mass_ang = parseFloat(aMassAngle.replace(',', '.'));
      const b_mass_ang = parseFloat(bMassAngle.replace(',', '.'));
      const c_mass_ang = parseFloat(cMassAngle.replace(',', '.'));

      const a_mass_over = parseFloat(aMassOverhang.replace(',', '.'));
      const c_mass_over = parseFloat(cMassOverhang.replace(',', '.'));

      const j = pdf_data[0][0].p;
      let maxID = 0;
      let maxX = Number.NEGATIVE_INFINITY;
      for (let x = 0; x < j.inns.length; x++) {
        if (j.inns[x] + j.outs[x] + j.wallWidths[x] > maxX) {
          maxX = j.inns[x] + j.outs[x] + j.wallWidths[x];
          maxID = x;
        }
      }
      const z_prof_a = j.zProfilesA[maxID];
      const z_prof_c = j.zProfilesC[maxID];

      let scaleH;
      if (z_prof_a == z_prof_c) {
        scaleH = 2 * p.max(a_mass, c_mass);
      } else {
        scaleH = 1.5 * (a_mass + c_mass);
      }

      const scaleW = 1.5 * b_mass;

      const offset = 10;

      p.push();
      p.background(0, 0, 0, 0);
      p.pixelDensity(2);
      // color
      p.stroke(j.col3D);
      // thickness
      p.strokeWeight(parseFloat(updateFieldValue('materialstärke')) * 2);

      {
        // Color preview
        p.push();
        p.fill(j.col3D);
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(10, 10, 20, 20, 5);
        p.pop();
      }

      p.angleMode(p.DEGREES);
      // Translate, so that the profile fits in the canvas
      if (z_prof_a == z_prof_c && !z_prof_a) {
        p.translate(p.width / 2, p.height / 5);
      } else if (z_prof_a == z_prof_c && z_prof_a) {
        p.translate(p.width / 2, (4 * p.height) / 5);
      } else {
        p.translate(p.width / 2, p.height / 2);
      }
      p.rotate(180);
      p.scale(p.min(p.width / scaleW, p.height / scaleH));

      //B mass part 1
      p.rotate(-b_mass_ang);
      p.push();
      {
        // Length descriptor
        p.push();
        p.fill(0);
        p.noStroke();
        p.rotate(-90);
        p.text(b_mass + ' mm', p.textWidth(b_mass + ' mm') / -2, -offset);
        p.pop();
      }
      p.line(0, 0, 0, b_mass / 2);
      p.translate(0, b_mass / 2);

      // A mass
      {
        // Angle descriptor
        p.push();
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(0);
        p.arc(0, 0, 50, 50, 90, 90 + b_mass_ang);

        p.rotate(180 + b_mass_ang);
        p.fill(0);
        p.noStroke();
        p.text(b_mass_ang + '°', -30, -30);
        p.pop();
      }
      p.rotate(180 + b_mass_ang);
      p.line(0, 0, 0, a_mass);
      {
        // Length descriptor
        p.push();
        p.fill(0);
        p.noStroke();
        p.translate(0, a_mass / 2);
        p.rotate(-90);
        p.text(a_mass + ' mm', p.textWidth(a_mass + ' mm') / -2, -offset);
        p.pop();
      }
      p.translate(0, a_mass);

      // A overhang
      {
        // Angle descriptor
        p.push();
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(0);
        p.arc(0, 0, 50, 50, 90, 90 + a_mass_ang);

        p.fill(0);
        p.noStroke();
        p.text(a_mass_ang + '°', -30 - p.textWidth(c_mass_ang + '°') / 2, 30);
        p.pop();
      }
      p.rotate(180 + a_mass_ang);
      p.line(0, 0, 0, a_mass_over);
      {
        // Length descriptor
        p.push();
        p.fill(0);
        p.noStroke();
        p.translate(0, a_mass_over / 2);
        p.rotate(-90);
        p.text(
          a_mass_over + ' mm',
          p.textWidth(a_mass_over + ' mm') / -2 - a_mass_over - 5,
          -offset * (a_mass_ang > 90 ? -1.5 : 1),
        );
        p.pop();
      }

      // Reset
      p.pop();

      //B mass part 2
      p.line(0, 0, 0, -b_mass / 2);
      p.translate(0, -b_mass / 2);

      // C mass
      {
        // Angle descriptor
        p.push();
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(0);
        p.arc(0, 0, 50, 50, 90 + b_mass_ang, -90);

        p.rotate(180 + b_mass_ang);
        p.fill(0);
        p.noStroke();
        p.text(180 - b_mass_ang + '°', 30, -30);
        p.pop();
      }
      p.rotate(180 + b_mass_ang);
      p.line(0, 0, 0, c_mass);
      {
        // Length descriptor
        p.push();
        p.fill(0);
        p.noStroke();
        p.translate(0, c_mass / 2);
        p.rotate(90);
        p.text(c_mass + ' mm', p.textWidth(c_mass + ' mm') / -2, -offset);
        p.pop();
      }
      p.translate(0, c_mass);

      // C overhang
      {
        // Angle descriptor
        p.push();
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(0);
        p.arc(0, 0, 50, 50, 90 - c_mass_ang, 90);

        p.fill(0);
        p.noStroke();
        p.text(c_mass_ang + '°', 30, 30);
        p.pop();
      }
      p.rotate(180 - c_mass_ang);
      p.line(0, 0, 0, c_mass_over);
      {
        // Length descriptor
        p.push();
        p.fill(0);
        p.noStroke();
        p.translate(0, c_mass_over / 2);
        p.rotate(90);
        p.text(
          c_mass_over + ' mm',
          p.textWidth(c_mass_over + ' mm') / -2 + c_mass_over + 5,
          -offset * (c_mass_ang > 90 ? -1.5 : 1),
        );
        p.pop();
      }

      p.pop();
    };
  }

  return (
    <Box bgcolor="white" sx={{ backgroundColor: 'white' }}>
      <ReactP5Wrapper sketch={sketch} formState={formState} field={field} index={index} />
      <div className="canvasDivs" />
    </Box>
  );
}

export default Dimensions;
