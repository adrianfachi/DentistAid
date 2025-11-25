import axios from "axios";

const BASE_URL = "http://localhost:5432";

const usePostAPI = () => {
  const formatAxiosError = (error: any) => {
    const serverMessage = (error as any)?.response?.data?.message;
    return serverMessage || (error as Error).message;
  };

  const createPost = async (patientId: number, body: newPostType) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts/${patientId}`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const updatePost = async (postId: string, body: newPostType) => {
    try {
      const response = await axios.patch(`${BASE_URL}/posts/${postId}`, body);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/posts/${postId}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = formatAxiosError(error);
      return { data: null, error: errorMessage };
    }
  };

  return { createPost, updatePost, deletePost };
};

export default usePostAPI;