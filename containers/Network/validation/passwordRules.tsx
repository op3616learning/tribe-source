export const passwordRules = {
  number: data => /.*[0-9]/.test(data),
  specialChar: data => /.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(data),
  upperAndLowerCase: data => /(?=.*[a-z])(?=.*[A-Z]).*/.test(data),
  minLength: data => data.length > 9,
}

export const ruleErrorCodes = {
  minLength: {
    i18nKey: 'network:auth.errors.password.minLength',
    default: 'Use 10 or more characters.',
  },
  upperAndLowerCase: {
    i18nKey: 'network:auth.errors.password.upperAndLowerCase',
    default: 'Use upper and lower case characters (e.g. Aa)',
  },
  number: {
    i18nKey: 'network:auth.errors.password.number',
    default: 'Use a number (e.g. 1234)',
  },
  specialChar: {
    i18nKey: 'network:auth.errors.password.specialChar',
    default: 'Use a symbol (e.g. !@#$)',
  },
}
