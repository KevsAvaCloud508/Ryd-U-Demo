// Error de dominio con código HTTP asociado. Los controllers de todos los
// módulos lo capturan para responder con el status y mensaje correctos.
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
