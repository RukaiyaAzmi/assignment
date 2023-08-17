import React from 'react'

interface ImageGalleryProps {
  urls: string[]
}

export default function ImageGallery({ urls }: ImageGalleryProps): JSX.Element {
  const getImage = (mod) => {
    return urls.map((url, index) =>
      (index + 1) % 3 === mod ? (
        <img
          src={url}
          alt="image"
          loading="lazy"
          className="rounded-md transition ease-in-out duration-300 hover:scale-125 hover:shadow-md delay-250"
        />
      ) : (
        ''
      ),
    )
  }

  return (
    <div className="flex flex-col items-center md:flex-row md:gap-3 md:flex-nowrap md:m-10 md:items-start">
      <div className="flex flex-col gap-5 w-11/12 md:w-1/3 pt-5">{getImage(1)}</div>
      <div className="flex flex-col gap-5 w-11/12 md:w-1/3 pt-5">{getImage(2)}</div>
      <div className="flex flex-col gap-5 w-11/12 md:w-1/3 pt-5">{getImage(0)}</div>
    </div>
  )
}

/**
 * Implementation with Grid
 */

// export default function ImageGallery(): JSX.Element {
//   return (
//     <div className=" grid grid-cols-fluid gap-1 grid-flow-dense">
//       <img src="/img/lalbagh-ford.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//       <img src="/img/hatirjheel.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//       <img src="/img/apartments.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />

//       <img src="/img/residential.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//       <img
//         src="/img/login-room.jpg"
//         alt="image"
//         loading="lazy"
//         className="w-full h-full object-cover col-span-2 row-span-2"
//       />
//       <img src="/img/residential.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />

//       <img src="/img/house.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//       <img src="/img/test.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//       <img src="/img/lalbagh-ford.jpg" alt="image" loading="lazy" className="w-full h-full object-cover" />
//     </div>
//   )
// }
