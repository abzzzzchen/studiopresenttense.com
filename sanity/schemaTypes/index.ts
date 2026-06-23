import {type SchemaTypeDefinition} from 'sanity'

import {blockContentType} from './blockContentType'
import {homepageType} from './homepageType'
import {serviceType} from './serviceType'
import {projectType} from './projectType'
import {seoSettingsType} from './seoSettingsType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [blockContentType, homepageType, serviceType, projectType, seoSettingsType],
}
