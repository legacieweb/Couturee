import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Products from './Products'

const Collection = ({ title, description, category }) => {
  // We can use the category prop to filter the products
  // or use the URL params if we want to make it dynamic
  return (
    <div className="collection-page">
      {/* We can add a special header here if needed for specific collections */}
      <div className="pt-40 pb-10 max-w-[1800px] mx-auto px-6 md:px-12 text-center">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent mb-6">{description || 'Exclusive Collection'}</p>
         <h1 className="text-6xl md:text-9xl font-black elegant-font tracking-tighter uppercase leading-none">{title}</h1>
      </div>
      
      {/* Reuse Products component with the specific category */}
      <div className="-mt-32">
        <Products forcedCategory={category} />
      </div>
    </div>
  )
}

export default Collection
