import Link from "next/link";

export default function Page() {
  return (
    <>
      <main>
        <section className="flex flex-col items-center justify-center text-center gap-12 px-8 py-24">
          <h1 className="text-3xl font-extrabold">Worldishes ⚡️</h1>

          <p className="text-lg opacity-80">
            The start of your new startup... What are you gonna build?
          </p>

          <Link href="/blog" className="link link-hover text-sm">
            Fancy a blog?
          </Link>
        </section>
      </main>
    </>
  );
}
