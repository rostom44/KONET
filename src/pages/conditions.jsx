function Conditions() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      <h1>Conditions Générales d'Utilisation</h1>

      <p>
        <strong>Dernière mise à jour :</strong> {new Date().getFullYear()}
      </p>

      <h2>1. Présentation du site</h2>
      <p>
        Le site KONET a pour objectif de présenter les services de nettoyage
        proposés par notre entreprise. Ce site est fourni uniquement à des fins
        de démonstration et ne permet ni réservation, ni paiement en ligne.
      </p>

      <h2>2. Données personnelles</h2>
      <p>
        Aucune donnée personnelle n’est collectée ni stockée sur nos serveurs.
        Le site peut utiliser un script local (LocationChecker) pour vérifier la
        position géographique de l'utilisateur. Cette information reste
        uniquement sur l’appareil de l’utilisateur et n’est ni stockée, ni
        transmise.
      </p>

      <h2>3. Services présentés</h2>
      <p>
        Les services décrits sur le site (entretien, lavage, déménagement, etc.)
        sont indicatifs et peuvent être modifiés ou adaptés selon les besoins
        spécifiques du client. Aucun prix n’est affiché sur le site, et toute
        demande se fait exclusivement via téléphone ou email.
      </p>

      <h2>4. Limitations</h2>
      <p>
        Le site ne garantit pas l’exactitude ou la mise à jour en temps réel des
        informations présentées. KONET ne saurait être tenue responsable en cas
        de mauvaise interprétation des informations fournies.
      </p>

      <h2>5. Contact</h2>
      <p>
        Pour toute question ou demande, veuillez nous contacter par email ou par
        téléphone aux coordonnées fournies sur la page de contact.
      </p>

      <h2>6. Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par le droit français. Tout litige
        relatif à leur interprétation ou à leur exécution relève de la
        compétence des tribunaux français.
      </p>
    </div>
  );
}

export default Conditions;
