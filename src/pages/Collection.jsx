import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Products from './Products'

const Collection = ({ title, description, category }) => {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get('category')
    setActiveCategory(categoryParam || category || null)
  }, [location, category])

  return (
    <div className="collection-page min-h-screen bg-white pt-40">
      <Products forcedCategory={activeCategory || category} showCollectionsNav={!category} />
    </div>
  )
}

export default Collection
