import { contactWaLinkProps } from '../contact.js'

/**
 * Niche LP copy. Main `/` stays dual-sector; these pages own one buyer.
 * Voice matches Home: short, concrete, ops-first — no generic AI fluff.
 */
export const LP_VARIANTS = {
  inmobiliarias: {
    id: 'inmobiliarias',
    niche: 'realty',
    path: '/inmobiliarias',
    seo: {
      title: 'Agente de IA en WhatsApp para inmobiliarias | Llisar',
      description:
        'Agente de IA en WhatsApp para inmobiliarias: responde leads de portales y ads, califica presupuesto y zona, y deja la visita en el calendario — también de noche.',
      keywords: [
        'agente IA WhatsApp inmobiliaria',
        'automatizar leads inmobiliarios WhatsApp',
        'calificar leads inmobiliaria',
        'agendar visitas WhatsApp',
        'chatbot inmobiliario México',
      ],
    },
    hero: {
      photo: '/photos/apartment.jpg',
      photoPosition: '50% 40%',
      lines: ['Del portal a la visita.', 'WhatsApp que califica y agenda.'],
      lead:
        'Agentes de IA en WhatsApp para inmobiliarias. Contestan leads de portales y ads, filtran presupuesto y zona, y dejan la visita lista para tu asesor.',
      cta: 'Hablar con Llisar',
      demoLabel: 'Ver el ejemplo',
    },
    waText:
      'Hola — me interesa un agente de IA en WhatsApp para mi inmobiliaria.',
    flow: {
      title: 'Del mensaje a la visita y a Excel.',
      lead:
        'Si el chat confirma, el evento y la fila salen solos. Tu equipo abre el calendario o la hoja que ya usa.',
      capsLabel: 'En el mismo hilo, el agente también',
      caps: [
        {
          strong: 'Califica',
          span: 'presupuesto, zona, plazo e intención antes de ocupar a un asesor.',
        },
        {
          strong: 'Atiende de noche',
          span: 'cuando Inmuebles24 y Meta ads siguen mandando leads.',
        },
        {
          strong: 'Agenda',
          span: 'la visita con nombre, propiedad y recordatorio.',
        },
        {
          strong: 'Registra',
          span: 'la fila en Excel o CRM, sin copiar del chat a mano.',
        },
      ],
    },
    focus: {
      title: 'Para inmobiliarias que viven de WhatsApp',
      lead: 'El lead escribe a varias agencias a la vez. Gana quien responde primero — y bien.',
      photo: '/photos/apartment.jpg',
      photoAlt: 'Fachada residencial: el tipo de inventario que genera leads por WhatsApp',
      photoPosition: '50% 40%',
      points: [
        {
          index: '01',
          title: 'Primera respuesta en minutos, no en horas',
          body: 'Portales y ads no esperan horario de oficina. El agente contesta al instante, pide lo esencial y mantiene el hilo vivo hasta que tu asesor retoma.',
        },
        {
          index: '02',
          title: 'Visitas solo con leads que sí calzan',
          body: 'Presupuesto, zona, renta o compra, plazo y disponibilidad. El asesor llega con contexto, no a descubrir si el lead solo “estaba viendo”.',
        },
        {
          index: '03',
          title: 'De noche y fines de semana sin perder el pipeline',
          body: 'El 40% de las conversiones inmobiliarias en México arranca fuera de horario. El agente no deja esos chats a medias hasta el lunes.',
        },
      ],
    },
    method: {
      title: 'De tu WhatsApp inmobiliario a un agente en marcha.',
      lead:
        'Empezamos por cómo atiendes leads hoy. Luego el guion, la conexión a agenda/CRM y pruebas con mensajes reales de portales.',
      steps: [
        'Mapa del proceso: qué preguntas, qué cierras, cuándo pasas al asesor.',
        'Guion y tono con la voz de tu marca, no de un bot genérico.',
        'Conexión a calendario, Excel o CRM que ya usas.',
        'Pruebas con leads reales y entrega con tu equipo.',
      ],
    },
    contact: {
      title: '¿Cuántos leads se te enfrían hoy en WhatsApp?',
      lead: 'Inmobiliaria. Una llamada corta para ver si encaja.',
    },
  },
  turismo: {
    id: 'turismo',
    niche: 'tourism',
    path: '/turismo',
    seo: {
      title: 'Agente de IA en WhatsApp para turismo y hoteles | Llisar',
      description:
        'Agente de IA en WhatsApp para hoteles, rentas vacacionales y tours: confirma fechas, manda el pago, gestiona cambios y anota la reserva — también fuera de horario.',
      keywords: [
        'agente IA WhatsApp turismo',
        'WhatsApp hotel automatización',
        'reservas WhatsApp',
        'chatbot turismo México',
        'atención huéspedes WhatsApp',
      ],
    },
    hero: {
      photo: '/photos/hotel.jpg',
      photoPosition: '50% 45%',
      lines: ['Del chat a la reserva.', 'Antes de que se vayan a Booking.'],
      lead:
        'Agentes de IA en WhatsApp para hoteles, rentas y tours. Confirman fechas, mandan el pago y anotan la reserva a cualquier hora.',
      cta: 'Hablar con Llisar',
      demoLabel: 'Ver el ejemplo',
    },
    waText:
      'Hola — me interesa un agente de IA en WhatsApp para mi operación de turismo.',
    flow: {
      title: 'Del mensaje a la reserva y a Excel.',
      lead:
        'Si el chat confirma, el check-in y la fila salen solos. Tu equipo abre el calendario o la hoja que ya usa.',
      capsLabel: 'En el mismo hilo, el agente también',
      caps: [
        {
          strong: 'Califica',
          span: 'fechas, huéspedes y tipo de estancia antes de ocupar recepción.',
        },
        {
          strong: 'Atiende de noche',
          span: 'viajeros en otra zona horaria y picos de puente.',
        },
        {
          strong: 'Agenda',
          span: 'check-in, tour o cambio de fechas con confirmación.',
        },
        {
          strong: 'Registra',
          span: 'la reserva en Excel, PMS o CRM, sin copiar a mano.',
        },
      ],
    },
    focus: {
      title: 'Para operaciones que compiten con OTAs',
      lead: 'El huésped escribe a las 23:00. Si nadie contesta, cierra en Booking — con comisión.',
      photo: '/photos/hotel.jpg',
      photoAlt: 'Lobby de hotel: el tipo de operación que vive en WhatsApp fuera de horario',
      photoPosition: '50% 45%',
      points: [
        {
          index: '01',
          title: 'Reserva directa sin perder el hilo',
          body: 'Disponibilidad, precio, qué incluye y link de pago en el mismo chat. El huésped no tiene que esperar a recepción para decidir.',
        },
        {
          index: '02',
          title: 'Cambios de fecha y FAQs sin saturar al equipo',
          body: 'Políticas, late check-out, mascotas, estacionamiento, tours. Lo repetitivo lo resuelve el agente; lo excepcional pasa a humano con contexto.',
        },
        {
          index: '03',
          title: 'Cobertura cuando el lobby está cerrado',
          body: 'Zonas horarias distintas, viernes de puente y madrugadas. El agente mantiene la conversación viva hasta confirmar o pasar a tu equipo.',
        },
      ],
    },
    method: {
      title: 'De tu WhatsApp de turismo a un agente en marcha.',
      lead:
        'Empezamos por cómo atiendes reservas y huéspedes hoy. Luego el guion, la conexión y pruebas con mensajes reales.',
      steps: [
        'Mapa del proceso: qué preguntas, qué cierras, cuándo pasas a humano.',
        'Guion y tono con la voz de tu marca, no de un bot genérico.',
        'Conexión a calendario, Excel, PMS o CRM que ya usas.',
        'Pruebas con consultas reales y entrega con tu equipo.',
      ],
    },
    contact: {
      title: '¿Cuántas reservas se te escapan hoy en WhatsApp?',
      lead: 'Turismo. Una llamada corta para ver si encaja.',
    },
  },
}

export function getLpVariant(id) {
  return LP_VARIANTS[id] || null
}

export function nicheWaLinkProps(variant) {
  return contactWaLinkProps(variant.waText)
}
