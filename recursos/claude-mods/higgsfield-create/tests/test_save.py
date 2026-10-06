import unittest, importlib.util, tempfile, os
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('save',Path(__file__).parents[1]/'hooks/save.py')
assert spec is not None and spec.loader is not None
save=importlib.util.module_from_spec(spec); spec.loader.exec_module(save)
class Security(unittest.TestCase):
 def test_urls(self):
  for url in ['file:///etc/passwd','http://d8j0ntlcm91z4.cloudfront.net/x','https://127.0.0.1/x','https://d8j0ntlcm91z4.cloudfront.net.evil.com/x','https://user:pass@d8j0ntlcm91z4.cloudfront.net/x','https://d8j0ntlcm91z4.cloudfront.net:443/x']:
   with self.assertRaises(ValueError):save.safe_url(url)
  self.assertEqual(save.safe_url('https://d8j0ntlcm91z4.cloudfront.net/x.png'),'https://d8j0ntlcm91z4.cloudfront.net/x.png')
 def test_no_overwrite_and_containment(self):
  with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR')) as tmp:
   root=Path(tmp)/'outputs';root.mkdir()
   with patch.object(save,'ROOT',root):
    data=b'\x89PNG\r\n\x1a\n'+b'fixture'
    a=save.store(data,'photo');b=save.store(data,'photo')
    self.assertNotEqual(a,b);self.assertEqual(Path(a).read_bytes(),data)
    with self.assertRaises(ValueError):save.store(data,'../../escape')
 def test_symlink_root_refused(self):
  with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR')) as tmp:
   root=Path(tmp)/'outputs';root.symlink_to(Path(tmp),target_is_directory=True)
   with patch.object(save,'ROOT',root):
    with self.assertRaises(OSError):save.store(b'\x89PNG\r\n\x1a\n','photo')
 def test_unknown_filetype_refused(self):
  with self.assertRaises(ValueError):save.store(b'<script>bad</script>','photo')
if __name__=='__main__':unittest.main()
