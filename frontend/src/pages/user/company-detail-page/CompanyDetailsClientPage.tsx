import LoadingSpinner from "@/components/custom/LoadingSpinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { getCompanyById } from "@/services/companyApi";
import { findJobsByCompanyId } from "@/services/jobApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import type { JobResponseDto } from "@/types/job.type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CompanySection from "../../commons/company-details-components/CompanySection";
import JobsSection from "../../commons/company-details-components/JobsSection";
import CompanyHeader from "../../commons/company-details-components/CompanyHeader";

type CompanyDetailsProp = {
  initialCompany?: DefaultCompanyResponseDto;
};

const CompanyDetailsClientPage = ({ initialCompany }: CompanyDetailsProp) => {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<DefaultCompanyResponseDto | undefined>(
    initialCompany,
  );
  const [jobs, setJobs] = useState<JobResponseDto[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/companies");
      return;
    }

    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        const companyRes = await getCompanyById(id);
        const jobRes = await findJobsByCompanyId(id);

        const companyData = companyRes.data.result || companyRes.data.result || companyRes.data as any;
        const jobData = jobRes.data.result || jobRes.data.result || jobRes.data as any;

        setCompany(companyData);
        setJobs(jobData || []);
      } catch (err) {
        toast.error(getErrorMessage(err, "Không thể lấy thông tin công ty"));
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialCompany) fetchCompany();
  }, [id, navigate, initialCompany]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div
        className={`mx-auto px-4 max-w-7xl ${jobs && jobs.length > 0 ? "w-full lg:w-4/5" : "w-full lg:w-3/5"}`}
      >
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/companies")}
                className="cursor-pointer hover:text-green-600 font-medium"
              >
                Danh sách công ty
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-gray-900">Công ty {company.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <CompanyHeader company={company} />

        <div className={`grid grid-cols-1 gap-12 ${jobs && jobs.length > 0 ? 'md:grid-cols-3' : ''}`}>
          <CompanySection company={company} jobsCount={jobs.length} />

          <JobsSection jobs={jobs} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsClientPage;
