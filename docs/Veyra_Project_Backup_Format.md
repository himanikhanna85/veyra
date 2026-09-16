# Veyra Project Backup Format

Veyra V0 exports one UTF-8 JSON document with the extension
`.veyra-project.json`. It is a local portability format, not a live database.

## Envelope

```json
{
  "format": "veyra-project",
  "version": 2,
  "checksum": "sha256-of-canonical-payload",
  "payload": {
    "project": {},
    "environments": [],
    "definitions": [],
    "runs": [],
    "evidence": []
  }
}
```

- `project` contains the project identity, application URL and environment.
- `environments` contains every named environment, its active state, base URL
  and non-secret key/value variables. Secret values are never part of this
  document.
- `definitions` contains versioned test/module/domain definitions.
- `runs` contains immutable completed-run snapshots. A later definition edit
  therefore cannot change the meaning of an exported historical run.
- `evidence` contains metadata plus base64 bytes. On restore, Veyra validates
  the envelope version, whole-payload SHA-256 checksum, identifiers, relative
  paths, media extension and declared byte size before committing the project.

Restore rejects unsupported, modified, unsafe or duplicate-project backups.
Structured rows are restored transactionally into SQLite; evidence is written
back into the separate evidence directory. A failed restore rolls back rows and
removes its partially restored evidence directory.

Version 2 added complete environment portability for E03. Restore continues to
accept version 1 documents; they are imported with their legacy single default
environment.
