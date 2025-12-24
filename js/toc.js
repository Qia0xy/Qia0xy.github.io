window.onload = function() {
  const headings = document.querySelectorAll('.p-content h2,.p-content h3');
  const tocLinks = document.querySelectorAll('#custom-toc a');
  if (!headings.length || !tocLinks.length) return;

  headings.forEach((h,i) => h.id = `toc-${i}`);
  tocLinks.forEach((link,i) => {
    link.href = `#toc-${i}`;
    link.onclick = e => {
      e.preventDefault();
      document.getElementById(`toc-${i}`).scrollIntoView({behavior: 'smooth'});
    };
  });

  window.onscroll = () => {
    const top = window.scrollY;
    let idx = 0;
    headings.forEach((h,i) => {
      if (h.offsetTop - 100 <= top) idx = i;
    });
    tocLinks.forEach(l => l.classList.remove('toc-active'));
    tocLinks[idx]?.classList.add('toc-active');
  };
};