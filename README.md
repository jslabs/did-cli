# did-cli

Minimal CLI for decentralized identity primitives: key generation, hashing, signing, and verification.

---

## Install

npm install -g @jslabs/did-cli

---

## Usage

did-cli <command>

---

## Commands

### Generate keys

did-cli gen

Output:
{
  "publicKey": "base64...",
  "privateKey": "base64...",
  "publicKeyMultibase": "z..."
}

---

### Hash file

did-cli hash <filePath>

Example:
did-cli hash ./profile.json

---

### Sign message

did-cli sign <privateKey> <message>

Example:
did-cli sign "PRIVATE_KEY" "message"

---

### Verify signature

did-cli verify <publicKey> <message> <signature>

Example:
did-cli verify "PUBLIC_KEY" "message" "SIGNATURE"

---

## Notes

- Uses Ed25519 signatures (tweetnacl)
- publicKeyMultibase is DID-compatible
- Private keys are never stored
- Designed for DID-style identity workflows