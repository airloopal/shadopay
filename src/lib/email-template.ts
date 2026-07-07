interface EmailLayoutParams {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const ACCENT = "#D4AF37";
const INK = "#0A0A0A";
const MUTED = "#6B7280";

/** Renders a branded HTML email shell. Body content is passed in as trusted HTML from within this file only. */
export function renderEmailLayout({ preheader, heading, bodyHtml, ctaLabel, ctaUrl }: EmailLayoutParams): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background-color:#F4F4F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    ${preheader ? `<div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F5; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%; background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E5E7EB;">
            <tr>
              <td style="background-color:${INK}; padding:24px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:20px; height:20px; background-color:${ACCENT}; border-radius:6px;"></td>
                    <td style="padding-left:10px; font-size:15px; font-weight:300; color:#FFFFFF; letter-spacing:-0.02em;">ShadoPay</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px 32px;">
                <h1 style="margin:0; font-size:22px; font-weight:300; color:${INK}; letter-spacing:-0.02em;">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 8px 32px; font-size:14px; line-height:1.6; color:#374151;">
                ${bodyHtml}
              </td>
            </tr>
            ${
              ctaLabel && ctaUrl
                ? `<tr>
              <td style="padding:24px 32px;">
                <a href="${ctaUrl}" style="display:inline-block; background-color:${ACCENT}; color:${INK}; text-decoration:none; font-size:14px; font-weight:600; padding:12px 20px; border-radius:10px;">${ctaLabel}</a>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:24px 32px; border-top:1px solid #E5E7EB;">
                <p style="margin:0; font-size:12px; color:${MUTED};">
                  ShadoPay, Inc. — Privacy-first payment infrastructure.<br />
                  This is a sandbox pilot notification.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
