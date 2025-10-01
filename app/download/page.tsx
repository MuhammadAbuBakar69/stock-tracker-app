import { Button } from '@/components/ui/button';

export default function DownloadPage(){
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-gray-100">Download Signalist</h1>
      <p className="mt-4 text-gray-400">Click the button below to download the project README (packaged info). This endpoint also surfaces a download-friendly URL that search engines can index.</p>
      <div className="mt-6">
        <a href="/api/download">
          <Button className="yellow-btn">Download</Button>
        </a>
      </div>
    </div>
  );
}
