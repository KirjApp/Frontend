import React from 'react'
import Input from './Input'

const Filter = (props) => {
  return (
    <div>
      <Input text={props.text} value={props.value} onChange={props.onChange} />
    </div>
  )
}

export default Filter