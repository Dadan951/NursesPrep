const { Resend } = require('resend');

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/* ── Template HTML de base ──────────────────────────────────────────────── */
function baseTemplate(title, content) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f9ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0c4a6e 100%);padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="font-size:18px;">🩺</span>
              </div>
              <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">NursePrep</span>
            </div>
            <p style="color:#93c5fd;font-size:12px;margin:8px 0 0;">${title}</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f1f5f9;text-align:center;">
            <p style="color:#94a3b8;font-size:11px;margin:0;">
              Tu reçois cet email car tu as créé un compte sur NursePrep.<br/>
              Si ce n'est pas toi, ignore simplement cet email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Code block HTML ─────────────────────────────────────────────────────── */
function codeBlock(code) {
  return `
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#f0f9ff;border:2px dashed #bfdbfe;border-radius:16px;padding:20px 36px;">
        <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1e40af;font-family:monospace;">${code}</span>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:12px 0 0;">Ce code expire dans <strong>15 minutes</strong></p>
    </div>`;
}

/* ── Envoi : vérification email à l'inscription ──────────────────────────── */
exports.sendVerificationEmail = async (to, name, code) => {
  const content = `
    <h2 style="color:#0f172a;font-size:22px;font-weight:700;margin:0 0 8px;">Confirme ton adresse email 📧</h2>
    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 4px;">
      Bonjour <strong>${name}</strong>,
    </p>
    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Pour finaliser la création de ton compte NursePrep, entre le code ci-dessous sur le site :
    </p>
    ${codeBlock(code)}
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
      Si tu n'as pas demandé à créer un compte, ignore cet email.
    </p>`;

  await getResend().emails.send({
    from: 'NursePrep <nurses.prep10@gmail.com>',
    to,
    subject: `${code} — Ton code de vérification NursePrep`,
    html: baseTemplate('Vérification de compte', content),
  });
};

/* ── Envoi : réinitialisation du mot de passe ────────────────────────────── */
exports.sendResetEmail = async (to, name, code) => {
  const content = `
    <h2 style="color:#0f172a;font-size:22px;font-weight:700;margin:0 0 8px;">Réinitialise ton mot de passe 🔑</h2>
    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 4px;">
      Bonjour <strong>${name}</strong>,
    </p>
    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Tu as demandé à réinitialiser ton mot de passe. Entre ce code sur le site :
    </p>
    ${codeBlock(code)}
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
      Si tu n'as pas fait cette demande, ton compte est en sécurité — ignore cet email.
    </p>`;

  await getResend().emails.send({
    from: 'NursePrep <nurses.prep10@gmail.com>',
    to,
    subject: `${code} — Réinitialisation de mot de passe NursePrep`,
    html: baseTemplate('Réinitialisation de mot de passe', content),
  });
};
