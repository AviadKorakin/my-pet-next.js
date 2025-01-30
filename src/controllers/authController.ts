import {findOrCreateUser} from "@/services/authService";

export async function handleGitHubLogin(account: any) {
    return await findOrCreateUser(account.providerAccountId);
}
