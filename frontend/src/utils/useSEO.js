import { useEffect } from 'react';

export function usePageSEO({
  title = 'Digital Services Platform — Your Digital Work, Taken Care Of',
  description = 'Websites, creative branding, Excel automation, and AI workflows for growing businesses in India.',
  canonicalUrl,
}) {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Set OpenGraph title & desc
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    // Set canonical link
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonicalUrl;
    }

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, canonicalUrl]);
}
