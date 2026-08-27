import _ from 'lodash';

import { useEditorStore } from '@/store/EditorStore';
import { generateUUID } from '@/utils/math';

import { convert3D, drawExtrude, drawShape, OBJfile } from './3d';
import { ElementDescriptor } from './elements';
import { FloorPlanManager } from './floorPlanManager';

export const out = 5;
export const inn = 2.5;

export class Profile {
  type: string;
  outs: number[];
  inns: number[];
  aMasses: number[];
  wallWidths: number[];
  zProfilesA: any[];
  zProfilesC: any[];
  cMasses: number[];
  parts: any[];
  parent: FloorPlanManager;
  obj: OBJfile;
  col3D: string;
  c: string;
  id: string;
  constructor(
    id: string,
    FloorplanManager: FloorPlanManager,
    wallWidths: any[],
    outs: any[],
    inns: any[],
    aMasses: any[],
    zProfilesA: any[],
    zProfilesC: any[],
    cMasses: any[],
    col3D = 'rgb(128, 128, 128)',
  ) {
    this.type = 'Other';
    this.id = id || generateUUID();
    const { canvasInstance } = useEditorStore.getState();
    this.wallWidths = wallWidths.map((x: any) => canvasInstance.round(x, 5));
    this.outs = outs.map((x: any) => canvasInstance.round(x, 5));
    this.inns = inns.map((x: any) => canvasInstance.round(x, 5));
    this.aMasses = aMasses.map((x: any) => canvasInstance.round(x, 5));
    this.zProfilesA = zProfilesA;
    this.zProfilesC = zProfilesC;
    this.cMasses = cMasses.map((x: any) => canvasInstance.round(x, 5));

    this.parts = [];
    this.parent = FloorplanManager;
    this.obj = new OBJfile([], []);

    this.c = 'black';
    this.col3D = col3D;
  }

  updateColor() {
    for (const p of this.parts) {
      p.c = this.c;
    }
  }

  setParent(p: any) {
    this.parent = p;
  }

  isPartOfOuterWall() {
    for (const l of this.parts) {
      if (l.isOuter) {
        return true;
      }
    }

    return false;
  }

  setMasses() {
    for (let p = 0; p < this.parts.length; p++) {
      this.parts[p].aMass = this.aMasses[p];
      this.parts[p].z_profile_a = this.zProfilesA[p];
      this.parts[p].z_profile_c = this.zProfilesC[p];
      this.parts[p].wallW = this.wallWidths[p];
      this.parts[p].out = this.outs[p];
      this.parts[p].inn = this.inns[p];
      this.parts[p].cMass = this.cMasses[p];
    }
  }

  onlyDims() {
    if (this.parts.length !== 0) {
      this.aMasses = this.getAMasses();
      this.cMasses = this.getCMasses();
      this.inns = this.getInnerWidths();
      this.wallWidths = this.getWallWidths();
      this.outs = this.getOuterWidths();
      this.zProfilesA = this.getZProfilesA();
      this.zProfilesC = this.getZProfilesC();
    }

    return _.omit(this, 'neighbors', 'parent', 'saved', 'parts', 'obj');
  }

  getAMasses() {
    if (this.parts.length !== 0) {
      const ret = [];
      for (const p of this.parts) {
        ret.push(p.aMass);
      }
      return ret;
    } else {
      return this.aMasses;
    }
  }
  getZProfilesA() {
    if (this.parts.length !== 0) {
      const ret = [];
      for (const p of this.parts) {
        ret.push(p.z_profile_a);
      }
      return ret;
    } else {
      return this.zProfilesA;
    }
  }
  getZProfilesC() {
    if (this.parts.length !== 0) {
      const ret = [];
      for (const p of this.parts) {
        ret.push(p.z_profile_c);
      }
      return ret;
    } else {
      return this.zProfilesC;
    }
  }
  getWallWidths() {
    if (this.parts.length !== 0) {
      const ret = [];
      for (const p of this.parts) {
        if (p.between) {
          ret.push(p.wallW - p.out);
        } else if (p.nextTo) {
          ret.push(p.wallW);
        } else {
          ret.push(p.wallW);
        }
      }
      return ret;
    } else {
      return this.wallWidths;
    }
  }
  getOuterWidths() {
    if (this.parts.length != 0) {
      const ret = [];
      for (const p of this.parts) {
        if (p.between) {
          ret.push(0);
        } else if (p.nextTo) {
          ret.push(0);
        } else {
          ret.push(p.out);
        }
      }
      return ret;
    } else {
      return this.outs;
    }
  }
  getInnerWidths() {
    if (this.parts.length != 0) {
      const ret = [];
      for (const p of this.parts) {
        ret.push(p.inn);
      }
      return ret;
    } else {
      return this.inns;
    }
  }
  getCMasses() {
    if (this.parts.length != 0) {
      const ret = [];
      for (const p of this.parts) {
        ret.push(p.cMass);
      }
      return ret;
    } else {
      return this.cMasses;
    }
  }

  draw(forceDisab = false, descriptors = false) {
    this.updateColor();
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;

    for (let p = 0; p < this.parts.length; p++) {
      if (this.parts[p].aMass == undefined) {
        this.parts[p].aMass = this.aMasses[p];
      }
      if (this.parts[p].z_profile_a == undefined) {
        this.parts[p].z_profile_a = this.zProfilesA[p];
      }
      if (this.parts[p].z_profile_c == undefined) {
        this.parts[p].z_profile_c = this.zProfilesC[p];
      }
      if (this.parts[p].wallW == undefined) {
        this.parts[p].wallW = this.wallWidths[p];
      }
      if (this.parts[p].inn == undefined) {
        this.parts[p].inn = this.inns[p];
      }
      if (this.parts[p].out == undefined) {
        this.parts[p].out = this.outs[p];
      }
      if (this.parts[p].cMass == undefined) {
        this.parts[p].cMass = this.cMasses[p];
      }
    }

    let highlight = false;
    for (const p of this.parts) p.mouseOver(false) ? (highlight = true) : undefined;

    for (const p of this.parts) {
      p.draw(true, highlight && forceDisab);

      let desc;
      if (descriptors) {
        if (this.type == 'Straight' || this.type == 'End') {
          desc = new ElementDescriptor(
            p.x,
            p.y,
            p.angle,
            String.fromCharCode(((this.parts.indexOf(p) + 10) % 13) + 110) +
              '=' +
              canvasInstance.round(this.parent.mainGeometry.grid.toUnit(p.length), 2) +
              this.parent.mainGeometry.grid.unit,
            { x: 0, y: -10 },
          ); // Name descriptor
        } else {
          desc = new ElementDescriptor(
            p.x,
            p.y,
            p.angle,
            String.fromCharCode(((this.parts.indexOf(p) + 10) % 13) + 110),
            { x: 0, y: -10 },
          ); // Name descriptor
        }

        desc.c = p.c;

        desc.draw();
      }
    }

    if (this.type == 'Straight') {
      canvasInstance.stroke('gray');

      const l = this.parts[0];
      const p1 = l.points[0];
      const p2 = l.points[1];
      const a = l.angle + PI / 2;

      const splitterLength = 7;

      canvasInstance.line(
        p1.x - (canvasInstance.cos(a) * splitterLength) / 2,
        p1.y - (canvasInstance.sin(a) * splitterLength) / 2,
        p1.x + (canvasInstance.cos(a) * splitterLength) / 2,
        p1.y + (canvasInstance.sin(a) * splitterLength) / 2,
      );

      canvasInstance.line(
        p2.x - (canvasInstance.cos(a) * splitterLength) / 2,
        p2.y - (canvasInstance.sin(a) * splitterLength) / 2,
        p2.x + (canvasInstance.cos(a) * splitterLength) / 2,
        p2.y + (canvasInstance.sin(a) * splitterLength) / 2,
      );
    }

    this.drawInner();
    return highlight;
  }

  getAveragePosition() {
    let allP: any[] = [];
    for (const p of this.parts) allP = allP.concat(p.points);

    let totalX = 0;
    let totalY = 0;
    for (const p of allP) {
      totalX += p.x;
      totalY += p.y;
    }

    return {
      x: totalX / allP.length,
      y: totalY / allP.length,
    };
  }

  getAverageSize() {
    let totalX = 0;
    let totalY = 0;
    for (const p of this.parts) {
      totalX += Math.abs(p.dx);
      totalY += Math.abs(p.dy);
    }

    return {
      x: totalX / this.parts.length,
      y: totalY / this.parts.length,
    };
  }

  drawInner() {}

  calculateWidthIntersectOffset(
    x: number,
    y: number,
    ang1: number,
    ang2: number,
    sw = true,
  ) {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    let alpha = (PI - ang2 + ang1 + 2 * PI) % PI;
    const idk = (PI - ang2 + ang1 + 2 * PI) % (2 * PI);
    const c = alpha == idk;

    if (x == 0) {
      return {
        x: Math.cos(ang1) * y,
        y: Math.sin(ang1) * y,
      };
    }

    if (y == 0) {
      return {
        x: Math.cos(ang2) * x,
        y: Math.sin(ang2) * x,
      };
    }

    if (x == y && x == 0) {
      return {
        x: 0,
        y: 0,
      };
    }

    let j, theta, yn, gamma, fa, l;
    if (
      canvasInstance.round(idk, 5) != 0 &&
      canvasInstance.round(idk, 5) != canvasInstance.round(2 * PI, 5)
    ) {
      if (c && !sw) {
        alpha = PI - alpha;
      }

      if (c) {
        [x, y] = [y, x];
      }

      j = Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(PI - alpha));
      theta = PI / 2 - Math.acos((x * x + j * j - y * y) / (2 * x * j));

      //var xn = j * Math.sin(theta) / Math.sin(alpha);
      yn = (j * Math.sin(PI - theta - alpha)) / Math.sin(alpha);

      gamma = Math.atan(x / yn);
      fa = alpha - gamma + ang2;
      if (c && !sw) {
        fa = alpha - gamma + ang1;
      }
      l = Math.sqrt(x ** 2 + yn ** 2);

      l *= idk > PI ? -1 : 1;
    } else {
      l = (x + y) / 2;
      fa = ang1 + PI / 2;
    }

    return {
      x: Math.cos(fa) * l,
      y: Math.sin(fa) * l,
    };
  }

  findCenterpoint(includeEdges = false) {
    const { canvasInstance } = useEditorStore.getState();
    let centerPoint;
    let allP: any[] = [];
    const edges = [];

    for (const part of this.parts) {
      allP = allP.concat(part.points);
    }

    for (const p of allP) {
      let isC = true;
      for (const part of this.parts) {
        if (
          !(
            (canvasInstance.round(part.points[0].x, 5) == canvasInstance.round(p.x, 5) &&
              canvasInstance.round(part.points[0].y, 5) ==
                canvasInstance.round(p.y, 5)) ||
            (canvasInstance.round(part.points[1].x, 5) == canvasInstance.round(p.x, 5) &&
              canvasInstance.round(part.points[1].y, 5) == canvasInstance.round(p.y, 5))
          )
        ) {
          edges.push(p);
          isC = false;
          break;
        }
      }

      if (isC) {
        centerPoint = p;
      }
    }

    if (includeEdges) return [centerPoint].concat(edges);

    return centerPoint;
  }

  draw3D() {
    this.obj = new OBJfile([], []);

    for (const part of this.parts) {
      drawExtrude(part.points[0], part.points[1], 20);
    }
  }
}

export class Straight_Profile extends Profile {
  between: boolean;
  nextTo: boolean;
  length: number;
  constructor(
    id: string,
    FloorplanManager: FloorPlanManager | null,
    wallWidths: never[],
    outs: never[],
    inns: never[],
    aMasses: never[],
    zProfilesA: never[],
    zProfilesC: never[],
    cMasses: never[],
    col3D: string | undefined,
    length: number,
  ) {
    super(
      id,
      FloorplanManager as any,
      wallWidths,
      outs,
      inns,
      aMasses,
      zProfilesA,
      zProfilesC,
      cMasses,
      col3D,
      // length,
    );

    const { canvasInstance } = useEditorStore.getState();
    this.type = 'Straight';
    this.length = canvasInstance.round(length, 5);

    this.c = 'red';

    this.between = false;
    this.nextTo = false;
  }

  drawInner() {
    const { canvasInstance } = useEditorStore.getState();
    const l = this.parts[0];
    canvasInstance.stroke('gray');

    // DETERMINE THE WIDTHS
    let inner_width, outer_width;
    if (l.isOuter) {
      if (l.between) {
        inner_width = l.wallW + l.inn - l.out;
        outer_width = 0;
      } else if (l.nextTo) {
        inner_width = l.wallW + l.inn;
        outer_width = 0;
      } else {
        inner_width = l.wallW + l.inn;
        outer_width = l.out;
      }
    } else {
      if (l.between) {
        inner_width = l.wallW / 2 + l.inn - l.out;
        outer_width = inner_width;
      } else if (l.nextTo) {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      } else {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      }
    }

    const PI = canvasInstance.PI;
    // INNER SIDE
    canvasInstance.line(
      l.points[0].x - Math.sin(PI - l.angle) * inner_width,
      l.points[0].y - Math.cos(PI - l.angle) * inner_width,
      l.points[1].x - Math.sin(PI - l.angle) * inner_width,
      l.points[1].y - Math.cos(PI - l.angle) * inner_width,
    );

    // OUTER SIDE
    canvasInstance.line(
      l.points[0].x + Math.sin(PI - l.angle) * outer_width,
      l.points[0].y + Math.cos(PI - l.angle) * outer_width,
      l.points[1].x + Math.sin(PI - l.angle) * outer_width,
      l.points[1].y + Math.cos(PI - l.angle) * outer_width,
    );
  }

  draw3D() {
    const { canvasInstance } = useEditorStore.getState();
    this.obj = new OBJfile([], []);

    const l = this.parts[0];
    canvasInstance.stroke(this.col3D);

    // DETERMINE THE WIDTHS
    let inner_width, outer_width;
    if (l.isOuter) {
      if (l.between) {
        inner_width = l.wallW + l.inn - l.out;
        outer_width = 0;
      } else if (l.nextTo) {
        inner_width = l.wallW + l.inn;
        outer_width = 0;
      } else {
        inner_width = l.wallW + l.inn;
        outer_width = l.out;
      }
    } else {
      if (l.between) {
        inner_width = l.wallW / 2 + l.inn - l.out;
        outer_width = inner_width;
      } else if (l.nextTo) {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      } else {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      }
    }

    const PI = canvasInstance.PI;
    // INNER SIDE
    this.obj.combine(
      convert3D(
        [
          {
            x: l.points[0].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[0].y - Math.cos(PI - l.angle) * inner_width,
          },
          {
            x: l.points[1].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[1].y - Math.cos(PI - l.angle) * inner_width,
          },
        ],
        l.cMass * (l.z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );

    // OUTER SIDE
    this.obj.combine(
      convert3D(
        [
          {
            x: l.points[0].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[0].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[1].y + Math.cos(PI - l.angle) * outer_width,
          },
        ],
        l.isOuter
          ? l.aMass * (l.z_profile_a ? -1 : 1)
          : l.cMass * (l.z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );

    // BACK SIDE
    this.obj.combine(
      drawShape(
        [
          {
            x: l.points[0].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[0].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[1].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[1].y - Math.cos(PI - l.angle) * inner_width,
          },
          {
            x: l.points[0].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[0].y - Math.cos(PI - l.angle) * inner_width,
          },
        ],
        this.col3D,
        'white',
      ),
    );
  }
}

export class Angled_Profile extends Profile {
  leftLength: number;
  realLeftLength: any;
  rightLength: number;
  realRightLength: any;
  angle: number;
  orientation: boolean;
  constructor(
    id: string,
    FloorplanManager: FloorPlanManager,
    wallWidths: any,
    outs: any,
    inns: any,
    aMasses: any,
    zProfilesA: any,
    zProfilesC: any,
    cMasses: any,
    col3D: string | undefined,
    lengths: any[],
    angle: number,
  ) {
    super(
      id,
      FloorplanManager,
      wallWidths,
      outs,
      inns,
      aMasses,
      zProfilesA,
      zProfilesC,
      cMasses,
      col3D,
    );

    this.type = 'Angled';
    const { canvasInstance } = useEditorStore.getState();
    this.leftLength = canvasInstance.round(lengths[0], 5);
    this.realLeftLength;
    this.rightLength = canvasInstance.round(lengths[1], 5);
    this.realRightLength;
    this.angle = canvasInstance.round(angle, 7);

    this.c = 'blue';
    this.orientation = true;
  }

  // CORNER INNER WORKING
  drawInner() {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    // DETERMINE THE WIDTHS
    const inner_widths = [];
    const outer_widths = [];
    let sw = false;
    for (const l of this.parts) {
      let inner_width, outer_width;
      if (l.isOuter) {
        sw = true;
        if (l.between) {
          inner_width = l.wallW + l.inn - l.out;
          outer_width = 0;
        } else if (l.nextTo) {
          inner_width = l.wallW + l.inn;
          outer_width = 0;
        } else {
          inner_width = l.wallW + l.inn;
          outer_width = l.out;
        }
      } else {
        if (l.between) {
          inner_width = l.wallW / 2 + l.inn - l.out;
          outer_width = inner_width;
        } else if (l.nextTo) {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        } else {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        }
      }

      inner_widths.push(inner_width);
      outer_widths.push(outer_width);
    }

    // SOME VALUES HAVE TO BE SWITCHED BETWEEN INEER AND OUTER CORNERS
    const swVal = sw ? PI : 0;
    const swVal2 = sw ? -1 : 1;

    const points = this.findCenterpoint(true);
    const center = points[0];
    const edges = points.slice(1, points.length);

    const off_outer = this.calculateWidthIntersectOffset(
      outer_widths[0],
      outer_widths[1],
      -this.parts[0].angle,
      swVal - this.parts[1].angle,
      false,
    );
    const off_inner = this.calculateWidthIntersectOffset(
      inner_widths[0],
      inner_widths[1],
      -this.parts[0].angle,
      swVal - this.parts[1].angle,
      false,
    );

    this.realLeftLength = canvasInstance.round(
      this.parent.mainGeometry.grid.toUnit(
        canvasInstance.max(
          canvasInstance.dist(
            edges[0].x + Math.sin(PI - this.parts[0].angle) * outer_widths[0],
            edges[0].y + Math.cos(PI - this.parts[0].angle) * outer_widths[0],
            center.x + off_outer.x,
            center.y - off_outer.y,
          ),
          canvasInstance.dist(
            edges[0].x - Math.sin(PI - this.parts[0].angle) * inner_widths[0],
            edges[0].y - Math.cos(PI - this.parts[0].angle) * inner_widths[0],
            center.x - off_inner.x,
            center.y + off_inner.y,
          ),
        ),
      ),
      6,
    );

    this.realRightLength = canvasInstance.round(
      this.parent.mainGeometry.grid.toUnit(
        canvasInstance.max(
          canvasInstance.dist(
            edges[1].x - Math.sin(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
            edges[1].y - Math.cos(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
            center.x + off_outer.x,
            center.y - off_outer.y,
          ),
          canvasInstance.dist(
            edges[1].x + Math.sin(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
            edges[1].y + Math.cos(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
            center.x - off_inner.x,
            center.y + off_inner.y,
          ),
        ),
      ),
      6,
    );

    // OUTER SIDES
    canvasInstance.line(
      edges[0].x + Math.sin(PI - this.parts[0].angle) * outer_widths[0],
      edges[0].y + Math.cos(PI - this.parts[0].angle) * outer_widths[0],
      center.x + off_outer.x,
      center.y - off_outer.y,
    );

    canvasInstance.line(
      edges[1].x - Math.sin(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
      edges[1].y - Math.cos(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
      center.x + off_outer.x,
      center.y - off_outer.y,
    );

    // INNER SIDES
    canvasInstance.line(
      edges[0].x - Math.sin(PI - this.parts[0].angle) * inner_widths[0],
      edges[0].y - Math.cos(PI - this.parts[0].angle) * inner_widths[0],
      center.x - off_inner.x,
      center.y + off_inner.y,
    );

    canvasInstance.line(
      edges[1].x + Math.sin(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
      edges[1].y + Math.cos(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
      center.x - off_inner.x,
      center.y + off_inner.y,
    );
  }

  draw3D() {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    if (!this.realLeftLength || !this.realRightLength) {
      this.drawInner();
    }

    this.obj = new OBJfile([], []);

    canvasInstance.stroke(this.col3D);

    // DETERMINE THE WIDTHS
    const inner_widths = [];
    const outer_widths = [];
    let sw = false;
    for (const l of this.parts) {
      let inner_width, outer_width;
      if (l.isOuter) {
        sw = true;
        if (l.between) {
          inner_width = l.wallW + l.inn - l.out;
          outer_width = 0;
        } else if (l.nextTo) {
          inner_width = l.wallW + l.inn;
          outer_width = 0;
        } else {
          inner_width = l.wallW + l.inn;
          outer_width = l.out;
        }
      } else {
        if (l.between) {
          inner_width = l.wallW / 2 + l.inn - l.out;
          outer_width = inner_width;
        } else if (l.nextTo) {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        } else {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        }
      }

      inner_widths.push(inner_width);
      outer_widths.push(outer_width);
    }

    // SOME VALUES HAVE TO BE SWITCHED BETWEEN INEER AND OUTER CORNERS
    const swVal = sw ? PI : 0;
    const swVal2 = sw ? -1 : 1;

    const points = this.findCenterpoint(true);
    const center = points[0];
    const edges = points.slice(1, points.length);

    const off_outer = this.calculateWidthIntersectOffset(
      outer_widths[0],
      outer_widths[1],
      -this.parts[0].angle,
      swVal - this.parts[1].angle,
      false,
    );
    const off_inner = this.calculateWidthIntersectOffset(
      inner_widths[0],
      inner_widths[1],
      -this.parts[0].angle,
      swVal - this.parts[1].angle,
      false,
    );

    // OUTER SIDES
    this.obj.combine(
      convert3D(
        [
          {
            x: edges[0].x + Math.sin(PI - this.parts[0].angle) * outer_widths[0],
            y: edges[0].y + Math.cos(PI - this.parts[0].angle) * outer_widths[0],
          },
          {
            x: center.x + off_outer.x,
            y: center.y - off_outer.y,
          },
        ],
        this.parts[0].isOuter
          ? this.parts[0].aMass * (this.parts[0].z_profile_a ? -1 : 1)
          : this.parts[0].cMass * (this.parts[0].z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );
    this.obj.combine(
      convert3D(
        [
          {
            x: edges[1].x - Math.sin(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
            y: edges[1].y - Math.cos(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
          },
          {
            x: center.x + off_outer.x,
            y: center.y - off_outer.y,
          },
        ],
        this.parts[1].isOuter
          ? this.parts[1].aMass * (this.parts[1].z_profile_a ? -1 : 1)
          : this.parts[1].cMass * (this.parts[1].z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );

    // INNER SIDES
    this.obj.combine(
      convert3D(
        [
          {
            x: edges[0].x - Math.sin(PI - this.parts[0].angle) * inner_widths[0],
            y: edges[0].y - Math.cos(PI - this.parts[0].angle) * inner_widths[0],
          },
          {
            x: center.x - off_inner.x,
            y: center.y + off_inner.y,
          },
        ],
        this.parts[0].cMass * (this.parts[0].z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );
    this.obj.combine(
      convert3D(
        [
          {
            x: edges[1].x + Math.sin(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
            y: edges[1].y + Math.cos(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
          },
          {
            x: center.x - off_inner.x,
            y: center.y + off_inner.y,
          },
        ],
        this.parts[1].cMass * (this.parts[1].z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );

    // BACK SIDES
    this.obj.combine(
      drawShape(
        [
          {
            x: edges[0].x + Math.sin(PI - this.parts[0].angle) * outer_widths[0],
            y: edges[0].y + Math.cos(PI - this.parts[0].angle) * outer_widths[0],
          },
          {
            x: center.x + off_outer.x,
            y: center.y - off_outer.y,
          },
          {
            x: center.x - off_inner.x,
            y: center.y + off_inner.y,
          },
          {
            x: edges[0].x - Math.sin(PI - this.parts[0].angle) * inner_widths[0],
            y: edges[0].y - Math.cos(PI - this.parts[0].angle) * inner_widths[0],
          },
        ],
        this.col3D,
        'white',
      ),
    );
    this.obj.combine(
      drawShape(
        [
          {
            x: edges[1].x - Math.sin(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
            y: edges[1].y - Math.cos(PI - this.parts[1].angle) * outer_widths[1] * swVal2,
          },
          {
            x: center.x + off_outer.x,
            y: center.y - off_outer.y,
          },
          {
            x: center.x - off_inner.x,
            y: center.y + off_inner.y,
          },
          {
            x: edges[1].x + Math.sin(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
            y: edges[1].y + Math.cos(PI - this.parts[1].angle) * inner_widths[1] * swVal2,
          },
        ],
        this.col3D,
        'white',
      ),
    );
  }
}

export class T_Profile extends Profile {
  xLength: number;
  yLength: number;
  zLength: number;
  realXLength: any;
  realYLength: any;
  realZLength: any;
  xyAngle: number;
  yzAngle: number;
  zxAngle: number;
  constructor(
    id: string,
    FloorplanManager: FloorPlanManager,
    wallWidths: any,
    outs: any,
    inns: any,
    aMasses: any,
    zProfilesA: any,
    zProfilesC: any,
    cMasses: any,
    col3D: string | undefined,
    lengths: any[],
    angles: any[],
  ) {
    super(
      id,
      FloorplanManager,
      wallWidths,
      outs,
      inns,
      aMasses,
      zProfilesA,
      zProfilesC,
      cMasses,
      col3D,
    );
    this.type = 'T-shape';
    const { canvasInstance } = useEditorStore.getState();
    this.xLength = canvasInstance.round(lengths[0], 5);
    this.yLength = canvasInstance.round(lengths[1], 5);
    this.zLength = canvasInstance.round(lengths[2], 5);

    this.realXLength;
    this.realYLength;
    this.realZLength = 0.25;

    this.xyAngle = canvasInstance.round(angles[0], 6);
    this.yzAngle = canvasInstance.round(angles[1], 6);
    this.zxAngle = canvasInstance.round(angles[2], 6);

    this.c = 'green';
  }

  async drawInner() {
    const { canvasInstance } = useEditorStore.getState();
    let off;
    const PI = canvasInstance.PI;
    // DETERMINE THE WIDTHS
    const inner_widths = [];
    const outer_widths = [];

    for (const l of this.parts) {
      let inner_width, outer_width;
      if (l.isOuter) {
        if (l.between) {
          inner_width = l.wallW + l.inn - l.out;
          outer_width = 0;
        } else if (l.nextTo) {
          inner_width = l.wallW + l.inn;
          outer_width = 0;
        } else {
          inner_width = l.wallW + l.inn;
          outer_width = l.out;
        }
      } else {
        if (l.between) {
          inner_width = l.wallW / 2 + l.inn - l.out;
          outer_width = inner_width;
        } else if (l.nextTo) {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        } else {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        }
      }

      inner_widths.push(inner_width);
      outer_widths.push(outer_width);
    }

    if (this.parts[0].isOuter || this.parts[1].isOuter || this.parts[2].isOuter) {
      const points = await this.findCenterpoint(true);
      const center = await points[0];
      const edges = await points.slice(1, points.length);

      const x = await edges[0]?.x;
      const y = await edges[0]?.y;

      // LEFT
      off = this.calculateWidthIntersectOffset(
        inner_widths[1],
        inner_widths[0],
        -this.parts[1].angle,
        PI - this.parts[0].angle,
        false,
      );
      let l = await this.parts[0];

      // BUG
      canvasInstance.line(
        x - Math.sin(PI - l.angle) * inner_widths[0],
        y - Math.cos(PI - l.angle) * inner_widths[0],
        center.x - off.x,
        center.y + off.y,
      );

      this.realXLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          x - Math.sin(PI - l.angle) * inner_widths[0],
          y - Math.cos(PI - l.angle) * inner_widths[0],
          center.x - off.x,
          center.y + off.y,
        ),
      );

      l = await this.parts[1];
      const x1 = await edges[1]?.x;
      const y1 = await edges[1]?.y;
      canvasInstance.line(
        x1 - Math.sin(PI - l.angle) * inner_widths[1],
        y1 - Math.cos(PI - l.angle) * inner_widths[1],
        center.x - off.x,
        center.y + off.y,
      );

      this.realYLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          x1 - Math.sin(PI - l.angle) * inner_widths[1],
          y1 - Math.cos(PI - l.angle) * inner_widths[1],
          center.x - off.x,
          center.y + off.y,
        ),
      );

      // RIGHT
      off = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[2],
        this.parts[0].angle,
        this.parts[2].angle,
        false,
      );

      l = await this.parts[0];

      canvasInstance.line(
        x + Math.sin(PI - l.angle) * inner_widths[0],
        y + Math.cos(PI - l.angle) * inner_widths[0],
        center.x - off.x,
        center.y - off.y,
      );

      this.realXLength = canvasInstance.max(
        this.realXLength,
        canvasInstance.dist(
          x + Math.sin(PI - l.angle) * inner_widths[0],
          y + Math.cos(PI - l.angle) * inner_widths[0],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      l = await this.parts[2];

      canvasInstance.line(
        edges[2]?.x - Math.sin(PI - l.angle) * inner_widths[2],
        edges[2]?.y - Math.cos(PI - l.angle) * inner_widths[2],
        center.x - off.x,
        center.y - off.y,
      );

      this.realZLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          edges[2]?.x - Math.sin(PI - l.angle) * inner_widths[2],
          edges[2]?.y - Math.cos(PI - l.angle) * inner_widths[2],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      // TOP;
      off = this.calculateWidthIntersectOffset(
        outer_widths[1],
        outer_widths[2],
        this.parts[2].angle,
        PI - this.parts[1].angle,
        false,
      );

      l = this.parts[1];

      canvasInstance.line(
        edges[1]?.x + Math.sin(PI - l.angle) * outer_widths[1],
        edges[1]?.y + Math.cos(PI - l.angle) * outer_widths[1],
        center.x - off.x,
        center.y - off.y,
      );

      this.realYLength = canvasInstance.max(
        this.realYLength,
        canvasInstance.dist(
          edges[1]?.x + Math.sin(PI - l.angle) * outer_widths[1],
          edges[1]?.y + Math.cos(PI - l.angle) * outer_widths[1],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      l = await this.parts[2];

      canvasInstance.line(
        edges[2]?.x + Math.sin(PI - l.angle) * outer_widths[2],
        edges[2]?.y + Math.cos(PI - l.angle) * outer_widths[2],
        center.x - off.x,
        center.y - off.y,
      );

      this.realZLength = canvasInstance.max(
        this.realZLength,
        canvasInstance.dist(
          edges[2]?.x + Math.sin(PI - l.angle) * outer_widths[2],
          edges[2]?.y + Math.cos(PI - l.angle) * outer_widths[2],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      this.realXLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realXLength),
        6,
      );

      this.realYLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realYLength),
        6,
      );
      this.realZLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realZLength),
        6,
      );
    } else {
      const points = await this.findCenterpoint(true);
      const center = await points[0];
      const edges = await points.slice(1, points.length);
      // const a = this.xyAngle > this.zxAngle ? -1 : 1;
      // Side 1
      off = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[2],
        this.parts[0].angle,
        this.parts[2].angle,
        false,
      );

      let l = await this.parts[0];

      canvasInstance.line(
        edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
        edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
        center.x - off.x,
        center.y - off.y,
      );

      this.realXLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
          edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
          center.x - off.x,
          center.y + off.y,
        ),
      );

      l = await this.parts[2];

      canvasInstance.line(
        edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
        edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
        center.x - off.x,
        center.y - off.y,
      );

      this.realZLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
          edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      // Side 2
      off = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[1],
        this.parts[0].angle,
        this.parts[1].angle,
        false,
      );

      l = await this.parts[0];

      canvasInstance.line(
        edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
        edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
        center.x + off.x,
        center.y + off.y,
      );

      this.realXLength = canvasInstance.max(
        this.realXLength,
        canvasInstance.dist(
          edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
          edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      l = this.parts[1];

      canvasInstance.line(
        edges[1].x + Math.sin(PI - l.angle) * inner_widths[1],
        edges[1].y + Math.cos(PI - l.angle) * inner_widths[1],
        center.x + off.x,
        center.y + off.y,
      );

      this.realYLength = canvasInstance.max(
        l.length,
        canvasInstance.dist(
          edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
          edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
          center.x - off.x,
          center.y + off.y,
        ),
      );

      // Side 3
      off = this.calculateWidthIntersectOffset(
        inner_widths[1],
        inner_widths[2],
        this.parts[1].angle,
        this.parts[2].angle,
        false,
      );

      l = this.parts[1];

      canvasInstance.line(
        edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
        edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
        center.x + off.x,
        center.y + off.y,
      );

      this.realYLength = canvasInstance.max(
        this.realYLength,
        canvasInstance.dist(
          edges[1].x + Math.sin(PI - l.angle) * outer_widths[1],
          edges[1].y + Math.cos(PI - l.angle) * outer_widths[1],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      l = this.parts[2];

      canvasInstance.line(
        edges[2].x + Math.sin(PI - l.angle) * inner_widths[2],
        edges[2].y + Math.cos(PI - l.angle) * inner_widths[2],
        center.x + off.x,
        center.y + off.y,
      );

      this.realZLength = canvasInstance.max(
        this.realZLength,
        canvasInstance.dist(
          edges[2].x + Math.sin(PI - l.angle) * outer_widths[2],
          edges[2].y + Math.cos(PI - l.angle) * outer_widths[2],
          center.x - off.x,
          center.y - off.y,
        ),
      );

      this.realXLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realXLength),
        6,
      );
      this.realYLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realYLength),
        6,
      );
      this.realZLength = canvasInstance.round(
        this.parent.mainGeometry.grid.toUnit(this.realZLength),
        6,
      );
      // console.log({
      //   realXLength: this.realXLength,
      //   realYLength: this.realYLength,
      //   realZLength: this.realZLength,
      // });
    }
  }

  draw3D() {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    if (!this.realXLength || !this.realYLength || !this.realZLength) {
      this.drawInner();
    }

    this.obj = new OBJfile([], []);

    // DETERMINE THE WIDTHS
    const inner_widths = [];
    const outer_widths = [];
    for (const l of this.parts) {
      let inner_width, outer_width;
      if (l.isOuter) {
        if (l.between) {
          inner_width = l.wallW + l.inn - l.out;
          outer_width = 0;
        } else if (l.nextTo) {
          inner_width = l.wallW + l.inn;
          outer_width = 0;
        } else {
          inner_width = l.wallW + l.inn;
          outer_width = l.out;
        }
      } else {
        if (l.between) {
          inner_width = l.wallW / 2 + l.inn - l.out;
          outer_width = inner_width;
        } else if (l.nextTo) {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        } else {
          inner_width = l.wallW / 2 + l.inn;
          outer_width = inner_width;
        }
      }

      inner_widths.push(inner_width);
      outer_widths.push(outer_width);
    }

    if (this.parts[0].isOuter || this.parts[1].isOuter || this.parts[2].isOuter) {
      const points = this.findCenterpoint(true);
      const center = points[0];
      const edges = points.slice(1, points.length);

      // LEFT
      const off1 = this.calculateWidthIntersectOffset(
        inner_widths[1],
        inner_widths[0],
        -this.parts[1].angle,
        PI - this.parts[0].angle,
        false,
      );

      let l = this.parts[0];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x - off1.x,
              y: center.y + off1.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      l = this.parts[1];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
            },
            {
              x: center.x - off1.x,
              y: center.y + off1.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      // RIGHT
      const off2 = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[2],
        this.parts[0].angle,
        this.parts[2].angle,
        false,
      );

      l = this.parts[0];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x - off2.x,
              y: center.y - off2.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      l = this.parts[2];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
            },
            {
              x: center.x - off2.x,
              y: center.y - off2.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      //TOP
      const off3 = this.calculateWidthIntersectOffset(
        outer_widths[1],
        outer_widths[2],
        this.parts[2].angle,
        PI - this.parts[1].angle,
        false,
      );

      l = this.parts[1];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[1].x + Math.sin(PI - l.angle) * outer_widths[1],
              y: edges[1].y + Math.cos(PI - l.angle) * outer_widths[1],
            },
            {
              x: center.x - off3.x,
              y: center.y - off3.y,
            },
          ],
          l.aMass * (l.z_profile_a ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      l = this.parts[2];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[2].x + Math.sin(PI - l.angle) * outer_widths[2],
              y: edges[2].y + Math.cos(PI - l.angle) * outer_widths[2],
            },
            {
              x: center.x - off3.x,
              y: center.y - off3.y,
            },
          ],
          l.aMass * (l.z_profile_a ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      //BACK
      l = this.parts[2];

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[2].x + Math.sin(PI - l.angle) * outer_widths[2],
              y: edges[2].y + Math.cos(PI - l.angle) * outer_widths[2],
            },
            {
              x: center.x - off3.x,
              y: center.y - off3.y,
            },
            {
              x: center.x - off2.x,
              y: center.y - off2.y,
            },
            {
              x: edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      l = this.parts[1];

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[1].x + Math.sin(PI - l.angle) * outer_widths[1],
              y: edges[1].y + Math.cos(PI - l.angle) * outer_widths[1],
            },
            {
              x: center.x - off3.x,
              y: center.y - off3.y,
            },
            {
              x: center.x - off1.x,
              y: center.y + off1.y,
            },
            {
              x: edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      l = this.parts[0];

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x - off2.x,
              y: center.y - off2.y,
            },
            {
              x: center.x - off1.x,
              y: center.y + off1.y,
            },
            {
              x: edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      this.obj.combine(
        drawShape(
          [
            {
              x: center.x - off3.x,
              y: center.y - off3.y,
            },
            {
              x: center.x - off2.x,
              y: center.y - off2.y,
            },
            {
              x: center.x - off1.x,
              y: center.y + off1.y,
            },
          ],
          this.col3D,
          'white',
        ),
      );
    } else {
      const points = this.findCenterpoint(true);
      const center = points[0];
      const edges = points.slice(1, points.length);
      // const a = this.xyAngle > this.zxAngle ? -1 : 1;

      // Side 1
      const off1 = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[2],
        this.parts[0].angle,
        this.parts[2].angle,
        false,
      );

      let l = this.parts[0];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x - off1.x,
              y: center.y - off1.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      l = this.parts[2];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
            },
            {
              x: center.x - off1.x,
              y: center.y - off1.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      // Side 2
      const off2 = this.calculateWidthIntersectOffset(
        inner_widths[0],
        inner_widths[1],
        this.parts[0].angle,
        this.parts[1].angle,
        false,
      );

      l = this.parts[0];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x + off2.x,
              y: center.y + off2.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[0].x - Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y - Math.cos(PI - l.angle) * inner_widths[0],
            },
            {
              x: center.x + off2.x,
              y: center.y + off2.y,
            },
            {
              x: center.x - off1.x,
              y: center.y - off1.y,
            },
            {
              x: edges[0].x + Math.sin(PI - l.angle) * inner_widths[0],
              y: edges[0].y + Math.cos(PI - l.angle) * inner_widths[0],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      l = this.parts[1];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[1].x + Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y + Math.cos(PI - l.angle) * inner_widths[1],
            },
            {
              x: center.x + off2.x,
              y: center.y + off2.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      //Side 3
      const off3 = this.calculateWidthIntersectOffset(
        inner_widths[1],
        inner_widths[2],
        this.parts[1].angle,
        this.parts[2].angle,
        false,
      );

      l = this.parts[1];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
            },
            {
              x: center.x + off3.x,
              y: center.y + off3.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[1].x - Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y - Math.cos(PI - l.angle) * inner_widths[1],
            },
            {
              x: center.x + off3.x,
              y: center.y + off3.y,
            },
            {
              x: center.x + off2.x,
              y: center.y + off2.y,
            },
            {
              x: edges[1].x + Math.sin(PI - l.angle) * inner_widths[1],
              y: edges[1].y + Math.cos(PI - l.angle) * inner_widths[1],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      l = this.parts[2];

      this.obj.combine(
        convert3D(
          [
            {
              x: edges[2].x + Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y + Math.cos(PI - l.angle) * inner_widths[2],
            },
            {
              x: center.x + off3.x,
              y: center.y + off3.y,
            },
          ],
          l.cMass * (l.z_profile_c ? -1 : 1),
          this.col3D,
          'white',
        ),
      );

      this.obj.combine(
        drawShape(
          [
            {
              x: edges[2].x + Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y + Math.cos(PI - l.angle) * inner_widths[2],
            },
            {
              x: center.x + off3.x,
              y: center.y + off3.y,
            },
            {
              x: center.x - off1.x,
              y: center.y - off1.y,
            },
            {
              x: edges[2].x - Math.sin(PI - l.angle) * inner_widths[2],
              y: edges[2].y - Math.cos(PI - l.angle) * inner_widths[2],
            },
          ],
          this.col3D,
          'white',
        ),
      );

      this.obj.combine(
        drawShape(
          [
            {
              x: center.x + off3.x,
              y: center.y + off3.y,
            },
            {
              x: center.x - off1.x,
              y: center.y - off1.y,
            },
            {
              x: center.x + off2.x,
              y: center.y + off2.y,
            },
          ],
          this.col3D,
          'white',
        ),
      );
    }
  }
}

export class End_Profile extends Profile {
  length: number;
  up: boolean;
  upLength: number;
  isFirst: boolean | undefined;
  constructor(
    id: string,
    FloorplanManager: FloorPlanManager,
    wallWidths: any,
    outs: any,
    inns: any,
    aMasses: any,
    zProfilesA: any,
    zProfilesC: any,
    cMasses: any,
    col3D: string | undefined,
    length: number,
    boolUp = false,
  ) {
    super(
      id,
      FloorplanManager,
      wallWidths,
      outs,
      inns,
      aMasses,
      zProfilesA,
      zProfilesC,
      cMasses,
      col3D,
    );

    this.type = 'End';
    const { canvasInstance } = useEditorStore.getState();
    this.length = canvasInstance.round(length, 5);
    this.up = boolUp;
    this.upLength = this.parent.defaultUpLength;

    this.c = 'orange';
  }

  setParent(p: any) {
    this.parent = p;
  }

  drawInner() {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    const l = this.parts[0];
    canvasInstance.stroke('gray');

    // DETERMINE THE WIDTHS
    let inner_width, outer_width;
    if (l.isOuter) {
      if (l.between) {
        inner_width = l.wallW + l.inn - l.out;
        outer_width = 0;
      } else if (l.nextTo) {
        inner_width = l.wallW + l.inn;
        outer_width = 0;
      } else {
        inner_width = l.wallW + l.inn;
        outer_width = l.out;
      }
    } else {
      if (l.between) {
        inner_width = l.wallW / 2 + l.inn - l.out;
        outer_width = inner_width;
      } else if (l.nextTo) {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      } else {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      }
    }

    // INNER SIDE
    canvasInstance.line(
      l.points[0].x - Math.sin(PI - l.angle) * inner_width,
      l.points[0].y - Math.cos(PI - l.angle) * inner_width,
      l.points[1].x - Math.sin(PI - l.angle) * inner_width,
      l.points[1].y - Math.cos(PI - l.angle) * inner_width,
    );

    // OUTER SIDE
    canvasInstance.line(
      l.points[0].x + Math.sin(PI - l.angle) * outer_width,
      l.points[0].y + Math.cos(PI - l.angle) * outer_width,
      l.points[1].x + Math.sin(PI - l.angle) * outer_width,
      l.points[1].y + Math.cos(PI - l.angle) * outer_width,
    );

    // END CAP
    if (this.isFirst || !l.isOuter) {
      canvasInstance.line(
        l.points[0].x + Math.sin(PI - l.angle) * outer_width,
        l.points[0].y + Math.cos(PI - l.angle) * outer_width,
        l.points[0].x - Math.sin(PI - l.angle) * inner_width,
        l.points[0].y - Math.cos(PI - l.angle) * inner_width,
      );
    } else {
      canvasInstance.line(
        l.points[1].x + Math.sin(PI - l.angle) * outer_width,
        l.points[1].y + Math.cos(PI - l.angle) * outer_width,
        l.points[1].x - Math.sin(PI - l.angle) * inner_width,
        l.points[1].y - Math.cos(PI - l.angle) * inner_width,
      );
    }
  }

  draw3D() {
    const { canvasInstance } = useEditorStore.getState();
    this.obj = new OBJfile([], []);
    const PI = canvasInstance.PI;
    const l = this.parts[0];
    canvasInstance.stroke(this.col3D);

    // DETERMINE THE WIDTHS
    let inner_width, outer_width;
    if (l.isOuter) {
      if (l.between) {
        inner_width = l.wallW + l.inn - l.out;
        outer_width = 0;
      } else if (l.nextTo) {
        inner_width = l.wallW + l.inn;
        outer_width = 0;
      } else {
        inner_width = l.wallW + l.inn;
        outer_width = l.out;
      }
    } else {
      if (l.between) {
        inner_width = l.wallW / 2 + l.inn - l.out;
        outer_width = inner_width;
      } else if (l.nextTo) {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      } else {
        inner_width = l.wallW / 2 + l.inn;
        outer_width = inner_width;
      }
    }

    // INNER SIDE
    this.obj.combine(
      convert3D(
        [
          {
            x: l.points[0].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[0].y - Math.cos(PI - l.angle) * inner_width,
          },
          {
            x: l.points[1].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[1].y - Math.cos(PI - l.angle) * inner_width,
          },
        ],
        l.cMass * (l.z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );
    // OUTER SIDE
    this.obj.combine(
      convert3D(
        [
          {
            x: l.points[0].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[0].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[1].y + Math.cos(PI - l.angle) * outer_width,
          },
        ],
        l.isOuter
          ? l.aMass * (l.z_profile_a ? -1 : 1)
          : l.cMass * (l.z_profile_c ? -1 : 1),
        this.col3D,
        'white',
      ),
    );
    // BACK SIDE
    this.obj.combine(
      drawShape(
        [
          {
            x: l.points[0].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[0].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x + Math.sin(PI - l.angle) * outer_width,
            y: l.points[1].y + Math.cos(PI - l.angle) * outer_width,
          },
          {
            x: l.points[1].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[1].y - Math.cos(PI - l.angle) * inner_width,
          },
          {
            x: l.points[0].x - Math.sin(PI - l.angle) * inner_width,
            y: l.points[0].y - Math.cos(PI - l.angle) * inner_width,
          },
        ],
        this.col3D,
        'white',
      ),
    );

    // END CAP
    if (this.isFirst || !l.isOuter) {
      this.obj.combine(
        convert3D(
          [
            {
              x: l.points[0].x + Math.sin(PI - l.angle) * outer_width,
              y: l.points[0].y + Math.cos(PI - l.angle) * outer_width,
            },
            {
              x: l.points[0].x - Math.sin(PI - l.angle) * inner_width,
              y: l.points[0].y - Math.cos(PI - l.angle) * inner_width,
            },
          ],
          this.parent.mainGeometry.grid.toPixels(this.upLength) * (this.up ? -1 : 1),
          this.col3D,
          'white',
        ),
      );
    } else {
      this.obj.combine(
        convert3D(
          [
            {
              x: l.points[1].x + Math.sin(PI - l.angle) * outer_width,
              y: l.points[1].y + Math.cos(PI - l.angle) * outer_width,
            },
            {
              x: l.points[1].x - Math.sin(PI - l.angle) * inner_width,
              y: l.points[1].y - Math.cos(PI - l.angle) * inner_width,
            },
          ],
          this.parent.mainGeometry.grid.toPixels(this.upLength) * (this.up ? -1 : 1),
          this.col3D,
          'white',
        ),
      );
    }
  }
}
