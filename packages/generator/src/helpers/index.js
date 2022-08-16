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

export const extractFields = (fields) => {
  return fields.map((field) => {
    if (!field.documentation) return field

    const customFieldOptions = extractDocumentation(field.documentation)
    return { ...field, ...customFieldOptions }
  })
}
