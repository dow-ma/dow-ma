// @ts-ignore
import translate from "@iamtraction/google-translate";
import { ProfileCard } from "@/components/ProfileCard";
import { ArticleList } from "@/components/ArticleList";
import { Background } from "@/components/Background";
import { getSortedPostsData } from "@/lib/posts";
import { getDictionary } from "@/lib/get-dictionary";

export const revalidate = 3600; // Revalidate every hour

export default async function Home({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  let posts = getSortedPostsData();
  const dict = await getDictionary(lang);

  // Auto-translate post metadata for the list
  const translatedPosts = await Promise.all(posts.map(async (post) => {
    // Clone post to avoid mutation
    const newPost = { ...post };
    if (newPost.lang && newPost.lang !== lang) {
      try {
        const targetLang = lang === 'zh' ? 'zh-CN' : lang;
        const [titleRes, descRes] = await Promise.all([
          translate(newPost.title, { to: targetLang }),
          translate(newPost.description, { to: targetLang })
        ]);
        newPost.title = titleRes.text;
        newPost.description = descRes.text;
      } catch (e) {
        console.error("List translation failed:", e);
      }
    }
    return newPost;
  }));

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-24 gap-12 relative">
      <Background />
      <ProfileCard dict={dict} lang={lang} />
      <ArticleList posts={translatedPosts} dict={dict} lang={lang} />

      <footer className="w-full max-w-2xl text-center text-white/30 text-sm pb-8">
        {dict.footer.replace("{year}", new Date().getFullYear().toString())}
      </footer>
    </main>
  );
}
