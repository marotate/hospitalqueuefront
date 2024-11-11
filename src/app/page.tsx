// arc/apps/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Hospital Queue Management System</h1>
      <nav>
        <ul>
          <li><Link href="/user/register-queue">Register for Queue</Link></li>
          <li><Link href="/user/check-queue">Check Queue Status</Link></li>
          <li><Link href="/admin/manage-queue">Admin: Manage Queue</Link></li>
          <li><Link href="/monitor/queue-display">Monitor: Queue Display</Link></li>
        </ul>
      </nav>
    </div>
  );
}
