import React from 'react'
import "./style.css"

function Button({text,onclick,blue,disable}) {
  return (
    <div className={blue?"btn btn-blue":"btn"} onClick={onclick} disable={disable}>
      {text}
    </div>
  )
}

export default Button