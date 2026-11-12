/**
 * Stack tools inmobiliarias / turismo typically already run.
 * Banner = “podemos conectar si hace falta”, not official partnership claims.
 */
export const INTEGRATIONS = {
  shared: [
    { id: 'whatsapp', name: 'WhatsApp', src: '/integrations/whatsapp.svg' },
    { id: 'excel', name: 'Excel', src: '/integrations/excel.svg' },
    { id: 'googlesheets', name: 'Google Sheets', src: '/integrations/googlesheets.svg' },
    { id: 'googlecalendar', name: 'Google Calendar', src: '/integrations/googlecalendar.svg' },
    { id: 'zapier', name: 'Zapier', src: '/integrations/zapier.svg' },
  ],
  realty: [
    { id: 'inmuebles24', name: 'Inmuebles24', src: '/integrations/inmuebles24.svg' },
    { id: 'easybroker', name: 'EasyBroker', src: '/integrations/easybroker.svg' },
    { id: 'lamudi', name: 'Lamudi', src: '/integrations/lamudi.svg' },
    { id: 'vivanuncios', name: 'Vivanuncios', src: '/integrations/vivanuncios.svg' },
    { id: 'meta', name: 'Meta', src: '/integrations/meta.svg' },
    { id: 'hubspot', name: 'HubSpot', src: '/integrations/hubspot.svg' },
    { id: 'salesforce', name: 'Salesforce', src: '/integrations/salesforce.svg' },
    { id: 'calendly', name: 'Calendly', src: '/integrations/calendly.svg' },
  ],
  tourism: [
    { id: 'booking', name: 'Booking.com', src: '/integrations/bookingdotcom.svg' },
    { id: 'airbnb', name: 'Airbnb', src: '/integrations/airbnb.svg' },
    { id: 'expedia', name: 'Expedia', src: '/integrations/expedia.svg' },
    { id: 'despegar', name: 'Despegar', src: '/integrations/despegar.svg' },
    { id: 'tripadvisor', name: 'Tripadvisor', src: '/integrations/tripadvisor.svg' },
    { id: 'cloudbeds', name: 'Cloudbeds', src: '/integrations/cloudbeds.svg' },
    { id: 'stripe', name: 'Stripe', src: '/integrations/stripe.svg' },
    { id: 'mercadopago', name: 'Mercado Pago', src: '/integrations/mercadopago.svg' },
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
  // Shared first, then niche — de-dupe by id
  const seen = new Set()
  const items = [...INTEGRATIONS.shared, ...nicheItems].filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
  return { ...COPY[key], items }
}
