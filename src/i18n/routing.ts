import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'bs'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/netzwerk':             { de: '/netzwerk',             bs: '/mreza' },
    '/ueber-uns':            { de: '/ueber-uns',            bs: '/o-nama' },
    '/mitmachen':            { de: '/mitmachen',            bs: '/pridruzi-se' },
    '/kontakt':              { de: '/kontakt',              bs: '/kontakt' },
    '/news':                 { de: '/news',                 bs: '/vijesti' },
    '/news/[slug]':          { de: '/news/[slug]',          bs: '/vijesti/[slug]' },
    '/statuten':             { de: '/statuten',             bs: '/statut' },
    '/impressum':            { de: '/impressum',            bs: '/impressum' },
    '/agbs':                 { de: '/agbs',                 bs: '/uvjeti' },
    '/datenschutz':          { de: '/datenschutz',          bs: '/zastita-podataka' },
    '/faq':                  { de: '/faq',                  bs: '/cesto-pitanja' },
    '/newsletter':           { de: '/newsletter',           bs: '/newsletter' },
    '/brands-for-employees': { de: '/brands-for-employees', bs: '/pogodnosti-za-clanove' },
  },
})
