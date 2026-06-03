import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAddress } from "@/actions";
import { Title } from "@/components";
import { ProfileForm } from "./ui/ProfileForm";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/auth/login?redirectTo=/profile');
    }

    const userAddress = await getUserAddress(session.user.id);

    return (
        <div className="flex flex-col items-center mb-20 px-4 sm:px-0 py-6">
            <div className="w-full xl:w-[800px]">
                <Title title="Mi Perfil" />
                <ProfileForm
                    userId={session.user.id}
                    userName={session.user.name ?? ''}
                    userEmail={session.user.email ?? ''}
                    userRole={session.user.role ?? 'user'}
                    userAddress={userAddress}
                />
            </div>
        </div>
    );
}
