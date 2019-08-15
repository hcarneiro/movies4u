const routesToCheckAuth = [
  'signup',
  'verify-token',
  'reset-password-token',
  'forgot-password'
]

export default function ({ store, route, redirect }) {
  if (routesToCheckAuth.includes(route.name) && store.state.auth.verified) {
    return redirect('301', '/')
  }
}
