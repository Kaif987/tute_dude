import NotificationsDropdown from "@/components/custom/NotificationButton";
import ProfileDropdown from "@/components/custom/ProfileDropDown";
import SearchBar from "@/components/custom/SearchBar";

export default function Navbar({ onSearch, searchQuery }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">Social Media</h3>
      <nav>
        <SearchBar onSearch={onSearch} searchQuery={searchQuery} />
      </nav>
      <div className="flex items-center gap-5">
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </div>
  );
}
