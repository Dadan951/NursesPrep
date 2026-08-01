import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Retour à l'accueil
          </Link>
          <span className="text-xs text-slate-400">Dernière mise à jour : juin 2026</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold mb-4">
            RGPD · Protection des données
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Politique de confidentialité</h1>
          <p className="text-slate-500 text-sm">
            Nurses Prép s'engage à protéger la vie privée de ses utilisateurs conformément au
            Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi
            Informatique et Libertés du 6 janvier 1978 modifiée.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          <Section title="1. Responsable du traitement">
            <p>
              Le responsable du traitement des données personnelles est <strong>Nurses Prép</strong>,
              joignable à l'adresse :{' '}
              <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons les données suivantes lors de votre utilisation de la Plateforme :</p>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Données d'identification</p>
                <p>Nom, adresse e-mail, photo de profil (si connexion Google), mot de passe (haché, jamais en clair).</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Données d'utilisation</p>
                <p>Résultats de quiz, scores, flashcards étudiées, cours consultés, progression par semestre, statistiques journalières.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Données de navigation</p>
                <p>Adresse IP, type de navigateur, pages visitées, horodatage des connexions.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Données de paiement</p>
                <p>Traitées exclusivement par <strong>Stripe</strong>. Nurses Prép ne stocke aucune donnée bancaire (numéro de carte, CVV, IBAN).</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Contenus générés</p>
                <p>Textes de cours soumis à l'IA pour générer des fiches ou quiz personnalisés.</p>
              </div>
            </div>
          </Section>

          <Section title="3. Finalités du traitement">
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Fournir les fonctionnalités pédagogiques de la Plateforme</li>
              <li>Suivre votre progression et afficher vos statistiques</li>
              <li>Gérer les abonnements et les paiements</li>
              <li>Envoyer des e-mails transactionnels (confirmation d'inscription, reçus de paiement)</li>
              <li>Améliorer la qualité du service (de façon anonymisée et agrégée)</li>
              <li>Répondre à vos demandes de support</li>
              <li>Respecter nos obligations légales</li>
            </ul>
            <p>
              Nurses Prép <strong>ne vend pas</strong> vos données personnelles à des tiers et
              ne les utilise pas à des fins publicitaires.
            </p>
          </Section>

          <Section title="4. Base légale du traitement">
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Exécution du contrat</strong> — gestion du compte, accès aux fonctionnalités, paiement</li>
              <li><strong>Intérêt légitime</strong> — amélioration du service, sécurité de la Plateforme</li>
              <li><strong>Obligation légale</strong> — conservation des factures (10 ans)</li>
              <li><strong>Consentement</strong> — communications marketing (si vous y avez consenti)</li>
            </ul>
          </Section>

          <Section title="5. Durée de conservation">
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                ['Compte actif', 'Pendant toute la durée du compte + 3 ans après suppression'],
                ['Données de progression', 'Durée du compte + 1 an'],
                ['Données de paiement (factures)', '10 ans (obligation légale)'],
                ['Logs de navigation', '12 mois maximum'],
                ['Contenus IA soumis', 'Traitement immédiat, non conservés au-delà de 30 jours'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-700 sm:w-56 flex-shrink-0">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="6. Partage des données">
            <p>Vos données peuvent être partagées avec les sous-traitants suivants, dans le strict cadre de leur mission :</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                ['Stripe', 'Traitement des paiements', 'États-Unis (clauses contractuelles types)'],
                ['MongoDB Atlas', 'Hébergement de la base de données', 'Union Européenne'],
                ['Vercel', 'Hébergement du frontend', 'Union Européenne'],
                ['Anthropic', 'Génération de contenu par IA (Claude)', 'États-Unis (clauses contractuelles types)'],
              ].map(([name, role, loc]) => (
                <div key={name} className="flex flex-col sm:flex-row sm:gap-4 py-1">
                  <span className="font-semibold text-slate-700 sm:w-32 flex-shrink-0">{name}</span>
                  <span className="flex-1">{role}</span>
                  <span className="text-xs text-slate-400 sm:w-56 flex-shrink-0">{loc}</span>
                </div>
              ))}
            </div>
            <p>
              Aucun autre transfert vers des tiers n'est effectué sans votre consentement explicite,
              sauf obligation légale (réquisition judiciaire, etc.).
            </p>
          </Section>

          <Section title="7. Vos droits">
            <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> — corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement</strong> — demander la suppression de votre compte et données (en libre-service depuis Profil &gt; Zone de danger)</li>
              <li><strong>Droit à la portabilité</strong> — télécharger vos données dans un format structuré (en libre-service depuis Profil &gt; Mes données)</li>
              <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</li>
              <li><strong>Droit à la limitation</strong> — limiter temporairement un traitement</li>
            </ul>
            <p>
              L'effacement et l'export de vos données sont accessibles directement depuis votre espace
              personnel. Pour les autres droits, contactez-nous à{' '}
              <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>.
              Nous répondrons dans un délai de <strong>30 jours</strong> maximum.
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) si vous estimez
              que vos droits ne sont pas respectés : <a href="https://www.cnil.fr" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              La Plateforme utilise des cookies et technologies similaires strictement nécessaires au
              fonctionnement du service (session utilisateur, préférences d'affichage). Ces cookies ne
              nécessitent pas votre consentement.
            </p>
            <p>
              Elle utilise également, sous réserve de votre consentement recueilli via le bandeau affiché
              lors de votre première visite, des outils de mesure d'audience et de suivi d'erreurs :
            </p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                ['Vercel Analytics', 'Mesure d’audience (pages vues, performance)'],
                ['Sentry', 'Détection et diagnostic des erreurs techniques'],
              ].map(([name, role]) => (
                <div key={name} className="flex flex-col sm:flex-row sm:gap-4 py-1">
                  <span className="font-semibold text-slate-700 sm:w-40 flex-shrink-0">{name}</span>
                  <span className="flex-1">{role}</span>
                </div>
              ))}
            </div>
            <p>
              Aucun cookie publicitaire n'est utilisé sur la Plateforme. Vous pouvez à tout moment changer
              d'avis en effaçant les données de navigation de votre navigateur pour ce site, ce qui
              réaffichera le bandeau de consentement.
            </p>
          </Section>

          <Section title="9. Sécurité des données">
            <p>
              Nurses Prép met en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, perte ou divulgation :
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Chiffrement des communications (HTTPS/TLS)</li>
              <li>Mots de passe stockés sous forme hachée (bcrypt)</li>
              <li>Authentification par token JWT à durée limitée</li>
              <li>Accès aux données limité au personnel strictement nécessaire</li>
              <li>Sauvegardes régulières chiffrées</li>
            </ul>
          </Section>

          <Section title="10. Mineurs">
            <p>
              La Plateforme est accessible aux personnes âgées de 15 ans minimum. Les personnes entre 15 et 18 ans
              doivent avoir l'autorisation de leur représentant légal. Nurses Prép ne collecte pas sciemment
              de données personnelles concernant des enfants de moins de 15 ans. Si vous constatez qu'un mineur
              de moins de 15 ans a créé un compte, contactez-nous pour procéder à sa suppression.
            </p>
          </Section>

          <Section title="11. Modifications de la politique">
            <p>
              Cette politique de confidentialité peut être mise à jour. Toute modification significative
              vous sera notifiée par e-mail ou via la Plateforme. La date de dernière mise à jour est
              indiquée en haut de la page.
            </p>
            <p>
              Pour toute question : <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>
            </p>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-2">
          <p>
            <Link to="/cgu" className="text-sm text-blue-600 hover:underline">
              Lire aussi nos Conditions Générales d'Utilisation →
            </Link>
          </p>
          <p>
            <Link to="/mentions-legales" className="text-sm text-blue-600 hover:underline">
              Voir les Mentions légales →
            </Link>
          </p>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">© 2026 Nurses Prép — <Link to="/" className="hover:underline">Retour à l'accueil</Link></p>
      </footer>
    </div>
  );
}
