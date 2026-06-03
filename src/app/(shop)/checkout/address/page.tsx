
import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getUserAddress } from '@/actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AddressPage() {

  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?redirectTo=/checkout/address');
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined;

  return (
    <div className="flex flex-col items-center mb-20 px-4 sm:px-0 py-6">
      <div className="w-full xl:w-[800px]">
        <Title title="Dirección" subtitle="Dirección de entrega" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm">
          <AddressForm userStoreAddress={userAddress} />
        </div>
      </div>
    </div>
  );
}
