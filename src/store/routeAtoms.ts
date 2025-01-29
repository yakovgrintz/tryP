import { atom } from 'jotai';

export interface RoutePoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  acceleration: number;
  distance: number;
}

export interface ChartDomain {
  min: number;
  max: number;
}

export const routeDataAtom = atom<RoutePoint[]>([]);
export const activePointAtom = atom<RoutePoint | null>(null);
export const chartDomainAtom = atom<ChartDomain>({ min: 0, max: 100 }); 