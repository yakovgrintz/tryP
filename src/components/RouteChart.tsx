import { useAtom } from 'jotai';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceDot } from 'recharts';
import { routeDataAtom, activePointAtom } from '../store/routeAtoms';
import { useState, useEffect } from 'react';

interface RouteChartProps {
  dataKey: 'altitude' | 'speed';
  label: string;
  color: string;
  unit: string;
}

const RouteChart = ({ dataKey, label, color, unit }: RouteChartProps) => {
  const [routeData] = useAtom(routeDataAtom);
  const [activePoint, setActivePoint] = useAtom(activePointAtom);
  const [domain, setDomain] = useState<[number, number]>(['dataMin', 'dataMax']);

  // איפוס הדומיין כשהנתונים משתנים
  useEffect(() => {
    setDomain(['dataMin', 'dataMax']);
  }, [routeData]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    
    setDomain(currentDomain => {
      // המרה של ערכי dataMin/dataMax לערכים מספריים
      const minDistance = Math.min(...routeData.map(d => d.distance));
      const maxDistance = Math.max(...routeData.map(d => d.distance));
      
      const currentMin = currentDomain[0] === 'dataMin' ? minDistance : currentDomain[0];
      const currentMax = currentDomain[1] === 'dataMax' ? maxDistance : currentDomain[1];
      
      const range = currentMax - currentMin;
      const zoomFactor = 0.1;
      
      // חישוב הטווח החדש
      const newRange = delta > 0 ? range * (1 + zoomFactor) : range * (1 - zoomFactor);
      
      // חישוב נקודת המרכז הנוכחית
      const center = (currentMin + currentMax) / 2;
      
      // חישוב הגבולות החדשים
      let newMin = center - newRange / 2;
      let newMax = center + newRange / 2;
      
      // וידוא שלא חורגים מהטווח המקורי
      if (newMin < minDistance) {
        newMin = minDistance;
        newMax = newMin + newRange;
      }
      if (newMax > maxDistance) {
        newMax = maxDistance;
        newMin = newMax - newRange;
      }
      
      return [newMin, newMax] as [number, number];
    });
  };

  return (
    <div onWheel={handleWheel} style={{ width: '100%', height: '200px' }}>
      <ResponsiveContainer>
        <AreaChart
          data={routeData}
          onMouseMove={(data: any) => {
            if (data.activePayload) {
              setActivePoint(data.activePayload[0].payload);
            }
          }}
          onMouseLeave={() => setActivePoint(null)}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          syncId="routeSync"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="distance" 
            label={{ value: "מרחק (ק״מ)", position: "bottom" }}
            tickFormatter={(value) => value.toFixed(1)}
            domain={domain}
            type="number"
            allowDataOverflow
          />
          <YAxis 
            label={{ value: label, angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => 
              active && payload ? (
                <div className="custom-tooltip">
                  <p>{label}: {Number(payload[0].value).toFixed(1)}{unit}</p>
                  <p>מרחק: {Number(payload[0].payload.distance).toFixed(2)} ק"מ</p>
                  <p>זמן: {new Date(payload[0].payload.timestamp).toLocaleTimeString()}</p>
                </div>
              ) : null
            }
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color} 
            fillOpacity={0.3} 
          />
          {activePoint && (
            <ReferenceDot
              x={activePoint.distance}
              y={activePoint[dataKey]}
              r={5}
              fill="red"
              stroke="white"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RouteChart; 