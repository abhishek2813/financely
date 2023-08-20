import React from 'react'
import "./style.css"

function Input({label,state,placeholder,setState,type}) {
  return (
    <div>
        <p className="label">{label}</p>
        <input type={type}
        placeholder={placeholder}
        value={state}
        onChange={(e)=>setState(e.target.value)}
        className="custom-input"
        />
    </div>
  )
}

export default Input