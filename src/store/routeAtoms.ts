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

export const routeDataAtom = atom<RoutePoint[]>([]);
export const activePointAtom = atom<RoutePoint | null>(null); 