# Documentation

## Viva preparation (printable)

| File | Description |
|------|-------------|
| [`VIVA_PREP.md`](VIVA_PREP.md) | Source document (edit here) |
| [`VIVA_PREP.html`](VIVA_PREP.html) | Print-ready HTML (generate below) |
| [`VIVA_PREP.docx`](VIVA_PREP.docx) | Word document (generate below) |

### Generate / refresh printable files

From the repository root:

```bash
python scripts/generate_viva_prep.py
```

### Save as PDF

**Option A — Browser (recommended)**

1. Open `docs/VIVA_PREP.html` in Chrome or Edge.
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac).
3. Destination: **Save as PDF**.
4. Turn on **Background graphics** for colored callouts and table headers.

**Option B — Microsoft Word**

1. Open `docs/VIVA_PREP.docx`.
2. **File → Save As → PDF**.

Requires `python-docx` for `.docx` output:

```bash
pip install python-docx
```
