import {urlFor} from '@/sanity/lib/image'
import type {SanityImageSource} from '@/sanity/lib/types'

const WIDTHS = [640, 960, 1280, 1600, 2000]

interface SanityImageProps {
  image: SanityImageSource
  alt: string
  ratio: [number, number]
  sizes: string
  priority?: boolean
}

// Hotspot-aware, responsive srcSet. Passing both width and height bakes in
// Sanity's crop/hotspot params, so every candidate exactly fills `ratio`.
export function SanityImage({image, alt, ratio, sizes, priority}: SanityImageProps) {
  const [ratioW, ratioH] = ratio
  const urlAt = (width: number) =>
    urlFor(image)
      .width(width)
      .height(Math.round((width * ratioH) / ratioW))
      .fit('crop')
      .auto('format')
      .url()

  const srcSet = WIDTHS.map((width) => `${urlAt(width)} ${width}w`).join(', ')

  return (
    <img
      src={urlAt(WIDTHS[Math.floor(WIDTHS.length / 2)])}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  )
}
