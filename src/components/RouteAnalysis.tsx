import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { routeDataAtom } from '../store/routeAtoms';
import { generateMockRouteData } from '../mockData';
import RouteMap from './RouteMap';
import RouteChart from './RouteChart';
import './RouteAnalysis.css';

const RouteAnalysis = () => {
  const [, setRouteData] = useAtom(routeDataAtom);

  useEffect(() => {
    // טעינת נתונים מיד בטעינת הקומפוננטה
    const initialData = generateMockRouteData();
    setRouteData(initialData);
  }, []); // הסרנו את התלות ב-setRouteData כי היא פונקציה סטטית

  return (
    <div className="route-analysis">
      <div className="content-wrapper">
        <div className="map-section">
          <RouteMap />
        </div>
        <div className="charts-container">
          <RouteChart
            dataKey="altitude"
            label="גובה"
            color="#8884d8"
            unit="מ'"
          />
          <RouteChart
            dataKey="speed"
            label="מהירות"
            color="#82ca9d"
            unit="קמ״ש"
          />
        </div>
      </div>
    </div>
  );
};

export default RouteAnalysis; 