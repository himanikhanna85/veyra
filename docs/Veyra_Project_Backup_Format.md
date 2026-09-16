# Veyra Project Backup Format

Veyra V0 exports one UTF-8 JSON document with the extension
`.veyra-project.json`. It is a local portability format, not a live database.

## Envelope

```json
{
  "format": "veyra-project",
  "version": 3,
  "checksum": "sha256-of-canonical-payload",
  "payload": {
    "project": {},
    "environments": [],
    "secretReferences": [],
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
- `secretReferences` contains project-scoped logical identifiers and optional
  descriptions. It never contains plaintext, encrypted or encoded secret
  values, or an operating-system secure-store locator.
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

An archived same-identity local project is the intentional exception to the
duplicate rule: after the backup passes full validation, restore reactivates
that retained project and makes it available in the normal switcher. An active
same-identity project is still rejected and is never overwritten silently.

Version 3 added portable secret-reference metadata for E04.T01. Version 2 added
complete environment portability for E03. Restore continues to accept versions
1 and 2; version 1 documents are imported with their legacy single default
environment, and neither legacy version invents missing secret references.
