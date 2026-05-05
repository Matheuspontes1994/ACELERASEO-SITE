# Firestore Security Audit: Acelera SEO

## 1. Data Invariants
- `contacts` and `audit_leads` are write-only for the public. Only admins can read/delete.
- `seo_pages` are public to allow audit tool functionality. *Wait, if it's public reading, is it PII?* The blueprint says it's for SEO Metadata. That should be public, but not writable by public.
- `clients`, `keyword_universe`, `blog_posts`, `backlinks` seem to contain PII or sensitive client data and MUST be locked down with `Master Gate` pattern.

## 2. "Dirty Dozen" Payloads (Examples)
1. Creating a contact form submission with a 2MB message (Resource Exhaustion).
2. Updating an `seo_page` to set its `agencyUid` to a different agency's ID (Privilege Escalation).
3. Attempting to list all `audit_leads` as a non-admin (PII Leak).
4. Attempting to write to `clients` collection as an anonymous user (Authentication Bypass).
5. Creating a `blog_post` without a valid `agencyUid`.
6. Updating a `blog_post` after setting its status to "Publicado" to inject malicious script (Terminal State Lock Violation).
7. Injecting a 2KB string into a document ID (ID Poisoning).
8. Creating a document with a missing `createdAt` field (Integrity violation).
9. Updating `createdAt` on an existing document (Immutability violation).
10. Attempting to update `agencyUid` on a `blog_post`.
11. Reading `clients` data where `clientEmail` does not match the authenticated user.
12. Attempting to delete a `blog_post` without owner permissions.

## 3. Test Runner (firestore.rules.test.ts)
*To be implemented in next step if permitted.*
