import React from 'react'
import Head from 'next/head'

interface MetaInfo {
  name: string
  content: string
}

interface SEOProps {
  title?: string
  description?: string
  author?: string
  image?: string
  meta?: MetaInfo[]
}

export default function SEO({
  title = 'ERA e-KYC',
  description = 'Digital customer onboarding solution',
  author = 'Team Tensor',
  image = 'https://www.erainfotechbd.com/cms_assets/ERA-Logo.png',
  meta = [],
}: SEOProps) {
  const metaData = [
    {
      name: `description`,
      content: description,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: description,
    },
    {
      name: 'og:image',
      content: image,
    },
    {
      name: 'og:image:type',
      content: 'image/png',
    },
    {
      name: 'og:image:width',
      content: 1024,
    },
    {
      name: 'og:image:height',
      content: 1024,
    },
  ].concat(meta)
  return (
    <Head>
      <title>{title}</title>
      {metaData.map(({ name, content }, i) => (
        <meta key={i} name={name} content={content.toString()} />
      ))}
    </Head>
  )
}
