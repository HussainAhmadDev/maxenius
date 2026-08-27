import { useEditorStore } from '@/store/EditorStore';

export class Controls {
  static move(controls: { view: any; viewPos: any }) {
    function mousePressed(e: MouseEvent) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e: MouseEvent) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      const { setCameraPosition } = useEditorStore.getState(); // Get the current zoom level

      if (!isDragging) return;

      // Adjust for zoom level
      const pos = { x: e.clientX, y: e.clientY };
      const dx = pos.x - prevX; // Scale the movement
      const dy = pos.y - prevY;

      // if (zoomVal > 1) {
      //   setZoomVal(1);
      // }

      setCameraPosition({
        x: controls.view.x + dx,
        y: controls.view.y + dy,
      });

      // Update previous mouse position
      controls.view.x += dx;
      controls.view.y += dy;
      controls.viewPos.prevX = pos.x;
      controls.viewPos.prevY = pos.y;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function mouseReleased(_e: MouseEvent) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }

    return {
      mousePressed,
      mouseDragged,
      mouseReleased,
    };
  }
}
