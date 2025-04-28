
import { WatchProduct } from './types';

export const sampleWatches: WatchProduct[] = [
  {
    id: "1",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13150,
    description: "The Rolex Submariner Date in Oystersteel with a rotatable bezel, black dial and Oyster bracelet. The Submariner's design has been carefully refined to optimize functionality and improve readability. This iconic timepiece has been a favorite among divers and watch enthusiasts alike since its introduction in 1953.",
    shortDescription: "The epitome of diving watches, featuring the finest craftsmanship.",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1180&auto=format&fit=crop"
    ],
    featured: true,
    specifications: {
      reference: "126610LN",
      caseMaterial: "Stainless Steel",
      caseDiameter: "41 mm",
      movement: "Perpetual, mechanical, self-winding, Calibre 3235",
      powerReserve: "70 hours",
      waterResistance: "300 metres / 1,000 feet",
      crystal: "Scratch-resistant sapphire",
      dialColor: "Black",
      strapMaterial: "Stainless Steel",
      functions: ["Hours", "Minutes", "Seconds", "Date", "Unidirectional rotatable bezel"]
    },
    style: ["Dive", "Sports"]
  },
  {
    id: "2",
    name: "Nautilus",
    brand: "Patek Philippe",
    price: 35000,
    description: "The Patek Philippe Nautilus is the embodiment of elegant sports watches with its unique porthole-inspired design. Created by the legendary watch designer Gérald Genta, its horizontally embossed dial, integrated bracelet, and blend of polished and satin-brushed finishes make it one of the most sought-after timepieces in the world.",
    shortDescription: "The iconic luxury sports watch with distinctive porthole design.",
    images: [
      "https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1655884125347-e09bbfed9019?q=80&w=1180&auto=format&fit=crop"
    ],
    featured: true,
    specifications: {
      reference: "5711/1A-010",
      caseMaterial: "Stainless Steel",
      caseDiameter: "40 mm",
      movement: "Self-winding mechanical, Caliber 26‑330 S C",
      powerReserve: "45 hours",
      waterResistance: "120 metres / 394 feet",
      crystal: "Scratch-resistant sapphire",
      dialColor: "Blue",
      strapMaterial: "Stainless Steel",
      functions: ["Hours", "Minutes", "Seconds", "Date"]
    },
    style: ["Dress", "Sports"]
  },
  {
    id: "3",
    name: "Royal Oak",
    brand: "Audemars Piguet",
    price: 29500,
    description: "The Audemars Piguet Royal Oak is a masterpiece of haute horlogerie that revolutionized the luxury watch industry. When introduced in 1972, its steel case, octagonal bezel with exposed screws, and integrated bracelet broke all the rules of luxury watchmaking. Today, it remains an icon of innovative design and exceptional craftsmanship.",
    shortDescription: "Revolutionary luxury sports watch with distinctive octagonal bezel.",
    images: [
      "https://images.unsplash.com/photo-1623998021459-96887b440be6?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622835413985-179b440302dc?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635399860495-2a187fd7ecc1?q=80&w=1180&auto=format&fit=crop"
    ],
    featured: true,
    specifications: {
      reference: "15202ST.OO.1240ST.01",
      caseMaterial: "Stainless Steel",
      caseDiameter: "39 mm",
      movement: "Self-winding manufacture Calibre 2121",
      powerReserve: "40 hours",
      waterResistance: "50 metres / 165 feet",
      crystal: "Glareproofed sapphire crystal",
      dialColor: "Blue",
      strapMaterial: "Stainless Steel",
      functions: ["Hours", "Minutes", "Date"]
    },
    style: ["Dress", "Sports"]
  },
  {
    id: "4",
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 6400,
    discountPrice: 5900,
    description: "The Omega Speedmaster Professional, also known as the 'Moonwatch', is a true piece of space history. Originally introduced in 1957 as a racing chronograph, it gained immortal fame as the first watch worn on the moon during the Apollo 11 mission in 1969. Its robust construction, precise chronograph function, and timeless design have made it an enduring icon.",
    shortDescription: "The legendary Moonwatch worn by Apollo astronauts.",
    images: [
      "https://images.unsplash.com/photo-1614946973939-1ab35362d7db?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614947759258-98822af50182?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1638599585712-698d89e0bde3?q=80&w=1180&auto=format&fit=crop"
    ],
    bestseller: true,
    specifications: {
      reference: "310.30.42.50.01.001",
      caseMaterial: "Stainless Steel",
      caseDiameter: "42 mm",
      movement: "Mechanical chronograph, Calibre 3861",
      powerReserve: "50 hours",
      waterResistance: "50 metres / 167 feet",
      crystal: "Hesalite",
      dialColor: "Black",
      strapMaterial: "Stainless Steel",
      functions: ["Hours", "Minutes", "Small seconds", "Chronograph", "Tachymeter"]
    },
    style: ["Chronograph", "Sports"]
  },
  {
    id: "5",
    name: "Santos de Cartier",
    brand: "Cartier",
    price: 7050,
    description: "The Santos de Cartier was one of the world's first wristwatches, created in 1904 for the Brazilian aviator Alberto Santos-Dumont. Its distinctive square case and exposed screws have made it an enduring icon of sophisticated style. The modern interpretation maintains the timepiece's pioneering spirit while incorporating contemporary refinements.",
    shortDescription: "The iconic square watch designed for an aviation pioneer.",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1648924264708-64621b18756e?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598532213919-078e54dd1e36?q=80&w=1180&auto=format&fit=crop"
    ],
    newArrival: true,
    specifications: {
      reference: "WSSA0018",
      caseMaterial: "Stainless Steel",
      caseDiameter: "39.8 mm",
      movement: "Automatic mechanical, Calibre 1847 MC",
      powerReserve: "42 hours",
      waterResistance: "100 metres / 328 feet",
      crystal: "Sapphire",
      dialColor: "Silver",
      strapMaterial: "Stainless Steel",
      functions: ["Hours", "Minutes", "Seconds", "Date"]
    },
    style: ["Dress", "Pilot"]
  },
  {
    id: "6",
    name: "Navitimer B01 Chronograph",
    brand: "Breitling",
    price: 9250,
    description: "The Breitling Navitimer is an aviation icon that has been trusted by pilots since 1952. With its circular slide rule, chronograph functions, and highly legible dial, it became an essential tool for flight calculations. The modern B01 variant features Breitling's in-house chronograph movement while maintaining the distinctive design that has made it instantly recognizable for generations.",
    shortDescription: "The pilot's watch with integrated flight computer.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613759612065-d5971d43e7aa?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602093793633-01e30f4e4083?q=80&w=1180&auto=format&fit=crop"
    ],
    specifications: {
      reference: "AB0127211B1P1",
      caseMaterial: "Stainless Steel",
      caseDiameter: "43 mm",
      movement: "Self-winding mechanical, Breitling Manufacture Calibre 01",
      powerReserve: "70 hours",
      waterResistance: "30 metres / 100 feet",
      crystal: "Cambered sapphire, glareproofed both sides",
      dialColor: "Black",
      strapMaterial: "Leather",
      functions: ["Hours", "Minutes", "Seconds", "Chronograph", "Date", "Slide rule"]
    },
    style: ["Pilot", "Chronograph"]
  },
  {
    id: "7",
    name: "Big Bang Unico",
    brand: "Hublot",
    price: 21700,
    discountPrice: 19500,
    description: "The Hublot Big Bang Unico embodies the brand's 'Art of Fusion' philosophy, combining innovative materials with distinctive design. Its skeletonized dial reveals the in-house Unico chronograph movement, while the signature porthole-shaped case and H-shaped screws create an unmistakable presence on the wrist.",
    shortDescription: "Bold, innovative chronograph with in-house movement.",
    images: [
      "https://images.unsplash.com/photo-1609587312208-cea54be969e7?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630412044688-4602199f8509?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589805173168-d2e5bcc467ca?q=80&w=1180&auto=format&fit=crop"
    ],
    specifications: {
      reference: "411.NX.1170.RX",
      caseMaterial: "Titanium",
      caseDiameter: "45 mm",
      movement: "Self-winding Unico manufacture Calibre HUB1280",
      powerReserve: "72 hours",
      waterResistance: "100 metres / 330 feet",
      crystal: "Sapphire with anti-reflective treatment",
      dialColor: "Skeleton",
      strapMaterial: "Titanium",
      functions: ["Hours", "Minutes", "Seconds", "Flyback chronograph", "Date"]
    },
    style: ["Skeleton", "Chronograph", "Sports"]
  },
  {
    id: "8",
    name: "Portugieser Chronograph",
    brand: "IWC Schaffhausen",
    price: 8100,
    description: "The IWC Portugieser Chronograph is a masterpiece of clarity and elegance. Its clean dial design, applied Arabic numerals, and slim bezel create a timepiece that is both sophisticated and versatile. The chronograph function is subtly integrated into the harmonious design, making it one of the most beautiful chronographs in the world of luxury watches.",
    shortDescription: "Elegant chronograph with clean, timeless design.",
    images: [
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630412045169-39332575d95c?q=80&w=1180&auto=format&fit=crop"
    ],
    bestseller: true,
    specifications: {
      reference: "IW371616",
      caseMaterial: "Stainless Steel",
      caseDiameter: "41 mm",
      movement: "Self-winding, IWC manufacture Calibre 69355",
      powerReserve: "46 hours",
      waterResistance: "30 metres / 100 feet",
      crystal: "Sapphire, convex, anti-reflective coating on both sides",
      dialColor: "Blue",
      strapMaterial: "Leather",
      functions: ["Hours", "Minutes", "Small seconds", "Chronograph"]
    },
    style: ["Dress", "Chronograph"]
  }
];
