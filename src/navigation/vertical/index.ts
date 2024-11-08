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
    to: { name: 'trainers' },
    icon: { icon: 'tabler:users' },
  },
  {
    title: 'الرعاة',
    to: { name: 'company' },
    icon: { icon: 'tabler:building-community' },
  },
  // { heading: 'الكورسات' },
  // {
  //   title: 'جميع الكورسات',
  //   to: { name: 'sections' },
  //   icon: { icon: 'fluent-mdl2:sections' },
  //   children: [
  //     {
  //       title: 'الكورسات المسجلة',
  //       to: { name: 'recording-course' },
  //     },
  //     {
  //       title: 'الكورسات المجدولة',
  //       to: { name: 'schedul-course' },
  //     },
  //   ]
  // },
  // { heading: 'باقي التفاصيل' },
  {
    title: 'شريط التمرير',
    to: { name: 'slider' },
    icon: { icon: 'tabler:slideshow' },
  },
  {
    title: 'المشاريع',
    to: { name: 'news' },
    icon: { icon: 'tabler:radio' },
  },
  {
    title: 'المقالات',
    to: { name: 'permissions' },
    icon: { icon: 'ic:baseline-location-on' },
  },
  {
    title: 'اتصل بنا',
    to: { name: 'contact-us' },
    icon: { icon: 'ic:baseline-report' },
  },
] as HorizontalNavItems