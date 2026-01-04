export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  dateValue: Date;
  readTime: string;
  content: string; // Markdown content
  tags?: string[];
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Colorful Yarn Collection for Spring Projects",
    slug: "colorful-yarn-collection-spring-projects",
    excerpt: "Discover the most vibrant and soft yarn collections perfect for your spring knitting projects. From pastel shades to bold hues, find inspiration for your next creation.",
    image: "https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "December 28, 2025",
    dateValue: new Date("2025-12-28T10:00:00Z"),
    readTime: "5 min read",
    tags: ["yarn", "spring", "knitting", "colors"],
    content: `Spring is the perfect time to refresh your knitting projects with vibrant, colorful yarns. As the days get longer and nature bursts into bloom, your knitting can reflect this beautiful transformation. In this guide, we'll explore some of the most stunning yarn collections that will bring your spring projects to life.

When selecting yarns for spring projects, consider both the color palette and the fiber content. Lightweight yarns in breathable materials like cotton, bamboo, and linen are ideal for warmer weather garments. These fibers not only feel comfortable against the skin but also come in an array of beautiful pastel and bright colors.

![Beautiful yarn selection for spring projects](https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=1200)

Pastel shades are particularly popular for spring knitting. Think soft pinks, baby blues, mint greens, and lavender hues. These colors evoke the gentle beauty of spring flowers and create a sense of tranquility in your finished pieces. Whether you're knitting a lightweight cardigan, a delicate shawl, or a cozy baby blanket, pastels add a touch of elegance.

For those who prefer bolder statements, vibrant jewel tones can also work beautifully in spring projects. Rich emerald greens, sapphire blues, and amethyst purples create striking contrast against the lighter backdrop of the season. These colors are perfect for accessories like scarves, hats, and bags that can add a pop of color to any outfit.

![Colorful yarn balls ready for your next project](https://images.unsplash.com/photo-1612208141706-2fbd2d45a143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGtuaXR0ZWQlMjBzd2VhdGVyfGVufDF8fHx8MTc2NzE4NTc2MHww&ixlib=rb-4.1.0&q=80&w=1200)

Remember to consider the care instructions for your chosen yarns. Many spring-friendly fibers require gentle washing, so plan accordingly. With the right yarn selection, your spring knitting projects will not only look beautiful but will also be a joy to create and wear.`
  },
  {
    id: 2,
    title: "Beginner's Guide to Cable Knitting",
    slug: "beginners-guide-cable-knitting",
    excerpt: "Learn the art of cable knitting with this comprehensive guide. We'll walk you through the basics and show you how to create beautiful textured patterns that will elevate your projects.",
    image: "https://images.unsplash.com/photo-1595301408991-ce3b59fd4cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMG5lZWRsZXMlMjB3b29sfGVufDF8fHx8MTc2NzExOTIxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "December 25, 2025",
    dateValue: new Date("2025-12-25T10:00:00Z"),
    readTime: "8 min read",
    tags: ["cable-knitting", "beginner", "tutorial", "techniques"],
    content: `Cable knitting is one of the most beautiful and rewarding techniques in the knitting world. While it may look complex, cable knitting is actually quite accessible once you understand the basic principles. This guide will take you from complete beginner to creating your first cable patterns with confidence.

At its core, cable knitting involves crossing groups of stitches over each other to create twisted, rope-like patterns. These patterns can range from simple two-stitch cables to intricate braided designs. The key tool you'll need is a cable needle, which temporarily holds stitches while you work others.

![Essential tools for cable knitting](https://images.unsplash.com/photo-1706864685950-c7db14f24290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGluZyUyMHlhcm4lMjBjcmFmdHxlbnwxfHx8fDE3NjcxODU3NTl8MA&ixlib=rb-4.1.0&q=80&w=1200)

To create a basic cable, you'll typically work a pattern that involves holding some stitches on a cable needle, knitting the next few stitches, then knitting the held stitches. This creates the characteristic twist. The direction of the cable (left or right) depends on whether you hold the stitches in front or behind your work.

Start with a simple 4-stitch cable pattern. Practice on a swatch until you feel comfortable with the technique. Once you've mastered the basic cable, you can experiment with different cable widths, combinations, and spacing to create unique patterns.

Cable patterns work beautifully in sweaters, scarves, hats, and blankets. They add texture and visual interest to any project. As you gain confidence, you can try more complex patterns like traveling cables, braided cables, and even incorporate cables into lace patterns for truly stunning results.

![Beautiful cable knitting pattern example](https://images.unsplash.com/photo-1612208141706-2fbd2d45a143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGtuaXR0ZWQlMjBzd2VhdGVyfGVufDF8fHx8MTc2NzE4NTc2MHww&ixlib=rb-4.1.0&q=80&w=1200)

Remember, practice makes perfect. Don't be discouraged if your first cables don't look perfect. With time and practice, you'll develop the muscle memory and confidence to tackle even the most complex cable patterns. Happy knitting!`
  }
];
