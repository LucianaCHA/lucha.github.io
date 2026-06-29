import { z } from 'astro/zod';

export function createBlogSchema({ image }: { image: () => ReturnType<typeof z.optional> extends never ? never : unknown }) {
  return z.object({
    lang: z.enum(['en', 'es']),
    postSlug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use kebab-case (lowercase words separated by hyphens).'),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.optional(image()),
    heroImageCaption: z.string().optional(),
  });
}