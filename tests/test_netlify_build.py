import subprocess
import tempfile
import unittest
import re
from pathlib import Path


class NetlifyBuildTest(unittest.TestCase):
    def test_root_redirects_without_showing_mirror_index(self):
        page = Path('index.html').read_text()
        self.assertNotIn('HTTrack', page)
        self.assertNotIn('Index of locally available sites', page)
        self.assertRegex(page, r'(?i)<meta\s+http-equiv="refresh"\s+content="0;\s*url=/chungdoi\.com/i/hongminh-khanhlinh\.html"')
        config = Path('netlify.toml').read_text()
        self.assertRegex(config, r'(?s)\[\[redirects\]\].*?from\s*=\s*"/".*?to\s*=\s*"/chungdoi\.com/i/hongminh-khanhlinh\.html".*?status\s*=\s*302.*?force\s*=\s*true')

    def test_build_contains_site_and_assets_without_private_mirror_files(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'site'
            subprocess.run(['bash', 'build.sh', str(output)], check=True)
            for path in (
                'index.html',
                'chungdoi.com/i/hongminh-khanhlinh.html',
                '_next/static/css/f0c5e11479c4461e.css',
                'fonts/ViaodaLibre-Regular.ttf',
                'images/themes/minimalism-dark-red/flower2-decoration.webp',
                'local/guestbook.js',
                'photos/fd5cd203-8da7-4ea6-8f76-fd2389d3a7f5.jpg',
                'manifest.json',
            ):
                self.assertTrue((output / path).is_file(), path)
            for path in ('cookies.txt', 'hts-cache', 'hts-log.txt', 'tests', 'supabase'):
                self.assertFalse((output / path).exists(), path)
            for page in (output / 'chungdoi.com/i').glob('hongminh-khanhlinh*.html'):
                for photo in set(re.findall(r'/photos/[\w-]+\.jpg', page.read_text())):
                    self.assertTrue((output / photo.lstrip('/')).is_file(), photo)


if __name__ == '__main__':
    unittest.main()
