import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { P5CanvasInstance, ReactP5Wrapper, SketchProps } from '@p5-wrapper/react';
import p5 from 'p5';

import { mouseWheel } from '@/components/editor/app';
import { FloorPlanManager } from '@/components/editor/floorPlanManager';
import { PointManager } from '@/components/editor/PointManager';
import EditorSidebar from '@/components/editor/sidebar';
import ToolbarActions from '@/components/editor/toolbar';
import { useEditorStore } from '@/store/EditorStore';

(window as any).p5 = p5;

function sketch(p5: P5CanvasInstance<SketchProps>) {
  useEditorStore.setState({ canvasInstance: p5 });
  let floorPlan: FloorPlanManager;
  let trashPM: PointManager;
  let nickainley: p5.Font;
  let canvas: p5.Renderer;

  // let savedProject: null | unknown;
  const { projectData } = useEditorStore.getState();

  p5.preload = () => {
    nickainley = p5.loadFont('/Muli-Regular.ttf');
    useEditorStore.setState({ zoomVal: 1, cameraPosition: { x: 0, y: 0 } });
  };

  p5.setup = () => {
    floorPlan = new FloorPlanManager();
    trashPM = new PointManager([]);
    const container = 'canvas-container';

    trashPM.convertToUnit = true;
    canvas = p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
    canvas.parent(container);
    document.body.addEventListener('keydown', keyPress, false);
    canvas.elt.style.visibility = 'visible';
    if (projectData?.file) {
      floorPlan?.import(JSON.stringify(projectData.file));
    }

    const cam = p5.createCamera();
    p5.setCamera(cam);
    useEditorStore.setState({
      floorPlan,
      lockedProfile: floorPlan?.autoProfiles!.length > 0 || false,
      trashPM,
      nickainley,
      renderer: canvas,
    });
    // p.noLoop();
    p5.noSmooth(); // Disable multisample
  };

  p5.draw = () => {
    const { floorPlan, cameraPosition, zoomVal } = useEditorStore.getState();
    p5.background('white');
    if (floorPlan?.tool === 3) {
      useEditorStore.setState({ zoomVal: 1 });

      p5.scale(1);
      p5.orbitControl(1, 1);
      const export3D = document.getElementById('export3D');
      if (export3D) export3D.style.display = 'inline';
      p5.push();
      p5.translate(-p5.width / 2, -p5.height / 2);
      floorPlan?.draw();
      p5.pop();
    } else {
      p5.camera();
      const export3D = document.getElementById('export3D');
      if (export3D) export3D.style.display = 'none';
      p5.translate(-p5.width / 2 + cameraPosition.x, -p5.height / 2 + cameraPosition.y);
      p5.scale(zoomVal, zoomVal);
      p5.cursor(floorPlan?.dragging ? p5.MOVE : p5.HAND);
      floorPlan?.draw();
    }
  };
  p5.mouseWheel = (event) => mouseWheel(event);

  const keyPress = () => {
    // Handle key press
  };
}

function EditorRoot() {
  const { pathname } = useLocation();
  const { floorPlan, setZoomVal } = useEditorStore();

  useEffect(() => {
    if (pathname === '/editor' && floorPlan) {
      return setZoomVal(1);
    }
  }, [floorPlan, pathname, setZoomVal]);

  return (
    <>
      <Box position="relative" sx={{ height: '100vh' }}>
        <div id="canvas-container">
          <ReactP5Wrapper sketch={sketch} />
        </div>
        <ToolbarActions />
        <EditorSidebar />
      </Box>
    </>
  );
}
export default EditorRoot;
