import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content?: string;
    tags?: string[];
    lang?: string; // Optional language tag
    [key: string]: unknown;
}

export function getSortedPostsData() {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory).filter(fileName => {
        return fileName.endsWith('.md') || fileName.endsWith('.mdx');
    });
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".mdx" or ".md" from file name to get slug
        const slug = fileName.replace(/\.mdx?$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        return {
            slug,
            ...(matterResult.data as { title: string; date: string; description: string; lang?: string; tags?: string[] }),
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getPostData(slug: string) {
    // Try both .md and .mdx
    let fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(postsDirectory, `${slug}.md`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
        slug,
        content: matterResult.content,
        mtime: fs.statSync(fullPath).mtimeMs,
        ...(matterResult.data as { title: string; date: string; description: string; lang?: string; tags?: string[] }),
    };
}
