export default {
  profile: {
    settings: "Paramètres",
    profileSettings: "Paramètres du profil",
    languages: "Langues",
    darkMode: "Mode sombre",
    helpSupport: "Aide et assistance",
    signOut: "Déconnexion",
    version: "Version 1.0.0",
  },
  themeOverlay: {
    switchedToDark: "Passage en mode sombre",
    switchedToLight: "Passage en mode clair",
  },
  cards: {
    header: {
      walletSubtitle: "Portefeuille Instacard numérique",
      manage: "Gérer la carte",
      helpSupport: "Aide et assistance",
    },
    emptyState: "Aucune carte disponible",
    alerts: {
      addedTitle: "Carte ajoutée !",
      addedMessage:
        "Votre nouvelle carte {{cardType}} se terminant par {{lastFourDigits}} a été ajoutée.",
      errorTitle: "Erreur",
      ok: "OK",
    },
    greeting: {
      hello: "Bonjour, {{name}}",
      searchLabel: "Rechercher",
      helpLabel: "Aide",
    },
    filters: {
      title: "Filtres",
      all: "Toutes les cartes",
      debit: "Débit",
      credit: "Crédit",
      prepaid: "Prépayée",
      gift: "Cadeau",
      recentlyUsed: "Récemment utilisées",
      recentlyUsedActive: "Récemment utilisées (actif)",
      dropdownHint: "Ouvre le menu de filtrage des cartes",
    },
    swipe: {
      tap: "Touchez",
      toViewDetails: "pour afficher les détails de la carte",
      toViewDetailsAnd: "pour voir les détails et",
      swipeLeft: "balayez vers la gauche",
      toSeeNext: "pour voir les cartes suivantes",
      swipeRight: "Balayez vers la droite",
      toSeePrevious: "pour voir les cartes précédentes",
    },
    filterDropdown: {
      title: "Filtres",
      all: "Toutes les cartes",
      debit: "Carte de débit",
      credit: "Carte de crédit",
      prepaid: "Carte prépayée",
      gift: "Carte cadeau",
      close: "Fermer les filtres",
    },
    modes: {
      virtual: "Virtuelle",
      universal: "Universelle",
    },
    helpTopics: "Sujets d'aide",
    bottomBar: {
      addInstacard: "Ajouter une Instacard",
      addGiftCard: "Ajouter une carte cadeau",
    },
    scan: {
      header: "Scanner le code QR",
      loadingCamera: "Chargement de la caméra...",
      permissionTitle: "Accès à la caméra requis",
      permissionMessage: "Nous avons besoin de votre autorisation pour scanner des codes QR",
      grantPermission: "Accorder l'autorisation",
      goBack: "Retour",
      instruction: "Alignez le code QR dans le cadre pour le scanner",
      gallery: "Galerie",
      flashOn: "Flash activé",
      flashOff: "Flash désactivé",
      amountSuffix: "",
    },
    pin: {
      headerTitle: "Vérifier le paiement",
      title: "Saisissez le code PIN de l'Instacard sélectionnée",
      enterPin: "Entrez votre code PIN à 4 chiffres",
      errorIncorrectPin: "Code PIN incorrect. Veuillez réessayer.",
    },
    success: {
      title: "Paiement réussi !",
      subtitle: "Votre transaction a été effectuée",
      amountLabel: "Montant payé",
      paidTo: "Payé à",
      upiId: "ID UPI",
      transactionId: "ID de transaction",
      dateTime: "Date et heure",
      shareReceipt: "Partager le reçu",
      shareDialogTitle: "Partager le reçu de paiement",
      done: "Terminé",
    },
    bankDrawer: {
      debit: "Cartes de débit",
      credit: "Cartes de crédit",
      prepaid: "Cartes prépayées",
      gift: "Cartes cadeaux",
    },
    message: {
      addMessage: "Ajouter un message",
      label: "Message",
      placeholder: "Saisissez un message (facultatif)",
      suggestions: {
        dinner: "Dîner 🍽️",
        rent: "Loyer",
        thanks: "Merci",
        gift: "Cadeau 🎁",
        coffee: "Café ☕",
        groceries: "Courses 🛒",
        utilities: "Factures",
        birthday: "Anniversaire 🎂",
      },
    },
    help: {
      faq: {
        "1": {
          question: "Comment ajouter une nouvelle carte ?",
          answer:
            'Pour ajouter une nouvelle carte, touchez le bouton "+" sur l\'écran des cartes. Vous pouvez ensuite choisir d\'ajouter une carte virtuelle ou physique en suivant les instructions à l\'écran.',
        },
        "2": {
          question: "Comment voir les détails de ma carte ?",
          answer:
            "Touchez n'importe quelle carte dans votre portefeuille pour voir ses détails. Vous pouvez voir le numéro de carte, la date d'expiration et le CVV après authentification par biométrie ou code PIN.",
        },
        "3": {
          question: "Mes informations de carte sont-elles sécurisées ?",
          answer:
            "Oui, toutes vos informations de carte sont chiffrées et stockées en toute sécurité. Nous utilisons un chiffrement conforme aux normes de l'industrie et ne stockons jamais l'intégralité de vos données de carte sur nos serveurs.",
        },
        "4": {
          question: "Comment effectuer un paiement ?",
          answer:
            'Vous pouvez effectuer des paiements en sélectionnant une carte puis en touchant le bouton "Payer". Vous pouvez également utiliser le scan de code QR pour des paiements rapides chez les commerçants compatibles.',
        },
        "5": {
          question: "Comment contacter le support ?",
          answer:
            "Vous pouvez contacter notre équipe d'assistance en envoyant un e-mail à support@instacard.com ou en appelant notre ligne d'assistance 24h/24 et 7j/7 au 1-800-INSTACARD.",
        },
      },
    },
  },
};
