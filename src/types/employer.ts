export interface JobPosting {
  title: string;
  tags: string[];
}

export interface Employer {
  id: string;
  name: string;
  industry: string;
  address: string;
  lat: number;
  lng: number;
  careerUrl: string;
  jobPostings: JobPosting[];
}

export type Industry =
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Manufacturing"
  | "Retail"
  | "Education"
  | "Government"
  | "Professional Services";
