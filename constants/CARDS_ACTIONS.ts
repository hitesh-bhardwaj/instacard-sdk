import DocTextIcon from "@/assets/svg/card-detail.svg";
import HandTapIcon from "@/assets/svg/contactlesspayment.svg";
import GiftIcon from "@/assets/svg/gift-card.svg";
import CreditCardIcon from "@/assets/svg/manage-card.svg";
import GlobeIcon from "@/assets/svg/phone.svg";
import LinkIcon from "@/assets/svg/sigma.svg";
// Dark mode variants (light-on-dark optimized)
import DocTextIconDark from "@/assets/svg/viewdetails.svg";
import HandTapIconDark from "@/assets/svg/contactlessdark.svg";
import CreditCardIconDark from "@/assets/svg/managecarddark.svg";
import GlobeIconDark from "@/assets/svg/makepaymentsdarkl.svg";
import LinkIconDark from "@/assets/svg/linkdark.svg";

export interface ActionItem {
  id: string;
  title: string;
  icon: React.FC<{ width: number; height: number; color: string }>;
  iconDark?: React.FC<{ width: number; height: number; color: string }>;
  faqData: {
    heading: string;
    bulletPoints: string[];
  };
}

export const ACTIONS: ActionItem[] = [

  {
    id: "manage",
    title: "Manage Card",
    icon: CreditCardIcon,
    iconDark: CreditCardIconDark,
    faqData: {
      heading: "Manage Card",
      bulletPoints: [
        "View and update your card settings and preferences.",
        "Set spending limits and transaction controls.",
        "Enable or disable online and international transactions.",
        "Update your PIN or request a new card.",
        "View your card statement and transaction history.",
      ],
    },
  },
  {
    id: "card-details",
    title: "View Card Details",
    icon: DocTextIcon,
    iconDark: DocTextIconDark,
    faqData: {
      heading: "View Card Details",
      bulletPoints: [
        "View your complete card information including card number, expiry date, and CVV.",
        "Copy card details securely for online transactions.",
        "Card details are protected and require authentication to view.",
        "You can view details for any of your linked virtual cards.",
      ],
    },
  },
  {
    id: "make-online-payments",
    title: "Make Online Payment",
    icon: GlobeIcon,
    iconDark: GlobeIconDark,
    faqData: {
      heading: "Make Online Payment",
      bulletPoints: [
        "Use your virtual card for secure online purchases.",
        "Generate a one-time virtual card number for added security.",
        "Set transaction limits for online payments.",
        "Track all your online transactions in real-time.",
      ],
    },
  },
  // {
  //   id: "add-gift",
  //   title: "Add a Gift-card",
  //   icon: GiftIcon,
  //   faqData: {
  //     heading: "Add a Gift-card",
  //     bulletPoints: [
  //       "Add gift cards from various retailers to your wallet.",
  //       "Manage all your gift cards in one place.",
  //       "Check gift card balances and transaction history.",
  //       "Use gift cards for in-store and online purchases.",
  //     ],
  //   },
  // },
  {
    id: "contactless-default",
    title: "Make default for Contactless Payments",
    icon: HandTapIcon,
    iconDark: HandTapIconDark,
    faqData: {
      heading: "Make Default for Contactless Payments",
      bulletPoints: [
        "Set this card as your default for tap-to-pay transactions.",
        "Use your phone or smartwatch for contactless payments.",
        "Enjoy faster checkout at supported terminals.",
        "Change your default card anytime from settings.",
      ],
    },
  },
  {
    id: "link-physical",
    title: "Link to Physical Card",
    icon: LinkIcon,
    iconDark: LinkIconDark,
    faqData: {
      heading: "Link to a Physical Universal or Sigma Instacard",
      bulletPoints: [
        "You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.",
        "Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.",
        "Sigma Card is a physical card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.",
        "Universal Card is another physical card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Physical Card.",
        "You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the physical card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the physical Universal / Sigma card.",
      ],
    },
  },
];
