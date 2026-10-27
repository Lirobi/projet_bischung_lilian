// Règles métier du mock : login et e-mail uniques, mot de passe jamais renvoyé.
const fs = require('node:fs');
const path = require('node:path');

const readUsers = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8')).users ?? [];

module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/users') {
    const { login, email } = req.body ?? {};
    const taken = readUsers().some(
      (u) => u.login?.toLowerCase() === String(login).toLowerCase() || u.email?.toLowerCase() === String(email).toLowerCase(),
    );
    if (taken) {
      return res.status(409).json({ message: 'Ce login ou cet e-mail est déjà utilisé.' });
    }
    // json-server répond via res.jsonp : on retire le mot de passe avant l'envoi
    const send = res.jsonp.bind(res);
    res.jsonp = (body) => {
      const { password, ...user } = body ?? {};
      return send(user);
    };
  }
  next();
};
