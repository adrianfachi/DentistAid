type Props = {
  id: string
  label: string
  placeHolder: string
  type: string
  value?: string
  editable?: boolean
}

function FormInput({ id, label, placeHolder, type, value, editable = true }: Props) {
  return (
    <div className={`flex flex-col gap-0.5 ${!editable && "text-gray"}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={placeHolder}
        id={id}
        defaultValue={value}
        readOnly={!editable}
        className="border p-1 rounded-md border-background-contrast"
      />
    </div>
  )
}

export default FormInput;