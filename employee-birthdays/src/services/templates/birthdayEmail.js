const { escapeHtml } = require('../../utils/html');

const RAINBOW = ['#e63946', '#f4a300', '#2a9d8f', '#e76f51', '#457b9d', '#8e44ad', '#2a9d8f', '#e63946'];

function rainbowWord(word) {
  return word
    .split('')
    .map((letter, i) => `<span style="color:${RAINBOW[i % RAINBOW.length]};">${escapeHtml(letter)}</span>`)
    .join('');
}

function buildBirthdayEmail({ firstName, lastName, companyName, imageCid }) {
  const fullName = `${firstName} ${lastName}`.trim();
  const subject = `Look who's having a Birthday!!!`;

  const html = `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f2f2f2; font-family:Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#0057d9; padding:6px; border-radius:4px;">
            <tr>
              <td style="background:#2fae4e; padding:6px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4c400; padding:6px;">
                  <tr>
                    <td style="background:#e10600; padding:6px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:28px 24px;">
                        <tr>
                          <td align="center">
                            <img src="cid:${imageCid}" width="480" alt="Happy Birthday" style="display:block; width:100%; max-width:480px; height:auto; border-radius:6px;" />
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:22px; color:#111111;">
                              <span style="background:#fff347; font-weight:bold;">Look</span>
                              <span style="background:#fff347; font-weight:bold;"> who</span>'s having a
                              ${rainbowWord('Birthday')} today!
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-top:10px;">
                            <p style="margin:0; font-size:34px; font-weight:bold; color:#0057d9;">${escapeHtml(fullName)}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="font-family: Arial, sans-serif; font-size:11px; color:#999999; margin-top:16px;">
            Sent automatically by the ${escapeHtml(companyName)} employee birthday tracker.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Look who's having a Birthday today!\n\n${fullName}\n\nSent automatically by the ${companyName} employee birthday tracker.`;

  return { subject, html, text };
}

module.exports = { buildBirthdayEmail };
