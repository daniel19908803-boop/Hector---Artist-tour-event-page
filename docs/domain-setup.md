# Custom domain: hector.artist.site

The hostname has been added to the existing site. Activation and HTTPS issuance are pending DNS verification. The published site's access remains private.

The site now uses `https://hector.artist.site` for canonical links, social image URLs, structured data URLs, calendar download URLs, and sitemap URLs.

## DNS records to add

Add these records in the DNS zone for `artist.site`. Some DNS dashboards expect the relative name shown below; others accept the full hostname. Use the default TTL. The trailing dot on the CNAME target is valid DNS notation.

| Type | Name within artist.site | Value |
| --- | --- | --- |
| CNAME | `hector` | `custom-domains.chatgpt.site.` |
| TXT | `_openai-site-verification.hector` | `openai-site-verification=w1j0WlYzgdWOPxEZb5pGIrRZzA48lFN-Ud4h4jKC79E` |
| TXT | `_cf-custom-hostname.hector` | `cc98cacf-e16d-4b02-bb8b-de2d48c24abb` |

The full TXT hostnames are `_openai-site-verification.hector.artist.site` and `_cf-custom-hostname.hector.artist.site`.

No DNS-management connection is available in this workspace, so these records must be added by someone with access to the `artist.site` DNS zone. Adding the hostname here does not purchase a domain or grant DNS control.

Once the records resolve, the hosting service can verify ownership, issue the certificate, and activate the hostname. Until that completes, the custom address is not live. Existing hosting access continues to work.

The required DNS targets and verification records identify the hosting infrastructure even when the visible address uses the custom domain. They cannot be removed while retaining that hosting connection.
