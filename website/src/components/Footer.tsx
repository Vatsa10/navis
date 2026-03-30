import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 bg-white border-t border-primary/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image src="/assets/logo.png" alt="Navis Logo" width={32} height={32} />
              <span className="font-bold text-xl tracking-tight text-text-900">Navis</span>
            </Link>
            <p className="text-lg text-text-500 mb-10 leading-relaxed font-medium">
              The visual GPS for modern AI chat interfaces. Zero-latency navigation for power users who demand context.
            </p>
            <div className="flex items-center gap-6">
              <Link href="https://twitter.com/vatsa404" className="p-3 rounded-full bg-surface-50 text-text-500 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </Link>
              <Link href="https://github.com/Vatsa10/navis" target="_blank" className="p-3 rounded-full bg-surface-50 text-text-500 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </Link>
              <Link href="https://www.linkedin.com/in/vatsa-joshi/" className="p-3 rounded-full bg-surface-50 text-text-500 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-text-900 uppercase text-xs tracking-[0.2em]">Product</h4>
              <Link href="#features" className="text-text-500 hover:text-primary transition-colors font-medium">Features</Link>
              <Link href="#install" className="text-text-500 hover:text-primary transition-colors font-medium">Download</Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-text-900 uppercase text-xs tracking-[0.2em]">Open Source</h4>
              <Link href="https://github.com/Vatsa10/navis" target="_blank" className="text-text-500 hover:text-primary transition-colors font-medium">GitHub Repository</Link>
            </div>
          </div>
        </div>

        <div className="mt-40 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 text-text-500 font-medium">
          <p>© 2026 Navis By Vatsa Joshi. All rights reserved.</p>
          {/* <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
