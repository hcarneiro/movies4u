const routesToCheckIfVerified = [
  'signup',
  'verify-token',
  'reset-password-token',
  'forgot-password'
]

const routesToCheckIfNotVerified = [
  'account'
]

export default function ({ store, route, redirect }) {
  const check = routesToCheckIfNotVerified.some((path) => {
    const test = (new RegExp(path, 'gi')).test(route.path)
    return !!test
  })

  if (check && !store.state.auth.verified) {
    return redirect('301', '/')
  }

  if (routesToCheckIfVerified.includes(route.name) && store.state.auth.verified) {
    return redirect('301', '/')
  }
}
