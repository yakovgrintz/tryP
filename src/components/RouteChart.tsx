import { useAtom } from 'jotai';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceDot } from 'recharts';
import { routeDataAtom, activePointAtom, chartDomainAtom } from '../store/routeAtoms';
import { useEffect } from 'react';

interface RouteChartProps {
  dataKey: 'altitude' | 'speed';
  label: string;
  color: string;
  unit: string;
}

const RouteChart = ({ dataKey, label, color, unit }: RouteChartProps) => {
  const [routeData] = useAtom(routeDataAtom);
  const [activePoint, setActivePoint] = useAtom(activePointAtom);
  const [domain, setDomain] = useAtom(chartDomainAtom);

  // איפוס הדומיין כשהנתונים משתנים
  useEffect(() => {
    if (routeData.length > 0) {
      const minDistance = Math.min(...routeData.map(d => d.distance));
      const maxDistance = Math.max(...routeData.map(d => d.distance));
      setDomain({ min: minDistance, max: maxDistance });
    }
  }, [routeData, setDomain]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    
    const minDistance = Math.min(...routeData.map(d => d.distance));
    const maxDistance = Math.max(...routeData.map(d => d.distance));
    
    const range = domain.max - domain.min;
    const zoomFactor = 0.1;
    
    // חישוב הטווח החדש
    const newRange = delta > 0 ? range * (1 + zoomFactor) : range * (1 - zoomFactor);
    
    // חישוב נקודת המרכז הנוכחית
    const center = (domain.min + domain.max) / 2;
    
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
    
    setDomain({ min: newMin, max: newMax });
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
            domain={[domain.min, domain.max]}
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