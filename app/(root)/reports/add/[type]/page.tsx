import Header from '@/components/shared/Header';
import ReportForm from '@/components/shared/ReportForm';
import { reportTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AddReportTypesPage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const report = reportTypes[type];

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);

  return (
    <>
      <Header 
        title={report.title}
        subtitle={report.subTitle}
      />
    
      <section className="mt-10">
        <ReportForm 
          topic={report.title}
          reportType={report.type}
          language="en"
          action="Add"
          userId={user._id}
          type={report.type as ReportTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddReportTypesPage;