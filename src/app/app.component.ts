import { Component } from '@angular/core';
import LatLng = google.maps.LatLng;
import MVCArray = google.maps.MVCArray;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  lat = 40.3990525;
  lng = 49.8354792;
  drawingManager: google.maps.drawing.DrawingManager | undefined;
  colorHex = '#e11414';
  selectedShape: google.maps.Polygon | undefined;
  pointList:  MVCArray<LatLng>[] = [];
  self: any
  map: any;



  onMapReady(map: any): void {
    this.map = map;
    this.self = this;
      this.initDrawingManager();
  }

  private initDrawingManager = () => {
    const options: google.maps.drawing.DrawingManagerOptions = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        draggable: true,
        fillColor: this.colorHex,
        strokeColor: this.colorHex,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager?.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(paths.getAt(p), 'set_at', () => {
              if (!event.overlay.drag) {
                this.self.updatePointList(event.overlay.getPath());
              }
            });
            google.maps.event.addListener(paths.getAt(p), 'insert_at', () => {
              this.self.updatePointList(event.overlay.getPath());
            });
            google.maps.event.addListener(paths.getAt(p), 'remove_at', () => {
              this.self.updatePointList(event.overlay.getPath());
            });
          }
          this.self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          this.self.drawingManager.setDrawingMode(null);
          // To hide:
          this.self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  };



  private updatePointList(path: MVCArray<LatLng>): void {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
    }
  }


  deleteSelectedShape(): void {
    this.pointList = [];
    this.selectedShape?.setMap(null);
    this.drawingManager?.setMap(null);
    this.initDrawingManager();
  }

}

