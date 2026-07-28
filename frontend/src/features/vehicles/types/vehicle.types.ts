export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  color: string;
  plates: string;
  capacity: number;
  year: number | null;
  isVerified: boolean | null;
}

export interface VehicleInput {
  brand: string;
  model: string;
  color: string;
  plates: string;
  capacity: number;
  year?: number;
}
