import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="empty">
        <h1>That page is not here</h1>
        <p>The pose may have been renamed. The full library is on the home page.</p>
        <Link href="/" className="btn btn--solid">Go to the home page</Link>
      </div>
    </div>
  );
}
