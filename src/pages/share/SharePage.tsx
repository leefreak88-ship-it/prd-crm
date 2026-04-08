import { ShareTable } from '@/components/share/ShareTable';
// import { UploadExample } from '@/components/upload/UploadExample';

export function SharePage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <ShareTable />
      {/* <UploadExample /> */}
    </div>
  );
}
