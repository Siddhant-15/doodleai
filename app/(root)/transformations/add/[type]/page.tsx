import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Define the SearchParamProps type to treat params as a Promise
type SearchParamProps = {
  params: Promise<{ type: keyof typeof transformationTypes }>;  // Ensure type is a valid key of transformationTypes
};

const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  const resolvedParams = await params;  // Await the params

  const { type } = resolvedParams;  // Extract type from resolved params
  const { userId } = await auth();
  
  // Ensure the user is signed in
  if (!userId) redirect('/sign-in');

  // TypeScript now knows that `type` is a valid key of `transformationTypes`
  const transformation = transformationTypes[type];
  const user = await getUserById(userId);

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
