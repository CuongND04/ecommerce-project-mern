import React from 'react'
import { useParams } from 'react-router-dom' // Lấy tất cả các parameter trên router
const DetailProduct = () => {
  const { pid, title } = useParams()
  console.log({ pid, title })
  return (
    <div>DetailProduct</div>
  )
}

export default DetailProduct