import React from 'react'
import {useLocation} from "react-router-dom"
import closeArrowIcon from "../assets/close_arrow.svg"

const MenuItem = () => {
  const location = useLocation();
  const {menuItem} = location.state || {};

  return (
    <div>
      <div>
        <div>Add New Category</div>
        <div><img src={closeArrowIcon} alt="" /></div>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default MenuItem