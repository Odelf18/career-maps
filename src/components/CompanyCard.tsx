"use client";

import { Employer } from "@/types/employer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Briefcase } from "lucide-react";

interface CompanyCardProps {
  employer: Employer;
  onTagClick?: (tag: string) => void;
}

export function CompanyCard({ employer, onTagClick }: CompanyCardProps) {
  const getTagColor = (tag: string): string => {
    const lowerTag = tag.toLowerCase();

    // Experience level colors
    if (lowerTag.includes("entry")) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (lowerTag.includes("mid")) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (lowerTag.includes("senior")) return "bg-purple-100 text-purple-800 hover:bg-purple-200";

    // Work mode colors
    if (lowerTag === "remote") return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200";
    if (lowerTag === "hybrid") return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    if (lowerTag === "on-site") return "bg-orange-100 text-orange-800 hover:bg-orange-200";

    // Default
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{employer.name}</CardTitle>
            <Badge variant="outline" className="mt-2">
              {employer.industry}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{employer.address}</span>
        </div>

        {employer.jobPostings && employer.jobPostings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4" />
              <span>Open Positions ({employer.jobPostings.length})</span>
            </div>

            <div className="space-y-3">
              {employer.jobPostings.map((job, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium">{job.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className={`text-xs cursor-pointer transition-colors ${getTagColor(tag)}`}
                        onClick={() => onTagClick?.(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full"
          asChild
        >
          <a
            href={employer.careerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Visit Career Page
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
