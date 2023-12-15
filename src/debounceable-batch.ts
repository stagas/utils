// credits: chatgpt
export class DebounceableBatch {
  // private debouncePeriod: number
  private isRunning: boolean
  private timeoutId: any
  // private tasks: (() => void)[]
  private currentTaskIndex: number

  constructor(
    private ms: number = 1000,
    private tasks: (() => void)[]
  ) {
    // this.debouncePeriod = ms
    this.isRunning = false
    this.timeoutId = null
    // this.tasks = tasks
    this.currentTaskIndex = 0
  }

  start() {
    if (this.currentTaskIndex >= this.tasks.length) return

    if (!this.isRunning) {
      this.isRunning = true
      this.startAfterDelay()
    }
  }

  interrupt() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.isRunning = false
    this.currentTaskIndex = 0 // Reset the task index if interrupted
  }

  private startAfterDelay() {
    this.timeoutId = setTimeout(() => {
      if (this.isRunning) {
        this.executeTasks()
      }
    }, this.ms)
  }

  private executeTasks() {
    if (this.currentTaskIndex < this.tasks.length) {
      requestAnimationFrame(() => {
        this.tasks[this.currentTaskIndex]()
        this.currentTaskIndex++
        this.executeTasks()
      })
    } else {
      // All tasks are done, reset state
      this.isRunning = false
      this.currentTaskIndex = 0
    }
  }
}
