import Link from 'next/link';

const Breadcrumb = () => (
  <nav className="text-[11px] font-medium mb-6">
    <ol className="flex items-center space-x-2">
      <li>
        <Link href="/" className="text-gray-400 transition-colors hover:text-white/80">
          Home
        </Link>
      </li>
      <li className="text-gray-600">/</li>
      <li className="text-white">Tax</li>
    </ol>
  </nav>
);

export default Breadcrumb;
