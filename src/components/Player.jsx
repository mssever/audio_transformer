export default function Player({src, title, server}) {
  const url = new URL(server + '/data/play')
  url.searchParams.set('name', src)
  return (
    <figure>
      <figcaption>{title}</figcaption>
      <audio controls src={url.href}>
        Your browser does not support the <code>audio</code> element.
      </audio>
    </figure>
  )
}
