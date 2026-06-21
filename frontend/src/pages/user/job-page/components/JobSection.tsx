import type { JobResponseDto } from "@/types/job.type";
import {
  Building2,
  MapPin,
  CalendarDays,
  DollarSign,
  Users,
  Clock,
  Briefcase,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import RichTextPreview from "@/components/custom/RichText/RichTextPreview.tsx";
import { formatISO, formatSalary } from "@/utils/convertHelper.ts";
import { levelColors, levelLabels } from "@/utils/tagColorMapper.ts";
import { useAppSelector } from "@/features/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

type JobSectionProps = {
  job: JobResponseDto;
};

const JobSection = ({ job }: JobSectionProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {job.name}
            </h1>
            <div className="mb-4 flex items-center gap-4">
              <Badge className={`${levelColors[job.level]}`}>
                {levelLabels[job.level]}
              </Badge>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium ${job.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {job.active ? "Đang tuyển dụng" : "Đã đóng"}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="rounded-lg border bg-gray-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-contain p-1" />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {job.company?.name}
              </h2>
              <div className="mt-2 flex items-center text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                {job.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Địa điểm làm việc</span>
          </div>
          <p className="text-gray-700">{job.location}</p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Mức lương</span>
          </div>
          <p className="font-semibold text-gray-700">
            {formatSalary(job.salary)}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Số lượng tuyển</span>
          </div>
          <p className="text-gray-700">{job.quantity} người</p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Hạn nộp hồ sơ</span>
          </div>
          <p className="font-semibold text-red-600">{formatISO(job.endDate)}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Briefcase className="h-5 w-5 text-green-600" />
          Kỹ năng yêu cầu
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="bg-green-100 text-green-700"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Mô tả công việc
        </h3>
        <RichTextPreview content={job.description} />
      </div>

      {/* Job Dates */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Thông tin thời gian
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-600" />
            <span className="text-gray-600">Ngày đăng:</span>
            <span className="font-medium">{formatISO(job.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-600" />
            <span className="text-gray-600">Hạn nộp:</span>
            <span className="font-medium text-red-600">
              {formatISO(job.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Apply Button at the bottom of content */}
      <div className="mt-8 pt-6 border-t">
        {isAuthenticated ? (
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-xl font-semibold shadow-md transition-all">
            Nộp CV Ứng Tuyển
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")} className="w-full bg-gray-800 hover:bg-gray-900 text-white py-6 text-lg rounded-xl font-semibold shadow-md transition-all">
            Đăng nhập để Nộp CV
          </Button>
        )}
      </div>

      {/* Floating Action Button (Fixed at bottom right) */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        {isAuthenticated ? (
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.2)] font-medium text-lg transition-transform hover:scale-105">
            <Send className="w-5 h-5 mr-2" />
            Nộp CV
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")} className="bg-gray-800 hover:bg-gray-900 text-white rounded-full px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.2)] font-medium text-lg transition-transform hover:scale-105">
            Đăng nhập để ứng tuyển
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobSection;
