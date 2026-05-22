export const products = [
  // CROPTOPS (4 products)
  {
    id: 1,
    name: "Frankie Sheer Ribbed Croptop",
    price: 200,
    description: "Lightweight and breathable, this sheer ribbed croptop in a versatile nude shade is perfect for layering or wearing alone on warm Nairobi days.",
    images: [
      "https://i.imgur.com/yZtX8A6.png",
      "https://i.imgur.com/kreYLBi.png",
      "https://i.imgur.com/vIgGRjk.png",
      "https://i.imgur.com/tIXAqDb.png"
    ],
    variants: [
      { id: 'v1', size: 'S', color: 'Nude', stock: 15 },
      { id: 'v2', size: 'M', color: 'Nude', stock: 12 },
      { id: 'v3', size: 'L', color: 'Nude', stock: 8 },
    ],
    category: "Croptops",
    rating: 4.8
  },
  {
    id: 2,
    name: "Sage Linen Croptop",
    price: 200,
    description: "Breathable linen croptop in a beautiful sage green, featuring a tie-back detail.",
    images: [
      "https://i.imgur.com/OxvfOu5.png",
      "https://i.imgur.com/wFPXJrL.png",
      "https://i.imgur.com/3UnbFKw.png",
      "https://i.imgur.com/3s0nD45.png"
    ],
    variants: [
      { id: 'v4', size: 'XS', color: 'Sage', stock: 10 },
      { id: 'v5', size: 'S', color: 'Sage', stock: 14 },
    ],
    category: "Croptops",
    rating: 4.7
  },


  // LEATHER JACKETS (4 products)
  {
    id: 5,
    name: " Bomber jacket",
    price: 1500,
    description: "Classic black leather bomber jacket with a modern twist, featuring a slightly cropped fit and silver hardware.",
    images: [
      "https://i.imgur.com/SJo3XUm.png",
      "https://i.imgur.com/NGrZm70.png",
      "https://i.imgur.com/BA0PBCE.png"
    ],
    variants: [
      { id: 'v10', size: 'M', color: 'Black', stock: 5 },
      { id: 'v11', size: 'L', color: 'Black', stock: 3 },
      { id: 'v12', size: 'XL', color: 'Black', stock: 2 },
    ],
    category: "Leather Jackets",
    rating: 4.9
  },
  {
    id: 6,
    name: "Satin jacket",
    price: 1500,
    description: "Luxurious cognac leather jacket with a sleek, minimalist design and a soft satin lining for added comfort.",
    images: [
      "https://i.imgur.com/cVV3V4X.png",

      "https://i.imgur.com/B7jrzec.png",
      "https://i.imgur.com/rWTQIMd.png",
    ],
    variants: [
      { id: 'v13', size: 'S', color: 'Blue', stock: 4 },
      { id: 'v14', size: 'M', color: 'Blue', stock: 6 },
    ],
    category: "Leather Jackets",
    rating: 4.8
  },
  {
    id: 7,
    name: "PU leather coach ",
    price: 1500,
    description: "Edgy black PU leather coach jacket with a relaxed fit, snap button front, and contrast white stitching for a bold statement.",
    images: [
      "https://i.imgur.com/WHCPwKc.png",
      "https://i.imgur.com/CmRNeRP.png"
    ],
    variants: [
      { id: 'v15', size: 'M', color: 'Black', stock: 8 },
      { id: 'v16', size: 'L', color: 'Black', stock: 5 },
    ],
    category: "Leather Jackets",
    rating: 4.7
  },
  {
    id: 8,
    name: "Studio Tomboy faux ",
    price: 1500,
    description: "Trendy black faux leather bomber jacket with a slightly oversized fit, featuring ribbed cuffs and hem for a comfortable yet stylish look.",
    images: [
      "https://i.imgur.com/MJk9iql.png",
      "https://i.imgur.com/7iriyG4.png"
    ],
    variants: [
      { id: 'v17', size: 'S', color: 'Black', stock: 3 },
      { id: 'v18', size: 'M', color: 'Black', stock: 2 },
    ],
    category: "Leather Jackets",
    rating: 5.0
  },

  // LEATHER DRESS (4 products)
  {
    id: 9,
    name: "Sleek Leather Mini",
    price: 12500,
    description: "A daring leather mini dress with a form-fitting silhouette and a hidden back zip.",
    images: [
      "https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v19', size: 'XS', color: 'Black', stock: 7 },
      { id: 'v20', size: 'S', color: 'Black', stock: 5 },
    ],
    category: "Leather Dress",
    rating: 4.6
  },
  {
    id: 10,
    name: "Burgundy Wrap Dress",
    price: 15800,
    description: "Supple leather wrap dress in deep burgundy, featuring a waist-cinching tie and long sleeves.",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v21', size: 'M', color: 'Burgundy', stock: 3 },
      { id: 'v22', size: 'L', color: 'Burgundy', stock: 4 },
    ],
    category: "Leather Dress",
    rating: 4.9
  },
  {
    id: 11,
    name: "Onyx Bodycon Leather",
    price: 14200,
    description: "Sophisticated onyx black leather dress with an elegant midi length and side slit.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v23', size: 'S', color: 'Onyx Black', stock: 4 },
      { id: 'v24', size: 'M', color: 'Onyx Black', stock: 2 },
    ],
    category: "Leather Dress",
    rating: 4.8
  },
  {
    id: 12,
    name: "Sand Leather Slip",
    price: 11800,
    description: "Minimalist leather slip dress in a soft sand tone, featuring adjustable spaghetti straps.",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1515347619252-60a4bdad8886?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v25', size: 'S', color: 'Sand', stock: 5 },
      { id: 'v26', size: 'M', color: 'Sand', stock: 3 },
    ],
    category: "Leather Dress",
    rating: 4.7
  },

  // TROUSERS (4 products)
  {
    id: 13,
    name: "High-Waist Tailored Trousers",
    price: 6800,
    description: "Expertly tailored high-waist trousers in a premium wool blend, perfect for the office.",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v27', size: 'S', color: 'Charcoal', stock: 12 },
      { id: 'v28', size: 'M', color: 'Charcoal', stock: 15 },
    ],
    category: "Trousers",
    rating: 4.5
  },
  {
    id: 14,
    name: "Wide-Leg Linen Trousers",
    price: 5900,
    description: "Flowy wide-leg trousers in a breathable linen blend, ideal for warm Nairobi days.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v29', size: 'M', color: 'Oatmeal', stock: 10 },
      { id: 'v30', size: 'L', color: 'Oatmeal', stock: 8 },
    ],
    category: "Trousers",
    rating: 4.6
  },
  {
    id: 15,
    name: "Terracotta Palazzo Pants",
    price: 7200,
    description: "Bold terracotta palazzo pants with a dramatic wide leg and elasticated back waist.",
    images: [
      "https://images.unsplash.com/photo-1584305116359-198af01229c7?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v31', size: 'S', color: 'Terracotta', stock: 6 },
      { id: 'v32', size: 'M', color: 'Terracotta', stock: 4 },
    ],
    category: "Trousers",
    rating: 4.8
  },
  {
    id: 16,
    name: "Slim-Fit Forest Green Trousers",
    price: 6500,
    description: "Elegant slim-fit trousers in a deep forest green, featuring subtle side pockets.",
    images: [
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v33', size: 'M', color: 'Forest Green', stock: 7 },
      { id: 'v34', size: 'L', color: 'Forest Green', stock: 5 },
    ],
    category: "Trousers",
    rating: 4.7
  },

  // SWEATPANTS (4 products)
  {
    id: 17,
    name: "Cloud-Soft Joggers",
    price: 4500,
    description: "Ultra-soft cotton blend joggers with a fleece lining, perfect for lounging or travel.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v35', size: 'S', color: 'Heather Grey', stock: 20 },
      { id: 'v36', size: 'M', color: 'Heather Grey', stock: 18 },
    ],
    category: "Sweatpants",
    rating: 4.9
  },
  {
    id: 18,
    name: "Luxe Velvet Sweatpants",
    price: 5800,
    description: "Elevated sweatpants in a plush velvet fabric, featuring a gold-tipped drawstring.",
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v37', size: 'M', color: 'Navy Blue', stock: 12 },
      { id: 'v38', size: 'L', color: 'Navy Blue', stock: 10 },
    ],
    category: "Sweatpants",
    rating: 4.8
  },
  {
    id: 19,
    name: "Olive Cargo Sweatpants",
    price: 5200,
    description: "Functional cargo-style sweatpants with multiple pockets and a tapered fit.",
    images: [
      "https://images.unsplash.com/photo-1580906853203-f493cea9ff28?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v39', size: 'S', color: 'Olive', stock: 15 },
      { id: 'v40', size: 'M', color: 'Olive', stock: 14 },
    ],
    category: "Sweatpants",
    rating: 4.7
  },
  {
    id: 20,
    name: "Onyx Oversized Joggers",
    price: 4800,
    description: "Trendy oversized joggers in a heavy-weight cotton, featuring an elasticated ankle cuff.",
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60"
    ],
    variants: [
      { id: 'v41', size: 'L', color: 'Black', stock: 8 },
      { id: 'v42', size: 'XL', color: 'Black', stock: 6 },
    ],
    category: "Sweatpants",
    rating: 4.6
  }
];
