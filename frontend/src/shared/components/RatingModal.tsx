import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (score: number) => Promise<void>;
  userName: string;
  isSubmitting?: boolean;
}

/**
 * Modal para calificar un viaje o conductor/pasajero.
 * Muestra 5 estrellas seleccionables y un boton para enviar.
 */
export function RatingModal({ open, onClose, onSubmit, userName, isSubmitting = false }: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);

  const handleSubmit = async () => {
    if (score === 0) return;
    await onSubmit(score);
    setScore(0);
    onClose();
  };

  const displayScore = hoveredScore || score;

  return (
    <Modal open={open} onClose={onClose} title="Calificar viaje">
      <div className="text-center">
        <p className="text-sm text-muted">Como fue tu experiencia con {userName}?</p>

        {/* Estrellas */}
        <div className="my-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setScore(star)}
              onMouseEnter={() => setHoveredScore(star)}
              onMouseLeave={() => setHoveredScore(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <i className={star <= displayScore ? 'bi bi-star-fill text-yellow-400' : 'bi bi-star text-muted'} />
            </button>
          ))}
        </div>

        <p className="text-sm text-muted">
          {score === 0 && 'Selecciona una puntuacion'}
          {score === 1 && 'Muy mala experiencia'}
          {score === 2 && 'Mala experiencia'}
          {score === 3 && 'Experiencia regular'}
          {score === 4 && 'Buena experiencia'}
          {score === 5 && 'Excelente experiencia'}
        </p>

        <Button
          fullWidth
          className="mt-6"
          onClick={handleSubmit}
          disabled={score === 0 || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar calificacion'}
        </Button>
      </div>
    </Modal>
  );
}
