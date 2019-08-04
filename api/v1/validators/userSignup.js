module.exports = {
  firstName: {
    isEmpty: {
      negated: true,
      errorMessage: 'First name is required'
    }
  },
  lastName: {
    isEmpty: {
      negated: true,
      errorMessage: 'Last name is required'
    }
  },
  email: {
    isEmpty: {
      negated: true,
      errorMessage: 'Email is required'
    },
    isEmail: {
      errorMessage: 'Email address is invalid'
    }
  },
  password: {
    isEmpty: {
      negated: true,
      errorMessage: 'Password is required'
    },
    isLength: {
      errorMessage: 'Password must be between 8 and 64 characters long',
      options: { min: 8, max: 64 }
    }
  }
}
