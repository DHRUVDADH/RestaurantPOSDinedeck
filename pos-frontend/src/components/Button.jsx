import React from 'react'


// props : name (button name) , mode : (pink bg or original bg)
const Button = ({name,mode}) => {
  return (
    <button className={`${mode == true ? 'bg-custom-pink px-4 py-2 text-black rounded-lg' : 'px-4 py-2 rounded-lg'}`}>{name}</button>
  )
}

export default Button