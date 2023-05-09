export const extractDocumentation = (doc) => {
  return doc.split('@').reduce((acc, cur) => {
    const val = cur.split(' ').slice(1).join(' ')
    ;[
      { type: 'description', typeSN: 'desc' },
      { type: 'displayName', typeSN: 'dn' },
      { type: 'purpose', typeSN: 'p' },
    ].forEach(({ type, typeSN }) => {
      if (cur.startsWith(typeSN)) acc[type] = val.trim()
    })
    return acc
  }, {})
}

export const extractFields = async (fields, relations, modelName, docsJson) => {
  const fieldsData = await fields.reduce((acc, field) => {
    if (field.relationName) {
      if (!relations[field.relationName]) relations[field.relationName] = []
      relations[field.relationName].push({ ...field, modelName })
      relations[field.relationName] = relations[field.relationName].map(
        (obj) => {
          const { relationToFields, relationFromFields } =
            relations[field.relationName].find(
              (o) => o.relationName === obj.relationName,
            ) || {}
          if (relationFromFields?.length)
            obj.relationFromFields = relationFromFields
          if (relationToFields?.length) obj.relationToFields = relationToFields
          return obj
        },
      )
    } else {
      field.doc_url = docsJson[`${modelName}_${field.name}`]
      if (!field.documentation) acc.push(field)
      else {
        const customFieldOptions = extractDocumentation(field.documentation)
        acc.push({ ...field, ...customFieldOptions })
      }
    }

    return acc
  }, [])

  return { fields: fieldsData, relations }
}

export const extractModelDocumentation = (doc) => {
  return doc.split('@').reduce((acc, cur) => {
    const val = cur.split(' ').slice(1).join(' ')
    ;[
      { type: 'description', typeSN: 'desc' },
      { type: 'type', typeSN: 'type' },
      { type: 'version', typeSN: 'v' },
    ].forEach(({ type, typeSN }) => {
      if (cur.startsWith(typeSN)) acc[type] = val.trim()
    })
    return acc
  }, {})
}
