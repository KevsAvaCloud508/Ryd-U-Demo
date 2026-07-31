import { useState } from 'react';

import { Button, PageHeader } from '../../../shared/components';
import { DocumentCard } from '../components/DocumentCard';
import { useVerification } from '../context/VerificationContext';

interface DocumentItem {
  icon: string;
  title: string;
  subtitle: string;
}

const TOTAL_DOCS = 6;

const initialDocuments: DocumentItem[] = [
  { icon: 'bi bi-person-vcard', title: 'Identificación (INE)', subtitle: 'Frente y reverso' },
  { icon: 'bi bi-file-text', title: 'Licencia de conducir', subtitle: 'Vigente' },
  { icon: 'bi bi-mortarboard-fill', title: 'Credencial de estudiante', subtitle: 'Vigente' },
  { icon: 'bi bi-shield-check', title: 'Póliza de seguro', subtitle: 'Vigente' },
  { icon: 'bi bi-car-front', title: 'Tarjeta de circulación', subtitle: 'Del vehículo' },
  { icon: 'bi bi-image', title: 'Foto del vehículo', subtitle: 'Exterior' },
];

export function DriverVerificationPage() {
  const [uploadedDocs, setUploadedDocs] = useState<Set<number>>(new Set());
  const { submitted, submitDocuments, cancelSubmission } = useVerification();

  const allUploaded = uploadedDocs.size >= TOTAL_DOCS;
  const isSubmitted = submitted && allUploaded;

  const handleUpload = (index: number) => {
    setUploadedDocs((prev) => new Set(prev).add(index));
  };

  const handleRemove = (index: number) => {
    setUploadedDocs((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const handleAction = () => {
    if (isSubmitted) {
      cancelSubmission();
    } else {
      submitDocuments();
    }
  };

  return (
    <div className="px-10 pb-10">
      <PageHeader
        title="Verifica tu identidad y vehículo"
        subtitle="Sube fotos legibles, sin reflejos y con las esquinas visibles. Tu cuenta se activa tras la revisión."
        className="[&_p]:mt-2 [&_p]:leading-relaxed"
      />

      <div className="mt-10 grid grid-cols-2 gap-x-[18px] gap-y-5">
        {initialDocuments.map((doc, index) => (
          <DocumentCard
            key={doc.title}
            icon={doc.icon}
            title={doc.title}
            subtitle={doc.subtitle}
            completed={uploadedDocs.has(index)}
            onUpload={() => handleUpload(index)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>

      <div className="mt-10">
        <Button
          variant="ghost"
          className={`rounded-full px-12 py-4 text-xl font-bold ${
            isSubmitted
              ? 'bg-transparent text-[#8d8d8d] border border-[#4a4a4a] hover:border-white/50 hover:text-white'
              : allUploaded
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-black text-white border border-white hover:bg-[#2a2a2a]'
          }`}
          disabled={!allUploaded && !isSubmitted}
          onClick={handleAction}
        >
          {isSubmitted ? (
            <>
              <i className="bi bi-x-lg" />
              Cancelar envío
            </>
          ) : (
            <>
              Enviar para revisión
              <i className="bi bi-arrow-right" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
