import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getPhoto } from '../store/db';

type Props = {
  blobId: string;
  alt: string;
  class?: string;
};

/** Looks up a stored photo blob and renders it, managing the object URL's
 * lifetime so it's revoked when the blob changes or the component unmounts. */
export function PhotoThumbnail({ blobId, alt, class: className }: Props) {
  const url = useSignal<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void getPhoto(blobId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      url.value = objectUrl;
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [blobId]);

  if (!url.value) return null;
  return <img class={className} src={url.value} alt={alt} />;
}
