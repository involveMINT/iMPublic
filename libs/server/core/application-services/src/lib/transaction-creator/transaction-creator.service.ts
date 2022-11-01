/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { runOnTransactionCommit, Transactional } from 'typeorm-transactional-cls-hooked';

export class DbTransactionCreator {
  async run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise(async (res: any, rej) => {
      try {
        return await this.transact(task, res);
      } catch (e) {
        rej(e);
      }
    });
  }

  @Transactional()
  private async transact<T>(task: () => Promise<T>, res: () => void): Promise<void> {
    await task();
    runOnTransactionCommit(res);
  }
}
