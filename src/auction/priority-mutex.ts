import { Mutex } from "async-mutex";

type Task<T> = {
    priority: number;
    action: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: any) => void;
}

export class PriorityMutex {
    private queue: Task<any>[] = [];
  private mutex = new Mutex();
  private isProcessing = false;

  async runExclusive<T>(action: () => Promise<T>, priority = 0): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ priority, action, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    // Sort: highest priority first
    this.queue.sort((a, b) => b.priority - a.priority);

    const task = this.queue.shift();
    if (!task) {
      this.isProcessing = false;
      return;
    }

    try {
      await this.mutex.runExclusive(async () => {
        const result = await task.action();
        task.resolve(result);
      });
    } catch (error) {
      task.reject(error);
    } finally {
      this.isProcessing = false;
      setImmediate(() => this.processQueue());
    }
  }
}