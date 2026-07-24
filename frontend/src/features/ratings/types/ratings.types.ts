export interface Rating {
  id: string;
  tripId: string;
  raterId: string;
  rateeId: string;
  score: number;
  requestedAt: string;
  rater: {
    id: string;
    firstName: string;
    lastNamePaternal: string;
    photoUrl: string | null;
  };
  trip: {
    id: string;
    date: string;
    route: { origin: string; destination: string };
  };
}

export interface RatingInput {
  tripId: string;
  rateeId: string;
  score: number;
}

export interface AverageRating {
  average: number;
  count: number;
}
