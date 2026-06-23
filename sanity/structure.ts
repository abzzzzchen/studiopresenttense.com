import {RocketIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Homepage is a singleton — always edits the same document.
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .schemaType('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      // SEO & Social is a singleton — site-wide meta tags.
      S.listItem()
        .title('SEO & Social')
        .id('seoSettings')
        .schemaType('seoSettings')
        .child(
          S.document().schemaType('seoSettings').documentId('seoSettings'),
        ),
      S.divider(),
      // Projects, grouped by status: Currently first, a divider, then Previously.
      S.listItem()
        .title('Projects')
        .icon(RocketIcon)
        .schemaType('project')
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('Currently')
                .id('currently')
                .icon(RocketIcon)
                .child(
                  S.documentList()
                    .title('Currently')
                    .schemaType('project')
                    .filter('_type == "project" && status == "currently"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Previously')
                .id('previously')
                .icon(RocketIcon)
                .child(
                  S.documentList()
                    .title('Previously')
                    .schemaType('project')
                    .filter('_type == "project" && status == "previously"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}]),
                ),
            ]),
        ),
      S.documentTypeListItem('service').title('Services'),
    ])
