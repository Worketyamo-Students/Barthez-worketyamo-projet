import { body} from "express-validator";

const verifyUser = () => {
    body('email')
        .trim()
        .isEmail()
        .withMessage("Entrer une addresse valide!")
    ,

    body('password')
        .isStrongPassword()

}

export default verifyUser;