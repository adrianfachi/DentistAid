'use client';

import { useEffect, useState, useMemo } from 'react';
import { MdClose } from 'react-icons/md';
import ImageGalleryModal from './ImageGalleryModal';

type Props = {
  isOpen: boolean;
  setIsOpen: () => void;
  update?: boolean;
  content?: string;
  image?: string[]; // Array de URLs de imagens
}


function PostModal({ isOpen, setIsOpen, update = false, content, image }: Props) {
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow || 'auto';
    }

    return () => {
      document.body.style.overflow = previousOverflow || 'auto';
    };
  }, [isOpen, isImageGalleryOpen]);


  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const images = useMemo(() => image || [], [image]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50" onClick={setIsOpen} />

        <div className="relative p-4 bg-background rounded-md shadow-lg flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
          <MdClose onClick={setIsOpen} className="absolute right-2 top-2 cursor-pointer text-2xl" />
          <h1 className='font-bold text-xl'>{update ? "Alterar" : "Criar"} postagem</h1>

          <p>Descrição</p>
          <textarea
            className='bg-background-standard border border-gray rounded-xl p-2 scroll-style'
            style={{ width: '800px', height: '200px', maxHeight: '400px', resize: 'vertical' }}
            defaultValue={content}
          />

          <div className='flex justify-between items-end'>
            {images.length > 0 && (
              <div
                className='flex cursor-pointer relative w-28 h-20'
                onClick={() => handleImageClick(0)}
              >
                <div className='absolute left-0 top-0 w-full h-full border border-gray rounded-md overflow-hidden z-10'>
                  <img
                    src={images[0]}
                    alt="Prévia da Imagem 1"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                {images.length > 1 && (
                  <div className='absolute left-3 top-3 w-full h-full border border-gray rounded-md overflow-hidden opacity-80'>
                    <img
                      src={images[1]}
                      alt="Prévia da Imagem 2"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    {images.length > 2 && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-bold text-lg z-20">
                        +{images.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className='flex justify-end gap-3'>
              <label
                htmlFor="image-upload"
                className={`bg-dark-green w-fit px-3 py-1 rounded-md cursor-pointer text-white`}
              >
                Nova imagem
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input
                type="button"
                value={`${update ? "Alterar" : "Criar nova"} postagem`}
                className='bg-ligth-green w-fit px-3 py-1 rounded-md cursor-pointer'
              />
            </div>
          </div>
        </div>
      </div>

      {isImageGalleryOpen && images.length > 0 && (
        <ImageGalleryModal
          images={images}
          onClose={() => setIsImageGalleryOpen(false)}
          initialIndex={initialImageIndex}
        />
      )}
    </>
  )
}

export default PostModal