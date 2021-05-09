import bcrypt from "bcryptjs";

const hash = (password: string) => bcrypt.hash(password, 8)
const compare = (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword)

export default {
    hash,
    compare
}