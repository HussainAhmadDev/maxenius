/* eslint-disable no-var */
//WEBGL

import { useEditorStore } from '@/store/EditorStore';

export function convert3D(
  path: string | any[],
  h: number,
  fillC: string | undefined,
  outlineC: string | undefined,
) {
  const ret = new OBJfile([], []);
  for (let i = 0; i < path.length - 1; i++) {
    const x1 = path[i].x,
      x2 = path[i + 1].x,
      y1 = path[i].y,
      y2 = path[i + 1].y;

    ret.combine(drawExtrude([x1, y1], [x2, y2], -h, fillC, outlineC));
  }

  return ret;
}

export function drawExtrude(
  start: [number, number],
  end: [number, number],
  length = 200,
  fillColor = 'grey',
  strokeColor = 'white',
) {
  const { canvasInstance } = useEditorStore.getState();
  canvasInstance.push();
  canvasInstance.stroke(strokeColor);
  canvasInstance.strokeWeight(0.5);
  canvasInstance.fill(fillColor);
  canvasInstance.beginShape();
  canvasInstance.vertex(...start);
  canvasInstance.vertex(...end);
  canvasInstance.vertex(end[0], end[1], length);
  canvasInstance.vertex(start[0], start[1], length);
  canvasInstance.endShape(canvasInstance.CLOSE);
  canvasInstance.pop();

  return new OBJfile(
    [start, end, [end[0], end[1], -length], [start[0], start[1], -length]],
    [[1, 2, 3, 4]],
  );
}

export function drawShape(
  vertices: string | any[],
  fillColor = 'grey',
  strokeColor = 'white',
) {
  const { canvasInstance } = useEditorStore.getState();
  const vOBJ = [];
  const f = [];

  canvasInstance.push();
  canvasInstance.stroke(strokeColor);
  canvasInstance.strokeWeight(0.5);
  canvasInstance.fill(fillColor);
  canvasInstance.beginShape();
  for (let v = 0; v < vertices.length; v++) {
    canvasInstance.vertex(vertices[v].x, vertices[v].y);

    vOBJ.push([vertices[v].x, vertices[v].y, 0]);
    f.push(v + 1);
  }
  canvasInstance.endShape(canvasInstance.CLOSE);
  canvasInstance.pop();

  return new OBJfile(vOBJ, [f]);
}

export function drawAxis(unit: number) {
  const { canvasInstance, nickainley } = useEditorStore.getState();
  canvasInstance.push();
  canvasInstance.strokeWeight(5);
  canvasInstance.textSize(40);
  canvasInstance.textFont(nickainley);
  // x axis
  canvasInstance.stroke(255, 0, 0);
  canvasInstance.line(0, 0, 0, unit, 0, 0);
  canvasInstance.fill(255, 0, 0);
  canvasInstance.text('X', unit + 5, 0, 0);

  // y axis
  canvasInstance.stroke(0, 255, 0);
  canvasInstance.line(0, 0, 0, 0, unit, 0);
  canvasInstance.fill(0, 255, 0);
  canvasInstance.textFont(nickainley);
  canvasInstance.text('Y', 0, unit + 5, 0);

  /*
  if (pointMan.finished) {
      // z axis
      stroke(0, 0, 255);
      line(0, 0, 0, 0, 0, unit);
      fill(0, 0, 255);
      textFont(nickainley);
      text("Z", 0, 0, unit + 5);
  }*/
  canvasInstance.pop();
}

export function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export class OBJfile {
  vertices: any;
  data: string;
  faces: any;
  constructor(vertices: any[], faces: number[][]) {
    this.vertices = vertices;
    this.faces = faces;
    this.data = '';
  }

  combine(obj2: OBJfile) {
    for (const f of obj2.faces) {
      const n = [];
      for (const v of f) {
        n.push(v + this.vertices.length);
      }

      this.faces = this.faces.concat([n]);
    }
    this.vertices = this.vertices.concat(obj2.vertices);

    return this;
  }

  export(includeDownload = false) {
    this.data = '';

    for (var v of this.vertices) {
      this.data +=
        'v ' +
        (v[0] ? v[0] : 0) +
        ' ' +
        (v[1] ? v[1] : 0) +
        ' ' +
        (v[2] ? v[2] : 0) +
        '\n';
    }

    for (const f of this.faces) {
      let facedata = '';
      for (var v of f) {
        facedata += v + ' ';
      }

      this.data += 'f ' + facedata + '\n';
    }

    if (includeDownload) {
      download('export.obj', this.data);
    }

    return this.data;
  }
}
