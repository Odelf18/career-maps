"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { CompanyCard } from "@/components/CompanyCard";
import { Employer } from "@/types/employer";
import employersData from "@/data/employers.json";

// Dynamic import for Map component (client-side only)
const Map = dynamic(() => import("@/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const employers = employersData as Employer[];

  // Get unique industries
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(employers.map((emp) => emp.industry));
    return Array.from(uniqueIndustries).sort();
  }, [employers]);

  // Filter employers based on search, industry, and tags
  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      // Industry filter
      if (selectedIndustry !== "all" && employer.industry !== selectedIndustry) {
        return false;
      }

      // Tags filter
      if (activeTags.length > 0) {
        const employerTags = employer.jobPostings.flatMap((job) => job.tags);
        const hasAllTags = activeTags.every((tag) =>
          employerTags.some((empTag) => empTag.toLowerCase() === tag.toLowerCase())
        );
        if (!hasAllTags) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = employer.name.toLowerCase().includes(query);
        const matchesIndustry = employer.industry.toLowerCase().includes(query);
        const matchesAddress = employer.address.toLowerCase().includes(query);
        const matchesJobTitle = employer.jobPostings.some((job) =>
          job.title.toLowerCase().includes(query)
        );
        const matchesTags = employer.jobPostings.some((job) =>
          job.tags.some((tag) => tag.toLowerCase().includes(query))
        );

        return (
          matchesName ||
          matchesIndustry ||
          matchesAddress ||
          matchesJobTitle ||
          matchesTags
        );
      }

      return true;
    });
  }, [employers, searchQuery, selectedIndustry, activeTags]);

  // Handle tag click (add to active filters)
  const handleTagClick = useCallback((tag: string) => {
    setActiveTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  // Remove tag from active filters
  const handleRemoveTag = useCallback((tag: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedIndustry("all");
    setActiveTags([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CareerMaps</h1>
              <p className="text-muted-foreground mt-1">
                Discover job opportunities in Richmond, VA
              </p>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search companies, jobs, or tags..."
            />

            <FilterBar
              selectedIndustry={selectedIndustry}
              onIndustryChange={setSelectedIndustry}
              activeTags={activeTags}
              onRemoveTag={handleRemoveTag}
              onClearAll={handleClearAll}
              industries={industries}
            />

            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                {filteredEmployers.length} {filteredEmployers.length === 1 ? "company" : "companies"} found
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)] lg:h-[calc(100vh-240px)]">
          {/* Map */}
          <div className="order-2 lg:order-1 h-[500px] lg:h-full">
            <Map employers={filteredEmployers} />
          </div>

          {/* Company list */}
          <div className="order-1 lg:order-2 overflow-y-auto space-y-4 h-[500px] lg:h-full pr-2">
            {filteredEmployers.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">No companies found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              </div>
            ) : (
              filteredEmployers.map((employer) => (
                <CompanyCard
                  key={employer.id}
                  employer={employer}
                  onTagClick={handleTagClick}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
