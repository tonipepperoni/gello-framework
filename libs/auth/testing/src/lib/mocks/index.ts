/**
 * @gello/auth-testing - Mocks
 *
 * Mock implementations for testing.
 */

export { makeMockTokenStore, MockTokenStoreLive } from "./MockTokenStore.js"

export {
  makeMockPasswordHasher,
  MockPasswordHasherLive,
  makeMockTokenHasher,
  MockTokenHasherLive,
} from "./MockPasswordHasher.js"

export {
  makeMockUserProvider,
  MockUserProviderLive,
  createMockUser,
  type MockUser,
} from "./MockUserProvider.js"
