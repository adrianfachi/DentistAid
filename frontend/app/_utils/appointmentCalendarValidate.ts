import * as yup from "yup";

export const appointmentCalendarValidateSchema = yup.object().shape({
	patientId: yup
		.number()
		.typeError("Selecione um paciente válido.")
		.required("O paciente é obrigatório."),

	date: yup
		.string()
		.required("A data da consulta é obrigatória.")
		.test("is-valid-date", "Data inválida.", (value) => {
			if (!value) return false;
			const d = new Date(value);
			return !isNaN(d.getTime());
		}),

	startsAt: yup
		.string()
		.required("O horário de início é obrigatório.")
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido."),

	endsAt: yup
		.string()
		.required("O horário de término é obrigatório.")
		.matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido.")
		.test("is-after", "O final deve ser posterior ao início.", function (value) {
			const { startsAt } = this.parent;
			if (!value || !startsAt) return false;

			const [sh, sm] = startsAt.split(":").map(Number);
			const [eh, em] = value.split(":").map(Number);

			if (eh < sh) return false;
			if (eh === sh && em <= sm) return false;

			return true;
		}),

	name: yup.string().optional(),
});
