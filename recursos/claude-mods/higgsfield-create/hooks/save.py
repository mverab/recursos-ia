"""Downloader local: HTTPS/CDN allowlist, redirects denied, O_EXCL, no shell."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener
ROOT = Path(__file__).resolve().parents[1] / 'outputs'
HOSTS = {'d8j0ntlcm91z4.cloudfront.net', 'd2ol7oe51mr4n9.cloudfront.net'}
LIMIT = 100 * 1024 * 1024

def safe_url(url):
    if not isinstance(url, str) or len(url) > 8192 or any(ord(c) < 33 for c in url):
        raise ValueError('URL inválida')
    u = urlsplit(url)
    if u.scheme != 'https' or u.netloc not in HOSTS or u.username or u.password or u.port or u.fragment:
        raise ValueError('Solo HTTPS en CDN allowlisted, sin credenciales ni puertos')
    return url

def extension(data):
    if data.startswith(b'\x89PNG\r\n\x1a\n'): return '.png'
    if data.startswith(b'\xff\xd8\xff'): return '.jpg'
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP': return '.webp'
    if data[4:8] == b'ftyp': return '.mp4'
    raise ValueError('Tipo de archivo no permitido')

def store(data, base):
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', base):
        raise ValueError('Nombre no permitido')
    if len(data) > LIMIT: raise ValueError('Archivo demasiado grande')
    ext = extension(data)
    # outputs must exist. O_NOFOLLOW pins the real directory for every write.
    directory = os.open(ROOT, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    try:
        for index in range(1, 10001):
            name = f'{base}_{index}{ext}'
            try:
                fd = os.open(name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600, dir_fd=directory)
            except FileExistsError:
                continue
            try:
                with os.fdopen(fd, 'wb') as out:
                    out.write(data)
            except BaseException:
                os.unlink(name, dir_fd=directory)
                raise
            return str(ROOT / name)
        raise ValueError('Sin nombres disponibles')
    finally:
        os.close(directory)

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('Redirección bloqueada')

def download(url, base):
    safe_url(url)
    opener = build_opener(NoRedirect())
    with opener.open(Request(url, headers={'User-Agent': 'HiggsfieldCreateLocal/0.1'}), timeout=60) as response:
        data = response.read(LIMIT + 1)
    return store(data, base)

if __name__ == '__main__':
    try:
        if len(sys.argv) != 3: raise ValueError('Argumentos inválidos')
        target = download(sys.argv[1], sys.argv[2])
        print(json.dumps({'file': target, 'url': Path(target).as_uri()}))
    except Exception:
        # No raw exception, signed URL, headers, credentials, or prompt in logs.
        print('Descarga rechazada: revisa URL, permisos o tipo de archivo.', file=sys.stderr)
        sys.exit(1)
