import spriteXml from '../assets/app-icons.svg?raw';

/** Inline SVG symbol sprite so <use href="#icon-…"> works with &lt;base href&gt; and Capacitor. */
export function IconSprite() {
  const markup = spriteXml
    .replace(/<\?xml[^?]*\?>/i, '')
    .replace(
      /<svg([^>]*)>/i,
      '<svg$1 aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">'
    );

  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
