import { RoutePoint } from './store/routeAtoms';

export const generateMockRouteData = (): RoutePoint[] => {
  const points: RoutePoint[] = [];
  // נתחיל מתל אביב - כיכר רבין
  const startLat = 32.0853;
  const startLon = 34.7818;
  
  // ניצור מסלול מעגלי גדול יותר
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    const radius = 0.02; // כ-2 ק"מ רדיוס
    
    // נוסיף קצת רעש לעשות את המסלול יותר מעניין
    const noise = Math.sin(i * 0.5) * 0.002;
    
    const lat = startLat + Math.sin(angle) * radius + noise;
    const lon = startLon + Math.cos(angle) * radius + noise;
    
    points.push({
      timestamp: Date.now() + i * 60000, // נקודה כל דקה
      latitude: lat,
      longitude: lon,
      // גובה משתנה בצורה מעניינת יותר
      altitude: 100 + Math.sin(angle * 3) * 50 + Math.cos(angle * 2) * 30,
      // מהירות משתנה בהתאם לשיפוע
      speed: 15 + Math.cos(angle * 4) * 5 + Math.sin(angle * 2) * 3,
      // תאוצה מחושבת לפי שינוי המהירות
      acceleration: Math.sin(angle * 2),
      // מרחק מצטבר מחושב בק"מ
      distance: (i / 100) * 2 * Math.PI * radius * 111.32
    });
  }
  
  return points;
}; 