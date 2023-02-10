const initialState = {
  user: {},
  token: '',
  loggedIn: false,
  listenerUserOnline: false,
  onBoarding: false,
  step: null,
  // para simular que los pasos en link onboarding se hacen position[0] = chat [1] agenda etc..
  stepLinks: [false, false, false, false]
}

export default () => initialState
