import type {PortableTextBlock} from '@portabletext/react'

export interface SanityImageSource {
  [key: string]: unknown
  _type: 'image'
  asset: {_ref: string; _type: 'reference'}
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export interface MuxVideoData {
  playbackId?: string
  status?: string
  /** e.g. "16:9" — the asset's native ratio, from Mux's own metadata. */
  aspectRatio?: string
}

export interface MediaSlotData {
  kind: 'image' | 'video'
  alt: string
  image?: SanityImageSource
  video?: MuxVideoData | null
}

interface BaseBlock {
  _key: string
}

export interface TextBlockData extends BaseBlock {
  _type: 'textBlock'
  label: string
  summary: string
  body?: PortableTextBlock[]
}

export interface ImageWideData extends BaseBlock {
  _type: 'imageWide'
  media: MediaSlotData
}

export interface ImageDoubleData extends BaseBlock {
  _type: 'imageDouble'
  first: MediaSlotData
  second: MediaSlotData
}

export interface ImageBentoData extends BaseBlock {
  _type: 'imageBento'
  tallColumn: 'left' | 'right'
  tallImage: MediaSlotData
  stackedImageTop: MediaSlotData
  stackedImageBottom: MediaSlotData
}

export type ContentBlock = TextBlockData | ImageWideData | ImageDoubleData | ImageBentoData

export interface ServiceRef {
  _id: string
  name: string
}

export interface CreditItem {
  role: string
  name: string
}

export interface NamedLinkItem {
  name: string
  url?: string
}

export interface WebsiteLinkItem {
  label: string
  url: string
}

export interface ProjectMetadata {
  scope?: string[]
  credits?: CreditItem[]
  typography?: NamedLinkItem[]
  recognition?: NamedLinkItem[]
  website?: WebsiteLinkItem[]
}

export interface Project {
  _id: string
  title: string
  slug: string
  intro: string
  services?: ServiceRef[]
  year?: string
  contentBlocks?: ContentBlock[]
  metadata?: ProjectMetadata
}

export interface ProjectListItem {
  _id: string
  title: string
  slug: string
  services?: ServiceRef[]
  thumbnail: MediaSlotData
}

// One flattened media slot from any project's contentBlocks, tagged with
// its parent project for click-through. `key` is assigned client-side
// after fetch (see sanity/lib/media-feed.ts) — GROQ's flatten loses any
// per-item positional key, so it's rebuilt from fetch-order index, which
// is stable for a given query result.
export interface MediaFeedItem {
  key: string
  media: MediaSlotData
  projectTitle: string
  projectSlug: string
}

export interface NavLink {
  _key: string
  label: string
  href: string
}

export interface SocialLink {
  _key: string
  platform: string
  url: string
}

export interface SiteSettings {
  navLinks: NavLink[]
  socials: SocialLink[]
}

export interface AboutPage {
  bio?: string
  experience: string[]
  appointments: string[]
  speakingRecognition: string[]
  services: string[]
}
