const col = columns => {
  if (columns) {
    return 12 / columns
  } else {
    return 4
  }
}

export default col
