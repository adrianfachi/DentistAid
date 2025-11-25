'use client';

import { useEffect, useState, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import ImageGalleryModal from './ImageGalleryModal';
import usePostAPI from '@/app/_hooks/usePostAPI';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import DeleteModal from '../DeleteModal';

type Props = {
  isOpen: boolean;
  setIsOpen: () => void;
  update?: boolean;
  content?: string;
  image?: string[];
  id?: string
  patientId?: number;
}


function PostModal({ isOpen, setIsOpen, update = false, content, image, id, patientId }: Props) {
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const refContent = useRef<HTMLTextAreaElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const { createPost, updatePost, deletePost } = usePostAPI();


  useEffect(() => {
    setImages([])
    setImages(image ? [...image] : []);
  }, [image]);

  const patchPost = async (id: string) => {
    setIsLoading(true);
    try {
      if (refContent.current) {
        const body: newPostType = {
          content: refContent.current.value || "",
          image: images
        };
        const { error } = await updatePost(id, body);

        if (error) {
          toast.error("Erro ao atualizar postagem", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        } else {
          toast.success("Postagem atualizada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        }
      }

    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postPost = async () => {
    setIsLoading(true);
    try {
      if (refContent.current) {
        const body: newPostType = {
          content: refContent.current.value,
          image: images
        };
        console.log(images)
        const { error } = await createPost(patientId!, body);

        if (error) {
          toast.error("Erro ao criar postagem", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        } else {
          toast.success("Postagem criada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
          setImages([])
          setImagesBase64([])
          refContent.current.value = ""
        }
      }


    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePostHandle = async () => {
    setIsLoadingDelete(true);
    try {

      const { error } = await deletePost(id!);

      if (error) {
        toast.error("Erro ao deletar postagem", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
      } else {
        toast.success("Postagem deletada com sucesso!", { style: { backgroundColor: "var(--background)", color: "var(--foreground)" } })
        setIsOpenModalDelete(false)
        setIsOpen()
      }

    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const addNewImage = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = String(reader.result);
        setImages((prev) => [...prev, base64.split(",")[1]]);
        setImagesBase64((prev) => [...prev, base64]);
      };
      reader.onerror = (err) => {
        console.error('Erro ao ler arquivo', err);
      };
      reader.readAsDataURL(file);
    });
  };

  function detectImageMime(base64: string): string | null {
    const firstBytes = atob(base64.slice(0, 20));

    const bytes = firstBytes
      .split("")
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");

    if (bytes.startsWith("ffd8ff")) return "image/jpeg";
    if (bytes.startsWith("89504e47")) return "image/png";
    if (bytes.startsWith("47494638")) return "image/gif";
    if (bytes.startsWith("424d")) return "image/bmp";
    if (bytes.startsWith("52494646")) return "image/webp";

    return null;
  }

  useEffect(() => {
    setImagesBase64([])
    image?.map(i => {
      if (!i.startsWith("data:")) {
        const mimeType = detectImageMime(i);
        console.log(`data:${mimeType || "image/png"};base64,${i}`)
        setImagesBase64(e => e && [...e, `data:${mimeType || "image/png"};base64,${i}`])
      }
    })
  }, [image])

  const removeImageAt = (index: number) => {
    setImagesBase64(prev => prev.filter((_, i) => i !== index));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={setIsOpen} />
        
        <div 
          className="relative p-6 bg-background rounded-xl shadow-2xl flex flex-col gap-5 w-full max-w-4xl" 
          onClick={(e) => e.stopPropagation()}
        >
          <MdClose 
            onClick={setIsOpen} 
            className="absolute right-4 top-4 cursor-pointer text-3xl text-foreground hover:text-red-500 transition" 
          />
          
          <h1 className='font-extrabold text-2xl border-b pb-2'>{update ? "Alterar Postagem" : "Criar Nova Postagem"}</h1>

          <div className="flex flex-col gap-2">
            <p className='text-sm font-medium text-gray-500'>Descrição da Postagem</p>
            <textarea
              className='bg-background-standard border border-background-contrast/50 rounded-xl p-3 scroll-style text-foreground focus:border-color-blue focus:ring-1 focus:ring-color-blue transition'
              style={{ width: '100%', height: '200px', maxHeight: '400px', resize: 'vertical' }}
              defaultValue={content}
              ref={refContent}
              placeholder="Adicione o conteúdo da sua postagem aqui..."
            />
          </div>

          <div className='flex justify-between items-end pt-2'>
            {imagesBase64.length > 0 && (
              <div
                className='flex cursor-pointer relative w-32 h-24 shadow-lg hover:opacity-90 transition duration-200'
                onClick={() => handleImageClick(0)}
              >
                <div className='absolute left-0 top-0 w-full h-full border-2 border-background-contrast rounded-lg overflow-hidden z-10'>
                  <img
                    src={imagesBase64[0]}
                    alt="Prévia da Imagem 1"
                    className="object-cover w-full h-full"
                  />
                </div>
                {imagesBase64.length > 1 && (
                  <div className='absolute left-3 top-3 w-full h-full border-2 border-background-contrast rounded-lg overflow-hidden opacity-80'>
                    <img
                      src={imagesBase64[1]}
                      alt="Prévia da Imagem 2"
                      className="object-cover w-full h-full"
                    />
                    {imagesBase64.length > 2 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl z-20">
                        +{imagesBase64.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className='flex justify-end gap-3'>
              {update && (
                <input 
                  type="button" 
                  value="Deletar" 
                  className='bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold shadow-md hover:bg-red-700 transition' 
                  onClick={() => setIsOpenModalDelete(true)} 
                />
              )}
              
              <label
                htmlFor="image-upload"
                className={`bg-green text-white w-fit px-4 py-2 rounded-lg cursor-pointer font-semibold shadow-md hover:bg-green/90 transition`}
              >
                Nova Imagem
              </label>
              
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  addNewImage(e.target.files);
                }}
                multiple
              />
              
              <div className='relative'>
                <input
                  type="button"
                  disabled={isLoading}
                  value={isLoading ? "" : `${update ? "Salvar Alterações" : "Criar Postagem"}`}
                  className={`
                    w-48 py-2 rounded-lg font-semibold transition duration-200 shadow-md
                    ${isLoading
                      ? 'bg-green cursor-not-allowed text-transparent'
                      : 'bg-green text-white cursor-pointer hover:bg-green/90'
                    }
                  `}
                  onClick={() => {
                    update ? patchPost(id!) : postPost()
                  }}
                />
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScaleLoader
                      color="white" 
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
        
        <DeleteModal 
          isLoading={isLoadingDelete} 
          isOpen={isOpenModalDelete} 
          onDelete={() => deletePostHandle()} 
          setIsOpen={() => setIsOpenModalDelete(false)} 
        />
      </div>

      {isImageGalleryOpen && imagesBase64.length > 0 && (
        <ImageGalleryModal
          images={imagesBase64}
          onClose={() => setIsImageGalleryOpen(false)}
          initialIndex={initialImageIndex}
          removeImage={removeImageAt}
        />
      )}
    </>
  )
}

export default PostModal