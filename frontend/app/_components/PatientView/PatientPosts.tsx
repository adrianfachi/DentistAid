'use client';

import React, { useState } from 'react'
import PostModal from './PostModal';

type Props = {
  posts: postType[] | undefined;
}

function PatientPosts({ posts }: Props) {
  const [updatePostModal, setUpdatePostModal] = useState<boolean>(false)
  const [postUpdate, setPostUpdate] = useState<postType>();
  return (
    <div className='w-full'>
      <h3 className="text-lg font-semibold mb-3">Postagens</h3>
      {posts && posts.length !== 0 ? (
        <div className='flex gap-4 flex-col py-5 px-2 shadow-blue-soft rounded-xl min-w-fit scroll-style overflow-auto' style={{ height: '300px' }}>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-2/3 pb-2 flex">Conteúdo</th>
                <th className="w-1/6 pb-2">Data de criação</th>
                <th className="w-1/6 pb-2">Última edição</th>
              </tr>
            </thead>
            <tbody>
              {posts
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((post, index) => (
                  <tr key={index} className="border-t border-gray-200 cursor-pointer" onClick={() => {
                    setUpdatePostModal(true)
                    setPostUpdate(post)
                  }}
                  >
                    <td className="py-2 pr-2">
                      <p className="text-sm break-all">
                        {post.content?.substring(0, 120)}
                        {post.content && post.content.length > 120 && "..."}
                      </p>
                    </td>
                    <td className="py-2 text-sm text-center">
                      {post.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-2 text-sm text-center">
                      {post.updatedAt ? post.updatedAt.toLocaleDateString() : "- - -"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PostModal isOpen={updatePostModal} setIsOpen={() => setUpdatePostModal(false)} content={postUpdate?.content} image={postUpdate?.image} update={true} id={postUpdate?.postId} />
        </div>
      ) : (
        <p>Nenhuma postagem encontrada</p>
      )}
    </div>
  )
}

export default PatientPosts