import { useEditorStore } from '@/store/EditorStore';

import { controls } from './constants';

function mousePos() {
  const { zoomVal, canvasInstance, cameraPosition } = useEditorStore.getState();
  const x = (canvasInstance.mouseX - cameraPosition.x) / zoomVal;
  const y = (canvasInstance.mouseY - cameraPosition.y) / zoomVal;

  const xMax = (canvasInstance.width - cameraPosition.x) / zoomVal;
  const xMin = -cameraPosition.x / zoomVal;
  const yMax = (canvasInstance.height - cameraPosition.y) / zoomVal;
  const yMin = -cameraPosition.y / zoomVal;

  return {
    x: canvasInstance.constrain(x, xMin, xMax),
    y: canvasInstance.constrain(y, yMin, yMax),
  };
}

function isInFrame(x: number, y: number) {
  // Get toolbar element
  const toolbarElement = document.getElementById('canvas-toolbar');
  const canvasSidebar = document.querySelector('.canvas-sidebar') as HTMLElement;
  const isClickInCanvasSidebar =
    canvasSidebar &&
    x > canvasSidebar.offsetLeft &&
    x < canvasSidebar.offsetLeft + canvasSidebar.offsetWidth &&
    y > canvasSidebar.offsetTop &&
    y < canvasSidebar.offsetTop + canvasSidebar.offsetHeight;

  const isClickInToolbar =
    toolbarElement &&
    x > toolbarElement.offsetLeft &&
    x < toolbarElement.offsetLeft + toolbarElement.offsetWidth &&
    y > toolbarElement.offsetTop &&
    y < toolbarElement.offsetTop + toolbarElement.offsetHeight;

  const { zoomVal, canvasInstance, cameraPosition } = useEditorStore.getState();
  const xMax = (canvasInstance.width - cameraPosition.x) / zoomVal;
  const xMin = -cameraPosition.x / zoomVal;
  const yMax = (canvasInstance.height - cameraPosition.y) / zoomVal;
  const yMin = -cameraPosition.y / zoomVal;

  return (
    !isClickInCanvasSidebar &&
    !isClickInToolbar &&
    x > xMin &&
    x < xMax &&
    y > yMin &&
    y < yMax
  );
}

function zoom(type = 'in', value = 0.1, focusX: number, focusY: number, e?: any) {
  const { zoomVal, canvasInstance, cameraPosition, setZoomVal, setCameraPosition } =
    useEditorStore.getState();
  focusX = canvasInstance.width / 2;
  focusY = canvasInstance.height / 2;
  const width = canvasInstance.width;
  const height = canvasInstance.height;
  let dx;
  let dy;

  if (e) {
    const { x, y, deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = 1 * direction * factor;

    const wx = (x - controls.view.x) / (width * controls.view.zoom);
    const wy = (y - controls.view.y) / (height * controls.view.zoom);

    controls.view.x -= wx * width * zoom;
    controls.view.y -= wy * height * zoom;
    controls.view.zoom += zoom;
  }

  if (type !== 'in') {
    dx = (((2 * focusX) / width) * (width * (zoomVal - value) - width * zoomVal) * 1) / 2;
    dy =
      (((2 * focusY) / height) * (height * (zoomVal - value) - height * zoomVal) * 1) / 2;

    if (zoomVal - value > 0.1) {
      setZoomVal(zoomVal - value);
      setCameraPosition({
        x: controls.view.x,
        y: controls.view.y,
      });

      cameraPosition.x -= dx;
      cameraPosition.y -= dy;
    }
  } else {
    dx = (((2 * focusX) / width) * (width * (zoomVal + value) - width * zoomVal) * 1) / 2;
    dy =
      (((2 * focusY) / height) * (height * (zoomVal + value) - height * zoomVal) * 1) / 2;

    if (zoomVal + value < 10) {
      setZoomVal(zoomVal + value);
      setCameraPosition({
        x: controls.view.x,
        y: controls.view.y,
      });

      cameraPosition.x -= dx;
      cameraPosition.y -= dy;
    }
  }
}

function pDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return {
    point: {
      x: xx,
      y: yy,
    },
    distance: Math.sqrt(dx * dx + dy * dy),
  };
}

function removeEmptyInputsFromBody() {
  const inputs = document.body.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type == 'text' && inputs[i].style.length == 0) {
      inputs[i].remove();
      i--;
    }
  }
}

function collidePointPoint(t: any, o: any, e: any, i: any, r: number | undefined) {
  const { canvasInstance } = useEditorStore.getState();
  return void 0 === r && (r = 0), canvasInstance.dist(t, o, e, i) <= r;
}

function collidePointLine(
  t: number,
  o: number,
  e: number,
  i: number,
  r: number,
  l: number,
  n: number,
) {
  const { canvasInstance } = useEditorStore.getState();
  const c = canvasInstance.dist(t, o, e, i),
    p = canvasInstance.dist(t, o, r, l),
    y = canvasInstance.dist(e, i, r, l);
  return 0 === n && (n = 0.1), c + p >= y - n && c + p <= y + n;
}

function collidePointArc(
  t: any,
  o: any,
  e: any,
  i: any,
  r: any,
  l: any,
  n: number,
  c?: number | undefined,
) {
  const { canvasInstance } = useEditorStore.getState();
  void 0 === c && (c = 0);
  const p = canvasInstance.createVector(t, o),
    y = canvasInstance.createVector(e, i),
    d = canvasInstance.createVector(r, 0).rotate(l),
    u = p.copy().sub(y);
  if (p.dist(y) <= r + c) {
    const s = d.dot(u),
      x = d.angleBetween(u);
    if (s > 0 && x <= n / 2 && x >= -n / 2) return !0;
  }
  return !1;
}

function collidePointCircle(t: any, o: any, e: any, i: any, r: number) {
  const { canvasInstance } = useEditorStore.getState();
  return canvasInstance.dist(t, o, e, i) <= r / 2;
}

export {
  collidePointArc,
  collidePointCircle,
  collidePointLine,
  collidePointPoint,
  isInFrame,
  mousePos,
  pDistance,
  removeEmptyInputsFromBody,
  zoom,
};
