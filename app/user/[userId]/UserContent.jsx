/// app\user\[userId]\UserContent.jsx

export default function UserContent({ userData = {}, owner = false }) {
    return (
      <main className="flex-1 p-6">
        <section id="profile" className="section-base mb-8 bg-[var(--background-brushed)] rounded-lg shadow-md">
          <h2 className="section-title">Profile Overview</h2>
          <p className="common-content-timeline">
            Welcome to your profile page. Here you can view and edit your personal information,
            see your posts, and update your settings.
          </p>
        </section>
        <section id="posts" className="section-base mb-8 bg-[var(--background-brushed)] rounded-lg shadow-md">
          <h2 className="section-title">Recent Posts</h2>
          <p className="common-content-timeline">
            Your posts will appear here. Engage with your community and share your ideas.
          </p>
        </section>
        <section id="settings" className="section-base mb-8 bg-[var(--background-brushed)] rounded-lg shadow-md">
          <h2 className="section-title">Account Settings</h2>
          <p className="common-content-timeline">
            Adjust your account preferences, privacy settings, and notification options.
          </p>
        </section>
        <section id="activity" className="section-base bg-[var(--background-brushed)] rounded-lg shadow-md">
          <h2 className="section-title">Recent Activity</h2>
          <p className="common-content-timeline">
            Monitor your recent activity including likes, comments, and follows.
          </p>
        </section>
      </main>
    );
  }
  