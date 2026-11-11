export const CONTACT_PHONE_DISPLAY = '+52 999 187 2848'
export const CONTACT_PHONE_E164 = '+529991872848'
export const CONTACT_WA_TEXT =
  'Hola — me interesa un agente de IA en WhatsApp para mi negocio.'
export const CONTACT_WA_URL = `https://wa.me/${CONTACT_PHONE_E164.replace('+', '')}?text=${encodeURIComponent(CONTACT_WA_TEXT)}`
export const CONTACT_TEL_URL = `tel:${CONTACT_PHONE_E164}`

/** Shared props so WhatsApp always opens in a new tab. */
export const CONTACT_WA_LINK_PROPS = {
  href: CONTACT_WA_URL,
  target: '_blank',
  rel: 'noopener noreferrer',
}
