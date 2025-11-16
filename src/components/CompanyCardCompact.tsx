"use client";

import { Employer } from "@/types/employer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";

interface CompanyCardCompactProps {
  employer: Employer;
}

export function CompanyCardCompact({ employer }: CompanyCardCompactProps) {
  return (
    <div className="space-y-2 max-w-[280px]">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-sm leading-tight">{employer.name}</h3>
        <Badge variant="outline" className="mt-1 text-xs">
          {employer.industry}
        </Badge>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">{employer.address}</span>
      </div>

      {/* Job postings - show only first 2 on mobile */}
      {employer.jobPostings && employer.jobPostings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {employer.jobPostings.length} open position{employer.jobPostings.length > 1 ? 's' : ''}
          </p>

          <div className="space-y-1.5">
            {employer.jobPostings.slice(0, 2).map((job, index) => (
              <div key={index}>
                <p className="text-xs font-medium line-clamp-1">{job.title}</p>
              </div>
            ))}
            {employer.jobPostings.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{employer.jobPostings.length - 2} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button
        size="sm"
        className="w-full h-8 text-xs"
        asChild
      >
        <a
          href={employer.careerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5"
        >
          View Jobs
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  );
}
