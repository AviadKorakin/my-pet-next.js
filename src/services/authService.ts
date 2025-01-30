import User from "@/models/User";
import {connectToDatabase} from "@/lib/mongoose";

export async function findOrCreateUser(github_id: string) {
    await connectToDatabase();

    let user = await User.findOne({ github_id });

    if (!user) {
        user = new User({ github_id, verified: false });
        await user.save();
    }

    return user;
}
