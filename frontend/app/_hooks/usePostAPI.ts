import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://localhost:5432";

const usePostAPI = () => {
	const createPost = async (patientId: number, body: newPostType) => {
		try {
			const response = await axios.post(`${BASE_URL}/posts/${patientId}`, body);

			return { data: response.data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	};

	const updatePost = async (postId: string, body: newPostType) => {
		try {
			const response = await axios.patch(`${BASE_URL}/posts/${postId}`, body);

			return { data: response.data, error: null };
		} catch (error: any) {
			return { data: null, error: error.message };
		}
	};

	return { createPost, updatePost };
};

export default usePostAPI;
