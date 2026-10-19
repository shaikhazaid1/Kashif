export const PASSWORD_MIN_LENGTH = 12

export function getPasswordChecks(password) {
    return [
        {
            id: 'length',
            label: `At least ${PASSWORD_MIN_LENGTH} characters`,
            required: true,
            met: password.length >= PASSWORD_MIN_LENGTH,
        },
        {
            id: 'uppercase',
            label: 'An uppercase letter (A-Z)',
            required: false,
            met: /[A-Z]/.test(password),
        },
        {
            id: 'number',
            label: 'Number',
            required: false,
            met: /[0-9]/.test(password),
        },
        {
            id: 'special',
            label: 'Symbol (!@#…)',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ]
}

export function getPasswordStrength(password) {
    if (!password) return null

    const checks = getPasswordChecks(password)
    const lengthOk = checks[0].met
    const extras = checks.filter((check) => !check.required && check.met).length

    if (!lengthOk) return 'weak'
    if (password.length >= 16 || extras >= 2) return 'strong'
    return 'medium'
}