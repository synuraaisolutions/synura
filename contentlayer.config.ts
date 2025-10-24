import { defineDocumentType, makeSource } from 'contentlayer/source-files'

// Service Pages
export const Service = defineDocumentType(() => ({
  name: 'Service',
  filePathPattern: `services/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the service',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The slug for the service URL',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The service description for SEO',
      required: true,
    },
    category: {
      type: 'enum',
      options: ['ai-workforce', 'automation', 'consulting', 'managed-ops'],
      description: 'Service category',
      required: true,
    },
    featured: {
      type: 'boolean',
      description: 'Whether this service is featured',
      default: false,
    },
    icon: {
      type: 'string',
      description: 'Icon name for the service',
      required: false,
    },
    benefits: {
      type: 'list',
      of: { type: 'string' },
      description: 'List of key benefits',
      required: false,
    },
    outcomes: {
      type: 'list',
      of: { type: 'string' },
      description: 'Expected outcomes',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (service) => `/services/${service.slug}`,
    },
  },
}))

// FAQ Pages
export const FAQ = defineDocumentType(() => ({
  name: 'FAQ',
  filePathPattern: `faqs/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the FAQ section',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The slug for the FAQ URL',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The FAQ section description',
      required: true,
    },
    category: {
      type: 'enum',
      options: ['general', 'pricing-billing', 'technical', 'services'],
      description: 'FAQ category',
      required: true,
    },
    order: {
      type: 'number',
      description: 'Display order',
      default: 0,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (faq) => `/faqs/${faq.slug}`,
    },
  },
}))

// Case Studies
export const CaseStudy = defineDocumentType(() => ({
  name: 'CaseStudy',
  filePathPattern: `case-studies/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the case study',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The slug for the case study URL',
      required: true,
    },
    description: {
      type: 'string',
      description: 'Case study description for SEO',
      required: true,
    },
    client: {
      type: 'string',
      description: 'Client name (can be anonymized)',
      required: true,
    },
    industry: {
      type: 'string',
      description: 'Client industry',
      required: true,
    },
    challenge: {
      type: 'string',
      description: 'Main challenge faced',
      required: true,
    },
    solution: {
      type: 'string',
      description: 'Solution provided',
      required: true,
    },
    results: {
      type: 'list',
      of: { type: 'string' },
      description: 'Key results achieved',
      required: true,
    },
    services: {
      type: 'list',
      of: { type: 'string' },
      description: 'Services used in this case study',
      required: true,
    },
    featured: {
      type: 'boolean',
      description: 'Whether this case study is featured',
      default: false,
    },
    publishedAt: {
      type: 'date',
      description: 'Publication date',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (caseStudy) => `/case-studies/${caseStudy.slug}`,
    },
  },
}))

// Blog Posts
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the blog post',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The slug for the blog post URL',
      required: true,
    },
    description: {
      type: 'string',
      description: 'Post description for SEO',
      required: true,
    },
    author: {
      type: 'string',
      description: 'Post author',
      default: 'Synura Team',
    },
    publishedAt: {
      type: 'date',
      description: 'Publication date',
      required: true,
    },
    updatedAt: {
      type: 'date',
      description: 'Last updated date',
      required: false,
    },
    category: {
      type: 'enum',
      options: ['ai-insights', 'automation', 'case-study', 'industry-trends', 'how-to'],
      description: 'Post category',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Post tags',
      required: false,
    },
    featured: {
      type: 'boolean',
      description: 'Whether this post is featured',
      default: false,
    },
    image: {
      type: 'string',
      description: 'Featured image URL',
      required: false,
    },
    readingTime: {
      type: 'number',
      description: 'Estimated reading time in minutes',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post.slug}`,
    },
  },
}))

// Pricing Page
export const Pricing = defineDocumentType(() => ({
  name: 'Pricing',
  filePathPattern: `pricing.mdx`,
  contentType: 'mdx',
  isSingleton: true,
  fields: {
    title: {
      type: 'string',
      description: 'Page title',
      default: 'Pricing',
    },
    description: {
      type: 'string',
      description: 'Page description',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: () => '/pricing',
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Service, FAQ, CaseStudy, Post, Pricing],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})