interface User {
    _id?: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
}

interface UserTypeRedux {
    totalCredits: number;
    userData: null | User,
    userCredit: number,

}

export type { User, UserTypeRedux }