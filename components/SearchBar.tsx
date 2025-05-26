import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const SearchBar = () => {
  return (
      <div className="publicKeyContainer">
        <Input className="publicKeyInput" placeholder="Enter public key" />
        <Button className="publicKeyButton cursor-pointer">Search</Button>
      </div>
  )
}

export default SearchBar
