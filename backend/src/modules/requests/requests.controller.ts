import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { HttpError } from '../../shared/utils/http-error';
import { createRequestSchema, updateRequestStatusSchema } from './requests.dto';
import {
  cancelMyRequest,
  getRequestDetail,
  listMyRequests,
  listTripRequests,
  requestTrip,
  updateRequest,
} from './requests.service';

export async function createRequestHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = createRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de solicitud inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const request = await requestTrip(req.user!.sub, parsed.data);
    res.status(201).json({ request });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function getRequestHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const request = await getRequestDetail(req.params.id);
    res.json({ request });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function listTripRequestsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const requests = await listTripRequests(req.params.tripId);
  res.json({ requests });
}

export async function listMyRequestsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const requests = await listMyRequests(req.user!.sub);
  res.json({ requests });
}

export async function updateRequestHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = updateRequestStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Estado inválido.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const request = await updateRequest(req.user!.sub, req.params.id, parsed.data);
    res.json({ request });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function cancelRequestHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const request = await cancelMyRequest(req.user!.sub, req.params.id);
    res.json({ request });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
