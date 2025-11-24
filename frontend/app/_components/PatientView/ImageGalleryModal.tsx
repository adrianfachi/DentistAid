'use client';

import { useEffect, useState } from "react";
import { MdClose, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoTrashBinOutline } from "react-icons/io5";
import DeleteModal from "../DeleteModal";

type Props = {
  images: string[];
  onClose: () => void;
  initialIndex: number;
  removeImage: (index: number) => void;
}

function ImageGalleryModal({ images, onClose, initialIndex, removeImage }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 select-none" onClick={onClose}>
      <MdClose className="absolute right-4 top-4 cursor-pointer text-4xl text-white" onClick={onClose} />
      <IoTrashBinOutline className="absolute top-4 p-3 left-4 text-red-800 text-5xl cursor-pointer bg-red-400 rounded-full" onClick={(e) => { e.stopPropagation(); setModalDeleteOpen(true) }} />
      <div className="relative h-4/5 w-4/5 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1} de ${images.length}`}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          className="rounded-lg"
        />
        {images.length > 1 && (
          <>
            <MdKeyboardArrowLeft
              className="absolute left-0 text-white text-5xl cursor-pointer bg-black bg-opacity-50 rounded-full"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            />
            <MdKeyboardArrowRight
              className="absolute right-0 text-white text-5xl cursor-pointer bg-black bg-opacity-50 rounded-full"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            />
          </>
        )}
      </div>
      <div className="absolute bottom-4 text-white text-lg">
        {currentIndex + 1} / {images.length}
      </div>
      <DeleteModal isOpen={modalDeleteOpen} setIsOpen={() => setModalDeleteOpen(false)} onDelete={() => removeImage(currentIndex)} isLoading={false} />
    </div>
  );
};

export default ImageGalleryModal;