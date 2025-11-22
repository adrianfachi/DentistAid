'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import ImageGalleryModal from './ImageGalleryModal';
import usePostAPI from '@/app/_hooks/usePostAPI';
import { ScaleLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  setIsOpen: () => void;
  update?: boolean;
  content?: string;
  image?: string[];
  id?: string
}


function PostModal({ isOpen, setIsOpen, update = false, content, image, id }: Props) {
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const refContent = useRef<HTMLTextAreaElement>(null);

  const [images, setImages] = useState<string[]>(() => image ? [...image] : []);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePost, error } = usePostAPI();

  useEffect(() => {
    setImages(image ? [...image] : []);
  }, [image]);

  const patchPost = async (id: string) => {
    setIsLoading(true);
    try {
      const body: newPostType = {
        content: refContent.current?.value || "",
        image: images
      };
      await updatePost(id, body);

      if (error) {
        toast.error("Erro ao atualizar postagem", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Postagem atualizada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      }

    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewImage = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = String(reader.result);
        setImages((prev) => [...prev, base64]);
      };
      reader.onerror = (err) => {
        console.error('Erro ao ler arquivo', err);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageAt = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsImageGalleryOpen(true);
  };

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
            ref={refContent}
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
                className={`bg-dark-green w-fit px-3 py-1.5 rounded-md cursor-pointer text-white`}
              >
                Nova imagem
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  addNewImage(e.target.files);
                }}
              />
              <div className='relative'>
                <input
                  type="button"
                  value={`${isLoading ? "" : `${update ? "Alterar" : "Criar nova"} postagem`}`}
                  className='bg-ligth-green w-40 py-1.5 rounded-md cursor-pointer'
                  onClick={() => {
                    update ?
                      patchPost(id!)
                      : {}
                    setIsOpen()
                  }}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScaleLoader
                      color="var(--foreground)"
                      height={20}
                      width={4}
                      radius={2}
                      margin={2}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isImageGalleryOpen && images.length > 0 && (
        <ImageGalleryModal
          images={images}
          onClose={() => setIsImageGalleryOpen(false)}
          initialIndex={initialImageIndex}
          removeImage={removeImageAt}
        />
      )}
    </>
  )
}

export default PostModal