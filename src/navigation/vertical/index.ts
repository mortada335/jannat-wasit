import type { HorizontalNavItems } from '@layouts/types'

export default [
  { heading: 'جميع الاقسام' },
  {
    title: 'الاحصائيات',
    to: { name: 'index' },
    icon: { icon: 'tabler:smart-home' },
  },
  {
    title: 'الخدمات',
    to: {
      name: 'services'
    },
    icon: { icon: 'tabler:users' },
  },
  {
    title: 'الرعاة',
    to: {
      name: 'partnerships'
    },
    icon: { icon: 'tabler:building-community' },
  },

  {
    title: 'شريط التمرير',
    to: { name: 'slider' },
    icon: { icon: 'tabler:slideshow' },
  },
  {
    title: 'المشاريع',
    to: { name: 'projects' },
    icon: { icon: 'tabler:radio' },
  },
  {
    title: 'المقالات',
    to: { name: 'articles' },
    icon: { icon: 'ic:baseline-location-on' },
  },
  {
    title: 'اتصل بنا',
    to: { name: 'contact-us' },
    icon: { icon: 'ic:baseline-report' },
  },
] as HorizontalNavItems