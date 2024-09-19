import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SearchBar({ onSearch, searchQuery }) {
  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center space-x-2"
    >
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
