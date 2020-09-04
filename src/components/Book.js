import React from 'react'

const Book = (props) => {
  return (
    <div>
      {props.id} {props.title} {props.authors}
    </div>

  )
}
//{props.title} {props.authors} <button onClick={props.onClick} >{props.text}</button>
export default Book