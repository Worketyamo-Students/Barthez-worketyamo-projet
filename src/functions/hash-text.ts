import bcrypt from 'bcrypt'

const hashText = (plainText: any) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(plainText, salt);

    return passwordHash;
}

export default hashText;