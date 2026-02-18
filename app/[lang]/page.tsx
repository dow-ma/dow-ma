// @ts-ignore
import translate from "@iamtraction/google-translate";
import { ProfileCard } from "@/components/ProfileCard";
import { ArticleList } from "@/components/ArticleList";
import { Background } from "@/components/Background";
import { getSortedPostsData } from "@/lib/posts";
import { getDictionary } from "@/lib/get-dictionary";
import Link from "next/link";

export const revalidate = 3600;

export default async function Home({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  let posts = getSortedPostsData();
  const dict = await getDictionary(lang);

  const translatedPosts = await Promise.all(posts.map(async (post) => {
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
    <main className="min-h-screen flex flex-col items-center p-0 sm:p-6 md:p-12 lg:p-20 relative">
      <Background />

      <div className="w-full flex flex-col items-center gap-12 mt-4 sm:mt-10 px-4 sm:px-0">
        <ProfileCard dict={dict} lang={lang} />
        <ArticleList posts={translatedPosts} dict={dict} lang={lang} />
      </div>

      <footer className="w-full max-w-2xl text-center border-t border-border pt-8 pb-16 mt-16 opacity-30">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {`>> EOF / SYSTEM_TERMINATED / ${dict.footer.replace("{year}", new Date().getFullYear().toString())} <<`}
        </span>
      </footer>
    </main>
  );
}
