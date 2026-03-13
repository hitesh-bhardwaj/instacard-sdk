export default {
  profile: {
    settings: "Settings",
    profileSettings: "Profile Settings",
    languages: "Languages",
    darkMode: "Dark Mode",
    helpSupport: "Help & Support",
    signOut: "Sign Out",
    version: "Version 1.0.0",
  },
  themeOverlay: {
    switchedToDark: "Switched to dark mode",
    switchedToLight: "Switched to light mode",
  },
  cards: {
    header: {
      walletSubtitle: "Digital Instacard Wallet",
      manage: "Manage Card",
      helpSupport: "Help & Support",
    },
    emptyState: "No card available",
    alerts: {
      addedTitle: "Card Added!",
      addedMessage:
        "Your new {{cardType}} card ending in {{lastFourDigits}} has been added.",
      errorTitle: "Error",
      ok: "OK",
    },
    greeting: {
      hello: "Hello, {{name}}",
      searchLabel: "Search",
      helpLabel: "Help",
    },
    filters: {
      title: "Filters",
      all: "All Cards",
      debit: "Debit",
      credit: "Credit",
      prepaid: "Pre-Paid",
      gift: "Gift",
      recentlyUsed: "Recently Used",
      recentlyUsedActive: "Recently Used (active)",
      dropdownHint: "Opens card type filter dropdown",
    },
    sortDropdown: {
      title: "Sort by",
      recent: "Recently Used",
      mostUsed: "Most Used",
      close: "Close sort options",
    },
    swipe: {
      tap: "Tap",
      toViewDetails: "to view details",
      toViewDetailsAnd: "for details &",
      swipeLeft: "← Swipe Left",
      toSeeNext: "to see cards",
      swipeRight: "Swipe Right →",
      toSeePrevious: "to see previous cards",
    },
    filterDropdown: {
      title: "Filters",
      all: "All Cards",
      debit: "Debit Card",
      credit: "Credit Card",
      prepaid: "Pre-Paid Card",
      gift: "Gift Card",
      close: "Close filters",
    },
    modes: {
      virtual: "Virtual",
      universal: "Universal",
    },
    helpTopics: "Help Topics",
    bottomBar: {
      addInstacard: "Add Instacard",
      addGiftCard: "Add Gift Card",
    },
    scan: {
      header: "Scan QR Code",
      loadingCamera: "Loading camera...",
      permissionTitle: "Camera Access Required",
      permissionMessage: "We need your permission to scan QR codes",
      grantPermission: "Grant Permission",
      goBack: "Go Back",
      instruction: "Align the QR code within the frame to scan",
      gallery: "Gallery",
      flashOn: "Flash On",
      flashOff: "Flash Off",
      amountSuffix: "",
    },
    pin: {
      headerTitle: "Verify Payment",
      title: "Enter PIN for Selected Instacard",
      enterPin: "Enter your 4-digit PIN",
      errorIncorrectPin: "Incorrect PIN. Please try again.",
    },
    success: {
      title: "Payment Successful!",
      subtitle: "Your transaction has been completed",
      amountLabel: "Amount Paid",
      paidTo: "Paid To",
      upiId: "UPI ID",
      transactionId: "Transaction ID",
      dateTime: "Date & Time",
      shareReceipt: "Share Receipt",
      shareDialogTitle: "Share Payment Receipt",
      done: "Done",
    },
    bankDrawer: {
      debit: "Debit cards",
      credit: "Credit cards",
      prepaid: "Prepaid cards",
      gift: "Gift cards",
    },
    message: {
      addMessage: "Add Message",
      label: "Message",
      placeholder: "Enter message (optional)",
      suggestions: {
        dinner: "Dinner 🍽️",
        rent: "Rent",
        thanks: "Thanks",
        gift: "Gift 🎁",
        coffee: "Coffee ☕",
        groceries: "Groceries 🛒",
        utilities: "Utilities",
        birthday: "Birthday 🎂",
      },
    },
    help: {
      faq: {
        "1": {
          question: "How do I add a new card?",
          answer:
            'To add a new card, tap the "+" button on the cards screen. You can then choose to add a virtual or physical card by following the on-screen instructions.',
        },
        "2": {
          question: "How do I view my card details?",
          answer:
            "Tap on any card in your wallet to view its details. You can see the card number, expiry date, and CVV by authenticating with your biometrics or PIN.",
        },
        "3": {
          question: "Is my card information secure?",
          answer:
            "Yes, all your card information is encrypted and stored securely. We use industry-standard encryption and never store your full card details on our servers.",
        },
        "4": {
          question: "How do I make a payment?",
          answer:
            'You can make payments by selecting a card and tapping the "Pay" button. You can also use QR code scanning for quick payments at supported merchants.',
        },
        "5": {
          question: "How do I contact support?",
          answer:
            "You can reach our support team by emailing support@instacard.com or calling our 24/7 helpline at 1-800-INSTACARD.",
        },
      },
    },
  },
};
