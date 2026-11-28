import { ImageGallery } from '@/shared/components/ImageGallery';
import { Ltr } from '@/shared/components/ui/Ltr';

export type EvidenceGalleryProps = {
  /** Image URLs as the API sends them. */
  images: string[];
  /** Whose evidence: «المستلم» or «مقدم الخدمة». Used in the alt text and the lightbox title. */
  owner: string;
};

/** «المرفقات (n)» and the thumbnails; a thumbnail opens the lightbox. */
export function EvidenceGallery({ images, owner }: EvidenceGalleryProps) {
  const items = images.map((src, index) => ({
    id: `${index}-${src}`,
    src,
    alt: `صورة ${index + 1} من مرفقات ${owner}`,
  }));

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">
        المرفقات <Ltr>({images.length})</Ltr>
      </p>
      <ImageGallery images={items} title={`مرفقات ${owner}`} />
    </div>
  );
}
