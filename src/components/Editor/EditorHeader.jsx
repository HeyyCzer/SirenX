import Link from "next/link";

export default function EditorHeader() {
  return (
    <div className="flex items-end gap-x-4">
      <Link
        href="/"
        className="upper w-fit font-bold text-2xl text-white leading-none"
      >
        Siren
        <span className="text-gradient-primary">X</span>
      </Link>

      <Link href="https://github.com/heyyczer/sirenx" passHref rel="noopener" target="_blank">
        <img
          src="https://img.shields.io/github/stars/heyyczer/sirenx"
          alt="Star"
          className="h-fit"
        />
      </Link>
    </div>
  );
}
