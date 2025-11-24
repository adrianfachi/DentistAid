'use client';
import { useState } from "react"

type Props = {
  id: string
  label?: string
  placeHolder: string
  type: string
  initialValue?: string
  editable?: boolean
  onChange?: (e: any) => void;
  isTimeInput?: boolean;
  typeMask?: string
  className?: string
  error?: string
}

function FormInput({ id, label, placeHolder, type, initialValue, editable = true, onChange, isTimeInput = false, typeMask, className, error }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(initialValue || "")

  const inputType = isTimeInput && isFocused ? typeMask : type;

  return (
    <div className={`flex flex-col gap-0.5 ${!editable && "text-gray"}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        placeholder={placeHolder}
        type={inputType}
        onFocus={() => isTimeInput && setIsFocused(true)}
        onBlur={() => isTimeInput && setIsFocused(false)}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e);
          setValue(e.target.value);
        }}
        readOnly={!editable}
        className={`border border-background-contrast p-2 rounded-md bg-transparent ${className}`}
      />
      {error && <div className="text-red-500 text-[.7rem]">{error}</div>}
    </div>
  )
}

export default FormInput;