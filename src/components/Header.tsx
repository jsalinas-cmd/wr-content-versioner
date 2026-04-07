import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-6 shrink-0">
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="w-1 h-8 bg-[#009DDC] rounded-sm block" />
          <span className="text-gray-900 font-bold text-xl tracking-tight leading-none">
            world relief
          </span>
          <span className="text-gray-300 font-light text-xl leading-none select-none">|</span>
          <span className="text-gray-500 font-normal text-sm tracking-wide leading-none">
            Content Versioner
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium tracking-wider uppercase transition-colors"
          >
            Admin
          </Link>
          <span className="hidden sm:inline-block text-xs text-gray-400 font-medium tracking-wider uppercase">
            Internal Tool
          </span>
        </div>
      </div>
    </header>
  );
}
