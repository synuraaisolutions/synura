'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'

const components = {
  // Custom components that can be used in MDX files
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Link,

  // Override default HTML elements with custom styling
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4"
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4"
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mb-3"
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6 mb-4"
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className="mb-1" {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 border-primary-200 pl-6 italic text-secondary-600"
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-secondary-200" {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-secondary-200 even:bg-secondary-50" {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-secondary-200 px-4 py-2 text-left font-bold bg-secondary-100"
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-secondary-200 px-4 py-2 text-left" {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded bg-secondary-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-secondary-900"
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-secondary-900 p-4"
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium text-primary-600 underline underline-offset-4 hover:text-primary-800"
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-secondary-900" {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-secondary-200" {...props} />,
}

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx-content">
      <Component components={components} />
    </div>
  )
}