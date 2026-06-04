import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <main className="flex-grow py-20 px-6">
        <div className="max-w-[800px] mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-slate-900">Privacy Statement</h1>
          <div className="space-y-6 text-slate-600 leading-loose">
            <p>
              The names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.
            </p>
            <p>
                Eye-Innovations Scientific Research (EISR) is committed to protecting the privacy of our users. This privacy statement outlines how we handle personal data collected through our publishing portal.
            </p>
            <h2 className="text-xl font-bold text-slate-900 pt-4">Data Collection</h2>
            <p>
                We collect information such as name, affiliation, and contact details during registration to facilitate the peer-review and publication process.
            </p>
            <h2 className="text-xl font-bold text-slate-900 pt-4">Data Use</h2>
            <p>
                Collected data is used solely for editorial communication, author notification, and internal record-keeping related to submissions and publications.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
