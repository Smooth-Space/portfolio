// Reusable mediaSlot projection. The image asset is NOT dereferenced —
// urlFor() builds URLs from the raw {asset._ref, hotspot, crop}. The video
// asset IS dereferenced to pull the flat playbackId/status the Mux input
// plugin exposes on its videoAsset document, plus its native aspect ratio
// (used by the feed's masonry layout to size tiles at native ratio).
export const mediaSlot = /* groq */ `{
  kind,
  alt,
  image,
  "video": video.asset->{playbackId, status, "aspectRatio": data.aspect_ratio}
}`

// Singleton, fixed document id (see sanity/structure.ts) — coalesce guards
// the nav/overlay against a missing document entirely, not just empty
// arrays within it.
export const siteSettingsQuery = /* groq */ `
*[_id == "siteSettings"][0]{
  "navLinks": coalesce(navLinks[]{_key, label, href}, []),
  "socials": coalesce(socials[]{_key, platform, url}, [])
}`

// Singleton, fixed document id (see sanity/structure.ts) — coalesce guards
// against a missing document entirely, not just empty arrays within it.
export const aboutPageQuery = /* groq */ `
*[_id == "aboutPage"][0]{
  bio,
  "experience": coalesce(experience, []),
  "appointments": coalesce(appointments, []),
  "speakingRecognition": coalesce(speakingRecognition, []),
  "services": coalesce(services, [])
}`

export const projectBySlugQuery = /* groq */ `
*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  intro,
  "services": services[_type == "reference"]->{_id, name},
  year,
  contentBlocks[]{
    _key,
    _type,
    _type == "textBlock" => {label, summary, body},
    _type == "imageWide" => {"media": media ${mediaSlot}},
    _type == "imageDouble" => {"first": first ${mediaSlot}, "second": second ${mediaSlot}},
    _type == "imageBento" => {
      tallColumn,
      "tallImage": tallImage ${mediaSlot},
      "stackedImageTop": stackedImageTop ${mediaSlot},
      "stackedImageBottom": stackedImageBottom ${mediaSlot}
    }
  },
  metadata{
    scope,
    credits[]{role, name},
    typography[]{name, url},
    recognition[]{name, url},
    website[]{label, url}
  }
}`

export const projectSlugsQuery = /* groq */ `
*[_type == "project" && defined(slug.current)]{"slug": slug.current}`

export const projectsIndexQuery = /* groq */ `
*[_type == "project" && defined(slug.current)] | order(orderRank asc){
  _id,
  title,
  "slug": slug.current,
  "services": services[_type == "reference"]->{_id, name},
  thumbnail ${mediaSlot}
}`

// Flattens every media slot (wide/double/bento, image or video) out of
// every project's contentBlocks into one flat array, in document order,
// each item tagged with its parent project's title/slug for click-through.
// coalesce(...,[]) matters: contentBlocks[] on a project with no
// contentBlocks field at all evaluates to null, and flattening a null
// contributes one null entry per such project instead of zero.
export const mediaFeedQuery = /* groq */ `
*[_type == "project" && defined(slug.current)] | order(orderRank asc) {
  "mediaItems": coalesce(contentBlocks, [])[]{
    "slots": select(
      _type == "imageWide" => [media],
      _type == "imageDouble" => [first, second],
      _type == "imageBento" => [tallImage, stackedImageTop, stackedImageBottom],
      []
    )
  }.slots[]{
    ...${mediaSlot},
    "projectTitle": ^.title,
    "projectSlug": ^.slug.current
  }
}.mediaItems[]`
