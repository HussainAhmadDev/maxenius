import { useEditorStore } from '@/store/EditorStore';

import {
  collidePointArc,
  collidePointCircle,
  collidePointLine,
  collidePointPoint,
  mousePos,
  pDistance,
} from './others';
import { PointManager } from './PointManager';

/**
 * @param {PointManager} pointManager The pointManager parent
 * @param {Number} x The x coordinate (0 by default)
 * @param {Number} y The y coordinate (0 by default)
 * @param {Number} id The id of the point (-1 by default)
 */
export class Point {
  y: number;
  x: number;
  size: number;
  angle: null | Angle;
  parent: PointManager | undefined;
  mouseOver: (include?: boolean) => boolean;
  descriptors: any;
  locked: boolean;
  xoffset: number;
  yoffset: number;
  c: string;
  // state: EditorState;
  connectedToAddLine: boolean | undefined;
  saved: boolean;
  id: number;
  type: string;
  constructor(pointManager?: PointManager | undefined, x = 0, y = 0, id = -1) {
    // POINT MANAGER REFERENCE
    this.parent = pointManager;
    // POSITION AND SIZE
    this.x = x;
    this.y = y;
    this.size = 7;

    //ANGLE
    this.angle = null;
    // MOUSE INTERATIONS
    this.mouseOver = function (include = true) {
      let ret = false;

      ret =
        ret ||
        collidePointPoint(mousePos().x, mousePos().y, this.x, this.y, this.size / 2);
      for (const d of this.descriptors) {
        ret = ret || d.mouseOver();
      }

      if (this.angle != null && include) {
        ret = ret || this.angle.mouseOver(false);
      }
      return ret;
    };

    // ELEMENT DESCRIPTORS
    this.descriptors = [];

    // DRAGGING DATA
    this.locked = false;
    this.xoffset = 0;
    this.yoffset = 0;

    // OTHER
    this.c = 'grey';
    this.id = id;
    this.type = 'Point';

    this.saved = false;
  }

  draw(truePosition = true, forceHover = false) {
    const { canvasInstance, zoomVal } = useEditorStore.getState();
    canvasInstance.push();

    // Set the default color
    canvasInstance.stroke(this.c);
    canvasInstance.fill(this.c);

    if (
      (this.parent &&
        this.parent.allowHover &&
        this.mouseOver() &&
        this.parent.hoveringObject == this) ||
      forceHover
    ) {
      // Mouse is over the point and this point is the points managers hoveringObject
      // Make the size bigger
      this.size = 15;

      if (canvasInstance.mouseIsPressed) {
        // Mouse is held down at the same time
        // Set different color scheme -> red stroke, white fill
        canvasInstance.stroke(200, 79, 100);
        canvasInstance.fill('white');

        // Set stroke weight
        canvasInstance.strokeWeight(2 * zoomVal);
      } else {
        // Mouse isn't held down at the same time
        // Turn off stroke
        canvasInstance.noStroke();
      }
    } else {
      //Mouse isn't over the point
      // Make the size smaller
      this.size = 7;

      // Turn off stroke
      canvasInstance.noStroke();
    }

    //Draw the ellipse
    if (truePosition) {
      canvasInstance.ellipse(this.x, this.y, this.size, this.size);
    } else {
      canvasInstance.ellipse(0, 0, this.size, this.size);
    }
    canvasInstance.pop();
  }

  drawDescriptors() {
    // Draw all the descriptors
    for (const d of this.descriptors) {
      d.draw();
    }
  }

  setAngle(angle: Angle) {
    this.angle = angle;
    if (this.angle?.point != this) {
      this.angle?.setPoint(this);
    }
  }

  lock(val: boolean) {
    this.locked = val;
    if (!this.parent?.snapToG) {
      this.xoffset = mousePos().x - this.x;
      this.yoffset = mousePos().y - this.y;
    } else {
      this.xoffset = 0;
      this.yoffset = 0;
    }

    if (this.angle != null) {
      this.angle.locked = val;
    }
  }
}

/**
 * @param {PointManager} pointManager The pointManager parent
 * @param {Number} x The x coordinate (0 by default)
 * @param {Number} y The y coordinate (0 by default)
 * @param {Number} start The absolute starting angle (0 by default)
 * @param {Number} stop The absolute ending angle (0 by default)
 * @param {Number} id The id of the angle (-1 by default)
 */
export class Angle {
  descriptors: any;
  x: number;
  radius: number;
  y: number;
  c: string;
  parent: PointManager;
  start: number;
  stop: number;
  relative: number;
  point: Point | null;
  mouseOver: (include?: boolean) => boolean;
  id: number;
  type: string;
  saved: boolean;
  locked: boolean | undefined;
  xoffset: number | undefined;
  yoffset: number | undefined;
  constructor(pointManager: PointManager, x = 0, y = 0, start = 0, stop = 0, id = -1) {
    // POINT MANAGER REFERENCE
    this.parent = pointManager;
    const { canvasInstance } = useEditorStore.getState();
    // POSITION AND SIZE
    this.x = x;
    this.y = y;
    this.radius = 30;

    // ANGLE
    this.start = start;
    this.stop = stop;
    this.relative = this.stop - this.start;
    if (this.relative < 0) {
      this.relative = this.relative + canvasInstance.PI * 2;
    }

    // POINT
    this.point = null;

    // MOUSE INTERATIONS
    this.mouseOver = function (include = true) {
      let ret = false;
      ret =
        ret ||
        collidePointArc(
          mousePos().x,
          mousePos().y,
          this.x,
          this.y,
          this.radius / 2,
          this.start + this.relative / 2,
          this.relative,
        );

      for (const d of this.descriptors) {
        ret = ret || d.mouseOver();
      }

      if (this.point != null && include) {
        ret = ret || this.point.mouseOver(false);
      }
      return ret;
    };

    // ELEMENT DESCRIPTORS
    this.descriptors = [
      new ElementDescriptor(
        this.x - this.radius * canvasInstance.cos(this.start + this.relative / 2),
        this.y - this.radius * canvasInstance.sin(this.start + this.relative / 2),
        0,
        canvasInstance.round((this.relative * 180) / canvasInstance.PI, 2) + '°',
        { x: 0, y: 0 },
      ),
    ];

    // OTHER
    this.c = 'grey';
    this.id = id;
    this.type = 'Angle';

    this.saved = false;
  }

  draw(truePosition = true, forceHover = false) {
    const { canvasInstance, zoomVal } = useEditorStore.getState();
    canvasInstance.push();
    // Set the default color
    canvasInstance.stroke(this.c);
    canvasInstance.noFill();

    let hover = false;
    if (this.point != null) {
      hover = this.parent.hoveringObject == this.point && this.point?.mouseOver();
    }
    if ((this.parent.allowHover && hover) || forceHover) {
      // Mouse is over the angle
      // Set to larger thickness
      canvasInstance.strokeWeight(4 * zoomVal);
    } else {
      // Mouse isn't over the point
      // Set to smaller thickness
      canvasInstance.strokeWeight(2 * zoomVal);
    }

    if (truePosition) {
      canvasInstance.arc(this.x, this.y, this.radius, this.radius, this.start, this.stop);
    } else {
      canvasInstance.arc(0, 0, this.radius, this.radius, 0, this.relative);
    }
    canvasInstance.pop();
  }

  drawDescriptors() {
    // Draw all the descriptors
    for (const d of this.descriptors) {
      d.draw();
    }
  }

  setPoint(point: Point | null) {
    this.point = point;
    if (this.point?.angle != this) {
      (this.point as any)?.setPoint(this);
    }
  }

  lock(val: boolean) {
    this.locked = val;
    this.xoffset = mousePos().x - this.x;
    this.yoffset = mousePos().y - this.y;

    if (this.point != null) {
      this.point.locked = val;
    }
  }
}

/**
 * @param {PointManager} pointManager The pointManager parent (no default value)
 * @param {Point} point1 The first point (new Point() by default)
 * @param {Point} point2 The second point (new Point() by default)
 * @param {Number} id The id of the line (-1 by default)
 */
export class Line {
  isOuter: boolean;
  c: any;
  angle: number;
  parent: PointManager;
  points: Point[];
  thickness: number;
  length: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  descriptors: ElementDescriptor[];
  id: number;
  type: string;
  saved: boolean;
  between: boolean;
  nextTo: boolean;
  mouseOver: () => boolean;
  aMass: any;
  wallW: number | undefined;
  inn: number | undefined;
  out: number | undefined;
  cMass: number | undefined;
  z_profile_a: boolean | undefined;
  z_profile_c: boolean | undefined;
  constructor(
    pointManager: PointManager,
    point1 = new Point(),

    point2 = new Point(),
    id = -1,
  ) {
    // POINT MANAGER REFERENCE
    this.parent = pointManager;
    const { canvasInstance } = useEditorStore.getState();
    // POSITION AND SIZE
    this.points = [point1, point2];
    this.length = canvasInstance.dist(
      this.points[0].x,
      this.points[0].y,
      this.points[1].x,
      this.points[1].y,
    );
    this.thickness = 2;
    this.x = (this.points[0].x + this.points[1].x) / 2;
    this.y = (this.points[0].y + this.points[1].y) / 2;

    // ANGLE
    this.dx = this.points[1].x - this.points[0].x;
    this.dy = this.points[1].y - this.points[0].y;
    this.angle = canvasInstance.atan2(this.dy, this.dx);

    // MOUSE INTERATIONS
    this.mouseOver = function () {
      let ret: boolean = false;
      ret =
        ret ||
        collidePointLine(
          mousePos().x,
          mousePos().y,
          this.points[0].x,
          this.points[0].y,
          this.points[1].x,
          this.points[1].y,
          this.thickness / 8,
        );

      for (const d of this.descriptors) {
        ret = ret || d.mouseOver();
      }
      // if (ret) console.log({ ret });
      return ret;
    };

    // ELEMENT DESCRIPTORS
    let text;
    if (this.parent.convertToUnit) {
      text =
        canvasInstance.round(this.length * this.parent.grid.conversionToUnit, 2) +
        ' ' +
        this.parent.grid.unit;
    } else text = canvasInstance.round(this.length, 2);

    this.descriptors = [
      new ElementDescriptor(this.x, this.y, this.angle, text, { x: 0, y: -7 }), // Length descriptor
    ];

    // OTHER
    this.c = 'grey';
    this.id = id;
    this.type = 'Line';

    this.saved = false;
    this.isOuter = false;
    this.between = false;
    this.nextTo = false;
  }

  toSimple() {
    return {
      x1: this.points[0].x,
      y1: this.points[0].y,
      x2: this.points[1].x,
      y2: this.points[1].y,
    };
  }

  reCalc() {
    const { canvasInstance } = useEditorStore.getState();
    // POSITION AND SIZE
    this.length = canvasInstance.dist(
      this.points[0].x,
      this.points[0].y,
      this.points[1].x,
      this.points[1].y,
    );
    this.thickness = 2;
    this.x = (this.points[0].x + this.points[1].x) / 2;
    this.y = (this.points[0].y + this.points[1].y) / 2;

    // ANGLE
    this.dx = this.points[1].x - this.points[0].x;
    this.dy = this.points[1].y - this.points[0].y;
    this.angle = canvasInstance.atan2(this.dy, this.dx);

    let text;
    if (this.parent.convertToUnit) {
      text =
        canvasInstance.round(this.length * this.parent.grid.conversionToUnit, 2) +
        ' ' +
        this.parent.grid.unit;
    } else text = canvasInstance.round(this.length, 2);

    this.descriptors = [
      new ElementDescriptor(this.x, this.y, this.angle, text, { x: 0, y: -7 }), // Length descriptor
    ];
  }

  draw = (truePosition = true, forceHover = false) => {
    const { canvasInstance, zoomVal } = useEditorStore.getState();
    canvasInstance.push();

    // Set the default color
    canvasInstance.stroke(this.c);
    canvasInstance.fill(this.c);
    canvasInstance.strokeWeight(this.thickness * zoomVal);

    if (
      (this.parent.allowHover &&
        this.mouseOver() &&
        this.parent.hoveringObject == this) ||
      forceHover
    ) {
      // Mouse is over the point
      // Set to larger thickness
      this.thickness = 4;
    } else {
      // Mouse isn't over the point
      // Set to smaller thickness
      this.thickness = 2;
    }

    if (truePosition) {
      canvasInstance.line(
        this.points[0].x,
        this.points[0].y,
        this.points[1].x,
        this.points[1].y,
      );
    } else {
      canvasInstance.line(0, 0, 0, this.length);
    }
    canvasInstance.pop();
  };

  drawDescriptors() {
    // Draw all the descriptors
    for (const d of this.descriptors) {
      d.draw();
    }
  }

  getAngleDeg() {
    const { canvasInstance } = useEditorStore.getState();
    return (this.angle * 180) / canvasInstance.PI;
  }

  lock(val: boolean) {
    // Lock both points
    this.points[0].lock(val);
    this.points[1].lock(val);
  }

  update() {
    this.reCalc();
  }
}

/**
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 * @param {Number} r The rotation
 * @param {string} text The text
 * @param {Object} offset The offset ({ x: 0, y: 0 } by default)
 */
export class ElementDescriptor {
  text: any;
  x: any;
  y: any;
  r: any;
  offset: { x: number; y: number };
  textSize: number;
  c: string;
  h: number;
  w: number;
  type: string;
  mouseOver: () => boolean;
  constructor(
    x: number,
    y: number,
    r: number,
    text: string | number,
    offset = { x: 0, y: 0 },
  ) {
    // POSITION, ROTATTION
    this.x = x;
    this.y = y;
    this.r = r;
    this.offset = offset;
    this.textSize = 10;

    // TEXT
    this.text = text?.toString();
    this.c = 'gray';

    // SIZE
    this.h = 10;
    this.w = (this.text.length * this.h * 7) / 10; // Approximate width
    const { canvasInstance } = useEditorStore.getState();
    // MOUSE INTERATIONS
    this.mouseOver = function () {
      return collidePointCircle(
        mousePos().x,
        mousePos().y, // Mouse
        this.x + this.offset.x * canvasInstance.sin(this.r), // Collider x
        this.y + this.offset.y * canvasInstance.cos(this.r), // Collider y
        (7 / 10) * this.w,
      ); // Collider size
    };

    // OTHER
    this.type = 'ElementDescriptor';
  }

  draw() {
    const { canvasInstance, nickainley } = useEditorStore.getState();
    canvasInstance.push();

    // This is the approximate collider
    // ellipse(this.x + this.offset.x * sin(this.r), this.y + this.offset.y * cos(this.r), 7 / 10 * this.w)

    // Prepare for drawing
    canvasInstance.noStroke();
    canvasInstance.fill(this.c);
    canvasInstance.translate(this.x, this.y);
    canvasInstance.rotate(this.r);

    // Prepare text
    canvasInstance.textFont(nickainley);
    canvasInstance.textSize(this.textSize);
    canvasInstance.textAlign(canvasInstance.CENTER, canvasInstance.CENTER);

    // Draw text
    canvasInstance.text(this.text, this.offset.x, this.offset.y - this.h / 2);

    canvasInstance.pop();
  }
}

export class Grid {
  unit: string;
  // state: EditorState;
  conversionToUnit: number;
  parent: PointManager;
  cellSize: number;
  /**
   * The constructor of the Grid object.
   * @param {PointManager} pointManager Reference to the PointManage object
   * @param {Number} cellSize The size of the grid cell.
   */
  constructor(pointManager: PointManager, cellSize: number) {
    // this.state = state;
    this.parent = pointManager;
    this.cellSize = cellSize;

    this.unit = 'm';
    this.conversionToUnit = 1 / 50;
  }

  /**
   * Function for drawing the grid.
   */
  draw() {
    const { canvasInstance, cameraPosition, zoomVal } = useEditorStore.getState();
    // Draw the grid
    canvasInstance.push();

    canvasInstance.stroke(128, 64);
    canvasInstance.strokeWeight(1);
    const xMax = (canvasInstance.width - cameraPosition.x) / zoomVal;
    const xMin = -cameraPosition.x / zoomVal;
    const yMax = (canvasInstance.height - cameraPosition.y) / zoomVal;
    const yMin = -cameraPosition.y / zoomVal;

    //Draw the vertical line
    for (
      let x = this.cellSize * canvasInstance.ceil(xMin / this.cellSize);
      x <= xMax;
      x += this.cellSize
    ) {
      canvasInstance.line(x, yMin, x, yMax);
    }

    //Draw the horizontal lines
    for (
      let y = this.cellSize * canvasInstance.ceil(yMin / this.cellSize);
      y <= yMax;
      y += this.cellSize
    ) {
      canvasInstance.line(xMin, y, xMax, y);
    }
    canvasInstance.pop();
    // console.log('🚀 ~ Grid ~ draw ~ Grid drawing working:');
  }

  /**
   * Function that returns the position of the closest snap point.
   * @param {Number} x X position of the original point that is being snapped
   * @param {Number} y Y position of the original point that is being snapped
   * @param {Array} otherPoints Array of other points that could be snapped to ([] by default)
   * @param {Array} otherLines Array of other lines that could be snapped to ([] by default)
   */
  getClosestSnap(
    x: number,
    y: number,
    otherPoints: Array<any> = [],
    otherLines: Array<any> = [],
  ) {
    const { canvasInstance } = useEditorStore.getState();
    // The position as a measure of cells
    const cellX = x / this.cellSize;
    const cellY = y / this.cellSize;

    // Save the current closest position
    let closestPosition = {
      x: this.cellSize * canvasInstance.round(cellX),
      y: this.cellSize * canvasInstance.round(cellY),
    };

    // Loop through all the otherPoints
    for (const p of otherPoints) {
      if (
        canvasInstance.dist(p.x, p.y, x, y) <
        canvasInstance.dist(closestPosition.x, closestPosition.y, x, y)
      ) {
        closestPosition = {
          x: p.x,
          y: p.y,
        };
      }
    }

    // Loop through all the otherPoints
    for (const p of otherLines) {
      if (
        pDistance(x, y, p.points[0].x, p.points[0].y, p.points[1].x, p.points[1].y)
          .distance +
          3 <
        canvasInstance.dist(closestPosition.x, closestPosition.y, x, y)
      ) {
        closestPosition = pDistance(
          x,
          y,
          p.points[0].x,
          p.points[0].y,
          p.points[1].x,
          p.points[1].y,
        ).point;
      }
    }

    // Return the snapped point by rounding the values
    if (
      canvasInstance.dist(x, y, closestPosition.x, closestPosition.y) <
      this.cellSize / 3
    ) {
      return closestPosition;
    } else {
      return {
        x: x,
        y: y,
      };
    }
  }

  toPixels(x: number) {
    return x / this.conversionToUnit;
  }

  toUnit(x: number) {
    return this.conversionToUnit * x;
  }
}
