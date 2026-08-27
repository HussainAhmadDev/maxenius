import { P5CanvasInstance, SketchProps } from '@p5-wrapper/react';
import p5 from 'p5';

import { useEditorStore } from '@/store/EditorStore';

import { FloorPlanManager } from '../floorPlanManager';
import { PointManager } from '../PointManager';

export function sketch(p5: P5CanvasInstance<SketchProps>) {
  useEditorStore.setState({ canvasInstance: p5 });

  let floorPlan: FloorPlanManager;
  let trashPM: PointManager;
  let nickainley: p5.Font;
  let canvas: p5.Renderer;

  p5.preload = () => {
    nickainley = p5.loadFont('/Muli-Regular.ttf');
  };

  p5.setup = async () => {
    canvas = p5.createCanvas(window.innerWidth - 30, 1000, p5.WEBGL);
    canvas.elt.id = 'canvasPreview';
    document.body.addEventListener('keydown', keyPress, false);
    canvas.elt.style.visibility = 'visible';
    const projectData = useEditorStore.getState().projectData;
    // if (projectData) {
    floorPlan = new FloorPlanManager();
    trashPM = new PointManager([]);
    trashPM.convertToUnit = true;
    await useEditorStore.setState({
      floorPlan,
      trashPM,
      nickainley,
      renderer: canvas,
    });
    floorPlan?.import(JSON.stringify(projectData!.file));
    // } else {
    // }

    const cam = p5.createCamera();
    p5.setCamera(cam);

    p5.noSmooth(); // Disable multisample
  };

  p5.draw = () => {
    const { floorPlan, setZoomVal, setCameraPosition } = useEditorStore.getState();
    p5.background('white');
    floorPlan!.tool = -1;
    if (floorPlan?.tool === 3) {
      p5.scale(1);
      p5.orbitControl(1, 1);
      const export3D = document.getElementById('export3D');
      if (export3D) export3D.style.display = 'inline';
      p5.push();
      p5.translate(-p5.width / 2, -p5.height / 2);
      floorPlan?.draw();
      p5.pop();
    } else {
      const existingBounds = floorPlan?.getBounds();
      p5.camera();
      if (!existingBounds) return;
      const c = 25 / 800;
      const k = p5.pow(p5.max(existingBounds.w, existingBounds.h), 0.975) * c;
      const bounds = floorPlan?.getBounds(3 * k);
      if (!bounds) return;
      const minX = bounds.x.min;
      const maxX = bounds.x.max;
      const minY = bounds.y.min;
      const maxY = bounds.y.max;
      const w = bounds.w;
      const h = bounds.h;
      floorPlan?.draw();
      setZoomVal(p5.min(p5.width / w, p5.height / h));

      const export3D = document.getElementById('export3D');
      if (export3D) export3D.style.display = 'none';

      const x = (-(minX + maxX) * p5.min(p5.width / w, p5.height / h)) / 2 + p5.width / 2;
      const y =
        (-(minY + maxY) * p5.min(p5.width / w, p5.height / h)) / 2 + p5.height / 2;
      setCameraPosition({
        x,
        y,
      });
      p5.translate(-p5.width / 2 + x, -p5.height / 2 + y);

      p5.scale(p5.min(p5.width / w, p5.height / h));

      setTimeout(() => {
        p5.noLoop();
      }, 2000);
    }
  };
  const keyPress = () => {
    // Handle key press
  };
}
