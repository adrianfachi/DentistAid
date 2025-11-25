'use client';

import React, { useState } from 'react'
import PostModal from './PostModal';

type Props = {
  posts: postType[];
}

function PatientPosts({ posts }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<postType | null>(null);

  const handleEditClick = (post: postType) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedPost(null); 
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className='w-full p-4 bg-background rounded-xl shadow-lg border border-background-contrast/50'>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-foreground">Postagens</h3>
      </div>
      
      {posts && posts.length !== 0 ? (
        <div className='py-1 overflow-auto scroll-style' style={{ maxHeight: '300px' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="sticky top-0 bg-background-standard/95 border-b border-background-contrast text-left text-gray text-sm uppercase">
                <th className="w-2/3 py-2 px-3 font-medium">Conteúdo</th>
                <th className="w-1/6 py-2 px-1 font-medium text-center whitespace-nowrap">Criação</th>
                <th className="w-1/6 py-2 px-1 font-medium text-center whitespace-nowrap">Última Edição</th>
              </tr>
            </thead>
            <tbody>
              {posts
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((post) => (
                  <tr 
                    key={post.postId} 
                    className="border-t border-background-contrast cursor-pointer transition duration-100 hover:bg-background-contrast/50" 
                    onClick={() => handleEditClick(post)}
                  >
                    <td className="py-3 px-3">
                      <p className="text-sm text-foreground break-all">
                        {post.content ? (
                          <>
                            {post.content.substring(0, 100)}
                            {post.content.length > 100 && "..."}
                          </>
                        ) : (
                          <span className="italic text-gray">Sem conteúdo</span>
                        )}
                      </p>
                    </td>
                    <td className="py-3 text-sm text-center text-gray whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("pt-br")}
                    </td>
                    <td className="py-3 text-sm text-center text-gray whitespace-nowrap">
                      {new Date(post.updatedAt).toLocaleDateString("pt-br")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray/50 rounded-lg">
          <p className="text-gray italic">Nenhuma postagem encontrada.</p>
        </div>
      )}
      
      <PostModal 
        isOpen={isModalOpen} 
        setIsOpen={closeModal} 
        content={selectedPost?.content} 
        image={selectedPost?.image} 
        update={!!selectedPost}
        id={selectedPost?.postId}
      />
    </div>
  )
}

export default PatientPosts