import { body } from 'express-validator'
export const registerRules = [
body('email').isEmail(),
body('password').isStrongPassword({ minLength: 8 }),
body('display_name').isLength({ min: 2 })
]