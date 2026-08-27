/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as _ from 'lodash';

import { useEditorStore } from '@/store/EditorStore';
import { generateUUID } from '@/utils/math';

import { drawAxis, OBJfile } from './3d';
import { generateImageBlob } from './app';
import { controls, defaultProfileData, globalAppType, maxFPS } from './constants';
import { Controls } from './Control';
import { ElementDescriptor, Line, Point } from './elements';
import { isInFrame, mousePos } from './others';
import { PointManager } from './PointManager';
import {
  Angled_Profile,
  End_Profile,
  Profile,
  Straight_Profile,
  T_Profile,
} from './profiles';

export class FloorPlanManager {
  mainGeometry: PointManager;
  tool: number;
  autoProfileGeometry: null | PointManager;
  pdf: any[];
  thickness: number;
  defaultUpLength: number;
  defaultCol: string;
  profile_type: number;
  steepness: number;
  halter: number;
  stackIndex: number;
  stack: any[];
  maxStackSize: number;
  sendData: boolean;
  receiveData: boolean;
  dragging: boolean;
  changingProfile: null | any;
  hoverProfile: Angled_Profile | End_Profile | Straight_Profile | T_Profile | null;
  changing: boolean;
  outerHeight: number;
  innerHeight: number;
  wallWidth: number;
  innerWidth: number;
  outerWidth: number;
  autoProfiles:
    | Angled_Profile[]
    | End_Profile[]
    | Straight_Profile[]
    | T_Profile[]
    | undefined;
  autoProfilesCompact: any[];
  additionalVertex1: null | Point;
  additionalVertex2: null | Point;
  applyForceLength: boolean;
  forceLength: number;
  autoProfileGeometryLineTypes: string[] | undefined;
  autoProfilesList: Profile[] | undefined;
  autoProfilesListCompact: any[] | undefined;
  lastSent: number | undefined;

  constructor(
    outerHeight = 0.2,
    width = 0.25,
    innerHeight = 0.1,
    outerWidth = 0.05,
    innerWidth = 0.025,
  ) {
    this.mainGeometry = new PointManager();

    this.mainGeometry.parent = this;
    this.mainGeometry.updateCall = function () {
      if (!this.lastSent) this.lastSent = 0;
      if (performance.now() - this.lastSent > 1000 / maxFPS) {
        if (!this.dragging) {
          this.parent?.addToStack();
        }

        if (this.parent?.sendData) {
          // this.updateState({ drawingData: this.parent.export() });
          // drawingData = this.parent.export();
          // c.updateProject(projectDetails.id, this.parent.export(), !this.dragging);
          this.lastSent = performance.now();
        }
      } else return;
    };

    const { projectDetails } = useEditorStore.getState();
    const { project_attributes }: any = projectDetails;

    this.outerHeight = project_attributes?.aMass / 1000 || outerHeight;
    this.innerHeight = project_attributes?.cMass / 1000 || innerHeight;
    this.wallWidth = width;
    this.innerWidth = project_attributes?.inner_W / 1000 || innerWidth;
    this.outerWidth = project_attributes?.outer_W / 1000 || outerWidth;

    //this.innerGeometry = null;
    this.autoProfileGeometry = null;
    this.autoProfiles = [];
    this.autoProfilesCompact = [];
    this.autoProfiles = [];
    this.autoProfilesCompact = [];
    this.autoProfileGeometryLineTypes = [];

    this.mainGeometry.snapToGrid();
    this.mainGeometry.convertToUnit = true;
    this.mainGeometry.remove180DegCorners = false;

    this.additionalVertex1 = null;
    this.additionalVertex2 = null;

    this.tool = 0;
    this.applyForceLength = true;
    this.forceLength = 3;

    this.hoverProfile = null;
    this.changing = false;
    this.changingProfile = null;

    this.dragging = false;

    this.receiveData = false;
    this.sendData = false;

    this.mainGeometry.doUpdateCall = true;

    this.stack = [];
    this.maxStackSize = 10;
    this.stackIndex = 0;

    this.defaultUpLength = project_attributes?.upLength / 1000 || 0.25;
    this.defaultCol = project_attributes?.def_col || 'rgb(128,128,128)';
    this.profile_type = project_attributes?.profile_type || 0;
    this.steepness = project_attributes?.slope || 3;
    this.thickness = project_attributes?.material_thickness || 2;
    this.halter = project_attributes?.halter || 1000;

    this.pdf = [];

    const canvasInstance = useEditorStore.getState().canvasInstance;
    if (canvasInstance) {
      canvasInstance.mousePressed = this.mousePressed.bind(this);
      canvasInstance.mouseReleased = this.mouseReleased.bind(this);
      canvasInstance.keyPressed = this.keyPressed.bind(this);
      canvasInstance.mouseDragged = this.mouseDragged.bind(this);
    }
  }

  async save() {
    const exportedData = await this.export();
    return exportedData;
  }
  /**
   * Draw function for drawing shapes and lines based on the tool selected.
   */
  async draw() {
    const { canvasInstance, zoomVal } = useEditorStore.getState();
    if (this.autoProfileGeometry !== null) this.autoProfileGeometry.allowHover = false;
    if (this.tool == 0) {
      this.mainGeometry.draw();
    } else if (this.tool == 1) {
      this.mainGeometry.draw();

      //Save the mouse position into a variable
      let mP = { x: mousePos().x, y: mousePos().y };
      //Try snaping to grid
      if (this.mainGeometry.snapToG) {
        const _allL = this.mainGeometry.lines.concat(this.mainGeometry.additionalLines);
        if (this.mainGeometry.closed) _allL.push(this.mainGeometry.closingLine);

        mP = this.mainGeometry.grid.getClosestSnap(
          mP.x,
          mP.y,
          this.mainGeometry.points,
          _allL,
        );
      }

      // // Set up color etc
      canvasInstance.strokeWeight(2 * zoomVal);
      canvasInstance.stroke('purple');
      canvasInstance.fill('purple');

      // Draw the mouse cursor
      canvasInstance.ellipse(mP.x, mP.y, 7, 7);

      // If there are at least some points
      if (this.additionalVertex1 != null) {
        canvasInstance.line(
          this.additionalVertex1.x,
          this.additionalVertex1.y,
          mP.x,
          mP.y,
        );
      }
    } else if (this.tool == 2) {
      //noLoop();
      if (this.autoProfileGeometry == null || this.autoProfiles?.length == 0) {
        await this.createProfileGeometry();
        this.autoProfileGeometry!.allowHover = true;
        this.autoProfileGeometry!.changeLineLengthConservative = true;
      }

      this.hoverProfile = null;
      this.mainGeometry.grid.draw();

      for (const l of this.mainGeometry.lines
        .concat(this.mainGeometry.closingLine)
        .concat(this.mainGeometry.additionalLines)) {
        if (l != null) {
          for (const d of l.descriptors) {
            d.draw();
          }
        }
      }
      if (this.autoProfiles) {
        for (const p of this.autoProfiles) {
          if (p?.draw()) {
            this.hoverProfile = p;
          }
        }
      }
    } else if (this.tool == 3) {
      if (this.autoProfileGeometry == null || this.autoProfiles?.length == 0) {
        this.createProfileGeometry();
        this.autoProfileGeometry!.allowHover = true;
        this.autoProfileGeometry!.changeLineLengthConservative = true;
      }
      this.hoverProfile = null;

      canvasInstance.rotateX(canvasInstance.PI / 2);
      canvasInstance.translate(0, -canvasInstance.height / 2, -canvasInstance.height / 2);
      for (const p of this.autoProfiles!) {
        p.draw3D();
      }

      drawAxis(1000);
      canvasInstance.orbitControl(1, 1);
      canvasInstance.rotateX(-canvasInstance.PI / 2);
    } else if (this.tool == -1) {
      if (this.autoProfileGeometry == null || this.autoProfiles?.length == 0) {
        this.createProfileGeometry();
        this.autoProfileGeometry!.allowHover = true;
        this.autoProfileGeometry!.changeLineLengthConservative = true;
      }

      // Profile list

      const pdf_data = (await this.getProfiles(true)) as any;
      for (let i = 0; i < pdf_data.length; i++) {
        let end_c = 0;
        let str_c = 0;
        let ang_c = 0;
        let Tpr_c = 0;
        let oth_c = 0;

        for (let r = 0; r < pdf_data[i].length; r++) {
          const pr = pdf_data[i][r].profile;

          let type_id;
          let type_c;

          switch (pr?.type) {
            case 'End':
              end_c++;
              type_id = 3;
              type_c = end_c;
              // if (pr.up) {
              //   type_profileType = 'ak';
              // } else {
              //   type_profileType = 'ek';
              // }
              // type_angle = 0;
              // type_length = pr.length * 1000 + ` (Höhe: ${pr.upLength * 1000})`;
              break;
            case 'Straight':
              str_c++;
              type_id = 1;
              type_c = str_c;
              // type_profileType = 'l';
              // type_angle = 0;
              // type_length = pr.length * 1000;
              break;
            case 'Angled':
              ang_c++;
              type_id = 2;
              type_c = ang_c;
              // if (pr.angle > canvasInstance.PI) {
              //   type_profileType = 'ie';
              // } else {
              //   type_profileType = 'ae';
              // }
              // type_angle =
              //   canvasInstance.round(((pr.angle * 180) / canvasInstance.PI) * 1e2) / 1e2 +
              //   '°';
              // type_length = pr.leftLength * 1000 + '/' + pr.rightLength * 1000;
              break;
            case 'T-shape':
              Tpr_c++;
              type_id = 4;
              type_c = Tpr_c;
              // type_profileType = 'gete';
              // type_angle = `${canvasInstance.round(((pr.xyAngle * 180) / canvasInstance.PI) * 1e2) / 1e2}°/${canvasInstance.round(((pr.yzAngle * 180) / canvasInstance.PI) * 1e2) / 1e2}°`;
              // type_length =
              //   pr.xLength * 1000 + '/' + pr.yLength * 1000 + '/' + pr.zLength * 1000;
              break;
            default:
              oth_c++;
              type_id = 5;
              type_c = oth_c;
              // type_profileType = '';
              // type_angle = 0;
              // type_length = pr.lengths
              //   .map((x: number) => canvasInstance.round(x * 1000 * 1e2) / 1e2)
              //   .reduce((a: string, b: string) => a + '/' + b);
              break;
          }

          let lastID = null;
          let lastProf = null;
          let sameConnectedProfiles = [];
          let touchWithLast = false;
          let d, k;

          for (const prof of pdf_data[i][r].all_profiles) {
            let isFirst = true;
            if (lastProf !== null) {
              touchWithLast = this.areProfilesTouching(prof, lastProf) as any;
            } else touchWithLast = true;
            for (const l of prof.parts) {
              d = l.descriptors[0];
              const origD = d.offset;
              const origTS = d.textSize;
              const origText = d.text;

              const bounds = this.getBounds() as any;
              const c = 15 / 800;
              k = Math.pow(Math.max(bounds.w, bounds.h), 0.975) * c;

              const textSize = Math.max(k, 7.5);
              d.offset = {
                x: 0,
                y: -(l.isOuter ? l.out : l.inn + l.wallW / 2) - textSize * 1.2 - 1,
              };
              d.textSize = textSize;

              let leng;
              if (prof.type == 'Straight' || prof.type == 'End' || prof.type == 'Other') {
                leng = parseFloat(d.text);

                // DRAW THE ID OF THE PROFILE
                if (
                  k < 30 ||
                  lastID != `${i + 1}.${type_id}.${type_c}` ||
                  !touchWithLast
                ) {
                  if (sameConnectedProfiles.length > 0) {
                    const mid =
                      sameConnectedProfiles[Math.floor(sameConnectedProfiles.length / 2)];
                    const d1 = mid.descriptors[0];

                    d1.offset = origD;
                    d1.textSize = origTS;

                    d1.text = origText;

                    d1.draw();

                    sameConnectedProfiles = [];
                  } else {
                    d.text =
                      /*round(leng * 1000, 3) +*/ isFirst == (prof.type !== 'T-shape')
                        ? `\n${i + 1}.${type_id}.${type_c}`
                        : '';

                    d.draw();
                  }
                } else {
                  sameConnectedProfiles.push(l);
                }
                lastID = `${i + 1}.${type_id}.${type_c}`;
              } else if (prof.type == 'Angled') {
                if (isFirst) leng = prof.realLeftLength;
                else leng = prof.realRightLength;

                if (isFirst) {
                  const a = prof.parts[0].angle;
                  const id_d = new ElementDescriptor(
                    l.points[1].x,
                    l.points[1].y,
                    0,
                    `\n${i + 1}.${type_id}.${type_c}`,
                    {
                      x: -Math.cos(a) * 1.5 * d.offset.y,
                      y: -Math.sin(a) * 1.5 * d.offset.y,
                    },
                  );
                  id_d.textSize = textSize;
                  id_d.draw();
                }
              } else if (prof.type === 'T-shape') {
                const ind = prof.parts.indexOf(l);
                switch (ind) {
                  case 0:
                    leng = prof.realXLength;
                    break;
                  case 1:
                    leng = prof.realYLength;
                    break;
                  case 2:
                    leng = prof.realZLength;
                    break;
                }

                if (isFirst) {
                  const a = (prof.parts[1].angle + prof.parts[2].angle) / 2;
                  const id_d = new ElementDescriptor(
                    l.points[0].x,
                    l.points[0].y,
                    a,
                    `\n${i + 1}.${type_id}.${type_c}`,
                    {
                      x: 0,
                      y: d.offset.y,
                    },
                  );
                  id_d.textSize = textSize;
                  id_d.draw();
                }
              }
              // DRAW THE LENGTH OF THE PROFILE
              d.offset = {
                x: 0,
                y: textSize + 1,
              };
              if (k < 30) {
                d.text = canvasInstance.round(
                  leng * 1000,
                  0,
                ); /*+ (isFirst ? `\n${i+1}.${type_id}.${type_c}` : "")*/

                d.draw();
              }

              d.offset = origD;
              d.textSize = origTS;
              d.text = origText;

              isFirst = false;
            }
            lastProf = prof;
            prof.draw();
          }
          if (sameConnectedProfiles.length > 0) {
            var mid =
              sameConnectedProfiles[
                canvasInstance.floor(sameConnectedProfiles.length / 2)
              ];
            var d1 = mid.descriptors[0];

            d1.offset = d.offset;
            d1.textSize = d.textSize;

            d1.text = lastID;
            d1.draw();

            //console.log("drawn", lastID, d1, d)
            sameConnectedProfiles = [];
          }
        }
      }

      // for (const l of this.mainGeometry.lines
      //   .concat(this.mainGeometry.closingLine)
      //   .concat(this.mainGeometry.additionalLines)) {
      //   if (l != null) {
      //     for (const d of l.descriptors) {
      //       d.draw();
      //     }
      //   }
      // }
      // if (this.autoProfiles) {
      //   for (const p of this.autoProfiles) {
      //     if (p?.draw()) {
      //       this.hoverProfile = p;
      //     }
      //   }
      // }
    }
  }
  getBounds(image_padding = 30) {
    // Find bounds
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;

    for (var p of this.autoProfileGeometry!.points.concat(
      this.autoProfileGeometry?.additionalPoints,
    )) {
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
    }

    var w = maxX - minX + 2 * image_padding;
    var h = maxY - minY + 2 * image_padding;

    return {
      x: {
        min: minX,
        max: maxX,
      },
      y: {
        min: minY,
        max: maxY,
      },
      w: w,
      h: h,
    };
  }
  async getProfiles(includeOrigProfile = false) {
    const { floorPlan } = useEditorStore.getState();
    await this.compressProfileList();

    var profileGroups = [];

    var getProfileData = async (p1: any) => {
      // INIT VALS
      await p1.getInnerWidths();
      await p1.getWallWidths();
      await p1.getOuterWidths();

      var ind = 0;
      var maxBMass1 = Math.max(
        ...p1.inns.map(
          (_x: any, i: string | number) => p1.inns[i] + p1.outs[i] + p1.wallWidths[i],
        ),
      );
      for (var i = 0; i < p1.inns.length; i++) {
        if (maxBMass1 == p1.inns[i] + p1.outs[i] + p1.wallWidths[i]) {
          ind = i;
          break;
        }
      }

      var p1d = {
        col: await p1.col3D,
        a: await p1.getAMasses()[ind],
        i: await p1.getInnerWidths()[ind],
        w: await p1.getWallWidths()[ind],
        o: await p1.getOuterWidths()[ind],
        b: maxBMass1,
        c: await p1.getCMasses()[ind],
        za: await p1.getZProfilesA()[ind],
        zc: await p1.getZProfilesC()[ind],
      };

      return p1d;
    };

    for await (var pr of this.autoProfilesCompact) {
      if (profileGroups.length == 0) {
        profileGroups.push([
          {
            id: pr.id,
            p: _.omit(pr.profile, 'parent', 'parts', 'neighbors'),
            am: pr.amount,
            profile: pr.profile,
            all_profiles: pr.all_profiles,
          },
        ]);
      } else {
        var added = false;
        for await (var profG of profileGroups) {
          var p1d = await getProfileData(profG[0].profile);
          var p2d = await getProfileData(pr.profile);
          const isEqual = _.isEqual(p1d, p2d);
          if (isEqual) {
            profG.push({
              id: pr.id,
              p: _.omit(await pr.profile, 'parent', 'parts', 'neighbors'),
              am: pr.amount,
              profile: pr.profile,
              all_profiles: pr.all_profiles,
            });
            added = true;
            break;
          }
        }
        if (!added) {
          profileGroups.push([
            {
              id: pr.id,
              p: _.omit(pr.profile, 'parent', 'parts', 'neighbors'),
              am: pr.amount,
              profile: pr.profile,
              all_profiles: pr.all_profiles,
            },
          ]);
        }
      }
    }

    for (var par of profileGroups) {
      for (var p of par) {
        if (p.p.type == 'Other') {
          p.p.lengths = p.profile.parts.map((x: string | any[]) =>
            floorPlan?.mainGeometry.grid.toUnit(x.length),
          );
        }
      }
    }

    if (includeOrigProfile) return profileGroups;
    const updatedProfileGroups = profileGroups.map((x) =>
      x.map((y) => _.omit(y, 'profile', 'all_profiles')),
    );
    return updatedProfileGroups;
  }

  downloadOBJ() {
    const obj = new OBJfile([], []);

    if (this.autoProfiles) {
      for (const p of this.autoProfiles) {
        if (p.obj.vertices.length == 0) p.draw3D();

        obj.combine(p.obj);
      }
    }

    obj.export(true);
  }

  reset() {
    for (const inp of document.getElementsByTagName('input')) {
      try {
        if (
          inp.value == '' &&
          inp.type == 'text' &&
          this.mainGeometry.changingData.input != inp &&
          this.autoProfileGeometry?.changingData.input != inp &&
          inp.style.left == '-100px'
        ) {
          inp.remove();
        }
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }

    this.mainGeometry.reset();
    //this.innerGeometry = null;
    this.autoProfileGeometry = null;
    this.autoProfiles = [];
    this.autoProfilesList = [];
    this.autoProfilesListCompact = [];
    this.additionalVertex1 = null;
    this.additionalVertex2 = null;
    this.tool = 0;

    this.stack = [defaultProfileData];
    this.stackIndex = 0;
  }

  keyPressed() {
    const { canvasInstance } = useEditorStore.getState();
    if (this.tool == 0) {
      this.mainGeometry.keyPressed();
    } else if (this.tool == 1) {
      if (canvasInstance.keyCode == 27) {
        this.additionalVertex1 = null;
        this.additionalVertex2 = null;
      }
    }
  }

  mousePressed(event: HTMLElementEventMap['mousedown']) {
    const canvas = document.getElementById('defaultCanvas0');

    if (event.target !== canvas) {
      return;
    }
    Controls.move(controls).mousePressed(event);

    if (this.tool == 0) this.mainGeometry.mousePressed(event);
    else if (this.tool == 1) {
      if (event.which == 1) {
        //Save the mouse position into a variable
        let mP = { x: mousePos().x, y: mousePos().y };
        //Try snaping to grid
        if (this.mainGeometry.snapToG) {
          const _allL = this.mainGeometry.lines.concat(this.mainGeometry.additionalLines);
          if (this.mainGeometry.closed) _allL.push(this.mainGeometry.closingLine);

          mP = this.mainGeometry.grid.getClosestSnap(
            mP.x,
            mP.y,
            this.mainGeometry.points,
            _allL,
          );
        }

        if (isInFrame(mP.x, mP.y)) {
          if (this.additionalVertex1 == null) {
            this.additionalVertex1 = new Point(this.mainGeometry, mP.x, mP.y);
          } else if (this.additionalVertex2 == null) {
            this.additionalVertex2 = new Point(this.mainGeometry, mP.x, mP.y);

            this.mainGeometry.addAdditionalLine(
              this.additionalVertex1,
              this.additionalVertex2,
            );
            this.mainGeometry.updateCall();

            this.additionalVertex1 = null;
            this.additionalVertex2 = null;
          }
        }
      } else {
        this.additionalVertex1 = null;
        this.additionalVertex2 = null;
      }
    } else if (this.tool == 2) {
      if (isInFrame(mousePos().x, mousePos().y)) {
        if (this.hoverProfile !== null) {
          this.changingProfile = this.hoverProfile as any;
          this.changing = true;
          useEditorStore.setState({ floorPlan: this, isSidebarOpen: true });
          return;
        }

        this.changingProfile = null;
        this.changing = false;
        useEditorStore.setState({ floorPlan: this, isSidebarOpen: false });
      }
    }
  }

  mouseReleased(e: MouseEvent) {
    Controls.move(controls).mouseReleased(e);
    this.dragging = false;
    if (this.tool == 0 || this.tool == 1) this.mainGeometry.mouseReleased();
    else if (this.tool == 2) this.autoProfileGeometry?.mouseReleased();
  }

  mouseDragged(e: MouseEvent) {
    this.dragging = true;
    Controls.move(controls).mouseDragged(e);
    if (this.tool == 0 || this.tool == 1) this.mainGeometry.mouseDragged();
  }

  async setTool(toolNum: number, leng?: string) {
    const oldTool = this.tool;

    this.tool = toolNum;

    this.mainGeometry.changingData.changing = false;
    this.mainGeometry.changingData.input.style.display = 'none';
    if (this.autoProfileGeometry !== null)
      this.autoProfileGeometry.changingData.changing = false;

    if (this.tool == 0 || this.tool == 1) this.autoProfiles = [];
    // if (this.tool == 0)
    if (this.tool == 1) {
      this.additionalVertex1 = null;
      this.mainGeometry.finished = true;
    }
    if (this.tool == 2 && oldTool !== 3 && oldTool !== 2) {
      // this.autoProfileGeometry = null;

      if (this.applyForceLength) {
        // const leng = prompt('Wie lange möchten Sie Ihre Stücke (2m/3m/4m/5m/auto)?');

        if (leng && leng == '2') {
          this.forceLength = 2;
        } else if (leng == '3') {
          this.forceLength = 3;
        } else if (leng == '4') {
          this.forceLength = 4;
        } else if (leng == '5') {
          this.forceLength = 5;
        } else {
          this.applyForceLength = false;
        }
      }
    }

    if (this.mainGeometry.doUpdateCall) {
      // drawingData = this.parent.export();
      // if (this.tool == 3) c.restrictProjectEdit(projectDetails.id);
      // else await c.liftProjectEditRestriction(projectDetails.id);
      // this.mainGeometry.updateCall();
    }

    return;
  }

  async setProfileChanges() {
    const {
      values,
      aMasses,
      wallWidths,
      inns,
      outs,
      cMasses,
      zProfilesA = [],
      zProfilesC = [],
      // profiles,
    } = useEditorStore.getState().profileData;

    const updatedValues = values?.map((value) =>
      Math.abs(parseFloat(value.toString()) / 1000),
    );
    const updatedAMasses = aMasses?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedWallWidths = wallWidths?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedInns = inns?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedOuts = outs?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedCMasses = cMasses?.map((value) =>
      Math.abs(
        parseFloat(this.autoProfileGeometry!.grid!.toPixels(value).toString() as string) /
          1000,
      ),
    );

    for (const _input of values) {
      zProfilesA.push(false);
      zProfilesC.push(false);
    }
    // for (const _input of document.getElementsByClassName('profileInputs_ZProfileC')) {
    //   zProfilesC.push(false);
    // }

    const parts = await this.changingProfile?.parts;
    for (let i = 0; i < parts?.length; i++) {
      this.changingProfile.parts[i].aMass = updatedAMasses[i];
      this.changingProfile.parts[i].wallW = updatedWallWidths[i];
      this.changingProfile.parts[i].inn = updatedInns[i];
      this.changingProfile.parts[i].out = updatedOuts[i];
      this.changingProfile.parts[i].cMass = updatedCMasses[i];
      this.changingProfile.parts[i].z_profile_a = zProfilesA[i];
      this.changingProfile.parts[i].z_profile_c = zProfilesC[i];
      // this.changingProfile.parts[i].selectedProfile = profiles[i];
      this.changeProfileLineLength(updatedValues[i], this.changingProfile.parts[i]);
    }

    if (this.changingProfile.type == 'End' && this.autoProfiles) {
      // const prof = this.autoProfiles[this.autoProfiles.indexOf(this.changingProfile)];
      // prof.up = document.getElementById('profileCheckbox').checked;
      // prof.upLength = +document.getElementById('profileUpLength').value / 1000;
    }

    const d = document.getElementById('ProfileChangeDiv');

    if (d) d.innerHTML = '';

    this.changingProfile = null;
    this.changing = false;
    await this.saveProfiles();
  }
  async setProfileChangesToSavePDF(props: {
    values: string[];
    aMasses: number[];
    wallWidths: number[];
    inns: number[];
    outs: number[];
    cMasses: number[];
    zProfilesA: boolean[];
    zProfilesC: boolean[];
    profiles: string[];
  }) {
    const {
      values,
      aMasses,
      wallWidths,
      inns,
      outs,
      cMasses,
      zProfilesA = [],
      zProfilesC = [],
      // profiles,
    } = props;

    const updatedValues = values?.map((value) =>
      Math.abs(parseFloat(value.toString()) / 1000),
    );
    const updatedAMasses = aMasses?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedWallWidths = wallWidths?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedInns = inns?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedOuts = outs?.map((value) =>
      Math.abs(parseFloat(this.autoProfileGeometry!.grid!.toPixels(value) as any) / 1000),
    );

    const updatedCMasses = cMasses?.map((value) =>
      Math.abs(
        parseFloat(this.autoProfileGeometry!.grid!.toPixels(value).toString() as string) /
          1000,
      ),
    );

    for (const _input of values) {
      zProfilesA.push(false);
      zProfilesC.push(false);
    }
    // for (const _input of document.getElementsByClassName('profileInputs_ZProfileC')) {
    //   zProfilesC.push(false);
    // }

    const parts = await this.changingProfile?.parts;
    for (let i = 0; i < parts?.length; i++) {
      this.changingProfile.parts[i].aMass = updatedAMasses[i];
      this.changingProfile.parts[i].wallW = updatedWallWidths[i];
      this.changingProfile.parts[i].inn = updatedInns[i];
      this.changingProfile.parts[i].out = updatedOuts[i];
      this.changingProfile.parts[i].cMass = updatedCMasses[i];
      this.changingProfile.parts[i].z_profile_a = zProfilesA[i];
      this.changingProfile.parts[i].z_profile_c = zProfilesC[i];
      // this.changingProfile.parts[i].selectedProfile = profiles[i];
      this.changeProfileLineLength(updatedValues[i], this.changingProfile.parts[i]);
    }

    if (this.changingProfile.type == 'End' && this.autoProfiles) {
      // const prof = this.autoProfiles[this.autoProfiles.indexOf(this.changingProfile)];
      // prof.up = document.getElementById('profileCheckbox').checked;
      // prof.upLength = +document.getElementById('profileUpLength').value / 1000;
    }

    const d = document.getElementById('ProfileChangeDiv');

    if (d) d.innerHTML = '';

    this.changingProfile = null;
    this.changing = false;
    await this.saveProfiles();
    useEditorStore.setState({ floorPlan: this });
  }

  removeProfile() {
    var lineID = -1;

    for (var l of this.autoProfileGeometry!.lines) {
      if (
        this.changingProfile.parts[0].points[0].x == l.points[0].x &&
        this.changingProfile.parts[0].points[0].y == l.points[0].y &&
        this.changingProfile.parts[0].points[1].x == l.points[1].x &&
        this.changingProfile.parts[0].points[1].y == l.points[1].y
      ) {
        lineID = this.autoProfileGeometry!.lines.indexOf(l);
        break;
      }
    }

    if (lineID !== -1) {
      this.autoProfileGeometryLineTypes?.splice(lineID, 1);
      //this.autoProfileGeometry.changeLength(this.changingProfile.parts[0].length + this.autoProfileGeometry.lines[lineID + 1].length, this.changingProfile.parts[0])
      this.autoProfileGeometry?.removePoint(this.changingProfile.parts[0].points[1]);
      this.autoProfiles?.splice(this.autoProfiles?.indexOf(this.changingProfile), 1);
    } else {
      for (const l of this.autoProfileGeometry!.additionalLines) {
        if (l != this.changingProfile.parts[0]) {
          var center;
          var side1;
          var side2: any;

          if (this.changingProfile.parts[0].points[1] == l.points[0]) {
            center = l.points[0];
            side1 = this.changingProfile.parts[0].points[0];
            side2 = l.points[1];
          } else if (this.changingProfile.parts[0].points[1] == l.points[1]) {
            center = l.points[1];
            side1 = this.changingProfile.parts[0].points[0];
            side2 = l.points[0];
          }

          if (center) {
            lineID = this.autoProfileGeometry!.lines.concat(
              this.autoProfileGeometry!.additionalLines,
            ).indexOf(this.changingProfile.parts[0]);
            //this.autoProfileGeometryLineTypes.splice(lineID, 1);

            this.autoProfileGeometry?.removePoint(center);
            this.autoProfileGeometry?.addAdditionalLine(side2, side1);

            this.autoProfiles?.splice(
              this.autoProfiles?.indexOf(this.changingProfile),
              1,
            );
            break;
          }
        }
      }
    }

    var d = document.getElementById('ProfileChangeDiv');
    if (d) d.innerHTML = '';

    this.changingProfile = null;
    this.changing = false;

    this.saveProfiles();
  }
  changeProfileLineLength(length: number, line: any) {
    const { canvasInstance } = useEditorStore.getState();
    var findConnections = (p: { x: number; y: number }, f: this, arr: any[], al: any) => {
      var ret = [];

      var allL = [];
      if (!arr) {
        allL = f.mainGeometry.lines.concat(f.mainGeometry.additionalLines);
        if (f.mainGeometry.closed) allL.push(f.mainGeometry.closingLine);
      } else {
        allL = arr;
      }

      for (var l of allL) {
        if (l !== al) {
          if (
            canvasInstance.round(l.points[0].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[0].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          } else if (
            canvasInstance.round(l.points[1].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[1].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          }
        }
      }

      return ret;
    };

    var newLength: number = this.autoProfileGeometry?.grid.toPixels(length) || 0;
    var chLine = line;
    var prof: any;

    for (var pr of this.autoProfiles!) {
      for (var part of pr.parts) {
        if (
          (part.points[0].x == chLine.points[0].x &&
            part.points[0].y == chLine.points[0].y &&
            part.points[1].x == chLine.points[1].x &&
            part.points[1].y == chLine.points[1].y) ||
          (part.points[1].x == chLine.points[0].x &&
            part.points[1].y == chLine.points[0].y &&
            part.points[0].x == chLine.points[1].x &&
            part.points[0].y == chLine.points[1].y)
        ) {
          prof = pr;
        }
      }
    }

    if (
      prof.type !==
      new Straight_Profile(generateUUID(), null, [], [], [], [], [], [], [], 'grey', 0)
        .type
    ) {
      if (prof.parts.length > 1) {
        var centerPoint = prof.findCenterpoint();

        this.autoProfileGeometry?.changeLengthConservative(
          newLength,
          chLine,
          centerPoint,
        );
      } else {
        // End piece
        var centerPoint;
        var minC = 1000;

        for (var p of prof.parts[0].points) {
          var c = findConnections(
            p,
            this,
            this.autoProfileGeometry?.lines.concat(
              this.autoProfileGeometry?.additionalLines,
            ) as any,
            prof.parts[0],
          );
          if (c.length < minC) {
            minC = c.length;
            centerPoint = p;
          }
        }

        this.autoProfileGeometry?.changeLengthConservative(
          newLength,
          chLine,
          centerPoint,
        );
      }

      this.autoProfileGeometry!.changingData.changing = false;
      return;
    } else {
      this.autoProfileGeometry?.changeLengthConservative(
        newLength,
        chLine,
        chLine.points[0],
      );
    }
  }

  async createProfileGeometry() {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    // Calculate the starting wall width in pixels
    const wallW = this.mainGeometry.grid.toPixels(this.wallWidth);

    // Calculate the corner margin (0.25m) in pixels
    const cornerMargin = this.mainGeometry.grid.toPixels(0.25);
    // This saves what types the lines are
    this.autoProfileGeometryLineTypes = [];

    // Create a new empty PointManager
    this.autoProfileGeometry = new PointManager([this.mainGeometry.points[0]]);
    // Set up the pointManager
    this.autoProfileGeometry.finished = true;
    this.autoProfileGeometry.allowHover = false;
    this.autoProfileGeometry.convertToUnit = true;

    // This function calculates the addition margin depending on the angle and the wall thickness
    const add = function (x: number, wall: number) {
      return Math.abs(wall * (1 / Math.sin(x) + 1 / Math.tan(x)));
    };

    // Function that adds a corner, a T piece or a other piece
    const addVert = function (
      id: number,
      f: any,
      ang: number,
      len: number,
      isRight: boolean,
    ) {
      const a = additionalConnections(id, f);

      if (a == 0) {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('Corner');
      } else if (a == 1) {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('T-shape');
      } else {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('Other');
      }
    };

    const addVertEND = function (
      id: number,
      f: any,
      ang: number,
      len: number,
      isRight: boolean,
    ) {
      const a = additionalConnections(id, f);

      if (a == 0) {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('End');
      } else if (a == 1) {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('Corner');
      } else if (a == 2) {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('T-shape');
      } else {
        f.autoProfileGeometry.addLine(ang, len, isRight);
        f.autoProfileGeometryLineTypes.push('Other');
      }
    };

    const findbestLength = function (l: number, f: any) {
      //Var find the best piece length
      let bestLength = 3;
      let largestDelta = 0;
      for (let tl = 3; tl <= 5; tl++) {
        const delta = (f.mainGeometry.grid.toUnit(l) % tl) / tl;
        if (delta > largestDelta) {
          largestDelta = delta;
          bestLength = tl;
        }
      }

      if (f.applyForceLength) return f.mainGeometry.grid.toPixels(f.forceLength);

      return f.mainGeometry.grid.toPixels(bestLength);
    };

    const findConnections = (
      p: { x: number; y: number },
      f: this,
      arr?: any[] | undefined,
    ) => {
      const ret = [];

      let allL = [];
      if (!arr) {
        allL = f.mainGeometry.lines.concat(f.mainGeometry.additionalLines);
        if (f.mainGeometry.closed) allL.push(f.mainGeometry.closingLine);
      } else {
        allL = arr;
      }

      for (const l of allL) {
        if (l != al) {
          if (
            canvasInstance.round(l.points[0].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[0].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          } else if (
            canvasInstance.round(l.points[1].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[1].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          }
        }
      }

      return ret;
    };

    // This function returns how many addition connections are made to this point
    const additionalConnections = (
      id: string | number,
      f: {
        mainGeometry: {
          points: { [x: string]: any };
          additionalLines: any;
          lines: any[];
          closed: any;
          closingLine: any;
        };
      },
    ) => {
      const p = f.mainGeometry.points[id];
      const arr = f.mainGeometry.additionalLines;

      const ret = [];

      let allL = [];
      if (!arr) {
        allL = f.mainGeometry.lines.concat(f.mainGeometry.additionalLines);
        if (f.mainGeometry.closed) allL.push(f.mainGeometry.closingLine);
      } else {
        allL = arr;
      }

      for (const l of allL) {
        if (l != al) {
          if (
            canvasInstance.round(l.points[0].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[0].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          } else if (
            canvasInstance.round(l.points[1].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[1].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          }
        }
      }

      return ret.length;
    };

    // The additional margin of the first point
    let add1 = cornerMargin;
    if (this.mainGeometry.closed) {
      // An angled piece
      add1 = add(this.mainGeometry.closingAngle, wallW);

      addVert(0, this, this.mainGeometry.lines[0].angle, cornerMargin + add1, true);
    } else {
      // An end piece
      addVertEND(0, this, this.mainGeometry.lines[0].angle, cornerMargin + add1, true);
    }

    let traveled = cornerMargin + add1;

    let add2;
    // Loop through all of the lines
    for (const l of this.mainGeometry.lines) {
      // Check if we are not on the last line
      if (this.mainGeometry.relativeAngles[l.id + 1] == undefined) {
        if (this.mainGeometry.closed) {
          // We are so the next margin is calculated from the closingLine
          add2 = add(
            PI -
              this.mainGeometry.closingLine.angle +
              this.mainGeometry.lines[this.mainGeometry.lines.length - 1].angle,
            wallW,
          );
        } else {
          // End piece
          add2 = cornerMargin;
        }
      } else {
        // Otherwise calculate the next margin normally
        add2 = add(this.mainGeometry.relativeAngles[l.id + 1], wallW);
      }

      // Convert back to pixels
      const bestLength = await findbestLength(
        l.length - 2 * cornerMargin - add1 - add2,
        this,
      );

      //Go and split the line into the pieces until we hit the next point
      while (l.length - cornerMargin - add2 > bestLength + traveled) {
        // Add a line that is totally straight
        this.autoProfileGeometry.addLine(PI, bestLength, true);
        // Say that it is straight
        this.autoProfileGeometryLineTypes.push('Straight');

        // Add to the total distance traveled
        traveled += bestLength;
      }

      // On the last piece of the line cut the line shorter
      this.autoProfileGeometry.addLine(
        PI,
        l.length - cornerMargin - add2 - traveled,
        true,
      );
      this.autoProfileGeometryLineTypes.push('Straight');

      if (
        this.mainGeometry.relativeAngles[l.id + 1] != undefined ||
        this.mainGeometry.closed
      ) {
        // Add a corner piece
        addVert(l.id + 1, this, PI, cornerMargin + add2, true);
      }

      // The margins now shuffle
      add1 = add2;

      // try getting the next relative angle
      let nextAngle = this.mainGeometry.relativeAngles[l.id + 1];
      // if it is undefined:
      if (nextAngle == undefined) {
        if (this.mainGeometry.closed) {
          //Is closed so we calculate the relative angle from the closing line
          nextAngle =
            PI -
            this.mainGeometry.closingLine.angle +
            this.mainGeometry.lines[this.mainGeometry.lines.length - 1].angle;

          // Find if the angle isRight
          let isRight = true;
          if (nextAngle > PI) {
            nextAngle = 2 * PI - nextAngle;
            isRight = false;
          }

          // Add a corner piece
          addVert(l.id + 1, this, nextAngle, cornerMargin + add2, isRight);
        } else {
          // End piece
          addVertEND(l.id + 1, this, PI, cornerMargin + add1, true);
        }
      } else {
        // Next angle is defined

        // Find if the angle isRight
        let isRight = true;
        if (nextAngle > PI) {
          nextAngle = 2 * PI - nextAngle;
          isRight = false;
        }

        // Add a corner piece
        addVert(l.id + 1, this, nextAngle, cornerMargin + add2, isRight);
      }

      traveled = cornerMargin + add1;
    }

    if (this.mainGeometry.closed) {
      add2 = add(this.mainGeometry.closingAngle, wallW);

      bestLength = await findbestLength(
        this.mainGeometry.closingLine.length - 2 * cornerMargin - add1 - add2,
        this,
      );

      while (
        this.mainGeometry.closingLine.length - cornerMargin - add2 >
        bestLength + traveled
      ) {
        this.autoProfileGeometry.addLine(PI, bestLength, true);
        this.autoProfileGeometryLineTypes.push('Straight');

        traveled += bestLength;
      }

      this.autoProfileGeometry.addLine(
        PI,
        this.mainGeometry.closingLine.length - cornerMargin - add2 - traveled,
        true,
      );
      this.autoProfileGeometryLineTypes.push('Straight');

      // Add a corner piece
      addVert(0, this, PI, cornerMargin + add2, true);
    }

    //Addition lines
    for (var al of this.mainGeometry.additionalLines) {
      var l1;
      var l2;

      add1 = 0;
      add2 = 0;

      const p1Connections = findConnections(al.points[0], this);
      const p2Connections = findConnections(al.points[1], this);

      //1st point

      //Calculate the additional offset
      if (p1Connections.length == 0) add1 = cornerMargin + wallW;
      else if (p1Connections.length == 1)
        add1 = cornerMargin + add(PI - al.angle + p1Connections[0].angle, wallW);
      else if (p1Connections.length == 2) add1 = cornerMargin + wallW;
      else add1 = cornerMargin + wallW;

      // Make the 1st connection to the main geometry
      var p1 = new Point(this.autoProfileGeometry, al.points[0].x, al.points[0].y);
      var p2 = new Point(
        this.autoProfileGeometry,
        al.points[0].x + canvasInstance.cos(al.angle) * add1,
        al.points[0].y + canvasInstance.sin(al.angle) * add1,
      );
      l1 = p2;

      this.autoProfileGeometry.addAdditionalLine(p1, p2);

      // Set the color
      if (p1Connections.length == 0) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'orange';
      } else if (p1Connections.length == 1) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'blue';
      } else if (p1Connections.length == 2) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'green';
      } else {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'black';
      }

      //2nd point

      //Calculate the additional offset
      if (p2Connections.length == 0) add2 = cornerMargin + wallW;
      else if (p2Connections.length == 1)
        add2 = cornerMargin + add(PI - al.angle + p2Connections[0].angle, wallW);
      else if (p2Connections.length == 2) add2 = cornerMargin + wallW;
      else add2 = cornerMargin + wallW;

      // Make the 1st connection to the main geometry
      var p1 = new Point(this.autoProfileGeometry, al.points[1].x, al.points[1].y);
      var p2 = new Point(
        this.autoProfileGeometry,
        al.points[1].x - canvasInstance.cos(al.angle) * add2,
        al.points[1].y - canvasInstance.sin(al.angle) * add2,
      );
      l2 = p2;

      this.autoProfileGeometry.addAdditionalLine(p1, p2);

      // Set the color
      if (p2Connections.length == 0) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'orange';
      } else if (p2Connections.length == 1) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'blue';
      } else if (p2Connections.length == 2) {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'green';
      } else {
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'black';
      }

      const len = canvasInstance.dist(l1.x, l1.y, l2.x, l2.y);
      var bestLength = await findbestLength(len, this);

      let trav = 0;
      while (trav + bestLength < len) {
        var p1 = new Point(this.autoProfileGeometry, l1.x, l1.y);
        var p2 = new Point(
          this.autoProfileGeometry,
          l1.x + canvasInstance.cos(al.angle) * bestLength,
          l1.y + canvasInstance.sin(al.angle) * bestLength,
        );

        this.autoProfileGeometry.addAdditionalLine(p1, p2);
        this.autoProfileGeometry.additionalLines[
          this.autoProfileGeometry.additionalLines.length - 1
        ].c = 'red';

        trav += bestLength;
      }

      var p1 = new Point(
        this.autoProfileGeometry,
        l1.x + canvasInstance.cos(al.angle) * trav,
        l1.y + canvasInstance.sin(al.angle) * trav,
      );
      this.autoProfileGeometry.addAdditionalLine(p1, l2);
      this.autoProfileGeometry.additionalLines[
        this.autoProfileGeometry.additionalLines.length - 1
      ].c = 'red';
    }

    await this.saveProfiles();
    this.mainGeometry.update();
    this.autoProfileGeometry.update();
  }

  saveProfiles = async (includeInStack = true) => {
    const { canvasInstance } = useEditorStore.getState();
    const PI = canvasInstance.PI;
    if (this.autoProfiles) {
      for (const p of this.autoProfiles) {
        p.updateColor();
      }
    }

    for (var al of this.autoProfileGeometry!.additionalLines.concat(
      this.autoProfileGeometry!.lines,
    )) {
      al.saved = false;
    }
    const findConnections = (p: Point, f: this, arr: any[], _val?: any) => {
      const ret = [];

      let allL = [];
      if (!arr) {
        allL = f.mainGeometry.lines.concat(f.mainGeometry.additionalLines);
        if (f.mainGeometry.closed) allL.push(f.mainGeometry.closingLine);
      } else {
        allL = arr;
      }

      for (const l of allL) {
        if (l != al) {
          if (
            canvasInstance.round(l.points[0].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[0].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          } else if (
            canvasInstance.round(l.points[1].x, 5) == canvasInstance.round(p.x, 5) &&
            canvasInstance.round(l.points[1].y, 5) == canvasInstance.round(p.y, 5)
          ) {
            ret.push(l);
          }
        }
      }

      return ret;
    };

    //Reset all arrays
    const wallWidthPx = this.autoProfileGeometry?.grid.toPixels(this.wallWidth);
    const innerHeightPx = this.autoProfileGeometry?.grid.toPixels(this.innerHeight);
    const outerHeightPx = this.autoProfileGeometry?.grid.toPixels(this.outerHeight);
    const innerWidthPx = this.autoProfileGeometry?.grid.toPixels(this.innerWidth);
    const outerWidthPx = this.autoProfileGeometry?.grid.toPixels(this.outerWidth);

    const oldAutoProfiles: any = this.autoProfiles;
    if (oldAutoProfiles.length == 0) {
      for (
        let i = 0;
        i <
        this.autoProfileGeometry?.lines.length +
          this.autoProfileGeometry?.additionalLines.length;
        i++
      ) {
        await oldAutoProfiles.push(
          new Profile(
            generateUUID(),
            null as any,
            Array(10).fill(wallWidthPx),
            Array(10).fill(outerWidthPx),
            Array(10).fill(innerWidthPx),
            Array(10).fill(outerHeightPx),
            Array(10).fill(false),
            Array(10).fill(false),
            Array(10).fill(innerHeightPx),
            this.defaultCol,
          ),
        );

        for (let j = 0; j < 10; j++) {
          const l = new Line(
            new PointManager([]),
            this.autoProfileGeometry?.lines[1].points[0],
            this.autoProfileGeometry?.lines[1].points[0],
            -2,
          );
          l.aMass = oldAutoProfiles[i].aMasses[j];
          l.wallW = oldAutoProfiles[i].wallWidths[j];
          l.inn = oldAutoProfiles[i].inns[j];
          l.out = oldAutoProfiles[i].outs[j];
          l.cMass = oldAutoProfiles[i].cMasses[j];
          l.z_profile_a = false;
          l.z_profile_c = false;

          await oldAutoProfiles[oldAutoProfiles.length - 1].parts.push(l);
        }

        // End piece specific values to default values
        oldAutoProfiles[oldAutoProfiles.length - 1].up = false;
        oldAutoProfiles[oldAutoProfiles.length - 1].upLength = this.defaultUpLength;

        // Corner specific values
        oldAutoProfiles[oldAutoProfiles.length - 1].orientation = true;
      }
    }
    this.autoProfiles = [];
    this.autoProfilesListCompact = [];

    const op = oldAutoProfiles[0];
    //Save the profiles

    if (
      this.autoProfileGeometryLineTypes &&
      this.autoProfileGeometryLineTypes[0] == 'End'
    ) {
      var parts = [this.autoProfileGeometry!.lines[0]];
      for (var part of parts) part.saved = true;

      const [
        wallWidths,
        outerWidths,
        innerWidths,
        aMasses,
        zProfilesA,
        zProfilesC,
        cMasses,
        col3D,
      ] = await Promise.all([
        op.getWallWidths(),
        op.getOuterWidths(),
        op.getInnerWidths(),
        op.getAMasses(),
        op.getZProfilesA(),
        op.getZProfilesC(),
        op.getCMasses(),
        op.col3D,
      ]);
      var save: any = new End_Profile(
        op.id,
        this,
        wallWidths,
        outerWidths,
        innerWidths,
        aMasses,
        zProfilesA,
        zProfilesC,
        cMasses,
        col3D,
        this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[0].length),
        false,
      );
      save.parts = parts;

      save.up = await oldAutoProfiles[0].up;
      save.upLength = await oldAutoProfiles[0].upLength;
      save.isFirst = true;
      if (save) this.autoProfiles.push(save);
    } else if (
      this.autoProfileGeometryLineTypes &&
      this.autoProfileGeometryLineTypes[0] == 'Corner'
    ) {
      var parts = [
        this.autoProfileGeometry!.lines[this.autoProfileGeometry!.lines.length - 1],
        this.autoProfileGeometry!.lines[0],
      ];
      for (const part of parts) part.saved = true;

      const [
        wallWidths,
        outerWidths,
        innerWidths,
        aMasses,
        zProfilesA,
        zProfilesC,
        cMasses,
        col3D,
      ] = await Promise.all([
        op.getWallWidths(),
        op.getOuterWidths(),
        op.getInnerWidths(),
        op.getAMasses(),
        op.getZProfilesA(),
        op.getZProfilesC(),
        op.getCMasses(),
        op.col3D,
      ]);
      const save: any = new Angled_Profile(
        op.id,
        this,
        wallWidths,
        outerWidths,
        innerWidths,
        aMasses,
        zProfilesA,
        zProfilesC,
        cMasses,
        col3D,
        [
          this.mainGeometry.grid.toUnit(
            this.autoProfileGeometry!.lines[this.autoProfileGeometry!.lines.length - 1]
              .length,
          ),
          this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[0].length),
        ],
        PI +
          this.autoProfileGeometry!.lines[this.autoProfileGeometry!.lines.length - 1]
            .angle -
          this.autoProfileGeometry!.lines[0].angle,
      );
      save.parts = parts;
      save.orientation = op.orientation;
      if (save) this.autoProfiles.push(save);
    }

    const ma = this.mainGeometry.closed
      ? this.autoProfileGeometryLineTypes!.length - 1
      : this.autoProfileGeometryLineTypes?.length;

    for (let p = 1; p < ma!; p++) {
      const op = oldAutoProfiles[this.autoProfiles.length];

      if (
        this.autoProfileGeometryLineTypes &&
        this.autoProfileGeometryLineTypes[p] === 'Corner'
      ) {
        const parts = [
          this.autoProfileGeometry?.lines[p],
          this.autoProfileGeometry?.lines[p + 1],
        ];
        for (const part of parts) part!.saved = true;

        const [
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        ] = await Promise.all([
          op.getWallWidths(),
          op.getOuterWidths(),
          op.getInnerWidths(),
          op.getAMasses(),
          op.getZProfilesA(),
          op.getZProfilesC(),
          op.getCMasses(),
          op.col3D,
        ]);

        const save: any = new Angled_Profile(
          op.id,
          this,
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
          [
            this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[p].length),
            this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[p + 1].length),
          ],
          this.autoProfileGeometry!.relativeAngles[p + 1],
        );
        save.parts = parts;
        save.orientation = op.orientation;
        // tested
        if (save) this.autoProfiles.push(save);

        p++;
      } else if (
        this.autoProfileGeometryLineTypes &&
        this.autoProfileGeometryLineTypes[p] == 'Straight'
      ) {
        const parts = [this.autoProfileGeometry?.lines[p]];
        for (const part of parts) part!.saved = true;

        const [
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        ] = await Promise.all([
          op.getWallWidths(),
          op.getOuterWidths(),
          op.getInnerWidths(),
          op.getAMasses(),
          op.getZProfilesA(),
          op.getZProfilesC(),
          op.getCMasses(),
          op.col3D,
        ]);

        const save: any = new Straight_Profile(
          op.id,
          this,
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
          this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[p].length),
        );
        save.parts = parts;

        // tested
        if (save) this.autoProfiles.push(save);

        // Save the rounded version
        const opl = await oldAutoProfiles[this.autoProfiles.length - 1];

        const save2 = new Straight_Profile(
          opl.id,
          this,
          opl.getWallWidths(),
          opl.getOuterWidths(),
          opl.getInnerWidths(),
          opl.getAMasses(),
          opl.getZProfilesA(),
          opl.getZProfilesC(),
          opl.getCMasses(),
          canvasInstance
            .max(
              Math.ceil(
                this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[p].length),
              ),
              3,
            )
            .toString(),
          0,
        );
        save2.parts = parts;
      } else if (
        this.autoProfileGeometryLineTypes &&
        this.autoProfileGeometryLineTypes[p] == 'T-shape'
      ) {
        const angles = [];
        const parts = findConnections(
          this.autoProfileGeometry!.lines[p].points[1],
          this,
          this.autoProfileGeometry?.additionalLines,
          true,
        );
        parts.push(
          this.autoProfileGeometry!.lines[p],
          this.autoProfileGeometry!.lines[p + 1],
        );
        for (const part of parts) {
          /*
                  part.saved = true;

                  if ((PI - part.angle + parts[(parts.indexOf(part) + 1) % parts.length].angle) == PI) angles.push(PI)
                  else angles.push((PI - part.angle + parts[(parts.indexOf(part) + 1) % parts.length].angle) % 2 * PI)
                  */

          part.saved = true;

          let ang = part.angle - parts[(parts.indexOf(part) + 1) % parts.length].angle;
          if (ang < 0) ang = ang + 2 * PI;
          if (ang > PI) ang = 2 * PI - ang;

          if (ang == PI || ang == 0) angles.push(PI);
          else angles.push(ang);
        }

        const [
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        ] = await Promise.all([
          op.getWallWidths(),
          op.getOuterWidths(),
          op.getInnerWidths(),
          op.getAMasses(),
          op.getZProfilesA(),
          op.getZProfilesC(),
          op.getCMasses(),
          op.col3D,
        ]);

        const save: any = new T_Profile(
          op.id,
          this,
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
          parts.map((x) => this.autoProfileGeometry?.grid.toUnit(x.length)),
          angles,
        );
        save.parts = parts;
        // tested
        if (save) this.autoProfiles.push(save);
        p++;
      } else if (
        this.autoProfileGeometryLineTypes &&
        this.autoProfileGeometryLineTypes[p] == 'End'
      ) {
        const parts = [this.autoProfileGeometry!.lines[p]];
        for (var part of parts) part.saved = true;
        const [
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        ] = await Promise.all([
          op.getWallWidths(),
          op.getOuterWidths(),
          op.getInnerWidths(),
          op.getAMasses(),
          op.getZProfilesA(),
          op.getZProfilesC(),
          op.getCMasses(),
          op.col3D,
        ]);

        const save: any = new End_Profile(
          op.id,
          this,
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
          this.mainGeometry.grid.toUnit(this.autoProfileGeometry!.lines[p].length),
          false,
        );
        save.parts = parts;

        save.up = op.up;
        save.upLength = op.upLength;
        // tested

        if (save) this.autoProfiles.push(save);
      } else {
        const parts = findConnections(
          this.autoProfileGeometry!.lines[p].points[1],
          this,
          this.autoProfileGeometry!.additionalLines,
        );
        parts.push(
          this.autoProfileGeometry?.lines[p],
          this.autoProfileGeometry?.lines[p + 1],
        );
        for (const part of parts) part.saved = true;
        const [
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        ] = await Promise.all([
          op.getWallWidths(),
          op.getOuterWidths(),
          op.getInnerWidths(),
          op.getAMasses(),
          op.getZProfilesA(),
          op.getZProfilesC(),
          op.getCMasses(),
          op.col3D,
        ]);
        const save: any = new Profile(
          op.id,
          this,
          wallWidths,
          outerWidths,
          innerWidths,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          col3D,
        );
        save.parts = parts;

        if (save) this.autoProfiles.push(save);

        p++;
      }
    }

    // Add in the additional profiles
    for (const al of this.autoProfileGeometry!.additionalLines) {
      const op = oldAutoProfiles[this.autoProfiles.length];

      if (!al.saved) {
        const c = [...this.autoProfileGeometry!.additionalLines];
        c.splice(c.indexOf(al), 1);

        const contacts1 = findConnections(al.points[0], this, c);
        const contacts2 = findConnections(al.points[1], this, c);

        if (contacts1.length == 0 || contacts2.length == 0) {
          //Save an End piece
          const parts = [al];
          for (const part of parts) part.saved = true;
          const [
            wallWidths,
            outerWidths,
            innerWidths,
            aMasses,
            zProfilesA,
            zProfilesC,
            cMasses,
            col3D,
          ] = await Promise.all([
            op.getWallWidths(),
            op.getOuterWidths(),
            op.getInnerWidths(),
            op.getAMasses(),
            op.getZProfilesA(),
            op.getZProfilesC(),
            op.getCMasses(),
            op.col3D,
          ]);

          const save: any = new End_Profile(
            op.id,
            this,
            wallWidths,
            outerWidths,
            innerWidths,
            aMasses,
            zProfilesA,
            zProfilesC,
            cMasses,
            col3D,
            this.mainGeometry.grid.toUnit(al.length),
            false,
          );
          save.parts = parts;
          save.up = op.up;
          save.upLength = op.upLength;

          if (save) this.autoProfiles.push(save);
        } else {
          if (contacts1.length != contacts2.length) {
            const angles = [];
            const parts = contacts1.length > contacts2.length ? contacts1 : contacts2;
            parts.push(al);
            for (const part of parts) {
              part.saved = true;
              let ang =
                (await part.angle) -
                parts[(parts.indexOf(part) + 1) % parts.length].angle;
              if (ang < 0) ang = ang + 2 * PI;
              if (ang > PI) ang = 2 * PI - ang;

              if (ang == PI || ang == 0) angles.push(PI);
              else angles.push(ang);
            }

            if (parts.length == 3) {
              // T-shape
              const [
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
              ] = await Promise.all([
                op.getWallWidths(),
                op.getOuterWidths(),
                op.getInnerWidths(),
                op.getAMasses(),
                op.getZProfilesA(),
                op.getZProfilesC(),
                op.getCMasses(),
                op.col3D,
              ]);
              const save = new T_Profile(
                op.id,
                this,
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
                parts.map((x) => this.autoProfileGeometry?.grid.toUnit(x.length)),
                angles,
              );
              save.parts = parts;
            } else if (parts.length > 3) {
              // Other
              // TODO: Issue with Profiles
              const [
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
              ] = await Promise.all([
                op.getWallWidths(),
                op.getOuterWidths(),
                op.getInnerWidths(),
                op.getAMasses(),
                op.getZProfilesA(),
                op.getZProfilesC(),
                op.getCMasses(),
                op.col3D,
              ]);
              const save = new Profile(
                op.id,
                this,
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
              );
              // eslint-disable-next-line no-console
              console.log('🚀 ~ FloorPlanManager ~ saveProfiles= ~ save:', save);

              // save.parts = parts;
            }

            if (save) this.autoProfiles.push(save);
          } else if (
            contacts1.length == contacts2.length &&
            canvasInstance.round((al.angle + PI) % PI, 5) ==
              canvasInstance.round((contacts1[0].angle + PI) % PI, 5) &&
            canvasInstance.round((al.angle + PI) % PI, 5) ==
              canvasInstance.round((contacts2[0].angle + PI) % PI, 5)
          ) {
            // Save a line
            const parts = [al];
            for (const part of parts) part.saved = true;
            const [
              wallWidths,
              outerWidths,
              innerWidths,
              aMasses,
              zProfilesA,
              zProfilesC,
              cMasses,
              col3D,
            ] = await Promise.all([
              op.getWallWidths(),
              op.getOuterWidths(),
              op.getInnerWidths(),
              op.getAMasses(),
              op.getZProfilesA(),
              op.getZProfilesC(),
              op.getCMasses(),
              op.col3D,
            ]);
            const save: any = new Straight_Profile(
              op.id,
              this,
              wallWidths,
              outerWidths,
              innerWidths,
              aMasses,
              zProfilesA,
              zProfilesC,
              cMasses,
              col3D,
              this.mainGeometry.grid.toUnit(contacts1.length),
            );
            save.parts = parts;

            if (save) this.autoProfiles.push(save);

            // Save the rounded version
            const opl = oldAutoProfiles[this.autoProfiles.length - 1];
            const save2 = new Straight_Profile(
              opl.id,
              this,
              await opl.getWallWidths(),
              await opl.getOuterWidths(),
              await opl.getInnerWidths(),
              await opl.getAMasses(),
              await opl.getZProfilesA(),
              await opl.getZProfilesC(),
              await opl.getCMasses(),
              canvasInstance
                .max(Math.ceil(this.mainGeometry.grid.toUnit(contacts1.length)), 3)
                .toString(),
              0,
            );
            save2.parts = parts;
          } else {
            // save corner
            let other;
            if (al.angle != contacts1[0].angle) {
              other = contacts1[0];
            } else {
              other = contacts2[0];
            }

            if (!other.saved) {
              const parts = [al, other];
              for (const part of parts) part.saved = true;
              const [
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
              ] = await Promise.all([
                op.getWallWidths(),
                op.getOuterWidths(),
                op.getInnerWidths(),
                op.getAMasses(),
                op.getZProfilesA(),
                op.getZProfilesC(),
                op.getCMasses(),
                op.col3D,
              ]);
              const save: any = new Angled_Profile(
                op.id,
                this,
                wallWidths,
                outerWidths,
                innerWidths,
                aMasses,
                zProfilesA,
                zProfilesC,
                cMasses,
                col3D,
                [
                  this.mainGeometry.grid.toUnit(al.length),
                  this.mainGeometry.grid.toUnit(other.length),
                ],
                PI + al.angle - other.angle,
              );
              save.parts = parts;
              save.orientation = op.orientation;

              if (save) this.autoProfiles.push(save);
            }
          }
        }
      }
    }

    if (this.autoProfiles[0] && !this.autoProfiles[0]?.parts[0]?.aMass) {
      for (const p of this.autoProfiles) {
        p?.setMasses();
      }
    }

    const copy = [...this.autoProfiles];
    this.generateNeighbors(copy);
    let startCorner;
    for (const p of copy) {
      if (p.type == 'Angled') {
        startCorner = p;
        break;
      }
    }
    const tree = {
      start: startCorner,
      path: [],
      connections: [],
    };

    const findStraightPath = (from: any, first: any) => {
      const path = [first];
      const origFrom = from;
      let done = false;

      if (first.type !== 'Straight') {
        return {
          path: [],
          end: first,
          start: from,
        };
      }

      while (!done) {
        for (const p of first.neighbors.map((x: { neighbor: any }) => x.neighbor)) {
          if (p != from && p != first) {
            if (p.type == 'Straight') {
              path.push(p);
              from = first;
              first = p;
            } else {
              done = true;

              for (const pathEl of path) {
                copy.splice(copy.indexOf(pathEl), 1);
              }
              return {
                path: path,
                end: p,
                start: origFrom,
              };
            }
          }
        }
      }

      return {
        path: path,
        end: null,
        start: origFrom,
      };
    };

    const findConn = async (
      parent: Angled_Profile | End_Profile | Straight_Profile | T_Profile | null,
      from:
        | Angled_Profile
        | End_Profile
        | Straight_Profile
        | T_Profile
        | null
        | undefined,
      branch: { start: any; path?: any[] | never[]; connections: any },
    ) => {
      if (!branch.start || branch.start == null) branch.start = from;
      if (from == null || branch.start == null) return;

      for (let p = 0; p < copy.length; p++) {
        if (copy[p] != parent && copy[p] != branch.start) {
          const neighbors = await this.areNeighbors(branch.start, copy[p]);
          if (neighbors) {
            const pathData = findStraightPath(branch.start, copy[p]);

            const newBranch = {
              start: pathData.end,
              path: pathData.path,
              connections: [],
            };

            await findConn(branch.start, pathData.end, newBranch);

            await branch.connections.push(newBranch);
            p = 0;
          }
        }
      }

      copy.splice(copy.indexOf(from), 1);
    };

    findConn(null, tree.start, tree);

    const setConnectionMasses = async (
      branch: { start: any; path: any; connections: any },
      lastOrientation: boolean,
      _parent = null,
    ) => {
      // SET CONNECTION FROM PARENT
      let connectionFromParent;
      for (const p of branch.path) {
        const neighbors = await this.areNeighbors(branch.start, p, true);
        connectionFromParent = neighbors?.ob1;
        if (connectionFromParent) {
          if (
            lastOrientation &&
            (branch.start.orientation != undefined ? branch.start.orientation : true)
          ) {
            // Nothing
            connectionFromParent.nextTo = false;
            connectionFromParent.between = false;
          } else if (
            (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
              !lastOrientation) &&
            lastOrientation !=
              (branch.start.orientation != undefined ? branch.start.orientation : true)
          ) {
            // Single one inner

            connectionFromParent.nextTo = true;
          } else if (
            (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
              !lastOrientation) &&
            lastOrientation ==
              (branch.start.orientation != undefined ? branch.start.orientation : true)
          ) {
            // Both inner

            connectionFromParent.between = true;
          }
          break;
        }
      }

      // SET ALL PATHS
      for (const p of branch.path) {
        if (
          lastOrientation &&
          (branch.start.orientation != undefined ? branch.start.orientation : true)
        ) {
          // Nothing
          for (const part of p.parts) {
            part.nextTo = false;
            part.between = false;
          }
        } else if (
          (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
            !lastOrientation) &&
          lastOrientation !=
            (branch.start.orientation != undefined ? branch.start.orientation : true)
        ) {
          // Single one inner

          for (const part of p.parts) {
            part.nextTo = true;
          }
        } else if (
          (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
            !lastOrientation) &&
          lastOrientation ==
            (branch.start.orientation != undefined ? branch.start.orientation : true)
        ) {
          // Both inner

          for (const part of p.parts) {
            part.between = true;
          }
        }
      }

      // SET ALL OUT CONNECTIONS
      for (const con of branch.connections) {
        let startPart: any;
        for (const p of con.path) {
          startPart = await this.areNeighbors(branch.start, p, true);
          startPart = startPart.ob1;
          if (startPart) break;
        }

        const nextOrientation = await setConnectionMasses(
          con,
          branch.start.orientation != undefined ? branch.start.orientation : true,
          branch.start,
        );

        if (
          (branch.start.orientation != undefined ? branch.start.orientation : true) &&
          nextOrientation
        ) {
          // Nothing
          startPart.nextTo = false;
          startPart.between = false;
        } else if (
          (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
            !nextOrientation) &&
          (branch.start.orientation != undefined ? branch.start.orientation : true) !=
            nextOrientation
        ) {
          // Single one inner
          startPart.nextTo = true;
        } else if (
          (!(branch.start.orientation != undefined ? branch.start.orientation : true) ||
            !nextOrientation) &&
          (branch.start.orientation != undefined ? branch.start.orientation : true) ==
            nextOrientation
        ) {
          // Both inner
          startPart.between = true;
        }

        //setConnectionMasses(con, (branch.start.orientation != undefined ? branch.start.orientation : true), branch.start)
      }

      return branch.start.orientation != undefined ? branch.start.orientation : true;
    };

    if (startCorner != undefined) await setConnectionMasses(tree, true);

    await this.compressProfileList();

    if (includeInStack) {
      if (this.mainGeometry.doUpdateCall) {
        this.mainGeometry.updateCall();
      } else this.addToStack();
    }
  };

  areNeighbors = async (
    ob1: { neighbors?: any[] },
    ob2: any,
    includeTouchParts = false,
  ): Promise<any> => {
    const neighbors = ob1?.neighbors;
    if (neighbors && Array.isArray(neighbors)) {
      const id = neighbors.findIndex((x: { neighbor: any }) => x.neighbor === ob2);
      if (id !== -1) {
        if (includeTouchParts) {
          return {
            ob1: neighbors[id]?.touch,
            ob2: ob2?.neighbors?.find((x: { neighbor: any }) => x.neighbor === ob1)
              ?.touch,
          };
        }
        return true;
      }
    }
    return false;
  };

  generateNeighbors = async (arr: any[]) => {
    for (const o1 of arr) {
      for (const o2 of arr) {
        if (o1 !== o2) {
          const touch: any = this.areProfilesTouching(o1, o2, true);
          if (touch) {
            if (!o1.neighbors) o1.neighbors = [];
            if (!o2.neighbors) o2.neighbors = [];

            const neighborIndex = o1.neighbors.findIndex(
              (x: { neighbor: any }) => x.neighbor === o2,
            );
            if (neighborIndex === -1) {
              o1.neighbors.push({
                neighbor: o2,
                touch: touch.ob1,
              });
            } else {
              o1.neighbors[neighborIndex].touch = touch.ob1;
            }

            const reverseNeighborIndex = o2.neighbors.findIndex(
              (x: { neighbor: any }) => x.neighbor === o1,
            );
            if (reverseNeighborIndex === -1) {
              o2.neighbors.push({
                neighbor: o1,
                touch: touch.ob2,
              });
            } else {
              o2.neighbors[reverseNeighborIndex].touch = touch.ob2;
            }
          }
        }
      }
    }

    // for (const o1 of this.autoProfiles as any) {
    //   o1.neighbors = Array.from(o1.neighbors);
    // }
  };

  areProfilesTouching(ob1: { parts: any }, ob2: any, includeTouchParts = false) {
    const { canvasInstance } = useEditorStore.getState();

    if (!ob1 || !ob2) {
      return;
    }
    for (const p1 of ob1.parts) {
      for (const p2 of ob2.parts) {
        if (
          (canvasInstance.round(p1.points[0].x, 5) ==
            canvasInstance.round(p2.points[0].x, 5) &&
            canvasInstance.round(p1.points[0].y, 5) ==
              canvasInstance.round(p2.points[0].y, 5)) ||
          (canvasInstance.round(p1.points[1].x, 5) ==
            canvasInstance.round(p2.points[1].x, 5) &&
            canvasInstance.round(p1.points[1].y, 5) ==
              canvasInstance.round(p2.points[1].y, 5)) ||
          (canvasInstance.round(p1.points[0].x, 5) ==
            canvasInstance.round(p2.points[1].x, 5) &&
            canvasInstance.round(p1.points[0].y, 5) ==
              canvasInstance.round(p2.points[1].y, 5)) ||
          (canvasInstance.round(p1.points[1].x, 5) ==
            canvasInstance.round(p2.points[0].x, 5) &&
            canvasInstance.round(p1.points[1].y, 5) ==
              canvasInstance.round(p2.points[0].y, 5))
        ) {
          if (includeTouchParts) {
            return {
              ob1: p1,
              ob2: p2,
            };
          }
          return true;
        }
      }
    }

    return false;
  }

  async addToStack() {
    if (this.stackIndex < this.stack.length - 1) {
      this.stack.length = this.stackIndex + 1;
    }
    const exportedData = await this.export();
    this.stack.push(exportedData);
    this.stackIndex++;

    if (this.stack.length > this.maxStackSize) {
      this.stack.shift();
      this.stackIndex--;
    }

    for (let s = 0; s < this.stack.length; s++) {
      if (this.stack[s] == this.stack[s + 1]) {
        this.stack.splice(s + 1, 1);
        s--;
        this.stackIndex--;
      }
    }
    //throw ("Added")
  }

  undo(forceQuit = false) {
    const { canvasInstance } = useEditorStore.getState();
    this.stackIndex = canvasInstance.constrain(this.stackIndex, 0, this.stack.length - 1);

    if (this.stackIndex > 0) {
      this.stackIndex--;

      this.import(this.stack[this.stackIndex], false);

      if (this.sendData && !forceQuit) {
        // c.updateProject(projectDetails.id, this.export(), '-1');
        this.lastSent = performance.now();
      }
    }
  }

  redo(forceQuit = false) {
    const { canvasInstance } = useEditorStore.getState();
    this.stackIndex = canvasInstance.constrain(this.stackIndex, 0, this.stack.length - 1);

    if (this.stackIndex < this.stack.length - 1) {
      this.stackIndex++;

      this.import(this.stack[this.stackIndex], false);

      if (this.sendData && !forceQuit) {
        // c.updateProject(projectDetails.id, this.export(), '1');
        this.lastSent = performance.now();
      }
    }
  }

  async export() {
    const { canvasInstance } = useEditorStore.getState();
    /* 
    Type :
        0=End
        1=Straight
        2=Angled
        3=T-shpae
        4=Other
    */
    const points = [];
    const addLines = [];
    const profiles = [];

    for (const p of this.mainGeometry.points) {
      points.push({
        x: canvasInstance.round(p.x, 5),
        y: canvasInstance.round(p.y, 5),
      });
    }

    for (const l of this.mainGeometry.additionalLines) {
      addLines.push({
        p1: {
          x: canvasInstance.round(l.points[0].x, 5),
          y: canvasInstance.round(l.points[0].y, 5),
        },
        p2: {
          x: canvasInstance.round(l.points[1].x, 5),
          y: canvasInstance.round(l.points[1].y, 5),
        },
      });
    }

    if (this.tool == 2) {
      for (const prof of this.autoProfiles as any) {
        const profileCopy: any = {};
        const partsCopy = [];

        // if (prof) {

        const parts = await prof.parts;
        for (const part of parts) {
          const partCopy = {
            a: part.aMass,
            b: part.wallW,
            bi: part.inn,
            bo: part.out,
            c: part.cMass,
            za: part.z_profile_a,
            zc: part.z_profile_c,
            len: part.length,
            ang: part.angle,
            o: part.isOuter,
            p: [
              {
                x: part.points[0].x,
                y: part.points[0].y,
              },
              {
                x: part.points[1].x,
                y: part.points[1].y,
              },
            ],
          };

          partsCopy.push(partCopy);
        }

        profileCopy.p = partsCopy;
        profileCopy.id = prof.id;

        if (prof.type == 'End') {
          profileCopy.t = 0;

          profileCopy.l = prof.length;
          profileCopy.up = prof.up;
          profileCopy.ul = prof.upLength;
        } else if (prof.type == 'Straight') {
          profileCopy.t = 1;

          profileCopy.l = prof.length;
        } else if (prof.type == 'Angled') {
          profileCopy.t = 2;

          profileCopy.ll = prof.leftLength;
          profileCopy.rl = prof.rightLength;
          profileCopy.a = prof.angle;
          profileCopy.or = prof.orientation;
        } else if (prof.type == 'T-shape') {
          profileCopy.t = 3;

          profileCopy.x = prof.xLength;
          profileCopy.y = prof.yLength;
          profileCopy.z = prof.zLength;

          profileCopy.xy = prof.xyAngle;
          profileCopy.yz = prof.yzAngle;
          profileCopy.zx = prof.zxAngle;
        } else {
          profileCopy.t = 4;
        }

        profileCopy.c3D = prof.col3D;

        profiles.push(profileCopy);
      }
      // }
    }

    const exp = {
      appType: globalAppType,
      closed: this.mainGeometry.closed,
      tool: this.tool,
      points: points,
      addLines: addLines,
      profiles: profiles,
      default: {
        oh: this.outerHeight,
        ih: this.innerHeight,
        ww: this.wallWidth,
        iw: this.innerWidth,
        ow: this.outerWidth,
        ul: this.defaultUpLength,
        col: this.defaultCol,
        pt: this.profile_type,
        st: this.steepness,
        al: this.thickness,
        grid: this.mainGeometry.grid.conversionToUnit,
        ha: this.halter,
      },
      pdf: this.pdf,
    };

    return JSON.stringify(exp);
  }

  async import(data: string, includeInStack = true) {
    const dataIn = await JSON.parse(data);

    const oldApplyFL = this.applyForceLength;
    this.applyForceLength = false;

    // if (includeInStack) {
    //   this.redo(true);
    //   return;
    // } else if (!includeInStack) {
    //   this.undo(true);
    //   return;
    // }

    delete this.autoProfileGeometryLineTypes;
    delete this.autoProfiles;
    delete this.autoProfilesList;
    delete this.autoProfilesListCompact;

    this.mainGeometry = new PointManager([]);
    this.mainGeometry.parent = this;
    this.mainGeometry.updateCall = async function () {
      if (!this.lastSent) this.lastSent = 0;
      if (performance.now() - this.lastSent > 1000 / maxFPS) {
        if (!this.dragging) {
          await this.parent?.addToStack();
        }

        if (this.parent?.sendData) {
          // drawingData = this.parent.export();
          // c.updateProject(projectDetails.id, this.parent.export(), !this.dragging);
          this.lastSent = performance.now();
        }
      } else return;
    };

    this.mainGeometry.convertToUnit = true;
    this.mainGeometry.snapToG = true;
    this.mainGeometry.finished = true;
    this.mainGeometry.remove180DegCorners = false;

    const points = await dataIn.points;
    for (const p of points) {
      this.mainGeometry.addPoint(p.x, p.y, true);
    }
    for (const al of dataIn.addLines) {
      this.mainGeometry.addAdditionalLine(
        new Point(this.mainGeometry, al.p1.x, al.p1.y, -1),
        new Point(this.mainGeometry, al.p2.x, al.p2.y, -1),
        true,
      );
    }

    if (dataIn.closed) this.mainGeometry.close();
    this.mainGeometry.update();

    this.setTool(dataIn.tool);

    this.autoProfiles = [];
    this.autoProfileGeometry = new PointManager();
    this.autoProfileGeometry.convertToUnit = true;
    this.autoProfileGeometryLineTypes = [];
    for (const prof of dataIn.profiles) {
      let pushProf: any;

      const aMasses = prof.p.map((x: { a: any }) => x.a);
      const zProfilesA = prof.p.map((x: { za: any }) => x.za);
      const zProfilesC = prof.p.map((x: { zc: any }) => x.zc);
      const wallWidths = prof.p.map((x: { b: any }) => x.b);
      const inns = prof.p.map((x: { bi: any }) => x.bi);
      const outs = prof.p.map((x: { bo: any }) => x.bo);
      const cMasses = prof.p.map((x: { c: any }) => x.c);

      if (prof.t == 0) {
        pushProf = new End_Profile(
          prof.id,
          this,
          wallWidths,
          outs,
          inns,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          prof.c3D,
          prof.l,
          prof.up,
        );
        pushProf.upLength = prof.ul;
      } else if (prof.t == 1) {
        pushProf = new Straight_Profile(
          prof.id,
          this,
          wallWidths,
          outs,
          inns,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          prof.c3D,
          prof.l,
        );
      } else if (prof.t == 2) {
        pushProf = new Angled_Profile(
          prof.id,
          this,
          wallWidths,
          outs,
          inns,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          prof.c3D,
          [prof.ll, prof.rl],
          prof.a,
        );
        pushProf.orientation = prof.or;
      } else if (prof.t == 3) {
        pushProf = new T_Profile(
          prof.id,
          this,
          wallWidths,
          outs,
          inns,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          prof.c3D,
          [prof.x, prof.y, prof.z],
          [prof.xy, prof.yz, prof.zx],
        );
      } else {
        pushProf = new Profile(
          prof.id,
          this,
          wallWidths,
          outs,
          inns,
          aMasses,
          zProfilesA,
          zProfilesC,
          cMasses,
          prof.c3D,
        );
      }

      var isOut = false;
      for (
        let part = dataIn.closed && this.autoProfiles.length == 0 ? 1 : 0;
        part < prof.p.length;
        part++
      ) {
        const pushPart = new Line(
          this.autoProfileGeometry,
          new Point(
            this.autoProfileGeometry,
            prof.p[part].p[0].x,
            prof.p[part].p[0].y,
            -1,
          ),
          new Point(
            this.autoProfileGeometry,
            prof.p[part].p[1].x,
            prof.p[part].p[1].y,
            -1,
          ),
          -1,
        );
        pushPart.aMass = prof.p[part].a;
        pushPart.wallW = prof.p[part].b;
        pushPart.inn = prof.p[part].bi;
        pushPart.out = prof.p[part].bo;
        pushPart.cMass = prof.p[part].c;
        pushPart.z_profile_a = prof.p[part].za;
        pushPart.z_profile_c = prof.p[part].zc;
        pushPart.isOuter = prof.p[part].o;

        if (prof.t == 0) {
          pushPart.c = 'orange';
        } else if (prof.t == 1) {
          pushPart.c = 'red';
        } else if (prof.t == 2) {
          pushPart.c = 'blue';
        } else if (prof.t == 3) {
          pushPart.c = 'green';
        } else {
          pushPart.c = 'black';
        }

        pushProf.parts.push(pushPart);

        if (pushPart.isOuter) {
          if (this.autoProfileGeometry.points.length == 0) {
            this.autoProfileGeometry.addPoint(
              pushPart.points[0].x,
              pushPart.points[0].y,
              false,
              true,
            );
          }
          this.autoProfileGeometry.addPoint(
            pushPart.points[1].x,
            pushPart.points[1].y,
            false,
            true,
          );

          this.autoProfileGeometry.lines[this.autoProfileGeometry.lines.length - 1] =
            pushPart;

          isOut = true;
        } else {
          this.autoProfileGeometry.addAdditionalLine(
            pushPart.points[0],
            pushPart.points[1],
            true,
          );
        }
      }

      if (isOut) {
        if (prof.t == 0) {
          this.autoProfileGeometryLineTypes.push('End');
        } else if (prof.t == 1) {
          this.autoProfileGeometryLineTypes.push('Straight');
        } else if (prof.t == 2) {
          this.autoProfileGeometryLineTypes.push('Corner');
          if (!(dataIn.closed && this.autoProfiles.length == 0))
            this.autoProfileGeometryLineTypes.push('Corner');
        } else if (prof.t == 3) {
          this.autoProfileGeometryLineTypes.push('T-shape');
          this.autoProfileGeometryLineTypes.push('T-shape');
        } else {
          this.autoProfileGeometryLineTypes.push('Other');
          this.autoProfileGeometryLineTypes.push('Other');
        }
      }

      this.autoProfiles.push(pushProf);
    }
    useEditorStore.setState({ lockedProfile: this.autoProfiles.length > 0 });
    // Handle the first part of the first profile (corner) when closed
    if (dataIn.closed) {
      if (dataIn.profiles.length > 0) {
        const pushProf = this.autoProfiles[0];
        const prof = dataIn.profiles[0];
        const part = 0;

        const pushPart = new Line(
          this.autoProfileGeometry,
          new Point(
            this.autoProfileGeometry,
            prof.p[part].p[0].x,
            prof.p[part].p[0].y,
            -1,
          ),
          new Point(
            this.autoProfileGeometry,
            prof.p[part].p[1].x,
            prof.p[part].p[1].y,
            -1,
          ),
          -1,
        );
        pushPart.aMass = prof.p[part].a;
        pushPart.wallW = prof.p[part].b;
        pushPart.inn = prof.p[part].bi;
        pushPart.out = prof.p[part].bo;
        pushPart.cMass = prof.p[part].c;
        pushPart.z_profile_a = prof.p[part].za;
        pushPart.z_profile_c = prof.p[part].zc;
        pushPart.isOuter = prof.p[part].o;

        if (prof.t == 0) {
          pushPart.c = 'orange';
        } else if (prof.t == 1) {
          pushPart.c = 'red';
        } else if (prof.t == 2) {
          pushPart.c = 'blue';
        } else if (prof.t == 3) {
          pushPart.c = 'green';
        } else {
          pushPart.c = 'black';
        }

        pushProf.parts.unshift(pushPart);

        if (pushPart.isOuter) {
          if (this.autoProfileGeometry?.points.length == 0) {
            this.autoProfileGeometry?.addPoint(
              pushPart.points[0].x,
              pushPart.points[0].y,
              false,
              true,
            );
          }
          this.autoProfileGeometry?.addPoint(
            pushPart.points[1].x,
            pushPart.points[1].y,
            false,
            true,
          );

          this.autoProfileGeometry.lines[this.autoProfileGeometry.lines.length - 1] =
            pushPart;

          isOut = true;
        } else {
          this.autoProfileGeometry.addAdditionalLine(
            pushPart.points[0],
            pushPart.points[1],
            true,
          );
        }

        this.autoProfileGeometryLineTypes.push('Corner');
      }
    }

    this.autoProfileGeometry.finished = true;
    this.autoProfileGeometry.update();
    await this.saveProfiles(includeInStack);

    await this.createRoundedProfiles();
    await this.compressProfileList();

    for (const inp of document.getElementsByTagName('input')) {
      if (
        inp.value == '' &&
        inp.type == 'text' &&
        this.mainGeometry.changingData.input != inp &&
        this.autoProfileGeometry?.changingData.input != inp &&
        inp.style.display == 'none'
      ) {
        inp.remove();
      }
    }

    this.autoProfileGeometry.changeLineLengthConservative = true;
    this.mainGeometry.doUpdateCall = true;

    this.outerHeight = dataIn.default.oh;
    this.innerHeight = dataIn.default.ih;
    this.wallWidth = dataIn.default.ww;
    this.innerWidth = dataIn.default.iw;
    this.outerWidth = dataIn.default.ow;
    this.defaultUpLength = dataIn.default.ul;
    this.defaultCol = dataIn.default.col;
    this.profile_type = dataIn.default.pt;
    this.steepness = dataIn.default.st;
    this.thickness = dataIn.default.al;
    this.halter = dataIn.default.ha;

    this.pdf = dataIn.pdf ? dataIn.pdf : [];

    if (includeInStack) {
      this.addToStack();
    }

    this.applyForceLength = oldApplyFL;
  }

  /**
   * Create rounded profiles based on the autoProfiles list, and assign them to the autoProfilesList array.
   */
  async createRoundedProfiles() {
    const { canvasInstance } = useEditorStore.getState();
    this.autoProfilesList = [];

    for (const p of this.autoProfiles as any) {
      if (
        p?.type ==
        new Straight_Profile(generateUUID(), null, [], [], [], [], [], [], [], 'grey', 0)
          .type
      ) {
        const copy = new Straight_Profile(
          generateUUID(),
          p.parent,
          await p.getWallWidths(),
          await p.getOuterWidths(),
          await p.getInnerWidths(),
          await p.getAMasses(),
          await p.getZProfilesA(),
          await p.getZProfilesC(),
          await p.getCMasses(),
          await p.col3D,
          canvasInstance.max(3, Math.ceil(p.length)),
        );
        copy.parts = await p.parts;

        this.autoProfilesList.push(copy);
      } else {
        this.autoProfilesList.push(p);
      }
    }
  }

  /**
   * Compresses the profile list by creating rounded profiles and compacting the list.
   */
  async compressProfileList() {
    await this.createRoundedProfiles();

    this.autoProfilesListCompact = [];

    if (this.autoProfilesList) {
      this.autoProfilesListCompact.push({
        profile: this.autoProfilesList[0],
        amount: 0,
        all_profiles: [this.autoProfilesList[0]],
      });
      for (const p of this.autoProfilesList as any) {
        let createNew = true;
        for (let t = 0; t < this.autoProfilesListCompact.length; t++) {
          const type: any = this.autoProfilesListCompact[t];

          if (_.isEqual(type.profile?.onlyDims(), p?.onlyDims())) {
            type.amount++;
            type.all_profiles.push(p);
            createNew = false;
            break;
          }
        }

        if (createNew) {
          this.autoProfilesListCompact.push({
            profile: p,
            amount: 1,
            all_profiles: [p],
          });
        }
      }
    }

    this.autoProfilesCompact = [];

    if (this.autoProfiles) {
      this.autoProfilesCompact.push({
        profile: this.autoProfiles[0],
        amount: 0,
        all_profiles: [this.autoProfiles[0]],
      });

      for (const p of this.autoProfiles) {
        let createNew = true;
        for (let t = 0; t < this.autoProfilesCompact.length; t++) {
          const type = await this.autoProfilesCompact[t];

          if (_.isEqual(type.profile?.onlyDims(), p.onlyDims())) {
            type.amount++;
            type.all_profiles.push(p);
            createNew = false;
            break;
          }
        }

        if (createNew) {
          this.autoProfilesCompact.push({
            profile: p,
            amount: 1,
            all_profiles: [p],
          });
        }
      }
    }
  }

  splitProfile = async () => {
    var lineID = -1;
    if (this.autoProfileGeometry) {
      for await (var l of this.autoProfileGeometry.lines) {
        if (
          this.changingProfile?.parts[0]?.points[0]?.x == l.points[0]?.x &&
          this.changingProfile?.parts[0]?.points[0]?.y == l.points[0]?.y &&
          this.changingProfile?.parts[0]?.points[1]?.x == l.points[1]?.x &&
          this.changingProfile?.parts[0]?.points[1]?.y == l.points[1]?.y
        ) {
          lineID = this.autoProfileGeometry!.lines.indexOf(l);
          break;
        }
      }

      if (lineID !== -1) {
        var l = this.autoProfileGeometry!.lines[lineID];
        this.autoProfileGeometryLineTypes?.splice(lineID, 0, 'Straight');
        this.autoProfileGeometry!.points.splice(
          lineID + 1,
          0,
          new Point(this.autoProfileGeometry!, l.x, l.y),
        );
        this.autoProfileGeometry!.update();
        this.autoProfiles?.splice(lineID, 0, this.changingProfile);
      } else {
        var origLID = this.autoProfileGeometry!.lines.length - 1;
        for (const l of this.autoProfileGeometry!.additionalLines) {
          if (
            this.changingProfile.parts[0].points[0].x == l.points[0].x &&
            this.changingProfile.parts[0].points[0].y == l.points[0].y &&
            this.changingProfile.parts[0].points[1].x == l.points[1].x &&
            this.changingProfile.parts[0].points[1].y == l.points[1].y
          ) {
            lineID = this.autoProfileGeometry!.additionalLines.indexOf(l);
            break;
          }
        }

        l = await this.autoProfileGeometry!.additionalLines[lineID];

        this.autoProfiles?.splice(
          lineID + origLID,
          0,
          Object.create(this.changingProfile),
        );

        var side1 = await this.autoProfileGeometry?.additionalLines[lineID]?.points[0];

        var side2 = await this.autoProfileGeometry?.additionalLines[lineID]?.points[1];
        var center = new Point(
          this.autoProfileGeometry!,
          await this.autoProfileGeometry?.additionalLines[lineID]?.x,
          await this.autoProfileGeometry?.additionalLines[lineID]?.y,
        );
        await this.autoProfileGeometry?.additionalLines.splice(lineID, 1);

        this.autoProfileGeometry?.addAdditionalLine(side1, center);
        this.autoProfileGeometry?.addAdditionalLine(center, side2);
      }

      var d = document.getElementById('ProfileChangeDiv');

      if (d) d.innerHTML = '';

      this.changingProfile = null;
      this.changing = false;

      await this.saveProfiles();
      // setFloorPlan(this);
    }
  };

  changeAngledProfileOrientation() {
    this.changingProfile.orientation = !this.changingProfile.orientation;

    var d = document.getElementById('ProfileChangeDiv');
    if (d) d.innerHTML = '';

    this.changingProfile = null;
    this.changing = false;

    this.saveProfiles();
  }
  async addPDF() {
    const { cameraPosition, zoomVal, canvasInstance, setZoomVal, setCameraPosition } =
      useEditorStore.getState();

    var oldTool = this.tool;
    var oldCamPosition = cameraPosition;
    var oldZoom = zoomVal;
    var oldW = canvasInstance.width;
    var oldH = canvasInstance.height;
    this.tool = -1;

    // Find bounds
    var bounds = this.getBounds();
    var c = 15 / 800;
    var k = canvasInstance.pow(canvasInstance.max(bounds.w, bounds.h), 0.975) * c;

    var image_padding = 3 * k;
    var bounds = this.getBounds(image_padding);
    var minX = bounds.x.min;
    var maxX = bounds.x.max;
    var minY = bounds.y.min;
    var maxY = bounds.y.max;
    var w = bounds.w;
    var h = bounds.h;

    // Draw
    canvasInstance.resizeCanvas(1000, 700);
    // clear();
    setZoomVal(canvasInstance.min(canvasInstance.width / w, canvasInstance.height / h));
    setCameraPosition({
      x: (-(minX + maxX) * zoomVal) / 2 + canvasInstance.width / 2,
      y: (-(minY + maxY) * zoomVal) / 2 + canvasInstance.height / 2,
    });

    this.draw();
    const obj: any = {
      pdf_data: await this.getProfiles(),
      img: generateImageBlob(),
    };

    this.pdf.push(obj);

    this.tool = oldTool;
    setZoomVal(oldZoom);
    setCameraPosition(oldCamPosition);

    canvasInstance.resizeCanvas(oldW, oldH);
  }

  removePDF(id: number) {
    this.pdf.splice(id, 1);
  }
}
