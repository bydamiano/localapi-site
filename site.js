// Points every download button at the latest .dmg on this repository's GitHub Releases
// and fills in the version, date and size. Without JavaScript the buttons open the releases page.
(() => {
  const REPO = 'bydamiano/localapi-site';
  const API = `https://api.github.com/repos/${REPO}/releases/latest`;
  const RELEASES = `https://github.com/${REPO}/releases/latest`;

  const set = (selector, text) => document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
  const status = (text) => set('[data-dl-status]', text);
  const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;

  document.querySelectorAll('[data-download]').forEach((a) => { a.href = RELEASES; });

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
      return res.json();
    })
    .then((release) => {
      const asset = (release.assets || []).find((a) => /\.dmg$/i.test(a.name));
      const url = asset ? String(asset.browser_download_url || '') : '';
      // Only ever link to this repository's own release files.
      if (!url.startsWith(`https://github.com/${REPO}/releases/download/`)) throw new Error('No .dmg in the latest release yet.');
      const version = String(release.tag_name || '').replace(/^v/, '');
      const date = new Date(release.published_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
      document.querySelectorAll('[data-download]').forEach((a) => { a.href = url; });
      set('[data-version]', version);
      set('[data-dl-version]', `Version ${version} · ${date} · ${mb(asset.size)}`);
      status('');
    })
    .catch((err) => {
      status(`${err.message} The button opens the releases page instead.`);
    });

  const year = String(new Date().getFullYear());
  set('[data-year]', year);
})();
