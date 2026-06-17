import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'studio',
      title: 'Studio',
      type: 'blockContent',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'inPractice',
      title: 'In Practice',
      type: 'blockContent',
    }),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'blockContent',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
  ],
  // Singleton — there is only ever one Homepage document.
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})
