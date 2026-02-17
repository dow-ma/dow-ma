import { ProfileCard } from "@/components/ProfileCard";
import { ArticleList } from "@/components/ArticleList";
import { Background } from "@/components/Background";
import { getSortedPostsData } from "@/lib/posts";
import { getDictionary } from "@/lib/get-dictionary";

export const revalidate = 3600; // Revalidate every hour

export default async function Home({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const posts = getSortedPostsData();
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-24 gap-12 relative">
      <Background />
      <ProfileCard dict={dict} lang={lang} />
      <ArticleList posts={posts} dict={dict} />

      <footer className="w-full max-w-2xl text-center text-white/30 text-sm mt-12 pb-8">
        {dict.footer.replace("{year}", new Date().getFullYear().toString())}
      </footer>
    </main>
  );
}
