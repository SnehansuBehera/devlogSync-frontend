
import axios from "axios";

export const getUser = async (token: string) => {
    const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/getUser`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!userRes) {
        return null;
    }
    return userRes.data.user;

}
