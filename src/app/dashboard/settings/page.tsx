import { redirect } from 'next/navigation';

export default function SettingsPage() {
    // Settings are handled within the unified Profile page
    redirect('/dashboard/profile');
}
