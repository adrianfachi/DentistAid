import * as Yup from "yup";

export const postValidateSchema = Yup.object().shape({
	content: Yup.string().required("Mensagem é obrigatória"),
});
