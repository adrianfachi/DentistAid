type Props = {
  id: string
  label: string
  placeHolder: string
  type: string
}

function FormInput({ id, label, placeHolder, type }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={placeHolder}
        id={id}
        className="border p-1 rounded-md border-background-contrast"
      />
    </div>
  )
}

export default FormInput;