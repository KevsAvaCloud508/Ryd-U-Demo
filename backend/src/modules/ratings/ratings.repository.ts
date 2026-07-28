import { prisma } from '../../prisma/client';

export function createRating(raterId: string, tripId: string, rateeId: string, score: number) {
  return prisma.rating.create({
    data: { tripId, raterId, rateeId, score },
  });
}

export function findRatingsByUser(userId: string) {
  return prisma.rating.findMany({
    where: { rateeId: userId },
    include: {
      rater: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } },
      trip: { select: { id: true, date: true, route: true } },
    },
    orderBy: { requestedAt: 'desc' },
  });
}

export function findRatingByTripAndRater(tripId: string, raterId: string) {
  return prisma.rating.findFirst({
    where: { tripId, raterId },
  });
}

export function getAverageRating(userId: string) {
  return prisma.rating.aggregate({
    where: { rateeId: userId },
    _avg: { score: true },
    _count: { score: true },
  });
}
