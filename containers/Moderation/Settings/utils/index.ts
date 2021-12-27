export const reduceCustomBlackList = (str: string): Array<string> => {
  return (
    str
      .trim()
      // eslint-disable-next-line no-control-regex
      .split(new RegExp('[,\r\n]+'))
      .reduce((acc: string[], curr) => {
        const c = curr.trim()
        if (c !== '') {
          acc.push(c)
        }
        return acc
      }, [])
  )
}
