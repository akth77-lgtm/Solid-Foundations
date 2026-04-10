# Contact Form Backend

## Run locally

```bash
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python app.py
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

## Configuration

- `PORT`: server port (default 5000)
- `ALLOWED_ORIGINS`: comma-separated origins allowed for CORS (default `*`)
- `RATE_LIMIT_MAX`: requests per window (default 5)
- `RATE_LIMIT_WINDOW`: seconds (default 600)

## API

- `POST /api/contact`

Payload:

```json
{
  "name": "",
  "company": "",
  "email": "",
  "phone": "",
  "message": "",
  "website": ""
}
```

The `website` field is a honeypot and should be left empty.
