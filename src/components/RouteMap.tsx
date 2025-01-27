import { useAtom } from 'jotai';
import { RMap, ROSM, RLayerVector, RFeature } from 'rlayers';
import { fromLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Style, Stroke, Circle, Fill } from 'ol/style';
import { routeDataAtom, activePointAtom, RoutePoint } from '../store/routeAtoms';
import { useEffect, useRef } from 'react';
import 'ol/ol.css';

const RouteMap = () => {
  const [routeData] = useAtom(routeDataAtom);
  const [activePoint, setActivePoint] = useAtom(activePointAtom);
  const mapRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // סגנון לקו המסלול
  const routeStyle = new Style({
    stroke: new Stroke({ 
      color: '#0066cc',
      width: 4
    })
  });

  // סגנון לנקודות רגילות
  const pointStyle = new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: '#0066cc' }),
      stroke: new Stroke({ color: 'white', width: 2 })
    })
  });

  // סגנון לנקודה מודגשת
  const highlightStyle = new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: '#ff0000' }),
      stroke: new Stroke({ color: 'white', width: 2 })
    })
  });

  // מיקום התחלתי במפה (תל אביב)
  const initialCenter = fromLonLat([34.7818, 32.0853]);

  // התמקדות בנקודה פעילה
  useEffect(() => {
    if (activePoint && mapRef.current) {
      const view = mapRef.current.ol.getView();
      const coords = fromLonLat([activePoint.longitude, activePoint.latitude]);
      view.animate({
        center: coords,
        duration: 500
      });

      // עדכון מיקום ה-tooltip
      if (tooltipRef.current) {
        const pixel = mapRef.current.ol.getPixelFromCoordinate(coords);
        if (pixel) {
          tooltipRef.current.style.left = `${pixel[0]}px`;
          tooltipRef.current.style.top = `${pixel[1]}px`;
          tooltipRef.current.style.display = 'block';
        }
      }
    } else if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  }, [activePoint]);

  const handlePointHover = (point: RoutePoint, event: any) => {
    setActivePoint(point);
  };

  const handlePointLeave = () => {
    setActivePoint(null);
  };

  // יצירת קואורדינטות המסלול
  const routeCoordinates = routeData.map(point => 
    fromLonLat([point.longitude, point.latitude])
  );

  return (
    <div className="map-container">
      <RMap 
        ref={mapRef}
        initial={{ center: initialCenter, zoom: 14 }}
        width={'100%'}
        height={'100%'}
      >
        <ROSM />
        {routeData.length > 0 && (
          <RLayerVector>
            {/* קו המסלול */}
            <RFeature 
              geometry={new LineString(routeCoordinates)}
              style={routeStyle}
            />
            
            {/* נקודות לאורך המסלול */}
            {routeData.map((point, index) => (
              <RFeature
                key={index}
                geometry={new Point(fromLonLat([point.longitude, point.latitude]))}
                style={point === activePoint ? highlightStyle : pointStyle}
                onClick={() => handlePointHover(point)}
                onPointerEnter={() => handlePointHover(point)}
                onPointerLeave={handlePointLeave}
              />
            ))}
          </RLayerVector>
        )}
      </RMap>

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="map-tooltip"
        style={{ display: 'none', position: 'absolute' }}
      >
        {activePoint && (
          <>
            <div>נקודה במסלול:</div>
            <div>קו רוחב: {activePoint.latitude.toFixed(6)}</div>
            <div>קו אורך: {activePoint.longitude.toFixed(6)}</div>
            <div>גובה: {activePoint.altitude.toFixed(1)}מ'</div>
            <div>מהירות: {activePoint.speed.toFixed(1)} קמ"ש</div>
          </>
        )}
      </div>
    </div>
  );
};

export default RouteMap; 