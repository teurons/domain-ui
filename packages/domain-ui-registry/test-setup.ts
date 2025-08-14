import '@testing-library/jest-dom'

// Mock React's useId since it might not work properly in test environment
let mockId = 0;
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useId: () => `test-id-${++mockId}`
  }
})