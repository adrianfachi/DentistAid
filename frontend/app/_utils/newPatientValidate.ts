import * as yup from "yup";

const dateRegexDDMMYYYY = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const dateRegexYYYYMMDD = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

export const patientValidateSchema = yup.object().shape({
	name: yup.string().required("O nome completo é obrigatório."),
	birthDate: yup
		.string()
		.required("A data de nascimento é obrigatória.")
		.test("is-valid-format", "Data de nascimento inválida.", function (value) {
			if (!value) return false;
			const isDDMMYYYY = dateRegexDDMMYYYY.test(value);
			const isYYYYMMDD = dateRegexYYYYMMDD.test(value);

			if (!isDDMMYYYY && !isYYYYMMDD) {
				return this.createError({ message: "Data inválida. Use DD/MM/AAAA ou AAAA-MM-DD." });
			}

			let day: number, month: number, year: number;

			if (isDDMMYYYY) {
				[day, month, year] = value.split("/").map(Number);
			} else {
				[year, month, day] = value.split("-").map(Number);
			}

			const date = new Date(year, month - 1, day);
			const isValidDate =
				date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

			if (!isValidDate) {
				return this.createError({ message: "Data inválida." });
			}

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (date > today) {
				return this.createError({ message: "Data de nascimento não pode ser futura." });
			}

			const minDate = new Date();
			minDate.setFullYear(minDate.getFullYear() - 150);
			if (date < minDate) {
				return this.createError({ message: "Data de nascimento inválida." });
			}

			return true;
		}),
	telephone: yup
		.string()
		.matches(/^\+?\d{13}$/, "Telefone inválido. Use o formato +5511987654321")
		.required("O telefone é obrigatório."),
	email: yup
		.string()
		.required("Email obrigatório")
		.email("Email inválido")
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email inválido"),
	cpf: yup
		.string()
		.matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido.")
		.required("O CPF é obrigatório."),
	occupation: yup.string().required("A ocupação é obrigatória."),
	origin: yup.string().required("A origem é obrigatória."),
	recurrence: yup.string().required("A recorrência é obrigatória."),
});
