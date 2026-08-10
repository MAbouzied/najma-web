import { defineField, defineType } from 'sanity';

export const blogSeo = defineType({
  name: 'blogSeo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image (1200×630)',
      type: 'blogImage',
      description: 'Optional Open Graph image. Rendered as a fixed 1200×630 JPEG for social shares.',
    }),
  ],
});
