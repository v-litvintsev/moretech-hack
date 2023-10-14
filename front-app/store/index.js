export const state = () => ({
  userType: null,
  name: null,
})
export const mutations = {
  userType(state, value) {
    state.userType = value
  },
  name(state, value) {
    state.name = value
  },
}
