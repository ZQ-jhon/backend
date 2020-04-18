import { User } from "../entity/User.entity";
export function buildUser() {
    const user = new User();
    user.firstName = '';
    user.lastName = '';
    user.age = 1;
    return user;
}