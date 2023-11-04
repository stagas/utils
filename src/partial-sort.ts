export function partialSort<T>(arr: T[], endIndex: number, compareFn: (a: T, b: T) => number): void {
  if (endIndex < 2) return
  if (endIndex > arr.length) endIndex = arr.length

  for (let i = 1; i < endIndex; i++) {
    let j = i

    while (j > 0 && compareFn(arr[j - 1], arr[j]) > 0) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      j--
    }
  }
}

export function test_partialSort() {
  // @env browser
  const comp = (a: number, b: number) => a - b
  describe('partialSort', () => {
    it('works', () => {
      const arr = [3, 5, 2, 4, 1]
      partialSort(arr, 3, comp)
      expect(arr).toEqual([2, 3, 5, 4, 1])
    })
    it('exceed index works', () => {
      const arr = [3, 5, 2, 4, 1]
      partialSort(arr, 6, comp)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })
    it('exact length works', () => {
      const arr = [3, 5, 2, 4, 1]
      partialSort(arr, 5, comp)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })
  })
}

export async function bench_partialSort() {
  const { bench } = await import('./bench.ts')
  const comp = (a: number, b: number) => a - b
  const shuffleSort = (a: any, b: any) => Math.random() - .5
  const arr = [...Array(200).keys()]
  arr.sort(shuffleSort)
  bench('one', 10, 2000000, () => {
    partialSort(arr, 100, comp)
  }, () => {
    arr.sort(shuffleSort)
  })
}
