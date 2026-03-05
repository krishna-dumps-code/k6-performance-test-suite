import { SharedArray } from "k6/data"

export function loadObjects(path: string) {

  return new SharedArray("objects", () => {

    const file = open(path)
    const lines = file.split("\n")

    const rows = []

    for (let i = 1; i < lines.length; i++) {

      if (!lines[i]) continue

      const [name, year, price] = lines[i].split(",")

      rows.push({
        name,
        year: Number(year),
        price: Number(price)
      })
    }

    return rows
  })
}
