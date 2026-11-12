/**
 * Stack tools inmobiliarias / turismo typically already run.
 * Banner = “podemos conectar si hace falta”, not official partnership claims.
 * `icon: true` → compact Simple Icons glyph beside the name.
 */
export const INTEGRATIONS = {
  shared: [
    { id: 'whatsapp', name: 'WhatsApp', src: '/integrations/whatsapp.svg', icon: true },
    { id: 'excel', name: 'Excel', src: '/integrations/excel.svg', icon: true },
    { id: 'googlesheets', name: 'Google Sheets', src: '/integrations/googlesheets.svg', icon: true },
    { id: 'googlecalendar', name: 'Google Calendar', src: '/integrations/googlecalendar.svg', icon: true },
    { id: 'zapier', name: 'Zapier', src: '/integrations/zapier.svg', icon: true },
  ],
  realty: [
    { id: 'inmuebles24', name: 'Inmuebles24' },
    { id: 'easybroker', name: 'EasyBroker' },
    { id: 'lamudi', name: 'Lamudi' },
    { id: 'vivanuncios', name: 'Vivanuncios' },
    { id: 'meta', name: 'Meta', src: '/integrations/meta.svg', icon: true },
    { id: 'hubspot', name: 'HubSpot', src: '/integrations/hubspot.svg', icon: true },
    { id: 'salesforce', name: 'Salesforce', src: '/integrations/salesforce.svg', icon: true },
    { id: 'calendly', name: 'Calendly', src: '/integrations/calendly.svg', icon: true },
  ],
  tourism: [
    { id: 'booking', name: 'Booking.com', src: '/integrations/bookingdotcom.svg', icon: true },
    { id: 'airbnb', name: 'Airbnb', src: '/integrations/airbnb.svg', icon: true },
    { id: 'expedia', name: 'Expedia', src: '/integrations/expedia.svg', icon: true },
    { id: 'despegar', name: 'Despegar' },
    { id: 'tripadvisor', name: 'Tripadvisor', src: '/integrations/tripadvisor.svg', icon: true },
    { id: 'cloudbeds', name: 'Cloudbeds' },
    { id: 'stripe', name: 'Stripe', src: '/integrations/stripe.svg', icon: true },
    { id: 'mercadopago', name: 'Mercado Pago', src: '/integrations/mercadopago.svg', icon: true },
  ],
}

const COPY = {
  all: {
    title: 'Integraciones',
    lead: 'Si hace falta, conectamos con el calendario, Excel, CRM o PMS que ya usas.',
  },
  realty: {
    title: 'Integraciones',
    lead: 'Portales, CRM y agenda: conectamos con tu stack inmobiliario cuando haga falta.',
  },
  tourism: {
    title: 'Integraciones',
    lead: 'OTAs, PMS y pagos: conectamos con tu operación de turismo cuando haga falta.',
  },
}

export function integrationsFor(niche) {
  const key = niche === 'realty' || niche === 'tourism' ? niche : 'all'
  const nicheItems =
    niche === 'realty'
      ? INTEGRATIONS.realty
      : niche === 'tourism'
        ? INTEGRATIONS.tourism
        : [...INTEGRATIONS.realty.slice(0, 4), ...INTEGRATIONS.tourism.slice(0, 4)]
  const seen = new Set()
  const items = [...INTEGRATIONS.shared, ...nicheItems].filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
  return { ...COPY[key], items }
}
