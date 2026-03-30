---
description: How to add a new blog post to the website
---

Follow these steps to add a new blog post.

### 1. Add Content to Translation File

Open `messages/en.json` and add your new post content under `blog.posts`. Use a unique key (e.g., `myNewPost`).

```json
"blog": {
  "posts": {
    "myNewPost": {
      "title": "Your Blog Post Title",
      "excerpt": "A short summary of your post...",
      "date": "December 5, 2025",
      "readTime": "5 min read",
      "author": "Author Name",
      "category": "Category Name",
      "introduction": "The opening paragraph...",
      "sections": {
        "section1": {
          "title": "First Section Title",
          "content": "Content for the first section..."
        },
        "section2": {
          "title": "Second Section Title",
          "content": "Content for the second section..."
        }
      },
      "conclusion": "The closing paragraph..."
    }
  }
}
```

### 2. Register the Post in Blog List

Open `src/app/[locale]/blog/page.tsx` and add your post to the `BLOG_POST_KEYS` array at the top of the file.

```typescript
const BLOG_POST_KEYS = [
    // ... existing posts
    {
        key: "myNewPost", // Must match the key in en.json
        slug: "your-url-friendly-slug", // e.g., "my-new-blog-post"
        image: "https://images.unsplash.com/photo-..." // URL to the cover image
    }
];
```

### 3. Update Blog Post Renderer

Open `src/app/[locale]/blog/[slug]/page.tsx`. You may need to add a condition to render your specific content structure if it differs from others.

Find the `BlogPostPage` component and the `return` statement. Add a check for your new key:

```tsx
<article className="prose prose-lg max-w-none">
    {postKey === 'guide2025' ? (
        // ... existing code
    ) : postKey === 'myNewPost' ? (
        // Add your rendering logic here
        <>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                {t(`posts.${postKey}.introduction`)}
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                {t(`posts.${postKey}.sections.section1.title`)}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
                {t(`posts.${postKey}.sections.section1.content`)}
            </p>
            
            {/* Add more sections as needed */}

            <div className="bg-teal-50 border-l-4 border-teal-500 p-6 my-8 rounded-r-lg">
                <h3 className="text-lg font-bold text-teal-900 mb-2">Conclusion</h3>
                <p className="text-teal-800">
                    {t(`posts.${postKey}.conclusion`)}
                </p>
            </div>
        </>
    ) : (
        // Default fallback
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
            {t(`posts.${postKey}.excerpt`)}
        </p>
    )}
</article>
```

### 4. Verify

Run `npm run dev` and navigate to `/blog` to see your new post in the list. Click on it to verify the detail page renders correctly.
