export function SearchBox({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  return (
    <form action="/search" className="search" role="search">
      <label htmlFor="q" className="sr-only">Search poses</label>
      <input id="q" name="q" type="search" defaultValue={defaultValue} autoFocus={autoFocus} placeholder="Try “shy”, “grandparents” or “jump”" autoComplete="off" enterKeyHint="search" />
      <button type="submit" className="btn btn--solid">Search</button>
    </form>
  );
}
