import re
import unittest
import zipfile
from pathlib import Path


class ApiKeyTest(unittest.TestCase):
    def test_known_api_key_formats_are_absent_from_project_and_archive(self):
        pattern = re.compile(rb'AIza[\w-]{20,}|sb_(?:publishable|secret)_[\w-]+')
        for path in Path('.').rglob('*'):
            if not path.is_file() or '.git' in path.parts or '__pycache__' in path.parts:
                continue
            if path.suffix == '.zip':
                with zipfile.ZipFile(path) as archive:
                    for entry in archive.infolist():
                        self.assertIsNone(pattern.search(archive.read(entry)), f'{path}: {entry.filename}')
            else:
                self.assertIsNone(pattern.search(path.read_bytes()), str(path))


if __name__ == '__main__':
    unittest.main()
