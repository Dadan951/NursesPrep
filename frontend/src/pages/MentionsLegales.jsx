import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

/* Bloc "à compléter" — utilisé pour les informations qui dépendent du statut
   juridique (SIRET, adresse) pas encore créé. Bien visible, pour ne jamais
   laisser croire que ces informations sont renseignées. */
function TodoBlock({ fields }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
      {fields.map(([label, value]) => (
        <div key={label} className="flex flex-col sm:flex-row sm:gap-4 py-0.5">
          <span className="font-semibold text-slate-700 sm:w-40 flex-shrink-0">{label}</span>
          <span className="flex-1 text-amber-700 italic">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function MentionsLegales() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold mb-4">
            Document légal
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Mentions légales</h1>
          <p className="text-slate-500 text-sm">
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
            l'économie numérique (LCEN), il est porté à la connaissance des utilisateurs de la plateforme
            Nurses Prép les présentes mentions légales.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          <Section title="1. Éditeur du site">
            <p>
              La plateforme Nurses Prép, accessible à l'adresse <strong>nursesprep.fr</strong>, est éditée par :
            </p>
            <TodoBlock fields={[
              ['Nom / Raison sociale', 'À compléter — immatriculation en cours'],
              ['Statut', 'À compléter'],
              ['SIRET', 'À compléter'],
              ['Adresse', 'À compléter'],
            ]} />
            <p>
              Contact : <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>
            </p>
          </Section>

          <Section title="2. Directeur de la publication">
            <TodoBlock fields={[
              ['Directeur de la publication', 'À compléter'],
            ]} />
          </Section>

          <Section title="3. Hébergement">
            <p>La Plateforme est hébergée par les prestataires suivants :</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                ['Vercel Inc.', 'Hébergement du frontend', 'vercel.com'],
                ['Railway Corporation', 'Hébergement du backend', 'railway.app'],
                ['MongoDB, Inc.', 'Hébergement de la base de données (MongoDB Atlas)', 'mongodb.com'],
              ].map(([name, role, site]) => (
                <div key={name} className="flex flex-col sm:flex-row sm:gap-4 py-1">
                  <span className="font-semibold text-slate-700 sm:w-44 flex-shrink-0">{name}</span>
                  <span className="flex-1">{role}</span>
                  <span className="text-xs text-slate-400 sm:w-32 flex-shrink-0">{site}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="4. Propriété intellectuelle">
            <p>
              L'ensemble des contenus de la Plateforme (textes, fiches, questions, illustrations, code source,
              logo) est la propriété exclusive de Nurses Prép ou de ses partenaires et est protégé par le droit
              d'auteur français et les législations internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ces
              éléments sans autorisation écrite préalable est strictement interdite et pourra faire l'objet
              de poursuites.
            </p>
          </Section>

          <Section title="5. Données personnelles">
            <p>
              Le traitement des données personnelles des utilisateurs de la Plateforme est détaillé dans notre{' '}
              <Link to="/confidentialite" className="text-blue-600 underline">Politique de confidentialité</Link>.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              La Plateforme dépose des cookies techniques nécessaires à son fonctionnement, ainsi que des
              cookies de mesure d'audience et de suivi d'erreurs soumis à votre consentement. Le détail est
              disponible dans notre{' '}
              <Link to="/confidentialite" className="text-blue-600 underline">Politique de confidentialité</Link>.
            </p>
          </Section>

          <Section title="7. Paiements">
            <p>
              Les paiements effectués sur la Plateforme sont traités par <strong>Stripe</strong>, prestataire
              de services de paiement tiers. Nurses Prép ne collecte ni ne stocke aucune donnée bancaire.
            </p>
          </Section>

          <Section title="8. Médiation de la consommation">
            <TodoBlock fields={[
              ['Médiateur de la consommation', 'À compléter avant l\'ouverture des paiements au public'],
            ]} />
            <p>
              Conformément à l'article L616-1 du Code de la consommation, tout consommateur a le droit de
              recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un
              litige, une fois les démarches préalables effectuées directement auprès de Nurses Prép.
            </p>
          </Section>

          <Section title="9. Limitation de responsabilité">
            <p>
              Nurses Prép s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur la
              Plateforme, mais ne peut garantir l'exhaustivité de ces informations. Nurses Prép décline toute
              responsabilité pour les interruptions de service, erreurs ou omissions, et pour tout dommage
              résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations
              mises à disposition sur la Plateforme.
            </p>
          </Section>

          <Section title="10. Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit français. Pour toute question relative à
              ce document : <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>
            </p>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-2">
          <p>
            <Link to="/cgu" className="text-sm text-blue-600 hover:underline">
              Lire nos Conditions Générales d'Utilisation →
            </Link>
          </p>
          <p>
            <Link to="/confidentialite" className="text-sm text-blue-600 hover:underline">
              Lire notre Politique de confidentialité →
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
