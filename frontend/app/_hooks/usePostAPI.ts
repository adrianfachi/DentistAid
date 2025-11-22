import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://localhost:5432";

const usePostAPI = () => {
	const [error, setError] = useState<string | null>(null);

	const createPost = async (patientId: number, body: newPostType) => {
		setError(null);

		try {
			const response = await axios.post(`${BASE_URL}/patients/${patientId}/posts`, body);

			if (!response) {
				throw new Error("Erro ao criar post");
			}

			const data = await response.data;

			return data;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	const updatePost = async (postId: string, body: newPostType) => {
		setError(null);

		try {
			const response = await axios.patch(`${BASE_URL}/posts/${postId}`, body);

			if (!response) {
				throw new Error("Erro ao alterar post");
			}

			const data = await response.data;
			return data;
		} catch (error: any) {
			setError(error.message);
			return null;
		}
	};

	return { error, createPost, updatePost };
};

export default usePostAPI;
