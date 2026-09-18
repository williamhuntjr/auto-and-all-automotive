import { LogOutIcon } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="nav">
      <div className="brand">
        <span>AUTO AND ALL AUTOMOTIVE</span>
        <small>CONTENT CONTROL</small>
      </div>
      <div className="adminUser">
        <form action="/api/admin/logout" method="post">
          <button className="signOut" type="submit">
            <LogOutIcon size={16} aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
