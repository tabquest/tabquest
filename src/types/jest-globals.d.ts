import type {
  describe as DescribeFn,
  it as ItFn,
  test as TestFn,
  expect as ExpectFn,
  beforeEach as BeforeEachFn,
  afterEach as AfterEachFn,
  beforeAll as BeforeAllFn,
  afterAll as AfterAllFn,
  jest as JestObj,
} from '@jest/globals';

declare global {
  const describe: DescribeFn;
  const it: ItFn;
  const test: TestFn;
  const expect: ExpectFn;
  const beforeEach: BeforeEachFn;
  const afterEach: AfterEachFn;
  const beforeAll: BeforeAllFn;
  const afterAll: AfterAllFn;
  const jest: JestObj;
}
