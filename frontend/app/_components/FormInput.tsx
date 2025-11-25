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
    <div className={`flex flex-col gap-1 w-full ${!editable ? "text-gray-500" : "text-foreground"}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium"
        >
          {label}
        </label>
      )}
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
        className={`
          w-full py-2 px-3 rounded-lg text-sm transition duration-150
          ${!editable
            ? 'bg-background-contrast/50 border border-transparent cursor-default'
            : 'bg-background-standard border border-background-contrast focus:ring-1 focus:ring-color-blue'
          }
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}

export default FormInput;