import type { Locale } from "./config";

/**
 * UI-chrome dictionaries (TR primary, EN secondary). Content (posts, products,
 * pages) is localized separately via the content model; this covers navigation,
 * buttons, form labels and section headings so the shell switches TR <-> EN.
 */
export type Dictionary = {
  nav: {
    about: string;
    classes: string;
    blog: string;
    store: string;
    events: string;
    booking: string;
    contact: string;
    account: string;
    cart: string;
  };
  actions: {
    viewBooks: string;
    bookCoaching: string;
    view: string;
    bookSession: string;
    addToCart: string;
    buyNow: string;
    subscribe: string;
    send: string;
    sending: string;
    readMore: string;
    loadMore: string;
    requestBooking: string;
    startCheckout: string;
    preparing: string;
    checkout: string;
    logout: string;
    search: string;
    filter: string;
    all: string;
    grid: string;
    list: string;
  };
  forms: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    quantity: string;
    billingAddress: string;
    date: string;
    contactSuccess: string;
    contactError: string;
    subscribed: string;
    subscribeError: string;
    bookingSuccess: string;
    bookingError: string;
  };
  sections: {
    aboutMe: string;
    store: string;
    coaching: string;
    testimonial: string;
    blog: string;
    events: string;
    classes: string;
    trainers: string;
    membership: string;
    latestWriting: string;
    whatClientsSay: string;
  };
  footer: {
    site: string;
    customer: string;
    privacy: string;
    myAccount: string;
    rights: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    remove: string;
    continue: string;
    proceed: string;
  };
  common: {
    dateByRequest: string;
    price: string;
    free: string;
    location: string;
    trainer: string;
    level: string;
    capacity: string;
    schedule: string;
    sessions: string;
  };
};

const tr: Dictionary = {
  nav: {
    about: "Hakkımda",
    classes: "Eğitimler",
    blog: "Blog",
    store: "Mağaza",
    events: "Etkinlikler",
    booking: "Randevu",
    contact: "İletişim",
    account: "Hesabım",
    cart: "Sepet",
  },
  actions: {
    viewBooks: "Kitapları Gör",
    bookCoaching: "Koçluk Randevusu",
    view: "İncele",
    bookSession: "Randevu Al",
    addToCart: "Sepete Ekle",
    buyNow: "Satın Al",
    subscribe: "Abone Ol",
    send: "Gönder",
    sending: "Gönderiliyor...",
    readMore: "Devamını Oku",
    loadMore: "Devamını Yükle",
    requestBooking: "Randevu Talep Et",
    startCheckout: "PayTR ile Öde",
    preparing: "Hazırlanıyor...",
    checkout: "Ödemeye Geç",
    logout: "Çıkış Yap",
    search: "Ara",
    filter: "Filtrele",
    all: "Tümü",
    grid: "Izgara",
    list: "Liste",
  },
  forms: {
    name: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    subject: "Konu",
    message: "Mesaj",
    quantity: "Adet",
    billingAddress: "Fatura adresi",
    date: "Tarih",
    contactSuccess: "Mesajınız alındı.",
    contactError: "Mesaj gönderilemedi. Sunucu ayarlarını kontrol edin.",
    subscribed: "Abone olundu.",
    subscribeError: "Abone olunamadı.",
    bookingSuccess: "Randevu talebiniz alındı.",
    bookingError: "Randevu oluşturulamadı. Sunucu ayarlarını kontrol edin.",
  },
  sections: {
    aboutMe: "Hakkımda",
    store: "Mağaza",
    coaching: "Koçluk",
    testimonial: "Yorumlar",
    blog: "Blog",
    events: "Etkinlikler",
    classes: "Eğitimler",
    trainers: "Eğitmenler",
    membership: "Üyelik",
    latestWriting: "Son Yazılar",
    whatClientsSay: "Danışanlarım ne diyor",
  },
  footer: {
    site: "Site",
    customer: "Müşteri",
    privacy: "Gizlilik Politikası",
    myAccount: "Hesabım",
    rights: "Tüm hakları saklıdır.",
  },
  cart: {
    title: "Sepetiniz",
    empty: "Sepetiniz boş.",
    total: "Toplam",
    remove: "Kaldır",
    continue: "Alışverişe devam et",
    proceed: "Ödemeye geç",
  },
  common: {
    dateByRequest: "Tarih talep üzerine",
    price: "Fiyat",
    free: "Ücretsiz",
    location: "Konum",
    trainer: "Eğitmen",
    level: "Seviye",
    capacity: "Kontenjan",
    schedule: "Program",
    sessions: "Oturumlar",
  },
};

const en: Dictionary = {
  nav: {
    about: "About Me",
    classes: "Classes",
    blog: "Blog",
    store: "E-Store",
    events: "Events",
    booking: "Booking",
    contact: "Contact",
    account: "Account",
    cart: "Cart",
  },
  actions: {
    viewBooks: "View Books",
    bookCoaching: "Book Coaching",
    view: "View",
    bookSession: "Book a session",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    subscribe: "Subscribe",
    send: "Send",
    sending: "Sending...",
    readMore: "Read More",
    loadMore: "Load More",
    requestBooking: "Request booking",
    startCheckout: "Start PayTR checkout",
    preparing: "Preparing...",
    checkout: "Checkout",
    logout: "Logout",
    search: "Search",
    filter: "Filter",
    all: "All",
    grid: "Grid",
    list: "List",
  },
  forms: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    quantity: "Quantity",
    billingAddress: "Billing address",
    date: "Date",
    contactSuccess: "Your message was received.",
    contactError: "Could not send the message. Check server configuration.",
    subscribed: "Subscribed.",
    subscribeError: "Could not subscribe.",
    bookingSuccess: "Your booking request was received.",
    bookingError: "Could not create booking. Check server configuration.",
  },
  sections: {
    aboutMe: "About Me",
    store: "Store",
    coaching: "Coaching",
    testimonial: "Testimonial",
    blog: "Blog",
    events: "Events",
    classes: "Classes",
    trainers: "Trainers",
    membership: "Membership",
    latestWriting: "Latest writing",
    whatClientsSay: "What my clients say",
  },
  footer: {
    site: "Site",
    customer: "Customer",
    privacy: "Privacy Policy",
    myAccount: "My Account",
    rights: "All rights reserved.",
  },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    total: "Total",
    remove: "Remove",
    continue: "Continue shopping",
    proceed: "Proceed to checkout",
  },
  common: {
    dateByRequest: "Date by request",
    price: "Price",
    free: "Free",
    location: "Location",
    trainer: "Trainer",
    level: "Level",
    capacity: "Capacity",
    schedule: "Schedule",
    sessions: "Sessions",
  },
};

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.tr;
}
